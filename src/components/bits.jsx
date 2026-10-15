import { Ic } from './Icons.jsx';
import { L } from './Layout.jsx';
import { bgOf } from '../lib/util.js';

// Bloco de foto com placeholder ("foto: ...") enquanto o proprietário não envia a imagem.
export function Foto({ img, rotulo, ratio, radius = 20, dark = false, style, className = '', children }) {
  return (
    <div className={`ph ${dark ? 'ph--dark' : ''} ${className}`} style={{ aspectRatio: ratio, borderRadius: radius, ...(img ? { backgroundImage: bgOf(img) } : {}), ...style }} role={img ? 'img' : undefined} aria-label={img ? rotulo : undefined}>
      {!img && rotulo ? (dark ? <span className="ph__dash">foto: {rotulo}</span> : <>foto: {rotulo}</>) : null}
      {children}
    </div>
  );
}

export const LinkSeta = ({ to, href, children }) => (to
  ? <L to={to} className="link-arrow">{children}<Ic n="arrow" s={14} /></L>
  : <a href={href} target="_blank" rel="noopener" className="link-arrow">{children}<Ic n="arrow" s={14} /></a>);

export const BtnWa = ({ href, children = 'falar no WhatsApp', variant = 'light', sm = false }) => (
  <a href={href} target="_blank" rel="noopener" className={`btn btn--ic btn--${variant} ${sm ? 'btn--sm' : ''}`}><Ic n="wa" /><span>{children}</span></a>
);

export const Titulo = ({ as: T = 'h2', a, b, className = 'h-sec', style }) => <T className={className} style={style}>{a}{b ? <> <span className="b">{b}</span></> : null}</T>;

export function Evento({ ev, comImagem = false }) {
  return (
    <div style={{ background: 'var(--sand)', borderRadius: 18, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {comImagem && ev.img ? <div style={{ aspectRatio: '16/9', backgroundImage: bgOf(ev.img), backgroundSize: 'cover', backgroundPosition: 'center' }} /> : null}
      <div className="event" style={{ padding: 22, gridTemplateColumns: comImagem ? '64px 1fr' : undefined, gap: comImagem ? 16 : undefined }}>
        <div className="event__date" style={comImagem ? { paddingRight: 14 } : undefined}><div className="event__dia" style={comImagem ? { fontSize: 32 } : undefined}>{ev.dia}</div><div className="event__mes">{ev.mes}</div></div>
        <div className="min0">
          <div className="event__t">{ev.titulo}</div>
          <div className="t-small" style={{ lineHeight: 1.5, marginBottom: 8 }}>{ev.texto}</div>
          <div className="event__meta"><Ic n="pin" s={13} />{ev.local}{comImagem && ev.hora ? ` · ${ev.hora}` : ''}</div>
        </div>
      </div>
    </div>
  );
}

export const InfoContato = ({ site, comStatus = false }) => {
  const { info, wa, igLink, status, horarioSemana, horarioSabado } = site;
  return (
    <div className="info-grid">
      <div><div className="lbl">endereço</div>{info.endereco}<br />{info.bairroCidade}<br />{info.cep}</div>
      <div><div className="lbl">horário</div>seg–sex · {horarioSemana}<br />sábado · {horarioSabado}
        {comStatus ? <><br /><span className="status" style={{ marginTop: 6, font: "500 12px 'DM Sans',sans-serif", color: 'var(--ink)' }}><span className="dot" style={{ background: status.cor }} />{status.texto}</span></> : null}
      </div>
      <div><div className="lbl">WhatsApp</div><a href={wa.link} target="_blank" rel="noopener" className="u-link"><Ic n="wa" s={14} style={{ color: 'var(--wa)' }} /><span>{wa.fmt}</span></a></div>
      <div><div className="lbl">instagram</div><a href={igLink} target="_blank" rel="noopener" className="u-link"><Ic n="ig" s={14} /><span>@{String(info.instagram || '').replace(/^@/, '')}</span></a></div>
    </div>
  );
};

export const Mapa = ({ src, style }) => <div className="map" style={style}><iframe title="Mapa da ótica" src={src} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div>;
