import { Ic } from '../components/Icons.jsx';
import { L, Status } from '../components/Layout.jsx';
import { BtnWa, Evento, Foto, InfoContato, LinkSeta, Mapa, Titulo } from '../components/bits.jsx';
import { useSite } from '../state/content.jsx';
import { bgOf, eventosFuturos, lista, numerar, postsDe } from '../lib/util.js';

export default function Inicio({ desktop }) {
  const site = useSite();
  const { cms, info, wa, status, selos, mapaEmbed, mapaLink, googleLink } = site;
  const eventos = eventosFuturos(cms).slice(0, 2);
  const cats = [
    { nome: 'armações', desc: 'Grau e design para todo rosto', foto: 'armações em expositor', to: 'armacoes', img: cms.fotos.cat_armacoes },
    { nome: 'óculos de sol', desc: 'Proteção UV com estilo', foto: 'óculos de sol', to: 'armacoes', img: cms.fotos.cat_sol },
    { nome: 'lentes de contato', desc: 'Conforto diário e descartáveis', foto: 'lentes de contato', to: 'lentes', img: cms.fotos.cat_lentes },
  ];
  const marquee = [...selos, 'lentes em até 48h', 'óculos de sol com proteção UV', 'lentes de contato'];
  const anos = parseInt(info.anos, 10) || 0;

  return (
    <div data-screen-label="Início">
      <section data-hero className="dark split" style={{ '--min': '420px', gap: 'clamp(28px,4vw,48px)', padding: 'clamp(32px,5vw,56px) var(--px) clamp(48px,7vw,88px)', alignItems: 'center' }}>
        <div className="min0">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22, flexWrap: 'wrap' }}>
            <span className="eyebrow">ótica em {info.cidade}</span>
            <span style={{ width: 1, height: 12, background: 'rgba(255,255,255,.25)' }} />
            <Status st={status} style={{ font: "500 12px 'DM Sans',sans-serif", color: 'rgba(255,255,255,.75)' }} />
          </div>
          <h1 className="h-display" style={{ marginBottom: 24 }}>
            <span style={{ display: 'block' }}>{info.heroLinha1}</span>
            <span style={{ display: 'block' }}><span>{info.heroLinha2}</span> <span className="b">{info.heroDestaque}</span></span>
          </h1>
          <p style={{ font: "400 clamp(16px,1.6vw,18px)/1.55 'DM Sans',sans-serif", color: 'rgba(255,255,255,.72)', maxWidth: 460, marginBottom: 32 }}>{info.heroTexto}</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 32 }}>
            <BtnWa href={wa.link} />
            <L to="armacoes" className="btn btn--ghost-inv">ver armações</L>
          </div>
          <div style={{ display: 'flex', gap: '18px 22px', flexWrap: 'wrap', font: "400 13px 'DM Sans',sans-serif" }}>
            {selos.map(s => <span key={s} style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'rgba(255,255,255,.75)', whiteSpace: 'nowrap' }}><Ic n="check" s={14} style={{ color: 'var(--wa)' }} />{s}</span>)}
          </div>
        </div>
        <div className="min0" style={{ position: 'relative' }}>
          <Foto img={cms.fotos.hero} rotulo="cliente experimentando armação" ratio="5/4" dark />
          {desktop && (
            <>
              <div data-float style={{ position: 'absolute', left: -16, bottom: 28, background: '#fff', color: 'var(--ink)', borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 18px 40px rgba(0,0,0,.35)' }}>
                <span style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--ink)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ic n="check" s={16} /></span>
                <span><span style={{ display: 'block', font: "500 14px 'Outfit',sans-serif" }}>medição digital</span><span style={{ display: 'block', font: "400 12px 'DM Sans',sans-serif", color: 'var(--muted)' }}>precisão de 0,1 mm na centragem</span></span>
              </div>
              <div data-float style={{ position: 'absolute', right: -12, top: 24, background: 'var(--wa)', color: '#fff', borderRadius: 999, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8, font: "500 13px 'DM Sans',sans-serif", boxShadow: '0 12px 30px rgba(37,211,102,.35)' }}><Ic n="wa" s={16} />resposta em minutos</div>
            </>
          )}
        </div>
      </section>

      <div style={{ background: '#fff', borderBottom: '1px solid rgba(0,0,0,.08)', overflow: 'hidden', padding: '16px 0', whiteSpace: 'nowrap' }} aria-hidden="true">
        <div data-marquee-track style={{ display: 'inline-flex', willChange: 'transform' }}>
          {[...marquee, ...marquee].map((m, i) => <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 18, padding: '0 18px', font: "500 12px 'DM Sans',sans-serif", letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--text-2)' }}>{m}<span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--ink)', display: 'inline-block', opacity: .4 }} /></span>)}
        </div>
      </div>

      <section data-reveal className="px" style={{ paddingTop: 'clamp(48px,6vw,80px)', paddingBottom: 32 }}>
        <div className="sec-head"><Titulo a="o que você" b="procura" /><LinkSeta to="armacoes">ver tudo</LinkSeta></div>
        <div data-grid className="grid">
          {cats.map(c => (
            <L key={c.nome} to={c.to} className="card-link">
              <Foto img={c.img} rotulo={c.foto} ratio="4/3" radius={0} style={{ color: 'var(--muted-2)' }} />
              <div style={{ padding: '20px 22px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <div className="min0"><div style={{ font: "500 21px 'Outfit',sans-serif", marginBottom: 4 }}>{c.nome}</div><div className="t-small">{c.desc}</div></div>
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
        <Foto img={cms.fotos.loja} rotulo="fachada ou interior da loja" ratio="1" />
        <div className="min0">
          <div className="eyebrow" style={{ marginBottom: 16 }}>sobre a ótica</div>
          <h2 className="h-sec" style={{ lineHeight: 1.08, marginBottom: 18, textWrap: 'pretty' }}>{info.sobreTitulo}</h2>
          <p style={{ font: "400 clamp(15px,1.5vw,17px)/1.6 'DM Sans',sans-serif", color: 'var(--text-2)', marginBottom: 26 }}>{info.sobreResumo}</p>
          <div style={{ display: 'flex', gap: 32, marginBottom: 28, flexWrap: 'wrap' }}>
            <div><div data-count={anos} data-prefix="+" style={{ font: "300 38px 'Outfit',sans-serif" }}>+{anos}</div><div style={{ font: "400 13px 'DM Sans',sans-serif", color: 'var(--muted)' }}>anos de história</div></div>
            <div><div data-count="100" data-suffix="%" style={{ font: "300 38px 'Outfit',sans-serif" }}>100%</div><div style={{ font: "400 13px 'DM Sans',sans-serif", color: 'var(--muted)' }}>medição digital</div></div>
          </div>
          <LinkSeta to="sobre">conheça nossa história</LinkSeta>
        </div>
      </section>

      <section data-reveal className="dark split" style={{ '--min': '340px', margin: '0 var(--px-card)', borderRadius: 24, padding: 'clamp(28px,4vw,56px)', gap: 'clamp(28px,4vw,48px)', alignItems: 'center' }}>
        <div className="min0">
          <div className="eyebrow" style={{ marginBottom: 14 }}>convênios e promoções</div>
          <h2 style={{ font: "300 clamp(28px,3vw,38px)/1.1 'Outfit',sans-serif", letterSpacing: '-.02em', marginBottom: 14 }}>parcele em até <span className="b">{info.parcelas}x sem juros</span></h2>
          <p style={{ font: "400 16px/1.55 'DM Sans',sans-serif", color: 'rgba(255,255,255,.7)', marginBottom: 22 }}>Aceitamos os principais convênios e cartões. Traga sua receita e monte seu óculos completo hoje.</p>
          <L to="convenios" className="btn btn--sm btn--light btn--light-plain">ver convênios</L>
        </div>
        <div data-grid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(100px,1fr))', gap: 10 }}>
          {lista(info.convenios).slice(0, 8).map(v => <div key={v} className="chip-box" style={{ borderColor: 'rgba(255,255,255,.18)', color: 'rgba(255,255,255,.65)', fontSize: 12, padding: '0 6px' }}>{v}</div>)}
        </div>
      </section>

      <section data-reveal className="px" style={{ paddingTop: 'clamp(48px,6vw,80px)' }}>
        <div className="sec-head"><Titulo a="como" b="funciona" /><div style={{ font: "400 14px 'DM Sans',sans-serif", color: 'var(--muted-2)' }}>do primeiro contato ao óculos pronto</div></div>
        <div data-grid className="grid steps" style={{ '--min': '220px' }}>
          {numerar(cms.etapas).map(s => (
            <div key={s.n}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}><span style={{ font: "300 28px 'Outfit',sans-serif", color: 'var(--muted-2)' }}>{s.n}</span><span style={{ flex: 1, height: 1, background: 'rgba(0,0,0,.12)' }} /></div>
              <div className="t-card">{s.titulo}</div>
              <div className="t-body">{s.texto}</div>
            </div>
          ))}
        </div>
      </section>

      {cms.depoimentos.length > 0 && (
        <section data-reveal className="px" style={{ paddingTop: 'clamp(48px,6vw,80px)' }}>
          <div className="sec-head"><Titulo a="quem já" b="enxerga melhor" /><LinkSeta href={googleLink}>avaliações no Google</LinkSeta></div>
          <div data-grid className="grid" style={{ '--gap': '18px' }}>
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

      <section data-reveal className="px split" style={{ '--min': '360px', paddingTop: 'clamp(48px,6vw,80px)', paddingBottom: 'clamp(48px,6vw,80px)', gap: 'clamp(28px,4vw,48px)' }}>
        <Mapa src={mapaEmbed} style={{ minHeight: 280 }} />
        <div className="min0" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="eyebrow" style={{ marginBottom: 16 }}>onde estamos</div>
          <h2 style={{ font: "300 clamp(28px,3.2vw,40px)/1.1 'Outfit',sans-serif", letterSpacing: '-.02em', marginBottom: 22 }}>no coração de {info.cidadeNome}</h2>
          <div style={{ marginBottom: 26 }}><InfoContato site={site} comStatus /></div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}><a href={mapaLink} target="_blank" rel="noopener" className="btn btn--outline"><Ic n="pin" s={16} />como chegar</a></div>
        </div>
      </section>

      <section data-reveal className="px" style={{ paddingBottom: 'clamp(48px,7vw,88px)' }}>
        <div className="sec-head" style={{ marginBottom: 28 }}><Titulo a="dicas para" b="seus olhos" style={{ fontSize: 'clamp(28px,3.2vw,40px)' }} /><LinkSeta to="blog">ver o blog</LinkSeta></div>
        <div data-grid className="grid">
          {postsDe(cms).slice(0, 3).map(p => (
            <L key={p.slug} to={'blog/' + p.slug} className="lift" style={{ display: 'block', color: 'var(--ink)' }}>
              <div style={{ aspectRatio: '16/10', borderRadius: 16, background: 'var(--ph)', backgroundImage: bgOf(p.img), backgroundSize: 'cover', backgroundPosition: 'center', marginBottom: 14 }} />
              <div style={{ font: "400 12px 'DM Sans',sans-serif", color: 'var(--muted-2)', marginBottom: 6 }}>{p.tag} · {p.leitura}</div>
              <div style={{ font: "500 19px/1.3 'Outfit',sans-serif", textWrap: 'pretty' }}>{p.titulo}</div>
            </L>
          ))}
        </div>
      </section>
    </div>
  );
}
