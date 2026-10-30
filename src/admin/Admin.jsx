import { useCallback, useEffect, useState } from 'react';
import { Ic } from '../components/Icons.jsx';
import { L, Status } from '../components/Layout.jsx';
import { BlocoInfo, BlocoLista, Campo, useBind } from './campos.jsx';
import { Configuracoes, FormSenha } from './Configuracoes.jsx';
import { CATEGORIAS } from '../pages/Armacoes.jsx';
import { useContent, useSite } from '../state/content.jsx';
import { api } from '../lib/api.js';
import { aviso } from '../lib/toast.js';
import { agoraBrasilia, empresa, eventosFuturos, fmtData, horaValida, lista, num2, postsDe, promosAtivas } from '../lib/util.js';
import { dataIso, temTexto } from '../lib/seo.js';
import { ehIlustrativa, PADRAO } from '../content/defaults.js';
import { cnpjValido, emailValido, facebookValido, googleValido } from '../lib/validar.js';

const ABAS = [
  ['visao', 'visão geral', 'Resumo do site e o que ainda falta preencher.', 'inicio'],
  ['info', 'informações', 'Dados da loja, horários, redes e textos gerais.', 'contato'],
  ['home', 'página inicial', 'Capa, selos, faixa de aviso e "como funciona". Não anuncie exames de vista. Prazo, garantia e gratuidade publicados obrigam a loja.', 'inicio'],
  ['fotos', 'fotos e galeria', 'Imagens das seções fixas e a galeria da loja.', 'sobre'],
  ['promocoes', 'promoções', 'Aparecem na página de convênios. Desative sem apagar. Informe a validade e as condições: a oferta publicada obriga a loja.', 'convenios'],
  ['eventos', 'eventos', 'Futuros aparecem na home e em convênios; passados somem sozinhos. Não anuncie exame de vista, teste de visão, triagem, aferição de pressão ocular nem médico atendendo na loja.', 'convenios'],
  ['produtos', 'armações', 'Vitrine com filtro por categoria, selo de destaque e preço opcional.', 'armacoes'],
  ['lentes', 'lentes de contato', 'Tipos de lente, passo a passo e perguntas frequentes.', 'lentes'],
  ['sobre', 'sobre e equipe', 'História, linha do tempo, diferenciais e equipe. Só pessoas reais, com autorização escrita de uso de imagem. Cargo técnico (óptico) só com habilitação.', 'sobre'],
  ['depoimentos', 'depoimentos', 'Use só depoimentos reais, com autorização por escrito do cliente. Prefira primeiro nome e inicial (ex.: Ana P.) e não informe o problema de visão.', 'inicio'],
  ['posts', 'blog', 'Artigos completos. O primeiro é o destaque. Conteúdo informativo: oriente a procurar o oftalmologista e não indique lentes de grau.', 'blog'],
  ['config', 'configurações', 'Senha, backup, histórico de versões e acesso.', 'inicio'],
];

export default function Admin({ wide }) {
  const [sessao, setSessao] = useState(null); // null = verificando
  const { salvar, tentarDeNovo, recarregar } = useContent();

  useEffect(() => { api.sessao().then(setSessao).catch(() => setSessao({ logado: false, erro: true })); }, []);
  // Ao entrar, busca a versão atual sem cache do CDN (evita editar sobre uma versão antiga e cair em conflito).
  useEffect(() => { if (sessao?.logado && salvar.status === 'ocioso') recarregar().catch(() => {}); }, [sessao?.logado]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (salvar.status === 'sessao') setSessao(s => ({ ...s, logado: false, expirou: true })); }, [salvar.status]);

  const entrou = (s) => { setSessao(s); if (salvar.status === 'sessao') tentarDeNovo(); };

  return (
    <div data-screen-label="Admin" data-admin className="adm">
      {sessao === null ? <div className="loading"><span className="spinner" /></div>
        : sessao.logado && sessao.senhaInicial ? <TrocaInicial setSessao={setSessao} />
        : sessao.logado ? <Painel wide={wide} sessao={sessao} setSessao={setSessao} sair={() => setSessao({ logado: false })} />
        : <Login onOk={entrou} expirou={sessao.expirou} />}
    </div>
  );
}

function Login({ onOk, expirou }) {
  const [senha, setSenha] = useState(''), [lembrar, setLembrar] = useState(false), [erro, setErro] = useState(''), [enviando, setEnviando] = useState(false);
  const entrar = async (e) => {
    e.preventDefault(); setEnviando(true); setErro('');
    try { const s0 = await api.entrar(senha, lembrar); const s = await api.sessao().catch(() => s0); if (!s.senhaInicial) aviso('Bem-vindo! Alterações são salvas automaticamente.'); onOk(s); }
    catch (x) { setErro(x.message); } finally { setEnviando(false); }
  };
  return (
    <section style={{ padding: 'clamp(48px,8vw,120px) var(--px)', display: 'flex', justifyContent: 'center' }}>
      <form onSubmit={entrar} style={{ background: '#fff', borderRadius: 24, padding: 'clamp(28px,4vw,44px)', width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 16, boxShadow: '0 10px 40px rgba(0,0,0,.06)' }}>
        <div className="circle-44" style={{ width: 48, height: 48, background: 'var(--ink)', color: '#fff' }}><Ic n="lock" s={20} /></div>
        <div>
          <h1 style={{ font: "300 30px/1.1 'Outfit',sans-serif", letterSpacing: '-.02em', marginBottom: 6 }}>área do <span className="b">proprietário</span></h1>
          <div style={{ font: "400 14px/1.5 'DM Sans',sans-serif", color: 'var(--muted)' }}>{expirou ? 'Sua sessão expirou. Entre novamente — suas alterações ainda não salvas serão enviadas.' : 'Atualize textos, fotos, promoções e eventos do site.'}</div>
        </div>
        <label className="field">senha<input className="input" type="password" value={senha} onChange={e => { setSenha(e.target.value); setErro(''); }} placeholder="••••••••" autoFocus autoComplete="current-password" required /></label>
        {erro && <div role="alert" style={{ font: "400 13px 'DM Sans',sans-serif", color: '#b3261e' }}>{erro}</div>}
        <button type="button" onClick={() => setLembrar(!lembrar)} aria-pressed={lembrar} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, border: 0, background: 'none', padding: 0, font: "500 13px 'DM Sans',sans-serif", color: 'var(--text-2)', width: 'max-content' }}>
          <span className="switch" data-on={lembrar} style={{ background: lembrar ? 'var(--wa)' : '#c9c6c1' }} />manter conectado neste aparelho
        </button>
        <button type="submit" disabled={enviando} className="adm-btn adm-btn--dark" style={{ padding: '15px 24px', fontSize: 15, minHeight: 50 }}>{enviando ? 'entrando…' : 'entrar'}</button>
      </form>
    </section>
  );
}

