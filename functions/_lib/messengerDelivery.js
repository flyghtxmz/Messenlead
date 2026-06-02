import { getStoredPageAccessToken } from "./pages.js";
import { createMessengerContactToken } from "./pixel.js";
import { safeAddFlowLog } from "./flowLogs.js";

const RESPONSE_WINDOW_MS = 24 * 60 * 60 * 1000;
const DEFAULT_QUEUE_LIMIT = 8;
const DEFAULT_MAX_ATTEMPTS = 4;
const DEFAULT_SENDS_PER_MINUTE = 50;

export async function ensureMessengerDeliverySchema(env) {
  if (!env.DB) return false;

  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS messenger_event_dedup (
      id TEXT PRIMARY KEY,
      page_id TEXT NOT NULL,
      psid TEXT,
      event_type TEXT,
      created_at TEXT NOT NULL
    )
  `).run();

  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS messenger_send_queue (
      id TEXT PRIMARY KEY,
      page_id TEXT NOT NULL,
      psid TEXT NOT NULL,
      flow_id TEXT,
      flow_name TEXT,
      event_id TEXT,
      reply_json TEXT NOT NULL,
      messaging_type TEXT NOT NULL DEFAULT 'RESPONSE',
      status TEXT NOT NULL DEFAULT 'queued',
      attempts INTEGER NOT NULL DEFAULT 0,
      max_attempts INTEGER NOT NULL DEFAULT 4,
      not_before TEXT NOT NULL,
      policy_expires_at TEXT,
      last_error TEXT,
      response_json TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      sent_at TEXT
    )
  `).run();

  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_messenger_queue_status_due ON messenger_send_queue(status, not_before)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_messenger_queue_page_status ON messenger_send_queue(page_id, status, not_before)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_messenger_queue_sent_page ON messenger_send_queue(page_id, sent_at)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_messenger_event_dedup_created ON messenger_event_dedup(created_at)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_messenger_queue_page_psid_status ON messenger_send_queue(page_id, psid, status, created_at DESC)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_messenger_queue_flow_status ON messenger_send_queue(flow_id, status, created_at DESC)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_messenger_event_dedup_page_created ON messenger_event_dedup(page_id, created_at DESC)").run();

  return true;
}

export function messengerEventDedupId(pageId, event = {}) {
  const psid = event.sender?.id || "";
  const type = event.message?.quick_reply ? "quick_reply" : event.message ? "message" : event.postback ? "postback" : event.optin ? "optin" : event.referral ? "referral" : "unknown";
  const stableId =
    event.message?.mid ||
    event.postback?.mid ||
    event.postback?.payload ||
    event.optin?.ref ||
    event.referral?.ref ||
    event.referral?.ad_id ||
    event.referral?.ads_context_data?.ad_id ||
    event.message?.quick_reply?.payload ||
    event.message?.text ||
    "event";
  return [pageId || "__global__", psid || "no_psid", type, event.timestamp || "no_ts", stableId].join(":");
}

export async function reserveMessengerEvent(env, event = {}) {
  const hasDb = await ensureMessengerDeliverySchema(env);
  if (!hasDb) return { reserved: true, id: event.id || "" };

  const id = String(event.id || "").slice(0, 500);
  if (!id) return { reserved: true, id: "" };

  try {
    await cleanupMessengerDelivery(env);
    const result = await env.DB.prepare(`
      INSERT OR IGNORE INTO messenger_event_dedup (id, page_id, psid, event_type, created_at)
      VALUES (?, ?, ?, ?, ?)
    `)
      .bind(
        id,
        normalizePageId(event.pageId),
        String(event.psid || ""),
        String(event.eventType || ""),
        new Date().toISOString()
      )
      .run();

    return {
      reserved: Number(result.meta?.changes || 0) > 0,
      id
    };
  } catch {
    return { reserved: true, id };
  }
}

