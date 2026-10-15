import { BtnWa, Foto } from '../components/bits.jsx';
import { useSite } from '../state/content.jsx';
import { numerar } from '../lib/util.js';

export default function Sobre() {
  const { cms, info, wa } = useSite();
  const galeria = (cms.galeria || []).filter(g => g.img);
  return (
    <div data-screen-label="Sobre">
      <section data-hero className="dark hero"><div>
        <div className="eyebrow" style={{ marginBottom: 20 }}>sobre a ótica</div>
        <h1 className="h-page" style={{ maxWidth: 820 }}>{info.sobreTitulo}</h1>
      </div></section>

      <section data-reveal className="px split" style={{ '--min': '340px', paddingTop: 'clamp(40px,6vw,80px)', paddingBottom: 'clamp(40px,6vw,80px)', gap: 'clamp(28px,5vw,64px)', alignItems: 'start' }}>
        <Foto img={cms.fotos.equipe} rotulo="fundadores / equipe na loja" ratio="4/5" />
        <div className="min0">
          <h2 className="h-sub" style={{ marginBottom: 18 }}>nossa história</h2>
          <p style={{ font: "400 clamp(15px,1.5vw,17px)/1.65 'DM Sans',sans-serif", color: 'var(--text-2)', marginBottom: 32, whiteSpace: 'pre-line' }}>{info.sobreTexto}</p>
          <div style={{ borderTop: '1px solid var(--line)' }}>
            {(cms.marcos || []).map((m, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '64px 1fr', gap: 16, padding: '16px 0', borderBottom: '1px solid var(--line)' }}>
                <div style={{ font: "400 19px 'Outfit',sans-serif" }}>{m.ano}</div>
                <div style={{ font: "400 15px/1.5 'DM Sans',sans-serif", color: 'var(--text-2)' }}>{m.texto}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section data-reveal className="px" style={{ paddingBottom: 'clamp(40px,6vw,80px)' }}>
        <h2 className="h-sub" style={{ marginBottom: 28 }}>por que a <span className="b">digital look</span></h2>
        <div data-grid className="grid" style={{ '--min': '220px', '--gap': '16px' }}>
          {numerar(cms.diferenciais).map(d => (
            <div key={d.n} className="card-sand">
              <div className="t-n" style={{ marginBottom: 24 }}>{d.n}</div>
              <div className="t-card">{d.titulo}</div>
              <div className="t-small">{d.texto}</div>
            </div>
          ))}
        </div>
      </section>

      {cms.equipe.length > 0 && (
        <section data-reveal className="px" style={{ paddingBottom: 'clamp(40px,6vw,80px)' }}>
          <h2 className="h-sub" style={{ marginBottom: 28 }}>quem atende você</h2>
          <div data-grid className="grid" style={{ '--min': '200px' }}>
            {cms.equipe.map((e, i) => (
              <div key={i}>
                <div className="ph" style={{ aspectRatio: '1', borderRadius: 18, marginBottom: 12, ...(e.img ? { backgroundImage: `url("${e.img}")` } : {}) }} role={e.img ? 'img' : undefined} aria-label={e.img ? e.nome : undefined}>{!e.img && 'foto'}</div>
                <div style={{ font: "500 18px 'Outfit',sans-serif" }}>{e.nome}</div>
                <div style={{ font: "400 14px 'DM Sans',sans-serif", color: 'var(--muted)' }}>{e.cargo}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {galeria.length > 0 && (
        <section data-reveal className="px" style={{ paddingBottom: 'clamp(40px,6vw,80px)' }}>
          <h2 className="h-sub" style={{ marginBottom: 28 }}>a <span className="b">loja</span></h2>
          <div data-grid className="grid grid--fill" style={{ '--min': '220px', '--gap': '14px' }}>
            {galeria.map((g, i) => (
              <figure key={i} style={{ borderRadius: 16, overflow: 'hidden', background: 'var(--ph)', position: 'relative', aspectRatio: '1' }}>
                <img src={g.img} alt={g.legenda || 'foto da loja'} loading="lazy" onError={e => { e.currentTarget.style.visibility = 'hidden'; }} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                {g.legenda ? <figcaption style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '28px 14px 12px', background: 'linear-gradient(transparent,rgba(0,0,0,.6))', color: '#fff', font: "500 13px 'DM Sans',sans-serif" }}>{g.legenda}</figcaption> : null}
              </figure>
            ))}
          </div>
        </section>
      )}

      <section data-reveal className="cta-band">
        <div className="min0">
          <div style={{ font: "300 clamp(24px,3vw,34px)/1.1 'Outfit',sans-serif", letterSpacing: '-.02em', marginBottom: 8 }}>passe na loja ou chame a gente.</div>
          <div style={{ font: "400 15px 'DM Sans',sans-serif", color: 'var(--muted)' }}>{info.endereco} · {info.bairroCidade}</div>
        </div>
        <BtnWa href={wa.link} variant="dark" sm />
      </section>
    </div>
  );
}
