import { beforeEach, expect, it } from 'vitest';
import { SYNTHETIC_RENEWAL } from '../src/modules/renewals/domain.js';
import { PrismaRenewalRepository } from '../src/modules/renewals/prisma-renewal-repository.js';
import { seedSyntheticRenewalGraph } from '../prisma/seed.js';
import { withPostgresTestDatabase } from './postgres-test-database.js';

const withDatabase = <T>(
  work: Parameters<typeof withPostgresTestDatabase<T>>[1],
) => withPostgresTestDatabase(process.env.DATABASE_URL, work);

beforeEach(async () => {
  await withDatabase((client) =>
    client.$executeRawUnsafe(
      'TRUNCATE audit_events, follow_up_tasks, renewals, policies, contacts, workspaces CASCADE',
    ),
  );
});

it('replays the fixed seed as a no-op and refuses drift', async () => {
  await withDatabase(async (client) => {
    await seedSyntheticRenewalGraph(client);
    const before = await client.workspace.findUniqueOrThrow({
      where: { id: SYNTHETIC_RENEWAL.workspaceId },
      include: {
        contacts: true,
        policies: true,
        renewals: true,
        tasks: true,
        auditEvents: true,
      },
    });
    await seedSyntheticRenewalGraph(client);
    const after = await client.workspace.findUniqueOrThrow({
      where: { id: SYNTHETIC_RENEWAL.workspaceId },
      include: {
        contacts: true,
        policies: true,
        renewals: true,
        tasks: true,
        auditEvents: true,
      },
    });
    expect(after).toEqual(before);
    expect(after).toMatchObject({
      sourceVersion: 'renewal-seed.v1',
      sourceHash:
        'sha256:4f6d68165a762447fa005f673b1a64680397c420c31190bfa0d9a716e6288cbc',
      contacts: [{ id: SYNTHETIC_RENEWAL.contactId }],
      policies: [{ id: SYNTHETIC_RENEWAL.policyId }],
      renewals: [{ id: SYNTHETIC_RENEWAL.renewalId, status: 'open' }],
      tasks: [{ id: SYNTHETIC_RENEWAL.taskId, status: 'pending', version: 1 }],
      auditEvents: [
        { id: SYNTHETIC_RENEWAL.creationAuditId, eventType: 'renewal.created' },
      ],
    });
    await client.workspace.update({
      where: { id: SYNTHETIC_RENEWAL.workspaceId },
      data: { name: 'Drifted value' },
    });
    await expect(seedSyntheticRenewalGraph(client)).rejects.toThrow(
      'Synthetic renewal seed drift',
    );
    expect(
      await client.workspace.findUniqueOrThrow({
        where: { id: SYNTHETIC_RENEWAL.workspaceId },
        select: { name: true },
      }),
    ).toEqual({ name: 'Drifted value' });
  });
});

