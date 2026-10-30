# Ótica Digital Look — site institucional

Site da Ótica Digital Look (R. Prof. Sud Menucci, 228 – Centro, Rinópolis/SP), implementado a partir do design do Claude Design (`project/`, direção **1a Vitrine**).
Vite + React 19 + GSAP/ScrollTrigger, com **área do proprietário com backend real**: o que é editado no painel aparece para todos os visitantes.

- **`ENTREGA.md`** — guia do proprietário, em linguagem simples: primeiro acesso, dados a preencher, publicar, backup, Google, privacidade no dia a dia, páginas legais e hospedagem.
- **`PENDENCIAS.md`** — checklist técnico de entrega (o que falta configurar e a ordem de publicação).
- **`FOTOS.md`** — fotos do conteúdo padrão.

## Páginas
`/` início · `/sobre` · `/armacoes` (filtros) · `/lentes` (FAQ) · `/convenios` (promoções, eventos, convênios) · `/blog` · `/blog/<artigo>` · `/contato` (formulário → WhatsApp) · `/politica-de-privacidade` · `/termos-de-uso` · `/acessibilidade` · `/admin` (área do proprietário).
Links antigos com `#admin`, `#sobre` etc. redirecionam para as URLs novas. Endereço sem página (inclusive `/blog/<artigo-inexistente>`) responde 404.

## Variáveis de ambiente
Modelo em `.env.example`. **Nunca escreva senhas ou segredos em arquivos do repositório**: na Vercel, cadastre como *Sensitive* em Settings → Environment Variables. Mudanças de variável só valem para um **novo deploy** (Redeploy).

| Variável | Obrigatória? | Para quê |
|---|---|---|
| `ADMIN_PASSWORD` | **sim, em produção** (12+ caracteres aleatórios) | Senha inicial do painel. Só vale até o proprietário criar a senha dele no primeiro acesso; depois deixa de funcionar. Sem ela, login responde "Configuração pendente" (não existe senha padrão em produção). |
| `SESSION_SECRET` | **sim, em produção** (32+ caracteres, ex.: `openssl rand -hex 32`) | Assina o cookie da sessão. Trocar o valor desconecta todos. Sem ela, `npm start` não sobe e, na Vercel, login e sessão respondem "Configuração pendente". |
| `BLOB_READ_WRITE_TOKEN` | **sim, na Vercel** (criada ao conectar o Blob Store) | Armazenamento do conteúdo, das fotos enviadas e do hash da senha. Conectado só ao ambiente Production: previews ficam sem armazenamento (o painel avisa e não salva — esperado). |
| `SITE_URL` | não | Endereço oficial (canônico, sitemap, Open Graph, JSON-LD). Sem ela: domínio de produção da Vercel (`VERCEL_PROJECT_PRODUCTION_URL`) ou `https://otica-rinopolis.vercel.app`. |
| `DEPLOY_HOOK_URL` | não (recomendada) | URL do Deploy Hook da Vercel (branch `main`). Liga o botão "publicar alterações no Google" do painel. Quem tem a URL dispara deploys. |
| `CRON_SECRET` | não | 16+ caracteres. Com `DEPLOY_HOOK_URL`, liga a republicação diária (`crons` do `vercel.json`, 9h17 UTC). |
| `DATA_DIR`, `PORT`, `TRUST_PROXY` | só fora da Vercel | Pasta dos dados no modo arquivos, porta do `server.js` e `TRUST_PROXY=1` atrás de nginx/proxy. |

`NODE_ENV`: `npm start` usa `production`; `npm run dev` usa `development` (único caso com senha de desenvolvimento, ver "Rodar localmente").

