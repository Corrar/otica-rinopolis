// SEO: título, descrição e dados estruturados (schema.org) de cada página.
// Usado no navegador (componente Seo) e no build, que gera o HTML pronto de cada página (scripts/prerender.js).
import { empresa, horaValida, horarios, isoValida, lista, MESES, num2, postsDe, eventosFuturos, telefone, texto, whatsapp } from './util.js';

export const NOME = 'Ótica Digital Look';
// Endereço oficial do site (link canônico, Open Graph, sitemap e dados estruturados), fixado no build pelo
// vite.config.js (SITE_URL ou domínio de produção da Vercel): aberto por preview, www ou outro domínio, o canônico
// continua apontando para o endereço oficial.
/* global __SITE__ */
export const SITE = typeof __SITE__ === 'string' ? __SITE__ : 'https://otica-rinopolis.vercel.app';
// Páginas de texto fixo no código (não editáveis pelo painel), com link no rodapé.
export const PAGINAS_LEGAIS = ['politica-de-privacidade', 'termos-de-uso', 'acessibilidade'];
export const PAGINAS_INDEXADAS = ['inicio', 'sobre', 'armacoes', 'lentes', 'convenios', 'blog', 'contato', ...PAGINAS_LEGAIS];
export const caminhoDe = (page, slug) => (page === 'inicio' ? '/' : page === 'post' ? '/blog/' + slug : '/' + page);

// "Centro, Rinópolis – SP" → { bairro, cidade, uf }
export function localDe(info) {
  const m = /^\s*(?:(.*?),\s*)?(.*?)\s*[–-]\s*([A-Za-z]{2})\s*$/.exec(info.bairroCidade || '');
  const cap = (s) => String(s || '').replace(/(^|\s)\S/g, c => c.toUpperCase());
  return m ? { bairro: m[1] || '', cidade: m[2], uf: m[3].toUpperCase() } : { bairro: '', cidade: cap(info.cidadeNome), uf: 'SP' };
}

const corta = (s, n = 158) => { const t = String(s || '').replace(/\s+/g, ' ').trim(); return t.length <= n ? t : t.slice(0, t.lastIndexOf(' ', n - 1)).replace(/[,.;:–-]+$/, '') + '…'; };

