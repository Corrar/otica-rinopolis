# Pendências — Ótica Digital Look

Atualizado em 15/10/2026. Site no ar: https://otica-rinopolis.vercel.app

## 1. Armazenamento
- Blob Store conectado **só ao ambiente Production** (`BLOB_READ_WRITE_TOKEN`) — feito. Passa a valer no próximo deploy de produção.
- Deploys de preview ficam sem armazenamento (o painel avisa e não salva) — esperado. Para testar o painel em preview, criar um segundo Blob Store conectado só a Preview e manter a proteção dos previews ligada.
- Depois do deploy, conferir que o painel salva ("status agora" mostra "nuvem (Vercel Blob)").

## 2. Segurança
- `ADMIN_PASSWORD` (senha inicial, definida em `ADMIN_PASSWORD` na Vercel, Production) — feito. Não existe mais senha padrão em produção: sem a variável, o painel responde "Configuração pendente".
- Conferir que `SESSION_SECRET` tem pelo menos 32 caracteres (se for menor, login e sessão respondem "Configuração pendente"; gerar outra com `openssl rand -hex 32`).
- Na entrega: o dono entra em `/admin` com a senha inicial e o painel **obriga a criar uma senha própria** (mín. 10 caracteres) antes de editar. Depois disso, a senha inicial deixa de funcionar e o desenvolvedor não conhece mais a senha.
- Tornar **privado** o repositório `Corrar/otica-rinopolis`: a senha padrão antiga continua no histórico do git.
- Vercel → **Firewall**: regra de Rate Limit para `/api/login` (10 por minuto por IP, ação deny).
- Vercel → **Billing**: alerta de uso do Blob (operações avançadas têm cota mensal; conferir a cota do plano).
- Exportar um backup do conteúdo por mês (configurações → exportar backup).

## 3. Limpeza
- Apagar o projeto vazio `otica-digital-look` na Vercel (sobrou de antes do repositório): Settings → General → Delete Project.

## 4. Conteúdo (pelo painel, depois do item 1)
- Fotos reais: o site já mostra fotos de exemplo em todos os campos (lista em `FOTOS.md`); trocar pelas reais da loja, da equipe e das armações. A "visão geral" do painel conta quantas de exemplo ainda faltam trocar.
- Nomes reais da equipe, marcas que trabalha, CNPJ, convênios definitivos.
- Conferir horários, feriados, promoções, eventos e depoimentos.

## 5. Google (SEO local) — o que só o dono pode fazer
- **Perfil da Empresa no Google** (google.com/business): é o que mais pesa para aparecer em "ótica em Rinópolis" e no mapa. Cadastrar/reivindicar a Ótica Digital Look com o mesmo nome, endereço (R. Prof. Sud Menucci, 228 – Centro) e telefone do site, categoria "Ótica", horário, fotos da loja e o link do site. Pedir avaliações aos clientes.
- **Google Search Console** (search.google.com/search-console): adicionar o site, enviar o sitemap (`/sitemap.xml`) e pedir indexação da home.
- **Telefone fixo** (18) 3583-1566: já está no site (contato, rodapé e dados para o Google). Use o mesmo número no Perfil da Empresa.
- Domínio próprio (item 6) ajuda a passar confiança e facilita divulgar o endereço.

## 6. Opcional
- Domínio próprio (ex.: oticadigitallook.com.br) apontado para o projeto na Vercel.

## Referências
- Repositório: `Corrar/otica-rinopolis` (branch `main`; cada push publica automaticamente).
- Vercel: equipe `corrars-projects`, projeto `otica-rinopolis` (funções em São Paulo, gru1). `SESSION_SECRET` já configurado.
- Detalhes técnicos e como rodar localmente: `README.md`.
