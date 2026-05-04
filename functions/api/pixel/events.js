import { listPixelEvents, normalizePixelPageId, pixelSummary } from "../../_lib/pixel.js";
import { getPageAccessToken, json } from "../../_lib/meta.js";

export async function onRequestGet({ request, env }) {
  if (!env.DB) return json({ error: "D1 binding DB is not configured", events: [], summary: null }, 501);

  const url = new URL(request.url);
  const pageId = normalizePixelPageId(url.searchParams.get("pageId"));
  const days = Number(url.searchParams.get("days") || 7);
  const limit = Number(url.searchParams.get("limit") || 80);

  const authError = await requirePageAccess(request, env, pageId);
  if (authError) return authError;

  return json({
    pageId,
    summary: await pixelSummary(env, pageId, { days }),
    events: await listPixelEvents(env, pageId, { days, limit })
  });
}

async function requirePageAccess(request, env, pageId) {
  if (String(pageId || "") === "__global__") return null;

  const pageAccessToken = await getPageAccessToken(request, env, pageId);
  if (!pageAccessToken) {
    return json({ error: "Login required to view pixel events for this Page" }, 401);
  }

  return null;
}
