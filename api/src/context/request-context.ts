export interface RequestContext {
  workspaceId: string;
  actorId: string;
  correlationId: string;
  provenance: 'synthetic-local';
}
