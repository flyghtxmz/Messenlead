export async function ensurePageSchema(env) {
  if (!env.DB) return false;

  await env.DB.exec(`
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
    );
    CREATE INDEX IF NOT EXISTS idx_connected_pages_user_id ON connected_pages(user_id);
  `);

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

export async function getStoredPageAccessToken(env, pageId) {
  const hasDb = await ensurePageSchema(env);
  if (!hasDb || !pageId) return "";

  const row = await env.DB.prepare("SELECT access_token FROM connected_pages WHERE page_id = ?")
    .bind(pageId)
    .first();

  return row?.access_token || "";
}
