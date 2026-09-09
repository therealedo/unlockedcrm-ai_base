import type { PrismaClient } from '../../generated/prisma/client.js';
import {
  CONTACT_GENDERS,
  CONTACT_TAGS,
  type ContactDetail,
  type ContactGender,
  type ContactTagCode,
} from '../../contracts/contact-directory.js';
import type {
  ContactCreateRepository,
  ContactRepository,
  CreateContactCommand,
} from './repository.js';

const PROVENANCE_ID = '91000000-0000-4000-8000-000000000001';
const SOURCE_VERSION = 'contact-intake.v1';
const SOURCE_HASH =
  'sha256:127f6e0f17ecb9bb46e0dc927b9f984985d8547461610d0670ef654653bca103';
const isReceiptCollision = (error: unknown) => {
  if (!error || typeof error !== 'object' || !('code' in error)) return false;
  const meta = 'meta' in error ? error.meta : null;
  return (
    error.code === 'P2002' &&
    !!meta &&
    typeof meta === 'object' &&
    'modelName' in meta &&
    meta.modelName === 'ContactCreateReceipt'
  );
};

const detail = (contact: {
  id: string;
  firstName: string | null;
  lastName: string | null;
  displayName: string;
  email: string | null;
  phone: string | null;
  birthDate: Date | null;
  gender: string | null;
  notes: string | null;
  createdAt: Date;
  tags: Array<{ tagCode: string }>;
}): ContactDetail => {
  if (
    !contact.firstName ||
    !contact.lastName ||
    (contact.gender &&
      !CONTACT_GENDERS.includes(contact.gender as ContactGender))
  )
    throw new Error('Stored contact is invalid');
  const tags = CONTACT_TAGS.filter((tag) =>
    contact.tags.some(({ tagCode }) => tagCode === tag),
  );
  if (tags.length !== contact.tags.length)
    throw new Error('Stored contact is invalid');
  return {
    id: contact.id,
    firstName: contact.firstName,
    lastName: contact.lastName,
    displayName: contact.displayName,
    email: contact.email,
    phone: contact.phone,
    birthDate: contact.birthDate?.toISOString().slice(0, 10) ?? null,
    gender: contact.gender as ContactGender | null,
    notes: contact.notes,
    tags: tags as ContactTagCode[],
    createdAt: contact.createdAt.toISOString(),
  };
};

export class PrismaContactRepository
  implements ContactRepository, ContactCreateRepository
{
  constructor(private readonly client: PrismaClient) {}
  async workspaceExists(workspaceId: string) {
    return Boolean(
      await this.client.workspace.findUnique({
        where: { id: workspaceId },
        select: { id: true },
      }),
    );
  }
  async list(workspaceId: string) {
    const contacts = await this.client.contact.findMany({
      where: { workspaceId },
      include: { tags: true },
    });
    return contacts.map(detail).sort((left, right) => {
      const leftKeys = [
        left.lastName.toLowerCase(),
        left.firstName.toLowerCase(),
        left.id,
      ];
      const rightKeys = [
        right.lastName.toLowerCase(),
        right.firstName.toLowerCase(),
        right.id,
      ];
      for (let index = 0; index < leftKeys.length; index += 1) {
        if (leftKeys[index]! < rightKeys[index]!) return -1;
        if (leftKeys[index]! > rightKeys[index]!) return 1;
      }
      return 0;
    });
  }
  async find(workspaceId: string, contactId: string) {
    const contact = await this.client.contact.findFirst({
      where: { workspaceId, id: contactId },
      include: { tags: true },
    });
    return contact ? detail(contact) : null;
  }
  async findReceipt(workspaceId: string, idempotencyKey: string) {
    return this.client.contactCreateReceipt.findUnique({
      where: { workspaceId_idempotencyKey: { workspaceId, idempotencyKey } },
      select: { payloadHash: true, responseBody: true },
    });
  }
  async create(command: CreateContactCommand) {
    try {
      await this.client.$transaction(async (tx) => {
        const { input } = command;
        await tx.contact.create({
          data: {
            id: command.contactId,
            workspaceId: command.workspaceId,
            firstName: input.firstName,
            lastName: input.lastName,
            displayName: `${input.firstName} ${input.lastName}`,
            email: input.email,
            phone: input.phone,
            birthDate: input.birthDate
              ? new Date(`${input.birthDate}T00:00:00.000Z`)
              : null,
            gender: input.gender,
            notes: input.notes,
            createdAt: command.occurredAt,
            tags: {
              create: input.tags.map((tagCode) => ({
                tagCode,
                createdAt: command.occurredAt,
              })),
            },
          },
        });
        await tx.auditEvent.create({
          data: {
            id: command.eventId,
            workspaceId: command.workspaceId,
            actorId: command.actorId,
            eventType: 'contact.created',
            recordId: command.contactId,
            correlationId: command.responseBody.correlationId,
            provenanceId: PROVENANCE_ID,
            sourceVersion: SOURCE_VERSION,
            sourceHash: SOURCE_HASH,
            occurredAt: command.occurredAt,
            createdAt: command.occurredAt,
          },
        });
        await tx.contactCreateReceipt.create({
          data: {
            workspaceId: command.workspaceId,
            idempotencyKey: command.idempotencyKey,
            payloadHash: command.payloadHash,
            responseBody: JSON.parse(JSON.stringify(command.responseBody)),
            createdAt: command.occurredAt,
          },
        });
      });
      return { kind: 'created' as const };
    } catch (error) {
      if (!isReceiptCollision(error)) throw error;
      return {
        kind: 'collision' as const,
        receipt: await this.findReceipt(
          command.workspaceId,
          command.idempotencyKey,
        ),
      };
    }
  }
}
