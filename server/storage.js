// Persistência do conteúdo, fotos e senha.
// - Produção (Vercel): Vercel Blob, quando BLOB_READ_WRITE_TOKEN está definido.
// - Desenvolvimento / VPS: arquivos em DATA_DIR (padrão ./data).
// Cada salvamento do conteúdo cria uma nova versão imutável (cms/<timestamp>-<rand>.json),
// o que evita cache desatualizado no CDN e dá histórico para restaurar.
import { randomBytes } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const MANTER_VERSOES = 40;
const stamp = () => String(Date.now()).padStart(15, '0') + '-' + randomBytes(4).toString('hex');

function blobStorage() {
  let mod;
  const blob = async () => (mod ||= await import('@vercel/blob'));
  const listAll = async (prefix) => {
    const { list } = await blob();
    const out = []; let cursor;
    do { const r = await list({ prefix, cursor, limit: 1000 }); out.push(...r.blobs); cursor = r.hasMore ? r.cursor : undefined; } while (cursor);
    return out.sort((a, b) => (a.pathname < b.pathname ? 1 : -1)); // mais recente primeiro
  };
  const readJson = async (url) => { const r = await fetch(url, { cache: 'no-store' }); if (!r.ok) throw new Error('blob ' + r.status); return r.json(); };
  return {
    kind: 'blob',
    async listVersions() { return (await listAll('cms/')).map(b => ({ id: b.pathname, at: b.uploadedAt, size: b.size, url: b.url })); },
    async readVersion(v) { return readJson(v.url); },
    async writeVersion(data) {
      const { put, del } = await blob();
      const r = await put(`cms/${stamp()}.json`, JSON.stringify(data), { access: 'public', addRandomSuffix: true, contentType: 'application/json', cacheControlMaxAge: 31536000 });
      const all = await listAll('cms/');
      const velhas = all.slice(MANTER_VERSOES).map(b => b.url);
      if (velhas.length) await del(velhas).catch(() => {});
      return { id: r.pathname, at: new Date().toISOString() };
    },
    async readAuth() { const [a] = await listAll('auth/'); return a ? readJson(a.url) : null; },
    async writeAuth(data) {
      const { put, del } = await blob();
      const antigas = (await listAll('auth/')).map(b => b.url);
      await put(`auth/${stamp()}.json`, JSON.stringify(data), { access: 'public', addRandomSuffix: true, contentType: 'application/json' });
      if (antigas.length) await del(antigas).catch(() => {});
    },
    async saveImage(buf, contentType, ext) {
      const { put } = await blob();
      const r = await put(`uploads/${stamp()}.${ext}`, buf, { access: 'public', addRandomSuffix: true, contentType, cacheControlMaxAge: 31536000 });
      return r.url;
    },
  };
}

function fileStorage(dir) {
  const cmsDir = path.join(dir, 'cms'), upDir = path.join(dir, 'uploads'), authFile = path.join(dir, 'auth.json');
  const ensure = (d) => fs.mkdir(d, { recursive: true });
  return {
    kind: 'file', uploadsDir: upDir,
    async listVersions() {
      await ensure(cmsDir);
      const files = (await fs.readdir(cmsDir)).filter(f => f.endsWith('.json')).sort().reverse();
      return Promise.all(files.map(async f => { const st = await fs.stat(path.join(cmsDir, f)); return { id: 'cms/' + f, at: st.mtime.toISOString(), size: st.size, file: path.join(cmsDir, f) }; }));
    },
    async readVersion(v) { return JSON.parse(await fs.readFile(v.file, 'utf8')); },
    async writeVersion(data) {
      await ensure(cmsDir);
      const name = stamp() + '.json';
      await fs.writeFile(path.join(cmsDir, name), JSON.stringify(data));
      const files = (await fs.readdir(cmsDir)).filter(f => f.endsWith('.json')).sort().reverse();
      await Promise.all(files.slice(MANTER_VERSOES).map(f => fs.unlink(path.join(cmsDir, f)).catch(() => {})));
      return { id: 'cms/' + name, at: new Date().toISOString() };
    },
    async readAuth() { try { return JSON.parse(await fs.readFile(authFile, 'utf8')); } catch { return null; } },
    async writeAuth(data) { await ensure(dir); await fs.writeFile(authFile, JSON.stringify(data)); },
    async saveImage(buf, _contentType, ext) {
      await ensure(upDir);
      const name = `${stamp()}.${ext}`;
      await fs.writeFile(path.join(upDir, name), buf);
      return '/uploads/' + name;
    },
  };
}

let instancia;
export function getStorage() {
  if (!instancia) instancia = process.env.BLOB_READ_WRITE_TOKEN ? blobStorage() : fileStorage(path.resolve(process.env.DATA_DIR || 'data'));
  return instancia;
}
