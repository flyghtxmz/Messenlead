import { WorkflowEntrypoint } from "cloudflare:workers";
import { processMessengerFlowContinuations, processMessengerLinkClickTimeouts } from "../../../functions/api/messenger/webhook.js";
import { processMessengerSendQueue } from "../../../functions/_lib/messengerDelivery.js";

const DEFAULT_GRAPH_URL = "https://graph.facebook.com/v23.0/me/messages";
const DEFAULT_MAX_ATTEMPTS = 4;
const DEFAULT_DRAIN_LIMIT = 8;
const DEFAULT_SENDS_PER_MINUTE = 50;
const DEFAULT_SCHEDULED_PUMP_MS = 0;
const DEFAULT_SCHEDULED_POLL_MS = 5000;
const RESPONSE_WINDOW_MS = 24 * 60 * 60 * 1000;
const QUEUE_MAX_DELAY_SECONDS = 24 * 60 * 60;
const DEFAULT_QUEUE_RETRY_DELAY_SECONDS = 15;

export class MessenleadDelayWorkflow extends WorkflowEntrypoint {
  async run(event, step) {
    const payload = schedulePayload(event.payload || {});
    const dueTime = Date.parse(payload.dueAt);

    if (Number.isFinite(dueTime) && dueTime > Date.now() + 1000) {
      await step.sleepUntil(`Delay ${payload.continuationId}`, new Date(dueTime));
    }

    return step.do(
      "Processar continuacao no Pages principal",
      {
        retries: {
          limit: 4,
          delay: "10 seconds",
          backoff: "exponential"
        },
        timeout: "30 seconds"
      },
      async () => drainPrimaryQueue(this.env, {
        continuationId: payload.continuationId,
        pageId: payload.pageId,
        continuationLimit: 1
      })
    );
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/health") {
      return json({
        ok: true,
        service: "messenlead-messenger-send-relay",
        hasD1: Boolean(env.RELAY_DB),
        hasPrimaryD1: Boolean(env.DB),
        hasMessagesQueue: Boolean(env.MESSAGES_QUEUE),
        hasFlowQueue: Boolean(env.FLOW_QUEUE),
        queuesEnabled: queuesEnabled(env),
        messagesQueueEnabled: messagesQueueEnabled(env),
        flowQueueEnabled: flowQueueEnabled(env),
        hasPrimaryQueue: primaryQueueConfigured(env),
        hasDelayWorkflow: Boolean(env.MESSENLEAD_DELAY_WORKFLOW),
        primaryQueueUrlConfigured: Boolean(clean(env.MESSENLEAD_PRIMARY_QUEUE_URL || env.MESSENLEAD_MAIN_QUEUE_URL, 500)),
        primaryQueueTokenConfigured: Boolean(clean(env.MESSENLEAD_PRIMARY_QUEUE_TOKEN || env.MESSENLEAD_OPERATOR_TOKEN, 500)),
        delayWorkflowSecretConfigured: Boolean(delayWorkflowSecret(env)),
        scheduledPumpMs: clampNumber(env.MESSENLEAD_RELAY_SCHEDULED_PUMP_MS, 0, 55000, DEFAULT_SCHEDULED_PUMP_MS),
        scheduledPollMs: clampNumber(env.MESSENLEAD_RELAY_SCHEDULED_POLL_MS, 1000, 15000, DEFAULT_SCHEDULED_POLL_MS),
        queueMetrics: await queueMetricsDiagnostics(env),
        diagnostics: await relayRuntimeDiagnostics(env)
      });
    }

    if (request.method === "POST" && ["/schedule", "/delay/schedule"].includes(url.pathname)) {
      const authError = authorizeDelayWorkflowRequest(request, env);
      if (authError) return authError;
      return handleDelayWorkflowSchedule(request, env);
    }

    if (request.method === "GET" && ["/delay/status", "/workflow/status"].includes(url.pathname)) {
      const authError = authorizeDelayWorkflowRequest(request, env);
      if (authError) return authError;
      return handleDelayWorkflowStatus(url, env);
    }

    const authError = authorize(request, env);
    if (authError) return authError;

    if (request.method === "POST" && url.pathname === "/send") {
      return handleSend(request, env);
    }

    if (request.method === "POST" && ["/queue/process", "/process", "/drain"].includes(url.pathname)) {
      const body = (await readJson(request)) || {};
      const result = await processQueue(env, {
        pageId: body.pageId || url.searchParams.get("pageId"),
        limit: body.limit || url.searchParams.get("limit")
      });
      return json({ ok: true, result });
    }

    if (request.method === "POST" && ["/queue/reset", "/reset"].includes(url.pathname)) {
      const body = (await readJson(request)) || {};
      const result = await resetQueue(env, {
        pageIds: body.pageIds || body.pageId || url.searchParams.get("pageId"),
        psids: body.psids || body.psid || url.searchParams.get("psid"),
        restrictToPsids: body.restrictToPsids === true
      });
      return json({ ok: true, reset: result });
    }

    if (request.method === "GET" && ["/queue/status", "/status"].includes(url.pathname)) {
      const status = await queueStatus(env, {
        status: url.searchParams.get("status"),
        pageId: url.searchParams.get("pageId"),
        limit: url.searchParams.get("limit")
      });
      return json({ ok: true, ...status });
    }

    return json({ error: "Not found" }, 404);
  },

  async scheduled(_controller, env) {
    await runScheduledPump(env);
  },

  async queue(batch, env, ctx) {
    await handleQueueBatch(batch, env, ctx);
  }
};

async function runScheduledPump(env) {
  const startedAt = Date.now();
  const configuredPumpMs = clampNumber(env.MESSENLEAD_RELAY_SCHEDULED_PUMP_MS, 0, 55000, DEFAULT_SCHEDULED_PUMP_MS);
  const pumpMs = primaryQueueConfigured(env) ? configuredPumpMs : 0;
  const pollMs = clampNumber(env.MESSENLEAD_RELAY_SCHEDULED_POLL_MS, 1000, 15000, DEFAULT_SCHEDULED_POLL_MS);
  const deadline = startedAt + pumpMs;
  const totals = {
    passes: 0,
    primary: { ok: 0, failed: 0, skipped: 0 },
    relay: { processed: 0, sent: 0, retried: 0, skipped: 0, failed: 0 }
  };

  await recordRelayRuntimeStatus(env, "scheduled", {
    state: "running",
    startedAt: new Date(startedAt).toISOString(),
    hasPrimaryQueue: primaryQueueConfigured(env)
  });

  do {
    totals.passes += 1;

    const primary = await drainPrimaryQueue(env);
    await recordRelayRuntimeStatus(env, "primary_queue", primaryQueueDiagnostic(primary));
    if (primary.skipped) totals.primary.skipped += 1;
    else if (primary.ok) totals.primary.ok += 1;
    else totals.primary.failed += 1;

    const relay = await processQueue(env, {
      limit: env.MESSENLEAD_RELAY_CRON_DRAIN_LIMIT || env.MESSENLEAD_RELAY_DRAIN_LIMIT || DEFAULT_DRAIN_LIMIT
    });
    mergeStats(totals.relay, relay);

    if (pumpMs <= 0 || Date.now() + pollMs > deadline) break;
    await sleep(pollMs);
  } while (Date.now() <= deadline);

  const result = {
    ...totals,
    elapsedMs: Date.now() - startedAt
  };
  await recordRelayRuntimeStatus(env, "scheduled", {
    state: "completed",
    startedAt: new Date(startedAt).toISOString(),
    finishedAt: new Date().toISOString(),
    ...result
  });
  return result;
}

