CREATE TABLE IF NOT EXISTS contact_custom_field_values (
  page_id TEXT NOT NULL,
  psid TEXT NOT NULL,
  field_id TEXT NOT NULL,
  field_name TEXT NOT NULL,
  field_type TEXT NOT NULL DEFAULT 'text',
  value_json TEXT NOT NULL DEFAULT 'null',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (page_id, psid, field_id)
);

CREATE INDEX IF NOT EXISTS idx_contact_field_values_page_field
  ON contact_custom_field_values(page_id, field_id, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_contact_field_values_page_psid
  ON contact_custom_field_values(page_id, psid, updated_at DESC);