export async function resetMessengerSendQueue(env, options = {}) {
  const hasDb = await ensureMessengerDeliverySchema(env);
  if (!hasDb) return { queued: 0 };

  const pageIds = normalizePageIds(options.pageIds || options.pageId);
  const now = new Date().toISOString();
  const pageFilter = pageIds.length ? `AND page_id IN (${pageIds.map(() => "?").join(", ")})` : "";
  const result = await env.DB.prepare(`
    UPDATE messenger_send_queue
    SET status = 'reset',
        last_error = 'Flow runtime reset',
        updated_at = ?
    WHERE status IN ('queued', 'processing')
      ${pageFilter}
  `)
    .bind(now, ...pageIds)
    .run();

  return { queued: Number(result.meta?.changes || 0) };
}

export async function resetExternalRelayQueues(env, options = {}) {
  const targets = parseRelayTargets(env);
  if (!targets.length) return [];

  const pageIds = normalizePageIds(options.pageIds || options.pageId);
  const results = [];

  for (const target of targets) {
    const resetUrl = relayEndpointUrl(target.url, "/queue/reset");
    try {
      const response = await fetch(resetUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-messenlead-relay-secret": target.secret
        },
        body: JSON.stringify({ pageIds })
      });
      const body = await response.json().catch(() => ({}));
      results.push({
        url: resetUrl,
        ok: response.ok,
        status: response.status,
        reset: body.reset || body.result || {},
        error: body.error || ""
      });
    } catch (error) {
      results.push({
        url: resetUrl,
        ok: false,
        status: 0,
        reset: {},
        error: error.message || "relay_reset_failed"
      });
    }
  }

  return results;
}

export async function enqueueMessengerReplies(env, options = {}) {
  const pageId = normalizePageId(options.pageId);
  const psid = String(options.psid || "").trim();
  const replies = Array.isArray(options.replies) ? options.replies.slice(0, 10).filter((reply) => !isBlockedDefaultGreetingReply(reply)) : [];
  const policyExpiresAt = options.policyExpiresAt || new Date(Date.now() + RESPONSE_WINDOW_MS).toISOString();

  if (!psid || !replies.length) return [];

  const relayResult = shouldUseExternalRelayQueue(env)
    ? await enqueueMessengerRepliesViaRelay(env, {
      ...options,
      pageId,
      psid,
      replies,
      policyExpiresAt
    })
    : null;

  if (relayResult?.handled) {
    const localQueued = relayResult.localFallbackReplies?.length
      ? await enqueueMessengerRepliesLocal(env, {
        ...options,
        pageId,
        psid,
        replies: relayResult.localFallbackReplies,
        policyExpiresAt
      })
      : [];
    return [...relayResult.queued, ...localQueued];
  }

  return enqueueMessengerRepliesLocal(env, {
    ...options,
    pageId,
    psid,
    replies,
    policyExpiresAt
  });
}

async function enqueueMessengerRepliesLocal(env, options = {}) {
  const now = new Date().toISOString();
  const pageId = normalizePageId(options.pageId);
  const psid = String(options.psid || "").trim();
  const replies = Array.isArray(options.replies) ? options.replies : [];
  const flow = options.flow || {};
  const maxAttempts = clampNumber(env.MESSENLEAD_SEND_MAX_ATTEMPTS, 1, 8, DEFAULT_MAX_ATTEMPTS);
  const policyExpiresAt = options.policyExpiresAt || new Date(Date.now() + RESPONSE_WINDOW_MS).toISOString();
  const queued = [];

  if (!psid || !replies.length) return queued;

  const hasDb = await ensureMessengerDeliverySchema(env);
  if (!hasDb) return [];

  for (const reply of replies.slice(0, 10)) {
    const id = `msg_${crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}_${Math.random().toString(36).slice(2)}`}`;
    await env.DB.prepare(`
      INSERT INTO messenger_send_queue (
        id, page_id, psid, flow_id, flow_name, event_id, reply_json, messaging_type,
        status, attempts, max_attempts, not_before, policy_expires_at, last_error,
        response_json, created_at, updated_at, sent_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'queued', 0, ?, ?, ?, '', '', ?, ?, '')
    `)
      .bind(
        id,
        pageId,
        psid,
        flow.id || "",
        flow.name || "",
        options.eventId || "",
        JSON.stringify(reply || {}),
        options.messagingType || "RESPONSE",
        maxAttempts,
        now,
        policyExpiresAt,
        now,
        now
      )
      .run();
    queued.push(id);
  }

  return queued;
}

export async function processMessengerSendQueue(env, options = {}) {
  const hasDb = await ensureMessengerDeliverySchema(env);
  if (!hasDb) return { processed: 0, sent: 0, retried: 0, skipped: 0, failed: 0 };

  await cleanupMessengerDelivery(env);
  const limit = clampNumber(options.limit || env.MESSENLEAD_QUEUE_DRAIN_LIMIT, 1, 25, DEFAULT_QUEUE_LIMIT);
  const pageFilter = options.pageId ? "AND page_id = ?" : "";
  const params = options.pageId ? [new Date().toISOString(), normalizePageId(options.pageId), limit] : [new Date().toISOString(), limit];
  const rows = await env.DB.prepare(`
    SELECT *
    FROM messenger_send_queue
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
    const result = await processQueueRow(env, row, options);
    stats[result] = (stats[result] || 0) + 1;
  }
  return stats;
}

