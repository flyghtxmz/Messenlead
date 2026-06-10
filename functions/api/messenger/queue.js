import { getSession, json } from "../../_lib/meta.js";
import { processMessengerSendQueue } from "../../_lib/messengerDelivery.js";
import { processMessengerFlowContinuations, processMessengerLinkClickTimeouts } from "./webhook.js";

export async function onRequestPost({ request, env }) {
  const auth = await authorizeQueueRequest(request, env);
  if (auth) return auth;

  let body = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  return processQueueRequest(env, {
    pageId: body.pageId || "",
    continuationId: body.continuationId || "",
    continuationLimit: body.continuationLimit || env.MESSENLEAD_FLOW_CONTINUATION_LIMIT || 8,
    linkClickTimeoutLimit: body.linkClickTimeoutLimit || env.MESSENLEAD_LINK_CLICK_TIMEOUT_LIMIT || 8,
    sendLimit: body.limit || env.MESSENLEAD_QUEUE_DRAIN_LIMIT || 12
  });
}

export async function onRequestGet({ request, env }) {
  const auth = await authorizeQueueRequest(request, env);
  if (auth) return auth;

  const url = new URL(request.url);

  return processQueueRequest(env, {
    pageId: url.searchParams.get("pageId") || "",
    continuationId: url.searchParams.get("continuationId") || "",
    continuationLimit: url.searchParams.get("continuationLimit") || env.MESSENLEAD_FLOW_CONTINUATION_LIMIT || 8,
    linkClickTimeoutLimit: url.searchParams.get("linkClickTimeoutLimit") || env.MESSENLEAD_LINK_CLICK_TIMEOUT_LIMIT || 8,
    sendLimit: url.searchParams.get("limit") || env.MESSENLEAD_QUEUE_DRAIN_LIMIT || 12
  });
}

async function processQueueRequest(env, options = {}) {
  const pageId = options.pageId || "";
  const continuationId = String(options.continuationId || "").trim();
  const stages = {};
  const errors = [];

  const continuations = await runQueueStage("continuations", errors, () =>
    processMessengerFlowContinuations(env, {
      pageId,
      continuationId,
      limit: options.continuationLimit || env.MESSENLEAD_FLOW_CONTINUATION_LIMIT || 8
    })
  );
  stages.continuations = continuations;

  if (!continuationId) {
    stages.linkClickTimeouts = await runQueueStage("linkClickTimeouts", errors, () =>
      processMessengerLinkClickTimeouts(env, {
        pageId,
        limit: options.linkClickTimeoutLimit || env.MESSENLEAD_LINK_CLICK_TIMEOUT_LIMIT || 8
      })
    );

    stages.result = await runQueueStage("sendQueue", errors, () =>
      processMessengerSendQueue(env, {
        pageId,
        limit: options.sendLimit || env.MESSENLEAD_QUEUE_DRAIN_LIMIT || 12
      })
    );
  } else {
    stages.linkClickTimeouts = { skipped: true, reason: "continuation_id_request" };
    stages.result = { skipped: true, reason: "continuation_id_request" };
  }

  const continuationFailed = errors.some((error) => error.stage === "continuations");
  return json({
    ok: !continuationFailed,
    continuationId,
    continuations: stages.continuations,
    linkClickTimeouts: stages.linkClickTimeouts,
    result: stages.result,
    errors
  }, continuationFailed ? 500 : 200);
}

async function runQueueStage(stage, errors, fn) {
  try {
    return await fn();
  } catch (error) {
    errors.push({
      stage,
      message: String(error?.message || error || "Queue stage failed").slice(0, 1000)
    });
    return { error: String(error?.message || error || "Queue stage failed").slice(0, 1000) };
  }
}

async function authorizeQueueRequest(request, env) {
  const authorization = request.headers.get("authorization") || "";
  if (env.MESSENLEAD_OPERATOR_TOKEN && authorization === `Bearer ${env.MESSENLEAD_OPERATOR_TOKEN}`) {
    return null;
  }

  const session = await getSession(request, env);
  if (session?.accessToken) return null;

  return json({ error: "Unauthorized" }, 401);
}
