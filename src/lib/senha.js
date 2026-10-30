// Regras da senha do painel. Usadas pelo servidor ao salvar (server/router.js) e pelo painel para avisar antes
// de enviar (src/admin/Configuracoes.jsx).

// Mesma normalização ao criar a senha, ao entrar, ao conferir a senha atual e na senha inicial (ADMIN_PASSWORD):
// espaços nas pontas não contam (o celular, o gerenciador de senhas ou o painel da hospedagem às vezes acrescentam)
// e letras acentuadas valem igual em qualquer aparelho (NFC). Assim o que é salvo é sempre o que o login confere.
export const normalizarSenha = (s) => String(s ?? '').normalize('NFC').trim();
export const SENHA_MIN = 10, SENHA_MAX = 200;

// Só letras e números, sem acentos, em minúsculas: "Ótica Digital-Look" → "oticadigitallook".
const simplificar = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
// Troca de letras por números e símbolos parecidos: "D1g1t@l L00k" → "digitallook".
const LEET = { 0: 'o', 1: 'i', 3: 'e', 4: 'a', 5: 's', 7: 't', '@': 'a', $: 's', '!': 'i' };
const semLeet = (s) => simplificar(String(s || '').toLowerCase().replace(/[0134579@$!]/g, c => LEET[c] || c));
const digitos = (s) => String(s || '').replace(/\D/g, '');

// Nome da loja (com e sem espaço, acento ou letras trocadas), cidade e rua.
const TERMOS_LOJA = ['digitallook', 'digitalook', 'lookdigital', 'oticadigital', 'opticadigital', 'rinopolis', 'sudmenucci'];
// Telefones, WhatsApp e CEP públicos da loja (só os dígitos; vale com ou sem DDD, espaço ou traço).
const NUMEROS_LOJA = ['997637896', '35831566', '17740000'];
// Palavras que as listas de senhas vazadas mais usam: tiradas da senha, o que sobra precisa ser forte.
const PALAVRAS_COMUNS = ['senha', 'password', 'admin', 'administrador', 'qwerty', 'teste', 'mudar', 'trocar', 'acesso', 'login', 'iloveyou', 'teamo', 'brasil', 'deus', 'jesus', 'amor', 'familia', 'letmein', 'welcome', 'abc', 'flamengo', 'corinthians', 'palmeiras', 'saopaulo', 'santos', 'vasco', 'gremio', 'cruzeiro'];
const SENHAS_COMUNS = new Set(['1234567890', '0123456789', '12345678910', '1234567891', '123456789a', 'a123456789', '1q2w3e4r5t', 'q1w2e3r4t5', 'qwertyuiop', 'asdfghjkl', 'asdfghjkl1', 'qwerty1234', 'abcdefghij', 'abc1234567', 'senha12345', 'senha123456', 'minhasenha', 'password123', 'iloveyou12', 'brasil2026', 'mudar12345', 'admin12345', 'aaaaaaaaaa']);

// Sequências de teclado, do alfabeto e dos números (nos dois sentidos).
const SEQUENCIAS = ['0123456789', 'abcdefghijklmnopqrstuvwxyz', 'qwertyuiop', 'asdfghjkl', 'zxcvbnm', '1q2w3e4r5t6y7u8i9o0p', 'q1w2e3r4t5y6u7i8o9p0', '1qaz2wsx3edc4rfv5tgb6yhn7ujm8ik9ol0p', 'qazwsxedcrfvtgbyhnujmikolp'];
const VIZINHOS = new Set(SEQUENCIAS.flatMap(s => [...s].slice(1).flatMap((c, i) => [s[i] + c, c + s[i]])));
// Fração dos pares de caracteres vizinhos que seguem uma sequência ou se repetem ("1234567890" → 1).
const fracaoSequencia = (s) => {
  if (s.length < 2) return 1;
  let n = 0;
  for (let i = 1; i < s.length; i++) if (s[i] === s[i - 1] || VIZINHOS.has(s[i - 1] + s[i])) n++;
  return n / (s.length - 1);
};
const distintos = (s) => new Set(s).size;
const fraca = (s) => s.length < 6 || /^\d+$/.test(s) || distintos(s) < 4 || fracaoSequencia(s) >= 0.6;
const semPalavrasComuns = (s) => PALAVRAS_COMUNS.reduce((r, p) => r.split(p).join(''), s);

// Primeiro problema da senha nova (texto pronto para o painel) ou ''.
// evitar: senhas que a nova não pode repetir nem conter (inicial e atual), sem diferenciar maiúsculas e símbolos.
// telefones: números da loja cadastrados no painel, além dos fixos acima.
export function problemaNaSenha(nova, { evitar = [], telefones = [] } = {}) {
  const n = normalizarSenha(nova);
  if (n.length < SENHA_MIN) return `Use pelo menos ${SENHA_MIN} caracteres.`;
  if (n.length > SENHA_MAX) return `Use no máximo ${SENHA_MAX} caracteres.`;
  const s = simplificar(n), l = semLeet(n), d = digitos(n);
  for (const e of evitar.map(simplificar).filter(x => x.length >= 6)) {
    if (s === e || l === semLeet(e) || (e.length >= 8 && s.includes(e))) return 'A nova senha precisa ser diferente da senha inicial e da atual.';
  }
  const numeros = [...NUMEROS_LOJA, ...telefones.map(digitos).filter(x => x.length >= 8).map(x => x.slice(-8))];
  if (TERMOS_LOJA.some(t => s.includes(t) || l.includes(t)) || numeros.some(x => d.includes(x))) return 'Não use o nome da loja, da cidade, da rua nem o telefone da loja na senha.';
  if (/^\d+$/.test(s)) return 'Não use só números: uma frase curta, com palavras, é mais segura.';
  if (distintos(s) < 5) return 'Use mais caracteres diferentes (evite repetições como aaaa ou abab).';
  if (fracaoSequencia(s) >= 0.6) return 'Evite sequências como 1234567890, abcdef ou qwerty.';
  if (SENHAS_COMUNS.has(s) || SENHAS_COMUNS.has(l) || fraca(semPalavrasComuns(s)) || fraca(semPalavrasComuns(l))) return 'Essa senha é muito comum. Prefira uma frase curta que só você conheça.';
  return '';
}
