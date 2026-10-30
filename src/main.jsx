import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App, { ErroGeral } from './App.jsx';
import { ContentProvider, limparCache } from './state/content.jsx';
// Fontes servidas pelo próprio site (sem Google Fonts): só os pesos usados, só o alfabeto latino.
import '@fontsource/outfit/latin-300.css';
import '@fontsource/outfit/latin-400.css';
import '@fontsource/outfit/latin-500.css';
import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-500.css';
import './styles.css';

const raiz = document.getElementById('root');
// Página pronta do build (HTML gerado para o Google e para abrir rápido): o conteúdo usado para gerá-la vem junto,
// em #odl-inicial, e o site monta na hora, sem esperar a API. As animações de entrada leem window.__odlPre.
window.__odlPre = raiz.hasChildNodes();
const lerInicial = () => {
  try { const el = document.getElementById('odl-inicial'); return el ? JSON.parse(el.textContent) : null; } catch { return null; }
};
const inicial = window.__odlPre ? lerInicial() : null;

// Erro fora da rede de segurança (ErroGeral): apaga a cópia local do conteúdo, para a próxima visita não travar de novo.
createRoot(raiz, { onUncaughtError: (erro) => { limparCache(); console.error(erro); } }).render(
  <StrictMode>
    <ErroGeral>
      <ContentProvider inicial={inicial && typeof inicial === 'object' ? inicial : null}>
        <App />
      </ContentProvider>
    </ErroGeral>
  </StrictMode>,
);
