// Partes comuns das páginas de texto fixo da LGPD: Política de Privacidade e Termos de Uso.
// O texto fica no código (não é editável pelo painel); os dados da empresa vêm das informações da loja.
import { Ic } from './Icons.jsx';
import { BtnWa } from './bits.jsx';
import { NOME } from '../lib/seo.js';

// Link externo em nova aba.
export const NovaAba = ({ href, children }) => <a href={href} target="_blank" rel="noopener">{children}</a>;

// "04/11/2026" → "2026-11-04" (atributo datetime)
const isoDe = (d) => String(d).split('/').reverse().join('-');

// Sumário: lista fixa ao lado do texto no computador; no celular, recolhível no topo (só um aparece por vez).
function Sumario({ secoes }) {
  const itens = <ol>{secoes.map(([id, t]) => <li key={id}><a href={'#' + id}>{t}</a></li>)}</ol>;
  return (
    <>
      <details className="legal__sumario-mob"><summary>nesta página</summary><nav aria-label="nesta página">{itens}</nav></details>
      <nav className="legal__sumario" aria-label="nesta página"><div className="legal__sumario-t">nesta página</div>{itens}</nav>
    </>
  );
}

// secoes: [[id, título curto], ...] para o sumário. data: DD/MM/AAAA.
export function PaginaLegal({ rotulo, eyebrow, a, b, resumo, data, secoes, children }) {
  return (
    <div data-screen-label={rotulo}>
      <section data-hero className="px" style={{ paddingTop: 'clamp(40px,6vw,80px)', paddingBottom: 'clamp(28px,4vw,48px)' }}><div style={{ maxWidth: 860 }}>
        <div className="eyebrow" style={{ marginBottom: 20 }}>{eyebrow}</div>
        <h1 className="h-page" style={{ marginBottom: 18 }}>{a} <span className="b">{b}</span></h1>
        <p className="lead" style={{ color: 'var(--text-2)', maxWidth: 680, marginBottom: 16 }}>{resumo}</p>
        <p className="t-small">Última atualização: <time dateTime={isoDe(data)}>{data}</time></p>
      </div></section>
      <div className="px legal">
        <Sumario secoes={secoes} />
        <div className="legal__texto">{children}</div>
      </div>
    </div>
  );
}

// n: número da seção ("01").
export const Secao = ({ id, n, titulo, children }) => (
  <section id={id} aria-labelledby={id + '-t'} className="legal__secao">
    <h2 id={id + '-t'} className="legal__h2">{n ? <span className="legal__n" aria-hidden="true">{n}</span> : null}<span>{titulo}</span></h2>
    {children}
  </section>
);

export const Sub = ({ children }) => <h3 className="legal__h3">{children}</h3>;

// Tabela que vira lista de cartões no celular (os papéis ARIA mantêm a leitura como tabela).
export const Tabela = ({ legenda, cab, linhas }) => (
  <div className="tabela">
    <table role="table">
      {legenda ? <caption>{legenda}</caption> : null}
      <thead role="rowgroup"><tr role="row">{cab.map(c => <th key={c} role="columnheader" scope="col">{c}</th>)}</tr></thead>
      <tbody role="rowgroup">
        {linhas.map((l, i) => <tr key={i} role="row">{l.map((c, j) => <td key={j} role="cell" data-label={cab[j]}>{c}</td>)}</tr>)}
      </tbody>
    </table>
  </div>
);

// Pontos principais em destaque (fundo escuro, com marcadores de check).
export const Destaques = ({ titulo = 'em poucas palavras', itens }) => (
  <section className="legal__destaques" aria-labelledby="destaques-t" id="em-poucas-palavras">
    <h2 id="destaques-t" className="legal__destaques-t">{titulo}</h2>
    <ul role="list">{itens.map((t, i) => <li key={i}><Ic n="check" s={15} /><span>{t}</span></li>)}</ul>
  </section>
);

const endereco = (info) => `${info.endereco} – ${info.bairroCidade}${info.cep ? `, CEP ${info.cep}` : ''}`;

// Ficha da empresa (controladora / fornecedora), com os dados das informações da loja.
export function Empresa({ site }) {
  const { info, wa, tel } = site;
  const linhas = [
    ['nome', NOME],
    info.cnpj && ['CNPJ', info.cnpj],
    ['endereço', endereco(info)],
    ['WhatsApp', <NovaAba href={wa.link}>{wa.fmt}</NovaAba>],
    tel && ['telefone', <a href={tel.link}>{tel.fmt}</a>],
  ].filter(Boolean);
  return <dl className="legal__ficha">{linhas.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>;
}

// Canais de atendimento. msg: texto que já vem escrito ao abrir o WhatsApp.
export function Canais({ site, msg }) {
  const { info, wa, tel } = site;
  return (
    <ul className="legal__canais" role="list">
      <li><Ic n="wa" s={16} /><span>WhatsApp: <NovaAba href={msg ? wa.msg(msg) : wa.link}>{wa.fmt}</NovaAba></span></li>
      {tel ? <li><Ic n="tel" s={16} /><span>telefone: <a href={tel.link}>{tel.fmt}</a></span></li> : null}
      <li><Ic n="pin" s={16} /><span>na loja: {endereco(info)}</span></li>
    </ul>
  );
}

// Fechamento com botão do WhatsApp.
export const Fechamento = ({ titulo, texto, href }) => (
  <div className="legal__fim">
    <div className="min0"><div style={{ font: "500 20px 'Outfit',sans-serif", marginBottom: 4 }}>{titulo}</div><div style={{ font: "400 14px/1.5 'DM Sans',sans-serif", color: 'var(--muted)' }}>{texto}</div></div>
    <BtnWa href={href} variant="dark" sm />
  </div>
);
