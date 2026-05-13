import { listFlows } from "../../_lib/flows.js";
import { getStoredPageAccessToken } from "../../_lib/pages.js";
import { applyContactActions, getContact, normalizeActionSteps, upsertContact } from "../../_lib/contacts.js";
import { safeAddFlowLog } from "../../_lib/flowLogs.js";
import { createMessengerContactToken } from "../../_lib/pixel.js";
import {
  consumeFlowLinkClickWait,
  consumeFlowResponseWait,
  processFlowContinuations,
  processFlowLinkClickWaitTimeouts,
  scheduleFlowContinuation,
  scheduleFlowLinkClickWait,
  scheduleFlowResponseWait
} from "../../_lib/flowContinuations.js";
import { enqueueMessengerReplies, messengerEventDedupId, processMessengerSendQueue, reserveMessengerEvent } from "../../_lib/messengerDelivery.js";

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
  const rawText = new TextDecoder().decode(rawBody);
  const signatureOk = await verifyMetaSignature(request, rawBody, env.MESSENGER_APP_SECRET);

  if (!signatureOk) {
    const payload = parsePayloadForDiagnostics(rawText);
    await safeAddFlowLog(env, {
      pageId: pageIdFromPayload(payload),
      level: "error",
      event: "invalid_signature",
      message: "Webhook recebeu POST, mas a assinatura da Meta não validou.",
      data: {
        hasSignature: Boolean(request.headers.get("x-hub-signature-256") || request.headers.get("x-hub-signature")),
        bodyPreview: rawText.slice(0, 800)
      }
    });
    return new Response("Invalid signature", { status: 403 });
  }

  let payload;
  try {
    payload = JSON.parse(rawText);
  } catch {
    await safeAddFlowLog(env, {
      pageId: "__global__",
      level: "error",
      event: "invalid_json",
      message: "Webhook recebeu POST com JSON inválido.",
      data: { bodyPreview: rawText.slice(0, 800) }
    });
    return new Response("Invalid JSON", { status: 400 });
  }

  if (payload.object !== "page") {
    await safeAddFlowLog(env, {
      pageId: pageIdFromPayload(payload),
      level: "warn",
      event: "ignored_object",
      message: "Webhook recebeu evento que não é de Página.",
      data: { object: payload.object || "", bodyPreview: rawText.slice(0, 800) }
    });
    return new Response("Ignored", { status: 200 });
  }

  const work = [];
  let eventCount = 0;
  for (const entry of payload.entry || []) {
    for (const event of entry.messaging || []) {
      eventCount += 1;
      work.push(handleMessengerEvent(event, env, entry.id));
    }
    for (const event of entry.standby || []) {
      eventCount += 1;
      work.push(handleMessengerEvent(event, env, entry.id, { channel: "standby" }));
    }
  }

  if (!eventCount) {
    await safeAddFlowLog(env, {
      pageId: pageIdFromPayload(payload),
      level: "warn",
      event: "no_messaging_events",
      message: "Webhook recebeu payload de Página, mas sem eventos de messaging.",
      data: { bodyPreview: rawText.slice(0, 800) }
    });
  }
  await Promise.all(work);

  return new Response("EVENT_RECEIVED", { status: 200 });
}

export async function handleMessengerEvent(event, env, pageId, options = {}) {
  const isDryRun = Boolean(options.dryRun || options.simulated);
  const isManualRun = !isDryRun && Boolean(String(options.manualFlowId || "").trim());
  const forceLog = Boolean(options.forceLogs);
  if (options.channel === "standby") {
    await safeAddFlowLog(env, {
      pageId,
      psid: event.sender?.id || "",
      level: "warn",
      event: "standby_received",
      message: "Mensagem chegou no canal standby. Outro app pode estar como receptor primário da Página.",
      data: {
        eventType: event.message ? "message" : event.postback ? "postback" : "unknown",
        text: event.message?.text || event.postback?.payload || "",
        note: "Configure este app como Primary Receiver na Meta para executar automações e responder."
      },
      force: forceLog
    });
  }

  if (!isProcessableMessengerEvent(event)) {
    await safeAddFlowLog(env, {
      pageId,
      psid: event.sender?.id || "",
      level: "info",
      event: "non_message_event_ignored",
      message: "Evento ignorado porque nao e mensagem, postback, opt-in ou referral.",
      data: {
        channel: options.channel || "messaging",
        eventKeys: Object.keys(event || {})
      },
      force: forceLog
    });
    return { ok: false, status: "ignored", reason: "non_processable_event" };
  }

  if (event.message?.is_echo) {
    await safeAddFlowLog(env, {
      pageId,
      psid: event.sender?.id || "",
      level: "info",
      event: "echo_ignored",
      message: "Evento ignorado porque é eco de mensagem enviada pela própria Página.",
      data: { mid: event.message?.mid || "" }
    });
    return { ok: false, status: "ignored", reason: "echo_event" };
  }

  const psid = event.sender?.id;
  if (!psid) {
    await safeAddFlowLog(env, {
      pageId,
      level: "warn",
      event: "missing_psid",
      message: "Evento de Messenger chegou sem sender.id.",
      data: { event }
    });
    return { ok: false, status: "ignored", reason: "missing_psid" };
  }

  const context = eventContext(event, { channel: options.channel || "messaging" });
  const log = flowEventLogger(env, pageId, psid, { force: forceLog });
  const eventId = messengerEventDedupId(pageId, event);
  const dedup = await reserveMessengerEvent(env, {
    id: eventId,
    pageId,
    psid,
    eventType: context.eventType
  });
  if (!dedup.reserved) {
    await log("warn", "duplicate_event_ignored", "Evento duplicado ignorado antes de executar fluxo.", {
      eventId
    });
    return { ok: false, status: "ignored", reason: "duplicate_event", eventId };
  }

  await log("info", "event_received", "Mensagem recebida pelo webhook.", {
    eventId,
    eventType: context.eventType,
    channel: context.channel,
    sourceLabel: context.sourceLabel,
    text: context.text,
    hasReferral: context.hasReferral,
    hasAdReferral: context.hasAdReferral,
    referralRef: context.referralRef,
    referralSource: context.referralSource,
    adId: context.adId,
    adTitle: context.adTitle
  });

  const dryRunStoredContact = isDryRun && options.testContactPsid ? await getContact(env, pageId, psid) : null;
  const profile = isDryRun
    ? { name: dryRunStoredContact?.name || "Teste Anuncio" }
    : await fetchMessengerUserProfile(env, pageId, psid, log);
  let contact = isDryRun
    ? dryRunStoredContact || {
        psid,
        pageId,
        name: profile.name,
        tags: [],
        customFields: {},
        status: "open",
        source: "Simulacao de anuncio",
        lastSeen: event.timestamp ? new Date(event.timestamp).toISOString() : new Date().toISOString()
      }
    : await upsertContact(env, pageId, {
        psid,
        name: profile?.name || "",
        status: "open",
        source: isManualRun ? "Disparo manual de fluxo" : "Messenger webhook",
        lastSeen: options.lastSeen || (event.timestamp ? new Date(event.timestamp).toISOString() : new Date().toISOString())
      });
  if (isDryRun && options.testTag) {
    contact = dryRunContactWithTestTag(contact, options.testTag, options.testTagMode);
  }

  await log("info", "contact_loaded", "Contato carregado para avaliar o fluxo.", {
    name: contact.name || "",
    tags: contact.tags || [],
    status: contact.status || "",
    dryRunTestTag: isDryRun ? options.testTag || "" : "",
    dryRunTestTagMode: isDryRun ? options.testTagMode || "" : ""
  });

  const policyExpiresAt = options.policyExpiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const flowContext = {
    ...context,
    eventId,
    policyExpiresAt,
    dryRun: isDryRun,
    testFlowId: isDryRun ? String(options.testFlowId || "").trim() : "",
    testVersion: isDryRun ? String(options.testVersion || "published").trim() : "",
    manualFlowId: isManualRun ? String(options.manualFlowId || "").trim() : ""
  };
  const execution = isManualRun
    ? await buildReplies(flowContext, env, pageId, contact, log)
    : (await buildRepliesFromResponseWait(flowContext, env, pageId, contact, log)) ||
      (await buildReplies(flowContext, env, pageId, contact, log));
  const { replies, actions, flow, continuation, responseWait, linkClickWait } = execution;
  if (actions.length && isDryRun) {
    await log("info", "test_actions_prepared", "Teste preparou acoes, mas nao alterou o contato real.", { actions }, flow);
  } else if (actions.length) {
    await applyContactActions(env, pageId, psid, actions, {
      psid,
      status: "open",
      source: isManualRun ? "Disparo manual de fluxo" : "Messenger webhook",
      lastSeen: options.lastSeen || (event.timestamp ? new Date(event.timestamp).toISOString() : new Date().toISOString())
    });
    await log("info", "actions_applied", "Ações do fluxo foram aplicadas no contato.", { actions }, flow);
  }

  if (responseWait) {
    await log("info", "flow_waiting_for_response", "Fluxo pausado ate o contato responder.", {
      responseWaitId: responseWait.id,
      waitNodeId: responseWait.waitNodeId,
      resumeNodeId: responseWait.resumeNodeId,
      expiresAt: responseWait.expiresAt || ""
    }, flow);
  }

  if (linkClickWait) {
    await log("info", "flow_waiting_for_link_click", "Fluxo pausado ate o contato clicar no link anterior.", {
      linkClickWaitId: linkClickWait.id,
      waitNodeId: linkClickWait.waitNodeId,
      resumeNodeId: linkClickWait.resumeNodeId,
      sourceNodeId: linkClickWait.sourceNodeId || "",
      expiresAt: linkClickWait.expiresAt || ""
    }, flow);
  }

  if (!replies.length) {
    if (continuation) {
      await log("info", "flow_waiting", "Fluxo pausado até o bloco de espera vencer.", {
        continuationId: continuation.id,
        dueAt: continuation.dueAt,
        resumeNodeId: continuation.resumeNodeId
      }, flow);
      return { ok: true, status: "waiting_delay", replyCount: 0, actionCount: actions.length, flowId: flow?.id || "", continuationId: continuation.id };
    }
    if (responseWait) {
      return { ok: true, status: "waiting_response", replyCount: 0, actionCount: actions.length, flowId: flow?.id || "", responseWaitId: responseWait.id };
    }
    if (linkClickWait) {
      return { ok: true, status: "waiting_link_click", replyCount: 0, actionCount: actions.length, flowId: flow?.id || "", linkClickWaitId: linkClickWait.id };
    }
    await log("warn", "no_replies", "O fluxo terminou sem resposta para enviar.", { actions }, flow);
    return { ok: true, status: "no_replies", replyCount: 0, actionCount: actions.length, flowId: flow?.id || "" };
  }

  if (isDryRun) {
    await log("info", "test_replies_prepared", "Teste preparou respostas sem enviar para o Messenger.", {
      replyCount: replies.length,
      replies: replies.map((reply) => ({
        type: reply.type || "text",
        text: String(reply.text || "").slice(0, 240),
        quickReplyCount: Array.isArray(reply.quickReplies) ? reply.quickReplies.length : 0,
        buttonCount: Array.isArray(reply.buttons) ? reply.buttons.length : 0
      }))
    }, flow);
    return { ok: true, status: "dry_run_replies", replyCount: replies.length, actionCount: actions.length, flowId: flow?.id || "" };
  }

  const queued = await enqueueMessengerReplies(env, {
    pageId,
    psid,
    replies: replies.slice(0, 5),
    flow,
    eventId,
    policyExpiresAt
  });
  await log("info", "replies_queued", "Respostas enfileiradas para envio.", {
    queuedCount: queued.length,
    queueIds: queued,
    policyExpiresAt
  }, flow);

  const hasLocalQueued = queued.some((id) => !isExternalRelayQueueId(id));
  const drain = hasLocalQueued
    ? await processMessengerSendQueue(env, {
      pageId,
      limit: Number(env.MESSENLEAD_WEBHOOK_SEND_DRAIN_LIMIT || 5)
    })
    : { processed: 0, sent: 0, retried: 0, skipped: 0, failed: 0, externalRelay: queued.some(isExternalRelayQueueId) };
  await log("info", "queue_drain_finished", "Processamento imediato da fila finalizado.", drain, flow);
  return {
    ok: true,
    status: "queued",
    replyCount: replies.length,
    actionCount: actions.length,
    queuedCount: queued.length,
    queueIds: queued,
    drain,
    flowId: flow?.id || ""
  };
}

