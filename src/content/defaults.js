// Conteúdo padrão do site (usado até o proprietário salvar a primeira versão no painel).
// Só dados confirmados: o que o proprietário ainda não informou fica vazio e a seção some do site
// (o painel lista essas pendências na "visão geral").

// Fotos: todas reais, em public/fotos (lista em FOTOS.md). Sem foto, o site mostra a arte da marca (ArteMarca).
// Fotos de exemplo de versões antigas (banco de imagens) ainda são reconhecidas para o painel avisar e trocar.
const FOTOS_EXEMPLO = ['https://images.pexels.com/', '/fotos/ilustrativas/', '/fotos/capa-armacao.jpg', '/fotos/infantil-rosa.jpg'];
export const ehIlustrativa = (url) => { const u = String(url || ''); return !!u && FOTOS_EXEMPLO.some(p => u.startsWith(p)); };

// Sobe quando o conteúdo padrão muda de um jeito que exige migrar o que já foi salvo (ver mesclar).
const VERSAO_PADRAO = 2;
const DATA_POSTS = '30 out 2026';

export const PADRAO = () => ({
  info: {
    whatsapp: '18997637896', telefone: '1835831566', instagram: 'digitallookbr', endereco: 'R. Prof. Sud Menucci, 228', bairroCidade: 'Centro, Rinópolis – SP', cep: '17740-000', cidade: 'rinópolis · sp', cidadeNome: 'rinópolis',
    // Identificação da empresa (Política de Privacidade, Termos de Uso e rodapé): vazia até o proprietário informar.
    razaoSocial: '', cnpj: '', email: '',
    // Horário vazio até o proprietário confirmar: o site mostra "consulte o horário pelo WhatsApp".
    abreSemana: '', fechaSemana: '', abreSabado: '', fechaSabado: '', parcelas: '', anos: '',
    heroLinha1: 'um novo olhar', heroLinha2: 'para o seu', heroDestaque: 'dia a dia.', heroTexto: 'Óculos de grau, óculos de sol e lentes de contato no centro de Rinópolis, com atendimento próximo — na loja ou pelo WhatsApp.',
    selos: 'atendimento pelo WhatsApp, orçamento com a foto da receita, no centro de Rinópolis',
    // Cards flutuantes da capa (computador) e número de destaque da home: vazios não aparecem.
    capaCardTitulo: 'orçamento pelo WhatsApp', capaCardTexto: 'envie a foto da sua receita', capaSelo: '', destaqueNumero: '', destaqueRotulo: '',
    sobreTitulo: 'atendimento próximo, no centro de rinópolis.', sobreResumo: 'Na R. Prof. Sud Menucci, 228, no centro de Rinópolis, a Ótica Digital Look ajuda você a escolher armação, lentes e óculos de sol com calma — da receita ao ajuste final.',
    sobreTexto: 'A Ótica Digital Look fica na R. Prof. Sud Menucci, 228, no centro de Rinópolis. Aqui você encontra armações de grau, óculos de sol e lentes de contato, com atendimento próximo para escolher o modelo que combina com o seu rosto e a sua rotina.\n\nTraga a receita do seu oftalmologista ou envie uma foto pelo WhatsApp: a gente ajuda a montar seus óculos completos.',
    lentesTexto: 'Lentes de contato diárias, mensais, tóricas e multifocais, vendidas somente com receita de médico oftalmologista. Tire suas dúvidas pelo WhatsApp ou na loja.',
    faixaAtiva: false, faixaPromo: '', faixaFim: '',
    convenios: '', marcas: '', pagamentos: '', googleAvaliacoes: '',
    siteTitulo: 'Ótica Digital Look | Ótica no centro de Rinópolis/SP', siteDescricao: 'Ótica no centro de Rinópolis/SP: óculos de grau, óculos de sol e lentes de contato (com receita médica). R. Prof. Sud Menucci, 228. Fale pelo WhatsApp (18) 99763-7896.', facebook: '',
    msgWhats: 'Olá! Vim pelo site da Ótica Digital Look e gostaria de atendimento.', msgReceita: 'Olá! Gostaria de um orçamento. Vou enviar a foto da minha receita.',
    botaoFlutuante: true, animacoes: true,
  },
  meta: { atualizadoEm: '', versaoPadrao: VERSAO_PADRAO },
  fotos: {
    hero: '/fotos/vitrine-feminina.jpg', loja: '/fotos/loja-balcao.jpg', lentes: '', equipe: '/fotos/fachada.jpg',
    cat_armacoes: '/fotos/galeria-feminina.jpg', cat_sol: '/fotos/oculos-clip-on.jpg', cat_lentes: '',
  },
  galeria: [
    { img: '/fotos/galeria-feminina.jpg', legenda: 'armações femininas' }, { img: '/fotos/galeria-masculina.jpg', legenda: 'armações masculinas' },
    { img: '/fotos/galeria-metal.jpg', legenda: 'armações de metal e clip-on solar' }, { img: '/fotos/galeria-balcao.jpg', legenda: 'nosso balcão de atendimento' },
  ],
  // Sugestão para conferir: só aparecem no site depois que o horário de funcionamento for preenchido.
  fechamentos: [{ data: '2026-12-25', motivo: 'Natal' }, { data: '2027-01-01', motivo: 'Ano Novo' }],
  etapas: [
    { titulo: 'conversa', texto: 'Pelo WhatsApp ou na loja: você conta o que procura e mostra a receita do seu oftalmologista.' },
    { titulo: 'escolha da armação', texto: 'Você prova os modelos na loja, com calma.' },
    { titulo: 'lentes sob medida', texto: 'As lentes são feitas conforme a sua receita. Informamos o prazo no orçamento e avisamos quando ficarem prontas.' },
    { titulo: 'retirada e ajuste', texto: 'Na retirada, ajustamos os óculos no seu rosto e explicamos os cuidados.' },
  ],
  marcos: [],
  diferenciais: [
    { titulo: 'no centro da cidade', texto: 'Na R. Prof. Sud Menucci, 228, no centro de Rinópolis.' },
    { titulo: 'orçamento pelo WhatsApp', texto: 'Envie a foto da sua receita e receba as opções de lentes e valores.' },
    { titulo: 'grau, sol e contato', texto: 'Armações de grau, óculos de sol e lentes de contato no mesmo lugar.' },
    { titulo: 'garantia', texto: 'Produtos com a garantia legal do Código de Defesa do Consumidor e, quando houver, a do fabricante. As condições são informadas na compra.' },
  ],
  tiposLente: [
    { nome: 'diárias', texto: 'Uma lente nova por dia, sem solução nem estojo.', ideal: 'descarte diário' },
    { nome: 'mensais', texto: 'Mais econômicas, com limpeza diária em solução.', ideal: 'descarte mensal' },
    { nome: 'tóricas', texto: 'Corrigem astigmatismo com estabilidade no olho.', ideal: 'para astigmatismo, conforme a receita' },
    { nome: 'multifocais', texto: 'Perto e longe na mesma lente, quando prescritas pelo oftalmologista.', ideal: 'para presbiopia, conforme a receita' },
  ],
  passos: [
    { titulo: 'envie sua receita', texto: 'Pelo WhatsApp ou na loja. A receita de lentes de contato é diferente da de óculos: ela traz dados como curvatura e diâmetro, definidos pelo oftalmologista.' },
    { titulo: 'veja as opções', texto: 'Com a receita do seu oftalmologista, mostramos as marcas e modelos disponíveis que correspondem ao que foi prescrito.' },
    { titulo: 'cuide bem', texto: 'Explicamos como guardar e higienizar as lentes, seguindo as orientações do fabricante e do seu oftalmologista.' },
  ],
  faq: [
    { p: 'Preciso de receita específica para lentes de contato?', r: 'Sim. A receita de lentes de contato é diferente da de óculos: o oftalmologista faz uma avaliação própria e informa curvatura, diâmetro e grau. Se você só tem a receita de óculos, é preciso voltar ao oftalmologista. Só vendemos lentes de contato com receita médica.' },
    { p: 'Posso dormir com as lentes?', r: 'Somente se o seu oftalmologista autorizar e o modelo for aprovado para uso prolongado. Sem essa orientação, retire sempre as lentes antes de dormir.' },
    { p: 'Lentes de contato ressecam os olhos?', r: 'Algumas pessoas sentem ressecamento, principalmente com ar-condicionado ou diante de telas. Se acontecer, converse com o seu oftalmologista: ele avalia o material da lente e se é indicado usar colírio lubrificante.' },
  ],
  promocoes: [],
  eventos: [],
  // Vitrine: fotos reais da loja, por tipo de armação (sem nomes ou marcas que a loja não confirmou).
  produtos: [
    { nome: 'Armações femininas', marca: '', cat: 'grau', img: '/fotos/galeria-feminina.jpg', preco: '' },
    { nome: 'Armações masculinas', marca: '', cat: 'grau', img: '/fotos/galeria-masculina.jpg', preco: '' },
    { nome: 'Armações de metal', marca: '', cat: 'grau', img: '/fotos/galeria-metal.jpg', preco: '' },
    { nome: 'Vitrine de armações', marca: '', cat: 'grau', img: '/fotos/vitrine-feminina.jpg', preco: '' },
    { nome: 'Óculos de sol e clip-on', marca: '', cat: 'sol', img: '/fotos/oculos-clip-on.jpg', preco: '' },
  ],
  equipe: [],
  depoimentos: [],
  // O tempo de leitura é calculado pelo tamanho do texto (postsDe, em lib/util.js).
  posts: [
    { tag: 'lentes de óculos', data: DATA_POSTS, titulo: 'Lente antirreflexo vale a pena? Entenda quando faz diferença.', resumo: 'O tratamento antirreflexo reduz brilhos de telas e faróis e deixa a lente quase invisível. Explicamos quando ele faz mais diferença e quando dá para economizar.', img: '/fotos/galeria-masculina.jpg', conteudo: 'O antirreflexo (AR) é uma camada aplicada à lente que reduz bastante os reflexos da própria superfície. Na prática, você enxerga com mais contraste à noite, as pessoas veem seus olhos (e não o reflexo da janela) e as fotos saem sem aquele brilho branco.\n\nQuando faz mais diferença: para quem dirige à noite, trabalha muitas horas em tela ou usa grau alto (as lentes ficam mais espessas e refletem mais).\n\nQuando dá para economizar: óculos de uso esporádico, como um par reserva para leitura.\n\nCuidados para durar mais: limpe as lentes com flanela de microfibra e um líquido próprio para lentes (ou água e sabão neutro). Evite papel, guardanapo e a barra da camiseta, que riscam, e não deixe os óculos no painel do carro ao sol — o calor forte pode danificar o tratamento.\n\nNa loja, tiramos suas dúvidas antes de você decidir.' },
    { tag: 'saúde ocular', data: DATA_POSTS, titulo: 'Quanto tempo de tela por dia cansa seus olhos — e como aliviar.', resumo: 'Olhos ardendo, visão embaçada no fim do dia e dor de cabeça são sinais comuns de quem passa horas no celular e no computador. Veja hábitos simples que aliviam.', conteudo: 'Não existe um número exato de horas que "faz mal": o cansaço vem principalmente de manter o foco de perto por muito tempo sem pausa. Quando olhamos para uma tela, piscamos menos — e o olho resseca. O resultado é ardência, sensação de areia, visão embaçada no fim do dia e, às vezes, dor de cabeça.\n\nRegra 20-20-20: a cada 20 minutos, olhe para algo a cerca de 6 metros (20 pés) de distância por 20 segundos. Isso relaxa o músculo que faz o foco de perto.\n\nAjuste a tela: o monitor deve ficar a um braço de distância, com a parte de cima na altura dos olhos ou um pouco abaixo. Brilho da tela parecido com o do ambiente evita esforço extra.\n\nLembre-se de piscar e de se hidratar. Em ambientes com ar-condicionado, um colírio lubrificante indicado pelo oftalmologista ajuda.\n\nUse a lente certa: grau desatualizado pode aumentar o cansaço. O antirreflexo reduz os reflexos da tela; sobre filtros de luz azul, os estudos ainda não mostram benefício claro contra o cansaço visual — converse com o seu oftalmologista.\n\nSe os sintomas forem frequentes, procure o oftalmologista: pode ser hora de atualizar a receita.', img: '' },
    { tag: 'armações', data: DATA_POSTS, titulo: 'Como escolher a armação certa para o formato do seu rosto.', resumo: 'Rosto redondo, quadrado, oval ou triangular? Entenda a regra do contraste e outros cuidados — tamanho, ponte e peso — para escolher uma armação bonita e confortável.', conteudo: 'A regra mais simples é a do contraste: armações com linhas opostas às do rosto equilibram as proporções.\n\nRosto redondo: modelos retangulares ou quadrados, com cantos marcados, alongam o rosto. Evite armações muito redondas e pequenas.\n\nRosto quadrado (maxilar marcado): armações arredondadas, ovais ou gatinho suavizam os ângulos.\n\nRosto oval: praticamente tudo combina. Vale apostar em modelos maiores ou em cores diferentes.\n\nRosto triangular (testa estreita e queixo largo): armações com a parte de cima mais marcada, como o estilo gatinho ou o browline, equilibram.\n\nMais importante que o formato é o encaixe: a armação deve acompanhar a largura do rosto, os olhos precisam ficar centralizados nas lentes, a ponte não pode apertar nem escorregar no nariz e as hastes devem apoiar atrás da orelha sem pressionar. Para graus altos, armações menores deixam as lentes mais finas e leves.\n\nNa Ótica Digital Look, no centro de Rinópolis, você prova os modelos com calma e a gente ajusta hastes e plaquetas no seu rosto.', img: '/fotos/galeria-feminina.jpg' },
    { tag: 'lentes de contato', data: DATA_POSTS, titulo: 'Primeira vez com lentes de contato: o que esperar nas duas primeiras semanas.', resumo: 'Sentir a lente nos primeiros dias é normal. Saiba como costuma ser a adaptação, por que seguir o tempo de uso definido pelo oftalmologista e quais sinais indicam que é hora de tirar a lente e procurar o médico.', conteudo: 'Antes de tudo: lente de contato exige receita própria, com curvatura e diâmetro indicados pelo oftalmologista. Com ela em mãos, a adaptação costuma ser rápida.\n\nPrimeiros dias: é normal perceber a lente no olho, principalmente ao piscar. Siga o tempo de uso inicial definido pelo seu oftalmologista e só aumente conforme a orientação dele.\n\nColocar e tirar: no começo leva alguns minutos — é questão de prática. Lave e seque bem as mãos, mantenha as unhas curtas e use sempre a solução indicada, nunca água da torneira.\n\nNa segunda semana a maioria das pessoas já esquece que está de lente. Respeite o prazo de troca (diária, quinzenal ou mensal) e não durma com a lente, a não ser que o modelo e o médico permitam.\n\nTire a lente e procure o oftalmologista se sentir dor, vermelhidão forte, sensibilidade à luz ou visão embaçada que não melhora.\n\nNa loja, tiramos suas dúvidas sobre o uso e os cuidados com as lentes.', img: '' },
    { tag: 'crianças', data: DATA_POSTS, titulo: 'Sinais de que seu filho pode precisar de óculos.', resumo: 'Criança nem sempre percebe que enxerga mal. Aproximar demais o rosto do caderno, apertar os olhos e dor de cabeça frequente estão entre os sinais de alerta.', conteudo: 'Como a criança acha que todo mundo enxerga do mesmo jeito, ela raramente reclama. Por isso vale observar alguns sinais:\n\n• aproxima muito o rosto do caderno, do celular ou da TV;\n• aperta ou esfrega os olhos com frequência;\n• fecha um olho para ler ou inclina a cabeça;\n• reclama de dor de cabeça no fim do dia, principalmente depois da escola;\n• perde a linha durante a leitura ou tem dificuldade para copiar da lousa;\n• um olho parece desviar (para dentro ou para fora).\n\nO ideal é levar a criança ao oftalmologista antes da alfabetização e repetir o exame conforme a orientação médica, mesmo sem sintomas. Problemas como o olho preguiçoso (ambliopia) têm tratamento muito mais eficaz quando descobertos cedo.\n\nCom a receita em mãos, a escolha da armação faz diferença: modelos infantis flexíveis e resistentes, com lentes de policarbonato (mais seguras contra impacto) e ajuste firme no rosto para não escorregar durante as brincadeiras.', img: '' },
  ],
});

