import type { FastifyInstance, FastifyReply } from 'fastify';
import type { RequestContext } from '../../context/request-context.js';
import type { RenewalRepository } from './repository.js';
import { readRenewalWorkflow } from './service.js';

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
}
