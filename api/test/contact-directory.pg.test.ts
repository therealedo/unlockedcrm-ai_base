import { beforeEach, expect, it } from 'vitest';
import { seedSyntheticRenewalGraph } from '../prisma/seed.js';
import { buildApp } from '../src/app.js';
import { createSyntheticRequestContext } from '../src/context/request-context.js';
import {
  contactPayloadHash,
  normalizeContactRequest,
} from '../src/modules/contacts/domain.js';
import { PrismaContactRepository } from '../src/modules/contacts/prisma-contact-repository.js';
import { registerContactCreateRoute } from '../src/modules/contacts/routes.js';
import { createContact } from '../src/modules/contacts/service.js';
import { SYNTHETIC_RENEWAL } from '../src/modules/renewals/domain.js';
import { withPostgresTestDatabase } from './postgres-test-database.js';

const withDatabase = <T>(
  work: Parameters<typeof withPostgresTestDatabase<T>>[1],
) => withPostgresTestDatabase(process.env.DATABASE_URL, work);
const path = `/api/v1/workspaces/${SYNTHETIC_RENEWAL.workspaceId}/contacts`;
const body = {
  firstName: 'Zoe',
  lastName: 'Atomic',
  email: 'ZOE@EXAMPLE.COM',
  phone: '2025550199',
  birthDate: '2000-02-29',
  gender: 'non_binary',
  notes: ' Synthetic only ',
  tags: ['client', 'new_lead'],
};
const post = (
  app: Parameters<typeof registerContactCreateRoute>[0],
  key: string,
  requestBody: object = body,
  requestPath = path,
) =>
  app.inject({
    method: 'POST',
    path: requestPath,
    headers: { 'idempotency-key': key },
    body: requestBody,
  });
const snapshot = async (
  client: Parameters<Parameters<typeof withDatabase>[0]>[0],
) => ({
  contacts: await client.contact.findMany({ orderBy: { id: 'asc' } }),
  tags: await client.contactTag.findMany({
    orderBy: [{ contactId: 'asc' }, { tagCode: 'asc' }],
  }),
  events: await client.auditEvent.findMany({ orderBy: { id: 'asc' } }),
  receipts: await client.contactCreateReceipt.findMany({
    orderBy: [{ workspaceId: 'asc' }, { idempotencyKey: 'asc' }],
  }),
});
const createApp = async (repository: PrismaContactRepository, now: Date) => {
  const contextFactory = createSyntheticRequestContext;
  const dependencies = { repository, contextFactory, now: () => now };
  const app = await buildApp({ contacts: dependencies });
  registerContactCreateRoute(app, dependencies);
  return app;
};

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

