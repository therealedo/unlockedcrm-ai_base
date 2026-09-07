import { randomUUID } from 'node:crypto';
import { SYNTHETIC_RENEWAL } from '../modules/renewals/domain.js';

export interface RequestContext {
  workspaceId: string;
  actorId: string;
  correlationId: string;
  provenance: 'synthetic-local';
}

export function createSyntheticRequestContext(
  identity: Partial<Pick<RequestContext, 'workspaceId' | 'actorId'>> = {},
): RequestContext {
  return {
    workspaceId: identity.workspaceId ?? SYNTHETIC_RENEWAL.workspaceId,
    actorId: identity.actorId ?? SYNTHETIC_RENEWAL.actorId,
    correlationId: randomUUID(),
    provenance: 'synthetic-local',
  };
}