function isProcessableMessengerEvent(event = {}) {
  return Boolean(event.message || event.postback || event.optin || event.referral);
}

function isExternalRelayQueueId(value) {
  return String(value || "").startsWith("relay_") || String(value || "").startsWith("ext_");
}

export async function processMessengerFlowContinuations(env, options = {}) {
  return processFlowContinuations(env, async (continuation) => {
    const pageId = continuation.pageId;
    const psid = continuation.psid;
    const log = flowEventLogger(env, pageId, psid);
    const activeFlow = await activeFlowById(env, pageId, continuation.flowId);

    if (!activeFlow) {
      await log("warn", "delay_skipped_inactive_flow", "Espera ignorada porque o fluxo nao esta mais ativo.", {
        continuationId: continuation.id,
        flowId: continuation.flowId,
        resumeNodeId: continuation.resumeNodeId
      }, continuation.flow);
      return { status: "skipped", reason: "Flow is not active" };
    }

    const start = activeFlow.nodes?.find((node) => node.id === continuation.resumeNodeId);
    if (!start || start.type === "trigger" || start.type === "comment") {
      await log("warn", "delay_skipped_missing_node", "Espera ignorada porque o proximo bloco nao existe mais.", {
        continuationId: continuation.id,
        flowId: continuation.flowId,
        resumeNodeId: continuation.resumeNodeId
      }, activeFlow);
      return { status: "skipped", reason: "Resume node not found" };
    }

    const contact = (await getContact(env, pageId, psid)) || continuation.contact || { psid, pageId };
    await log("info", "delay_resuming", "Retomando fluxo apos espera.", {
      continuationId: continuation.id,
      delayNodeId: continuation.delayNodeId,
      resumeNodeId: continuation.resumeNodeId,
      dueAt: continuation.dueAt
    }, activeFlow);

    const result = await executeFlowFromNode({
      context: {
        ...serializableFlowContext(continuation.context),
        eventId: continuationRuntimeEventId(continuation),
        policyExpiresAt: continuation.policyExpiresAt || "",
        resumedFromDelay: true
      },
      env,
      pageId,
      contact,
      log,
      flow: activeFlow,
      start
    });

    if (result.actions.length) {
      await applyContactActions(env, pageId, psid, result.actions, {
        psid,
        status: contact.status || "open",
        source: "Messenger delay",
        lastSeen: contact.lastSeen || new Date().toISOString()
      });
      await log("info", "actions_applied", "Acoes da retomada foram aplicadas no contato.", {
        actions: result.actions
      }, activeFlow);
    }

    if (result.replies.length) {
      const queued = await enqueueMessengerReplies(env, {
        pageId,
        psid,
        replies: result.replies.slice(0, 5),
        flow: activeFlow,
        eventId: continuationRuntimeEventId(continuation),
        policyExpiresAt: continuation.policyExpiresAt || ""
      });
      await log("info", "replies_queued", "Respostas retomadas enfileiradas para envio.", {
        queuedCount: queued.length,
        queueIds: queued,
        policyExpiresAt: continuation.policyExpiresAt || ""
      }, activeFlow);

      const hasLocalQueued = queued.some((id) => !isExternalRelayQueueId(id));
      if (hasLocalQueued) {
        const drain = await processMessengerSendQueue(env, {
          pageId,
          limit: Number(env.MESSENLEAD_CONTINUATION_SEND_DRAIN_LIMIT || env.MESSENLEAD_QUEUE_DRAIN_LIMIT || 5)
        });
        await log("info", "queue_drain_finished", "Fila processada apos retomada da espera.", drain, activeFlow);
      }
    }

    if (result.responseWait) {
      await log("info", "flow_waiting_for_response", "Fluxo pausado ate o contato responder apos a retomada.", {
        responseWaitId: result.responseWait.id,
        waitNodeId: result.responseWait.waitNodeId,
        resumeNodeId: result.responseWait.resumeNodeId,
        expiresAt: result.responseWait.expiresAt || ""
      }, activeFlow);
    }

    if (result.linkClickWait) {
      await log("info", "flow_waiting_for_link_click", "Fluxo pausado ate o contato clicar no link apos a retomada.", {
        linkClickWaitId: result.linkClickWait.id,
        waitNodeId: result.linkClickWait.waitNodeId,
        resumeNodeId: result.linkClickWait.resumeNodeId,
        sourceNodeId: result.linkClickWait.sourceNodeId || "",
        expiresAt: result.linkClickWait.expiresAt || ""
      }, activeFlow);
    }

    if (!result.replies.length && !result.continuation && !result.responseWait && !result.linkClickWait) {
      await log("warn", "no_replies", "Retomada do fluxo terminou sem resposta para enviar.", {
        continuationId: continuation.id,
        actions: result.actions
      }, activeFlow);
    }

    return { status: "processed", continuation: result.continuation, responseWait: result.responseWait, linkClickWait: result.linkClickWait };
  }, options);
}

