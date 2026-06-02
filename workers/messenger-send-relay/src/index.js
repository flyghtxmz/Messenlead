const DEFAULT_GRAPH_URL = "https://graph.facebook.com/v23.0/me/messages";
const DEFAULT_MAX_ATTEMPTS = 4;
const DEFAULT_DRAIN_LIMIT = 8;
const DEFAULT_SENDS_PER_MINUTE = 50;
const DEFAULT_SCHEDULED_PUMP_MS = 0;
const DEFAULT_SCHEDULED_POLL_MS = 5000;
const RESPONSE_WINDOW_MS = 24 * 60 * 60 * 1000;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/health") {
      return json({
        ok: true,
        service: "messenlead-messenger-send-relay",
        hasD1: Boolean(env.RELAY_DB)
      });
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
        pageIds: body.pageIds || body.pageId || url.searchParams.get("pageId")
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

  do {
    totals.passes += 1;

    const primary = await drainPrimaryQueue(env);
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

  return {
    ...totals,
    elapsedMs: Date.now() - startedAt
  };
}

function primaryQueueConfigured(env) {
  return Boolean(
    clean(env.MESSENLEAD_PRIMARY_QUEUE_URL || env.MESSENLEAD_MAIN_QUEUE_URL, 500) &&
      clean(env.MESSENLEAD_PRIMARY_QUEUE_TOKEN || env.MESSENLEAD_OPERATOR_TOKEN, 500)
  );
}

async function drainPrimaryQueue(env) {
  const queueUrl = clean(env.MESSENLEAD_PRIMARY_QUEUE_URL || env.MESSENLEAD_MAIN_QUEUE_URL, 500);
  const token = clean(env.MESSENLEAD_PRIMARY_QUEUE_TOKEN || env.MESSENLEAD_OPERATOR_TOKEN, 500);
  if (!queueUrl || !token) return { ok: false, skipped: true };

  try {
    const response = await fetch(queueUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        limit: env.MESSENLEAD_PRIMARY_QUEUE_DRAIN_LIMIT || 12,
        continuationLimit: env.MESSENLEAD_PRIMARY_CONTINUATION_LIMIT || 8,
        linkClickTimeoutLimit: env.MESSENLEAD_PRIMARY_LINK_CLICK_TIMEOUT_LIMIT || env.MESSENLEAD_PRIMARY_CONTINUATION_LIMIT || 8
      })
    });
    const body = await response.json().catch(() => ({}));
    return {
      ok: response.ok,
      status: response.status,
      body
    };
  } catch (error) {
    return {
      ok: false,
      error: error.message || "primary_queue_failed"
    };
  }
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
    capacity,
    drain
  }, failed ? 502 : 200);
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
      last_error TEXT,
      response_json TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      sent_at TEXT
    )
  `).run();

  await env.RELAY_DB.prepare("CREATE INDEX IF NOT EXISTS idx_relay_queue_status_due ON relay_send_queue(status, not_before)").run();
  await env.RELAY_DB.prepare("CREATE INDEX IF NOT EXISTS idx_relay_queue_page_status_due ON relay_send_queue(page_id, status, not_before)").run();
  await env.RELAY_DB.prepare("CREATE INDEX IF NOT EXISTS idx_relay_queue_page_psid_status ON relay_send_queue(page_id, psid, status, created_at DESC)").run();
  await env.RELAY_DB.prepare("CREATE INDEX IF NOT EXISTS idx_relay_queue_sent_page ON relay_send_queue(page_id, sent_at)").run();
  await env.RELAY_DB.prepare("CREATE INDEX IF NOT EXISTS idx_relay_queue_updated ON relay_send_queue(updated_at DESC)").run();
  await env.RELAY_DB.prepare("CREATE INDEX IF NOT EXISTS idx_relay_queue_page_created ON relay_send_queue(page_id, created_at DESC)").run();

  return true;
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
      policy_expires_at, last_error, response_json, created_at, updated_at, sent_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'queued', 0, ?, ?, ?, '', '', ?, ?, '')
    ON CONFLICT(id) DO UPDATE SET
      page_access_token = excluded.page_access_token,
      graph_api_url = excluded.graph_api_url,
      messaging_type = excluded.messaging_type,
      message_json = excluded.message_json,
      policy_expires_at = excluded.policy_expires_at,
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

  await markRow(env, row.id, "sent", {
    response: direct.body,
    sentAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
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
  const now = new Date().toISOString();
  const pageFilter = pageIds.length ? `AND page_id IN (${pageIds.map(() => "?").join(", ")})` : "";
  const result = await env.RELAY_DB.prepare(`
    UPDATE relay_send_queue
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

function authorize(request, env) {
  const expectedSecret = String(env.MESSENLEAD_SEND_RELAY_SECRET || "").trim();
  if (!expectedSecret) return json({ error: "Relay secret is not configured" }, 503);

  const providedSecret = request.headers.get("x-messenlead-relay-secret") || "";
  if (!timingSafeEqual(providedSecret, expectedSecret)) {
    return json({ error: "Unauthorized" }, 401);
  }
  return null;
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
