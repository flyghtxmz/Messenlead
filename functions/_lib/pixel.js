const DEFAULT_PAGE_ID = "__global__";
const DEFAULT_SITE_ID = "default";
const MAX_TEXT = 1200;

export async function ensurePixelSchema(env) {
  if (!env.DB) return false;

  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS pixel_events (
      id TEXT PRIMARY KEY,
      page_id TEXT NOT NULL,
      site_id TEXT NOT NULL,
      visitor_id TEXT NOT NULL,
      session_id TEXT,
      event_type TEXT NOT NULL,
      event_name TEXT,
      url TEXT,
      path TEXT,
      title TEXT,
      referrer TEXT,
      target_url TEXT,
      target_text TEXT,
      target_id TEXT,
      target_classes TEXT,
      utm_source TEXT,
      utm_medium TEXT,
      utm_campaign TEXT,
      utm_term TEXT,
      utm_content TEXT,
      user_agent TEXT,
      ip_hash TEXT,
      country TEXT,
      city TEXT,
      data_json TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL
    )
  `).run();

  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_pixel_events_page_created ON pixel_events(page_id, created_at)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_pixel_events_page_type ON pixel_events(page_id, event_type, created_at)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_pixel_events_page_visitor ON pixel_events(page_id, visitor_id, created_at)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_pixel_events_site_created ON pixel_events(site_id, created_at)").run();

  return true;
}

export function normalizePixelPageId(pageId) {
  return String(pageId || DEFAULT_PAGE_ID).trim() || DEFAULT_PAGE_ID;
}

export function normalizeSiteId(siteId) {
  return String(siteId || DEFAULT_SITE_ID).trim().slice(0, 120) || DEFAULT_SITE_ID;
}

export async function addPixelEvent(env, event = {}, request = null) {
  const hasDb = await ensurePixelSchema(env);
  if (!hasDb) return null;

  const now = new Date().toISOString();
  const url = cleanText(event.url, 2000);
  const data = event.data && typeof event.data === "object" && !Array.isArray(event.data) ? event.data : {};
  const requestHeaders = request?.headers;
  const userAgent = cleanText(event.userAgent || requestHeaders?.get("user-agent") || "", 500);
  const ip = requestHeaders?.get("cf-connecting-ip") || requestHeaders?.get("x-forwarded-for") || "";
  const cf = request?.cf || {};

  const row = {
    id: cleanText(event.id, 80) || makeEventId(),
    pageId: normalizePixelPageId(event.pageId),
    siteId: normalizeSiteId(event.siteId),
    visitorId: cleanText(event.visitorId, 120) || "anonymous",
    sessionId: cleanText(event.sessionId, 120),
    eventType: normalizeEventType(event.eventType || event.type),
    eventName: cleanText(event.eventName || event.name, 160),
    url,
    path: cleanText(event.path || pathFromUrl(url), 1000),
    title: cleanText(event.title, 500),
    referrer: cleanText(event.referrer, 2000),
    targetUrl: cleanText(event.targetUrl || data.targetUrl, 2000),
    targetText: cleanText(event.targetText || data.targetText, 500),
    targetId: cleanText(event.targetId || data.targetId, 250),
    targetClasses: cleanText(event.targetClasses || data.targetClasses, 500),
    utmSource: cleanText(event.utmSource || event.utm?.source || data.utmSource, 250),
    utmMedium: cleanText(event.utmMedium || event.utm?.medium || data.utmMedium, 250),
    utmCampaign: cleanText(event.utmCampaign || event.utm?.campaign || data.utmCampaign, 250),
    utmTerm: cleanText(event.utmTerm || event.utm?.term || data.utmTerm, 250),
    utmContent: cleanText(event.utmContent || event.utm?.content || data.utmContent, 250),
    userAgent,
    ipHash: await hashIp(ip, env),
    country: cleanText(cf.country || event.country, 80),
    city: cleanText(cf.city || event.city, 120),
    dataJson: JSON.stringify(cleanData(data)),
    createdAt: now
  };

  await env.DB.prepare(`
    INSERT INTO pixel_events (
      id, page_id, site_id, visitor_id, session_id, event_type, event_name,
      url, path, title, referrer, target_url, target_text, target_id, target_classes,
      utm_source, utm_medium, utm_campaign, utm_term, utm_content,
      user_agent, ip_hash, country, city, data_json, created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
    .bind(
      row.id,
      row.pageId,
      row.siteId,
      row.visitorId,
      row.sessionId,
      row.eventType,
      row.eventName,
      row.url,
      row.path,
      row.title,
      row.referrer,
      row.targetUrl,
      row.targetText,
      row.targetId,
      row.targetClasses,
      row.utmSource,
      row.utmMedium,
      row.utmCampaign,
      row.utmTerm,
      row.utmContent,
      row.userAgent,
      row.ipHash,
      row.country,
      row.city,
      row.dataJson,
      row.createdAt
    )
    .run();

  return rowToPixelEvent({
    id: row.id,
    page_id: row.pageId,
    site_id: row.siteId,
    visitor_id: row.visitorId,
    session_id: row.sessionId,
    event_type: row.eventType,
    event_name: row.eventName,
    url: row.url,
    path: row.path,
    title: row.title,
    referrer: row.referrer,
    target_url: row.targetUrl,
    target_text: row.targetText,
    target_id: row.targetId,
    target_classes: row.targetClasses,
    utm_source: row.utmSource,
    utm_medium: row.utmMedium,
    utm_campaign: row.utmCampaign,
    utm_term: row.utmTerm,
    utm_content: row.utmContent,
    user_agent: row.userAgent,
    ip_hash: row.ipHash,
    country: row.country,
    city: row.city,
    data_json: row.dataJson,
    created_at: row.createdAt
  });
}

export async function listPixelEvents(env, pageId, options = {}) {
  const hasDb = await ensurePixelSchema(env);
  if (!hasDb) return [];

  const normalizedPageId = normalizePixelPageId(pageId);
  const limit = clampNumber(options.limit, 1, 250, 80);
  const since = sinceIso(options.days || 7);

  const result = await env.DB.prepare(`
    SELECT *
    FROM pixel_events
    WHERE page_id = ?
      AND datetime(created_at) >= datetime(?)
    ORDER BY datetime(created_at) DESC
    LIMIT ?
  `)
    .bind(normalizedPageId, since, limit)
    .all();

  return (result.results || []).map(rowToPixelEvent);
}

export async function pixelSummary(env, pageId, options = {}) {
  const hasDb = await ensurePixelSchema(env);
  if (!hasDb) return emptySummary();

  const normalizedPageId = normalizePixelPageId(pageId);
  const since = sinceIso(options.days || 7);

  const totals = await env.DB.prepare(`
    SELECT
      COUNT(*) AS total_events,
      COUNT(DISTINCT visitor_id) AS visitors,
      SUM(CASE WHEN event_type = 'page_view' THEN 1 ELSE 0 END) AS page_views,
      SUM(CASE WHEN event_type = 'link_click' THEN 1 ELSE 0 END) AS link_clicks,
      SUM(CASE WHEN event_type = 'element_click' THEN 1 ELSE 0 END) AS element_clicks,
      SUM(CASE WHEN event_type = 'form_submit' THEN 1 ELSE 0 END) AS form_submits
    FROM pixel_events
    WHERE page_id = ?
      AND datetime(created_at) >= datetime(?)
  `)
    .bind(normalizedPageId, since)
    .first();

  const topLinks = await env.DB.prepare(`
    SELECT target_url, target_text, COUNT(*) AS clicks, COUNT(DISTINCT visitor_id) AS visitors
    FROM pixel_events
    WHERE page_id = ?
      AND event_type = 'link_click'
      AND datetime(created_at) >= datetime(?)
      AND target_url IS NOT NULL
      AND target_url != ''
    GROUP BY target_url, target_text
    ORDER BY clicks DESC, visitors DESC
    LIMIT 8
  `)
    .bind(normalizedPageId, since)
    .all();

  const topPages = await env.DB.prepare(`
    SELECT path, title, COUNT(*) AS views, COUNT(DISTINCT visitor_id) AS visitors
    FROM pixel_events
    WHERE page_id = ?
      AND event_type = 'page_view'
      AND datetime(created_at) >= datetime(?)
    GROUP BY path, title
    ORDER BY views DESC, visitors DESC
    LIMIT 8
  `)
    .bind(normalizedPageId, since)
    .all();

  return {
    days: Number(options.days || 7),
    totalEvents: Number(totals?.total_events || 0),
    visitors: Number(totals?.visitors || 0),
    pageViews: Number(totals?.page_views || 0),
    linkClicks: Number(totals?.link_clicks || 0),
    elementClicks: Number(totals?.element_clicks || 0),
    formSubmits: Number(totals?.form_submits || 0),
    topLinks: (topLinks.results || []).map((row) => ({
      url: row.target_url || "",
      text: row.target_text || "",
      clicks: Number(row.clicks || 0),
      visitors: Number(row.visitors || 0)
    })),
    topPages: (topPages.results || []).map((row) => ({
      path: row.path || "",
      title: row.title || "",
      views: Number(row.views || 0),
      visitors: Number(row.visitors || 0)
    }))
  };
}

function emptySummary() {
  return {
    days: 7,
    totalEvents: 0,
    visitors: 0,
    pageViews: 0,
    linkClicks: 0,
    elementClicks: 0,
    formSubmits: 0,
    topLinks: [],
    topPages: []
  };
}

function rowToPixelEvent(row) {
  return {
    id: row.id,
    pageId: row.page_id,
    siteId: row.site_id,
    visitorId: row.visitor_id,
    sessionId: row.session_id || "",
    eventType: row.event_type,
    eventName: row.event_name || "",
    url: row.url || "",
    path: row.path || "",
    title: row.title || "",
    referrer: row.referrer || "",
    targetUrl: row.target_url || "",
    targetText: row.target_text || "",
    targetId: row.target_id || "",
    targetClasses: row.target_classes || "",
    utmSource: row.utm_source || "",
    utmMedium: row.utm_medium || "",
    utmCampaign: row.utm_campaign || "",
    utmTerm: row.utm_term || "",
    utmContent: row.utm_content || "",
    country: row.country || "",
    city: row.city || "",
    data: parseJsonObject(row.data_json),
    createdAt: row.created_at || ""
  };
}

function normalizeEventType(value) {
  const type = String(value || "custom").trim().toLowerCase().replace(/[^a-z0-9_]+/g, "_");
  if (["page_view", "link_click", "element_click", "form_submit", "custom", "identify"].includes(type)) return type;
  return type || "custom";
}

function makeEventId() {
  return `px_${crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}_${Math.random().toString(36).slice(2)}`}`;
}

function cleanText(value, max = MAX_TEXT) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, max);
}

function cleanData(value) {
  const clean = {};
  Object.entries(value || {}).slice(0, 30).forEach(([key, item]) => {
    const cleanKey = cleanText(key, 80);
    if (!cleanKey) return;
    if (item == null) {
      clean[cleanKey] = "";
    } else if (typeof item === "object") {
      clean[cleanKey] = cleanText(JSON.stringify(item), MAX_TEXT);
    } else {
      clean[cleanKey] = cleanText(item, MAX_TEXT);
    }
  });
  return clean;
}

function pathFromUrl(value) {
  try {
    return new URL(value).pathname || "/";
  } catch {
    return "";
  }
}

function sinceIso(days) {
  const normalizedDays = clampNumber(days, 1, 90, 7);
  return new Date(Date.now() - normalizedDays * 24 * 60 * 60 * 1000).toISOString();
}

function clampNumber(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, Math.floor(number)));
}

async function hashIp(ip, env) {
  const value = String(ip || "").split(",")[0].trim();
  if (!value) return "";

  try {
    const salt = env.PIXEL_HASH_SALT || env.SESSION_SECRET || "messenlead-pixel";
    const encoded = new TextEncoder().encode(`${salt}:${value}`);
    const digest = await crypto.subtle.digest("SHA-256", encoded);
    return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("").slice(0, 40);
  } catch {
    return "";
  }
}

function parseJsonObject(value) {
  try {
    const parsed = JSON.parse(value || "{}");
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}