function primaryQueueConfigured(env) {
  return Boolean(
    clean(env.MESSENLEAD_PRIMARY_QUEUE_URL || env.MESSENLEAD_MAIN_QUEUE_URL, 500) &&
      clean(env.MESSENLEAD_PRIMARY_QUEUE_TOKEN || env.MESSENLEAD_OPERATOR_TOKEN, 500)
  );
}

async function drainPrimaryQueue(env, options = {}) {
  const queueUrl = clean(env.MESSENLEAD_PRIMARY_QUEUE_URL || env.MESSENLEAD_MAIN_QUEUE_URL, 500);
  const token = clean(env.MESSENLEAD_PRIMARY_QUEUE_TOKEN || env.MESSENLEAD_OPERATOR_TOKEN, 500);
  if (!queueUrl || !token) return { ok: false, skipped: true };

  const payload = {
    pageId: options.pageId || "",
    continuationId: options.continuationId || "",
    limit: options.limit || env.MESSENLEAD_PRIMARY_QUEUE_DRAIN_LIMIT || 12,
    continuationLimit: options.continuationLimit || env.MESSENLEAD_PRIMARY_CONTINUATION_LIMIT || 8,
    linkClickTimeoutLimit: env.MESSENLEAD_PRIMARY_LINK_CLICK_TIMEOUT_LIMIT || env.MESSENLEAD_PRIMARY_CONTINUATION_LIMIT || 8
  };
  const post = await requestPrimaryQueue(queueUrl, token, payload, "POST");
  if (post.ok || (post.status && post.status < 500)) return post;

  const retry = await requestPrimaryQueue(queueUrl, token, payload, "GET");
  if (retry.ok || (retry.status && retry.status < 500)) {
    return {
      ...retry,
      fallbackFrom: {
        method: "POST",
        status: post.status || 0,
        error: post.error || ""
      }
    };
  }

  const direct = await drainPrimaryQueueDirect(env, payload);
  if (direct.ok || direct.status !== 501) {
    return {
      ...direct,
      fallbackFrom: {
        method: "GET",
        status: retry.status || 0,
        error: retry.error || ""
      }
    };
  }

  return {
    ...retry,
    fallbackFrom: {
      method: "POST",
      status: post.status || 0,
      error: post.error || ""
    }
  };
}

async function requestPrimaryQueue(queueUrl, token, payload, method) {
  try {
    const url = new URL(queueUrl);
    const init = {
      method,
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
        "User-Agent": "Messenlead-Relay/1.0"
      }
    };
    if (method === "GET") {
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value));
      });
    } else {
      init.headers["Content-Type"] = "application/json";
      init.body = JSON.stringify(payload);
    }

    const response = await fetch(url.toString(), init);
    const body = await response.json().catch(() => ({}));
    return {
      ok: response.ok,
      status: response.status,
      method,
      body
    };
  } catch (error) {
    return {
      ok: false,
      method,
      status: 0,
      error: error.message || "primary_queue_failed"
    };
  }
}

async function drainPrimaryQueueDirect(env, payload = {}) {
  if (!env.DB) return { ok: false, status: 501, error: "primary_db_binding_missing" };

  const pageId = clean(payload.pageId, 120);
  const continuationId = clean(payload.continuationId, 120);
  const stages = {};
  const errors = [];

  stages.continuations = await runPrimaryQueueStage("continuations", errors, () =>
    processMessengerFlowContinuations(env, {
      pageId,
      continuationId,
      limit: payload.continuationLimit || env.MESSENLEAD_PRIMARY_CONTINUATION_LIMIT || 8
    })
  );

  if (!continuationId) {
    stages.linkClickTimeouts = await runPrimaryQueueStage("linkClickTimeouts", errors, () =>
      processMessengerLinkClickTimeouts(env, {
        pageId,
        limit: payload.linkClickTimeoutLimit || env.MESSENLEAD_PRIMARY_LINK_CLICK_TIMEOUT_LIMIT || 8
      })
    );

    stages.result = await runPrimaryQueueStage("sendQueue", errors, () =>
      processMessengerSendQueue(env, {
        pageId,
        limit: payload.limit || env.MESSENLEAD_PRIMARY_QUEUE_DRAIN_LIMIT || 12
      })
    );
  } else {
    stages.linkClickTimeouts = { skipped: true, reason: "continuation_id_request" };
    stages.result = { skipped: true, reason: "continuation_id_request" };
  }

  const continuationFailed = errors.some((error) => error.stage === "continuations");
  return {
    ok: !continuationFailed,
    status: continuationFailed ? 500 : 200,
    method: "direct_d1",
    body: {
      ok: !continuationFailed,
      direct: true,
      continuationId,
      continuations: stages.continuations,
      linkClickTimeouts: stages.linkClickTimeouts,
      result: stages.result,
      errors
    }
  };
}

async function runPrimaryQueueStage(stage, errors, fn) {
  try {
    return await fn();
  } catch (error) {
    errors.push({
      stage,
      message: String(error?.message || error || "Queue stage failed").slice(0, 1000)
    });
    return { error: String(error?.message || error || "Queue stage failed").slice(0, 1000) };
  }
}

function primaryQueueDiagnostic(result = {}) {
  return {
    ok: Boolean(result.ok),
    skipped: Boolean(result.skipped),
    status: Number(result.status || 0),
    method: clean(result.method, 80),
    fallbackFrom: result.fallbackFrom && typeof result.fallbackFrom === "object" ? result.fallbackFrom : null,
    error: clean(result.error, 500),
    body: result.body && typeof result.body === "object" ? result.body : {}
  };
}

async function relayRuntimeDiagnostics(env) {
  if (!env.RELAY_DB) return {};
  try {
    await ensureRuntimeStatusSchema(env);
    const rows = await env.RELAY_DB.prepare(`
      SELECT key, value_json, updated_at
      FROM relay_runtime_status
      WHERE key IN ('scheduled', 'primary_queue')
        OR key LIKE 'queue:%'
    `).all();
    return Object.fromEntries((rows.results || []).map((row) => [
      row.key,
      {
        ...parseJson(row.value_json),
        updatedAt: row.updated_at || ""
      }
    ]));
  } catch (error) {
    return { error: clean(error.message || "runtime_diagnostics_failed", 500) };
  }
}

async function recordRelayRuntimeStatus(env, key, value = {}) {
  if (!env.RELAY_DB) return;
  try {
    await ensureRuntimeStatusSchema(env);
    const now = new Date().toISOString();
    await env.RELAY_DB.prepare(`
      INSERT INTO relay_runtime_status (key, value_json, updated_at)
      VALUES (?, ?, ?)
      ON CONFLICT(key) DO UPDATE SET
        value_json = excluded.value_json,
        updated_at = excluded.updated_at
    `)
      .bind(clean(key, 80), JSON.stringify(value || {}), now)
      .run();
  } catch {
    // Diagnostics must never block message delivery or scheduled processing.
  }
}

async function ensureRuntimeStatusSchema(env) {
  if (!env.RELAY_DB) return false;
  await env.RELAY_DB.prepare(`
    CREATE TABLE IF NOT EXISTS relay_runtime_status (
      key TEXT PRIMARY KEY,
      value_json TEXT NOT NULL DEFAULT '{}',
      updated_at TEXT NOT NULL
    )
  `).run();
  return true;
}