it('preserves an exact legally completed fixture on seed replay', async () => {
  await withDatabase(async (client) => {
    await seedSyntheticRenewalGraph(client);
    const completedAt = new Date('2026-12-15T15:01:00.000Z');
    await client.followUpTask.update({
      where: { id: SYNTHETIC_RENEWAL.taskId },
      data: { status: 'completed', version: 2, completedAt },
    });
    await client.auditEvent.create({
      data: {
        id: '60000000-0000-4000-8000-000000000002',
        workspaceId: SYNTHETIC_RENEWAL.workspaceId,
        actorId: SYNTHETIC_RENEWAL.actorId,
        eventType: 'task.completed',
        recordId: SYNTHETIC_RENEWAL.taskId,
        correlationId: '80000000-0000-4000-8000-000000000002',
        provenanceId: SYNTHETIC_RENEWAL.provenanceId,
        sourceVersion: SYNTHETIC_RENEWAL.sourceVersion,
        sourceHash: SYNTHETIC_RENEWAL.sourceHash,
        occurredAt: completedAt,
        createdAt: completedAt,
      },
    });
    const before = await client.workspace.findUniqueOrThrow({
      where: { id: SYNTHETIC_RENEWAL.workspaceId },
      include: {
        contacts: true,
        policies: true,
        renewals: true,
        tasks: true,
        auditEvents: { orderBy: { createdAt: 'asc' } },
      },
    });

    await seedSyntheticRenewalGraph(client);

    const after = await client.workspace.findUniqueOrThrow({
      where: { id: SYNTHETIC_RENEWAL.workspaceId },
      include: {
        contacts: true,
        policies: true,
        renewals: true,
        tasks: true,
        auditEvents: { orderBy: { createdAt: 'asc' } },
      },
    });
    expect(after).toEqual(before);
    expect(after.renewals).toEqual([
      expect.objectContaining({
        id: SYNTHETIC_RENEWAL.renewalId,
        status: 'open',
      }),
    ]);
    expect(after.tasks).toEqual([
      expect.objectContaining({
        id: SYNTHETIC_RENEWAL.taskId,
        status: 'completed',
        version: 2,
        completedAt,
      }),
    ]);
    expect(after.auditEvents).toHaveLength(2);
    expect(after.auditEvents[1]).toMatchObject({
      eventType: 'task.completed',
      workspaceId: SYNTHETIC_RENEWAL.workspaceId,
      actorId: SYNTHETIC_RENEWAL.actorId,
      recordId: SYNTHETIC_RENEWAL.taskId,
      correlationId: '80000000-0000-4000-8000-000000000002',
      provenanceId: SYNTHETIC_RENEWAL.provenanceId,
      sourceVersion: SYNTHETIC_RENEWAL.sourceVersion,
      sourceHash: SYNTHETIC_RENEWAL.sourceHash,
      occurredAt: completedAt,
      createdAt: completedAt,
    });
  });
});

it('refuses extra fixed-workspace rows without writing', async () => {
  await withDatabase(async (client) => {
    await seedSyntheticRenewalGraph(client);
    await client.contact.create({
      data: {
        id: '20000000-0000-4000-8000-000000000002',
        workspaceId: SYNTHETIC_RENEWAL.workspaceId,
        displayName: 'Extra synthetic contact',
      },
    });
    const before = await client.contact.findMany({
      where: { workspaceId: SYNTHETIC_RENEWAL.workspaceId },
      orderBy: { id: 'asc' },
    });
    await expect(seedSyntheticRenewalGraph(client)).rejects.toThrow(
      'Synthetic renewal seed drift',
    );
    expect(
      await client.contact.findMany({
        where: { workspaceId: SYNTHETIC_RENEWAL.workspaceId },
        orderBy: { id: 'asc' },
      }),
    ).toEqual(before);
  });
});

it('completes once and returns the persisted result on replay and concurrency', async () => {
  await withDatabase(async (client) => {
    await seedSyntheticRenewalGraph(client);
    const repository = new PrismaRenewalRepository(client);
    const command = {
      workspaceId: SYNTHETIC_RENEWAL.workspaceId,
      taskId: SYNTHETIC_RENEWAL.taskId,
      expectedTaskVersion: 1,
      actorId: SYNTHETIC_RENEWAL.actorId,
      correlationId: '80000000-0000-4000-8000-000000000002',
      eventId: '60000000-0000-4000-8000-000000000002',
      completedAt: new Date('2026-12-15T15:01:00.000Z'),
    };
    const [first, concurrent] = await Promise.all([
      repository.completeTask(command),
      repository.completeTask({
        ...command,
        correlationId: '80000000-0000-4000-8000-000000000003',
        eventId: '60000000-0000-4000-8000-000000000003',
        completedAt: new Date('2026-12-15T15:02:00.000Z'),
      }),
    ]);
    expect(first).toEqual(concurrent);
    expect(await repository.completeTask(command)).toEqual(first);
    expect(first).toMatchObject({
      kind: 'completed',
      value: {
        task: {
          id: SYNTHETIC_RENEWAL.taskId,
          renewalId: SYNTHETIC_RENEWAL.renewalId,
          status: 'completed',
          version: 2,
        },
        renewal: { id: SYNTHETIC_RENEWAL.renewalId, status: 'open' },
        completionAuditEvent: { type: 'task.completed' },
      },
    });
    const value = first.kind === 'completed' ? first.value : undefined;
    expect(value?.task.completedAt).toEqual(
      value?.completionAuditEvent.occurredAt,
    );
    const events = await client.auditEvent.findMany({
      where: {
        workspaceId: SYNTHETIC_RENEWAL.workspaceId,
        recordId: SYNTHETIC_RENEWAL.taskId,
        eventType: 'task.completed',
      },
    });
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      actorId: SYNTHETIC_RENEWAL.actorId,
      provenanceId: SYNTHETIC_RENEWAL.provenanceId,
      sourceVersion: SYNTHETIC_RENEWAL.sourceVersion,
      sourceHash: SYNTHETIC_RENEWAL.sourceHash,
    });
    expect(events[0].createdAt).toEqual(events[0].occurredAt);
    expect(events[0].occurredAt).toEqual(value?.task.completedAt);
  });
});

