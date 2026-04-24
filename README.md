# Messenlead

Ferramenta Messenger-only inspirada em builders como Manychat, feita para Cloudflare Pages.

## O que já vem pronto

- Builder visual de fluxos para Facebook Messenger.
- Login Meta para listar as Páginas administradas pela conta conectada.
- Inbox real por Página usando Graph API e Page Access Token resolvido no servidor.
- Tokens das Páginas salvos no D1 após o login Meta.
- Persistência de fluxos no Cloudflare D1 por Página.
- Blocos de gatilho, mensagem, condição, espera e ação.
- Inbox local para conversas da Página.
- Base de assinantes com PSID, tags e status.
- Simulador de automação.
- Disparos simulados respeitando o conceito de janela/política do Messenger.
- Exportação/importação de workspace em JSON.
- Cloudflare Pages Functions para webhook e envio server-side.

## Banco de dados

Para salvar fluxos de forma robusta, crie um banco **Cloudflare D1** e vincule ao Pages com o binding:

```txt
DB
```

Pelo painel:

1. Cloudflare Dashboard → Workers & Pages → D1 SQL Database.
2. Crie um banco, por exemplo `messenlead-db`.
3. Abra o projeto Pages `Messenlead`.
4. Vá em `Settings` → `Functions` → `D1 database bindings`.
5. Adicione:

```txt
Variable name: DB
D1 database: messenlead-db
```

As Functions criam a tabela `flows` automaticamente quando a API é chamada. O arquivo [migrations/0001_flows.sql](migrations/0001_flows.sql) existe caso você prefira aplicar a migração manualmente.

As Páginas conectadas via OAuth ficam na tabela `connected_pages`; os Page Access Tokens são usados pelo webhook para responder mensagens de cada Página. O arquivo [migrations/0002_connected_pages.sql](migrations/0002_connected_pages.sql) existe para aplicação manual.

## Rodar localmente

Como a interface é estática, você pode abrir `public/index.html` no navegador.

Para testar as Functions localmente, use Wrangler:

```bash
npm install
npm run dev
```

## Deploy no Cloudflare Pages

Configuração recomendada:

- Framework preset: `None`
- Build command: deixe vazio ou use `npm run check`
- Build output directory: `public`
- Functions directory: `functions`

Variáveis de ambiente necessárias em Cloudflare Pages:

```txt
META_APP_ID=app-id-da-meta
META_APP_SECRET=app-secret-da-meta
SESSION_SECRET=uma-chave-longa-aleatoria
META_REDIRECT_URI=https://seu-projeto.pages.dev/api/auth/facebook/callback
META_SCOPES=pages_show_list,pages_read_engagement,pages_messaging,pages_manage_metadata
MESSENGER_VERIFY_TOKEN=messenlead-verify-token
MESSENGER_APP_SECRET=app-secret-da-meta
MESSENLEAD_OPERATOR_TOKEN=um-token-forte-para-operador
MESSENLEAD_FLOW_JSON={"flows":[]}
```

`MESSENLEAD_FLOW_JSON` agora é fallback. Em produção, os fluxos do canvas são salvos no D1 por Página.

Se não houver fluxo ativo para uma mensagem recebida, o webhook não envia resposta automática.

Para multi-Página, `MESSENGER_PAGE_ACCESS_TOKEN` não é obrigatório: o app usa Facebook Login, busca as Páginas autorizadas e salva os Page Access Tokens no D1. Você só precisa de `MESSENGER_PAGE_ACCESS_TOKEN` se quiser operar uma única Página manualmente sem OAuth.

## Configurar na Meta

No Meta for Developers:

1. Crie ou abra o app.
2. Adicione o produto Messenger.
3. Adicione/configure Facebook Login para o OAuth do painel.
4. Em `Valid OAuth Redirect URIs`, inclua:

```txt
https://seu-projeto.pages.dev/api/auth/facebook/callback
```

5. Conecte as Páginas pelo botão `Entrar com Facebook` dentro do Messenlead.
6. Configure o webhook:

```txt
https://seu-projeto.pages.dev/api/messenger/webhook
```

7. Use o mesmo `MESSENGER_VERIFY_TOKEN` configurado no Cloudflare.
8. Assine os campos:

```txt
messages, messaging_postbacks, messaging_optins
```

## Endpoints

Verificação e recebimento de eventos:

```txt
GET/POST /api/messenger/webhook
```

Login Meta e dados multi-Página:

```txt
GET  /api/auth/facebook/start
GET  /api/auth/facebook/callback
POST /api/auth/logout
GET  /api/flows?pageId=PAGE_ID
POST /api/flows
DELETE /api/flows?pageId=PAGE_ID&flowId=FLOW_ID
GET  /api/meta/me
GET  /api/meta/pages
GET  /api/meta/conversations?pageId=PAGE_ID
GET  /api/meta/messages?pageId=PAGE_ID&conversationId=CONVERSATION_ID
POST /api/meta/send
```

Envio manual server-side:

```http
POST /api/messenger/send
Authorization: Bearer MESSENLEAD_OPERATOR_TOKEN
Content-Type: application/json

{
  "psid": "PSID_...",
  "text": "Mensagem enviada pela página"
}
```

## Observações de produção

Os fluxos já podem ficar no D1. O `localStorage` permanece como cache/fallback local quando o usuário ainda não fez login ou quando o binding `DB` não foi configurado. Para completar o produto, mova também assinantes, mensagens, auditoria e campanhas para D1 ou Durable Objects.

Nunca coloque `MESSENGER_PAGE_ACCESS_TOKEN` no frontend.
