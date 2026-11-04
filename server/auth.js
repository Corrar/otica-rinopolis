// Senha do proprietário (hash scrypt) e sessão em cookie assinado (HMAC).
import { createHash, createHmac, randomBytes, scrypt as scryptCb, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { getStorage } from './storage.js';

const scrypt = promisify(scryptCb);
export const COOKIE = 'odl_session';
export const COOKIE_HTTPS = '__Host-odl_session'; // com HTTPS: só o próprio domínio consegue gravar
export const DIAS_LEMBRAR = 14;
// Senha de desenvolvimento: só vale com NODE_ENV=development (npm run dev) e sem ADMIN_PASSWORD.
const SENHA_DEV = 'digitallook';

// Produção: Vercel (inclusive previews) ou NODE_ENV=production (npm start). Sem fallback de senha ou chave.
export const emProducao = () => !!process.env.VERCEL || process.env.NODE_ENV === 'production';
const configPendente = (o) => Object.assign(new Error(`Configuração pendente: defina ${o}.`), { status: 503 });

let chaveTemporaria;
function segredo() {
  const s = process.env.SESSION_SECRET || '';
  if (emProducao() && s.length < 32) throw configPendente(s ? 'SESSION_SECRET com pelo menos 32 caracteres' : 'SESSION_SECRET');
  if (s) return createHash('sha256').update('odl-session:' + s).digest();
  // Fora de produção sem SESSION_SECRET: chave aleatória por processo (as sessões caem ao reiniciar).
  if (!chaveTemporaria) {
    chaveTemporaria = randomBytes(32);
    console.warn('[auth] SESSION_SECRET não definido: usando chave temporária (sessões valem só até reiniciar).');
  }
  return chaveTemporaria;
}

function senhaInicial() {
  const s = process.env.ADMIN_PASSWORD || '';
  if (s) {
    if (emProducao() && s.length < 12) throw configPendente('ADMIN_PASSWORD com pelo menos 12 caracteres');
    return s;
  }
  if (!emProducao() && process.env.NODE_ENV === 'development') return SENHA_DEV;
  throw configPendente('ADMIN_PASSWORD');
}

// Senhas que nunca podem virar a senha definitiva.
export function senhaProibida(nova) {
  const n = String(nova || '');
  return n.toLowerCase().includes(SENHA_DEV) || (!!process.env.ADMIN_PASSWORD && n === process.env.ADMIN_PASSWORD);
}

async function hash(senha, salt = randomBytes(16).toString('hex')) {
  const h = await scrypt(senha, salt, 64);
  return { salt, hash: h.toString('hex') };
}

// Registro da senha guardado no armazenamento, com cache de 60 s (cada leitura no Blob é uma operação com cota).
const CACHE_AUTH_MS = 60e3;
let cacheAuth = null;
async function lerAuth(fresco) {
  if (!fresco && cacheAuth && Date.now() - cacheAuth.t < CACHE_AUTH_MS) return cacheAuth.valor;
  const valor = await getStorage().readAuth();
  cacheAuth = { valor, t: Date.now() };
  return valor;
}

// Hash da senha inicial calculado uma vez por processo (salt derivado do segredo da sessão).
let memoInicial = null;
async function registro({ fresco = false } = {}) {
  const a = await lerAuth(fresco);
  if (a && a.hash && a.salt) return { ...a, geracao: a.geracao || 0, inicial: false };
  const senha = senhaInicial();
  const salt = createHmac('sha256', segredo()).update('salt-inicial').digest('hex');
  const chave = salt + ':' + createHash('sha256').update(senha).digest('hex');
  if (!memoInicial || memoInicial.chave !== chave) memoInicial = { chave, r: await hash(senha, salt) };
  return { ...memoInicial.r, geracao: 0, inicial: true };
}

// Login e troca de senha sempre leem o registro atualizado.
export async function conferirSenha(senha) {
  const r = await registro({ fresco: true });
  const h = await scrypt(String(senha || ''), r.salt, 64);
  const ok = timingSafeEqual(h, Buffer.from(r.hash, 'hex'));
  return { ok, registro: r };
}

export async function trocarSenha(nova) {
  const atual = await lerAuth(true);
  const rec = { ...(await hash(nova)), geracao: (atual && atual.geracao) || 0, alteradaEm: new Date().toISOString() };
  await getStorage().writeAuth(rec);
  cacheAuth = { valor: rec, t: Date.now() };
  return { ...rec, inicial: false };
}

// "Sair de todos os aparelhos": muda a geração, que entra na assinatura de todo token.
export async function encerrarSessoes() {
  const atual = await lerAuth(true);
  if (!atual || !atual.hash) { const e = new Error('Troque a senha inicial primeiro.'); e.status = 400; throw e; }
  const rec = { ...atual, geracao: (atual.geracao || 0) + 1 };
  await getStorage().writeAuth(rec);
  cacheAuth = { valor: rec, t: Date.now() };
}

// O token inclui o salt da senha e a geração: trocar a senha ou sair de todos invalida as sessões antigas.
const b64 = (s) => Buffer.from(s).toString('base64url');
const assinar = (dados, r) => createHmac('sha256', segredo()).update(`${r.salt}.${r.geracao || 0}.${dados}`).digest('base64url');
const confere = (dados, sig, r) => { const a = Buffer.from(assinar(dados, r)), b = Buffer.from(sig); return a.length === b.length && timingSafeEqual(a, b); };

export function criarToken(r, dias) {
  const dados = b64(JSON.stringify({ exp: Date.now() + dias * 864e5 }));
  return dados + '.' + assinar(dados, r);
}

// Confere o formato antes de ler a senha guardada: cookie falso não custa leitura no Blob nem scrypt.
function lerToken(token) {
  if (typeof token !== 'string' || token.length > 300) return null;
  const partes = token.split('.');
  if (partes.length !== 2 || partes[1].length !== 43) return null; // HMAC-SHA256 em base64url
  try {
    const { exp } = JSON.parse(Buffer.from(partes[0], 'base64url').toString());
    if (!(exp > Date.now()) || exp > Date.now() + (DIAS_LEMBRAR + 1) * 864e5) return null;
  } catch { return null; }
  return partes;
}

// Registro da senha se o token for válido; senão null.
let ultimaReleitura = 0;
export async function sessao(token) {
  const p = lerToken(token);
  if (!p) return null;
  const r = await registro();
  if (confere(p[0], p[1], r)) return r;
  // A senha pode ter sido trocada em outra instância (cache desatualizado): relê, no máximo a cada 3 s.
  if (Date.now() - ultimaReleitura < 3000) return null;
  ultimaReleitura = Date.now();
  const r2 = await registro({ fresco: true });
  return confere(p[0], p[1], r2) ? r2 : null;
}

// Limite de tentativas por IP e geral (melhor esforço: em serverless vale por instância).
const tentativas = new Map();
const geral = { falhas: [], ate: 0 };
const JANELA_GERAL = 10 * 60e3, LIMITE_GERAL = 30, BLOQUEIO_GERAL = 5 * 60e3;

export function bloqueado(ip) {
  const agora = Date.now();
  if (geral.ate > agora) return Math.ceil((geral.ate - agora) / 1000);
  const t = tentativas.get(ip);
  return t && t.ate > agora ? Math.ceil((t.ate - agora) / 1000) : 0;
}

export function registrarFalha(ip) {
  const agora = Date.now();
  if (tentativas.size > 5000) tentativas.clear();
  let t = tentativas.get(ip);
  if (!t || agora - t.ultima > 60 * 60e3) t = { n: 0, ate: 0 };
  t.n += 1; t.ultima = agora;
  if (t.n >= 5) t.ate = agora + Math.min(15 * 60e3, 30e3 * 2 ** (t.n - 5));
  tentativas.set(ip, t);
  // Mais de 30 falhas em 10 min (de qualquer IP) bloqueiam novos logins por 5 min.
  geral.falhas = geral.falhas.filter(x => agora - x < JANELA_GERAL);
  geral.falhas.push(agora);
  if (geral.falhas.length > LIMITE_GERAL) { geral.ate = agora + BLOQUEIO_GERAL; geral.falhas = []; }
}

export function limparFalhas(ip) { tentativas.delete(ip); }
