import { deleteCustomField, listCustomFields, upsertCustomField } from "../_lib/customFields.js";
import { getSession, json } from "../_lib/meta.js";

export async function onRequestGet({ request, env }) {
  const auth = await authorizeCustomFieldRequest(request, env);
  if (!auth.ok) return auth.response;
  if (!env.DB) return json({ error: "D1 binding DB is not configured", fields: [] }, 501);

  const url = new URL(request.url);
  const pageId = String(url.searchParams.get("pageId") || "").trim();
  if (!pageId) return json({ error: "pageId is required" }, 400);

  try {
    return json({ pageId, fields: await listCustomFields(env, pageId) });
  } catch (error) {
    return json({ error: error.message || "Could not list custom fields", fields: [] }, 500);
  }
}

export async function onRequestPost({ request, env }) {
  const auth = await authorizeCustomFieldRequest(request, env);
  if (!auth.ok) return auth.response;
  if (!env.DB) return json({ error: "D1 binding DB is not configured" }, 501);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const pageId = String(body.pageId || body.field?.pageId || "").trim();
  if (!pageId || !body.field) return json({ error: "pageId and field are required" }, 400);

  try {
    return json({ ok: true, pageId, field: await upsertCustomField(env, pageId, body.field) });
  } catch (error) {
    return json({ error: error.message || "Could not save custom field" }, 400);
  }
}

export async function onRequestDelete({ request, env }) {
  const auth = await authorizeCustomFieldRequest(request, env);
  if (!auth.ok) return auth.response;
  if (!env.DB) return json({ error: "D1 binding DB is not configured" }, 501);

  const url = new URL(request.url);
  const pageId = String(url.searchParams.get("pageId") || "").trim();
  const id = String(url.searchParams.get("id") || "").trim();
  if (!pageId || !id) return json({ error: "pageId and id are required" }, 400);

  try {
    return json({ ok: await deleteCustomField(env, pageId, id) });
  } catch (error) {
    return json({ error: error.message || "Could not delete custom field" }, 500);
  }
}

async function authorizeCustomFieldRequest(request, env) {
  const authorization = request.headers.get("authorization") || "";
  if (env.MESSENLEAD_OPERATOR_TOKEN && authorization === `Bearer ${env.MESSENLEAD_OPERATOR_TOKEN}`) {
    return { ok: true };
  }

  const session = await getSession(request, env);
  if (session?.accessToken) return { ok: true };

  return {
    ok: false,
    response: json({ error: "Login required to manage custom fields" }, 401)
  };
}