// "08 out 2026", "8 de março de 2026", "08/10/2026" ou "2026-10-08" → "2026-10-08" (null se a data não existe).
export function dataIso(txt) {
  const s = String(txt || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  let m, iso = '';
  if ((m = /^(\d{1,2})\s+(?:de\s+)?([a-z]{3})[a-z]*\.?\s+(?:de\s+)?(\d{4})$/.exec(s)) && MESES.includes(m[2])) iso = `${m[3]}-${num2(MESES.indexOf(m[2]) + 1)}-${num2(+m[1])}`;
  else if ((m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(s))) iso = `${m[3]}-${num2(+m[2])}-${num2(+m[1])}`;
  else if (/^\d{4}-\d{2}-\d{2}$/.test(s)) iso = s;
  return isoValida(iso) ? iso : null;
}

// Artigo só com título é página "fina": fica fora do Google (noindex) até ganhar texto.
export const temTexto = (p) => String(p.conteudo || '').trim().length >= 300;

// Título do artigo sem o ponto final (para o título da aba e a trilha de navegação).
const tituloPost = (p) => String(p.titulo || 'Artigo').trim().replace(/[.\s]+$/, '') || 'Artigo';

// Título, descrição, imagem e indexação de cada página.
export function metaPagina(r, cms) {
  const { info } = cms;
  const { cidade, uf } = localDe(info);
  const local = `${cidade}/${uf}`;
  const wa = whatsapp(info), tel = telefone(info);
  // Horário e parcelamento só entram nas descrições quando o proprietário informou.
  const h = horarios(info);
  const horario = h.semana ? ` Horário: seg a sex ${h.semana}, sábado ${h.sabado || 'fechado'}.` : '';
  const parc = parseInt(info.parcelas, 10) > 1 ? parseInt(info.parcelas, 10) : 0;
  const temConvenios = lista(info.convenios).length > 0;
  const base = { caminho: caminhoDe(r.page, r.slug), imagem: '/og-image.jpg', noindex: false, tipo: 'website' };
  switch (r.page) {
    case 'inicio': return { ...base, titulo: info.siteTitulo || `${NOME} | Ótica em ${local}`, descricao: info.siteDescricao };
    case 'sobre': return { ...base, titulo: `Sobre a ${NOME} | Ótica no centro de ${local}`, descricao: corta(`Conheça a ${NOME}, na ${info.endereco}, ${info.bairroCidade}: atendimento próximo para escolher armação, lentes e óculos de sol${+info.anos ? `, com mais de ${info.anos} anos de história` : ''}.`), imagem: '/fotos/fachada.jpg' };
    case 'armacoes': return { ...base, titulo: `Armações de grau e óculos de sol em ${local} | ${NOME}`, descricao: corta(`Armações de grau e óculos de sol no centro de ${cidade}. Monte seus óculos completos${parc ? ` em até ${parc}x sem juros` : ''}: veja a vitrine e chame no WhatsApp.`), imagem: '/fotos/vitrine-feminina.jpg' };
    case 'lentes': return { ...base, titulo: `Lentes de contato em ${local} | ${NOME}`, descricao: corta(`Lentes de contato diárias, mensais, tóricas e multifocais em ${cidade}, somente com receita médica. Envie sua receita pelo WhatsApp e tire suas dúvidas com a nossa equipe.`) };
    case 'convenios': return { ...base, titulo: `Convênios, promoções e pagamento | ${NOME} – ${local}`, descricao: corta(`${temConvenios ? 'Convênios aceitos, promoções' : 'Promoções'}${lista(info.pagamentos).length ? ', eventos e formas de pagamento' : ' e eventos'} da ${NOME} em ${cidade}.${parc ? ` Parcele seus óculos completos em até ${parc}x sem juros.` : ''}${temConvenios ? '' : ' Pergunte pelo WhatsApp se o seu convênio tem parceria com a ótica.'}`) };
    case 'blog': return { ...base, titulo: `Blog: dicas de lentes, armações e saúde ocular | ${NOME}`, descricao: corta(`Dicas da ${NOME}, ótica no centro de ${cidade}, sobre lentes, armações, lentes de contato e cuidados com os olhos.`) };
    case 'contato': return { ...base, titulo: `Contato, endereço e horário | ${NOME} – ${local}`, descricao: corta(`${info.endereco}, ${info.bairroCidade}. ${tel ? `Telefone ${tel.fmt}, WhatsApp ${wa.fmt}` : `WhatsApp ${wa.fmt}`}.${horario} Veja o mapa e fale com a gente.`) };
    case 'post': {
      const p = postsDe(cms).find(x => x.slug === r.slug);
      if (!p) return { ...base, titulo: `Página não encontrada | ${NOME}`, descricao: '', noindex: true };
      return { ...base, titulo: `${tituloPost(p)} | ${NOME}`, descricao: corta(p.resumo || p.conteudo || `${p.titulo} — dicas da ${NOME}, ótica em ${local}.`), imagem: p.img || base.imagem, tipo: 'article', post: p, noindex: !temTexto(p) };
    }
    case 'politica-de-privacidade': return { ...base, titulo: `Política de Privacidade | ${NOME}`, descricao: corta(`Como a ${NOME}, ótica em ${local}, trata dados pessoais no site e no atendimento: receitas, WhatsApp, cookies, prazos de guarda e como exercer seus direitos (LGPD).`) };
    case 'termos-de-uso': return { ...base, titulo: `Termos de Uso | ${NOME}`, descricao: corta(`Regras de uso do site da ${NOME}: site informativo, sem venda online; lentes de grau e de contato somente com receita médica; garantias e direitos do consumidor.`) };
    case 'acessibilidade': return { ...base, titulo: `Acessibilidade | ${NOME}`, descricao: corta(`Recursos de acessibilidade do site da ${NOME}, limitações conhecidas e como relatar barreiras pelo WhatsApp, pelo telefone ou na loja em ${cidade}.`) };
    case 'admin': return { ...base, titulo: `Área do proprietário | ${NOME}`, descricao: '', noindex: true };
    default: return { ...base, titulo: `Página não encontrada | ${NOME}`, descricao: '', noindex: true };
  }
}

const absoluto = (url, site) => (/^https?:\/\//.test(url || '') ? url : site + (url || ''));
const DIAS = { semana: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], sabado: ['Saturday'] };
// Horário de funcionamento para o Google: só os dias com abertura e fechamento no formato HH:MM.
const horarioOtica = (info) => [[DIAS.semana, info.abreSemana, info.fechaSemana], [DIAS.sabado, info.abreSabado, info.fechaSabado]]
  .filter(([, abre, fecha]) => horaValida(abre) && horaValida(fecha))
  .map(([dayOfWeek, abre, fecha]) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek, opens: String(abre).trim().padStart(5, '0'), closes: String(fecha).trim().padStart(5, '0') }));

