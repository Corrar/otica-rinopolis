import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { IconSprite, Ic } from './components/Icons.jsx';
import { Footer, Header, MobileMenu, PromoBar, ScrollExtras, useLargura } from './components/Layout.jsx';
import { useContent, useSite } from './state/content.jsx';
import { rota, useHashLegado, usePath } from './lib/router.js';
import { useToast } from './lib/toast.js';
import { postsDe } from './lib/util.js';
import { animarEntradaHeader, useAnimacoesPagina } from './lib/anim.js';
import Inicio from './pages/Inicio.jsx';
import Sobre from './pages/Sobre.jsx';
import Armacoes from './pages/Armacoes.jsx';
import Lentes from './pages/Lentes.jsx';
import Convenios from './pages/Convenios.jsx';
import Contato from './pages/Contato.jsx';
import { Artigo, Blog, NaoEncontrada } from './pages/Blog.jsx';

const Admin = lazy(() => import('./admin/Admin.jsx'));

function Seo({ page, titulo }) {
  const { info } = useSite();
  useEffect(() => {
    const base = info.siteTitulo || 'Ótica Digital Look';
    document.title = titulo ? `${titulo} · ${base}` : base;
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.name = 'description'; document.head.appendChild(m); }
    m.content = info.siteDescricao || '';
    let r = document.querySelector('meta[name="robots"]');
    if (page === 'admin') { if (!r) { r = document.createElement('meta'); r.name = 'robots'; document.head.appendChild(r); } r.content = 'noindex'; }
    else if (r) r.remove();
  }, [info.siteTitulo, info.siteDescricao, page, titulo]);
  return null;
}

const TITULOS = { sobre: 'Sobre', armacoes: 'Armações e óculos de sol', lentes: 'Lentes de contato', convenios: 'Convênios, promoções e eventos', blog: 'Blog', contato: 'Contato', admin: 'Área do proprietário', naoEncontrada: 'Página não encontrada' };

function Site() {
  useHashLegado();
  const path = usePath();
  const r = rota(path);
  const { cms, info, wa, animar } = useSite();
  const tituloPost = r.page === 'post' ? (postsDe(cms).find(p => p.slug === r.slug) || {}).titulo : null;
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
      <Seo page={r.page} titulo={tituloPost || TITULOS[r.page]} />
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
