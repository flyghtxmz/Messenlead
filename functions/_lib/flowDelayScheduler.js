export async function scheduleDelayWorkflow(env, options = {}) {
  const url = clean(env.MESSENLEAD_DELAY_WORKFLOW_URL || env.MESSENLEAD_FLOW_DELAY_WORKFLOW_URL, 500);
  const secret = clean(
    env.MESSENLEAD_DELAY_WORKFLOW_SECRET ||
      env.MESSENLEAD_FLOW_DELAY_WORKFLOW_SECRET ||
      env.MESSENLEAD_SEND_RELAY_SECRET,
    500
  );

  if (!url || !secret) {
    return { configured: false, ok: false, reason: "not_configured" };
  }

  const continuationId = clean(options.continuationId, 120);
  const pageId = clean(options.pageId, 120);
  const psid = clean(options.psid, 120);
  const flowId = clean(options.flowId, 120);
  const delayNodeId = clean(options.delayNodeId, 120);
  const resumeNodeId = clean(options.resumeNodeId, 120);
  const dueAt = clean(options.dueAt, 80);

  if (!continuationId || !pageId || !dueAt || !Number.isFinite(Date.parse(dueAt))) {
    return { configured: true, ok: false, reason: "invalid_payload" };
  }

  try {
    const response = await fetch(workflowEndpointUrl(url, "/schedule"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Messenlead-Workflow-Secret": secret
      },
      body: JSON.stringify({
        continuationId,
        pageId,
        psid,
        flowId,
        delayNodeId,
        resumeNodeId,
        dueAt,
        policyExpiresAt: clean(options.policyExpiresAt, 80)
      })
    });
    const body = await response.json().catch(() => ({}));
    return {
      configured: true,
      ok: response.ok && body.ok !== false,
      status: response.status,
      body,
      workflowInstanceId: body.workflowInstanceId || body.id || ""
    };
  } catch (error) {
    return {
      configured: true,
      ok: false,
      status: 0,
      reason: "request_failed",
      error: error.message || "workflow_schedule_failed"
    };
  }
}

function workflowEndpointUrl(value, path) {
  const base = String(value || "").replace(/\/+$/g, "");
  if (base.endsWith(path)) return base;
  return `${base}${path}`;
}

function clean(value, max = 1000) {
  return String(value || "").trim().slice(0, max);
}
