// Serve as fotos salvas localmente (modo arquivo) em /uploads/*.
import { createReadStream, promises as fs } from 'node:fs';
import path from 'node:path';
import { getStorage } from './storage.js';

const TIPOS = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };

export async function serveUpload(req, res) {
  const st = getStorage();
  if (!st.uploadsDir) return false;
  let nome;
  try { nome = path.basename(decodeURIComponent(new URL(req.url, 'http://local').pathname)); } catch { nome = null; }
  if (nome === null) { res.statusCode = 400; res.setHeader('Content-Type', 'text/plain; charset=utf-8'); res.end('Requisição inválida'); return true; }
  const tipo = TIPOS[path.extname(nome).toLowerCase()];
  const arq = path.join(st.uploadsDir, nome);
  try { if (!tipo || !(await fs.stat(arq)).isFile()) throw new Error(); } catch { res.statusCode = 404; res.end(); return true; }
  res.setHeader('Content-Type', tipo);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Security-Policy', "default-src 'none'; sandbox");
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  createReadStream(arq).on('error', () => res.destroy()).pipe(res);
  return true;
}
