// Política de Privacidade (LGPD). Texto fixo no código: não é editável pelo painel, para não ser apagado por engano.
// Os dados da empresa (razão social, CNPJ, e-mail, endereço e telefones) vêm das informações da loja.
// Ao mudar o texto, atualize ATUALIZADA; as versões anteriores ficam no histórico do Git.
import { L } from '../components/Layout.jsx';
import { Canais, Destaques, Empresa, Fechamento, nomeEmpresa, PaginaLegal, Secao, Sub, Tabela } from '../components/Legal.jsx';
import { useSite } from '../state/content.jsx';

export const ATUALIZADA = '30/10/2026';

// Prazos de guarda: exemplos razoáveis, a ajustar com o contador ou o advogado da loja.
const RETENCAO = [
  ['Registros técnicos de acesso ao site (IP, data, hora, página e navegador)', 'pelo prazo padrão do provedor de hospedagem, em geral de poucos dias'],
  ['Mensagens e fotos de receita de orçamentos que não viraram compra', 'por até 90 dias depois do último contato'],
  ['Receitas de compras feitas, dados da venda e documentos fiscais', 'por até 5 anos depois da compra'],
  ['Nomes, fotos da equipe e depoimentos publicados no site', 'até a pessoa revogar a autorização'],
  ['IP de quem erra a senha da área do proprietário', 'por até 1 hora, só na memória do servidor'],
  ['Cookie de sessão da área do proprietário', '12 horas, ou 14 dias com a opção "manter conectado"'],
  ['Cópia do conteúdo público do site no seu navegador', 'até você limpar os dados do navegador'],
];

const SECOES = [
  ['em-poucas-palavras', 'em poucas palavras'],
  ['controlador', 'quem cuida dos seus dados'],
  ['abrangencia', 'quando esta política vale'],
  ['dados', 'quais dados tratamos'],
  ['finalidades', 'para que usamos'],
  ['compartilhamento', 'com quem compartilhamos'],
  ['internacional', 'transferência internacional'],
  ['retencao', 'por quanto tempo guardamos'],
  ['cookies', 'cookies e armazenamento'],
  ['criancas', 'crianças e adolescentes'],
  ['direitos', 'seus direitos'],
  ['seguranca', 'segurança e incidentes'],
  ['automatizadas', 'decisões automatizadas'],
  ['terceiros', 'links de outros serviços'],
  ['alteracoes', 'alterações'],
];

