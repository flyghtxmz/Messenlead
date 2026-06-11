import { getMetaConfig, getSession, json } from "../../_lib/meta.js";

export async function onRequestGet({ request, env }) {
  const auth = await authorizeConfigRequest(request, env);
  if (!auth.ok) return auth.response;

  const config = getMetaConfig(request, env);
  const appSecret = config.appSecret || "";
  const sendRelayUrls = env.MESSENLEAD_SEND_RELAY_URLS || env.MESSENLEAD_SEND_RELAY_URL || null;
  const delayWorkflowUrl = env.MESSENLEAD_DELAY_WORKFLOW_URL || env.MESSENLEAD_FLOW_DELAY_WORKFLOW_URL || null;

  return json({
    auth: { mode: auth.mode },
    metaAppId: config.appId || null,
    metaRedirectUri: config.redirectUri || null,
    metaScopes: config.scopes || null,
    hasMetaAppSecret: Boolean(appSecret),
    metaAppSecretLength: appSecret.length,
    metaAppSecretLast4: appSecret ? appSecret.slice(-4) : null,
    hasSessionSecret: Boolean(config.sessionSecret),
    hasD1: Boolean(env.DB),
    sendRelayUrls,
    sendRelayUrlsSource: env.MESSENLEAD_SEND_RELAY_URLS ? "MESSENLEAD_SEND_RELAY_URLS" : env.MESSENLEAD_SEND_RELAY_URL ? "MESSENLEAD_SEND_RELAY_URL" : null,
    sendRelayUrlsRaw: {
      MESSENLEAD_SEND_RELAY_URLS: env.MESSENLEAD_SEND_RELAY_URLS || null,
      MESSENLEAD_SEND_RELAY_URL: env.MESSENLEAD_SEND_RELAY_URL || null
    },
    hasSendRelaySecret: Boolean(env.MESSENLEAD_SEND_RELAY_SECRET),
    delayWorkflowUrl,
    delayWorkflowUrlSource: env.MESSENLEAD_DELAY_WORKFLOW_URL ? "MESSENLEAD_DELAY_WORKFLOW_URL" : env.MESSENLEAD_FLOW_DELAY_WORKFLOW_URL ? "MESSENLEAD_FLOW_DELAY_WORKFLOW_URL" : null,
    delayWorkflowUrlRaw: {
      MESSENLEAD_DELAY_WORKFLOW_URL: env.MESSENLEAD_DELAY_WORKFLOW_URL || null,
      MESSENLEAD_FLOW_DELAY_WORKFLOW_URL: env.MESSENLEAD_FLOW_DELAY_WORKFLOW_URL || null
    },
    hasDelayWorkflowSecret: Boolean(
      env.MESSENLEAD_DELAY_WORKFLOW_SECRET ||
        env.MESSENLEAD_FLOW_DELAY_WORKFLOW_SECRET ||
        env.MESSENLEAD_SEND_RELAY_SECRET
    ),
    sendRelayFailover: env.MESSENLEAD_SEND_RELAY_FAILOVER || null,
    relayLocalFallback: env.MESSENLEAD_RELAY_LOCAL_FALLBACK || null
  });
}

async function authorizeConfigRequest(request, env) {
  const authorization = request.headers.get("authorization") || "";
  if (env.MESSENLEAD_OPERATOR_TOKEN && authorization === `Bearer ${env.MESSENLEAD_OPERATOR_TOKEN}`) {
    return { ok: true, mode: "operator_token" };
  }

  const session = await getSession(request, env);
  if (session?.accessToken) return { ok: true, mode: "session" };

  return {
    ok: false,
    response: json({ error: "Login required to inspect config" }, 401)
  };
}
