import { getMetaConfig, getPageAccessToken, graphFetch, graphUrl, json } from "../_lib/meta.js";
import { applyContactActions, clearContactTags, listContacts, normalizeTags, setContactTags, upsertContact } from "../_lib/contacts.js";

const PROFILE_LOOKUP_LIMIT = 30;

export async function onRequestGet({ request, env }) {
  if (!env.DB) return json({ error: "D1 binding DB is not configured", contacts: [] }, 501);

  const url = new URL(request.url);
  const pageId = url.searchParams.get("pageId");
  if (!pageId) return json({ error: "pageId is required" }, 400);

  const authError = await requirePageAccess(request, env, pageId);
  if (authError) return authError;

  const contacts = await listContacts(env, pageId);
  return json({ contacts: await enrichContactsWithMessengerProfiles(request, env, pageId, contacts) });
}

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ error: "D1 binding DB is not configured" }, 501);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const pageId = body.pageId || body.contact?.pageId;
  const psid = body.psid || body.contact?.psid;
  if (!pageId) return json({ error: "pageId is required" }, 400);

  const authError = await requirePageAccess(request, env, pageId);
  if (authError) return authError;

  try {
    if (body.action === "clear_all_tags") {
      const result = await clearContactTags(env, pageId);
      return json({ ok: true, pageId, ...result });
    }

    if (body.action === "add_tag") {
      const current = await upsertContact(env, pageId, body.contact || { psid });
      const tags = normalizeTags([...(current?.tags || []), body.tag]);
      return json({ contact: await setContactTags(env, pageId, current.psid, tags) });
    }

    if (body.action === "remove_tag") {
      const current = await upsertContact(env, pageId, body.contact || { psid });
      const target = normalizeTagKey(body.tag);
      const tags = (current?.tags || []).filter((tag) => normalizeTagKey(tag) !== target);
      return json({ contact: await setContactTags(env, pageId, current.psid, tags) });
    }

    if (body.action === "set_tags") {
      if (!psid) return json({ error: "psid is required" }, 400);
      return json({ contact: await setContactTags(env, pageId, psid, body.tags || []) });
    }

    if (body.action === "apply_actions") {
      if (!psid) return json({ error: "psid is required" }, 400);
      return json({ contact: await applyContactActions(env, pageId, psid, body.actions || [], body.contact || {}) });
    }

    if (body.contact) {
      return json({ contact: await upsertContact(env, pageId, body.contact) });
    }
  } catch (error) {
    return json({ error: error.message || "Could not save contact" }, 400);
  }

  return json({ error: "Unsupported contact action" }, 400);
}

function normalizeTagKey(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

async function requirePageAccess(request, env, pageId) {
  if (String(pageId || "") === "__global__") return null;

  const pageAccessToken = await getPageAccessToken(request, env, pageId);
  if (!pageAccessToken) {
    return json({ error: "Login required to manage contacts for this Page" }, 401);
  }

  return null;
}

async function enrichContactsWithMessengerProfiles(request, env, pageId, contacts = []) {
  const unresolved = contacts.filter(shouldLookupMessengerProfile).slice(0, PROFILE_LOOKUP_LIMIT);
  if (!unresolved.length) return contacts;

  const pageAccessToken = await getPageAccessToken(request, env, pageId);
  if (!pageAccessToken) return contacts;

  const config = getMetaConfig(request, env);
  const updatedByPsid = new Map();

  for (const contact of unresolved) {
    const profile = await fetchMessengerProfile(config, pageAccessToken, contact.psid);
    if (!profile?.name) continue;

    const updated = await upsertContact(env, pageId, {
      psid: contact.psid,
      name: profile.name,
      status: contact.status || "open",
      source: contact.source || "Messenger",
      lastSeen: contact.lastSeen || new Date().toISOString()
    });
    if (updated) updatedByPsid.set(contact.psid, updated);
  }

  if (!updatedByPsid.size) return contacts;
  return contacts.map((contact) => updatedByPsid.get(contact.psid) || contact);
}

async function fetchMessengerProfile(config, pageAccessToken, psid) {
  if (!pageAccessToken || !psid) return null;

  try {
    const payload = await graphFetch(
      graphUrl(config, `/${psid}`, {
        fields: "first_name,last_name,profile_pic",
        access_token: pageAccessToken
      })
    );
    const firstName = cleanText(payload.first_name);
    const lastName = cleanText(payload.last_name);
    const name = cleanText([firstName, lastName].filter(Boolean).join(" "));
    return name ? { name, firstName, lastName, profilePic: cleanText(payload.profile_pic) } : null;
  } catch {
    return null;
  }
}

function shouldLookupMessengerProfile(contact = {}) {
  return Boolean(contact.psid && isTechnicalContactName(contact.name, contact.psid));
}

function isTechnicalContactName(value, psid = "") {
  const text = cleanText(value);
  if (!text) return true;
  if (psid && text === String(psid)) return true;
  if (/^Contato \d{1,12}$/i.test(text)) return true;
  return /^PSID[_:-]?\d+$/i.test(text) || /^\d{12,}$/.test(text);
}

function cleanText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}
