import { useRef, useState } from 'react';
import { Ic } from '../components/Icons.jsx';
import { L, Status } from '../components/Layout.jsx';
import { InfoContato, Mapa } from '../components/bits.jsx';
import { useSite } from '../state/content.jsx';
import { fmtData } from '../lib/util.js';

const ASSUNTOS = ['Óculos de grau', 'Óculos de sol', 'Lentes de contato', 'Orçamento com receita', 'Outro assunto'];
const MSG_NOME = 'Informe seu nome para abrirmos a conversa.';

export default function Contato() {
  const site = useSite();
  const { cms, wa, status, hojeIso, mapaEmbed, mapaLink, horarioSemana } = site;
  const [form, setForm] = useState({ nome: '', assunto: ASSUNTOS[0], msg: '' });
  const nomeRef = useRef(null);
  const set = (k) => (e) => { if (k === 'nome') e.target.setCustomValidity(''); setForm({ ...form, [k]: e.target.value }); };
  // Fechamentos só aparecem junto com o horário de funcionamento (sem horário, o site manda consultar pelo WhatsApp).
  const fechamentos = !horarioSemana ? [] : (cms.fechamentos || []).filter(x => /^\d{4}-\d{2}-\d{2}$/.test(x.data || '') && x.data >= hojeIso).sort((a, b) => (a.data < b.data ? -1 : 1)).slice(0, 4);

  const enviar = (e) => {
    e.preventDefault();
    // Nome só com espaços passa pelo "required": avisa do mesmo jeito.
    if (!form.nome.trim()) { nomeRef.current.setCustomValidity(MSG_NOME); nomeRef.current.reportValidity(); return; }
    const t = `Olá! Sou ${form.nome.trim()} e tenho interesse em: ${form.assunto.toLowerCase()}.${form.msg.trim() ? '\n' + form.msg.trim() : ''}`;
    const url = wa.msg(t);
    // Sem "noopener" (com ele, window.open sempre devolve null): se o navegador bloquear a nova aba, abre na mesma.
    const w = window.open(url, '_blank');
    if (w) w.opener = null; else location.href = url;
  };

  return (
    <div data-screen-label="Contato">
      {/* Ordem no HTML (e no celular): apresentação, formulário, endereço e mapa. No computador, a grade (.contato)
          põe endereço e mapa na coluna da esquerda, embaixo da apresentação, e o formulário à direita. */}
      <section data-hero className="px contato" style={{ paddingTop: 'clamp(40px,6vw,80px)', paddingBottom: 'clamp(48px,7vw,88px)' }}>
        <div className="min0 contato__intro">
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
        </div>
        <form data-hero-media onSubmit={enviar} aria-labelledby="form-contato-t" className="contato__form" style={{ background: 'var(--sand)', borderRadius: 24, padding: 'clamp(20px,3vw,40px)', display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
          <h2 id="form-contato-t" style={{ font: "500 20px 'Outfit',sans-serif", marginBottom: 4 }}>mande uma mensagem</h2>
          <label className="field">seu nome (obrigatório)<input ref={nomeRef} className="input" name="nome" value={form.nome} onChange={set('nome')} onInvalid={e => e.target.setCustomValidity(MSG_NOME)} placeholder="Maria Silva" required autoComplete="name" /></label>
          <label className="field">o que você procura<select className="input" name="assunto" value={form.assunto} onChange={set('assunto')}>{ASSUNTOS.map(a => <option key={a}>{a}</option>)}</select></label>
          <label className="field">mensagem (opcional)<textarea className="input" name="mensagem" value={form.msg} onChange={set('msg')} rows={5} placeholder="Conte o que precisa. Se tiver receita, pode enviar a foto depois no WhatsApp." /></label>
          {/* Aviso de privacidade antes do botão (LGPD, art. 9º): o site não grava nada, só abre o WhatsApp. */}
          <p id="aviso-whats" style={{ font: "400 13px/1.55 'DM Sans',sans-serif", color: 'var(--muted)', marginTop: 2 }}>Ao tocar no botão, o WhatsApp (serviço da Meta) abre com a mensagem pronta. Este site não grava o que você digitou; usamos seus dados só para responder e preparar o orçamento. Veja a <L to="politica-de-privacidade" className="u-link">Política de Privacidade</L>.</p>
          <button type="submit" aria-describedby="aviso-whats" className="btn btn--dark" style={{ border: 0, minHeight: 52, padding: '16px 24px' }}><Ic n="wa" /><span>abrir conversa no WhatsApp</span></button>
        </form>
        <div className="min0 contato__info"><h2 className="sr-only">endereço e horário</h2><InfoContato site={site} /></div>
        <div className="min0 contato__mapa"><Mapa src={mapaEmbed} link={mapaLink} style={{ aspectRatio: '16/9' }} /></div>
      </section>
    </div>
  );
}
