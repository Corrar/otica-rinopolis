import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { IconSprite, Ic } from './components/Icons.jsx';
import { Footer, Header, MobileMenu, PromoBar, ScrollExtras, useLargura } from './components/Layout.jsx';
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
  const w = useLargura();
  const wide = w >= 980, desktop = w >= 640;
  const [menuOpen, setMenuOpen] = useState(false);
  const toast = useToast();
  const mainRef = useRef(null), footerRef = useRef(null), headerRef = useRef(null), fabRef = useRef(null);
  const ativa = r.page === 'post' ? 'blog' : r.page;
  const admin = r.page === 'admin';
  const fab = info.botaoFlutuante !== false && !admin;

  useEffect(() => setMenuOpen(false), [path]);
  useEffect(() => { if (wide) setMenuOpen(false); }, [wide]);
  useLayoutEffect(() => (animar ? animarEntradaHeader(headerRef.current, fabRef.current) : undefined), []); // eslint-disable-line react-hooks/exhaustive-deps
  useAnimacoesPagina(mainRef, footerRef, path, animar && !admin);

  let pagina;
  switch (r.page) {
    case 'inicio': pagina = <Inicio desktop={desktop} />; break;
    case 'sobre': pagina = <Sobre />; break;
    case 'armacoes': pagina = <Armacoes />; break;
    case 'lentes': pagina = <Lentes />; break;
    case 'convenios': pagina = <Convenios />; break;
    case 'blog': pagina = <Blog />; break;
    case 'post': pagina = <Artigo slug={r.slug} />; break;
    case 'contato': pagina = <Contato />; break;
    case 'admin': pagina = <Suspense fallback={<div className="loading"><span className="spinner" /></div>}><Admin wide={wide} /></Suspense>; break;
    default: pagina = <NaoEncontrada />;
  }

  return (
    <div className={`app${fab ? ' app--fab' : ''}${menuOpen ? ' app--menu' : ''}`}>
      <a href="#conteudo" className="skip">pular para o conteúdo</a>
      <Seo r={r} />
      <PromoBar />
      <Header ref={headerRef} ativa={ativa} wide={wide} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      {menuOpen && <MobileMenu ativa={ativa} fechar={() => setMenuOpen(false)} animar={animar} headerRef={headerRef} />}
      <main id="conteudo" ref={mainRef} key={path}>{pagina}</main>
      <Footer ref={footerRef} />
      <ScrollExtras />
      {toast && <div className="toast" role="status">{toast}</div>}
      {fab && (
        <a ref={fabRef} href={wa.link} target="_blank" rel="noopener" aria-label="Falar no WhatsApp" className="fab"><Ic n="wa" s={22} />{wide && <span>fale conosco</span>}</a>
      )}
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
