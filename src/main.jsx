import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { ContentProvider, temCacheLocal } from './state/content.jsx';
import { api } from './lib/api.js';
import './styles.css';

const raiz = document.getElementById('root');
const montar = (inicial) => createRoot(raiz).render(
  <StrictMode>
    <ContentProvider inicial={inicial}>
      <App />
    </ContentProvider>
  </StrictMode>,
);

// A página pode vir pronta do build (HTML gerado para o Google e para abrir rápido).
// Sem cópia local do conteúdo, ela continua na tela até o conteúdo atual chegar, em vez de trocar pela tela de carregamento.
if (raiz.hasChildNodes() && !temCacheLocal()) {
  Promise.race([api.conteudo(false), new Promise((_, rej) => setTimeout(rej, 4000))])
    .then(r => montar({ content: r.content, version: r.version }), () => montar());
} else {
  montar();
}