// Dados da ótica para o Google (perfil de empresa local).
export function dadosOtica(cms, site) {
  const { info } = cms;
  const { bairro, cidade, uf } = localDe(info);
  const wa = String(info.whatsapp || '').replace(/\D/g, '');
  const tel = telefone(info);
  const intl = (n) => (n.length >= 10 ? `+55 ${n.slice(0, 2)} ${n.slice(2, -4)}-${n.slice(-4)}` : undefined);
  const ig = String(info.instagram || '').replace(/^@/, '');
  const end = `${info.endereco}, ${info.bairroCidade}, ${info.cep}`;
  const semana = horaValida(info.abreSemana) && horaValida(info.fechaSemana);
  const horas = semana ? horarioOtica(info) : [];
  const emp = empresa(info);
  return {
    '@type': 'Optician', '@id': site + '/#otica', name: NOME, url: site + '/',
    // Nome empresarial, CNPJ e e-mail: só quando o proprietário informou (e são válidos).
    legalName: emp.razao || undefined, taxID: emp.cnpj || undefined, email: emp.email || undefined,
    description: info.siteDescricao || undefined, logo: site + '/logo.png',
    image: [site + '/og-image.jpg', site + '/fotos/fachada.jpg', site + '/fotos/loja-balcao.jpg', site + '/fotos/vitrine-feminina.jpg'],
    // Telefone principal: o fixo (use o mesmo número no Perfil da Empresa no Google); o WhatsApp entra como contato.
    telephone: intl(tel ? tel.digitos : wa),
    contactPoint: intl(wa) ? [{ '@type': 'ContactPoint', contactType: 'customer service', telephone: intl(wa), availableLanguage: 'Portuguese', description: 'WhatsApp' }] : undefined,
    currenciesAccepted: 'BRL', paymentAccepted: lista(info.pagamentos).join(', ') || undefined,
    address: { '@type': 'PostalAddress', streetAddress: bairro ? `${info.endereco} - ${bairro}` : info.endereco, addressLocality: cidade, addressRegion: uf, postalCode: info.cep, addressCountry: 'BR' },
    areaServed: { '@type': 'City', name: `${cidade} - ${uf}` },
    hasMap: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(end),
    sameAs: [ig && `https://www.instagram.com/${ig}/`, info.facebook].filter(Boolean),
    openingHoursSpecification: horas.length ? horas : undefined,
    knowsAbout: ['óculos de grau', 'óculos de sol', 'lentes de contato', 'lentes multifocais'],
  };
}

// "9h às 13h" → ["09:00", "13:00"]; "14h30" → ["14:30"] (horas inválidas ficam de fora).
const horasDe = (h) => [...String(h || '').matchAll(/(\d{1,2})\s*(?:h|:)\s*(\d{2})?/g)]
  .filter(m => +m[1] <= 23 && +(m[2] || 0) <= 59).map(m => `${num2(+m[1])}:${m[2] || '00'}`).slice(0, 2);

// Nome curto de cada página na trilha de navegação (BreadcrumbList).
const MIGALHA = { sobre: 'Sobre', armacoes: 'Armações', lentes: 'Lentes de contato', convenios: 'Convênios e promoções', blog: 'Blog', contato: 'Contato', 'politica-de-privacidade': 'Política de Privacidade', 'termos-de-uso': 'Termos de Uso', acessibilidade: 'Acessibilidade' };

// Evento na loja: local vazio ou "na loja" (também "nossa loja", "na ótica").
export const eventoNaLoja = (local) => !texto(local).trim() || /^(na\s+|nossa\s+)*(loja|[óo]tica)(\s+digital\s+look)?\.?$/i.test(texto(local).trim());