export async function processMessengerLinkClickWait(env, pixelEvent = {}) {
  const wait = await consumeFlowLinkClickWait(env, pixelEvent);
  if (!wait) return { processed: false, skipped: true };

  const pageId = wait.pageId;
  const psid = wait.psid;
  const log = flowEventLogger(env, pageId, psid);
  const activeFlow = await activeFlowById(env, pageId, wait.flowId);

  if (!activeFlow) {
    await log("warn", "link_click_wait_inactive_flow", "Clique recebido, mas o fluxo que aguardava nao esta mais ativo.", {
      linkClickWaitId: wait.id,
      flowId: wait.flowId,
      waitNodeId: wait.waitNodeId,
      resumeNodeId: wait.resumeNodeId
    }, wait.flow);
    return { processed: false, skipped: true, reason: "Flow is not active" };
  }

  const start = activeFlow.nodes?.find((node) => node.id === wait.resumeNodeId);
  if (!start || start.type === "trigger" || start.type === "comment") {
    await log("warn", "link_click_wait_missing_node", "Clique recebido, mas o proximo bloco da espera nao existe mais.", {
      linkClickWaitId: wait.id,
      flowId: wait.flowId,
      waitNodeId: wait.waitNodeId,
      resumeNodeId: wait.resumeNodeId
    }, activeFlow);
    return { processed: false, skipped: true, reason: "Resume node not found" };
  }

  const contact = (await getContact(env, pageId, psid)) || wait.contact || { psid, pageId };
  await log("info", "link_click_wait_resuming", "Retomando fluxo apos clique no link.", {
    linkClickWaitId: wait.id,
    waitNodeId: wait.waitNodeId,
    resumeNodeId: wait.resumeNodeId,
    sourceNodeId: wait.sourceNodeId || "",
    pixelEventId: pixelEvent.id || "",
    eventType: pixelEvent.eventType || "",
    targetUrl: pixelEvent.targetUrl || pixelEvent.url || ""
  }, activeFlow);

  const eventId = linkClickRuntimeEventId(wait, pixelEvent);
  const result = await executeFlowFromNode({
    context: {
      ...serializableFlowContext(wait.context),
      eventId,
      policyExpiresAt: wait.policyExpiresAt || wait.context?.policyExpiresAt || "",
      eventType: "pixel_link_click",
      resumedFromLinkClick: true,
      linkClickEventId: pixelEvent.id || ""
    },
    env,
    pageId,
    contact,
    log,
    flow: activeFlow,
    start
  });

  if (result.actions.length) {
    await applyContactActions(env, pageId, psid, result.actions, {
      psid,
      status: contact.status || "open",
      source: "Messenger link click",
      lastSeen: contact.lastSeen || new Date().toISOString()
    });
    await log("info", "actions_applied", "Acoes da retomada por clique foram aplicadas no contato.", {
      actions: result.actions
    }, activeFlow);
  }

  if (result.replies.length) {
    const queued = await enqueueMessengerReplies(env, {
      pageId,
      psid,
      replies: result.replies.slice(0, 5),
      flow: activeFlow,
      eventId,
      policyExpiresAt: wait.policyExpiresAt || wait.context?.policyExpiresAt || ""
    });
    await log("info", "replies_queued", "Respostas apos clique enfileiradas para envio.", {
      queuedCount: queued.length,
      queueIds: queued,
      policyExpiresAt: wait.policyExpiresAt || wait.context?.policyExpiresAt || ""
    }, activeFlow);

    const hasLocalQueued = queued.some((id) => !isExternalRelayQueueId(id));
    if (hasLocalQueued) {
      const drain = await processMessengerSendQueue(env, {
        pageId,
        limit: Number(env.MESSENLEAD_LINK_CLICK_SEND_DRAIN_LIMIT || env.MESSENLEAD_QUEUE_DRAIN_LIMIT || 5)
      });
      await log("info", "queue_drain_finished", "Fila processada apos retomada por clique.", drain, activeFlow);
    }
  }

  if (result.continuation) {
    await log("info", "flow_waiting", "Fluxo pausado ate o bloco de espera vencer apos clique.", {
      continuationId: result.continuation.id,
      dueAt: result.continuation.dueAt,
      resumeNodeId: result.continuation.resumeNodeId
    }, activeFlow);
  }

  if (result.responseWait) {
    await log("info", "flow_waiting_for_response", "Fluxo pausado ate o contato responder apos clique.", {
      responseWaitId: result.responseWait.id,
      waitNodeId: result.responseWait.waitNodeId,
      resumeNodeId: result.responseWait.resumeNodeId,
      expiresAt: result.responseWait.expiresAt || ""
    }, activeFlow);
  }

  if (result.linkClickWait) {
    await log("info", "flow_waiting_for_link_click", "Fluxo pausado ate outro clique no link.", {
      linkClickWaitId: result.linkClickWait.id,
      waitNodeId: result.linkClickWait.waitNodeId,
      resumeNodeId: result.linkClickWait.resumeNodeId,
      sourceNodeId: result.linkClickWait.sourceNodeId || "",
      expiresAt: result.linkClickWait.expiresAt || ""
    }, activeFlow);
  }

  if (!result.replies.length && !result.continuation && !result.responseWait && !result.linkClickWait) {
    await log("warn", "no_replies", "Retomada por clique terminou sem resposta para enviar.", {
      linkClickWaitId: wait.id,
      actions: result.actions
    }, activeFlow);
  }

  return {
    processed: true,
    replies: result.replies.length,
    actions: result.actions.length,
    continuation: result.continuation || null,
    responseWait: result.responseWait || null,
    linkClickWait: result.linkClickWait || null
  };
}

export async function processMessengerLinkClickTimeouts(env, options = {}) {
  return processFlowLinkClickWaitTimeouts(env, async (wait) => {
    const pageId = wait.pageId;
    const psid = wait.psid;
    const log = flowEventLogger(env, pageId, psid);
    const activeFlow = await activeFlowById(env, pageId, wait.flowId);

    if (!activeFlow) {
      await log("warn", "link_click_wait_timeout_inactive_flow", "Tempo de clique venceu, mas o fluxo nao esta mais ativo.", {
        linkClickWaitId: wait.id,
        flowId: wait.flowId,
        waitNodeId: wait.waitNodeId,
        timeoutResumeNodeId: wait.timeoutResumeNodeId || ""
      }, wait.flow);
      return { status: "skipped", reason: "Flow is not active" };
    }

    const resumeNodeId = wait.timeoutResumeNodeId || "";
    const start = activeFlow.nodes?.find((node) => node.id === resumeNodeId);
    if (!start || start.type === "trigger" || start.type === "comment") {
      await log("warn", "link_click_wait_timeout_missing_node", "Tempo de clique venceu, mas o bloco de nao clicou nao existe mais.", {
        linkClickWaitId: wait.id,
        flowId: wait.flowId,
        waitNodeId: wait.waitNodeId,
        timeoutResumeNodeId: resumeNodeId
      }, activeFlow);
      return { status: "skipped", reason: "Timeout resume node not found" };
    }

    const contact = (await getContact(env, pageId, psid)) || wait.contact || { psid, pageId };
    await log("info", "link_click_wait_timeout_resuming", "Retomando fluxo pela saida Nao clicou.", {
      linkClickWaitId: wait.id,
      waitNodeId: wait.waitNodeId,
      timeoutResumeNodeId: resumeNodeId,
      sourceNodeId: wait.sourceNodeId || "",
      expiresAt: wait.expiresAt || ""
    }, activeFlow);

    const eventId = linkClickTimeoutRuntimeEventId(wait);
    const result = await executeFlowFromNode({
      context: {
        ...serializableFlowContext(wait.context),
        eventId,
        policyExpiresAt: wait.policyExpiresAt || wait.context?.policyExpiresAt || "",
        eventType: "link_click_timeout",
        resumedFromLinkClickTimeout: true
      },
      env,
      pageId,
      contact,
      log,
      flow: activeFlow,
      start
    });

    if (result.actions.length) {
      await applyContactActions(env, pageId, psid, result.actions, {
        psid,
        status: contact.status || "open",
        source: "Messenger link click timeout",
        lastSeen: contact.lastSeen || new Date().toISOString()
      });
      await log("info", "actions_applied", "Acoes da saida Nao clicou foram aplicadas no contato.", {
        actions: result.actions
      }, activeFlow);
    }

    if (result.replies.length) {
      const queued = await enqueueMessengerReplies(env, {
        pageId,
        psid,
        replies: result.replies.slice(0, 5),
        flow: activeFlow,
        eventId,
        policyExpiresAt: wait.policyExpiresAt || wait.context?.policyExpiresAt || ""
      });
      await log("info", "replies_queued", "Respostas da saida Nao clicou enfileiradas para envio.", {
        queuedCount: queued.length,
        queueIds: queued,
        policyExpiresAt: wait.policyExpiresAt || wait.context?.policyExpiresAt || ""
      }, activeFlow);

      const hasLocalQueued = queued.some((id) => !isExternalRelayQueueId(id));
      if (hasLocalQueued) {
        const drain = await processMessengerSendQueue(env, {
          pageId,
          limit: Number(env.MESSENLEAD_LINK_CLICK_TIMEOUT_SEND_DRAIN_LIMIT || env.MESSENLEAD_QUEUE_DRAIN_LIMIT || 5)
        });
        await log("info", "queue_drain_finished", "Fila processada apos saida Nao clicou.", drain, activeFlow);
      }
    }

    if (!result.replies.length && !result.continuation && !result.responseWait && !result.linkClickWait) {
      await log("warn", "no_replies", "Saida Nao clicou terminou sem resposta para enviar.", {
        linkClickWaitId: wait.id,
        actions: result.actions
      }, activeFlow);
    }

    return {
      status: "processed",
      continuation: result.continuation || null,
      responseWait: result.responseWait || null,
      linkClickWait: result.linkClickWait || null
    };
  }, options);
}

