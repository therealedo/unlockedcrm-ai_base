'use client';
/* oxlint-disable react/react-compiler, react-hooks/exhaustive-deps -- route changes intentionally drive this external fetch state machine */

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { matchRenewalRoute } from '@/lib/crm-route';
import {
  completeRenewalTask,
  fetchRenewalWorkflow,
  RenewalWorkflowClientError,
  type RenewalWorkflowItem,
  type RenewalWorkflowResponse,
} from '@/lib/renewal-workflow-client';
import {
  selectManagedContact,
  selectManagedPolicy,
} from '@/lib/renewal-workflow-selectors';

export type RenewalWorkflowState =
  | { status: 'idle' | 'loading' | 'empty' | 'not-found' | 'error' }
  | { status: 'ready'; graph: RenewalWorkflowResponse };

export type RenewalCompletionState =
  | { status: 'idle' }
  | { status: 'submitting' | 'refreshing'; taskId: string }
  | { status: 'ambiguous' | 'failed' | 'refresh-error'; taskId: string };

export function useRenewalWorkflow(route: string, enabled = true) {
  const [state, setState] = useState<RenewalWorkflowState>({ status: 'idle' });
  const [completion, setCompletion] = useState<RenewalCompletionState>({
    status: 'idle',
  });
  const [attempt, setAttempt] = useState(0);
  const cache = useRef<RenewalWorkflowResponse | null>(null);
  const completionItem = useRef<RenewalWorkflowItem | null>(null);
  const completionController = useRef<AbortController | null>(null);
  const completionAttempt = useRef(0);
  const target = matchRenewalRoute(route);
  const targetRef = useRef(target);
  useLayoutEffect(() => {
    targetRef.current = target;
  }, [route]);

  const project = (graph: RenewalWorkflowResponse) => {
    const currentTarget = targetRef.current;
    if (!currentTarget) setState({ status: 'idle' });
    else if (
      currentTarget.kind === 'contact' &&
      !selectManagedContact(graph, currentTarget.contactId ?? '')
    )
      setState({ status: 'not-found' });
    else if (
      currentTarget.kind === 'policy' &&
      !selectManagedPolicy(graph, currentTarget.policyId ?? '')
    )
      setState({ status: 'not-found' });
    else if (graph.items.length === 0) setState({ status: 'empty' });
    else setState({ status: 'ready', graph });
  };

  useEffect(
    () => () => {
      completionAttempt.current += 1;
      completionController.current?.abort();
    },
    [],
  );

  useEffect(() => {
    if (
      !enabled ||
      !target ||
      (target.kind === 'contact' && !target.contactId) ||
      (target.kind === 'policy' && !target.policyId)
    ) {
      setState({ status: target ? 'not-found' : 'idle' });
      return;
    }
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
  }, [route, attempt, enabled]);

  const refreshAfterCompletion = async (
    taskId: string,
    controller: AbortController,
    operation: number,
  ) => {
    setCompletion({ status: 'refreshing', taskId });
    cache.current = null;
    try {
      const graph = await fetchRenewalWorkflow(controller.signal);
      if (controller.signal.aborted || operation !== completionAttempt.current)
        return;
      cache.current = graph;
      project(graph);
      completionItem.current = null;
      setCompletion({ status: 'idle' });
    } catch {
      if (controller.signal.aborted || operation !== completionAttempt.current)
        return;
      setCompletion({ status: 'refresh-error', taskId });
    }
  };

  const startCompletion = async (item: RenewalWorkflowItem) => {
    const task = item.followUpTask;
    if (!task || task.status !== 'pending') return;
    completionController.current?.abort();
    const controller = new AbortController();
    const operation = completionAttempt.current + 1;
    completionAttempt.current = operation;
    completionController.current = controller;
    completionItem.current = item;
    setCompletion({ status: 'submitting', taskId: task.id });
    try {
      await completeRenewalTask(item, controller.signal);
      if (controller.signal.aborted || operation !== completionAttempt.current)
        return;
      await refreshAfterCompletion(task.id, controller, operation);
    } catch (error) {
      if (controller.signal.aborted || operation !== completionAttempt.current)
        return;
      setCompletion({
        status:
          error instanceof Error &&
          'retryable' in error &&
          error.retryable === false
            ? 'failed'
            : 'ambiguous',
        taskId: task.id,
      });
    }
  };

  const retryCompletionRefresh = () => {
    const item = completionItem.current;
    const taskId = item?.followUpTask?.id;
    if (!taskId || completion.status !== 'refresh-error') return;
    completionController.current?.abort();
    const controller = new AbortController();
    const operation = completionAttempt.current + 1;
    completionAttempt.current = operation;
    completionController.current = controller;
    void refreshAfterCompletion(taskId, controller, operation);
  };

  const routeTitle =
    target?.kind === 'home'
      ? 'Home'
      : target?.kind === 'tasks'
        ? 'Tasks'
        : target?.kind === 'audit'
          ? 'Analytics Audit'
          : target?.kind === 'contact'
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
    completion,
    routeTitle,
    completeTask: (item: RenewalWorkflowItem) => void startCompletion(item),
    retryCompletion: () => {
      const item = completionItem.current;
      if (item && completion.status === 'ambiguous') void startCompletion(item);
    },
    retryCompletionRefresh,
    retry: () => {
      cache.current = null;
      setAttempt((value) => value + 1);
    },
  };
}
