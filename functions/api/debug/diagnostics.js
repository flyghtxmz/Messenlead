import { getMetaConfig, getSession, json } from "../../_lib/meta.js";

const REQUIRED_TABLES = [
  "connected_pages",
  "flows",
  "contacts",
  "flow_continuations",
  "flow_response_waits",
  "flow_link_click_waits",
  "messenger_send_queue",
  "messenger_outbound_messages",
  "flow_logs"
];

const OPTIONAL_TABLES = [
  "contact_custom_field_values",
  "custom_fields",
  "json_templates",
  "media_assets",
  "messenger_event_dedup",
  "messenger_attribution_sources",
  "messenger_attribution_events",
  "pixel_events",
  "pixel_presence",
  "flow_metric_events",
  "flow_metrics",
  "flow_metric_contacts"
];

export async function onRequestGet({ request, env }) {
  const auth = await authorizeDiagnosticsRequest(request, env);
  if (!auth.ok) return auth.response;

  const startedAt = Date.now();
  const url = new URL(request.url);
  const pageId = normalizePageId(url.searchParams.get("pageId") || "");
  const includeRelay = url.searchParams.get("relay") !== "0";
  const checks = [];
  const config = readConfigDiagnostics(request, env);

  addCheck(checks, "d1_binding", Boolean(env.DB), "error", "D1 binding DB nao esta configurado.");
  addCheck(checks, "operator_token", Boolean(env.MESSENLEAD_OPERATOR_TOKEN), "warning", "MESSENLEAD_OPERATOR_TOKEN nao esta configurado.");
  addCheck(checks, "meta_config", config.meta.hasAppId && config.meta.hasAppSecret && config.meta.hasSessionSecret, "error", "Configuracao da Meta incompleta.", config.meta);
  addCheck(checks, "send_relay_config", config.relay.targets.length > 0 && config.relay.hasSendRelaySecret, "warning", "Relay de envio nao esta totalmente configurado.", config.relay);
  addCheck(checks, "delay_workflow_config", Boolean(config.delay.url && config.delay.hasSecret), "warning", "Workflow/relay de delay nao esta totalmente configurado.", config.delay);

  const d1 = await readD1Diagnostics(env, pageId, checks);
  const relay = includeRelay ? await readRelayDiagnostics(config.relay.targets, checks) : { skipped: true };

  const nextActions = buildNextActions(checks, d1, relay);
  const summary = summarizeChecks(checks);

  return json({
    ok: summary.errors === 0,
    status: summary.errors ? "error" : summary.warnings ? "warning" : "ok",
    checkedAt: new Date().toISOString(),
    durationMs: Date.now() - startedAt,
    auth: { mode: auth.mode },
    scope: { pageId: pageId || "__all__" },
    config,
    d1,
    relay,
    checks,
    summary,
    nextActions
  }, summary.errors ? 500 : 200);
}

function readConfigDiagnostics(request, env) {
  const meta = getMetaConfig(request, env);
  const relayTargets = parseRelayTargets(env);
  return {
    publicOrigin: new URL(request.url).origin,
    meta: {
      appId: meta.appId || "",
      redirectUri: meta.redirectUri || "",
      scopes: meta.scopes || "",
      graphVersion: meta.version || "",
      hasAppId: Boolean(meta.appId),
      hasAppSecret: Boolean(meta.appSecret),
      hasSessionSecret: Boolean(meta.sessionSecret)
    },
    bindings: {
      hasD1: Boolean(env.DB),
      hasMediaBucket: Boolean(env.MEDIA_BUCKET)
    },
    auth: {
      hasOperatorToken: Boolean(env.MESSENLEAD_OPERATOR_TOKEN)
    },
    relay: {
      rawConfigured: Boolean(env.MESSENLEAD_SEND_RELAY_URLS || env.MESSENLEAD_SEND_RELAY_URL),
      hasSendRelaySecret: Boolean(env.MESSENLEAD_SEND_RELAY_SECRET),
      failover: env.MESSENLEAD_SEND_RELAY_FAILOVER || "",
      localFallback: env.MESSENLEAD_RELAY_LOCAL_FALLBACK || "",
      strategy: env.MESSENLEAD_SEND_RELAY_STRATEGY || env.MESSENLEAD_RELAY_STRATEGY || "primary",
      targets: relayTargets
    },
    delay: {
      url: env.MESSENLEAD_DELAY_WORKFLOW_URL || env.MESSENLEAD_FLOW_DELAY_WORKFLOW_URL || "",
      hasSecret: Boolean(env.MESSENLEAD_DELAY_WORKFLOW_SECRET || env.MESSENLEAD_FLOW_DELAY_WORKFLOW_SECRET || env.MESSENLEAD_SEND_RELAY_SECRET)
    }
  };
}

