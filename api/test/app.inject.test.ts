import { beforeEach, expect, it } from 'vitest';
import { seedSyntheticRenewalGraph } from '../prisma/seed.js';
import { buildApp } from '../src/app.js';
import { createPrismaClient } from '../src/database/prisma.js';
import { SYNTHETIC_RENEWAL } from '../src/modules/renewals/domain.js';
import { PrismaRenewalRepository } from '../src/modules/renewals/prisma-renewal-repository.js';
import { createSyntheticRequestContext } from '../src/context/request-context.js';
import { TEST_DATABASE_URL } from './postgres-test-database.js';
const renewalPath = (workspaceId: string = SYNTHETIC_RENEWAL.workspaceId) =>
  `/api/v1/workspaces/${workspaceId}/renewals`;

beforeEach(async () => {
  const client = createPrismaClient(TEST_DATABASE_URL);
  await client.$executeRawUnsafe(
    'TRUNCATE audit_events, follow_up_tasks, renewals, policies, contacts, workspaces CASCADE',
  );
  await client.$disconnect();
});

it('is live, not persistence-ready, and has no renewal routes', async () => {
  const app = await buildApp();
  try {
    const live = await app.inject('/health/live');
    expect(live.statusCode).toBe(200);
    expect(live.json()).toEqual({ status: 'live' });
    const ready = await app.inject('/health/ready');
    expect(ready.statusCode).toBe(503);
    expect(ready.json()).toEqual({
      error: {
        code: 'MIGRATIONS_UNAVAILABLE',
        message: 'Persistence is not initialized.',
      },
    });
    expect((await app.inject('/api/renewals')).statusCode).toBe(404);
  } finally {
    await app.close();
  }
});

it('reads the persisted synthetic graph without trusting request identity', async () => {
  const client = createPrismaClient(TEST_DATABASE_URL);
  await seedSyntheticRenewalGraph(client);
  const app = await buildApp({
    renewals: {
      repository: new PrismaRenewalRepository(client),
      contextFactory: createSyntheticRequestContext,
      close: () => client.$disconnect(),
    },
  });
  try {
    const response = await app.inject({
      path: renewalPath(),
      headers: {
        'x-workspace-id': '10000000-0000-4000-8000-000000000099',
      },
    });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      schemaVersion: 'renewal-workflow.v1',
      asOf: '2026-09-02T12:00:00.000Z',
      correlationId: expect.any(String),
      workspaceId: SYNTHETIC_RENEWAL.workspaceId,
      items: [
        expect.objectContaining({
          source: {
            version: SYNTHETIC_RENEWAL.sourceVersion,
            hash: SYNTHETIC_RENEWAL.sourceHash,
          },
          contact: {
            id: SYNTHETIC_RENEWAL.contactId,
            displayName: 'Avery Harbor',
          },
          policy: {
            id: SYNTHETIC_RENEWAL.policyId,
            contactId: SYNTHETIC_RENEWAL.contactId,
            displayLabel: 'Synthetic Term Policy',
            renewalDate: '2027-01-15T00:00:00.000Z',
          },
          renewal: {
            id: SYNTHETIC_RENEWAL.renewalId,
            policyId: SYNTHETIC_RENEWAL.policyId,
            displayLabel: '2027 Synthetic Renewal',
            status: 'open',
          },
          followUpTask: {
            id: SYNTHETIC_RENEWAL.taskId,
            renewalId: SYNTHETIC_RENEWAL.renewalId,
            title: 'Review synthetic renewal',
            status: 'pending',
            version: 1,
            dueAt: '2026-12-15T15:00:00.000Z',
            completedAt: null,
          },
          auditEvents: [
            {
              id: SYNTHETIC_RENEWAL.creationAuditId,
              type: 'renewal.created',
              occurredAt: '2026-09-02T12:00:00.000Z',
              actorId: SYNTHETIC_RENEWAL.actorId,
              recordId: SYNTHETIC_RENEWAL.renewalId,
              correlationId: SYNTHETIC_RENEWAL.correlationId,
              provenanceId: SYNTHETIC_RENEWAL.provenanceId,
            },
          ],
        }),
      ],
    });
    expect(response.json().items[0].links).toEqual({
      home: '/',
      contact: `/contacts/${SYNTHETIC_RENEWAL.contactId}`,
      policy: `/policies/${SYNTHETIC_RENEWAL.policyId}`,
      renewals: '/policies/renewals',
      tasks: '/tasks',
      audit: '/analytics/audit',
    });
  } finally {
    await app.close();
  }
});

