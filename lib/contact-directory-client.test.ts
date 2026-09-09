import { describe, expect, it, vi } from 'vitest';

import {
  CONTACT_DIRECTORY_URL,
  contactDirectoryDetailUrl,
  createHttpContactDirectoryClient,
  type ContactDirectorySummary,
} from './contact-directory-client';
import {
  searchContacts,
  selectContactById,
  selectContactCount,
  selectContactOptions,
} from './contact-directory-selectors';
import { matchContactDirectoryRoute, matchRenewalRoute } from './crm-route';

const ids = {
  workspace: '10000000-0000-4000-8000-000000000001',
  avery: '20000000-0000-4000-8000-000000000001',
  mara: '20000000-0000-4000-8000-000000000002',
  correlation: '80000000-0000-4000-8000-000000000002',
} as const;
const contact = (
  overrides: Partial<ContactDirectorySummary> = {},
): ContactDirectorySummary => ({
  id: ids.avery,
  firstName: 'Avery',
  lastName: 'Harbor',
  displayName: 'Avery Harbor',
  email: 'avery.harbor@example.com',
  phone: null,
  birthDate: '1980-02-29',
  gender: 'prefer_not_to_say',
  tags: ['follow_up', 'client'],
  createdAt: '2026-09-08T12:00:00.000Z',
  ...overrides,
});
const list = () => ({
  schemaVersion: 'contact-directory.v1' as const,
  workspaceId: ids.workspace,
  correlationId: ids.correlation,
  items: [
    contact(),
    contact({
      id: ids.mara,
      firstName: 'Mara',
      lastName: 'Testwell',
      displayName: 'Mara Testwell',
      email: null,
      phone: '+12025550114',
      birthDate: null,
      gender: null,
      tags: ['new_lead'],
    }),
  ],
});
const detail = () => ({
  schemaVersion: 'contact-directory.v1' as const,
  workspaceId: ids.workspace,
  correlationId: ids.correlation,
  contact: { ...contact(), notes: 'Synthetic note.' },
});
const json = (value: unknown, status = 200) =>
  new Response(JSON.stringify(value), { status });
const signal = () => new AbortController().signal;
type MutableContact = Record<string, unknown> & {
  id: unknown;
  displayName: unknown;
  birthDate: unknown;
  createdAt: unknown;
  email: unknown;
  gender: unknown;
  tags: unknown;
};
type Mutable = Record<string, unknown> & { items: MutableContact[] };
type Operation = 'list' | 'find';

const request = (
  operation: Operation,
  client: ReturnType<typeof createHttpContactDirectoryClient>,
) =>
  operation === 'list'
    ? client.list(signal())
    : client.find(ids.avery, signal());
const errorBody = (code: string, message: string) => ({
  error: { code, message, correlationId: ids.correlation },
});

