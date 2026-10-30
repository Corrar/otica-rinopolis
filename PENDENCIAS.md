# Pendências técnicas — checklist de entrega

Atualizado em 30/10/2026 · site: https://otica-rinopolis.vercel.app
Guia do proprietário (dados a preencher, Google, backup, privacidade, hospedagem): **`ENTREGA.md`**. Detalhes técnicos: `README.md`.

## 1. Antes do merge na `main`
- [x] `ADMIN_PASSWORD` em Production (Sensitive, forte). Não existe senha padrão em produção.
- [x] `BLOB_READ_WRITE_TOKEN` só em Production (previews sem armazenamento — esperado).
- [ ] Conferir que `SESSION_SECRET` (Production) tem 32+ caracteres; se não, gerar outro (`openssl rand -hex 32`).
- [ ] `npm run build` sem erros e o grep de conteúdo de exemplo zerado (comando no `README.md`, seção "Publicação").
- [ ] Recomendado: Deploy Hook (Settings → Git → Deploy Hooks, branch `main`) em `DEPLOY_HOOK_URL` e `CRON_SECRET` (16+), ambos Sensitive em Production. Sem eles o botão "publicar alterações no Google" não aparece e cada publicação precisa de Redeploy manual.
- [ ] Vercel → Firewall: Rate Limit em `/api/login` (10/min por IP, deny) e em `/api/*` (120/min por IP, deny). Vercel → Billing: alerta de uso.
- [x] Node.js 24.x em Settings → Build and Deployment, igual ao `engines` do `package.json` (`24.x`: a Vercel não troca sozinha de versão maior).

## 2. Publicação (nesta ordem)
1. [ ] Merge na `main` e aguardar o deploy.
2. [ ] Deployments: Production é do último commit.
3. [ ] Logado em `/admin` com a senha inicial, abrir `/api/session` no mesmo navegador: `"armazenamento":"blob"` (e `"publicar":true` com o Deploy Hook). Sair **sem** criar a senha definitiva.
4. [ ] Entrega ao proprietário: senha inicial por canal privado; ele cria a senha, preenche o essencial (`ENTREGA.md`, seção 4), publica e exporta o primeiro backup.
5. [ ] PageSpeed Insights e Teste de pesquisa aprimorada (`/`, `/lentes`, um artigo) na URL de produção.
6. [ ] Search Console: com `*.vercel.app`, a verificação é por arquivo HTML — colocar o `google….html` que o proprietário receber em `public/` e publicar. Enviar `/sitemap.xml`.

## 3. Hospedagem e titularidade (decidir com o proprietário — `ENTREGA.md`, seção 10)
- [ ] Transferir projeto Vercel e repositório para contas da loja **ou** contrato de prestação de serviço com cláusulas de operador (LGPD, art. 39).
- [ ] Plano: Hobby é só para uso não comercial → Pro.
- [ ] Tornar privado o repositório `Corrar/otica-rinopolis` (público; o histórico tem a senha de desenvolvimento antiga e o conteúdo de exemplo).
- [ ] Novo Blob Store (se houver transferência): acesso Public, região São Paulo (`gru1`), conectado só a Production.
- [ ] Apagar o projeto vazio `otica-digital-look` na Vercel (Settings → General → Delete Project).

## 4. Código que depende de resposta do proprietário
- [ ] Páginas legais revisadas pelo advogado: ajustar texto, `RETENCAO` (prazos do contador), foro (se citar comarca) e as datas `ATUALIZADA`/`REVISADA` (`src/pages/Privacidade.jsx`, `Termos.jsx`, `Acessibilidade.jsx`).
- [ ] Crediário com SPC/Serasa ou promoções por WhatsApp: incluir na Política de Privacidade.
- [ ] Catálogo trinta.shop confirmado: link "ver catálogo" (não há campo no painel).
- [ ] Atende Santópolis do Aguapeí: incluir em `areaServed` (`src/lib/seo.js`, `dadosOtica`).
- [ ] Horário com pausa para almoço: o painel só tem abertura e fechamento (`src/lib/util.js`, `statusLoja`; `seo.js`, `horarioOtica`).
- [ ] Domínio próprio: Settings → Domains, novo deploy (o endereço oficial vem de `SITE_URL` ou do domínio de produção), redirect 308 do `otica-rinopolis.vercel.app`, nova propriedade no Search Console.

## 5. Conteúdo (pelo painel, pelo proprietário)
Lista completa e comentada em `ENTREGA.md`, seção 4; o painel mostra as mesmas pendências em "visão geral". Essenciais antes de divulgar: razão social, CNPJ e e-mail; horário e feriados; formas de pagamento; datas do blog; link do Perfil da Empresa no Google; confirmar Facebook e catálogo.

## Referências
- Repositório `Corrar/otica-rinopolis` (branch `main`; cada push publica). Vercel: equipe `corrars-projects`, projeto `otica-rinopolis`, funções em `gru1`.
