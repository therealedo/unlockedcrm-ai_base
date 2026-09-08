import { CONTACT_SCHEMA_VERSION } from '../../contracts/contact-directory.js';
import type { RequestContext } from '../../context/request-context.js';
import type { ContactRepository } from './repository.js';

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
