CREATE TABLE IF NOT EXISTS flows (
  page_id TEXT NOT NULL,
  id TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  trigger_text TEXT,
  goal TEXT,
  nodes_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (page_id, id)
);

CREATE INDEX IF NOT EXISTS idx_flows_page_id ON flows(page_id);
CREATE INDEX IF NOT EXISTS idx_flows_page_status ON flows(page_id, status);
