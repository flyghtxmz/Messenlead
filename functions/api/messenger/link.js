import { recordTrackedFlowLinkClick } from "../../_lib/flowMetrics.js";
import { addPixelEvent, readMessengerLinkToken } from "../../_lib/pixel.js";
import { processMessengerLinkClickWait, processMessengerUrlButtonClick } from "./webhook.js";

export async function onRequestGet(context) {
  const { request, env } = context;
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
    const clickTask = processMessengerLinkClick(env, tracking, request);
    if (typeof context.waitUntil === "function") {
      context.waitUntil(clickTask);
    } else {
      clickTask.catch(() => null);
    }
  }

  return loadingRedirectResponse(tracking.url, request);
}

async function processMessengerLinkClick(env, tracking, request) {
  const event = await addPixelEvent(env, messengerLinkEvent(tracking, request), request).catch(() => null);
  if (!event) return null;
  await recordTrackedFlowLinkClick(env, event).catch(() => null);
  await processMessengerUrlButtonClick(env, tracking, event).catch(() => null);
  await processMessengerLinkClickWait(env, event).catch(() => null);
  return event;
}

function loadingRedirectResponse(destinationUrl, request = null) {
  const destination = String(destinationUrl || "");
  return new Response(redirectHtml(destination, redirectLocaleFromRequest(request)), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Referrer-Policy": "no-referrer",
      "X-Robots-Tag": "noindex"
    }
  });
}

function redirectHtml(destination, locale) {
  const destinationJson = JSON.stringify(destination);
  const destinationAttr = escapeHtml(destination);
  const htmlLang = escapeHtml(locale.htmlLang);
  const title = escapeHtml(locale.title);
  const label = escapeHtml(locale.label);
  return `<!doctype html>
<html lang="${htmlLang}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="refresh" content="1;url=${destinationAttr}" />
    <title>${title}</title>
    <style>
      html, body {
        width: 100%;
        height: 100%;
        margin: 0;
        background: #f8fafc;
        color: #1f2933;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      body {
        display: grid;
        place-items: center;
      }
      .loader {
        display: grid;
        justify-items: center;
        gap: 12px;
      }
      .spinner {
        width: 34px;
        height: 34px;
        border: 3px solid #d9e5ef;
        border-top-color: #0f8f64;
        border-radius: 50%;
        animation: spin .72s linear infinite;
      }
      .label {
        color: #607080;
        font-size: 13px;
        font-weight: 700;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    </style>
  </head>
  <body>
    <main class="loader" aria-live="polite">
      <span class="spinner" aria-hidden="true"></span>
      <span class="label">${label}</span>
    </main>
    <script>
      const destination = ${destinationJson};
      requestAnimationFrame(() => {
        window.location.replace(destination);
      });
    </script>
  </body>
</html>`;
}

const REDIRECT_TEXT_BY_LANGUAGE = {
  pt: { htmlLang: "pt-BR", title: "Redirecionando", label: "Redirecionando..." },
  es: { htmlLang: "es", title: "Redirigiendo", label: "Redirigiendo..." },
  en: { htmlLang: "en", title: "Redirecting", label: "Redirecting..." },
  fr: { htmlLang: "fr", title: "Redirection", label: "Redirection..." },
  de: { htmlLang: "de", title: "Weiterleitung", label: "Weiterleitung..." },
  it: { htmlLang: "it", title: "Reindirizzamento", label: "Reindirizzamento..." },
  nl: { htmlLang: "nl", title: "Doorsturen", label: "Doorsturen..." },
  id: { htmlLang: "id", title: "Mengalihkan", label: "Mengalihkan..." },
  tr: { htmlLang: "tr", title: "Yonlendiriliyor", label: "Yonlendiriliyor..." },
  pl: { htmlLang: "pl", title: "Przekierowywanie", label: "Przekierowywanie..." }
};

const REDIRECT_LANGUAGE_BY_COUNTRY = {
  AO: "pt",
  BR: "pt",
  CV: "pt",
  GW: "pt",
  MZ: "pt",
  PT: "pt",
  ST: "pt",
  TL: "pt",
  AR: "es",
  BO: "es",
  CL: "es",
  CO: "es",
  CR: "es",
  CU: "es",
  DO: "es",
  EC: "es",
  ES: "es",
  GT: "es",
  HN: "es",
  MX: "es",
  NI: "es",
  PA: "es",
  PE: "es",
  PR: "es",
  PY: "es",
  SV: "es",
  UY: "es",
  VE: "es",
  AU: "en",
  GB: "en",
  IE: "en",
  NZ: "en",
  US: "en",
  FR: "fr",
  MC: "fr",
  SN: "fr",
  DE: "de",
  AT: "de",
  IT: "it",
  SM: "it",
  NL: "nl",
  ID: "id",
  TR: "tr",
  PL: "pl"
};

function redirectLocaleFromRequest(request = null) {
  const country = String(request?.cf?.country || "").trim().toUpperCase();
  const countryLanguage = REDIRECT_LANGUAGE_BY_COUNTRY[country];
  if (REDIRECT_TEXT_BY_LANGUAGE[countryLanguage]) return REDIRECT_TEXT_BY_LANGUAGE[countryLanguage];

  const acceptedLanguages = String(request?.headers?.get("accept-language") || "")
    .split(",")
    .map((item) => item.trim().split(";")[0].slice(0, 2).toLowerCase())
    .filter(Boolean);
  const browserLanguage = acceptedLanguages.find((language) => REDIRECT_TEXT_BY_LANGUAGE[language]);
  return REDIRECT_TEXT_BY_LANGUAGE[browserLanguage] || REDIRECT_TEXT_BY_LANGUAGE.en;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
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
    eventType: "messenger_button_click",
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
