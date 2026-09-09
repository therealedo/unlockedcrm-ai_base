import type { ContactDirectorySummary } from './contact-directory-client';

export const selectContactById = (
  items: ContactDirectorySummary[],
  contactId: string,
) => items.find(({ id }) => id === contactId);

export const searchContacts = (
  items: ContactDirectorySummary[],
  query: string,
) => {
  const needle = query.trim().toLowerCase();
  if (!needle) return items;
  return items.filter((contact) =>
    [
      contact.firstName,
      contact.lastName,
      contact.displayName,
      contact.email,
      contact.phone,
    ].some((value) => value?.toLowerCase().includes(needle)),
  );
};

export const selectContactCount = (items: ContactDirectorySummary[]) =>
  items.length;

export const selectContactOptions = (items: ContactDirectorySummary[]) =>
  items.map(({ id, displayName }) => ({ id, label: displayName }));
