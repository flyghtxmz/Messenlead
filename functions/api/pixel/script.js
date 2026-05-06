export function onRequestGet() {
  const source = `
(function () {
  if (window.MessenleadPixel && window.MessenleadPixel.loaded) return;

  var script = document.currentScript;
  var scriptUrl = script && script.src ? new URL(script.src, window.location.href) : new URL(window.location.href);
  var endpoint = scriptUrl.origin + "/api/pixel/collect";
  var config = {
    pageId: (script && script.getAttribute("data-page-id")) || scriptUrl.searchParams.get("pageId") || "__global__",
    siteId: safeSiteId((script && script.getAttribute("data-site-id")) || scriptUrl.searchParams.get("siteId") || window.location.hostname || "default")
  };
  var visitorKey = "messenlead.pixel.visitor:" + config.siteId;
  var sessionKey = "messenlead.pixel.session:" + config.siteId;
  var contactKey = "messenlead.pixel.contact:" + config.siteId;

  function randomId(prefix) {
    if (window.crypto && crypto.randomUUID) return prefix + "_" + crypto.randomUUID();
    return prefix + "_" + Date.now().toString(36) + Math.random().toString(36).slice(2);
  }

  function safeSiteId(value) {
    return String(value || "default")
      .trim()
      .toLowerCase()
      .replace(/^www\\./, "")
      .replace(/[^a-z0-9._-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 100) || "default";
  }

  function storageGet(store, key) {
    try {
      return store.getItem(key) || "";
    } catch (_) {
      return "";
    }
  }

  function storageSet(store, key, value) {
    try {
      store.setItem(key, value);
    } catch (_) {}
  }

  function jsonGet(store, key) {
    try {
      return JSON.parse(store.getItem(key) || "{}") || {};
    } catch (_) {
      return {};
    }
  }

  function jsonSet(store, key, value) {
    try {
      store.setItem(key, JSON.stringify(value || {}));
    } catch (_) {}
  }

  function visitorId() {
    var value = storageGet(window.localStorage, visitorKey);
    if (!value) {
      value = randomId("vis");
      storageSet(window.localStorage, visitorKey, value);
    }
    return value;
  }

  function sessionId() {
    var value = storageGet(window.sessionStorage, sessionKey);
    if (!value) {
      value = randomId("ses");
      storageSet(window.sessionStorage, sessionKey, value);
    }
    return value;
  }

  function trim(value, max) {
    return String(value || "").replace(/\\s+/g, " ").trim().slice(0, max || 500);
  }

  function utm() {
    var params = new URLSearchParams(window.location.search);
    return {
      source: params.get("utm_source") || "",
      medium: params.get("utm_medium") || "",
      campaign: params.get("utm_campaign") || "",
      term: params.get("utm_term") || "",
      content: params.get("utm_content") || ""
    };
  }

  function contactAttribution() {
    var params = new URLSearchParams(window.location.search);
    var stored = jsonGet(window.localStorage, contactKey);
    var incoming = {
      contactToken: params.get("ml_contact") || "",
      contactPsid: params.get("ml_psid") || params.get("psid") || "",
      contactPageId: params.get("ml_page_id") || "",
      source: params.get("ml_source") || "",
      button: params.get("ml_button") || ""
    };

    if (incoming.contactToken || incoming.contactPsid) {
      incoming.updatedAt = new Date().toISOString();
      jsonSet(window.localStorage, contactKey, incoming);
      return incoming;
    }

    return stored && (stored.contactToken || stored.contactPsid) ? stored : {};
  }

  function payload(eventType, eventName, data) {
    data = data || {};
    var currentUtm = utm();
    var contact = contactAttribution();
    return {
      pageId: config.pageId,
      siteId: config.siteId,
      visitorId: visitorId(),
      sessionId: sessionId(),
      contactToken: contact.contactToken || "",
      contactPsid: contact.contactPsid || "",
      contactPageId: contact.contactPageId || "",
      eventType: eventType || "custom",
      eventName: eventName || eventType || "custom",
      url: window.location.href,
      path: window.location.pathname,
      title: document.title || "",
      referrer: document.referrer || "",
      utmSource: currentUtm.source,
      utmMedium: currentUtm.medium,
      utmCampaign: currentUtm.campaign,
      utmTerm: currentUtm.term,
      utmContent: currentUtm.content,
      targetUrl: data.targetUrl || "",
      targetText: data.targetText || "",
      targetId: data.targetId || "",
      targetClasses: data.targetClasses || "",
      data: Object.assign({
        language: navigator.language || "",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
        screen: window.screen ? window.screen.width + "x" + window.screen.height : "",
        viewport: window.innerWidth + "x" + window.innerHeight,
        contactSource: contact.source || "",
        contactButton: contact.button || ""
      }, data)
    };
  }

  function send(eventType, eventName, data) {
    var body = JSON.stringify(payload(eventType, eventName, data));
    if (navigator.sendBeacon) {
      var blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon(endpoint, blob)) return;
    }
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body,
      keepalive: true,
      mode: "cors"
    }).catch(function () {});
  }

  window.MessenleadPixel = {
    loaded: true,
    track: function (eventName, data) {
      send("custom", eventName || "custom", data || {});
    },
    identify: function (id, data) {
      send("identify", "identify", Object.assign({ externalId: trim(id, 180) }, data || {}));
    }
  };

  function pageView() {
    send("page_view", "page_view", {});
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", pageView, { once: true });
  } else {
    setTimeout(pageView, 0);
  }

  document.addEventListener("click", function (event) {
    var target = event.target && event.target.closest ? event.target.closest("a,button,[data-ml-track]") : null;
    if (!target) return;

    var tag = String(target.tagName || "").toLowerCase();
    var isLink = tag === "a";
    var className = typeof target.className === "string" ? target.className : "";
    send(isLink ? "link_click" : "element_click", target.getAttribute("data-ml-track") || (isLink ? "link_click" : "element_click"), {
      targetUrl: target.href || target.getAttribute("data-href") || "",
      targetText: trim(target.innerText || target.getAttribute("aria-label") || target.getAttribute("title") || "", 500),
      targetId: target.id || "",
      targetClasses: className,
      targetTag: tag
    });
  }, true);

  document.addEventListener("submit", function (event) {
    var form = event.target;
    if (!form) return;
    send("form_submit", form.getAttribute("data-ml-track") || "form_submit", {
      targetUrl: form.action || "",
      targetId: form.id || "",
      targetClasses: typeof form.className === "string" ? form.className : "",
      targetTag: "form"
    });
  }, true);
})();`;

  return new Response(source.trim(), {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=300"
    }
  });
}
