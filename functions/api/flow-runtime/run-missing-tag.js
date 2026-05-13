import { getMetaConfig, getSession, graphFetch, graphUrl, json } from "../../_lib/meta.js";
import { getContact, normalizeTags, upsertContact } from "../../_lib/contacts.js";
import { listFlows } from "../../_lib/flows.js";
import { safeAddFlowLog } from "../../_lib/flowLogs.js";
import { getStoredPageAccessToken } from "../../_lib/pages.js";
import { handleMessengerEvent } from "../messenger/webhook.js";

const RESPONSE_WINDOW_MS = 24 * 60 * 60 * 1000;

export async function onRequestPost({ request, env }) {
  const auth = await authorizeRunMissingTagRequest(request, env);
  if (!auth.ok) return auth.response;

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const pageId = String(body.pageId || "").trim();
  const flowId = String(body.flowId || "").trim();
  const tag = normalizeTagName(body.tag);
  const limit = clampNumber(body.limit, 1, 50, 25);

  if (!pageId || !flowId || !tag) {
    return json({ error: "pageId, flowId and tag are required" }, 400);
  }

  const config = getMetaConfig(request, env);
  const pageAccessToken = await getStoredPageAccessToken(env, pageId);
  if (!pageAccessToken) return json({ error: "No stored Page access token for this Page" }, 403);

  const flows = await listFlows(env, pageId, { status: "active" });
  const flow = flows.find((item) => item.id === flowId);
  if (!flow) return json({ error: "Selected flow is not active for this Page" }, 404);

  const candidates = await recentInboundCandidates(config, pageId, pageAccessToken, limit);
  const result = {
    ok: true,
    pageId,
    flowId,
    flowName: flow.name || "",
    tag,
    checked: candidates.length,
    triggered: 0,
    skippedHasTag: 0,
    skippedOutsideWindow: 0,
    skippedNoPsid: 0,
    failed: 0,
    items: []
  };

  for (const candidate of candidates) {
    if (!candidate.psid) {
      result.skippedNoPsid += 1;
      result.items.push({ ...candidate, status: "skipped_no_psid" });
      continue;
    }

    if (!isInsideReplyWindow(candidate.lastInboundAt)) {
      result.skippedOutsideWindow += 1;
      result.items.push({ ...candidate, status: "skipped_outside_24h" });
      continue;
    }

    const contact = await getContact(env, pageId, candidate.psid);
    if (contactHasTag(contact, tag)) {
      result.skippedHasTag += 1;
      result.items.push({ ...candidate, status: "skipped_has_tag", tags: contact?.tags || [] });
      continue;
    }

    try {
      await upsertContact(env, pageId, {
        psid: candidate.psid,
        name: candidate.name || contact?.name || "",
        status: "open",
        source: "Graph API manual scan",
        lastSeen: candidate.lastInboundAt
      });

      const timestamp = Date.now();
      const runtime = await handleMessengerEvent({
        sender: { id: candidate.psid },
        recipient: { id: pageId },
        timestamp,
        postback: {
          mid: `mid.missing_tag.${flowId}.${candidate.psid}.${timestamp}`,
          title: `Manual missing tag: ${tag}`,
          payload: `MESSENLEAD_MISSING_TAG:${flowId}:${tag}`
        }
      }, env, pageId, {
        channel: "manual_missing_tag",
        manualFlowId: flowId,
        forceLogs: true,
        lastSeen: candidate.lastInboundAt,
        policyExpiresAt: new Date(Date.parse(candidate.lastInboundAt) + RESPONSE_WINDOW_MS).toISOString()
      });

      result.triggered += 1;
      result.items.push({ ...candidate, status: "triggered", runtime });
    } catch (error) {
      result.failed += 1;
      result.items.push({ ...candidate, status: "failed", error: error.message || "run_failed" });
      await safeAddFlowLog(env, {
        pageId,
        psid: candidate.psid,
        flowId: flow.id,
        flowName: flow.name || "",
        level: "error",
        event: "manual_missing_tag_failed",
        message: "Falha no disparo manual para contato sem tag.",
        data: { tag, error: error.message || "run_failed" },
        force: true
      });
    }
  }

  await safeAddFlowLog(env, {
    pageId,
    flowId: flow.id,
    flowName: flow.name || "",
    level: "info",
    event: "manual_missing_tag_finished",
    message: "Disparo manual para contatos sem tag finalizado.",
    data: {
      tag,
      checked: result.checked,
      triggered: result.triggered,
      skippedHasTag: result.skippedHasTag,
      skippedOutsideWindow: result.skippedOutsideWindow,
      failed: result.failed
    },
    force: true
  });

  return json(result);
}

