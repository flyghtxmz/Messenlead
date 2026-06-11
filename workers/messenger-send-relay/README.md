# Messenlead Messenger Send Relay

Worker auxiliar para subir na mesma conta Cloudflare do Messenlead principal. Ele recebe itens de envio, salva em um D1 proprio do relay, tenta enviar para a Graph API, faz retry quando falhar, expoe diagnostico da fila e tambem pode hospedar o Workflow de atraso dos fluxos.

O Messenlead principal continua sendo o cerebro: paginas, fluxos, contatos e tags continuam no D1 principal. Este relay cuida apenas de envio/fila/retry.

## Contas Cloudflare

Use esta secao para lembrar onde cada parte esta hospedada.

```txt
Conta principal do dashboard: aprovadoblog01@gmail.com
Worker relay principal: https://messenlead-messenger-send-relay.aprovadoblog01.workers.dev
D1 relay principal: messenlead-relay-db
D1 relay principal ID: 27ca9d95-b93a-405f-a66f-27c5d9a014d8
```

## Criar D1 na conta principal

Crie um D1 com o nome:

```txt
messenlead-relay-db
```

Depois copie o `database_id` e coloque em `wrangler.toml`:

```toml
[[d1_databases]]
binding = "RELAY_DB"
database_name = "messenlead-relay-db"
database_id = "SEU_DATABASE_ID"
```

As tabelas e indices sao criados automaticamente na primeira chamada.

## Deploy

```bash
cd workers/messenger-send-relay
npm install
npx wrangler queues create messenlead-messages
npx wrangler queues create messenlead-flow
npx wrangler queues create messenlead-dlq
npx wrangler secret put MESSENLEAD_SEND_RELAY_SECRET
npx wrangler deploy
```

Use uma chave longa no `MESSENLEAD_SEND_RELAY_SECRET`. A mesma chave precisa ser colocada no projeto principal.

## Configurar no Messenlead principal

No Cloudflare Pages principal, adicione:

```txt
MESSENLEAD_SEND_RELAY_URLS=https://messenlead-messenger-send-relay.aprovadoblog01.workers.dev
MESSENLEAD_SEND_RELAY_SECRET=a-mesma-chave-do-worker-relay
```

Para mais de um relay:

```txt
MESSENLEAD_SEND_RELAY_URLS=https://relay-1.workers.dev,https://relay-2.workers.dev
```

Com segredo por relay:

```txt
MESSENLEAD_SEND_RELAY_URLS=https://relay-1.workers.dev|segredo-1,https://relay-2.workers.dev|segredo-2
```

Voce pode adicionar 3, 4 ou mais relays na mesma lista. O Messenlead principal usa distribuicao deterministica: cada envio tem um relay principal escolhido pela chave da Pagina/contato/evento. Se esse relay responder que esta no limite ou indisponivel, o principal tenta o proximo relay da lista ordenada para aquele envio.

Variaveis opcionais no projeto principal:

```txt
MESSENLEAD_SEND_RELAY_FAILOVER=safe
MESSENLEAD_RELAY_LOCAL_FALLBACK=explicit
```

`safe` tenta outro relay quando houve uma resposta clara de erro, como limite atingido ou HTTP 5xx. Erros ambiguos de rede nao fazem failover por padrao para reduzir risco de duplicar mensagem. Se quiser priorizar entrega mesmo com risco de duplicidade, use `MESSENLEAD_SEND_RELAY_FAILOVER=aggressive` e `MESSENLEAD_RELAY_LOCAL_FALLBACK=aggressive`.

## Endpoints

Health publico:

```txt
GET /health
```

O health informa se a fila principal foi configurada e, depois do primeiro ciclo do cron, mostra `diagnostics.scheduled` e `diagnostics.primary_queue`. Abra no navegador:

```txt
https://messenlead-messenger-send-relay.aprovadoblog01.workers.dev/health
```

Se `hasPrimaryQueue` estiver como `false`, revise `MESSENLEAD_PRIMARY_QUEUE_URL` e `MESSENLEAD_PRIMARY_QUEUE_TOKEN`. Se `diagnostics.primary_queue.status` estiver como `401`, o token nao corresponde ao `MESSENLEAD_OPERATOR_TOKEN` do Pages principal.

Quando o `wrangler.toml` deste relay estiver publicado com `[[workflows]]`, o health tambem deve mostrar:

```txt
hasDelayWorkflow: true
delayWorkflowSecretConfigured: true
```

