import { describe, expect, it, vi } from 'vitest';

import { matchRenewalRoute } from './crm-route';
import { DEFAULT_CRM_DATA } from './crm-data';
import {
  hydrateLegacyCrmData,
  serializeLegacyCrmData,
} from './legacy-crm-storage';
import {
  RENEWAL_WORKFLOW_URL,
  fetchRenewalWorkflow,
  type RenewalWorkflowResponse,
} from './renewal-workflow-client';
import {
  selectManagedContact,
  selectManagedPolicy,
  selectManagedPolicies,
} from './renewal-workflow-selectors';

const ids = {
  workspace: '10000000-0000-4000-8000-000000000001',
  contact: '20000000-0000-4000-8000-000000000001',
  policy: '30000000-0000-4000-8000-000000000001',
  renewal: '40000000-0000-4000-8000-000000000001',
  task: '50000000-0000-4000-8000-000000000001',
  audit: '60000000-0000-4000-8000-000000000001',
  actor: '70000000-0000-4000-8000-000000000001',
  correlation: '80000000-0000-4000-8000-000000000001',
  provenance: '90000000-0000-4000-8000-000000000001',
} as const;

function graph(): RenewalWorkflowResponse {
  return {
    schemaVersion: 'renewal-workflow.v1',
    asOf: '2026-09-01T12:00:00.000Z',
    correlationId: ids.correlation,
    workspaceId: ids.workspace,
    items: [
      {
        source: { version: 'renewal-seed.v1', hash: 'synthetic-hash' },
        contact: { id: ids.contact, displayName: 'Avery Harbor' },
        policy: {
          id: ids.policy,
          contactId: ids.contact,
          displayLabel: 'Synthetic Term Policy',
          renewalDate: '2027-01-15',
        },
        renewal: {
          id: ids.renewal,
          policyId: ids.policy,
          displayLabel: 'Synthetic Annual Renewal',
          status: 'open',
        },
        followUpTask: {
          id: ids.task,
          renewalId: ids.renewal,
          title: 'Review synthetic renewal',
          status: 'completed',
          version: 2,
          dueAt: '2027-01-01T12:00:00.000Z',
          completedAt: '2026-09-07T08:56:12.175Z',
        },
        auditEvents: [
          {
            id: ids.audit,
            type: 'renewal.created',
            occurredAt: '2026-09-01T12:00:00.000Z',
            actorId: ids.actor,
            recordId: ids.renewal,
            correlationId: ids.correlation,
            provenanceId: ids.provenance,
          },
        ],
        links: {
          home: '/',
          contact: `/contacts/${ids.contact}`,
          policy: `/policies/${ids.policy}`,
          renewals: '/policies/renewals',
          tasks: '/tasks',
          audit: '/analytics/audit',
        },
      },
    ],
  };
}

describe('renewal routes', () => {
  it('matches managed collection and detail routes in safe order', () => {
    expect(matchRenewalRoute('/policies')).toEqual({ kind: 'policies' });
    expect(matchRenewalRoute('/policies/renewals')).toEqual({
      kind: 'renewals',
    });
    expect(matchRenewalRoute(`/policies/${ids.policy}`)).toEqual({
      kind: 'policy',
      policyId: ids.policy,
    });
    expect(matchRenewalRoute('/policies/policy%2Dencoded')).toEqual({
      kind: 'policy',
      policyId: 'policy-encoded',
    });
    expect(matchRenewalRoute('/policies/%E0%A4%A')).toEqual({
      kind: 'policy',
      policyId: null,
    });
    expect(matchRenewalRoute(`/contacts/${ids.contact}`)).toEqual({
      kind: 'contact',
      contactId: ids.contact,
    });
    expect(matchRenewalRoute('/contacts')).toBeNull();
    expect(matchRenewalRoute('/contacts/contact-does-not-exist')).toEqual({
      kind: 'contact',
      contactId: 'contact-does-not-exist',
    });
    expect(matchRenewalRoute('/contacts/contact%2Dencoded')).toEqual({
      kind: 'contact',
      contactId: 'contact-encoded',
    });
    expect(matchRenewalRoute('/contacts/%E0%A4%A')).toEqual({
      kind: 'contact',
      contactId: null,
    });
  });
});

