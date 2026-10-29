// Depois do build: gera o HTML pronto de cada página pública, com título, descrição, link canônico,
// Open Graph e dados estruturados próprios — o Google lê tudo sem precisar executar o JavaScript.
// Também gera sitemap.xml, robots.txt, 404.html e app.html (página "vazia" para rotas não geradas, como /admin).
// O conteúdo usado é o último salvo no painel (Blob ou ./data), ou o padrão; cada deploy atualiza as páginas,
// e no navegador o site sempre busca o conteúdo atual.
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { getStorage } from '../server/storage.js';

const DIST = path.resolve('dist');
const SSR = path.resolve('dist-ssr/entry-server.js');
const SITE = (process.env.SITE_URL
  || (process.env.VERCEL_PROJECT_PRODUCTION_URL && 'https://' + process.env.VERCEL_PROJECT_PRODUCTION_URL)
  || 'https://otica-rinopolis.vercel.app').replace(/\/+$/, '');

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const jsonScript = (o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`;

async function conteudoSalvo() {
  try {
    const [ultima] = await getStorage().listVersions();
    if (!ultima) return null;
    const v = await getStorage().readVersion(ultima);
    return v && v.content ? v.content : v;
  } catch (e) {
    console.warn('prerender: usando conteúdo padrão (' + e.message + ')');
    return null;
  }
}

function cabecalho(m, blocos) {
  const url = SITE + m.caminho;
  const img = m.imagem ? (/^https?:\/\//.test(m.imagem) ? m.imagem : SITE + m.imagem) : '';
  return [
    `<title>${esc(m.titulo)}</title>`,
    m.descricao ? `<meta name="description" content="${esc(m.descricao)}" />` : '',
    m.noindex ? '<meta name="robots" content="noindex" />' : `<link rel="canonical" href="${esc(url)}" />`,
    `<meta property="og:title" content="${esc(m.titulo)}" />`,
    m.descricao ? `<meta property="og:description" content="${esc(m.descricao)}" />` : '',
    `<meta property="og:type" content="${m.tipo}" />`,
    m.noindex ? '' : `<meta property="og:url" content="${esc(url)}" />`,
    img ? `<meta property="og:image" content="${esc(img)}" />` : '',
    `<meta name="twitter:title" content="${esc(m.titulo)}" />`,
    m.descricao ? `<meta name="twitter:description" content="${esc(m.descricao)}" />` : '',
    img ? `<meta name="twitter:image" content="${esc(img)}" />` : '',
    ...blocos.map(jsonScript),
  ].filter(Boolean).join('\n    ');
}

async function main() {
  const ssr = await import(pathToFileURL(SSR).href);
  const salvo = await conteudoSalvo();
  const cms = ssr.mesclar(salvo);
  const modelo = await fs.readFile(path.join(DIST, 'index.html'), 'utf8');
  if (!modelo.includes('<!--seo-->') || !modelo.includes('<div id="root"></div>')) throw new Error('index.html sem os marcadores esperados');
  const pagina = (r, caminho) => {
    const m = ssr.metaPagina(r, cms);
    const corpo = ssr.render(caminho, salvo);
    return modelo
      .replace(/<!--seo-->[\s\S]*?<!--\/seo-->/, cabecalho(m, m.noindex ? [] : ssr.jsonLd(r, cms, SITE)))
      .replace('<div id="root"></div>', `<div id="root">${corpo}</div>`);
  };

  // Página "vazia" (só o app) para rotas sem HTML gerado: /admin e artigos novos do blog.
  await fs.writeFile(path.join(DIST, 'app.html'), modelo.replace(/<!--seo-->|<!--\/seo-->/g, ''));

  const rotas = ssr.rotasPublicas(cms);
  for (const r of rotas) {
    const caminho = ssr.caminhoDe(r.page, r.slug);
    const arq = caminho === '/' ? 'index.html' : caminho.slice(1) + '.html';
    await fs.mkdir(path.dirname(path.join(DIST, arq)), { recursive: true });
    await fs.writeFile(path.join(DIST, arq), pagina(r, caminho));
  }
  await fs.writeFile(path.join(DIST, '404.html'), pagina({ page: 'naoEncontrada' }, '/404'));

  // sitemap.xml e robots.txt com o endereço do site.
  const hoje = new Date().toISOString().slice(0, 10);
  const atualizado = (cms.meta?.atualizadoEm || '').slice(0, 10) || hoje;
  const PRIORIDADE = { inicio: '1.0', armacoes: '0.9', lentes: '0.9', contato: '0.8', convenios: '0.8', sobre: '0.7', blog: '0.6', post: '0.5' };
  const urls = rotas.map(r => {
    const post = r.page === 'post' ? ssr.metaPagina(r, cms).post : null;
    const lastmod = (post && ssr.dataIso(post.data)) || atualizado;
    return `  <url><loc>${esc(SITE + ssr.caminhoDe(r.page, r.slug))}</loc><lastmod>${lastmod}</lastmod><priority>${PRIORIDADE[r.page]}</priority></url>`;
  });
  await fs.writeFile(path.join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);
  await fs.writeFile(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nSitemap: ${SITE}/sitemap.xml\n`);

  await fs.rm(path.resolve('dist-ssr'), { recursive: true, force: true });
  console.log(`prerender: ${rotas.length} páginas + 404 geradas para ${SITE} (conteúdo ${salvo ? 'salvo no painel' : 'padrão'})`);
}

main().catch((e) => { console.error(e); process.exit(1); });
