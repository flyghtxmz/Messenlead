import { ensurePageSchema } from "./pages.js";

const DEFAULT_PAGE_ID = "__global__";

export async function ensureMessengerAttributionSchema(env) {
  if (!env.DB) return false;

  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS messenger_attribution_sources (
      page_id TEXT NOT NULL,
      ad_id TEXT NOT NULL,
      source_key TEXT NOT NULL,
      ad_title TEXT,
      first_seen_at TEXT NOT NULL,
      last_seen_at TEXT NOT NULL,
      PRIMARY KEY (page_id, ad_id),
      UNIQUE (page_id, source_key)
    )
  `).run();

  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS messenger_attribution_events (
      id TEXT PRIMARY KEY,
      page_id TEXT NOT NULL,
      psid TEXT NOT NULL,
      event_id TEXT,
      source TEXT NOT NULL,
      source_key TEXT,
      ad_id TEXT,
      ad_title TEXT,
      referral_source TEXT,
      referral_ref TEXT,
      referral_location TEXT,
      template_key TEXT,
      data_json TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL
    )
  `).run();

  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_attr_events_page_psid_created ON messenger_attribution_events(page_id, psid, created_at DESC)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_attr_events_page_ad_created ON messenger_attribution_events(page_id, ad_id, created_at DESC)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_attr_events_page_source_created ON messenger_attribution_events(page_id, source_key, created_at DESC)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_attr_sources_page_last_seen ON messenger_attribution_sources(page_id, last_seen_at DESC)").run();
  return true;
}

export function attributionSourceKey(pageId, adId) {
  const normalizedAdId = cleanText(adId, 160);
  if (!normalizedAdId) return "";
  const input = `${normalizePageId(pageId)}:${normalizedAdId}`;
  return `src_${stableHash(input)}${stableHash(`messenlead:${input}`)}`.slice(0, 14);
}

export function messengerEntryFromContext(pageId, context = {}, attribution = null) {
  const source = context.hasAdReferral ? "ads" : context.hasReferral ? "referral" : "direct";
  const adId = cleanText(context.adId, 160);
  return {
    source,
    page_id: normalizePageId(pageId),
    ad_id: adId,
    adgroup_id: cleanText(context.adGroupId, 160),
    ad_title: cleanText(context.adTitle, 250),
    source_key: cleanText(attribution?.sourceKey, 80) || attributionSourceKey(pageId, adId),
    referral_source: cleanText(context.referralSource, 120),
    referral_ref: cleanText(context.referralRef, 500),
    referral_location: cleanText(context.referralLocation, 80),
    template_key: cleanText(context.templateKey, 250)
  };
}

