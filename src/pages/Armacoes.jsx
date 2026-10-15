import { useEffect, useRef, useState } from 'react';
import { Ic } from '../components/Icons.jsx';
import { useSite } from '../state/content.jsx';
import { bgOf, lista } from '../lib/util.js';
import { animarGrade } from '../lib/anim.js';

export const CATEGORIAS = [['todos', 'todos'], ['grau', 'grau'], ['sol', 'sol'], ['infantil', 'infantil'], ['esportivo', 'esportivo']];
const rotuloCat = Object.fromEntries(CATEGORIAS);

export default function Armacoes() {
  const { cms, info, wa, animar } = useSite();
  const [filtro, setFiltro] = useState('todos');
  const grade = useRef(null), primeira = useRef(true);
  useEffect(() => { if (primeira.current) { primeira.current = false; return; } if (animar) animarGrade(grade.current); }, [filtro]); // eslint-disable-line react-hooks/exhaustive-deps

  const produtos = filtro === 'todos' ? cms.produtos : cms.produtos.filter(x => x.cat === filtro);
  return (
    <div data-screen-label="Armações">
      <section data-hero className="dark hero"><div>
        <div className="eyebrow" style={{ marginBottom: 20 }}>armações e óculos de sol</div>
        <h1 className="h-page" style={{ marginBottom: 18, maxWidth: 820 }}>um modelo para cada <span className="b">rosto e rotina.</span></h1>
        <p className="lead lead--inv" style={{ maxWidth: 560 }}>Uma seleção do que temos na loja. Os preços variam conforme as lentes — fale com a gente para montar o seu óculos completo.</p>
      </div></section>

      <section data-reveal className="px" style={{ paddingTop: 'clamp(28px,4vw,48px)', paddingBottom: 'clamp(48px,7vw,88px)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 28 }}>
          <div role="group" aria-label="Filtrar" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {CATEGORIAS.map(([id, label]) => <button key={id} className="filter" aria-pressed={filtro === id} onClick={() => setFiltro(id)}>{label}</button>)}
          </div>
          <div style={{ font: "400 13px 'DM Sans',sans-serif", color: 'var(--muted-2)' }} aria-live="polite">{produtos.length} {produtos.length === 1 ? 'modelo' : 'modelos'}</div>
        </div>
        <div data-grid-produtos ref={grade} className="grid grid--fill" style={{ '--min': '230px' }}>
          {produtos.map((p, i) => (
            <div key={p.nome + i} style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <div className="ph" style={{ aspectRatio: '4/3', borderRadius: 16, backgroundColor: '#f0efec', backgroundImage: bgOf(p.img), fontSize: 12, marginBottom: 12, position: 'relative' }} role={p.img ? 'img' : undefined} aria-label={p.img ? p.nome : undefined}>
                {!p.img && <>foto: {p.nome}</>}
                <span className="badge" style={{ left: 12, background: '#fff', color: 'var(--ink)' }}>{rotuloCat[p.cat] || p.cat}</span>
                {p.destaque ? <span className="badge" style={{ right: 12, background: 'var(--ink)', color: '#fff' }}>{p.selo || 'destaque'}</span> : null}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, font: "400 12px 'DM Sans',sans-serif", color: 'var(--muted-2)', marginBottom: 4 }}><span>{p.marca}</span>{p.preco ? <span style={{ color: 'var(--ink)', fontWeight: 500 }}>{p.preco}</span> : null}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <div style={{ font: "500 18px 'Outfit',sans-serif" }}>{p.nome}</div>
                <a href={wa.msg(`Olá! Tenho interesse na armação "${p.nome}" (${p.marca}). Pode me passar mais informações?`)} target="_blank" rel="noopener" className="pill-sm"><Ic n="wa" s={14} /><span>consultar</span></a>
              </div>
            </div>
          ))}
        </div>
        {produtos.length === 0 && <div style={{ font: "400 15px 'DM Sans',sans-serif", color: 'var(--muted-2)', padding: '12px 0' }}>Nenhum modelo nesta categoria no momento — chame no WhatsApp que mostramos o que chegou.</div>}
      </section>

      <section data-reveal style={{ margin: '0 var(--px) clamp(48px,7vw,88px)', borderTop: '1px solid var(--line)', paddingTop: 36 }}>
        <div className="eyebrow" style={{ marginBottom: 18 }}>marcas que trabalhamos</div>
        <div data-grid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: 10 }}>
          {lista(info.marcas).map(m => <div key={m} className="chip-box">{m}</div>)}
        </div>
      </section>
    </div>
  );
}
