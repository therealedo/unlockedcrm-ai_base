export type RenewalRoute =
  | { kind: 'policies' }
  | { kind: 'contact'; contactId: string | null };

export function matchRenewalRoute(path: string): RenewalRoute | null {
  if (path === '/policies') return { kind: 'policies' };
  const match = /^\/contacts\/([^/]+)$/.exec(path);
  if (!match) return null;
  try {
    return { kind: 'contact', contactId: decodeURIComponent(match[1]) };
  } catch {
    return { kind: 'contact', contactId: null };
  }
}
