export async function ensurePageSchema(env) {
  if (!env.DB) return false;

  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS connected_pages (
      page_id TEXT PRIMARY KEY,
      user_id TEXT,
      name TEXT NOT NULL,
      category TEXT,
      picture_url TEXT,
      tasks_json TEXT,
      access_token TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `).run();

  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_connected_pages_user_id ON connected_pages(user_id)").run();

  return true;
}

export async function upsertConnectedPages(env, userId, pages) {
  const hasDb = await ensurePageSchema(env);
  if (!hasDb) return false;

  const now = new Date().toISOString();

  for (const page of pages) {
    if (!page.id || !page.access_token) continue;

    await env.DB.prepare(`
      INSERT INTO connected_pages (
        page_id, user_id, name, category, picture_url, tasks_json, access_token, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(page_id) DO UPDATE SET
        user_id = excluded.user_id,
        name = excluded.name,
        category = excluded.category,
        picture_url = excluded.picture_url,
        tasks_json = excluded.tasks_json,
        access_token = excluded.access_token,
        updated_at = excluded.updated_at
    `)
      .bind(
        page.id,
        userId || "",
        page.name || "Página sem nome",
        page.category || "",
        page.picture?.data?.url || "",
        JSON.stringify(page.tasks || []),
        page.access_token,
        now,
        now
      )
      .run();
  }

  return true;
}

export async function listStoredConnectedPages(env, userId = "", options = {}) {
  const hasDb = await ensurePageSchema(env);
  if (!hasDb) return [];

  const maxAgeMs = Math.max(0, Number(options.maxAgeMs || 0));
  const minUpdatedAt = maxAgeMs ? new Date(Date.now() - maxAgeMs).toISOString() : "";
  const binds = [];
  const where = [];

  if (userId) {
    where.push("(user_id = ? OR user_id = '' OR user_id IS NULL)");
    binds.push(userId);
  }

  if (minUpdatedAt) {
    where.push("updated_at >= ?");
    binds.push(minUpdatedAt);
  }

  const query = `
    SELECT page_id, user_id, name, category, picture_url, tasks_json, access_token, updated_at
    FROM connected_pages
    ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
    ORDER BY name COLLATE NOCASE ASC
  `;
  const statement = env.DB.prepare(query);
  const result = binds.length ? await statement.bind(...binds).all() : await statement.all();
  return (result.results || []).map(storedPageFromRow).filter(Boolean);
}

export async function getStoredPageAccessToken(env, pageId, userId = "") {
  const hasDb = await ensurePageSchema(env);
  if (!hasDb || !pageId) return "";

  let row = null;

  if (userId) {
    row = await env.DB.prepare(
      "SELECT access_token FROM connected_pages WHERE page_id = ? AND (user_id = ? OR user_id = '' OR user_id IS NULL)"
    )
      .bind(pageId, userId)
      .first();
  }

  if (!row) {
    row = await env.DB.prepare("SELECT access_token FROM connected_pages WHERE page_id = ?")
      .bind(pageId)
      .first();
  }

  return row?.access_token || "";
}

function storedPageFromRow(row) {
  if (!row?.page_id) return null;
  return {
    id: row.page_id,
    user_id: row.user_id || "",
    name: row.name || "Pagina sem nome",
    category: row.category || "",
    picture: row.picture_url ? { data: { url: row.picture_url } } : null,
    tasks: parseTasks(row.tasks_json),
    access_token: row.access_token || "",
    updated_at: row.updated_at || ""
  };
}

function parseTasks(value) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
