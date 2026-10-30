// Resumo de cada versão do histórico ("capa, promoções"): o painel anota as partes do site editadas desde o último
// salvamento, o servidor guarda os códigos no nome da versão e o histórico mostra os nomes ao lado da data.

export const PARTES = {
  inicio: 'página inicial', info: 'informações', fotos: 'fotos', promocoes: 'promoções', eventos: 'eventos',
  armacoes: 'armações', lentes: 'lentes', sobre: 'sobre', depoimentos: 'depoimentos', blog: 'blog',
  tudo: 'conteúdo todo', desfeito: 'alteração desfeita', restaurada: 'versão restaurada',
};

// Campos de info editados na aba "página inicial", na de lentes e na de "sobre".
const INFO_INICIO = new Set(['heroLinha1', 'heroLinha2', 'heroDestaque', 'heroTexto', 'selos', 'capaCardTitulo', 'capaCardTexto', 'capaSelo', 'faixaAtiva', 'faixaFim', 'faixaPromo', 'botaoFlutuante', 'animacoes', 'sobreResumo', 'anos', 'destaqueNumero', 'destaqueRotulo']);
const INFO_LENTES = new Set(['lentesTexto']);
const INFO_SOBRE = new Set(['sobreTitulo', 'sobreTexto']);
const LISTAS = { etapas: 'inicio', fechamentos: 'info', galeria: 'fotos', fotos: 'fotos', promocoes: 'promocoes', eventos: 'eventos', produtos: 'armacoes', tiposLente: 'lentes', passos: 'lentes', faq: 'lentes', marcos: 'sobre', diferenciais: 'sobre', equipe: 'sobre', depoimentos: 'depoimentos', posts: 'blog' };

// Parte do site de um caminho editado no painel ('info.heroLinha1' → 'inicio', 'posts.0.titulo' → 'blog').
export function parteDe(caminho) {
  const [a, b] = String(caminho || '').split('.');
  if (a === 'info') return INFO_INICIO.has(b) ? 'inicio' : INFO_LENTES.has(b) ? 'lentes' : INFO_SOBRE.has(b) ? 'sobre' : 'info';
  return LISTAS[a] || 'info';
}

// Códigos aceitos pelo servidor (vão no nome do arquivo: só letras minúsculas, separados por "_").
export const resumoValido = (r) => (Array.isArray(r) ? [...new Set(r.filter(c => typeof c === 'string' && Object.hasOwn(PARTES, c)))].slice(0, 6).join('_') : '');

// Códigos guardados no nome da versão (cms/<data>-<código>~promocoes_blog[-sufixo].json) → ['promocoes', 'blog'].
export const resumoDoNome = (nome) => { const m = /~([a-z_]+)/.exec(String(nome || '')); return m ? m[1].split('_').filter(c => Object.hasOwn(PARTES, c)) : []; };

export const nomesDasPartes = (codigos) => (codigos || []).map(c => PARTES[c]).filter(Boolean).join(', ');
