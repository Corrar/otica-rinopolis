// Senha do proprietário (hash scrypt) e sessão em cookie assinado (HMAC).
import { createHash, createHmac, randomBytes, scrypt as scryptCb, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { getStorage } from './storage.js';

const scrypt = promisify(scryptCb);
export const COOKIE = 'odl_session';
const SENHA_INICIAL = () => process.env.ADMIN_PASSWORD || 'digitallook';

function segredo() {
  const s = process.env.SESSION_SECRET || process.env.BLOB_READ_WRITE_TOKEN;
  if (!s && process.env.NODE_ENV === 'production' && process.env.VERCEL) throw new Error('Defina SESSION_SECRET');
  return createHash('sha256').update('odl-session:' + (s || 'dev-only-secret')).digest();
}

async function hash(senha, salt = randomBytes(16).toString('hex')) {
  const h = await scrypt(senha, salt, 64);
  return { salt, hash: h.toString('hex') };
}

// Registro atual da senha; na primeira vez usa ADMIN_PASSWORD (ou "digitallook").
async function registro() {
  const a = await getStorage().readAuth();
  if (a && a.hash && a.salt) return { ...a, inicial: false };
  return { ...(await hash(SENHA_INICIAL(), 'inicial')), inicial: true };
}

export async function conferirSenha(senha) {
  const r = await registro();
  const h = await scrypt(String(senha || ''), r.salt, 64);
  const ok = timingSafeEqual(h, Buffer.from(r.hash, 'hex'));
  return { ok, registro: r };
}

export async function trocarSenha(nova) {
  const r = await hash(nova);
  await getStorage().writeAuth({ ...r, alteradaEm: new Date().toISOString() });
  return r;
}

export async function senhaEhInicial() { return (await registro()).inicial; }

// O token inclui o salt da senha: trocar a senha invalida as sessões antigas.
const b64 = (s) => Buffer.from(s).toString('base64url');
const assinar = (dados, salt) => createHmac('sha256', segredo()).update(salt + '.' + dados).digest('base64url');

export function criarToken(salt, dias) {
  const dados = b64(JSON.stringify({ exp: Date.now() + dias * 864e5 }));
  return dados + '.' + assinar(dados, salt);
}

export async function validarToken(token) {
  if (!token || !token.includes('.')) return false;
  const [dados, sig] = token.split('.');
  const r = await registro();
  const esperado = Buffer.from(assinar(dados, r.salt));
  const recebido = Buffer.from(sig || '');
  if (esperado.length !== recebido.length || !timingSafeEqual(esperado, recebido)) return false;
  try { return JSON.parse(Buffer.from(dados, 'base64url').toString()).exp > Date.now(); } catch { return false; }
}

// Limite simples de tentativas por IP (melhor esforço; em serverless vale por instância).
const tentativas = new Map();
export function bloqueado(ip) {
  const t = tentativas.get(ip);
  return t && t.ate > Date.now() ? Math.ceil((t.ate - Date.now()) / 1000) : 0;
}
export function registrarFalha(ip) {
  const t = tentativas.get(ip) || { n: 0, ate: 0 };
  t.n += 1; if (t.n >= 5) { t.ate = Date.now() + Math.min(15 * 60e3, 30e3 * 2 ** (t.n - 5)); }
  tentativas.set(ip, t);
}
export function limparFalhas(ip) { tentativas.delete(ip); }