async function enqueueMessengerRepliesViaRelay(env, options = {}) {
  const relays = parseRelayTargets(env);
  if (!relays.length) return null;

  const pageId = normalizePageId(options.pageId);
  const psid = String(options.psid || "").trim();
  const replies = Array.isArray(options.replies) ? options.replies.slice(0, 10) : [];
  const pageAccessToken = (pageId ? await getStoredPageAccessToken(env, pageId) : "") || env.MESSENGER_PAGE_ACCESS_TOKEN || "";
  if (!pageAccessToken) {
    await logRelayQueueIssue(env, options, "error", "relay_enqueue_failed", "Relay nao recebeu o envio: token da Pagina nao encontrado.", {
      pageId,
      psid
    });
    return null;
  }

  const queued = [];
  const localFallbackReplies = [];
  const errors = [];
  for (let index = 0; index < replies.length; index += 1) {
    const reply = replies[index];
    const queueId = externalRelayQueueId(options.eventId, index);
    const relayOrder = orderedRelayTargets(relays, `${pageId}:${psid}:${queueId}`);

    try {
      const message = await messengerMessagePayload(reply, env, pageId, psid);
      let accepted = false;
      let lastError = null;

      for (let relayIndex = 0; relayIndex < relayOrder.length; relayIndex += 1) {
        const relay = relayOrder[relayIndex];
        const result = await enqueueReplyOnRelay(relay, {
          pageId,
          psid,
          queueId,
          pageAccessToken,
          messagingType: options.messagingType || "RESPONSE",
          graphApiUrl: env.MESSENGER_GRAPH_API_URL || "https://graph.facebook.com/v23.0/me/messages",
          policyExpiresAt: options.policyExpiresAt || "",
          maxAttempts: env.MESSENLEAD_SEND_MAX_ATTEMPTS || DEFAULT_MAX_ATTEMPTS,
          message
        });

        if (result.ok) {
          queued.push(result.relayQueueId || queueId);
          accepted = true;
          break;
        }

        lastError = result.error;
        errors.push(result.error);
        if (!shouldTryNextRelay(env, result, relayIndex, relayOrder.length)) break;
      }

      if (!accepted && shouldUseLocalRelayFallback(env, lastError)) {
        localFallbackReplies.push(reply);
      }
    } catch (error) {
      const relayError = { queueId, ambiguous: true, retryable: true, error: error.message || "relay_enqueue_failed" };
      errors.push(relayError);
      if (shouldUseLocalRelayFallback(env, relayError)) localFallbackReplies.push(reply);
    }
  }

  if (errors.length) {
    await logRelayQueueIssue(env, options, queued.length || localFallbackReplies.length ? "warn" : "error", queued.length || localFallbackReplies.length ? "relay_enqueue_partial_failed" : "relay_enqueue_failed", queued.length || localFallbackReplies.length ? "Parte das respostas foi aceita pelo relay ou enviada para fallback local." : "Relay nao aceitou as respostas e o fallback local foi bloqueado.", {
      queuedCount: queued.length,
      localFallbackCount: localFallbackReplies.length,
      errorCount: errors.length,
      errors: errors.slice(0, 5)
    });
  }

  return {
    handled: true,
    queued,
    localFallbackReplies,
    policyExpiresAt: options.policyExpiresAt || ""
  };
}

