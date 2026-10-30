// Senha do proprietário (hash scrypt) e sessão em cookie assinado (HMAC).
import { createHash, createHmac, randomBytes, scrypt as scryptCb, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { getStorage } from './storage.js';
import { normalizarSenha } from '../src/lib/senha.js';

const scrypt = promisify(scryptCb);
export const COOKIE = 'odl_session';
export const COOKIE_HTTPS = '__Host-odl_session'; // com HTTPS: só o próprio domínio consegue gravar
export const DIAS_LEMBRAR = 14, DIAS_PADRAO = 0.5;
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

// Senha inicial, com a mesma normalização da senha digitada (espaços nas pontas não contam: ver src/lib/senha.js).
function senhaInicial() {
  const s = normalizarSenha(process.env.ADMIN_PASSWORD);
  if (s) {
    if (emProducao() && s.length < 12) throw configPendente('ADMIN_PASSWORD com pelo menos 12 caracteres');
    return s;
  }
  if (!emProducao() && process.env.NODE_ENV === 'development') return SENHA_DEV;
  throw configPendente('ADMIN_PASSWORD');
}

// Toda senha passa pela mesma normalização antes do hash: ao criar, ao entrar e ao conferir a senha atual.
async function hash(senha, salt = randomBytes(16).toString('hex')) {
  const h = await scrypt(normalizarSenha(senha), salt, 64);
  return { salt, hash: h.toString('hex') };
}

// Registro da senha guardado no armazenamento, com cache de 60 s (cada leitura no Blob é uma operação com cota).
const CACHE_AUTH_MS = 60e3;
// Leituras simultâneas compartilham a mesma ida ao armazenamento. Uma leitura que termina depois de uma gravação
// feita nesta instância não sobrescreve o cache com o registro antigo.
let cacheAuth = null, lendo = null, gravacoes = 0;
const guardarAuth = (valor) => { gravacoes++; cacheAuth = { valor, t: Date.now() }; };
async function lerAuth(fresco) {
  if (!fresco && cacheAuth && Date.now() - cacheAuth.t < CACHE_AUTH_MS) return cacheAuth.valor;
  if (!lendo) {
    const n = gravacoes;
    lendo = getStorage().readAuth().then(valor => { if (n === gravacoes) cacheAuth = { valor, t: Date.now() }; return valor; }).finally(() => { lendo = null; });
  }
  return lendo;
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

// Confere a senha. O login (anônimo) usa o registro em cache e só relê o armazenamento quando a senha não confere
// (pode ter sido trocada em outra função/instância), no máximo 1 vez por minuto: tentativas erradas, mesmo
// simultâneas, não viram uma leitura (list) no Blob cada uma. fresco: troca de senha (quem pede já está logado).
const RELEITURA_LOGIN_MS = 60e3;
let releituraLogin = 0;
export async function conferirSenha(senha, { fresco = false } = {}) {
  const testar = async (r) => {
    const h = Buffer.from((await hash(senha, r.salt)).hash, 'hex'), g = Buffer.from(String(r.hash), 'hex');
    return h.length === g.length && timingSafeEqual(h, g);
  };
  let r = await registro({ fresco });
  if (await testar(r)) return { ok: true, registro: r };
  if (fresco || Date.now() - releituraLogin < RELEITURA_LOGIN_MS || (cacheAuth && Date.now() - cacheAuth.t < 2000)) return { ok: false, registro: r };
  releituraLogin = Date.now();
  r = await registro({ fresco: true });
  return { ok: await testar(r), registro: r };
}

export async function trocarSenha(nova) {
  const atual = await lerAuth(true);
  const rec = { ...(await hash(nova)), geracao: (atual && atual.geracao) || 0, alteradaEm: new Date().toISOString() };
  await getStorage().writeAuth(rec);
  guardarAuth(rec);
  return { ...rec, inicial: false };
}

// "Sair de todos os aparelhos": muda a geração, que vai em todo token (os antigos deixam de valer).
export async function encerrarSessoes() {
  const atual = await lerAuth(true);
  if (!atual || !atual.hash) { const e = new Error('Troque a senha inicial primeiro.'); e.status = 400; throw e; }
  const rec = { ...atual, geracao: (atual.geracao || 0) + 1 };
  await getStorage().writeAuth(rec);
  guardarAuth(rec);
}

// Token da sessão: { exp, s, g, l } assinado com a chave da sessão (HMAC). s identifica a senha atual (hash do salt) e
// g é a geração: trocar a senha ou "sair de todos os aparelhos" invalida os tokens antigos. l: "manter conectado".
// A assinatura é conferida antes de qualquer leitura do armazenamento: cookie falso (mesmo no formato certo) não
// custa leitura no Blob nem scrypt.
const b64 = (s) => Buffer.from(s).toString('base64url');
const idSenha = (r) => createHash('sha256').update('odl-senha:' + r.salt).digest('base64url').slice(0, 16);
const assinar = (dados) => createHmac('sha256', segredo()).update('odl-token.' + dados).digest('base64url');

export function criarToken(r, lembrar = false) {
  const dias = lembrar ? DIAS_LEMBRAR : DIAS_PADRAO;
  const dados = b64(JSON.stringify({ exp: Date.now() + dias * 864e5, s: idSenha(r), g: r.geracao || 0, ...(lembrar ? { l: 1 } : {}) }));
  return { token: dados + '.' + assinar(dados), segundos: Math.round(dias * 86400) };
}

function lerToken(token) {
  if (typeof token !== 'string' || token.length > 300) return null;
  const partes = token.split('.');
  if (partes.length !== 2 || partes[1].length !== 43) return null; // HMAC-SHA256 em base64url
  const a = Buffer.from(assinar(partes[0])), b = Buffer.from(partes[1]);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const p = JSON.parse(Buffer.from(partes[0], 'base64url').toString());
    if (!(p.exp > Date.now()) || p.exp > Date.now() + (DIAS_LEMBRAR + 1) * 864e5 || typeof p.s !== 'string' || !Number.isInteger(p.g)) return null;
    return p;
  } catch { return null; }
}

const confere = (p, r) => p.s === idSenha(r) && p.g === (r.geracao || 0);

// Registro da senha (com lembrar: true/false) se o token for válido; senão null.
let ultimaReleitura = 0;
export async function sessao(token) {
  const p = lerToken(token);
  if (!p) return null;
  const com = (r) => ({ ...r, lembrar: p.l === 1 });
  const r = await registro();
  if (confere(p, r)) return com(r);
  // Token legítimo, mas de outra senha: ela pode ter sido trocada em outra função/instância (cache desatualizado).
  // Relê, no máximo a cada 3 s (só quem tem um token assinado por este servidor chega aqui).
  if (Date.now() - ultimaReleitura < 3000) return null;
  ultimaReleitura = Date.now();
  const r2 = await registro({ fresco: true });
  return confere(p, r2) ? com(r2) : null;
}

// Limite de tentativas de senha (melhor esforço: em serverless vale por instância).
// - Por IP: cada tentativa conta ANTES de conferir a senha (no mesmo instante em que o bloqueio é verificado), então
//   requisições simultâneas não escapam do limite; a senha certa zera a contagem. 5 tentativas erradas bloqueiam o
//   IP por 30 s, dobrando a cada nova falha (até 15 min). Na Vercel o IP vem de x-real-ip, que o visitante não forja.
// - Geral: mais de 30 falhas em 10 min (de quaisquer IPs) indicam ataque distribuído. Ninguém é recusado por isso,
//   para que um atacante não consiga trancar o proprietário fora do painel: cada login passa a esperar um pouco antes
//   da conferência (até 2 s, crescendo com o número de falhas) e o limite por IP cai de 5 para 3 tentativas.
const tentativas = new Map();
const geral = { falhas: [] };
const LIMITE_IP = 5, LIMITE_IP_ALERTA = 3;
const JANELA_GERAL = 10 * 60e3, LIMITE_GERAL = 30, ATRASO_MAX = 2000;
// O IP de quem errou a senha fica só na memória e é esquecido 1 hora depois da última falha (prazo da Política de Privacidade).
const GUARDA_IP = 60 * 60e3;
const esquecerAntigos = (agora = Date.now()) => { for (const [k, t] of tentativas) if (agora - t.ultima > GUARDA_IP && t.ate <= agora) tentativas.delete(k); };
setInterval(esquecerAntigos, 10 * 60e3).unref?.();

const falhasGerais = (agora = Date.now()) => {
  while (geral.falhas.length && agora - geral.falhas[0] > JANELA_GERAL) geral.falhas.shift();
  return geral.falhas.length;
};
const emAlerta = (agora) => falhasGerais(agora) > LIMITE_GERAL;

// Segundos de espera do IP bloqueado (0 = pode tentar).
export function bloqueado(ip) {
  const agora = Date.now();
  esquecerAntigos(agora);
  const t = tentativas.get(ip);
  return t && t.ate > agora ? Math.ceil((t.ate - agora) / 1000) : 0;
}

// Conta uma tentativa (chamar logo depois de bloqueado(), antes de qualquer await). geral: false para quem já está
// logado (troca de senha), que não entra na contagem de ataque distribuído.
export function registrarFalha(ip, { geral: contarGeral = true } = {}) {
  const agora = Date.now();
  if (tentativas.size > 5000) { let n = 0; for (const k of tentativas.keys()) { if (n++ > 1000) break; tentativas.delete(k); } }
  let t = tentativas.get(ip);
  if (!t || agora - t.ultima > GUARDA_IP) t = { n: 0, ate: 0, geral: 0 };
  t.n += 1; t.ultima = agora;
  const limite = emAlerta(agora) ? LIMITE_IP_ALERTA : LIMITE_IP;
  if (t.n >= limite) t.ate = agora + Math.min(15 * 60e3, 30e3 * 2 ** (t.n - limite));
  if (contarGeral) {
    t.geral += 1;
    geral.falhas.push(agora);
    if (geral.falhas.length > 500) geral.falhas.splice(0, geral.falhas.length - 500);
  }
  tentativas.set(ip, t);
}

// Senha certa: zera a contagem do IP e tira da contagem geral a tentativa que deu certo (contada antes da conferência).
export function limparFalhas(ip) {
  const t = tentativas.get(ip);
  tentativas.delete(ip);
  if (t && t.geral && geral.falhas.length) geral.falhas.pop();
}

// Espera antes de conferir a senha no login durante um ataque distribuído (0 fora dele).
export function atrasoGeral() {
  const n = falhasGerais();
  return n > LIMITE_GERAL ? Math.min(ATRASO_MAX, 250 + (n - LIMITE_GERAL) * 50) : 0;
}
