// Servidor Node para hospedar fora da Vercel (VPS, Render, Railway...):
//   npm run build && npm start        (npm start = NODE_ENV=production)
// Serve o site (dist/), a API (/api/*) e as fotos salvas em DATA_DIR (/uploads/*).
// Os cabeçalhos de segurança e de cache vêm do vercel.json (fonte única para os dois ambientes).
// Textos (HTML, JS, CSS, JSON, XML, SVG) saem comprimidos (brotli ou gzip); todo arquivo tem ETag e responde 304
// quando o navegador já tem a mesma versão.
import { createServer } from 'node:http';
import { createReadStream, promises as fs, readFileSync } from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';
import { brotliCompress, constants as zlib, gzip } from 'node:zlib';
import { handleApi } from './server/router.js';
import { serveUpload } from './server/static.js';

const DIST = path.resolve('dist');
const PORT = Number(process.env.PORT) || 3000;
const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.txt': 'text/plain', '.xml': 'application/xml', '.woff2': 'font/woff2', '.woff': 'font/woff' };
const COMPRIMIR = new Set(['.html', '.js', '.css', '.json', '.webmanifest', '.txt', '.xml', '.svg']);
const brotli = promisify(brotliCompress), gz = promisify(gzip);

// Em produção, não sobe sem a chave da sessão (sem ela, cookies de administrador poderiam ser forjados).
if (process.env.NODE_ENV === 'production') {
  if ((process.env.SESSION_SECRET || '').length < 32) {
    console.error('Defina SESSION_SECRET com pelo menos 32 caracteres aleatórios (ex.: openssl rand -hex 32).');
    process.exit(1);
  }
  if (!process.env.ADMIN_PASSWORD) console.warn('Aviso: ADMIN_PASSWORD não definido — o painel só abre se a senha já tiver sido trocada.');
} else {
  console.warn('Modo de desenvolvimento (NODE_ENV não é "production"). Para hospedar, use npm start.');
}

// Blocos "headers" do vercel.json. Formatos de "source" aceitos: /caminho, /prefixo/(.*), /:param.
const BLOCOS = (JSON.parse(readFileSync(new URL('./vercel.json', import.meta.url), 'utf8')).headers || []).map(b => ({
  re: new RegExp('^' + b.source.split('(.*)').map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/:[a-zA-Z]+/g, '[^/]+')).join('.*') + '$'),
  headers: b.headers,
}));

function aplicarCabecalhos(req, res, caminho) {
  const https = req.headers['x-forwarded-proto'] === 'https' || !!req.socket.encrypted;
  for (const b of BLOCOS) {
    if (!b.re.test(caminho)) continue;
    for (const { key, value } of b.headers) {
      if (!https && key === 'Strict-Transport-Security') continue;
      res.setHeader(key, !https && key === 'Content-Security-Policy' ? value.replace(/;\s*upgrade-insecure-requests/, '') : value);
    }
  }
}

function texto(res, status, msg) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end(msg);
}

// Melhor compressão aceita pelo navegador (brotli, senão gzip); "q=0" recusa.
function codificacao(req) {
  const aceitas = String(req.headers['accept-encoding'] || '').toLowerCase().split(',')
    .map(item => item.split(';').map(p => p.trim()))
    .filter(([nome, ...params]) => nome && !params.some(p => /^q=0(\.0*)?$/.test(p)))
    .map(([nome]) => nome);
  return aceitas.includes('br') ? 'br' : aceitas.includes('gzip') ? 'gzip' : null;
}

// Versões comprimidas em memória (os arquivos de dist/ só mudam com novo build): "arquivo|codificação" → { mtime, corpo }.
const comprimidos = new Map();
async function comprimido(arq, st, enc) {
  const chave = arq + '|' + enc, guardado = comprimidos.get(chave);
  if (guardado && guardado.mtime === st.mtimeMs) return guardado.corpo;
  const bruto = await fs.readFile(arq);
  const corpo = enc === 'br'
    ? await brotli(bruto, { params: { [zlib.BROTLI_PARAM_QUALITY]: 11, [zlib.BROTLI_PARAM_SIZE_HINT]: bruto.length } })
    : await gz(bruto, { level: 9 });
  comprimidos.set(chave, { mtime: st.mtimeMs, corpo });
  return corpo;
}