## Publicação
Roteiro na ordem que não expõe o painel nem publica conteúdo fictício (checklist com o estado de cada item em `PENDENCIAS.md`):
1. `ADMIN_PASSWORD` e `SESSION_SECRET` definidos em Production **antes** do deploy (com o Blob conectado, quem souber a senha edita o site).
2. `npm run build` local e conferir que o HTML gerado não tem restos do conteúdo de exemplo (o comando deve listar **0** arquivos em todas as linhas):
   ```bash
   for t in 'Aferição' '00.000.000' 'Marca 1' 'Nome Sobrenome' 'Unimed' '10x sem juros' 'medição digital' 'Outubro:' '"@type":"Event"' 'pexels' 'tóricas' 'multifocais' 'pequeno porte' 'horário comercial'; do
     echo "$t: $(grep -l -- "$t" dist/*.html dist/blog/*.html | wc -l)"; done
   ```
3. Merge na `main` → a Vercel publica sozinha (cada push na `main` gera um deploy de produção).
4. Em Deployments, conferir que Production é do último commit. Entrar em `/admin` com a senha inicial e, no mesmo navegador, abrir `/api/session`: deve mostrar `"armazenamento":"blob"` (e `"publicar":true` se o Deploy Hook estiver configurado). **Não crie a senha definitiva**: a tela "crie a sua senha" é do proprietário; use "sair".
5. Na entrega, o proprietário entra, troca a senha, preenche os dados (`ENTREGA.md`, seção 4), publica e exporta o primeiro backup.
6. Depois de publicado: PageSpeed Insights e Teste de pesquisa aprimorada do Google (`/`, `/lentes`, um artigo) na URL de produção; Search Console com envio de `/sitemap.xml` (`ENTREGA.md`, seção 7).

**Publicar alterações (botão do painel).** Visitantes veem o que é salvo no painel em 1 a 2 minutos (cache do CDN de 60 s), mas as páginas prontas, o sitemap e o JSON-LD só mudam com um novo deploy. Com `DEPLOY_HOOK_URL`, o painel mostra **"publicar alterações no Google"**, que dispara esse deploy (1 a 3 minutos), avisa quando há alterações ainda não publicadas e mostra quando foi a última publicação (lê `/publicado.json`). O botão nunca é chamado pelo salvamento automático e aceita um pedido por minuto. Com `CRON_SECRET`, o site também é republicado uma vez por dia (eventos e promoções vencidos saem do Google). Sem as variáveis, nada é disparado: use **Redeploy** na Vercel.

Para criar o Deploy Hook: Vercel → Settings → Git → Deploy Hooks → nome "painel", branch `main` → copiar a URL para `DEPLOY_HOOK_URL` (Sensitive, Production) → Redeploy.

## Páginas legais
- `/politica-de-privacidade` (`src/pages/Privacidade.jsx`), `/termos-de-uso` (`src/pages/Termos.jsx`) e `/acessibilidade` (`src/pages/Acessibilidade.jsx`), com os blocos comuns em `src/components/Legal.jsx`. Links no rodapé, no sitemap (prioridade 0.2) e com trilha de navegação no JSON-LD.
- **Texto fixo no código**, não editável pelo painel (para não ser apagado por engano). Os dados do controlador vêm das informações da loja: `razaoSocial`, `cnpj`, `email`, `endereco`, `bairroCidade`, `cep`, `whatsapp`, `telefone`. Sem razão social, aparece o nome fantasia; CNPJ e e-mail só aparecem quando válidos (`src/lib/validar.js`).
- Ao mudar o texto, atualize `ATUALIZADA` (Privacidade e Termos) ou `REVISADA` (Acessibilidade). A tabela de prazos de guarda é `RETENCAO`, em `Privacidade.jsx` (90 dias e 5 anos são exemplos a confirmar com o contador). Foro: domicílio do consumidor (CDC, art. 101, I), sem comarca.
- Mudou algo que a política descreve? Atualize-a junto: cookie da sessão (`server/auth.js`), cache local `odl-cache-v1` (`src/state/content.jsx`), serviço de terceiros novo (análise de público, pixel, fontes externas, mapa — também exigem ajuste na CSP do `vercel.json`) ou o prazo de 1 hora do IP de quem erra a senha.
- **Revisão por advogado antes de divulgar o site**: lista de pontos em `ENTREGA.md`, seção 9.

