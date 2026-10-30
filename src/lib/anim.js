// Animações GSAP + ScrollTrigger (mesma coreografia do protótipo):
// - [data-hero]: entrada em cascata do texto, imagem com leve parallax, entrada dos selos flutuantes (sem vaivém infinito)
// - [data-reveal]: seções revelam ao rolar; filhos de [data-grid] entram em stagger
// - [data-count]: contadores; [data-marquee-track]: faixa rolante (pausável: ver pausarFaixa)
// Este módulo (com o GSAP) é carregado sob demanda por anim-lazy.js, que também confere "reduzir movimento".
// Página que veio pronta do build (window.__odlPre): o conteúdo já está na tela quando o GSAP chega, então na
// primeira carga nada que está visível é escondido para animar — só o parallax e o que está abaixo da dobra.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
const CP = 'opacity,transform';

// Elemento já visível na tela (topo acima da borda de baixo da janela).
const naTela = (el) => el.getBoundingClientRect().top < window.innerHeight;

// Animação da faixa rolante, guardada pelo elemento, para o botão "pausar animação" e as pausas automáticas
// (mouse, foco e faixa fora da tela) controlarem. data-pausada="true" no trilho: a animação já nasce parada.
const faixas = new WeakMap();
export const pausarFaixa = (trilho, pausar) => { const tw = trilho && faixas.get(trilho); if (tw) tw.paused(pausar); };

function animarPagina(root, footer, transicao) {
  const main = root;
  // Entrada completa: troca de página ou página montada pelo navegador (sem HTML do build na tela).
  const entrada = transicao || !window.__odlPre;
  if (transicao) gsap.fromTo(main, { opacity: 0 }, { opacity: 1, duration: .45, ease: 'power1.out', clearProps: 'opacity' });

  main.querySelectorAll('[data-hero]').forEach(hero => {
    // Mídia (entra depois e tem parallax): os filhos marcados com [data-hero-media] ou, sem marca, do 2º filho em diante.
    const filhos = Array.from(hero.children);
    const marcadas = filhos.filter(el => el.hasAttribute('data-hero-media'));
    const media = marcadas.length ? marcadas : filhos.slice(1);
    const multi = media.length > 0;
    const text = [...(filhos[0]?.children || []), ...filhos.slice(1).filter(el => !media.includes(el))];
    const floats = hero.querySelectorAll('[data-float]');
    if (entrada) {
      const tl = gsap.timeline({ delay: transicao ? .1 : .25 });
      tl.fromTo(text, { y: 48, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: .12, ease: 'power3.out', clearProps: CP });
      if (multi) tl.fromTo(media, { y: 40, opacity: 0, scale: .96 }, { y: 0, opacity: 1, scale: 1, duration: 1.1, ease: 'power3.out', clearProps: 'opacity' }, '-=.75');
      if (floats.length) tl.fromTo(floats, { y: 20, opacity: 0, scale: .9 }, { y: 0, opacity: 1, scale: 1, duration: .7, stagger: .15, ease: 'back.out(1.6)', clearProps: 'opacity' }, '-=.5');
    }
    if (multi) gsap.to(media, { y: -40, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  });

  const track = main.querySelector('[data-marquee-track]');
  if (track) {
    const half = track.scrollWidth / 2;
    if (half > 0) {
      const tw = gsap.fromTo(track, { x: 0 }, { x: -half, duration: 28, ease: 'none', repeat: -1, paused: track.dataset.pausada === 'true' });
      faixas.set(track, tw);
    }
  }

  main.querySelectorAll('[data-reveal] figure').forEach(fig => gsap.to(fig, { y: -12, ease: 'none', scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: 1 } }));

  main.querySelectorAll('[data-reveal]').forEach(s => {
    if (!entrada && naTela(s)) return;
    const alvos = Array.from(s.children);
    s.querySelectorAll('[data-grid],[data-grid-produtos]').forEach(g => { const i = alvos.indexOf(g); if (i > -1) alvos.splice(i, 1, ...g.children); });
    if (alvos.length) gsap.fromTo(alvos, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .9, stagger: .07, ease: 'power3.out', clearProps: CP, scrollTrigger: { trigger: s, start: 'top 82%', once: true } });
  });

  if (footer && footer.children[0] && (entrada || !naTela(footer))) gsap.fromTo(footer.children[0].children, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .8, stagger: .08, ease: 'power3.out', clearProps: CP, scrollTrigger: { trigger: footer, start: 'top 90%', once: true } });

  main.querySelectorAll('[data-count]').forEach(el => {
    if (!entrada && naTela(el)) return;
    const fim = +el.dataset.count || 0, pre = el.dataset.prefix || '', suf = el.dataset.suffix || '', o = { v: 0 };
    gsap.to(o, { v: fim, duration: 1.8, ease: 'power2.out', onUpdate: () => { el.textContent = pre + Math.round(o.v) + suf; }, onComplete: () => { el.textContent = pre + fim + suf; }, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });

  // Limpeza chamada pelo gsap.context ao desfazer as animações.
  return () => { if (track) faixas.delete(track); };
}

// Liga as animações da página atual (chamado por useAnimacoesPagina, em anim-lazy.js). Devolve a limpeza.
// A altura da página pode mudar depois (filtro da vitrine, conteúdo novo vindo da API, fotos carregando): os pontos
// de início das animações são recalculados a cada mudança de tamanho do body (agrupado num quadro). Sem isso, o
// rodapé e a última seção, que começam invisíveis, ficariam além do fim da rolagem e nunca apareceriam.
export function ligarAnimacoesPagina(main, footer, transicao) {
  const ctx = gsap.context(() => animarPagina(main, footer, transicao));
  const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
  let ativo = true, quadro = 0;
  if (document.fonts) document.fonts.ready.then(() => { if (ativo) ScrollTrigger.refresh(); });
  const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(() => {
    cancelAnimationFrame(quadro);
    quadro = requestAnimationFrame(() => { if (ativo) ScrollTrigger.refresh(); });
  });
  ro?.observe(document.body);
  return () => { ativo = false; cancelAnimationFrame(raf); cancelAnimationFrame(quadro); ro?.disconnect(); ctx.revert(); };
}

export function animarGrade(el) {
  gsap.fromTo(el.children, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .55, stagger: .05, ease: 'power3.out', overwrite: 'auto', clearProps: CP });
}

export function animarEntradaHeader(header, fab) {
  const ctx = gsap.context(() => {
    if (header) gsap.fromTo(header, { y: -72, opacity: 0 }, { y: 0, opacity: 1, duration: .8, ease: 'power3.out', clearProps: CP });
    if (fab) gsap.from(fab, { scale: 0, opacity: 0, duration: .7, ease: 'back.out(1.8)', delay: 1.2, clearProps: CP });
  });
  return () => ctx.revert();
}

export function animarMenu(menu) {
  gsap.from(menu.querySelectorAll('nav > a'), { x: -24, opacity: 0, duration: .5, stagger: .06, ease: 'power3.out', clearProps: CP });
}