async function enqueueReplyOnRelay(relay, payload) {
  try {
    const response = await fetch(relay.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Messenlead-Relay-Secret": relay.secret || ""
      },
      body: JSON.stringify(payload)
    });
    const text = await response.text().catch(() => "");
    const body = parseJson(text);
    const accepted = response.ok && body.ok !== false && (body.accepted || body.relayQueued || body.direct);

    if (accepted) {
      return {
        ok: true,
        relayQueueId: body.relayQueueId || payload.queueId,
        status: response.status,
        relayUrl: relay.url
      };
    }

    const retryable = Boolean(body.retryable || body.capacityFull || response.status === 429 || response.status === 401 || response.status >= 500);
    return {
      ok: false,
      retryable,
      ambiguous: false,
      error: {
        queueId: payload.queueId,
        retryable,
        ambiguous: false,
        status: response.status,
        relayUrl: relay.url,
        capacityFull: Boolean(body.capacityFull),
        reason: body.reason || body.status || "",
        body: (body.body || body.error || text).slice(0, 500)
      }
    };
  } catch (error) {
    return {
      ok: false,
      retryable: true,
      ambiguous: true,
      error: {
        queueId: payload.queueId,
        retryable: true,
        ambiguous: true,
        relayUrl: relay.url,
        error: error.message || "relay_fetch_failed"
      }
    };
  }
}

function shouldTryNextRelay(env, result, relayIndex, relayCount) {
  if (relayIndex >= relayCount - 1) return false;

  const mode = String(env.MESSENLEAD_SEND_RELAY_FAILOVER || "safe").trim().toLowerCase();
  if (["off", "false", "none"].includes(mode)) return false;
  if (["aggressive", "all"].includes(mode)) return Boolean(result.retryable);
  return Boolean(result.retryable && !result.ambiguous);
}

function shouldUseLocalRelayFallback(env, error = null) {
  if (String(env.MESSENLEAD_RELAY_DISABLE_LOCAL_FALLBACK || "").toLowerCase() === "true") return false;

  const mode = String(env.MESSENLEAD_RELAY_LOCAL_FALLBACK || "explicit").trim().toLowerCase();
  if (["off", "false", "none"].includes(mode)) return false;
  if (["aggressive", "all"].includes(mode)) return true;
  return !error?.ambiguous;
}

async function cleanupMessengerDelivery(env) {
  const dedupBefore = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const queueBefore = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  await env.DB.prepare("DELETE FROM messenger_event_dedup WHERE datetime(created_at) < datetime(?)")
    .bind(dedupBefore)
    .run()
    .catch(() => null);
  await env.DB.prepare(`
    DELETE FROM messenger_send_queue
    WHERE status IN ('sent', 'skipped', 'failed', 'reset')
      AND datetime(updated_at) < datetime(?)
  `)
    .bind(queueBefore)
    .run()
    .catch(() => null);
}

