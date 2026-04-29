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
  const contact = await upsertContact(env, pageId, {
    psid,
    name: psid,
    status: "open",
    source: "Messenger webhook",
    lastSeen: event.timestamp ? new Date(event.timestamp).toISOString() : new Date().toISOString()
  });

  const { replies, actions } = await buildReplies(context, env, pageId, contact);
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

  for (const reply of replies.slice(0, 5)) {
    await sendMessengerReply(psid, reply, env, pageId);
  }
}

async function buildReplies(context, env, pageId, contact = null) {
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
    interactiveStartNode(flow, context) ||
    flow.nodes?.find((node) => node.type === "trigger" && triggerMatchesEvent(node, flow, context)) ||
    flow.nodes?.find((node) => node.type === "trigger") ||
    flow.nodes?.[0];

  const replies = [];
  const actions = [];
  let current = start;
  let guard = 0;

  while (current && guard < 12) {
    guard += 1;

    if (current.type === "message") {
      replies.push(...repliesForMessageNode(current));
    }

    if (current.type === "action") {
      actions.push(...actionStepsForNode(current));
    }

    current = nextExecutableNode(flow, current, { ...context, contact });
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

function nextExecutableNode(flow, node, context = {}) {
  const targetId = nextExecutableTargetId(node, context);
  const next = targetId ? flow.nodes.find((item) => item.id === targetId) : null;
  return next && next.type !== "trigger" && next.type !== "comment" ? next : null;
}

function nextExecutableTargetId(node, context = {}) {
  if (!node) return null;
  normalizeNodeShape(node);
  if (node.type === "condition") return conditionMatchesNode(node, context) ? node.yesNext : node.noNext;
  if (node.type === "randomizer") return pickRandomVariation(node, context)?.next || null;
  if (node.type === "message") return matchingMessageOption(node, context)?.next || node.next || null;
  return node.next || null;
}

function interactiveStartNode(flow, context) {
  for (const node of flow.nodes || []) {
    if (node.type !== "message") continue;
    normalizeNodeShape(node);
    const option = matchingMessageOption(node, context);
    if (!option?.next) continue;
    const target = flow.nodes.find((item) => item.id === option.next);
    if (target && target.type !== "trigger" && target.type !== "comment") return target;
  }
  return null;
}

function matchingMessageOption(node, context = {}) {
  const input = normalize(context.text || context.normalizedInput || "");
  if (!input) return null;
  return [...(node.buttons || []), ...(node.quickReplies || [])].find((option) => {
    return normalize(option.id) === input || normalize(option.title) === input;
  });
}

function normalizeNodeShape(node) {
  if (node.type === "message") {
    if (!Array.isArray(node.contentBlocks) || !node.contentBlocks.length) {
      node.contentBlocks = [{ id: "legacy", type: "text", text: node.message || "" }];
    }
    node.quickReplies = normalizeMessageOptions(node.quickReplies, "qr");
    node.buttons = normalizeMessageOptions(node.buttons, "btn").slice(0, 3);
  }
  if (node.type === "condition") {
    node.conditionType ||= "message_contains";
    node.conditionOperator ||= "contains_any";
    node.yesNext ||= node.next || null;
    node.noNext ||= null;
  }
  if (node.type === "randomizer" && !Array.isArray(node.variations)) {
    node.variations = [{ id: "default", label: "Variação A", weight: 100, next: node.next || null }];
  }
}

function normalizeMessageOptions(options, prefix) {
  return (Array.isArray(options) ? options : [])
    .map((option, index) => {
      if (typeof option === "string") {
        return { id: `${prefix}_${index}`, title: option, type: "next", next: null, url: "", phone: "" };
      }
      return {
        id: String(option.id || `${prefix}_${index}`),
        title: String(option.title || option.text || option.caption || ""),
        type: String(option.type || "next"),
        next: option.next || null,
        url: option.url || "",
        phone: option.phone || ""
      };
    })
    .filter((option) => option.title);
}

function conditionMatchesNode(node, context = {}) {
  const input = normalize(context.normalizedInput || context.text || "");
  const terms = String(node.keyword || "")
    .split(",")
    .map((item) => normalize(item.trim()))
    .filter(Boolean);
  const operator = node.conditionOperator || "contains_any";

  if (node.conditionType === "tag") {
    const tags = normalizeTags(context.contact?.tags || context.contact?.tag).map(normalize);
    return terms.some((term) => tags.includes(term));
  }
  if (node.conditionType === "field") {
    const value = normalize(context.contact?.customFields?.[node.fieldName] || "");
    const expected = normalize(node.fieldValue || node.keyword || "");
    if (operator === "not_contains") return expected ? !value.includes(expected) : !value;
    if (operator === "equals") return value === expected;
    return expected ? value.includes(expected) : Boolean(value);
  }
  if (!terms.length) return true;
  if (operator === "contains_all") return terms.every((term) => input.includes(term));
  if (operator === "equals") return terms.some((term) => input === term);
  if (operator === "not_contains") return terms.every((term) => !input.includes(term));
  return terms.some((term) => input.includes(term));
}

function pickRandomVariation(node, context = {}) {
  const variations = (node.variations || []).filter((variation) => variation.next);
  if (!variations.length) return null;
  const total = variations.reduce((sum, variation) => sum + Math.max(0, Number(variation.weight) || 0), 0) || variations.length;
  const seed = node.randomEveryTime === false ? seededNumber(`${context.contact?.psid || ""}:${node.id}`, total) : Math.random() * total;
  let cursor = 0;
  for (const variation of variations) {
    cursor += Math.max(0, Number(variation.weight) || 0) || 1;
    if (seed <= cursor) return variation;
  }
  return variations[0];
}

function seededNumber(seed, max) {
  let hash = 0;
  for (const char of String(seed || "default")) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash % Math.max(1, max);
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

function normalizeTags(value) {
  const raw = Array.isArray(value) ? value : String(value || "").split(",");
  return [...new Set(raw.map((item) => String(item || "").trim()).filter(Boolean))];
}

function repliesForMessageNode(node) {
  normalizeNodeShape(node);
  const quickReplies = node.quickReplies.map((option) => ({
    title: option.title,
    payload: option.id || option.title
  }));
  const buttons = node.buttons.map((option) => ({
    title: option.title,
    type: option.type || "next",
    url: option.url || "",
    phone: option.phone || "",
    payload: option.id || option.title
  }));

  return node.contentBlocks
    .map((block, index) => {
      if (block.type === "text") {
        return {
          type: "text",
          text: resolveTemplate(block.text || node.message || ""),
          quickReplies: index === node.contentBlocks.length - 1 ? quickReplies : [],
          buttons: index === node.contentBlocks.length - 1 ? buttons : []
        };
      }
      if (["image", "audio", "video", "file"].includes(block.type) && block.url) {
        return {
          type: "attachment",
          attachmentType: block.type,
          url: block.url,
          quickReplies: index === node.contentBlocks.length - 1 ? quickReplies : []
        };
      }
      if ((block.type === "card" || block.type === "gallery") && (block.title || block.url)) {
        return {
          type: "generic",
          elements: [
            {
              title: block.title || "Card",
              subtitle: block.subtitle || "",
              image_url: block.url || "",
              buttons
            }
          ]
        };
      }
      if (block.type === "data_collection") {
        return { type: "text", text: resolveTemplate(block.text || "Informe o dado solicitado."), quickReplies };
      }
      if (block.text) return { type: "text", text: resolveTemplate(block.text), quickReplies };
      return null;
    })
    .filter(Boolean);
}

async function sendMessengerReply(psid, reply, env, pageId) {
  const pageAccessToken = (pageId ? await getStoredPageAccessToken(env, pageId) : "") || env.MESSENGER_PAGE_ACCESS_TOKEN;
  if (!pageAccessToken) return;

  const graphUrl = env.MESSENGER_GRAPH_API_URL || "https://graph.facebook.com/v23.0/me/messages";
  const message = messengerMessagePayload(reply);

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

function messengerMessagePayload(reply) {
  const message = {};

  if (reply.type === "attachment") {
    message.attachment = {
      type: reply.attachmentType,
      payload: {
        url: reply.url,
        is_reusable: true
      }
    };
  } else if (reply.type === "generic") {
    message.attachment = {
      type: "template",
      payload: {
        template_type: "generic",
        elements: reply.elements.slice(0, 10).map((element) => ({
          title: String(element.title || "Card").slice(0, 80),
          subtitle: String(element.subtitle || "").slice(0, 80),
          image_url: element.image_url || undefined,
          buttons: messengerButtons(element.buttons || [])
        }))
      }
    };
  } else if (reply.buttons?.length) {
    message.attachment = {
      type: "template",
      payload: {
        template_type: "button",
        text: String(reply.text || "Escolha uma opção").slice(0, 640),
        buttons: messengerButtons(reply.buttons).slice(0, 3)
      }
    };
  } else {
    message.text = String(reply.text || "").slice(0, 2000);
  }

  if (reply.quickReplies?.length && !reply.buttons?.length) {
    message.quick_replies = reply.quickReplies.slice(0, 11).map((option) => ({
      content_type: "text",
      title: String(option.title || option).slice(0, 20),
      payload: String(option.payload || option.title || option).slice(0, 1000)
    }));
  }

  return message;
}

function messengerButtons(buttons = []) {
  return buttons.slice(0, 3).map((button) => {
    if (button.type === "url" && button.url) {
      return {
        type: "web_url",
        title: String(button.title || "Abrir").slice(0, 20),
        url: button.url
      };
    }
    if (button.type === "phone" && button.phone) {
      return {
        type: "phone_number",
        title: String(button.title || "Ligar").slice(0, 20),
        payload: button.phone
      };
    }
    return {
      type: "postback",
      title: String(button.title || "Continuar").slice(0, 20),
      payload: String(button.payload || button.id || button.title || "NEXT").slice(0, 1000)
    };
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