describe('renewal workflow client', () => {
  it('uses the exact workspace URL and forwards the abort signal', async () => {
    const signal = new AbortController().signal;
    const fetcher = vi.fn(
      async () => new Response(JSON.stringify(graph()), { status: 200 }),
    );
    await expect(fetchRenewalWorkflow(signal, fetcher)).resolves.toEqual(
      graph(),
    );
    expect(fetcher).toHaveBeenCalledWith(RENEWAL_WORKFLOW_URL, { signal });
  });

  it.each([
    [404, 'not-found', false],
    [503, 'unavailable', true],
  ] as const)(
    'maps HTTP %i without fixture fallback',
    async (status, code, retryable) => {
      const fetcher = vi.fn(async () => new Response('{}', { status }));
      await expect(
        fetchRenewalWorkflow(new AbortController().signal, fetcher),
      ).rejects.toMatchObject({ code, retryable });
    },
  );

  it.each([
    ['malformed body', { schemaVersion: 'renewal-workflow.v1' }],
    ['workspace mismatch', { ...graph(), workspaceId: crypto.randomUUID() }],
  ])('rejects a %s as a retryable authority error', async (_name, body) => {
    const fetcher = vi.fn(
      async () => new Response(JSON.stringify(body), { status: 200 }),
    );
    await expect(
      fetchRenewalWorkflow(new AbortController().signal, fetcher),
    ).rejects.toMatchObject({ code: 'invalid-response', retryable: true });
  });

  it('rejects a policy link that is not bound to the exact stable ID', async () => {
    const body = structuredClone(graph());
    body.items[0].links.policy = '/policies/Synthetic%20Term%20Policy';
    const fetcher = vi.fn(
      async () => new Response(JSON.stringify(body), { status: 200 }),
    );
    await expect(
      fetchRenewalWorkflow(new AbortController().signal, fetcher),
    ).rejects.toMatchObject({ code: 'invalid-response', retryable: true });
  });

  it('reports a network failure as retryable', async () => {
    const fetcher = vi.fn(async () => {
      throw new TypeError('offline');
    });
    await expect(
      fetchRenewalWorkflow(new AbortController().signal, fetcher),
    ).rejects.toMatchObject({ code: 'network', retryable: true });
  });
});

describe('renewal selectors', () => {
  it('projects policies and relationships using stable IDs', () => {
    const [policy] = selectManagedPolicies(graph());
    expect(policy.policy.id).toBe(ids.policy);
    expect(policy.links.contact).toBe(`/contacts/${ids.contact}`);
    expect(selectManagedContact(graph(), ids.contact)?.renewal.id).toBe(
      ids.renewal,
    );
    expect(selectManagedContact(graph(), 'unknown-contact')).toBeUndefined();
    expect(selectManagedPolicy(graph(), ids.policy)?.contact.id).toBe(
      ids.contact,
    );
    expect(
      selectManagedPolicy(graph(), 'Synthetic Term Policy'),
    ).toBeUndefined();
    expect(selectManagedPolicy(graph(), 'unknown-policy')).toBeUndefined();
  });

  it('returns honest empty selections', () => {
    const empty = { ...graph(), asOf: null, items: [] };
    expect(selectManagedPolicies(empty)).toEqual([]);
    expect(selectManagedContact(empty, ids.contact)).toBeUndefined();
    expect(selectManagedPolicy(empty, ids.policy)).toBeUndefined();
  });
});

describe('legacy storage fence', () => {
  const serverRecords = Object.values(ids).map((id) => ({ id }));
  const fallback = structuredClone(DEFAULT_CRM_DATA);

  it('removes every fixed server ID while hydrating known collections', () => {
    const mixed = Object.fromEntries(
      Object.entries(fallback).map(([key, value]) => [
        key,
        [...value, ...serverRecords],
      ]),
    );
    expect(hydrateLegacyCrmData(JSON.stringify(mixed), fallback)).toEqual(
      fallback,
    );
  });

  it('fences serialization while preserving unrelated records', () => {
    const mixed = {
      ...fallback,
      contacts: [...fallback.contacts, ...serverRecords],
      policies: [...fallback.policies, ...serverRecords],
    };
    expect(JSON.parse(serializeLegacyCrmData(mixed))).toEqual(fallback);
  });
});
