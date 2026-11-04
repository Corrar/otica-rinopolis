// SEO: título, descrição e dados estruturados (schema.org) de cada página.
// Usado no navegador (componente Seo) e no build, que gera o HTML pronto de cada página (scripts/prerender.js).
import { fmtH, lista, MESES, num2, postsDe, eventosFuturos, telefone, whatsapp } from './util.js';

export const NOME = 'Ótica Digital Look';
export const PAGINAS_INDEXADAS = ['inicio', 'sobre', 'armacoes', 'lentes', 'convenios', 'blog', 'contato'];
export const caminhoDe = (page, slug) => (page === 'inicio' ? '/' : page === 'post' ? '/blog/' + slug : '/' + page);

// "Centro, Rinópolis – SP" → { bairro, cidade, uf }
export function localDe(info) {
  const m = /^\s*(?:(.*?),\s*)?(.*?)\s*[–-]\s*([A-Za-z]{2})\s*$/.exec(info.bairroCidade || '');
  const cap = (s) => String(s || '').replace(/(^|\s)\S/g, c => c.toUpperCase());
  return m ? { bairro: m[1] || '', cidade: m[2], uf: m[3].toUpperCase() } : { bairro: '', cidade: cap(info.cidadeNome), uf: 'SP' };
}

const corta = (s, n = 158) => { const t = String(s || '').replace(/\s+/g, ' ').trim(); return t.length <= n ? t : t.slice(0, t.lastIndexOf(' ', n - 1)).replace(/[,.;:–-]+$/, '') + '…'; };

// "08 out 2026" → "2026-10-08"
export function dataIso(txt) {
  const m = /^(\d{1,2})\s+([a-zç]{3})\w*\.?\s+(\d{4})$/i.exec(String(txt || '').trim());
  const mes = m ? MESES.indexOf(m[2].toLowerCase()) : -1;
  return mes >= 0 ? `${m[3]}-${num2(mes + 1)}-${num2(+m[1])}` : null;
}

// Artigo só com título é página "fina": fica fora do Google (noindex) até ganhar texto.
export const temTexto = (p) => String(p.conteudo || '').trim().length >= 300;

// Título, descrição, imagem e indexação de cada página.
export function metaPagina(r, cms) {
  const { info } = cms;
  const { cidade, uf } = localDe(info);
  const local = `${cidade}/${uf}`;
  const wa = whatsapp(info), tel = telefone(info);
  const horario = `seg a sex ${fmtH(info.abreSemana)} às ${fmtH(info.fechaSemana)}, sábado ${fmtH(info.abreSabado)} às ${fmtH(info.fechaSabado)}`;
  const parc = info.parcelas || '10';
  const base = { caminho: caminhoDe(r.page, r.slug), imagem: '/og-image.jpg', noindex: false, tipo: 'website' };
  switch (r.page) {
    case 'inicio': return { ...base, titulo: info.siteTitulo || `${NOME} | Ótica em ${local}`, descricao: info.siteDescricao };
    case 'sobre': return { ...base, titulo: `Sobre a ${NOME} | Ótica no centro de ${local}`, descricao: corta(`Conheça a ${NOME}, na ${info.endereco}, ${info.bairroCidade}: atendimento próximo, medição digital das lentes${+info.anos ? ` e mais de ${info.anos} anos de história` : ''}.`), imagem: '/fotos/fachada.jpg' };
    case 'armacoes': return { ...base, titulo: `Armações de grau e óculos de sol em ${local} | ${NOME}`, descricao: corta(`Armações de grau, óculos de sol, modelos infantis e esportivos no centro de ${cidade}. Monte seu óculos completo com medição digital e até ${parc}x sem juros.`), imagem: '/fotos/vitrine-feminina.jpg' };
    case 'lentes': return { ...base, titulo: `Lentes de contato em ${local} | ${NOME}`, descricao: corta(`Lentes de contato diárias, mensais, tóricas e multifocais em ${cidade}. Envie sua receita pelo WhatsApp e aprenda a colocar e cuidar com a nossa equipe.`) };
    case 'convenios': return { ...base, titulo: `Convênios, promoções e pagamento | ${NOME} – ${local}`, descricao: corta(`Convênios aceitos, promoções do mês e eventos da ${NOME} em ${cidade}. Parcele seu óculos completo em até ${parc}x sem juros no cartão.`) };
    case 'blog': return { ...base, titulo: `Blog: dicas de lentes, armações e saúde ocular | ${NOME}`, descricao: corta(`Dicas da ${NOME}, ótica no centro de ${cidade}, sobre lentes, armações, lentes de contato e cuidados com os olhos.`) };
    case 'contato': return { ...base, titulo: `Contato, endereço e horário | ${NOME} – ${local}`, descricao: corta(`${info.endereco}, ${info.bairroCidade}. ${tel ? `Telefone ${tel.fmt}, WhatsApp ${wa.fmt}` : `WhatsApp ${wa.fmt}`}. Horário: ${horario}. Veja o mapa e fale com a gente.`) };
    case 'post': {
      const p = postsDe(cms).find(x => x.slug === r.slug);
      if (!p) return { ...base, titulo: `Página não encontrada | ${NOME}`, descricao: '', noindex: true };
      return { ...base, titulo: `${p.titulo.replace(/[.\s]+$/, "")} | ${NOME}`, descricao: corta(p.resumo || p.conteudo || `${p.titulo} — dicas da ${NOME}, ótica em ${local}.`), imagem: p.img || base.imagem, tipo: 'article', post: p, noindex: !temTexto(p) };
    }
    case 'admin': return { ...base, titulo: `Área do proprietário | ${NOME}`, descricao: '', noindex: true };
    default: return { ...base, titulo: `Página não encontrada | ${NOME}`, descricao: '', noindex: true };
  }
}