function mergeStats(target, source = {}) {
  for (const key of Object.keys(target)) {
    target[key] += Number(source[key] || 0);
  }
  return target;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function handleDelayWorkflowSchedule(request, env) {
  const body = await readJson(request);
  if (!body) return json({ error: "Invalid JSON" }, 400);

  const payload = schedulePayload(body);
  const validation = validateSchedulePayload(payload);
  if (validation) return json({ error: validation }, 400);

  const queued = await scheduleContinuationViaQueue(env, payload);
  if (queued.ok || queued.fatal) {
    return json({
      ok: queued.ok,
      created: queued.ok,
      queueScheduled: queued.ok,
      workflowInstanceId: queued.ok ? queueScheduleId(payload.continuationId) : "",
      continuationId: payload.continuationId,
      dueAt: payload.dueAt,
      delaySeconds: queued.delaySeconds || 0,
      metrics: queued.metrics || null,
      error: queued.error || ""
    }, queued.ok ? 200 : 500);
  }

  if (!env.MESSENLEAD_DELAY_WORKFLOW) {
    return json({
      error: "Delay workflow binding is not configured",
      queueReason: queued.reason || "queue_not_used"
    }, 500);
  }

  const id = workflowInstanceId(payload.continuationId);
  try {
    const instance = await env.MESSENLEAD_DELAY_WORKFLOW.create({
      id,
      params: payload
    });
    return json({
      ok: true,
      created: true,
      workflowInstanceId: instance.id,
      continuationId: payload.continuationId,
      dueAt: payload.dueAt,
      queueScheduled: false,
      queueReason: queued.reason || "queue_not_used"
    });
  } catch (error) {
    const existing = await delayWorkflowStatus(env, id);
    if (existing.ok) {
      return json({
        ok: true,
        created: false,
        existing: true,
        workflowInstanceId: id,
        continuationId: payload.continuationId,
        dueAt: payload.dueAt,
        queueScheduled: false,
        queueReason: queued.reason || "queue_not_used",
        status: existing.status
      });
    }
    return json({
      ok: false,
      error: error.message || "workflow_create_failed",
      workflowInstanceId: id
    }, 500);
  }
}

async function handleDelayWorkflowStatus(url, env) {
  const id = clean(url.searchParams.get("id"), 100);
  if (!id) return json({ error: "id is required" }, 400);
  const status = await delayWorkflowStatus(env, id);
  return json(status, status.ok ? 200 : 404);
}

async function delayWorkflowStatus(env, id) {
  if (!env.MESSENLEAD_DELAY_WORKFLOW) return { ok: false, error: "Delay workflow binding is not configured" };
  try {
    const instance = await env.MESSENLEAD_DELAY_WORKFLOW.get(id);
    return {
      ok: true,
      workflowInstanceId: id,
      status: await instance.status()
    };
  } catch (error) {
    return {
      ok: false,
      workflowInstanceId: id,
      error: error.message || "workflow_status_failed"
    };
  }
}

async function handleSend(request, env) {
  const body = await readJson(request);
  if (!body) return json({ error: "Invalid JSON" }, 400);

  const pageAccessToken = clean(body.pageAccessToken, 4000);
  const psid = clean(body.psid, 120);
  const message = body.message && typeof body.message === "object" ? body.message : null;
  if (!pageAccessToken || !psid || !message) {
    return json({ error: "pageAccessToken, psid and message are required" }, 400);
  }

  if (!env.RELAY_DB) {
    const direct = await sendDirect(env, {
      pageAccessToken,
      psid,
      messagingType: clean(body.messagingType, 40) || "RESPONSE",
      message,
      graphApiUrl: clean(body.graphApiUrl, 500) || DEFAULT_GRAPH_URL
    });
    return json({
      ok: direct.ok,
      accepted: false,
      direct: true,
      status: direct.status,
      body: direct.body,
      responseJson: parseJson(direct.body),
      responseBody: direct.body,
      sentAt: direct.ok ? new Date().toISOString() : "",
      pageId: clean(body.pageId, 120),
      queueId: clean(body.queueId, 160)
    }, direct.ok ? 200 : 502);
  }

  const capacity = await relayCapacityStatus(env, clean(body.pageId, 120) || "__global__");
  if (!capacity.accepting) {
    return json({
      ok: false,
      accepted: false,
      capacityFull: true,
      retryable: true,
      status: "capacity_full",
      reason: capacity.reason,
      capacity
    }, 429);
  }

  const row = await enqueueRelayMessage(env, body);
  const existing = await getQueueRow(env, row.id);
  if (existing?.status === "sent" || existing?.status === "processing") {
    return json({
      ok: true,
      accepted: true,
      relayQueued: true,
      cloudflareQueued: false,
      relayQueueId: row.id,
      pageId: row.pageId,
      queueId: clean(body.queueId, 160),
      status: existing.status,
      attempts: Number(existing.attempts || 0),
      lastError: existing.last_error || "",
      responseJson: parseJson(existing.response_json || ""),
      responseBody: existing.response_json || "",
      sentAt: existing.sent_at || "",
      capacity,
      idempotent: true
    });
  }

  const queuedMessage = await enqueueRelaySendViaQueue(env, row, body);
  if (queuedMessage.ok) {
    return json({
      ok: true,
      accepted: true,
      relayQueued: true,
      cloudflareQueued: true,
      relayQueueId: row.id,
      pageId: row.pageId,
      queueId: clean(body.queueId, 160),
      status: "queued",
      attempts: 0,
      lastError: "",
      responseJson: {},
      responseBody: "",
      sentAt: "",
      capacity,
      queueMetrics: queuedMessage.metrics || null
    });
  }

  if (queuedMessage.fatal) {
    return json({
      ok: false,
      accepted: false,
      relayQueued: true,
      cloudflareQueued: false,
      relayQueueId: row.id,
      pageId: row.pageId,
      queueId: clean(body.queueId, 160),
      status: "queue_failed",
      retryable: true,
      error: queuedMessage.error || "queue_send_failed",
      capacity
    }, 503);
  }

  const drain = await processQueue(env, {
    pageId: row.pageId,
    limit: env.MESSENLEAD_RELAY_DRAIN_LIMIT || DEFAULT_DRAIN_LIMIT
  });
  const current = await getQueueRow(env, row.id);
  const failed = current?.status === "failed";

  return json({
    ok: !failed,
    accepted: true,
    relayQueued: true,
    relayQueueId: row.id,
    pageId: row.pageId,
    queueId: clean(body.queueId, 160),
    status: current?.status || "queued",
    attempts: Number(current?.attempts || 0),
    lastError: current?.last_error || "",
    responseJson: parseJson(current?.response_json || ""),
    responseBody: current?.response_json || "",
    sentAt: current?.sent_at || "",
    capacity,
    drain
  }, failed ? 502 : 200);
}

async function enqueueRelaySendViaQueue(env, row = {}, body = {}) {
  if (!messagesQueueEnabled(env)) return { ok: false, skipped: true, reason: "messages_queue_disabled" };
  if (!env.MESSAGES_QUEUE) return queuePublishFailure(env, "messages_queue_missing");

  try {
    const result = await env.MESSAGES_QUEUE.send({
      type: "relay_send",
      relayQueueId: clean(row.id, 180),
      pageId: clean(row.pageId, 120),
      queueId: clean(body.queueId, 160),
      scheduledAt: new Date().toISOString()
    }, { delaySeconds: 0 });

    await recordQueueAudit(env, "message_queued", {
      queue: "messenlead-messages",
      relayQueueId: row.id,
      pageId: row.pageId,
      metrics: result?.metadata?.metrics || null
    });

    return { ok: true, metrics: result?.metadata?.metrics || null };
  } catch (error) {
    await recordQueueAudit(env, "message_queue_failed", {
      queue: "messenlead-messages",
      relayQueueId: row.id,
      pageId: row.pageId,
      error: error.message || "queue_send_failed"
    });
    return queuePublishFailure(env, error.message || "queue_send_failed");
  }
}

async function scheduleContinuationViaQueue(env, payload = {}) {
  if (!flowQueueEnabled(env)) return { ok: false, skipped: true, reason: "flow_queue_disabled" };
  if (!env.FLOW_QUEUE) return queuePublishFailure(env, "flow_queue_missing");

  const dueAtMs = Date.parse(payload.dueAt);
  const delaySeconds = Math.max(0, Math.ceil((dueAtMs - Date.now()) / 1000));
  const threshold = queueDelayThresholdSeconds(env);
  if (delaySeconds > threshold) {
    return { ok: false, skipped: true, reason: "delay_above_queue_threshold", delaySeconds, threshold };
  }
  if (delaySeconds > QUEUE_MAX_DELAY_SECONDS) {
    return { ok: false, skipped: true, reason: "delay_above_cloudflare_queue_limit", delaySeconds };
  }

  try {
    const result = await env.FLOW_QUEUE.send({
      type: "flow_continuation",
      ...payload,
      scheduledAt: new Date().toISOString(),
      expectedDelaySeconds: delaySeconds
    }, { delaySeconds });

    await recordDelayMetricScheduled(env, payload, delaySeconds, "queue");
    await recordQueueAudit(env, "flow_continuation_queued", {
      queue: "messenlead-flow",
      continuationId: payload.continuationId,
      pageId: payload.pageId,
      dueAt: payload.dueAt,
      delaySeconds,
      metrics: result?.metadata?.metrics || null
    });

    return { ok: true, delaySeconds, metrics: result?.metadata?.metrics || null };
  } catch (error) {
    await recordQueueAudit(env, "flow_continuation_queue_failed", {
      queue: "messenlead-flow",
      continuationId: payload.continuationId,
      pageId: payload.pageId,
      dueAt: payload.dueAt,
      delaySeconds,
      error: error.message || "queue_send_failed"
    });
    return queuePublishFailure(env, error.message || "queue_send_failed", { delaySeconds });
  }
}

async function handleQueueBatch(batch, env) {
  const stats = {
    queue: batch.queue || "",
    processed: 0,
    sent: 0,
    resumed: 0,
    retried: 0,
    skipped: 0,
    failed: 0
  };

  for (const message of batch.messages || []) {
    const body = normalizeQueueMessageBody(message.body);
    try {
      let result = null;
      if (body.type === "relay_send") {
        result = await processRelaySendQueueMessage(env, body);
        if (result.result === "sent") stats.sent += 1;
        else if (result.result === "retried" || result.requeued) stats.retried += 1;
        else if (result.result === "skipped" || result.skipped) stats.skipped += 1;
        else if (result.result === "failed") stats.failed += 1;
      } else if (body.type === "flow_continuation") {
        result = await processFlowContinuationQueueMessage(env, body);
        if (result.resumed) stats.resumed += 1;
        else if (result.skipped) stats.skipped += 1;
      } else {
        stats.skipped += 1;
        result = { skipped: true, reason: "unknown_queue_message_type" };
      }

      stats.processed += 1;
      await recordQueueAudit(env, "queue_message_processed", {
        queue: batch.queue || "",
        type: body.type || "",
        messageId: message.id || "",
        result
      });
      message.ack();
    } catch (error) {
      stats.failed += 1;
      const delaySeconds = queueRetryDelaySeconds(message.attempts);
      await recordQueueAudit(env, "queue_message_retry", {
        queue: batch.queue || "",
        type: body.type || "",
        messageId: message.id || "",
        attempts: Number(message.attempts || 0),
        delaySeconds,
        error: error.message || "queue_message_failed"
      });
      message.retry({ delaySeconds });
    }
  }

  await recordRelayRuntimeStatus(env, `queue:${stats.queue || "unknown"}`, stats);
}

async function processRelaySendQueueMessage(env, body = {}) {
  const relayQueueId = clean(body.relayQueueId, 180);
  if (!relayQueueId) return { skipped: true, reason: "missing_relay_queue_id" };

  const row = await getQueueRow(env, relayQueueId);
  if (!row) return { skipped: true, reason: "relay_queue_row_not_found", relayQueueId };
  if (row.status !== "queued") return { skipped: true, reason: `relay_queue_row_${row.status}`, relayQueueId };

  const delaySeconds = delaySecondsUntil(row.not_before);
  if (delaySeconds > 0) {
    await requeueRelaySendMessage(env, row, delaySeconds);
    return { result: "retried", requeued: true, delaySeconds, relayQueueId };
  }

  const result = await processRow(env, row);
  const updated = await getQueueRow(env, relayQueueId);
  if (result === "retried" && updated?.status === "queued") {
    const retryDelay = Math.max(1, delaySecondsUntil(updated.not_before) || DEFAULT_QUEUE_RETRY_DELAY_SECONDS);
    await requeueRelaySendMessage(env, updated, retryDelay);
    return { result, requeued: true, delaySeconds: retryDelay, relayQueueId };
  }

  return { result, relayQueueId };
}

async function processFlowContinuationQueueMessage(env, body = {}) {
  const payload = schedulePayload(body);
  const validation = validateSchedulePayload(payload);
  if (validation) return { skipped: true, reason: validation };

  const result = await drainPrimaryQueue(env, {
    continuationId: payload.continuationId,
    pageId: payload.pageId,
    continuationLimit: 1
  });

  const bodyResult = result.body && typeof result.body === "object" ? result.body : {};
  const continuations = bodyResult.continuations || {};
  const resumed = Number(continuations.resumed || 0);
  const processed = Number(continuations.processed || 0);
  await recordDelayMetricExecuted(env, payload, result.ok ? "processed" : "failed", {
    method: result.method || "",
    status: result.status || 0,
    processed,
    resumed,
    error: result.error || ""
  });

  if (!result.ok) {
    throw new Error(result.error || bodyResult.errors?.[0]?.message || "flow_continuation_processing_failed");
  }

  return {
    ok: true,
    processed,
    resumed,
    skipped: processed === 0,
    method: result.method || "",
    status: result.status || 0
  };
}

async function requeueRelaySendMessage(env, row = {}, delaySeconds = DEFAULT_QUEUE_RETRY_DELAY_SECONDS) {
  if (!messagesQueueEnabled(env) || !env.MESSAGES_QUEUE) return { ok: false, skipped: true };
  const result = await env.MESSAGES_QUEUE.send({
    type: "relay_send",
    relayQueueId: row.id,
    pageId: row.page_id || row.pageId || "",
    queueId: row.source_queue_id || row.sourceQueueId || "",
    scheduledAt: new Date().toISOString(),
    retry: true
  }, { delaySeconds: Math.max(1, Math.min(QUEUE_MAX_DELAY_SECONDS, Number(delaySeconds) || DEFAULT_QUEUE_RETRY_DELAY_SECONDS)) });

  await recordQueueAudit(env, "message_requeued", {
    queue: "messenlead-messages",
    relayQueueId: row.id,
    pageId: row.page_id || row.pageId || "",
    delaySeconds,
    metrics: result?.metadata?.metrics || null
  });
  return { ok: true, metrics: result?.metadata?.metrics || null };
}

function normalizeQueueMessageBody(body) {
  if (body && typeof body === "object" && !Array.isArray(body)) return body;
  if (typeof body === "string") return parseJson(body);
  return {};
}

function delaySecondsUntil(value) {
  const time = Date.parse(value || "");
  if (!Number.isFinite(time)) return 0;
  return Math.max(0, Math.ceil((time - Date.now()) / 1000));
}

function queueRetryDelaySeconds(attempts) {
  const attempt = Math.max(1, Number(attempts || 0) + 1);
  return Math.min(900, DEFAULT_QUEUE_RETRY_DELAY_SECONDS * attempt * attempt);
}

function queuePublishFailure(env, error, extra = {}) {
  return {
    ok: false,
    fatal: !legacyFallbackEnabled(env),
    error: clean(error, 500),
    ...extra
  };
}

async function ensureSchema(env) {
  if (!env.RELAY_DB) return false;

  await env.RELAY_DB.prepare(`
    CREATE TABLE IF NOT EXISTS relay_send_queue (
      id TEXT PRIMARY KEY,
      source_queue_id TEXT,
      page_id TEXT NOT NULL,
      psid TEXT NOT NULL,
      page_access_token TEXT NOT NULL,
      graph_api_url TEXT NOT NULL,
      messaging_type TEXT NOT NULL DEFAULT 'RESPONSE',
      message_json TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'queued',
      attempts INTEGER NOT NULL DEFAULT 0,
      max_attempts INTEGER NOT NULL DEFAULT 4,
      not_before TEXT NOT NULL,
      policy_expires_at TEXT,
      callback_url TEXT NOT NULL DEFAULT '',
      callback_token TEXT NOT NULL DEFAULT '',
      last_error TEXT,
      response_json TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      sent_at TEXT
    )
  `).run();

  await addColumnIfMissing(env, "relay_send_queue", "callback_url", "TEXT NOT NULL DEFAULT ''");
  await addColumnIfMissing(env, "relay_send_queue", "callback_token", "TEXT NOT NULL DEFAULT ''");

  await env.RELAY_DB.prepare("CREATE INDEX IF NOT EXISTS idx_relay_queue_status_due ON relay_send_queue(status, not_before)").run();
  await env.RELAY_DB.prepare("CREATE INDEX IF NOT EXISTS idx_relay_queue_page_status_due ON relay_send_queue(page_id, status, not_before)").run();
  await env.RELAY_DB.prepare("CREATE INDEX IF NOT EXISTS idx_relay_queue_page_psid_status ON relay_send_queue(page_id, psid, status, created_at DESC)").run();
  await env.RELAY_DB.prepare("CREATE INDEX IF NOT EXISTS idx_relay_queue_sent_page ON relay_send_queue(page_id, sent_at)").run();
  await env.RELAY_DB.prepare("CREATE INDEX IF NOT EXISTS idx_relay_queue_updated ON relay_send_queue(updated_at DESC)").run();
  await env.RELAY_DB.prepare("CREATE INDEX IF NOT EXISTS idx_relay_queue_page_created ON relay_send_queue(page_id, created_at DESC)").run();

  return true;
}

async function addColumnIfMissing(env, table, column, definition) {
  try {
    await env.RELAY_DB.prepare(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`).run();
  } catch (error) {
    const message = String(error?.message || "").toLowerCase();
    if (!message.includes("duplicate column") && !message.includes("already exists")) {
      throw error;
    }
  }
}

async function enqueueRelayMessage(env, body = {}) {
  await ensureSchema(env);
  await cleanupQueue(env);

  const now = new Date().toISOString();
  const sourceQueueId = clean(body.queueId, 160);
  const id = clean(body.relayQueueId, 180) || (sourceQueueId ? `relay_${sourceQueueId}` : makeId("relay"));
  const pageId = clean(body.pageId, 120) || "__global__";
  const maxAttempts = clampNumber(body.maxAttempts || env.MESSENLEAD_RELAY_MAX_ATTEMPTS, 1, 8, DEFAULT_MAX_ATTEMPTS);
  const policyExpiresAt = clean(body.policyExpiresAt, 80) || new Date(Date.now() + RESPONSE_WINDOW_MS).toISOString();

  await env.RELAY_DB.prepare(`
    INSERT INTO relay_send_queue (
      id, source_queue_id, page_id, psid, page_access_token, graph_api_url,
      messaging_type, message_json, status, attempts, max_attempts, not_before,
      policy_expires_at, callback_url, callback_token, last_error, response_json, created_at, updated_at, sent_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'queued', 0, ?, ?, ?, ?, ?, '', '', ?, ?, '')
    ON CONFLICT(id) DO UPDATE SET
      page_access_token = excluded.page_access_token,
      graph_api_url = excluded.graph_api_url,
      messaging_type = excluded.messaging_type,
      message_json = excluded.message_json,
      policy_expires_at = excluded.policy_expires_at,
      callback_url = excluded.callback_url,
      callback_token = excluded.callback_token,
      status = CASE
        WHEN relay_send_queue.status IN ('sent', 'processing') THEN relay_send_queue.status
        ELSE 'queued'
      END,
      not_before = CASE
        WHEN relay_send_queue.status = 'sent' THEN relay_send_queue.not_before
        ELSE excluded.not_before
      END,
      updated_at = excluded.updated_at
  `)
    .bind(
      id,
      sourceQueueId,
      pageId,
      clean(body.psid, 120),
      clean(body.pageAccessToken, 4000),
      clean(body.graphApiUrl, 500) || DEFAULT_GRAPH_URL,
      clean(body.messagingType, 40) || "RESPONSE",
      JSON.stringify(body.message || {}),
      maxAttempts,
      now,
      policyExpiresAt,
      clean(body.statusCallbackUrl, 500),
      clean(body.statusCallbackToken, 500),
      now,
      now
    )
    .run();

  return { id, pageId };
}

async function processQueue(env, options = {}) {
  const hasDb = await ensureSchema(env);
  if (!hasDb) return { processed: 0, sent: 0, retried: 0, skipped: 0, failed: 0, error: "RELAY_DB is not configured" };

  await cleanupQueue(env);
  const limit = clampNumber(options.limit || env.MESSENLEAD_RELAY_DRAIN_LIMIT, 1, 25, DEFAULT_DRAIN_LIMIT);
  const pageId = clean(options.pageId, 120);
  const pageFilter = pageId ? "AND page_id = ?" : "";
  const params = pageId ? [new Date().toISOString(), pageId, limit] : [new Date().toISOString(), limit];
  const rows = await env.RELAY_DB.prepare(`
    SELECT *
    FROM relay_send_queue
    WHERE status = 'queued'
      AND datetime(not_before) <= datetime(?)
      ${pageFilter}
    ORDER BY datetime(not_before) ASC, datetime(created_at) ASC
    LIMIT ?
  `)
    .bind(...params)
    .all();

  const stats = { processed: 0, sent: 0, retried: 0, skipped: 0, failed: 0 };
  for (const row of rows.results || []) {
    stats.processed += 1;
    const result = await processRow(env, row);
    stats[result] = (stats[result] || 0) + 1;
  }
  return stats;
}

async function processRow(env, row) {
  const now = new Date();
  const claim = await env.RELAY_DB.prepare(`
    UPDATE relay_send_queue
    SET status = 'processing', updated_at = ?
    WHERE id = ? AND status = 'queued'
  `)
    .bind(now.toISOString(), row.id)
    .run();

  if (!Number(claim.meta?.changes || 0)) return "skipped";

  if (row.policy_expires_at && Date.parse(row.policy_expires_at) < now.getTime()) {
    await markRow(env, row.id, "skipped", {
      error: "Outside Messenger 24h response window",
      updatedAt: now.toISOString()
    });
    return "skipped";
  }

  const rateLimit = await pageRateLimitStatus(env, row.page_id);
  if (!rateLimit.allowed) {
    await markRow(env, row.id, "queued", {
      error: "Rate limit pending",
      notBefore: new Date(Date.now() + 15000).toISOString(),
      updatedAt: now.toISOString()
    });
    return "retried";
  }

  const message = parseJson(row.message_json);
  const direct = await sendDirect(env, {
    pageAccessToken: row.page_access_token,
    psid: row.psid,
    messagingType: row.messaging_type || "RESPONSE",
    message,
    graphApiUrl: row.graph_api_url || DEFAULT_GRAPH_URL
  });

  if (!direct.ok) {
    return retryOrFail(env, row, graphErrorMessage(direct.status, direct.body), {
      status: direct.status,
      body: direct.body.slice(0, 800)
    });
  }

  const sentAt = new Date().toISOString();
  await markRow(env, row.id, "sent", {
    response: direct.body,
    sentAt,
    updatedAt: sentAt
  });
  await notifyStatusCallback(row, direct, sentAt).catch(() => null);
  return "sent";
}

async function sendDirect(_env, payload) {
  const response = await fetch(`${payload.graphApiUrl || DEFAULT_GRAPH_URL}?access_token=${encodeURIComponent(payload.pageAccessToken)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recipient: { id: payload.psid },
      messaging_type: payload.messagingType || "RESPONSE",
      message: payload.message
    })
  });
  const body = await response.text().catch(() => "");
  return {
    ok: response.ok,
    status: response.status,
    body: body.slice(0, 4000)
  };
}

