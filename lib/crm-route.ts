export type RenewalRoute =
  | { kind: 'policies' }
  | { kind: 'renewals' }
  | { kind: 'contact'; contactId: string | null }
  | { kind: 'policy'; policyId: string | null };

function decodedSegment(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}

export function matchRenewalRoute(path: string): RenewalRoute | null {
  if (path === '/policies') return { kind: 'policies' };
  if (path === '/policies/renewals') return { kind: 'renewals' };
  const contact = /^\/contacts\/([^/]+)$/.exec(path);
  if (contact)
    return { kind: 'contact', contactId: decodedSegment(contact[1]) };
  const policy = /^\/policies\/([^/]+)$/.exec(path);
  if (policy) return { kind: 'policy', policyId: decodedSegment(policy[1]) };
  return null;
}
