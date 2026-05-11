import { getMetaConfig, getPageAccessToken, graphFetch, json } from "../../_lib/meta.js";
import { isBlockedDefaultGreetingText, messengerPolicyStatus } from "../../_lib/messengerDelivery.js";

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const pageId = String(body.pageId || "").trim();
  const psid = String(body.psid || "").trim();
  const text = String(body.text || "").trim();

  if (!pageId || !psid || !text) {
    return json({ error: "pageId, psid and text are required" }, 400);
  }

  if (isBlockedDefaultGreetingText(text)) {
    return json({ error: "Default Meta greeting is blocked by Messenlead" }, 409);
  }

  const pageAccessToken = await getPageAccessToken(request, env, pageId);
  if (!pageAccessToken) {
    return json({ error: "No page access token for this Page" }, 403);
  }

  const policy = await messengerPolicyStatus(env, pageId, psid);
  const requestLastSeenPolicy = messengerRequestPolicy(body.lastSeen);
  if (!policy.allowed && !requestLastSeenPolicy.allowed && body.messaging_type !== "MESSAGE_TAG") {
    return json({
      error: "Outside Messenger 24h response window",
      policy,
      requestLastSeenPolicy
    }, 409);
  }

  try {
    const config = getMetaConfig(request, env);
    const graphUrl = env.MESSENGER_GRAPH_API_URL || `https://graph.facebook.com/${config.version}/me/messages`;
    const result = await graphFetch(`${graphUrl}?access_token=${encodeURIComponent(pageAccessToken)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient: { id: psid },
        messaging_type: body.messaging_type || "RESPONSE",
        message: { text }
      })
    });

    return json({ ok: true, result });
  } catch (error) {
    return json({ error: error.message, details: error.payload || null }, error.status || 500);
  }
}

function messengerRequestPolicy(value) {
  const timestamp = Date.parse(value || "");
  if (!Number.isFinite(timestamp)) return { allowed: false, reason: "missing_request_last_seen" };
  const allowed = Date.now() <= timestamp + 24 * 60 * 60 * 1000;
  return {
    allowed,
    reason: allowed ? "inside_24h_from_request" : "outside_24h_from_request",
    lastSeen: new Date(timestamp).toISOString(),
    expiresAt: new Date(timestamp + 24 * 60 * 60 * 1000).toISOString()
  };
}