async function notifyStatusCallback(row, direct, sentAt) {
  const callbackUrl = clean(row.callback_url, 500);
  const callbackToken = clean(row.callback_token, 500);
  if (!callbackUrl || !callbackToken || !direct?.ok) return { ok: false, skipped: true };

  const responseBody = clean(direct.body, 4000);
  const response = await fetch(callbackUrl, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${callbackToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      relayQueueId: row.id,
      queueId: row.source_queue_id || row.id,
      pageId: row.page_id || "",
      psid: row.psid || "",
      status: "sent",
      sentAt,
      responseJson: parseJson(responseBody),
      responseBody
    })
  });

  return { ok: response.ok, status: response.status };
}

async function retryOrFail(env, row, error, details = {}) {
  const attempts = Number(row.attempts || 0) + 1;
  const maxAttempts = Number(row.max_attempts || DEFAULT_MAX_ATTEMPTS);
  const final = attempts >= maxAttempts;
  const now = new Date().toISOString();

  await env.RELAY_DB.prepare(`
    UPDATE relay_send_queue
    SET status = ?, attempts = ?, not_before = ?, last_error = ?, response_json = ?, updated_at = ?
    WHERE id = ? AND status = 'processing'
  `)
    .bind(
      final ? "failed" : "queued",
      attempts,
      final ? now : new Date(Date.now() + retryDelayMs(attempts)).toISOString(),
      String(error || "").slice(0, 1200),
      JSON.stringify(details || {}).slice(0, 4000),
      now,
      row.id
    )
    .run();

  return final ? "failed" : "retried";
}

