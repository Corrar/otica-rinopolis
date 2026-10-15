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
  const alvo = path.join(DIST, path.normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, ''));
  try {
    if (alvo.startsWith(DIST) && (await fs.stat(alvo)).isFile()) return arquivo(res, alvo, pathname.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : 'public, max-age=300');
  } catch { /* cai no index.html */ }
  arquivo(res, path.join(DIST, 'index.html'), 'no-cache');
}).listen(PORT, () => console.log(`Ótica Digital Look em http://localhost:${PORT}`));
