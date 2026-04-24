import { deleteFlow, listFlows, normalizePageId, upsertFlow } from "../_lib/flows.js";
import { getSession, json } from "../_lib/meta.js";

export async function onRequestGet({ request, env }) {
  const auth = await authorizeFlowRequest(request, env, false);
  if (!auth.ok) return auth.response;

  if (!env.DB) {
    return json({ error: "D1 binding DB is not configured", flows: [] }, 501);
  }

  const url = new URL(request.url);
  const pageId = normalizePageId(url.searchParams.get("pageId"));

  try {
    return json({ pageId, flows: await listFlows(env, pageId) });
  } catch (error) {
    return json({ error: error.message }, 500);
  }
}

export async function onRequestPost({ request, env }) {
  const auth = await authorizeFlowRequest(request, env, true);
  if (!auth.ok) return auth.response;

  if (!env.DB) {
    return json({ error: "D1 binding DB is not configured" }, 501);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const pageId = normalizePageId(body.pageId);

  try {
    if (Array.isArray(body.flows)) {
      const saved = [];
      for (const flow of body.flows) {
        saved.push(await upsertFlow(env, pageId, flow));
      }
      return json({ ok: true, pageId, flows: saved });
    }

    if (!body.flow) {
      return json({ error: "flow or flows is required" }, 400);
    }

    return json({ ok: true, pageId, flow: await upsertFlow(env, pageId, body.flow) });
  } catch (error) {
    return json({ error: error.message }, 500);
  }
}

export async function onRequestDelete({ request, env }) {
  const auth = await authorizeFlowRequest(request, env, true);
  if (!auth.ok) return auth.response;

  if (!env.DB) {
    return json({ error: "D1 binding DB is not configured" }, 501);
  }

  const url = new URL(request.url);
  const pageId = normalizePageId(url.searchParams.get("pageId"));
  const flowId = url.searchParams.get("flowId");

  if (!flowId) {
    return json({ error: "flowId is required" }, 400);
  }

  try {
    await deleteFlow(env, pageId, flowId);
    return json({ ok: true });
  } catch (error) {
    return json({ error: error.message }, 500);
  }
}

async function authorizeFlowRequest(request, env, write) {
  if (env.FLOWS_ALLOW_PUBLIC_WRITE === "true") {
    return { ok: true };
  }

  const authorization = request.headers.get("authorization") || "";
  if (env.MESSENLEAD_OPERATOR_TOKEN && authorization === `Bearer ${env.MESSENLEAD_OPERATOR_TOKEN}`) {
    return { ok: true };
  }

  const session = await getSession(request, env);
  if (session?.accessToken) {
    return { ok: true };
  }

  return {
    ok: false,
    response: json({ error: write ? "Login required to save flows" : "Login required to read flows" }, 401)
  };
}
