import { beforeEach, expect, it } from 'vitest';
import { seedSyntheticRenewalGraph } from '../prisma/seed.js';
import { buildApp } from '../src/app.js';
import { createSyntheticRequestContext } from '../src/context/request-context.js';
import { PrismaContactRepository } from '../src/modules/contacts/prisma-contact-repository.js';
import { SYNTHETIC_RENEWAL } from '../src/modules/renewals/domain.js';
import { withPostgresTestDatabase } from './postgres-test-database.js';

const withDatabase = <T>(
  work: Parameters<typeof withPostgresTestDatabase<T>>[1],
) => withPostgresTestDatabase(process.env.DATABASE_URL, work);
const path = `/api/v1/workspaces/${SYNTHETIC_RENEWAL.workspaceId}/contacts`;

beforeEach(() =>
  withDatabase((client) =>
    client.$executeRawUnsafe(
      'TRUNCATE contact_create_receipts, contact_tags, audit_events, follow_up_tasks, renewals, policies, contacts, workspaces CASCADE',
    ),
  ),
);

it('serves ordered summaries and details while production POST remains dormant', () =>
  withDatabase(async (client) => {
    await seedSyntheticRenewalGraph(client);
    await client.contactTag.createMany({
      data: ['client', 'new_lead', 'follow_up'].map((tagCode) => ({
        workspaceId: SYNTHETIC_RENEWAL.workspaceId,
        contactId: SYNTHETIC_RENEWAL.contactId,
        tagCode,
      })),
    });
    await client.contact.createMany({
      data: [
        ['20000000-0000-4000-8000-000000000004', 'case', 'alpha'],
        ['20000000-0000-4000-8000-000000000005', 'Case', 'ALPHA'],
        ['20000000-0000-4000-8000-000000000006', 'Zed', 'A'],
        ['20000000-0000-4000-8000-000000000007', 'Alpha', 'A!'],
        ['20000000-0000-4000-8000-000000000009', 'Same', 'Tie'],
        ['20000000-0000-4000-8000-000000000008', 'Same', 'Tie'],
      ].map(([id, firstName, lastName]) => ({
        id: id!,
        workspaceId: SYNTHETIC_RENEWAL.workspaceId,
        firstName: firstName!,
        lastName: lastName!,
        displayName: `Synthetic ${firstName}`,
      })),
    });
    const dependencies = {
      repository: new PrismaContactRepository(client),
      contextFactory: createSyntheticRequestContext,
    };
    const app = await buildApp({ contacts: dependencies });
    try {
      const list = await app.inject(path);
      expect(list.statusCode).toBe(200);
      expect(list.json()).toMatchObject({
        schemaVersion: 'contact-directory.v1',
        workspaceId: SYNTHETIC_RENEWAL.workspaceId,
        correlationId: expect.any(String),
      });
      expect(list.json().items.map((item: { id: string }) => item.id)).toEqual([
        '20000000-0000-4000-8000-000000000006',
        '20000000-0000-4000-8000-000000000007',
        '20000000-0000-4000-8000-000000000004',
        '20000000-0000-4000-8000-000000000005',
        SYNTHETIC_RENEWAL.contactId,
        '20000000-0000-4000-8000-000000000003',
        '20000000-0000-4000-8000-000000000002',
        '20000000-0000-4000-8000-000000000008',
        '20000000-0000-4000-8000-000000000009',
      ]);
      expect(list.json().items[6]).toMatchObject({
        firstName: 'Mara',
        birthDate: '1956-04-12',
        gender: 'female',
        tags: ['client'],
      });
      expect(list.json().items[0]).not.toHaveProperty('notes');
      const detail = await app.inject(`${path}/${SYNTHETIC_RENEWAL.contactId}`);
      expect(detail.statusCode).toBe(200);
      expect(detail.json().contact).toMatchObject({
        id: SYNTHETIC_RENEWAL.contactId,
        firstName: 'Avery',
        lastName: 'Harbor',
        notes: null,
        tags: ['new_lead', 'follow_up', 'client'],
      });
      expect(
        (await app.inject({ method: 'POST', path, body: {} })).statusCode,
      ).toBe(404);
      expect(await client.contactCreateReceipt.count()).toBe(0);
      expect(
        await client.auditEvent.count({
          where: { eventType: 'contact.created' },
        }),
      ).toBe(0);
    } finally {
      await app.close();
    }
  }));
