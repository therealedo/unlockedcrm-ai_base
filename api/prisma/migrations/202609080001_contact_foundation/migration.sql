ALTER TABLE contacts
  ADD COLUMN first_name TEXT,
  ADD COLUMN last_name TEXT,
  ADD COLUMN email TEXT,
  ADD COLUMN phone TEXT,
  ADD COLUMN birth_date DATE,
  ADD COLUMN gender TEXT,
  ADD COLUMN notes TEXT,
  ADD CONSTRAINT contacts_gender_check CHECK (
    gender IS NULL OR gender IN ('female', 'male', 'non_binary', 'prefer_not_to_say')
  );

CREATE INDEX contacts_directory_order
  ON contacts (workspace_id, lower(last_name), lower(first_name), id);

CREATE TABLE contact_tags (
  workspace_id UUID NOT NULL,
  contact_id UUID NOT NULL,
  tag_code TEXT NOT NULL CHECK (tag_code IN ('new_lead', 'follow_up', 'client')),
  created_at TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT contact_tags_contact_scope_fk
    FOREIGN KEY (workspace_id, contact_id) REFERENCES contacts(workspace_id, id),
  PRIMARY KEY (workspace_id, contact_id, tag_code)
);

CREATE TABLE contact_create_receipts (
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  idempotency_key TEXT NOT NULL,
  payload_hash TEXT NOT NULL,
  response_body JSONB NOT NULL,
  created_at TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (workspace_id, idempotency_key)
);

CREATE UNIQUE INDEX audit_one_contact_creation
  ON audit_events (workspace_id, record_id) WHERE event_type = 'contact.created';
