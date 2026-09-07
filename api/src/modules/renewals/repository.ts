import type { RenewalGraph } from './domain.js';

export interface RenewalRepository {
  workspaceExists(workspaceId: string): Promise<boolean>;
  findOpenByWorkspace(workspaceId: string): Promise<RenewalGraph[]>;
}
