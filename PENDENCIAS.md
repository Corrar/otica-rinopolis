# Pendências técnicas — checklist de entrega

Atualizado em 30/10/2026 · site: https://otica-rinopolis.vercel.app
Guia do proprietário (dados a preencher, Google, backup, privacidade, hospedagem): **`ENTREGA.md`**. Detalhes técnicos: `README.md`.

## 1. Antes do merge na `main`
- [x] `ADMIN_PASSWORD` em Production (Sensitive, forte). Não existe senha padrão em produção.
- [x] `BLOB_READ_WRITE_TOKEN` só em Production (previews sem armazenamento e sem `ADMIN_PASSWORD` — esperado).
- [ ] Recriar `BLOB_READ_WRITE_TOKEN` como **Sensitive** (hoje *Encrypted*; a Vercel aponta "readable-secret": qualquer membro da equipe lê o valor, que dá leitura e escrita em todo o conteúdo e no registro da senha). Settings → Environment Variables → apagar e criar de novo, só Production, com o mesmo valor do Blob Store (ou desconectar e reconectar o store marcando Sensitive). Vale a partir do próximo deploy.
- [x] Deployment Protection → Vercel Authentication: **Standard Protection** (`prod_deployment_urls_and_all_previews`, conferido em 30/10/2026). As URLs próprias de todos os deploys (os 8 antigos de produção e os que cada publicação criar) só abrem com login; o domínio de produção, o cron e o Deploy Hook continuam públicos.
- [ ] Até o merge e a limpeza da seção 2: **não usar Instant Rollback nem Redeploy** nos deploys antigos de produção (eles têm o conteúdo de exemplo e o código antigo do painel, que aceitava a senha de desenvolvimento quando não havia `ADMIN_PASSWORD`).
- [ ] Conferir que `SESSION_SECRET` (Production) tem 32+ caracteres; se não, gerar outro (`openssl rand -hex 32`).
- [ ] `npm run build` sem erros e o grep de conteúdo de exemplo zerado (comando no `README.md`, seção "Publicação").
- [ ] Recomendado: Deploy Hook (Settings → Git → Deploy Hooks, branch `main`) em `DEPLOY_HOOK_URL` e `CRON_SECRET` (16+), ambos Sensitive em Production. Sem eles o botão "publicar alterações no Google" não aparece e cada publicação precisa de Redeploy manual.
- [ ] Vercel → Firewall: Rate Limit em `/api/login` (10/min por IP, deny) e em `/api/*` (120/min por IP, deny). Vercel → Billing: alerta de uso.
- [x] Node.js 24.x em Settings → Build and Deployment, igual ao `engines` do `package.json` (`24.x`: a Vercel não troca sozinha de versão maior).

## 2. Publicação (nesta ordem)
1. [ ] Merge na `main` e aguardar o deploy. Hoje a produção ainda serve `dpl_JEJJjzoXBAicnx4TphwofgHYGhrY` (commit `d73634c`): conteúdo de exemplo no ar (CNPJ 00.000.000/0001-00, depoimentos inventados, Unimed, "Outubro: 2ª armação", evento de "aferição de pressão ocular" no JSON-LD) e painel antigo. A entrega só está no ar depois deste passo.
2. [ ] Deployments: Production é do último commit. No log do build: "… versões WebP de … fotos" e "prerender: … (conteúdo padrão)" (ou "salvo no painel", se já houver versão salva).
3. [ ] Na URL de produção: a home não tem mais "00.000.000/0001-00", "Dia da saúde ocular", "Ana Paula", "Unimed", "Outubro: 2ª armação", "+10 anos", `openingHoursSpecification` nem `fonts.googleapis.com`; `/api/session` sem login não mostra `"armazenamento":"nenhum"`; a senha de desenvolvimento antiga é recusada em `/admin`.
4. [ ] Logado em `/admin` com a senha inicial, abrir `/api/session` no mesmo navegador: `"armazenamento":"blob"` (e `"publicar":true` com o Deploy Hook). Sair **sem** criar a senha definitiva.
5. [ ] **Apagar os 8 deploys de produção anteriores à limpeza** (todos com o conteúdo de exemplo), só depois de o novo deploy estar READY e servindo o domínio: Deployments → ⋯ → Delete, ou `vercel remove <url> --scope corrars-projects --safe=false`. URLs (todas terminam em `-corrars-projects.vercel.app`): `otica-rinopolis-oxu7qs1c0` (dpl_JEJJjzoXBAicnx4TphwofgHYGhrY), `-98ndkfflq` (dpl_Gh7eb2B1nGQHUwWKyc35w5PjXp1p), `-rduq6f4x3` (dpl_BYkvBYLgXMhB5UyD7rQB3n6xaCAS), `-4z3u8yax7` (dpl_G8Trh8yPeyDuEz2u3PHYZQRT4EZn), `-8cvr1waix` (dpl_3QPJdCFFkjkB2phbpNC5ueHTyMmg), `-25r2mp7z0` (dpl_5VfDyhsZkFKPBoSLT784z3Gfjyb7), `-6recudsds` (dpl_DSZUZzr3McV5Myh6a73YgkKeUkAg) e `-gr8x4tux7` (dpl_EaANMAkHQRf18vzkV62aKbntYYWa). Os dois primeiros são candidatos a Instant Rollback: apagá-los impede que um rollback traga o conteúdo de exemplo de volta. Os previews antigos também podem ser apagados (já protegidos por login).
6. [ ] Entrega ao proprietário: senha inicial por canal privado; ele cria a senha, preenche o essencial (`ENTREGA.md`, seção 4), publica e exporta o primeiro backup.
7. [ ] PageSpeed Insights e Teste de pesquisa aprimorada (`/`, `/lentes`, um artigo) na URL de produção.
8. [ ] Search Console: com `*.vercel.app`, a verificação é por arquivo HTML — colocar o `google….html` que o proprietário receber em `public/` e publicar. Enviar `/sitemap.xml` e pedir reindexação de `/`, `/convenios`, `/sobre` e `/contato`; se o Google ainda mostrar o CNPJ fictício ou o evento antigo, usar "Remover conteúdo desatualizado".

