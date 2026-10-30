import { useEffect, useRef, useState } from 'react';
import { Ic } from './Icons.jsx';
import { L, NovaAba } from './Layout.jsx';

// Arte da marca: o olho do logo em traço fino (amêndoa, íris com a "fatia" e os quadradinhos), com anéis de lente ao fundo.
// Aparece no lugar da foto enquanto o proprietário não envia uma imagem (ou se ela não carregar). tom: 'areia' | 'escuro'.
// O olho cabe inteiro em qualquer proporção (meet); os anéis passam do quadro e preenchem o bloco (overflow visível).
export const ArteMarca = ({ tom = 'areia' }) => (
  <svg className={`arte arte--${tom}`} viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
    <g fill="none" stroke="currentColor">
      <g strokeOpacity=".22" strokeWidth="1">{[112, 150, 192, 238].map(r => <circle key={r} cx="200" cy="150" r={r} />)}</g>
      <g strokeOpacity=".13" strokeWidth="1">{[292, 352, 420, 500, 590].map(r => <circle key={r} cx="200" cy="150" r={r} />)}</g>
      <g strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M132.3 125.4A72 72 0 0 1 267.7 125.4M132.3 174.6A72 72 0 0 0 267.7 174.6" />
        <path d="M112 150C150 110 250 110 288 150C250 190 150 190 112 150Z" />
        <circle cx="200" cy="150" r="30" />
        <path d="M200 131A19 19 0 1 1 181 150H200Z" />
        <path d="M196.5 146.5H177.5A19 19 0 0 1 196.5 127.5Z" />
      </g>
    </g>
    <g fill="currentColor">{[188, 198, 208].map(x => <g key={x}><rect x={x - 0.25} y="96.75" width="4.5" height="4.5" /><rect x={x - 0.25} y="198.75" width="4.5" height="4.5" /></g>)}</g>
  </svg>
);

// Imagem que preenche o bloco (tag <img> real, para o Google indexar a foto e ler o texto alternativo).
// Se a imagem não carregar, mostra a arte da marca no lugar de um bloco vazio.
export function Img({ src, alt, prioridade = false, tom }) {
  const [falhou, setFalhou] = useState('');
  if (falhou && falhou === src) return <ArteMarca tom={tom} />;
  return <img className="ph__img" src={src} alt={alt || ''} loading={prioridade ? 'eager' : 'lazy'} fetchPriority={prioridade ? 'high' : undefined} decoding="async" onError={() => setFalhou(src)} />;
}

// Bloco de foto; sem imagem, mostra a arte da marca (o texto "foto: ..." fica só nas prévias do painel).
// alt: descrição da foto; sem ele, usa o rótulo. alt="" (foto decorativa ou repetida no texto ao lado) é respeitado.
export function Foto({ img, rotulo, alt, ratio, radius = 20, dark = false, prioridade = false, style, className = '', children }) {
  const tom = dark ? 'escuro' : 'areia';
  return (
    <div className={`ph ${dark ? 'ph--dark' : ''} ${className}`} style={{ aspectRatio: ratio, borderRadius: radius, ...style }}>
      {img ? <Img src={img} alt={alt ?? rotulo} prioridade={prioridade} tom={tom} /> : <ArteMarca tom={tom} />}
      {children}
    </div>
  );
}

export const LinkSeta = ({ to, href, children }) => (to
  ? <L to={to} className="link-arrow">{children}<Ic n="arrow" s={14} /></L>
  : <NovaAba href={href} className="link-arrow">{children}<Ic n="arrow" s={14} /></NovaAba>);

// descricao: id de um texto que complementa o botão (ex.: aviso de privacidade), lido pelo leitor de tela.
export const BtnWa = ({ href, children = 'falar no WhatsApp', variant = 'light', sm = false, descricao }) => (
  <NovaAba href={href} aria-describedby={descricao} className={`btn btn--ic btn--${variant} ${sm ? 'btn--sm' : ''}`}><Ic n="wa" /><span>{children}</span></NovaAba>
);

// Texto com parágrafos de verdade: cada linha em branco separa um <p>; quebras simples continuam como quebra de linha.
export const Paragrafos = ({ texto, espaco = '1em', style }) => String(texto || '').split(/\n{2,}/).map(t => t.trim()).filter(Boolean)
  .map((t, i) => <p key={i} style={{ whiteSpace: 'pre-line', marginTop: i ? espaco : 0, ...style }}>{t}</p>);

// Aviso de privacidade logo abaixo dos botões de enviar receita (dado de saúde; LGPD, arts. 11 e 14).
export const AvisoReceita = ({ id, inv = false, style }) => (
  <p id={id} className={`aviso-receita${inv ? ' aviso-receita--inv' : ''}`} style={style}>
    Ao enviar a foto da receita, você autoriza o uso dela só para preparar o seu orçamento. Se a receita for de uma criança, envie como pai, mãe ou responsável. <L to="politica-de-privacidade">Política de Privacidade</L>.
  </p>
);

