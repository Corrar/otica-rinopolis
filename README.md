# Ótica Digital Look — site institucional

Site da Ótica Digital Look (Rinópolis/SP), implementado a partir do design do Claude Design (`project/`, direção **1a Vitrine**).
Vite + React + GSAP/ScrollTrigger, com **área do proprietário com backend real**: o que é editado no painel aparece para todos os visitantes.

## Páginas
`/` início · `/sobre` · `/armacoes` (filtros) · `/lentes` (FAQ) · `/convenios` (promoções, eventos, convênios) · `/blog` · `/blog/<artigo>` · `/contato` (formulário → WhatsApp) · `/admin` (área do proprietário).
Links antigos com `#admin`, `#sobre` etc. redirecionam para as URLs novas.

## Área do proprietário (`/admin`, ou "área do proprietário" no rodapé)
- Senha inicial: valor de `ADMIN_PASSWORD` (se não definido, `digitallook`). O painel pede para trocar; a senha nova fica salva como hash scrypt.
- Edita informações, horários e feriados (status "aberto agora" automático), capa, faixa de aviso, fotos e galeria, promoções, eventos, armações, lentes/FAQ, sobre/equipe, depoimentos e blog.
- Salvamento automático no servidor, desfazer, aviso de conflito se outro aparelho editou, histórico das últimas 40 versões com restauração, exportar/importar backup (aceita também backups do protótipo com fotos embutidas).
- Liga/desliga botão flutuante do WhatsApp e animações.

## Rodar localmente
```bash
npm install
npm run dev          # http://localhost:5173 — API e fotos ficam em ./data
```

## Publicar na Vercel (recomendado)
1. Importe o repositório na Vercel (framework: Vite — já configurado em `vercel.json`).
2. Em **Storage**, crie um **Blob Store** e conecte ao projeto (isso cria `BLOB_READ_WRITE_TOKEN`).
3. Em **Settings → Environment Variables**, defina `SESSION_SECRET` (texto longo aleatório, ex. `openssl rand -hex 32`) e `ADMIN_PASSWORD`.
4. Faça o deploy. As funções em `api/` atendem `/api/*`; conteúdo, fotos e senha ficam no Blob.

## Publicar em VPS / outro servidor Node
```bash
npm install && npm run build
SESSION_SECRET=... ADMIN_PASSWORD=... DATA_DIR=/var/lib/odl PORT=3000 npm start
```
Sem `BLOB_READ_WRITE_TOKEN`, tudo é salvo em arquivos em `DATA_DIR` (faça backup dessa pasta).

## Estrutura
- `src/` — site React (`pages/`, `admin/`, `components/`, `lib/anim.js` com as animações GSAP, `content/defaults.js` com o conteúdo padrão).
- `server/` — API (`router.js`), autenticação (`auth.js`: scrypt + cookie HttpOnly assinado, limite de tentativas, proteção CSRF por cabeçalho) e armazenamento (`storage.js`: Vercel Blob ou arquivos).
- `api/` — funções serverless da Vercel (reutilizam `server/router.js`). `server.js` — servidor Node standalone.
- `project/`, `chats/` — pacote original do Claude Design (referência).

## Pendências de conteúdo
Fotos reais, nomes da equipe, marcas, CNPJ e convênios definitivos — o painel lista o que falta em "visão geral".
