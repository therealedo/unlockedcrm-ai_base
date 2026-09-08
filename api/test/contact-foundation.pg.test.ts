import { expect, it, vi } from 'vitest';
import { seedSyntheticRenewalGraph } from '../prisma/seed.js';
import type { PrismaClient } from '../src/generated/prisma/client.js';
import { SYNTHETIC_RENEWAL } from '../src/modules/renewals/domain.js';
import { createLocalPersistence } from '../src/plugins/local-persistence.js';
import { withPostgresTestDatabase } from './postgres-test-database.js';

const withDatabase = <T>(
  work: Parameters<typeof withPostgresTestDatabase<T>>[1],
) => withPostgresTestDatabase(process.env.DATABASE_URL, work);

async function clearDatabase(client: PrismaClient) {
  await client.$executeRawUnsafe(
    'TRUNCATE contact_create_receipts, contact_tags, audit_events, follow_up_tasks, renewals, policies, contacts, workspaces CASCADE',
  );
}

it('backfills Avery and seeds collision-checked ORIGINAL contacts without receipts', async () => {
  await withDatabase(async (client) => {
    await clearDatabase(client);
    await seedSyntheticRenewalGraph(client);

    const contacts = await client.contact.findMany({
      orderBy: { id: 'asc' },
      include: { tags: { orderBy: { tagCode: 'asc' } } },
    });
    expect(contacts).toEqual([
      expect.objectContaining({
        id: SYNTHETIC_RENEWAL.contactId,
        firstName: 'Avery',
        lastName: 'Harbor',
        displayName: 'Avery Harbor',
        email: null,
        phone: null,
        birthDate: null,
        gender: null,
        notes: null,
        tags: [],
      }),
      expect.objectContaining({
        id: '20000000-0000-4000-8000-000000000002',
        firstName: 'Mara',
        lastName: 'Testwell',
        email: 'mara.testwell@example.com',
        phone: '+12025550114',
        birthDate: new Date('1956-04-12T00:00:00.000Z'),
        gender: 'female',
        notes: null,
        tags: [expect.objectContaining({ tagCode: 'client' })],
      }),
      expect.objectContaining({
        id: '20000000-0000-4000-8000-000000000003',
        firstName: 'Eli',
        lastName: 'Sample',
        email: 'eli.sample@example.com',
        phone: '+12025550168',
        birthDate: null,
        gender: null,
        notes: null,
        tags: [expect.objectContaining({ tagCode: 'new_lead' })],
      }),
    ]);
    expect(await client.contactCreateReceipt.count()).toBe(0);
    expect(
      await client.auditEvent.count({
        where: { eventType: 'contact.created' },
      }),
    ).toBe(0);

    const before = JSON.stringify(contacts);
    await seedSyntheticRenewalGraph(client);
    expect(
      JSON.stringify(
        await client.contact.findMany({
          orderBy: { id: 'asc' },
          include: { tags: { orderBy: { tagCode: 'asc' } } },
        }),
      ),
    ).toBe(before);

    await client.contact.update({
      where: { id: SYNTHETIC_RENEWAL.contactId },
      data: { firstName: null, lastName: null },
    });
    await seedSyntheticRenewalGraph(client);
    expect(
      await client.contact.findUnique({
        where: { id: SYNTHETIC_RENEWAL.contactId },
      }),
    ).toMatchObject({ firstName: 'Avery', lastName: 'Harbor' });
  });
});

