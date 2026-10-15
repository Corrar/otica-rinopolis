import { Ic } from '../components/Icons.jsx';
import { L } from '../components/Layout.jsx';
import { BtnWa, Foto } from '../components/bits.jsx';
import { useSite } from '../state/content.jsx';
import { bgOf, postsDe } from '../lib/util.js';

export function Blog() {
  const { cms } = useSite();
  const posts = postsDe(cms);
  const [destaque, ...resto] = posts;
  return (
    <div data-screen-label="Blog">
      <section data-hero className="px" style={{ paddingTop: 'clamp(40px,6vw,80px)', paddingBottom: 32 }}><div>
        <div className="eyebrow" style={{ marginBottom: 20 }}>blog · dicas</div>
        <h1 className="h-page">cuidar dos olhos <span className="b">todo dia.</span></h1>
      </div></section>

      {destaque && (
        <section data-reveal className="px" style={{ paddingBottom: 'clamp(32px,5vw,64px)' }}>
          <L to={'blog/' + destaque.slug} className="split" style={{ '--min': '360px', gap: 'clamp(24px,4vw,40px)', alignItems: 'center', color: 'var(--ink)' }}>
            <Foto img={destaque.img} rotulo="" ratio="16/10">{!destaque.img && 'foto do artigo'}</Foto>
            <div className="min0">
              <div style={{ font: "400 13px 'DM Sans',sans-serif", color: 'var(--muted-2)', marginBottom: 12 }}>{destaque.tag} · {destaque.data} · {destaque.leitura}</div>
              <h2 style={{ font: "300 clamp(26px,3.2vw,40px)/1.15 'Outfit',sans-serif", letterSpacing: '-.02em', marginBottom: 14, textWrap: 'pretty' }}>{destaque.titulo}</h2>
              {destaque.resumo ? <p style={{ font: "400 16px/1.6 'DM Sans',sans-serif", color: 'var(--text-2)', marginBottom: 18, whiteSpace: 'pre-line' }}>{destaque.resumo}</p> : null}
              <span className="link-arrow">ler artigo<Ic n="arrow" s={14} /></span>
            </div>
          </L>
        </section>
      )}

      <section data-reveal className="px" style={{ paddingBottom: 'clamp(48px,7vw,88px)' }}>
        <div style={{ borderTop: '1px solid var(--line)' }}>
          {resto.map(p => (
            <L key={p.slug} to={'blog/' + p.slug} className="post-row">
              <div style={{ font: "400 13px/1.5 'DM Sans',sans-serif", color: 'var(--muted-2)', flex: '0 0 130px' }}>{p.tag}<br />{p.data}</div>
              <div style={{ flex: '1 1 240px', minWidth: 0 }}>
                <div style={{ font: "400 clamp(18px,2vw,24px)/1.3 'Outfit',sans-serif", textWrap: 'pretty' }}>{p.titulo}</div>
                {p.resumo ? <div className="t-small" style={{ marginTop: 6, whiteSpace: 'pre-line' }}>{p.resumo}</div> : null}
              </div>
              <Ic n="arrow" s={22} />
            </L>
          ))}
        </div>
      </section>
    </div>
  );
}

export function Artigo({ slug }) {
  const { cms, wa } = useSite();
  const posts = postsDe(cms);
  const artigo = posts.find(p => p.slug === slug);
  if (!artigo) return <NaoEncontrada texto="Esse artigo não existe mais ou mudou de endereço." voltar="blog" voltarTxt="ver todos os artigos" />;
  return (
    <div data-screen-label="Artigo">
      <section data-hero className="px" style={{ paddingTop: 'clamp(32px,5vw,64px)' }}><div style={{ maxWidth: 820 }}>
        <L to="blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: "500 13px 'DM Sans',sans-serif", color: 'var(--muted)', marginBottom: 24 }}><Ic n="arrow" s={14} style={{ transform: 'rotate(180deg)' }} />voltar ao blog</L>
        <div style={{ font: "400 13px 'DM Sans',sans-serif", color: 'var(--muted-2)', marginBottom: 14 }}>{artigo.tag} · {artigo.data} · {artigo.leitura}</div>
        <h1 style={{ font: "300 clamp(32px,4.5vw,56px)/1.08 'Outfit',sans-serif", letterSpacing: '-.02em', marginBottom: 20, textWrap: 'pretty' }}>{artigo.titulo}</h1>
        {artigo.resumo ? <p style={{ font: "400 clamp(16px,1.6vw,19px)/1.6 'DM Sans',sans-serif", color: 'var(--text-2)', marginBottom: 28, whiteSpace: 'pre-line' }}>{artigo.resumo}</p> : null}
      </div></section>
      <section data-reveal className="px" style={{ paddingBottom: 'clamp(48px,7vw,88px)' }}>
        <div style={{ maxWidth: 820 }}>
          {artigo.img ? <div style={{ aspectRatio: '16/9', borderRadius: 20, background: 'var(--ph)', backgroundImage: bgOf(artigo.img), backgroundSize: 'cover', backgroundPosition: 'center', marginBottom: 32 }} /> : null}
          <div style={{ font: "400 clamp(16px,1.5vw,18px)/1.75 'DM Sans',sans-serif", color: 'var(--ink-2)', whiteSpace: 'pre-line', textWrap: 'pretty' }}>{artigo.conteudo === artigo.resumo ? '' : artigo.conteudo}</div>
          <div style={{ marginTop: 40, background: 'var(--sand)', borderRadius: 20, padding: 'clamp(22px,3vw,32px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div className="min0"><div style={{ font: "500 20px 'Outfit',sans-serif", marginBottom: 4 }}>ficou com dúvida?</div><div style={{ font: "400 14px 'DM Sans',sans-serif", color: 'var(--muted)' }}>Fale com a gente — respondemos em horário comercial.</div></div>
            <BtnWa href={wa.link} variant="dark" sm />
          </div>
        </div>
      </section>
    </div>
  );
}

export function NaoEncontrada({ texto = 'A página que você procurou não existe.', voltar = 'inicio', voltarTxt = 'voltar ao início' }) {
  return (
    <div data-screen-label="404">
      <section data-hero className="px" style={{ paddingTop: 'clamp(48px,8vw,120px)', paddingBottom: 'clamp(48px,8vw,120px)' }}><div>
        <div className="eyebrow" style={{ marginBottom: 20 }}>página não encontrada</div>
        <h1 className="h-page" style={{ marginBottom: 18 }}>não achamos <span className="b">o que você procura.</span></h1>
        <p className="lead" style={{ color: 'var(--text-2)', marginBottom: 28 }}>{texto}</p>
        <L to={voltar} className="btn btn--dark btn--sm">{voltarTxt}</L>
      </div></section>
    </div>
  );
}
