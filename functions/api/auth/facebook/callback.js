import {
  clearStateHeader,
  createSessionHeader,
  exchangeCodeForToken,
  getExpectedState,
  getMetaConfig,
  getUserProfile,
  redirect,
  requireMetaConfig
} from "../../../_lib/meta.js";

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error_description") || url.searchParams.get("error");

  if (error) {
    return redirect(`/#pages?error=${encodeURIComponent(error)}`, { "Set-Cookie": clearStateHeader() });
  }

  if (!code || !state || state !== getExpectedState(request)) {
    return redirect("/#pages?error=oauth_state", { "Set-Cookie": clearStateHeader() });
  }

  const config = getMetaConfig(request, env);
  const missing = requireMetaConfig(config);
  if (missing) return missing;

  try {
    const token = await exchangeCodeForToken(config, code);
    const profile = await getUserProfile(token.access_token, config);
    const sessionCookie = await createSessionHeader(request, config, {
      accessToken: token.access_token,
      user: {
        id: profile.id,
        name: profile.name,
        picture: profile.picture?.data?.url || ""
      },
      expiresAt: Date.now() + 60 * 24 * 60 * 60 * 1000
    });

    return redirect("/#pages", {
      "Set-Cookie": [clearStateHeader(), sessionCookie]
    });
  } catch (exchangeError) {
    return redirect(`/#pages?error=${encodeURIComponent(exchangeError.message)}`, {
      "Set-Cookie": clearStateHeader()
    });
  }
}