**Manutenção:** cada publicação (botão do painel, cron diário ou push) cria um deploy que guarda o conteúdo da época no HTML. Em pedido de eliminação de dados (pessoa ou depoimento retirado), apagar os deploys de produção anteriores à publicação que tirou o item (`README.md`, "Pedido de eliminação de dados"); a Política de Privacidade promete apagar essas cópias.

## 3. Hospedagem e titularidade (decidir com o proprietário — `ENTREGA.md`, seção 10)
- [ ] Transferir projeto Vercel e repositório para contas da loja **ou** contrato de prestação de serviço com cláusulas de operador (LGPD, art. 39).
- [ ] Plano: Hobby é só para uso não comercial → Pro.
- [ ] Tornar privado o repositório `Corrar/otica-rinopolis` (público; o histórico e `chats/chat1.md` têm a senha de desenvolvimento antiga e o conteúdo de exemplo). Depois do merge essa senha não vale em produção (só com `NODE_ENV=development`).
- [ ] Novo Blob Store (se houver transferência): acesso Public, região São Paulo (`gru1`), conectado só a Production.
- [ ] Apagar o projeto vazio `otica-digital-look` na Vercel (Settings → General → Delete Project).

## 4. Código que depende de resposta do proprietário
- [ ] Páginas legais revisadas pelo advogado: ajustar texto, `RETENCAO` (prazos do contador), foro (se citar comarca) e as datas `ATUALIZADA`/`REVISADA` (`src/pages/Privacidade.jsx`, `Termos.jsx`, `Acessibilidade.jsx`).
- [ ] Porte para a LGPD (Res. CD/ANPD nº 2/2022, arts. 2º a 4º), confirmado com o contador ou o advogado: só então a Política de Privacidade pode voltar a citar a dispensa de encarregado e o prazo em dobro; se não se enquadrar, publicar o encarregado (LGPD, art. 41) em `src/pages/Privacidade.jsx`.
- [ ] Crediário com SPC/Serasa ou promoções por WhatsApp: incluir na Política de Privacidade.
- [ ] Catálogo trinta.shop confirmado: link "ver catálogo" (não há campo no painel).
- [ ] Atende Santópolis do Aguapeí: incluir em `areaServed` (`src/lib/seo.js`, `dadosOtica`).
- [ ] Horário com pausa para almoço, horário diferente por dia útil ou abertura aos domingos: o painel só tem abertura e fechamento de seg–sex e de sábado, e o domingo é sempre "fechado" (`src/lib/util.js`, `statusLoja`; `seo.js`, `horarioOtica`).
- [ ] Domínio próprio: Settings → Domains, novo deploy (o endereço oficial vem de `SITE_URL` ou do domínio de produção), redirect 308 do `otica-rinopolis.vercel.app`, nova propriedade no Search Console.

## 5. Conteúdo (pelo painel, pelo proprietário)
Lista completa e comentada em `ENTREGA.md`, seção 4; o painel mostra as mesmas pendências em "visão geral". Essenciais antes de divulgar: revisar os textos gerais escritos na entrega (capa, "como funciona", diferenciais, lentes, blog); razão social, CNPJ e e-mail; horário e feriados; formas de pagamento; tipos de lente de contato que a loja vende (a lista padrão está vazia); aviso da receita na saudação do WhatsApp Business (a Política de Privacidade cita esse aviso); datas do blog; link do Perfil da Empresa no Google; confirmar Facebook e catálogo.

## Referências
- Repositório `Corrar/otica-rinopolis` (branch `main`; cada push publica). Vercel: equipe `corrars-projects`, projeto `otica-rinopolis`, funções em `gru1`.