async function markRow(env, id, status, options = {}) {
  await env.RELAY_DB.prepare(`
    UPDATE relay_send_queue
    SET status = ?,
        not_before = COALESCE(NULLIF(?, ''), not_before),
        last_error = ?,
        response_json = COALESCE(NULLIF(?, ''), response_json),
        updated_at = ?,
        sent_at = COALESCE(NULLIF(?, ''), sent_at)
    WHERE id = ? AND status = 'processing'
  `)
    .bind(
      status,
      options.notBefore || "",
      options.error || "",
      options.response || "",
      options.updatedAt || new Date().toISOString(),
      options.sentAt || "",
      id
    )
    .run();
}

async function pageRateLimitStatus(env, pageId) {
  const maxPerMinute = clampNumber(env.MESSENLEAD_RELAY_SENDS_PER_MINUTE, 1, 250, DEFAULT_SENDS_PER_MINUTE);
  const since = new Date(Date.now() - 60 * 1000).toISOString();
  const row = await env.RELAY_DB.prepare(`
    SELECT COUNT(*) AS sent_count
    FROM relay_send_queue
    WHERE page_id = ?
      AND status = 'sent'
      AND sent_at IS NOT NULL
      AND datetime(sent_at) >= datetime(?)
  `)
    .bind(clean(pageId, 120) || "__global__", since)
    .first();

  const sentLastMinute = Number(row?.sent_count || 0);
  return {
    allowed: sentLastMinute < maxPerMinute,
    sentLastMinute,
    maxPerMinute
  };
}