// Primeiro acesso: só a troca da senha inicial; o painel abre depois.
function TrocaInicial({ setSessao }) {
  const sair = async () => { try { await api.sair(); } catch { /* ignora */ } setSessao({ logado: false }); };
  return (
    <section style={{ padding: 'clamp(48px,8vw,120px) var(--px)', display: 'flex', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 24, padding: 'clamp(28px,4vw,44px)', width: '100%', maxWidth: 460, display: 'flex', flexDirection: 'column', gap: 16, boxShadow: '0 10px 40px rgba(0,0,0,.06)' }}>
        <div className="circle-44" style={{ width: 48, height: 48, background: 'var(--ink)', color: '#fff' }}><Ic n="lock" s={20} /></div>
        <div>
          <h1 style={{ font: "300 30px/1.1 'Outfit',sans-serif", letterSpacing: '-.02em', marginBottom: 6 }}>crie a sua <span className="b">senha</span></h1>
          <div style={{ font: "400 14px/1.5 'DM Sans',sans-serif", color: 'var(--muted)' }}>Antes de editar o site, troque a senha inicial por uma que só você saiba. Use pelo menos 10 caracteres — uma frase curta, fácil de lembrar, funciona bem.</div>
        </div>
        <FormSenha inicial rotuloBotao="salvar e continuar" onOk={() => { setSessao(s => ({ ...s, senhaInicial: false })); aviso('Senha criada. Alterações no painel são salvas automaticamente.'); }} />
        <button type="button" onClick={sair} style={{ border: 0, background: 'none', padding: 0, font: "500 13px 'DM Sans',sans-serif", color: 'var(--muted)', width: 'max-content' }}>sair</button>
      </div>
    </section>
  );
}

const fmtDiaHora = (d) => `${num2(d.getDate())}/${num2(d.getMonth() + 1)} às ${num2(d.getHours())}:${num2(d.getMinutes())}`;

// "publicar alterações no Google": quem visita o site já vê as alterações na hora, mas as páginas prontas que o
// Google lê, o sitemap e os dados estruturados só mudam com um novo deploy — o botão dispara esse deploy
// (só aparece com DEPLOY_HOOK_URL configurado; nunca é chamado pelo salvamento automático).
// /publicado.json, gerado no build, diz qual versão do conteúdo está publicada e quando.
function Publicar({ status, diario }) {
  const { cms } = useContent();
  const [publicado, setPublicado] = useState(null); // { atualizadoEm, geradoEm } do último build
  const [pedido, setPedido] = useState(0); // hora do clique, enquanto o novo build não fica pronto
  const [enviando, setEnviando] = useState(false);
  const ler = useCallback(() => fetch('/publicado.json', { cache: 'no-store' }).then(r => (r.ok ? r.json() : null)).then(p => { if (p && p.geradoEm) setPublicado(p); return p; }).catch(() => null), []);
  useEffect(() => { ler(); }, [ler]);
  // Depois do clique, confere a cada 20 s (por até 10 min) se o novo build já está no ar.
  useEffect(() => {
    if (!pedido) return undefined;
    const t = setInterval(async () => {
      const p = await ler();
      if (p && new Date(p.geradoEm).getTime() > pedido) { setPedido(0); aviso('Publicado: as páginas e o sitemap já estão atualizados para o Google.'); }
      else if (Date.now() - pedido > 10 * 60e3) setPedido(0);
    }, 20e3);
    return () => clearInterval(t);
  }, [pedido, ler]);
  const pronto = status === 'salvo' || status === 'ocioso';
  const naoPublicado = publicado && (cms.meta.atualizadoEm || '') !== (publicado.atualizadoEm || '');
  const publicar = async () => {
    setEnviando(true);
    try { await api.publicar(); setPedido(Date.now()); aviso('Publicação iniciada: em 1 a 3 minutos as páginas e o sitemap estarão atualizados.'); }
    catch (x) { aviso(x.message); } finally { setEnviando(false); }
  };
  const ajuda = 'Atualiza as páginas que o Google lê, o sitemap e os dados estruturados (leva de 1 a 3 minutos). Quem visita o site já vê as alterações na hora.'
    + (diario ? ' O site também é republicado sozinho uma vez por dia.' : '');
  const situacao = pedido ? 'publicação em andamento (1 a 3 min)'
    : naoPublicado ? 'há alterações ainda não publicadas no Google'
    : publicado ? `publicado em ${fmtDiaHora(new Date(publicado.geradoEm))}` : '';
  return <>
    <button type="button" className="adm-btn adm-btn--dark" style={{ fontSize: 12, padding: '8px 14px' }} onClick={publicar} disabled={!pronto || enviando} title={pronto ? ajuda : 'Aguarde o salvamento terminar.'}>
      {enviando ? 'publicando…' : 'publicar alterações no Google'}
    </button>
    {situacao && <span style={{ color: naoPublicado && !pedido ? '#7a4b00' : 'var(--muted-2)' }}>{situacao}</span>}
  </>;
}

