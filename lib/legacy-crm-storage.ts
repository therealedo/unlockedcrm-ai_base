import type { CrmData } from './crm-data';

const collections = [
  'contacts',
  'opportunities',
  'tasks',
  'policies',
  'commissions',
  'appointments',
  'bookingLinks',
  'workflows',
] as const satisfies ReadonlyArray<keyof CrmData>;

const serverId = /^[1-9]0000000-0000-4000-8000-000000000001$/;
const record = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

export function fenceLegacyCrmData<T extends Record<string, unknown>>(
  data: T,
): T {
  return Object.fromEntries(
    collections.map((key) => [
      key,
      (Array.isArray(data[key]) ? data[key] : []).filter(
        (value) => !record(value) || !serverId.test(String(value.id)),
      ),
    ]),
  ) as T;
}

export function hydrateLegacyCrmData<T extends Record<string, unknown>>(
  stored: string | null,
  fallback: T,
): T {
  let parsed: unknown = fallback;
  try {
    if (stored) parsed = JSON.parse(stored);
  } catch {}
  return fenceLegacyCrmData(record(parsed) ? (parsed as T) : fallback);
}

export const serializeLegacyCrmData = <T extends Record<string, unknown>>(
  data: T,
) => JSON.stringify(fenceLegacyCrmData(data));

export type LegacyCrmArchive = {
  contacts: unknown[];
  passthrough: Record<string, unknown>;
};

export function captureLegacyCrmArchive<T extends Record<string, unknown>>(
  stored: string | null,
  fallback: T,
): LegacyCrmArchive {
  let parsed: unknown = fallback;
  try {
    if (stored) parsed = JSON.parse(stored);
  } catch {}
  const source = record(parsed) ? parsed : fallback;
  const contacts = Array.isArray(source.contacts)
    ? source.contacts
    : Array.isArray(fallback.contacts)
      ? fallback.contacts
      : [];
  const { contacts: _contacts, ...passthrough } = source;
  return { contacts, passthrough };
}

export function serializeCrmDataWithLegacyArchive<
  T extends Record<string, unknown>,
>(current: T, archive: LegacyCrmArchive) {
  return JSON.stringify({
    ...archive.passthrough,
    ...current,
    contacts: archive.contacts,
  });
}
