export const SYNTHETIC_RENEWAL = {
  workspaceId: '10000000-0000-4000-8000-000000000001',
  contactId: '20000000-0000-4000-8000-000000000001',
  policyId: '30000000-0000-4000-8000-000000000001',
  renewalId: '40000000-0000-4000-8000-000000000001',
  taskId: '50000000-0000-4000-8000-000000000001',
  creationAuditId: '60000000-0000-4000-8000-000000000001',
  actorId: '70000000-0000-4000-8000-000000000001',
  correlationId: '80000000-0000-4000-8000-000000000001',
  provenanceId: '90000000-0000-4000-8000-000000000001',
  sourceVersion: 'renewal-seed.v1',
  sourceHash:
    'sha256:4f6d68165a762447fa005f673b1a64680397c420c31190bfa0d9a716e6288cbc',
} as const;

type Scoped = { id: string; workspaceId: string };
export interface RenewalGraphInput {
  workspace: {
    id: string;
    name: string;
    sourceVersion?: string;
    sourceHash?: string;
  };
  contact: Scoped & { displayName: string };
  policy: Scoped & {
    contactId: string;
    displayLabel: string;
    renewalDate: Date;
  };
  renewal: Scoped & { policyId: string; displayLabel: string; status: string };
  followUpTask:
    | (Scoped & {
        renewalId: string;
        title: string;
        status: string;
        version: number;
        dueAt: Date;
        completedAt: Date | null;
      })
    | null;
  auditEvents: Array<
    Scoped & {
      eventType: string;
      occurredAt: Date;
      actorId: string;
      recordId: string;
      correlationId: string;
      provenanceId: string;
    }
  >;
}

export type RenewalGraph = RenewalGraphInput & {
  source: { version: string; hash: string; provenanceId: string };
};

export function assembleRenewalGraph(input: RenewalGraphInput): RenewalGraph {
  const workspaceId = input.workspace.id;
  const scoped = [
    input.contact,
    input.policy,
    input.renewal,
    ...(input.followUpTask ? [input.followUpTask] : []),
    ...input.auditEvents,
  ];
  if (scoped.some((record) => record.workspaceId !== workspaceId))
    throw new Error('Renewal graph workspace scope mismatch');
  if (
    input.policy.contactId !== input.contact.id ||
    input.renewal.policyId !== input.policy.id ||
    (input.followUpTask && input.followUpTask.renewalId !== input.renewal.id)
  )
    throw new Error('Renewal graph relationship mismatch');
  return {
    ...input,
    source: {
      version: input.workspace.sourceVersion ?? SYNTHETIC_RENEWAL.sourceVersion,
      hash: input.workspace.sourceHash ?? SYNTHETIC_RENEWAL.sourceHash,
      provenanceId: SYNTHETIC_RENEWAL.provenanceId,
    },
  };
}