async function relayCapacityStatus(env, pageId) {
  await ensureSchema(env);

  const normalizedPageId = clean(pageId, 120) || "__global__";
  const minute = await pageRateLimitStatus(env, normalizedPageId);
  if (!minute.allowed) {
    return {
      accepting: false,
      reason: "per_minute_limit",
      pageId: normalizedPageId,
      sentLastMinute: minute.sentLastMinute,
      maxPerMinute: minute.maxPerMinute,
      queued: 0,
      createdLastDay: 0,
      dailySoftLimit: relayDailySoftLimit(env),
      usageRatio: 0
    };
  }

  const queuedLimit = clampOptionalNumber(env.MESSENLEAD_RELAY_MAX_QUEUED, 0, 100000, 5000);
  const queuedRow = await env.RELAY_DB.prepare(`
    SELECT COUNT(*) AS queued_count
    FROM relay_send_queue
    WHERE status = 'queued'
  `)
    .first();
  const queued = Number(queuedRow?.queued_count || 0);
  if (queuedLimit > 0 && queued >= queuedLimit) {
    return {
      accepting: false,
      reason: "queued_backlog_limit",
      pageId: normalizedPageId,
      sentLastMinute: minute.sentLastMinute,
      maxPerMinute: minute.maxPerMinute,
      queued,
      queuedLimit,
      createdLastDay: 0,
      dailySoftLimit: relayDailySoftLimit(env),
      usageRatio: 0
    };
  }

  const dailySoftLimit = relayDailySoftLimit(env);
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const dayRow = await env.RELAY_DB.prepare(`
    SELECT COUNT(*) AS created_count
    FROM relay_send_queue
    WHERE datetime(created_at) >= datetime(?)
  `)
    .bind(since)
    .first();
  const createdLastDay = Number(dayRow?.created_count || 0);
  const usageRatio = dailySoftLimit > 0 ? createdLastDay / dailySoftLimit : 0;
  if (dailySoftLimit > 0 && createdLastDay >= dailySoftLimit) {
    return {
      accepting: false,
      reason: "daily_soft_limit",
      pageId: normalizedPageId,
      sentLastMinute: minute.sentLastMinute,
      maxPerMinute: minute.maxPerMinute,
      queued,
      queuedLimit,
      createdLastDay,
      dailySoftLimit,
      usageRatio
    };
  }

  return {
    accepting: true,
    reason: usageRatio >= 0.85 ? "near_daily_soft_limit" : "ok",
    pageId: normalizedPageId,
    sentLastMinute: minute.sentLastMinute,
    maxPerMinute: minute.maxPerMinute,
    queued,
    queuedLimit,
    createdLastDay,
    dailySoftLimit,
    usageRatio
  };
}

