// Endereços aceitos no conteúdo. Usado pelo servidor ao salvar e pelo painel para avisar antes.
const SEGURO = /^[^\s"'<>()\\]+$/;

// Link do Facebook: só https://facebook.com/…, www. ou m.
export const facebookValido = (u) => !u || /^https:\/\/((www|m)\.)?facebook\.com\/[^\s"'<>\\]+$/i.test(String(u).trim());

// Link do Perfil da Empresa no Google (avaliações): só endereços do Google (g.page, maps.app.goo.gl, google.com/maps…).
export const googleValido = (u) => !u || /^https:\/\/((www\.)?google\.com(\.br)?\/(maps|search)|maps\.google\.com(\.br)?\/|g\.page\/|maps\.app\.goo\.gl\/|goo\.gl\/maps\/|share\.google\/|g\.co\/kgs\/|search\.google\.com\/local\/)[^\s"'<>\\]*$/i.test(String(u).trim());

// E-mail de contato (canal do titular na Política de Privacidade). Inválido, não aparece no site.
export const emailValido = (e) => /^[^\s@<>()"',;:\\]+@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/i.test(String(e || '').trim());

// CNPJ com dígitos verificadores corretos (aceita o formato alfanumérico da Receita, em vigor desde jul/2026).
// O número fictício 00.000.000/0001-00 não passa.
export function cnpjValido(c) {
  const s = String(c || '').toUpperCase().replace(/[.\-/\s]/g, '');
  if (!/^[0-9A-Z]{12}\d{2}$/.test(s) || /^(\d)\1{13}$/.test(s)) return false;
  const dv = (base) => {
    let soma = 0, peso = 2;
    for (let i = base.length - 1; i >= 0; i--) { soma += (base.charCodeAt(i) - 48) * peso; peso = peso === 9 ? 2 : peso + 1; }
    const r = soma % 11;
    return r < 2 ? 0 : 11 - r;
  };
  const d1 = dv(s.slice(0, 12)), d2 = dv(s.slice(0, 12) + d1);
  return s.slice(12) === `${d1}${d2}`;
}

// Fotos: vazias, do próprio site (/fotos/, /uploads/) ou enviadas pelo painel ao Vercel Blob.
// images.pexels.com: fotos de exemplo antigas (legado) — o painel avisa para trocar.
export function fotoValida(u) {
  if (!u) return true;
  const s = String(u);
  if (!SEGURO.test(s)) return false;
  return /^\/(fotos|uploads)\/./.test(s) || /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//i.test(s) || /^https:\/\/images\.pexels\.com\//.test(s);
}

// Primeiro problema encontrado no conteúdo (texto pronto para o painel) ou ''.
export function problemaNoConteudo(c) {
  if (!facebookValido(c && c.info && c.info.facebook)) return 'Link do Facebook inválido: use o endereço completo da página (https://www.facebook.com/…).';
  if (!googleValido(c && c.info && c.info.googleAvaliacoes)) return 'Link do Perfil da Empresa no Google inválido: copie o link pelo botão "compartilhar" do perfil (começa com https://).';
  let achado = '';
  const andar = (v, caminho) => {
    if (achado) return;
    if (Array.isArray(v)) v.forEach((x, i) => andar(x, [...caminho, i + 1]));
    else if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => andar(x, [...caminho, k]));
    else if ((caminho[0] === 'fotos' || caminho[caminho.length - 1] === 'img') && !(v == null || (typeof v === 'string' && fotoValida(v)))) achado = caminho.join(' › ');
  };
  andar(c, []);
  return achado ? `Endereço de foto não permitido (${achado}). Envie a foto pelo botão "enviar foto".` : '';
}
