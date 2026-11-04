// Persistência do conteúdo, fotos e senha.
// - Produção (Vercel): Vercel Blob, quando BLOB_READ_WRITE_TOKEN está definido.
// - Desenvolvimento / VPS: arquivos em DATA_DIR (padrão ./data).
// Cada salvamento do conteúdo cria uma nova versão imutável (cms/<timestamp>-<rand>.json),
// o que evita cache desatualizado no CDN e dá histórico para restaurar.
// No Blob, um ponteiro de endereço fixo (atual/conteudo.json) indica a versão atual: a leitura
// pública não precisa listar o Blob (list() é operação avançada, com cota mensal).
import { randomBytes } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';

// Histórico: só apaga versões que estejam além das 300 mais recentes E tenham mais de 30 dias.
const MANTER_VERSOES = 300;
const MANTER_DIAS = 30;
const PONTEIRO = 'atual/conteudo.json';
const stamp = () => String(Date.now()).padStart(15, '0') + '-' + randomBytes(4).toString('hex');
const antiga = (at) => Date.now() - new Date(at).getTime() > MANTER_DIAS * 864e5;
const paraApagar = (todas) => todas.slice(MANTER_VERSOES).filter(v => antiga(v.at));

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
  const apagar = async (urls) => { const { del } = await blob(); for (let i = 0; i < urls.length; i += 500) await del(urls.slice(i, i + 500)); };
  const listVersions = async () => (await listAll('cms/')).map(b => ({ id: b.pathname, at: b.uploadedAt, size: b.size, url: b.url }));
  // allowOverwrite=false: só cria o ponteiro se ainda não existir (não atropela um salvamento simultâneo).
  const gravarPonteiro = async (v, sobrescrever) => {
    const { put } = await blob();
    await put(PONTEIRO, JSON.stringify(v ? { id: v.id, at: v.at, url: v.url } : { id: null }), {
      access: 'public', addRandomSuffix: false, allowOverwrite: sobrescrever, contentType: 'application/json', cacheControlMaxAge: 60,
    });
  };
  return {
    kind: 'blob',
    listVersions,
    async readVersion(v) { return readJson(v.url); },
    // anteriores: lista de versões já obtida antes de gravar (evita listar de novo só para podar).
    async writeVersion(data, anteriores) {
      const { put } = await blob();
      const lista = anteriores || await listVersions();
      const r = await put(`cms/${stamp()}.json`, JSON.stringify(data), { access: 'public', addRandomSuffix: true, contentType: 'application/json', cacheControlMaxAge: 31536000 });
      const v = { id: r.pathname, at: new Date().toISOString(), url: r.url };
      await gravarPonteiro(v, true);
      const velhas = paraApagar([v, ...lista]).map(x => x.url);
      if (velhas.length) await apagar(velhas).catch(() => {});
      return v;
    },
    // Versão atual pelo ponteiro (pode vir do CDN com até ~60 s de atraso). Para conferir conflitos, use listVersions.
    async lerAtual() {
      const { get } = await blob();
      const p = await get(PONTEIRO, { access: 'public' }).catch(() => null);
      if (p && p.statusCode === 200) {
        const ptr = await new Response(p.stream).json().catch(() => null);
        if (ptr && ptr.id === null) return null;
        if (ptr && ptr.url) return { id: ptr.id, at: ptr.at, content: await readJson(ptr.url) };
      }
      // Sem ponteiro (primeiro acesso ou conteúdo salvo antes dele existir): lista uma vez e cria.
      const [v] = await listVersions();
      await gravarPonteiro(v, false).catch(() => {});
      return v ? { id: v.id, at: v.at, content: await readJson(v.url) } : null;
    },
    async readAuth() { const [a] = await listAll('auth/'); return a ? readJson(a.url) : null; },
    async writeAuth(data) {
      const { put } = await blob();
      const antigas = (await listAll('auth/')).map(b => b.url);
      await put(`auth/${stamp()}.json`, JSON.stringify(data), { access: 'public', addRandomSuffix: true, contentType: 'application/json' });
      if (antigas.length) await apagar(antigas).catch(() => {});
    },
    async saveImage(buf, contentType, ext) {
      const { put } = await blob();
      const r = await put(`uploads/${stamp()}.${ext}`, buf, { access: 'public', addRandomSuffix: true, contentType, cacheControlMaxAge: 31536000 });
      return r.url;
    },
    async listUploads() { return (await listAll('uploads/')).map(b => ({ url: b.url, at: b.uploadedAt })); },
    async apagarUploads(itens) { await apagar(itens.map(x => x.url)); },
    async apagarVersoes(itens) { await apagar(itens.map(x => x.url)); },
  };
}

