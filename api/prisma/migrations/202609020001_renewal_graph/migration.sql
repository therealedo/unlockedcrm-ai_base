CREATE TABLE workspaces (
  id UUID PRIMARY KEY, name TEXT NOT NULL, source_version TEXT NOT NULL,
  source_hash TEXT NOT NULL, created_at TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE contacts (
  id UUID PRIMARY KEY, workspace_id UUID NOT NULL, display_name TEXT NOT NULL,
  created_at TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT contacts_workspace_fk FOREIGN KEY (workspace_id) REFERENCES workspaces(id),
  CONSTRAINT contacts_workspace_identity UNIQUE (workspace_id, id)
);
CREATE TABLE policies (
  id UUID PRIMARY KEY, workspace_id UUID NOT NULL, contact_id UUID NOT NULL,
  display_label TEXT NOT NULL, renewal_date DATE NOT NULL,
  created_at TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT policies_workspace_fk FOREIGN KEY (workspace_id) REFERENCES workspaces(id),
  CONSTRAINT policies_contact_scope_fk FOREIGN KEY (workspace_id, contact_id) REFERENCES contacts(workspace_id, id),
  CONSTRAINT policies_workspace_identity UNIQUE (workspace_id, id)
);
CREATE TABLE renewals (
  id UUID PRIMARY KEY, workspace_id UUID NOT NULL, policy_id UUID NOT NULL,
  display_label TEXT NOT NULL, status TEXT NOT NULL CHECK (status IN ('open', 'closed')),
  created_at TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT renewals_workspace_fk FOREIGN KEY (workspace_id) REFERENCES workspaces(id),
  CONSTRAINT renewals_policy_scope_fk FOREIGN KEY (workspace_id, policy_id) REFERENCES policies(workspace_id, id),
  CONSTRAINT renewals_workspace_identity UNIQUE (workspace_id, id)
);
CREATE UNIQUE INDEX renewals_one_open_per_policy
  ON renewals (workspace_id, policy_id) WHERE status = 'open';
CREATE TABLE follow_up_tasks (
  id UUID PRIMARY KEY, workspace_id UUID NOT NULL, renewal_id UUID NOT NULL,
  title TEXT NOT NULL, status TEXT NOT NULL CHECK (status IN ('pending', 'completed')),
  version INTEGER NOT NULL DEFAULT 1 CHECK (version > 0), due_at TIMESTAMPTZ(3) NOT NULL,
  completed_at TIMESTAMPTZ(3), created_at TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT task_completion_shape CHECK (
    (status = 'pending' AND completed_at IS NULL) OR (status = 'completed' AND completed_at IS NOT NULL)
  ),
  CONSTRAINT tasks_workspace_fk FOREIGN KEY (workspace_id) REFERENCES workspaces(id),
  CONSTRAINT tasks_renewal_scope_fk FOREIGN KEY (workspace_id, renewal_id) REFERENCES renewals(workspace_id, id),
  CONSTRAINT tasks_workspace_identity UNIQUE (workspace_id, id)
);
CREATE UNIQUE INDEX tasks_one_pending_per_renewal
  ON follow_up_tasks (workspace_id, renewal_id) WHERE status = 'pending';
CREATE TABLE audit_events (
  id UUID PRIMARY KEY, workspace_id UUID NOT NULL, actor_id UUID NOT NULL,
  event_type TEXT NOT NULL, record_id UUID NOT NULL, correlation_id UUID NOT NULL,
  provenance_id UUID NOT NULL, source_version TEXT NOT NULL, source_hash TEXT NOT NULL,
  occurred_at TIMESTAMPTZ(3) NOT NULL, created_at TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT audit_workspace_fk FOREIGN KEY (workspace_id) REFERENCES workspaces(id),
  CONSTRAINT audit_workspace_identity UNIQUE (workspace_id, id)
);
CREATE UNIQUE INDEX audit_one_task_completion
  ON audit_events (workspace_id, record_id) WHERE event_type = 'task.completed';
CREATE FUNCTION reject_audit_event_mutation() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN RAISE EXCEPTION 'audit_events are immutable'; END;
$$;
CREATE TRIGGER audit_events_reject_update BEFORE UPDATE ON audit_events
  FOR EACH ROW EXECUTE FUNCTION reject_audit_event_mutation();
CREATE TRIGGER audit_events_reject_delete BEFORE DELETE ON audit_events
  FOR EACH ROW EXECUTE FUNCTION reject_audit_event_mutation();