async function buildReplies(context, env, pageId, contact = null, log = null) {
  const startedAt = Date.now();
  const timeoutMs = context.dryRun ? dryRunFlowTimeoutMs(env) : flowTimeoutMs(env);
  const deadline = startedAt + timeoutMs;
  const testFlowId = context.dryRun ? String(context.testFlowId || "").trim() : "";
  const manualFlowId = !context.dryRun ? String(context.manualFlowId || "").trim() : "";
  const selectedFlowId = testFlowId || manualFlowId;
  const useDraftForTest = context.dryRun && selectedFlowId && context.testVersion === "draft";
  const dbFlows = pageId ? await listFlows(env, pageId, useDraftForTest ? {} : { status: "active" }) : [];
  const flows = dbFlows.length ? dbFlows : parseFlows(env.MESSENLEAD_FLOW_JSON);
  const activeFlows = selectedFlowId
    ? flows.filter((flow) => flow.id === selectedFlowId && (useDraftForTest || flow.status === "active"))
    : flows.filter((flow) => flow.status === "active");
  await log?.("info", "active_flows_loaded", testFlowId ? "Fluxo selecionado carregado para teste." : "Fluxos ativos carregados para a Página.", {
    activeFlowCount: activeFlows.length,
    source: dbFlows.length ? "D1" : "MESSENLEAD_FLOW_JSON",
    selectedFlowId,
    testFlowId,
    manualFlowId,
    testVersion: context.testVersion || ""
  });
  const flow =
    selectedFlowId
      ? activeFlows[0]
      : activeFlows.find((item) => flowMatchesInput(item, context)) || activeFlows[0];

  if (!flow) {
    const allFlows = pageId ? await listFlows(env, pageId) : [];
    await log?.("warn", "no_active_flow", "Nenhum fluxo ativo foi encontrado para esta Página.", {
      activeFlowCount: activeFlows.length,
      totalFlowCount: allFlows.length,
      statusCounts: flowStatusCounts(allFlows),
      publishedFlowCount: allFlows.filter((item) => Array.isArray(item.publishedNodes)).length,
      selectedFlowId,
      testFlowId,
      manualFlowId
    });
    return { replies: [], actions: [], flow: null };
  }

  await log?.("info", "flow_started", `Fluxo iniciado: ${flow.name || flow.id}.`, {
    flowId: flow.id,
    flowName: flow.name || "",
    trigger: flow.trigger || "",
    nodeCount: flow.nodes?.length || 0
  }, flow);

  const start = manualFlowId
    ? flow.nodes?.find((node) => node.type === "trigger") || flow.nodes?.[0]
    : interactiveStartNode(flow, context) ||
      flow.nodes?.find((node) => node.type === "trigger" && triggerMatchesEvent(node, flow, context)) ||
      flow.nodes?.find((node) => node.type === "trigger") ||
      flow.nodes?.[0];

  if (!start) {
    await log?.("warn", "no_start_node", "O fluxo selecionado não possui bloco inicial.", {}, flow);
    return { replies: [], actions: [], flow };
  }

  const executableStart = executableStartNode(flow, start, { ...context, contact: runtimeContactFrom(contact), flow });
  await log?.("info", "start_node_selected", `Bloco inicial: ${nodeLogName(start)}.`, {
    nodeId: start.id,
    nodeType: start.type,
    executableNodeId: executableStart?.id || "",
    executableNodeType: executableStart?.type || ""
  }, flow);

  if (!executableStart) {
    await log?.("warn", "no_executable_start_node", "O gatilho inicial nao aponta para um bloco executavel.", {
      startNodeId: start.id,
      startNodeType: start.type,
      targetId: nextExecutableTargetId(start, { ...context, contact: runtimeContactFrom(contact), flow }) || ""
    }, flow);
    return { replies: [], actions: [], flow };
  }

  const executionStartedAt = Date.now();
  return executeFlowFromNode({
    context,
    env,
    pageId,
    contact,
    log,
    flow,
    start: executableStart,
    startedAt: executionStartedAt,
    deadline: executionStartedAt + timeoutMs,
    timeoutMs
  });

  const replies = [];
  const actions = [];
  const runtimeContact = runtimeContactFrom(contact);
  let current = start;
  let guard = 0;
  let previousNode = null;
  let lastMessageLinkNode = null;

  while (current && guard < 12) {
    if (Date.now() > deadline) {
      await log?.("error", "flow_timeout", "Execucao do fluxo interrompida por timeout.", {
        timeoutMs,
        elapsedMs: Date.now() - startedAt,
        lastNodeId: current.id || ""
      }, flow);
      break;
    }

    guard += 1;
    const stepContext = { ...context, contact: runtimeContact, flow };
    await log?.("info", "node_enter", `Executando bloco: ${nodeLogName(current)}.`, {
      step: guard,
      nodeId: current.id,
      nodeType: current.type,
      nodeTitle: current.title || current.name || "",
      contactTags: runtimeContact.tags || []
    }, flow);

    if (current.type === "message") {
      const nodeReplies = repliesForMessageNode(current, stepContext);
      replies.push(...nodeReplies);
      await log?.("info", "message_prepared", "Mensagem preparada para envio.", {
        nodeId: current.id,
        replyCount: nodeReplies.length,
        replyTypes: nodeReplies.map((reply) => reply.type || "text")
      }, flow);
    }

    if (current.type === "action") {
      const nodeActions = actionStepsForNode(current);
      actions.push(...nodeActions);
      applyRuntimeContactActions(runtimeContact, nodeActions);
      await log?.("info", "action_node_executed", "Bloco de ação executado no estado do contato.", {
        nodeId: current.id,
        actions: nodeActions,
        resultingTags: runtimeContact.tags || []
      }, flow);
    }

    if (current.type === "condition") {
      const matched = conditionMatchesNode(current, stepContext);
      await log?.(matched ? "info" : "warn", "condition_result", `Condição ${matched ? "correspondeu" : "não correspondeu"}.`, {
        nodeId: current.id,
        result: matched ? "yes" : "no",
        conditions: current.conditions || [],
        contactTags: runtimeContact.tags || [],
        yesNext: current.yesNext || "",
        noNext: current.noNext || ""
      }, flow);
    }

    const targetId = nextExecutableTargetId(current, stepContext);
    const next = targetId ? flow.nodes.find((item) => item.id === targetId) : null;
    await log?.(next ? "info" : "warn", "next_node", next ? `Próximo bloco: ${nodeLogName(next)}.` : "Nenhum próximo bloco executável encontrado.", {
      fromNodeId: current.id,
      targetId: targetId || "",
      nextNodeId: next?.id || "",
      nextNodeType: next?.type || ""
    }, flow);
    current = next && next.type !== "trigger" && next.type !== "comment" ? next : null;
  }

  if (guard >= 12 && current) {
    await log?.("warn", "guard_limit", "Execução interrompida para evitar loop no fluxo.", {
      lastNodeId: current.id
    }, flow);
  }

  await log?.("info", "flow_finished", "Execução do fluxo finalizada.", {
    replyCount: replies.length,
    actionCount: actions.length
  }, flow);

  return { replies, actions, flow };
}

async function buildRepliesFromResponseWait(context, env, pageId, contact = null, log = null) {
  if (context.dryRun) return null;
  const psid = String(contact?.psid || "").trim();
  if (!psid) return null;

  const wait = await consumeFlowResponseWait(env, pageId, psid);
  if (!wait) return null;

  const activeFlow = await activeFlowById(env, pageId, wait.flowId);
  if (!activeFlow) {
    await log?.("warn", "user_response_wait_inactive_flow", "Resposta recebida, mas o fluxo que aguardava nao esta mais ativo.", {
      responseWaitId: wait.id,
      flowId: wait.flowId,
      waitNodeId: wait.waitNodeId,
      resumeNodeId: wait.resumeNodeId
    }, wait.flow);
    return { replies: [], actions: [], flow: wait.flow || null, continuation: null, responseWait: null, responseWaitHandled: true };
  }

  const start = activeFlow.nodes?.find((node) => node.id === wait.resumeNodeId);
  if (!start || start.type === "trigger" || start.type === "comment") {
    await log?.("warn", "user_response_wait_missing_node", "Resposta recebida, mas o proximo bloco da espera nao existe mais.", {
      responseWaitId: wait.id,
      flowId: wait.flowId,
      waitNodeId: wait.waitNodeId,
      resumeNodeId: wait.resumeNodeId
    }, activeFlow);
    return { replies: [], actions: [], flow: activeFlow, continuation: null, responseWait: null, responseWaitHandled: true };
  }

  const waitNode = activeFlow.nodes?.find((node) => node.id === wait.waitNodeId) || wait.waitNode || {};
  normalizeNodeShape(waitNode);
  const responseText = context.text || "";
  const runtimeContact = runtimeContactFrom(contact || wait.contact || { psid, pageId });
  const responseActions = [];

  if (waitNode.saveResponse !== false && waitNode.responseField && responseText) {
    responseActions.push({
      type: "set_user_field",
      fieldName: waitNode.responseField,
      fieldValue: responseText
    });
    applyRuntimeContactActions(runtimeContact, responseActions);
  }

  await log?.("info", "user_response_wait_resuming", "Retomando fluxo com a resposta do contato.", {
    responseWaitId: wait.id,
    waitNodeId: wait.waitNodeId,
    resumeNodeId: wait.resumeNodeId,
    savedField: waitNode.responseField || "",
    hasResponseText: Boolean(responseText)
  }, activeFlow);

  const result = await executeFlowFromNode({
    context: {
      ...serializableFlowContext(wait.context),
      ...context,
      responseText,
      resumedFromUserInput: true,
      ignoreMessageOptionRouting: true
    },
    env,
    pageId,
    contact: runtimeContact,
    log,
    flow: activeFlow,
    start
  });

  return {
    ...result,
    actions: [...responseActions, ...(result.actions || [])],
    responseWaitHandled: true
  };
}

