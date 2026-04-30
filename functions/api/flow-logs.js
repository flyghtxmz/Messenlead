import { clearFlowLogs, listFlowLogs } from "../_lib/flowLogs.js";
import { getSession, json } from "../_lib/meta.js";

export async function onRequestGet({ request, env }) {
  const auth = await authorizeLogRequest(request, env);
  if (!auth.ok) return auth.response;

  if (!env.DB) {
    return json({ error: "D1 binding DB is not configured", logs: [] }, 501);
  }

  const url = new URL(request.url);
  const pageId = url.searchParams.get("pageId");
  const limit = url.searchParams.get("limit");

  try {
    return json({ pageId, logs: await listFlowLogs(env, pageId, { limit }) });
  } catch (error) {
    return json({ error: error.message }, 500);
  }
}

export async function onRequestDelete({ request, env }) {
  const auth = await authorizeLogRequest(request, env);
  if (!auth.ok) return auth.response;

  if (!env.DB) {
    return json({ error: "D1 binding DB is not configured" }, 501);
  }

  const url = new URL(request.url);
  const pageId = url.searchParams.get("pageId");

  try {
    await clearFlowLogs(env, pageId);
    return json({ ok: true, pageId });
  } catch (error) {
    return json({ error: error.message }, 500);
  }
}

async function authorizeLogRequest(request, env) {
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
    response: json({ error: "Login required to read flow logs" }, 401)
  };
}
