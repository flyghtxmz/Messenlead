import { getMetaConfig, getPageAccessToken, graphFetch, json } from "../../_lib/meta.js";

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

  const pageAccessToken = await getPageAccessToken(request, env, pageId);
  if (!pageAccessToken) {
    return json({ error: "No page access token for this Page" }, 403);
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