Para o Pages principal usar o proprio relay como motor de atraso preciso, configure no Pages:

```txt
MESSENLEAD_DELAY_WORKFLOW_URL=https://messenlead-messenger-send-relay.aprovadoblog01.workers.dev
MESSENLEAD_DELAY_WORKFLOW_SECRET=mesmo-valor-do-MESSENLEAD_SEND_RELAY_SECRET
```

O relay aceita o mesmo segredo do envio para agendar atrasos. Se voce preferir separar, crie tambem `MESSENLEAD_DELAY_WORKFLOW_SECRET` no relay e use o mesmo valor no Pages.

### Cloudflare Queues

Este Worker usa Cloudflare Queues quando `MESSENLEAD_QUEUE_ENABLED=true`:

```txt
messenlead-messages -> envio de mensagens do Messenger
messenlead-flow -> retomada dos blocos Espera via delaySeconds
messenlead-dlq -> mensagens que falharam depois dos retries do consumer
```

O D1 do relay continua sendo o registro anti-duplicidade e fallback. O caminho normal fica:

```txt
Pages -> /send no relay -> relay_send_queue no D1 -> MESSAGES_QUEUE -> consumer do relay -> Meta
Pages -> /schedule no relay -> FLOW_QUEUE com delaySeconds -> consumer do relay -> D1 principal
```

Se a Queue nao estiver disponivel, o relay volta para o comportamento antigo: processa pela fila D1 e cron.

Agendar uma continuacao de atraso, com header `X-Messenlead-Workflow-Secret`:

```txt
POST /schedule
POST /delay/schedule
```

Consultar uma Workflow instance de atraso:

```txt
GET /delay/status?id=delay-fcont_xxx
```

Status da fila, com header `X-Messenlead-Relay-Secret`:

```txt
GET /status
GET /status?status=failed
GET /status?pageId=ID_DA_PAGINA
```

Processar fila manualmente:

```txt
POST /queue/process
```

## Variaveis opcionais

```txt
MESSENLEAD_RELAY_SENDS_PER_MINUTE=50
MESSENLEAD_RELAY_DRAIN_LIMIT=25
MESSENLEAD_RELAY_CRON_DRAIN_LIMIT=25
MESSENLEAD_RELAY_MAX_ATTEMPTS=4
MESSENLEAD_RELAY_DAILY_SEND_SOFT_LIMIT=15000
MESSENLEAD_RELAY_MAX_QUEUED=5000
MESSENLEAD_RELAY_SCHEDULED_PUMP_MS=52000
MESSENLEAD_RELAY_SCHEDULED_POLL_MS=5000
MESSENLEAD_QUEUE_ENABLED=true
MESSENLEAD_USE_QUEUES_FOR_SENDS=true
MESSENLEAD_USE_QUEUES_FOR_DELAYS=true
MESSENLEAD_QUEUES_DELAY_THRESHOLD_SECONDS=86400
MESSENLEAD_LEGACY_FALLBACK_ENABLED=true
MESSENLEAD_PRIMARY_QUEUE_DRAIN_LIMIT=25
MESSENLEAD_PRIMARY_CONTINUATION_LIMIT=25
MESSENLEAD_PRIMARY_LINK_CLICK_TIMEOUT_LIMIT=25
```

O cron roda a cada 1 minuto. Com `MESSENLEAD_RELAY_SCHEDULED_PUMP_MS=52000`, cada execucao continua drenando a fila principal e a fila do relay durante quase todo o minuto, com pausa de `MESSENLEAD_RELAY_SCHEDULED_POLL_MS` entre as passagens. Isso reduz a latencia percebida dos blocos `Espera` sem criar outro servico.

Com Queues ativas, o cron vira fallback e drenagem de seguranca. Delays de ate 24h passam por `FLOW_QUEUE.send(..., { delaySeconds })`, evitando polling para waits curtos.

Quando o relay chega em `MESSENLEAD_RELAY_SENDS_PER_MINUTE`, `MESSENLEAD_RELAY_DAILY_SEND_SOFT_LIMIT` ou `MESSENLEAD_RELAY_MAX_QUEUED`, ele responde `429 capacity_full`. O projeto principal entende isso e tenta outro relay configurado.

## Observacao de seguranca

Para o relay fazer retry sozinho, ele precisa salvar temporariamente o Page Access Token no D1 do relay. Mantenha a conta Cloudflare protegida e use um segredo forte.
