const DEFAULT_PAGE_ID = "__global__";
const CUSTOM_FIELD_TYPES = new Set(["text", "number", "date", "datetime", "boolean"]);

export async function ensureCustomFieldSchema(env) {
  if (!env.DB) return false;

  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS custom_fields (
      page_id TEXT NOT NULL,
      id TEXT NOT NULL,
      name TEXT NOT NULL,
      name_key TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'text',
      description TEXT,
      folder TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      PRIMARY KEY (page_id, id),
      UNIQUE (page_id, name_key)
    )
  `).run();

  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_custom_fields_page_name ON custom_fields(page_id, name_key)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_custom_fields_page_updated ON custom_fields(page_id, updated_at DESC)").run();
  return true;
}

export async function listCustomFields(env, pageId) {
  const hasDb = await ensureCustomFieldSchema(env);
  if (!hasDb) return [];

  const result = await env.DB.prepare(`
    SELECT page_id, id, name, type, description, folder, created_at, updated_at
    FROM custom_fields
    WHERE page_id = ?
    ORDER BY folder ASC, name ASC
  `)
    .bind(normalizePageId(pageId))
    .all();

  return (result.results || []).map(rowToCustomField);
}

export async function getCustomFieldById(env, pageId, fieldId) {
  const hasDb = await ensureCustomFieldSchema(env);
  if (!hasDb || !fieldId) return null;

  const row = await env.DB.prepare(`
    SELECT page_id, id, name, type, description, folder, created_at, updated_at
    FROM custom_fields
    WHERE page_id = ? AND id = ?
  `)
    .bind(normalizePageId(pageId), String(fieldId || "").trim())
    .first();

  return row ? rowToCustomField(row) : null;
}

export async function getCustomFieldByName(env, pageId, fieldName) {
  const hasDb = await ensureCustomFieldSchema(env);
  const nameKey = normalizeCustomFieldKey(fieldName);
  if (!hasDb || !nameKey) return null;

  const row = await env.DB.prepare(`
    SELECT page_id, id, name, type, description, folder, created_at, updated_at
    FROM custom_fields
    WHERE page_id = ? AND name_key = ?
  `)
    .bind(normalizePageId(pageId), nameKey)
    .first();

  return row ? rowToCustomField(row) : null;
}

export async function upsertCustomField(env, pageId, field = {}) {
  const hasDb = await ensureCustomFieldSchema(env);
  if (!hasDb) throw new Error("D1 binding DB is not configured");

  const normalizedPageId = normalizePageId(pageId || field.pageId);
  const name = cleanText(field.name);
  if (!name) throw new Error("Custom field name is required");

  const nameKey = normalizeCustomFieldKey(name);
  const existing = await env.DB.prepare(`
    SELECT page_id, id, name, type, description, folder, created_at, updated_at
    FROM custom_fields
    WHERE page_id = ? AND name_key = ?
  `)
    .bind(normalizedPageId, nameKey)
    .first();

  const now = new Date().toISOString();
  const next = {
    pageId: normalizedPageId,
    id: String(existing?.id || field.id || crypto.randomUUID()),
    name,
    type: normalizeCustomFieldType(field.type || existing?.type),
    description: cleanText(field.description ?? existing?.description),
    folder: cleanText(field.folder ?? existing?.folder),
    createdAt: existing?.created_at || field.createdAt || now,
    updatedAt: now
  };

  await env.DB.prepare(`
    INSERT INTO custom_fields (page_id, id, name, name_key, type, description, folder, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(page_id, name_key) DO UPDATE SET
      name = excluded.name,
      type = excluded.type,
      description = excluded.description,
      folder = excluded.folder,
      updated_at = excluded.updated_at
  `)
    .bind(
      next.pageId,
      next.id,
      next.name,
      nameKey,
      next.type,
      next.description,
      next.folder,
      next.createdAt,
      next.updatedAt
    )
    .run();

  return next;
}

export async function deleteCustomField(env, pageId, fieldId) {
  const hasDb = await ensureCustomFieldSchema(env);
  if (!hasDb) throw new Error("D1 binding DB is not configured");

  const result = await env.DB.prepare("DELETE FROM custom_fields WHERE page_id = ? AND id = ?")
    .bind(normalizePageId(pageId), String(fieldId || "").trim())
    .run();

  return Boolean(result.meta?.changes);
}

export function normalizeCustomFieldType(value) {
  const type = String(value || "text").trim().toLowerCase();
  return CUSTOM_FIELD_TYPES.has(type) ? type : "text";
}

export function normalizeCustomFieldKey(value) {
  return cleanText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function coerceCustomFieldValue(value, type = "text") {
  const normalizedType = normalizeCustomFieldType(type);
  const text = String(value ?? "").trim();
  if (!text && normalizedType !== "text") return "";
  if (normalizedType === "number") {
    const number = Number(value);
    return Number.isFinite(number) ? number : text;
  }
  if (normalizedType === "boolean") {
    if (typeof value === "boolean") return value;
    return ["true", "1", "sim", "yes", "on"].includes(text.toLowerCase());
  }
  if (normalizedType === "date") {
    return /^\d{4}-\d{2}-\d{2}$/.test(text) ? text : "";
  }
  if (normalizedType === "datetime") {
    const timestamp = Date.parse(text);
    return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : "";
  }
  return String(value ?? "");
}

function normalizePageId(pageId) {
  return String(pageId || DEFAULT_PAGE_ID).trim() || DEFAULT_PAGE_ID;
}

function cleanText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function rowToCustomField(row) {
  return {
    pageId: row.page_id,
    id: row.id,
    name: row.name,
    type: normalizeCustomFieldType(row.type),
    description: row.description || "",
    folder: row.folder || "",
    createdAt: row.created_at || "",
    updatedAt: row.updated_at || ""
  };
}
