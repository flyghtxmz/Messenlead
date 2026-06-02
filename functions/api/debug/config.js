import { getMetaConfig, json } from "../../_lib/meta.js";

export function onRequestGet({ request, env }) {
  const config = getMetaConfig(request, env);
  const appSecret = config.appSecret || "";

  return json({
    metaAppId: config.appId || null,
    metaRedirectUri: config.redirectUri || null,
    metaScopes: config.scopes || null,
    hasMetaAppSecret: Boolean(appSecret),
    metaAppSecretLength: appSecret.length,
    metaAppSecretLast4: appSecret ? appSecret.slice(-4) : null,
    hasSessionSecret: Boolean(config.sessionSecret),
    hasD1: Boolean(env.DB),
    sendRelayUrls: env.MESSENLEAD_SEND_RELAY_URLS || env.MESSENLEAD_SEND_RELAY_URL || null,
    hasSendRelaySecret: Boolean(env.MESSENLEAD_SEND_RELAY_SECRET),
    delayWorkflowUrl: env.MESSENLEAD_DELAY_WORKFLOW_URL || env.MESSENLEAD_FLOW_DELAY_WORKFLOW_URL || null,
    hasDelayWorkflowSecret: Boolean(
      env.MESSENLEAD_DELAY_WORKFLOW_SECRET ||
        env.MESSENLEAD_FLOW_DELAY_WORKFLOW_SECRET ||
        env.MESSENLEAD_SEND_RELAY_SECRET
    ),
    sendRelayFailover: env.MESSENLEAD_SEND_RELAY_FAILOVER || null,
    relayLocalFallback: env.MESSENLEAD_RELAY_LOCAL_FALLBACK || null
  });
}
