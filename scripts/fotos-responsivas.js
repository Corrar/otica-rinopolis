// Plugin do Vite: imagens responsivas para as fotos do site (public/fotos).
// - No build, gera versões WebP de cada foto em 480, 800 e 1200 px de largura (sem ampliar: a maior é a largura
//   original), salvas ao lado da original como /fotos/<nome>-<largura>.webp.
// - O módulo "virtual:fotos" diz ao site quais larguras existem ({ '/fotos/fachada.jpg': [480, 800, 960] });
//   o componente Img (src/components/bits.jsx) monta o srcset com elas e mantém o JPEG como reserva.
// - No desenvolvimento (npm run dev), as versões são geradas na hora em que o navegador pede.
// Sem o sharp instalado, nada é gerado e o site usa só as fotos originais.
import { promises as fs } from 'node:fs';
import path from 'node:path';

const LARGURAS = [480, 800, 1200];
const QUALIDADE = 74;
const PASTA = path.resolve('public/fotos');
const ID = 'virtual:fotos';
const ID_RESOLVIDO = '\0' + ID;
const EXTENSOES = /\.(jpe?g|png)$/i;

let sharpMod;
const carregarSharp = async () => {
  if (sharpMod === undefined) sharpMod = await import('sharp').then(m => m.default, () => null);
  return sharpMod;
};

// Larguras de cada foto (só as menores que a original, mais a própria largura original).
async function lerFotos() {
  const sharp = await carregarSharp();
  if (!sharp) return {};
  let nomes = [];
  try { nomes = (await fs.readdir(PASTA)).filter(n => EXTENSOES.test(n)); } catch { return {}; }
  const fotos = {};
  for (const nome of nomes.sort()) {
    const { width } = await sharp(path.join(PASTA, nome)).metadata();
    if (!width) continue;
    const larguras = LARGURAS.filter(w => w < width);
    if (width <= Math.max(...LARGURAS)) larguras.push(width);
    fotos['/fotos/' + nome] = larguras;
  }
  return fotos;
}

const variante = (src, w) => src.replace(EXTENSOES, '') + '-' + w + '.webp';
const gerar = async (arquivo, w) => (await carregarSharp())(arquivo).resize({ width: w, withoutEnlargement: true }).webp({ quality: QUALIDADE, effort: 5 }).toBuffer();

export default function fotosResponsivas() {
  let fotos, ssr = false;
  const mapa = async () => (fotos ??= await lerFotos());
  return {
    name: 'odl-fotos-responsivas',
    configResolved(config) { ssr = !!config.build.ssr; },
    resolveId(id) { return id === ID ? ID_RESOLVIDO : null; },
    async load(id) {
      if (id !== ID_RESOLVIDO) return null;
      return `export default ${JSON.stringify(await mapa())};`;
    },
    // Build do navegador: grava as versões WebP em dist/fotos (o build SSR só precisa da lista).
    async generateBundle() {
      if (ssr) return;
      const lista = await mapa();
      for (const [src, larguras] of Object.entries(lista)) {
        const arquivo = path.join(PASTA, path.basename(src));
        for (const w of larguras) this.emitFile({ type: 'asset', fileName: variante(src, w).slice(1), source: await gerar(arquivo, w) });
      }
      const total = Object.values(lista).reduce((n, l) => n + l.length, 0);
      this.info(total ? `${total} versões WebP de ${Object.keys(lista).length} fotos` : 'sharp indisponível: fotos sem versões WebP');
    },
    configureServer(server) {
      const cache = new Map();
      server.middlewares.use(async (req, res, next) => {
        const m = /^\/fotos\/([^/?]+)-(\d+)\.webp(?:\?|$)/.exec(req.url || '');
        if (!m) return next();
        try {
          const lista = await mapa();
          const src = Object.keys(lista).find(s => variante(s, +m[2]) === `/fotos/${m[1]}-${m[2]}.webp` && lista[s].includes(+m[2]));
          if (!src) return next();
          const chave = src + '@' + m[2];
          if (!cache.has(chave)) cache.set(chave, await gerar(path.join(PASTA, path.basename(src)), +m[2]));
          res.setHeader('Content-Type', 'image/webp');
          res.end(cache.get(chave));
        } catch (e) { next(e); }
      });
    },
  };
}
