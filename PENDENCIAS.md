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

## 5. Opcional
- Domínio próprio (ex.: oticadigitallook.com.br) apontado para o projeto na Vercel.

## Referências
- Repositório: `Corrar/otica-rinopolis` (branch `main`; cada push publica automaticamente).
- Vercel: equipe `corrars-projects`, projeto `otica-rinopolis` (funções em São Paulo, gru1). `SESSION_SECRET` já configurado.
- Detalhes técnicos e como rodar localmente: `README.md`.
