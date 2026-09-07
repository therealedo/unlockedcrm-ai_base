import type { PrismaClient } from '../../generated/prisma/client.js';
import { assembleRenewalGraph, type RenewalGraph } from './domain.js';
import type { RenewalRepository } from './repository.js';

export class PrismaRenewalRepository implements RenewalRepository {
  constructor(private readonly client: PrismaClient) {}

  async findOpenByWorkspace(workspaceId: string): Promise<RenewalGraph[]> {
    if (!workspaceId) throw new Error('workspaceId is required');
    const renewals = await this.client.renewal.findMany({
      where: { workspaceId, status: 'open' },
      include: {
        workspace: true,
        policy: { include: { contact: true } },
        tasks: { where: { status: 'pending' }, orderBy: { id: 'asc' } },
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
    return renewals.flatMap((renewal) => {
      const followUpTask = renewal.tasks[0];
      if (!followUpTask) return [];
      return [
        assembleRenewalGraph({
          workspace: renewal.workspace,
          contact: renewal.policy.contact,
          policy: renewal.policy,
          renewal,
          followUpTask,
          auditEvents: auditEvents.filter(({ recordId }) =>
            [renewal.id, followUpTask.id].includes(recordId),
          ),
        }),
      ];
    });
  }
}
