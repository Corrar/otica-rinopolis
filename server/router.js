// API do site. Usada pelas funções da Vercel (api/*.js), pelo servidor Node (server.js)
// e pelo servidor de desenvolvimento do Vite. Só depende de req/res do Node.
import { getStorage } from './storage.js';
import { COOKIE, bloqueado, conferirSenha, criarToken, limparFalhas, registrarFalha, senhaEhInicial, trocarSenha, validarToken } from './auth.js';

const MAX_CONTEUDO = 2 * 1024 * 1024; // JSON do conteúdo (as fotos ficam fora, como URL)
const MAX_FOTO = 3.5 * 1024 * 1024;
const TIPOS_FOTO = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

class HttpErro extends Error { constructor(status, msg) { super(msg); this.status = status; } }

function json(res, status, body, headers = {}) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
  if (!headers['Cache-Control']) res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

async function lerCorpo(req, limite) {
  if (req.body !== undefined && req.body !== null && req.body !== '') {
    const b = typeof req.body === 'string' ? req.body : Buffer.isBuffer(req.body) ? req.body.toString() : null;
    if (b === null) return req.body;
    if (b.length > limite) throw new HttpErro(413, 'Conteúdo grande demais.');
    return JSON.parse(b);
  }
  const partes = []; let total = 0;
  for await (const p of req) { total += p.length; if (total > limite) throw new HttpErro(413, 'Conteúdo grande demais.'); partes.push(p); }
  const txt = Buffer.concat(partes).toString();
  try { return txt ? JSON.parse(txt) : {}; } catch { throw new HttpErro(400, 'JSON inválido.'); }
}

const cookies = (req) => Object.fromEntries((req.headers.cookie || '').split(';').map(c => c.trim().split('=')).filter(([k]) => k).map(([k, ...v]) => [k, decodeURIComponent(v.join('='))]));
const ip = (req) => String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '?').split(',')[0].trim();
const seguro = (req) => req.headers['x-forwarded-proto'] === 'https' || !!req.socket?.encrypted;

function cookieSessao(req, valor, maxAge) {
  return `${COOKIE}=${valor}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${seguro(req) ? '; Secure' : ''}`;
}

async function exigirLogin(req) {
  // Cabeçalho próprio: formulários de outros sites não conseguem enviá-lo (proteção CSRF).
  if (req.headers['x-odl'] !== '1') throw new HttpErro(403, 'Requisição inválida.');
  if (!(await validarToken(cookies(req)[COOKIE]))) throw new HttpErro(401, 'Sessão expirada. Entre novamente.');
}

function temDataUrl(v) {
  if (typeof v === 'string') return v.startsWith('data:');
  if (Array.isArray(v)) return v.some(temDataUrl);
  if (v && typeof v === 'object') return Object.values(v).some(temDataUrl);
  return false;
}

async function ultimaVersao() {
  const [v] = await getStorage().listVersions();
  return v || null;
}

