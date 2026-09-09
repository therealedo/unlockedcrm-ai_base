export type RenewalRoute =
  | { kind: 'home' }
  | { kind: 'tasks' }
  | { kind: 'audit' }
  | { kind: 'policies' }
  | { kind: 'renewals' }
  | { kind: 'contact'; contactId: string | null }
  | { kind: 'policy'; policyId: string | null };

export type ContactDirectoryRoute =
  | { kind: 'collection' }
  | { kind: 'detail'; contactId: string };

const uuid =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function decodedSegment(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}

export function matchRenewalRoute(path: string): RenewalRoute | null {
  if (path === '/') return { kind: 'home' };
  if (path === '/tasks') return { kind: 'tasks' };
  if (path === '/analytics/audit') return { kind: 'audit' };
  if (path === '/policies') return { kind: 'policies' };
  if (path === '/policies/renewals') return { kind: 'renewals' };
  const contact = /^\/contacts\/([^/]+)$/.exec(path);
  if (contact)
    return { kind: 'contact', contactId: decodedSegment(contact[1]) };
  const policy = /^\/policies\/([^/]+)$/.exec(path);
  if (policy) return { kind: 'policy', policyId: decodedSegment(policy[1]) };
  return null;
}

export function matchContactDirectoryRoute(
  path: string,
): ContactDirectoryRoute | null {
  if (path === '/contacts') return { kind: 'collection' };
  const match = /^\/contacts\/([^/]+)$/.exec(path);
  if (!match) return null;
  const contactId = decodedSegment(match[1]);
  return contactId && uuid.test(contactId)
    ? { kind: 'detail', contactId }
    : null;
}
