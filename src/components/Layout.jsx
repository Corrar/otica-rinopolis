import { forwardRef, useEffect, useRef, useState } from 'react';
import { Ic } from './Icons.jsx';
import { href, onLink } from '../lib/router.js';
import { useSite } from '../state/content.jsx';
import { animarMenu } from '../lib/anim.js';

export const PAGINAS = [['inicio', 'início'], ['sobre', 'sobre'], ['armacoes', 'armações'], ['lentes', 'lentes de contato'], ['convenios', 'convênios'], ['blog', 'blog'], ['contato', 'contato']];

export const useLargura = () => {
  const [w, setW] = useState(() => window.innerWidth);
  useEffect(() => { const f = () => setW(window.innerWidth); window.addEventListener('resize', f); return () => window.removeEventListener('resize', f); }, []);
  return w;
};

// Link interno (URL real, navegação sem recarregar).
export const L = ({ to, children, onNav, ...rest }) => <a href={href(to)} onClick={onLink(href(to), onNav)} {...rest}>{children}</a>;

export const Status = ({ st, style, className = 'status' }) => (
  <span className={className} style={style}><span className="dot" style={{ background: st.cor }} />{st.texto}</span>
);

export function PromoBar() {
  const { info } = useSite();
  if (info.faixaAtiva === false || !info.faixaPromo) return null;
  return <div className="promo-bar">{info.faixaPromo} · <L to="convenios">saiba mais</L></div>;
}

export const Header = forwardRef(function Header({ ativa, wide, menuOpen, setMenuOpen }, ref) {
  const { wa } = useSite();
  return (
    <header className="header" ref={ref}>
      <L to="inicio" aria-label="Início" className="header__logo" onNav={() => setMenuOpen(false)}><img src="/logo.png" alt="ótica digital look" width="72" height="72" /></L>
      {wide ? (
        <>
          <nav aria-label="principal" className="nav">
            {PAGINAS.map(([id, label]) => <L key={id} to={id} aria-current={ativa === id ? 'page' : undefined}>{label}</L>)}
          </nav>
          <a href={wa.link} target="_blank" rel="noopener" className="header__wa"><Ic n="wa" /><span>WhatsApp</span></a>
        </>
      ) : (
        <div className="header__mob">
          <a href={wa.link} target="_blank" rel="noopener" aria-label="WhatsApp" className="circle-44" style={{ background: 'var(--wa)', color: '#fff' }}><Ic n="wa" s={20} /></a>
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu" aria-expanded={menuOpen} aria-controls="menu-mobile" className="circle-44 burger">
            <span /><span style={{ opacity: menuOpen ? 0 : 1 }} /><span />
          </button>
        </div>
      )}
    </header>
  );
});

export function MobileMenu({ ativa, fechar, animar }) {
  const { wa, status } = useSite();
  const ref = useRef(null);
  useEffect(() => {
    if (animar) animarMenu(ref.current);
    document.body.style.overflow = 'hidden';
    const esc = (e) => e.key === 'Escape' && fechar();
    window.addEventListener('keydown', esc);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', esc); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="menu" id="menu-mobile" ref={ref}>
      <nav aria-label="principal">
        {PAGINAS.map(([id, label]) => <L key={id} to={id} onNav={fechar} aria-current={ativa === id ? 'page' : undefined}><span>{label}</span><Ic n="arrow" s={22} style={{ opacity: .5 }} /></L>)}
      </nav>
      <div style={{ marginTop: 'auto', paddingTop: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <a href={wa.link} target="_blank" rel="noopener" className="btn btn--wa"><Ic n="wa" /><span>falar no WhatsApp</span></a>
        <Status st={status} style={{ justifyContent: 'center', font: "400 13px 'DM Sans',sans-serif", color: 'rgba(255,255,255,.6)', gap: 8 }} />
      </div>
    </div>
  );
}

export const Footer = forwardRef(function Footer(_, ref) {
  const { info, wa, igLink, mapaLink, status } = useSite();
  return (
    <footer className="footer" ref={ref}>
      <div className="footer__cols">
        <div className="min0">
          <img src="/logo.png" alt="" style={{ height: 88, margin: '-16px 0 6px -12px', display: 'block' }} />
          <p style={{ font: "400 14px/1.55 'DM Sans',sans-serif", color: 'rgba(255,255,255,.6)', maxWidth: 280, margin: '0 0 16px' }}>Ótica em {info.cidade} com medição digital e atendimento personalizado.</p>
          <div style={{ display: 'flex', gap: 10 }}>
            <a href={wa.link} target="_blank" rel="noopener" aria-label="WhatsApp" className="soc soc--wa"><Ic n="wa" /></a>
            <a href={igLink} target="_blank" rel="noopener" aria-label="Instagram" className="soc"><Ic n="ig" /></a>
            <a href={mapaLink} target="_blank" rel="noopener" aria-label="Como chegar" className="soc"><Ic n="pin" /></a>
            {info.facebook ? <a href={info.facebook} target="_blank" rel="noopener" aria-label="Facebook" className="soc" style={{ font: "600 15px 'DM Sans',sans-serif" }}>f</a> : null}
          </div>
        </div>
        <div className="footer__col"><div className="ttl">produtos</div><L to="armacoes">armações</L><L to="armacoes">óculos de sol</L><L to="lentes">lentes de contato</L></div>
        <div className="footer__col"><div className="ttl">a ótica</div><L to="sobre">sobre</L><L to="convenios">convênios e eventos</L><L to="blog">blog</L><L to="contato">contato</L></div>
        <div className="footer__col min0" style={{ lineHeight: 1.7 }}>
          <div className="ttl">contato</div>
          <a href={wa.link} target="_blank" rel="noopener">{wa.fmt}</a>
          <span>{info.endereco}</span><span>{info.bairroCidade}</span>
          <Status st={status} style={{ marginTop: 8, font: "500 12px 'DM Sans',sans-serif", color: 'rgba(255,255,255,.8)' }} />
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,.14)', paddingTop: 18, font: "400 12px 'DM Sans',sans-serif", color: 'rgba(255,255,255,.45)', display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <span>© {new Date().getFullYear()} ótica digital look</span>
        <span style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}><span>CNPJ {info.cnpj}</span><L to="admin" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,.55)' }}><Ic n="lock" s={12} />área do proprietário</L></span>
      </div>
    </footer>
  );
});

// Barra de progresso de leitura + botão "voltar ao topo".
export function ScrollExtras() {
  const bar = useRef(null);
  const [topo, setTopo] = useState(false);
  useEffect(() => {
    const f = () => {
      const y = window.scrollY, h = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${h > 0 ? Math.min(1, y / h) : 0})`;
      setTopo(y > 600);
    };
    f(); window.addEventListener('scroll', f, { passive: true }); window.addEventListener('resize', f);
    return () => { window.removeEventListener('scroll', f); window.removeEventListener('resize', f); };
  }, []);
  return (
    <>
      <div className="progress" ref={bar} />
      {topo && <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Voltar ao topo" className="circle-44 to-top"><Ic n="arrow" style={{ transform: 'rotate(-90deg)' }} /></button>}
    </>
  );
}
