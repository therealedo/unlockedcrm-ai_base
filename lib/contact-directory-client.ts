export const CONTACT_DIRECTORY_WORKSPACE_ID =
  '10000000-0000-4000-8000-000000000001';
export const CONTACT_DIRECTORY_URL = `/api/v1/workspaces/${CONTACT_DIRECTORY_WORKSPACE_ID}/contacts`;
export const contactDirectoryDetailUrl = (contactId: string) =>
  `${CONTACT_DIRECTORY_URL}/${encodeURIComponent(contactId)}`;

export const CONTACT_DIRECTORY_TAGS = [
  'new_lead',
  'follow_up',
  'client',
] as const;
export const CONTACT_DIRECTORY_GENDERS = [
  'female',
  'male',
  'non_binary',
  'prefer_not_to_say',
] as const;

export type ContactDirectoryTag = (typeof CONTACT_DIRECTORY_TAGS)[number];
export type ContactDirectoryGender = (typeof CONTACT_DIRECTORY_GENDERS)[number];
export type ContactDirectorySummary = {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string | null;
  phone: string | null;
  birthDate: string | null;
  gender: ContactDirectoryGender | null;
  tags: ContactDirectoryTag[];
  createdAt: string;
};
export type ContactDirectoryContact = ContactDirectorySummary & {
  notes: string | null;
};
type Envelope<T> = {
  schemaVersion: 'contact-directory.v1';
  workspaceId: string;
  correlationId: string;
} & T;
export type ContactDirectoryListResponse = Envelope<{
  items: ContactDirectorySummary[];
}>;
export type ContactDirectoryDetailResponse = Envelope<{
  contact: ContactDirectoryContact;
}>;
export type ContactDirectoryClient = {
  list(signal: AbortSignal): Promise<ContactDirectoryListResponse>;
  find(
    contactId: string,
    signal: AbortSignal,
  ): Promise<ContactDirectoryDetailResponse>;
};

type ClientErrorCode =
  | 'invalid-request'
  | 'not-found'
  | 'unavailable'
  | 'invalid-response'
  | 'network';
export class ContactDirectoryClientError extends Error {
  constructor(
    public readonly code: ClientErrorCode,
    public readonly retryable: boolean,
  ) {
    super(code);
  }
}

const record = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);
const exact = (value: Record<string, unknown>, keys: readonly string[]) =>
  Object.keys(value).length === keys.length &&
  keys.every((key) => Object.hasOwn(value, key));
const uuid =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const isIso = (value: unknown): value is string =>
  typeof value === 'string' &&
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value) &&
  new Date(value).toISOString() === value;
const isDate = (value: unknown): value is string => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return (
    Number.isFinite(parsed.valueOf()) &&
    parsed.toISOString().slice(0, 10) === value
  );
};
const nullableText = (value: unknown) =>
  value === null || typeof value === 'string';
const summaryKeys = [
  'id',
  'firstName',
  'lastName',
  'displayName',
  'email',
  'phone',
  'birthDate',
  'gender',
  'tags',
  'createdAt',
] as const;
const envelopeKeys = ['schemaVersion', 'workspaceId', 'correlationId'] as const;

function validSummary(value: unknown): value is ContactDirectorySummary {
  if (!record(value) || !exact(value, summaryKeys)) return false;
  const tags = value.tags;
  return (
    typeof value.id === 'string' &&
    uuid.test(value.id) &&
    typeof value.firstName === 'string' &&
    typeof value.lastName === 'string' &&
    value.displayName === `${value.firstName} ${value.lastName}` &&
    nullableText(value.email) &&
    nullableText(value.phone) &&
    (value.birthDate === null || isDate(value.birthDate)) &&
    (value.gender === null ||
      CONTACT_DIRECTORY_GENDERS.includes(
        value.gender as ContactDirectoryGender,
      )) &&
    Array.isArray(tags) &&
    tags.every((tag) =>
      CONTACT_DIRECTORY_TAGS.includes(tag as ContactDirectoryTag),
    ) &&
    tags.every(
      (tag, index) =>
        index === 0 ||
        CONTACT_DIRECTORY_TAGS.indexOf(tag as ContactDirectoryTag) >
          CONTACT_DIRECTORY_TAGS.indexOf(
            tags[index - 1] as ContactDirectoryTag,
          ),
    ) &&
    isIso(value.createdAt)
  );
}

function validContact(value: unknown): value is ContactDirectoryContact {
  if (!record(value) || !exact(value, [...summaryKeys, 'notes'])) return false;
  const { notes, ...summary } = value;
  return nullableText(notes) && validSummary(summary);
}

