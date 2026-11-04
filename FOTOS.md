# Fotos do conteúdo padrão

As fotos da loja (`public/fotos/`) são **reais**, recortadas e otimizadas a partir das imagens enviadas nas conversas de 15/10/2026 e 29/10/2026.

Para completar o site, a pedido do proprietário (04/11/2026), os espaços que não tinham foto real usam **fotos de banco de imagens gratuito sem direitos autorais** (domínio público ou CC0, do Wikimedia Commons — várias são cópias de fotos do Unsplash e do Pexels publicadas como CC0). Ficam em `public/fotos/ilustrativas/` (lista e origem abaixo) e aparecem no site com o selo **"imagem ilustrativa"** (componente `Img`, em `src/components/bits.jsx`), para não passarem por fotos da loja ou do produto à venda. O painel reconhece essas fotos (`ehIlustrativa`) e lembra, como item opcional da visão geral, que podem ser trocadas por fotos reais.

Onde ainda não há foto nenhuma (equipe, promoções e eventos cadastrados sem foto), o site mostra a **arte da marca**: o olho do logo em traço fino, desenhado em SVG no próprio código (`ArteMarca`, em `src/components/bits.jsx`), em fundo areia ou escuro. A mesma arte aparece se uma foto não carregar. Nenhum texto provisório (como "foto: …") aparece no site público.

## Fotos atuais (`public/fotos/`)

| Arquivo | Onde aparece |
|---|---|
| `capa-fachada.jpg` | Capa da home (`fotos.hero`) — recorte de `fachada.jpg` (900×720, a parte de cima: olho, letreiro e telefone, sem o cartaz da porta) |
| `loja-balcao.jpg` | Foto da loja na home, seção "sobre" (`fotos.loja`) — balcão com o logo |
| `fachada.jpg` | Foto da página sobre (`fotos.equipe`) — fachada na R. Prof. Sud Menucci, 228 |
| `galeria-feminina.jpg` | Card "armações" da home (`fotos.cat_armacoes`), vitrine ("Armações femininas"), galeria da página sobre e imagem de compartilhamento de /armacoes (`src/lib/seo.js`) |
| `oculos-clip-on.jpg` | Card "óculos de sol" da home (`fotos.cat_sol`) e vitrine ("Óculos de sol e clip-on") |
| `galeria-masculina.jpg` | Vitrine ("Armações masculinas"), galeria e artigo sobre antirreflexo |
| `galeria-metal.jpg` | Vitrine ("Armações de metal"), galeria e artigo sobre o formato do rosto |
| `galeria-balcao.jpg` | Galeria ("nosso balcão de atendimento") |
| `vitrine-feminina.jpg` | Fora do conteúdo padrão (era a capa e repetia a prateleira de `galeria-feminina.jpg`). **Não apagar**: um conteúdo salvo no painel pode ainda apontar para ela |

Na home, cada foto aparece uma vez só (capa, cards e artigos do blog com fotos diferentes).

Fora de `public/fotos/`:
- `public/og-image.jpg` — fachada, 1200×630: imagem de compartilhamento (WhatsApp, Facebook, Google) e do JSON-LD.
- `public/logo.png` — logo sem margem transparente (273×168, branco), recortado do original `project/assets/logo.png`: cabeçalho, rodapé e telas de carregamento.
- `public/logo-192.png` — logo em fundo escuro, 192×192: ícone do iPhone (apple-touch-icon) e logo dos dados estruturados (JSON-LD), que o Google mostra sobre fundo claro.
- `public/favicon.png` — só o olho do logo, em fundo escuro (64×64): ícone da aba do navegador.

Ficaram de fora as fotos do balcão com o banner da CIA CAP e da mesa de atendimento com o computador (muita informação na imagem, inclusive a tela).

## Fotos ilustrativas (`public/fotos/ilustrativas/`)

Todas de licença livre, sem direitos autorais: **domínio público** ou **CC0** (uso comercial permitido, sem obrigação de crédito). Conferidas no Wikimedia Commons em 04/11/2026; as que vieram do Unsplash ou do Pexels foram baixadas da origem. Recortadas e reduzidas para até 1280 px.