it('separates not-found, version-conflict, and invalid stored completion', async () => {
  await withDatabase(async (client) => {
    await seedSyntheticRenewalGraph(client);
    const repository = new PrismaRenewalRepository(client);
    const command = {
      workspaceId: SYNTHETIC_RENEWAL.workspaceId,
      taskId: SYNTHETIC_RENEWAL.taskId,
      expectedTaskVersion: 2,
      actorId: SYNTHETIC_RENEWAL.actorId,
      correlationId: '80000000-0000-4000-8000-000000000002',
      eventId: '60000000-0000-4000-8000-000000000002',
      completedAt: new Date('2026-12-15T15:01:00.000Z'),
    };
    expect(await repository.completeTask(command)).toEqual({
      kind: 'version-conflict',
    });
    expect(
      await repository.completeTask({
        ...command,
        workspaceId: '10000000-0000-4000-8000-000000000099',
      }),
    ).toEqual({ kind: 'not-found' });
    await client.followUpTask.update({
      where: { id: SYNTHETIC_RENEWAL.taskId },
      data: {
        status: 'completed',
        version: 2,
        completedAt: command.completedAt,
      },
    });
    await expect(
      repository.completeTask({ ...command, expectedTaskVersion: 1 }),
    ).rejects.toThrow('Stored task completion is invalid');
    expect(await client.auditEvent.count()).toBe(1);
  });
});

