import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Ic } from './Icons.jsx';
import { href, onLink } from '../lib/router.js';
import { useSite } from '../state/content.jsx';
import { animarMenu, reduzMovimento } from '../lib/anim-lazy.js';
import { localDe } from '../lib/seo.js';

export const PAGINAS = [['inicio', 'início'], ['sobre', 'sobre'], ['armacoes', 'armações'], ['lentes', 'lentes de contato'], ['convenios', 'convênios'], ['blog', 'blog'], ['contato', 'contato']];

export const useLargura = () => {
  const [w, setW] = useState(() => (typeof window === 'undefined' ? 1280 : window.innerWidth));
  useEffect(() => { const f = () => setW(window.innerWidth); window.addEventListener('resize', f); return () => window.removeEventListener('resize', f); }, []);
  return w;
};

// Link interno (URL real, navegação sem recarregar).
export const L = ({ to, children, onNav, ...rest }) => <a href={href(to)} onClick={onLink(href(to), onNav)} {...rest}>{children}</a>;

// Link externo em nova aba, avisando o leitor de tela. Com aria-label (links só com ícone), o aviso vai no próprio rótulo.
const NOVA_ABA = ' (abre em nova aba)';
export const NovaAba = ({ children, 'aria-label': rotulo, ...rest }) => (
  <a target="_blank" rel="noopener" aria-label={rotulo ? rotulo + NOVA_ABA : undefined} {...rest}>
    {children}{rotulo ? null : <span className="sr-only">{NOVA_ABA}</span>}
  </a>
);

// "aberto agora" / "fechado · abre ..."; nada enquanto o horário não for informado (st null).
export const Status = ({ st, style, className = 'status' }) => (st
  ? <span className={className} style={style}><span className="dot" style={{ background: st.cor }} />{st.texto}</span>
  : null);

// Faixa de aviso: sai do ar sozinha depois de faixaFim (AAAA-MM-DD).
export function PromoBar({ inert }) {
  const { info, hojeIso } = useSite();
  if (info.faixaAtiva === false || !info.faixaPromo || (info.faixaFim && info.faixaFim < hojeIso)) return null;
  return <aside className="promo-bar" aria-label="promoção" inert={inert}>{info.faixaPromo} · <L to="convenios">saiba mais</L></aside>;
}

// Menu do computador e botão do menu do celular são sempre renderizados; o CSS mostra um ou outro conforme a largura
// (o HTML gerado no build tem 1280px de referência e precisa funcionar no celular antes do JavaScript carregar).
export const Header = forwardRef(function Header({ ativa, menuOpen, setMenuOpen, burgerRef }, ref) {
  const { wa } = useSite();
  return (
    <header className="header" ref={ref}>
      <L to="inicio" className="header__logo" onNav={() => setMenuOpen(false)}><img src="/logo.png" alt="Ótica Digital Look – página inicial" width="78" height="48" /></L>
      <nav aria-label="principal" className="nav">
        {PAGINAS.map(([id, label]) => <L key={id} to={id} aria-current={ativa === id ? 'page' : undefined}>{label}</L>)}
      </nav>
      <NovaAba href={wa.link} className="header__wa"><Ic n="wa" /><span>WhatsApp</span></NovaAba>
      <div className="header__mob">
        <NovaAba href={wa.link} aria-label="WhatsApp" className="circle-44 header__mob-wa"><Ic n="wa" s={20} /></NovaAba>
        <button type="button" ref={burgerRef} onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menuOpen} aria-controls="menu-mobile" className="circle-44 burger">
          <span /><span /><span />
        </button>
      </div>
    </header>
  );
});

