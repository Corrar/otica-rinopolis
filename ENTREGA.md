# Guia de entrega — site da Ótica Digital Look

Para o proprietário da Ótica Digital Look · atualizado em 30/10/2026

- **Site:** https://otica-rinopolis.vercel.app
- **Painel de edição:** https://otica-rinopolis.vercel.app/admin (ou o link "área do proprietário", com um cadeado, no fim de qualquer página)

Este guia explica, sem termos técnicos, o que o site tem, como entrar no painel, o que ainda falta preencher e os cuidados do dia a dia. Guarde-o junto com os documentos da loja. Os detalhes técnicos, para quem cuida da hospedagem, estão no `README.md` e no `PENDENCIAS.md`.

## Índice
1. [O que foi feito](#1-o-que-foi-feito)
2. [Primeiro acesso ao painel e troca da senha](#2-primeiro-acesso-ao-painel-e-troca-da-senha)
3. [Como usar o painel](#3-como-usar-o-painel)
4. [Checklist: dados que só você pode informar](#4-checklist-dados-que-só-você-pode-informar)
5. [Publicar as alterações no Google](#5-publicar-as-alterações-no-google)
6. [Backup todo mês](#6-backup-todo-mês)
7. [Google: Perfil da Empresa, Search Console e sitemap](#7-google-perfil-da-empresa-search-console-e-sitemap)
8. [Privacidade no dia a dia (LGPD na prática)](#8-privacidade-no-dia-a-dia-lgpd-na-prática)
9. [Páginas legais: revisão por advogado antes de divulgar](#9-páginas-legais-revisão-por-advogado-antes-de-divulgar)
10. [Hospedagem: contas, plano e custos](#10-hospedagem-contas-plano-e-custos)
11. [Domínio próprio (opcional)](#11-domínio-próprio-opcional)
12. [Quando chamar o responsável técnico](#12-quando-chamar-o-responsável-técnico)
- [Anexo: modelo de autorização de uso de imagem e depoimento](#anexo-modelo-de-autorização-de-uso-de-imagem-e-depoimento)

---

## 1. O que foi feito

O site tem estas páginas:

| Página | Endereço | O que mostra |
|---|---|---|
| Início | `/` | capa, categorias, "como funciona", localização e dicas do blog |
| Sobre | `/sobre` | história da loja, diferenciais e galeria de fotos |
| Armações | `/armacoes` | vitrine com filtro (grau, sol…) e botão "consultar" pelo WhatsApp |
| Lentes de contato | `/lentes` | tipos de lente, passo a passo e dúvidas frequentes |
| Convênios e eventos | `/convenios` | promoções, eventos, convênios e formas de pagamento |
| Blog | `/blog` | artigos com dicas (5 prontos) |
| Contato | `/contato` | endereço, telefones, mapa e formulário que abre o WhatsApp |
| Política de Privacidade | `/politica-de-privacidade` | como a loja cuida dos dados dos clientes (LGPD) |
| Termos de Uso | `/termos-de-uso` | regras do site e direitos do consumidor |
| Acessibilidade | `/acessibilidade` | recursos de acessibilidade e canal para relatar dificuldades |

O que o site oferece:

- **Você mesmo edita.** Pelo painel, do celular ou do computador, você muda textos, fotos, horário, promoções, eventos, armações, artigos do blog e muito mais, sem precisar de programador.
- **Só informação verdadeira.** O site foi entregue apenas com dados confirmados: endereço, WhatsApp, telefone fixo, Instagram e 8 fotos reais da loja. O conteúdo de exemplo que veio do projeto de design foi retirado: horário, convênios, "10x sem juros", marcas, equipe, depoimentos, promoções e um evento com "aferição de pressão ocular", que ótica não pode anunciar. O que ainda não foi informado fica escondido: a seção some sozinha e volta quando você preencher.
- **Sem foto, sem buraco.** Onde ainda não há foto real, aparece um desenho com o olho do logo, nas cores do site.
- **Pronto para o Google.** Cada página já sai pronta para o Google ler, com título, descrição, mapa do site (sitemap) e os dados da loja num formato que o Google entende: endereço, telefones e, quando você informar, o horário.
- **Privacidade.** O site não usa rastreadores nem anúncios. O mapa do Google só carrega se o visitante tocar em "mostrar mapa". O formulário de contato não grava nada: ele só abre o WhatsApp com a mensagem pronta. Há um aviso sobre o uso da foto da receita.
- **Rápido e acessível.** Abre rápido no celular, funciona com teclado e com leitor de tela e respeita quem prefere menos animação.
- **Seguro.** O painel tem uma senha que só você vai saber, limite de tentativas, histórico de versões e backup.

## 2. Primeiro acesso ao painel e troca da senha

**A senha inicial.** O desenvolvedor criou uma senha inicial e vai passá-la a você **por um canal privado** (pessoalmente ou por ligação). Ela não está escrita neste guia nem em nenhum arquivo do site e serve só para o primeiro acesso.

Passo a passo:

1. Abra https://otica-rinopolis.vercel.app/admin.
2. Digite a senha inicial e toque em **entrar**.
3. Aparece a tela **"crie a sua senha"**. Ela é obrigatória: o painel não deixa editar nada antes.
   - Em "senha inicial", digite de novo a senha que você usou para entrar.
   - Em "nova senha", crie a sua, com **pelo menos 10 caracteres**. Uma frase curta, de 3 ou 4 palavras que só você conheça, é fácil de lembrar e difícil de adivinhar. O painel recusa a senha inicial e senhas com o nome da loja.
   - Repita a nova senha em "confirmar" e toque em **salvar e continuar**.
4. Pronto: o painel abre. A partir daí, **a senha inicial deixa de funcionar e ninguém mais sabe a sua senha, nem o desenvolvedor**.

Dicas:

- Anote a senha num lugar seguro, como um gerenciador de senhas ou um papel guardado na loja. Não mande a senha por WhatsApp nem a deixe numa nota do celular sem bloqueio.
- **"manter conectado neste aparelho"**: marque só no seu celular ou no seu computador. O aparelho fica conectado por 14 dias; sem marcar, por 12 horas.
- Perdeu o celular ou entrou num computador de outra pessoa? Vá em **configurações → sair de todos os aparelhos** e depois troque a senha (configurações → trocar senha).
- **Esqueceu a senha?** O painel não tem "esqueci minha senha", de propósito: assim ninguém consegue pedir uma senha nova no seu lugar. O responsável técnico consegue zerar o acesso pela hospedagem. Você recebe uma nova senha inicial e cria outra senha.

## 3. Como usar o painel

**Abas do painel:**

| Aba | Para quê |
|---|---|
| visão geral | resumo do site e a lista de **pendências** (o que ainda falta preencher); toque num item para ir direto ao campo |
| informações | contato, endereço, identificação da empresa (razão social, CNPJ, e-mail), horário, feriados, mensagens do WhatsApp, convênios, marcas, pagamentos, Facebook, Perfil do Google |
| página inicial | capa, selos, faixa de aviso no topo, botão flutuante do WhatsApp, animações, "como funciona" |
| fotos e galeria | fotos das seções fixas e a galeria da página "sobre" |
| promoções | ofertas com validade e condições (saem do site sozinhas depois do fim) |
| eventos | eventos na loja (passados somem sozinhos) |
| armações | vitrine: modelos, categoria, foto, selo e preço opcional |
| lentes de contato | texto da página, tipos de lente, passo a passo e perguntas frequentes |
| sobre e equipe | história, linha do tempo, diferenciais e equipe |
| depoimentos | depoimentos de clientes (só com autorização) |
| blog | artigos |
| configurações | trocar senha, histórico de versões, backup, limpeza de fotos e acesso |

**Como funciona:**

- **Salva sozinho.** No topo aparece "salvando…" e depois **"salvo"**. Errou? Toque em **↶ desfazer**.
- Se aparecer **"o site foi alterado em outro aparelho"**, prefira **"carregar versão mais nova"**. A opção "manter as minhas alterações" apaga o que foi feito no outro aparelho.
- **"ver no site"** (no menu do painel) abre a página que você está editando.
- **Seções vazias somem do site.** Exemplo: sem marcas cadastradas, a seção de marcas não aparece.
- Cada campo tem uma ajuda curta dizendo o que pode e o que não pode ser publicado. Leia antes de preencher. As regras principais:
  - **não anuncie** exame de vista, teste de visão, triagem, aferição de pressão ocular nem médico atendendo na loja: ótica não pode (Decretos 20.931/1932 e 24.492/1934);
  - **o que é publicado vira compromisso.** Prazo, garantia, desconto e serviço grátis anunciados obrigam a loja (Código de Defesa do Consumidor, arts. 30 e 35). Publique só o que a loja consegue cumprir sempre, com validade e condições;
  - **pessoas** (equipe e clientes) só com autorização por escrito (modelo no [anexo](#anexo-modelo-de-autorização-de-uso-de-imagem-e-depoimento));
  - **preço:** informe o preço à vista da armação; as lentes são orçadas à parte.

**Fotos:**

- Aceita JPG, PNG ou WebP. O painel diminui a foto sozinho antes de enviar. Prefira fotos na horizontal, bem iluminadas e sem pessoas reconhecíveis (ou com autorização delas).
- **Toda foto enviada pelo painel fica pública na internet.** Nunca envie foto de receita, de documento, de tela com dados de cliente ou de criança sem autorização dos responsáveis.
- "remover foto" tira a foto do site. Para apagá-la de vez da hospedagem, siga o passo a passo da [seção 8](#retirar-alguém-do-site-de-vez).

## 4. Checklist: dados que só você pode informar

A aba **visão geral → pendências** do painel mostra boa parte desta lista e marca o que já foi feito.

### Antes de divulgar o site (essencial)

- [ ] **Trocar a senha inicial** ([seção 2](#2-primeiro-acesso-ao-painel-e-troca-da-senha)).
- [ ] **Razão social e CNPJ** (informações → identificação da empresa). Copie como está no cartão CNPJ, que pode ser consultado em solucoes.receita.fazenda.gov.br/servicos/cnpjreva. Eles aparecem no rodapé e nas páginas de privacidade e de termos. A pesquisa na internet não encontrou o CNPJ da loja. Atenção: a "Agência Digital Look'N Feel Ltda" (Brasília/DF, CNPJ 15.385.063/0001-80) é outra empresa, sem relação com a ótica.
- [ ] **E-mail de contato e de privacidade** (informações → identificação da empresa). A LGPD exige um canal para os clientes pedirem informações sobre os próprios dados. Use um e-mail da loja que alguém confira toda semana (pode ser um Gmail criado para isso) e defina quem na loja vai cuidar desses pedidos.
- [ ] **Horário de funcionamento** (informações → horário de funcionamento). Enquanto estiver vazio, o site mostra "consulte o horário pelo WhatsApp". Com o horário preenchido, aparece "aberto agora" ou "fechado" automaticamente. Sábado vazio significa fechado aos sábados. Se a loja fecha para almoço, avise o responsável técnico: hoje o painel tem só abertura e fechamento.
- [ ] **Feriados e fechamentos** (informações → feriados e fechamentos). Já há duas sugestões para conferir: Natal (25/12/2026) e Ano Novo (01/01/2027). Acrescente os feriados de Rinópolis e outros dias em que a loja fecha.
- [ ] **Formas de pagamento e parcelas** (informações → listas). Só o que a loja pratica de verdade. Desconto à vista: informe o percentual. Crediário: escreva "sujeito a análise de crédito". Se o crediário consulta SPC ou Serasa, avise o responsável técnico, porque a Política de Privacidade precisa citar isso.
- [ ] **Datas dos artigos do blog** (blog → cada artigo → data de publicação). Hoje todas estão em 30 out 2026. Use a data real em que o site for publicado.
- [ ] **Revisão das páginas legais por um advogado** ([seção 9](#9-páginas-legais-revisão-por-advogado-antes-de-divulgar)).
- [ ] **Primeiro backup** ([seção 6](#6-backup-todo-mês)).

### Encontrado na internet: confirmar

A pesquisa na internet achou estes itens. Nada disso foi colocado no site sem a sua confirmação.

- [ ] **Facebook (confirmar):** https://www.facebook.com/oticadigitallookrinopolis/ (cerca de 252 curtidas e 15 check-ins; nome e cidade batem). Se a página é da loja e está ativa, cole o endereço em informações → Facebook: aparece o ícone "f" no rodapé e o Google passa a ligar a página ao site. Não use as páginas "Digital Look" de números 100025026201042 e 163781148286, que não são da loja.
- [ ] **Catálogo trinta.shop (confirmar):** https://trinta.shop/oticadigitallook traz o endereço "Rua Professor Sud Menucci, 228, centro, Rinópolis SP / Santópolis do Aguapeí SP", com pedidos pelo WhatsApp. Ele está ativo? Usa o WhatsApp (18) 99763-7896? Se sim, o responsável técnico pode colocar um link "ver catálogo" no site. Se não, desative o catálogo para não confundir os clientes nem o Google.
- [ ] **Santópolis do Aguapeí (confirmar):** a loja atende ou entrega em Santópolis do Aguapeí, ou tem uma segunda loja lá? Se sim, avise: hoje o site informa ao Google que a loja atende Rinópolis.
- [ ] **Comarca (confirmar com o advogado):** há indícios de que Rinópolis pertence à Comarca de Tupã/SP. Os Termos de Uso citam hoje só "o foro do domicílio do consumidor"; o advogado decide se acrescenta a comarca.
- **Homônimo:** a Ótica Visão Rinópolis fica na mesma rua (R. Prof. Sud Menucci, 185, telefone (18) 3583-1358). Cuidado para não confundir os perfis no Google e em diretórios de empresas.

### Já confirmado: manter igual em todo lugar

**R. Prof. Sud Menucci, 228 – Centro, Rinópolis – SP, 17740-000 · WhatsApp (18) 99763-7896 · telefone (18) 3583-1566 · Instagram @digitallookbr**

Use exatamente a mesma grafia no site, no Google, no Instagram e no Facebook: isso ajuda o Google a confiar nos dados. Coloque o link do site na bio do Instagram e na página do Facebook.

### Recomendado (deixa o site mais completo)

- [ ] **Marcas que a loja revende** (informações → listas). Só os nomes, em texto, sem logotipos.
- [ ] **Ano de fundação e história** (página inicial → anos de história; sobre e equipe → história e linha do tempo). Só fatos reais. A data de abertura aparece no cartão CNPJ e na "Transparência da página" do Facebook.
- [ ] **Fotos reais das armações** (armações). Hoje a vitrine mostra as fotos gerais da loja, por tipo de armação. Você pode cadastrar modelos com foto, marca e preço (opcional).
- [ ] **Fotos que faltam** (fotos e galeria): capa de lentes de contato e card "lentes de contato"; no blog, os artigos sem imagem. Sem foto, aparece a arte da marca.
- [ ] **Link do Perfil da Empresa no Google** (informações), depois de criar o perfil ([seção 7](#71-perfil-da-empresa-no-google-o-mais-importante)). Ativa o link "avaliações no Google" na página inicial.
- [ ] **Medição digital:** a loja tem equipamento de medição digital (centragem e altura)? Qual? Se tiver, dá para citar na página inicial (selos ou destaques da capa), por exemplo "centragem medida digitalmente — não é exame de vista". Não use números que não possam ser comprovados, como "0,1 mm" ou "100%".
- [ ] **Serviços e promessas:** prazo de entrega das lentes, laboratório parceiro, garantia além da legal, ajuste e limpeza grátis (inclusive de óculos comprados em outro lugar). Só publique o que a loja cumpre sempre. Garantia extra só com termo escrito entregue na compra (Código de Defesa do Consumidor, art. 50). Se a loja faz ajuste e limpeza grátis, uma sugestão de texto: "Ajustamos hastes e plaquetas e limpamos seus óculos sem custo, mesmo que não tenham sido comprados aqui. Peças de reposição são cobradas à parte."
- [ ] **Lentes de contato:** confirme que a loja vende lentes de contato, sempre com receita de oftalmologista (a página `/lentes` já diz isso).

### Opcional

- [ ] **Convênios** (informações → listas). Só parceiros com acordo por escrito e autorização para usar o nome. Guarde os dois documentos.
- [ ] **Equipe** (sobre e equipe). Só pessoas reais, com autorização escrita de uso de imagem. O cargo "óptico" só para quem tem a habilitação.
- [ ] **Promoções e eventos.** Sempre com validade e condições. Em eventos, nada de exame, triagem ou medição de pressão ocular.
- [ ] **Depoimentos.** Só reais, com autorização por escrito. Prefira o primeiro nome e a inicial (ex.: Ana P.) e não cite o problema de visão da pessoa.

### Com o contador ou o advogado

- [ ] **Prazos de guarda:** por quanto tempo guardar receitas de vendas, conversas de orçamento e documentos fiscais. A Política de Privacidade usa como exemplo 90 dias (orçamento que não virou venda) e 5 anos (vendas e documentos fiscais). Se os prazos forem outros, avise para o texto ser ajustado.
- [ ] **Registros de acesso ao site** (Marco Civil da Internet, art. 15): decidir se a loja precisa guardá-los ([seção 8](#organização)).

## 5. Publicar as alterações no Google

São duas coisas diferentes:

- **Para quem visita o site**, o que você salva no painel aparece sozinho, em geral em 1 a 2 minutos. Não precisa fazer nada.
- **Para o Google**, o site tem páginas prontas (que o Google lê), o mapa do site (sitemap) e os dados da loja. Eles só são refeitos quando o site é **publicado** de novo.

Como publicar:

1. Termine as alterações e espere aparecer **"salvo"** no topo do painel.
2. Toque em **"publicar alterações no Google"**, ao lado do "salvo".
3. Em 1 a 3 minutos, o painel mostra "publicado em dd/mm às hh:mm".

**Quando publicar:** depois de um conjunto de mudanças importantes, como horário, telefone, endereço, artigo novo, promoção ou evento novo e foto da capa. Não precisa publicar a cada vírgula: o painel avisa quando "há alterações ainda não publicadas no Google". Se a republicação diária estiver ligada, o site também é publicado sozinho uma vez por dia, e assim promoções e eventos vencidos saem do Google.

**Se o botão não aparecer**, a publicação automática ainda não foi ligada na hospedagem. Peça ao responsável técnico para ligá-la (ou, enquanto isso, para fazer um "Redeploy" na Vercel quando você precisar publicar).

**Artigo novo no blog:** os visitantes já conseguem abri-lo, mas o Google só o encontra depois da publicação. Artigos com pouco texto (menos de uns 300 caracteres) ficam fora do Google até ganharem texto.

## 6. Backup todo mês

**Por quê:** se alguém apagar algo por engano, se a conta for invadida ou se o site mudar de hospedagem, o backup devolve todo o conteúdo.

**Passo a passo** (uma vez por mês; crie um lembrete no celular para todo dia 1º):

1. No painel, abra **configurações → backup dos dados → exportar backup**.
2. O navegador baixa um arquivo chamado `digital-look-backup-AAAA-MM-DD.json`.
3. Guarde o arquivo em **dois lugares seus**, por exemplo no computador da loja e no Google Drive ou num pen drive.
4. O painel mostra há quantos dias foi o último backup feito naquele aparelho e avisa quando passar de 30 dias.

**Bom saber:**

- O arquivo guarda os textos e os endereços das fotos. As fotos continuam na hospedagem, então guarde também, numa pasta, as fotos originais que você enviou.
- **importar backup** (na mesma tela) troca o conteúdo atual pelo do arquivo. A versão anterior continua no histórico.
- **histórico de versões** (configurações): cada salvamento vira uma versão. O painel guarda as 300 mais recentes e todas as dos últimos 30 dias. Toque em "restaurar" para voltar o site a uma versão anterior.
- Mantenha só os backups dos últimos meses (por exemplo, 6) e apague os mais antigos: eles podem ter dados de pessoas que pediram para sair do site.

## 7. Google: Perfil da Empresa, Search Console e sitemap

### 7.1 Perfil da Empresa no Google (o mais importante)

É o que faz a loja aparecer no mapa e na busca por "ótica em Rinópolis".

1. Acesse **google.com/business** com uma conta Google da loja.
2. Procure "Ótica Digital Look". Se o perfil já existir, reivindique-o ("sou o proprietário"); se não existir, crie.
3. Preencha **igual ao site**:
   - nome: Ótica Digital Look;
   - endereço: R. Prof. Sud Menucci, 228 – Centro, Rinópolis – SP, 17740-000;
   - categoria principal: Ótica;
   - telefone principal: (18) 3583-1566 (o mesmo que o site informa ao Google) e o WhatsApp (18) 99763-7896 como contato adicional;
   - site: https://otica-rinopolis.vercel.app;
   - horário e fotos da fachada, do balcão e das vitrines.
4. Faça a verificação que o Google pedir (vídeo, ligação, carta ou outra forma).
5. Com o perfil verificado, toque em **compartilhar**, copie o link e cole no painel em **informações → Perfil da Empresa no Google**. Depois publique ([seção 5](#5-publicar-as-alterações-no-google)).
6. Peça avaliações aos clientes satisfeitos e responda a todas. Não ofereça desconto ou brinde em troca de avaliação (o Google proíbe) e nunca publique avaliações falsas.

Cuidado para não confundir com a Ótica Visão Rinópolis, no nº 185 da mesma rua.

### 7.2 Google Search Console (acompanhar o site na busca)

1. Acesse **search.google.com/search-console** com a mesma conta Google.
2. Toque em "adicionar propriedade", escolha **"prefixo do URL"** e digite `https://otica-rinopolis.vercel.app`.
3. Verificação: escolha **"arquivo HTML"**. O Google fornece um arquivo (`google….html`). Envie-o ao responsável técnico, que o coloca no site e publica; depois toque em "verificar". Com domínio próprio, a verificação pode ser feita pelo domínio ([seção 11](#11-domínio-próprio-opcional)).
4. No menu **Sitemaps**, digite `sitemap.xml` e toque em **enviar**.
5. Em **Inspeção de URL**, cole o endereço da página inicial e toque em **solicitar indexação**.
6. Uma vez por mês, veja "Desempenho" (como as pessoas encontram o site) e se há avisos de erro.

O site pode levar de alguns dias a algumas semanas para aparecer bem na busca. O Perfil da Empresa costuma trazer resultado mais rápido.

## 8. Privacidade no dia a dia (LGPD na prática)

O site é só uma parte: a maioria dos dados dos clientes passa pelo WhatsApp e pelo balcão. As sugestões abaixo são práticas comuns; **confirme com o advogado** antes de adotá-las como regra da loja.

### WhatsApp e receitas

- Use o **WhatsApp Business num aparelho da loja**, não no celular pessoal de funcionários, com bloqueio de tela por senha e **confirmação em duas etapas** ligada (WhatsApp → Configurações → Conta → Confirmação em duas etapas).
- No WhatsApp Web, saia ao fim do dia se o computador for compartilhado.
- **Não encaminhe receitas** para grupos nem para celulares pessoais. Para o laboratório, use só o canal combinado com ele.
- **Apague as fotos de receita de orçamentos que não viraram venda em até 90 dias**: é o prazo que a Política de Privacidade promete.
- Receitas de vendas feitas e documentos fiscais: guarde pelo prazo definido com o contador (a política usa 5 anos como exemplo) e depois descarte com segurança (papel picado, arquivos apagados).
- Receita de criança: trate com o pai, a mãe ou o responsável.

### Pessoas no site e nas redes

- Foto de funcionário e depoimento de cliente só com **autorização por escrito** (modelo no [anexo](#anexo-modelo-de-autorização-de-uso-de-imagem-e-depoimento)). Guarde as autorizações.
- Nunca publique, no site ou no Instagram, receita, documento ou foto de cliente sem autorização. De criança, só com autorização dos responsáveis.

### Pedidos dos clientes sobre os próprios dados

- Podem chegar pelo WhatsApp, telefone, e-mail ou na loja. A Política de Privacidade promete **resposta em até 15 dias**.
- Confirme que é a própria pessoa (mesmo número de WhatsApp, ou documento na loja).
- Veja onde estão os dados dela (conversas, fotos de receita, fichas, sistema da loja) e faça o que foi pedido: mostrar, corrigir ou apagar, exceto o que a lei manda guardar (como notas fiscais).
- Anote o pedido, a data e a resposta.
- A página de acessibilidade também convida as pessoas a relatarem dificuldades para usar o site: responda da mesma forma.

### Retirar alguém do site de vez

Por exemplo, um funcionário que saiu ou um cliente que retirou o depoimento:

1. No painel, remova a pessoa (sobre e equipe) ou o depoimento.
2. Em **configurações → privacidade e limpeza**, toque em **apagar histórico e fotos antigas**. Isso apaga as versões antigas do histórico e as fotos que não aparecem mais no site, e não dá para desfazer. Fotos enviadas na última hora ficam guardadas; se for o caso, repita mais tarde. Exporte um backup novo logo depois.
3. Publique as alterações no Google ([seção 5](#5-publicar-as-alterações-no-google)).
4. Apague os backups antigos (arquivos `.json`) que ainda tenham a pessoa.

O Google pode levar alguns dias para atualizar o que mostra na busca.

### Organização

- **Registro das operações de tratamento** (LGPD, art. 37): uma planilha simples dizendo quais dados a loja guarda, para quê, onde, quem acessa e por quanto tempo. A ANPD tem um modelo simplificado para pequenas empresas (gov.br/anpd). Preencha com o advogado.
- **Registros de acesso ao site:** o Marco Civil da Internet (art. 15) obriga certos sites com fins comerciais a guardar por 6 meses os registros de acesso. Hoje o site depende dos registros da hospedagem, guardados por pouco tempo. Decida com o advogado se a loja precisa guardá-los e como.
- **Quem trata dados para a loja** (laboratório, contador, desenvolvedor e hospedagem): peça cláusula de sigilo e de segurança no contrato.
- **Incidente** (celular da loja roubado, WhatsApp clonado, senha do painel vazada): troque as senhas, use "sair de todos os aparelhos" no painel, avise o responsável técnico e fale com o advogado no mesmo dia. Se houver risco para os clientes, a lei manda comunicar a ANPD e as pessoas afetadas em poucos dias úteis.

## 9. Páginas legais: revisão por advogado antes de divulgar

O site tem **Política de Privacidade**, **Termos de Uso** e **Acessibilidade**, com links no rodapé. Elas foram escritas em linguagem simples, com base na LGPD, no Código de Defesa do Consumidor e nas normas da ANPD.

- Os dados da empresa entram sozinhos, a partir do painel. Enquanto razão social, CNPJ e e-mail estiverem vazios, as páginas mostram só o nome fantasia e o endereço. Por isso, preencha esses dados antes de divulgar o site.
- Os textos ficam no código do site e **não podem ser editados pelo painel**, para não serem apagados por engano. Para mudar, peça ao responsável técnico, que também atualiza a data de "última atualização".
- **Antes de divulgar o site, peça a um advogado para revisar as três páginas.** Os textos foram preparados com cuidado, mas não substituem uma orientação jurídica feita para a realidade da loja. Pontos para o advogado olhar:
  - prazos de guarda (90 dias e 5 anos são exemplos) e se eles batem com o que o contador orienta;
  - bases legais para a receita: consentimento ao enviar a foto para orçamento e obrigação legal depois da venda;
  - lista de com quem os dados são compartilhados (laboratório, contador, meios de pagamento, convênios) e se é preciso dar nomes;
  - transferência internacional para a hospedagem (Vercel, nos Estados Unidos): a política se apoia nas garantias do contrato com o fornecedor (LGPD, art. 33, II). Conferir se o contrato da Vercel atende à Resolução CD/ANPD nº 19/2024 (cláusulas-padrão da ANPD) ou se é preciso outro mecanismo;
  - prazo de resposta aos pedidos dos clientes (15 dias);
  - crediário com consulta a SPC ou Serasa e envio de promoções por WhatsApp, se a loja fizer;
  - Termos de Uso: foro (hoje, o do domicílio do consumidor, conforme o CDC, art. 101, I; a comarca pode ser acrescentada), direito de arrependimento em lentes feitas sob medida e vendidas à distância, e garantia contratual (termo escrito);
  - guarda de registros de acesso (Marco Civil, art. 15).
- Revise de novo quando a loja mudar algo importante: começar a vender no crediário, trocar de laboratório, enviar promoções por WhatsApp ou incluir um serviço novo no site.

## 10. Hospedagem: contas, plano e custos

**Onde o site fica:**

- **Vercel** (vercel.com): hospeda o site e guarda o conteúdo e as fotos do painel (no "Blob Store", o armazenamento). Projeto `otica-rinopolis`.
- **GitHub** (github.com): guarda o código e o histórico de mudanças. Repositório `Corrar/otica-rinopolis`. Cada mudança de código publicada na versão principal atualiza o site sozinha.

Hoje as duas contas são do desenvolvedor: a equipe `corrars-projects` na Vercel e a conta `Corrar` no GitHub.

**Decisões a tomar com o desenvolvedor:**

1. **De quem são as contas.** Há duas opções:
   - transferir o projeto da Vercel e o repositório do GitHub para contas no nome da loja, criadas com um e-mail da loja e com confirmação em duas etapas. A loja passa a ser a dona e convida o desenvolvedor quando precisar; ou
   - deixar com o desenvolvedor, com um **contrato escrito de prestação de serviço**. Pela LGPD (art. 39), quem cuida do site para a loja é um "operador" de dados, e o contrato deve prever: seguir as instruções da loja, sigilo, segurança, aviso imediato de incidente e devolução ou eliminação dos dados no fim do contrato.
2. **Plano da Vercel.** O plano gratuito (Hobby) é, pelas regras da Vercel, **só para uso pessoal e não comercial**. O site de uma loja é uso comercial, então o adequado é o plano **Pro**, que é pago (cerca de US$ 20 por mês por usuário; confira o valor atual em vercel.com/pricing). Confirme com o desenvolvedor em qual plano o projeto está hoje.
3. **Repositório privado.** Hoje o repositório do GitHub é público. A recomendação é torná-lo privado, porque o histórico guarda versões antigas do projeto.
4. **Armazenamento em São Paulo.** Se um novo armazenamento for criado (por exemplo, na transferência para a conta da loja), escolha a região São Paulo (gru1), mais perto dos clientes. A região não pode ser mudada depois.
5. **Alerta de gastos.** Na Vercel (Billing), ligue um alerta de uso para não ter surpresas.

**Custos previstos:** o plano da hospedagem (Pro) e, se você quiser, o domínio próprio ([seção 11](#11-domínio-próprio-opcional)). O site não usa outros serviços pagos.

## 11. Domínio próprio (opcional)

Hoje o endereço é `otica-rinopolis.vercel.app`: é gratuito e funciona normalmente. Um domínio próprio, como `oticadigitallook.com.br` (verificar se está disponível), passa mais confiança e é mais fácil de divulgar.

- O registro é feito em **registro.br**, com CNPJ ou CPF, e custa cerca de R$ 40 por ano (confira o valor). Deixe a renovação automática ligada para não perder o endereço.
- Depois, o responsável técnico liga o domínio na Vercel, publica o site de novo (o endereço que o site informa ao Google muda junto), redireciona o endereço antigo para o novo e atualiza o Search Console e o sitemap.
- Você troca o link no Perfil da Empresa no Google, no Instagram e no Facebook.
- Com o domínio, dá para ter um e-mail como `contato@oticadigitallook.com.br`, bom para o canal de privacidade.

## 12. Quando chamar o responsável técnico

- Mudar textos que não estão no painel (páginas legais, rodapé, títulos das páginas) ou o visual do site.
- Incluir algo que o painel não tem (link do catálogo, horário de almoço, página nova).
- O painel mostra "Configuração pendente", "armazenamento não configurado" ou "não salvou" por mais de um dia.
- Esqueceu a senha ou suspeita de invasão.
- Ligar a publicação automática, colocar o domínio próprio, transferir as contas ou verificar o site no Search Console.

---

## Anexo: modelo de autorização de uso de imagem e depoimento

Modelo simples, **para o advogado revisar antes de usar**:

> **AUTORIZAÇÃO DE USO DE IMAGEM, NOME E DEPOIMENTO**
>
> Eu, ______________________________________, CPF ____________________, autorizo ______________________________________ (razão social), nome fantasia Ótica Digital Look, CNPJ ____________________, a usar gratuitamente:
>
> ( ) a minha imagem (foto)  ( ) o meu nome  ( ) o meu depoimento abaixo
>
> no site da ótica e nas redes sociais dela (Instagram e Facebook), para divulgar a loja.
>
> Como quero ser identificado(a): ( ) nome completo  ( ) primeiro nome e inicial do sobrenome  ( ) sem nome
>
> Depoimento: ____________________________________________________________
>
> Sei que posso retirar esta autorização a qualquer momento, pelo WhatsApp, por e-mail ou na loja. Nesse caso, o conteúdo será retirado do site e das redes sociais em até ____ dias, sem afetar o uso feito antes.
>
> Rinópolis/SP, ____/____/________
>
> Assinatura: ______________________________________
>
> (Se for criança ou adolescente, assina o pai, a mãe ou o responsável legal, com nome e CPF.)
