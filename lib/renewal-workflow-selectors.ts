import type { RenewalWorkflowResponse } from './renewal-workflow-client';

const uniqueById = <T>(items: T[], getId: (item: T) => string) =>
  items.filter(
    (item, index) =>
      items.findIndex((candidate) => getId(candidate) === getId(item)) ===
      index,
  );

export const selectManagedPolicies = (graph: RenewalWorkflowResponse) =>
  uniqueById(graph.items, ({ renewal }) => renewal.id);

export const selectManagedContact = (
  graph: RenewalWorkflowResponse,
  contactId: string,
) => graph.items.find(({ contact }) => contact.id === contactId);

export const selectManagedPolicy = (
  graph: RenewalWorkflowResponse,
  policyId: string,
) => graph.items.find(({ policy }) => policy.id === policyId);

export const selectManagedFollowUps = (graph: RenewalWorkflowResponse) =>
  uniqueById(
    selectManagedPolicies(graph).flatMap((item) =>
      item.followUpTask ? [{ ...item, followUpTask: item.followUpTask }] : [],
    ),
    ({ followUpTask }) => followUpTask.id,
  );

export const selectManagedAuditEvents = (graph: RenewalWorkflowResponse) =>
  uniqueById(
    selectManagedPolicies(graph).flatMap((item) =>
      item.auditEvents.map((auditEvent) => ({ ...item, auditEvent })),
    ),
    ({ auditEvent }) => auditEvent.id,
  );

export function selectRenewalCounts(graph: RenewalWorkflowResponse) {
  const policies = selectManagedPolicies(graph);
  const followUps = selectManagedFollowUps(graph);
  return {
    openRenewals: policies.filter(({ renewal }) => renewal.status === 'open')
      .length,
    serverManagedFollowUps: followUps.length,
    pendingFollowUps: followUps.filter(
      ({ followUpTask }) => followUpTask.status === 'pending',
    ).length,
    completedFollowUps: followUps.filter(
      ({ followUpTask }) => followUpTask.status === 'completed',
    ).length,
    renewalAuditEvents: selectManagedAuditEvents(graph).length,
  };
}
