// Endereços aceitos no conteúdo. Usado pelo servidor ao salvar e pelo painel para avisar antes.
const SEGURO = /^[^\s"'<>()\\]+$/;

// Link do Facebook: só https://facebook.com/…, www. ou m.
export const facebookValido = (u) => !u || /^https:\/\/((www|m)\.)?facebook\.com\/[^\s"'<>\\]+$/i.test(String(u).trim());

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
