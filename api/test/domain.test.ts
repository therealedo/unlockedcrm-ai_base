import { expect, it } from 'vitest';
import { parseTaskCompletionRequest } from '../src/contracts/renewal-workflow.js';
import {
  classifySyntheticRenewalSeedState,
  SYNTHETIC_RENEWAL_SEED,
  type SyntheticRenewalSeedInspection,
} from '../prisma/seed.js';
import {
  assembleRenewalGraph,
  SYNTHETIC_RENEWAL,
  type RenewalGraphInput,
} from '../src/modules/renewals/domain.js';

const records = (): RenewalGraphInput => ({
  workspace: {
    id: SYNTHETIC_RENEWAL.workspaceId,
    name: 'Harbor Demo Agency',
  },
  contact: {
    id: SYNTHETIC_RENEWAL.contactId,
    workspaceId: SYNTHETIC_RENEWAL.workspaceId,
    displayName: 'Avery Harbor',
  },
  policy: {
    id: SYNTHETIC_RENEWAL.policyId,
    workspaceId: SYNTHETIC_RENEWAL.workspaceId,
    contactId: SYNTHETIC_RENEWAL.contactId,
    displayLabel: 'Synthetic Term Policy',
    renewalDate: new Date('2027-01-15T00:00:00.000Z'),
  },
  renewal: {
    id: SYNTHETIC_RENEWAL.renewalId,
    workspaceId: SYNTHETIC_RENEWAL.workspaceId,
    policyId: SYNTHETIC_RENEWAL.policyId,
    displayLabel: '2027 Synthetic Renewal',
    status: 'open',
  },
  followUpTask: {
    id: SYNTHETIC_RENEWAL.taskId,
    workspaceId: SYNTHETIC_RENEWAL.workspaceId,
    renewalId: SYNTHETIC_RENEWAL.renewalId,
    title: 'Review synthetic renewal',
    status: 'pending',
    version: 1,
    dueAt: new Date('2026-12-15T15:00:00.000Z'),
    completedAt: null,
  },
  auditEvents: [
    {
      id: SYNTHETIC_RENEWAL.creationAuditId,
      workspaceId: SYNTHETIC_RENEWAL.workspaceId,
      eventType: 'renewal.created',
      occurredAt: new Date('2026-09-02T12:00:00.000Z'),
      actorId: SYNTHETIC_RENEWAL.actorId,
      recordId: SYNTHETIC_RENEWAL.renewalId,
      correlationId: SYNTHETIC_RENEWAL.correlationId,
      provenanceId: SYNTHETIC_RENEWAL.provenanceId,
    },
  ],
});

const pendingSeedInspection = (): SyntheticRenewalSeedInspection => {
  const fixture = structuredClone(SYNTHETIC_RENEWAL_SEED);
  return {
    fixed: fixture,
    graph: {
      ...fixture.workspace,
      contacts: [fixture.contact],
      policies: [fixture.policy],
      renewals: [fixture.renewal],
      tasks: [fixture.task],
      auditEvents: [fixture.creationAudit],
    },
  };
};

it('assembles one stable workspace-scoped renewal graph', () => {
  const graph = assembleRenewalGraph(records());
  expect(graph).toMatchObject({
    workspace: { id: SYNTHETIC_RENEWAL.workspaceId },
    contact: { id: SYNTHETIC_RENEWAL.contactId },
    policy: { contactId: SYNTHETIC_RENEWAL.contactId },
    renewal: { policyId: SYNTHETIC_RENEWAL.policyId, status: 'open' },
    followUpTask: { renewalId: SYNTHETIC_RENEWAL.renewalId, status: 'pending' },
  });
  expect(graph.source).toEqual({
    version: 'renewal-seed.v1',
    hash: 'sha256:4f6d68165a762447fa005f673b1a64680397c420c31190bfa0d9a716e6288cbc',
    provenanceId: SYNTHETIC_RENEWAL.provenanceId,
  });
});

it('rejects a child record from another workspace', () => {
  const input = records();
  input.followUpTask!.workspaceId = '10000000-0000-4000-8000-000000000099';
  expect(() => assembleRenewalGraph(input)).toThrow('workspace scope mismatch');
});

it.each([
  undefined,
  null,
  {},
  [],
  { expectedTaskVersion: 0 },
  { expectedTaskVersion: -1 },
  { expectedTaskVersion: 1.5 },
  { expectedTaskVersion: '1' },
  { expectedTaskVersion: 1, extra: true },
])('rejects a non-exact task completion body: %j', (body) => {
  expect(parseTaskCompletionRequest(body)).toBeNull();
});

it('accepts only one positive integer task version field', () => {
  expect(parseTaskCompletionRequest({ expectedTaskVersion: 1 })).toEqual({
    expectedTaskVersion: 1,
  });
});

it('retains an open renewal without a task and still validates relationships', () => {
  const input = { ...records(), followUpTask: null };
  expect(assembleRenewalGraph(input).followUpTask).toBeNull();
  input.policy.contactId = '20000000-0000-4000-8000-000000000099';
  expect(() => assembleRenewalGraph(input)).toThrow('relationship mismatch');
});

