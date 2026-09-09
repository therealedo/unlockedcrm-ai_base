import { randomUUID } from 'node:crypto';
import {
  CONTACT_SCHEMA_VERSION,
  type ContactCreateResponse,
} from '../../contracts/contact-directory.js';
import type { RequestContext } from '../../context/request-context.js';
import {
  contactPayloadHash,
  normalizeContactRequest,
  type NormalizedContactRequest,
} from './domain.js';
import type {
  ContactCreateRepository,
  ContactRepository,
  StoredReceipt,
} from './repository.js';

export async function listContacts(
  repository: ContactRepository,
  context: RequestContext,
  workspaceId: string,
) {
  if (context.workspaceId !== workspaceId) return null;
  if (!(await repository.workspaceExists(workspaceId))) return null;
  const items = (await repository.list(workspaceId)).map(
    ({ notes: _notes, ...summary }) => summary,
  );
  return {
    schemaVersion: CONTACT_SCHEMA_VERSION,
    workspaceId,
    correlationId: context.correlationId,
    items,
  };
}

export async function findContact(
  repository: ContactRepository,
  context: RequestContext,
  workspaceId: string,
  contactId: string,
) {
  if (context.workspaceId !== workspaceId) return null;
  const contact = await repository.find(workspaceId, contactId);
  return contact
    ? {
        schemaVersion: CONTACT_SCHEMA_VERSION,
        workspaceId,
        correlationId: context.correlationId,
        contact,
      }
    : null;
}

type ContactServiceResult =
  | { kind: 'ok'; value: ContactCreateResponse }
  | { kind: 'not-found' }
  | { kind: 'conflict' }
  | { kind: 'unavailable' };

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
const object = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);
const keys = (value: Record<string, unknown>) =>
  Object.keys(value).sort().join('|');
const ENVELOPE_KEYS =
  'contact|contactCreatedEvent|correlationId|schemaVersion|workspaceId';
const CONTACT_KEYS =
  'birthDate|createdAt|displayName|email|firstName|gender|id|lastName|notes|phone|tags';
const EVENT_KEYS = 'id|occurredAt|type';
const instant = (value: unknown): value is string => {
  if (typeof value !== 'string' || !ISO.test(value)) return false;
  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString() === value;
};
const validReceiptBody = (
  value: unknown,
  workspaceId: string,
): value is ContactCreateResponse => {
  if (
    !object(value) ||
    keys(value) !== ENVELOPE_KEYS ||
    !object(value.contact) ||
    keys(value.contact) !== CONTACT_KEYS ||
    !object(value.contactCreatedEvent) ||
    keys(value.contactCreatedEvent) !== EVENT_KEYS
  )
    return false;
  const contact = value.contact;
  const event = value.contactCreatedEvent;
  if (
    value.schemaVersion !== CONTACT_SCHEMA_VERSION ||
    value.workspaceId !== workspaceId ||
    !UUID.test(String(value.correlationId)) ||
    !UUID.test(String(contact.id)) ||
    !UUID.test(String(event.id)) ||
    event.type !== 'contact.created' ||
    !instant(contact.createdAt) ||
    event.occurredAt !== contact.createdAt ||
    typeof contact.firstName !== 'string' ||
    typeof contact.lastName !== 'string' ||
    contact.displayName !== `${contact.firstName} ${contact.lastName}`
  )
    return false;
  const {
    id: _id,
    displayName: _displayName,
    createdAt: _createdAt,
    ...request
  } = contact;
  const normalized = normalizeContactRequest(
    request,
    new Date(contact.createdAt),
  );
  return (
    !!normalized &&
    Object.entries(normalized).every(
      ([key, expected]) =>
        JSON.stringify(contact[key]) === JSON.stringify(expected),
    )
  );
};

const replay = (
  receipt: StoredReceipt | null,
  hash: string,
  workspaceId: string,
): ContactServiceResult => {
  if (!receipt) return { kind: 'unavailable' };
  if (receipt.payloadHash !== hash) return { kind: 'conflict' };
  return validReceiptBody(receipt.responseBody, workspaceId)
    ? { kind: 'ok', value: receipt.responseBody }
    : { kind: 'unavailable' };
};

export async function createContact(
  repository: ContactCreateRepository,
  context: RequestContext,
  workspaceId: string,
  idempotencyKey: string,
  input: NormalizedContactRequest,
  now: Date,
): Promise<ContactServiceResult & { replayed?: boolean }> {
  if (context.workspaceId !== workspaceId) return { kind: 'not-found' };
  if (!(await repository.workspaceExists(workspaceId)))
    return { kind: 'not-found' };
  const payloadHash = contactPayloadHash(input);
  const existing = await repository.findReceipt(workspaceId, idempotencyKey);
  if (existing)
    return { ...replay(existing, payloadHash, workspaceId), replayed: true };
  const contactId = randomUUID();
  const eventId = randomUUID();
  const occurredAt = now.toISOString();
  const responseBody: ContactCreateResponse = {
    schemaVersion: CONTACT_SCHEMA_VERSION,
    workspaceId,
    correlationId: context.correlationId,
    contact: {
      id: contactId,
      ...input,
      displayName: `${input.firstName} ${input.lastName}`,
      createdAt: occurredAt,
    },
    contactCreatedEvent: { id: eventId, type: 'contact.created', occurredAt },
  };
  const result = await repository.create({
    workspaceId,
    actorId: context.actorId,
    idempotencyKey,
    payloadHash,
    contactId,
    eventId,
    occurredAt: now,
    input,
    responseBody,
  });
  if (result.kind === 'collision')
    return {
      ...replay(result.receipt, payloadHash, workspaceId),
      replayed: true,
    };
  return { kind: 'ok', value: responseBody, replayed: false };
}
