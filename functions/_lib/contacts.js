import { coerceCustomFieldValue, ensureCustomFieldSchema, getCustomFieldById, getCustomFieldByName, normalizeCustomFieldType } from "./customFields.js";

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
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_contacts_page_updated ON contacts(page_id, updated_at DESC)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_contacts_page_status_updated ON contacts(page_id, status, updated_at DESC)").run();
  await ensureContactCustomFieldValueSchema(env);

  return true;
}

async function ensureContactCustomFieldValueSchema(env) {
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS contact_custom_field_values (
      page_id TEXT NOT NULL,
      psid TEXT NOT NULL,
      field_id TEXT NOT NULL,
      field_name TEXT NOT NULL,
      field_type TEXT NOT NULL DEFAULT 'text',
      value_json TEXT NOT NULL DEFAULT 'null',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      PRIMARY KEY (page_id, psid, field_id)
    )
  `).run();

  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_contact_field_values_page_field ON contact_custom_field_values(page_id, field_id, updated_at DESC)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_contact_field_values_page_psid ON contact_custom_field_values(page_id, psid, updated_at DESC)").run();
}

export function normalizePageId(pageId) {
  return String(pageId || DEFAULT_PAGE_ID).trim() || DEFAULT_PAGE_ID;
}

export async function listContacts(env, pageId) {
  const hasDb = await ensureContactSchema(env);
  if (!hasDb) return [];

  const normalizedPageId = normalizePageId(pageId);
  const result = await env.DB.prepare(`
    SELECT page_id, psid, name, status, source, tags_json, custom_fields_json, last_seen, created_at, updated_at
    FROM contacts
    WHERE page_id = ?
    ORDER BY datetime(updated_at) DESC, datetime(created_at) DESC
  `)
    .bind(normalizedPageId)
    .all();

  return enrichContactsWithCustomFieldValues(env, normalizedPageId, (result.results || []).map(rowToContact));
}

export async function getContact(env, pageId, psid) {
  const hasDb = await ensureContactSchema(env);
  if (!hasDb || !psid) return null;

  const row = await env.DB.prepare(`
    SELECT page_id, psid, name, status, source, tags_json, custom_fields_json, last_seen, created_at, updated_at
    FROM contacts
    WHERE page_id = ? AND psid = ?
  `)
    .bind(normalizePageId(pageId), String(psid || "").trim())
    .first();

  if (!row) return null;
  const contacts = await enrichContactsWithCustomFieldValues(env, normalizePageId(pageId), [rowToContact(row)]);
  return contacts[0] || null;
}

export async function clearContactTags(env, pageId) {
  const hasDb = await ensureContactSchema(env);
  if (!hasDb) return { count: 0, contacts: [] };

  const normalizedPageId = normalizePageId(pageId);
  const result = await env.DB.prepare(`
    UPDATE contacts
    SET tags_json = '[]', updated_at = ?
    WHERE page_id = ? AND tags_json <> '[]'
  `)
    .bind(new Date().toISOString(), normalizedPageId)
    .run();

  return {
    count: result.meta?.changes || 0,
    contacts: await listContacts(env, normalizedPageId)
  };
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
    name: contactDisplayName(contact.name, existing?.name, psid),
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

  const normalizedPageId = normalizePageId(pageId);
  const savedCurrent = await upsertContact(env, normalizedPageId, { ...contact, psid });
  const current = (await getContact(env, normalizedPageId, psid)) || savedCurrent;
  if (!current) return null;

  let tags = normalizeTags(current.tags);
  const customFields = current.customFields && typeof current.customFields === "object" ? { ...current.customFields } : {};
  let status = current.status || "open";
  const fieldOps = [];

  for (const action of normalizeActionSteps(actions)) {
    if (action.type === "add_tag" && action.tag) {
      tags = normalizeTags([...tags, action.tag]);
    }
    if (action.type === "remove_tag" && action.tag) {
      const normalizedTag = normalizeTag(action.tag);
      tags = tags.filter((tag) => normalizeTag(tag) !== normalizedTag);
    }
    if (action.type === "set_user_field" && (action.fieldName || action.fieldId)) {
      const field = await resolveActionCustomField(env, normalizedPageId, action);
      const fieldName = field?.name || action.fieldName;
      const fieldType = field?.type || action.fieldType;
      if (!fieldName) continue;
      const value = coerceCustomFieldValue(action.fieldValue, fieldType);
      customFields[fieldName] = value;
      if (action.fieldName && action.fieldName !== fieldName) delete customFields[action.fieldName];
      if (field?.id) fieldOps.push({ type: "write", field, value });
    }
    if (action.type === "clear_custom_field" && (action.fieldName || action.fieldId)) {
      const field = await resolveActionCustomField(env, normalizedPageId, action);
      const fieldName = field?.name || action.fieldName;
      if (!fieldName) continue;
      delete customFields[fieldName];
      if (action.fieldName && action.fieldName !== fieldName) delete customFields[action.fieldName];
      if (field?.id) fieldOps.push({ type: "clear", field });
    }
    if (action.type === "delete_contact") {
      status = "deleted";
    }
    if (action.type === "open_inbox") {
      status = "open";
    }
  }

  const saved = await upsertContact(env, normalizedPageId, {
    ...current,
    status,
    tags,
    customFields,
    lastSeen: contact.lastSeen || current.lastSeen || new Date().toISOString()
  });

  for (const operation of fieldOps) {
    if (operation.type === "write") {
      await upsertContactCustomFieldValue(env, normalizedPageId, psid, operation.field, operation.value);
    }
    if (operation.type === "clear") {
      await deleteContactCustomFieldValue(env, normalizedPageId, psid, operation.field.id);
    }
  }

  return saved;
}

export function normalizeActionSteps(actions = []) {
  return (Array.isArray(actions) ? actions : [])
    .map((action) => ({
      id: String(action.id || ""),
      type: String(action.type || action.action || "").trim(),
      tag: String(action.tag || action.value || "").trim(),
      fieldId: String(action.fieldId || action.customFieldId || "").trim(),
      fieldName: String(action.fieldName || "").trim(),
      fieldValue: action.fieldValue ?? "",
      fieldType: normalizeCustomFieldType(action.fieldType)
    }))
    .filter((action) => action.type);
}

export function normalizeTags(value) {
  const raw = Array.isArray(value) ? value : String(value || "").split(",");
  const seen = new Set();
  const tags = [];

  raw.forEach((item) => {
    const tag = String(item || "").replace(/\s+/g, " ").trim();
    const key = normalizeTag(tag);
    if (!tag || seen.has(key)) return;
    seen.add(key);
    tags.push(tag);
  });

  return tags;
}

async function resolveActionCustomField(env, pageId, action = {}) {
  if (action.fieldId) {
    const byId = await getCustomFieldById(env, pageId, action.fieldId).catch(() => null);
    if (byId) return byId;
  }

  if (action.fieldName) {
    const byName = await getCustomFieldByName(env, pageId, action.fieldName).catch(() => null);
    if (byName) return byName;
  }

  return null;
}

async function upsertContactCustomFieldValue(env, pageId, psid, field, value) {
  if (!field?.id || !psid) return;

  await ensureContactCustomFieldValueSchema(env);
  const now = new Date().toISOString();
  await env.DB.prepare(`
    INSERT INTO contact_custom_field_values (
      page_id, psid, field_id, field_name, field_type, value_json, created_at, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(page_id, psid, field_id) DO UPDATE SET
      field_name = excluded.field_name,
      field_type = excluded.field_type,
      value_json = excluded.value_json,
      updated_at = excluded.updated_at
  `)
    .bind(
      normalizePageId(pageId),
      String(psid || "").trim(),
      String(field.id || "").trim(),
      String(field.name || "").trim(),
      normalizeCustomFieldType(field.type),
      JSON.stringify(value),
      now,
      now
    )
    .run();
}

async function deleteContactCustomFieldValue(env, pageId, psid, fieldId) {
  if (!fieldId || !psid) return;

  await ensureContactCustomFieldValueSchema(env);
  await env.DB.prepare(`
    DELETE FROM contact_custom_field_values
    WHERE page_id = ? AND psid = ? AND field_id = ?
  `)
    .bind(normalizePageId(pageId), String(psid || "").trim(), String(fieldId || "").trim())
    .run();
}

async function enrichContactsWithCustomFieldValues(env, pageId, contacts = []) {
  if (!contacts.length) return contacts;

  await ensureContactCustomFieldValueSchema(env);
  await ensureCustomFieldSchema(env);
  const normalizedPageId = normalizePageId(pageId);
  const byPsid = new Map(contacts.map((contact) => [contact.psid, contact]));
  const psids = contacts.map((contact) => contact.psid).filter(Boolean);
  if (!psids.length) return contacts;

  for (const chunk of chunkArray(psids, 80)) {
    const placeholders = chunk.map(() => "?").join(", ");
    const result = await env.DB.prepare(`
      SELECT
        values_table.psid,
        values_table.field_id,
        values_table.field_name AS stored_field_name,
        COALESCE(fields.name, values_table.field_name) AS field_name,
        COALESCE(fields.type, values_table.field_type, 'text') AS field_type,
        values_table.value_json
      FROM contact_custom_field_values values_table
      LEFT JOIN custom_fields fields
        ON fields.page_id = values_table.page_id
        AND fields.id = values_table.field_id
      WHERE values_table.page_id = ?
        AND values_table.psid IN (${placeholders})
    `)
      .bind(normalizedPageId, ...chunk)
      .all();

    for (const row of result.results || []) {
      const contact = byPsid.get(row.psid);
      const fieldName = String(row.field_name || "").trim();
      if (!contact || !fieldName) continue;

      const storedFieldName = String(row.stored_field_name || "").trim();
      contact.customFields = contact.customFields && typeof contact.customFields === "object" ? { ...contact.customFields } : {};
      if (storedFieldName && storedFieldName !== fieldName) delete contact.customFields[storedFieldName];
      contact.customFields[fieldName] = parseJsonValue(row.value_json);
    }
  }

  return contacts;
}

function chunkArray(items, size) {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

function normalizeTag(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function contactDisplayName(incomingName, existingName, psid) {
  const incoming = cleanName(incomingName);
  const existing = cleanName(existingName);

  if (incoming && !isTechnicalContactName(incoming, psid)) return incoming;
  if (existing && !isTechnicalContactName(existing, psid)) return existing;
  return fallbackContactName(psid);
}

function cleanName(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function isTechnicalContactName(value, psid = "") {
  const text = cleanName(value);
  if (!text) return true;
  if (psid && text === String(psid)) return true;
  return /^PSID[_:-]?\d+$/i.test(text) || /^\d{12,}$/.test(text);
}

function fallbackContactName(psid) {
  const suffix = String(psid || "").slice(-6);
  return suffix ? `Contato ${suffix}` : "Contato Messenger";
}

function rowToContact(row) {
  const tags = parseJsonArray(row.tags_json);
  return {
    id: contactId(row.page_id, row.psid),
    pageId: row.page_id,
    psid: row.psid,
    name: contactDisplayName(row.name, "", row.psid),
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

function parseJsonValue(value) {
  try {
    return JSON.parse(value || "null");
  } catch {
    return null;
  }
}
