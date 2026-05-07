import { safeAddFlowLog } from "../../_lib/flowLogs.js";
import { debugAccessToken, getAppWebhookSubscriptions, getMetaConfig, getSession, graphFetch, graphUrl, json, subscribeAppToPageWebhooks, subscribePageToMessengerWebhooks } from "../../_lib/meta.js";
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

  const appSubscription = await subscribeAppToPageWebhooks(
    config,
    new URL("/api/messenger/webhook", request.url).toString(),
    env.MESSENGER_VERIFY_TOKEN
  );
  await safeAddFlowLog(env, {
    pageId,
    level: appSubscription.ok ? "info" : "error",
    event: "manual_app_webhook_subscription",
    message: appSubscription.ok ? "App inscrito no objeto page para receber webhooks." : "Falha ao inscrever app no objeto page.",
    data: appSubscription
  });

  const subscription = await subscribePageToMessengerWebhooks({ id: pageId, access_token: pageAccessToken }, config);
  await safeAddFlowLog(env, {
    pageId,
    level: subscription.ok ? "info" : "error",
    event: "manual_webhook_subscription",
    message: subscription.ok ? "Página inscrita nos webhooks do Messenger pelo dashboard." : "Falha ao inscrever Página nos webhooks do Messenger.",
    data: subscription
  });

  const appStatus = await readAppWebhookSubscriptionStatus(env, config, pageId);
  const status = await readWebhookSubscriptionStatus(env, config, pageId, pageAccessToken);
  const tokenAudit = await auditPageToken(env, config, pageId, pageAccessToken);
  return json({
    pageId,
    hasPageAccessToken: true,
    tokenAudit,
    appSubscription,
    ...appStatus,
    subscription,
    ...status
  }, subscription.ok && appSubscription.ok ? 200 : 500);
}

async function webhookSubscriptionStatus(request, env, pageId) {
  const config = getMetaConfig(request, env);
  const pageAccessToken = await getStoredPageAccessToken(env, pageId);
  const appStatus = await readAppWebhookSubscriptionStatus(env, config, pageId);
  if (!pageAccessToken) {
    return json({ pageId, appId: config.appId || "", hasPageAccessToken: false, subscriptions: [], ...appStatus });
  }

  const status = await readWebhookSubscriptionStatus(env, config, pageId, pageAccessToken);
  const tokenAudit = await auditPageToken(env, config, pageId, pageAccessToken);
  return json({
    pageId,
    appId: config.appId || "",
    hasPageAccessToken: true,
    tokenAudit,
    ...appStatus,
    ...status
  });
}

async function auditPageToken(env, config, pageId, pageAccessToken) {
  const audit = await debugAccessToken(config, pageAccessToken);
  if (!audit.ok || !audit.isValid) {
    await safeAddFlowLog(env, {
      pageId,
      level: "error",
      event: "page_token_invalid",
      message: "Token da Pagina parece invalido ou expirado.",
      data: audit
    });
  }
  return audit;
}

async function readAppWebhookSubscriptionStatus(env, config, pageId) {
  const status = await getAppWebhookSubscriptions(config);
  if (!status.ok) {
    await safeAddFlowLog(env, {
      pageId,
      level: "error",
      event: "app_webhook_subscription_check_failed",
      message: "Falha ao consultar subscription do app para objeto page.",
      data: status
    });
  }

  const fields = normalizeSubscriptionFields(status.pageSubscription);
  const callbackUrl = status.pageSubscription?.callback_url || "";
  return {
    appWebhook: {
      ok: status.ok,
      hasPageObjectSubscription: Boolean(status.pageSubscription),
      callbackUrl,
      fields,
      includesMessages: fields.includes("messages"),
      subscription: status.pageSubscription,
      error: status.error || "",
      details: status.details || null
    }
  };
}

function normalizeSubscriptionFields(subscription) {
  if (!subscription) return [];
  if (Array.isArray(subscription.fields)) {
    return subscription.fields.map((field) => typeof field === "string" ? field : field?.name).filter(Boolean);
  }
  return String(subscription.fields || "")
    .split(",")
    .map((field) => field.trim())
    .filter(Boolean);
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
