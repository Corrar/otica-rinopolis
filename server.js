// Servidor Node para hospedar fora da Vercel (VPS, Render, Railway...):
//   npm run build && npm start        (npm start = NODE_ENV=production)
// Serve o site (dist/), a API (/api/*) e as fotos salvas em DATA_DIR (/uploads/*).
// Os cabeçalhos de segurança e de cache vêm do vercel.json (fonte única para os dois ambientes).
import { createServer } from 'node:http';
import { createReadStream, promises as fs, readFileSync } from 'node:fs';
import path from 'node:path';
import { handleApi } from './server/router.js';
import { serveUpload } from './server/static.js';

const DIST = path.resolve('dist');
const PORT = Number(process.env.PORT) || 3000;
const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.txt': 'text/plain', '.xml': 'application/xml', '.woff2': 'font/woff2' };

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

function arquivo(res, arq, cache) {
  res.setHeader('Content-Type', TIPOS[path.extname(arq)] || 'application/octet-stream');
  if (!res.hasHeader('Cache-Control')) res.setHeader('Cache-Control', cache);
  createReadStream(arq).on('error', () => (res.headersSent ? res.destroy() : texto(res, 500, 'Erro no servidor'))).pipe(res);
}

async function atender(req, res) {
  let pathname;
  try { pathname = new URL(req.url, 'http://local').pathname; } catch { return texto(res, 400, 'Requisição inválida'); }
  const limpo = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  aplicarCabecalhos(req, res, limpo);
  if (pathname.startsWith('/api/')) return handleApi(req, res);
  if (pathname.startsWith('/uploads/')) return serveUpload(req, res);
  let decodificado;
  try { decodificado = decodeURIComponent(limpo); } catch { return texto(res, 400, 'Requisição inválida'); }
  if (decodificado.includes('\0')) return texto(res, 400, 'Requisição inválida');
  const alvo = path.join(DIST, path.normalize(decodificado).replace(/^(\.\.[/\\])+/, ''));
  const existe = async (arq) => { try { return arq.startsWith(DIST + path.sep) && (await fs.stat(arq)).isFile(); } catch { return false; } };
  if (await existe(alvo)) return arquivo(res, alvo, limpo.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : 'public, max-age=300');
  // Páginas geradas no build (/sobre → sobre.html); /admin e artigos novos do blog abrem o app; o resto é 404.
  if (await existe(alvo + '.html')) return arquivo(res, alvo + '.html', 'no-cache');
  if (limpo === '/' || limpo === '/admin' || limpo.startsWith('/blog/')) return arquivo(res, path.join(DIST, limpo === '/' ? 'index.html' : 'app.html'), 'no-cache');
  res.statusCode = 404;
  arquivo(res, path.join(DIST, '404.html'), 'no-cache');
}

// Um erro inesperado responde 500 sem derrubar o processo.
createServer((req, res) => {
  atender(req, res).catch((e) => {
    console.error('[server]', e);
    if (res.headersSent) res.destroy(); else texto(res, 500, 'Erro no servidor');
  });
}).listen(PORT, () => console.log(`Ótica Digital Look em http://localhost:${PORT}`));
