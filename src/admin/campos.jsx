// Campos do painel: texto, área, seleção, liga/desliga, data, hora e foto (com envio ao servidor).
import { useState } from 'react';
import { Ic } from '../components/Icons.jsx';
import { api } from '../lib/api.js';
import { aviso } from '../lib/toast.js';
import { bgOf, lerImagem } from '../lib/util.js';
import { useContent } from '../state/content.jsx';

const getPath = (o, p) => p.reduce((a, k) => (a == null ? a : a[k]), o);
const setPath = (o, p, v) => { const last = p[p.length - 1]; const alvo = p.slice(0, -1).reduce((a, k) => a[k], o); alvo[last] = v; };

// bind(['info','whatsapp']) → { value, set }
export function useBind() {
  const { cms, editar } = useContent();
  return (path) => ({ value: getPath(cms, path), set: (v) => editar(d => setPath(d, path, v), path.join('.')) });
}

export function Campo({ b, label, tipo = 'text', full, placeholder, rows = 3, opcoes, on = 'ativo', off = 'inativo', ajuda, erro }) {
  const col = full ? '1 / -1' : 'auto';
  const v = b.value ?? (tipo === 'bool' ? false : '');
  if (tipo === 'bool') {
    return (
      <div className="adm-label" style={{ gridColumn: col }}>
        <span>{label}</span>
        <button type="button" onClick={() => b.set(!v)} aria-pressed={!!v} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, border: '1px solid rgba(0,0,0,.14)', background: '#fff', padding: '9px 12px', borderRadius: 999, font: "500 13px 'DM Sans',sans-serif", color: 'var(--ink)', width: 'max-content' }}>
          <span className="switch" data-on={!!v} style={{ background: v ? 'var(--wa)' : '#c9c6c1' }} />{v ? on : off}
        </button>
      </div>
    );
  }
  if (tipo === 'img') return <CampoFoto b={b} label={label} col={col} />;
  return (
    <label className="adm-label" style={{ gridColumn: col }}>
      <span>{label}</span>
      {tipo === 'area' ? <textarea className="adm-in" rows={rows} value={v} placeholder={placeholder} onChange={e => b.set(e.target.value)} />
        : tipo === 'select' ? <select className="adm-in" value={v} onChange={e => b.set(e.target.value)}>{opcoes.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}</select>
        : <input className="adm-in" type={tipo} value={v} placeholder={placeholder} onChange={e => b.set(e.target.value)} aria-invalid={erro ? true : undefined} />}
      {erro ? <span role="alert" style={{ font: "500 12px/1.4 'DM Sans',sans-serif", color: '#b3261e' }}>{erro}</span>
        : ajuda ? <span style={{ font: "400 11px/1.4 'DM Sans',sans-serif", color: 'var(--muted-2)' }}>{ajuda}</span> : null}
    </label>
  );
}

export async function enviarArquivoFoto(file) {
  const dataUrl = await lerImagem(file);
  const { url } = await api.enviarFoto(dataUrl);
  return url;
}

function CampoFoto({ b, label, col }) {
  const [enviando, setEnviando] = useState(false);
  const v = b.value || '';
  const onFile = async (e) => {
    const f = e.target.files && e.target.files[0]; e.target.value = '';
    if (!f) return;
    setEnviando(true);
    try { b.set(await enviarArquivoFoto(f)); } catch (x) { aviso(x.message && x.status ? x.message : 'Não foi possível enviar a imagem.'); }
    finally { setEnviando(false); }
  };
  return (
    <div className="adm-label" style={{ gridColumn: col }}>
      <span>{label}</span>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div className="ph" style={{ width: 120, height: 84, borderRadius: 12, backgroundImage: bgOf(v), flex: 'none' }}>{enviando ? <span className="spinner" style={{ width: 20, height: 20 }} /> : !v && <Ic n="img" s={22} />}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
          <label className="file-btn" aria-disabled={enviando}><Ic n="img" s={14} />{enviando ? 'enviando…' : v ? 'trocar foto' : 'enviar foto'}<input type="file" accept="image/jpeg,image/png,image/webp" onChange={onFile} disabled={enviando} className="sr-only" /></label>
          {v && !enviando ? <button type="button" onClick={() => b.set('')} style={{ border: 0, background: 'none', padding: 0, font: "500 12px 'DM Sans',sans-serif", color: '#b3261e', textAlign: 'left', width: 'max-content' }}>remover foto</button> : null}
          <div style={{ font: "400 11px/1.4 'DM Sans',sans-serif", color: 'var(--muted-2)' }}>JPG, PNG ou WebP. Redimensionamos automaticamente.</div>
        </div>
      </div>
    </div>
  );
}

