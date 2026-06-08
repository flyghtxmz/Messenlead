const DEFAULT_PAGE_ID = "__global__";
let flowMetricSchemaReady = false;

export async function ensureFlowMetricSchema(env) {
  if (!env.DB) return false;
  if (flowMetricSchemaReady) return true;

  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS flow_metric_events (
      event_key TEXT PRIMARY KEY,
      page_id TEXT NOT NULL,
      flow_id TEXT NOT NULL,
      node_id TEXT NOT NULL DEFAULT '',
      option_id TEXT NOT NULL DEFAULT '',
      metric TEXT NOT NULL,
      psid TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL
    )
  `).run();

  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS flow_metrics (
      page_id TEXT NOT NULL,
      flow_id TEXT NOT NULL,
      node_id TEXT NOT NULL DEFAULT '',
      option_id TEXT NOT NULL DEFAULT '',
      metric TEXT NOT NULL,
      total_count INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL,
      PRIMARY KEY (page_id, flow_id, node_id, option_id, metric)
    )
  `).run();

  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS flow_metric_contacts (
      page_id TEXT NOT NULL,
      flow_id TEXT NOT NULL,
      node_id TEXT NOT NULL DEFAULT '',
      option_id TEXT NOT NULL DEFAULT '',
      metric TEXT NOT NULL,
      psid TEXT NOT NULL,
      first_seen_at TEXT NOT NULL,
      PRIMARY KEY (page_id, flow_id, node_id, option_id, metric, psid)
    )
  `).run();

  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_flow_metric_events_page_flow ON flow_metric_events(page_id, flow_id, created_at DESC)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_flow_metrics_page_flow ON flow_metrics(page_id, flow_id)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_flow_metric_contacts_page_flow ON flow_metric_contacts(page_id, flow_id, node_id, option_id, metric)").run();

  flowMetricSchemaReady = true;
  return true;
}

export async function recordFlowMetric(env, metric = {}) {
  const hasDb = await ensureFlowMetricSchema(env);
  if (!hasDb) return { recorded: false, reason: "missing_db" };

  const pageId = normalizeId(metric.pageId, DEFAULT_PAGE_ID);
  const flowId = normalizeId(metric.flowId);
  const nodeId = normalizeId(metric.nodeId);
  const optionId = normalizeId(metric.optionId);
  const metricName = normalizeMetricName(metric.metric);
  const psid = normalizeId(metric.psid);
  const createdAt = metric.createdAt || new Date().toISOString();
  const eventKey = normalizeEventKey(metric.eventKey || `${metricName}:${pageId}:${flowId}:${nodeId}:${optionId}:${psid}:${createdAt}`);
  if (!flowId || !metricName || !eventKey) return { recorded: false, reason: "missing_context" };

  const eventInsert = await env.DB.prepare(`
    INSERT OR IGNORE INTO flow_metric_events (
      event_key, page_id, flow_id, node_id, option_id, metric, psid, created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `)
    .bind(eventKey, pageId, flowId, nodeId, optionId, metricName, psid, createdAt)
    .run();

  if (!Number(eventInsert.meta?.changes || 0)) {
    return { recorded: false, reason: "duplicate" };
  }

  const statements = [
    env.DB.prepare(`
      INSERT INTO flow_metrics (
        page_id, flow_id, node_id, option_id, metric, total_count, updated_at
      )
      VALUES (?, ?, ?, ?, ?, 1, ?)
      ON CONFLICT(page_id, flow_id, node_id, option_id, metric) DO UPDATE SET
        total_count = total_count + 1,
        updated_at = excluded.updated_at
    `).bind(pageId, flowId, nodeId, optionId, metricName, createdAt)
  ];

  if (psid) {
    statements.push(
      env.DB.prepare(`
        INSERT OR IGNORE INTO flow_metric_contacts (
          page_id, flow_id, node_id, option_id, metric, psid, first_seen_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(pageId, flowId, nodeId, optionId, metricName, psid, createdAt)
    );
  }

  await env.DB.batch(statements);
  return { recorded: true };
}

export async function safeRecordFlowMetric(env, metric = {}) {
  try {
    return await recordFlowMetric(env, metric);
  } catch (error) {
    console.warn("Messenlead flow metric failed", error?.message || error);
    return { recorded: false, reason: "metric_store_failed" };
  }
}

