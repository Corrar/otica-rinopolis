# Fotos do conteúdo padrão

Todas as fotos do conteúdo padrão são **reais, da loja** (`public/fotos/`), recortadas e otimizadas a partir das imagens enviadas nas conversas de 15/10/2026 e 29/10/2026.
Onde ainda não há foto real (capa e card de lentes de contato, artigos do blog sem imagem, armações, equipe, promoções e eventos cadastrados sem foto), o site mostra a **arte da marca** — o olho do logo em traço fino, desenhado em SVG no próprio código (`ArteMarca`, em `src/components/bits.jsx`). Não há imagens de banco de imagens no site.

No build, cada foto de `public/fotos/` ganha versões WebP menores (480, 800 e 1200 px de largura, sem ampliar), geradas por `scripts/fotos-responsivas.js`; o site escolhe a versão pelo tamanho da tela e mantém o JPEG original de reserva. Para trocar uma foto padrão, basta substituir o JPEG (de preferência com 1000 a 1600 px de largura) e fazer um novo deploy.

O proprietário troca ou acrescenta fotos pelo painel (`/admin` → fotos, armações, sobre/equipe, promoções, eventos, blog). A "visão geral" do painel lista as fotos que ainda faltam.

## Fotos em `public/fotos/`

| Onde aparece | Arquivo |
|---|---|
| Capa da home e vitrine de armações ("vitrine de armações") | `vitrine-feminina.jpg` |
| Foto da loja (home, "sobre a ótica") | `loja-balcao.jpg` — balcão com o logo |
| Nossa história (página sobre) | `fachada.jpg` — fachada na R. Prof. Sud Menucci, 228 |
| Card "armações" (home), vitrine ("armações femininas") e artigo sobre o formato do rosto | `galeria-feminina.jpg` |
| Card "óculos de sol" (home) e vitrine ("óculos de sol e clip-on") | `oculos-clip-on.jpg` — óculos de sol e clip-on na vitrine |
| Vitrine ("armações masculinas") e artigo sobre antirreflexo | `galeria-masculina.jpg` |
| Vitrine ("armações de metal") | `galeria-metal.jpg` |
| Galeria "a loja" (página sobre) | `galeria-feminina.jpg`, `galeria-masculina.jpg`, `galeria-metal.jpg`, `galeria-balcao.jpg` |
| Imagem de compartilhamento (WhatsApp, Facebook, Google) | `public/og-image.jpg` — fachada, 1200×630 |

Ficaram de fora as fotos do balcão com o banner da CIA CAP e da mesa de atendimento com o computador (muita informação na imagem).

## Removidas
- `capa-armacao.jpg` (antiga capa) e `infantil-rosa.jpg` (antiga armação "Play color"): não eram fotos da loja — eram de banco de imagens (a capa tinha logotipo de marca e tabela de exame de vista; a outra, rosto de criança identificável) e foram apagadas.
- Fotos do banco Pexels (`images.pexels.com`) usadas nas versões anteriores: removidas do conteúdo padrão. Se um backup antigo ainda tiver alguma, o painel avisa em "pendências" para trocar por uma foto real.