const Grade = ({ children }) => <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,240px),1fr))', gap: 14 }}>{children}</div>;

const CabecalhoBloco = ({ titulo, desc }) => titulo ? (
  <div style={{ padding: '8px 4px 0' }}>
    <div className="eyebrow" style={{ letterSpacing: '.12em' }}>{titulo}</div>
    {desc ? <div style={{ font: "400 13px/1.5 'DM Sans',sans-serif", color: 'var(--muted)', marginTop: 4 }}>{desc}</div> : null}
  </div>
) : null;

// Bloco com campos fixos (ex.: dados da loja).
export function BlocoInfo({ titulo, desc, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <CabecalhoBloco titulo={titulo} desc={desc} />
      <div className="adm-card"><Grade>{children}</Grade></div>
    </div>
  );
}

// Lista editável: adicionar, duplicar, reordenar e remover itens.
// pessoal: itens com dados de pessoas (equipe, depoimentos) — ao remover, explica como apagar do histórico.
export function BlocoLista({ chave, titulo, desc, tituloDe, novo, addLabel, campos, pessoal }) {
  const { cms, editar } = useContent();
  const bind = useBind();
  const itens = cms[chave] || [];
  const mexer = (fn) => editar(d => { d[chave] = d[chave] || []; fn(d[chave]); });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <CabecalhoBloco titulo={titulo} desc={desc} />
      {novo ? <button className="adm-add" onClick={() => mexer(a => a.unshift(novo()))}>+ {addLabel}</button> : null}
      {itens.length === 0 && <div style={{ font: "400 14px 'DM Sans',sans-serif", color: 'var(--muted-2)', padding: 4 }}>Nenhum item ainda.</div>}
      {itens.map((it, i) => (
        <div key={i} className="adm-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <div style={{ font: "500 16px 'Outfit',sans-serif", minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tituloDe(it) || `item ${i + 1}`}</div>
            <div style={{ display: 'flex', gap: 6, flex: 'none' }}>
              <button className="adm-ic" style={{ width: 'auto', padding: '0 12px', borderRadius: 999, font: "500 12px 'DM Sans',sans-serif" }} onClick={() => mexer(a => a.splice(i + 1, 0, structuredClone(it)))}>duplicar</button>
              <button className="adm-ic" aria-label="Mover para cima" disabled={i === 0} onClick={() => mexer(a => { [a[i - 1], a[i]] = [a[i], a[i - 1]]; })}>↑</button>
              <button className="adm-ic" aria-label="Mover para baixo" disabled={i === itens.length - 1} onClick={() => mexer(a => { [a[i + 1], a[i]] = [a[i], a[i + 1]]; })}>↓</button>
              <button className="adm-ic" aria-label="Remover" style={{ color: '#b3261e' }} onClick={() => { if (confirm(pessoal ? 'Remover do site? O item ainda fica guardado no histórico de versões. Para apagar de vez (inclusive a foto), use depois "apagar histórico e fotos antigas" em configurações.' : 'Remover este item?')) mexer(a => a.splice(i, 1)); }}><Ic n="trash" s={15} /></button>
            </div>
          </div>
          <Grade>{campos((k) => bind([chave, i, k]), it)}</Grade>
        </div>
      ))}
    </div>
  );
}
