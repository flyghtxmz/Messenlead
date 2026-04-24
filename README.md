# Messenlead

Ferramenta Messenger-only inspirada em builders como Manychat, feita para Cloudflare Pages.

## O que já vem pronto

- Builder visual de fluxos para Facebook Messenger.
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
MESSENGER_PAGE_ACCESS_TOKEN=EAAB...
MESSENGER_VERIFY_TOKEN=messenlead-verify-token
MESSENGER_APP_SECRET=app-secret-da-meta
MESSENLEAD_OPERATOR_TOKEN=um-token-forte-para-operador
MESSENLEAD_DEFAULT_REPLY=Recebi sua mensagem. Um atendente vai assumir se necessário.
MESSENLEAD_FLOW_JSON={"flows":[]}
```

`MESSENLEAD_FLOW_JSON` pode ser copiado pela tela `Messenger` dentro da aplicação.

## Configurar na Meta

No Meta for Developers:

1. Crie ou abra o app.
2. Adicione o produto Messenger.
3. Conecte a Página do Facebook.
4. Gere o Page Access Token.
5. Configure o webhook:

```txt
https://seu-projeto.pages.dev/api/messenger/webhook
```

6. Use o mesmo `MESSENGER_VERIFY_TOKEN` configurado no Cloudflare.
7. Assine os campos:

```txt
messages, messaging_postbacks, messaging_optins
```

## Endpoints

Verificação e recebimento de eventos:

```txt
GET/POST /api/messenger/webhook
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