| Arquivo | Onde aparece | Licença | Autor | Origem |
|---|---|---|---|---|
| `lente-contato-aplicacao.jpg` | Card "lentes de contato" da home (`fotos.cat_lentes`) | CC0 | Moist.acuvuehk | [Commons](https://commons.wikimedia.org/wiki/File:Put_on_contact_lens.jpg) |
| `lente-contato-olho.jpg` | Capa de /lentes (`fotos.lentes`) | Public domain | Cassiopeia sweet | [Commons](https://commons.wikimedia.org/wiki/File:Color_contact_lens_eye_brown.jpg) |
| `lente-contato-olho-castanho.jpg` | Artigo "primeira vez com lentes de contato" | Public domain | Cassiopeia sweet | [Commons](https://commons.wikimedia.org/wiki/File:Color_contact_lens_eye_chocola.jpg) |
| `oculos-tela.jpg` | Artigo "tempo de tela" (aparece também na home, em "dicas para seus olhos") | CC0 | Kevin Ku | [Commons](https://commons.wikimedia.org/wiki/File:Pexels-kevin-ku-577585.jpg) · [original](https://www.pexels.com/photo/data-codes-through-eyeglasses-577585/) |
| `oculos-livro.jpg` | Artigo "sinais de que seu filho pode precisar de óculos" | CC0 | Caleb Woods caleb_woods | [Commons](https://commons.wikimedia.org/wiki/File:Caleb_Woods_2017-03-08_(Unsplash).jpg) · [original](https://unsplash.com/photos/iobrSsVqp28) |
| `armacao-acetato.jpg` | Vitrine: "Armações de acetato" | CC0 | freestocks.org | [Commons](https://commons.wikimedia.org/wiki/File:Reading_glasses_(30992132360).jpg) · [original](https://www.flickr.com/photos/freestocks/30992132360/) |
| `armacao-redonda.jpg` | Vitrine: "Armações redondas" | CC0 | Jesus Kiteque jesuskiteque | [Commons](https://commons.wikimedia.org/wiki/File:Essentials_(Unsplash).jpg) · [original](https://unsplash.com/photos/wn-KYaHwcis) |
| `armacao-preta.jpg` | Vitrine: "Armações pretas clássicas" | CC0 | Mari Helin-Tuominen mari | [Commons](https://commons.wikimedia.org/wiki/File:Reading_glasses_(Unsplash).jpg) · [original](https://unsplash.com/photos/ilSnKT1IMxE) |
| `sol-aviador.jpg` | Vitrine: "Óculos de sol aviador" | CC0 | David Lezcano _thedl | [Commons](https://commons.wikimedia.org/wiki/File:Reflective_sunglasses_(Unsplash).jpg) · [original](http://unsplash.com/photos/mNCFOaaLu5o) |
| `sol-gatinho.jpg` | Vitrine: "Óculos de sol gatinho" (recortada sem o celular com logotipo que havia na foto) | CC0 | STIL stilclassics | [Commons](https://commons.wikimedia.org/wiki/File:STIL_2017-04-20_(Unsplash).jpg) · [original](https://unsplash.com/photos/D4jRahaUaIc) |
| `sol-quadrado.jpg` | Vitrine: "Óculos de sol quadrados" | CC0 | Steve Halama steve3p_0 | [Commons](https://commons.wikimedia.org/wiki/File:Steve_Halama_2017-02-02_(Unsplash).jpg) · [original](https://unsplash.com/photos/axTJazt56mg) |
| `sol-redondo-colorido.jpg` | Vitrine: "Óculos de sol redondos coloridos" | CC0 | Blubel blubel | [Commons](https://commons.wikimedia.org/wiki/File:Green_latte_cup_and_sunglasses_(Unsplash).jpg) · [original](https://unsplash.com/photos/hydxQhce_NI) |

Descartada: foto de armação de metal retangular (Commons, domínio público) que mostrava a marca do fabricante na haste.

## Como trocar ou acrescentar fotos
- **Pelo painel** (proprietário): `/admin` → fotos e galeria, armações, sobre e equipe, promoções, eventos e blog. O painel reduz a foto para até 1600 px e envia como JPEG para o Vercel Blob (PNG ou WebP com fundo transparente, como um logotipo, ganha fundo branco na conversão). A "visão geral" lista as fotos que ainda faltam. Passo a passo em `ENTREGA.md`, seção 3.
- **No código** (só as fotos padrão): substituir o JPEG em `public/fotos/` (de preferência com 1000 a 1600 px de largura) e fazer um novo deploy. No build, cada foto ganha versões WebP de 480, 800 e 1200 px de largura, sem ampliar (`scripts/fotos-responsivas.js`); o site escolhe a versão pelo tamanho da tela e mantém o JPEG de reserva. As versões ficam só em `dist/`, não no repositório.

Regras para qualquer foto nova:
- Foto enviada pelo painel é **pública na internet**: nunca usar receita, documento, tela com dados de cliente ou foto de criança sem autorização dos responsáveis.
- Pessoas reconhecíveis (equipe, clientes) só com **autorização escrita de uso de imagem** (modelo no anexo de `ENTREGA.md`).
- Nada de foto de banco de imagens apresentada como se fosse da loja, nem de tabela de exame de vista (a ótica não faz exames). Foto de banco de imagens só com licença livre (domínio público ou CC0), sem marca de fabricante visível nem criança identificável, em `public/fotos/ilustrativas/` (que põe o selo "imagem ilustrativa") e registrada na tabela acima.

## Removidas
- `capa-armacao.jpg` (antiga capa) e `infantil-rosa.jpg` (antiga armação "Play color"): não eram fotos da loja, e sim de banco de imagens (a capa tinha logotipo de marca e tabela de exame de vista; a outra, rosto de criança identificável). Foram apagadas.
- Fotos do banco Pexels (`images.pexels.com`) usadas nas versões anteriores: removidas do conteúdo padrão. Se um backup antigo ainda tiver alguma (ou os nomes antigos acima), o painel avisa em "pendências" para trocar por uma foto real (`ehIlustrativa`, em `src/content/defaults.js`).
