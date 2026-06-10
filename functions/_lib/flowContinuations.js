const DEFAULT_PAGE_ID = "__global__";
const DEFAULT_LIMIT = 8;
const DEFAULT_MAX_ATTEMPTS = 4;

export async function ensureFlowContinuationSchema(env) {
  if (!env.DB) return false;

  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS flow_continuations (
      id TEXT PRIMARY KEY,
      page_id TEXT NOT NULL,
      psid TEXT NOT NULL,
      flow_id TEXT,
      flow_name TEXT,
      delay_node_id TEXT,
      resume_node_id TEXT NOT NULL,
      event_id TEXT,
      flow_json TEXT NOT NULL,
      context_json TEXT NOT NULL,
      contact_json TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'scheduled',
      attempts INTEGER NOT NULL DEFAULT 0,
      max_attempts INTEGER NOT NULL DEFAULT 4,
      due_at TEXT NOT NULL,
      policy_expires_at TEXT,
      last_error TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      processed_at TEXT
    )
  `).run();

  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_flow_continuations_status_due ON flow_continuations(status, due_at)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_flow_continuations_page_status_due ON flow_continuations(page_id, status, due_at)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_flow_continuations_page_psid_status ON flow_continuations(page_id, psid, status, due_at)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_flow_continuations_flow_status ON flow_continuations(flow_id, status, due_at)").run();

  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS flow_response_waits (
      id TEXT PRIMARY KEY,
      page_id TEXT NOT NULL,
      psid TEXT NOT NULL,
      flow_id TEXT,
      flow_name TEXT,
      wait_node_id TEXT,
      resume_node_id TEXT NOT NULL,
      event_id TEXT,
      flow_json TEXT NOT NULL,
      context_json TEXT NOT NULL,
      contact_json TEXT NOT NULL,
      wait_config_json TEXT NOT NULL DEFAULT '{}',
      status TEXT NOT NULL DEFAULT 'waiting',
      expires_at TEXT,
      last_error TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      consumed_at TEXT
    )
  `).run();

  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_flow_response_waits_page_psid_status ON flow_response_waits(page_id, psid, status, updated_at DESC)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_flow_response_waits_status_expires ON flow_response_waits(status, expires_at)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_flow_response_waits_flow_status ON flow_response_waits(flow_id, status, updated_at DESC)").run();

  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS flow_link_click_waits (
      id TEXT PRIMARY KEY,
      page_id TEXT NOT NULL,
      psid TEXT NOT NULL,
      flow_id TEXT,
      flow_name TEXT,
      wait_node_id TEXT,
      resume_node_id TEXT NOT NULL,
      timeout_resume_node_id TEXT,
      source_node_id TEXT,
      source_link_urls_json TEXT NOT NULL DEFAULT '[]',
      event_id TEXT,
      policy_expires_at TEXT,
      flow_json TEXT NOT NULL,
      context_json TEXT NOT NULL,
      contact_json TEXT NOT NULL,
      wait_config_json TEXT NOT NULL DEFAULT '{}',
      status TEXT NOT NULL DEFAULT 'waiting',
      expires_at TEXT,
      last_error TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      consumed_at TEXT
    )
  `).run();

  await ensureFlowLinkClickWaitColumn(env, "timeout_resume_node_id", "TEXT");

  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_flow_link_click_waits_page_psid_status ON flow_link_click_waits(page_id, psid, status, updated_at DESC)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_flow_link_click_waits_source_status ON flow_link_click_waits(page_id, source_node_id, status, updated_at DESC)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_flow_link_click_waits_status_expires ON flow_link_click_waits(status, expires_at)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_flow_link_click_waits_flow_status ON flow_link_click_waits(flow_id, status, updated_at DESC)").run();

  return true;
}

async function ensureFlowLinkClickWaitColumn(env, name, type) {
  const result = await env.DB.prepare("PRAGMA table_info(flow_link_click_waits)").all();
  const exists = (result.results || []).some((column) => column.name === name);
  if (!exists) await env.DB.prepare(`ALTER TABLE flow_link_click_waits ADD COLUMN ${name} ${type}`).run();
}

export async function scheduleFlowContinuation(env, options = {}) {
  const hasDb = await ensureFlowContinuationSchema(env);
  if (!hasDb) return null;

  await cleanupFlowContinuations(env);

  const now = new Date().toISOString();
  const pageId = normalizePageId(options.pageId);
  const psid = String(options.psid || "").trim();
  const flow = options.flow || {};
  const delayNode = options.delayNode || {};
  const resumeNodeId = String(options.resumeNodeId || "").trim();
  const dueAt = normalizeIso(options.dueAt) || now;
  if (!psid || !resumeNodeId) return null;

  const id = continuationId({
    pageId,
    psid,
    flowId: flow.id || options.flowId || "",
    eventId: options.eventId || "",
    delayNodeId: delayNode.id || options.delayNodeId || "",
    resumeNodeId
  });
  const maxAttempts = clampNumber(options.maxAttempts || env.MESSENLEAD_FLOW_CONTINUATION_MAX_ATTEMPTS, 1, 8, DEFAULT_MAX_ATTEMPTS);
  const replaceProcessing = options.replaceProcessing === true ? 1 : 0;

  await env.DB.prepare(`
    INSERT INTO flow_continuations (
      id, page_id, psid, flow_id, flow_name, delay_node_id, resume_node_id, event_id,
      flow_json, context_json, contact_json, status, attempts, max_attempts,
      due_at, policy_expires_at, last_error, created_at, updated_at, processed_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'scheduled', 0, ?, ?, ?, '', ?, ?, '')
    ON CONFLICT(id) DO UPDATE SET
      flow_name = excluded.flow_name,
      resume_node_id = excluded.resume_node_id,
      event_id = excluded.event_id,
      flow_json = excluded.flow_json,
      context_json = excluded.context_json,
      contact_json = excluded.contact_json,
      status = CASE
        WHEN flow_continuations.status = 'processing' AND ? = 0 THEN flow_continuations.status
        ELSE 'scheduled'
      END,
      attempts = CASE
        WHEN flow_continuations.status = 'processing' AND ? = 0 THEN flow_continuations.attempts
        ELSE 0
      END,
      max_attempts = excluded.max_attempts,
      due_at = CASE
        WHEN flow_continuations.status = 'processing' AND ? = 0 THEN flow_continuations.due_at
        ELSE excluded.due_at
      END,
      policy_expires_at = excluded.policy_expires_at,
      last_error = '',
      updated_at = excluded.updated_at,
      processed_at = CASE
        WHEN flow_continuations.status = 'processing' AND ? = 0 THEN flow_continuations.processed_at
        ELSE ''
      END
  `)
    .bind(
      id,
      pageId,
      psid,
      String(flow.id || options.flowId || ""),
      String(flow.name || options.flowName || ""),
      String(delayNode.id || options.delayNodeId || ""),
      resumeNodeId,
      String(options.eventId || ""),
      JSON.stringify(flow || {}),
      JSON.stringify(safeJsonObject(options.context)),
      JSON.stringify(safeJsonObject(options.contact)),
      maxAttempts,
      dueAt,
      normalizeIso(options.policyExpiresAt) || "",
      now,
      now,
      replaceProcessing,
      replaceProcessing,
      replaceProcessing,
      replaceProcessing
    )
    .run();

  return {
    id,
    pageId,
    psid,
    flowId: String(flow.id || options.flowId || ""),
    delayNodeId: String(delayNode.id || options.delayNodeId || ""),
    resumeNodeId,
    dueAt,
    policyExpiresAt: normalizeIso(options.policyExpiresAt) || ""
  };
}

export async function scheduleFlowResponseWait(env, options = {}) {
  const hasDb = await ensureFlowContinuationSchema(env);
  if (!hasDb) return null;

  await cleanupFlowResponseWaits(env);

  const now = new Date().toISOString();
  const pageId = normalizePageId(options.pageId);
  const psid = String(options.psid || "").trim();
  const flow = options.flow || {};
  const waitNode = options.waitNode || {};
  const resumeNodeId = String(options.resumeNodeId || "").trim();
  if (!psid || !resumeNodeId) return null;

  const id = responseWaitId({ pageId, psid });
  const expiresAt = normalizeIso(options.expiresAt) || responseWaitExpiresAt(waitNode);

  await env.DB.prepare(`
    INSERT INTO flow_response_waits (
      id, page_id, psid, flow_id, flow_name, wait_node_id, resume_node_id, event_id,
      flow_json, context_json, contact_json, wait_config_json, status, expires_at,
      last_error, created_at, updated_at, consumed_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'waiting', ?, '', ?, ?, '')
    ON CONFLICT(id) DO UPDATE SET
      flow_id = excluded.flow_id,
      flow_name = excluded.flow_name,
      wait_node_id = excluded.wait_node_id,
      resume_node_id = excluded.resume_node_id,
      event_id = excluded.event_id,
      flow_json = excluded.flow_json,
      context_json = excluded.context_json,
      contact_json = excluded.contact_json,
      wait_config_json = excluded.wait_config_json,
      status = 'waiting',
      expires_at = excluded.expires_at,
      last_error = '',
      updated_at = excluded.updated_at,
      consumed_at = ''
  `)
    .bind(
      id,
      pageId,
      psid,
      String(flow.id || options.flowId || ""),
      String(flow.name || options.flowName || ""),
      String(waitNode.id || options.waitNodeId || ""),
      resumeNodeId,
      String(options.eventId || ""),
      JSON.stringify(flow || {}),
      JSON.stringify(safeJsonObject(options.context)),
      JSON.stringify(safeJsonObject(options.contact)),
      JSON.stringify(safeJsonObject(waitNode)),
      expiresAt,
      now,
      now
    )
    .run();

  return {
    id,
    pageId,
    psid,
    flowId: String(flow.id || options.flowId || ""),
    waitNodeId: String(waitNode.id || options.waitNodeId || ""),
    resumeNodeId,
    expiresAt
  };
}

export async function consumeFlowResponseWait(env, pageId, psid) {
  const hasDb = await ensureFlowContinuationSchema(env);
  if (!hasDb || !psid) return null;

  await cleanupFlowResponseWaits(env);

  const row = await env.DB.prepare(`
    SELECT *
    FROM flow_response_waits
    WHERE page_id = ? AND psid = ? AND status = 'waiting'
    ORDER BY datetime(updated_at) DESC
    LIMIT 1
  `)
    .bind(normalizePageId(pageId), String(psid || "").trim())
    .first();

  if (!row) return null;

  const wait = rowToResponseWait(row);
  if (wait.expiresAt && Date.parse(wait.expiresAt) < Date.now()) {
    await markResponseWait(env, wait.id, "expired", { error: "Response wait expired" });
    return null;
  }

  const now = new Date().toISOString();
  const result = await env.DB.prepare(`
    UPDATE flow_response_waits
    SET status = 'consumed', consumed_at = ?, updated_at = ?
    WHERE id = ? AND status = 'waiting'
  `)
    .bind(now, now, wait.id)
    .run();

  if (Number(result.meta?.changes || 0) <= 0) return null;
  return { ...wait, status: "consumed", consumedAt: now };
}

export async function scheduleFlowLinkClickWait(env, options = {}) {
  const hasDb = await ensureFlowContinuationSchema(env);
  if (!hasDb) return null;

  await cleanupFlowLinkClickWaits(env);

  const now = new Date().toISOString();
  const pageId = normalizePageId(options.pageId);
  const psid = String(options.psid || "").trim();
  const flow = options.flow || {};
  const waitNode = options.waitNode || {};
  const resumeNodeId = String(options.resumeNodeId || "").trim();
  const timeoutResumeNodeId = String(options.timeoutResumeNodeId || options.noClickResumeNodeId || "").trim();
  const sourceNodeId = String(options.sourceNodeId || "").trim();
  if (!psid || !resumeNodeId) return null;

  const id = linkClickWaitId({ pageId, psid });
  const expiresAt = normalizeIso(options.expiresAt) || linkClickWaitExpiresAt(waitNode);

  await env.DB.prepare(`
    INSERT INTO flow_link_click_waits (
      id, page_id, psid, flow_id, flow_name, wait_node_id, resume_node_id, timeout_resume_node_id, source_node_id,
      source_link_urls_json, event_id, policy_expires_at, flow_json, context_json, contact_json,
      wait_config_json, status, expires_at, last_error, created_at, updated_at, consumed_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'waiting', ?, '', ?, ?, '')
    ON CONFLICT(id) DO UPDATE SET
      flow_id = excluded.flow_id,
      flow_name = excluded.flow_name,
      wait_node_id = excluded.wait_node_id,
      resume_node_id = excluded.resume_node_id,
      timeout_resume_node_id = excluded.timeout_resume_node_id,
      source_node_id = excluded.source_node_id,
      source_link_urls_json = excluded.source_link_urls_json,
      event_id = excluded.event_id,
      policy_expires_at = excluded.policy_expires_at,
      flow_json = excluded.flow_json,
      context_json = excluded.context_json,
      contact_json = excluded.contact_json,
      wait_config_json = excluded.wait_config_json,
      status = 'waiting',
      expires_at = excluded.expires_at,
      last_error = '',
      updated_at = excluded.updated_at,
      consumed_at = ''
  `)
    .bind(
      id,
      pageId,
      psid,
      String(flow.id || options.flowId || ""),
      String(flow.name || options.flowName || ""),
      String(waitNode.id || options.waitNodeId || ""),
      resumeNodeId,
      timeoutResumeNodeId,
      sourceNodeId,
      JSON.stringify(Array.isArray(options.sourceLinkUrls) ? options.sourceLinkUrls : []),
      String(options.eventId || ""),
      normalizeIso(options.policyExpiresAt) || "",
      JSON.stringify(flow || {}),
      JSON.stringify(safeJsonObject(options.context)),
      JSON.stringify(safeJsonObject(options.contact)),
      JSON.stringify(safeJsonObject(waitNode)),
      expiresAt,
      now,
      now
    )
    .run();

  return {
    id,
    pageId,
    psid,
    flowId: String(flow.id || options.flowId || ""),
    waitNodeId: String(waitNode.id || options.waitNodeId || ""),
    resumeNodeId,
    timeoutResumeNodeId,
    sourceNodeId,
    sourceLinkUrls: Array.isArray(options.sourceLinkUrls) ? options.sourceLinkUrls : [],
    policyExpiresAt: normalizeIso(options.policyExpiresAt) || "",
    expiresAt
  };
}

export async function consumeFlowLinkClickWait(env, event = {}) {
  const hasDb = await ensureFlowContinuationSchema(env);
  const pageId = normalizePageId(event.pageId);
  const psid = String(event.contactPsid || event.psid || "").trim();
  if (!hasDb || !psid) return null;

  await cleanupFlowLinkClickWaits(env);

  const rows = await env.DB.prepare(`
    SELECT *
    FROM flow_link_click_waits
    WHERE page_id = ? AND psid = ? AND status = 'waiting'
    ORDER BY datetime(updated_at) DESC
    LIMIT 5
  `)
    .bind(pageId, psid)
    .all();

  for (const row of rows.results || []) {
    const wait = rowToLinkClickWait(row);
    if (wait.expiresAt && Date.parse(wait.expiresAt) < Date.now()) {
      if (!wait.timeoutResumeNodeId) await markLinkClickWait(env, wait.id, "expired", { error: "Link click wait expired" });
      continue;
    }
    if (!pixelEventMatchesLinkClickWait(event, wait)) continue;

    const now = new Date().toISOString();
    const result = await env.DB.prepare(`
      UPDATE flow_link_click_waits
      SET status = 'consumed', consumed_at = ?, updated_at = ?
      WHERE id = ? AND status = 'waiting'
    `)
      .bind(now, now, wait.id)
      .run();

    if (Number(result.meta?.changes || 0) > 0) {
      return { ...wait, status: "consumed", consumedAt: now, pixelEvent: event };
    }
  }

  return null;
}

export async function resetFlowRuntimeState(env, options = {}) {
  const hasDb = await ensureFlowContinuationSchema(env);
  if (!hasDb) return { continuations: 0, responseWaits: 0, linkClickWaits: 0 };

  const pageIds = normalizePageIds(options.pageIds || options.pageId);
  const now = new Date().toISOString();
  const continuationParams = ["reset", "Flow runtime reset", now];
  const responseParams = ["reset", "Flow runtime reset", now];
  const linkClickParams = ["reset", "Flow runtime reset", now];
  const continuationPageFilter = pageIds.length ? `AND page_id IN (${pageIds.map(() => "?").join(", ")})` : "";
  const responsePageFilter = pageIds.length ? `AND page_id IN (${pageIds.map(() => "?").join(", ")})` : "";
  const linkClickPageFilter = pageIds.length ? `AND page_id IN (${pageIds.map(() => "?").join(", ")})` : "";

  const continuationResult = await env.DB.prepare(`
    UPDATE flow_continuations
    SET status = ?,
        last_error = ?,
        updated_at = ?,
        processed_at = COALESCE(NULLIF(processed_at, ''), ?)
    WHERE status IN ('scheduled', 'processing')
      ${continuationPageFilter}
  `)
    .bind(...continuationParams, now, ...pageIds)
    .run();

  const responseWaitResult = await env.DB.prepare(`
    UPDATE flow_response_waits
    SET status = ?,
        last_error = ?,
        updated_at = ?,
        consumed_at = COALESCE(NULLIF(consumed_at, ''), ?)
    WHERE status = 'waiting'
      ${responsePageFilter}
  `)
    .bind(...responseParams, now, ...pageIds)
    .run();

  const linkClickWaitResult = await env.DB.prepare(`
    UPDATE flow_link_click_waits
    SET status = ?,
        last_error = ?,
        updated_at = ?,
        consumed_at = COALESCE(NULLIF(consumed_at, ''), ?)
    WHERE status IN ('waiting', 'timeout_processing')
      ${linkClickPageFilter}
  `)
    .bind(...linkClickParams, now, ...pageIds)
    .run();

  return {
    continuations: Number(continuationResult.meta?.changes || 0),
    responseWaits: Number(responseWaitResult.meta?.changes || 0),
    linkClickWaits: Number(linkClickWaitResult.meta?.changes || 0)
  };
}

export async function processFlowContinuations(env, processor, options = {}) {
  const hasDb = await ensureFlowContinuationSchema(env);
  if (!hasDb) return { processed: 0, resumed: 0, scheduled: 0, skipped: 0, retried: 0, failed: 0, details: [] };

  await cleanupFlowContinuations(env);

  const limit = clampNumber(options.limit || env.MESSENLEAD_FLOW_CONTINUATION_LIMIT, 1, 25, DEFAULT_LIMIT);
  const filters = [];
  const params = [new Date().toISOString()];
  if (options.pageId) {
    filters.push("AND page_id = ?");
    params.push(normalizePageId(options.pageId));
  }
  if (options.psid) {
    filters.push("AND psid = ?");
    params.push(String(options.psid || "").trim());
  }
  if (options.continuationId) {
    filters.push("AND id = ?");
    params.push(String(options.continuationId || "").trim());
  }
  params.push(limit);
  const rows = await env.DB.prepare(`
    SELECT *
    FROM flow_continuations
    WHERE status = 'scheduled'
      AND datetime(due_at) <= datetime(?)
      ${filters.join("\n      ")}
    ORDER BY datetime(due_at) ASC, datetime(created_at) ASC
    LIMIT ?
  `)
    .bind(...params)
    .all();

  const stats = { processed: 0, resumed: 0, scheduled: 0, skipped: 0, retried: 0, failed: 0, details: [] };
  for (const row of rows.results || []) {
    stats.processed += 1;
    const continuation = rowToContinuation(row);
    const claimed = await claimContinuation(env, continuation.id);
    if (!claimed) {
      stats.skipped += 1;
      stats.details.push(continuationDiagnostic(continuation, "skipped", {
        reason: "Continuation was already claimed"
      }));
      continue;
    }

    try {
      const result = await processor(continuation);
      if (result?.status === "skipped") {
        await markContinuation(env, continuation.id, "skipped", {
          error: result.reason || "Skipped",
          processedAt: new Date().toISOString()
        });
        stats.skipped += 1;
        stats.details.push(continuationDiagnostic(continuation, "skipped", result));
        continue;
      }

      await markContinuation(env, continuation.id, "processed", {
        processedAt: new Date().toISOString()
      });
      stats.resumed += 1;
      if (result?.continuation) stats.scheduled += 1;
      stats.details.push(continuationDiagnostic(continuation, "resumed", result));
    } catch (error) {
      const status = await retryOrFailContinuation(env, continuation, error.message || "Continuation failed");
      stats[status] = (stats[status] || 0) + 1;
      stats.details.push(continuationDiagnostic(continuation, status, {
        error: error.message || "Continuation failed"
      }));
    }
  }

  return stats;
}

function continuationDiagnostic(continuation = {}, status, result = {}) {
  return {
    continuationId: continuation.id || "",
    flowId: continuation.flowId || "",
    delayNodeId: continuation.delayNodeId || "",
    resumeNodeId: continuation.resumeNodeId || "",
    status,
    replyCount: Number(result.replyCount || 0),
    actionCount: Number(result.actionCount || 0),
    queuedCount: Number(result.queuedCount || 0),
    queueIds: Array.isArray(result.queueIds) ? result.queueIds.slice(0, 10) : [],
    scheduledNext: Boolean(result.continuation),
    waitingForResponse: Boolean(result.responseWait),
    waitingForLinkClick: Boolean(result.linkClickWait),
    reason: String(result.reason || ""),
    error: String(result.error || "")
  };
}

export async function processFlowLinkClickWaitTimeouts(env, processor, options = {}) {
  const hasDb = await ensureFlowContinuationSchema(env);
  if (!hasDb) return { processed: 0, resumed: 0, skipped: 0, failed: 0 };

  await cleanupFlowLinkClickWaits(env);

  const limit = clampNumber(options.limit || env.MESSENLEAD_LINK_CLICK_TIMEOUT_LIMIT, 1, 25, DEFAULT_LIMIT);
  const pageFilter = options.pageId ? "AND page_id = ?" : "";
  const params = options.pageId ? [new Date().toISOString(), normalizePageId(options.pageId), limit] : [new Date().toISOString(), limit];
  const rows = await env.DB.prepare(`
    SELECT *
    FROM flow_link_click_waits
    WHERE status = 'waiting'
      AND timeout_resume_node_id <> ''
      AND expires_at <> ''
      AND datetime(expires_at) <= datetime(?)
      ${pageFilter}
    ORDER BY datetime(expires_at) ASC, datetime(created_at) ASC
    LIMIT ?
  `)
    .bind(...params)
    .all();

  const stats = { processed: 0, resumed: 0, skipped: 0, failed: 0 };
  for (const row of rows.results || []) {
    stats.processed += 1;
    const wait = rowToLinkClickWait(row);
    const claimed = await claimLinkClickTimeout(env, wait.id);
    if (!claimed) {
      stats.skipped += 1;
      continue;
    }

    try {
      const result = await processor(wait);
      if (result?.status === "skipped") {
        await markLinkClickWait(env, wait.id, "skipped", { error: result.reason || "Skipped" });
        stats.skipped += 1;
        continue;
      }

      await markLinkClickWait(env, wait.id, "timed_out");
      stats.resumed += 1;
    } catch (error) {
      await markLinkClickWait(env, wait.id, "failed", { error: error.message || "Link click timeout failed" });
      stats.failed += 1;
    }
  }

  return stats;
}

async function claimContinuation(env, id) {
  const result = await env.DB.prepare(`
    UPDATE flow_continuations
    SET status = 'processing', updated_at = ?
    WHERE id = ? AND status = 'scheduled'
  `)
    .bind(new Date().toISOString(), id)
    .run();

  return Number(result.meta?.changes || 0) > 0;
}

async function claimLinkClickTimeout(env, id) {
  const result = await env.DB.prepare(`
    UPDATE flow_link_click_waits
    SET status = 'timeout_processing', updated_at = ?
    WHERE id = ? AND status = 'waiting'
  `)
    .bind(new Date().toISOString(), id)
    .run();

  return Number(result.meta?.changes || 0) > 0;
}

async function retryOrFailContinuation(env, continuation, error) {
  const attempts = Number(continuation.attempts || 0) + 1;
  const maxAttempts = Number(continuation.maxAttempts || DEFAULT_MAX_ATTEMPTS);
  const final = attempts >= maxAttempts;
  const now = new Date().toISOString();

  await env.DB.prepare(`
    UPDATE flow_continuations
    SET status = ?, attempts = ?, due_at = ?, last_error = ?, updated_at = ?
    WHERE id = ? AND status = 'processing'
  `)
    .bind(
      final ? "failed" : "scheduled",
      attempts,
      final ? now : new Date(Date.now() + retryDelayMs(attempts)).toISOString(),
      String(error || "").slice(0, 1200),
      now,
      continuation.id
    )
    .run();

  return final ? "failed" : "retried";
}

async function markContinuation(env, id, status, options = {}) {
  await env.DB.prepare(`
    UPDATE flow_continuations
    SET status = ?,
        last_error = ?,
        updated_at = ?,
        processed_at = COALESCE(NULLIF(?, ''), processed_at)
    WHERE id = ? AND status = 'processing'
  `)
    .bind(
      status,
      options.error || "",
      options.updatedAt || new Date().toISOString(),
      options.processedAt || "",
      id
    )
    .run();
}

async function cleanupFlowContinuations(env) {
  const before = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  await env.DB.prepare(`
    DELETE FROM flow_continuations
    WHERE status IN ('processed', 'skipped', 'failed', 'reset')
      AND datetime(updated_at) < datetime(?)
  `)
    .bind(before)
    .run()
    .catch(() => null);
}

async function cleanupFlowResponseWaits(env) {
  const now = new Date().toISOString();
  await env.DB.prepare(`
    UPDATE flow_response_waits
    SET status = 'expired', last_error = 'Response wait expired', updated_at = ?
    WHERE status = 'waiting'
      AND expires_at <> ''
      AND datetime(expires_at) < datetime(?)
      AND (timeout_resume_node_id IS NULL OR timeout_resume_node_id = '')
  `)
    .bind(now, now)
    .run()
    .catch(() => null);

  const before = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  await env.DB.prepare(`
    DELETE FROM flow_response_waits
    WHERE status IN ('consumed', 'expired', 'timed_out', 'skipped', 'failed', 'reset')
      AND datetime(updated_at) < datetime(?)
  `)
    .bind(before)
    .run()
    .catch(() => null);
}

async function cleanupFlowLinkClickWaits(env) {
  const now = new Date().toISOString();
  await env.DB.prepare(`
    UPDATE flow_link_click_waits
    SET status = 'expired', last_error = 'Link click wait expired', updated_at = ?
    WHERE status = 'waiting'
      AND expires_at <> ''
      AND datetime(expires_at) < datetime(?)
  `)
    .bind(now, now)
    .run()
    .catch(() => null);

  const before = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  await env.DB.prepare(`
    DELETE FROM flow_link_click_waits
    WHERE status IN ('consumed', 'expired', 'skipped', 'reset')
      AND datetime(updated_at) < datetime(?)
  `)
    .bind(before)
    .run()
    .catch(() => null);
}

function rowToContinuation(row) {
  return {
    id: row.id,
    pageId: row.page_id,
    psid: row.psid,
    flowId: row.flow_id || "",
    flowName: row.flow_name || "",
    delayNodeId: row.delay_node_id || "",
    resumeNodeId: row.resume_node_id || "",
    eventId: row.event_id || "",
    flow: parseJson(row.flow_json),
    context: parseJson(row.context_json),
    contact: parseJson(row.contact_json),
    status: row.status || "scheduled",
    attempts: Number(row.attempts || 0),
    maxAttempts: Number(row.max_attempts || DEFAULT_MAX_ATTEMPTS),
    dueAt: row.due_at || "",
    policyExpiresAt: row.policy_expires_at || "",
    lastError: row.last_error || "",
    createdAt: row.created_at || "",
    updatedAt: row.updated_at || "",
    processedAt: row.processed_at || ""
  };
}

function rowToResponseWait(row) {
  return {
    id: row.id,
    pageId: row.page_id,
    psid: row.psid,
    flowId: row.flow_id || "",
    flowName: row.flow_name || "",
    waitNodeId: row.wait_node_id || "",
    resumeNodeId: row.resume_node_id || "",
    eventId: row.event_id || "",
    flow: parseJson(row.flow_json),
    context: parseJson(row.context_json),
    contact: parseJson(row.contact_json),
    waitNode: parseJson(row.wait_config_json),
    status: row.status || "waiting",
    expiresAt: row.expires_at || "",
    lastError: row.last_error || "",
    createdAt: row.created_at || "",
    updatedAt: row.updated_at || "",
    consumedAt: row.consumed_at || ""
  };
}

function rowToLinkClickWait(row) {
  return {
    id: row.id,
    pageId: row.page_id,
    psid: row.psid,
    flowId: row.flow_id || "",
    flowName: row.flow_name || "",
    waitNodeId: row.wait_node_id || "",
    resumeNodeId: row.resume_node_id || "",
    timeoutResumeNodeId: row.timeout_resume_node_id || "",
    sourceNodeId: row.source_node_id || "",
    sourceLinkUrls: parseJsonArray(row.source_link_urls_json),
    eventId: row.event_id || "",
    policyExpiresAt: row.policy_expires_at || "",
    flow: parseJson(row.flow_json),
    context: parseJson(row.context_json),
    contact: parseJson(row.contact_json),
    waitNode: parseJson(row.wait_config_json),
    status: row.status || "waiting",
    expiresAt: row.expires_at || "",
    lastError: row.last_error || "",
    createdAt: row.created_at || "",
    updatedAt: row.updated_at || "",
    consumedAt: row.consumed_at || ""
  };
}

function continuationId(parts = {}) {
  return `fcont_${stableHash([
    normalizePageId(parts.pageId),
    parts.psid || "",
    parts.flowId || "",
    parts.eventId || "",
    parts.delayNodeId || "",
    parts.resumeNodeId || ""
  ].join(":"))}`;
}

function responseWaitId(parts = {}) {
  return `fwait_${stableHash([
    normalizePageId(parts.pageId),
    parts.psid || ""
  ].join(":"))}`;
}

function linkClickWaitId(parts = {}) {
  return `flink_${stableHash([
    normalizePageId(parts.pageId),
    parts.psid || ""
  ].join(":"))}`;
}

async function markResponseWait(env, id, status, options = {}) {
  await env.DB.prepare(`
    UPDATE flow_response_waits
    SET status = ?, last_error = ?, updated_at = ?
    WHERE id = ?
  `)
    .bind(status, options.error || "", options.updatedAt || new Date().toISOString(), id)
    .run()
    .catch(() => null);
}

async function markLinkClickWait(env, id, status, options = {}) {
  await env.DB.prepare(`
    UPDATE flow_link_click_waits
    SET status = ?, last_error = ?, updated_at = ?
    WHERE id = ?
  `)
    .bind(status, options.error || "", options.updatedAt || new Date().toISOString(), id)
    .run()
    .catch(() => null);
}

function responseWaitExpiresAt(waitNode = {}) {
  const minutes = Number(waitNode.timeoutMinutes || waitNode.timeout_minutes || 0);
  if (!Number.isFinite(minutes) || minutes <= 0) return "";
  return new Date(Date.now() + Math.floor(minutes) * 60 * 1000).toISOString();
}

function linkClickWaitExpiresAt(waitNode = {}) {
  const minutes = Number(waitNode.timeoutMinutes || waitNode.timeout_minutes || 0);
  if (!Number.isFinite(minutes) || minutes <= 0) return "";
  return new Date(Date.now() + Math.floor(minutes) * 60 * 1000).toISOString();
}

function pixelEventMatchesLinkClickWait(event = {}, wait = {}) {
  const eventType = String(event.eventType || "").trim();
  if (!["page_view", "link_click", "messenger_button_click"].includes(eventType)) return false;

  const eventNodeId = pixelEventSourceNodeId(event);
  if (wait.sourceNodeId && eventNodeId && eventNodeId !== wait.sourceNodeId) return false;
  if (wait.sourceNodeId && !eventNodeId) return false;
  if (wait.sourceNodeId && eventNodeId === wait.sourceNodeId) return true;

  const urls = Array.isArray(wait.sourceLinkUrls) ? wait.sourceLinkUrls : [];
  if (!urls.length) return true;

  const eventUrls = [event.url, event.targetUrl].map(normalizeComparableUrl).filter(Boolean);
  if (!eventUrls.length) return true;
  return urls.map(normalizeComparableUrl).filter(Boolean).some((url) => eventUrls.some((eventUrl) => eventUrl === url || eventUrl.startsWith(`${url}?`) || eventUrl.startsWith(`${url}#`)));
}