const absoluto = (url, site) => (/^https?:\/\//.test(url || '') ? url : site + (url || ''));
const DIAS = { semana: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], sabado: ['Saturday'] };

// Dados da ótica para o Google (perfil de empresa local).
export function dadosOtica(cms, site) {
  const { info } = cms;
  const { bairro, cidade, uf } = localDe(info);
  const wa = String(info.whatsapp || '').replace(/\D/g, '');
  const tel = telefone(info);
  const intl = (n) => (n.length >= 10 ? `+55 ${n.slice(0, 2)} ${n.slice(2, -4)}-${n.slice(-4)}` : undefined);
  const ig = String(info.instagram || '').replace(/^@/, '');
  const end = `${info.endereco}, ${info.bairroCidade}, ${info.cep}`;
  return {
    '@type': 'Optician', '@id': site + '/#otica', name: NOME, url: site + '/',
    description: info.siteDescricao, logo: site + '/logo.png',
    image: [site + '/og-image.jpg', site + '/fotos/fachada.jpg', site + '/fotos/loja-balcao.jpg', site + '/fotos/vitrine-feminina.jpg'],
    // Telefone principal: o fixo (o mesmo da fachada e do Perfil da Empresa no Google); o WhatsApp entra como contato.
    telephone: intl(tel ? tel.digitos : wa),
    contactPoint: intl(wa) ? [{ '@type': 'ContactPoint', contactType: 'customer service', telephone: intl(wa), availableLanguage: 'Portuguese', description: 'WhatsApp' }] : undefined,
    priceRange: '$$', currenciesAccepted: 'BRL', paymentAccepted: lista(info.pagamentos).join(', ') || undefined,
    address: { '@type': 'PostalAddress', streetAddress: bairro ? `${info.endereco} - ${bairro}` : info.endereco, addressLocality: cidade, addressRegion: uf, postalCode: info.cep, addressCountry: 'BR' },
    areaServed: { '@type': 'City', name: `${cidade} - ${uf}` },
    hasMap: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(end),
    sameAs: [ig && `https://www.instagram.com/${ig}/`, info.facebook].filter(Boolean),
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: DIAS.semana, opens: info.abreSemana, closes: info.fechaSemana },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: DIAS.sabado, opens: info.abreSabado, closes: info.fechaSabado },
    ],
    knowsAbout: ['óculos de grau', 'óculos de sol', 'lentes de contato', 'lentes multifocais', 'medição digital'],
  };
}

// "9h às 13h" → "09:00"
const horaIni = (h) => { const m = /(\d{1,2})\s*(?:h|:)\s*(\d{2})?/.exec(String(h || '')); return m ? `${num2(+m[1])}:${m[2] || '00'}` : null; };

// Blocos JSON-LD da página.
export function jsonLd(r, cms, site) {
  const m = metaPagina(r, cms);
  const otica = dadosOtica(cms, site);
  const blocos = [];
  if (r.page === 'inicio') blocos.push({ '@type': 'WebSite', '@id': site + '/#site', name: NOME, url: site + '/', inLanguage: 'pt-BR', publisher: { '@id': otica['@id'] } });
  if (['inicio', 'sobre', 'contato'].includes(r.page)) blocos.push(otica);
  if (r.page !== 'inicio') {
    const itens = [{ nome: 'Início', url: site + '/' }];
    if (r.page === 'post') itens.push({ nome: 'Blog', url: site + '/blog' });
    itens.push({ nome: m.titulo.split(' | ')[0], url: site + m.caminho });
    blocos.push({ '@type': 'BreadcrumbList', itemListElement: itens.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.nome, item: it.url })) });
  }
  if (r.page === 'lentes' && (cms.faq || []).length) {
    blocos.push({ '@type': 'FAQPage', mainEntity: cms.faq.filter(q => q.p && q.r).map(q => ({ '@type': 'Question', name: q.p, acceptedAnswer: { '@type': 'Answer', text: q.r } })) });
  }
  if (r.page === 'convenios' || r.page === 'inicio') {
    eventosFuturos(cms).filter(e => /^\d{4}-\d{2}-\d{2}$/.test(e.data || '')).forEach(e => {
      const h = horaIni(e.hora);
      blocos.push({
        '@type': 'Event', name: e.titulo, description: e.texto, startDate: h ? `${e.data}T${h}:00-03:00` : e.data,
        eventStatus: 'https://schema.org/EventScheduled', eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        image: e.img ? [absoluto(e.img, site)] : undefined, isAccessibleForFree: true,
        location: { '@type': 'Place', name: NOME, address: otica.address }, organizer: { '@type': 'Organization', name: NOME, url: site + '/' },
      });
    });
  }
  if (r.page === 'post' && m.post) {
    const p = m.post, d = dataIso(p.data);
    blocos.push({
      '@type': 'BlogPosting', headline: p.titulo, description: m.descricao, image: p.img ? [absoluto(p.img, site)] : undefined,
      datePublished: d || undefined, dateModified: d || undefined, inLanguage: 'pt-BR', mainEntityOfPage: site + m.caminho,
      author: { '@type': 'Organization', name: NOME, url: site + '/' }, publisher: { '@type': 'Organization', name: NOME, logo: { '@type': 'ImageObject', url: site + '/logo.png' } },
    });
  }
  return blocos.map(b => ({ '@context': 'https://schema.org', ...b }));
}

// Todas as páginas públicas (para o build e o sitemap).
export function rotasPublicas(cms) {
  return [...PAGINAS_INDEXADAS.map(page => ({ page })), ...postsDe(cms).filter(temTexto).map(p => ({ page: 'post', slug: p.slug }))];
}

export const absolutoUrl = absoluto;
