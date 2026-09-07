import type { FastifyInstance, FastifyReply } from 'fastify';
import { parseTaskCompletionRequest } from '../../contracts/renewal-workflow.js';
import type { RequestContext } from '../../context/request-context.js';
import type { RenewalRepository } from './repository.js';
import { completeRenewalTask, readRenewalWorkflow } from './service.js';

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export interface RenewalRouteDependencies {
  repository: RenewalRepository;
  contextFactory: () => RequestContext;
  close?: () => Promise<void>;
}

const ERRORS = {
  400: ['INVALID_WORKSPACE_ID', 'Workspace ID must be a UUID.'],
  404: ['RENEWAL_GRAPH_NOT_FOUND', 'Renewal graph not found.'],
  503: ['PERSISTENCE_UNAVAILABLE', 'Renewal persistence is unavailable.'],
} as const;
const fail = (
  reply: FastifyReply,
  status: 400 | 404 | 503,
  correlationId: string,
) => {
  const [code, message] = ERRORS[status];
  return reply.code(status).send({ error: { code, message, correlationId } });
};

const completionErrors = {
  invalid: ['INVALID_TASK_COMPLETION', 'Task completion request is invalid.'],
  missing: ['TASK_NOT_FOUND', 'Task not found.'],
  conflict: [
    'TASK_VERSION_CONFLICT',
    'Task version conflicts with stored state.',
  ],
  unavailable: [
    'PERSISTENCE_UNAVAILABLE',
    'Renewal persistence is unavailable.',
  ],
} as const;

const failCompletion = (
  reply: FastifyReply,
  status: 400 | 404 | 409 | 503,
  error: keyof typeof completionErrors,
  correlationId: string,
) => {
  const [code, message] = completionErrors[error];
  return reply.code(status).send({ error: { code, message, correlationId } });
};

export function registerRenewalRoutes(
  app: FastifyInstance,
  dependencies: RenewalRouteDependencies,
) {
  app.get<{ Params: { workspaceId: string } }>(
    '/api/v1/workspaces/:workspaceId/renewals',
    async (request, reply) => {
      const context = dependencies.contextFactory();
      const { workspaceId } = request.params;
      if (!UUID.test(workspaceId))
        return fail(reply, 400, context.correlationId);
      try {
        const response = await readRenewalWorkflow(
          dependencies.repository,
          context,
          workspaceId,
        );
        if (!response) return fail(reply, 404, context.correlationId);
        return response;
      } catch {
        return fail(reply, 503, context.correlationId);
      }
    },
  );
  app.post<{
    Params: { workspaceId: string; taskId: string };
    Body: unknown;
  }>(
    '/api/v1/workspaces/:workspaceId/tasks/:taskId/completion',
    async (request, reply) => {
      const context = dependencies.contextFactory();
      const { workspaceId, taskId } = request.params;
      if (!UUID.test(workspaceId))
        return fail(reply, 400, context.correlationId);
      const body = parseTaskCompletionRequest(request.body);
      if (!UUID.test(taskId) || !body)
        return failCompletion(reply, 400, 'invalid', context.correlationId);
      try {
        const result = await completeRenewalTask(
          dependencies.repository,
          context,
          workspaceId,
          taskId,
          body.expectedTaskVersion,
        );
        if (result.kind === 'not-found')
          return failCompletion(reply, 404, 'missing', context.correlationId);
        if (result.kind === 'version-conflict')
          return failCompletion(reply, 409, 'conflict', context.correlationId);
        return result.value;
      } catch {
        return failCompletion(reply, 503, 'unavailable', context.correlationId);
      }
    },
  );
}
