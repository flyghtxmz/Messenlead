# Messenlead Messenger Send Relay

Worker auxiliar para subir em outra conta Cloudflare. Ele recebe itens de envio do Messenlead principal, salva em um D1 secundario, tenta enviar para a Graph API, faz retry quando falhar e expõe diagnostico da fila.

O Messenlead principal continua sendo o cerebro: paginas, fluxos, contatos e tags continuam no D1 principal. Este relay cuida apenas de envio/fila/retry.

## Contas Cloudflare

Use esta secao para lembrar onde cada parte esta hospedada.

```txt
Conta principal do dashboard: aprovadoblog
Conta secundaria relay 1: Vinteedois.13@gmail.com
Worker relay 1: https://messenlead-messenger-send-relay.vinteedois-13.workers.dev
D1 relay 1: messenlead-relay-db
D1 relay 1 ID: ef0f4f6a-e932-46fe-b1a9-954ad009d80f
```

## Criar D1 na conta secundaria

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
npx wrangler secret put MESSENLEAD_SEND_RELAY_SECRET
npx wrangler deploy
```

Use uma chave longa no `MESSENLEAD_SEND_RELAY_SECRET`. A mesma chave precisa ser colocada no projeto principal.

## Configurar no Messenlead principal

No Cloudflare Pages principal, adicione:

```txt
MESSENLEAD_SEND_RELAY_URLS=https://seu-worker-secundario.workers.dev
MESSENLEAD_SEND_RELAY_SECRET=a-mesma-chave-do-worker-secundario
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
https://messenlead-messenger-send-relay.vinteedois-13.workers.dev/health
```

Se `hasPrimaryQueue` estiver como `false`, revise `MESSENLEAD_PRIMARY_QUEUE_URL` e `MESSENLEAD_PRIMARY_QUEUE_TOKEN`. Se `diagnostics.primary_queue.status` estiver como `401`, o token nao corresponde ao `MESSENLEAD_OPERATOR_TOKEN` do Pages principal.

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
MESSENLEAD_PRIMARY_QUEUE_DRAIN_LIMIT=25
MESSENLEAD_PRIMARY_CONTINUATION_LIMIT=25
MESSENLEAD_PRIMARY_LINK_CLICK_TIMEOUT_LIMIT=25
```

O cron roda a cada 1 minuto. Com `MESSENLEAD_RELAY_SCHEDULED_PUMP_MS=52000`, cada execucao continua drenando a fila principal e a fila do relay durante quase todo o minuto, com pausa de `MESSENLEAD_RELAY_SCHEDULED_POLL_MS` entre as passagens. Isso reduz a latencia percebida dos blocos `Espera` sem criar outro servico.

Quando o relay chega em `MESSENLEAD_RELAY_SENDS_PER_MINUTE`, `MESSENLEAD_RELAY_DAILY_SEND_SOFT_LIMIT` ou `MESSENLEAD_RELAY_MAX_QUEUED`, ele responde `429 capacity_full`. O projeto principal entende isso e tenta outro relay configurado.

## Observacao de seguranca

Para o relay fazer retry sozinho, ele precisa salvar temporariamente o Page Access Token no D1 secundario. Mantenha essa conta Cloudflare protegida e use um segredo forte.
