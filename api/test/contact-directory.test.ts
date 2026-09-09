import { expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import {
  contactPayloadHash,
  normalizeContactRequest,
} from '../src/modules/contacts/domain.js';
import type {
  ContactCreateRepository,
  ContactRepository,
  StoredReceipt,
} from '../src/modules/contacts/repository.js';
import { registerContactCreateRoute } from '../src/modules/contacts/routes.js';
import { createContact } from '../src/modules/contacts/service.js';

const workspaceId = '10000000-0000-4000-8000-000000000001';
const otherWorkspaceId = '10000000-0000-4000-8000-000000000099';
const contactId = '20000000-0000-4000-8000-000000000001';
const validModernContactIds = [
  '20000000-0000-6000-8000-000000000001',
  '20000000-0000-7000-8000-000000000001',
  '20000000-0000-8000-8000-000000000001',
];
const context = {
  workspaceId,
  actorId: '70000000-0000-4000-8000-000000000001',
  correlationId: '80000000-0000-4000-8000-000000000001',
  provenance: 'synthetic-local' as const,
};
const today = new Date('2026-09-08T12:00:00.000Z');
const validBody = { firstName: 'Ada', lastName: 'Test', email: 'a@b.example' };
const createPath = `/api/v1/workspaces/${workspaceId}/contacts`;
const input = normalizeContactRequest(validBody, today)!;
const originalBody = {
  schemaVersion: 'contact-directory.v1' as const,
  workspaceId,
  correlationId: context.correlationId,
  contact: {
    id: '20000000-0000-7000-8000-000000000010',
    ...input,
    displayName: 'Ada Test',
    createdAt: today.toISOString(),
  },
  contactCreatedEvent: {
    id: '60000000-0000-8000-8000-000000000010',
    type: 'contact.created' as const,
    occurredAt: today.toISOString(),
  },
};
const createRepository = (
  overrides: Partial<ContactCreateRepository> = {},
): ContactCreateRepository => ({
  workspaceExists: async () => true,
  findReceipt: async () => null,
  create: async () => ({ kind: 'created' }),
  ...overrides,
});
const post = (
  app: Awaited<ReturnType<typeof buildApp>>,
  key: string,
  body: object = validBody,
  path = createPath,
  headers: Record<string, string> = {},
) =>
  app.inject({
    method: 'POST',
    path,
    headers: { ...headers, 'idempotency-key': key },
    body,
  });
const createApp = async (
  repository: ContactCreateRepository,
  contextFactory = () => context,
  now = () => today,
) => {
  const app = await buildApp();
  registerContactCreateRoute(app, { repository, contextFactory, now });
  return app;
};

it('validates stored receipts strictly and preserves the original replay envelope', async () => {
  const hash = contactPayloadHash(input);
  const resultFor = (receipt: StoredReceipt) =>
    createContact(
      createRepository({ findReceipt: async () => receipt }),
      context,
      workspaceId,
      'contact.key:receipt',
      input,
      today,
    );
  const replay = await resultFor({
    payloadHash: hash,
    responseBody: originalBody,
  });
  expect(replay).toEqual({ kind: 'ok', value: originalBody, replayed: true });

  const changedContact = (change: Record<string, unknown>) => ({
    ...originalBody,
    contact: { ...originalBody.contact, ...change },
  });
  const changedEvent = (change: Record<string, unknown>) => ({
    ...originalBody,
    contactCreatedEvent: { ...originalBody.contactCreatedEvent, ...change },
  });
  const invalidBodies = [
    { ...originalBody, extra: true },
    { ...originalBody, schemaVersion: 'wrong' },
    { ...originalBody, workspaceId: otherWorkspaceId },
    { ...originalBody, correlationId: 'not-a-uuid' },
    changedContact({ extra: true }),
    changedContact({ id: 'not-a-uuid' }),
    changedContact({ email: 'ADA@B.EXAMPLE' }),
    changedContact({ displayName: 'Wrong' }),
    changedContact({ createdAt: '2026-09-08' }),
    changedEvent({ extra: true }),
    changedEvent({ id: 'not-a-uuid' }),
    changedEvent({ occurredAt: '2026-09-08T12:00:00.001Z' }),
  ];
  for (const responseBody of invalidBodies)
    expect((await resultFor({ payloadHash: hash, responseBody })).kind).toBe(
      'unavailable',
    );

  const conflict = await resultFor({
    payloadHash: 'different',
    responseBody: { corrupt: true },
  });
  expect(conflict.kind).toBe('conflict');
});

it('authorizes create before lookup and returns exact create errors with one clock capture', async () => {
  let calls = 0;
  let contextCalls = 0;
  let nowCalls = 0;
  const repository = createRepository({
    workspaceExists: async () => (++calls, true),
    findReceipt: async () => (++calls, null),
    create: async () => (++calls, { kind: 'created' }),
  });
  const app = await createApp(
    repository,
    () => (++contextCalls, context),
    () => (++nowCalls, today),
  );
  try {
    const denied = await post(
      app,
      'contact.key:denied',
      validBody,
      `/api/v1/workspaces/${otherWorkspaceId}/contacts`,
      { 'x-workspace-id': otherWorkspaceId },
    );
    expect(denied.statusCode).toBe(404);
    expect(denied.json().error.code).toBe('CONTACT_NOT_FOUND');
    expect(calls).toBe(0);

    const messages = {
      INVALID_WORKSPACE_ID: 'Workspace ID must be a UUID.',
      INVALID_IDEMPOTENCY_KEY: 'Idempotency key is invalid.',
      INVALID_CONTACT_REQUEST: 'Contact request is invalid.',
    } as const;
    for (const [requestPath, key, body, code] of [
      [
        '/api/v1/workspaces/not-a-uuid/contacts',
        'contact.key:1',
        validBody,
        'INVALID_WORKSPACE_ID',
      ],
      [createPath, 'short', validBody, 'INVALID_IDEMPOTENCY_KEY'],
      [createPath, 'contact.key:2', {}, 'INVALID_CONTACT_REQUEST'],
    ] as const) {
      const response = await post(app, key, body, requestPath);
      expect(response.statusCode).toBe(400);
      expect(response.json()).toEqual({
        error: {
          code,
          message: messages[code],
          correlationId: context.correlationId,
        },
      });
    }

    const created = await post(app, 'contact.key:created');
    expect(created.statusCode).toBe(201);
    expect(created.headers['idempotency-replayed']).toBe('false');
    expect(created.json().contact.createdAt).toBe(today.toISOString());
    expect([calls, nowCalls, contextCalls]).toEqual([3, 2, 5]);
  } finally {
    await app.close();
  }
});

it('maps missing race receipts and repository failures without retry', async () => {
  let creates = 0;
  const app = await createApp(
    createRepository({
      create: async ({ idempotencyKey }) => {
        creates += 1;
        if (idempotencyKey.endsWith('failure'))
          throw new Error('private database detail');
        return { kind: 'collision', receipt: null };
      },
    }),
  );
  try {
    for (const key of ['contact.key:race', 'contact.key:failure']) {
      const response = await post(app, key);
      expect(response.statusCode).toBe(503);
      expect(response.json()).toEqual({
        error: {
          code: 'CONTACT_PERSISTENCE_UNAVAILABLE',
          message: 'Contact persistence is unavailable.',
          correlationId: context.correlationId,
        },
      });
    }
    expect(creates).toBe(2);
  } finally {
    await app.close();
  }
});

it('rejects invalid, unauthorized, and stale read paths without repository disclosure', async () => {
  let calls = 0;
  const repository: ContactRepository = {
    workspaceExists: async () => (++calls, true),
    list: async () => (++calls, []),
    find: async () => (++calls, null),
  };
  const app = await buildApp({
    contacts: { repository, contextFactory: () => context },
  });
  try {
    const invalidWorkspace = await app.inject(
      '/api/v1/workspaces/not-a-uuid/contacts',
    );
    expect(invalidWorkspace.json()).toEqual({
      error: {
        code: 'INVALID_WORKSPACE_ID',
        message: 'Workspace ID must be a UUID.',
        correlationId: context.correlationId,
      },
    });
    for (const path of [
      `/api/v1/workspaces/${workspaceId}/contacts/not-a-uuid`,
      `/api/v1/workspaces/${workspaceId}/contacts/%00`,
      `/api/v1/workspaces/${workspaceId}/contacts/20000000-0000-0000-8000-000000000001`,
      `/api/v1/workspaces/${workspaceId}/contacts/20000000-0000-9000-8000-000000000001`,
      `/api/v1/workspaces/${workspaceId}/contacts/20000000-0000-7000-7000-000000000001`,
    ]) {
      const invalidContact = await app.inject(path);
      expect(invalidContact.statusCode).toBe(400);
      expect(invalidContact.json().error.code).toBe('INVALID_CONTACT_ID');
    }
    for (const path of [
      `/api/v1/workspaces/${workspaceId}/contacts/${contactId}/extra`,
      `/api/v1/workspaces/${workspaceId}/contacts%2F${contactId}`,
    ])
      expect((await app.inject(path)).statusCode).toBe(404);
    expect(calls).toBe(0);
    const denied = await app.inject({
      path: `/api/v1/workspaces/${otherWorkspaceId}/contacts`,
      headers: { 'x-workspace-id': otherWorkspaceId },
    });
    expect(denied.statusCode).toBe(404);
    expect(denied.json()).toEqual({
      error: {
        code: 'CONTACT_DIRECTORY_NOT_FOUND',
        message: 'Contact directory not found.',
        correlationId: context.correlationId,
      },
    });
    expect(calls).toBe(0);
  } finally {
    await app.close();
  }
});

it('accepts RFC 9562 UUID versions before authorized repository lookup', async () => {
  const lookedUp: string[] = [];
  const modernWorkspaceId = '10000000-0000-7000-8000-000000000001';
  const repository: ContactRepository = {
    workspaceExists: async () => true,
    list: async () => [],
    find: async (_workspaceId, id) => {
      lookedUp.push(id);
      return null;
    },
  };
  const app = await buildApp({
    contacts: {
      repository,
      contextFactory: () => ({ ...context, workspaceId: modernWorkspaceId }),
    },
  });
  try {
    const list = await app.inject(
      `/api/v1/workspaces/${modernWorkspaceId}/contacts`,
    );
    expect(list.statusCode).toBe(200);
    for (const id of validModernContactIds) {
      const response = await app.inject(
        `/api/v1/workspaces/${modernWorkspaceId}/contacts/${id}`,
      );
      expect(response.statusCode).toBe(404);
      expect(response.json().error.code).toBe('CONTACT_NOT_FOUND');
    }
    expect(lookedUp).toEqual(validModernContactIds);
  } finally {
    await app.close();
  }
});

it('returns scoped not-found and persistence-unavailable errors', async () => {
  let fail = false;
  const repository: ContactRepository = {
    workspaceExists: async () => {
      if (fail) throw new Error('unavailable');
      return false;
    },
    list: async () => [],
    find: async () => {
      if (fail) throw new Error('unavailable');
      return null;
    },
  };
  const app = await buildApp({
    contacts: { repository, contextFactory: () => context },
  });
  try {
    const missingDirectory = await app.inject(
      `/api/v1/workspaces/${workspaceId}/contacts`,
    );
    expect(missingDirectory.json().error.code).toBe(
      'CONTACT_DIRECTORY_NOT_FOUND',
    );
    const missingContact = await app.inject(
      `/api/v1/workspaces/${workspaceId}/contacts/${contactId}`,
    );
    expect(missingContact.json().error.code).toBe('CONTACT_NOT_FOUND');
    fail = true;
    for (const path of [
      `/api/v1/workspaces/${workspaceId}/contacts`,
      `/api/v1/workspaces/${workspaceId}/contacts/${contactId}`,
    ]) {
      const unavailable = await app.inject(path);
      expect(unavailable.statusCode).toBe(503);
      expect(unavailable.json()).toEqual({
        error: {
          code: 'CONTACT_PERSISTENCE_UNAVAILABLE',
          message: 'Contact persistence is unavailable.',
          correlationId: context.correlationId,
        },
      });
    }
  } finally {
    await app.close();
  }
});