async function readD1Diagnostics(env, pageId, checks) {
  if (!env.DB) return { ok: false, error: "D1 binding DB missing" };

  const startedAt = Date.now();
  const diagnostics = {
    ok: false,
    latencyMs: 0,
    tables: {},
    missingRequiredTables: [],
    queue: {},
    continuations: {},
    waits: {},
    flows: {},
    contacts: {},
    pages: {},
    logs: {}
  };

  try {
    await env.DB.prepare("SELECT 1 AS ok").first();
    diagnostics.ok = true;
    diagnostics.latencyMs = Date.now() - startedAt;
    addCheck(checks, "d1_ping", true, "error", "D1 respondeu ao ping.", { latencyMs: diagnostics.latencyMs });
  } catch (error) {
    diagnostics.error = errorMessage(error);
    addCheck(checks, "d1_ping", false, "error", "D1 nao respondeu ao ping.", { error: diagnostics.error });
    return diagnostics;
  }

  const tableNames = await listD1Tables(env);
  const tableSet = new Set(tableNames);
  const knownTables = [...REQUIRED_TABLES, ...OPTIONAL_TABLES];
  for (const table of knownTables) {
    diagnostics.tables[table] = {
      exists: tableSet.has(table),
      count: tableSet.has(table) ? await safeCount(env, table) : 0
    };
  }

  diagnostics.missingRequiredTables = REQUIRED_TABLES.filter((table) => !tableSet.has(table));
  addCheck(
    checks,
    "required_tables",
    diagnostics.missingRequiredTables.length === 0,
    "warning",
    "Uma ou mais tabelas principais ainda nao existem no D1.",
    { missing: diagnostics.missingRequiredTables }
  );

  diagnostics.pages = await readPageStats(env, tableSet);
  diagnostics.flows = await readFlowStats(env, tableSet, pageId);
  diagnostics.contacts = await readContactStats(env, tableSet, pageId);
  diagnostics.queue = await readSendQueueStats(env, tableSet, pageId);
  diagnostics.continuations = await readContinuationStats(env, tableSet, pageId);
  diagnostics.waits = await readWaitStats(env, tableSet, pageId);
  diagnostics.logs = await readLogStats(env, tableSet, pageId);

  addQueueChecks(checks, diagnostics.queue);
  addContinuationChecks(checks, diagnostics.continuations, diagnostics.waits);
  addLogChecks(checks, diagnostics.logs);

  return diagnostics;
}

