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
META_SCOPES=pages_show_list,pages_messaging,pages_manage_metadata,business_management
MESSENGER_VERIFY_TOKEN=messenlead-verify-token
MESSENGER_APP_SECRET=app-secret-da-meta
MESSENLEAD_OPERATOR_TOKEN=um-token-forte-para-operador
MESSENLEAD_FLOW_JSON={"flows":[]}
```

`MESSENLEAD_FLOW_JSON` agora é fallback. Em produção, os fluxos do canvas são salvos no D1 por Página.

Se não houver fluxo ativo para uma mensagem recebida, o webhook não envia resposta automática.

Para multi-Página, `MESSENGER_PAGE_ACCESS_TOKEN` não é obrigatório: o app usa Facebook Login, busca as Páginas autorizadas e salva os Page Access Tokens no D1. Você só precisa de `MESSENGER_PAGE_ACCESS_TOKEN` se quiser operar uma única Página manualmente sem OAuth.

## Biblioteca de mídia com R2

Para upar imagens, áudios MP3 e vídeos permanentes para usar nos fluxos, crie um bucket Cloudflare R2 e vincule ao Pages com o binding:

```txt
MEDIA_BUCKET
```

Configuração pelo painel:

1. Cloudflare Dashboard → R2 Object Storage.
2. Crie um bucket, por exemplo `messenlead-media`.
3. Abra o projeto Pages `Messenlead`.
4. Vá em `Settings` → `Functions` → `R2 bucket bindings`.
5. Adicione:

```txt
Variable name: MEDIA_BUCKET
R2 bucket: messenlead-media
```

Opcionalmente, se você ativar domínio público do R2 ou um custom domain, adicione:

```txt
MEDIA_PUBLIC_BASE_URL=https://media.seudominio.com
```

Se `MEDIA_PUBLIC_BASE_URL` não estiver configurado, o Messenlead entrega os arquivos por URLs do próprio projeto, como:

```txt
https://seu-projeto.pages.dev/media/arquivo.mp3
```

Endpoints:

```txt
GET    /api/media?pageId=PAGE_ID
POST   /api/media
DELETE /api/media?pageId=PAGE_ID&id=MEDIA_ID
GET    /media/arquivo.mp3
```

Para envio de vídeo no Messenger, prefira arquivos `.mp4`. O painel também aceita WebM/MOV na biblioteca, mas a compatibilidade final de envio depende do Messenger.

## Fila e bloco de espera

O bloco `Espera` pausa o fluxo de verdade. Quando o webhook chega nesse bloco, ele salva uma continuacao no D1 na tabela `flow_continuations` com:

- Pagina, PSID e fluxo.
- Bloco de espera e proximo bloco.
- Horario `due_at` para retomar.
- Janela de politica `policy_expires_at` do Messenger.

O endpoint abaixo processa continuacoes vencidas e depois drena a fila de envio:

```txt
POST /api/messenger/queue
Authorization: Bearer MESSENLEAD_OPERATOR_TOKEN
```

O node `Espera` aceita duracao em segundos, minutos, horas e dias. Para maior precisao, o Worker relay `workers/messenger-send-relay` tambem hospeda uma Cloudflare Workflow: ele cria uma Workflow instance por continuacao, dorme ate `due_at` com `step.sleepUntil()` e chama a fila principal no horario. O D1 e o cron antigo continuam como fallback.

Variaveis no Pages principal:

```txt
MESSENLEAD_DELAY_WORKFLOW_URL=https://messenlead-messenger-send-relay.vinteedois-13.workers.dev
MESSENLEAD_DELAY_WORKFLOW_SECRET=a-mesma-chave-do-worker-relay
```

Secrets no Worker relay:

```txt
MESSENLEAD_DELAY_WORKFLOW_SECRET=a-mesma-chave-do-pages
MESSENLEAD_PRIMARY_QUEUE_TOKEN=o-mesmo-valor-do-MESSENLEAD_OPERATOR_TOKEN-do-Pages
```

Variavel no Worker de Workflows:

```txt
MESSENLEAD_PRIMARY_QUEUE_URL=https://messenlead.pages.dev/api/messenger/queue
```

Se voce nao quiser criar outro segredo, `MESSENLEAD_DELAY_WORKFLOW_SECRET` pode ser o mesmo valor de `MESSENLEAD_SEND_RELAY_SECRET`. No relay, se `MESSENLEAD_DELAY_WORKFLOW_SECRET` nao existir, ele usa `MESSENLEAD_SEND_RELAY_SECRET` como fallback para o endpoint de atraso.

Se voce estiver usando o Worker relay com cron, configure no Worker relay:

```txt
MESSENLEAD_PRIMARY_QUEUE_URL=https://messenlead.pages.dev/api/messenger/queue
MESSENLEAD_PRIMARY_QUEUE_TOKEN=o-mesmo-valor-do-MESSENLEAD_OPERATOR_TOKEN-do-Pages
```

Assim o cron do relay chama a fila principal a cada 1 minuto e os fluxos pausados continuam mesmo com o dashboard fechado. Sem esse token no relay, a espera ainda fica salva no D1, mas so retoma quando `/api/messenger/queue` for chamado manualmente ou por outro cron externo.

Para reduzir a latencia dos blocos `Espera`, o relay pode manter o cron ativo durante quase todo o minuto e chamar a fila principal em intervalos curtos:

```txt
MESSENLEAD_RELAY_SCHEDULED_PUMP_MS=52000
MESSENLEAD_RELAY_SCHEDULED_POLL_MS=5000
MESSENLEAD_PRIMARY_QUEUE_DRAIN_LIMIT=25
MESSENLEAD_PRIMARY_CONTINUATION_LIMIT=25
MESSENLEAD_PRIMARY_LINK_CLICK_TIMEOUT_LIMIT=25
```

Com essa configuracao, um delay de 1 minuto ainda depende do cron de 1 minuto da Cloudflare, mas depois que o cron acorda o relay passa a verificar continuacoes vencidas a cada 5 segundos. Na pratica isso reduz a folga comum de espera de ate quase 1 minuto para poucos segundos, desde que o Worker relay esteja implantado e `MESSENLEAD_PRIMARY_QUEUE_TOKEN` esteja configurado.

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
