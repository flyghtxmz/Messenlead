import { facebookDialogUrl, getMetaConfig, randomState, requireMetaConfig, createStateHeader, redirect } from "../../../_lib/meta.js";

export function onRequestGet({ request, env }) {
  const config = getMetaConfig(request, env);
  const missing = requireMetaConfig(config);
  if (missing) return missing;

  const state = randomState();
  return redirect(facebookDialogUrl(config, state), {
    "Set-Cookie": createStateHeader(request, state)
  });
}