export const LISTAS = ['promocoes', 'eventos', 'produtos', 'equipe', 'depoimentos', 'posts', 'galeria', 'fechamentos', 'etapas', 'marcos', 'diferenciais', 'tiposLente', 'passos', 'faq'];

// Une o conteúdo salvo ao padrão, para campos novos sempre existirem.
// Conteúdo salvo antes da versão atual do padrão (meta.versaoPadrao menor): se ainda tiver exatamente um texto
// ou uma lista de exemplo de versões anteriores (fictícios: horário, convênios, parcelas, equipe, eventos…),
// vale o novo padrão. Depois de salvo na versão atual, nada do que o proprietário preencheu é trocado.
const PADROES_ANTIGOS = {
  heroTexto: ['Armações, óculos de sol e lentes de contato com atendimento próximo e tecnologia de ponta na medição.', 'Óculos de grau, óculos de sol e lentes de contato no centro de Rinópolis, com atendimento próximo e medição digital de precisão.'],
  selos: ['medição digital, até 10x sem juros, ajuste e limpeza grátis'],
  sobreTitulo: ['uma ótica de bairro com olhar digital.', 'atendimento próximo, precisão digital.'],
  sobreResumo: ['No centro de Rinópolis, a Digital Look une a atenção de uma ótica de bairro a equipamentos digitais que garantem lentes precisas para cada rosto.', 'Na R. Prof. Sud Menucci, no centro de Rinópolis, a Ótica Digital Look une atendimento personalizado a equipamentos de medição digital que garantem lentes precisas para cada rosto.'],
  sobreTexto: ['A Digital Look nasceu no centro de Rinópolis com uma ideia simples: tratar cada cliente pelo nome e cada receita com precisão. Começamos pequenos, com um balcão e muita conversa.\n\nHoje usamos medição digital para que suas lentes fiquem exatamente onde seus olhos precisam — sem perder o atendimento que nos trouxe até aqui.'],
  siteTitulo: ['Ótica Digital Look — Rinópolis/SP'],
  siteDescricao: ['Armações, óculos de sol e lentes de contato com medição digital em Rinópolis/SP.', 'Ótica no centro de Rinópolis/SP: óculos de grau, de sol e lentes de contato com medição digital, convênios e até 10x sem juros. Chame no WhatsApp.'],
  faixaPromo: ['Outubro: 2ª armação com 30% de desconto na compra de óculos completo'],
  convenios: ['Unimed, Sindicato Rural, Prefeitura de Rinópolis, Sind. Comerciários, Assoc. Funcionários Públicos, Cartão Visa, Cartão Mastercard, Cartão Elo, Pix, Crediário próprio'],
  marcas: ['Marca 1, Marca 2, Marca 3, Marca 4, Marca 5, Marca 6'],
  pagamentos: ['Cartões em até 10x sem juros, Pix e dinheiro com desconto, Crediário próprio com aprovação na hora, Boleto para empresas conveniadas'],
  cnpj: ['00.000.000/0001-00'],
  anos: ['10'], parcelas: ['10'],
  abreSemana: ['08:30'], fechaSemana: ['18:00'], abreSabado: ['08:30'], fechaSabado: ['12:30'],
  instagram: ['oticadigitallook'],
};