## Backup e restauração
- **Mensal, pelo painel**: configurações → backup dos dados → **exportar backup** (`digital-look-backup-AAAA-MM-DD.json`). Guardar em dois lugares fora do site. O painel lembra há quantos dias foi o último (por aparelho) e avisa depois de 30 dias.
- O arquivo tem os textos e as **URLs** das fotos (as fotos enviadas são públicas no Blob; para uma cópia completa, baixe-as pelas URLs do arquivo).
- **Importar backup** substitui o conteúdo atual (aceita também backups do protótipo com fotos embutidas, que são reduzidas e enviadas). **Histórico de versões**: restaurar uma versão anterior (guarda as 300 mais recentes e todas dos últimos 30 dias).
- No Blob: `cms/` (uma versão imutável por salvamento; o nome traz as partes do site alteradas, ex.: `~promocoes_blog`, mostradas no histórico), `atual/conteudo.json` (ponteiro para a versão atual), `uploads/` (fotos) e `auth/` (hash da senha). No modo arquivos, faça backup da pasta `DATA_DIR` inteira.
- **O arquivo de `auth/` é sensível**: o Blob Store é público (quem tem a URL baixa o arquivo) e ele guarda o salt e o hash scrypt da senha, que permitiriam tentar adivinhá-la fora do site. O endereço tem sufixo aleatório e o site nunca o mostra, mas ele aparece no navegador de arquivos do Blob na Vercel: não compartilhe prints nem a URL desse arquivo. Melhoria futura: guardar o registro da senha num Blob Store **privado** separado.

## Pedido de eliminação de dados
Para retirar de vez uma pessoa ou um depoimento (ex.: funcionário que saiu, cliente que revogou a autorização):
1. Remover o item no painel.
2. Configurações → privacidade e limpeza → **apagar histórico e fotos antigas** (`POST /api/limpar-fotos` com `historico: true`: apaga as versões antigas, mantendo só a atual, e as fotos de `uploads/` que nenhuma versão usa; fotos da última hora ficam). "Limpar fotos não usadas" faz só a segunda parte.
3. **Publicar** (botão do painel ou Redeploy), para o HTML pronto e o sitemap deixarem de ter o item.
4. Apagar os backups antigos (`.json`) que ainda tenham o item.

## Recuperar o acesso (senha esquecida)
Não há "esqueci minha senha". Quem administra a hospedagem:
1. Define um **novo** `ADMIN_PASSWORD` aleatório (Production, Sensitive) e faz Redeploy.
2. Vercel → Storage → Blob Store → apaga os arquivos de `auth/` (modo arquivos: `DATA_DIR/auth.json`). Sessões antigas deixam de valer.
3. Passa a nova senha inicial ao proprietário **por canal privado** (o login confere o registro atualizado em até 1 minuto); no primeiro acesso, o painel obriga a criar outra senha.

## SEO (Google)
- `npm run build` gera, além do app, o **HTML pronto de cada página** (`scripts/prerender.js`): título, descrição, link canônico, Open Graph e dados estruturados (schema.org `Optician` com endereço, telefones e, quando informados, horário, razão social, CNPJ, e-mail e formas de pagamento; `FAQPage` em lentes; `Event` para eventos futuros; `BlogPosting` nos artigos; `BreadcrumbList`). O Google lê o conteúdo sem precisar executar o JavaScript.
- Também gera `sitemap.xml`, `robots.txt` (bloqueia `/admin` e `/api/`), `404.html` (servida com status 404), `admin.html` (painel, com `noindex`) e `publicado.json` (versão do conteúdo publicada, lida pelo painel).
- O conteúdo usado no build é o último salvo no painel e vai embutido em cada página: o site abre na hora com ele e confere a versão atual em segundo plano.
- Se o armazenamento estiver configurado (`BLOB_READ_WRITE_TOKEN` ou `DATA_DIR`) e não puder ser lido no build, o build **falha** de propósito: a Vercel mantém o deploy anterior em vez de publicar o conteúdo padrão.
- Uma URL por página: `/sobre/`, `/sobre.html` e `/index.html` redirecionam para a forma limpa (na Vercel por `cleanUrls`/`trailingSlash`; no `server.js`, 301).
- O endereço do site fica fixo no código gerado (`__SITE__`, definido em `vite.config.js`): canônico, Open Graph e JSON-LD iguais no HTML e na navegação, mesmo abrindo por preview. Ao ligar um domínio próprio: Settings → Domains, novo deploy e redirecionamento 308 do `otica-rinopolis.vercel.app` para o domínio.
- Títulos e descrições por página ficam em `src/lib/seo.js`; os da home são editáveis no painel (informações → busca e redes).
- Artigos do blog: o endereço (`/blog/<slug>`) fica salvo quando o artigo ganha texto, e corrigir o título depois não muda o link (editável no painel). Artigo com menos de 300 caracteres de texto fica com `noindex` e fora do sitemap. Artigo criado depois do último deploy abre pela 404 até ser publicado (o visitante vê o artigo assim que o site confere o conteúdo atual).

