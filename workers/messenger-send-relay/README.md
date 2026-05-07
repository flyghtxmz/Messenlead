# Messenlead Messenger Send Relay

Worker auxiliar para subir em outra conta Cloudflare e dividir a parte de envio de mensagens para a Graph API.

## Deploy na conta secundária

1. Entre na pasta:

   ```bash
   cd workers/messenger-send-relay
   ```

2. Instale e faça login na conta Cloudflare secundária.

3. Configure o segredo compartilhado:

   ```bash
   npx wrangler secret put MESSENLEAD_SEND_RELAY_SECRET
   ```

4. Faça deploy:

   ```bash
   npx wrangler deploy
   ```

## Configurar no Messenlead principal

No projeto principal, adicione estas variáveis:

```txt
MESSENLEAD_SEND_RELAY_URLS=https://seu-worker-secundario.workers.dev
MESSENLEAD_SEND_RELAY_SECRET=a-mesma-chave-configurada-no-worker-secundario
```

Para mais de um relay, use vírgula ou uma URL por linha:

```txt
MESSENLEAD_SEND_RELAY_URLS=https://relay-1.workers.dev,https://relay-2.workers.dev
```

Também é possível colocar segredo por URL:

```txt
MESSENLEAD_SEND_RELAY_URLS=https://relay-1.workers.dev|segredo-1,https://relay-2.workers.dev|segredo-2
```

Se nenhuma URL for configurada, o Messenlead continua enviando direto pela conta principal.
