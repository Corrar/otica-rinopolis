# Ótica Digital Look — site institucional

Site da Ótica Digital Look (Rinópolis/SP), implementado a partir do design do Claude Design (`project/`, direção **1a Vitrine**).
Vite + React + GSAP/ScrollTrigger, com **área do proprietário com backend real**: o que é editado no painel aparece para todos os visitantes.

## Páginas
`/` início · `/sobre` · `/armacoes` (filtros) · `/lentes` (FAQ) · `/convenios` (promoções, eventos, convênios) · `/blog` · `/blog/<artigo>` · `/contato` (formulário → WhatsApp) · `/admin` (área do proprietário).
Links antigos com `#admin`, `#sobre` etc. redirecionam para as URLs novas.

## SEO (Google)
- `npm run build` gera, além do app, o **HTML pronto de cada página** (`scripts/prerender.js`): título, descrição, link canônico, Open Graph e dados estruturados (schema.org `Optician` com endereço, horário e WhatsApp; `FAQPage` em lentes; `Event` para eventos; `BlogPosting` nos artigos; `BreadcrumbList`). O Google lê o conteúdo sem precisar executar o JavaScript.
- Também gera `sitemap.xml`, `robots.txt` (bloqueia `/admin` e `/api/`), `404.html` (com status 404 de verdade) e `app.html` (usada por `/admin` e por artigos criados depois do último deploy).
- O conteúdo usado no build é o último salvo no painel; no navegador o site sempre mostra o conteúdo atual. Depois de mudanças grandes no painel (artigos novos, textos), faça um **Redeploy** para atualizar as páginas geradas e o sitemap.
- O endereço do site vem de `SITE_URL` ou do domínio de produção da Vercel; ao ligar um domínio próprio, basta fazer um novo deploy.
- Títulos e descrições por página ficam em `src/lib/seo.js`; os da home são editáveis no painel (configurações).
- Artigos do blog só com título ficam fora do Google (`noindex`) até ganharem texto (mín. 300 caracteres).

## Área do proprietário (`/admin`, ou "área do proprietário" no rodapé)
- Senha inicial: valor de `ADMIN_PASSWORD` (obrigatório em produção; sem ele o painel avisa "Configuração pendente"). No primeiro acesso o painel **só deixa trocar a senha** (mín. 10 caracteres) antes de qualquer edição; a nova fica salva como hash scrypt e, a partir daí, `ADMIN_PASSWORD` deixa de funcionar — quem configurou o servidor não conhece mais a senha.
- Edita informações, horários e feriados (status "aberto agora" automático), capa, faixa de aviso, fotos e galeria, promoções, eventos, armações, lentes/FAQ, sobre/equipe, depoimentos e blog.
- Salvamento automático no servidor, desfazer, aviso de conflito se outro aparelho editou, histórico de versões com restauração (guarda as 300 mais recentes e todas dos últimos 30 dias), exportar/importar backup (aceita também backups do protótipo com fotos embutidas).
- **Backup: exporte um arquivo por mês** (configurações → exportar backup) e guarde fora do site; o painel mostra há quantos dias foi o último.
- Privacidade: "limpar fotos não usadas" e "apagar histórico e fotos antigas" (configurações) apagam de vez fotos e itens removidos (ex.: alguém que saiu da equipe).
- Sessão: "manter conectado" vale 14 dias; "sair de todos os aparelhos" encerra todas as sessões.
- Liga/desliga botão flutuante do WhatsApp e animações.

## Rodar localmente
```bash
npm install
ADMIN_PASSWORD='uma-senha-local' npm run dev   # http://localhost:5173 — API e fotos ficam em ./data
```
Sem `ADMIN_PASSWORD`, o `npm run dev` aceita a senha de desenvolvimento definida em `server/auth.js` (só com `NODE_ENV=development`; nunca em produção). Sem `SESSION_SECRET`, fora de produção, a sessão usa uma chave temporária (cai ao reiniciar). Node 20 ou mais novo.

