import { listMessengerAttributions, listMessengerAttributionSources } from "../_lib/messengerAttribution.js";
import { getPageAccessToken, getSession, json } from "../_lib/meta.js";

export async function onRequestGet({ request, env }) {
  if (!env.DB) return json({ error: "D1 binding DB is not configured", events: [] }, 501);

  const url = new URL(request.url);
  const pageId = String(url.searchParams.get("pageId") || "").trim();
  const psid = String(url.searchParams.get("psid") || "").trim();
  const limit = Number(url.searchParams.get("limit") || 80);
  const view = String(url.searchParams.get("view") || "").trim();

  if (view === "sources") {
    const session = await getSession(request, env);
    if (!session?.accessToken || !session.user?.id) {
      return json({ error: "Login required to view Messenger attribution sources" }, 401);
    }

    return json({
      sources: await listMessengerAttributionSources(env, {
        userId: session.user.id,
        pageId,
        query: url.searchParams.get("q"),
        limit
      })
    });
  }

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
