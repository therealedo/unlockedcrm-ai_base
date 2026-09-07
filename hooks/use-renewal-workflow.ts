'use client';
/* oxlint-disable react/react-compiler, react-hooks/exhaustive-deps -- route changes intentionally drive this external fetch state machine */

import { useEffect, useRef, useState } from 'react';

import { matchRenewalRoute } from '@/lib/crm-route';
import {
  fetchRenewalWorkflow,
  RenewalWorkflowClientError,
  type RenewalWorkflowResponse,
} from '@/lib/renewal-workflow-client';
import {
  selectManagedContact,
  selectManagedPolicy,
} from '@/lib/renewal-workflow-selectors';

export type RenewalWorkflowState =
  | { status: 'idle' | 'loading' | 'empty' | 'not-found' | 'error' }
  | { status: 'ready'; graph: RenewalWorkflowResponse };

export function useRenewalWorkflow(route: string) {
  const [state, setState] = useState<RenewalWorkflowState>({ status: 'idle' });
  const [attempt, setAttempt] = useState(0);
  const cache = useRef<RenewalWorkflowResponse | null>(null);
  const target = matchRenewalRoute(route);

  useEffect(() => {
    if (
      !target ||
      (target.kind === 'contact' && !target.contactId) ||
      (target.kind === 'policy' && !target.policyId)
    ) {
      setState({ status: target ? 'not-found' : 'idle' });
      return;
    }
    const project = (graph: RenewalWorkflowResponse) => {
      if (
        target.kind === 'contact' &&
        !selectManagedContact(graph, target.contactId ?? '')
      )
        setState({ status: 'not-found' });
      else if (
        target.kind === 'policy' &&
        !selectManagedPolicy(graph, target.policyId ?? '')
      )
        setState({ status: 'not-found' });
      else if (graph.items.length === 0) setState({ status: 'empty' });
      else setState({ status: 'ready', graph });
    };
    if (cache.current) {
      project(cache.current);
      return;
    }
    const controller = new AbortController();
    setState({ status: 'loading' });
    void fetchRenewalWorkflow(controller.signal)
      .then((graph) => {
        if (controller.signal.aborted) return;
        cache.current = graph;
        project(graph);
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setState(
          (target.kind === 'contact' || target.kind === 'policy') &&
            error instanceof RenewalWorkflowClientError &&
            error.code === 'not-found'
            ? { status: 'not-found' }
            : { status: 'error' },
        );
      });
    return () => controller.abort();
  }, [route, attempt]);

  const routeTitle =
    target?.kind === 'contact'
      ? target.contactId && state.status === 'ready'
        ? (selectManagedContact(state.graph, target.contactId)?.contact
            .displayName ?? 'Contact')
        : 'Contact'
      : target?.kind === 'policy'
        ? target.policyId && state.status === 'ready'
          ? (selectManagedPolicy(state.graph, target.policyId)?.policy
              .displayLabel ?? 'Policy')
          : 'Policy'
        : target?.kind === 'renewals'
          ? 'Renewal Dashboard'
          : null;
  return {
    state,
    routeTitle,
    retry: () => {
      cache.current = null;
      setAttempt((value) => value + 1);
    },
  };
}
