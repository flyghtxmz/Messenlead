import { getPageAccessToken, json } from "../_lib/meta.js";
import { applyContactActions, listContacts, normalizeTags, setContactTags, upsertContact } from "../_lib/contacts.js";

export async function onRequestGet({ request, env }) {
  if (!env.DB) return json({ error: "D1 binding DB is not configured", contacts: [] }, 501);

  const url = new URL(request.url);
  const pageId = url.searchParams.get("pageId");
  if (!pageId) return json({ error: "pageId is required" }, 400);

  const authError = await requirePageAccess(request, env, pageId);
  if (authError) return authError;

  return json({ contacts: await listContacts(env, pageId) });
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
    if (body.action === "add_tag") {
      const current = await upsertContact(env, pageId, body.contact || { psid });
      const tags = normalizeTags([...(current?.tags || []), body.tag]);
      return json({ contact: await setContactTags(env, pageId, current.psid, tags) });
    }

    if (body.action === "remove_tag") {
      const current = await upsertContact(env, pageId, body.contact || { psid });
      const target = String(body.tag || "").trim().toLowerCase();
      const tags = (current?.tags || []).filter((tag) => String(tag).trim().toLowerCase() !== target);
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

async function requirePageAccess(request, env, pageId) {
  if (String(pageId || "") === "__global__") return null;

  const pageAccessToken = await getPageAccessToken(request, env, pageId);
  if (!pageAccessToken) {
    return json({ error: "Login required to manage contacts for this Page" }, 401);
  }

  return null;
}
