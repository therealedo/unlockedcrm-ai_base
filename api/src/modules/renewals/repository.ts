import type { RenewalGraph } from './domain.js';

export interface RenewalRepository {
  findOpenByWorkspace(workspaceId: string): Promise<RenewalGraph[]>;
}