async function readRelayDiagnostics(targets, checks) {
  if (!targets.length) {
    addCheck(checks, "relay_health", false, "warning", "Nenhum relay configurado para consultar.");
    return { ok: false, targets: [] };
  }

  const results = [];
  for (const target of targets) {
    const healthUrl = `${target.baseUrl}/health`;
    const result = await fetchJsonWithTimeout(healthUrl, {}, 8000);
    const health = result.json && typeof result.json === "object" ? result.json : {};
    const primaryQueue = health.diagnostics?.primary_queue || {};
    const scheduled = health.diagnostics?.scheduled || {};
    const ok = Boolean(result.ok && health.ok && health.hasD1 && health.hasPrimaryQueue && primaryQueue.ok !== false && (!primaryQueue.status || Number(primaryQueue.status) === 200));

    results.push({
      url: target.baseUrl,
      host: target.host,
      hasInlineSecret: target.hasInlineSecret,
      possibleSecondaryAccount: target.host.includes("vinteedois-13"),
      ok,
      httpStatus: result.status,
      latencyMs: result.latencyMs,
      error: result.error || "",
      service: health.service || "",
      hasD1: Boolean(health.hasD1),
      hasPrimaryD1: Boolean(health.hasPrimaryD1),
      hasMessagesQueue: Boolean(health.hasMessagesQueue),
      hasFlowQueue: Boolean(health.hasFlowQueue),
      queuesEnabled: Boolean(health.queuesEnabled),
      messagesQueueEnabled: Boolean(health.messagesQueueEnabled),
      flowQueueEnabled: Boolean(health.flowQueueEnabled),
      hasPrimaryQueue: Boolean(health.hasPrimaryQueue),
      hasDelayWorkflow: Boolean(health.hasDelayWorkflow),
      primaryQueueUrlConfigured: Boolean(health.primaryQueueUrlConfigured),
      primaryQueueTokenConfigured: Boolean(health.primaryQueueTokenConfigured),
      delayWorkflowSecretConfigured: Boolean(health.delayWorkflowSecretConfigured),
      scheduledPumpMs: Number(health.scheduledPumpMs || 0),
      scheduledPollMs: Number(health.scheduledPollMs || 0),
      queueMetrics: health.queueMetrics && typeof health.queueMetrics === "object" ? health.queueMetrics : {},
      primaryQueue: {
        ok: Boolean(primaryQueue.ok),
        status: Number(primaryQueue.status || 0),
        error: primaryQueue.error || "",
        updatedAt: primaryQueue.updatedAt || ""
      },
      scheduled: {
        state: scheduled.state || "",
        passes: Number(scheduled.passes || 0),
        primaryOk: Number(scheduled.primary?.ok || 0),
        primaryFailed: Number(scheduled.primary?.failed || 0),
        relayProcessed: Number(scheduled.relay?.processed || 0),
        relaySent: Number(scheduled.relay?.sent || 0),
        relayFailed: Number(scheduled.relay?.failed || 0),
        updatedAt: scheduled.updatedAt || ""
      }
    });
  }

  const anyOk = results.some((item) => item.ok);
  addCheck(checks, "relay_health", anyOk, "error", "Nenhum relay respondeu saudavel ao /health.", { targets: results.map(relayCheckSummary) });

  for (const result of results) {
    addCheck(
      checks,
      `relay_primary_queue:${result.host}`,
      result.primaryQueue.ok && result.primaryQueue.status === 200,
      "error",
      "Relay nao esta conseguindo chamar a fila principal do Pages.",
      result.primaryQueue
    );
    if (result.queuesEnabled) {
      addCheck(
        checks,
        `relay_queues:${result.host}`,
        result.hasMessagesQueue && result.hasFlowQueue,
        "warning",
        "Relay esta com Queues habilitadas, mas uma ou mais bindings nao estao disponiveis.",
        {
          hasMessagesQueue: result.hasMessagesQueue,
          hasFlowQueue: result.hasFlowQueue,
          messagesQueueEnabled: result.messagesQueueEnabled,
          flowQueueEnabled: result.flowQueueEnabled,
          queueMetrics: result.queueMetrics
        }
      );
    }
    if (result.possibleSecondaryAccount) {
      addCheck(
        checks,
        `relay_account:${result.host}`,
        false,
        "warning",
        "Relay ainda parece apontar para o subdominio vinteedois-13. Se a meta e usar uma unica conta, publique um relay novo na conta principal e troque a URL.",
        { host: result.host }
      );
    }
  }

  return {
    ok: anyOk,
    targets: results
  };
}

async function readPageStats(env, tableSet) {
  if (!tableSet.has("connected_pages")) return { available: false };
  const rows = await env.DB.prepare(`
    SELECT page_id, name, updated_at,
      CASE WHEN access_token <> '' THEN 1 ELSE 0 END AS has_token
    FROM connected_pages
    ORDER BY datetime(updated_at) DESC
    LIMIT 20
  `).all();
  return {
    available: true,
    count: await safeCount(env, "connected_pages"),
    recent: (rows.results || []).map((row) => ({
      pageId: row.page_id,
      name: row.name || "",
      hasToken: Boolean(row.has_token),
      updatedAt: row.updated_at || ""
    }))
  };
}

