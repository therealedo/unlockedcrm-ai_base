import { expect, it } from 'vitest';
import {
  assembleRenewalGraph,
  SYNTHETIC_RENEWAL,
  type RenewalGraphInput,
} from '../src/modules/renewals/domain.js';

const records = (): RenewalGraphInput => ({
  workspace: { id: SYNTHETIC_RENEWAL.workspaceId, name: 'Harbor Demo Agency' },
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
    },
  ],
});

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
  input.followUpTask.workspaceId = '10000000-0000-4000-8000-000000000099';
  expect(() => assembleRenewalGraph(input)).toThrow('workspace scope mismatch');
});
