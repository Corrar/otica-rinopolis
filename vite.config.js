import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

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

export default defineConfig({
  plugins: [react(), apiLocal()],
  server: { watch: { ignored: ['**/data/**'] } },
});
