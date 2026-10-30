import { useState } from 'react';
import { Ic } from '../components/Icons.jsx';
import { Status } from '../components/Layout.jsx';
import { InfoContato, Mapa } from '../components/bits.jsx';
import { useSite } from '../state/content.jsx';
import { fmtData } from '../lib/util.js';

const ASSUNTOS = ['Óculos de grau', 'Óculos de sol', 'Lentes de contato', 'Orçamento com receita', 'Outro assunto'];

export default function Contato() {
  const site = useSite();
  const { cms, wa, status, hojeIso, mapaEmbed, horarioSemana } = site;
  const [form, setForm] = useState({ nome: '', assunto: ASSUNTOS[0], msg: '' });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  // Fechamentos só aparecem junto com o horário de funcionamento (sem horário, o site manda consultar pelo WhatsApp).
  const fechamentos = !horarioSemana ? [] : (cms.fechamentos || []).filter(x => /^\d{4}-\d{2}-\d{2}$/.test(x.data || '') && x.data >= hojeIso).sort((a, b) => (a.data < b.data ? -1 : 1)).slice(0, 4);

  const enviar = (e) => {
    e.preventDefault();
    const t = `Olá! Sou ${form.nome.trim() || '...'} e tenho interesse em: ${form.assunto}.${form.msg.trim() ? '\n' + form.msg.trim() : ''}`;
    window.open(wa.msg(t), '_blank', 'noopener');
  };

  return (
    <div data-screen-label="Contato">
      <section data-hero className="px split" style={{ '--min': '340px', paddingTop: 'clamp(40px,6vw,80px)', paddingBottom: 'clamp(48px,7vw,88px)', gap: 'clamp(32px,5vw,72px)', alignItems: 'start' }}>
        <div className="min0">
          <div className="eyebrow" style={{ marginBottom: 20 }}>contato</div>
          <h1 style={{ font: "300 clamp(36px,5vw,60px)/1.05 'Outfit',sans-serif", letterSpacing: '-.02em', marginBottom: 18, textWrap: 'pretty' }}>vamos <span className="b">conversar.</span></h1>
          <p style={{ font: "400 clamp(15px,1.5vw,17px)/1.6 'DM Sans',sans-serif", color: 'var(--text-2)', marginBottom: 24, maxWidth: 460 }}>Respondemos no WhatsApp em horário comercial. Se preferir, preencha o formulário e abrimos a conversa com sua mensagem pronta. Para lentes de grau ou de contato, tenha em mãos a receita do seu oftalmologista.</p>
          {status ? <div style={{ marginBottom: 28 }}><Status st={status} style={{ gap: 8, font: "500 13px 'DM Sans',sans-serif", color: 'var(--ink)' }} /></div> : null}
          {fechamentos.length > 0 && (
            <div style={{ background: 'var(--sand)', borderRadius: 14, padding: '14px 16px', margin: '-12px 0 28px', font: "400 13px/1.6 'DM Sans',sans-serif", color: 'var(--text-2)' }}>
              <div style={{ font: "500 12px 'DM Sans',sans-serif", letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted-2)', marginBottom: 6 }}>próximos fechamentos</div>
              {fechamentos.map((fc, i) => <div key={i} style={{ display: 'flex', gap: 10 }}><span style={{ fontWeight: 500, color: 'var(--ink)', flex: 'none' }}>{fmtData(fc.data)}</span><span>{fc.motivo}</span></div>)}
            </div>
          )}
          <div style={{ marginBottom: 32 }}><InfoContato site={site} /></div>
          <Mapa src={mapaEmbed} style={{ aspectRatio: '16/9' }} />
        </div>
        <form onSubmit={enviar} style={{ background: 'var(--sand)', borderRadius: 24, padding: 'clamp(20px,3vw,40px)', display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
          <label className="field">seu nome<input className="input" value={form.nome} onChange={set('nome')} placeholder="Maria Silva" required autoComplete="name" /></label>
          <label className="field">o que você procura<select className="input" value={form.assunto} onChange={set('assunto')}>{ASSUNTOS.map(a => <option key={a}>{a}</option>)}</select></label>
          <label className="field">mensagem<textarea className="input" value={form.msg} onChange={set('msg')} rows={5} placeholder="Conte o que precisa. Se tiver receita, pode enviar a foto depois no WhatsApp." /></label>
          <button type="submit" className="btn btn--dark" style={{ marginTop: 6, border: 0, minHeight: 52, padding: '16px 24px' }}><Ic n="wa" /><span>abrir conversa no WhatsApp</span></button>
          <div style={{ font: "400 12px/1.5 'DM Sans',sans-serif", color: 'var(--muted-2)', textAlign: 'center' }}>Você será redirecionado para o WhatsApp com a mensagem preenchida.</div>
        </form>
      </section>
    </div>
  );
}
