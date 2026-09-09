import type {
  ContactCreateResponse,
  ContactDetail,
} from '../../contracts/contact-directory.js';
import type { NormalizedContactRequest } from './domain.js';

export interface ContactRepository {
  workspaceExists(workspaceId: string): Promise<boolean>;
  list(workspaceId: string): Promise<ContactDetail[]>;
  find(workspaceId: string, contactId: string): Promise<ContactDetail | null>;
}

export interface StoredReceipt {
  payloadHash: string;
  responseBody: unknown;
}

export interface CreateContactCommand {
  workspaceId: string;
  actorId: string;
  idempotencyKey: string;
  payloadHash: string;
  contactId: string;
  eventId: string;
  occurredAt: Date;
  input: NormalizedContactRequest;
  responseBody: ContactCreateResponse;
}

export type CreateContactResult =
  | { kind: 'created' }
  | { kind: 'collision'; receipt: StoredReceipt | null };

export interface ContactCreateRepository {
  workspaceExists(workspaceId: string): Promise<boolean>;
  findReceipt(workspaceId: string, key: string): Promise<StoredReceipt | null>;
  create(command: CreateContactCommand): Promise<CreateContactResult>;
}
