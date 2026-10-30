// Animações sob demanda: o GSAP (anim.js) fica fora do pacote principal e só é baixado quando a primeira
// animação é pedida. Nada começa invisível enquanto ele carrega: a entrada da página pronta do build não
// esconde o que já está na tela (ver anim.js), e depois de carregado tudo roda na hora, sem esperar.
import { useLayoutEffect, useRef } from 'react';

let modulo = null, promessa = null;
const carregar = () => (promessa ??= import('./anim.js').then(m => (modulo = m)));
// Com o módulo já carregado, chama na hora (no mesmo quadro); senão, assim que ele chegar.
const comModulo = (fn) => { if (modulo) fn(modulo); else carregar().then(fn, () => {}); };

export const reduzMovimento = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Faixa rolante: antes do GSAP chegar ainda não há animação para pausar (ela já nasce parada pelo data-pausada).
export const pausarFaixa = (trilho, pausar) => { if (modulo) modulo.pausarFaixa(trilho, pausar); };

// Liga as animações da página atual; refaz a cada troca de página (key).
export function useAnimacoesPagina(mainRef, footerRef, key, ativo) {
  const primeira = useRef(true);
  useLayoutEffect(() => {
    const main = mainRef.current;
    const transicao = !primeira.current; primeira.current = false;
    if (!main || !ativo || reduzMovimento()) return undefined;
    let desfazer = null, cancelado = false;
    comModulo(m => { if (!cancelado) desfazer = m.ligarAnimacoesPagina(main, footerRef.current, transicao); });
    return () => { cancelado = true; if (desfazer) desfazer(); };
  }, [key, ativo]); // eslint-disable-line react-hooks/exhaustive-deps
}

export function animarGrade(el) {
  if (el && !reduzMovimento()) comModulo(m => m.animarGrade(el));
}

export function animarMenu(menu) {
  if (menu && !reduzMovimento()) comModulo(m => { if (menu.isConnected) m.animarMenu(menu); });
}

// Devolve a limpeza (para o useLayoutEffect).
export function animarEntradaHeader(header, fab) {
  if (reduzMovimento()) return () => {};
  let desfazer = null, cancelado = false;
  comModulo(m => { if (!cancelado) desfazer = m.animarEntradaHeader(header, fab); });
  return () => { cancelado = true; if (desfazer) desfazer(); };
}
