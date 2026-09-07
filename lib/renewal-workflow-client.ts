export const RENEWAL_WORKFLOW_WORKSPACE_ID =
  '10000000-0000-4000-8000-000000000001';
export const RENEWAL_WORKFLOW_URL = `/api/v1/workspaces/${RENEWAL_WORKFLOW_WORKSPACE_ID}/renewals`;

export type RenewalWorkflowItem = {
  source: Record<'version' | 'hash', string>;
  contact: Record<'id' | 'displayName', string>;
  policy: Record<'id' | 'contactId' | 'displayLabel' | 'renewalDate', string>;
  renewal: Record<'id' | 'policyId' | 'displayLabel', string> & {
    status: 'open';
  };
  followUpTask:
    | null
    | (Record<'id' | 'renewalId' | 'title' | 'dueAt', string> & {
        status: 'pending' | 'completed';
        version: number;
        completedAt: string | null;
      });
  auditEvents: Array<
    Record<
      | 'id'
      | 'occurredAt'
      | 'actorId'
      | 'recordId'
      | 'correlationId'
      | 'provenanceId',
      string
    > & {
      type: 'renewal.created' | 'task.completed';
    }
  >;
  links: Record<'contact' | 'policy', string> & {
    home: '/';
    renewals: '/policies/renewals';
    tasks: '/tasks';
    audit: '/analytics/audit';
  };
};

export type RenewalWorkflowResponse = {
  schemaVersion: 'renewal-workflow.v1';
  asOf: string | null;
  correlationId: string;
  workspaceId: string;
  items: RenewalWorkflowItem[];
};

export class RenewalWorkflowClientError extends Error {
  constructor(
    public readonly code:
      | 'not-found'
      | 'unavailable'
      | 'invalid-response'
      | 'network',
    public readonly retryable: boolean,
  ) {
    super(code);
  }
}

const object = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);
const text = (value: unknown): value is string => typeof value === 'string';
const hasStrings = (
  value: unknown,
  keys: string[],
): value is Record<string, unknown> =>
  object(value) && keys.every((key) => text(value[key]));

function validItem(value: unknown): value is RenewalWorkflowItem {
  if (!object(value)) return false;
  const { source, contact, policy, renewal, followUpTask, auditEvents, links } =
    value;
  return (
    hasStrings(source, ['version', 'hash']) &&
    hasStrings(contact, ['id', 'displayName']) &&
    hasStrings(policy, ['id', 'contactId', 'displayLabel', 'renewalDate']) &&
    policy.contactId === contact.id &&
    hasStrings(renewal, ['id', 'policyId', 'displayLabel']) &&
    renewal.policyId === policy.id &&
    renewal.status === 'open' &&
    (followUpTask === null ||
      (hasStrings(followUpTask, ['id', 'renewalId', 'title', 'dueAt']) &&
        followUpTask.renewalId === renewal.id &&
        ['pending', 'completed'].includes(String(followUpTask.status)) &&
        Number.isInteger(followUpTask.version) &&
        (followUpTask.completedAt === null ||
          text(followUpTask.completedAt)))) &&
    Array.isArray(auditEvents) &&
    auditEvents.every(
      (event) =>
        hasStrings(event, [
          'id',
          'occurredAt',
          'actorId',
          'recordId',
          'correlationId',
          'provenanceId',
        ]) &&
        ['renewal.created', 'task.completed'].includes(String(event.type)),
    ) &&
    object(links) &&
    links.home === '/' &&
    links.contact === `/contacts/${String(contact.id)}` &&
    links.policy === `/policies/${String(policy.id)}` &&
    links.renewals === '/policies/renewals' &&
    links.tasks === '/tasks' &&
    links.audit === '/analytics/audit'
  );
}

function validResponse(value: unknown): value is RenewalWorkflowResponse {
  return (
    object(value) &&
    value.schemaVersion === 'renewal-workflow.v1' &&
    value.workspaceId === RENEWAL_WORKFLOW_WORKSPACE_ID &&
    text(value.correlationId) &&
    (value.asOf === null || text(value.asOf)) &&
    Array.isArray(value.items) &&
    value.items.every(validItem)
  );
}

export async function fetchRenewalWorkflow(
  signal: AbortSignal,
  fetcher: typeof fetch = fetch,
): Promise<RenewalWorkflowResponse> {
  let response: Response;
  try {
    response = await fetcher(RENEWAL_WORKFLOW_URL, { signal });
  } catch (error) {
    if (signal.aborted) throw error;
    throw new RenewalWorkflowClientError('network', true);
  }
  if (response.status === 404)
    throw new RenewalWorkflowClientError('not-found', false);
  if (!response.ok) throw new RenewalWorkflowClientError('unavailable', true);
  let body: unknown;
  try {
    body = await response.json();
  } catch {
    throw new RenewalWorkflowClientError('invalid-response', true);
  }
  if (!validResponse(body))
    throw new RenewalWorkflowClientError('invalid-response', true);
  return body;
}
