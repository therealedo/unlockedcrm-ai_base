export const CONTACT_SCHEMA_VERSION = 'contact-directory.v1' as const;
export const CONTACT_TAGS = ['new_lead', 'follow_up', 'client'] as const;
export const CONTACT_GENDERS = [
  'female',
  'male',
  'non_binary',
  'prefer_not_to_say',
] as const;

export type ContactTagCode = (typeof CONTACT_TAGS)[number];
export type ContactGender = (typeof CONTACT_GENDERS)[number];

export interface ContactSummary {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string | null;
  phone: string | null;
  birthDate: string | null;
  gender: ContactGender | null;
  tags: ContactTagCode[];
  createdAt: string;
}

export interface ContactDetail extends ContactSummary {
  notes: string | null;
}

export interface ContactCreateResponse {
  schemaVersion: typeof CONTACT_SCHEMA_VERSION;
  workspaceId: string;
  correlationId: string;
  contact: ContactDetail;
  contactCreatedEvent: {
    id: string;
    type: 'contact.created';
    occurredAt: string;
  };
}
