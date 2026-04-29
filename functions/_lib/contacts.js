const DEFAULT_PAGE_ID = "__global__";

export async function ensureContactSchema(env) {
  if (!env.DB) return false;

  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS contacts (
      page_id TEXT NOT NULL,
      psid TEXT NOT NULL,
      name TEXT,
      status TEXT NOT NULL DEFAULT 'open',
      source TEXT,
      tags_json TEXT NOT NULL DEFAULT '[]',
      custom_fields_json TEXT NOT NULL DEFAULT '{}',
      last_seen TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      PRIMARY KEY (page_id, psid)
    )
  `).run();

  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_contacts_page_id ON contacts(page_id)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_contacts_page_status ON contacts(page_id, status)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_contacts_page_last_seen ON contacts(page_id, last_seen)").run();

  return true;
}

export function normalizePageId(pageId) {
  return String(pageId || DEFAULT_PAGE_ID).trim() || DEFAULT_PAGE_ID;
}

export async function listContacts(env, pageId) {
  const hasDb = await ensureContactSchema(env);
  if (!hasDb) return [];

  const result = await env.DB.prepare(`
    SELECT page_id, psid, name, status, source, tags_json, custom_fields_json, last_seen, created_at, updated_at
    FROM contacts
    WHERE page_id = ?
    ORDER BY datetime(updated_at) DESC, datetime(created_at) DESC
  `)
    .bind(normalizePageId(pageId))
    .all();

  return (result.results || []).map(rowToContact);
}

export async function upsertContact(env, pageId, contact = {}) {
  const hasDb = await ensureContactSchema(env);
  if (!hasDb) return null;

  const normalizedPageId = normalizePageId(pageId || contact.pageId);
  const psid = String(contact.psid || "").trim();
  if (!psid) throw new Error("psid is required");

  const existing = await env.DB.prepare(`
    SELECT page_id, psid, name, status, source, tags_json, custom_fields_json, last_seen, created_at, updated_at
    FROM contacts
    WHERE page_id = ? AND psid = ?
  `)
    .bind(normalizedPageId, psid)
    .first();

  const now = new Date().toISOString();
  const hasIncomingTags = Array.isArray(contact.tags) || typeof contact.tag === "string";
  const tags = hasIncomingTags ? normalizeTags(contact.tags ?? contact.tag) : parseJsonArray(existing?.tags_json);
  const fields = contact.customFields && typeof contact.customFields === "object"
    ? contact.customFields
    : parseJsonObject(existing?.custom_fields_json);

  const next = {
    pageId: normalizedPageId,
    psid,
    name: String(contact.name || existing?.name || psid),
    status: String(contact.status || existing?.status || "open"),
    source: String(contact.source || existing?.source || "Messenger"),
    tags,
    customFields: fields,
    lastSeen: contact.lastSeen || existing?.last_seen || now,
    createdAt: existing?.created_at || contact.createdAt || now,
    updatedAt: now
  };

  await env.DB.prepare(`
    INSERT INTO contacts (
      page_id, psid, name, status, source, tags_json, custom_fields_json, last_seen, created_at, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(page_id, psid) DO UPDATE SET
      name = excluded.name,
      status = excluded.status,
      source = excluded.source,
      tags_json = excluded.tags_json,
      custom_fields_json = excluded.custom_fields_json,
      last_seen = excluded.last_seen,
      updated_at = excluded.updated_at
  `)
    .bind(
      next.pageId,
      next.psid,
      next.name,
      next.status,
      next.source,
      JSON.stringify(next.tags),
      JSON.stringify(next.customFields),
      next.lastSeen,
      next.createdAt,
      next.updatedAt
    )
    .run();

  return {
    id: contactId(next.pageId, next.psid),
    pageId: next.pageId,
    psid: next.psid,
    name: next.name,
    status: next.status,
    source: next.source,
    tags: next.tags,
    tag: next.tags[0] || "",
    customFields: next.customFields,
    lastSeen: next.lastSeen,
    createdAt: next.createdAt,
    updatedAt: next.updatedAt
  };
}

export async function setContactTags(env, pageId, psid, tags) {
  const contact = await upsertContact(env, pageId, { psid, tags });
  return contact;
}

export async function applyContactActions(env, pageId, psid, actions = [], contact = {}) {
  const hasDb = await ensureContactSchema(env);
  if (!hasDb || !psid) return null;

  const current = await upsertContact(env, pageId, { ...contact, psid });
  if (!current) return null;

  let tags = normalizeTags(current.tags);
  const customFields = current.customFields && typeof current.customFields === "object" ? { ...current.customFields } : {};
  let status = current.status || "open";

  normalizeActionSteps(actions).forEach((action) => {
    if (action.type === "add_tag" && action.tag) {
      tags = normalizeTags([...tags, action.tag]);
    }
    if (action.type === "remove_tag" && action.tag) {
      const normalizedTag = normalizeTag(action.tag);
      tags = tags.filter((tag) => normalizeTag(tag) !== normalizedTag);
    }
    if (action.type === "set_user_field" && action.fieldName) {
      customFields[action.fieldName] = action.fieldValue || "";
    }
    if (action.type === "clear_custom_field" && action.fieldName) {
      delete customFields[action.fieldName];
    }
    if (action.type === "delete_contact") {
      status = "deleted";
    }
    if (action.type === "open_inbox") {
      status = "open";
    }
  });

  return upsertContact(env, pageId, {
    ...current,
    status,
    tags,
    customFields,
    lastSeen: contact.lastSeen || current.lastSeen || new Date().toISOString()
  });
}

export function normalizeActionSteps(actions = []) {
  return (Array.isArray(actions) ? actions : [])
    .map((action) => ({
      id: String(action.id || ""),
      type: String(action.type || action.action || "").trim(),
      tag: String(action.tag || action.value || "").trim(),
      fieldName: String(action.fieldName || "").trim(),
      fieldValue: String(action.fieldValue || "").trim()
    }))
    .filter((action) => action.type);
}

export function normalizeTags(value) {
  const raw = Array.isArray(value) ? value : String(value || "").split(",");
  return [...new Set(raw.map((item) => String(item || "").trim()).filter(Boolean))];
}

function normalizeTag(value) {
  return String(value || "").trim().toLowerCase();
}

function rowToContact(row) {
  const tags = parseJsonArray(row.tags_json);
  return {
    id: contactId(row.page_id, row.psid),
    pageId: row.page_id,
    psid: row.psid,
    name: row.name || row.psid,
    status: row.status || "open",
    source: row.source || "Messenger",
    tags,
    tag: tags[0] || "",
    customFields: parseJsonObject(row.custom_fields_json),
    lastSeen: row.last_seen || "",
    createdAt: row.created_at || "",
    updatedAt: row.updated_at || ""
  };
}

function contactId(pageId, psid) {
  return `${normalizePageId(pageId)}:${psid}`;
}

function parseJsonArray(value) {
  try {
    const parsed = JSON.parse(value || "[]");
    return normalizeTags(Array.isArray(parsed) ? parsed : []);
  } catch {
    return [];
  }
}

function parseJsonObject(value) {
  try {
    const parsed = JSON.parse(value || "{}");
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}