const rotas = {
  'GET /api/content': async (req, res, url) => {
    const v = await ultimaVersao();
    const content = v ? await getStorage().readVersion(v) : null;
    const cache = url.searchParams.has('fresh') ? 'no-store' : 'public, max-age=0, s-maxage=10, stale-while-revalidate=60';
    json(res, 200, { content, version: v ? v.id : null, updatedAt: v ? v.at : null }, { 'Cache-Control': cache });
  },

  'PUT /api/content': async (req, res) => {
    await exigirLogin(req);
    const { content, baseVersion, force } = await lerCorpo(req, MAX_CONTEUDO);
    if (!content || typeof content !== 'object' || Array.isArray(content)) throw new HttpErro(400, 'Conteúdo inválido.');
    if (temDataUrl(content)) throw new HttpErro(400, 'Envie as fotos pelo botão de foto (não embutidas no conteúdo).');
    const atual = await ultimaVersao();
    if (!force && atual && baseVersion !== atual.id) return json(res, 409, { error: 'O conteúdo foi alterado em outro aparelho.', version: atual.id });
    const v = await getStorage().writeVersion(content);
    json(res, 200, { version: v.id, updatedAt: v.at });
  },

  'GET /api/session': async (req, res) => {
    const logado = await validarToken(cookies(req)[COOKIE]);
    json(res, 200, { logado, senhaInicial: logado ? await senhaEhInicial() : undefined, armazenamento: getStorage().kind });
  },

  'POST /api/login': async (req, res) => {
    if (req.headers['x-odl'] !== '1') throw new HttpErro(403, 'Requisição inválida.');
    const quem = ip(req), espera = bloqueado(quem);
    if (espera) throw new HttpErro(429, `Muitas tentativas. Tente de novo em ${espera}s.`);
    const { senha, lembrar } = await lerCorpo(req, 10_000);
    const { ok, registro } = await conferirSenha(senha);
    if (!ok) { registrarFalha(quem); throw new HttpErro(401, 'Senha incorreta. Tente novamente.'); }
    limparFalhas(quem);
    const dias = lembrar ? 30 : 0.5;
    res.setHeader('Set-Cookie', cookieSessao(req, criarToken(registro.salt, dias), Math.round(dias * 86400)));
    json(res, 200, { logado: true, senhaInicial: registro.inicial });
  },

  'POST /api/logout': async (req, res) => {
    res.setHeader('Set-Cookie', cookieSessao(req, '', 0));
    json(res, 200, { logado: false });
  },

  'POST /api/password': async (req, res) => {
    await exigirLogin(req);
    const { atual, nova } = await lerCorpo(req, 10_000);
    if (!(await conferirSenha(atual)).ok) throw new HttpErro(400, 'Senha atual incorreta.');
    if (typeof nova !== 'string' || nova.trim().length < 6) throw new HttpErro(400, 'Use ao menos 6 caracteres.');
    const r = await trocarSenha(nova.trim());
    res.setHeader('Set-Cookie', cookieSessao(req, criarToken(r.salt, 0.5), 43200));
    json(res, 200, { ok: true });
  },

  'POST /api/upload': async (req, res) => {
    await exigirLogin(req);
    const { dataUrl } = await lerCorpo(req, MAX_FOTO * 1.4);
    const m = /^data:(image\/[a-z+]+);base64,(.+)$/.exec(String(dataUrl || ''));
    if (!m || !TIPOS_FOTO[m[1]]) throw new HttpErro(400, 'Formato de imagem não suportado (use JPG, PNG ou WebP).');
    const buf = Buffer.from(m[2], 'base64');
    if (buf.length > MAX_FOTO) throw new HttpErro(413, 'Imagem grande demais.');
    const url = await getStorage().saveImage(buf, m[1], TIPOS_FOTO[m[1]]);
    json(res, 200, { url });
  },

  'GET /api/history': async (req, res) => {
    await exigirLogin(req);
    const vs = await getStorage().listVersions();
    json(res, 200, { versions: vs.map(({ id, at, size }) => ({ id, at, size })) });
  },

  'POST /api/history': async (req, res) => {
    await exigirLogin(req);
    const { id } = await lerCorpo(req, 10_000);
    const v = (await getStorage().listVersions()).find(x => x.id === id);
    if (!v) throw new HttpErro(404, 'Versão não encontrada.');
    const content = await getStorage().readVersion(v);
    const nova = await getStorage().writeVersion(content);
    json(res, 200, { content, version: nova.id, updatedAt: nova.at });
  },
};

export async function handleApi(req, res) {
  const url = new URL(req.url, 'http://local');
  const rota = rotas[`${req.method} ${url.pathname.replace(/\/+$/, '')}`];
  try {
    if (!rota) throw new HttpErro(404, 'Rota não encontrada.');
    await rota(req, res, url);
  } catch (e) {
    const status = e.status || 500;
    if (status >= 500) console.error('[api]', e);
    json(res, status, { error: status >= 500 ? 'Erro no servidor. Tente novamente.' : e.message });
  }
}