async function recentInboundCandidates(config, pageId, pageAccessToken, limit) {
  const conversations = await graphFetch(
    graphUrl(config, `/${pageId}/conversations`, {
      fields: "id,updated_time,participants,senders,snippet",
      limit: String(Math.max(limit, 10)),
      access_token: pageAccessToken
    })
  );

  const candidates = [];
  for (const conversation of conversations.data || []) {
    if (candidates.length >= limit) break;
    const inbound = await latestInboundMessage(config, conversation.id, pageId, pageAccessToken);
    if (!inbound) continue;
    candidates.push({
      conversationId: conversation.id || "",
      psid: inbound.psid,
      name: inbound.name,
      lastInboundAt: inbound.createdAt,
      preview: inbound.message
    });
  }

  return candidates;
}

async function latestInboundMessage(config, conversationId, pageId, pageAccessToken) {
  if (!conversationId) return null;
  const result = await fetchConversationMessages(config, conversationId, pageAccessToken);
  const inbound = (result.data || []).find((message) => message.from?.id && String(message.from.id) !== String(pageId));
  if (!inbound) return null;
  return {
    psid: String(inbound.from?.id || ""),
    name: inbound.from?.name || "",
    message: inbound.message || attachmentSummary(inbound),
    createdAt: inbound.created_time || ""
  };
}

async function fetchConversationMessages(config, conversationId, pageAccessToken) {
  const fieldSets = [
    "id,message,from,created_time,attachments,sticker",
    "id,message,from,created_time,attachments",
    "id,message,from,created_time"
  ];

  let lastError = null;
  for (const fields of fieldSets) {
    try {
      return await graphFetch(
        graphUrl(config, `/${conversationId}/messages`, {
          fields,
          limit: "10",
          access_token: pageAccessToken
        })
      );
    } catch (error) {
      if (!isAttachmentFieldError(error)) throw error;
      lastError = error;
    }
  }

  throw lastError || new Error("Could not fetch messages");
}

async function authorizeRunMissingTagRequest(request, env) {
  const authorization = request.headers.get("authorization") || "";
  if (env.MESSENLEAD_OPERATOR_TOKEN && authorization === `Bearer ${env.MESSENLEAD_OPERATOR_TOKEN}`) {
    return { ok: true };
  }

  const session = await getSession(request, env);
  if (session?.accessToken) return { ok: true };

  return {
    ok: false,
    response: json({ error: "Login required to run missing tag flow" }, 401)
  };
}

function contactHasTag(contact, tag) {
  if (!contact || !tag) return false;
  const target = normalizeTagKey(tag);
  return normalizeTags(contact.tags || contact.tag).some((item) => normalizeTagKey(item) === target);
}

function normalizeTagName(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function normalizeTagKey(value) {
  return normalizeTagName(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function isInsideReplyWindow(value) {
  const timestamp = Date.parse(value || "");
  return Number.isFinite(timestamp) && Date.now() <= timestamp + RESPONSE_WINDOW_MS;
}

function attachmentSummary(message = {}) {
  if (message.sticker) return "Sticker";
  const attachments = message.attachments?.data || [];
  if (!attachments.length) return "Mensagem sem texto";
  return attachments.map((attachment) => attachment.mime_type || attachment.type || "Anexo").join(", ");
}

function isAttachmentFieldError(error) {
  const message = `${error.message || ""} ${error.payload?.error?.message || ""}`.toLowerCase();
  return message.includes("nonexisting field") || message.includes("attachments") || message.includes("sticker") || message.includes("file_url");
}

function clampNumber(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, Math.floor(number)));
}
