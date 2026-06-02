import { addPixelEvent } from "../../_lib/pixel.js";
import { recordTrackedFlowLinkClick } from "../../_lib/flowMetrics.js";
import { processMessengerLinkClickWait } from "../messenger/webhook.js";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400"
};

export function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function onRequestPost({ request, env }) {
  if (!env.DB) return pixelJson({ error: "D1 binding DB is not configured" }, 501);

  let body;
  try {
    body = await request.json();
  } catch {
    return pixelJson({ error: "Invalid JSON" }, 400);
  }

  try {
    const event = await addPixelEvent(env, body || {}, request);
    await recordTrackedFlowLinkClick(env, event).catch(() => null);
    await processMessengerLinkClickWait(env, event).catch(() => null);
    return pixelJson({ ok: true, id: event?.id || "" });
  } catch (error) {
    return pixelJson({ error: error.message || "Could not collect event" }, 400);
  }
}

export async function onRequestGet({ request, env }) {
  if (!env.DB) return transparentGif();

  const url = new URL(request.url);
  const event = {
    pageId: url.searchParams.get("pageId"),
    siteId: url.searchParams.get("siteId"),
    visitorId: url.searchParams.get("visitorId"),
    sessionId: url.searchParams.get("sessionId"),
    contactToken: url.searchParams.get("contactToken") || url.searchParams.get("ml_contact"),
    contactPsid: url.searchParams.get("contactPsid") || url.searchParams.get("ml_psid") || url.searchParams.get("psid"),
    contactPageId: url.searchParams.get("contactPageId") || url.searchParams.get("ml_page_id"),
    eventType: url.searchParams.get("eventType") || url.searchParams.get("type") || "page_view",
    eventName: url.searchParams.get("eventName") || url.searchParams.get("name"),
    url: url.searchParams.get("url"),
    path: url.searchParams.get("path"),
    title: url.searchParams.get("title"),
    referrer: url.searchParams.get("referrer"),
    targetUrl: url.searchParams.get("targetUrl"),
    targetText: url.searchParams.get("targetText"),
    targetId: url.searchParams.get("targetId"),
    targetClasses: url.searchParams.get("targetClasses"),
    utmSource: url.searchParams.get("utm_source"),
    utmMedium: url.searchParams.get("utm_medium"),
    utmCampaign: url.searchParams.get("utm_campaign"),
    utmTerm: url.searchParams.get("utm_term"),
    utmContent: url.searchParams.get("utm_content"),
    data: {
      contactSource: url.searchParams.get("contactSource"),
      contactButton: url.searchParams.get("contactButton"),
      contactButtonId: url.searchParams.get("contactButtonId"),
      contactFlowId: url.searchParams.get("contactFlowId"),
      contactNodeId: url.searchParams.get("contactNodeId"),
      contactNodeNumber: url.searchParams.get("contactNodeNumber"),
      contactNodeTitle: url.searchParams.get("contactNodeTitle"),
      contactLinkId: url.searchParams.get("contactLinkId"),
      contactPageViews: url.searchParams.get("contactPageViews")
    }
  };

  const savedEvent = await addPixelEvent(env, event, request).catch(() => null);
  if (savedEvent) {
    await recordTrackedFlowLinkClick(env, savedEvent).catch(() => null);
    await processMessengerLinkClickWait(env, savedEvent).catch(() => null);
  }
  return url.searchParams.get("format") === "json" ? pixelJson({ ok: true }) : transparentGif();
}

function pixelJson(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

function transparentGif() {
  const bytes = Uint8Array.from([
    71, 73, 70, 56, 57, 97, 1, 0, 1, 0, 128, 0, 0, 0, 0, 0, 255, 255,
    255, 33, 249, 4, 1, 0, 0, 0, 0, 44, 0, 0, 0, 0, 1, 0, 1, 0, 0, 2,
    2, 68, 1, 0, 59
  ]);
  return new Response(bytes, {
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "image/gif",
      "Cache-Control": "no-store"
    }
  });
}
