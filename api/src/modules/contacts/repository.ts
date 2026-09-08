import type { ContactDetail } from '../../contracts/contact-directory.js';

export interface ContactRepository {
  workspaceExists(workspaceId: string): Promise<boolean>;
  list(workspaceId: string): Promise<ContactDetail[]>;
  find(workspaceId: string, contactId: string): Promise<ContactDetail | null>;
}