const tuple = (item: ContactDirectorySummary) => [
  item.lastName.toLowerCase(),
  item.firstName.toLowerCase(),
  item.id,
];
const ordered = (
  left: ContactDirectorySummary,
  right: ContactDirectorySummary,
) => {
  const a = tuple(left);
  const b = tuple(right);
  for (let index = 0; index < a.length; index += 1) {
    if (a[index] < b[index]) return -1;
    if (a[index] > b[index]) return 1;
  }
  return 0;
};
const validEnvelope = (value: Record<string, unknown>) =>
  value.schemaVersion === 'contact-directory.v1' &&
  value.workspaceId === CONTACT_DIRECTORY_WORKSPACE_ID &&
  typeof value.correlationId === 'string' &&
  uuid.test(value.correlationId);

function validList(value: unknown): value is ContactDirectoryListResponse {
  if (
    !record(value) ||
    !exact(value, [...envelopeKeys, 'items']) ||
    !validEnvelope(value)
  )
    return false;
  const items = value.items;
  if (!Array.isArray(items) || !items.every(validSummary)) return false;
  return (
    new Set(items.map(({ id }) => id)).size === items.length &&
    items.every(
      (item, index) => index === 0 || ordered(items[index - 1], item) <= 0,
    )
  );
}
function validDetail(value: unknown): value is ContactDirectoryDetailResponse {
  return (
    record(value) &&
    exact(value, [...envelopeKeys, 'contact']) &&
    validEnvelope(value) &&
    validContact(value.contact)
  );
}
const errorMessages: Record<string, string> = {
  INVALID_WORKSPACE_ID: 'Workspace ID must be a UUID.',
  INVALID_CONTACT_ID: 'Contact ID must be a UUID.',
  CONTACT_DIRECTORY_NOT_FOUND: 'Contact directory not found.',
  CONTACT_NOT_FOUND: 'Contact not found.',
  CONTACT_PERSISTENCE_UNAVAILABLE: 'Contact persistence is unavailable.',
};
type ReadOperation = 'list' | 'find';
const operationCodes: Record<
  ReadOperation,
  Partial<Record<number, readonly string[]>>
> = {
  list: {
    400: ['INVALID_WORKSPACE_ID'],
    404: ['CONTACT_DIRECTORY_NOT_FOUND'],
    503: ['CONTACT_PERSISTENCE_UNAVAILABLE'],
  },
  find: {
    400: ['INVALID_WORKSPACE_ID', 'INVALID_CONTACT_ID'],
    404: ['CONTACT_NOT_FOUND'],
    503: ['CONTACT_PERSISTENCE_UNAVAILABLE'],
  },
};
const statusErrors: Record<number, readonly [ClientErrorCode, boolean]> = {
  400: ['invalid-request', false],
  404: ['not-found', false],
  503: ['unavailable', true],
};
const invalidResponse = (): never => {
  throw new ContactDirectoryClientError('invalid-response', true);
};
async function body(
  response: Response,
  operation: ReadOperation,
  signal: AbortSignal,
) {
  let value: unknown;
  try {
    value = await response.json();
  } catch (error) {
    if (
      signal.aborted ||
      (error instanceof DOMException && error.name === 'AbortError')
    )
      throw error;
    return invalidResponse();
  }
  if (response.ok) return value;
  if (
    !record(value) ||
    !exact(value, ['error']) ||
    !record(value.error) ||
    !exact(value.error, ['code', 'message', 'correlationId'])
  )
    return invalidResponse();
  const contract = statusErrors[response.status];
  const allowedCodes = operationCodes[operation][response.status];
  const code = value.error.code;
  if (
    !contract ||
    !allowedCodes ||
    typeof code !== 'string' ||
    !allowedCodes.includes(code) ||
    value.error.message !== errorMessages[code] ||
    typeof value.error.correlationId !== 'string' ||
    !uuid.test(value.error.correlationId)
  )
    return invalidResponse();
  throw new ContactDirectoryClientError(contract[0], contract[1]);
}
async function send(fetcher: typeof fetch, url: string, init: RequestInit) {
  try {
    return await fetcher(url, init);
  } catch (error) {
    if (
      init.signal?.aborted ||
      (error instanceof DOMException && error.name === 'AbortError')
    )
      throw error;
    throw new ContactDirectoryClientError('network', true);
  }
}
export function createHttpContactDirectoryClient(
  fetcher: typeof fetch = fetch,
): ContactDirectoryClient {
  return {
    async list(signal) {
      const response = await send(fetcher, CONTACT_DIRECTORY_URL, { signal });
      const value = await body(response, 'list', signal);
      if (response.status !== 200 || !validList(value))
        return invalidResponse();
      return value;
    },
    async find(contactId, signal) {
      const response = await send(
        fetcher,
        contactDirectoryDetailUrl(contactId),
        { signal },
      );
      const value = await body(response, 'find', signal);
      if (
        response.status !== 200 ||
        !validDetail(value) ||
        value.contact.id !== contactId
      )
        return invalidResponse();
      return value;
    },
  };
}
