import type { PrismaClient } from '../../generated/prisma/client.js';
import { assembleRenewalGraph, type RenewalGraph } from './domain.js';
import { SYNTHETIC_RENEWAL } from './domain.js';
import type {
  CompleteTaskCommand,
  CompleteTaskResult,
  CompletedTaskState,
  RenewalRepository,
} from './repository.js';

const sameInstant = (left: Date, right: Date) =>
  left.getTime() === right.getTime();

function completedState(
  command: CompleteTaskCommand,
  task: {
    id: string;
    renewalId: string;
    status: string;
    version: number;
    completedAt: Date | null;
    renewal: { id: string; status: string };
  },
  workspace: { sourceVersion: string; sourceHash: string },
  events: Array<{
    id: string;
    actorId: string;
    correlationId: string;
    provenanceId: string;
    sourceVersion: string;
    sourceHash: string;
    occurredAt: Date;
    createdAt: Date;
  }>,
): CompletedTaskState {
  const [event] = events;
  if (
    task.status !== 'completed' ||
    task.version !== command.expectedTaskVersion + 1 ||
    !task.completedAt ||
    task.renewal.status !== 'open' ||
    events.length !== 1 ||
    event.actorId !== command.actorId ||
    event.provenanceId !== SYNTHETIC_RENEWAL.provenanceId ||
    event.sourceVersion !== workspace.sourceVersion ||
    event.sourceHash !== workspace.sourceHash ||
    !sameInstant(event.occurredAt, task.completedAt) ||
    !sameInstant(event.createdAt, task.completedAt)
  )
    throw new Error('Stored task completion is invalid');
  return {
    task: {
      id: task.id,
      renewalId: task.renewalId,
      status: 'completed',
      version: task.version,
      completedAt: task.completedAt,
    },
    renewal: { id: task.renewal.id, status: 'open' },
    completionAuditEvent: {
      id: event.id,
      type: 'task.completed',
      occurredAt: event.occurredAt,
    },
  };
}

export class PrismaRenewalRepository implements RenewalRepository {
  constructor(private readonly client: PrismaClient) {}

  async workspaceExists(workspaceId: string): Promise<boolean> {
    if (!workspaceId) throw new Error('workspaceId is required');
    return Boolean(
      await this.client.workspace.findUnique({
        where: { id: workspaceId },
        select: { id: true },
      }),
    );
  }

  async findOpenByWorkspace(workspaceId: string): Promise<RenewalGraph[]> {
    if (!workspaceId) throw new Error('workspaceId is required');
    const renewals = await this.client.renewal.findMany({
      where: { workspaceId, status: 'open' },
      include: {
        workspace: true,
        policy: { include: { contact: true } },
        tasks: { orderBy: { id: 'asc' } },
      },
      orderBy: { id: 'asc' },
    });
    const recordIds = renewals.flatMap((renewal) => [
      renewal.id,
      ...renewal.tasks.map((task) => task.id),
    ]);
    const auditEvents = recordIds.length
      ? await this.client.auditEvent.findMany({
          where: { workspaceId, recordId: { in: recordIds } },
          orderBy: [{ occurredAt: 'asc' }, { id: 'asc' }],
        })
      : [];
    return renewals.map((renewal) =>
      assembleRenewalGraph({
        workspace: renewal.workspace,
        contact: renewal.policy.contact,
        policy: renewal.policy,
        renewal,
        followUpTask:
          renewal.tasks.find((task) => task.status === 'pending') ??
          renewal.tasks[0] ??
          null,
        auditEvents: auditEvents.filter(
          ({ recordId }) =>
            recordId === renewal.id ||
            renewal.tasks.some(({ id }) => id === recordId),
        ),
      }),
    );
  }

  async completeTask(
    command: CompleteTaskCommand,
  ): Promise<CompleteTaskResult> {
    if (!command.workspaceId || !command.taskId)
      throw new Error('workspaceId and taskId are required');
    return this.client.$transaction(async (tx) => {
      const updated = await tx.$executeRaw`
        UPDATE follow_up_tasks AS task
        SET status = 'completed', version = version + 1,
            completed_at = ${command.completedAt}
        FROM renewals AS renewal
        WHERE task.id = ${command.taskId}::uuid
          AND task.workspace_id = ${command.workspaceId}::uuid
          AND task.status = 'pending'
          AND task.version = ${command.expectedTaskVersion}
          AND renewal.id = task.renewal_id
          AND renewal.workspace_id = task.workspace_id
          AND renewal.status = 'open'
      `;
      if (updated === 1) {
        const workspace = await tx.workspace.findUniqueOrThrow({
          where: { id: command.workspaceId },
          select: { sourceVersion: true, sourceHash: true },
        });
        await tx.auditEvent.create({
          data: {
            id: command.eventId,
            workspaceId: command.workspaceId,
            actorId: command.actorId,
            eventType: 'task.completed',
            recordId: command.taskId,
            correlationId: command.correlationId,
            provenanceId: SYNTHETIC_RENEWAL.provenanceId,
            sourceVersion: workspace.sourceVersion,
            sourceHash: workspace.sourceHash,
            occurredAt: command.completedAt,
            createdAt: command.completedAt,
          },
        });
      }

      const task = await tx.followUpTask.findFirst({
        where: { id: command.taskId, workspaceId: command.workspaceId },
        include: { renewal: true },
      });
      if (!task) return { kind: 'not-found' };
      if (task.renewal.status !== 'open')
        throw new Error('Stored task completion is invalid');
      if (
        task.status === 'pending' ||
        task.version !== command.expectedTaskVersion + 1
      )
        return { kind: 'version-conflict' };
      const workspace = await tx.workspace.findUniqueOrThrow({
        where: { id: command.workspaceId },
        select: { sourceVersion: true, sourceHash: true },
      });
      const events = await tx.auditEvent.findMany({
        where: {
          workspaceId: command.workspaceId,
          recordId: command.taskId,
          eventType: 'task.completed',
        },
      });
      return {
        kind: 'completed',
        value: completedState(command, task, workspace, events),
      };
    });
  }
}