async function readFlowStats(env, tableSet, pageId) {
  if (!tableSet.has("flows")) return { available: false };
  return {
    available: true,
    byStatus: await groupCount(env, "flows", "status", pageId),
    activePublished: await scalarCount(env, "flows", [
      "status = 'active'",
      "(published_nodes_json IS NOT NULL AND published_nodes_json <> '')"
    ], pageId),
    draftChanges: await scalarCount(env, "flows", ["has_draft_changes = 1"], pageId)
  };
}

async function readContactStats(env, tableSet, pageId) {
  if (!tableSet.has("contacts")) return { available: false };
  return {
    available: true,
    total: await scalarCount(env, "contacts", [], pageId),
    byStatus: await groupCount(env, "contacts", "status", pageId),
    withGenericName: await countGenericContactNames(env, pageId)
  };
}

async function readSendQueueStats(env, tableSet, pageId) {
  if (!tableSet.has("messenger_send_queue")) return { available: false };
  const now = new Date().toISOString();
  const oldestQueued = await firstRow(env, "messenger_send_queue", [
    "status = 'queued'",
    "datetime(not_before) <= datetime(?)"
  ], [now], pageId, "datetime(not_before) ASC, datetime(created_at) ASC");
  return {
    available: true,
    byStatus: await groupCount(env, "messenger_send_queue", "status", pageId),
    dueQueued: await scalarCount(env, "messenger_send_queue", ["status = 'queued'", "datetime(not_before) <= datetime(?)"], pageId, [now]),
    processing: await scalarCount(env, "messenger_send_queue", ["status = 'processing'"], pageId),
    failed: await scalarCount(env, "messenger_send_queue", ["status = 'failed'"], pageId),
    oldestDueQueued: summarizeQueueRow(oldestQueued)
  };
}

async function readContinuationStats(env, tableSet, pageId) {
  if (!tableSet.has("flow_continuations")) return { available: false };
  const now = new Date().toISOString();
  const staleBefore = new Date(Date.now() - 3 * 60 * 1000).toISOString();
  const oldestDue = await firstRow(env, "flow_continuations", [
    "status = 'scheduled'",
    "datetime(due_at) <= datetime(?)"
  ], [now], pageId, "datetime(due_at) ASC, datetime(created_at) ASC");
  return {
    available: true,
    byStatus: await groupCount(env, "flow_continuations", "status", pageId),
    dueScheduled: await scalarCount(env, "flow_continuations", ["status = 'scheduled'", "datetime(due_at) <= datetime(?)"], pageId, [now]),
    staleProcessing: await scalarCount(env, "flow_continuations", ["status = 'processing'", "datetime(updated_at) <= datetime(?)"], pageId, [staleBefore]),
    failed: await scalarCount(env, "flow_continuations", ["status = 'failed'"], pageId),
    oldestDueScheduled: summarizeContinuationRow(oldestDue),
    latestFailed: summarizeContinuationRow(await firstRow(env, "flow_continuations", ["status = 'failed'"], [], pageId, "datetime(updated_at) DESC, datetime(created_at) DESC"))
  };
}

async function readWaitStats(env, tableSet, pageId) {
  const now = new Date().toISOString();
  const response = tableSet.has("flow_response_waits") ? {
    byStatus: await groupCount(env, "flow_response_waits", "status", pageId),
    expiredWaiting: await scalarCount(env, "flow_response_waits", [
      "status = 'waiting'",
      "expires_at <> ''",
      "datetime(expires_at) <= datetime(?)"
    ], pageId, [now])
  } : { available: false };

  const linkClick = tableSet.has("flow_link_click_waits") ? {
    byStatus: await groupCount(env, "flow_link_click_waits", "status", pageId),
    expiredWaiting: await scalarCount(env, "flow_link_click_waits", [
      "status = 'waiting'",
      "expires_at <> ''",
      "datetime(expires_at) <= datetime(?)"
    ], pageId, [now])
  } : { available: false };

  return { response, linkClick };
}

async function readLogStats(env, tableSet, pageId) {
  if (!tableSet.has("flow_logs")) return { available: false };
  const since1h = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  return {
    available: true,
    errorsLastHour: await scalarCount(env, "flow_logs", ["level IN ('error', 'warn')", "datetime(created_at) >= datetime(?)"], pageId, [since1h]),
    errorsLast24h: await scalarCount(env, "flow_logs", ["level IN ('error', 'warn')", "datetime(created_at) >= datetime(?)"], pageId, [since24h]),
    recentErrors: await recentFlowErrors(env, pageId, since24h)
  };
}

