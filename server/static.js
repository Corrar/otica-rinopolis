// Serve as fotos salvas localmente (modo arquivo) em /uploads/*.
import { createReadStream, promises as fs } from 'node:fs';
import path from 'node:path';
import { getStorage } from './storage.js';

const TIPOS = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };

export async function serveUpload(req, res) {
  const st = getStorage();
  if (!st.uploadsDir) return false;
  const nome = path.basename(decodeURIComponent(new URL(req.url, 'http://local').pathname));
  const arq = path.join(st.uploadsDir, nome);
  try { await fs.access(arq); } catch { res.statusCode = 404; res.end(); return true; }
  res.setHeader('Content-Type', TIPOS[path.extname(nome).toLowerCase()] || 'application/octet-stream');
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  createReadStream(arq).pipe(res);
  return true;
}
