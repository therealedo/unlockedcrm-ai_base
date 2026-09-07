export interface ApiError {
  error: { code: string; message: string; correlationId?: string };
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
