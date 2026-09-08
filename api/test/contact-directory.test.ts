import { expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import type { ContactRepository } from '../src/modules/contacts/repository.js';

const workspaceId = '10000000-0000-4000-8000-000000000001';
const otherWorkspaceId = '10000000-0000-4000-8000-000000000099';
const contactId = '20000000-0000-4000-8000-000000000001';
const context = {
  workspaceId,
  actorId: '70000000-0000-4000-8000-000000000001',
  correlationId: '80000000-0000-4000-8000-000000000001',
  provenance: 'synthetic-local' as const,
};

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
