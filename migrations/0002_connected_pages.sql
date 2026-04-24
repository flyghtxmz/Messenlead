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