// Listas de exemplo das versões anteriores, guardadas pela impressão do JSON (igual = nunca editada).
const LISTAS_ANTIGAS = {
  depoimentos: ['1itq47w'], eventos: ['qfyggg', '1t6gf3z'], promocoes: ['1o7xw88', 'sa5jrc'], marcos: ['en0x4g'], equipe: ['1nt3qrs', '1vuzqur'],
  produtos: ['1qvxvmu', '1f52nx'], passos: ['ntqig4'], faq: ['q8sfgq'], etapas: ['u565z1'], diferenciais: ['nx786t'], tiposLente: ['ued1gw'],
  posts: ['1kwljru', '1ki4jen', '1ykoxue'],
};
const impressao = (v) => { const s = JSON.stringify(v); let h = 5381; for (let i = 0; i < s.length; i++) h = (h * 33 ^ s.charCodeAt(i)) >>> 0; return h.toString(36); };

export function mesclar(s) {
  const base = PADRAO();
  if (s && typeof s === 'object') {
    const antigo = !(s.meta && +s.meta.versaoPadrao >= VERSAO_PADRAO);
    const info = { ...(s.info || {}) };
    if (antigo) Object.entries(PADROES_ANTIGOS).forEach(([k, antigos]) => { if (antigos.includes(info[k])) delete info[k]; });
    base.info = { ...base.info, ...info };
    base.meta = { ...base.meta, ...(s.meta || {}), versaoPadrao: VERSAO_PADRAO };
    const fotos = { ...(s.fotos || {}) };
    if (antigo) Object.keys(fotos).forEach(k => { if (ehIlustrativa(fotos[k])) delete fotos[k]; });
    base.fotos = { ...base.fotos, ...fotos };
    LISTAS.forEach(k => {
      if (!Array.isArray(s[k])) return;
      if (antigo && (LISTAS_ANTIGAS[k] || []).includes(impressao(s[k]))) return;
      base[k] = s[k];
    });
  }
  return base;
}
