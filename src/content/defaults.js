// Conteúdo padrão do site (usado até o proprietário salvar a primeira versão no painel).

// Fotos: as de /fotos/ ficam em public/fotos; as demais são ilustrativas do banco gratuito Pexels
// (licença livre, lista em FOTOS.md), servidas pela CDN do Pexels no tamanho pedido. Trocar pelas reais no painel.
const px = (id, w = 1200) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
export const ehIlustrativa = (url) => String(url || '').startsWith('https://images.pexels.com/');

export const PADRAO = () => ({
  info: {
    whatsapp: '18997637896', instagram: 'oticadigitallook', endereco: 'R. Prof. Sud Menucci, 228', bairroCidade: 'Centro, Rinópolis – SP', cep: '17740-000', cidade: 'rinópolis · sp', cidadeNome: 'rinópolis', cnpj: '00.000.000/0001-00',
    abreSemana: '08:30', fechaSemana: '18:00', abreSabado: '08:30', fechaSabado: '12:30', parcelas: '10', anos: '10',
    heroLinha1: 'um novo olhar', heroLinha2: 'para o seu', heroDestaque: 'dia a dia.', heroTexto: 'Armações, óculos de sol e lentes de contato com atendimento próximo e tecnologia de ponta na medição.',
    selos: 'medição digital, até 10x sem juros, ajuste e limpeza grátis',
    sobreTitulo: 'uma ótica de bairro com olhar digital.', sobreResumo: 'No centro de Rinópolis, a Digital Look une a atenção de uma ótica de bairro a equipamentos digitais que garantem lentes precisas para cada rosto.',
    sobreTexto: 'A Digital Look nasceu no centro de Rinópolis com uma ideia simples: tratar cada cliente pelo nome e cada receita com precisão. Começamos pequenos, com um balcão e muita conversa.\n\nHoje usamos medição digital para que suas lentes fiquem exatamente onde seus olhos precisam — sem perder o atendimento que nos trouxe até aqui.',
    faixaAtiva: true, faixaPromo: 'Outubro: 2ª armação com 30% de desconto na compra de óculos completo',
    convenios: 'Unimed, Sindicato Rural, Prefeitura de Rinópolis, Sind. Comerciários, Assoc. Funcionários Públicos, Cartão Visa, Cartão Mastercard, Cartão Elo, Pix, Crediário próprio',
    marcas: 'Marca 1, Marca 2, Marca 3, Marca 4, Marca 5, Marca 6',
    pagamentos: 'Cartões em até 10x sem juros, Pix e dinheiro com desconto, Crediário próprio com aprovação na hora, Boleto para empresas conveniadas',
    siteTitulo: 'Ótica Digital Look — Rinópolis/SP', siteDescricao: 'Armações, óculos de sol e lentes de contato com medição digital em Rinópolis/SP.', facebook: '',
    msgWhats: 'Olá! Vim pelo site da Ótica Digital Look e gostaria de atendimento.', msgReceita: 'Olá! Gostaria de um orçamento. Vou enviar a foto da minha receita.',
    botaoFlutuante: true, animacoes: true,
  },
  meta: { atualizadoEm: '' },
  fotos: {
    hero: '/fotos/capa-armacao.jpg', loja: '/fotos/loja-vitrine.jpg', lentes: px(5843417, 1400), equipe: px(5752308),
    cat_armacoes: '/fotos/armacoes-variadas.jpg', cat_sol: px(10388460, 900), cat_lentes: px(5842844, 900),
  },
  galeria: [
    { img: px(5201931, 800), legenda: 'provando armações' }, { img: px(5765759, 800), legenda: 'medição para as lentes' },
    { img: px(5752402, 800), legenda: 'conferência das lentes' }, { img: px(5621834, 800), legenda: 'atendimento para toda a família' },
  ],
  fechamentos: [{ data: '2026-12-25', motivo: 'Natal' }, { data: '2027-01-01', motivo: 'Ano Novo' }],
  etapas: [{ titulo: 'conversa', texto: 'Pelo WhatsApp ou na loja: entendemos sua rotina e sua receita.' }, { titulo: 'medição digital', texto: 'Centragem e altura medidas por câmera, com a armação escolhida.' }, { titulo: 'lentes no laboratório', texto: 'Prazo médio de 48h para lentes comuns; avisamos quando chegar.' }, { titulo: 'ajuste final', texto: 'Ajustamos hastes e plaquetas no rosto e explicamos os cuidados.' }],
  marcos: [{ ano: '2014', texto: 'Abrimos a primeira loja na R. Prof. Sud Menucci, com duas pessoas e um balcão.' }, { ano: '2019', texto: 'Chegada do equipamento de medição digital e da linha de lentes de contato.' }, { ano: '2024', texto: 'Reforma da loja e ampliação do mostruário de armações e óculos de sol.' }],
  diferenciais: [{ titulo: 'medição digital', texto: 'Centragem e altura medidas por câmera, não a olho — a lente fica onde deve.' }, { titulo: 'ajuste gratuito', texto: 'Passou na porta? Ajustamos e limpamos seu óculos, comprado aqui ou não.' }, { titulo: 'prazo honesto', texto: 'Laboratório parceiro com prazo médio de 48h para lentes comuns.' }, { titulo: 'garantia real', texto: 'Adaptação garantida: se a lente não ficou boa, refazemos.' }],
  tiposLente: [{ nome: 'diárias', texto: 'Uma lente nova por dia, sem solução nem estojo.', ideal: 'ideal para uso ocasional' }, { nome: 'mensais', texto: 'Mais econômicas, com limpeza diária em solução.', ideal: 'ideal para uso diário' }, { nome: 'tóricas', texto: 'Corrigem astigmatismo com estabilidade no olho.', ideal: 'ideal para astigmatismo' }, { nome: 'multifocais', texto: 'Perto e longe na mesma lente, sem óculos de leitura.', ideal: 'ideal para presbiopia' }],
  passos: [{ titulo: 'envie sua receita', texto: 'Pelo WhatsApp ou na loja. Receita de contato é diferente da de óculos — a gente explica.' }, { titulo: 'escolha e teste', texto: 'Indicamos a lente para o seu caso e você experimenta antes de levar.' }, { titulo: 'aprenda a cuidar', texto: 'Treinamos colocação, retirada e higiene até você se sentir seguro.' }],
  faq: [{ p: 'Preciso de receita específica para lentes de contato?', r: 'Sim. O oftalmologista adiciona curvatura e diâmetro à receita. Se tiver só a de óculos, orientamos como conseguir.' }, { p: 'Posso dormir com as lentes?', r: 'Só modelos indicados para uso contínuo. Na dúvida, retire sempre antes de dormir.' }, { p: 'Lentes de contato ressecam os olhos?', r: 'Materiais atuais de silicone-hidrogel deixam o oxigênio passar. Colírio lubrificante ajuda em ambientes com ar-condicionado.' }],
  promocoes: [
    { tag: 'outubro', titulo: '2ª armação com 30% off', texto: 'Na compra de óculos completo (armação + lentes), a segunda armação sai com 30% de desconto. Vale para sol também.', ativa: true, img: px(26050120) },
    { tag: 'sempre', titulo: 'ajuste e limpeza grátis', texto: 'Traga seu óculos para ajuste de hastes e plaquetas e limpeza ultrassônica, sem custo — comprado aqui ou não.', ativa: true, img: px(5201927) },
  ],
  eventos: [
    { titulo: 'Dia da saúde ocular na loja', data: '2026-11-08', hora: '9h às 13h', local: 'na loja', texto: 'Aferição gratuita de pressão ocular e orientação sobre lentes. Sem agendamento.', img: px(5754242) },
  ],
  produtos: [
    { nome: 'Lumen round', marca: 'Linha própria', cat: 'grau', img: px(2530391, 800), destaque: true, selo: 'novo', preco: '' }, { nome: 'Vértice acetato', marca: 'Linha própria', cat: 'grau', img: px(28211038, 800) },
    { nome: 'Costa aviador', marca: 'Marca parceira', cat: 'sol', img: px(1548027, 800) }, { nome: 'Dune quadrado', marca: 'Marca parceira', cat: 'sol', img: px(4952482, 800) },
    { nome: 'Mini flex', marca: 'Infantil', cat: 'infantil', img: px(20437260, 800) }, { nome: 'Play color', marca: 'Infantil', cat: 'infantil', img: '/fotos/infantil-rosa.jpg' },
    { nome: 'Trail wrap', marca: 'Esportivo', cat: 'esportivo', img: px(11308615, 800) }, { nome: 'Titan leve', marca: 'Linha própria', cat: 'grau', img: px(28881363, 800) },
  ],
  equipe: [{ nome: 'Nome Sobrenome', cargo: 'Proprietária · óptica', img: px(5752305, 700) }, { nome: 'Nome Sobrenome', cargo: 'Consultor de armações', img: px(5201992, 700) }, { nome: 'Nome Sobrenome', cargo: 'Atendimento e laboratório', img: px(5715905, 700) }],
  depoimentos: [
    { nome: 'Ana Paula', item: 'óculos multifocal', texto: 'Já tinha desistido de multifocal depois de duas tentativas em outro lugar. Aqui mediram com a câmera e adaptei em dois dias.' },
    { nome: 'Carlos Eduardo', item: 'lentes de contato', texto: 'Primeira vez com lente de contato. Sentaram comigo até eu conseguir colocar sozinho. Atendimento de verdade.' },
    { nome: 'Juliana', item: 'óculos de sol com grau', texto: 'Mandei a receita pelo WhatsApp de manhã e à tarde já tinha o orçamento com três opções. Rápido e sem enrolação.' },
  ],
  posts: [
    { tag: 'lentes', data: '08 out 2026', leitura: '4 min', titulo: 'Lente antirreflexo vale a pena? Entenda quando faz diferença.', resumo: 'O tratamento antirreflexo reduz brilhos de telas e faróis e deixa a lente quase invisível. Explicamos quando ele é indispensável e quando dá para economizar.', img: px(1331386, 1400), conteudo: 'O antirreflexo (AR) é uma camada aplicada à lente que elimina os reflexos da própria superfície. Na prática, você enxerga com mais contraste à noite, as pessoas enxergam seus olhos (e não o reflexo da janela) e as fotos saem sem aquele brilho branco.\n\nQuando é indispensável: quem dirige à noite, trabalha muitas horas em tela ou usa grau alto (as lentes ficam mais espessas e refletem mais).\n\nQuando dá para economizar: óculos de uso esporádico, como um par reserva para leitura.\n\nNa loja, mostramos a diferença lado a lado antes de você decidir.' },
    { tag: 'saúde ocular', data: '24 set 2026', leitura: '3 min', titulo: 'Quanto tempo de tela por dia cansa seus olhos — e como aliviar.', resumo: '', img: px(5843339, 1400) },
    { tag: 'armações', data: '10 set 2026', leitura: '5 min', titulo: 'Como escolher a armação certa para o formato do seu rosto.', resumo: '', img: px(5766531, 1400) },
    { tag: 'lentes de contato', data: '28 ago 2026', leitura: '4 min', titulo: 'Primeira vez com lentes de contato: o que esperar nas duas primeiras semanas.', resumo: '', img: px(5842841, 1400) },
    { tag: 'crianças', data: '12 ago 2026', leitura: '3 min', titulo: 'Sinais de que seu filho pode precisar de óculos.', resumo: '', img: px(9656170, 1400) },
  ],
});

export const LISTAS = ['promocoes', 'eventos', 'produtos', 'equipe', 'depoimentos', 'posts', 'galeria', 'fechamentos', 'etapas', 'marcos', 'diferenciais', 'tiposLente', 'passos', 'faq'];

// Une o conteúdo salvo ao padrão, para campos novos sempre existirem.
export function mesclar(s) {
  const base = PADRAO();
  if (s && typeof s === 'object') {
    base.info = { ...base.info, ...(s.info || {}) };
    base.meta = { ...base.meta, ...(s.meta || {}) };
    base.fotos = { ...base.fotos, ...(s.fotos || {}) };
    LISTAS.forEach(k => { if (Array.isArray(s[k])) base[k] = s[k]; });
  }
  return base;
}
