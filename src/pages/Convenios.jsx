import { Ic } from '../components/Icons.jsx';
import { NovaAba } from '../components/Layout.jsx';
import { ArteMarca, AvisoReceita, BtnWa, Evento, Img } from '../components/bits.jsx';
import { useSite } from '../state/content.jsx';
import { eventosFuturos, lista, promosAtivas } from '../lib/util.js';

const fmtValidade = (iso) => (/^\d{4}-\d{2}-\d{2}$/.test(iso || '') ? iso.split('-').reverse().join('/') : '');
const aviso = { font: "400 15px 'DM Sans',sans-serif", color: 'var(--muted-2)', padding: '12px 0' };

export default function Convenios() {
  const { cms, info, wa, igLink, hojeIso } = useSite();
  const promos = promosAtivas(cms, hojeIso), eventos = eventosFuturos(cms);
  const convenios = lista(info.convenios), pagamentos = lista(info.pagamentos);
  return (
    <div data-screen-label="Convênios">
      <section data-hero className="dark hero"><div>
        <div className="eyebrow" style={{ marginBottom: 20 }}>convênios, promoções e eventos</div>
        <h1 className="h-page" style={{ maxWidth: 820 }}>seus óculos completos, <span className="b">do jeito que cabem no bolso.</span></h1>
      </div></section>

      {promos.length > 0 && (
        <section data-reveal className="px" style={{ paddingTop: 'clamp(40px,6vw,80px)' }}>
          <h2 className="h-sub" style={{ marginBottom: 24 }}>promoções <span className="b">ativas</span></h2>
          <div data-grid className="grid" style={{ '--min': '300px' }}>
            {promos.map((pr, i) => {
              const validade = fmtValidade(pr.fim);
              return (
                <div key={i} className="dark" style={{ borderRadius: 24, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 240 }}>
                  <div className="ph" style={{ aspectRatio: '16/8', maxHeight: pr.img ? undefined : 240 }}>{pr.img ? <Img src={pr.img} alt="" tom="escuro" prioridade={i === 0} /> : <ArteMarca tom="escuro" />}</div>
                  <div style={{ padding: 'clamp(24px,3vw,36px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, gap: 20 }}>
                    {pr.tag ? <div className="eyebrow" style={{ color: 'rgba(255,255,255,.5)' }}>{pr.tag}</div> : null}
                    <div>
                      <h3 style={{ font: "300 clamp(26px,3vw,36px)/1.1 'Outfit',sans-serif", letterSpacing: '-.02em', marginBottom: 10, textWrap: 'pretty' }}>{pr.titulo}</h3>
                      <div style={{ font: "400 15px/1.55 'DM Sans',sans-serif", color: 'rgba(255,255,255,.65)' }}>{pr.texto}</div>
                      {validade || pr.condicoes ? <div style={{ font: "400 13px/1.5 'DM Sans',sans-serif", color: 'rgba(255,255,255,.55)', marginTop: 12 }}>{validade ? `Válida até ${validade}. ` : ''}{pr.condicoes}</div> : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {eventos.length > 0 && (
        <section data-reveal className="px" style={{ paddingTop: 'clamp(40px,6vw,80px)' }}>
          <h2 className="h-sub" style={{ marginBottom: 24 }}>eventos</h2>
          <div data-grid className="grid grid--fill" style={{ '--min': '300px' }}>{eventos.map((ev, i) => <Evento key={i} ev={ev} comImagem />)}</div>
        </section>
      )}

      {promos.length === 0 && eventos.length === 0 && (
        <section data-reveal className="px" style={{ paddingTop: 'clamp(40px,6vw,80px)' }}>
          <h2 className="h-sub" style={{ marginBottom: 12 }}>promoções e <span className="b">eventos</span></h2>
          <div style={aviso}>Nenhuma promoção ou evento no momento — acompanhe pelo <NovaAba href={igLink} className="u-link">Instagram</NovaAba>.</div>
        </section>
      )}

      <section data-reveal className="px" style={{ paddingTop: 'clamp(40px,6vw,80px)', paddingBottom: 'clamp(40px,6vw,80px)' }}>
        <h2 className="h-sub" style={{ marginBottom: 12 }}>{convenios.length > 0 ? 'convênios aceitos' : 'convênios'}</h2>
        {convenios.length > 0 ? <>
          <p style={{ font: "400 16px/1.55 'DM Sans',sans-serif", color: 'var(--muted)', marginBottom: 28, maxWidth: 560 }}>Não achou o seu? Chame no WhatsApp que verificamos para você.</p>
          <ul data-grid role="list" className="chips chips--5">
            {convenios.map(v => <li key={v} className="chip-box" style={{ height: 68, color: 'var(--text-2)', padding: '0 10px' }}>{v}</li>)}
          </ul>
        </> : <p style={{ font: "400 16px/1.55 'DM Sans',sans-serif", color: 'var(--muted)', maxWidth: 560 }}>Pergunte pelo <NovaAba href={wa.link} className="u-link">WhatsApp</NovaAba> se o seu convênio tem parceria com a ótica.</p>}
      </section>

      <section data-reveal className="px split" style={{ '--min': '300px', paddingBottom: 'clamp(48px,7vw,88px)', gap: 'clamp(24px,4vw,48px)', alignItems: 'start' }}>
        {pagamentos.length > 0 && (
          <div className="min0">
            <h2 className="h-sub" style={{ marginBottom: 18 }}>formas de pagamento</h2>
            <ul role="list" style={{ display: 'flex', flexDirection: 'column', gap: 12, font: "400 16px/1.5 'DM Sans',sans-serif", color: 'var(--text-2)' }}>
              {pagamentos.map(pg => <li key={pg} style={{ display: 'flex', alignItems: 'center', gap: 12 }}><Ic n="check" s={16} style={{ color: 'var(--ink)' }} />{pg}</li>)}
            </ul>
          </div>
        )}
        <div style={{ background: 'var(--sand)', borderRadius: 20, padding: 'clamp(24px,3vw,32px)' }}>
          <h3 style={{ font: "500 20px 'Outfit',sans-serif", marginBottom: 10 }}>precisa de orçamento?</h3>
          <div className="t-body" style={{ marginBottom: 20 }}>Envie a foto da sua receita pelo WhatsApp e respondemos com opções de lentes e valores em horário comercial.</div>
          <BtnWa href={wa.receita} variant="dark" sm descricao="aviso-receita-convenios">enviar receita no WhatsApp</BtnWa>
          <AvisoReceita id="aviso-receita-convenios" />
        </div>
      </section>
    </div>
  );
}
