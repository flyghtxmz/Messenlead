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
      published_nodes_json TEXT,
      published_meta_json TEXT,
      has_draft_changes INTEGER NOT NULL DEFAULT 0,
      published_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      PRIMARY KEY (page_id, id)
    )
  `).run();

  await ensureFlowDraftColumns(env);
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_flows_page_id ON flows(page_id)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_flows_page_status ON flows(page_id, status)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_flows_page_status_updated ON flows(page_id, status, updated_at DESC)").run();

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
    SELECT id, page_id, name, status, trigger_text, goal, nodes_json, published_nodes_json, published_meta_json, has_draft_changes, published_at, created_at, updated_at
    FROM flows
    WHERE page_id = ? ${statusFilter}
    ORDER BY updated_at DESC, created_at DESC
  `)
    .bind(...params)
    .all();

  return (result.results || []).map((row) => rowToFlow(row, { runtime: options.status === "active" }));
}

export async function upsertFlow(env, pageId, flow) {
  const hasDb = await ensureFlowSchema(env);
  if (!hasDb) throw new Error("D1 binding DB is not configured");

  const normalizedPageId = normalizePageId(pageId);
  if (flow?.pageId && normalizePageId(flow.pageId) !== normalizedPageId) {
    throw new Error("Flow belongs to another page");
  }

  const now = new Date().toISOString();
  const normalizedFlow = normalizeFlow(flow, now);

  await env.DB.prepare(`
    INSERT INTO flows (id, page_id, name, status, trigger_text, goal, nodes_json, published_nodes_json, published_meta_json, has_draft_changes, published_at, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(page_id, id) DO UPDATE SET
      name = excluded.name,
      status = excluded.status,
      trigger_text = excluded.trigger_text,
      goal = excluded.goal,
      nodes_json = excluded.nodes_json,
      published_nodes_json = excluded.published_nodes_json,
      published_meta_json = excluded.published_meta_json,
      has_draft_changes = excluded.has_draft_changes,
      published_at = excluded.published_at,
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
      normalizedFlow.publishedNodes ? JSON.stringify(normalizedFlow.publishedNodes) : null,
      normalizedFlow.publishedMeta ? JSON.stringify(normalizedFlow.publishedMeta) : null,
      normalizedFlow.hasDraftChanges ? 1 : 0,
      normalizedFlow.publishedAt || null,
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

async function ensureFlowDraftColumns(env) {
  const result = await env.DB.prepare("PRAGMA table_info(flows)").all();
  const columns = new Set((result.results || []).map((column) => column.name));

  await addFlowColumnIfMissing(env, columns, "published_nodes_json", "ALTER TABLE flows ADD COLUMN published_nodes_json TEXT");
  await addFlowColumnIfMissing(env, columns, "published_meta_json", "ALTER TABLE flows ADD COLUMN published_meta_json TEXT");
  await addFlowColumnIfMissing(env, columns, "has_draft_changes", "ALTER TABLE flows ADD COLUMN has_draft_changes INTEGER NOT NULL DEFAULT 0");
  await addFlowColumnIfMissing(env, columns, "published_at", "ALTER TABLE flows ADD COLUMN published_at TEXT");
}

async function addFlowColumnIfMissing(env, columns, columnName, sql) {
  if (columns.has(columnName)) return;
  try {
    await env.DB.prepare(sql).run();
  } catch (error) {
    if (!String(error?.message || "").toLowerCase().includes("duplicate column")) throw error;
  }
}

function rowToFlow(row, options = {}) {
  const draftNodes = parseNodes(row.nodes_json);
  const publishedNodes = parseNodes(row.published_nodes_json);
  const publishedMeta = parseObject(row.published_meta_json);
  const hasPublishedNodes = Boolean(row.published_nodes_json);
  const nodes = options.runtime && row.status === "active" && hasPublishedNodes ? publishedNodes : draftNodes;
  const meta = options.runtime && row.status === "active" && publishedMeta ? publishedMeta : {};

  return {
    id: row.id,
    pageId: row.page_id,
    name: meta.name || row.name,
    status: row.status,
    trigger: meta.trigger || row.trigger_text || "",
    goal: meta.goal || row.goal || "",
    nodes,
    publishedNodes: hasPublishedNodes ? publishedNodes : null,
    publishedMeta,
    hasDraftChanges: Boolean(row.has_draft_changes),
    publishedAt: row.published_at || "",
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function normalizeFlow(flow, now) {
  const status = String(flow.status || "draft");
  const nodes = Array.isArray(flow.nodes) ? flow.nodes : [];
  const publishedNodes = Array.isArray(flow.publishedNodes) ? flow.publishedNodes : null;
  const publishedMeta = flow.publishedMeta && typeof flow.publishedMeta === "object" && !Array.isArray(flow.publishedMeta)
    ? {
        name: String(flow.publishedMeta.name || ""),
        trigger: String(flow.publishedMeta.trigger || ""),
        goal: String(flow.publishedMeta.goal || "")
      }
    : null;

  return {
    id: String(flow.id || crypto.randomUUID()),
    name: String(flow.name || "Fluxo sem nome"),
    status,
    trigger: String(flow.trigger || ""),
    goal: String(flow.goal || ""),
    nodes,
    publishedNodes,
    publishedMeta,
    hasDraftChanges: Boolean(flow.hasDraftChanges),
    publishedAt: flow.publishedAt ? String(flow.publishedAt) : "",
    createdAt: flow.createdAt || now,
    updatedAt: flow.updatedAt || now
  };
}

function parseNodes(value) {
  try {
    const nodes = JSON.parse(value || "[]");
    return Array.isArray(nodes) ? nodes : [];
  } catch {
    return [];
  }
}

function parseObject(value) {
  try {
    const parsed = JSON.parse(value || "null");
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