function relayDailySoftLimit(env) {
  return clampOptionalNumber(env.MESSENLEAD_RELAY_DAILY_SEND_SOFT_LIMIT, 0, 1000000, 15000);
}

async function queueStatus(env, options = {}) {
  const hasDb = await ensureSchema(env);
  if (!hasDb) return { hasD1: false, counts: {}, rows: [] };

  await cleanupQueue(env);
  const pageId = clean(options.pageId, 120);
  const status = clean(options.status, 40);
  const limit = clampNumber(options.limit, 1, 100, 30);
  const filters = [];
  const params = [];

  if (pageId) {
    filters.push("page_id = ?");
    params.push(pageId);
  }
  if (status) {
    filters.push("status = ?");
    params.push(status);
  }
  const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

  const counts = await env.RELAY_DB.prepare(`
    SELECT status, COUNT(*) AS count
    FROM relay_send_queue
    ${pageId ? "WHERE page_id = ?" : ""}
    GROUP BY status
  `)
    .bind(...(pageId ? [pageId] : []))
    .all();

  const rows = await env.RELAY_DB.prepare(`
    SELECT id, source_queue_id, page_id, psid, messaging_type, status, attempts, max_attempts,
      not_before, policy_expires_at, last_error, created_at, updated_at, sent_at
    FROM relay_send_queue
    ${where}
    ORDER BY datetime(updated_at) DESC, datetime(created_at) DESC
    LIMIT ?
  `)
    .bind(...params, limit)
    .all();

  return {
    hasD1: true,
    capacity: await relayCapacityStatus(env, pageId || "__global__"),
    counts: Object.fromEntries((counts.results || []).map((row) => [row.status, Number(row.count || 0)])),
    rows: (rows.results || []).map((row) => ({
      id: row.id,
      sourceQueueId: row.source_queue_id || "",
      pageId: row.page_id,
      psid: row.psid,
      messagingType: row.messaging_type,
      status: row.status,
      attempts: Number(row.attempts || 0),
      maxAttempts: Number(row.max_attempts || 0),
      notBefore: row.not_before || "",
      policyExpiresAt: row.policy_expires_at || "",
      lastError: row.last_error || "",
      createdAt: row.created_at || "",
      updatedAt: row.updated_at || "",
      sentAt: row.sent_at || ""
    }))
  };
}

async function resetQueue(env, options = {}) {
  const hasDb = await ensureSchema(env);
  if (!hasDb) return { queued: 0 };

  const pageIds = normalizePageIds(options.pageIds || options.pageId);
  const psids = normalizePsids(options.psids || options.psid);
  const restrictToPsids = Boolean(options.restrictToPsids || psids.length);
  const now = new Date().toISOString();
  const pageFilter = pageIds.length ? `AND page_id IN (${pageIds.map(() => "?").join(", ")})` : "";
  const psidFilter = psids.length ? `AND psid IN (${psids.map(() => "?").join(", ")})` : restrictToPsids ? "AND 1 = 0" : "";
  const result = await env.RELAY_DB.prepare(`
    UPDATE relay_send_queue
    SET status = 'reset',
        last_error = 'Flow runtime reset',
        updated_at = ?
    WHERE status IN ('queued', 'processing')
      ${pageFilter}
      ${psidFilter}
  `)
    .bind(now, ...pageIds, ...psids)
    .run();

  return { queued: Number(result.meta?.changes || 0) };
}

async function getQueueRow(env, id) {
  if (!id || !env.RELAY_DB) return null;
  return env.RELAY_DB.prepare("SELECT * FROM relay_send_queue WHERE id = ?")
    .bind(id)
    .first();
}

async function cleanupQueue(env) {
  if (!env.RELAY_DB) return;

  const queueBefore = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  await env.RELAY_DB.prepare(`
    DELETE FROM relay_send_queue
    WHERE status IN ('sent', 'skipped', 'failed', 'reset')
      AND datetime(updated_at) < datetime(?)
  `)
    .bind(queueBefore)
    .run()
    .catch(() => null);
}

async function queueMetricsDiagnostics(env) {
  const result = {};
  if (env.MESSAGES_QUEUE?.metrics) {
    result.messages = await env.MESSAGES_QUEUE.metrics().catch((error) => ({ error: clean(error.message, 300) }));
  }
  if (env.FLOW_QUEUE?.metrics) {
    result.flow = await env.FLOW_QUEUE.metrics().catch((error) => ({ error: clean(error.message, 300) }));
  }
  if (env.DLQ_QUEUE?.metrics) {
    result.dlq = await env.DLQ_QUEUE.metrics().catch((error) => ({ error: clean(error.message, 300) }));
  }
  return result;
}

