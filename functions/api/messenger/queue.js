import { getSession, json } from "../../_lib/meta.js";
import { processMessengerSendQueue } from "../../_lib/messengerDelivery.js";

export async function onRequestPost({ request, env }) {
  const auth = await authorizeQueueRequest(request, env);
  if (auth) return auth;

  let body = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const result = await processMessengerSendQueue(env, {
    pageId: body.pageId || "",
    limit: body.limit || env.MESSENLEAD_QUEUE_DRAIN_LIMIT || 12
  });

  return json({ ok: true, result });
}

export async function onRequestGet({ request, env }) {
  const auth = await authorizeQueueRequest(request, env);
  if (auth) return auth;

  const url = new URL(request.url);
  const result = await processMessengerSendQueue(env, {
    pageId: url.searchParams.get("pageId") || "",
    limit: url.searchParams.get("limit") || env.MESSENLEAD_QUEUE_DRAIN_LIMIT || 12
  });

  return json({ ok: true, result });
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