it('enforces workspace links, partial uniqueness, and immutable audit events', async () => {
  await withDatabase(async (client) => {
    await seedSyntheticRenewalGraph(client);
    const other = '10000000-0000-4000-8000-000000000099';
    await client.workspace.create({
      data: {
        id: other,
        name: 'Other synthetic workspace',
        sourceVersion: 'test',
        sourceHash: 'test',
      },
    });
    const repository = new PrismaRenewalRepository(client);
    expect(
      await repository.workspaceExists(SYNTHETIC_RENEWAL.workspaceId),
    ).toBe(true);
    expect(await repository.workspaceExists(other)).toBe(true);
    expect(
      await repository.workspaceExists('10000000-0000-4000-8000-000000000098'),
    ).toBe(false);
    await expect(
      client.$executeRawUnsafe(
        `INSERT INTO policies (id, workspace_id, contact_id, display_label, renewal_date) VALUES ('20000000-0000-4000-8000-000000000099', '${other}', '${SYNTHETIC_RENEWAL.contactId}', 'Cross scope', DATE '2027-02-01')`,
      ),
    ).rejects.toThrow();
    await expect(
      client.renewal.create({
        data: {
          id: '30000000-0000-4000-8000-000000000099',
          workspaceId: SYNTHETIC_RENEWAL.workspaceId,
          policyId: SYNTHETIC_RENEWAL.policyId,
          displayLabel: 'Duplicate open renewal',
          status: 'open',
        },
      }),
    ).rejects.toThrow();
    await expect(
      client.followUpTask.create({
        data: {
          id: '40000000-0000-4000-8000-000000000099',
          workspaceId: SYNTHETIC_RENEWAL.workspaceId,
          renewalId: SYNTHETIC_RENEWAL.renewalId,
          title: 'Duplicate pending task',
          status: 'pending',
          dueAt: new Date('2026-12-20T15:00:00.000Z'),
        },
      }),
    ).rejects.toThrow();
    const completion = {
      workspaceId: SYNTHETIC_RENEWAL.workspaceId,
      actorId: SYNTHETIC_RENEWAL.actorId,
      eventType: 'task.completed',
      recordId: SYNTHETIC_RENEWAL.taskId,
      correlationId: SYNTHETIC_RENEWAL.correlationId,
      provenanceId: SYNTHETIC_RENEWAL.provenanceId,
      sourceVersion: SYNTHETIC_RENEWAL.sourceVersion,
      sourceHash: SYNTHETIC_RENEWAL.sourceHash,
      occurredAt: new Date('2026-12-15T15:01:00.000Z'),
    };
    await client.auditEvent.create({
      data: { id: '60000000-0000-4000-8000-000000000002', ...completion },
    });
    const completed = await client.followUpTask.update({
      where: { id: SYNTHETIC_RENEWAL.taskId },
      data: { status: 'completed', completedAt: completion.occurredAt },
    });
    await client.followUpTask.create({
      data: {
        ...completed,
        id: '50000000-0000-4000-8000-000000000002',
        status: 'pending',
        completedAt: null,
      },
    });
    const [graph] = await repository.findOpenByWorkspace(
      SYNTHETIC_RENEWAL.workspaceId,
    );
    expect(graph.followUpTask).toMatchObject({ status: 'pending' });
    expect(graph.auditEvents.map(({ eventType }) => eventType)).toEqual([
      'renewal.created',
      'task.completed',
    ]);
    expect(graph.auditEvents[0]).toMatchObject({
      actorId: SYNTHETIC_RENEWAL.actorId,
      recordId: SYNTHETIC_RENEWAL.renewalId,
      correlationId: SYNTHETIC_RENEWAL.correlationId,
      provenanceId: SYNTHETIC_RENEWAL.provenanceId,
    });
    await expect(
      client.auditEvent.create({
        data: { id: '60000000-0000-4000-8000-000000000003', ...completion },
      }),
    ).rejects.toThrow();
    await expect(
      client.auditEvent.update({
        where: { id: SYNTHETIC_RENEWAL.creationAuditId },
        data: { eventType: 'changed' },
      }),
    ).rejects.toThrow('immutable');
    await expect(
      client.auditEvent.delete({
        where: { id: SYNTHETIC_RENEWAL.creationAuditId },
      }),
    ).rejects.toThrow('immutable');
  });
});

it.each(['pending', 'completed', 'missing'])(
  'retains open renewals with %s tasks within workspace scope',
  async (status) => {
    await withDatabase(async (client) => {
      await seedSyntheticRenewalGraph(client);
      const where = { id: SYNTHETIC_RENEWAL.taskId };
      if (status === 'missing') await client.followUpTask.delete({ where });
      if (status === 'completed')
        await client.followUpTask.update({
          where,
          data: { status, completedAt: new Date('2026-12-15T15:01:00.000Z') },
        });
      const repository = new PrismaRenewalRepository(client);
      const graph = await repository.findOpenByWorkspace(
        SYNTHETIC_RENEWAL.workspaceId,
      );
      expect(graph).toHaveLength(1);
      expect(graph[0]).toMatchObject({
        contact: { id: SYNTHETIC_RENEWAL.contactId },
        renewal: { id: SYNTHETIC_RENEWAL.renewalId, status: 'open' },
        followUpTask:
          status === 'missing'
            ? null
            : { id: SYNTHETIC_RENEWAL.taskId, status },
      });
      expect(
        await repository.findOpenByWorkspace(
          '10000000-0000-4000-8000-000000000099',
        ),
      ).toEqual([]);
      await expect(repository.findOpenByWorkspace('')).rejects.toThrow(
        'workspaceId is required',
      );
    });
  },
);
