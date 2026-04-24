export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function onRequestPost({ request, env }) {
  const expectedToken = env.MESSENLEAD_OPERATOR_TOKEN;
  const authorization = request.headers.get("authorization") || "";

  if (!expectedToken || authorization !== `Bearer ${expectedToken}`) {
    return json({ error: "Unauthorized" }, 401);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const psid = String(body.psid || "").trim();
  const text = String(body.text || "").trim();

  if (!psid || !text) {
    return json({ error: "psid and text are required" }, 400);
  }

  if (!env.MESSENGER_PAGE_ACCESS_TOKEN) {
    return json({ error: "Missing MESSENGER_PAGE_ACCESS_TOKEN" }, 500);
  }

  const graphUrl = env.MESSENGER_GRAPH_API_URL || "https://graph.facebook.com/v23.0/me/messages";
  const response = await fetch(`${graphUrl}?access_token=${encodeURIComponent(env.MESSENGER_PAGE_ACCESS_TOKEN)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recipient: { id: psid },
      messaging_type: body.messaging_type || "RESPONSE",
      message: { text }
    })
  });

  const resultText = await response.text();

  if (!response.ok) {
    return json({ error: "Messenger API error", details: safeJson(resultText) || resultText }, response.status);
  }

  return json({ ok: true, result: safeJson(resultText) || resultText });
}

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders(),
      "Content-Type": "application/json"
    }
  });
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };
}

function safeJson(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}