export const Titulo = ({ as: T = 'h2', a, b, className = 'h-sec', style }) => <T className={className} style={style}>{a}{b ? <> <span className="b">{b}</span></> : null}</T>;

export function Evento({ ev, comImagem = false }) {
  return (
    <div style={{ background: 'var(--sand)', borderRadius: 18, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {comImagem ? <div className="ph" style={{ aspectRatio: '16/9', maxHeight: ev.img ? undefined : 240 }}>{ev.img ? <Img src={ev.img} alt="" /> : <ArteMarca />}</div> : null}
      <div className="event" style={{ padding: 22, gridTemplateColumns: comImagem ? '64px 1fr' : undefined, gap: comImagem ? 16 : undefined }}>
        <div className="event__date" style={comImagem ? { paddingRight: 14 } : undefined}><div className="event__dia" style={comImagem ? { fontSize: 32 } : undefined}>{ev.dia}</div><div className="event__mes">{ev.mes}</div></div>
        <div className="min0">
          <h3 className="event__t">{ev.titulo}</h3>
          <div className="t-small" style={{ lineHeight: 1.5, marginBottom: 8 }}>{ev.texto}</div>
          <div className="event__meta"><Ic n="pin" s={13} />{ev.local}{comImagem && ev.hora ? ` · ${ev.hora}` : ''}</div>
        </div>
      </div>
    </div>
  );
}

// Horário: sem horário confirmado, orienta a consultar pelo WhatsApp; sábado vazio = fechado.
export const InfoContato = ({ site, comStatus = false }) => {
  const { info, wa, tel, emp, igLink, status, horarioSemana, horarioSabado } = site;
  return (
    <div className="info-grid">
      <div><div className="lbl">endereço</div>{info.endereco}<br />{info.bairroCidade}<br />{info.cep}</div>
      <div><div className="lbl">horário</div>
        {horarioSemana ? <>seg–sex · {horarioSemana}<br />sábado · {horarioSabado || 'fechado'}</> : <NovaAba href={wa.link} className="u-link"><span>consulte o horário pelo WhatsApp</span></NovaAba>}
        {comStatus && status ? <><br /><span className="status" style={{ marginTop: 6, font: "500 12px 'DM Sans',sans-serif", color: 'var(--ink)' }}><span className="dot" style={{ background: status.cor }} />{status.texto}</span></> : null}
      </div>
      <div><div className="lbl">{tel ? 'telefones' : 'WhatsApp'}</div><NovaAba href={wa.link} className="u-link"><Ic n="wa" s={14} style={{ color: 'var(--wa-escuro)' }} /><span>{wa.fmt}</span></NovaAba>
        {tel ? <><br /><a href={tel.link} className="u-link"><Ic n="tel" s={14} /><span>{tel.fmt}</span></a></> : null}
      </div>
      <div><div className="lbl">instagram</div><NovaAba href={igLink} className="u-link"><Ic n="ig" s={14} /><span>@{String(info.instagram || '').replace(/^@/, '')}</span></NovaAba></div>
      {emp.email ? <div className="min0"><div className="lbl">e-mail</div><a href={'mailto:' + emp.email} className="u-link" style={{ maxWidth: '100%' }}><Ic n="mail" s={14} /><span style={{ overflowWrap: 'anywhere' }}>{emp.email}</span></a></div> : null}
    </div>
  );
};

// Mapa do Google só depois do clique: até lá nenhum dado vai ao Google (sem cookies de terceiros automáticos).
// link: endereço no Google Maps, para abrir direto no aplicativo de mapas.
export function Mapa({ src, link, style }) {
  const [ver, setVer] = useState(false);
  const quadro = useRef(null);
  useEffect(() => { if (ver) quadro.current?.focus(); }, [ver]);
  return (
    <div className="map" style={style}>
      {ver ? <iframe ref={quadro} title="Mapa com a localização da Ótica Digital Look" src={src} referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
        : (
          <div className="map__fachada">
            <span className="map__pin" aria-hidden="true"><Ic n="pin" s={20} /></span>
            <p>O mapa é carregado do Google Maps, que pode registrar seu IP e usar cookies.</p>
            <div className="map__acoes">
              <button type="button" className="btn btn--dark btn--sm" onClick={() => setVer(true)}>mostrar mapa</button>
              {link ? <NovaAba href={link} className="u-link">abrir no Google Maps<Ic n="arrow" s={13} /></NovaAba> : null}
            </div>
          </div>
        )}
    </div>
  );
}
