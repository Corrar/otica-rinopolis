// Termos de Uso. Texto fixo no código: não é editável pelo painel, para não ser apagado por engano.
// Os dados do fornecedor (razão social, CNPJ, e-mail, endereço e telefones) vêm das informações da loja.
// Nada aqui pode excluir ou reduzir direitos do consumidor (CDC, arts. 25 e 51, I). Ao mudar o texto, atualize ATUALIZADA.
import { L } from '../components/Layout.jsx';
import { Canais, Empresa, nomeEmpresa, PaginaLegal, Secao } from '../components/Legal.jsx';
import { useSite } from '../state/content.jsx';

export const ATUALIZADA = '30/10/2026';

const SECOES = [
  ['fornecedor', 'quem somos'],
  ['site', 'o que é este site'],
  ['receita', 'exames e receitas'],
  ['informativo', 'conteúdo informativo'],
  ['imagens', 'imagens'],
  ['promocoes', 'promoções e ofertas'],
  ['garantias', 'garantias e arrependimento'],
  ['propriedade', 'propriedade intelectual'],
  ['uso', 'uso do site'],
  ['terceiros', 'serviços de terceiros'],
  ['responsabilidade', 'responsabilidade'],
  ['privacidade', 'privacidade'],
  ['alteracoes', 'alterações'],
  ['foro', 'lei aplicável e foro'],
  ['contato', 'contato'],
];

