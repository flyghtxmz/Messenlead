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
  var heartbeatTimer = 0;
  var exitSent = false;
  var HEARTBEAT_INTERVAL_MS = 60000;

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

  function contactAttribution(eventType) {
    var params = new URLSearchParams(window.location.search);
    var stored = jsonGet(window.localStorage, contactKey);
    var incoming = {
      contactToken: params.get("ml_contact") || "",
      contactPsid: params.get("ml_psid") || params.get("psid") || "",
      contactPageId: params.get("ml_page_id") || "",
      source: params.get("ml_source") || "",
      button: params.get("ml_button") || "",
      buttonId: params.get("ml_button_id") || "",
      flowId: params.get("ml_flow_id") || "",
      nodeId: params.get("ml_node_id") || "",
      nodeNumber: params.get("ml_node_number") || "",
      nodeTitle: params.get("ml_node_title") || "",
      linkId: params.get("ml_link_id") || ""
    };

    if (incoming.contactToken || incoming.contactPsid) {
      incoming.updatedAt = new Date().toISOString();
      incoming.pageViews = 0;
      if (eventType === "page_view") incoming.pageViews = 1;
      jsonSet(window.localStorage, contactKey, incoming);
      return incoming;
    }

    if (!stored || (!stored.contactToken && !stored.contactPsid)) return {};
    if (eventType === "page_view") {
      stored.pageViews = Math.max(0, Number(stored.pageViews || 0)) + 1;
      stored.updatedAt = new Date().toISOString();
      jsonSet(window.localStorage, contactKey, stored);
    }
    return stored;
  }

  function hasContactAttribution() {
    var contact = contactAttribution("site_heartbeat");
    return Boolean(contact.contactToken || contact.contactPsid);
  }

  function payload(eventType, eventName, data) {
    data = data || {};
    var currentUtm = utm();
    var contact = contactAttribution(eventType || "custom");
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
        contactButton: contact.button || "",
        contactButtonId: contact.buttonId || "",
        contactFlowId: contact.flowId || "",
        contactNodeId: contact.nodeId || "",
        contactNodeNumber: contact.nodeNumber || "",
        contactNodeTitle: contact.nodeTitle || "",
        contactLinkId: contact.linkId || "",
        contactPageViews: contact.pageViews || ""
      }, data)
    };
  }

  function send(eventType, eventName, data) {
    var eventPayload = payload(eventType, eventName, data);
    var body = JSON.stringify(eventPayload);
    return fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body,
      keepalive: true,
      mode: "cors"
    }).then(function (response) {
      if (!response || !response.ok) return sendFallback(eventPayload, response);
      return {
        ok: true,
        status: response.status,
        eventType: eventPayload.eventType,
        eventName: eventPayload.eventName,
        pageId: eventPayload.pageId,
        siteId: eventPayload.siteId
      };
    }).catch(function () {
      if (navigator.sendBeacon) {
        var blob = new Blob([body], { type: "application/json" });
        if (navigator.sendBeacon(endpoint, blob)) {
          return {
            ok: true,
            transport: "beacon",
            eventType: eventPayload.eventType,
            eventName: eventPayload.eventName,
            pageId: eventPayload.pageId,
            siteId: eventPayload.siteId
          };
        }
      }
      return sendFallback(eventPayload);
    });
  }

  function sendFallback(eventPayload, response) {
    var params = new URLSearchParams();
    [
      "pageId",
      "siteId",
      "visitorId",
      "sessionId",
      "contactToken",
      "contactPsid",
      "contactPageId",
      "eventType",
      "eventName",
      "url",
      "path",
      "title",
      "referrer",
      "targetUrl",
      "targetText",
      "targetId",
      "targetClasses",
      "utmSource",
      "utmMedium",
      "utmCampaign",
      "utmTerm",
      "utmContent"
    ].forEach(function (key) {
      if (eventPayload[key]) params.set(key, eventPayload[key]);
    });
    if (eventPayload.data) {
      [
        "contactSource",
        "contactButton",
        "contactButtonId",
        "contactFlowId",
        "contactNodeId",
        "contactNodeNumber",
        "contactNodeTitle",
        "contactLinkId",
        "contactPageViews"
      ].forEach(function (key) {
        if (eventPayload.data[key]) params.set(key, eventPayload.data[key]);
      });
    }
    var image = new Image();
    image.src = endpoint + "?" + params.toString();
    return {
      ok: false,
      transport: "image",
      status: response && response.status,
      eventType: eventPayload.eventType,
      eventName: eventPayload.eventName,
      pageId: eventPayload.pageId,
      siteId: eventPayload.siteId
    };
  }

  function heartbeat() {
    if (document.visibilityState && document.visibilityState !== "visible") return;
    if (!hasContactAttribution()) return;
    exitSent = false;
    return send("site_heartbeat", "site_heartbeat", {
      heartbeatInterval: HEARTBEAT_INTERVAL_MS,
      visibilityState: document.visibilityState || "visible"
    });
  }

  function startHeartbeat() {
    if (heartbeatTimer) return;
    window.setTimeout(heartbeat, 5000);
    heartbeatTimer = window.setInterval(heartbeat, HEARTBEAT_INTERVAL_MS);
  }

  function sendExit(reason) {
    if (exitSent || !hasContactAttribution()) return;
    exitSent = true;
    var eventPayload = payload("site_exit", "site_exit", {
      exitReason: reason || "pagehide",
      visibilityState: document.visibilityState || ""
    });
    var body = JSON.stringify(eventPayload);
    if (navigator.sendBeacon) {
      var blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon(endpoint, blob)) return;
    }
    sendFallback(eventPayload);
  }

  window.MessenleadPixel = {
    loaded: true,
    version: "6",
    endpoint: endpoint,
    config: config,
    track: function (eventName, data) {
      return send("custom", eventName || "custom", data || {});
    },
    identify: function (id, data) {
      return send("identify", "identify", Object.assign({ externalId: trim(id, 180) }, data || {}));
    }
  };

  function pageView() {
    send("page_view", "page_view", {});
    startHeartbeat();
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

  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") heartbeat();
  });

  window.addEventListener("pagehide", function () {
    sendExit("pagehide");
  });

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
      "Cache-Control": "public, max-age=60"
    }
  });
}