function addQueueChecks(checks, queue) {
  if (!queue.available) return;
  const dueQueued = Number(queue.dueQueued || 0);
  const failed = Number(queue.failed || 0);
  const oldestAgeMs = ageMs(queue.oldestDueQueued?.notBefore);
  addCheck(checks, "send_queue_due", dueQueued === 0 || oldestAgeMs < 60000, "warning", "Fila de envio tem mensagens vencidas ha mais de 60s.", {
    dueQueued,
    oldestAgeMs,
    oldest: queue.oldestDueQueued
  });
  addCheck(checks, "send_queue_failed", failed === 0, "warning", "Fila de envio tem mensagens com falha.", { failed });
}

function addContinuationChecks(checks, continuations, waits) {
  if (continuations.available) {
    const dueScheduled = Number(continuations.dueScheduled || 0);
    const staleProcessing = Number(continuations.staleProcessing || 0);
    const failed = Number(continuations.failed || 0);
    const oldestAgeMs = ageMs(continuations.oldestDueScheduled?.dueAt);
    addCheck(checks, "flow_continuations_due", dueScheduled === 0 || oldestAgeMs < 120000, "warning", "Ha continuations de espera vencidas ha mais de 2 minutos.", {
      dueScheduled,
      oldestAgeMs,
      oldest: continuations.oldestDueScheduled
    });
    addCheck(checks, "flow_continuations_stale", staleProcessing === 0, "warning", "Ha continuations presas em processing.", { staleProcessing });
    addCheck(checks, "flow_continuations_failed", failed === 0, "warning", "Ha continuations marcadas como failed no historico.", {
      failed,
      latestFailed: continuations.latestFailed
    });
  }

  const responseExpired = Number(waits.response?.expiredWaiting || 0);
  const linkExpired = Number(waits.linkClick?.expiredWaiting || 0);
  addCheck(checks, "response_waits_expired", responseExpired === 0, "warning", "Ha waits de resposta expirados ainda em waiting.", { expiredWaiting: responseExpired });
  addCheck(checks, "link_click_waits_expired", linkExpired === 0, "warning", "Ha waits de clique expirados ainda em waiting.", { expiredWaiting: linkExpired });
}

function addLogChecks(checks, logs) {
  if (!logs.available) return;
  const errorsLastHour = Number(logs.errorsLastHour || 0);
  const errorsLast24h = Number(logs.errorsLast24h || 0);
  addCheck(checks, "flow_logs_errors_1h", errorsLastHour === 0, "warning", "Logs recentes indicam erros ou avisos no runtime.", {
    errorsLastHour,
    recentErrors: logs.recentErrors
  });
  addCheck(checks, "flow_logs_errors_24h", errorsLast24h === 0, "warning", "Ha erros ou avisos registrados nas ultimas 24h.", {
    errorsLast24h,
    recentErrors: logs.recentErrors
  });
}

async function listD1Tables(env) {
  const result = await env.DB.prepare(`
    SELECT name
    FROM sqlite_master
    WHERE type = 'table'
    ORDER BY name
  `).all();
  return (result.results || []).map((row) => row.name).filter(Boolean);
}

async function safeCount(env, table) {
  try {
    const row = await env.DB.prepare(`SELECT COUNT(*) AS count FROM ${table}`).first();
    return Number(row?.count || 0);
  } catch {
    return 0;
  }
}

async function groupCount(env, table, column, pageId = "") {
  const where = [];
  const params = [];
  if (pageId) {
    where.push("page_id = ?");
    params.push(pageId);
  }
  const statement = env.DB.prepare(`
    SELECT ${column} AS key, COUNT(*) AS count
    FROM ${table}
    ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
    GROUP BY ${column}
  `);
  const result = params.length ? await statement.bind(...params).all() : await statement.all();
  return Object.fromEntries((result.results || []).map((row) => [String(row.key || "empty"), Number(row.count || 0)]));
}