it('creates one durable graph, replays its original envelope, and isolates receipt scope', () =>
  withDatabase(async (client) => {
    await seedSyntheticRenewalGraph(client);
    const repository = new PrismaContactRepository(client);
    const now = new Date('2026-09-08T12:00:00.000Z');
    const app = await createApp(repository, now);
    try {
      const beforeInvalid = await snapshot(client);
      expect(
        (await post(app, 'contact.atomic:invalid', { ...body, firstName: '' }))
          .statusCode,
      ).toBe(400);
      expect(await snapshot(client)).toEqual(beforeInvalid);

      const first = await post(app, 'contact.atomic:one');
      expect(first.statusCode).toBe(201);
      expect(first.headers['idempotency-replayed']).toBe('false');
      const normalized = normalizeContactRequest(body, now)!;
      expect(first.json().contact).toEqual({
        id: expect.stringMatching(/^[0-9a-f-]{36}$/),
        ...normalized,
        displayName: 'Zoe Atomic',
        createdAt: now.toISOString(),
      });
      expect(first.json()).toMatchObject({
        schemaVersion: 'contact-directory.v1',
        workspaceId: SYNTHETIC_RENEWAL.workspaceId,
        correlationId: expect.stringMatching(/^[0-9a-f-]{36}$/),
        contactCreatedEvent: {
          id: expect.stringMatching(/^[0-9a-f-]{36}$/),
          type: 'contact.created',
          occurredAt: now.toISOString(),
        },
      });
      const afterFirst = await snapshot(client);
      const replay = await post(app, 'contact.atomic:one');
      expect([
        replay.statusCode,
        replay.headers['idempotency-replayed'],
      ]).toEqual([200, 'true']);
      expect(replay.json()).toEqual(first.json());
      expect(await snapshot(client)).toEqual(afterFirst);

      const conflict = await post(app, 'contact.atomic:one', {
        ...body,
        firstName: 'Different',
      });
      expect(conflict.statusCode).toBe(409);
      expect(conflict.json().error.code).toBe('IDEMPOTENCY_KEY_CONFLICT');
      expect(await snapshot(client)).toEqual(afterFirst);

      const createdId = first.json().contact.id;
      const storedContact = afterFirst.contacts.find(
        ({ id }) => id === createdId,
      )!;
      const { tags: expectedTags, ...storedFields } = normalized;
      expect(storedContact).toMatchObject({
        ...storedFields,
        workspaceId: SYNTHETIC_RENEWAL.workspaceId,
        displayName: 'Zoe Atomic',
        birthDate: new Date('2000-02-29T00:00:00.000Z'),
        createdAt: now,
      });
      expect(
        afterFirst.tags
          .filter(({ contactId }) => contactId === createdId)
          .map(({ tagCode }) => tagCode),
      ).toEqual([...expectedTags].sort());
      const receipt = afterFirst.receipts.find(
        ({ idempotencyKey }) => idempotencyKey === 'contact.atomic:one',
      )!;
      expect(receipt).toMatchObject({
        payloadHash: contactPayloadHash(normalized),
        responseBody: first.json(),
        createdAt: now,
      });
      const event = afterFirst.events.find(
        ({ id }) => id === first.json().contactCreatedEvent.id,
      )!;
      expect(event).toMatchObject({
        actorId: SYNTHETIC_RENEWAL.actorId,
        recordId: first.json().contact.id,
        correlationId: first.json().correlationId,
        provenanceId: '91000000-0000-4000-8000-000000000001',
        sourceVersion: 'contact-intake.v1',
        sourceHash:
          'sha256:127f6e0f17ecb9bb46e0dc927b9f984985d8547461610d0670ef654653bca103',
        occurredAt: now,
        createdAt: now,
      });
      await expect(
        client.auditEvent.update({
          where: { id: event.id },
          data: { eventType: 'changed' },
        }),
      ).rejects.toThrow();
      await expect(
        client.auditEvent.delete({ where: { id: event.id } }),
      ).rejects.toThrow();

      const otherId = '10000000-0000-4000-8000-000000000099';
      await client.workspace.create({
        data: {
          id: otherId,
          name: 'Other Synthetic Workspace',
          sourceVersion: 'test.v1',
          sourceHash: 'sha256:test',
        },
      });
      const other = await createContact(
        repository,
        createSyntheticRequestContext({ workspaceId: otherId }),
        otherId,
        'contact.atomic:one',
        normalized,
        now,
      );
      expect(other.kind).toBe('ok');
      expect(await client.contactCreateReceipt.count()).toBe(2);
    } finally {
      await app.close();
    }
  }));

it('collapses equal and unequal races and fully rolls back a late failure', () =>
  withDatabase(async (client) => {
    await seedSyntheticRenewalGraph(client);
    const repository = new PrismaContactRepository(client);
    const app = await createApp(
      repository,
      new Date('2026-09-08T13:00:00.000Z'),
    );
    try {
      const equal = await Promise.all(
        [0, 1].map(() => post(app, 'contact.race:equal')),
      );
      expect(equal.map(({ statusCode }) => statusCode)).toEqual(
        expect.arrayContaining([200, 201]),
      );
      expect(equal[0].json()).toEqual(equal[1].json());

      const unequal = await Promise.all([
        post(app, 'contact.race:unequal'),
        post(app, 'contact.race:unequal', { ...body, firstName: 'Yara' }),
      ]);
      expect(unequal.map(({ statusCode }) => statusCode)).toEqual(
        expect.arrayContaining([201, 409]),
      );
      expect(
        await Promise.all([
          client.contactCreateReceipt.count(),
          client.contact.count({
            where: { firstName: { in: ['Zoe', 'Yara'] } },
          }),
          client.contactTag.count(),
          client.auditEvent.count({ where: { eventType: 'contact.created' } }),
        ]),
      ).toEqual([2, 2, 6, 2]);

      const beforeFailure = await snapshot(client);
      const occurredAt = new Date('2026-09-08T14:00:00.000Z');
      const input = normalizeContactRequest(body, occurredAt)!;
      const failedContactId = '20000000-0000-7000-8000-000000000099';
      const failedResponse = {
        ...equal[0].json(),
        contact: {
          ...equal[0].json().contact,
          id: failedContactId,
          createdAt: occurredAt.toISOString(),
        },
        contactCreatedEvent: {
          ...equal[0].json().contactCreatedEvent,
          id: SYNTHETIC_RENEWAL.creationAuditId,
          occurredAt: occurredAt.toISOString(),
        },
      };
      await expect(
        repository.create({
          workspaceId: SYNTHETIC_RENEWAL.workspaceId,
          actorId: SYNTHETIC_RENEWAL.actorId,
          idempotencyKey: 'contact.failure:late',
          payloadHash: contactPayloadHash(input),
          contactId: failedContactId,
          eventId: SYNTHETIC_RENEWAL.creationAuditId,
          occurredAt,
          input,
          responseBody: failedResponse,
        }),
      ).rejects.toThrow();
      expect(await snapshot(client)).toEqual(beforeFailure);
    } finally {
      await app.close();
    }
  }));
