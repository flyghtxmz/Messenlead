const DEFAULT_PAGE_ID = "__global__";
const DEFAULT_MAX_MB = 25;

export async function ensureMediaSchema(env) {
  if (!env.DB) return false;

  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS media_assets (
      id TEXT PRIMARY KEY,
      page_id TEXT NOT NULL,
      kind TEXT NOT NULL,
      key TEXT NOT NULL UNIQUE,
      url TEXT NOT NULL,
      original_name TEXT,
      file_name TEXT NOT NULL,
      content_type TEXT NOT NULL,
      size INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    )
  `).run();

  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_media_assets_page_kind_created ON media_assets(page_id, kind, created_at DESC)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_media_assets_page_created ON media_assets(page_id, created_at DESC)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_media_assets_key ON media_assets(key)").run();

  return true;
}

export async function listMediaAssets(env, pageId, options = {}) {
  const hasDb = await ensureMediaSchema(env);
  if (!hasDb) return [];

  const kind = normalizeKind(options.kind);
  const normalizedPageId = normalizePageId(pageId);
  const limit = clampNumber(options.limit, 1, 200, 80);
  const kindFilter = kind ? "AND kind = ?" : "";
  const params = kind ? [normalizedPageId, kind, limit] : [normalizedPageId, limit];

  const result = await env.DB.prepare(`
    SELECT id, page_id, kind, key, url, original_name, file_name, content_type, size, created_at
    FROM media_assets
    WHERE page_id = ?
      ${kindFilter}
    ORDER BY datetime(created_at) DESC
    LIMIT ?
  `)
    .bind(...params)
    .all();

  return (result.results || []).map(rowToMediaAsset);
}

export async function uploadMediaAsset(env, request, input = {}) {
  const hasDb = await ensureMediaSchema(env);
  if (!hasDb) throw new Error("D1 binding DB is not configured");

  const bucket = mediaBucket(env);
  if (!bucket) throw new Error("R2 binding MEDIA_BUCKET is not configured");

  const file = input.file;
  if (!file || typeof file.arrayBuffer !== "function") throw new Error("Arquivo nao encontrado");

  const kind = mediaKindFromFile(file, input.kind);
  const maxBytes = mediaMaxBytes(env);
  if (Number(file.size || 0) > maxBytes) {
    throw new Error(`Arquivo acima do limite de ${Math.floor(maxBytes / 1024 / 1024)} MB`);
  }

  const contentType = normalizeContentType(file.type, kind);
  const extension = mediaExtension(file.name, contentType, kind);
  const pageId = normalizePageId(input.pageId);
  const id = makeMediaId();
  const fileName = `${safeToken(pageId)}-${kind}-${id.slice(4)}.${extension}`;
  const key = fileName;
  const createdAt = new Date().toISOString();
  const bytes = await file.arrayBuffer();

  await bucket.put(key, bytes, {
    httpMetadata: {
      contentType,
      cacheControl: "public, max-age=31536000, immutable"
    },
    customMetadata: {
      pageId,
      kind,
      originalName: cleanText(file.name, 180)
    }
  });

  const url = publicMediaUrl(request, env, key);
  await env.DB.prepare(`
    INSERT INTO media_assets (
      id, page_id, kind, key, url, original_name, file_name, content_type, size, created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
    .bind(
      id,
      pageId,
      kind,
      key,
      url,
      cleanText(file.name, 180),
      fileName,
      contentType,
      Number(file.size || bytes.byteLength || 0),
      createdAt
    )
    .run();

  return {
    id,
    pageId,
    kind,
    key,
    url,
    originalName: cleanText(file.name, 180),
    fileName,
    contentType,
    size: Number(file.size || bytes.byteLength || 0),
    createdAt
  };
}

export async function deleteMediaAsset(env, pageId, id) {
  const hasDb = await ensureMediaSchema(env);
  if (!hasDb) return false;

  const normalizedPageId = normalizePageId(pageId);
  const row = await env.DB.prepare("SELECT key FROM media_assets WHERE id = ? AND page_id = ?")
    .bind(String(id || ""), normalizedPageId)
    .first();
  if (!row?.key) return false;

  const bucket = mediaBucket(env);
  if (bucket) await bucket.delete(row.key).catch(() => null);
  await env.DB.prepare("DELETE FROM media_assets WHERE id = ? AND page_id = ?")
    .bind(String(id || ""), normalizedPageId)
    .run();

  return true;
}

export async function getMediaObject(env, key) {
  const bucket = mediaBucket(env);
  if (!bucket) return null;

  const safeKey = cleanKey(key);
  if (!safeKey) return null;
  return bucket.get(safeKey);
}

export function normalizePageId(pageId) {
  return String(pageId || DEFAULT_PAGE_ID).trim() || DEFAULT_PAGE_ID;
}

export function mediaBucket(env) {
  return [env.MEDIA_BUCKET, env.MESSENLEAD_MEDIA_BUCKET, env.R2_BUCKET].find((bucket) => {
    return bucket && typeof bucket.get === "function" && typeof bucket.put === "function";
  }) || null;
}

function rowToMediaAsset(row) {
  return {
    id: row.id,
    pageId: row.page_id,
    kind: row.kind,
    key: row.key,
    url: row.url,
    originalName: row.original_name || "",
    fileName: row.file_name,
    contentType: row.content_type,
    size: Number(row.size || 0),
    createdAt: row.created_at
  };
}

function mediaKindFromFile(file, requestedKind) {
  const kind = normalizeKind(requestedKind);
  if (kind) return kind;

  const type = String(file.type || "").toLowerCase();
  if (type.startsWith("image/")) return "image";
  if (type === "audio/mpeg" || type === "audio/mp3" || /\.mp3$/i.test(file.name || "")) return "audio";
  throw new Error("Envie uma imagem ou um audio MP3");
}

function normalizeKind(value) {
  const kind = String(value || "").trim().toLowerCase();
  return ["image", "audio"].includes(kind) ? kind : "";
}

function normalizeContentType(type, kind) {
  const value = String(type || "").toLowerCase();
  if (kind === "audio") return "audio/mpeg";
  if (["image/jpeg", "image/png", "image/webp", "image/gif"].includes(value)) return value;
  if (kind === "image") return "image/jpeg";
  return "application/octet-stream";
}

function mediaExtension(fileName, contentType, kind) {
  if (kind === "audio") {
    if (!/\.mp3$/i.test(fileName || "")) throw new Error("Audio precisa ser MP3");
    return "mp3";
  }

  const fromType = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif"
  }[contentType];
  if (fromType) return fromType;

  const match = String(fileName || "").toLowerCase().match(/\.([a-z0-9]{2,5})$/);
  return match?.[1] || "jpg";
}

function publicMediaUrl(request, env, key) {
  const base = cleanText(env.MEDIA_PUBLIC_BASE_URL || env.R2_PUBLIC_BASE_URL || "", 500).replace(/\/+$/g, "");
  if (base) return `${base}/${encodeURIComponent(key)}`;

  const origin = new URL(request.url).origin;
  return `${origin}/media/${encodeURIComponent(key)}`;
}

function mediaMaxBytes(env) {
  const mb = clampNumber(env.MESSENLEAD_MEDIA_MAX_MB, 1, 100, DEFAULT_MAX_MB);
  return mb * 1024 * 1024;
}

function makeMediaId() {
  return `med_${crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}_${Math.random().toString(36).slice(2)}`}`;
}

function safeToken(value) {
  return String(value || "global")
    .trim()
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "global";
}

function cleanText(value, max) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, max);
}

function cleanKey(value) {
  const key = String(value || "").trim();
  if (!key || key.includes("..") || key.includes("/") || key.includes("\\")) return "";
  return key;
}

function clampNumber(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, Math.floor(number)));
}