export async function listFlowMetrics(env, pageId, flowId) {
  const hasDb = await ensureFlowMetricSchema(env);
  if (!hasDb) return emptyFlowMetrics(pageId, flowId);

  const normalizedPageId = normalizeId(pageId, DEFAULT_PAGE_ID);
  const normalizedFlowId = normalizeId(flowId);
  if (!normalizedFlowId) return emptyFlowMetrics(normalizedPageId, normalizedFlowId);

  const result = await env.DB.prepare(`
    SELECT
      metrics.node_id,
      metrics.option_id,
      metrics.metric,
      metrics.total_count,
      metrics.updated_at,
      COUNT(contacts.psid) AS unique_count
    FROM flow_metrics metrics
    LEFT JOIN flow_metric_contacts contacts
      ON contacts.page_id = metrics.page_id
      AND contacts.flow_id = metrics.flow_id
      AND contacts.node_id = metrics.node_id
      AND contacts.option_id = metrics.option_id
      AND contacts.metric = metrics.metric
    WHERE metrics.page_id = ?
      AND metrics.flow_id = ?
    GROUP BY metrics.page_id, metrics.flow_id, metrics.node_id, metrics.option_id, metrics.metric, metrics.total_count, metrics.updated_at
    ORDER BY metrics.updated_at DESC
  `)
    .bind(normalizedPageId, normalizedFlowId)
    .all();

  return metricsRowsToPayload(normalizedPageId, normalizedFlowId, result.results || []);
}

export async function recordTrackedFlowLinkClick(env, event = {}) {
  if (!["page_view", "messenger_button_click"].includes(event.eventType)) return { recorded: false, reason: "not_landing_page" };

  const data = event.data && typeof event.data === "object" ? event.data : {};
  const flowId = normalizeId(data.contactFlowId);
  const nodeId = normalizeId(data.contactNodeId);
  const optionId = normalizeId(data.contactButtonId);
  const linkId = normalizeId(data.contactLinkId);
  if (!flowId || !nodeId || !linkId) return { recorded: false, reason: "missing_tracking" };

  const common = {
    pageId: event.pageId,
    flowId,
    nodeId,
    psid: event.contactPsid || ""
  };
  const eventKey = `pixel:${linkId}:button_clicked:${flowId}:${nodeId}:${optionId}`;
  const records = [
    safeRecordFlowMetric(env, {
      ...common,
      metric: "node_clicked",
      eventKey: `${eventKey}:node`
    })
  ];
  if (optionId) {
    records.push(
      safeRecordFlowMetric(env, {
        ...common,
        optionId,
        metric: "button_clicked",
        eventKey: `${eventKey}:button`
      })
    );
  }
  const results = await Promise.all(records);
  return { recorded: results.some((result) => result.recorded) };
}

function metricsRowsToPayload(pageId, flowId, rows) {
  const payload = emptyFlowMetrics(pageId, flowId);

  rows.forEach((row) => {
    const metric = {
      total: Number(row.total_count || 0),
      unique: Number(row.unique_count || 0),
      updatedAt: row.updated_at || ""
    };
    const nodeId = row.node_id || "";
    const optionId = row.option_id || "";

    if (!nodeId) {
      payload.summary[row.metric] = metric;
      return;
    }

    const node = payload.nodes[nodeId] || { metrics: {}, buttons: {} };
    payload.nodes[nodeId] = node;
    if (!optionId) {
      node.metrics[row.metric] = metric;
      return;
    }

    const button = node.buttons[optionId] || {};
    node.buttons[optionId] = button;
    button[row.metric] = metric;
  });

  return payload;
}

function emptyFlowMetrics(pageId, flowId) {
  return {
    pageId: normalizeId(pageId, DEFAULT_PAGE_ID),
    flowId: normalizeId(flowId),
    summary: {},
    nodes: {}
  };
}

function normalizeMetricName(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .slice(0, 80);
}

function normalizeEventKey(value) {
  return String(value || "").trim().slice(0, 500);
}

function normalizeId(value, fallback = "") {
  return String(value || fallback).trim().slice(0, 180) || fallback;
}