function pixelEventSourceNodeId(event = {}) {
  const data = event.data && typeof event.data === "object" ? event.data : {};
  return String(data.contactNodeId || data.mlNodeId || queryParamFromUrl(event.url, "ml_node_id") || queryParamFromUrl(event.targetUrl, "ml_node_id") || "").trim();
}

function normalizeComparableUrl(value) {
  try {
    const url = new URL(String(value || ""));
    ["ml_contact", "ml_page_id", "ml_source", "ml_button", "ml_node_id", "ml_node_number", "ml_node_title", "ml_link_id"].forEach((param) => url.searchParams.delete(param));
    url.hash = "";
    return url.toString().replace(/\/$/g, "");
  } catch {
    return String(value || "").trim().replace(/\/$/g, "");
  }
}

function queryParamFromUrl(value, key) {
  try {
    return new URL(String(value || "")).searchParams.get(key) || "";
  } catch {
    return "";
  }
}

function stableHash(value) {
  let hash = 2166136261;
  for (const char of String(value || "")) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash.toString(36);
}

function normalizePageId(pageId) {
  return String(pageId || DEFAULT_PAGE_ID).trim() || DEFAULT_PAGE_ID;
}

function normalizePageIds(value) {
  const raw = Array.isArray(value) ? value : String(value || "").split(",");
  return raw
    .map((item) => normalizePageId(item))
    .filter((item) => item && !["__all__", "*", "all"].includes(item));
}

function safeJsonObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function parseJson(value) {
  try {
    return value ? JSON.parse(value) : {};
  } catch {
    return {};
  }
}

function parseJsonArray(value) {
  try {
    const parsed = value ? JSON.parse(value) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function normalizeIso(value) {
  const timestamp = Date.parse(value || "");
  return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : "";
}

function retryDelayMs(attempts) {
  return [5000, 30000, 120000, 300000, 900000][Math.max(0, Math.min(4, attempts - 1))];
}

function clampNumber(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, Math.floor(number)));
}
