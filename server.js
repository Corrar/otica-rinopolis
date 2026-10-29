// Servidor Node para hospedar fora da Vercel (VPS, Render, Railway...):
//   npm run build && npm start
// Serve o site (dist/), a API (/api/*) e as fotos salvas em DATA_DIR (/uploads/*).
import { createServer } from 'node:http';
import { createReadStream, promises as fs } from 'node:fs';
import path from 'node:path';
import { handleApi } from './server/router.js';
import { serveUpload } from './server/static.js';

const DIST = path.resolve('dist');
const PORT = Number(process.env.PORT) || 3000;
const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.txt': 'text/plain', '.xml': 'application/xml', '.woff2': 'font/woff2' };

async function arquivo(res, arq, cache) {
  res.setHeader('Content-Type', TIPOS[path.extname(arq)] || 'application/octet-stream');
  res.setHeader('Cache-Control', cache);
  createReadStream(arq).pipe(res);
}

createServer(async (req, res) => {
  const { pathname } = new URL(req.url, 'http://local');
  if (pathname.startsWith('/api/')) return handleApi(req, res);
  if (pathname.startsWith('/uploads/')) return serveUpload(req, res);
  const limpo = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  const alvo = path.join(DIST, path.normalize(decodeURIComponent(limpo)).replace(/^(\.\.[/\\])+/, ''));
  const existe = async (arq) => { try { return arq.startsWith(DIST) && (await fs.stat(arq)).isFile(); } catch { return false; } };
  if (await existe(alvo)) return arquivo(res, alvo, limpo.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : 'public, max-age=300');
  // Páginas geradas no build (/sobre → sobre.html); /admin e artigos novos do blog abrem o app; o resto é 404.
  if (await existe(alvo + '.html')) return arquivo(res, alvo + '.html', 'no-cache');
  if (limpo === '/' || limpo === '/admin' || limpo.startsWith('/blog/')) return arquivo(res, path.join(DIST, limpo === '/' ? 'index.html' : 'app.html'), 'no-cache');
  res.statusCode = 404;
  arquivo(res, path.join(DIST, '404.html'), 'no-cache');
}).listen(PORT, () => console.log(`Ótica Digital Look em http://localhost:${PORT}`));