async function recordQueueAudit(env, action, metadata = {}) {
  if (!env.RELAY_DB) return false;
  try {
    await ensureQueueAuditSchema(env);
    await env.RELAY_DB.prepare(`
      INSERT INTO queue_audit_log (id, queue_name, action, message_id, metadata_json, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
      .bind(
        makeId("qaudit"),
        clean(metadata.queue || "", 120),
        clean(action, 80),
        clean(metadata.messageId || metadata.relayQueueId || metadata.continuationId || "", 180),
        JSON.stringify(metadata || {}).slice(0, 4000),
        new Date().toISOString()
      )
      .run();
    return true;
  } catch {
    return false;
  }
}

async function ensureQueueAuditSchema(env) {
  await env.RELAY_DB.prepare(`
    CREATE TABLE IF NOT EXISTS queue_audit_log (
      id TEXT PRIMARY KEY,
      queue_name TEXT NOT NULL,
      action TEXT NOT NULL,
      message_id TEXT,
      metadata_json TEXT,
      created_at TEXT NOT NULL
    )
  `).run();
  await env.RELAY_DB.prepare("CREATE INDEX IF NOT EXISTS idx_queue_audit_created ON queue_audit_log(created_at DESC)").run();
  await env.RELAY_DB.prepare("CREATE INDEX IF NOT EXISTS idx_queue_audit_queue_created ON queue_audit_log(queue_name, created_at DESC)").run();
  return true;
}

async function recordDelayMetricScheduled(env, payload = {}, delaySeconds = 0, scheduler = "queue") {
  if (!env.DB) return false;
  try {
    await ensureDelayMetricsSchema(env);
    const now = new Date().toISOString();
    const expectedDelayMs = Math.max(0, Number(delaySeconds || 0) * 1000);
    await env.DB.prepare(`
      INSERT INTO delay_metrics (
        id, continuation_id, scheduled_at, executed_at, expected_delay_ms,
        actual_delay_ms, precision_error_ms, status, created_at
      )
      VALUES (?, ?, ?, '', ?, 0, 0, ?, ?)
      ON CONFLICT(continuation_id) DO UPDATE SET
        scheduled_at = excluded.scheduled_at,
        expected_delay_ms = excluded.expected_delay_ms,
        status = excluded.status
    `)
      .bind(
        makeId("delay_metric"),
        clean(payload.continuationId, 120),
        now,
        expectedDelayMs,
        `scheduled:${scheduler}`,
        now
      )
      .run();
    return true;
  } catch {
    return false;
  }
}

async function recordDelayMetricExecuted(env, payload = {}, status = "processed", details = {}) {
  if (!env.DB) return false;
  try {
    await ensureDelayMetricsSchema(env);
    const now = new Date();
    const continuationId = clean(payload.continuationId, 120);
    const metric = await env.DB.prepare(`
      SELECT scheduled_at, expected_delay_ms
      FROM delay_metrics
      WHERE continuation_id = ?
      LIMIT 1
    `)
      .bind(continuationId)
      .first();
    const scheduledAtMs = Date.parse(metric?.scheduled_at || payload.scheduledAt || "");
    const dueAtMs = Date.parse(payload.dueAt || "");
    const actualDelayMs = Number.isFinite(scheduledAtMs) ? Math.max(0, now.getTime() - scheduledAtMs) : 0;
    const precisionErrorMs = Number.isFinite(dueAtMs) ? now.getTime() - dueAtMs : 0;
    const expectedDelayMs = Number(metric?.expected_delay_ms || Math.max(0, dueAtMs - scheduledAtMs) || 0);

    await env.DB.prepare(`
      INSERT INTO delay_metrics (
        id, continuation_id, scheduled_at, executed_at, expected_delay_ms,
        actual_delay_ms, precision_error_ms, status, created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(continuation_id) DO UPDATE SET
        executed_at = excluded.executed_at,
        actual_delay_ms = excluded.actual_delay_ms,
        precision_error_ms = excluded.precision_error_ms,
        status = excluded.status
    `)
      .bind(
        makeId("delay_metric"),
        continuationId,
        metric?.scheduled_at || payload.scheduledAt || "",
        now.toISOString(),
        expectedDelayMs,
        actualDelayMs,
        precisionErrorMs,
        `${status}:${details.method || "queue"}`,
        now.toISOString()
      )
      .run();
    return true;
  } catch {
    return false;
  }
}

async function ensureDelayMetricsSchema(env) {
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS delay_metrics (
      id TEXT PRIMARY KEY,
      continuation_id TEXT UNIQUE,
      scheduled_at TEXT NOT NULL,
      executed_at TEXT,
      expected_delay_ms INTEGER NOT NULL,
      actual_delay_ms INTEGER,
      precision_error_ms INTEGER,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `).run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_delay_metrics_created ON delay_metrics(created_at DESC)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_delay_metrics_status ON delay_metrics(status, created_at DESC)").run();
  return true;
}

function queuesEnabled(env) {
  return truthy(env.MESSENLEAD_QUEUE_ENABLED);
}

function messagesQueueEnabled(env) {
  return queuesEnabled(env) && truthy(env.MESSENLEAD_USE_QUEUES_FOR_SENDS, true);
}

function flowQueueEnabled(env) {
  return queuesEnabled(env) && truthy(env.MESSENLEAD_USE_QUEUES_FOR_DELAYS, true);
}

function legacyFallbackEnabled(env) {
  return truthy(env.MESSENLEAD_LEGACY_FALLBACK_ENABLED, true);
}

function queueDelayThresholdSeconds(env) {
  return clampNumber(env.MESSENLEAD_QUEUES_DELAY_THRESHOLD_SECONDS, 0, QUEUE_MAX_DELAY_SECONDS, QUEUE_MAX_DELAY_SECONDS);
}

function truthy(value, fallback = false) {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (!normalized) return fallback;
  return ["1", "true", "yes", "on", "enabled"].includes(normalized);
}

function authorize(request, env) {
  const expectedSecret = String(env.MESSENLEAD_SEND_RELAY_SECRET || "").trim();
  if (!expectedSecret) return json({ error: "Relay secret is not configured" }, 503);

  const providedSecret = request.headers.get("x-messenlead-relay-secret") || "";
  if (!timingSafeEqual(providedSecret, expectedSecret)) {
    return json({ error: "Unauthorized" }, 401);
  }
  return null;
}

function authorizeDelayWorkflowRequest(request, env) {
  const expectedSecret = delayWorkflowSecret(env);
  if (!expectedSecret) return json({ error: "Delay workflow secret is not configured" }, 503);

  const providedSecret = request.headers.get("x-messenlead-workflow-secret") || request.headers.get("x-messenlead-relay-secret") || "";
  if (!timingSafeEqual(providedSecret, expectedSecret)) {
    return json({ error: "Unauthorized" }, 401);
  }
  return null;
}

function delayWorkflowSecret(env) {
  return String(env.MESSENLEAD_DELAY_WORKFLOW_SECRET || env.MESSENLEAD_SEND_RELAY_SECRET || "").trim();
}

async function readJson(request) {
  try {
    const body = await request.json();
    return body && typeof body === "object" && !Array.isArray(body) ? body : null;
  } catch {
    return null;
  }
}

function graphErrorMessage(status, body) {
  const parsed = parseJson(body);
  return parsed?.error?.message || parsed?.error || body || `Messenger API HTTP ${status}`;
}

function retryDelayMs(attempts) {
  return [5000, 30000, 120000, 300000, 900000][Math.max(0, Math.min(4, attempts - 1))];
}

function makeId(prefix) {
  return `${prefix}_${crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}_${Math.random().toString(36).slice(2)}`}`;
}

function schedulePayload(value = {}) {
  return {
    continuationId: clean(value.continuationId, 120),
    pageId: clean(value.pageId, 120),
    psid: clean(value.psid, 120),
    flowId: clean(value.flowId, 120),
    delayNodeId: clean(value.delayNodeId, 120),
    resumeNodeId: clean(value.resumeNodeId, 120),
    dueAt: clean(value.dueAt, 80),
    policyExpiresAt: clean(value.policyExpiresAt, 80)
  };
}

function validateSchedulePayload(payload) {
  if (!payload.continuationId) return "continuationId is required";
  if (!payload.pageId) return "pageId is required";
  if (!payload.dueAt || !Number.isFinite(Date.parse(payload.dueAt))) return "dueAt must be a valid ISO date";
  return "";
}

function workflowInstanceId(continuationId) {
  return `delay-${clean(continuationId, 92)}`;
}

function queueScheduleId(continuationId) {
  return `queue-${clean(continuationId, 92)}`;
}

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

function clean(value, max) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, max);
}

function normalizePageIds(value) {
  const raw = Array.isArray(value) ? value : String(value || "").split(",");
  return raw
    .map((item) => clean(item, 120))
    .filter((item) => item && !["__all__", "*", "all"].includes(item));
}

function normalizePsids(value) {
  const raw = Array.isArray(value) ? value : String(value || "").split(",");
  const seen = new Set();
  const psids = [];
  raw.forEach((item) => {
    const psid = clean(item, 120);
    if (!psid || seen.has(psid)) return;
    seen.add(psid);
    psids.push(psid);
  });
  return psids;
}

function clampNumber(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, Math.floor(number)));
}

function clampOptionalNumber(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  if (number <= 0) return 0;
  return Math.max(min, Math.min(max, Math.floor(number)));
}

function parseJson(value) {
  try {
    return value ? JSON.parse(value) : {};
  } catch {
    return {};
  }
}

function timingSafeEqual(left, right) {
  if (left.length !== right.length) return false;

  let result = 0;
  for (let index = 0; index < left.length; index += 1) {
    result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return result === 0;
}
