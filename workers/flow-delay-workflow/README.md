# Messenlead Flow Delay Workflow

Worker auxiliar para processar nodes `Atraso Inteligente` com Cloudflare Workflows.

Ele recebe uma continuacao criada pelo Pages principal, inicia uma Workflow instance, dorme ate `dueAt` com `step.sleepUntil()` e chama a fila principal:

```txt
POST https://messenlead.pages.dev/api/messenger/queue
```

O D1 principal continua sendo a fonte da verdade. O Cron antigo continua podendo ser mantido como fallback.

## Variaveis no Worker

Configure no Worker `messenlead-flow-delay-workflow`:

```txt
MESSENLEAD_PRIMARY_QUEUE_URL=https://messenlead.pages.dev/api/messenger/queue
MESSENLEAD_PRIMARY_QUEUE_DRAIN_LIMIT=12
```

Secrets obrigatorios:

```txt
MESSENLEAD_DELAY_WORKFLOW_SECRET=uma-chave-longa-aleatoria
MESSENLEAD_PRIMARY_QUEUE_TOKEN=mesmo-valor-do-MESSENLEAD_OPERATOR_TOKEN-do-Pages
```

## Variaveis no Pages principal

Configure no projeto principal do Cloudflare Pages:

```txt
MESSENLEAD_DELAY_WORKFLOW_URL=https://messenlead-flow-delay-workflow.SUA-CONTA.workers.dev
MESSENLEAD_DELAY_WORKFLOW_SECRET=a-mesma-chave-do-worker
```

Se essas variaveis nao existirem, o Messenlead continua usando o mecanismo antigo de D1 + Cron/queue.

## Endpoints

Health publico:

```txt
GET /health
```

Agendar espera:

```txt
POST /schedule
Header: X-Messenlead-Workflow-Secret
```

Consultar instance:

```txt
GET /status?id=delay-fcont_xxx
Header: X-Messenlead-Workflow-Secret
```

## Deploy

Pelo dashboard do Cloudflare, crie um Worker conectado a este diretorio e use:

```txt
workers/flow-delay-workflow
```

O `wrangler.toml` ja inclui o binding `[[workflows]]`.
