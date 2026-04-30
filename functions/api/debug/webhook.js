import { safeAddFlowLog } from "../../_lib/flowLogs.js";
import { getMetaConfig, getSession, graphFetch, graphUrl, json, subscribePageToMessengerWebhooks } from "../../_lib/meta.js";
import { getStoredPageAccessToken } from "../../_lib/pages.js";

export async function onRequestGet({ request, env }) {
  const auth = await authorizeDebugRequest(request, env);
  if (!auth.ok) return auth.response;

  const url = new URL(request.url);
  const pageId = url.searchParams.get("pageId");
  if (!pageId) return json({ error: "pageId is required" }, 400);

  return webhookSubscriptionStatus(request, env, pageId);
}

export async function onRequestPost({ request, env }) {
  const auth = await authorizeDebugRequest(request, env);
  if (!auth.ok) return auth.response;

  let body = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const pageId = body.pageId || new URL(request.url).searchParams.get("pageId");
  if (!pageId) return json({ error: "pageId is required" }, 400);

  const config = getMetaConfig(request, env);
  const pageAccessToken = await getStoredPageAccessToken(env, pageId);
  if (!pageAccessToken) {
    return json({ pageId, hasPageAccessToken: false, error: "No stored Page access token for this Page" }, 403);
  }

  const subscription = await subscribePageToMessengerWebhooks({ id: pageId, access_token: pageAccessToken }, config);
  await safeAddFlowLog(env, {
    pageId,
    level: subscription.ok ? "info" : "error",
    event: "manual_webhook_subscription",
    message: subscription.ok ? "Página inscrita nos webhooks do Messenger pelo dashboard." : "Falha ao inscrever Página nos webhooks do Messenger.",
    data: subscription
  });

  const status = await readWebhookSubscriptionStatus(env, config, pageId, pageAccessToken);
  return json({
    pageId,
    hasPageAccessToken: true,
    subscription,
    ...status
  }, subscription.ok ? 200 : 500);
}

async function webhookSubscriptionStatus(request, env, pageId) {
  const config = getMetaConfig(request, env);
  const pageAccessToken = await getStoredPageAccessToken(env, pageId);
  if (!pageAccessToken) {
    return json({ pageId, appId: config.appId || "", hasPageAccessToken: false, subscriptions: [] });
  }

  const status = await readWebhookSubscriptionStatus(env, config, pageId, pageAccessToken);
  return json({
    pageId,
    appId: config.appId || "",
    hasPageAccessToken: true,
    ...status
  });
}

async function readWebhookSubscriptionStatus(env, config, pageId, pageAccessToken) {
  try {
    const result = await graphFetch(
      graphUrl(config, `/${pageId}/subscribed_apps`, {
        fields: "id,name,subscribed_fields",
        access_token: pageAccessToken
      })
    );
    const subscriptions = result.data || [];
    const currentApp = subscriptions.find((app) => String(app.id) === String(config.appId)) || null;
    return {
      ok: true,
      isCurrentAppSubscribed: Boolean(currentApp),
      currentApp,
      subscriptions
    };
  } catch (error) {
    await safeAddFlowLog(env, {
      pageId,
      level: "error",
      event: "webhook_subscription_check_failed",
      message: "Falha ao consultar inscrições de webhook da Página.",
      data: {
        status: error.status || 500,
        error: error.message,
        details: error.payload || null
      }
    });
    return {
      ok: false,
      isCurrentAppSubscribed: false,
      currentApp: null,
      subscriptions: [],
      error: error.message,
      details: error.payload || null
    };
  }
}

async function authorizeDebugRequest(request, env) {
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
    response: json({ error: "Login required to inspect webhook status" }, 401)
  };
}
