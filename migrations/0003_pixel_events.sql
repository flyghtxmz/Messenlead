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
);

CREATE INDEX IF NOT EXISTS idx_pixel_events_page_created ON pixel_events(page_id, created_at);
CREATE INDEX IF NOT EXISTS idx_pixel_events_page_type ON pixel_events(page_id, event_type, created_at);
CREATE INDEX IF NOT EXISTS idx_pixel_events_page_visitor ON pixel_events(page_id, visitor_id, created_at);
CREATE INDEX IF NOT EXISTS idx_pixel_events_site_created ON pixel_events(site_id, created_at);
