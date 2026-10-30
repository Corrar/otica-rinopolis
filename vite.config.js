import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fotosResponsivas from './scripts/fotos-responsivas.js';

// Em desenvolvimento, a mesma API das funções da Vercel roda dentro do Vite.
const apiLocal = () => ({
  name: 'odl-api-local',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (req.url.startsWith('/api/')) {
        const { handleApi } = await server.ssrLoadModule('/server/router.js');
        return handleApi(req, res);
      }
      if (req.url.startsWith('/uploads/')) {
        const { serveUpload } = await server.ssrLoadModule('/server/static.js');
        if (await serveUpload(req, res)) return;
      }
      next();
    });
  },
});

// Endereço oficial do site (link canônico, Open Graph, sitemap e dados estruturados): SITE_URL, ou o domínio de
// produção da Vercel, ou o endereço padrão. Vai fixo no código como __SITE__ (lido em src/lib/seo.js).
const SITE = (process.env.SITE_URL
  || (process.env.VERCEL_PROJECT_PRODUCTION_URL && 'https://' + process.env.VERCEL_PROJECT_PRODUCTION_URL)
  || 'https://otica-rinopolis.vercel.app').replace(/\/+$/, '');

export default defineConfig({
  plugins: [react(), apiLocal(), fotosResponsivas()],
  define: { __SITE__: JSON.stringify(SITE) },
  server: { watch: { ignored: ['**/data/**'] } },
});
