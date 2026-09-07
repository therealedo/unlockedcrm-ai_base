export interface ApiError {
  error: { code: string; message: string; correlationId?: string };
}

export interface TaskCompletionRequest {
  expectedTaskVersion: number;
}

export interface TaskCompletionResponse {
  task: {
    id: string;
    renewalId: string;
    status: 'completed';
    version: number;
    completedAt: string;
  };
  renewal: { id: string; status: 'open' };
  completionAuditEvent: { id: string; type: 'task.completed' };
}

export function parseTaskCompletionRequest(
  body: unknown,
): TaskCompletionRequest | null {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
  const entries = Object.entries(body);
  if (entries.length !== 1 || entries[0][0] !== 'expectedTaskVersion')
    return null;
  const expectedTaskVersion = entries[0][1];
  return Number.isInteger(expectedTaskVersion) && expectedTaskVersion > 0
    ? { expectedTaskVersion: expectedTaskVersion as number }
    : null;
}

export interface RenewalWorkflowResponse {
  schemaVersion: 'renewal-workflow.v1';
  asOf: string | null;
  correlationId: string;
  workspaceId: string;
  items: Array<{
    source: { version: string; hash: string };
    contact: { id: string; displayName: string };
    policy: {
      id: string;
      contactId: string;
      displayLabel: string;
      renewalDate: string;
    };
    renewal: {
      id: string;
      policyId: string;
      displayLabel: string;
      status: 'open';
    };
    followUpTask: {
      id: string;
      renewalId: string;
      title: string;
      status: 'pending' | 'completed';
      version: number;
      dueAt: string;
      completedAt: string | null;
    } | null;
    auditEvents: Array<{
      id: string;
      type: 'renewal.created' | 'task.completed';
      occurredAt: string;
      actorId: string;
      recordId: string;
      correlationId: string;
      provenanceId: string;
    }>;
    links: {
      home: '/';
      contact: string;
      policy: string;
      renewals: '/policies/renewals';
      tasks: '/tasks';
      audit: '/analytics/audit';
    };
  }>;
}