async function executeFlowFromNode({ context, env, pageId, contact, log, flow, start, startedAt = Date.now(), deadline = Date.now() + flowTimeoutMs(env), timeoutMs = flowTimeoutMs(env) }) {
  const replies = [];
  const actions = [];
  const runtimeContact = runtimeContactFrom(contact);
  let current = start;
  let guard = 0;
  let previousNode = null;
  let lastMessageLinkNode = null;

  while (current && guard < 12) {
    if (Date.now() > deadline) {
      await log?.("error", "flow_timeout", "Execucao do fluxo interrompida por timeout.", {
        timeoutMs,
        elapsedMs: Date.now() - startedAt,
        lastNodeId: current.id || ""
      }, flow);
      break;
    }

    guard += 1;
    const stepContext = { ...context, contact: runtimeContact, flow };
    await log?.("info", "node_enter", `Executando bloco: ${nodeLogName(current)}.`, {
      step: guard,
      nodeId: current.id,
      nodeType: current.type,
      nodeTitle: current.title || current.name || "",
      contactTags: runtimeContact.tags || []
    }, flow);

    if (current.type === "delay") {
      const targetId = nextExecutableTargetId(current, stepContext);
      const next = targetId ? flow.nodes.find((item) => item.id === targetId) : null;
      if (!next || next.type === "trigger" || next.type === "comment") {
        await log?.("warn", "next_node", "Bloco de espera sem proximo passo executavel.", {
          fromNodeId: current.id,
          targetId: targetId || ""
        }, flow);
        current = null;
        break;
      }

      const dueAt = delayDueAt(current, runtimeContact, env);
      if (Date.parse(dueAt) <= Date.now() + 1000) {
        await log?.("info", "delay_elapsed", "Espera ja venceu; fluxo continua sem agendar.", {
          delayNodeId: current.id,
          resumeNodeId: next.id,
          dueAt
        }, flow);
        previousNode = current;
        current = next;
        continue;
      }

      if (context.dryRun) {
        await log?.("info", "test_wait_prepared", "Teste encontrou um bloco de espera e nao agendou continuacao real.", {
          waitType: "delay",
          delayNodeId: current.id,
          resumeNodeId: next.id,
          dueAt
        }, flow);
        return { replies, actions, flow, continuation: null, responseWait: null, linkClickWait: null };
      }

      const continuation = await scheduleFlowContinuation(env, {
        pageId,
        psid: runtimeContact.psid || contact?.psid || "",
        flow,
        delayNode: current,
        resumeNodeId: next.id,
        context: serializableFlowContext(context),
        contact: runtimeContact,
        eventId: context.eventId || "",
        dueAt,
        policyExpiresAt: context.policyExpiresAt || ""
      });

      await log?.("info", "delay_scheduled", "Fluxo pausado pelo bloco de espera.", {
        continuationId: continuation?.id || "",
        delayNodeId: current.id,
        resumeNodeId: next.id,
        dueAt,
        policyExpiresAt: context.policyExpiresAt || ""
      }, flow);

      return { replies, actions, flow, continuation, responseWait: null, linkClickWait: null };
    }

    if (current.type === "user_input") {
      const targetId = nextExecutableTargetId(current, stepContext);
      const next = targetId ? flow.nodes.find((item) => item.id === targetId) : null;
      if (!next || next.type === "trigger" || next.type === "comment") {
        await log?.("warn", "next_node", "Bloco de aguardar resposta sem proximo passo executavel.", {
          fromNodeId: current.id,
          targetId: targetId || ""
        }, flow);
        current = null;
        break;
      }

      if (context.dryRun) {
        await log?.("info", "test_wait_prepared", "Teste encontrou um bloco de aguardar resposta e nao criou espera real.", {
          waitType: "user_input",
          waitNodeId: current.id,
          resumeNodeId: next.id,
          responseField: current.responseField || ""
        }, flow);
        return { replies, actions, flow, continuation: null, responseWait: null, linkClickWait: null };
      }

      const responseWait = await scheduleFlowResponseWait(env, {
        pageId,
        psid: runtimeContact.psid || contact?.psid || "",
        flow,
        waitNode: current,
        resumeNodeId: next.id,
        context: serializableFlowContext(context),
        contact: runtimeContact,
        eventId: context.eventId || ""
      });

      await log?.("info", "user_response_wait_scheduled", "Fluxo pausado para aguardar a resposta do contato.", {
        responseWaitId: responseWait?.id || "",
        waitNodeId: current.id,
        resumeNodeId: next.id,
        responseField: current.responseField || "",
        expiresAt: responseWait?.expiresAt || ""
      }, flow);

      return { replies, actions, flow, continuation: null, responseWait, linkClickWait: null };
    }

    if (current.type === "link_click_wait") {
      const targetId = current.clickedNext || current.next || nextExecutableTargetId(current, stepContext);
      const next = targetId ? flow.nodes.find((item) => item.id === targetId) : null;
      if (!next || next.type === "trigger" || next.type === "comment") {
        await log?.("warn", "next_node", "Bloco de aguardar clique sem proximo passo executavel.", {
          fromNodeId: current.id,
          targetId: targetId || ""
        }, flow);
        current = null;
        break;
      }

      if (context.dryRun) {
        await log?.("info", "test_wait_prepared", "Teste encontrou um bloco de aguardar clique e nao criou espera real.", {
          waitType: "link_click_wait",
          waitNodeId: current.id,
          resumeNodeId: next.id,
          timeoutResumeNodeId: current.noClickNext || ""
        }, flow);
        return { replies, actions, flow, continuation: null, responseWait: null, linkClickWait: null };
      }

      const sourceNode = (previousNode?.type === "message" && messageNodeTrackedLinks(previousNode).length)
        ? previousNode
        : lastMessageLinkNode || findPreviousMessageLinkNode(flow, current);
      const sourceLinkUrls = messageNodeTrackedLinks(sourceNode);
      if (!sourceNode || !sourceLinkUrls.length) {
        await log?.("warn", "link_click_wait_without_source", "Aguardar clique no link precisa vir depois de uma mensagem com botao de URL rastreado.", {
          waitNodeId: current.id,
          resumeNodeId: next.id,
          previousNodeId: previousNode?.id || "",
          previousNodeType: previousNode?.type || ""
        }, flow);
        return { replies, actions, flow, continuation: null, responseWait: null, linkClickWait: null };
      }

      const linkClickWait = await scheduleFlowLinkClickWait(env, {
        pageId,
        psid: runtimeContact.psid || contact?.psid || "",
        flow,
        waitNode: current,
        resumeNodeId: next.id,
        timeoutResumeNodeId: current.noClickNext || "",
        sourceNodeId: sourceNode?.id || "",
        sourceLinkUrls,
        context: serializableFlowContext(context),
        contact: runtimeContact,
        eventId: context.eventId || "",
        policyExpiresAt: context.policyExpiresAt || ""
      });

      await log?.("info", "link_click_wait_scheduled", "Fluxo pausado para aguardar clique no link.", {
        linkClickWaitId: linkClickWait?.id || "",
        waitNodeId: current.id,
        resumeNodeId: next.id,
        sourceNodeId: sourceNode?.id || "",
        sourceLinkCount: sourceLinkUrls.length,
        expiresAt: linkClickWait?.expiresAt || ""
      }, flow);

      return { replies, actions, flow, continuation: null, responseWait: null, linkClickWait };
    }

    if (current.type === "message") {
      const nodeReplies = repliesForMessageNode(current, stepContext);
      replies.push(...nodeReplies);
      if (messageNodeTrackedLinks(current).length) lastMessageLinkNode = current;
      await log?.("info", "message_prepared", "Mensagem preparada para envio.", {
        nodeId: current.id,
        replyCount: nodeReplies.length,
        replyTypes: nodeReplies.map((reply) => reply.type || "text")
      }, flow);
    }

    if (current.type === "action") {
      const nodeActions = actionStepsForNode(current);
      actions.push(...nodeActions);
      applyRuntimeContactActions(runtimeContact, nodeActions);
      await log?.("info", "action_node_executed", "Bloco de acao executado no estado do contato.", {
        nodeId: current.id,
        actions: nodeActions,
        resultingTags: runtimeContact.tags || []
      }, flow);
    }

    if (current.type === "condition") {
      const matched = conditionMatchesNode(current, stepContext);
      await log?.(matched ? "info" : "warn", "condition_result", `Condicao ${matched ? "correspondeu" : "nao correspondeu"}.`, {
        nodeId: current.id,
        result: matched ? "yes" : "no",
        conditions: current.conditions || [],
        contactTags: runtimeContact.tags || [],
        yesNext: current.yesNext || "",
        noNext: current.noNext || ""
      }, flow);
    }

    const targetId = nextExecutableTargetId(current, stepContext);
    const next = targetId ? flow.nodes.find((item) => item.id === targetId) : null;
    await log?.(next ? "info" : "warn", "next_node", next ? `Proximo bloco: ${nodeLogName(next)}.` : "Nenhum proximo bloco executavel encontrado.", {
      fromNodeId: current.id,
      targetId: targetId || "",
      nextNodeId: next?.id || "",
      nextNodeType: next?.type || ""
    }, flow);
    previousNode = current;
    current = next && next.type !== "trigger" && next.type !== "comment" ? next : null;
  }

  if (guard >= 12 && current) {
    await log?.("warn", "guard_limit", "Execucao interrompida para evitar loop no fluxo.", {
      lastNodeId: current.id
    }, flow);
  }

  await log?.("info", "flow_finished", "Execucao do fluxo finalizada.", {
    replyCount: replies.length,
    actionCount: actions.length
  }, flow);

  return { replies, actions, flow, continuation: null, responseWait: null, linkClickWait: null };
}

