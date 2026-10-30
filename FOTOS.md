# Fotos do conteúdo padrão

Todas as fotos do conteúdo padrão são **reais, da loja** (`public/fotos/`), recortadas e otimizadas a partir das imagens enviadas nas conversas de 15/10/2026 e 29/10/2026. **Não há fotos de banco de imagens no site.**

Onde ainda não há foto real (capa e card de lentes de contato, artigos do blog sem imagem, e armações, equipe, promoções e eventos cadastrados sem foto), o site mostra a **arte da marca**: o olho do logo em traço fino, desenhado em SVG no próprio código (`ArteMarca`, em `src/components/bits.jsx`), em fundo areia ou escuro. A mesma arte aparece se uma foto não carregar. Nenhum texto provisório (como "foto: …") aparece no site público.

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

Sem foto (arte da marca): `fotos.lentes` (capa de /lentes), `fotos.cat_lentes` (card "lentes de contato") e os artigos "tempo de tela", "primeira vez com lentes de contato" e "sinais de que seu filho pode precisar de óculos".

Ficaram de fora as fotos do balcão com o banner da CIA CAP e da mesa de atendimento com o computador (muita informação na imagem, inclusive a tela).

## Como trocar ou acrescentar fotos
- **Pelo painel** (proprietário): `/admin` → fotos e galeria, armações, sobre e equipe, promoções, eventos e blog. O painel reduz a foto para até 1600 px e envia como JPEG para o Vercel Blob (PNG ou WebP com fundo transparente, como um logotipo, ganha fundo branco na conversão). A "visão geral" lista as fotos que ainda faltam. Passo a passo em `ENTREGA.md`, seção 3.
- **No código** (só as fotos padrão): substituir o JPEG em `public/fotos/` (de preferência com 1000 a 1600 px de largura) e fazer um novo deploy. No build, cada foto ganha versões WebP de 480, 800 e 1200 px de largura, sem ampliar (`scripts/fotos-responsivas.js`); o site escolhe a versão pelo tamanho da tela e mantém o JPEG de reserva. As versões ficam só em `dist/`, não no repositório.

Regras para qualquer foto nova:
- Foto enviada pelo painel é **pública na internet**: nunca usar receita, documento, tela com dados de cliente ou foto de criança sem autorização dos responsáveis.
- Pessoas reconhecíveis (equipe, clientes) só com **autorização escrita de uso de imagem** (modelo no anexo de `ENTREGA.md`).
- Nada de foto de banco de imagens apresentada como se fosse da loja, nem de tabela de exame de vista (a ótica não faz exames).

## Removidas
- `capa-armacao.jpg` (antiga capa) e `infantil-rosa.jpg` (antiga armação "Play color"): não eram fotos da loja, e sim de banco de imagens (a capa tinha logotipo de marca e tabela de exame de vista; a outra, rosto de criança identificável). Foram apagadas.
- Fotos do banco Pexels (`images.pexels.com`) usadas nas versões anteriores: removidas do conteúdo padrão. Se um backup antigo ainda tiver alguma (ou os nomes antigos acima), o painel avisa em "pendências" para trocar por uma foto real (`ehIlustrativa`, em `src/content/defaults.js`).