it('classifies only the exact empty, pending, and completed seed states', () => {
  const empty: SyntheticRenewalSeedInspection = {
    fixed: {
      workspace: null,
      contact: null,
      policy: null,
      renewal: null,
      task: null,
      creationAudit: null,
    },
    graph: null,
  };
  expect(classifySyntheticRenewalSeedState(empty)).toBe('empty');

  const pending = pendingSeedInspection();
  expect(classifySyntheticRenewalSeedState(pending)).toBe('pending');

  const completed = pendingSeedInspection();
  const completedAt = new Date('2026-12-15T15:01:00.000Z');
  completed.fixed.task!.status = 'completed';
  completed.fixed.task!.version = 2;
  completed.fixed.task!.completedAt = completedAt;
  completed.graph!.tasks[0] = completed.fixed.task!;
  completed.graph!.auditEvents.push({
    ...completed.fixed.creationAudit!,
    id: '60000000-0000-4000-8000-000000000002',
    eventType: 'task.completed',
    recordId: SYNTHETIC_RENEWAL.taskId,
    correlationId: '80000000-0000-4000-8000-000000000002',
    occurredAt: completedAt,
    createdAt: completedAt,
  });
  expect(classifySyntheticRenewalSeedState(completed)).toBe('completed');
});

it.each([
  [
    'partial identity',
    (state: SyntheticRenewalSeedInspection) => (state.fixed.contact = null),
  ],
  [
    'extra business row',
    (state: SyntheticRenewalSeedInspection) =>
      state.graph!.contacts.push({
        ...state.fixed.contact!,
        id: '20000000-0000-4000-8000-000000000002',
      }),
  ],
  [
    'relationship drift',
    (state: SyntheticRenewalSeedInspection) =>
      (state.fixed.policy!.contactId = '20000000-0000-4000-8000-000000000002'),
  ],
  [
    'source drift',
    (state: SyntheticRenewalSeedInspection) =>
      (state.fixed.workspace!.sourceHash = 'sha256:drift'),
  ],
  [
    'label drift',
    (state: SyntheticRenewalSeedInspection) =>
      (state.fixed.renewal!.displayLabel = 'Drifted renewal'),
  ],
  [
    'date drift',
    (state: SyntheticRenewalSeedInspection) =>
      (state.fixed.task!.dueAt = new Date('2026-12-16T15:00:00.000Z')),
  ],
  [
    'creation audit drift',
    (state: SyntheticRenewalSeedInspection) =>
      (state.fixed.creationAudit!.actorId =
        '70000000-0000-4000-8000-000000000002'),
  ],
])('rejects %s before seed writes', (_name, mutate) => {
  const state = pendingSeedInspection();
  mutate(state);
  expect(() => classifySyntheticRenewalSeedState(state)).toThrow(
    'Synthetic renewal seed drift',
  );
});

it.each([
  [
    'invalid event UUID',
    (state: SyntheticRenewalSeedInspection) =>
      (state.graph!.auditEvents[1].id = 'not-a-uuid'),
  ],
  [
    'invalid correlation UUID',
    (state: SyntheticRenewalSeedInspection) =>
      (state.graph!.auditEvents[1].correlationId = 'not-a-uuid'),
  ],
  [
    'reused creation correlation UUID',
    (state: SyntheticRenewalSeedInspection) =>
      (state.graph!.auditEvents[1].correlationId =
        SYNTHETIC_RENEWAL.correlationId),
  ],
  [
    'timestamp mismatch',
    (state: SyntheticRenewalSeedInspection) =>
      (state.graph!.auditEvents[1].createdAt = new Date(
        '2026-12-15T15:02:00.000Z',
      )),
  ],
  [
    'completion audit drift',
    (state: SyntheticRenewalSeedInspection) =>
      (state.graph!.auditEvents[1].provenanceId =
        '90000000-0000-4000-8000-000000000002'),
  ],
  [
    'extra completion audit',
    (state: SyntheticRenewalSeedInspection) =>
      state.graph!.auditEvents.push({
        ...state.graph!.auditEvents[1],
        id: '60000000-0000-4000-8000-000000000003',
      }),
  ],
])('rejects completed-state %s', (_name, mutate) => {
  const state = pendingSeedInspection();
  const completedAt = new Date('2026-12-15T15:01:00.000Z');
  state.fixed.task!.status = 'completed';
  state.fixed.task!.version = 2;
  state.fixed.task!.completedAt = completedAt;
  state.graph!.tasks[0] = state.fixed.task!;
  state.graph!.auditEvents.push({
    ...state.fixed.creationAudit!,
    id: '60000000-0000-4000-8000-000000000002',
    eventType: 'task.completed',
    recordId: SYNTHETIC_RENEWAL.taskId,
    correlationId: '80000000-0000-4000-8000-000000000002',
    occurredAt: completedAt,
    createdAt: completedAt,
  });
  mutate(state);
  expect(() => classifySyntheticRenewalSeedState(state)).toThrow(
    'Synthetic renewal seed drift',
  );
});