describe('contact directory client', () => {
  it('uses the injected transport for exact abortable list and detail requests', async () => {
    const abortSignal = signal();
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(json(list()))
      .mockResolvedValueOnce(json(detail()));
    const client = createHttpContactDirectoryClient(fetcher);

    await expect(client.list(abortSignal)).resolves.toEqual(list());
    await expect(client.find(ids.avery, abortSignal)).resolves.toEqual(
      detail(),
    );
    expect(fetcher).toHaveBeenNthCalledWith(1, CONTACT_DIRECTORY_URL, {
      signal: abortSignal,
    });
    expect(fetcher).toHaveBeenNthCalledWith(
      2,
      contactDirectoryDetailUrl(ids.avery),
      { signal: abortSignal },
    );
    expect(contactDirectoryDetailUrl('a/b')).toBe(
      `${CONTACT_DIRECTORY_URL}/a%2Fb`,
    );
  });

  it.each([
    ['extra envelope key', (body: Mutable) => (body.extra = true)],
    [
      'schema',
      (body: Mutable) => (body.schemaVersion = 'contact-directory.v2'),
    ],
    ['workspace', (body: Mutable) => (body.workspaceId = crypto.randomUUID())],
    ['correlation UUID', (body: Mutable) => (body.correlationId = 'bad')],
    ['item UUID', (body: Mutable) => (body.items[0].id = 'bad')],
    ['display name', (body: Mutable) => (body.items[0].displayName = 'Avery')],
    ['date', (body: Mutable) => (body.items[0].birthDate = '2026-02-30')],
    ['timestamp', (body: Mutable) => (body.items[0].createdAt = 'yesterday')],
    ['nullability', (body: Mutable) => (body.items[0].email = 42)],
    ['gender', (body: Mutable) => (body.items[0].gender = 'other')],
    [
      'tag order',
      (body: Mutable) => (body.items[0].tags = ['client', 'follow_up']),
    ],
    [
      'duplicate identity',
      (body: Mutable) => body.items.push(structuredClone(body.items[0])),
    ],
    ['list order', (body: Mutable) => body.items.reverse()],
  ])('rejects invalid list %s', async (_name, mutate) => {
    const value = structuredClone(list()) as Mutable;
    mutate(value);
    const client = createHttpContactDirectoryClient(
      vi.fn(async () => json(value)),
    );
    await expect(client.list(signal())).rejects.toMatchObject({
      code: 'invalid-response',
      retryable: true,
    });
  });

  it.each([
    [
      'summary notes',
      () => ({ ...list(), items: [{ ...contact(), notes: null }] }),
    ],
    ['detail missing notes', () => ({ ...detail(), contact: contact() })],
    [
      'detail extra key',
      () => ({ ...detail(), contact: { ...detail().contact, extra: true } }),
    ],
    [
      'detail wrong identity',
      () => ({ ...detail(), contact: { ...detail().contact, id: ids.mara } }),
    ],
  ])('rejects exact-shape or identity drift: %s', async (name, value) => {
    const client = createHttpContactDirectoryClient(
      vi.fn(async () => json(value())),
    );
    const operation = name.startsWith('summary')
      ? client.list(signal())
      : client.find(ids.avery, signal());
    await expect(operation).rejects.toMatchObject({
      code: 'invalid-response',
      retryable: true,
    });
  });

  it.each([
    [
      'list',
      400,
      'INVALID_WORKSPACE_ID',
      'Workspace ID must be a UUID.',
      'invalid-request',
      false,
    ],
    [
      'list',
      404,
      'CONTACT_DIRECTORY_NOT_FOUND',
      'Contact directory not found.',
      'not-found',
      false,
    ],
    [
      'list',
      503,
      'CONTACT_PERSISTENCE_UNAVAILABLE',
      'Contact persistence is unavailable.',
      'unavailable',
      true,
    ],
    [
      'find',
      400,
      'INVALID_WORKSPACE_ID',
      'Workspace ID must be a UUID.',
      'invalid-request',
      false,
    ],
    [
      'find',
      400,
      'INVALID_CONTACT_ID',
      'Contact ID must be a UUID.',
      'invalid-request',
      false,
    ],
    [
      'find',
      404,
      'CONTACT_NOT_FOUND',
      'Contact not found.',
      'not-found',
      false,
    ],
    [
      'find',
      503,
      'CONTACT_PERSISTENCE_UNAVAILABLE',
      'Contact persistence is unavailable.',
      'unavailable',
      true,
    ],
  ] as const)(
    'maps exact %s HTTP %i error',
    async (operation, status, apiCode, message, code, retryable) => {
      const client = createHttpContactDirectoryClient(
        vi.fn(async () => json(errorBody(apiCode, message), status)),
      );
      await expect(request(operation, client)).rejects.toMatchObject({
        code,
        retryable,
      });
    },
  );

  it.each([
    ['list', 400, 'INVALID_CONTACT_REQUEST', 'Contact request is invalid.'],
    ['list', 404, 'CONTACT_NOT_FOUND', 'Contact not found.'],
    [
      'list',
      409,
      'IDEMPOTENCY_KEY_CONFLICT',
      'Idempotency key conflicts with the original request.',
    ],
    [
      'find',
      404,
      'CONTACT_DIRECTORY_NOT_FOUND',
      'Contact directory not found.',
    ],
  ] as const)(
    'rejects %s response code %s from the wrong operation',
    async (operation, status, apiCode, message) => {
      const client = createHttpContactDirectoryClient(
        vi.fn(async () => json(errorBody(apiCode, message), status)),
      );
      await expect(request(operation, client)).rejects.toMatchObject({
        code: 'invalid-response',
        retryable: true,
      });
    },
  );

  it('makes malformed errors and network failures retryable but propagates aborts', async () => {
    const invalid = createHttpContactDirectoryClient(
      vi.fn(async () => json({ error: { code: 'OTHER' } }, 503)),
    );
    await expect(invalid.list(signal())).rejects.toMatchObject({
      code: 'invalid-response',
      retryable: true,
    });
    const network = createHttpContactDirectoryClient(
      vi.fn(async () => {
        throw new TypeError('offline');
      }),
    );
    await expect(network.list(signal())).rejects.toMatchObject({
      code: 'network',
      retryable: true,
    });
    const controller = new AbortController();
    controller.abort();
    const aborted = new DOMException('Aborted', 'AbortError');
    const aborting = createHttpContactDirectoryClient(
      vi.fn(async () => {
        throw aborted;
      }),
    );
    await expect(aborting.list(controller.signal)).rejects.toBe(aborted);
  });
});

describe('contact selectors and safe routes', () => {
  it('derives projections from validated API items without fallback', () => {
    const items = list().items;
    expect(selectContactById(items, ids.mara)).toBe(items[1]);
    expect(selectContactById(items, 'legacy-contact')).toBeUndefined();
    expect(searchContacts(items, 'avery.harbor')).toEqual([items[0]]);
    expect(searchContacts(items, 'no match')).toEqual([]);
    expect(selectContactCount(items)).toBe(2);
    expect(selectContactOptions(items)).toEqual([
      { id: ids.avery, label: 'Avery Harbor' },
      { id: ids.mara, label: 'Mara Testwell' },
    ]);
  });

  it('matches only the collection and safe UUID details', () => {
    expect(matchContactDirectoryRoute('/contacts')).toEqual({
      kind: 'collection',
    });
    expect(matchContactDirectoryRoute(`/contacts/${ids.avery}`)).toEqual({
      kind: 'detail',
      contactId: ids.avery,
    });
    for (const path of [
      '/contacts/stale',
      '/contacts/%E0%A4%A',
      '/contacts/a%2Fb',
      '/contacts/a%00b',
      '/contacts/20000000-0000-0000-8000-000000000001',
      '/contacts/archive/old',
    ])
      expect(matchContactDirectoryRoute(path)).toBeNull();
    expect(matchRenewalRoute('/tasks')).toEqual({ kind: 'tasks' });
  });
});
