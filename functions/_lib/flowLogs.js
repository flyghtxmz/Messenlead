export async function ensureFlowLogSchema(env) {
  if (!env.DB) return false;

  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS flow_logs (
      id TEXT PRIMARY KEY,
      page_id TEXT NOT NULL,
      psid TEXT,
      flow_id TEXT,
      flow_name TEXT,
      level TEXT NOT NULL DEFAULT 'info',
      event TEXT NOT NULL,
      message TEXT NOT NULL,
      data_json TEXT,
      created_at TEXT NOT NULL
    )
  `).run();

  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_flow_logs_page_created ON flow_logs(page_id, created_at DESC)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_flow_logs_flow_id ON flow_logs(flow_id)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_flow_logs_page_psid_created ON flow_logs(page_id, psid, created_at DESC)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_flow_logs_page_flow_created ON flow_logs(page_id, flow_id, created_at DESC)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_flow_logs_page_event_created ON flow_logs(page_id, event, created_at DESC)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_flow_logs_page_level_created ON flow_logs(page_id, level, created_at DESC)").run();

  return true;
}

export async function addFlowLog(env, log = {}) {
  if (!shouldPersistFlowLog(env, log)) return false;

  const hasDb = await ensureFlowLogSchema(env);
  if (!hasDb) return false;

  const createdAt = log.createdAt || new Date().toISOString();
  const id = log.id || `log_${Date.now()}_${Math.random().toString(36).slice(2)}`;

  await env.DB.prepare(`
    INSERT INTO flow_logs (
      id, page_id, psid, flow_id, flow_name, level, event, message, data_json, created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
    .bind(
      id,
      normalizePageId(log.pageId),
      log.psid || "",
      log.flowId || "",
      log.flowName || "",
      log.level || "info",
      log.event || "event",
      log.message || "",
      JSON.stringify(log.data || {}),
      createdAt
    )
    .run();

  return true;
}

export async function safeAddFlowLog(env, log = {}) {
  try {
    return await addFlowLog(env, log);
  } catch (error) {
    console.warn("Messenlead flow log failed", error?.message || error);
    return false;
  }
}

export async function listFlowLogs(env, pageId, options = {}) {
  const hasDb = await ensureFlowLogSchema(env);
  if (!hasDb) return [];

  const limit = Math.max(1, Math.min(300, Number(options.limit) || 100));
  if (isAllPages(pageId)) {
    const rows = await env.DB.prepare(`
      SELECT id, page_id, psid, flow_id, flow_name, level, event, message, data_json, created_at
      FROM flow_logs
      ORDER BY created_at DESC
      LIMIT ?
    `)
      .bind(limit)
      .all();

    return (rows.results || []).map(normalizeFlowLogRow);
  }

  const rows = await env.DB.prepare(`
    SELECT id, page_id, psid, flow_id, flow_name, level, event, message, data_json, created_at
    FROM flow_logs
    WHERE page_id = ?
    ORDER BY created_at DESC
    LIMIT ?
  `)
    .bind(normalizePageId(pageId), limit)
    .all();

  return (rows.results || []).map(normalizeFlowLogRow);
}

export async function clearFlowLogs(env, pageId) {
  const hasDb = await ensureFlowLogSchema(env);
  if (!hasDb) return false;

  if (isAllPages(pageId)) {
    await env.DB.prepare("DELETE FROM flow_logs").run();
    return true;
  }

  await env.DB.prepare("DELETE FROM flow_logs WHERE page_id = ?")
    .bind(normalizePageId(pageId))
    .run();

  return true;
}

function normalizeFlowLogRow(row) {
  return {
    id: row.id,
    pageId: row.page_id,
    psid: row.psid || "",
    flowId: row.flow_id || "",
    flowName: row.flow_name || "",
    level: row.level || "info",
    event: row.event || "",
    message: row.message || "",
    data: parseJson(row.data_json),
    createdAt: row.created_at
  };
}

function normalizePageId(pageId) {
  return String(pageId || "__global__").trim() || "__global__";
}

function isAllPages(pageId) {
  return ["__all__", "*", "all"].includes(String(pageId || "").trim());
}

function parseJson(value) {
  try {
    return value ? JSON.parse(value) : {};
  } catch {
    return {};
  }
}

const COMPACT_INFO_EVENTS = new Set([
  "event_received",
  "ad_referral_diagnostic",
  "active_flows_loaded",
  "flow_started",
  "start_node_selected",
  "message_prepared",
  "replies_queued",
  "queue_drain_finished",
  "action_node_executed",
  "actions_applied",
  "flow_waiting",
  "flow_waiting_for_response",
  "flow_waiting_for_link_click",
  "delay_scheduled",
  "delay_resuming",
  "user_response_wait_scheduled",
  "user_response_wait_resuming",
  "link_click_wait_scheduled",
  "link_click_wait_resuming",
  "link_click_wait_timeout_resuming",
  "condition_result",
  "send_success",
  "manual_log_test",
  "manual_webhook_subscription",
  "manual_app_webhook_subscription"
]);

const COMPACT_WARN_EVENTS = new Set([
  "condition_result",
  "no_active_flow",
  "no_start_node",
  "no_replies",
  "guard_limit",
  "flow_runtime_reset",
  "delay_skipped_inactive_flow",
  "delay_skipped_missing_node",
  "user_response_wait_inactive_flow",
  "user_response_wait_missing_node",
  "link_click_wait_without_source",
  "link_click_wait_inactive_flow",
  "link_click_wait_missing_node",
  "link_click_wait_timeout_inactive_flow",
  "link_click_wait_timeout_missing_node",
  "send_retry_scheduled",
  "send_policy_skipped",
  "send_rate_limited",
  "relay_enqueue_partial_failed",
  "page_token_invalid",
  "app_webhook_subscription_check_failed",
  "webhook_subscription_check_failed",
  "profile_lookup_failed",
  "standby_received",
  "missing_psid",
  "no_messaging_events",
  "ignored_object"
]);

function shouldPersistFlowLog(env, log = {}) {
  if (log.force) return true;

  const mode = String(env.MESSENLEAD_FLOW_LOG_MODE || env.MESSENLEAD_LOG_MODE || "compact").trim().toLowerCase();
  if (["verbose", "debug", "all"].includes(mode)) return true;

  const level = String(log.level || "info").trim().toLowerCase();
  const event = String(log.event || "").trim();
  if (!event) return level === "error";
  if (event.startsWith("manual_")) return true;
  if (level === "error") return true;
  if (level === "warn") return COMPACT_WARN_EVENTS.has(event);
  return COMPACT_INFO_EVENTS.has(event);
}