it('preserves ordinary contacts and events while rejecting auxiliary collisions before writes', async () => {
  await withDatabase(async (client) => {
    await clearDatabase(client);
    await seedSyntheticRenewalGraph(client);
    const ordinaryId = '20000000-0000-4000-8000-000000000099';
    await client.contact.create({
      data: {
        id: ordinaryId,
        workspaceId: SYNTHETIC_RENEWAL.workspaceId,
        displayName: 'Ordinary Synthetic',
        firstName: 'Ordinary',
        lastName: 'Synthetic',
      },
    });
    await client.auditEvent.create({
      data: {
        id: '60000000-0000-4000-8000-000000000099',
        workspaceId: SYNTHETIC_RENEWAL.workspaceId,
        actorId: SYNTHETIC_RENEWAL.actorId,
        eventType: 'contact.created',
        recordId: ordinaryId,
        correlationId: '80000000-0000-4000-8000-000000000099',
        provenanceId: '91000000-0000-4000-8000-000000000001',
        sourceVersion: 'contact-intake.v1',
        sourceHash:
          'sha256:127f6e0f17ecb9bb46e0dc927b9f984985d8547461610d0670ef654653bca103',
        occurredAt: new Date('2026-09-08T12:00:00.000Z'),
      },
    });
    await expect(seedSyntheticRenewalGraph(client)).resolves.toBeUndefined();
    expect(
      await client.contact.findUnique({ where: { id: ordinaryId } }),
    ).toMatchObject({ displayName: 'Ordinary Synthetic' });

    await client.contact.update({
      where: { id: '20000000-0000-4000-8000-000000000002' },
      data: { email: 'collision@example.com' },
    });
    const before = await Promise.all([
      client.contact.count(),
      client.contactTag.count(),
      client.auditEvent.count(),
      client.contactCreateReceipt.count(),
    ]);
    await expect(seedSyntheticRenewalGraph(client)).rejects.toThrow(
      'Synthetic renewal seed drift',
    );
    expect(
      await Promise.all([
        client.contact.count(),
        client.contactTag.count(),
        client.auditEvent.count(),
        client.contactCreateReceipt.count(),
      ]),
    ).toEqual(before);
    expect(
      await client.contact.findUnique({
        where: { id: '20000000-0000-4000-8000-000000000002' },
      }),
    ).toMatchObject({ email: 'collision@example.com' });
  });
});

it('rejects protected cross-links and keeps contact events append-only', async () => {
  await withDatabase(async (client) => {
    await clearDatabase(client);
    await seedSyntheticRenewalGraph(client);
    await client.policy.create({
      data: {
        id: '30000000-0000-4000-8000-000000000099',
        workspaceId: SYNTHETIC_RENEWAL.workspaceId,
        contactId: SYNTHETIC_RENEWAL.contactId,
        displayLabel: 'Unexpected protected link',
        renewalDate: new Date('2027-03-01T00:00:00.000Z'),
      },
    });
    const before = await Promise.all([
      client.contact.count(),
      client.policy.count(),
      client.auditEvent.count(),
    ]);
    await expect(seedSyntheticRenewalGraph(client)).rejects.toThrow(
      'Synthetic renewal seed drift',
    );
    expect(
      await Promise.all([
        client.contact.count(),
        client.policy.count(),
        client.auditEvent.count(),
      ]),
    ).toEqual(before);

    const ordinaryId = '20000000-0000-4000-8000-000000000099';
    await client.contact.create({
      data: {
        id: ordinaryId,
        workspaceId: SYNTHETIC_RENEWAL.workspaceId,
        displayName: 'Append Only Synthetic',
      },
    });
    const event = await client.auditEvent.create({
      data: {
        id: '60000000-0000-4000-8000-000000000099',
        workspaceId: SYNTHETIC_RENEWAL.workspaceId,
        actorId: SYNTHETIC_RENEWAL.actorId,
        eventType: 'contact.created',
        recordId: ordinaryId,
        correlationId: '80000000-0000-4000-8000-000000000099',
        provenanceId: '91000000-0000-4000-8000-000000000001',
        sourceVersion: 'contact-intake.v1',
        sourceHash:
          'sha256:127f6e0f17ecb9bb46e0dc927b9f984985d8547461610d0670ef654653bca103',
        occurredAt: new Date('2026-09-08T12:00:00.000Z'),
      },
    });
    await expect(
      client.auditEvent.update({
        where: { id: event.id },
        data: { eventType: 'changed' },
      }),
    ).rejects.toThrow('immutable');
    await expect(
      client.auditEvent.delete({ where: { id: event.id } }),
    ).rejects.toThrow('immutable');
  });
});

it('owns one Prisma lifecycle while preserving renewal plugin compatibility', async () => {
  const connect = vi.fn(async () => undefined);
  const disconnect = vi.fn(async () => undefined);
  const client = {
    $connect: connect,
    $disconnect: disconnect,
  } as unknown as PrismaClient;
  const persistence = await createLocalPersistence(
    'synthetic-test',
    () => client,
  );

  expect(connect).toHaveBeenCalledTimes(1);
  expect(persistence.renewals).toBeDefined();
  expect(persistence.contextFactory().workspaceId).toBe(
    SYNTHETIC_RENEWAL.workspaceId,
  );
  await persistence.close();
  await persistence.close();
  expect(disconnect).toHaveBeenCalledTimes(1);
});
