// API do site. Usada pelas funções da Vercel (api/*.js), pelo servidor Node (server.js)
// e pelo servidor de desenvolvimento do Vite. Só depende de req/res do Node.
import { createHash, timingSafeEqual } from 'node:crypto';
import { getStorage } from './storage.js';
import { COOKIE, COOKIE_HTTPS, DIAS_LEMBRAR, bloqueado, conferirSenha, criarToken, encerrarSessoes, limparFalhas, registrarFalha, senhaProibida, sessao, trocarSenha } from './auth.js';
import { problemaNoConteudo } from '../src/lib/validar.js';

const MAX_CONTEUDO = 2 * 1024 * 1024; // JSON do conteúdo (as fotos ficam fora, como URL)
const MAX_FOTO = 3 * 1024 * 1024; // em base64 fica abaixo dos 4,5 MB aceitos pelas funções da Vercel
const EXT_FOTO = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
const CACHE_CONTEUDO_MS = 30e3;

class HttpErro extends Error { constructor(status, msg) { super(msg); this.status = status; } }

function json(res, status, body, headers = {}) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
  if (!headers['Cache-Control']) res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

const jsonOuErro = (txt) => { try { return JSON.parse(txt); } catch { throw new HttpErro(400, 'JSON inválido.'); } };

// Corpo da requisição: sempre um objeto JSON.
async function lerCorpo(req, limite) {
  let corpo;
  let pronto; try { pronto = req.body; } catch { throw new HttpErro(400, 'JSON inválido.'); } // a Vercel já pode ter lido o corpo
  if (pronto !== undefined && pronto !== null && pronto !== '') {
    const b = typeof pronto === 'string' ? pronto : Buffer.isBuffer(pronto) ? pronto.toString() : null;
    if (b !== null && b.length > limite) throw new HttpErro(413, 'Conteúdo grande demais.');
    corpo = b === null ? pronto : jsonOuErro(b);
  } else {
    const partes = []; let total = 0;
    for await (const p of req) { total += p.length; if (total > limite) throw new HttpErro(413, 'Conteúdo grande demais.'); partes.push(p); }
    const txt = Buffer.concat(partes).toString();
    corpo = txt ? jsonOuErro(txt) : {};
  }
  if (!corpo || typeof corpo !== 'object' || Array.isArray(corpo)) throw new HttpErro(400, 'Requisição inválida.');
  return corpo;
}

function cookies(req) {
  const out = {};
  for (const parte of String(req.headers.cookie || '').split(';')) {
    const i = parte.indexOf('=');
    if (i < 1) continue;
    let v = parte.slice(i + 1).trim();
    try { v = decodeURIComponent(v); } catch { /* cookie malformado: usa como veio */ }
    out[parte.slice(0, i).trim()] = v;
  }
  return out;
}

// IP de quem pediu. Na Vercel, x-real-ip (definido pela própria Vercel); num VPS, o endereço da conexão,
// ou o último X-Forwarded-For quando há um proxy confiável na frente (TRUST_PROXY=1).
function ip(req) {
  if (process.env.VERCEL) return String(req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || '?').split(',')[0].trim();
  if (process.env.TRUST_PROXY === '1') {
    const xff = String(req.headers['x-forwarded-for'] || '').split(',').map(s => s.trim()).filter(Boolean);
    if (xff.length) return xff[xff.length - 1];
  }
  return req.socket?.remoteAddress || '?';
}
const seguro = (req) => req.headers['x-forwarded-proto'] === 'https' || !!req.socket?.encrypted;
const nomeCookie = (req) => (seguro(req) ? COOKIE_HTTPS : COOKIE);
const tokenDe = (req) => cookies(req)[nomeCookie(req)];

function cookieSessao(req, valor, maxAge) {
  return `${nomeCookie(req)}=${valor}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${seguro(req) ? '; Secure' : ''}`;
}
const entrarComCookie = (req, res, r, dias) => res.setHeader('Set-Cookie', cookieSessao(req, criarToken(r, dias), Math.round(dias * 86400)));

function fmtEspera(s) { return s > 90 ? `${Math.ceil(s / 60)} min` : `${s}s`; }
function conferirBloqueio(quem) {
  const espera = bloqueado(quem);
  if (espera) throw new HttpErro(429, `Muitas tentativas. Tente de novo em ${fmtEspera(espera)}.`);
}

