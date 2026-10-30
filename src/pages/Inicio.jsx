import { useEffect, useRef, useState } from 'react';
import { Ic } from '../components/Icons.jsx';
import { L, NovaAba, Status } from '../components/Layout.jsx';
import { ArteMarca, BtnWa, Evento, Foto, Img, InfoContato, LinkSeta, Mapa, TAM_METADE, TAM_TERCO, Titulo } from '../components/bits.jsx';
import { useSite } from '../state/content.jsx';
import { eventosFuturos, gradeEquilibrada, lista, numerar, postsDe } from '../lib/util.js';
import { NOME, localDe } from '../lib/seo.js';
import { pausarFaixa, reduzMovimento } from '../lib/anim-lazy.js';

// Faixa rolante com botão "pausar animação" (WCAG 2.2.2). Também para com o mouse em cima, com o foco no botão
// e fora da tela. Sem movimento (preferência "reduzir movimento" ou animações desligadas no painel), não há botão.
function Faixa({ itens, animar }) {
  const caixa = useRef(null), trilho = useRef(null);
  const [anima, setAnima] = useState(false);
  const [parada, setParada] = useState(false);
  const [auto, setAuto] = useState({ mouse: false, foco: false, fora: false });
  const pausada = parada || auto.mouse || auto.foco || auto.fora;
  const marcar = (k, v) => setAuto(a => (a[k] === v ? a : { ...a, [k]: v }));
  useEffect(() => setAnima(animar && !reduzMovimento()), [animar]);
  useEffect(() => { pausarFaixa(trilho.current, pausada); }, [pausada, anima]);
  useEffect(() => {
    if (!anima || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([e]) => marcar('fora', !e.isIntersecting));
    io.observe(caixa.current);
    return () => io.disconnect();
  }, [anima]);
  return (
    <div ref={caixa} className="faixa" onMouseEnter={() => marcar('mouse', true)} onMouseLeave={() => marcar('mouse', false)} onFocus={() => marcar('foco', true)} onBlur={() => marcar('foco', false)}>
      <div className="faixa__trilho" aria-hidden="true">
        <div data-marquee-track ref={trilho} data-pausada={pausada ? 'true' : undefined} style={{ display: 'inline-flex', willChange: 'transform' }}>
          {[...itens, ...itens].map((m, i) => <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 18, padding: '0 18px', font: "500 12px 'DM Sans',sans-serif", letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--text-2)' }}>{m}<span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--ink)', display: 'inline-block', opacity: .4 }} /></span>)}
        </div>
      </div>
      {anima ? (
        <button type="button" className="faixa__btn" onClick={() => setParada(!parada)}>
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" focusable="false">{parada ? <path d="M2 1l7 4-7 4z" fill="currentColor" /> : <path d="M2 1h2v8H2zM6 1h2v8H6z" fill="currentColor" />}</svg>
          {parada ? 'continuar' : 'pausar animação'}
        </button>
      ) : null}
    </div>
  );
}