## Desempenho
- Nenhum recurso de terceiros ao abrir o site: fontes (Outfit e DM Sans, via `@fontsource`, só os pesos usados) e imagens são servidas pelo próprio site. O mapa do Google só carrega depois do clique.
- Fotos de `public/fotos`: o build gera versões WebP em 480, 800 e 1200 px (`scripts/fotos-responsivas.js`, com `sharp`), e o site escolhe a do tamanho da tela (`srcset`), com o JPEG de reserva.
- O GSAP (animações) é baixado à parte, depois da página; a entrada animada não esconde o conteúdo que já veio pronto do build.
- Cache: `/assets` (arquivos com hash) por 1 ano; `/fotos` por 7 dias; `logo.png`, `logo-192.png`, `favicon.png` e `og-image.jpg` por 1 dia. O `server.js` também comprime (brotli/gzip) e responde 304 com ETag.

## Área do proprietário (`/admin`, ou "área do proprietário" no rodapé)
- Senha inicial: valor de `ADMIN_PASSWORD`. No primeiro acesso o painel **só deixa trocar a senha** antes de qualquer edição; a API recusa edições com a senha inicial. A nova fica salva como hash scrypt e, a partir daí, `ADMIN_PASSWORD` deixa de funcionar — quem configurou o servidor não conhece mais a senha.
- Regras da senha nova (`src/lib/senha.js`, conferidas no servidor e avisadas antes no painel): 10 a 200 caracteres; recusa só números, sequências (`1234567890`, `qwertyuiop`, `1q2w3e4r5t`), repetições, senhas e palavras comuns com complemento fraco (`senha12345`, `brasil2026`), o nome da loja (com ou sem espaço, acento, maiúsculas ou letras trocadas por números), a cidade, a rua, o CEP e os telefones da loja, e a senha inicial ou a atual (sem diferenciar maiúsculas e símbolos).
- A senha é normalizada do mesmo jeito ao criar, ao entrar e na senha inicial: espaços no começo e no fim não contam e letras acentuadas valem igual em qualquer aparelho (Unicode NFC). Assim, o que é salvo é sempre o que o login confere (um espaço a mais no fim, comum no celular ou ao colar, não tranca o proprietário).
- Edita informações (inclusive razão social, CNPJ e e-mail), horário e feriados (status "aberto agora" automático, só com horário informado), capa, faixa de aviso com data de fim, fotos e galeria, promoções (com validade e condições), eventos, armações, lentes/FAQ, sobre/equipe, depoimentos e blog. Cada campo traz a orientação do que pode ou não ser publicado.
- "Visão geral" → pendências: lista o que ainda falta para o site ficar só com dados reais.
- Salvamento automático no servidor, desfazer, aviso de conflito se outro aparelho editou, histórico de versões com restauração e exportar/importar backup.
- Sessão: 12 horas, ou 14 dias com "manter conectado" (a duração escolhida continua valendo depois de trocar a senha); "sair de todos os aparelhos" encerra todas as sessões. O cookie é assinado (HMAC) e a assinatura é conferida antes de qualquer leitura no Blob: cookie falso não gasta operações do armazenamento.
- Limite de tentativas de senha (`server/auth.js`, por instância): cada tentativa conta **antes** da conferência, então requisições simultâneas não furam o limite. Por IP: 5 erros bloqueiam por 30 s, dobrando a cada novo erro (até 15 min). Na Vercel o IP vem de `x-real-ip`, que o visitante não consegue forjar. Mais de 30 erros em 10 min, de quaisquer IPs (ataque distribuído), **não** bloqueiam ninguém — para que um atacante não consiga trancar o proprietário fora do painel —, mas cada login passa a esperar até 2 s antes da conferência e o limite por IP cai para 3. O login usa o registro da senha em cache e só relê o Blob quando a senha não confere, no máximo 1 vez por minuto.
- Liga/desliga botão flutuante do WhatsApp e animações.