async function scalarCount(env, table, conditions = [], pageId = "", extraParams = []) {
  const where = [...conditions];
  const params = [...extraParams];
  if (pageId) {
    where.push("page_id = ?");
    params.push(pageId);
  }
  const statement = env.DB.prepare(`
    SELECT COUNT(*) AS count
    FROM ${table}
    ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
  `);
  const row = params.length ? await statement.bind(...params).first() : await statement.first();
  return Number(row?.count || 0);
}

async function firstRow(env, table, conditions = [], extraParams = [], pageId = "", orderBy = "datetime(updated_at) DESC") {
  const where = [...conditions];
  const params = [...extraParams];
  if (pageId) {
    where.push("page_id = ?");
    params.push(pageId);
  }
  const statement = env.DB.prepare(`
    SELECT *
    FROM ${table}
    ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
    ORDER BY ${orderBy}
    LIMIT 1
  `);
  return params.length ? statement.bind(...params).first() : statement.first();
}

async function countGenericContactNames(env, pageId = "") {
  const conditions = ["(name IS NULL OR name = '' OR name LIKE 'Contato %')"];
  return scalarCount(env, "contacts", conditions, pageId);
}

async function recentFlowErrors(env, pageId, since) {
  const where = ["level IN ('error', 'warn')", "datetime(created_at) >= datetime(?)"];
  const params = [since];
  if (pageId) {
    where.push("page_id = ?");
    params.push(pageId);
  }
  const result = await env.DB.prepare(`
    SELECT page_id, psid, flow_id, level, event, message, created_at
    FROM flow_logs
    WHERE ${where.join(" AND ")}
    ORDER BY datetime(created_at) DESC
    LIMIT 10
  `).bind(...params).all();
  return (result.results || []).map((row) => ({
    pageId: row.page_id || "",
    psid: row.psid || "",
    flowId: row.flow_id || "",
    level: row.level || "",
    event: row.event || "",
    message: row.message || "",
    createdAt: row.created_at || ""
  }));
}

function summarizeQueueRow(row) {
  if (!row) return null;
  return {
    id: row.id || "",
    pageId: row.page_id || "",
    psid: row.psid || "",
    flowId: row.flow_id || "",
    status: row.status || "",
    attempts: Number(row.attempts || 0),
    notBefore: row.not_before || "",
    createdAt: row.created_at || "",
    updatedAt: row.updated_at || "",
    lastError: row.last_error || ""
  };
}

function summarizeContinuationRow(row) {
  if (!row) return null;
  return {
    id: row.id || "",
    pageId: row.page_id || "",
    psid: row.psid || "",
    flowId: row.flow_id || "",
    delayNodeId: row.delay_node_id || "",
    resumeNodeId: row.resume_node_id || "",
    status: row.status || "",
    attempts: Number(row.attempts || 0),
    dueAt: row.due_at || "",
    createdAt: row.created_at || "",
    updatedAt: row.updated_at || "",
    lastError: row.last_error || ""
  };
}

function parseRelayTargets(env) {
  const raw = String(env.MESSENLEAD_SEND_RELAY_URLS || env.MESSENLEAD_SEND_RELAY_URL || "").trim();
  if (!raw) return [];
  return raw
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const [url, inlineSecret] = item.split("|");
      const baseUrl = normalizeRelayBaseUrl(url);
      return baseUrl ? {
        baseUrl,
        host: safeHost(baseUrl),
        hasInlineSecret: Boolean(String(inlineSecret || "").trim())
      } : null;
    })
    .filter(Boolean);
}

function normalizeRelayBaseUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  try {
    const url = new URL(raw);
    url.pathname = url.pathname.replace(/\/send\/?$/g, "").replace(/\/+$/g, "");
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/$/g, "");
  } catch {
    return raw.replace(/\/send\/?$/g, "").replace(/\/+$/g, "");
  }
}

function safeHost(value) {
  try {
    return new URL(value).host;
  } catch {
    return "";
  }
}

