import { describe, expect, it, vi } from 'vitest';

import {
  CONTACT_DIRECTORY_URL,
  contactDirectoryDetailUrl,
  createHttpContactDirectoryClient,
  type ContactDirectoryCreateInput,
  type ContactDirectorySummary,
} from './contact-directory-client';
import {
  searchContacts,
  selectContactById,
  selectContactCount,
  selectContactOptions,
} from './contact-directory-selectors';
import { matchContactDirectoryRoute, matchRenewalRoute } from './crm-route';
import {
  captureLegacyCrmArchive,
  serializeCrmDataWithLegacyArchive,
} from './legacy-crm-storage';

const ids = {
  workspace: '10000000-0000-4000-8000-000000000001',
  avery: '20000000-0000-4000-8000-000000000001',
  mara: '20000000-0000-4000-8000-000000000002',
  event: '60000000-0000-4000-8000-000000000002',
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
const created = () => ({
  ...detail(),
  contactCreatedEvent: {
    id: ids.event,
    type: 'contact.created' as const,
    occurredAt: '2026-09-08T12:00:00.000Z',
  },
});
const json = (value: unknown, status = 200, replayed?: string) =>
  new Response(JSON.stringify(value), {
    status,
    headers: replayed ? { 'Idempotency-Replayed': replayed } : undefined,
  });
const jsonFailure = (error: unknown) => {
  const response = new Response(null, { status: 200 });
  response.json = vi.fn(async () => {
    throw error;
  });
  return response;
};
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
type MutableCreate = Record<string, unknown> & {
  contactCreatedEvent: Record<string, unknown> & {
    id: unknown;
    type: unknown;
    occurredAt: unknown;
  };
};
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
const createInput = (): ContactDirectoryCreateInput => ({
  firstName: 'Avery',
  lastName: 'Harbor',
  email: 'avery.harbor@example.com',
  phone: null,
  birthDate: '1980-02-29',
  gender: 'prefer_not_to_say',
  notes: 'Synthetic note.',
  tags: ['follow_up', 'client'],
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

  it('sends only the contact create contract and accepts original and replay responses', async () => {
    const abortSignal = signal();
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(json(created(), 201, 'false'))
      .mockResolvedValueOnce(json(created(), 200, 'true'))
      .mockResolvedValueOnce(json(created(), 201, 'false'));
    const client = createHttpContactDirectoryClient(fetcher);
    const input = createInput();

    await expect(
      client.create(
        { ...input, ignored: true } as ContactDirectoryCreateInput,
        'key-1234',
        abortSignal,
      ),
    ).resolves.toEqual(created());
    await expect(
      client.create(input, 'key-1234', abortSignal),
    ).resolves.toEqual(created());
    const minimal = {
      firstName: 'Eli',
      lastName: 'Stone',
      phone: '2025550115',
    };
    await expect(
      client.create(minimal, 'key-5678', abortSignal),
    ).resolves.toEqual(created());
    expect(fetcher).toHaveBeenNthCalledWith(1, CONTACT_DIRECTORY_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Idempotency-Key': 'key-1234',
      },
      body: JSON.stringify(input),
      signal: abortSignal,
    });
    expect(fetcher).toHaveBeenNthCalledWith(3, CONTACT_DIRECTORY_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Idempotency-Key': 'key-5678',
      },
      body: JSON.stringify(minimal),
      signal: abortSignal,
    });
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
      'event ID',
      (value: MutableCreate): void => {
        value.contactCreatedEvent.id = 'event';
      },
      201,
      'false',
    ],
    [
      'event type',
      (value: MutableCreate): void => {
        value.contactCreatedEvent.type = 'other';
      },
      201,
      'false',
    ],
    [
      'event timestamp',
      (value: MutableCreate): void => {
        value.contactCreatedEvent.occurredAt = 'now';
      },
      201,
      'false',
    ],
    [
      'event/contact time',
      (value: MutableCreate): void => {
        value.contactCreatedEvent.occurredAt = '2026-09-08T12:00:01.000Z';
      },
      201,
      'false',
    ],
    [
      'extra envelope key',
      (value: MutableCreate): void => {
        value.extra = true;
      },
      201,
      'false',
    ],
    ['initial replay header', () => undefined, 201, 'true'],
    ['replay initial header', () => undefined, 200, 'false'],
    ['missing replay header', () => undefined, 201, undefined],
  ] as const)(
    'rejects invalid create response: %s',
    async (_name, mutate, status, replayed) => {
      const value = structuredClone(created()) as MutableCreate;
      mutate(value);
      const client = createHttpContactDirectoryClient(
        vi.fn(async () => json(value, status, replayed)),
      );

      await expect(
        client.create(createInput(), 'key-1234', signal()),
      ).rejects.toMatchObject({ code: 'invalid-response', retryable: true });
    },
  );

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

  it.each([
    [
      400,
      'INVALID_WORKSPACE_ID',
      'Workspace ID must be a UUID.',
      'invalid-request',
      false,
    ],
    [
      400,
      'INVALID_IDEMPOTENCY_KEY',
      'Idempotency key is invalid.',
      'invalid-request',
      false,
    ],
    [
      400,
      'INVALID_CONTACT_REQUEST',
      'Contact request is invalid.',
      'invalid-request',
      false,
    ],
    [404, 'CONTACT_NOT_FOUND', 'Contact not found.', 'not-found', false],
    [
      409,
      'IDEMPOTENCY_KEY_CONFLICT',
      'Idempotency key conflicts with the original request.',
      'conflict',
      false,
    ],
    [
      503,
      'CONTACT_PERSISTENCE_UNAVAILABLE',
      'Contact persistence is unavailable.',
      'unavailable',
      true,
    ],
  ] as const)(
    'maps exact create HTTP %i error',
    async (status, apiCode, message, code, retryable) => {
      const client = createHttpContactDirectoryClient(
        vi.fn(async () => json(errorBody(apiCode, message), status)),
      );

      await expect(
        client.create(createInput(), 'key-1234', signal()),
      ).rejects.toMatchObject({ code, retryable });
    },
  );

  it('rejects a list-only error code from create', async () => {
    const client = createHttpContactDirectoryClient(
      vi.fn(async () =>
        json(
          errorBody(
            'CONTACT_DIRECTORY_NOT_FOUND',
            'Contact directory not found.',
          ),
          404,
        ),
      ),
    );

    await expect(
      client.create(createInput(), 'key-1234', signal()),
    ).rejects.toMatchObject({ code: 'invalid-response', retryable: true });
  });

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

  it('propagates an AbortError raised while parsing a list response', async () => {
    const aborted = new DOMException('Aborted', 'AbortError');
    const client = createHttpContactDirectoryClient(
      vi.fn(async () => jsonFailure(aborted)),
    );

    await expect(client.list(signal())).rejects.toBe(aborted);
  });

  it('propagates an aborted signal reason while parsing a detail response', async () => {
    const controller = new AbortController();
    const reason = new Error('Cancelled after headers');
    controller.abort(reason);
    const client = createHttpContactDirectoryClient(
      vi.fn(async () => jsonFailure(reason)),
    );

    await expect(client.find(ids.avery, controller.signal)).rejects.toBe(
      reason,
    );
  });

  it('propagates an AbortError raised while parsing a create response', async () => {
    const aborted = new DOMException('Aborted', 'AbortError');
    const client = createHttpContactDirectoryClient(
      vi.fn(async () => jsonFailure(aborted)),
    );

    await expect(
      client.create(createInput(), 'key-1234', signal()),
    ).rejects.toBe(aborted);
  });

  it('maps non-abort JSON parsing failures to an invalid response', async () => {
    const client = createHttpContactDirectoryClient(
      vi.fn(async () => jsonFailure(new SyntaxError('Malformed JSON'))),
    );

    await expect(client.list(signal())).rejects.toMatchObject({
      code: 'invalid-response',
      retryable: true,
    });
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

describe('legacy contact archive', () => {
  const fallback = {
    contacts: [{ id: 'fallback' }],
    tasks: [{ id: 'task-fallback' }],
  };

  it('retains arbitrary contacts and unknown fields while applying current noncontact edits', () => {
    const rawContacts = [
      { id: 7, nested: { values: [null, true, { untouched: 'yes' }] } },
      'opaque',
      null,
    ];
    const stored = {
      contacts: rawContacts,
      tasks: [{ id: 'task-old', contact: 'Kept Contact' }],
      opportunities: [{ id: 'opp-old', contact: 'Kept Contact' }],
      policies: [{ id: 'policy-old', client: 'Kept Contact' }],
      appointments: [{ id: 'appointment-old', contact: 'Kept Contact' }],
      commissions: [{ id: 'commission-old', client: 'Kept Contact' }],
      bookingLinks: [{ id: 'booking-old' }],
      workflows: [{ id: 'workflow-old' }],
      unknownTopLevel: { preserved: ['exactly'] },
    };
    const archive = captureLegacyCrmArchive(JSON.stringify(stored), fallback);
    const current = {
      ...stored,
      contacts: [{ replacement: true }],
      tasks: [{ id: 'task-new', contact: 'Edited Contact' }],
    };

    expect(archive.contacts).toEqual(rawContacts);
    expect(
      JSON.parse(serializeCrmDataWithLegacyArchive(current, archive)),
    ).toEqual({ ...stored, ...current, contacts: rawContacts });
    expect(stored.contacts).toEqual(rawContacts);
  });

  it.each([null, '{', '[]'])(
    'uses fallback for invalid storage %s',
    (stored) => {
      expect(captureLegacyCrmArchive(stored, fallback)).toEqual({
        contacts: fallback.contacts,
        passthrough: { tasks: fallback.tasks },
      });
    },
  );
});
