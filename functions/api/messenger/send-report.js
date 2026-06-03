import { updateOutboundMessageSent } from "../../_lib/messengerDelivery.js";
import { json } from "../../_lib/meta.js";

export async function onRequestPost({ request, env }) {
  const expectedToken = env.MESSENLEAD_OPERATOR_TOKEN || "";
  const authorization = request.headers.get("authorization") || "";
  if (!expectedToken || authorization !== `Bearer ${expectedToken}`) {
    return json({ error: "Unauthorized" }, 401);
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const id = String(body.relayQueueId || body.queueId || body.sourceQueueId || "").trim();
  if (!id) return json({ error: "queueId is required" }, 400);

  const result = await updateOutboundMessageSent(env, {
    id,
    response: body.responseBody || JSON.stringify(body.responseJson || {}),
    sentAt: body.sentAt || new Date().toISOString()
  });

  return json({ ok: true, result });
}
