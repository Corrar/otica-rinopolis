export const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
export const lista = (s) => String(s || '').split(',').map(x => x.trim()).filter(Boolean);
export const bgOf = (img) => (img ? `url("${img}")` : 'none');
export const num2 = (n) => String(n).padStart(2, '0');
export const fmtData = (iso) => { const d = iso ? new Date(iso + 'T12:00:00') : null; return d && !isNaN(d) ? `${num2(d.getDate())} ${MESES[d.getMonth()]} ${d.getFullYear()}` : iso || ''; };
export const numerar = (arr) => (arr || []).map((x, i) => ({ ...x, n: num2(i + 1) }));
// Classe de grade que fecha as linhas sem card sobrando (4 → 1/2/4 colunas, 3 → 1/3 colunas).
export const gradeEquilibrada = (arr) => { const n = (arr || []).length; return !n ? '' : n % 4 === 0 ? ' grid--4' : n % 3 === 0 ? ' grid--3' : ''; };
export const slugify = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80) || 'artigo';

const toMin = (s) => { const m = /^(\d{1,2}):(\d{2})$/.exec(String(s || '').trim()); return m ? +m[1] * 60 + +m[2] : null; };
export const fmtH = (s) => { const m = toMin(s); if (m == null) return s; const h = Math.floor(m / 60), mi = m % 60; return mi ? `${h}h${num2(mi)}` : `${h}h`; };

// Data/hora atual em Brasília, independente do fuso de quem visita.
export function agoraBrasilia(now = Date.now()) {
  const d = new Date(new Date(now).toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
  return { d, iso: `${d.getFullYear()}-${num2(d.getMonth() + 1)}-${num2(d.getDate())}` };
}

// Horário só vale no formato HH:MM (campo vazio = não informado).
export const horaValida = (s) => toMin(s) != null;

// Textos do horário: { semana: '8h30 às 18h', sabado: '8h30 às 12h' } — vazios enquanto não houver horário
// confirmado. Sábado vazio (com os dias úteis preenchidos) = fechado aos sábados.
export function horarios(info) {
  const semana = horaValida(info.abreSemana) && horaValida(info.fechaSemana) ? `${fmtH(info.abreSemana)} às ${fmtH(info.fechaSemana)}` : '';
  const sabado = semana && horaValida(info.abreSabado) && horaValida(info.fechaSabado) ? `${fmtH(info.abreSabado)} às ${fmtH(info.fechaSabado)}` : '';
  return { semana, sabado };
}

// "aberto agora" / "fechado · abre ..." a partir dos horários e fechamentos cadastrados.
// null sem horário dos dias úteis: o site não mostra status (nem "aberto agora" inventado).
export function statusLoja(info, fechamentos, now) {
  const aS = toMin(info.abreSemana), fS = toMin(info.fechaSemana);
  if (aS == null || fS == null) return null;
  const aB = toMin(info.abreSabado), fB = toMin(info.fechaSabado);
  const abreSabado = aB != null && fB != null;
  const { d, iso } = agoraBrasilia(now);
  const dia = d.getDay(), min = d.getHours() * 60 + d.getMinutes();
  const fechHoje = (fechamentos || []).find(x => x.data === iso);
  const aberto = !fechHoje && ((dia >= 1 && dia <= 5 && min >= aS && min < fS) || (abreSabado && dia === 6 && min >= aB && min < fB));
  const abreTxt = fmtH(info.abreSemana), segunda = `fechado · abre segunda ${abreTxt}`;
  const texto = fechHoje ? `fechado hoje · ${fechHoje.motivo || 'feriado'}`
    : aberto ? 'aberto agora'
    : dia === 0 ? segunda
    : dia === 6 ? (abreSabado && min < aB ? `fechado · abre às ${fmtH(info.abreSabado)}` : segunda)
    : min < aS ? `fechado · abre às ${abreTxt}`
    : dia === 5 ? (abreSabado ? `fechado · abre sábado ${fmtH(info.abreSabado)}` : segunda)
    : `fechado · abre amanhã ${abreTxt}`;
  return { aberto, texto, cor: aberto ? '#25D366' : '#c9c6c1', hojeIso: iso };
}

// "1835831566" → "(18) 3583-1566"; "18997637896" → "(18) 99763-7896"
export const fmtTel = (n) => (n.length === 11 ? `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}` : n.length === 10 ? `(${n.slice(0, 2)}) ${n.slice(2, 6)}-${n.slice(6)}` : n);

// Telefone fixo: link tel: e número formatado (vazio se não cadastrado).
export function telefone(info) {
  const n = String(info.telefone || '').replace(/\D/g, '');
  return n ? { link: 'tel:+55' + n, fmt: fmtTel(n), digitos: n } : null;
}

export function whatsapp(info) {
  const wa = String(info.whatsapp || '').replace(/\D/g, '');
  const base = 'https://wa.me/55' + wa;
  const msg = (t) => base + '?text=' + encodeURIComponent(t);
  const fmt = fmtTel(wa);
  return {
    msg, fmt,
    link: msg(info.msgWhats || 'Olá! Vim pelo site da Ótica Digital Look e gostaria de atendimento.'),
    receita: msg(info.msgReceita || 'Olá! Gostaria de um orçamento. Vou enviar a foto da minha receita.'),
  };
}

// Reduz a foto no navegador antes do envio (máx. 1600px, JPEG).
export function lerImagem(file, max = 1600) {
  return new Promise((res, rej) => {
    const img = new Image(); const url = URL.createObjectURL(file);
    img.onload = () => {
      const r = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas'); c.width = Math.round(img.width * r); c.height = Math.round(img.height * r);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
      res(c.toDataURL('image/jpeg', 0.84));
    };
    img.onerror = () => { URL.revokeObjectURL(url); rej(new Error('imagem inválida')); };
    img.src = url;
  });
}

// Eventos de hoje em diante, do mais próximo ao mais distante.
export function eventosFuturos(cms) {
  const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
  return (cms.eventos || []).map(e => {
    const dt = e.data ? new Date(e.data + 'T12:00:00') : null; const ok = dt && !isNaN(dt);
    return { ...e, _t: ok ? dt.getTime() : Infinity, dia: ok ? num2(dt.getDate()) : '—', mes: ok ? MESES[dt.getMonth()] : '', passado: ok && dt < hoje };
  }).filter(e => !e.passado).sort((a, b) => a._t - b._t);
}

// Promoções ativas e dentro da validade (início e fim opcionais, AAAA-MM-DD, horário de Brasília).
export const promosAtivas = (cms, hojeIso = agoraBrasilia().iso) => (cms.promocoes || [])
  .filter(x => x.ativa !== false && (!x.inicio || x.inicio <= hojeIso) && (!x.fim || x.fim >= hojeIso));

// Tempo de leitura pelo tamanho do texto (cerca de 200 palavras por minuto).
export const tempoLeitura = (texto) => `${Math.max(1, Math.round(String(texto || '').split(/\s+/).filter(Boolean).length / 200))} min`;

// Artigos com endereço próprio (/blog/<slug>); títulos repetidos recebem sufixo.
export function postsDe(cms) {
  const vistos = {};
  return (cms.posts || []).map((x, i) => {
    let slug = slugify(x.titulo); if (vistos[slug]) slug += '-' + (i + 1); vistos[slug] = true;
    const conteudo = x.conteudo || x.resumo || '';
    return { ...x, i, slug, conteudo, leitura: tempoLeitura(conteudo) };
  });
}