// Cabeçalho próprio: formulários de outros sites não conseguem enviá-lo (proteção CSRF).
const exigirCabecalho = (req) => { if (req.headers['x-odl'] !== '1') throw new HttpErro(403, 'Requisição inválida.'); };

// Exige sessão válida. Com a senha inicial, só a troca de senha (e a leitura do histórico) é permitida.
async function exigirLogin(req, { permitirInicial = false } = {}) {
  exigirCabecalho(req);
  const r = await sessao(tokenDe(req));
  if (!r) throw new HttpErro(401, 'Sessão expirada. Entre novamente.');
  if (r.inicial && !permitirInicial) throw new HttpErro(403, 'Troque a senha inicial antes de editar o site.');
  return r;
}

function temDataUrl(v) {
  if (typeof v === 'string') return v.startsWith('data:');
  if (Array.isArray(v)) return v.some(temDataUrl);
  if (v && typeof v === 'object') return Object.values(v).some(temDataUrl);
  return false;
}

// Tipo real da imagem pelos primeiros bytes (não confia no que o navegador declarou).
function tipoDaImagem(buf) {
  if (buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg';
  if (buf.length > 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'image/png';
  if (buf.length > 12 && buf.toString('latin1', 0, 4) === 'RIFF' && buf.toString('latin1', 8, 12) === 'WEBP') return 'image/webp';
  return null;
}

// Publicar no Google: dispara um novo deploy pelo Deploy Hook da Vercel (DEPLOY_HOOK_URL), que refaz as páginas
// prontas, o sitemap e os dados estruturados com o conteúdo salvo. Sem a variável, nada é disparado.
const INTERVALO_PUBLICAR_MS = 60e3;
let ultimaPublicacao = 0;
const publicarConfigurado = () => /^https:\/\//.test(process.env.DEPLOY_HOOK_URL || '');

async function dispararPublicacao() {
  if (!publicarConfigurado()) throw new HttpErro(503, 'Publicação automática não configurada: defina DEPLOY_HOOK_URL.');
  const espera = Math.ceil((ultimaPublicacao + INTERVALO_PUBLICAR_MS - Date.now()) / 1000);
  if (espera > 0) throw new HttpErro(429, `Uma publicação acabou de ser iniciada. Aguarde ${espera}s para pedir outra.`);
  let r;
  try { r = await fetch(process.env.DEPLOY_HOOK_URL, { method: 'POST', signal: AbortSignal.timeout(15e3) }); }
  catch { throw new HttpErro(502, 'Não foi possível iniciar a publicação. Tente de novo em alguns minutos.'); }
  if (!r.ok) throw new HttpErro(502, `A hospedagem recusou a publicação (erro ${r.status}). Tente de novo em alguns minutos.`);
  ultimaPublicacao = Date.now();
  return { ok: true, iniciadaEm: new Date(ultimaPublicacao).toISOString() };
}

// Compara em tempo constante (o tempo da resposta não revela quantos caracteres conferem).
const iguais = (a, b) => timingSafeEqual(createHash('sha256').update(String(a)).digest(), createHash('sha256').update(String(b)).digest());

// Conteúdo atual em memória por 30 s (menos leituras no Blob); atualizado ao salvar ou restaurar.
let cacheConteudo = null;
const guardarConteudo = (dados) => { cacheConteudo = { t: Date.now(), dados }; };

async function versaoMaisRecente() {
  const lista = await getStorage().listVersions();
  const v = lista[0];
  const dados = v ? { content: await getStorage().readVersion(v), version: v.id, updatedAt: v.at } : { content: null, version: null, updatedAt: null };
  return { dados, lista };
}

const rotas = {
  'GET /api/content': async (req, res, url) => {
    // ?fresh (sem cache) só para o proprietário logado: confere a lista de versões no armazenamento.
    const fresco = url.searchParams.has('fresh') && !!(await sessao(tokenDe(req)).catch(() => null));
    if (fresco) {
      const { dados } = await versaoMaisRecente();
      guardarConteudo(dados);
      return json(res, 200, dados, { 'Cache-Control': 'no-store' });
    }
    if (!cacheConteudo || Date.now() - cacheConteudo.t > CACHE_CONTEUDO_MS) {
      const a = await getStorage().lerAtual();
      guardarConteudo(a ? { content: a.content, version: a.id, updatedAt: a.at } : { content: null, version: null, updatedAt: null });
    }
    json(res, 200, cacheConteudo.dados, { 'Cache-Control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=600' });
  },

  'PUT /api/content': async (req, res) => {
    await exigirLogin(req);
    const { content, baseVersion, force } = await lerCorpo(req, MAX_CONTEUDO);
    if (!content || typeof content !== 'object' || Array.isArray(content)) throw new HttpErro(400, 'Conteúdo inválido.');
    if (temDataUrl(content)) throw new HttpErro(400, 'Envie as fotos pelo botão de foto (não embutidas no conteúdo).');
    const problema = problemaNoConteudo(content);
    if (problema) throw new HttpErro(400, problema);
    const lista = await getStorage().listVersions();
    const atual = lista[0];
    if (!force && atual && baseVersion !== atual.id) return json(res, 409, { error: 'O conteúdo foi alterado em outro aparelho.', version: atual.id });
    const v = await getStorage().writeVersion(content, lista);
    guardarConteudo({ content, version: v.id, updatedAt: v.at });
    json(res, 200, { version: v.id, updatedAt: v.at });
  },

  'GET /api/session': async (req, res) => {
    const r = await sessao(tokenDe(req));
    // publicar: o painel só mostra o botão "publicar alterações no Google" com o Deploy Hook configurado;
    // publicarDiario: a republicação diária (cron) também está ligada.
    json(res, 200, r ? {
      logado: true, senhaInicial: r.inicial, armazenamento: getStorage().kind,
      publicar: publicarConfigurado(), publicarDiario: publicarConfigurado() && !!process.env.CRON_SECRET,
    } : { logado: false });
  },

  'POST /api/login': async (req, res) => {
    exigirCabecalho(req);
    const quem = ip(req);
    conferirBloqueio(quem);
    const { senha, lembrar } = await lerCorpo(req, 10_000);
    const { ok, registro } = await conferirSenha(senha);
    if (!ok) { registrarFalha(quem); throw new HttpErro(401, 'Senha incorreta. Tente novamente.'); }
    limparFalhas(quem);
    entrarComCookie(req, res, registro, lembrar ? DIAS_LEMBRAR : 0.5);
    json(res, 200, { logado: true, senhaInicial: registro.inicial });
  },

  // { todos: true } encerra a sessão em todos os aparelhos (inclusive neste).
  'POST /api/logout': async (req, res) => {
    exigirCabecalho(req);
    const { todos } = await lerCorpo(req, 10_000);
    if (todos === true) { await exigirLogin(req); await encerrarSessoes(); }
    const apagar = [cookieSessao(req, '', 0)];
    if (seguro(req)) apagar.push(`${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Secure`); // cookie do formato antigo
    res.setHeader('Set-Cookie', apagar);
    json(res, 200, { logado: false });
  },

  'POST /api/password': async (req, res) => {
    await exigirLogin(req, { permitirInicial: true });
    const quem = ip(req);
    conferirBloqueio(quem);
    const { atual, nova } = await lerCorpo(req, 10_000);
    if (!(await conferirSenha(atual)).ok) { registrarFalha(quem); throw new HttpErro(400, 'Senha atual incorreta.'); }
    limparFalhas(quem);
    const n = typeof nova === 'string' ? nova.trim() : '';
    if (n.length < 10) throw new HttpErro(400, 'Use ao menos 10 caracteres.');
    if (n.length > 200) throw new HttpErro(400, 'Use no máximo 200 caracteres.');
    if (n === String(atual || '').trim() || senhaProibida(n)) throw new HttpErro(400, 'Escolha uma senha nova, diferente da inicial e sem o nome da loja.');
    const r = await trocarSenha(n);
    entrarComCookie(req, res, r, 0.5);
    json(res, 200, { ok: true });
  },

  'POST /api/upload': async (req, res) => {
    await exigirLogin(req);
    const { dataUrl } = await lerCorpo(req, Math.ceil(MAX_FOTO * 4 / 3) + 1000);
    const m = /^data:(image\/[a-z+]+);base64,(.+)$/.exec(String(dataUrl || ''));
    if (!m || !EXT_FOTO[m[1]]) throw new HttpErro(400, 'Formato de imagem não suportado (use JPG, PNG ou WebP).');
    const buf = Buffer.from(m[2], 'base64');
    if (buf.length > MAX_FOTO) throw new HttpErro(413, 'Imagem grande demais.');
    const tipo = tipoDaImagem(buf);
    if (!tipo) throw new HttpErro(400, 'Arquivo de imagem inválido.');
    const url = await getStorage().saveImage(buf, tipo, EXT_FOTO[tipo]);
    json(res, 200, { url });
  },

  'GET /api/history': async (req, res) => {
    await exigirLogin(req, { permitirInicial: true });
    const vs = await getStorage().listVersions();
    json(res, 200, { versions: vs.map(({ id, at, size }) => ({ id, at, size })) });
  },

  'POST /api/history': async (req, res) => {
    await exigirLogin(req);
    const { id } = await lerCorpo(req, 10_000);
    const lista = await getStorage().listVersions();
    const v = lista.find(x => x.id === id);
    if (!v) throw new HttpErro(404, 'Versão não encontrada.');
    const content = await getStorage().readVersion(v);
    const nova = await getStorage().writeVersion(content, lista);
    guardarConteudo({ content, version: nova.id, updatedAt: nova.at });
    json(res, 200, { content, version: nova.id, updatedAt: nova.at });
  },

  // Botão "publicar alterações no Google" do painel (não é chamado a cada salvamento automático).
  'POST /api/publicar': async (req, res) => {
    await exigirLogin(req);
    json(res, 200, await dispararPublicacao());
  },

  // Republicação diária (crons do vercel.json): eventos e promoções vencidos saem das páginas prontas e do sitemap
  // mesmo sem ninguém mexer no painel. A Vercel envia "Authorization: Bearer <CRON_SECRET>"; sem CRON_SECRET
  // definido, ninguém passa. Sem DEPLOY_HOOK_URL, não dispara nada.
  'GET /api/cron-publicar': async (req, res) => {
    const segredo = process.env.CRON_SECRET || '';
    if (!segredo || !iguais(req.headers.authorization || '', 'Bearer ' + segredo)) throw new HttpErro(401, 'Não autorizado.');
    // O proprietário acabou de publicar pelo painel: não precisa de outra.
    const r = await dispararPublicacao().catch(e => { if (e.status === 429) return { ok: true, ignorada: 'publicação recente' }; throw e; });
    json(res, 200, r);
  },

  // Apaga de vez as fotos enviadas que não aparecem no conteúdo atual nem nas versões guardadas.
  // { historico: true } antes apaga as versões antigas (fica só a atual).
  'POST /api/limpar-fotos': async (req, res) => {
    await exigirLogin(req);
    const { historico } = await lerCorpo(req, 10_000);
    const st = getStorage();
    let versoes = await st.listVersions();
    let versoesApagadas = 0;
    if (historico === true && versoes.length > 1) {
      await st.apagarVersoes(versoes.slice(1));
      versoesApagadas = versoes.length - 1;
      versoes = versoes.slice(0, 1);
    }
    const usados = new Set();
    const coletar = (v) => { if (typeof v === 'string') usados.add(v); else if (v && typeof v === 'object') Object.values(v).forEach(coletar); };
    // Se alguma versão não puder ser lida, nada é apagado (Promise.all falha antes).
    for (let i = 0; i < versoes.length; i += 8) (await Promise.all(versoes.slice(i, i + 8).map(v => st.readVersion(v)))).forEach(coletar);
    const fotos = await st.listUploads();
    // Fotos da última hora ficam: podem estar num salvamento que ainda não terminou.
    const limite = Date.now() - 60 * 60e3;
    const orfas = fotos.filter(f => !usados.has(f.url) && new Date(f.at).getTime() < limite);
    if (orfas.length) await st.apagarUploads(orfas);
    json(res, 200, { fotosApagadas: orfas.length, fotosMantidas: fotos.length - orfas.length, versoesApagadas });
  },
};

export async function handleApi(req, res) {
  try {
    const url = new URL(req.url, 'http://local');
    const rota = rotas[`${req.method} ${url.pathname.replace(/\/+$/, '')}`];
    if (!rota) throw new HttpErro(404, 'Rota não encontrada.');
    await rota(req, res, url);
  } catch (e) {
    const status = e.status || 500;
    // Mensagens escritas para o painel (HttpErro e "Configuração pendente") vão como estão; erro inesperado, genérico.
    const conhecido = e instanceof HttpErro || status === 503;
    if (status >= 500) console.error('[api]', conhecido ? e.message : e);
    if (!res.headersSent) json(res, status, { error: status >= 500 && !conhecido ? 'Erro no servidor. Tente novamente.' : e.message });
  }
}
