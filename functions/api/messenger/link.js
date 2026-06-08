import { recordTrackedFlowLinkClick } from "../../_lib/flowMetrics.js";
import { addPixelEvent, readMessengerLinkToken } from "../../_lib/pixel.js";
import { processMessengerLinkClickWait, processMessengerUrlButtonClick } from "./webhook.js";

export async function onRequestGet({ request, env }) {
  const requestUrl = new URL(request.url);
  const token = requestUrl.searchParams.get("t") || requestUrl.searchParams.get("token") || "";
  const tracking = await readMessengerLinkToken(env, token);

  if (!tracking?.url) {
    return new Response("Link invalido.", {
      status: 400,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store"
      }
    });
  }

  if (env.DB) {
    const event = await addPixelEvent(env, messengerLinkEvent(tracking, request), request).catch(() => null);
    if (event) {
      await recordTrackedFlowLinkClick(env, event).catch(() => null);
      await processMessengerUrlButtonClick(env, tracking, event).catch(() => null);
      await processMessengerLinkClickWait(env, event).catch(() => null);
    }
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: tracking.url,
      "Cache-Control": "no-store",
      "Referrer-Policy": "no-referrer"
    }
  });
}

function messengerLinkEvent(tracking = {}, request = null) {
  const destination = safeUrl(tracking.url);
  return {
    pageId: tracking.pageId,
    siteId: destination?.hostname || "messenger",
    visitorId: tracking.linkId || "messenger_redirect",
    sessionId: tracking.linkId || "",
    contactToken: tracking.contactToken,
    contactPageId: tracking.pageId,
    eventType: "page_view",
    eventName: "messenger_button_click",
    url: tracking.url,
    path: destination?.pathname || "",
    title: tracking.nodeTitle || "",
    referrer: "messenger",
    targetUrl: tracking.url,
    targetText: tracking.button,
    targetId: tracking.buttonId,
    utmSource: destination?.searchParams.get("utm_source") || "",
    utmMedium: destination?.searchParams.get("utm_medium") || "",
    utmCampaign: destination?.searchParams.get("utm_campaign") || "",
    utmTerm: destination?.searchParams.get("utm_term") || "",
    utmContent: destination?.searchParams.get("utm_content") || "",
    userAgent: request?.headers?.get("user-agent") || "",
    data: {
      contactSource: tracking.source || "messenger",
      contactButton: tracking.button,
      contactButtonId: tracking.buttonId,
      contactFlowId: tracking.flowId,
      contactNodeId: tracking.nodeId,
      contactNodeNumber: tracking.nodeNumber,
      contactNodeTitle: tracking.nodeTitle,
      contactLinkId: tracking.linkId
    }
  };
}

function safeUrl(value) {
  try {
    return new URL(String(value || ""));
  } catch {
    return null;
  }
}
