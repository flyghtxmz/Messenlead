import { safeAddFlowLog } from "../../_lib/flowLogs.js";
import { resetFlowRuntimeState } from "../../_lib/flowContinuations.js";
import { resetExternalRelayQueues, resetMessengerSendQueue } from "../../_lib/messengerDelivery.js";
import { getSession, json } from "../../_lib/meta.js";

export async function onRequestPost({ request, env }) {
  const auth = await authorizeRuntimeReset(request, env);
  if (!auth.ok) return auth.response;

  if (!env.DB) {
    return json({ error: "D1 binding DB is not configured" }, 501);
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const pageIds = normalizePageIds(body.pageIds || body.pageId);
  const scope = pageIds.length ? "selected_pages" : "all_pages";

  try {
    const runtime = await resetFlowRuntimeState(env, { pageIds });
    const queue = await resetMessengerSendQueue(env, { pageIds });
    const relays = await resetExternalRelayQueues(env, { pageIds });
    const result = {
      ok: true,
      scope,
      pageIds,
      reset: {
        continuations: runtime.continuations || 0,
        responseWaits: runtime.responseWaits || 0,
        queuedMessages: queue.queued || 0,
        relayQueuedMessages: relays.reduce((sum, relay) => sum + Number(relay.reset?.queued || 0), 0)
      },
      relays
    };

    await safeAddFlowLog(env, {
      pageId: pageIds.length === 1 ? pageIds[0] : "__all__",
      level: "warn",
      event: "flow_runtime_reset",
      message: "Execucoes em andamento foram reiniciadas pelo dashboard.",
      data: result
    });

    return json(result);
  } catch (error) {
    return json({ error: error.message || "Could not reset flow runtime" }, 500);
  }
}

async function authorizeRuntimeReset(request, env) {
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
    response: json({ error: "Login required to reset flow runtime" }, 401)
  };
}

function normalizePageIds(value) {
  const raw = Array.isArray(value) ? value : String(value || "").split(",");
  return raw
    .map((item) => String(item || "").trim())
    .filter((item) => item && !["__all__", "*", "all"].includes(item));
}
