import { listFlowMetrics } from "../_lib/flowMetrics.js";
import { getSession, json } from "../_lib/meta.js";

export async function onRequestGet({ request, env }) {
  const auth = await authorizeMetricRequest(request, env);
  if (!auth.ok) return auth.response;

  if (!env.DB) {
    return json({ error: "D1 binding DB is not configured" }, 501);
  }

  const url = new URL(request.url);
  const pageId = url.searchParams.get("pageId");
  const flowId = url.searchParams.get("flowId");
  if (!flowId) return json({ error: "flowId is required" }, 400);

  try {
    return json({ metrics: await listFlowMetrics(env, pageId, flowId) });
  } catch (error) {
    return json({ error: error.message }, 500);
  }
}

async function authorizeMetricRequest(request, env) {
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
    response: json({ error: "Login required to read flow metrics" }, 401)
  };
}
