const DEFAULT_PAGE_ID = "__global__";

export async function ensureJsonTemplateSchema(env) {
  if (!env.DB) return false;

  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS json_templates (
      page_id TEXT NOT NULL,
      id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      json_text TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      PRIMARY KEY (page_id, id)
    )
  `).run();

  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_json_templates_page_updated ON json_templates(page_id, updated_at DESC)").run();
  return true;
}

export async function listJsonTemplates(env, pageId) {
  const hasDb = await ensureJsonTemplateSchema(env);
  if (!hasDb) return [];

  const result = await env.DB.prepare(`
    SELECT page_id, id, name, description, json_text, created_at, updated_at
    FROM json_templates
    WHERE page_id = ?
    ORDER BY updated_at DESC, created_at DESC
  `)
    .bind(normalizePageId(pageId))
    .all();

  return (result.results || []).map(rowToJsonTemplate);
}

export async function upsertJsonTemplate(env, pageId, template = {}) {
  const hasDb = await ensureJsonTemplateSchema(env);
  if (!hasDb) throw new Error("D1 binding DB is not configured");

  const normalizedPageId = normalizePageId(pageId || template.pageId);
  const id = cleanId(template.id) || crypto.randomUUID();
  const name = cleanText(template.name);
  const description = cleanText(template.description);
  const jsonText = formatJsonTemplate(template.jsonText ?? template.json_text);
  if (!name) throw new Error("Template name is required");

  const existing = await env.DB.prepare(`
    SELECT created_at
    FROM json_templates
    WHERE page_id = ? AND id = ?
  `)
    .bind(normalizedPageId, id)
    .first();

  const now = new Date().toISOString();
  const record = {
    pageId: normalizedPageId,
    id,
    name,
    description,
    jsonText,
    createdAt: existing?.created_at || template.createdAt || now,
    updatedAt: now
  };

  await env.DB.prepare(`
    INSERT INTO json_templates (page_id, id, name, description, json_text, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(page_id, id) DO UPDATE SET
      name = excluded.name,
      description = excluded.description,
      json_text = excluded.json_text,
      updated_at = excluded.updated_at
  `)
    .bind(
      record.pageId,
      record.id,
      record.name,
      record.description,
      record.jsonText,
      record.createdAt,
      record.updatedAt
    )
    .run();

  return record;
}

export async function deleteJsonTemplate(env, pageId, templateId) {
  const hasDb = await ensureJsonTemplateSchema(env);
  if (!hasDb) throw new Error("D1 binding DB is not configured");

  const result = await env.DB.prepare("DELETE FROM json_templates WHERE page_id = ? AND id = ?")
    .bind(normalizePageId(pageId), cleanId(templateId))
    .run();

  return Boolean(result.meta?.changes);
}

export function formatJsonTemplate(value) {
  const text = String(value || "").trim();
  if (!text) throw new Error("Template JSON is required");

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Template JSON is invalid");
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("Template JSON must be an object or array");
  }

  return JSON.stringify(parsed, null, 2);
}

function normalizePageId(pageId) {
  return String(pageId || DEFAULT_PAGE_ID).trim() || DEFAULT_PAGE_ID;
}

function cleanId(value) {
  return String(value || "").trim().slice(0, 160);
}

function cleanText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function rowToJsonTemplate(row) {
  return {
    pageId: row.page_id,
    id: row.id,
    name: row.name,
    description: row.description || "",
    jsonText: row.json_text || "{}",
    createdAt: row.created_at || "",
    updatedAt: row.updated_at || ""
  };
}
