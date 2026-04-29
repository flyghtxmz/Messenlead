import { listFlows } from "../../_lib/flows.js";
import { getStoredPageAccessToken } from "../../_lib/pages.js";
import { applyContactActions, upsertContact } from "../../_lib/contacts.js";

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

  const context = eventContext(event);
  await upsertContact(env, pageId, {
    psid,
    name: psid,
    status: "open",
    source: "Messenger webhook",
    lastSeen: event.timestamp ? new Date(event.timestamp).toISOString() : new Date().toISOString()
  });

  const { replies, actions } = await buildReplies(context, env, pageId);
  if (actions.length) {
    await applyContactActions(env, pageId, psid, actions, {
      psid,
      name: psid,
      status: "open",
      source: "Messenger webhook",
      lastSeen: event.timestamp ? new Date(event.timestamp).toISOString() : new Date().toISOString()
    });
  }

  if (!replies.length) return;

  for (const reply of replies.slice(0, 3)) {
    await sendMessengerMessage(psid, reply.text, reply.quickReplies || [], env, pageId);
  }
}

async function buildReplies(context, env, pageId) {
  const dbFlows = pageId ? await listFlows(env, pageId, { status: "active" }) : [];
  const flows = dbFlows.length ? dbFlows : parseFlows(env.MESSENLEAD_FLOW_JSON);
  const activeFlows = flows.filter((flow) => flow.status === "active");
  const flow =
    activeFlows.find((item) => flowMatchesInput(item, context)) ||
    activeFlows[0];

  if (!flow) {
    return { replies: [], actions: [] };
  }

  const start =
    flow.nodes?.find((node) => node.type === "trigger" && triggerMatchesEvent(node, flow, context)) ||
    flow.nodes?.find((node) => node.type === "trigger") ||
    flow.nodes?.[0];

  const replies = [];
  const actions = [];
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

    if (current.type === "action") {
      actions.push(...actionStepsForNode(current));
    }

    current = current.next ? flow.nodes.find((node) => node.id === current.next) : null;
  }

  return { replies, actions };
}

function actionStepsForNode(node) {
  if (Array.isArray(node.actions) && node.actions.length) {
    return node.actions;
  }

  if (node.tag) {
    return [{ type: "add_tag", tag: node.tag }];
  }

  return [];
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

function flowMatchesInput(flow, context) {
  const triggerNode = flow.nodes?.find((node) => node.type === "trigger");
  return triggerMatchesEvent(triggerNode, flow, context);
}

function eventContext(event) {
  const referral = event.referral || event.message?.referral || event.postback?.referral || {};
  const inputText = event.message?.quick_reply?.payload || event.message?.text || event.postback?.payload || event.optin?.ref || referral.ref || "";
  return {
    text: inputText,
    normalizedInput: normalize(inputText),
    eventType: event.message?.quick_reply ? "quick_reply" : event.message ? "message" : event.postback ? "postback" : event.optin ? "optin" : "unknown",
    referralRef: normalize(referral.ref || event.optin?.ref || ""),
    referralSource: normalize(referral.source || referral.type || ""),
    hasReferral: Boolean(referral.ref || referral.source || referral.type || event.optin?.ref)
  };
}

function triggerMatchesEvent(node, flow, context) {
  if (!node) return false;
  const triggers = Array.isArray(node.triggerEvents) && node.triggerEvents.length ? node.triggerEvents : [node.triggerKind || "messenger_message"];

  return triggers.some((trigger) => {
    if (!triggerEventMatches(trigger, context)) return false;
    return triggerKeywordMatches(trigger, node, flow, context);
  });
}

function triggerEventMatches(trigger, context) {
  if (trigger === "messenger_message") return ["message", "quick_reply", "postback", "optin"].includes(context.eventType);
  if (trigger === "facebook_ad") return context.referralSource.includes("ad") || context.referralSource.includes("ads");
  if (trigger === "facebook_comment") return context.referralSource.includes("comment");
  if (trigger === "referral_link") return context.hasReferral;
  if (trigger === "qr_code") return context.referralRef.includes("qr") || context.referralSource.includes("qr");
  if (trigger === "facebook_shop_message") return context.referralSource.includes("shop") || context.referralSource.includes("commerce");
  if (trigger === "get_started") return context.eventType === "postback" && context.normalizedInput === "get_started";
  if (trigger === "messenger_postback") return context.eventType === "postback" || context.eventType === "quick_reply";
  if (trigger === "messenger_optin") return context.eventType === "optin";
  if (trigger === "message_contains_keyword") return context.eventType === "message" || context.eventType === "quick_reply";
  return false;
}

function triggerKeywordMatches(trigger, node, flow, context) {
  const rawKeywords = node.keyword || flow.trigger || "";
  if (trigger === "facebook_ad" || trigger === "facebook_comment" || trigger === "facebook_shop_message") {
    return !rawKeywords || keywordMatches(rawKeywords, `${context.normalizedInput} ${context.referralRef} ${context.referralSource}`);
  }
  if (trigger === "referral_link" || trigger === "qr_code") {
    return !rawKeywords || keywordMatches(rawKeywords, context.referralRef || context.normalizedInput);
  }
  if (trigger === "get_started") {
    return !rawKeywords || keywordMatches(rawKeywords, context.normalizedInput);
  }
  if (trigger === "messenger_postback") {
    return !rawKeywords || keywordMatches(rawKeywords, context.normalizedInput);
  }
  if (trigger === "messenger_optin") {
    return !rawKeywords || keywordMatches(rawKeywords, context.referralRef || context.normalizedInput);
  }
  if (trigger === "message_contains_keyword") {
    return keywordMatches(rawKeywords, context.normalizedInput);
  }
  return keywordMatches(rawKeywords, context.normalizedInput);
}

function keywordMatches(keywords, normalizedInput) {
  const list = String(keywords || "")
    .split(",")
    .map((item) => normalize(item.trim()))
    .filter(Boolean);

  if (!list.length || normalizedInput === "get_started") return true;
  return list.some((keyword) => normalizedInput.includes(keyword) || keyword.includes(normalizedInput));
}

async function sendMessengerMessage(psid, text, quickReplies, env, pageId) {
  const pageAccessToken = (pageId ? await getStoredPageAccessToken(env, pageId) : "") || env.MESSENGER_PAGE_ACCESS_TOKEN;
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