export async function messengerPolicyStatus(env, pageId, psid, now = Date.now()) {
  if (!env.DB || !pageId || !psid) {
    return { allowed: false, reason: "missing_context", lastSeen: "", expiresAt: "" };
  }

  try {
    const row = await env.DB.prepare("SELECT last_seen FROM contacts WHERE page_id = ? AND psid = ?")
      .bind(normalizePageId(pageId), String(psid || ""))
      .first();
    const lastSeen = row?.last_seen || "";
    const lastSeenTime = Date.parse(lastSeen);
    if (!Number.isFinite(lastSeenTime)) {
      return { allowed: false, reason: "no_last_seen", lastSeen: "", expiresAt: "" };
    }
    const expiresAt = new Date(lastSeenTime + RESPONSE_WINDOW_MS).toISOString();
    return {
      allowed: now <= lastSeenTime + RESPONSE_WINDOW_MS,
      reason: now <= lastSeenTime + RESPONSE_WINDOW_MS ? "inside_24h" : "outside_24h",
      lastSeen,
      expiresAt
    };
  } catch {
    return { allowed: false, reason: "policy_check_failed", lastSeen: "", expiresAt: "" };
  }
}

async function processQueueRow(env, row, options = {}) {
  const now = new Date();
  const log = queueLogger(env, row);

  const claim = await env.DB.prepare(`
    UPDATE messenger_send_queue
    SET status = 'processing', updated_at = ?
    WHERE id = ? AND status = 'queued'
  `)
    .bind(now.toISOString(), row.id)
    .run();

  if (!Number(claim.meta?.changes || 0)) return "skipped";

  if (row.policy_expires_at && Date.parse(row.policy_expires_at) < now.getTime()) {
    await markQueueRow(env, row.id, "skipped", {
      error: "Outside Messenger 24h response window",
      updatedAt: now.toISOString()
    });
    await log("warn", "send_policy_skipped", "Envio ignorado: janela de 24h do Messenger expirada.", {
      queueId: row.id,
      policyExpiresAt: row.policy_expires_at
    });
    return "skipped";
  }

  const rateLimit = await pageRateLimitStatus(env, row.page_id);
  if (!rateLimit.allowed) {
    await markQueueRow(env, row.id, "queued", {
      error: "Rate limit pending",
      notBefore: new Date(Date.now() + 15000).toISOString(),
      updatedAt: now.toISOString()
    });
    await log("warn", "send_rate_limited", "Envio adiado por limite de taxa.", {
      queueId: row.id,
      sentLastMinute: rateLimit.sentLastMinute,
      maxPerMinute: rateLimit.maxPerMinute
    });
    return "retried";
  }

  const pageAccessToken = (await getStoredPageAccessToken(env, row.page_id)) || env.MESSENGER_PAGE_ACCESS_TOKEN || "";
  if (!pageAccessToken) {
    return retryOrFail(env, row, "Token da Pagina nao encontrado.", log);
  }

  try {
    const reply = parseJson(row.reply_json);
    if (isBlockedDefaultGreetingReply(reply)) {
      await markQueueRow(env, row.id, "skipped", {
        response: "Blocked default Meta greeting",
        updatedAt: new Date().toISOString()
      });
      await log("warn", "default_greeting_blocked", "Envio bloqueado porque parece a saudacao padrao da Meta.", {
        queueId: row.id
      });
      return "skipped";
    }
    const message = await messengerMessagePayload(reply, env, row.page_id, row.psid);
    const sendResult = await sendMessengerApi(env, {
      pageId: row.page_id,
      psid: row.psid,
      pageAccessToken,
      messagingType: row.messaging_type || "RESPONSE",
      message,
      queueId: row.id,
      policyExpiresAt: row.policy_expires_at || ""
    });

    if (!sendResult.ok) {
      return retryOrFail(env, row, graphErrorMessage(sendResult.status, sendResult.body), log, {
        status: sendResult.status,
        relayUrl: sendResult.relayUrl || "",
        body: sendResult.body.slice(0, 800)
      });
    }

    await markQueueRow(env, row.id, "sent", {
      response: sendResult.body,
      sentAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    await log("info", "send_success", "Resposta enviada pelo Messenger.", {
      queueId: row.id,
      status: sendResult.status,
      relayUrl: sendResult.relayUrl || "",
      body: sendResult.body.slice(0, 500)
    });
    return "sent";
  } catch (error) {
    return retryOrFail(env, row, error.message || "Messenger send failed", log);
  }
}

export function isBlockedDefaultGreetingText(value) {
  const normalizedText = normalizeText(String(value || ""))
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = normalizedText.split(" ").filter(Boolean);
  if (words[0] !== "hola") return false;
  if (words.length < 5 || words.length > 8) return false;
  return normalizedText.endsWith(" como podemos ayudarte") || normalizedText.endsWith(" en que podemos ayudarte");
}

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function isBlockedDefaultGreetingReply(reply = {}) {
  if (!reply || typeof reply !== "object") return false;
  return isBlockedDefaultGreetingText(reply.text);
}

async function sendMessengerApi(env, payload) {
  const relayTargets = parseRelayTargets(env);
  const relay = relayTargets.length ? pickRelayTarget(relayTargets, `${payload.pageId}:${payload.psid}:${payload.queueId}`) : null;
  if (!relay) return sendMessengerApiDirect(env, payload);

  try {
    return await sendMessengerApiRelay(env, relay, payload);
  } catch (error) {
    if (String(env.MESSENLEAD_RELAY_FALLBACK_DIRECT || "").toLowerCase() === "true") {
      return sendMessengerApiDirect(env, payload);
    }
    return {
      ok: false,
      status: 0,
      relayUrl: relay.url,
      body: error.message || "Messenger relay failed"
    };
  }
}

async function sendMessengerApiDirect(env, payload) {
  const graphUrl = env.MESSENGER_GRAPH_API_URL || "https://graph.facebook.com/v23.0/me/messages";
  const response = await fetch(`${graphUrl}?access_token=${encodeURIComponent(payload.pageAccessToken)}`, {
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
    body,
    relayUrl: ""
  };
}

async function sendMessengerApiRelay(env, relay, payload) {
  const response = await fetch(relay.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Messenlead-Relay-Secret": relay.secret || ""
    },
    body: JSON.stringify({
      pageId: payload.pageId,
      psid: payload.psid,
      queueId: payload.queueId,
      pageAccessToken: payload.pageAccessToken,
      messagingType: payload.messagingType || "RESPONSE",
      graphApiUrl: env.MESSENGER_GRAPH_API_URL || "https://graph.facebook.com/v23.0/me/messages",
      policyExpiresAt: payload.policyExpiresAt || "",
      message: payload.message
    })
  });
  const body = await response.text().catch(() => "");
  if (!response.ok) {
    const parsed = parseJson(body);
    return {
      ok: false,
      status: Number(parsed.status || response.status),
      body: parsed.body || body,
      relayUrl: relay.url
    };
  }

  const parsed = parseJson(body);
  return {
    ok: parsed.ok !== false,
    status: Number(parsed.status || response.status),
    body: parsed.body || body,
    relayUrl: relay.url
  };
}

async function retryOrFail(env, row, error, log, details = {}) {
  const attempts = Number(row.attempts || 0) + 1;
  const maxAttempts = Number(row.max_attempts || DEFAULT_MAX_ATTEMPTS);
  const final = attempts >= maxAttempts;
  const now = new Date().toISOString();

  await env.DB.prepare(`
    UPDATE messenger_send_queue
    SET status = ?, attempts = ?, not_before = ?, last_error = ?, updated_at = ?
    WHERE id = ? AND status = 'processing'
  `)
    .bind(
      final ? "failed" : "queued",
      attempts,
      final ? now : new Date(Date.now() + retryDelayMs(attempts)).toISOString(),
      String(error || "").slice(0, 1200),
      now,
      row.id
    )
    .run();

  await log(final ? "error" : "warn", final ? "send_failed" : "send_retry_scheduled", final ? "Envio falhou definitivamente." : "Envio falhou e foi reagendado.", {
    queueId: row.id,
    attempts,
    maxAttempts,
    error,
    ...details
  });
  return final ? "failed" : "retried";
}

async function markQueueRow(env, id, status, options = {}) {
  await env.DB.prepare(`
    UPDATE messenger_send_queue
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
  const maxPerMinute = clampNumber(env.MESSENLEAD_SENDS_PER_MINUTE, 1, 250, DEFAULT_SENDS_PER_MINUTE);
  const since = new Date(Date.now() - 60 * 1000).toISOString();
  const row = await env.DB.prepare(`
    SELECT COUNT(*) AS sent_count
    FROM messenger_send_queue
    WHERE page_id = ?
      AND status = 'sent'
      AND sent_at IS NOT NULL
      AND datetime(sent_at) >= datetime(?)
  `)
    .bind(normalizePageId(pageId), since)
    .first();
  const sentLastMinute = Number(row?.sent_count || 0);
  return {
    allowed: sentLastMinute < maxPerMinute,
    sentLastMinute,
    maxPerMinute
  };
}

function queueLogger(env, row) {
  return async (level, event, message, data = {}) => {
    await safeAddFlowLog(env, {
      pageId: row.page_id,
      psid: row.psid,
      flowId: row.flow_id || "",
      flowName: row.flow_name || "",
      level,
      event,
      message,
      data
    });
  };
}

async function logRelayQueueIssue(env, options = {}, level, event, message, data = {}) {
  await safeAddFlowLog(env, {
    pageId: options.pageId,
    psid: options.psid,
    flowId: options.flow?.id || "",
    flowName: options.flow?.name || "",
    level,
    event,
    message,
    data
  });
}

function retryDelayMs(attempts) {
  return [5000, 30000, 120000, 300000, 900000][Math.max(0, Math.min(4, attempts - 1))];
}

function graphErrorMessage(status, body) {
  const parsed = parseJson(body);
  return parsed?.error?.message || parsed?.error || body || `Messenger API HTTP ${status}`;
}

async function messengerMessagePayload(reply, env, pageId, psid) {
  const message = {};

  if (reply.type === "attachment") {
    message.attachment = {
      type: reply.attachmentType,
      payload: {
        url: reply.url,
        is_reusable: true
      }
    };
  } else if (reply.type === "generic") {
    message.attachment = {
      type: "template",
      payload: {
        template_type: "generic",
        elements: await Promise.all(
          (reply.elements || []).slice(0, 10).map(async (element) => ({
            title: String(element.title || "Card").slice(0, 80),
            subtitle: String(element.subtitle || "").slice(0, 80),
            image_url: element.image_url || undefined,
            buttons: await messengerButtons(element.buttons || [], env, pageId, psid)
          }))
        )
      }
    };
  } else if (reply.buttons?.length) {
    message.attachment = {
      type: "template",
      payload: {
        template_type: "button",
        text: String(reply.text || "Escolha uma opcao").slice(0, 640),
        buttons: (await messengerButtons(reply.buttons, env, pageId, psid)).slice(0, 3)
      }
    };
  } else {
    message.text = String(reply.text || "").slice(0, 2000);
  }

  if (reply.quickReplies?.length && !reply.buttons?.length) {
    message.quick_replies = reply.quickReplies.slice(0, 11).map((option) => ({
      content_type: "text",
      title: String(option.title || option).slice(0, 20),
      payload: String(option.payload || option.title || option).slice(0, 1000)
    }));
  }

  return message;
}

async function messengerButtons(buttons = [], env, pageId, psid) {
  const hasTrackedUrl = buttons.some((button) => button.type === "url" && button.url);
  const contactToken = hasTrackedUrl ? await createMessengerContactToken(env, pageId, psid) : "";

  return buttons.slice(0, 3).map((button) => {
    if (button.type === "url" && button.url) {
      return {
        type: "web_url",
        title: String(button.title || "Abrir").slice(0, 20),
        url: trackedMessengerUrl(button.url, {
          pageId,
          contactToken,
          button: button.title || button.payload || button.id || "link",
          buttonId: button.payload || button.id || "",
          flowId: button.tracking?.flowId || "",
          nodeId: button.tracking?.nodeId || "",
          nodeNumber: button.tracking?.nodeNumber || "",
          nodeTitle: button.tracking?.nodeTitle || ""
        })
      };
    }
    if (button.type === "phone" && button.phone) {
      return {
        type: "phone_number",
        title: String(button.title || "Ligar").slice(0, 20),
        payload: button.phone
      };
    }
    return {
      type: "postback",
      title: String(button.title || "Continuar").slice(0, 20),
      payload: String(button.payload || button.id || button.title || "NEXT").slice(0, 1000)
    };
  });
}

function trackedMessengerUrl(value, tracking = {}) {
  try {
    const url = new URL(value);
    if (tracking.contactToken) url.searchParams.set("ml_contact", tracking.contactToken);
    if (tracking.pageId) url.searchParams.set("ml_page_id", tracking.pageId);
    url.searchParams.set("ml_source", "messenger");
    if (tracking.button) url.searchParams.set("ml_button", String(tracking.button).slice(0, 120));
    if (tracking.buttonId) url.searchParams.set("ml_button_id", String(tracking.buttonId).slice(0, 120));
    if (tracking.flowId) url.searchParams.set("ml_flow_id", String(tracking.flowId).slice(0, 120));
    if (tracking.nodeId) url.searchParams.set("ml_node_id", String(tracking.nodeId).slice(0, 120));
    if (tracking.nodeNumber) url.searchParams.set("ml_node_number", String(tracking.nodeNumber).slice(0, 12));
    if (tracking.nodeTitle) url.searchParams.set("ml_node_title", String(tracking.nodeTitle).slice(0, 120));
    url.searchParams.set("ml_link_id", makePixelLinkId());
    return url.toString();
  } catch {
    return value;
  }
}

function makePixelLinkId() {
  return `lnk_${crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}_${Math.random().toString(36).slice(2)}`}`;
}

function parseRelayTargets(env) {
  const raw = String(env.MESSENLEAD_SEND_RELAY_URLS || env.MESSENLEAD_SEND_RELAY_URL || "").trim();
  const defaultSecret = String(env.MESSENLEAD_SEND_RELAY_SECRET || "").trim();
  if (!raw) return [];

  return raw
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const [url, inlineSecret] = item.split("|");
      return {
        url: normalizeRelayUrl(url),
        secret: String(inlineSecret || defaultSecret).trim()
      };
    })
    .filter((item) => item.url);
}

