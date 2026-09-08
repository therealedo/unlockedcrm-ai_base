import type { PrismaClient } from '../../generated/prisma/client.js';
import {
  CONTACT_GENDERS,
  CONTACT_TAGS,
  type ContactDetail,
  type ContactGender,
  type ContactTagCode,
} from '../../contracts/contact-directory.js';
import type { ContactRepository } from './repository.js';

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

export class PrismaContactRepository implements ContactRepository {
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
      const a = [
        left.lastName.toLowerCase(),
        left.firstName.toLowerCase(),
        left.id,
      ];
      const b = [
        right.lastName.toLowerCase(),
        right.firstName.toLowerCase(),
        right.id,
      ];
      return a < b ? -1 : a > b ? 1 : 0;
    });
  }
  async find(workspaceId: string, contactId: string) {
    const contact = await this.client.contact.findFirst({
      where: { workspaceId, id: contactId },
      include: { tags: true },
    });
    return contact ? detail(contact) : null;
  }
}
