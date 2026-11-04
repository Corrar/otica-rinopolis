import { useState } from 'react';
import { BtnWa, Foto } from '../components/bits.jsx';
import { useSite } from '../state/content.jsx';
import { gradeEquilibrada, numerar } from '../lib/util.js';

export default function Lentes() {
  const { cms, wa } = useSite();
  const [aberta, setAberta] = useState(0);
  return (
    <div data-screen-label="Lentes de contato">
      <section data-hero className="dark hero split" style={{ gap: 'clamp(28px,4vw,48px)', alignItems: 'center' }}>
        <div className="min0">
          <div className="eyebrow" style={{ marginBottom: 20 }}>lentes de contato</div>
          <h1 className="h-page" style={{ marginBottom: 18 }}>liberdade para ver <span className="b">sem armação.</span></h1>
          <p className="lead lead--inv" style={{ maxWidth: 520, marginBottom: 28 }}>Diárias, mensais, tóricas e multifocais das principais marcas. Ensinamos a colocar, tirar e cuidar — na primeira compra, sem pressa.</p>
          <BtnWa href={wa.receita}>enviar minha receita</BtnWa>
        </div>
        <Foto img={cms.fotos.lentes} rotulo="lente de contato / estojo" alt="Lente de contato e estojo" ratio="5/4" dark prioridade />
      </section>

      <section data-reveal className="px" style={{ paddingTop: 'clamp(40px,6vw,80px)' }}>
        <h2 className="h-sub" style={{ marginBottom: 28 }}>tipos de lente</h2>
        <div data-grid className={`grid${gradeEquilibrada(cms.tiposLente)}`} style={{ '--min': '220px', '--gap': '16px' }}>
          {(cms.tiposLente || []).map((t, i) => (
            <div key={i} className="card-sand">
              <div style={{ font: "500 21px 'Outfit',sans-serif", marginBottom: 10 }}>{t.nome}</div>
              <div className="t-body" style={{ marginBottom: 20 }}>{t.texto}</div>
              <div style={{ font: "500 12px 'DM Sans',sans-serif", letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted-2)' }}>{t.ideal}</div>
            </div>
          ))}
        </div>
      </section>

      <section data-reveal className="px" style={{ paddingTop: 'clamp(40px,6vw,80px)', paddingBottom: 'clamp(40px,6vw,80px)' }}>
        <h2 className="h-sub" style={{ marginBottom: 28 }}>como funciona</h2>
        <div data-grid className={`grid steps${gradeEquilibrada(cms.passos)}`} style={{ '--min': '240px' }}>
          {numerar(cms.passos).map(s => (
            <div key={s.n}>
              <div style={{ font: "300 30px 'Outfit',sans-serif", color: 'var(--muted-2)', marginBottom: 14 }}>{s.n}</div>
              <div className="t-card">{s.titulo}</div>
              <div className="t-body">{s.texto}</div>
            </div>
          ))}
        </div>
      </section>

      {(cms.faq || []).length > 0 && (
        <section data-reveal className="px split" style={{ '--min': '300px', paddingBottom: 'clamp(48px,7vw,88px)', gap: 'clamp(24px,4vw,48px)', alignItems: 'start' }}>
          <h2 className="h-sub">dúvidas <span className="b">frequentes</span></h2>
          <div style={{ borderTop: '1px solid var(--line)' }}>
            {cms.faq.map((q, i) => (
              <div key={i} style={{ borderBottom: '1px solid var(--line)' }}>
                <button className="faq-q" onClick={() => setAberta(aberta === i ? -1 : i)} aria-expanded={aberta === i} aria-controls={'faq-' + i}>
                  <span>{q.p}</span><span className="faq-ic" style={{ transform: `rotate(${aberta === i ? 45 : 0}deg)` }} aria-hidden="true">+</span>
                </button>
                {aberta === i && <div id={'faq-' + i} className="t-body" style={{ lineHeight: 1.6, padding: '0 48px 20px 0' }}>{q.r}</div>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