function shouldUseExternalRelayQueue(env) {
  const mode = String(env.MESSENLEAD_SEND_RELAY_MODE || "external").trim().toLowerCase();
  if (["local", "direct-only", "off", "false"].includes(mode)) return false;
  return parseRelayTargets(env).length > 0;
}

function normalizeRelayUrl(value) {
  const url = String(value || "").trim();
  if (!url) return "";
  return url.endsWith("/send") ? url : `${url.replace(/\/+$/g, "")}/send`;
}

function relayEndpointUrl(value, path) {
  const url = String(value || "").replace(/\/send$/g, "").replace(/\/+$/g, "");
  return `${url}${path}`;
}

function externalRelayQueueId(eventId, index) {
  const stable = String(eventId || "").trim();
  if (stable) return `ext_${stableHash(stable)}_${index}`;
  return `ext_${Date.now()}_${index}_${Math.random().toString(36).slice(2)}`;
}

function pickRelayTarget(targets, key) {
  return orderedRelayTargets(targets, key)[0] || null;
}

function orderedRelayTargets(targets, key) {
  return [...targets]
    .map((target, index) => ({
      ...target,
      index,
      score: stableHash(`${key}:${target.url}:${index}`)
    }))
    .sort((left, right) => right.score - left.score);
}

function stableHash(value) {
  let hash = 0;
  for (const char of String(value || "")) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return hash;
}

function parseJson(value) {
  try {
    return value ? JSON.parse(value) : {};
  } catch {
    return {};
  }
}

function normalizePageId(pageId) {
  return String(pageId || "__global__").trim() || "__global__";
}

function normalizePageIds(value) {
  const raw = Array.isArray(value) ? value : String(value || "").split(",");
  return raw
    .map((item) => normalizePageId(item))
    .filter((item) => item && !["__all__", "*", "all"].includes(item));
}

function clampNumber(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, Math.floor(number)));
}