// Blocos JSON-LD da página (nenhum em página fora do Google, como 404 e painel).
export function jsonLd(r, cms, site) {
  const m = metaPagina(r, cms);
  if (m.noindex) return [];
  const otica = dadosOtica(cms, site);
  const { cidade, uf } = localDe(cms.info);
  const blocos = [];
  if (r.page === 'inicio') blocos.push({ '@type': 'WebSite', '@id': site + '/#site', name: NOME, url: site + '/', inLanguage: 'pt-BR', publisher: { '@id': otica['@id'] } });
  if (['inicio', 'sobre', 'contato'].includes(r.page)) blocos.push(otica);
  if (r.page !== 'inicio') {
    const itens = [{ nome: 'Início', url: site + '/' }];
    if (r.page === 'post') itens.push({ nome: 'Blog', url: site + '/blog' });
    itens.push({ nome: r.page === 'post' ? tituloPost(m.post) : MIGALHA[r.page] || m.titulo.split(' | ')[0], url: site + m.caminho });
    blocos.push({ '@type': 'BreadcrumbList', itemListElement: itens.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.nome, item: it.url })) });
  }
  // Perguntas frequentes: só as que têm pergunta e resposta (sem nenhuma completa, sem FAQPage).
  if (r.page === 'lentes') {
    const perguntas = (cms.faq || []).filter(q => texto(q.p).trim() && texto(q.r).trim());
    if (perguntas.length) blocos.push({ '@type': 'FAQPage', mainEntity: perguntas.map(q => ({ '@type': 'Question', name: texto(q.p).trim(), acceptedAnswer: { '@type': 'Answer', text: texto(q.r).trim() } })) });
  }
  // Eventos futuros com título e data válida. Término pelo segundo horário ("9h às 13h"); local na loja usa o
  // endereço da ótica; outro local vira um Place com o nome informado na cidade; gratuito só se marcado no painel.
  if (r.page === 'convenios' || r.page === 'inicio') {
    eventosFuturos(cms).filter(e => texto(e.titulo).trim() && isoValida(e.data)).forEach(e => {
      const [ini, fim] = horasDe(e.hora);
      const local = texto(e.local).trim();
      blocos.push({
        '@type': 'Event', name: texto(e.titulo).trim(), description: texto(e.texto).trim() || undefined,
        startDate: ini ? `${e.data}T${ini}:00-03:00` : e.data, endDate: ini && fim && fim > ini ? `${e.data}T${fim}:00-03:00` : undefined,
        eventStatus: 'https://schema.org/EventScheduled', eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        image: e.img ? [absoluto(e.img, site)] : undefined, isAccessibleForFree: e.gratuito === true ? true : undefined,
        location: eventoNaLoja(local)
          ? { '@type': 'Place', name: NOME, address: otica.address }
          : { '@type': 'Place', name: local, address: { '@type': 'PostalAddress', addressLocality: cidade, addressRegion: uf, addressCountry: 'BR' } },
        organizer: { '@type': 'Organization', name: NOME, url: site + '/' },
      });
    });
  }
  if (r.page === 'post' && m.post) {
    const p = m.post, d = dataIso(p.data);
    blocos.push({
      '@type': 'BlogPosting', headline: tituloPost(p), description: m.descricao || undefined, image: p.img ? [absoluto(p.img, site)] : undefined,
      datePublished: d || undefined, dateModified: d || undefined, inLanguage: 'pt-BR', mainEntityOfPage: site + m.caminho,
      author: { '@type': 'Organization', name: NOME, url: site + '/' }, publisher: { '@type': 'Organization', name: NOME, logo: { '@type': 'ImageObject', url: site + '/logo.png' } },
    });
  }
  return blocos.map(b => ({ '@context': 'https://schema.org', ...b }));
}

// Páginas que vão para o Google (sitemap). Artigos curtos ficam de fora.
export function rotasPublicas(cms) {
  return [...PAGINAS_INDEXADAS.map(page => ({ page })), ...postsDe(cms).filter(temTexto).map(p => ({ page: 'post', slug: p.slug }))];
}

// Páginas geradas no build: as públicas e também os artigos curtos (com noindex), para abrirem direto pelo link.
export function paginasGeradas(cms) {
  return [...PAGINAS_INDEXADAS.map(page => ({ page })), ...postsDe(cms).map(p => ({ page: 'post', slug: p.slug }))];
}

export const absolutoUrl = absoluto;
