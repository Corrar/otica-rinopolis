# Pendências — Ótica Digital Look

Atualizado em 15/10/2026. Site no ar: https://otica-rinopolis.vercel.app

## 1. Ligar o armazenamento (bloqueia o painel)
O painel `/admin` abre, mas **não salva nada** até existir um Blob Store. A integração do Claude com a Vercel não tem permissão para criá-lo (erro 403), então precisa ser feito no painel da Vercel:
1. Projeto **otica-rinopolis** → **Storage** → **Create** → **Blob** → conectar a este projeto (cria `BLOB_READ_WRITE_TOKEN` sozinho).
2. **Deployments** → **Redeploy** no deploy mais recente.
3. Pedir ao Claude para confirmar que o painel passou a salvar (o aviso vermelho no painel some e "status agora" mostra "nuvem (Vercel Blob)").

## 2. Segurança
- Entrar em `/admin` com a senha inicial `digitallook` e **trocar a senha** (configurações → trocar senha). Até lá, qualquer pessoa que conheça a senha padrão entra.

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
