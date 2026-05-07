const DEFAULT_GRAPH_URL = "https://graph.facebook.com/v23.0/me/messages";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/health") {
      return json({ ok: true, service: "messenlead-messenger-send-relay" });
    }

    if (request.method !== "POST" || url.pathname !== "/send") {
      return json({ error: "Not found" }, 404);
    }

    const expectedSecret = String(env.MESSENLEAD_SEND_RELAY_SECRET || "").trim();
    if (!expectedSecret) return json({ error: "Relay secret is not configured" }, 503);

    const providedSecret = request.headers.get("x-messenlead-relay-secret") || "";
    if (!timingSafeEqual(providedSecret, expectedSecret)) {
      return json({ error: "Unauthorized" }, 401);
    }

    let body = {};
    try {
      body = await request.json();
    } catch {
      return json({ error: "Invalid JSON" }, 400);
    }

    const pageAccessToken = clean(body.pageAccessToken, 4000);
    const psid = clean(body.psid, 120);
    const message = body.message && typeof body.message === "object" ? body.message : null;
    if (!pageAccessToken || !psid || !message) {
      return json({ error: "pageAccessToken, psid and message are required" }, 400);
    }

    const graphApiUrl = clean(body.graphApiUrl, 500) || DEFAULT_GRAPH_URL;
    const graphUrl = `${graphApiUrl}?access_token=${encodeURIComponent(pageAccessToken)}`;
    const graphResponse = await fetch(graphUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient: { id: psid },
        messaging_type: clean(body.messagingType, 40) || "RESPONSE",
        message
      })
    });
    const graphBody = await graphResponse.text().catch(() => "");

    return json(
      {
        ok: graphResponse.ok,
        status: graphResponse.status,
        pageId: clean(body.pageId, 120),
        queueId: clean(body.queueId, 160),
        body: graphBody.slice(0, 4000)
      },
      graphResponse.ok ? 200 : 502
    );
  }
};

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

function clean(value, max) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, max);
}

function timingSafeEqual(left, right) {
  if (left.length !== right.length) return false;

  let result = 0;
  for (let index = 0; index < left.length; index += 1) {
    result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return result === 0;
}
