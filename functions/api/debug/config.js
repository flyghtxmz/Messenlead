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
    hasD1: Boolean(env.DB)
  });
}
