import { getMetaConfig, getPageAccessToken, graphFetch, graphUrl, json } from "../../_lib/meta.js";

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const pageId = url.searchParams.get("pageId");

  if (!pageId) {
    return json({ error: "pageId is required" }, 400);
  }

  const pageAccessToken = await getPageAccessToken(request, env, pageId);
  if (!pageAccessToken) {
    return json({ error: "No page access token for this Page" }, 403);
  }

  try {
    const config = getMetaConfig(request, env);
    const graph = graphUrl(config, `/${pageId}/conversations`, {
      fields: "id,updated_time,participants,senders,snippet,message_count,unread_count",
      limit: url.searchParams.get("limit") || "25",
      access_token: pageAccessToken
    });
    const result = await graphFetch(graph);
    return json({ conversations: result.data || [] });
  } catch (error) {
    return json({ error: error.message, details: error.payload || null }, error.status || 500);
  }
}