export default function Termos() {
  const site = useSite();
  const nome = nomeEmpresa(site.emp);
  const fb = !!String(site.info.facebook || '').trim();
  return (
    <PaginaLegal rotulo="Termos de Uso" eyebrow="termos de uso" a="termos" b="de uso." data={ATUALIZADA} secoes={SECOES}
      resumo="As regras para usar o site da Ótica Digital Look. Ao navegar por ele, você concorda com estes termos — que não reduzem nenhum dos seus direitos como consumidor.">

      <Secao id="fornecedor" n="01" titulo="quem somos">
        <p>Este site é da {nome}, ótica no centro de Rinópolis/SP:</p>
        <Empresa site={site} />
      </Secao>

      <Secao id="site" n="02" titulo="o que é este site">
        <p>O site é <strong>informativo</strong>: apresenta a loja, os produtos, os serviços e dicas sobre cuidados com os olhos. <strong>Não há venda nem pagamento pelo site.</strong> Orçamentos e compras são feitos na loja ou pelo WhatsApp.</p>
        <p>Preço, disponibilidade, condições de pagamento e prazo de entrega valem conforme o orçamento que você receber da loja. Quando o site informar um preço, ele vale para o produto e nas condições indicadas junto a ele.</p>
      </Secao>

      <Secao id="receita" n="03" titulo="exames de vista e receitas">
        <p>A Ótica Digital Look <strong>não realiza exames de vista nem consultas</strong>. Lentes de grau e lentes de contato são vendidas <strong>somente com receita de médico oftalmologista</strong>, como determina a legislação (Decretos nº 20.931/1932 e nº 24.492/1934).</p>
        <p>O grau e o tipo de lente são definidos pelo seu médico. Na loja, ajudamos você a escolher a armação e mostramos as opções de lentes que correspondem ao que foi prescrito.</p>
      </Secao>

      <Secao id="informativo" n="04" titulo="conteúdo informativo">
        <p>Os artigos do <L to="blog">blog</L> e as dúvidas frequentes são informativos e <strong>não substituem a consulta com o oftalmologista</strong>. Em caso de dor, vermelhidão, piora da visão ou outro sintoma, procure um médico.</p>
      </Secao>

      <Secao id="imagens" n="05" titulo="imagens">
        <p>As fotos mostram a loja e exemplos de produtos. Cores e detalhes podem variar conforme a tela do seu aparelho, e a disponibilidade de cada modelo deve ser confirmada na loja. As ilustrações com o símbolo da marca, usadas quando não há foto, são apenas decorativas.</p>
      </Secao>

      <Secao id="promocoes" n="06" titulo="promoções e ofertas">
        <p>Cada promoção vale nas condições e no período informados nela. Uma promoção publicada sem data de término vale enquanto estiver no site. Se houver dúvida sobre uma condição, vale a interpretação mais favorável a você (CDC, art. 47).</p>
      </Secao>

      <Secao id="garantias" n="07" titulo="garantias e direito de arrependimento">
        <ul>
          <li><strong>Garantia legal:</strong> todos os produtos têm a garantia do Código de Defesa do Consumidor: 90 dias para reclamar de defeitos em produtos duráveis, como óculos, armações e lentes de óculos (art. 26, II), e 30 dias para produtos não duráveis, como lentes de contato descartáveis e soluções (art. 26, I), contados da entrega ou, se o defeito estiver oculto, de quando ele aparecer.</li>
          <li><strong>Garantia contratual:</strong> a garantia do fabricante ou da loja, quando houver, complementa a legal e vale nas condições do termo de garantia escrito entregue na compra (art. 50).</li>
          <li><strong>Direito de arrependimento:</strong> se a compra for fechada fora da loja — por exemplo, toda pelo WhatsApp, sem você ir até lá —, você pode desistir em até 7 dias a contar do recebimento do produto, com a devolução dos valores pagos (art. 49).</li>
        </ul>
        <p>Para usar a garantia ou o direito de arrependimento, fale com a gente pelos canais da seção <a href="#contato">contato</a> ou vá à loja com o produto e, se possível, o comprovante de compra.</p>
      </Secao>

      <Secao id="propriedade" n="08" titulo="propriedade intelectual">
        <p>O nome Ótica Digital Look, o logotipo, os textos e as fotos da loja publicados no site pertencem à ótica ou são usados com autorização. Não é permitido copiá-los para uso comercial sem autorização. Marcas de fabricantes citadas pertencem aos seus titulares. Você pode compartilhar à vontade os links das páginas do site.</p>
      </Secao>

      <Secao id="uso" n="09" titulo="uso do site">
        <p>Ao usar o site, você se compromete a não tentar acessar áreas restritas, prejudicar o funcionamento dele ou usá-lo para fins ilegais. A área do proprietário (/admin) é de uso exclusivo da loja.</p>
      </Secao>

      <Secao id="terceiros" n="10" titulo="serviços de terceiros">
        <p>O site tem links e botões que abrem {fb ? 'o WhatsApp, o Instagram, o Facebook e o Google Maps' : 'o WhatsApp, o Instagram e o Google Maps'}. Esses serviços são de outras empresas e têm termos e políticas próprios. O mapa só é carregado depois que você toca em "mostrar mapa".</p>
      </Secao>

      <Secao id="responsabilidade" n="11" titulo="responsabilidade">
        <p>Nada nestes termos exclui ou reduz a responsabilidade da loja prevista no Código de Defesa do Consumidor (arts. 25 e 51, I). Trabalhamos para manter as informações do site corretas e atualizadas; se encontrar algum erro, avise-nos pelos canais de atendimento. O site pode ficar fora do ar por alguns momentos para manutenção ou por falha do provedor de hospedagem.</p>
      </Secao>

      <Secao id="privacidade" n="12" titulo="privacidade">
        <p>O tratamento dos seus dados pessoais é explicado na <L to="politica-de-privacidade">Política de Privacidade</L>.</p>
      </Secao>

      <Secao id="alteracoes" n="13" titulo="alterações">
        <p>Podemos atualizar estes termos. A data da última atualização fica no topo da página. As mudanças não afetam compras já feitas, que seguem as condições combinadas na época.</p>
      </Secao>

      <Secao id="foro" n="14" titulo="lei aplicável e foro">
        <p>Estes termos seguem a lei brasileira. Eventuais conflitos podem ser levados ao foro do domicílio do consumidor (CDC, art. 101, I). Antes disso, procure-nos: a maioria dos problemas se resolve numa conversa. Você também pode recorrer ao Procon.</p>
      </Secao>

      <Secao id="contato" n="15" titulo="contato">
        <p>Dúvidas, reclamações ou pedidos sobre estes termos:</p>
        <Canais site={site} />
      </Secao>
    </PaginaLegal>
  );
}