export async function recordMessengerAttribution(env, input = {}) {
  if (!input.context?.hasAdReferral) return null;
  const hasDb = await ensureMessengerAttributionSchema(env);
  if (!hasDb) return messengerEntryFromContext(input.pageId, input.context);

  const pageId = normalizePageId(input.pageId);
  const psid = cleanText(input.psid, 160);
  if (!psid) return null;

  const now = input.createdAt || new Date().toISOString();
  const entry = messengerEntryFromContext(pageId, input.context);
  if (entry.ad_id) {
    await env.DB.prepare(`
      INSERT INTO messenger_attribution_sources (
        page_id, ad_id, source_key, ad_title, first_seen_at, last_seen_at
      )
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(page_id, ad_id) DO UPDATE SET
        ad_title = COALESCE(NULLIF(excluded.ad_title, ''), ad_title),
        last_seen_at = excluded.last_seen_at
    `)
      .bind(pageId, entry.ad_id, entry.source_key, entry.ad_title, now, now)
      .run();
  }

  const id = `attr_${stableHash([
    pageId,
    psid,
    input.eventId || "",
    entry.ad_id,
    entry.template_key,
    now
  ].join(":"))}`;
  await env.DB.prepare(`
    INSERT OR IGNORE INTO messenger_attribution_events (
      id, page_id, psid, event_id, source, source_key, ad_id, ad_title,
      referral_source, referral_ref, referral_location, template_key, data_json, created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
    .bind(
      id,
      pageId,
      psid,
      cleanText(input.eventId, 500),
      entry.source,
      entry.source_key,
      entry.ad_id,
      entry.ad_title,
      entry.referral_source,
      entry.referral_ref,
      entry.referral_location,
      entry.template_key,
      JSON.stringify(input.data || {}),
      now
    )
    .run();

  return {
    id,
    ...entry,
    pageId,
    psid,
    eventId: cleanText(input.eventId, 500),
    createdAt: now
  };
}

export async function listMessengerAttributions(env, pageId, options = {}) {
  const hasDb = await ensureMessengerAttributionSchema(env);
  if (!hasDb) return [];

  const normalizedPageId = normalizePageId(pageId);
  const psid = cleanText(options.psid, 160);
  const limit = clampNumber(options.limit, 1, 200, 80);
  const rows = psid
    ? await env.DB.prepare(`
        SELECT *
        FROM messenger_attribution_events
        WHERE page_id = ? AND psid = ?
        ORDER BY datetime(created_at) DESC
        LIMIT ?
      `).bind(normalizedPageId, psid, limit).all()
    : await env.DB.prepare(`
        SELECT *
        FROM messenger_attribution_events
        WHERE page_id = ?
        ORDER BY datetime(created_at) DESC
        LIMIT ?
      `).bind(normalizedPageId, limit).all();

  return (rows.results || []).map(rowToAttribution);
}

export async function listMessengerAttributionSources(env, options = {}) {
  const hasAttributionDb = await ensureMessengerAttributionSchema(env);
  const hasPageDb = await ensurePageSchema(env);
  if (!hasAttributionDb || !hasPageDb) return [];

  const userId = cleanText(options.userId, 180);
  if (!userId) return [];

  const query = cleanText(options.query, 250);
  const pageId = cleanText(options.pageId, 160);
  const limit = clampNumber(options.limit, 1, 1000, 500);
  const clauses = ["pages.user_id = ?"];
  const params = [userId];

  if (pageId) {
    clauses.push("sources.page_id = ?");
    params.push(pageId);
  }

  if (query) {
    clauses.push(`(
      sources.source_key LIKE ?
      OR sources.ad_id LIKE ?
      OR sources.ad_title LIKE ?
      OR pages.name LIKE ?
      OR sources.page_id LIKE ?
    )`);
    const pattern = `%${query}%`;
    params.push(pattern, pattern, pattern, pattern, pattern);
  }

  params.push(limit);
  const rows = await env.DB.prepare(`
    SELECT
      sources.page_id,
      pages.name AS page_name,
      sources.ad_id,
      sources.source_key,
      sources.ad_title,
      sources.first_seen_at,
      sources.last_seen_at,
      COUNT(events.id) AS entry_count,
      COUNT(DISTINCT events.psid) AS contact_count
    FROM messenger_attribution_sources sources
    INNER JOIN connected_pages pages
      ON pages.page_id = sources.page_id
    LEFT JOIN messenger_attribution_events events
      ON events.page_id = sources.page_id
      AND events.ad_id = sources.ad_id
    WHERE ${clauses.join(" AND ")}
    GROUP BY
      sources.page_id,
      pages.name,
      sources.ad_id,
      sources.source_key,
      sources.ad_title,
      sources.first_seen_at,
      sources.last_seen_at
    ORDER BY datetime(sources.last_seen_at) DESC
    LIMIT ?
  `)
    .bind(...params)
    .all();

  return (rows.results || []).map((row) => ({
    pageId: row.page_id || "",
    pageName: row.page_name || "",
    adId: row.ad_id || "",
    sourceKey: row.source_key || "",
    adTitle: row.ad_title || "",
    firstSeenAt: row.first_seen_at || "",
    lastSeenAt: row.last_seen_at || "",
    entries: Number(row.entry_count || 0),
    contacts: Number(row.contact_count || 0)
  }));
}

function rowToAttribution(row) {
  return {
    id: row.id,
    pageId: row.page_id,
    psid: row.psid,
    eventId: row.event_id || "",
    source: row.source || "",
    sourceKey: row.source_key || "",
    adId: row.ad_id || "",
    adTitle: row.ad_title || "",
    referralSource: row.referral_source || "",
    referralRef: row.referral_ref || "",
    referralLocation: row.referral_location || "",
    templateKey: row.template_key || "",
    data: parseJson(row.data_json),
    createdAt: row.created_at || ""
  };
}

function normalizePageId(pageId) {
  return cleanText(pageId, 160) || DEFAULT_PAGE_ID;
}

function cleanText(value, max = 1200) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, max);
}

function clampNumber(value, min, max, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(min, Math.min(max, Math.floor(parsed)));
}

function stableHash(value) {
  let hash = 2166136261;
  for (const character of String(value || "")) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36).padStart(7, "0");
}

function parseJson(value) {
  try {
    return value ? JSON.parse(value) : {};
  } catch {
    return {};
  }
}
