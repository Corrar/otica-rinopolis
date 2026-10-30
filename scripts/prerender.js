// Depois do build: gera o HTML pronto de cada página pública, com título, descrição, link canônico,
// Open Graph e dados estruturados próprios — o Google lê tudo sem precisar executar o JavaScript.
// Também gera sitemap.xml, robots.txt, 404.html e app.html (página "vazia" para rotas não geradas, como /admin).
// O conteúdo usado é o último salvo no painel (Blob ou ./data), ou o padrão; cada deploy atualiza as páginas.
// Esse conteúdo vai embutido em cada página (#odl-inicial): o site monta na hora com ele e confere a versão atual
// em segundo plano. Se o armazenamento estiver configurado e falhar, o build falha (a Vercel mantém o deploy
// anterior) em vez de publicar o conteúdo padrão por cima do que o proprietário salvou.
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

// { content, version } da versão mais recente, ou null sem nada salvo.
async function conteudoSalvo() {
  try {
    const [ultima] = await getStorage().listVersions();
    if (!ultima) return null;
    const v = await getStorage().readVersion(ultima);
    return { content: v && v.content ? v.content : v, version: ultima.id };
  } catch (e) {
    if (process.env.BLOB_READ_WRITE_TOKEN || process.env.DATA_DIR) throw new Error('prerender: não foi possível ler o conteúdo salvo (' + e.message + '). Build interrompido para não publicar o conteúdo padrão.');
    console.warn('prerender: usando conteúdo padrão (' + e.message + ')');
    return null;
  }
}

// JSON dentro de <script>: "<" escapado não deixa o texto fechar a tag nem abrir comentário.
const jsonSeguro = (o) => JSON.stringify(o).replace(/</g, '\\u003c');

// No início do HTML gerado, o React põe os <link rel="preload"> que achou (ex.: logo); o lugar deles é o <head>.
// A foto principal dentro de <picture> não ganha preload do React: ele é criado aqui, com as versões WebP.
function separarPreloads(corpo) {
  const inicio = /^(?:<link rel="preload"[^>]*\/>)+/.exec(corpo);
  const links = inicio ? inicio[0].match(/<link[^>]*\/>/g) : [];
  const resto = inicio ? corpo.slice(inicio[0].length) : corpo;
  const foto = /<picture><source type="image\/webp" srcSet="([^"]+)" sizes="([^"]+)"\/><img [^>]*fetchPriority="high"/.exec(resto);
  if (foto) links.push(`<link rel="preload" as="image" type="image/webp" imagesrcset="${foto[1]}" imagesizes="${foto[2]}" fetchpriority="high" />`);
  return { links, corpo: resto };
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

// Fontes do texto mais usado (títulos finos e corpo): começam a baixar junto com o CSS.
async function preloadFontes() {
  const nomes = await fs.readdir(path.join(DIST, 'assets'));
  return ['outfit-latin-300-normal', 'dm-sans-latin-400-normal']
    .map(base => nomes.find(n => n.startsWith(base + '-') && n.endsWith('.woff2')))
    .filter(Boolean)
    .map(n => `<link rel="preload" as="font" type="font/woff2" href="/assets/${n}" crossorigin />`);
}

async function main() {
  const ssr = await import(pathToFileURL(SSR).href);
  const salvo = await conteudoSalvo();
  const content = salvo ? salvo.content : null;
  const cms = ssr.mesclar(content);
  const fontes = await preloadFontes();
  const bruto = await fs.readFile(path.join(DIST, 'index.html'), 'utf8');
  if (!bruto.includes('<!--seo-->') || !bruto.includes('<div id="root"></div>') || !bruto.includes('</head>') || !bruto.includes('</body>')) throw new Error('index.html sem os marcadores esperados');
  // Substituições por função: o texto inserido pode ter "$" (ex.: "$$", preços), que no replace com string vira padrão especial.
  const modelo = bruto.replace(/(\s*)<\/head>/, (_, esp) => fontes.map(l => '\n    ' + l).join('') + esp + '</head>');
  const inicial = `<script id="odl-inicial" type="application/json">${jsonSeguro({ content, version: salvo ? salvo.version : null })}</script>`;
  const pagina = (r, caminho) => {
    const m = ssr.metaPagina(r, cms);
    const { links, corpo } = separarPreloads(ssr.render(caminho, content));
    return modelo
      .replace(/<!--seo-->[\s\S]*?<!--\/seo-->/, () => [cabecalho(m, m.noindex ? [] : ssr.jsonLd(r, cms, SITE)), ...links].join('\n    '))
      .replace('<div id="root"></div>', () => `<div id="root">${corpo}</div>`)
      .replace(/(\s*)<\/body>/, (_, esp) => '\n    ' + inicial + esp + '</body>');
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
  const PRIORIDADE = { inicio: '1.0', armacoes: '0.9', lentes: '0.9', contato: '0.8', convenios: '0.8', sobre: '0.7', blog: '0.6', post: '0.5', 'politica-de-privacidade': '0.2', 'termos-de-uso': '0.2', acessibilidade: '0.2' };
  const urls = rotas.map(r => {
    const post = r.page === 'post' ? ssr.metaPagina(r, cms).post : null;
    const lastmod = (post && ssr.dataIso(post.data)) || atualizado;
    return `  <url><loc>${esc(SITE + ssr.caminhoDe(r.page, r.slug))}</loc><lastmod>${lastmod}</lastmod><priority>${PRIORIDADE[r.page] || '0.5'}</priority></url>`;
  });
  await fs.writeFile(path.join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);
  await fs.writeFile(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nSitemap: ${SITE}/sitemap.xml\n`);

  await fs.rm(path.resolve('dist-ssr'), { recursive: true, force: true });
  console.log(`prerender: ${rotas.length} páginas + 404 geradas para ${SITE} (conteúdo ${salvo ? 'salvo no painel' : 'padrão'})`);
}

main().catch((e) => { console.error(e); process.exit(1); });
