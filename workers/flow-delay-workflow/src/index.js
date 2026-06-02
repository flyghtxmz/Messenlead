import { WorkflowEntrypoint } from "cloudflare:workers";

const DEFAULT_PRIMARY_QUEUE_URL = "https://messenlead.pages.dev/api/messenger/queue";

export class MessenleadDelayWorkflow extends WorkflowEntrypoint {
  async run(event, step) {
    const payload = schedulePayload(event.payload || {});
    const dueTime = Date.parse(payload.dueAt);

    if (Number.isFinite(dueTime) && dueTime > Date.now() + 1000) {
      await step.sleepUntil(`Delay ${payload.continuationId}`, new Date(dueTime));
    }

    return step.do(
      "Processar continuacao no Pages principal",
      {
        retries: {
          limit: 4,
          delay: "10 seconds",
          backoff: "exponential"
        },
        timeout: "30 seconds"
      },
      async () => drainPrimaryQueue(this.env, payload)
    );
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/health") {
      return json({
        ok: true,
        service: "messenlead-flow-delay-workflow",
        hasWorkflow: Boolean(env.MESSENLEAD_DELAY_WORKFLOW),
        primaryQueueUrlConfigured: Boolean(primaryQueueUrl(env)),
        primaryQueueTokenConfigured: Boolean(clean(env.MESSENLEAD_PRIMARY_QUEUE_TOKEN || env.MESSENLEAD_OPERATOR_TOKEN, 500)),
        scheduleSecretConfigured: Boolean(clean(env.MESSENLEAD_DELAY_WORKFLOW_SECRET, 500))
      });
    }

    const authError = authorize(request, env);
    if (authError) return authError;

    if (request.method === "POST" && url.pathname === "/schedule") {
      const body = await readJson(request);
      if (!body) return json({ error: "Invalid JSON" }, 400);

      const payload = schedulePayload(body);
      const validation = validateSchedulePayload(payload);
      if (validation) return json({ error: validation }, 400);
      if (!env.MESSENLEAD_DELAY_WORKFLOW) return json({ error: "Workflow binding is not configured" }, 500);

      const id = workflowInstanceId(payload.continuationId);
      try {
        const instance = await env.MESSENLEAD_DELAY_WORKFLOW.create({
          id,
          params: payload
        });
        return json({
          ok: true,
          created: true,
          workflowInstanceId: instance.id,
          continuationId: payload.continuationId,
          dueAt: payload.dueAt
        });
      } catch (error) {
        const existing = await workflowStatus(env, id);
        if (existing.ok) {
          return json({
            ok: true,
            created: false,
            existing: true,
            workflowInstanceId: id,
            continuationId: payload.continuationId,
            dueAt: payload.dueAt,
            status: existing.status
          });
        }
        return json({
          ok: false,
          error: error.message || "workflow_create_failed",
          workflowInstanceId: id
        }, 500);
      }
    }

    if (request.method === "GET" && url.pathname === "/status") {
      const id = clean(url.searchParams.get("id"), 100);
      if (!id) return json({ error: "id is required" }, 400);
      const status = await workflowStatus(env, id);
      return json(status, status.ok ? 200 : 404);
    }

    return json({ error: "Not found" }, 404);
  }
};

async function drainPrimaryQueue(env, payload) {
  const queueUrl = primaryQueueUrl(env);
  const token = clean(env.MESSENLEAD_PRIMARY_QUEUE_TOKEN || env.MESSENLEAD_OPERATOR_TOKEN, 500);
  if (!queueUrl || !token) {
    throw new Error("Primary queue URL or token is not configured");
  }

  const response = await fetch(queueUrl, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      pageId: payload.pageId,
      continuationId: payload.continuationId,
      continuationLimit: 1,
      limit: Number(env.MESSENLEAD_PRIMARY_QUEUE_DRAIN_LIMIT || 12)
    })
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`Primary queue failed with HTTP ${response.status}: ${JSON.stringify(body).slice(0, 500)}`);
  }
  return {
    ok: true,
    status: response.status,
    body
  };
}

async function workflowStatus(env, id) {
  if (!env.MESSENLEAD_DELAY_WORKFLOW) return { ok: false, error: "Workflow binding is not configured" };
  try {
    const instance = await env.MESSENLEAD_DELAY_WORKFLOW.get(id);
    return {
      ok: true,
      workflowInstanceId: id,
      status: await instance.status()
    };
  } catch (error) {
    return {
      ok: false,
      workflowInstanceId: id,
      error: error.message || "workflow_status_failed"
    };
  }
}

function schedulePayload(value = {}) {
  return {
    continuationId: clean(value.continuationId, 120),
    pageId: clean(value.pageId, 120),
    psid: clean(value.psid, 120),
    flowId: clean(value.flowId, 120),
    delayNodeId: clean(value.delayNodeId, 120),
    resumeNodeId: clean(value.resumeNodeId, 120),
    dueAt: clean(value.dueAt, 80),
    policyExpiresAt: clean(value.policyExpiresAt, 80)
  };
}

function validateSchedulePayload(payload) {
  if (!payload.continuationId) return "continuationId is required";
  if (!payload.pageId) return "pageId is required";
  if (!payload.dueAt || !Number.isFinite(Date.parse(payload.dueAt))) return "dueAt must be a valid ISO date";
  return "";
}

function workflowInstanceId(continuationId) {
  return `delay-${clean(continuationId, 92)}`;
}

function primaryQueueUrl(env) {
  return clean(env.MESSENLEAD_PRIMARY_QUEUE_URL || DEFAULT_PRIMARY_QUEUE_URL, 500);
}

function authorize(request, env) {
  const expected = clean(env.MESSENLEAD_DELAY_WORKFLOW_SECRET, 500);
  if (!expected) return json({ error: "MESSENLEAD_DELAY_WORKFLOW_SECRET is not configured" }, 500);

  const actual = clean(request.headers.get("X-Messenlead-Workflow-Secret"), 500);
  if (actual !== expected) return json({ error: "Unauthorized" }, 401);
  return null;
}

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

function json(value, status = 200) {
  return new Response(JSON.stringify(value), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  });
}

function clean(value, max = 1000) {
  return String(value || "").trim().slice(0, max);
}
