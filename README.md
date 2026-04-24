# Messenlead

Ferramenta Messenger-only inspirada em builders como Manychat, feita para Cloudflare Pages.

## O que já vem pronto

- Builder visual de fluxos para Facebook Messenger.
- Login Meta para listar as Páginas administradas pela conta conectada.
- Inbox real por Página usando Graph API e Page Access Token resolvido no servidor.
- Blocos de gatilho, mensagem, condição, espera e ação.
- Inbox local para conversas da Página.
- Base de assinantes com PSID, tags e status.
- Simulador de automação.
- Disparos simulados respeitando o conceito de janela/política do Messenger.
- Exportação/importação de workspace em JSON.
- Cloudflare Pages Functions para webhook e envio server-side.

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
MESSENGER_PAGE_ACCESS_TOKEN=EAAB...
MESSENGER_VERIFY_TOKEN=messenlead-verify-token
MESSENGER_APP_SECRET=app-secret-da-meta
MESSENLEAD_OPERATOR_TOKEN=um-token-forte-para-operador
MESSENLEAD_DEFAULT_REPLY=Recebi sua mensagem. Um atendente vai assumir se necessário.
MESSENLEAD_FLOW_JSON={"flows":[]}
```

`MESSENLEAD_FLOW_JSON` pode ser copiado pela tela `Messenger` dentro da aplicação.

`MESSENGER_PAGE_ACCESS_TOKEN` continua útil para o webhook fixo. Para o painel multi-Página, o app usa Facebook Login e resolve o Page Access Token da Página selecionada no servidor.

## Configurar na Meta

No Meta for Developers:

1. Crie ou abra o app.
2. Adicione o produto Messenger.
3. Adicione/configure Facebook Login para o OAuth do painel.
4. Em `Valid OAuth Redirect URIs`, inclua:

```txt
https://seu-projeto.pages.dev/api/auth/facebook/callback
```

5. Conecte a Página do Facebook.
6. Gere o Page Access Token se quiser usar o webhook fixo.
7. Configure o webhook:

```txt
https://seu-projeto.pages.dev/api/messenger/webhook
```

8. Use o mesmo `MESSENGER_VERIFY_TOKEN` configurado no Cloudflare.
9. Assine os campos:

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

Este MVP usa `localStorage` no painel e variável de ambiente para publicar fluxos no webhook. Para operação real com muitos contatos, mova assinantes, mensagens, auditoria e estado dos fluxos para Cloudflare KV, D1, Durable Objects ou outro banco.

Nunca coloque `MESSENGER_PAGE_ACCESS_TOKEN` no frontend.
