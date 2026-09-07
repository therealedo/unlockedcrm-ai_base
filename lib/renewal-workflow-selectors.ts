import type { RenewalWorkflowResponse } from './renewal-workflow-client';

export const selectManagedPolicies = (graph: RenewalWorkflowResponse) =>
  graph.items;

export const selectManagedContact = (
  graph: RenewalWorkflowResponse,
  contactId: string,
) => graph.items.find(({ contact }) => contact.id === contactId);