function flowEventLogger(env, pageId, psid, options = {}) {
  return async (level, event, message, data = {}, flow = null) => {
    await safeAddFlowLog(env, {
      pageId,
      psid,
      flowId: flow?.id || data.flowId || "",
      flowName: flow?.name || data.flowName || "",
      level,
      event,
      message,
      data,
      force: Boolean(options.force)
    });
  };
}

function nodeLogName(node) {
  return `${node.type || "node"} ${node.title || node.name || node.id || ""}`.trim();
}

function parsePayloadForDiagnostics(rawText) {
  try {
    return JSON.parse(rawText);
  } catch {
    return null;
  }
}

function pageIdFromPayload(payload) {
  return payload?.entry?.find((entry) => entry?.id)?.id || "__global__";
}

function flowTimeoutMs(env) {
  const value = Number(env.MESSENLEAD_FLOW_TIMEOUT_MS || 12000);
  if (!Number.isFinite(value)) return 12000;
  return Math.max(3000, Math.min(30000, Math.floor(value)));
}

function dryRunFlowTimeoutMs(env) {
  const value = Number(env.MESSENLEAD_FLOW_TEST_TIMEOUT_MS || env.MESSENLEAD_FLOW_TIMEOUT_MS || 20000);
  if (!Number.isFinite(value)) return 20000;
  return Math.max(3000, Math.min(30000, Math.floor(value)));
}

async function activeFlowById(env, pageId, flowId) {
  const id = String(flowId || "").trim();
  if (!id) return null;
  const flows = await listFlows(env, pageId, { status: "active" });
  return flows.find((flow) => flow.id === id) || parseFlows(env.MESSENLEAD_FLOW_JSON).find((flow) => flow.id === id && flow.status === "active") || null;
}

function continuationRuntimeEventId(continuation = {}) {
  return [
    "delay",
    continuation.id || "",
    continuation.resumeNodeId || "",
    continuation.dueAt || ""
  ].join(":");
}

function linkClickRuntimeEventId(wait = {}, event = {}) {
  return [
    "link_click",
    wait.id || "",
    wait.resumeNodeId || "",
    event.id || event.createdAt || ""
  ].join(":");
}

function linkClickTimeoutRuntimeEventId(wait = {}) {
  return [
    "link_click_timeout",
    wait.id || "",
    wait.timeoutResumeNodeId || "",
    wait.expiresAt || ""
  ].join(":");
}

function serializableFlowContext(context = {}) {
  return {
    text: context.text || "",
    normalizedInput: context.normalizedInput || "",
    eventType: context.eventType || "",
    referralRef: context.referralRef || "",
    referralSource: context.referralSource || "",
    hasReferral: Boolean(context.hasReferral),
    eventId: context.eventId || "",
    policyExpiresAt: context.policyExpiresAt || "",
    resumedFromDelay: Boolean(context.resumedFromDelay),
    resumedFromUserInput: Boolean(context.resumedFromUserInput),
    resumedFromLinkClick: Boolean(context.resumedFromLinkClick),
    resumedFromLinkClickTimeout: Boolean(context.resumedFromLinkClickTimeout),
    linkClickEventId: context.linkClickEventId || "",
    responseText: context.responseText || ""
  };
}

function delayDueAt(node, contact = {}, env = {}) {
  normalizeNodeShape(node);
  const now = Date.now();
  let due = now;

  if (node.delayType === "date") {
    due = parseDelayDate(node.specificDate, now);
  } else if (node.delayType === "dynamic_date") {
    const fieldValue = contact?.customFields?.[node.dynamicField] || contact?.[node.dynamicField] || "";
    due = parseDelayDate(fieldValue, now);
  } else {
    due = now + delayDurationMs(node);
  }

  return applyDelayWindow(new Date(due), node, env).toISOString();
}

function delayDurationMs(node) {
  const value = Math.max(0, Number(node.delayValue ?? node.delayMinutes) || 0);
  const unit = String(node.delayUnit || "minutes");
  if (unit === "days") return value * 24 * 60 * 60 * 1000;
  if (unit === "hours") return value * 60 * 60 * 1000;
  return value * 60 * 1000;
}

function parseDelayDate(value, fallback) {
  const text = String(value || "").trim();
  if (!text) return fallback;
  const normalized = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(text) ? `${text}:00` : text;
  const parsed = Date.parse(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function applyDelayWindow(date, node, env) {
  const start = timeToMinutes(node.continueStart);
  const end = timeToMinutes(node.continueEnd);
  const days = String(node.continueDays || "any");
  if (start == null && end == null && days === "any") return date;

  const offsetMinutes = Number(env.MESSENLEAD_FLOW_TIMEZONE_OFFSET_MINUTES || env.MESSENLEAD_TIMEZONE_OFFSET_MINUTES || 0);
  const offset = Number.isFinite(offsetMinutes) ? offsetMinutes : 0;
  let local = new Date(date.getTime() + offset * 60 * 1000);

  for (let guard = 0; guard < 14; guard += 1) {
    if (!dayAllowed(local, days)) {
      local = startOfNextLocalDay(local, start ?? 0);
      continue;
    }

    if (start != null && minutesOfDay(local) < start) {
      local = setLocalMinutes(local, start);
    }

    if (end != null && minutesOfDay(local) > end) {
      local = startOfNextLocalDay(local, start ?? 0);
      continue;
    }

    return new Date(local.getTime() - offset * 60 * 1000);
  }

  return date;
}

function timeToMinutes(value) {
  const match = String(value || "").match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const hours = Math.max(0, Math.min(23, Number(match[1]) || 0));
  const minutes = Math.max(0, Math.min(59, Number(match[2]) || 0));
  return hours * 60 + minutes;
}

function minutesOfDay(date) {
  return date.getUTCHours() * 60 + date.getUTCMinutes();
}

function setLocalMinutes(date, minutes) {
  const next = new Date(date);
  next.setUTCHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
  return next;
}

function startOfNextLocalDay(date, minutes) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + 1);
  next.setUTCHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
  return next;
}

function dayAllowed(date, mode) {
  if (mode === "any") return true;
  const day = date.getUTCDay();
  if (mode === "weekdays") return day >= 1 && day <= 5;
  if (mode === "weekends") return day === 0 || day === 6;
  return true;
}

async function fetchMessengerUserProfile(env, pageId, psid, log = null) {
  const pageAccessToken = pageId ? await getStoredPageAccessToken(env, pageId) : "";
  if (!pageAccessToken) {
    await log?.("warn", "profile_lookup_skipped", "Nome do contato nao foi consultado: token da Pagina nao encontrado.", {});
    return null;
  }

  const version = String(env.META_GRAPH_API_VERSION || "v23.0").trim() || "v23.0";
  const url = new URL(`https://graph.facebook.com/${version}/${encodeURIComponent(psid)}`);
  url.searchParams.set("fields", "first_name,last_name,profile_pic");
  url.searchParams.set("access_token", pageAccessToken);

  try {
    const response = await fetch(url);
    const text = await response.text().catch(() => "");
    const payload = parseJsonObject(text);

    if (!response.ok) {
      await log?.("warn", "profile_lookup_failed", "Meta nao retornou o nome do contato.", {
        status: response.status,
        error: payload?.error?.message || text.slice(0, 300)
      });
      return null;
    }

    const profile = normalizeMessengerProfile(payload);
    if (!profile.name) {
      await log?.("warn", "profile_name_missing", "Perfil Messenger foi encontrado, mas sem nome retornado pela Meta.", {
        hasFirstName: Boolean(payload?.first_name),
        hasLastName: Boolean(payload?.last_name),
        hasProfilePic: Boolean(payload?.profile_pic)
      });
      return null;
    }

    await log?.("info", "profile_resolved", "Nome do contato resolvido pela Meta.", {
      hasProfilePic: Boolean(profile.profilePic)
    });
    return profile;
  } catch (error) {
    await log?.("warn", "profile_lookup_failed", "Falha ao consultar o nome do contato na Meta.", {
      error: error.message || "unknown_error"
    });
    return null;
  }
}

function normalizeMessengerProfile(payload = {}) {
  const firstName = cleanText(payload.first_name);
  const lastName = cleanText(payload.last_name);
  return {
    name: cleanText([firstName, lastName].filter(Boolean).join(" ")),
    firstName,
    lastName,
    profilePic: cleanText(payload.profile_pic)
  };
}