## Rodar localmente
```bash
npm install
ADMIN_PASSWORD='uma-senha-local' npm run dev   # http://localhost:5173 — API e fotos ficam em ./data
```
Sem `ADMIN_PASSWORD`, o `npm run dev` aceita a senha de desenvolvimento definida em `server/auth.js` (só com `NODE_ENV=development`; nunca em produção, e o painel não aceita usá-la como senha definitiva). Sem `SESSION_SECRET`, fora de produção, a sessão usa uma chave temporária (cai ao reiniciar). Node 24 (o mesmo da Vercel: `engines` no `package.json` e Settings → Build and Deployment → Node.js Version 24.x).

Para testar o build: `npm run build && PORT=3000 node server.js` (sem `NODE_ENV=production` o servidor avisa que está em modo de desenvolvimento).

## Produção (situação atual)
- Site: https://otica-rinopolis.vercel.app — projeto Vercel `otica-rinopolis` (equipe `corrars-projects`, funções em São Paulo, `gru1`), ligado ao repositório `Corrar/otica-rinopolis`: cada push na `main` publica automaticamente.
- Variáveis em Production: `ADMIN_PASSWORD`, `SESSION_SECRET` e `BLOB_READ_WRITE_TOKEN` (Blob Store conectado só a Production). Para testar o painel em preview, crie um segundo Blob Store conectado só a Preview.
- **Titularidade e plano**: as contas Vercel e GitHub são do desenvolvedor. O plano Hobby da Vercel é só para uso pessoal não comercial; o site de uma loja deve ficar no **Pro**. Transferência das contas ou contrato de operador (LGPD, art. 39): `ENTREGA.md`, seção 10.

## Publicar na Vercel (do zero)
1. Importe o repositório na Vercel (framework: Vite — já configurado em `vercel.json`). Em Settings → Functions, escolha a região São Paulo (`gru1`).
2. Em **Storage**, crie um **Blob Store** com acesso **Public** (o código grava com `access: 'public'`) e região **São Paulo (`gru1`)** — a região não muda depois. Conecte ao projeto **só no ambiente Production** (isso cria `BLOB_READ_WRITE_TOKEN`).
3. Em **Settings → Environment Variables**, defina para Production `SESSION_SECRET` e `ADMIN_PASSWORD` (Sensitive). Sem eles, login e sessão respondem "Configuração pendente".
4. Faça o deploy. As funções em `api/` atendem `/api/*`; conteúdo, fotos e senha ficam no Blob.
5. Recomendado: Deploy Hook em `DEPLOY_HOOK_URL` e `CRON_SECRET` (seção "Publicação"); novo deploy.
6. Recomendado: em **Firewall**, regras de Rate Limit para `/api/login` (10 por minuto por IP, ação deny) e para `/api/*` (120 por minuto por IP, ação deny); em **Billing**, alerta de uso (o Blob tem cota mensal de operações).