it('distinguishes authorized empty workspaces from undisclosed paths', async () => {
  const client = createPrismaClient(TEST_DATABASE_URL);
  const emptyWorkspaceId = '10000000-0000-4000-8000-000000000099';
  await seedSyntheticRenewalGraph(client);
  await client.workspace.create({
    data: {
      id: emptyWorkspaceId,
      name: 'Empty synthetic workspace',
      sourceVersion: 'test',
      sourceHash: 'test',
    },
  });
  const repository = new PrismaRenewalRepository(client);
  const app = await buildApp({
    renewals: {
      repository,
      contextFactory: () =>
        createSyntheticRequestContext({ workspaceId: emptyWorkspaceId }),
      close: () => client.$disconnect(),
    },
  });
  try {
    const empty = await app.inject(renewalPath(emptyWorkspaceId));
    expect(empty.statusCode).toBe(200);
    expect(empty.json()).toMatchObject({
      workspaceId: emptyWorkspaceId,
      asOf: null,
      items: [],
    });
    for (const workspaceId of [
      SYNTHETIC_RENEWAL.workspaceId,
      '10000000-0000-4000-8000-000000000098',
    ]) {
      const missing = await app.inject(renewalPath(workspaceId));
      expect(missing.statusCode).toBe(404);
      expect(missing.json().error).toMatchObject({
        code: 'RENEWAL_GRAPH_NOT_FOUND',
      });
    }
    const malformed = await app.inject(
      '/api/v1/workspaces/not-a-uuid/renewals',
    );
    expect(malformed.statusCode).toBe(400);
    expect(malformed.json().error).toMatchObject({
      code: 'INVALID_WORKSPACE_ID',
    });
  } finally {
    await app.close();
  }
});

it('uses latest persisted event time and pending-first nullable task projection', async () => {
  const client = createPrismaClient(TEST_DATABASE_URL);
  await seedSyntheticRenewalGraph(client);
  const completedAt = new Date('2026-12-15T15:01:00.000Z');
  await client.followUpTask.update({
    where: { id: SYNTHETIC_RENEWAL.taskId },
    data: { status: 'completed', completedAt },
  });
  const pendingId = '50000000-0000-4000-8000-000000000002';
  await client.followUpTask.create({
    data: {
      id: pendingId,
      workspaceId: SYNTHETIC_RENEWAL.workspaceId,
      renewalId: SYNTHETIC_RENEWAL.renewalId,
      title: 'Second synthetic follow-up',
      status: 'pending',
      dueAt: new Date('2026-12-20T15:00:00.000Z'),
    },
  });
  await client.auditEvent.create({
    data: {
      id: '60000000-0000-4000-8000-000000000002',
      workspaceId: SYNTHETIC_RENEWAL.workspaceId,
      actorId: SYNTHETIC_RENEWAL.actorId,
      eventType: 'task.completed',
      recordId: SYNTHETIC_RENEWAL.taskId,
      correlationId: SYNTHETIC_RENEWAL.correlationId,
      provenanceId: SYNTHETIC_RENEWAL.provenanceId,
      sourceVersion: SYNTHETIC_RENEWAL.sourceVersion,
      sourceHash: SYNTHETIC_RENEWAL.sourceHash,
      occurredAt: completedAt,
    },
  });
  const repository = new PrismaRenewalRepository(client);
  const app = await buildApp({
    renewals: {
      repository,
      contextFactory: createSyntheticRequestContext,
      close: () => client.$disconnect(),
    },
  });
  try {
    const path = renewalPath();
    const withTasks = (await app.inject(path)).json();
    expect(withTasks.asOf).toBe(completedAt.toISOString());
    expect(withTasks.items[0].followUpTask.id).toBe(pendingId);
    expect(withTasks.items[0].auditEvents).toHaveLength(2);
    await client.followUpTask.deleteMany();
    const withoutTasks = (await app.inject(path)).json();
    expect(withoutTasks.items[0].followUpTask).toBeNull();
    expect(withoutTasks.asOf).toBe('2026-09-02T12:00:00.000Z');
  } finally {
    await app.close();
  }
});

it('maps a real persistence failure to a retryable 503', async () => {
  const client = createPrismaClient(
    'postgresql://unlockedcrm:synthetic-local-only@127.0.0.1:54331/unlockedcrm_test?schema=public',
  );
  const app = await buildApp({
    renewals: {
      repository: new PrismaRenewalRepository(client),
      contextFactory: createSyntheticRequestContext,
      close: () => client.$disconnect(),
    },
  });
  try {
    const response = await app.inject(renewalPath());
    expect(response.statusCode).toBe(503);
    expect(response.json().error).toMatchObject({
      code: 'PERSISTENCE_UNAVAILABLE',
    });
  } finally {
    await app.close();
  }
});
