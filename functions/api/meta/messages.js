import { getMetaConfig, getPageAccessToken, graphFetch, graphUrl, json } from "../../_lib/meta.js";

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const pageId = url.searchParams.get("pageId");
  const conversationId = url.searchParams.get("conversationId");

  if (!pageId || !conversationId) {
    return json({ error: "pageId and conversationId are required" }, 400);
  }

  const pageAccessToken = await getPageAccessToken(request, env, pageId);
  if (!pageAccessToken) {
    return json({ error: "No page access token for this Page" }, 403);
  }

  try {
    const config = getMetaConfig(request, env);
    const limit = url.searchParams.get("limit") || "50";
    let result;

    try {
      result = await graphFetch(
        graphUrl(config, `/${conversationId}/messages`, {
          fields: "id,message,from,to,created_time,attachments",
          limit,
          access_token: pageAccessToken
        })
      );
    } catch (error) {
      if (!isAttachmentFieldError(error)) throw error;
      result = await graphFetch(
        graphUrl(config, `/${conversationId}/messages`, {
          fields: "id,message,from,to,created_time",
          limit,
          access_token: pageAccessToken
        })
      );
    }

    return json({ messages: result.data || [] });
  } catch (error) {
    return json({ error: error.message, details: error.payload || null }, error.status || 500);
  }
}

function isAttachmentFieldError(error) {
  const message = `${error.message || ""} ${error.payload?.error?.message || ""}`.toLowerCase();
  return message.includes("nonexisting field") || message.includes("attachments") || message.includes("file_url");
}