## Publicar em VPS / outro servidor Node
```bash
npm install && npm run build
SESSION_SECRET=... ADMIN_PASSWORD=... DATA_DIR=/var/lib/odl PORT=3000 npm start
```
Sem `BLOB_READ_WRITE_TOKEN`, tudo é salvo em arquivos em `DATA_DIR` (faça backup dessa pasta).
As páginas prontas e o sitemap só mudam ao rodar `npm run build` de novo: agende-o uma vez por dia (cron do sistema) e, se quiser o botão "publicar alterações no Google", aponte `DEPLOY_HOOK_URL` para um gatilho de rebuild (ex.: CI).
`npm start` roda com `NODE_ENV=production`: o servidor não sobe sem `SESSION_SECRET` (32+ caracteres) e não há senha padrão. Atrás de nginx ou outro proxy, defina `TRUST_PROXY=1` (o limite de tentativas passa a usar o IP real do visitante). Os cabeçalhos de segurança e de cache são lidos do `vercel.json`.

## Estrutura
- `src/main.jsx` (entrada do navegador, com rede de segurança contra cache local ruim) e `src/entry-server.jsx` (renderização usada pelo `prerender`).
- `src/App.jsx` (rotas, SEO no cliente, foco e anúncios de navegação); `src/pages/` — uma página por rota, inclusive `Privacidade.jsx`, `Termos.jsx` e `Acessibilidade.jsx`.
- `src/components/` — `Layout.jsx` (cabeçalho, menu, rodapé), `bits.jsx` (fotos responsivas, `ArteMarca`, contato, mapa por clique, avisos), `Legal.jsx` (blocos das páginas legais), `Icons.jsx`.
- `src/admin/` — painel (`Admin.jsx`, `Configuracoes.jsx`, `campos.jsx`).
- `src/state/content.jsx` — conteúdo compartilhado pelo site e pelo painel (carregamento, cache local, salvamento com conflito e desfazer).
- `src/content/defaults.js` — conteúdo padrão (só dados confirmados) e migração de conteúdo salvo com textos de exemplo antigos.
- `src/lib/` — `seo.js` (títulos, JSON-LD, endereço oficial), `router.js`, `util.js` (horário de Brasília, status da loja, posts), `validar.js` (CNPJ, e-mail, links e fotos aceitos), `anim.js` + `anim-lazy.js` (GSAP sob demanda), `api.js`, `toast.js`.
- `scripts/prerender.js` (páginas prontas, sitemap, robots, 404, admin, publicado.json) e `scripts/fotos-responsivas.js` (WebP no build).
- `server/` — API (`router.js`), autenticação (`auth.js`: scrypt + cookie HttpOnly assinado, limite de tentativas, proteção CSRF por cabeçalho), armazenamento (`storage.js`: Vercel Blob ou arquivos) e fotos locais (`static.js`).
- `api/` — funções serverless da Vercel (reutilizam `server/router.js`): `content`, `session`, `login`, `logout`, `password`, `upload`, `history`, `publicar`, `cron-publicar`, `limpar-fotos`. `server.js` — servidor Node standalone.
- Segurança: cabeçalhos (CSP, HSTS, Permissions-Policy, `noindex` em `/admin` e `/api`) no `vercel.json`, aplicados também pelo `server.js`; envio de fotos confere o tipo real do arquivo (JPG, PNG, WebP, até 3 MB).
- `public/fotos/` — fotos reais da loja (`FOTOS.md`); `public/og-image.jpg` (fachada, compartilhamento), `public/logo.png` (logo sem margem, cabeçalho e rodapé), `public/logo-192.png` (ícone quadrado: iPhone e dados estruturados) e `public/favicon.png` (o olho do logo, aba do navegador).
- `project/`, `chats/` — pacote original do Claude Design, só como referência histórica: senhas, textos e dados de lá (conteúdo de exemplo) **não valem** para o site.

## Conteúdo
O conteúdo padrão só traz dados confirmados: endereço, telefones, Instagram e as 8 fotos reais da loja. O que o proprietário ainda não informou fica vazio e a seção correspondente some do site sozinha (sem "+0 anos", "CNPJ" solto ou "aberto agora" inventado). A lista do que falta está no painel ("visão geral" → pendências) e, completa e comentada, em `ENTREGA.md`, seção 4.
