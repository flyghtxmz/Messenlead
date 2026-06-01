import { deleteJsonTemplate, listJsonTemplates, upsertJsonTemplate } from "../_lib/jsonTemplates.js";
import { getSession, json } from "../_lib/meta.js";

export async function onRequestGet({ request, env }) {
  const auth = await authorizeJsonTemplateRequest(request, env);
  if (!auth.ok) return auth.response;
  if (!env.DB) return json({ error: "D1 binding DB is not configured", templates: [] }, 501);

  const url = new URL(request.url);
  const pageId = String(url.searchParams.get("pageId") || "").trim();
  if (!pageId) return json({ error: "pageId is required" }, 400);

  try {
    return json({ pageId, templates: await listJsonTemplates(env, pageId) });
  } catch (error) {
    return json({ error: error.message || "Could not list JSON templates", templates: [] }, 500);
  }
}

export async function onRequestPost({ request, env }) {
  const auth = await authorizeJsonTemplateRequest(request, env);
  if (!auth.ok) return auth.response;
  if (!env.DB) return json({ error: "D1 binding DB is not configured" }, 501);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const pageId = String(body.pageId || body.template?.pageId || "").trim();
  if (!pageId || !body.template) return json({ error: "pageId and template are required" }, 400);

  try {
    return json({ ok: true, pageId, template: await upsertJsonTemplate(env, pageId, body.template) });
  } catch (error) {
    return json({ error: error.message || "Could not save JSON template" }, 400);
  }
}

export async function onRequestDelete({ request, env }) {
  const auth = await authorizeJsonTemplateRequest(request, env);
  if (!auth.ok) return auth.response;
  if (!env.DB) return json({ error: "D1 binding DB is not configured" }, 501);

  const url = new URL(request.url);
  const pageId = String(url.searchParams.get("pageId") || "").trim();
  const id = String(url.searchParams.get("id") || "").trim();
  if (!pageId || !id) return json({ error: "pageId and id are required" }, 400);

  try {
    return json({ ok: await deleteJsonTemplate(env, pageId, id) });
  } catch (error) {
    return json({ error: error.message || "Could not delete JSON template" }, 500);
  }
}

async function authorizeJsonTemplateRequest(request, env) {
  const authorization = request.headers.get("authorization") || "";
  if (env.MESSENLEAD_OPERATOR_TOKEN && authorization === `Bearer ${env.MESSENLEAD_OPERATOR_TOKEN}`) {
    return { ok: true };
  }

  const session = await getSession(request, env);
  if (session?.accessToken) return { ok: true };

  return {
    ok: false,
    response: json({ error: "Login required to manage JSON templates" }, 401)
  };
}
