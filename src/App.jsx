import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { IconSprite, Ic } from './components/Icons.jsx';
import { Footer, Header, MobileMenu, NovaAba, PromoBar, ScrollExtras, useLargura } from './components/Layout.jsx';
import { useContent, useSite } from './state/content.jsx';
import { rota, useHashLegado, usePath } from './lib/router.js';
import { useToast } from './lib/toast.js';
import { absolutoUrl, metaPagina } from './lib/seo.js';
import { animarEntradaHeader, useAnimacoesPagina } from './lib/anim.js';
import Inicio from './pages/Inicio.jsx';
import Sobre from './pages/Sobre.jsx';
import Armacoes from './pages/Armacoes.jsx';
import Lentes from './pages/Lentes.jsx';
import Convenios from './pages/Convenios.jsx';
import Contato from './pages/Contato.jsx';
import { Artigo, Blog, NaoEncontrada } from './pages/Blog.jsx';
import Privacidade from './pages/Privacidade.jsx';
import Termos from './pages/Termos.jsx';
import Acessibilidade from './pages/Acessibilidade.jsx';

const Admin = lazy(() => import('./admin/Admin.jsx'));

// Mantém título, descrição, link canônico e Open Graph de acordo com a página
// (o HTML gerado no build já vem com essas tags; aqui elas acompanham a navegação).
function Seo({ r }) {
  const { cms } = useSite();
  useEffect(() => {
    const m = metaPagina(r, cms);
    const tag = (sel, criar) => { let el = document.head.querySelector(sel); if (!el) { el = criar(); document.head.appendChild(el); } return el; };
    const meta = (attr, nome, valor) => {
      const sel = `meta[${attr}="${nome}"]`;
      if (valor == null || valor === '') { document.head.querySelector(sel)?.remove(); return; }
      tag(sel, () => { const el = document.createElement('meta'); el.setAttribute(attr, nome); return el; }).setAttribute('content', valor);
    };
    const url = location.origin + m.caminho;
    document.title = m.titulo;
    meta('name', 'description', m.descricao);
    meta('name', 'robots', m.noindex ? 'noindex' : null);
    meta('property', 'og:title', m.titulo);
    meta('property', 'og:description', m.descricao);
    meta('property', 'og:url', url);
    meta('property', 'og:type', m.tipo);
    meta('property', 'og:image', absolutoUrl(m.imagem, location.origin));
    meta('name', 'twitter:title', m.titulo);
    meta('name', 'twitter:description', m.descricao);
    meta('name', 'twitter:image', absolutoUrl(m.imagem, location.origin));
    if (m.noindex) document.head.querySelector('link[rel="canonical"]')?.remove();
    else tag('link[rel="canonical"]', () => Object.assign(document.createElement('link'), { rel: 'canonical' })).href = url;
  }, [r.page, r.slug, cms]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

function Site() {
  useHashLegado();
  const path = usePath();
  const r = rota(path);
  const { info, wa, animar } = useSite();
  // Largura só para fechar o menu do celular ao alargar a janela (o resto da responsividade é por CSS).
  const wide = useLargura() >= 980;
  const [menuOpen, setMenuOpen] = useState(false);
  const [anuncio, setAnuncio] = useState('');
  const toast = useToast();
  const mainRef = useRef(null), footerRef = useRef(null), headerRef = useRef(null), fabRef = useRef(null), burgerRef = useRef(null);
  const rotaAnterior = useRef(path);
  const ativa = r.page === 'post' ? 'blog' : r.page;
  const admin = r.page === 'admin';
  const fab = info.botaoFlutuante !== false && !admin;

  useEffect(() => setMenuOpen(false), [path]);
  useEffect(() => { if (wide) setMenuOpen(false); }, [wide]);
  // Troca de página: foco no início do conteúdo e o título da nova página anunciado ao leitor de tela
  // (o efeito do Seo, componente filho, já atualizou document.title).
  useEffect(() => {
    if (rotaAnterior.current === path) return; // primeira renderização (inclusive a repetição do StrictMode)
    rotaAnterior.current = path;
    mainRef.current?.focus({ preventScroll: true });
    setAnuncio(document.title);
  }, [path]);
  useLayoutEffect(() => (animar ? animarEntradaHeader(headerRef.current, fabRef.current) : undefined), []); // eslint-disable-line react-hooks/exhaustive-deps
  useAnimacoesPagina(mainRef, footerRef, path, animar && !admin);

  let pagina;
  switch (r.page) {
    case 'inicio': pagina = <Inicio />; break;
    case 'sobre': pagina = <Sobre />; break;
    case 'armacoes': pagina = <Armacoes />; break;
    case 'lentes': pagina = <Lentes />; break;
    case 'convenios': pagina = <Convenios />; break;
    case 'blog': pagina = <Blog />; break;
    case 'post': pagina = <Artigo slug={r.slug} />; break;
    case 'contato': pagina = <Contato />; break;
    case 'politica-de-privacidade': pagina = <Privacidade />; break;
    case 'termos-de-uso': pagina = <Termos />; break;
    case 'acessibilidade': pagina = <Acessibilidade />; break;
    case 'admin': pagina = <Suspense fallback={<div className="loading"><span className="spinner" /></div>}><Admin wide={wide} /></Suspense>; break;
    default: pagina = <NaoEncontrada />;
  }

  // Com o menu do celular aberto, o que fica atrás dele é inerte (sem foco nem leitura).
  return (
    <div className={`app${fab ? ' app--fab' : ''}${menuOpen ? ' app--menu' : ''}${animar ? '' : ' app--estatico'}`}>
      <a href="#conteudo" className="skip" inert={menuOpen}>pular para o conteúdo</a>
      <Seo r={r} />
      <PromoBar inert={menuOpen} />
      <Header ref={headerRef} ativa={ativa} menuOpen={menuOpen} setMenuOpen={setMenuOpen} burgerRef={burgerRef} />
      {menuOpen && <MobileMenu ativa={ativa} fechar={() => setMenuOpen(false)} animar={animar} headerRef={headerRef} burgerRef={burgerRef} />}
      <main id="conteudo" ref={mainRef} key={path} tabIndex={-1} inert={menuOpen}>{pagina}</main>
      <Footer ref={footerRef} inert={menuOpen} />
      <aside aria-label="atalhos" inert={menuOpen}>
        <ScrollExtras />
        {fab && (
          <NovaAba ref={fabRef} href={wa.link} aria-label="fale conosco pelo WhatsApp" className="fab"><Ic n="wa" s={22} /><span className="fab__txt">fale conosco</span></NovaAba>
        )}
      </aside>
      <div className="sr-only" aria-live="polite" aria-atomic="true">{anuncio}</div>
      <div className="toast" role="status">{toast}</div>
    </div>
  );
}

export default function App() {
  const { cms } = useContent();
  return (
    <>
      <IconSprite />
      {cms ? <Site /> : <div className="loading" style={{ minHeight: '100vh', background: 'var(--ink)' }}><img src="/logo.png" alt="ótica digital look" width="120" height="120" style={{ opacity: .9 }} /></div>}
    </>
  );
}
