import type { RenewalWorkflowResponse } from '../../contracts/renewal-workflow.js';
import type { RequestContext } from '../../context/request-context.js';
import type { RenewalGraph } from './domain.js';
import type { RenewalRepository } from './repository.js';

const iso = (value: Date) => value.toISOString();

function projectGraph(
  graph: RenewalGraph,
): RenewalWorkflowResponse['items'][0] {
  const task = graph.followUpTask;
  return {
    source: { version: graph.source.version, hash: graph.source.hash },
    contact: {
      id: graph.contact.id,
      displayName: graph.contact.displayName,
    },
    policy: {
      id: graph.policy.id,
      contactId: graph.policy.contactId,
      displayLabel: graph.policy.displayLabel,
      renewalDate: iso(graph.policy.renewalDate),
    },
    renewal: {
      id: graph.renewal.id,
      policyId: graph.renewal.policyId,
      displayLabel: graph.renewal.displayLabel,
      status: 'open',
    },
    followUpTask: task
      ? {
          id: task.id,
          renewalId: task.renewalId,
          title: task.title,
          status: task.status as 'pending' | 'completed',
          version: task.version,
          dueAt: iso(task.dueAt),
          completedAt: task.completedAt ? iso(task.completedAt) : null,
        }
      : null,
    auditEvents: graph.auditEvents.map((event) => ({
      id: event.id,
      type: event.eventType as 'renewal.created' | 'task.completed',
      occurredAt: iso(event.occurredAt),
      actorId: event.actorId,
      recordId: event.recordId,
      correlationId: event.correlationId,
      provenanceId: event.provenanceId,
    })),
    links: {
      home: '/',
      contact: `/contacts/${graph.contact.id}`,
      policy: `/policies/${graph.policy.id}`,
      renewals: '/policies/renewals',
      tasks: '/tasks',
      audit: '/analytics/audit',
    },
  };
}

export async function readRenewalWorkflow(
  repository: RenewalRepository,
  context: RequestContext,
  workspaceId: string,
): Promise<RenewalWorkflowResponse | null> {
  if (context.workspaceId !== workspaceId) return null;
  if (!(await repository.workspaceExists(workspaceId))) return null;
  const graphs = await repository.findOpenByWorkspace(workspaceId);
  const events = graphs.flatMap(({ auditEvents }) => auditEvents);
  const latest = Math.max(
    ...events.map(({ occurredAt }) => occurredAt.getTime()),
  );
  const asOf = events.length ? iso(new Date(latest)) : null;
  return {
    schemaVersion: 'renewal-workflow.v1',
    asOf,
    correlationId: context.correlationId,
    workspaceId,
    items: graphs.map(projectGraph),
  };
}
