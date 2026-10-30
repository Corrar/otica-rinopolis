// Roteador mínimo baseado em history (URLs limpas: /sobre, /blog/<artigo>, /admin).
import { useEffect, useSyncExternalStore } from 'react';
import { PAGINAS_LEGAIS } from './seo.js';

const ouvintes = new Set();
const avisar = () => ouvintes.forEach(f => f());
const assinar = (f) => { ouvintes.add(f); window.addEventListener('popstate', f); return () => { ouvintes.delete(f); window.removeEventListener('popstate', f); }; };

export function navegar(para, { replace = false } = {}) {
  if (para === location.pathname) { window.scrollTo(0, 0); return; }
  history[replace ? 'replaceState' : 'pushState'](null, '', para);
  window.scrollTo(0, 0);
  avisar();
}

// No build (HTML gerado de cada página) não há location: o caminho vem de definirCaminhoServidor.
let caminhoServidor = '/';
export const definirCaminhoServidor = (p) => { caminhoServidor = p; };
export const usePath = () => useSyncExternalStore(assinar, () => location.pathname, () => caminhoServidor);

// Links antigos do protótipo usavam #pagina na raiz (ex.: site.com/#admin) — redireciona para a URL limpa.
// Só na raiz: em outras páginas o # é uma seção da própria página (ex.: /termos-de-uso#contato).
export function useHashLegado() {
  useEffect(() => {
    if (location.pathname !== '/') return;
    const h = location.hash.replace('#', '');
    if (/^(inicio|sobre|armacoes|lentes|convenios|blog|contato|admin)$/.test(h)) navegar(h === 'inicio' ? '/' : '/' + h, { replace: true });
  }, []);
}

// Converte o caminho na página atual.
export function rota(path) {
  const [, a = '', b = ''] = path.replace(/\/+$/, '').split('/');
  if (a === '') return { page: 'inicio' };
  if (a === 'blog' && b) return { page: 'post', slug: (() => { try { return decodeURIComponent(b); } catch { return b; } })() };
  if (['sobre', 'armacoes', 'lentes', 'convenios', 'blog', 'contato', 'admin', ...PAGINAS_LEGAIS].includes(a)) return { page: a };
  return { page: 'naoEncontrada' };
}

export const href = (page) => (page === 'inicio' ? '/' : '/' + page);

// Link interno que navega sem recarregar.
export function onLink(para, extra) {
  return (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault(); extra && extra(); navegar(para);
  };
}