function fileStorage(dir) {
  const cmsDir = path.join(dir, 'cms'), upDir = path.join(dir, 'uploads'), authFile = path.join(dir, 'auth.json');
  const ensure = (d) => fs.mkdir(d, { recursive: true });
  // Data da versão pelo nome do arquivo (<timestamp>-<rand>.json).
  const dataDoNome = (f) => new Date(Number(f.slice(0, 15)) || 0).toISOString();
  const listVersions = async () => {
    await ensure(cmsDir);
    const files = (await fs.readdir(cmsDir)).filter(f => f.endsWith('.json')).sort().reverse();
    return Promise.all(files.map(async f => { const st = await fs.stat(path.join(cmsDir, f)); return { id: 'cms/' + f, at: st.mtime.toISOString(), size: st.size, file: path.join(cmsDir, f) }; }));
  };
  return {
    kind: 'file', uploadsDir: upDir,
    listVersions,
    async readVersion(v) { return JSON.parse(await fs.readFile(v.file, 'utf8')); },
    async writeVersion(data) {
      await ensure(cmsDir);
      const name = stamp() + '.json';
      await fs.writeFile(path.join(cmsDir, name), JSON.stringify(data));
      const files = (await fs.readdir(cmsDir)).filter(f => f.endsWith('.json')).sort().reverse();
      await Promise.all(paraApagar(files.map(f => ({ f, at: dataDoNome(f) }))).map(x => fs.unlink(path.join(cmsDir, x.f)).catch(() => {})));
      return { id: 'cms/' + name, at: new Date().toISOString() };
    },
    async lerAtual() { const [v] = await listVersions(); return v ? { id: v.id, at: v.at, content: JSON.parse(await fs.readFile(v.file, 'utf8')) } : null; },
    async readAuth() { try { return JSON.parse(await fs.readFile(authFile, 'utf8')); } catch { return null; } },
    async writeAuth(data) { await ensure(dir); await fs.writeFile(authFile, JSON.stringify(data)); },
    async saveImage(buf, _contentType, ext) {
      await ensure(upDir);
      const name = `${stamp()}.${ext}`;
      await fs.writeFile(path.join(upDir, name), buf);
      return '/uploads/' + name;
    },
    async listUploads() {
      await ensure(upDir);
      const nomes = (await fs.readdir(upDir)).filter(f => !f.startsWith('.'));
      return Promise.all(nomes.map(async f => ({ url: '/uploads/' + f, at: (await fs.stat(path.join(upDir, f))).mtime.toISOString(), file: path.join(upDir, f) })));
    },
    async apagarUploads(itens) { await Promise.all(itens.map(x => fs.unlink(x.file))); },
    async apagarVersoes(itens) { await Promise.all(itens.map(x => fs.unlink(x.file))); },
  };
}

// Na Vercel sem Blob Store conectado (ex.: previews): o site funciona com o conteúdo padrão,
// mas salvar retorna um aviso claro em vez de erro genérico.
function semArmazenamento() {
  const erro = () => { const e = new Error('Armazenamento não configurado: conecte um Blob Store ao projeto na Vercel e faça um novo deploy.'); e.status = 503; throw e; };
  return {
    kind: 'nenhum', listVersions: async () => [], readVersion: erro, writeVersion: erro, lerAtual: async () => null,
    readAuth: async () => null, writeAuth: erro, saveImage: erro, listUploads: async () => [], apagarUploads: erro, apagarVersoes: erro,
  };
}

let instancia;
export function getStorage() {
  if (!instancia) {
    instancia = process.env.BLOB_READ_WRITE_TOKEN ? blobStorage()
      : process.env.VERCEL ? semArmazenamento()
      : fileStorage(path.resolve(process.env.DATA_DIR || 'data'));
  }
  return instancia;
}
