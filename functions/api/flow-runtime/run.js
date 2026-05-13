import { getSession, json } from "../../_lib/meta.js";
import { getContact, upsertContact } from "../../_lib/contacts.js";
import { listFlows } from "../../_lib/flows.js";
import { safeAddFlowLog } from "../../_lib/flowLogs.js";
import { messengerPolicyStatus } from "../../_lib/messengerDelivery.js";
import { handleMessengerEvent } from "../messenger/webhook.js";

export async function onRequestPost({ request, env }) {
  const auth = await authorizeRunRequest(request, env);
  if (!auth.ok) return auth.response;

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const pageId = String(body.pageId || "").trim();
  const psid = String(body.psid || "").trim();
  const flowId = String(body.flowId || "").trim();
  const contactName = String(body.contactName || "").trim();
  const requestedLastSeen = normalizeIsoDate(body.lastSeen);

  if (!pageId || !psid || !flowId) {
    return json({ error: "pageId, psid and flowId are required" }, 400);
  }

  const flows = await listFlows(env, pageId, { status: "active" });
  const flow = flows.find((item) => item.id === flowId);
  if (!flow) {
    return json({ error: "Selected flow is not active for this Page" }, 404);
  }

  const existing = await getContact(env, pageId, psid);
  const existingLastSeen = normalizeIsoDate(existing?.lastSeen);
  const effectiveLastSeen = existingLastSeen || requestedLastSeen;
  if (effectiveLastSeen) {
    await upsertContact(env, pageId, {
      psid,
      name: contactName || existing?.name || "",
      status: "open",
      source: "Disparo manual de fluxo",
      lastSeen: effectiveLastSeen
    });
  }

  const policy = await messengerPolicyStatus(env, pageId, psid);
  if (!policy.allowed) {
    await safeAddFlowLog(env, {
      pageId,
      psid,
      flowId: flow.id,
      flowName: flow.name || "",
      level: "warn",
      event: "manual_flow_policy_blocked",
      message: "Disparo manual bloqueado: contato fora da janela de 24h do Messenger.",
      data: { policy, requestedLastSeen },
      force: true
    });
    return json({
      error: "Outside Messenger 24h response window",
      policy
    }, 409);
  }

  const timestamp = Date.now();
  const event = {
    sender: { id: psid },
    recipient: { id: pageId },
    timestamp,
    postback: {
      mid: `mid.manual_flow.${flowId}.${timestamp}`,
      title: `Disparo manual: ${flow.name || flowId}`,
      payload: `MESSENLEAD_MANUAL_FLOW:${flowId}`
    }
  };

  await safeAddFlowLog(env, {
    pageId,
    psid,
    flowId: flow.id,
    flowName: flow.name || "",
    level: "info",
    event: "manual_flow_requested",
    message: "Fluxo selecionado manualmente no dashboard.",
    data: {
      flowId,
      conversationId: String(body.conversationId || "").trim(),
      policy
    },
    force: true
  });

  await handleMessengerEvent(event, env, pageId, {
    channel: "manual",
    manualFlowId: flowId,
    forceLogs: true,
    lastSeen: policy.lastSeen || effectiveLastSeen || requestedLastSeen || "",
    policyExpiresAt: policy.expiresAt || ""
  });

  return json({
    ok: true,
    pageId,
    psid,
    flowId,
    flowName: flow.name || "",
    policy,
    message: "Fluxo disparado para esta conversa."
  });
}

async function authorizeRunRequest(request, env) {
  const authorization = request.headers.get("authorization") || "";
  if (env.MESSENLEAD_OPERATOR_TOKEN && authorization === `Bearer ${env.MESSENLEAD_OPERATOR_TOKEN}`) {
    return { ok: true };
  }

  const session = await getSession(request, env);
  if (session?.accessToken) return { ok: true };

  return {
    ok: false,
    response: json({ error: "Login required to run flow runtime" }, 401)
  };
}

function normalizeIsoDate(value) {
  const time = Date.parse(value || "");
  return Number.isFinite(time) ? new Date(time).toISOString() : "";
}
