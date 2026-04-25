const DEFAULT_PAGE_ID = "__global__";

export async function ensureFlowSchema(env) {
  if (!env.DB) return false;

  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS flows (
      page_id TEXT NOT NULL,
      id TEXT NOT NULL,
      name TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft',
      trigger_text TEXT,
      goal TEXT,
      nodes_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      PRIMARY KEY (page_id, id)
    )
  `).run();

  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_flows_page_id ON flows(page_id)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_flows_page_status ON flows(page_id, status)").run();

  return true;
}

export function normalizePageId(pageId) {
  return String(pageId || DEFAULT_PAGE_ID).trim() || DEFAULT_PAGE_ID;
}

export async function listFlows(env, pageId, options = {}) {
  const hasDb = await ensureFlowSchema(env);
  if (!hasDb) return [];

  const normalizedPageId = normalizePageId(pageId);
  const statusFilter = options.status ? "AND status = ?" : "";
  const params = options.status ? [normalizedPageId, options.status] : [normalizedPageId];

  const result = await env.DB.prepare(`
    SELECT id, page_id, name, status, trigger_text, goal, nodes_json, created_at, updated_at
    FROM flows
    WHERE page_id = ? ${statusFilter}
    ORDER BY updated_at DESC, created_at DESC
  `)
    .bind(...params)
    .all();

  return (result.results || []).map(rowToFlow);
}

export async function upsertFlow(env, pageId, flow) {
  const hasDb = await ensureFlowSchema(env);
  if (!hasDb) throw new Error("D1 binding DB is not configured");

  const normalizedPageId = normalizePageId(pageId);
  const now = new Date().toISOString();
  const normalizedFlow = normalizeFlow(flow, now);

  await env.DB.prepare(`
    INSERT INTO flows (id, page_id, name, status, trigger_text, goal, nodes_json, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(page_id, id) DO UPDATE SET
      name = excluded.name,
      status = excluded.status,
      trigger_text = excluded.trigger_text,
      goal = excluded.goal,
      nodes_json = excluded.nodes_json,
      updated_at = excluded.updated_at
  `)
    .bind(
      normalizedFlow.id,
      normalizedPageId,
      normalizedFlow.name,
      normalizedFlow.status,
      normalizedFlow.trigger,
      normalizedFlow.goal,
      JSON.stringify(normalizedFlow.nodes),
      normalizedFlow.createdAt || now,
      normalizedFlow.updatedAt || now
    )
    .run();

  return { ...normalizedFlow, pageId: normalizedPageId };
}

export async function deleteFlow(env, pageId, flowId) {
  const hasDb = await ensureFlowSchema(env);
  if (!hasDb) throw new Error("D1 binding DB is not configured");

  await env.DB.prepare("DELETE FROM flows WHERE id = ? AND page_id = ?")
    .bind(flowId, normalizePageId(pageId))
    .run();
}

function rowToFlow(row) {
  let nodes = [];
  try {
    nodes = JSON.parse(row.nodes_json || "[]");
  } catch {
    nodes = [];
  }

  return {
    id: row.id,
    pageId: row.page_id,
    name: row.name,
    status: row.status,
    trigger: row.trigger_text || "",
    goal: row.goal || "",
    nodes,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function normalizeFlow(flow, now) {
  return {
    id: String(flow.id || crypto.randomUUID()),
    name: String(flow.name || "Fluxo sem nome"),
    status: String(flow.status || "draft"),
    trigger: String(flow.trigger || ""),
    goal: String(flow.goal || ""),
    nodes: Array.isArray(flow.nodes) ? flow.nodes : [],
    createdAt: flow.createdAt || now,
    updatedAt: flow.updatedAt || now
  };
}