async function fetchJsonWithTimeout(url, init = {}, timeoutMs = 5000) {
  const startedAt = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...init, signal: controller.signal });
    const text = await response.text();
    return {
      ok: response.ok,
      status: response.status,
      latencyMs: Date.now() - startedAt,
      json: parseJson(text),
      text: text.slice(0, 1000)
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      latencyMs: Date.now() - startedAt,
      error: errorMessage(error)
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

function relayCheckSummary(result) {
  return {
    host: result.host,
    ok: result.ok,
    httpStatus: result.httpStatus,
    primaryQueue: result.primaryQueue,
    hasD1: result.hasD1,
    hasMessagesQueue: result.hasMessagesQueue,
    hasFlowQueue: result.hasFlowQueue,
    queuesEnabled: result.queuesEnabled,
    hasPrimaryQueue: result.hasPrimaryQueue,
    hasDelayWorkflow: result.hasDelayWorkflow
  };
}

function addCheck(checks, name, ok, severity, message, data = {}) {
  checks.push({
    name,
    ok: Boolean(ok),
    severity: ok ? "ok" : severity,
    message: ok ? "OK" : message,
    data
  });
}

function summarizeChecks(checks) {
  return {
    total: checks.length,
    errors: checks.filter((check) => !check.ok && check.severity === "error").length,
    warnings: checks.filter((check) => !check.ok && check.severity === "warning").length,
    ok: checks.filter((check) => check.ok).length
  };
}

function buildNextActions(checks, d1, relay) {
  const actions = [];
  if (checks.some((check) => check.name === "d1_binding" && !check.ok)) {
    actions.push("Configure o binding DB do D1 no Pages principal.");
  }
  if (checks.some((check) => check.name === "relay_health" && !check.ok)) {
    actions.push("Abra o /health do relay e confira se o Worker, D1 do relay e variaveis estao publicados.");
  }
  if (relay?.targets?.some((target) => target.primaryQueue.status && target.primaryQueue.status !== 200)) {
    actions.push("Confira MESSENLEAD_PRIMARY_QUEUE_URL e MESSENLEAD_PRIMARY_QUEUE_TOKEN no relay.");
  }
  if (relay?.targets?.some((target) => target.possibleSecondaryAccount)) {
    actions.push("O relay ainda esta no subdominio vinteedois-13; para concentrar tudo em uma conta, publique o relay na conta principal e troque MESSENLEAD_SEND_RELAY_URLS e MESSENLEAD_DELAY_WORKFLOW_URL.");
  }
  if (Number(d1?.queue?.dueQueued || 0) > 0) {
    actions.push("Ha mensagens vencidas na fila local; verifique o relay e o endpoint /api/messenger/queue.");
  }
  if (Number(d1?.continuations?.dueScheduled || 0) > 0) {
    actions.push("Ha waits vencidos; teste um node Espera curto e acompanhe o relay /health.");
  }
  if (Number(d1?.continuations?.failed || 0) > 0) {
    actions.push("Ha continuations failed no historico; use o pageId do diagnostico ou consulte flow_logs para identificar qual wait/fluxo falhou.");
  }
  if (Number(d1?.logs?.errorsLastHour || 0) > 0) {
    actions.push("Abra os logs recentes no dashboard ou em /api/flow-logs para ver o erro operacional.");
  } else if (Number(d1?.logs?.errorsLast24h || 0) > 0) {
    actions.push("Existem avisos nas ultimas 24h, mas nada na ultima hora; trate como historico, nao como falha ativa.");
  }
  if (!actions.length) actions.push("Nenhuma falha critica encontrada neste diagnostico.");
  return actions;
}

async function authorizeDiagnosticsRequest(request, env) {
  const authorization = request.headers.get("authorization") || "";
  if (env.MESSENLEAD_OPERATOR_TOKEN && authorization === `Bearer ${env.MESSENLEAD_OPERATOR_TOKEN}`) {
    return { ok: true, mode: "operator_token" };
  }

  const session = await getSession(request, env);
  if (session?.accessToken) return { ok: true, mode: "session" };

  return {
    ok: false,
    response: json({ error: "Login required to inspect diagnostics" }, 401)
  };
}

function normalizePageId(value) {
  const pageId = String(value || "").trim();
  if (!pageId || ["*", "all", "__all__"].includes(pageId)) return "";
  return pageId;
}

function parseJson(value) {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function ageMs(iso) {
  const time = Date.parse(iso || "");
  if (!Number.isFinite(time)) return 0;
  return Math.max(0, Date.now() - time);
}

function errorMessage(error) {
  return String(error?.message || error || "unknown_error").slice(0, 1000);
}
