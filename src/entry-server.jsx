// Entrada usada só no build: gera o HTML de cada página (scripts/prerender.js).
import { renderToString } from 'react-dom/server';
import App from './App.jsx';
import { ContentProvider } from './state/content.jsx';
import { definirCaminhoServidor } from './lib/router.js';

export { mesclar } from './content/defaults.js';
export { metaPagina, jsonLd, rotasPublicas, caminhoDe, absolutoUrl, dataIso } from './lib/seo.js';

export function render(caminho, content) {
  definirCaminhoServidor(caminho);
  return renderToString(
    <ContentProvider inicial={{ content, version: null }}>
      <App />
    </ContentProvider>,
  );
}