function parseJsonObject(text) {
  try {
    const parsed = JSON.parse(text || "{}");
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function cleanText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function runtimeContactFrom(contact = {}) {
  const customFields = contact?.customFields && typeof contact.customFields === "object" ? { ...contact.customFields } : {};
  return {
    ...(contact || {}),
    tags: normalizeTags(contact?.tags || contact?.tag),
    customFields
  };
}

function dryRunContactWithTestTag(contact = {}, tagName = "", tagMode = "has") {
  const tag = cleanText(tagName);
  if (!tag) return runtimeContactFrom(contact);
  const target = normalizeTagKey(tag);
  const base = runtimeContactFrom(contact);
  const withoutTag = normalizeTags(base.tags).filter((item) => normalizeTagKey(item) !== target);
  return {
    ...base,
    tags: tagMode === "missing" ? withoutTag : normalizeTags([...withoutTag, tag])
  };
}

function applyRuntimeContactActions(contact, actions = []) {
  if (!contact) return;

  normalizeActionSteps(actions).forEach((action) => {
    if (action.type === "add_tag" && action.tag) {
      contact.tags = normalizeTags([...(contact.tags || []), action.tag]);
    }
    if (action.type === "remove_tag" && action.tag) {
      const tagKey = normalizeTagKey(action.tag);
      contact.tags = normalizeTags(contact.tags).filter((tag) => normalizeTagKey(tag) !== tagKey);
    }
    if (action.type === "set_user_field" && action.fieldName) {
      contact.customFields = contact.customFields && typeof contact.customFields === "object" ? contact.customFields : {};
      contact.customFields[action.fieldName] = action.fieldValue || "";
    }
    if (action.type === "clear_custom_field" && action.fieldName && contact.customFields) {
      delete contact.customFields[action.fieldName];
    }
    if (action.type === "delete_contact") {
      contact.status = "deleted";
    }
    if (action.type === "open_inbox") {
      contact.status = "open";
    }
  });
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

function executableStartNode(flow, start, context = {}) {
  if (!start) return null;
  if (start.type !== "trigger" && start.type !== "comment") return start;
  return nextExecutableNode(flow, start, context);
}

function nextExecutableTargetId(node, context = {}) {
  if (!node) return null;
  normalizeNodeShape(node);
  if (node.type === "condition") return conditionMatchesNode(node, context) ? node.yesNext : node.noNext;
  if (node.type === "randomizer") return pickRandomVariation(node, context)?.next || null;
  if (node.type === "link_click_wait") return node.clickedNext || node.next || null;
  if (node.type === "message") {
    const option = context.ignoreMessageOptionRouting ? null : matchingMessageOption(node, context);
    return option?.next || node.next || null;
  }
  return node.next || null;
}

function interactiveStartNode(flow, context) {
  if (!["postback", "quick_reply"].includes(context.eventType)) return null;

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
  const blockButtons = (node.contentBlocks || []).flatMap((block) => block.buttons || []);
  return [...(node.buttons || []), ...(node.quickReplies || []), ...blockButtons].find((option) => {
    return normalize(option.id) === input || normalize(option.title) === input;
  });
}

function normalizeNodeShape(node) {
  if (node.type === "message") {
    if (!Array.isArray(node.contentBlocks) || !node.contentBlocks.length) {
      node.contentBlocks = [{ id: "legacy", type: "text", text: node.message || "" }];
    }
    node.contentBlocks = node.contentBlocks.map((block, index) => ({
      id: String(block.id || `block_${index}`),
      type: String(block.type || "text"),
      text: block.text || "",
      url: block.url || "",
      title: block.title || "",
      subtitle: block.subtitle || "",
      fileName: block.fileName || "",
      fieldName: block.fieldName || "",
      endpoint: block.endpoint || "",
      items: Array.isArray(block.items) ? block.items : [],
      buttons: normalizeMessageOptions(block.buttons, "btn").slice(0, 3)
    }));
    node.quickReplies = normalizeMessageOptions(node.quickReplies, "qr");
    node.buttons = normalizeMessageOptions(node.buttons, "btn").slice(0, 3);
  }
  if (node.type === "condition") {
    node.conditionType ||= "message_contains";
    node.conditionOperator ||= "contains_any";
    node.yesNext ||= node.next || null;
    node.noNext ||= null;
    node.conditionMatch ||= "all";
    if (!Array.isArray(node.conditions)) {
      node.conditions = node.keyword
        ? [{ id: "legacy", type: node.conditionType, operator: node.conditionOperator, value: node.keyword, fieldName: node.fieldName || "" }]
        : [];
    }
  }
  if (node.type === "randomizer" && !Array.isArray(node.variations)) {
    node.variations = [{ id: "default", label: "Variação A", weight: 100, next: node.next || null }];
  }
  if (node.type === "delay") {
    node.delayType ||= "duration";
    node.delayUnit ||= "minutes";
    node.delayMinutes = Math.max(0, Number(node.delayMinutes) || 0);
    node.delayValue = Math.max(0, Number(node.delayValue ?? node.delayMinutes) || 0);
    node.continueStart ||= "";
    node.continueEnd ||= "";
    node.continueDays ||= "any";
    node.specificDate ||= "";
    node.dynamicField ||= "";
  }
  if (node.type === "user_input") {
    node.saveResponse = node.saveResponse !== false;
    node.responseField = String(node.responseField || "").trim();
    node.timeoutMinutes = Math.max(0, Number(node.timeoutMinutes) || 0);
  }
  if (node.type === "link_click_wait") {
    node.timeoutMinutes = Math.max(0, Number(node.timeoutMinutes ?? 5) || 0);
    node.clickedNext = node.clickedNext || node.next || null;
    node.noClickNext = node.noClickNext || null;
    node.next = node.clickedNext;
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
  normalizeNodeShape(node);
  if (node.conditions?.length) {
    const results = node.conditions.map((condition) => conditionRuleMatches(condition, context));
    return node.conditionMatch === "any" ? results.some(Boolean) : results.every(Boolean);
  }

  const input = normalize(context.normalizedInput || context.text || "");
  const terms = String(node.keyword || "")
    .split(",")
    .map((item) => normalize(item.trim()))
    .filter(Boolean);
  const operator = node.conditionOperator || "contains_any";

  if (node.conditionType === "tag") {
    const tags = normalizeTags(context.contact?.tags || context.contact?.tag).map(normalizeTagKey);
    if (operator === "not_contains") return terms.length ? terms.every((term) => !tags.includes(term)) : false;
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

function conditionRuleMatches(condition, context = {}) {
  const input = normalize(context.normalizedInput || context.text || "");
  const expected = condition.type === "tag" ? normalizeTagKey(condition.value) : normalize(String(condition.value || "").trim());
  if (condition.type === "tag") {
    const tags = normalizeTags(context.contact?.tags || context.contact?.tag).map(normalizeTagKey);
    if (!expected) return false;
    const hasTag = tags.includes(expected);
    return condition.operator === "not_contains" ? !hasTag : hasTag;
  }
  if (condition.type === "field") {
    const value = normalize(context.contact?.customFields?.[condition.fieldName] || context.contact?.[condition.fieldName] || "");
    if (condition.operator === "equals") return value === expected;
    if (condition.operator === "not_contains") return expected ? !value.includes(expected) : !value;
    return expected ? value.includes(expected) : Boolean(value);
  }
  const terms = String(condition.value || "")
    .split(",")
    .map((item) => normalize(item.trim()))
    .filter(Boolean);
  if (!terms.length) return true;
  if (condition.operator === "contains_all") return terms.every((term) => input.includes(term));
  if (condition.operator === "equals") return terms.some((term) => input === term);
  if (condition.operator === "not_contains") return terms.every((term) => !input.includes(term));
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

function flowStatusCounts(flows = []) {
  return flows.reduce((counts, flow) => {
    const status = String(flow?.status || "unknown");
    counts[status] = (counts[status] || 0) + 1;
    return counts;
  }, {});
}

function flowMatchesInput(flow, context) {
  const triggerNode = flow.nodes?.find((node) => node.type === "trigger");
  return triggerMatchesEvent(triggerNode, flow, context);
}

function eventContext(event, options = {}) {
  const referral = event.referral || event.message?.referral || event.postback?.referral || {};
  const adsContext = referral.ads_context_data || referral.ad_context || {};
  const inputText = event.message?.quick_reply?.payload || event.message?.text || event.postback?.payload || event.optin?.ref || referral.ref || "";
  const referralSource = normalize(referral.source || referral.type || "");
  const referralRef = normalize(referral.ref || event.optin?.ref || "");
  const adId = String(referral.ad_id || adsContext.ad_id || adsContext.adgroup_id || "").trim();
  const adTitle = String(adsContext.ad_title || adsContext.post_title || adsContext.video_title || "").trim();
  const adSignal = normalize([
    referral.source,
    referral.type,
    referral.ref,
    referral.ad_id,
    adsContext.ad_id,
    adsContext.ad_title,
    adsContext.post_title,
    adsContext.product_id,
    adsContext.flow_id
  ].filter(Boolean).join(" "));
  const hasAdReferral = Boolean(
    adId ||
    referral.ads_context_data ||
    referral.ad_context ||
    adSignal.includes(" ad") ||
    adSignal.startsWith("ad") ||
    adSignal.includes("ads") ||
    adSignal.includes("anuncio") ||
    adSignal.includes("advert")
  );
  const eventType = event.message?.quick_reply
    ? "quick_reply"
    : event.message
      ? "message"
      : event.postback
        ? "postback"
        : event.optin
          ? "optin"
          : event.referral
            ? "referral"
            : "unknown";

  return {
    text: inputText,
    normalizedInput: normalize(inputText),
    channel: options.channel || "messaging",
    eventType,
    referralRef,
    referralSource,
    hasReferral: Boolean(referral.ref || referral.source || referral.type || event.optin?.ref || hasAdReferral),
    hasAdReferral,
    adId,
    adTitle,
    sourceLabel: hasAdReferral ? "facebook_ad" : eventType
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
  if (trigger === "facebook_ad") return context.hasAdReferral;
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
  const rawKeywords = triggerKeywords(node, flow);
  if (trigger === "messenger_message") {
    return true;
  }
  if (trigger === "facebook_ad" || trigger === "facebook_comment" || trigger === "facebook_shop_message") {
    return true;
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

function triggerKeywords(node, flow) {
  const nodeKeywords = String(node?.keyword || "").trim();
  if (nodeKeywords) return nodeKeywords;
  const hasStructuredTriggers = Array.isArray(node?.triggerEvents) && node.triggerEvents.length;
  return hasStructuredTriggers ? "" : String(flow?.trigger || "");
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
  const seen = new Set();
  const tags = [];

  raw.forEach((item) => {
    const tag = String(item || "").replace(/\s+/g, " ").trim();
    const key = normalizeTagKey(tag);
    if (!tag || seen.has(key)) return;
    seen.add(key);
    tags.push(tag);
  });

  return tags;
}

function repliesForMessageNode(node, context = {}) {
  normalizeNodeShape(node);
  const tracking = messageNodeTracking(context.flow, node);
  const quickReplies = node.quickReplies.map((option) => ({
    title: option.title,
    payload: option.id || option.title
  }));
  const buttons = node.buttons.map((option) => ({
    title: option.title,
    type: option.type || "next",
    url: option.url || "",
    phone: option.phone || "",
    payload: option.id || option.title,
    tracking
  }));

  return node.contentBlocks
    .map((block, index) => {
      if (block.type === "text") {
        return {
          type: "text",
          text: resolveTemplate(block.text || node.message || "", context.contact),
          quickReplies: index === node.contentBlocks.length - 1 ? quickReplies : [],
          buttons: index === node.contentBlocks.length - 1 ? buttons : []
        };
      }
      if (block.type === "image" && block.url && block.buttons?.length) {
        return {
          type: "generic",
          elements: [
            {
              title: block.title || "Imagem",
              subtitle: block.subtitle || "",
              image_url: block.url,
              buttons: block.buttons.map((option) => ({
                title: option.title,
                type: option.type || "url",
                url: option.url || "",
                phone: option.phone || "",
                payload: option.id || option.title,
                tracking
              }))
            }
          ]
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
        return { type: "text", text: resolveTemplate(block.text || "Informe o dado solicitado.", context.contact), quickReplies };
      }
      if (block.text) return { type: "text", text: resolveTemplate(block.text, context.contact), quickReplies };
      return null;
    })
    .filter(Boolean);
}

function messageNodeTracking(flow, node) {
  if (!node || node.type !== "message") return {};
  const messageNodes = Array.isArray(flow?.nodes) ? flow.nodes.filter((item) => item.type === "message") : [];
  const index = messageNodes.findIndex((item) => item.id === node.id);
  return {
    nodeId: node.id || "",
    nodeNumber: index >= 0 ? index + 1 : "",
    nodeTitle: node.title || node.name || ""
  };
}

function messageNodeTrackedLinks(node = {}) {
  if (!node || node.type !== "message") return [];
  normalizeNodeShape(node);
  const urls = [];
  const pushUrl = (option = {}) => {
    const type = String(option.type || "").trim();
    const url = String(option.url || "").trim();
    if (!url || !["url", "web_url"].includes(type)) return;
    urls.push(url);
  };

  (node.buttons || []).forEach(pushUrl);
  (node.contentBlocks || []).forEach((block) => {
    (block.buttons || []).forEach(pushUrl);
  });

  return [...new Set(urls)];
}

function findPreviousMessageLinkNode(flow = {}, node = {}, seen = new Set()) {
  const targetId = String(node?.id || "");
  if (!targetId || seen.has(targetId)) return null;
  seen.add(targetId);

  const incoming = (flow.nodes || []).filter((item) => nodeOutputTargetIds(item).includes(targetId));
  for (const item of incoming) {
    if (item.type === "message" && messageNodeTrackedLinks(item).length) return item;
  }

  for (const item of incoming) {
    const found = findPreviousMessageLinkNode(flow, item, seen);
    if (found) return found;
  }

  return null;
}

function nodeOutputTargetIds(node = {}) {
  normalizeNodeShape(node);
  if (node.type === "condition") return [node.yesNext, node.noNext].filter(Boolean);
  if (node.type === "randomizer") return (node.variations || []).map((variation) => variation.next).filter(Boolean);
  if (node.type === "message") {
    const blockButtons = (node.contentBlocks || []).flatMap((block) => block.buttons || []);
    return [
      node.next,
      ...(node.buttons || []).map((option) => option.next),
      ...(node.quickReplies || []).map((option) => option.next),
      ...blockButtons.map((option) => option.next)
    ].filter(Boolean);
  }
  if (node.type === "link_click_wait") return [node.clickedNext || node.next, node.noClickNext].filter(Boolean);
  return [node.next].filter(Boolean);
}

async function sendMessengerReply(psid, reply, env, pageId, log = null, flow = null) {
  const pageAccessToken = (pageId ? await getStoredPageAccessToken(env, pageId) : "") || env.MESSENGER_PAGE_ACCESS_TOKEN;
  if (!pageAccessToken) {
    console.warn("Messenlead Messenger send skipped: missing page access token", { pageId });
    await log?.("error", "send_skipped", "Envio ignorado: token da Página não encontrado.", {
      replyType: reply.type || "text"
    }, flow);
    return;
  }

  const graphUrl = env.MESSENGER_GRAPH_API_URL || "https://graph.facebook.com/v23.0/me/messages";
  const message = await messengerMessagePayload(reply, env, pageId, psid);
  await log?.("info", "send_attempt", "Tentando enviar resposta pelo Messenger.", {
    replyType: reply.type || "text"
  }, flow);

  const response = await fetch(`${graphUrl}?access_token=${encodeURIComponent(pageAccessToken)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recipient: { id: psid },
      messaging_type: "RESPONSE",
      message
    })
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    console.warn("Messenlead Messenger send failed", {
      pageId,
      status: response.status,
      body: body.slice(0, 500)
    });
    await log?.("error", "send_failed", "Falha ao enviar resposta pela Graph API.", {
      status: response.status,
      body: body.slice(0, 500)
    }, flow);
    return;
  }

  const body = await response.text().catch(() => "");
  await log?.("info", "send_success", "Resposta enviada pelo Messenger.", {
    status: response.status,
    body: body.slice(0, 500)
  }, flow);
}

async function messengerMessagePayload(reply, env, pageId, psid) {
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
        elements: await Promise.all(
          reply.elements.slice(0, 10).map(async (element) => ({
            title: String(element.title || "Card").slice(0, 80),
            subtitle: String(element.subtitle || "").slice(0, 80),
            image_url: element.image_url || undefined,
            buttons: await messengerButtons(element.buttons || [], env, pageId, psid)
          }))
        )
      }
    };
  } else if (reply.buttons?.length) {
    message.attachment = {
      type: "template",
      payload: {
        template_type: "button",
        text: String(reply.text || "Escolha uma opção").slice(0, 640),
        buttons: (await messengerButtons(reply.buttons, env, pageId, psid)).slice(0, 3)
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

async function messengerButtons(buttons = [], env, pageId, psid) {
  const hasTrackedUrl = buttons.some((button) => button.type === "url" && button.url);
  const contactToken = hasTrackedUrl ? await createMessengerContactToken(env, pageId, psid) : "";

  return buttons.slice(0, 3).map((button) => {
    if (button.type === "url" && button.url) {
      return {
        type: "web_url",
        title: String(button.title || "Abrir").slice(0, 20),
        url: trackedMessengerUrl(button.url, {
          pageId,
          contactToken,
          button: button.title || button.payload || button.id || "link",
          nodeId: button.tracking?.nodeId || "",
          nodeNumber: button.tracking?.nodeNumber || "",
          nodeTitle: button.tracking?.nodeTitle || ""
        })
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

function trackedMessengerUrl(value, tracking = {}) {
  try {
    const url = new URL(value);
    if (tracking.contactToken) url.searchParams.set("ml_contact", tracking.contactToken);
    if (tracking.pageId) url.searchParams.set("ml_page_id", tracking.pageId);
    url.searchParams.set("ml_source", "messenger");
    if (tracking.button) url.searchParams.set("ml_button", String(tracking.button).slice(0, 120));
    if (tracking.nodeId) url.searchParams.set("ml_node_id", String(tracking.nodeId).slice(0, 120));
    if (tracking.nodeNumber) url.searchParams.set("ml_node_number", String(tracking.nodeNumber).slice(0, 12));
    if (tracking.nodeTitle) url.searchParams.set("ml_node_title", String(tracking.nodeTitle).slice(0, 120));
    url.searchParams.set("ml_link_id", makePixelLinkId());
    return url.toString();
  } catch {
    return value;
  }
}

function makePixelLinkId() {
  return `lnk_${crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}_${Math.random().toString(36).slice(2)}`}`;
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

function normalizeTagKey(value) {
  return normalize(String(value || "").replace(/\s+/g, " ").trim());
}

function resolveTemplate(text, contact = {}) {
  const name = cleanText(contact?.name);
  const firstName = cleanText(contact?.firstName || contact?.customFields?.first_name || name.split(" ")[0]) || "Contato";
  return String(text || "")
    .replaceAll("{{first_name}}", firstName)
    .replaceAll("{{name}}", name || firstName);
}
