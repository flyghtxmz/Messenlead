import { listFlows } from "../../_lib/flows.js";

const DEFAULT_REPLY = "Recebi sua mensagem. Um atendente vai assumir a conversa se a automação não resolver.";

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === env.MESSENGER_VERIFY_TOKEN) {
    return new Response(challenge || "", { status: 200 });
  }

  return new Response("Verification failed", { status: 403 });
}

export async function onRequestPost({ request, env }) {
  const rawBody = await request.arrayBuffer();
  const signatureOk = await verifyMetaSignature(request, rawBody, env.MESSENGER_APP_SECRET);

  if (!signatureOk) {
    return new Response("Invalid signature", { status: 403 });
  }

  let payload;
  try {
    payload = JSON.parse(new TextDecoder().decode(rawBody));
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  if (payload.object !== "page") {
    return new Response("Ignored", { status: 200 });
  }

  const work = [];
  for (const entry of payload.entry || []) {
    for (const event of entry.messaging || []) {
      work.push(handleMessengerEvent(event, env, entry.id));
    }
  }
  await Promise.all(work);

  return new Response("EVENT_RECEIVED", { status: 200 });
}

async function handleMessengerEvent(event, env, pageId) {
  if (event.message?.is_echo) return;

  const psid = event.sender?.id;
  if (!psid) return;

  const inputText = event.message?.text || event.postback?.payload || event.optin?.ref || "";
  const replies = await buildReplies(inputText, env, pageId);

  for (const reply of replies.slice(0, 3)) {
    await sendMessengerMessage(psid, reply.text, reply.quickReplies || [], env);
  }
}

async function buildReplies(inputText, env, pageId) {
  const dbFlows = pageId ? await listFlows(env, pageId, { status: "active" }) : [];
  const flows = dbFlows.length ? dbFlows : parseFlows(env.MESSENLEAD_FLOW_JSON);
  const activeFlows = flows.filter((flow) => flow.status === "active");
  const normalizedInput = normalize(inputText);
  const flow =
    activeFlows.find((item) => flowMatchesInput(item, normalizedInput)) ||
    activeFlows[0];

  if (!flow) {
    return [{ text: env.MESSENLEAD_DEFAULT_REPLY || DEFAULT_REPLY }];
  }

  const start =
    flow.nodes?.find((node) => node.type === "trigger" && keywordMatches(node.keyword || flow.trigger, normalizedInput)) ||
    flow.nodes?.find((node) => node.type === "trigger") ||
    flow.nodes?.[0];

  const replies = [];
  let current = start;
  let guard = 0;

  while (current && guard < 12) {
    guard += 1;

    if (current.type === "message" && current.message) {
      replies.push({
        text: resolveTemplate(current.message),
        quickReplies: Array.isArray(current.quickReplies) ? current.quickReplies : []
      });
    }

    current = current.next ? flow.nodes.find((node) => node.id === current.next) : null;
  }

  return replies.length ? replies : [{ text: env.MESSENLEAD_DEFAULT_REPLY || DEFAULT_REPLY }];
}

function parseFlows(rawJson) {
  if (!rawJson) return [];

  try {
    const parsed = JSON.parse(rawJson);
    return Array.isArray(parsed.flows) ? parsed.flows : [];
  } catch {
    return [];
  }
}

function flowMatchesInput(flow, normalizedInput) {
  const triggerText = normalize(flow.trigger || "");
  const triggerNode = flow.nodes?.find((node) => node.type === "trigger");
  return keywordMatches(triggerNode?.keyword || triggerText, normalizedInput);
}

function keywordMatches(keywords, normalizedInput) {
  const list = String(keywords || "")
    .split(",")
    .map((item) => normalize(item.trim()))
    .filter(Boolean);

  if (!list.length || normalizedInput === "get_started") return true;
  return list.some((keyword) => normalizedInput.includes(keyword) || keyword.includes(normalizedInput));
}

async function sendMessengerMessage(psid, text, quickReplies, env) {
  const pageAccessToken = env.MESSENGER_PAGE_ACCESS_TOKEN;
  if (!pageAccessToken) return;

  const graphUrl = env.MESSENGER_GRAPH_API_URL || "https://graph.facebook.com/v23.0/me/messages";
  const message = { text };

  if (quickReplies.length) {
    message.quick_replies = quickReplies.slice(0, 11).map((title) => ({
      content_type: "text",
      title: String(title).slice(0, 20),
      payload: String(title).slice(0, 1000)
    }));
  }

  await fetch(`${graphUrl}?access_token=${encodeURIComponent(pageAccessToken)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recipient: { id: psid },
      messaging_type: "RESPONSE",
      message
    })
  });
}

async function verifyMetaSignature(request, rawBody, appSecret) {
  if (!appSecret) return true;

  const signature = request.headers.get("x-hub-signature-256") || "";
  const [algorithm, hash] = signature.split("=");

  if (algorithm !== "sha256" || !hash) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(appSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const digest = await crypto.subtle.sign("HMAC", key, rawBody);

  return timingSafeEqual(toHex(digest), hash);
}

function timingSafeEqual(left, right) {
  if (left.length !== right.length) return false;

  let result = 0;
  for (let index = 0; index < left.length; index += 1) {
    result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return result === 0;
}

function toHex(buffer) {
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function resolveTemplate(text) {
  return String(text || "").replaceAll("{{first_name}}", "Contato");
}