// Menu do celular como diálogo: foco no primeiro link ao abrir; Esc (ou "fechar menu") fecha e devolve o foco ao botão.
// O resto da página fica inerte enquanto ele está aberto (App.jsx), então o Tab circula só entre cabeçalho e menu.
export function MobileMenu({ ativa, fechar, animar, headerRef, burgerRef }) {
  const { wa, status } = useSite();
  const ref = useRef(null);
  const fecharEVoltar = () => { fechar(); burgerRef.current?.focus(); };
  // O menu começa logo abaixo do cabeçalho, que desce quando a faixa de aviso está visível.
  useLayoutEffect(() => {
    const menu = ref.current, header = headerRef.current;
    if (!menu || !header) return undefined;
    const posicionar = () => menu.style.setProperty('--menu-top', `${Math.max(0, Math.round(header.getBoundingClientRect().bottom))}px`);
    posicionar();
    window.addEventListener('resize', posicionar);
    window.addEventListener('scroll', posicionar, { passive: true });
    return () => { window.removeEventListener('resize', posicionar); window.removeEventListener('scroll', posicionar); };
  }, [headerRef]);
  useEffect(() => {
    if (animar) animarMenu(ref.current);
    ref.current?.querySelector('nav a')?.focus();
    document.body.style.overflow = 'hidden';
    const esc = (e) => { if (e.key === 'Escape') { e.preventDefault(); fecharEVoltar(); } };
    window.addEventListener('keydown', esc);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', esc); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="menu" id="menu-mobile" ref={ref} role="dialog" aria-modal="true" aria-label="Menu de navegação">
      <nav aria-label="principal">
        {PAGINAS.map(([id, label]) => <L key={id} to={id} onNav={fechar} aria-current={ativa === id ? 'page' : undefined}><span>{label}</span><Ic n="arrow" s={22} style={{ opacity: .5 }} /></L>)}
      </nav>
      <div className="menu__rodape">
        <NovaAba href={wa.link} className="btn btn--wa"><Ic n="wa" /><span>falar no WhatsApp</span></NovaAba>
        <Status st={status} style={{ justifyContent: 'center', font: "400 13px 'DM Sans',sans-serif", color: 'rgba(255,255,255,.6)', gap: 8 }} />
        <button type="button" className="menu__fechar" onClick={fecharEVoltar}>fechar menu</button>
      </div>
    </div>
  );
}

export const Footer = forwardRef(function Footer({ inert }, ref) {
  const { info, wa, tel, emp, igLink, mapaLink, status } = useSite();
  const { cidade, uf } = localDe(info);
  // minHeight: área de toque de 44px; a margem negativa na nav mantém o espaçamento visual da linha.
  const linkBase = { display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,.6)', minHeight: 44 };
  return (
    <footer className="footer" ref={ref} inert={inert}>
      <div className="footer__cols">
        <div className="min0">
          <img src="/logo.png" alt="" width="91" height="56" loading="lazy" decoding="async" style={{ height: 56, width: 'auto', margin: '0 0 18px', display: 'block' }} />
          <p style={{ font: "400 14px/1.55 'DM Sans',sans-serif", color: 'rgba(255,255,255,.6)', maxWidth: 280, margin: '0 0 16px' }}>Ótica no centro de {cidade}/{uf}. Não realizamos exames de vista: lentes de grau e de contato somente com receita de médico oftalmologista.</p>
          <div style={{ display: 'flex', gap: 10 }}>
            <NovaAba href={wa.link} aria-label="WhatsApp" className="soc soc--wa"><Ic n="wa" /></NovaAba>
            <NovaAba href={igLink} aria-label="Instagram" className="soc"><Ic n="ig" /></NovaAba>
            <NovaAba href={mapaLink} aria-label="Como chegar" className="soc"><Ic n="pin" /></NovaAba>
            {info.facebook ? <NovaAba href={info.facebook} aria-label="Facebook" className="soc" style={{ font: "500 15px 'DM Sans',sans-serif" }}>f</NovaAba> : null}
          </div>
        </div>
        <nav aria-label="rodapé" className="footer__nav">
          <div className="footer__col"><h2 className="ttl">produtos</h2><L to="armacoes">armações</L><L to="armacoes">óculos de sol</L><L to="lentes">lentes de contato</L></div>
          <div className="footer__col"><h2 className="ttl">a ótica</h2><L to="sobre">sobre</L><L to="convenios">convênios</L><L to="blog">blog</L><L to="contato">contato</L></div>
        </nav>
        <div className="footer__col min0">
          <h2 className="ttl">contato</h2>
          <NovaAba href={wa.link}>{wa.fmt} (WhatsApp)</NovaAba>
          {tel ? <a href={tel.link}>{tel.fmt}</a> : null}
          {emp.email ? <a href={'mailto:' + emp.email} style={{ overflowWrap: 'anywhere', maxWidth: '100%' }}>{emp.email}</a> : null}
          <span>{info.endereco}</span><span>{info.bairroCidade}{info.cep ? ` · ${info.cep}` : ''}</span>
          <Status st={status} style={{ marginTop: 8, font: "500 12px 'DM Sans',sans-serif", color: 'rgba(255,255,255,.8)' }} />
        </div>
      </div>
      <div className="footer__base" style={{ borderTop: '1px solid rgba(255,255,255,.14)', paddingTop: 18, font: "400 12px 'DM Sans',sans-serif", color: 'rgba(255,255,255,.6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        {/* Identificação do fornecedor: razão social e CNPJ só quando informados e válidos (nunca a palavra "CNPJ" sozinha). */}
        <span>© {new Date().getFullYear()} {emp.razao || 'ótica digital look'}{emp.cnpj ? ` · CNPJ ${emp.cnpj}` : ''}</span>
        <nav aria-label="documentos e acesso restrito" style={{ display: 'flex', gap: '0 16px', flexWrap: 'wrap', margin: '-14px 0' }}>
          <L to="politica-de-privacidade" style={linkBase}>política de privacidade</L>
          <L to="termos-de-uso" style={linkBase}>termos de uso</L>
          {/* Símbolo de acessibilidade em destaque (Lei Brasileira de Inclusão, art. 63, § 1º): ícone e texto mais claros. */}
          <L to="acessibilidade" style={{ ...linkBase, color: 'rgba(255,255,255,.9)' }}><Ic n="acess" s={20} />acessibilidade</L>
          <L to="admin" style={linkBase}><Ic n="lock" s={12} />área do proprietário</L>
        </nav>
      </div>
    </footer>
  );
});

// Barra de progresso de leitura + botão "voltar ao topo" (leva o foco ao início do conteúdo).
export function ScrollExtras() {
  const bar = useRef(null);
  const voltarAoTopo = () => {
    window.scrollTo({ top: 0, behavior: reduzMovimento() ? 'auto' : 'smooth' });
    document.getElementById('conteudo')?.focus({ preventScroll: true });
  };
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
      {topo && <button type="button" onClick={voltarAoTopo} aria-label="Voltar ao topo" className="circle-44 to-top"><Ic n="arrow" style={{ transform: 'rotate(-90deg)' }} /></button>}
    </>
  );
}
