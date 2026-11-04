import { Ic } from '../components/Icons.jsx';
import { BtnWa, Evento, Img } from '../components/bits.jsx';
import { useSite } from '../state/content.jsx';
import { eventosFuturos, lista, promosAtivas } from '../lib/util.js';

export default function Convenios() {
  const { cms, info, wa } = useSite();
  const promos = promosAtivas(cms), eventos = eventosFuturos(cms);
  return (
    <div data-screen-label="Convênios">
      <section data-hero className="dark hero"><div>
        <div className="eyebrow" style={{ marginBottom: 20 }}>convênios, promoções e eventos</div>
        <h1 className="h-page" style={{ maxWidth: 820 }}>seu óculos completo, <span className="b">do jeito que cabe no bolso.</span></h1>
      </div></section>

      <section data-reveal className="px" style={{ paddingTop: 'clamp(40px,6vw,80px)' }}>
        <h2 className="h-sub" style={{ marginBottom: 24 }}>promoções <span className="b">ativas</span></h2>
        {promos.length > 0 ? (
          <div data-grid className="grid" style={{ '--min': '300px' }}>
            {promos.map((pr, i) => (
              <div key={i} className="dark" style={{ borderRadius: 24, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 240 }}>
                {pr.img ? <div className="ph" style={{ aspectRatio: '16/8' }}><Img src={pr.img} alt={pr.titulo} /></div> : null}
                <div style={{ padding: 'clamp(24px,3vw,36px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, gap: 20 }}>
                  <div className="eyebrow" style={{ color: 'rgba(255,255,255,.5)' }}>{pr.tag}</div>
                  <div>
                    <div style={{ font: "300 clamp(26px,3vw,36px)/1.1 'Outfit',sans-serif", letterSpacing: '-.02em', marginBottom: 10, textWrap: 'pretty' }}>{pr.titulo}</div>
                    <div style={{ font: "400 15px/1.55 'DM Sans',sans-serif", color: 'rgba(255,255,255,.65)' }}>{pr.texto}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : <div style={{ font: "400 15px 'DM Sans',sans-serif", color: 'var(--muted-2)', padding: '12px 0' }}>Nenhuma promoção ativa no momento. Siga nosso Instagram para ficar por dentro.</div>}
      </section>

      <section data-reveal className="px" style={{ paddingTop: 'clamp(40px,6vw,80px)' }}>
        <h2 className="h-sub" style={{ marginBottom: 24 }}>eventos</h2>
        {eventos.length > 0
          ? <div data-grid className="grid" style={{ '--min': '300px' }}>{eventos.map((ev, i) => <Evento key={i} ev={ev} comImagem />)}</div>
          : <div style={{ font: "400 15px 'DM Sans',sans-serif", color: 'var(--muted-2)', padding: '12px 0' }}>Nenhum evento agendado no momento.</div>}
      </section>

      <section data-reveal className="px" style={{ paddingTop: 'clamp(40px,6vw,80px)', paddingBottom: 'clamp(40px,6vw,80px)' }}>
        <h2 className="h-sub" style={{ marginBottom: 12 }}>convênios aceitos</h2>
        <p style={{ font: "400 16px/1.55 'DM Sans',sans-serif", color: 'var(--muted)', marginBottom: 28, maxWidth: 560 }}>Não achou o seu? Chame no WhatsApp — a lista cresce com frequência e podemos consultar para você.</p>
        <div data-grid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 10 }}>
          {lista(info.convenios).map(v => <div key={v} className="chip-box" style={{ height: 68, color: 'var(--text-2)', padding: '0 10px' }}>{v}</div>)}
        </div>
      </section>

      <section data-reveal className="px split" style={{ '--min': '300px', paddingBottom: 'clamp(48px,7vw,88px)', gap: 'clamp(24px,4vw,48px)', alignItems: 'start' }}>
        <div className="min0">
          <h2 className="h-sub" style={{ marginBottom: 18 }}>formas de pagamento</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, font: "400 16px/1.5 'DM Sans',sans-serif", color: 'var(--text-2)' }}>
            {lista(info.pagamentos).map(pg => <div key={pg} style={{ display: 'flex', alignItems: 'center', gap: 12 }}><Ic n="check" s={16} style={{ color: 'var(--ink)' }} />{pg}</div>)}
          </div>
        </div>
        <div style={{ background: 'var(--sand)', borderRadius: 20, padding: 'clamp(24px,3vw,32px)' }}>
          <div style={{ font: "500 20px 'Outfit',sans-serif", marginBottom: 10 }}>precisa de orçamento?</div>
          <div className="t-body" style={{ marginBottom: 20 }}>Envie a foto da sua receita e a gente responde com opções de lente e valores no mesmo dia.</div>
          <BtnWa href={wa.receita} variant="dark" sm>enviar receita no WhatsApp</BtnWa>
        </div>
      </section>
    </div>
  );
}