function IndicadorSalvar({ sessao }) {
  const { salvar, desfazer, podeDesfazer, cms, recarregar, sobrescrever, tentarDeNovo } = useContent();
  const u = cms.meta && cms.meta.atualizadoEm ? new Date(cms.meta.atualizadoEm) : null;
  const ultima = u && !isNaN(u) ? `última alteração: ${num2(u.getDate())}/${num2(u.getMonth() + 1)} às ${num2(u.getHours())}:${num2(u.getMinutes())}` : '';
  const s = salvar.status;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, font: "500 12px 'DM Sans',sans-serif", flexWrap: 'wrap' }} aria-live="polite">
      {s === 'salvo' && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#25a05a' }}><Ic n="check" s={14} />salvo</span>}
      {(s === 'pendente' || s === 'salvando') && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--muted)' }}><span className="spinner" style={{ width: 12, height: 12, borderWidth: 1.5 }} />salvando…</span>}
      {s === 'erro' && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#b3261e' }}>não salvou — {salvar.erro}<button className="adm-btn" onClick={tentarDeNovo}>tentar de novo</button></span>}
      {podeDesfazer && <button className="adm-btn" style={{ fontSize: 12, padding: '8px 14px' }} onClick={() => desfazer() && aviso('Alteração desfeita.')}>↶ desfazer</button>}
      <span style={{ color: 'var(--muted-2)' }}>{ultima}</span>
      {sessao.publicar && <Publicar status={s} diario={sessao.publicarDiario} />}
      {s === 'conflito' && (
        <div role="alert" style={{ flexBasis: '100%', background: '#fff4e5', color: '#7a4b00', borderRadius: 12, padding: '12px 14px', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', font: "400 13px/1.5 'DM Sans',sans-serif" }}>
          <span style={{ flex: '1 1 220px' }}>O site foi alterado em outro aparelho enquanto você editava.</span>
          <button className="adm-btn" onClick={() => recarregar().then(() => aviso('Conteúdo recarregado.'))}>carregar versão mais nova</button>
          <button className="adm-btn adm-btn--dark" onClick={sobrescrever}>manter as minhas alterações</button>
        </div>
      )}
    </div>
  );
}

function Painel({ wide, sessao, setSessao, sair }) {
  const [aba, setAba] = useState('visao');
  const { cms } = useContent();
  const atual = ABAS.find(a => a[0] === aba) || ABAS[0];
  const promos = promosAtivas(cms).length, futuros = eventosFuturos(cms).length;
  const fotosFixas = Object.values(cms.fotos).filter(Boolean).length;
  const contagem = { promocoes: promos, eventos: futuros, produtos: cms.produtos.length, depoimentos: cms.depoimentos.length, posts: cms.posts.length, fotos: (cms.galeria || []).length + fotosFixas };
  const irAba = useCallback((id) => { setAba(id); window.scrollTo({ top: 0 }); }, []);
  const fazerLogout = async () => { try { await api.sair(); } catch { /* ignora */ } sair(); };

  return (
    <section style={{ padding: 'clamp(20px,3vw,32px) var(--px-card) clamp(48px,6vw,80px)', display: 'grid', gridTemplateColumns: wide ? 'minmax(0,220px) minmax(0,1fr)' : 'minmax(0,1fr)', gap: 'clamp(16px,3vw,32px)', alignItems: 'start' }}>
      <aside style={{ display: 'flex', flexDirection: 'column', gap: 4, position: wide ? 'sticky' : 'static', top: 88, minWidth: 0 }}>
        <div className="eyebrow" style={{ fontSize: 11, padding: '8px 12px 10px' }}>painel</div>
        <nav aria-label="Seções do painel" style={{ display: 'flex', flexDirection: wide ? 'column' : 'row', gap: 4, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'thin' }}>
          {ABAS.map(([id, label]) => <button key={id} className="adm-tab" aria-current={aba === id} onClick={() => irAba(id)}><span>{label}</span><span style={{ font: "400 12px 'DM Sans',sans-serif", opacity: .6 }}>{contagem[id] ?? ''}</span></button>)}
        </nav>
        <div style={{ height: 1, background: 'var(--line)', margin: '8px 0' }} />
        <L to={atual[3]} style={{ padding: '10px 14px', font: "500 14px 'DM Sans',sans-serif", display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-2)' }}>ver no site<Ic n="arrow" s={14} /></L>
        <button onClick={fazerLogout} className="adm-tab" style={{ color: 'var(--muted-2)' }}>sair</button>
      </aside>

      <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 12, flexWrap: 'wrap' }}>
          <div><h1 style={{ font: "300 clamp(26px,3vw,36px)/1.1 'Outfit',sans-serif", letterSpacing: '-.02em' }}>{atual[1]}</h1><div style={{ font: "400 14px/1.5 'DM Sans',sans-serif", color: 'var(--muted)', marginTop: 4 }}>{atual[2]}</div></div>
          <IndicadorSalvar sessao={sessao} />
        </div>
        {sessao.armazenamento === 'nenhum' && (
          <div role="alert" style={{ background: '#fdecea', color: '#8c1d18', borderRadius: 14, padding: '12px 16px', font: "400 13px/1.5 'DM Sans',sans-serif" }}>
            O armazenamento ainda não foi configurado: as alterações <strong>não serão salvas</strong>. Na Vercel, crie um Blob Store, conecte a este projeto e faça um novo deploy.
          </div>
        )}
        <Aba id={aba} irAba={irAba} sessao={sessao} setSessao={setSessao} />
      </div>
    </section>
  );
}

function Aba({ id, irAba, sessao, setSessao }) {
  const bind = useBind();
  const { cms, editar } = useContent();
  const i = (k) => bind(['info', k]);
  // Campo de artigo: quando o artigo já tem página no Google (texto suficiente) ou passa a ter com esta edição e o
  // endereço ainda não foi salvo, guarda o endereço atual — corrigir o título depois não muda o link já indexado.
  const bindPost = (n, k) => ({
    value: (cms.posts[n] || {})[k],
    set: (v) => editar(d => {
      const antes = postsDe(d).find(p => p.i === n);
      d.posts[n][k] = v;
      if (k === 'slug' || String(d.posts[n].slug || '').trim()) return;
      const depois = postsDe(d).find(p => p.i === n);
      if (antes && temTexto(antes)) d.posts[n].slug = antes.slug;
      else if (depois && temTexto(depois)) d.posts[n].slug = depois.slug;
    }, `posts.${n}.${k}`),
  });
  const full = true;
  const hojeIso = agoraBrasilia().iso;
  // Situação de cada promoção no site: vencida e ainda não iniciada não aparecem, mesmo com "ativa no site".
  const situacaoPromo = (it) => (it.ativa === false ? ' · oculta' : it.fim && it.fim < hojeIso ? ' · vencida (fora do site)' : it.inicio && it.inicio > hojeIso ? ' · começa em ' + fmtData(it.inicio) : '');
  switch (id) {
    case 'visao': return <Visao irAba={irAba} sessao={sessao} />;
    case 'info': return <>
      <BlocoInfo titulo="contato e endereço">
        <Campo b={i('whatsapp')} label="WhatsApp (só números, com DDD)" placeholder="18997637896" tipo="tel" />
        <Campo b={i('telefone')} label="Telefone fixo (só números, com DDD; vazio para não mostrar)" placeholder="1835831566" tipo="tel" />
        <Campo b={i('instagram')} label="Instagram (sem @)" />
        <Campo b={i('facebook')} label="Facebook (link completo, opcional)" placeholder="https://www.facebook.com/..." erro={facebookValido(i('facebook').value) ? '' : 'Link inválido: use o endereço completo da página, começando com https://www.facebook.com/ (enquanto isso, as alterações não são salvas).'} />
        <Campo b={i('googleAvaliacoes')} label="Perfil da Empresa no Google (link, opcional)" placeholder="https://g.page/r/..." ajuda='Link do botão "compartilhar" do perfil. Com ele, a home mostra "avaliações no Google"; vazio, o link não aparece.' erro={googleValido(i('googleAvaliacoes').value) ? '' : 'Link inválido: copie pelo botão "compartilhar" do Perfil da Empresa no Google (enquanto isso, as alterações não são salvas).'} />
        <Campo b={i('endereco')} label="Endereço" />
        <Campo b={i('bairroCidade')} label="Bairro, cidade – UF" />
        <Campo b={i('cep')} label="CEP" />
        <Campo b={i('cidade')} label="Cidade (rodapé/capa, minúsculas)" placeholder="rinópolis · sp" />
        <Campo b={i('cidadeNome')} label="Nome da cidade (seção mapa)" />
      </BlocoInfo>
      <BlocoInfo titulo="identificação da empresa" desc="Aparecem no rodapé, na Política de Privacidade e nos Termos de Uso (exigência da LGPD e do Código de Defesa do Consumidor). Vazios, o site mostra só o nome fantasia e o endereço.">
        <Campo b={i('razaoSocial')} label="Razão social (como no cartão CNPJ)" placeholder="ex.: Fulano de Tal Óptica Ltda" />
        <Campo b={i('cnpj')} label="CNPJ" placeholder="00.000.000/0000-00" erro={!String(i('cnpj').value || '').trim() || cnpjValido(i('cnpj').value) ? '' : 'CNPJ inválido: confira os números (enquanto isso, ele não aparece no site).'} />
        <Campo b={i('email')} label="E-mail de contato e de privacidade" tipo="email" placeholder="contato@..." ajuda="Canal para pedidos sobre dados pessoais (LGPD). Use um e-mail que a loja confira com frequência." erro={!String(i('email').value || '').trim() || emailValido(i('email').value) ? '' : 'E-mail inválido: confira o endereço (enquanto isso, ele não aparece no site).'} />
      </BlocoInfo>
      <BlocoInfo titulo="horário de funcionamento" desc='Deixe vazio até confirmar; o site mostra "consulte o horário pelo WhatsApp". Sábado vazio = fechado aos sábados. Com o horário preenchido, o site mostra "aberto agora" automaticamente (horário de Brasília).'>
        <Campo b={i('abreSemana')} label="Seg–sex abre" tipo="time" />
        <Campo b={i('fechaSemana')} label="Seg–sex fecha" tipo="time" />
        <Campo b={i('abreSabado')} label="Sábado abre" tipo="time" />
        <Campo b={i('fechaSabado')} label="Sábado fecha" tipo="time" />
      </BlocoInfo>
      <BlocoLista chave="fechamentos" titulo="feriados e fechamentos" desc='Nesses dias o site mostra "fechado" e avisa na página de contato (só depois que o horário de funcionamento for preenchido). Confira as datas sugeridas.' tituloDe={it => fmtData(it.data) + (it.motivo ? ' · ' + it.motivo : '')} novo={() => ({ data: '', motivo: '' })} addLabel="adicionar fechamento"
        campos={b => [<Campo key="d" b={b('data')} label="Data" tipo="date" />, <Campo key="m" b={b('motivo')} label="Motivo" placeholder="Natal" />]} />
      <BlocoInfo titulo="mensagens do WhatsApp">
        <Campo b={i('msgWhats')} label='Mensagem padrão ao clicar em "falar no WhatsApp"' tipo="area" rows={2} full={full} />
        <Campo b={i('msgReceita')} label='Mensagem ao clicar em "enviar receita"' tipo="area" rows={2} full={full} />
      </BlocoInfo>
      <BlocoInfo titulo="listas">
        <Campo b={i('convenios')} label="Convênios aceitos (separados por vírgula)" tipo="area" rows={2} full={full} ajuda="Só parceiros com acordo escrito e autorização para usar o nome. Vazio, o site pede para perguntar pelo WhatsApp." />
        <Campo b={i('marcas')} label="Marcas que revende (vírgula)" tipo="area" rows={2} full={full} ajuda="Só os nomes, em texto (sem logotipos). Vazio, a seção não aparece." />
        <Campo b={i('pagamentos')} label="Formas de pagamento (vírgula)" tipo="area" rows={2} full={full} ajuda='Informe só o que pratica. Desconto à vista: informe o percentual. Crediário: escreva "sujeito a análise de crédito".' />
        <Campo b={i('parcelas')} label="Parcelas sem juros (número)" tipo="number" ajuda='Vazio ou 1 = o site não fala em parcelamento.' />
      </BlocoInfo>
      <BlocoInfo titulo="busca e redes (SEO)">
        <Campo b={i('siteTitulo')} label="Título do site (aba do navegador / Google)" full={full} />
        <Campo b={i('siteDescricao')} label="Descrição curta para o Google" tipo="area" rows={2} full={full} />
      </BlocoInfo>
    </>;
    case 'home': return <>
      <BlocoInfo titulo="capa">
        <Campo b={i('heroLinha1')} label="Título – linha 1" />
        <Campo b={i('heroLinha2')} label="Título – linha 2" />
        <Campo b={i('heroDestaque')} label="Título – destaque (negrito)" />
        <Campo b={i('heroTexto')} label="Subtítulo" tipo="area" rows={2} full={full} ajuda="Não anuncie exames de vista. Prazo, garantia e gratuidade publicados obrigam a loja." />
        <Campo b={i('selos')} label="Selos abaixo dos botões (vírgula)" full={full} ajuda="Também passam na faixa rolante. Não anuncie exames; prazo, garantia e gratuidade publicados obrigam a loja." />
      </BlocoInfo>
      <BlocoInfo titulo="destaques sobre a foto da capa (computador)" desc="Vazios não aparecem.">
        <Campo b={i('capaCardTitulo')} label="Card branco – título" placeholder="orçamento pelo WhatsApp" />
        <Campo b={i('capaCardTexto')} label="Card branco – texto" placeholder="envie a foto da sua receita" />
        <Campo b={i('capaSelo')} label="Selo verde (opcional)" placeholder="ex.: atendimento pelo WhatsApp" ajuda="Não prometa prazo de resposta que a loja não consegue cumprir." />
      </BlocoInfo>
      <BlocoInfo titulo="faixa de aviso no topo">
        <Campo b={i('faixaAtiva')} label="Exibir faixa" tipo="bool" on="exibindo" off="oculta" />
        <Campo b={i('faixaFim')} label="Sai do ar depois de (opcional)" tipo="date" />
        <Campo b={i('faixaPromo')} label="Texto da faixa" full={full} ajuda="Inclua a validade. Ex.: válida de … a … ou enquanto durarem os estoques; não cumulativa com outras promoções." />
      </BlocoInfo>
      <BlocoInfo titulo="comportamento do site">
        <Campo b={i('botaoFlutuante')} label="Botão flutuante do WhatsApp" tipo="bool" on="exibindo" off="oculto" />
        <Campo b={i('animacoes')} label="Animações de entrada e rolagem" tipo="bool" on="ligadas" off="desligadas" />
      </BlocoInfo>
      <BlocoInfo titulo='resumo "sobre" na home'>
        <Campo b={i('sobreTitulo')} label="Título" full={full} />
        <Campo b={i('sobreResumo')} label="Resumo" tipo="area" rows={2} full={full} />
        <Campo b={i('anos')} label="Anos de história (número)" tipo="number" ajuda="Vazio = o contador não aparece." />
        <Campo b={i('destaqueNumero')} label="Número de destaque (opcional)" placeholder="ex.: 2 mil" ajuda="Só números que a loja comprova. Vazio = não aparece." />
        <Campo b={i('destaqueRotulo')} label="Legenda do número" placeholder="ex.: clientes atendidos" />
      </BlocoInfo>
      <BlocoLista chave="etapas" titulo="como funciona" desc="Passo a passo exibido na home." tituloDe={it => it.titulo} novo={() => ({ titulo: 'nova etapa', texto: '' })} addLabel="adicionar etapa"
        campos={b => [<Campo key="t" b={b('titulo')} label="Título" />, <Campo key="x" b={b('texto')} label="Texto" tipo="area" rows={2} full />]} />
    </>;
    case 'fotos': return <>
      <BlocoInfo titulo="fotos das seções">
        <Campo b={bind(['fotos', 'hero'])} label="Capa da home (cliente / loja)" tipo="img" />
        <Campo b={bind(['fotos', 'loja'])} label="Fachada ou interior (home)" tipo="img" />
        <Campo b={bind(['fotos', 'lentes'])} label="Capa de lentes de contato" tipo="img" />
        <Campo b={bind(['fotos', 'equipe'])} label="Página sobre (fachada, equipe ou fundadores)" tipo="img" />
        <Campo b={bind(['fotos', 'cat_armacoes'])} label='Card "armações" (home)' tipo="img" />
        <Campo b={bind(['fotos', 'cat_sol'])} label='Card "óculos de sol" (home)' tipo="img" />
        <Campo b={bind(['fotos', 'cat_lentes'])} label='Card "lentes de contato" (home)' tipo="img" />
      </BlocoInfo>
      <BlocoLista chave="galeria" titulo="galeria da loja" desc='Aparece na página "sobre". Fotos do espaço, vitrines e bastidores.' tituloDe={it => it.legenda || 'foto'} novo={() => ({ img: '', legenda: '' })} addLabel="adicionar foto"
        campos={b => [<Campo key="i" b={b('img')} label="Foto" tipo="img" />, <Campo key="l" b={b('legenda')} label="Legenda (opcional)" />]} />
    </>;
    case 'promocoes': return <BlocoLista chave="promocoes" tituloDe={it => (it.titulo || 'promoção') + situacaoPromo(it)} novo={() => ({ tag: '', titulo: 'Nova promoção', texto: '', inicio: '', fim: '', condicoes: '', ativa: true, img: '' })} addLabel="adicionar promoção"
      campos={b => [<Campo key="a" b={b('ativa')} label="Status" tipo="bool" on="ativa no site" off="oculta" />, <Campo key="g" b={b('tag')} label="Etiqueta (ex.: novembro)" />, <Campo key="t" b={b('titulo')} label="Título" full />, <Campo key="x" b={b('texto')} label="Descrição" tipo="area" full />, <Campo key="ini" b={b('inicio')} label="Começa em (opcional)" tipo="date" />, <Campo key="fim" b={b('fim')} label="Termina em" tipo="date" ajuda="Depois dessa data a promoção sai do site sozinha." />, <Campo key="c" b={b('condicoes')} label="Condições" tipo="area" rows={2} full placeholder="Ex.: válida enquanto durarem os estoques; não cumulativa com outras promoções." ajuda="Aparecem junto com a validade. A oferta publicada obriga a loja." />, <Campo key="i" b={b('img')} label="Imagem (opcional)" tipo="img" full />]} />;
    case 'eventos': return <BlocoLista chave="eventos" tituloDe={it => (it.data ? fmtData(it.data) + ' · ' : '') + it.titulo + (it.data && it.data < hojeIso ? ' · já passou (fora do site)' : '')} novo={() => ({ titulo: 'Novo evento', data: '', hora: '', local: 'na loja', texto: '', gratuito: false, img: '' })} addLabel="adicionar evento"
      campos={b => [<Campo key="t" b={b('titulo')} label="Título" full />, <Campo key="d" b={b('data')} label="Data" tipo="date" />, <Campo key="h" b={b('hora')} label="Horário" placeholder="9h às 13h" ajuda="Início e fim, ex.: 9h às 13h (o Google mostra os dois)." />, <Campo key="l" b={b('local')} label="Local" placeholder="na loja" ajuda='"na loja" (ou vazio) usa o endereço da ótica.' />, <Campo key="g" b={b('gratuito')} label="Entrada" tipo="bool" on="gratuita" off="não informar" />, <Campo key="x" b={b('texto')} label="Descrição" tipo="area" full />, <Campo key="i" b={b('img')} label="Imagem (opcional)" tipo="img" full />]} />;
    case 'produtos': return <BlocoLista chave="produtos" tituloDe={it => it.nome} novo={() => ({ nome: 'Novo modelo', marca: '', cat: 'grau', img: '', preco: '', destaque: false, selo: 'novo' })} addLabel="adicionar armação"
      campos={b => [<Campo key="n" b={b('nome')} label="Nome do modelo" />, <Campo key="m" b={b('marca')} label="Marca / linha (opcional)" />, <Campo key="c" b={b('cat')} label="Categoria" tipo="select" opcoes={CATEGORIAS.slice(1).map(([v, l]) => ({ v, l }))} />, <Campo key="p" b={b('preco')} label="Preço (opcional)" placeholder="R$ 299,00 à vista (só a armação)" ajuda="Informe o preço à vista da armação; lentes são orçadas à parte." />, <Campo key="d" b={b('destaque')} label="Selo de destaque" tipo="bool" on="com selo" off="sem selo" />, <Campo key="s" b={b('selo')} label="Texto do selo" placeholder="novo" />, <Campo key="i" b={b('img')} label="Foto" tipo="img" full />]} />;
    case 'lentes': return <>
      <BlocoInfo titulo="capa da página">
        <Campo b={i('lentesTexto')} label="Texto da capa" tipo="area" rows={3} full={full} ajuda='Mantenha "somente com receita de médico oftalmologista". Cite só os tipos e marcas que a loja vende. A ótica não indica nem escolhe lentes de grau.' />
      </BlocoInfo>
      <BlocoLista chave="tiposLente" titulo="tipos de lente" desc="Só os tipos que a loja vende de verdade (ex.: diárias, mensais, tóricas, multifocais): o que é publicado vira oferta. Vazio, a seção não aparece." tituloDe={it => it.nome} novo={() => ({ nome: 'novo tipo', texto: '', ideal: '' })} addLabel="adicionar tipo"
        campos={b => [<Campo key="n" b={b('nome')} label="Nome" />, <Campo key="i" b={b('ideal')} label="Tipo de descarte / observação (ex.: descarte diário)" />, <Campo key="t" b={b('texto')} label="Descrição" tipo="area" rows={2} full />]} />
      <BlocoLista chave="passos" titulo="como funciona (lentes)" tituloDe={it => it.titulo} novo={() => ({ titulo: 'novo passo', texto: '' })} addLabel="adicionar passo"
        campos={b => [<Campo key="t" b={b('titulo')} label="Título" />, <Campo key="x" b={b('texto')} label="Texto" tipo="area" rows={2} full />]} />
      <BlocoLista chave="faq" titulo="perguntas frequentes" tituloDe={it => it.p} novo={() => ({ p: 'Nova pergunta?', r: '' })} addLabel="adicionar pergunta"
        campos={b => [<Campo key="p" b={b('p')} label="Pergunta" full />, <Campo key="r" b={b('r')} label="Resposta" tipo="area" full />]} />
    </>;
    case 'sobre': return <>
      <BlocoInfo titulo="história">
        <Campo b={i('sobreTitulo')} label="Título da página" full={full} />
        <Campo b={i('sobreTexto')} label="Texto da página sobre (parágrafos separados por linha em branco)" tipo="area" rows={7} full={full} ajuda='Só fatos reais. Com a linha do tempo preenchida, o título da seção passa a ser "nossa história".' />
      </BlocoInfo>
      <BlocoLista chave="marcos" titulo="linha do tempo" tituloDe={it => it.ano} novo={() => ({ ano: String(new Date().getFullYear()), texto: '' })} addLabel="adicionar marco"
        campos={b => [<Campo key="a" b={b('ano')} label="Ano" />, <Campo key="t" b={b('texto')} label="O que aconteceu" tipo="area" rows={2} full />]} />
      <BlocoLista chave="diferenciais" titulo="por que a digital look" tituloDe={it => it.titulo} novo={() => ({ titulo: 'novo diferencial', texto: '' })} addLabel="adicionar diferencial"
        campos={b => [<Campo key="t" b={b('titulo')} label="Título" />, <Campo key="x" b={b('texto')} label="Texto" tipo="area" rows={2} full />]} />
      <BlocoLista chave="equipe" pessoal titulo="equipe" tituloDe={it => it.nome} novo={() => ({ nome: 'Nome', cargo: 'Cargo', img: '' })} addLabel="adicionar pessoa"
        campos={b => [<Campo key="n" b={b('nome')} label="Nome" ajuda="Só pessoas reais, com autorização escrita de uso de imagem." />, <Campo key="c" b={b('cargo')} label="Cargo" ajuda="Cargo técnico (óptico) só com habilitação." />, <Campo key="i" b={b('img')} label="Foto" tipo="img" full />]} />
    </>;
    case 'depoimentos': return <BlocoLista chave="depoimentos" pessoal tituloDe={it => it.nome} novo={() => ({ nome: 'Cliente', item: '', texto: '' })} addLabel="adicionar depoimento"
      campos={b => [<Campo key="n" b={b('nome')} label="Nome do cliente" />, <Campo key="i" b={b('item')} label="O que comprou (opcional, só com autorização)" />, <Campo key="t" b={b('texto')} label="Depoimento" tipo="area" full />]} />;
    case 'posts': return <BlocoLista chave="posts" tituloDe={it => it.titulo} novo={() => ({ tag: 'dicas', data: fmtData(agoraBrasilia().iso), titulo: 'Novo artigo', resumo: '', conteudo: '', img: '', slug: '' })} addLabel="adicionar artigo" duplicar={it => ({ ...it, slug: '' })}
      campos={(_, it, i) => { const b = (k) => bindPost(i, k), efetivo = (postsDe(cms).find(p => p.i === i) || {}).slug; return [<Campo key="t" b={b('titulo')} label="Título" full />,
        <Campo key="s" b={b('slug')} label="Endereço do artigo (slug)" placeholder={efetivo} full ajuda={`Link: /blog/${efetivo}. Preenchido sozinho quando o artigo ganha texto e vai para o Google; depois disso, corrigir o título não muda o link. Mudar este campo muda o link (o antigo deixa de funcionar).`} />, <Campo key="g" b={b('tag')} label="Categoria" />, <Campo key="d" b={b('data')} label="Data de publicação" placeholder="30 out 2026" ajuda="Ex.: 30 out 2026 ou 30/10/2026. O tempo de leitura é calculado pelo tamanho do texto." />, <Campo key="r" b={b('resumo')} label="Resumo (aparece na lista)" tipo="area" rows={2} full />, <Campo key="c" b={b('conteudo')} label="Texto completo do artigo" tipo="area" rows={10} full />, <Campo key="i" b={b('img')} label="Imagem" tipo="img" full />]; }} />;
    case 'config': return <Configuracoes setSessao={setSessao} />;
    default: return null;
  }
}

function Visao({ irAba, sessao }) {
  const { cms, info, status, wa, hojeIso } = useSite();
  const promos = promosAtivas(cms, hojeIso).length, futuros = eventosFuturos(cms).length;
  const fotosFixas = Object.values(cms.fotos), fotosOk = fotosFixas.filter(Boolean).length;
  // Só as fotos enviadas pelo painel (as de fábrica, em /fotos/, não contam).
  const fotosEnviadas = new Set([...fotosFixas, ...['galeria', 'produtos', 'equipe', 'promocoes', 'eventos', 'posts'].flatMap(k => (cms[k] || []).map(x => x && x.img))]
    .filter(u => typeof u === 'string' && (/^\/uploads\//.test(u) || /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//i.test(u)))).size;
  const ilustrativas = [...fotosFixas, ...['galeria', 'produtos', 'equipe', 'promocoes', 'eventos', 'posts'].flatMap(k => (cms[k] || []).map(x => x.img))].filter(ehIlustrativa).length;
  const emp = empresa(info);
  const marcas = lista(info.marcas);
  const vitrinePadrao = JSON.stringify(cms.produtos) === JSON.stringify(PADRAO().produtos);
  const datasOk = (cms.posts || []).every(p => { const d = dataIso(p.data); return d && d <= hojeIso; });
  // [feito, texto, aba, opcional]: o que ainda falta para entregar o site com dados reais.
  const pend = [
    [sessao.armazenamento !== 'nenhum', sessao.armazenamento !== 'nenhum' ? 'Armazenamento conectado' : 'Conectar o armazenamento (as alterações não estão sendo salvas)', 'config'],
    [!sessao.senhaInicial, 'Trocar a senha inicial', 'config'],
    [!!(emp.razao && emp.cnpj && emp.email), 'Informar razão social, CNPJ e e-mail (privacidade)', 'info'],
    [horaValida(info.abreSemana) && horaValida(info.fechaSemana), 'Informar o horário de funcionamento', 'info'],
    [lista(info.pagamentos).length > 0, 'Formas de pagamento e parcelas', 'info'],
    [marcas.length > 0 && !marcas.some(m => /^marca \d+$/i.test(m)), 'Marcas que trabalha', 'info'],
    [fotosOk === fotosFixas.length, fotosOk === fotosFixas.length ? 'Todas as fotos das seções enviadas' : `Enviar fotos das seções (${fotosOk} de ${fotosFixas.length})`, 'fotos'],
    [!vitrinePadrao && cms.produtos.some(x => x.img), vitrinePadrao ? 'Fotos reais das armações (a vitrine ainda mostra as fotos gerais da loja)' : 'Fotos reais das armações', 'produtos'],
    [!ilustrativas, ilustrativas ? `Trocar fotos de exemplo (banco de imagens) por fotos reais (${ilustrativas})` : 'Sem fotos de exemplo no site', 'fotos'],
    [parseInt(info.anos, 10) > 0 || (cms.marcos || []).length > 0, 'História e ano de fundação', 'sobre'],
    [!!info.googleAvaliacoes, 'Link do Perfil da Empresa no Google', 'info'],
    [datasOk, datasOk ? 'Datas do blog válidas' : 'Revisar datas do blog (data de publicação, ex.: 30 out 2026)', 'posts'],
    [(cms.tiposLente || []).length > 0, 'Tipos de lente de contato que a loja vende', 'lentes', true],
    [lista(info.convenios).length > 0, 'Convênios', 'info', true],
    [(cms.equipe || []).length > 0, 'Equipe', 'sobre', true],
  ].map(([ok, texto, tab, opcional = false]) => ({ ok, texto, tab, opcional })).sort((a, b) => (a.ok - b.ok) || (a.opcional - b.opcional));
  const stats = [['promoções ativas', promos, 'promocoes'], ['eventos futuros', futuros, 'eventos'], ['armações', cms.produtos.length, 'produtos'], ['artigos', cms.posts.length, 'posts'], ['fotos enviadas', fotosEnviadas, 'fotos']];
  const atalhos = [['nova promoção', 'promocoes'], ['novo evento', 'eventos'], ['nova armação', 'produtos'], ['novo artigo', 'posts'], ['trocar foto da capa', 'fotos'], ['alterar horário', 'info']];
  const card = { background: '#fff', borderRadius: 20, padding: 'clamp(18px,2.5vw,28px)', boxShadow: '0 2px 12px rgba(0,0,0,.04)' };
  return <>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,150px),1fr))', gap: 12 }}>
      {stats.map(([label, valor, tab]) => (
        <button key={label} onClick={() => irAba(tab)} style={{ textAlign: 'left', background: '#fff', border: 0, borderRadius: 18, padding: '18px 20px', boxShadow: '0 2px 12px rgba(0,0,0,.04)', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ font: "300 34px/1 'Outfit',sans-serif" }}>{valor}</span><span style={{ font: "500 12px 'DM Sans',sans-serif", color: 'var(--muted)' }}>{label}</span>
        </button>
      ))}
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))', gap: 16, alignItems: 'start' }}>
      <div style={card}>
        <div style={{ font: "500 16px 'Outfit',sans-serif", marginBottom: 4 }}>pendências</div>
        <div style={{ font: "400 13px/1.5 'DM Sans',sans-serif", color: 'var(--muted)', marginBottom: 14 }}>O que ainda falta para o site ficar 100%.</div>
        {pend.map(p => (
          <button key={p.texto} onClick={() => irAba(p.tab)} style={{ display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', background: 'none', border: 0, borderTop: '1px solid rgba(0,0,0,.08)', padding: '12px 0', font: "400 14px/1.4 'DM Sans',sans-serif", color: 'var(--ink)', width: '100%' }}>
            <span style={{ width: 22, height: 22, borderRadius: '50%', background: p.ok ? 'var(--wa)' : p.opcional ? '#fff' : '#c9c6c1', border: !p.ok && p.opcional ? '1px dashed #c9c6c1' : 0, color: p.ok || !p.opcional ? '#fff' : '#c9c6c1', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Ic n="check" s={12} /></span>
            <span style={{ flex: 1, minWidth: 0 }}>{p.texto}{p.opcional ? <span style={{ color: 'var(--muted-2)' }}> (opcional)</span> : null}</span><Ic n="arrow" s={14} style={{ opacity: .4 }} />
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={card}>
          <div style={{ font: "500 16px 'Outfit',sans-serif", marginBottom: 12 }}>atalhos</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{atalhos.map(([label, tab]) => <button key={label} className="adm-btn" onClick={() => irAba(tab)}>{label}</button>)}</div>
        </div>
        <div className="dark" style={{ borderRadius: 20, padding: 'clamp(18px,2.5vw,28px)' }}>
          <div style={{ font: "500 16px 'Outfit',sans-serif", marginBottom: 8 }}>status agora</div>
          <div style={{ marginBottom: 14 }}>{status ? <Status st={status} style={{ gap: 8, font: "400 14px 'DM Sans',sans-serif", color: 'rgba(255,255,255,.8)' }} /> : <span style={{ font: "400 14px 'DM Sans',sans-serif", color: 'rgba(255,255,255,.8)' }}>horário não informado — o site mostra "consulte o horário pelo WhatsApp"</span>}</div>
          <div style={{ font: "400 13px/1.6 'DM Sans',sans-serif", color: 'rgba(255,255,255,.6)' }}>WhatsApp {wa.fmt}<br />{info.endereco} · {info.bairroCidade}<br />Armazenamento: {sessao.armazenamento === 'blob' ? 'nuvem (Vercel Blob)' : sessao.armazenamento === 'nenhum' ? 'não configurado — conecte um Blob Store' : 'arquivos no servidor'}</div>
        </div>
      </div>
    </div>
  </>;
}
