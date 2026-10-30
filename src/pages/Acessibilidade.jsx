// Declaração de acessibilidade, com canal para relatar barreiras. Texto fixo no código (não editável pelo painel).
// Ao revisar o site (ou mudar o texto), atualize REVISADA.
import { L } from '../components/Layout.jsx';
import { Canais, Fechamento, PaginaLegal, Secao } from '../components/Legal.jsx';
import { useSite } from '../state/content.jsx';

export const REVISADA = '30/10/2026';
const MSG = 'Olá! Encontrei uma dificuldade para usar o site da ótica:';

const SECOES = [
  ['compromisso', 'nosso compromisso'],
  ['recursos', 'recursos do site'],
  ['limitacoes', 'limitações conhecidas'],
  ['barreiras', 'encontrou uma barreira?'],
  ['revisao', 'revisão'],
];

export default function Acessibilidade() {
  const site = useSite();
  return (
    <PaginaLegal rotulo="Acessibilidade" eyebrow="acessibilidade" a="um site para" b="todas as pessoas." data={REVISADA} rotuloData="Revisada em" secoes={SECOES}
      resumo="Queremos que qualquer pessoa consiga usar este site — inclusive quem usa leitor de tela, navega só pelo teclado, amplia o texto ou prefere menos movimento na tela.">

      <Secao id="compromisso" n="01" titulo="nosso compromisso">
        <p>Buscamos seguir as <strong>Diretrizes de Acessibilidade para Conteúdo Web (WCAG) 2.1, nível AA</strong>, do W3C, como orienta a Lei Brasileira de Inclusão (Lei nº 13.146/2015, art. 63). Acessibilidade é um trabalho contínuo: revisamos o site quando ele muda e corrigimos o que for relatado.</p>
      </Secao>

      <Secao id="recursos" n="02" titulo="recursos do site">
        <ul>
          <li>link <strong>"pular para o conteúdo"</strong> no início de cada página, que aparece ao usar a tecla Tab;</li>
          <li>navegação completa pelo <strong>teclado</strong>, com destaque visível no item em foco;</li>
          <li>títulos organizados e textos alternativos nas fotos, para quem usa <strong>leitor de tela</strong>;</li>
          <li>respeito à preferência <strong>"reduzir movimento"</strong> do seu aparelho: com ela ligada, as animações são desativadas;</li>
          <li>botão para <strong>pausar a faixa de texto em movimento</strong> da página inicial;</li>
          <li>páginas que se adaptam a telas pequenas e ao zoom do navegador, sem perder conteúdo;</li>
          <li>formulário de contato com rótulo em todos os campos;</li>
          <li>o mapa só carrega se você pedir, e os botões "como chegar" e "abrir no Google Maps" levam direto à rota.</li>
        </ul>
      </Secao>

      <Secao id="limitacoes" n="03" titulo="limitações conhecidas">
        <ul>
          <li>O <strong>mapa</strong> é fornecido pelo Google Maps, um conteúdo de terceiros que não controlamos e que pode não ser totalmente acessível. Como alternativa, o endereço está escrito na página e os botões "como chegar" e "abrir no Google Maps" abrem a rota no aplicativo de mapas.</li>
          <li>Os serviços que o site abre — WhatsApp, Instagram, Facebook e Google Maps — seguem a acessibilidade de cada plataforma.</li>
        </ul>
      </Secao>

      <Secao id="barreiras" n="04" titulo="encontrou uma barreira?">
        <p>Se você tiver dificuldade para usar alguma parte do site, conte para a gente. Diga em qual página, o que tentou fazer e, se puder, qual aparelho, navegador e tecnologia assistiva usa. Vamos corrigir o quanto antes e, enquanto isso, atender você pelo canal que preferir:</p>
        <Canais site={site} msg={MSG} />
      </Secao>

      <Secao id="revisao" n="05" titulo="revisão">
        <p>Esta declaração foi revisada em {REVISADA}, depois de uma avaliação de acessibilidade do site. Veja também a <L to="politica-de-privacidade">Política de Privacidade</L> e os <L to="termos-de-uso">Termos de Uso</L>.</p>
      </Secao>

      <Fechamento titulo="precisa de ajuda agora?" texto="Fale com a gente pelo WhatsApp — atendemos você pelo canal que for mais fácil." href={site.wa.msg(MSG)} />
    </PaginaLegal>
  );
}
