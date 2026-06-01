import { listMessengerAttributions } from "../_lib/messengerAttribution.js";
import { getPageAccessToken, json } from "../_lib/meta.js";

export async function onRequestGet({ request, env }) {
  if (!env.DB) return json({ error: "D1 binding DB is not configured", events: [] }, 501);

  const url = new URL(request.url);
  const pageId = String(url.searchParams.get("pageId") || "").trim();
  const psid = String(url.searchParams.get("psid") || "").trim();
  const limit = Number(url.searchParams.get("limit") || 80);
  if (!pageId) return json({ error: "pageId is required", events: [] }, 400);

  const pageAccessToken = await getPageAccessToken(request, env, pageId);
  if (!pageAccessToken) {
    return json({ error: "Login required to view Messenger attribution events for this Page" }, 401);
  }

  return json({
    pageId,
    events: await listMessengerAttributions(env, pageId, { psid, limit })
  });
}
