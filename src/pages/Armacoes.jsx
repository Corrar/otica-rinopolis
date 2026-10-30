import { useEffect, useRef, useState } from 'react';
import { Ic } from '../components/Icons.jsx';
import { useSite } from '../state/content.jsx';
import { colunas, lista, tamanhosColunas } from '../lib/util.js';
import { NovaAba } from '../components/Layout.jsx';
import { ArteMarca, Img } from '../components/bits.jsx';
import { animarGrade } from '../lib/anim-lazy.js';

export const CATEGORIAS = [['todos', 'todos'], ['grau', 'grau'], ['sol', 'sol'], ['infantil', 'infantil'], ['esportivo', 'esportivo']];
const rotuloCat = Object.fromEntries(CATEGORIAS);
const rotuloAlt = { grau: 'óculos de grau', sol: 'óculos de sol', infantil: 'óculos infantis', esportivo: 'óculos esportivos' };

export default function Armacoes() {
  const { cms, info, wa, animar } = useSite();
  const [filtro, setFiltro] = useState('todos');
  const grade = useRef(null), primeira = useRef(true);
  useEffect(() => { if (primeira.current) { primeira.current = false; return; } if (animar) animarGrade(grade.current); }, [filtro]); // eslint-disable-line react-hooks/exhaustive-deps

  const todos = cms.produtos || [];
  // Filtros só das categorias que têm modelos cadastrados.
  const categorias = CATEGORIAS.filter(([id]) => id === 'todos' || todos.some(x => x.cat === id));
  const produtos = filtro === 'todos' ? todos : todos.filter(x => x.cat === filtro);
  const marcas = lista(info.marcas);
  return (
    <div data-screen-label="Armações">
      <section data-hero className="dark hero"><div>
        <div className="eyebrow" style={{ marginBottom: 20 }}>armações e óculos de sol</div>
        <h1 className="h-page" style={{ marginBottom: 18, maxWidth: 820 }}>um modelo para cada <span className="b">rosto e rotina.</span></h1>
        <p className="lead lead--inv" style={{ maxWidth: 560 }}>Algumas das armações e óculos de sol da nossa vitrine. Para ver os modelos disponíveis e os valores, chame no WhatsApp ou passe na loja.</p>
      </div></section>

      <section data-reveal className="px" style={{ paddingTop: 'clamp(28px,4vw,48px)', paddingBottom: 'clamp(48px,7vw,88px)' }}>
        {todos.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 28 }}>
            {categorias.length > 2 ? (
              <div role="group" aria-label="Filtrar" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {categorias.map(([id, label]) => <button key={id} className="filter" aria-pressed={filtro === id} onClick={() => setFiltro(id)}>{label}</button>)}
              </div>
            ) : <span />}
            <div style={{ font: "400 13px 'DM Sans',sans-serif", color: 'var(--muted-2)' }} aria-live="polite">{produtos.length} {produtos.length === 1 ? 'modelo' : 'modelos'}</div>
          </div>
        )}
        {produtos.length > 0 ? <h2 className="sr-only">modelos disponíveis</h2> : null}
        <ul data-grid-produtos ref={grade} role="list" className="grid grid--cols" style={colunas(produtos.length)}>
          {produtos.map((p, i) => (
            <li key={p.nome + i} style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <div className="ph" style={{ aspectRatio: '4/3', borderRadius: 16, backgroundColor: '#f0efec', fontSize: 12, marginBottom: 12 }}>
                {p.img ? <Img src={p.img} alt={`${p.nome}${p.marca ? ` (${p.marca})` : ''} — ${rotuloAlt[p.cat] || 'óculos'}`} tamanhos={tamanhosColunas(produtos.length)} /> : <ArteMarca />}
                <span className="badge" style={{ left: 12, background: '#fff', color: 'var(--ink)' }}>{rotuloCat[p.cat] || p.cat}</span>
                {p.destaque ? <span className="badge" style={{ right: 12, background: 'var(--ink)', color: '#fff' }}>{p.selo || 'destaque'}</span> : null}
              </div>
              {p.marca || p.preco ? <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2px 10px', flexWrap: 'wrap', font: "400 12px 'DM Sans',sans-serif", color: 'var(--muted-2)', marginBottom: 4 }}><span>{p.marca}</span>{p.preco ? <span style={{ color: 'var(--ink)', fontWeight: 500 }}>{p.preco}</span> : null}</div> : null}
              {/* Nome em cima e botão embaixo: os cards da mesma linha ficam com a mesma altura. */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
                <h3 className="prod-nome">{p.nome}</h3>
                <NovaAba href={wa.msg(`Olá! Vi no site "${p.nome}"${p.marca ? ` (${p.marca})` : ''} e gostaria de mais informações.`)} className="pill-sm"><Ic n="wa" s={14} /><span>consultar</span><span className="sr-only"> {p.nome} no WhatsApp</span></NovaAba>
              </div>
            </li>
          ))}
        </ul>
        {produtos.length === 0 && <div style={{ font: "400 15px 'DM Sans',sans-serif", color: 'var(--muted-2)', padding: '12px 0' }}>{filtro !== 'todos' ? 'Nenhum modelo nesta categoria no momento — chame no WhatsApp que mostramos o que chegou.' : <>Chame no <NovaAba href={wa.link} className="u-link">WhatsApp</NovaAba> para ver os modelos disponíveis na loja.</>}</div>}
      </section>

      {marcas.length > 0 && (
        <section data-reveal style={{ margin: '0 var(--px) clamp(48px,7vw,88px)', borderTop: '1px solid var(--line)', paddingTop: 36 }}>
          <h2 className="eyebrow" style={{ marginBottom: 18 }}>marcas que trabalhamos</h2>
          <ul data-grid role="list" className="chips chips--6">
            {marcas.map(m => <li key={m} className="chip-box">{m}</li>)}
          </ul>
        </section>
      )}
    </div>
  );
}
