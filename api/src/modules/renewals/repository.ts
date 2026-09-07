import type { RenewalGraph } from './domain.js';

export interface CompleteTaskCommand {
  workspaceId: string;
  taskId: string;
  expectedTaskVersion: number;
  actorId: string;
  correlationId: string;
  eventId: string;
  completedAt: Date;
}

export interface CompletedTaskState {
  task: {
    id: string;
    renewalId: string;
    status: 'completed';
    version: number;
    completedAt: Date;
  };
  renewal: { id: string; status: 'open' };
  completionAuditEvent: {
    id: string;
    type: 'task.completed';
    occurredAt: Date;
  };
}

export type CompleteTaskResult =
  | { kind: 'completed'; value: CompletedTaskState }
  | { kind: 'not-found' }
  | { kind: 'version-conflict' };

export interface RenewalRepository {
  workspaceExists(workspaceId: string): Promise<boolean>;
  findOpenByWorkspace(workspaceId: string): Promise<RenewalGraph[]>;
  completeTask(command: CompleteTaskCommand): Promise<CompleteTaskResult>;
}