export default function Privacidade() {
  const site = useSite();
  const { emp, wa } = site;
  const nome = nomeEmpresa(emp);
  return (
    <PaginaLegal rotulo="Política de Privacidade" eyebrow="privacidade · LGPD" a="política de" b="privacidade." data={ATUALIZADA} secoes={SECOES}
      resumo="Como a Ótica Digital Look cuida dos dados pessoais de quem visita este site e fala com a loja pelo WhatsApp, pelo telefone ou no balcão — em linguagem simples, conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018, a LGPD).">

      <Destaques itens={[
        'Este site não tem cadastro, não faz vendas e não usa ferramentas de análise de público, pixels de anúncio nem cookies de rastreamento.',
        'O formulário de contato não grava nada: ele só abre o WhatsApp com a sua mensagem pronta, e você decide se envia.',
        'A foto da receita é um dado de saúde. Ela é usada só para o seu orçamento e, se você comprar, para fazer as suas lentes.',
        'O mapa do Google só é carregado se você tocar em "mostrar mapa".',
        'Você pode pedir acesso, correção ou exclusão dos seus dados a qualquer momento pelos nossos canais de atendimento.',
      ]} />

      <Secao id="controlador" n="01" titulo="quem cuida dos seus dados">
        <p>A responsável pelas decisões sobre os seus dados pessoais (a <strong>controladora</strong>, nos termos da LGPD) é a {nome}:</p>
        <Empresa site={site} />
        <p>Somos um <strong>agente de tratamento de pequeno porte</strong> (Resolução CD/ANPD nº 2/2022). Por isso, não somos obrigados a indicar um encarregado de dados (DPO), mas mantemos um canal direto para você falar sobre os seus dados — veja a seção <a href="#direitos">seus direitos</a>.</p>
      </Secao>

      <Secao id="abrangencia" n="02" titulo="quando esta política vale">
        <p>Esta política vale para:</p>
        <ul>
          <li>este site, inclusive o formulário de contato e os botões que abrem o WhatsApp;</li>
          <li>as conversas com a loja pelo WhatsApp, pelo telefone e pelo Instagram;</li>
          <li>o atendimento na loja, no que diz respeito às receitas e aos dados das compras.</li>
        </ul>
      </Secao>

      <Secao id="dados" n="03" titulo="quais dados tratamos e de onde eles vêm">
        <Sub>quando você navega pelo site</Sub>
        <p>Como em qualquer site, o servidor recebe automaticamente alguns dados técnicos de cada acesso: <strong>endereço IP, data e hora, página visitada, página de origem e tipo de navegador e de aparelho</strong>. Esses registros são gerados pelo provedor de hospedagem (Vercel) e servem para manter o site funcionando e seguro. Não usamos esses dados para identificar você nem para fazer anúncios. O site não tem cadastro de visitantes, ferramentas de análise de público (como o Google Analytics) nem pixels de redes sociais. As fontes e as imagens são carregadas do próprio site.</p>

        <Sub>no formulário de contato e nos botões do WhatsApp</Sub>
        <p>O formulário da página de <L to="contato">contato</L> pede o seu nome, o assunto e uma mensagem. <strong>Esses dados não são enviados nem gravados pelo site</strong>: ao tocar no botão, o seu próprio aparelho abre o WhatsApp (serviço da Meta) com o texto pronto, e você decide se envia. O mesmo acontece com os botões "falar no WhatsApp", "enviar receita" e "consultar" — este último inclui na mensagem o nome do modelo de armação que você estava vendo.</p>
        <p>Quando você envia a mensagem, recebemos o que você escreveu e o que o próprio WhatsApp mostra, como o seu número de telefone e o nome e a foto do seu perfil.</p>

        <Sub>na foto da receita</Sub>
        <p>Para fazer um orçamento de lentes, você pode nos enviar a foto da receita do seu oftalmologista. A receita traz o nome do paciente, o grau e outras medidas dos olhos, a data e o nome e o registro (CRM) do médico. Informações sobre a saúde dos olhos são <strong>dados pessoais sensíveis</strong> (LGPD, art. 5º, II) e recebem cuidado reforçado: usamos a receita só para preparar o orçamento e, se você comprar, para fazer e conferir as suas lentes.</p>

        <Sub>no telefone, no Instagram e na loja</Sub>
        <p>Se você ligar, mandar mensagem pelo Instagram ou for à loja, usamos os dados que você nos passar para atender o seu pedido. Na compra, registramos o necessário para a venda, a nota fiscal, a garantia e o pedido das lentes ao laboratório — por exemplo, nome, telefone, produtos comprados, receita e, quando você pedir na nota ou a lei exigir, o CPF.</p>

        <Sub>de pessoas que aparecem no site</Sub>
        <p>Nomes e fotos da equipe e depoimentos de clientes só são publicados com <strong>autorização por escrito</strong> da pessoa, que pode ser revogada a qualquer momento. Nos depoimentos, não informamos o problema de visão de ninguém.</p>
      </Secao>

      <Secao id="finalidades" n="04" titulo="para que usamos e com qual base legal">
        <p>Só tratamos dados com uma finalidade definida e com uma das bases previstas na LGPD:</p>
        <Tabela legenda="Finalidades e bases legais" cab={['para quê', 'quais dados', 'base legal']} linhas={[
          ['Responder às suas mensagens e preparar orçamentos', 'nome, telefone, mensagem, produto de interesse', 'procedimentos preliminares a um contrato, a seu pedido (art. 7º, V)'],
          ['Usar a receita no orçamento', 'foto e dados da receita', 'seu consentimento específico e destacado, dado ao enviar a receita depois do aviso (art. 11, I)'],
          ['Fazer as lentes, conferir a receita e guardar o registro da venda', 'receita e dados da compra', 'obrigação legal ou regulatória (art. 11, II, "a") e exercício regular de direitos, como garantia e defesa em processos (art. 11, II, "d")'],
          ['Vender, entregar e dar garantia aos produtos', 'nome, telefone, produtos comprados', 'execução do contrato de compra (art. 7º, V)'],
          ['Emitir nota fiscal e cumprir obrigações fiscais e do consumidor', 'dados da compra e, quando exigido, CPF', 'cumprimento de obrigação legal (art. 7º, II)'],
          ['Manter o site no ar e seguro e evitar fraudes e invasões', 'registros técnicos de acesso e IP', 'legítimo interesse, limitado ao necessário (art. 7º, IX)'],
          ['Publicar fotos da equipe e depoimentos', 'nome, foto e texto do depoimento', 'consentimento, revogável a qualquer momento (art. 7º, I)'],
          ['Enviar novidades e promoções, se você pedir', 'nome e telefone', 'consentimento, que você pode retirar quando quiser (art. 7º, I)'],
        ]} />
        <p>Não vendemos, alugamos nem cedemos os seus dados, e não os usamos para finalidades diferentes das descritas aqui.</p>
      </Secao>

      <Secao id="compartilhamento" n="05" titulo="com quem compartilhamos">
        <p>Os seus dados só são compartilhados com quem nos ajuda a prestar o serviço, com quem você mesmo escolheu usar ou quando a lei exige:</p>
        <ul>
          <li><strong>Vercel Inc.</strong> (Estados Unidos): hospedagem do site, rede de entrega de conteúdo e armazenamento do conteúdo e das fotos publicadas. Recebe os registros técnicos de acesso.</li>
          <li><strong>Meta</strong> (WhatsApp, Instagram e Facebook): quando você escolhe falar com a gente por esses canais. As mensagens seguem também as regras e a política de privacidade da Meta.</li>
          <li><strong>Google</strong> (Google Maps): só se você tocar em "mostrar mapa", "abrir no Google Maps" ou "como chegar".</li>
          <li><strong>Laboratório óptico</strong>: recebe os dados da receita e as medidas necessárias para fabricar as suas lentes.</li>
          <li><strong>Meios de pagamento</strong> (operadoras de cartão, bancos e Pix): processam o pagamento que você escolher.</li>
          <li><strong>Contabilidade</strong>: para a escrituração fiscal das vendas.</li>
          <li><strong>Convênio ou empresa parceira</strong>: se você comprar por meio deles, apenas os dados necessários para a cobrança.</li>
          <li><strong>Autoridades públicas</strong>: quando houver obrigação legal ou ordem judicial.</li>
        </ul>
        <p>Pedimos a quem recebe os dados que use só o necessário para a finalidade combinada.</p>
      </Secao>

      <Secao id="internacional" n="06" titulo="transferência internacional">
        <p>Alguns desses serviços guardam ou processam dados fora do Brasil, principalmente nos Estados Unidos:</p>
        <ul>
          <li><strong>Vercel Inc.</strong>, a empresa de hospedagem: as funções do site rodam em São Paulo, mas a empresa e parte da infraestrutura (como a rede de entrega de conteúdo) ficam no exterior;</li>
          <li><strong>Meta</strong>, quando você usa o WhatsApp, o Instagram ou o Facebook;</li>
          <li><strong>Google</strong>, somente depois que você toca para abrir o mapa.</li>
        </ul>
        <p>Essas transferências seguem o art. 33 da LGPD e a Resolução CD/ANPD nº 19/2024. Na hospedagem, elas se apoiam nas garantias de proteção de dados do contrato com o fornecedor (art. 33, II). Quando você escolhe falar pelo WhatsApp ou pelo Instagram, ou abrir o mapa, a transferência é necessária para atender ao seu próprio pedido (art. 33, IX).</p>
      </Secao>

      <Secao id="retencao" n="07" titulo="por quanto tempo guardamos">
        <p>Guardamos os dados só pelo tempo necessário para cada finalidade:</p>
        <Tabela legenda="Prazos de guarda" cab={['dado', 'prazo']} linhas={RETENCAO} />
        <p>Depois desses prazos, os dados são apagados ou anonimizados. Podemos guardá-los por mais tempo apenas quando a lei exigir ou para a defesa de direitos em processo (LGPD, art. 16). Quando alguém revoga a autorização de uso de imagem ou de depoimento, retiramos o conteúdo do site e apagamos as cópias guardadas no histórico do painel.</p>
      </Secao>

      <Secao id="cookies" n="08" titulo="cookies e armazenamento no navegador">
        <p>Este site <strong>não usa cookies de publicidade, de análise de público ou de redes sociais</strong> — por isso, não mostra aviso de cookies. Nenhum serviço de terceiros é carregado sem que você toque nele. O que existe é:</p>
        <Tabela legenda="Cookies e armazenamento local" cab={['nome', 'tipo', 'para que serve', 'duração']} linhas={[
          [<><code>__Host-odl_session</code> (ou <code>odl_session</code>, sem HTTPS)</>, 'cookie estritamente necessário, só na área do proprietário', 'mantém a loja conectada ao painel de edição; visitantes não recebem este cookie', '12 horas, ou 14 dias com "manter conectado"'],
          [<code>odl-cache-v1</code>, 'armazenamento local do navegador (localStorage)', 'guarda uma cópia do conteúdo público do site (textos e endereços das fotos) para as páginas abrirem mais rápido; não contém dados pessoais', 'até você limpar os dados do navegador'],
          ['cookies do Google', 'de terceiros, só depois de você tocar em "mostrar mapa"', 'exibir o mapa; o Google pode registrar o seu IP e usar cookies próprios, conforme a política de privacidade dele', 'definida pelo Google'],
        ]} />
        <p>Você pode apagar os cookies e o armazenamento local nas configurações do seu navegador a qualquer momento; o site continua funcionando normalmente.</p>
      </Secao>

      <Secao id="criancas" n="09" titulo="crianças e adolescentes">
        <p>O site não é dirigido a crianças. Mas é comum que pais e responsáveis cuidem com a gente dos óculos e das receitas dos filhos. Nesses casos:</p>
        <ul>
          <li>os dados da criança ou do adolescente, inclusive a receita, devem ser enviados pelo <strong>pai, mãe ou responsável legal</strong>;</li>
          <li>eles são usados só para o orçamento e a compra, sempre no melhor interesse da criança (LGPD, art. 14, e Enunciado CD/ANPD nº 1/2023);</li>
          <li>não publicamos fotos de crianças sem autorização por escrito dos responsáveis.</li>
        </ul>
      </Secao>

      <Secao id="direitos" n="10" titulo="seus direitos e como exercê-los">
        <p>A LGPD (art. 18) garante a você, a qualquer momento e sem custo:</p>
        <ul>
          <li>confirmar se tratamos dados seus e ter acesso a eles;</li>
          <li>corrigir dados incompletos, inexatos ou desatualizados;</li>
          <li>pedir a anonimização, o bloqueio ou a eliminação de dados desnecessários, excessivos ou tratados em desacordo com a lei;</li>
          <li>pedir a portabilidade dos seus dados a outro fornecedor, conforme a regulamentação da ANPD;</li>
          <li>pedir a eliminação dos dados tratados com o seu consentimento, exceto os que a lei manda guardar;</li>
          <li>saber com quem compartilhamos os seus dados;</li>
          <li>saber que pode não dar o consentimento e o que acontece nesse caso — por exemplo, sem a receita não conseguimos orçar as lentes;</li>
          <li>revogar o consentimento quando quiser (art. 8º, § 5º), sem afetar o que já foi feito antes;</li>
          <li>opor-se a um tratamento feito sem consentimento, se ele não cumprir a lei (art. 18, § 2º).</li>
        </ul>
        <p>Para exercer qualquer desses direitos, ou tirar dúvidas sobre esta política, fale com a gente:</p>
        <Canais site={site} msg="Olá! Quero falar sobre os meus dados pessoais (LGPD)." />
        <p>Para proteger os seus dados, podemos pedir que você confirme a sua identidade — por exemplo, escrevendo do mesmo número de WhatsApp usado na conversa ou mostrando um documento na loja. Respondemos em até 15 dias (LGPD, art. 19). A lei permite que agentes de pequeno porte usem prazo em dobro (Resolução CD/ANPD nº 2/2022), mas o nosso objetivo é responder bem antes.</p>
        <p>Se achar que o seu pedido não foi atendido, você pode apresentar petição à Autoridade Nacional de Proteção de Dados (ANPD), pelo site <a href="https://www.gov.br/anpd" target="_blank" rel="noopener">gov.br/anpd</a> (art. 18, § 1º), e procurar os órgãos de defesa do consumidor, como o Procon.</p>
      </Secao>

      <Secao id="seguranca" n="11" titulo="segurança e incidentes">
        <p>Adotamos medidas técnicas e administrativas para proteger os seus dados (LGPD, art. 46). Entre elas:</p>
        <ul>
          <li>o site usa conexão segura (HTTPS);</li>
          <li>a área do proprietário é protegida por senha, com limite de tentativas — para isso, o IP de quem erra a senha fica guardado por pouco tempo na memória do servidor;</li>
          <li>o acesso às conversas e às receitas fica restrito a quem precisa delas para atender você.</li>
        </ul>
        <p>Nenhum sistema é totalmente imune a falhas. Se acontecer um incidente de segurança que possa trazer risco ou dano relevante a você, avisaremos você e a ANPD, conforme o art. 48 da LGPD e a Resolução CD/ANPD nº 15/2024.</p>
      </Secao>

      <Secao id="automatizadas" n="12" titulo="decisões automatizadas">
        <p>Não tomamos decisões baseadas só em tratamento automatizado de dados — como perfis de consumo ou pontuação de crédito — que afetem os seus interesses (LGPD, art. 20).</p>
      </Secao>

      <Secao id="terceiros" n="13" titulo="links de outros serviços">
        <p>O site tem links e botões para o WhatsApp, o Instagram, o Facebook e o Google Maps. Ao abri-los, você passa a usar serviços de outras empresas, com regras e políticas de privacidade próprias, que recomendamos ler. Elas são controladoras dos dados que tratam para os seus próprios fins.</p>
      </Secao>

      <Secao id="alteracoes" n="14" titulo="alterações desta política">
        <p>Podemos atualizar esta política para acompanhar mudanças no site, na loja ou na lei. A data da última atualização fica no topo da página e, se a mudança for relevante, avisaremos com destaque no site. As versões anteriores ficam guardadas e podem ser pedidas pelos nossos canais.</p>
        <p>Veja também os <L to="termos-de-uso">Termos de Uso</L> e a página de <L to="acessibilidade">acessibilidade</L>.</p>
      </Secao>

      <Fechamento titulo="dúvidas sobre os seus dados?" texto="Fale com a gente pelo WhatsApp — respondemos em horário comercial." href={wa.msg('Olá! Quero falar sobre os meus dados pessoais (LGPD).')} />
    </PaginaLegal>
  );
}