async function arquivo(req, res, arq, cache) {
  const st = await fs.stat(arq);
  const ext = path.extname(arq);
  res.setHeader('Content-Type', TIPOS[ext] || 'application/octet-stream');
  if (!res.hasHeader('Cache-Control')) res.setHeader('Cache-Control', cache);
  const etag = `W/"${st.size.toString(16)}-${Math.floor(st.mtimeMs).toString(16)}"`;
  res.setHeader('ETag', etag);
  const comprimir = COMPRIMIR.has(ext) && st.size > 1024;
  if (comprimir) res.setHeader('Vary', 'Accept-Encoding');
  // O navegador já tem esta versão (comparação fraca, como manda o If-None-Match).
  const pedidas = String(req.headers['if-none-match'] || '').split(',').map(t => t.trim().replace(/^W\//, ''));
  if (res.statusCode === 200 && pedidas.includes(etag.slice(2))) { res.statusCode = 304; return res.end(); }
  const enc = comprimir ? codificacao(req) : null;
  if (enc) {
    const corpo = await comprimido(arq, st, enc);
    res.setHeader('Content-Encoding', enc);
    res.setHeader('Content-Length', corpo.length);
    return res.end(req.method === 'HEAD' ? undefined : corpo);
  }
  res.setHeader('Content-Length', st.size);
  if (req.method === 'HEAD') return res.end();
  createReadStream(arq).on('error', () => (res.headersSent ? res.destroy() : texto(res, 500, 'Erro no servidor'))).pipe(res);
}

// Forma limpa do endereço, como na Vercel (cleanUrls, sem barra final): /sobre/, /sobre.html, /index e /index.html
// viram /sobre e /. Barras repetidas no início viram uma só (//outro-site não vira redirecionamento para fora).
function formaLimpa(p) {
  let s = p.replace(/^\/+/, '/').replace(/\/+$/, '').replace(/\.html$/, '');
  if (s === '/index' || s.endsWith('/index')) s = s.slice(0, -'index'.length).replace(/\/+$/, '');
  return s || '/';
}

async function atender(req, res) {
  let url;
  try { url = new URL(req.url, 'http://local'); } catch { return texto(res, 400, 'Requisição inválida'); }
  const { pathname } = url;
  if (pathname.startsWith('/api/')) { aplicarCabecalhos(req, res, pathname.replace(/\/+$/, '')); return handleApi(req, res); }
  if (pathname.startsWith('/uploads/')) { aplicarCabecalhos(req, res, pathname); return serveUpload(req, res); }
  const limpo = formaLimpa(pathname);
  aplicarCabecalhos(req, res, limpo);
  // Uma URL por página: as outras formas redirecionam (301) para a limpa, mantendo a query string.
  if (limpo !== pathname && (req.method === 'GET' || req.method === 'HEAD')) {
    res.statusCode = 301;
    res.setHeader('Location', limpo + url.search);
    return res.end();
  }
  let decodificado;
  try { decodificado = decodeURIComponent(limpo); } catch { return texto(res, 400, 'Requisição inválida'); }
  if (decodificado.includes('\0')) return texto(res, 400, 'Requisição inválida');
  const alvo = path.join(DIST, path.normalize(decodificado).replace(/^(\.\.[/\\])+/, ''));
  const existe = async (arq) => { try { return arq.startsWith(DIST + path.sep) && (await fs.stat(arq)).isFile(); } catch { return false; } };
  const naoEncontrada = () => { res.statusCode = 404; return arquivo(req, res, path.join(DIST, '404.html'), 'no-cache'); };
  // /404 é só a página de erro (nunca com status 200).
  if (limpo === '/404') return naoEncontrada();
  // Cache: /assets (nome com hash), /fotos, logo e og-image vêm do vercel.json; o resto revalida em 5 min.
  if (await existe(alvo)) return arquivo(req, res, alvo, limpo.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : 'public, max-age=300');
  // Páginas geradas no build (/ → index.html, /sobre → sobre.html, /blog/x → blog/x.html, /admin → admin.html).
  if (limpo === '/') return arquivo(req, res, path.join(DIST, 'index.html'), 'no-cache');
  if (await existe(alvo + '.html')) return arquivo(req, res, alvo + '.html', 'no-cache');
  // O resto (inclusive /blog/<artigo-inexistente>) é 404 de verdade.
  return naoEncontrada();
}

// Prepara as versões brotli dos textos em segundo plano ao iniciar: a primeira visita não espera a compressão.
async function aquecer(dir) {
  for (const item of await fs.readdir(dir, { withFileTypes: true })) {
    const arq = path.join(dir, item.name);
    if (item.isDirectory()) await aquecer(arq);
    else if (COMPRIMIR.has(path.extname(arq))) { const st = await fs.stat(arq); if (st.size > 1024) await comprimido(arq, st, 'br'); }
  }
}

// Um erro inesperado responde 500 sem derrubar o processo.
createServer((req, res) => {
  atender(req, res).catch((e) => {
    console.error('[server]', e);
    if (res.headersSent) res.destroy(); else texto(res, 500, 'Erro no servidor');
  });
}).listen(PORT, () => {
  console.log(`Ótica Digital Look em http://localhost:${PORT}`);
  aquecer(DIST).catch(() => {});
});