## Produção
- Site: https://otica-rinopolis.vercel.app (projeto Vercel `otica-rinopolis`, ligado a este repositório — cada push na `main` publica automaticamente).
- Variáveis (Settings → Environment Variables): `SESSION_SECRET` e `ADMIN_PASSWORD` (Sensitive, ambiente Production). O Blob Store está conectado **só ao ambiente Production** (`BLOB_READ_WRITE_TOKEN`): deploys de preview ficam sem armazenamento — o painel avisa e não salva, o que é esperado. Para testar o painel em preview, crie um segundo Blob Store conectado só a Preview.

## Publicar na Vercel (recomendado)
1. Importe o repositório na Vercel (framework: Vite — já configurado em `vercel.json`).
2. Em **Storage**, crie um **Blob Store** e conecte ao projeto (isso cria `BLOB_READ_WRITE_TOKEN`).
3. Em **Settings → Environment Variables**, defina para Production `SESSION_SECRET` (32+ caracteres aleatórios, ex. `openssl rand -hex 32`) e `ADMIN_PASSWORD` (12+ caracteres aleatórios), ambos como Sensitive. Sem eles, login e sessão respondem "Configuração pendente".
4. Faça o deploy. As funções em `api/` atendem `/api/*`; conteúdo, fotos e senha ficam no Blob.
5. Recomendado: em **Firewall**, regra de Rate Limit para `/api/login` (10 por minuto por IP, ação deny); em **Billing**, alerta de uso do Blob (operações avançadas têm cota mensal).

## Publicar em VPS / outro servidor Node
```bash
npm install && npm run build
SESSION_SECRET=... ADMIN_PASSWORD=... DATA_DIR=/var/lib/odl PORT=3000 npm start
```
Sem `BLOB_READ_WRITE_TOKEN`, tudo é salvo em arquivos em `DATA_DIR` (faça backup dessa pasta).
`npm start` roda com `NODE_ENV=production`: o servidor não sobe sem `SESSION_SECRET` (32+ caracteres) e não há senha padrão. Atrás de nginx ou outro proxy, defina `TRUST_PROXY=1` (o limite de tentativas passa a usar o IP real do visitante). Os cabeçalhos de segurança são lidos do `vercel.json`.

## Estrutura
- `src/` — site React (`pages/`, `admin/`, `components/`, `lib/anim.js` com as animações GSAP, `content/defaults.js` com o conteúdo padrão).
- `server/` — API (`router.js`), autenticação (`auth.js`: scrypt + cookie HttpOnly assinado, limite de tentativas, proteção CSRF por cabeçalho) e armazenamento (`storage.js`: Vercel Blob ou arquivos).
- Segurança: cabeçalhos (CSP, HSTS, Permissions-Policy, `noindex` em `/admin` e `/api`) no `vercel.json`, aplicados também pelo `server.js`; envio de fotos confere o tipo real do arquivo (JPG, PNG, WebP, até 3 MB).
- `api/` — funções serverless da Vercel (reutilizam `server/router.js`). `server.js` — servidor Node standalone.
- `project/`, `chats/` — pacote original do Claude Design (referência).

## Pendências de conteúdo
O conteúdo padrão só traz dados confirmados: endereço, telefones, Instagram e as 8 fotos reais da loja em `public/fotos/` (lista em `FOTOS.md`); onde falta foto, aparece a arte da marca (olho do logo em SVG). O que o proprietário ainda não informou — horário, formas de pagamento e parcelas, convênios, marcas, razão social/CNPJ/e-mail, história e ano de fundação, equipe, promoções, eventos e depoimentos — fica vazio e a seção correspondente some do site sozinha (sem "+0 anos", "CNPJ" solto ou "aberto agora" inventado). O painel lista o que falta em "visão geral" → pendências e explica, em cada campo, o que pode ou não ser publicado (ex.: ótica não anuncia exame de vista; prazo, garantia e gratuidade publicados obrigam a loja).
