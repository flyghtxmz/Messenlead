import { getMetaConfig, getPageAccessToken, getSession, graphFetch, graphUrl, json } from "../../_lib/meta.js";
import { getStoredPageAccessToken } from "../../_lib/pages.js";

export async function onRequestGet({ request, env }) {
  const auth = await authorizeMessengerProfileRequest(request, env);
  if (!auth.ok) return auth.response;

  const url = new URL(request.url);
  const pageId = String(url.searchParams.get("pageId") || "").trim();
  if (!pageId) return json({ error: "pageId is required" }, 400);

  const pageAccessToken = await resolvePageAccessToken(request, env, pageId);
  if (!pageAccessToken) return json({ error: "No page access token for this Page" }, 403);

  try {
    const config = getMetaConfig(request, env);
    const result = await graphFetch(
      graphUrl(config, "/me/messenger_profile", {
        fields: "get_started,greeting,persistent_menu",
        access_token: pageAccessToken
      })
    );
    return json({ ok: true, pageId, profile: result.data?.[0] || result });
  } catch (error) {
    return json({ error: error.message, details: error.payload || null }, error.status || 500);
  }
}

export async function onRequestPost({ request, env }) {
  const auth = await authorizeMessengerProfileRequest(request, env);
  if (!auth.ok) return auth.response;

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const pageId = String(body.pageId || "").trim();
  const payload = String(body.payload || "GET_STARTED").trim() || "GET_STARTED";
  if (!pageId) return json({ error: "pageId is required" }, 400);

  const pageAccessToken = await resolvePageAccessToken(request, env, pageId);
  if (!pageAccessToken) return json({ error: "No page access token for this Page" }, 403);

  try {
    const config = getMetaConfig(request, env);
    const result = await graphFetch(
      graphUrl(config, "/me/messenger_profile", {
        access_token: pageAccessToken
      }),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          get_started: { payload }
        })
      }
    );
    return json({ ok: true, pageId, payload, result });
  } catch (error) {
    return json({ error: error.message, details: error.payload || null }, error.status || 500);
  }
}

async function authorizeMessengerProfileRequest(request, env) {
  const authorization = request.headers.get("authorization") || "";
  if (env.MESSENLEAD_OPERATOR_TOKEN && authorization === `Bearer ${env.MESSENLEAD_OPERATOR_TOKEN}`) {
    return { ok: true };
  }

  const session = await getSession(request, env);
  if (session?.accessToken) return { ok: true };

  return {
    ok: false,
    response: json({ error: "Login required to configure Messenger profile" }, 401)
  };
}

async function resolvePageAccessToken(request, env, pageId) {
  return (await getPageAccessToken(request, env, pageId)) || (await getStoredPageAccessToken(env, pageId));
}