export default function Inicio() {
  const site = useSite();
  const { cms, info, wa, status, selos, mapaEmbed, mapaLink, googleAvaliacoes, animar } = site;
  const { cidade, uf } = localDe(info);
  const eventos = eventosFuturos(cms).slice(0, 2);
  const cats = [
    // Fotos dos cards sem texto alternativo: ficam dentro do link, que já tem o nome da categoria.
    { nome: 'armações', desc: 'Para todo tipo de rosto', foto: 'armações em expositor', to: 'armacoes', img: cms.fotos.cat_armacoes },
    { nome: 'óculos de sol', desc: 'Modelos para o dia a dia', foto: 'óculos de sol', to: 'armacoes', img: cms.fotos.cat_sol },
    { nome: 'lentes de contato', desc: 'Diárias e mensais, com receita', foto: 'lentes de contato', to: 'lentes', img: cms.fotos.cat_lentes },
  ];
  const marquee = [...selos, 'óculos de grau', 'óculos de sol', 'lentes de contato'];
  const anos = parseInt(info.anos, 10) || 0;
  const parcelas = parseInt(info.parcelas, 10) || 0;
  const convenios = lista(info.convenios);
  const posts = postsDe(cms).slice(0, 3);
  // Número de destaque editável (ex.: "100%"): anima só quando há um número; vazio = não aparece.
  const destaque = String(info.destaqueNumero || '').trim();
  const destaqueNum = /^(\D*)(\d+)(\D*)$/.exec(destaque);

  return (
    <div data-screen-label="Início">
      <section data-hero className="dark split" style={{ '--min': '420px', gap: 'clamp(28px,4vw,48px)', padding: 'clamp(32px,5vw,56px) var(--px) clamp(48px,7vw,88px)', alignItems: 'center' }}>
        <div className="min0">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8, marginBottom: 22 }}>
            <p className="eyebrow">ótica no centro de {info.cidade}</p>
            <Status st={status} style={{ font: "500 12px 'DM Sans',sans-serif", color: 'rgba(255,255,255,.75)' }} />
          </div>
          <h1 className="h-display" style={{ marginBottom: 24 }}>
            <span className="sr-only">{NOME}, ótica no centro de {cidade}/{uf}: </span>
            <span style={{ display: 'block' }}>{info.heroLinha1}</span>
            <span style={{ display: 'block' }}><span>{info.heroLinha2}</span> <span className="b">{info.heroDestaque}</span></span>
          </h1>
          <p style={{ font: "400 clamp(16px,1.6vw,18px)/1.55 'DM Sans',sans-serif", color: 'rgba(255,255,255,.72)', maxWidth: 460, marginBottom: 32 }}>{info.heroTexto}</p>
          <div className="btn-row" style={{ marginBottom: 32 }}>
            <BtnWa href={wa.link} />
            <L to="armacoes" className="btn btn--ghost-inv">ver armações</L>
          </div>
          <div className="hero-selos" style={{ display: 'flex', gap: '18px 22px', flexWrap: 'wrap', font: "400 13px 'DM Sans',sans-serif" }}>
            {selos.map(s => <span key={s} style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'rgba(255,255,255,.75)', whiteSpace: 'nowrap' }}><Ic n="check" s={14} style={{ color: 'var(--wa)' }} />{s}</span>)}
          </div>
        </div>
        <div className="min0" style={{ position: 'relative' }}>
          <Foto img={cms.fotos.hero} rotulo="loja" alt={`Ótica Digital Look, no centro de ${cidade}`} ratio="5/4" dark prioridade tamanhos={TAM_METADE} />
          {/* Cards flutuantes: ocultos abaixo de 640px pelo CSS ([data-float]). */}
          {info.capaCardTitulo || info.capaCardTexto ? (
            <div data-float style={{ position: 'absolute', left: -16, bottom: 28, background: '#fff', color: 'var(--ink)', borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 18px 40px rgba(0,0,0,.35)' }}>
              <span style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--ink)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Ic n="check" s={16} /></span>
              <span>{info.capaCardTitulo ? <span style={{ display: 'block', font: "500 14px 'Outfit',sans-serif" }}>{info.capaCardTitulo}</span> : null}{info.capaCardTexto ? <span style={{ display: 'block', font: "400 12px 'DM Sans',sans-serif", color: 'var(--muted)' }}>{info.capaCardTexto}</span> : null}</span>
            </div>
          ) : null}
          {info.capaSelo ? <div data-float style={{ position: 'absolute', right: -12, top: 24, background: 'var(--wa-escuro)', color: '#fff', borderRadius: 999, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8, font: "500 13px 'DM Sans',sans-serif", boxShadow: '0 12px 30px rgba(15,122,61,.35)' }}><Ic n="wa" s={16} />{info.capaSelo}</div> : null}
        </div>
      </section>

      <Faixa itens={marquee} animar={animar} />

      <section data-reveal className="px" style={{ paddingTop: 'clamp(48px,6vw,80px)', paddingBottom: 32 }}>
        <div className="sec-head"><Titulo a="o que você" b="procura" /><LinkSeta to="armacoes">ver tudo</LinkSeta></div>
        <div data-grid className="grid grid--3">
          {cats.map(c => (
            <L key={c.nome} to={c.to} className="card-link">
              <Foto img={c.img} rotulo={c.foto} alt="" ratio="4/3" radius={0} tamanhos={TAM_TERCO} style={{ color: 'var(--muted-2)' }} />
              <div className="card-link__txt">
                <div className="min0"><h3 style={{ font: "500 21px 'Outfit',sans-serif", marginBottom: 4 }}>{c.nome}</h3><div className="t-small">{c.desc}</div></div>
                <span className="round-ic"><Ic n="arrow" /></span>
              </div>
            </L>
          ))}
        </div>
      </section>

      {eventos.length > 0 && (
        <section data-reveal className="px" style={{ paddingTop: 'clamp(32px,4vw,48px)' }}>
          <div className="sec-head" style={{ marginBottom: 28 }}><Titulo a="próximos" b="eventos" /><LinkSeta to="convenios">ver todos</LinkSeta></div>
          <div data-grid className="grid" style={{ '--min': '280px' }}>{eventos.map((ev, i) => <Evento key={i} ev={ev} />)}</div>
        </section>
      )}

      <section data-reveal className="px split" style={{ paddingTop: 'clamp(48px,6vw,72px)', paddingBottom: 'clamp(48px,6vw,72px)', gap: 'clamp(28px,5vw,64px)', alignItems: 'center' }}>
        <Foto img={cms.fotos.loja} rotulo="fachada ou interior da loja" alt={`Balcão de atendimento da Ótica Digital Look, no centro de ${cidade}`} ratio="1" tamanhos={TAM_METADE} />
        <div className="min0">
          <div className="eyebrow" style={{ marginBottom: 16 }}>sobre a ótica</div>
          <h2 className="h-sec" style={{ lineHeight: 1.08, marginBottom: 18, textWrap: 'pretty' }}>{info.sobreTitulo}</h2>
          <p style={{ font: "400 clamp(15px,1.5vw,17px)/1.6 'DM Sans',sans-serif", color: 'var(--text-2)', marginBottom: 26 }}>{info.sobreResumo}</p>
          {anos > 0 || destaque ? (
            <div style={{ display: 'flex', gap: 32, marginBottom: 28, flexWrap: 'wrap' }}>
              {anos > 0 ? <div><div data-count={anos} data-prefix="+" style={{ font: "300 38px 'Outfit',sans-serif" }}>+{anos}</div><div style={{ font: "400 13px 'DM Sans',sans-serif", color: 'var(--muted)' }}>anos de história</div></div> : null}
              {destaque ? (
                <div>
                  {destaqueNum
                    ? <div data-count={destaqueNum[2]} data-prefix={destaqueNum[1]} data-suffix={destaqueNum[3]} style={{ font: "300 38px 'Outfit',sans-serif" }}>{destaque}</div>
                    : <div style={{ font: "300 38px 'Outfit',sans-serif" }}>{destaque}</div>}
                  {info.destaqueRotulo ? <div style={{ font: "400 13px 'DM Sans',sans-serif", color: 'var(--muted)' }}>{info.destaqueRotulo}</div> : null}
                </div>
              ) : null}
            </div>
          ) : null}
          <LinkSeta to="sobre">conheça nossa história</LinkSeta>
        </div>
      </section>

      <section data-reveal className="dark split" style={{ '--min': '340px', margin: '0 var(--px-card)', borderRadius: 24, padding: 'clamp(28px,4vw,56px)', gap: 'clamp(28px,4vw,48px)', alignItems: 'center' }}>
        <div className="min0">
          <div className="eyebrow" style={{ marginBottom: 14 }}>convênios e promoções</div>
          <h2 style={{ font: "300 clamp(28px,3vw,38px)/1.1 'Outfit',sans-serif", letterSpacing: '-.02em', marginBottom: 14 }}>{parcelas > 1 ? <>parcele em até <span className="b">{parcelas}x sem juros</span></> : <>monte seus <span className="b">óculos completos</span></>}</h2>
          <p style={{ font: "400 16px/1.55 'DM Sans',sans-serif", color: 'rgba(255,255,255,.7)', marginBottom: 22, maxWidth: 560 }}>Consulte as formas de pagamento e se o seu convênio tem parceria com a ótica. Traga sua receita e monte seus óculos completos.</p>
          <L to="convenios" className="btn btn--sm btn--light btn--light-plain">ver convênios</L>
        </div>
        {convenios.length > 0 ? (
          <ul data-grid role="list" className="chips chips--4" aria-label="convênios">
            {convenios.slice(0, 8).map(v => <li key={v} className="chip-box" style={{ borderColor: 'rgba(255,255,255,.18)', color: 'rgba(255,255,255,.65)', fontSize: 12, padding: '0 6px' }}>{v}</li>)}
          </ul>
        ) : null}
      </section>

      {(cms.etapas || []).length > 0 && (
        <section data-reveal className="px" style={{ paddingTop: 'clamp(48px,6vw,80px)' }}>
          <div className="sec-head"><Titulo a="como" b="funciona" /><div style={{ font: "400 14px 'DM Sans',sans-serif", color: 'var(--muted-2)' }}>do primeiro contato aos óculos prontos</div></div>
          <div data-grid className={`grid steps${gradeEquilibrada(cms.etapas)}`} style={{ '--min': '220px' }}>
            {numerar(cms.etapas).map(s => (
              <div key={s.n}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}><span style={{ font: "300 28px 'Outfit',sans-serif", color: 'var(--muted-2)' }}>{s.n}</span><span style={{ flex: 1, height: 1, background: 'rgba(0,0,0,.12)' }} /></div>
                <h3 className="t-card">{s.titulo}</h3>
                <div className="t-body">{s.texto}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {cms.depoimentos.length > 0 && (
        <section data-reveal className="px" style={{ paddingTop: 'clamp(48px,6vw,80px)' }}>
          <div className="sec-head"><Titulo a="quem já" b="enxerga melhor" />{googleAvaliacoes ? <LinkSeta href={googleAvaliacoes}>avaliações no Google</LinkSeta> : null}</div>
          <div data-grid className={`grid grid--longo${gradeEquilibrada(cms.depoimentos)}`} style={{ '--gap': '18px' }}>
            {cms.depoimentos.map((d, i) => (
              <figure key={i} style={{ background: 'var(--sand)', borderRadius: 18, padding: '26px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ font: "300 44px/0.6 'Outfit',sans-serif", color: '#c9c6c1' }} aria-hidden="true">“</div>
                <blockquote style={{ font: "400 16px/1.6 'DM Sans',sans-serif", color: 'var(--ink-2)', flex: 1, textWrap: 'pretty' }}>{d.texto}</blockquote>
                <figcaption style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--ink)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', font: "500 14px 'Outfit',sans-serif", flex: 'none' }}>{(d.nome || '?').trim().charAt(0).toUpperCase()}</span>
                  <span className="min0"><span style={{ display: 'block', font: "500 14px 'DM Sans',sans-serif" }}>{d.nome}</span><span style={{ display: 'block', font: "400 12px 'DM Sans',sans-serif", color: 'var(--muted-2)' }}>{d.item}</span></span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {cms.depoimentos.length === 0 && googleAvaliacoes ? (
        <section data-reveal className="px" style={{ paddingTop: 'clamp(48px,6vw,80px)' }}>
          <div className="sec-head" style={{ marginBottom: 0 }}><Titulo a="o que dizem" b="nossos clientes" /><LinkSeta href={googleAvaliacoes}>ver avaliações no Google</LinkSeta></div>
        </section>
      ) : null}

      <section data-reveal className="px split" style={{ '--min': '360px', paddingTop: 'clamp(48px,6vw,80px)', paddingBottom: 'clamp(48px,6vw,80px)', gap: 'clamp(28px,4vw,48px)' }}>
        <Mapa src={mapaEmbed} link={mapaLink} style={{ minHeight: 280 }} />
        <div className="min0" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="eyebrow" style={{ marginBottom: 16 }}>onde estamos</div>
          <h2 style={{ font: "300 clamp(28px,3.2vw,40px)/1.1 'Outfit',sans-serif", letterSpacing: '-.02em', marginBottom: 22 }}>no coração de {info.cidadeNome}</h2>
          <div style={{ marginBottom: 26 }}><InfoContato site={site} comStatus /></div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}><NovaAba href={mapaLink} className="btn btn--outline"><Ic n="pin" s={16} />como chegar</NovaAba></div>
        </div>
      </section>

      {posts.length > 0 && (
        <section data-reveal className="px" style={{ paddingBottom: 'clamp(48px,7vw,88px)' }}>
          <div className="sec-head" style={{ marginBottom: 28 }}><Titulo a="dicas para" b="seus olhos" style={{ fontSize: 'clamp(28px,3.2vw,40px)' }} /><LinkSeta to="blog">ver o blog</LinkSeta></div>
          <ul data-grid role="list" className="grid grid--3">
            {posts.map(p => (
              <li key={p.slug}>
                <L to={'blog/' + p.slug} className="lift" style={{ display: 'block', color: 'var(--ink)' }}>
                  <div className="ph" style={{ aspectRatio: '16/10', borderRadius: 16, marginBottom: 14 }}>{p.img ? <Img src={p.img} alt="" tamanhos={TAM_TERCO} /> : <ArteMarca />}</div>
                  <div style={{ font: "400 12px 'DM Sans',sans-serif", color: 'var(--muted-2)', marginBottom: 6 }}>{p.tag} · {p.leitura}</div>
                  <h3 style={{ font: "500 19px/1.3 'Outfit',sans-serif", textWrap: 'pretty' }}>{p.titulo}</h3>
                </L>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
