import type { FastifyInstance, FastifyReply } from 'fastify';
import type { RequestContext } from '../../context/request-context.js';
import type { ContactRepository } from './repository.js';
import { findContact, listContacts } from './service.js';

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const errors = {
  workspace: [400, 'INVALID_WORKSPACE_ID', 'Workspace ID must be a UUID.'],
  contactId: [400, 'INVALID_CONTACT_ID', 'Contact ID must be a UUID.'],
  directory: [
    404,
    'CONTACT_DIRECTORY_NOT_FOUND',
    'Contact directory not found.',
  ],
  contact: [404, 'CONTACT_NOT_FOUND', 'Contact not found.'],
  unavailable: [
    503,
    'CONTACT_PERSISTENCE_UNAVAILABLE',
    'Contact persistence is unavailable.',
  ],
} as const;

type ErrorName = keyof typeof errors;
const fail = (reply: FastifyReply, name: ErrorName, correlationId: string) => {
  const [status, code, message] = errors[name];
  return reply.code(status).send({ error: { code, message, correlationId } });
};

export interface ContactRouteDependencies {
  repository: ContactRepository;
  contextFactory: () => RequestContext;
}

export function registerContactReadRoutes(
  app: FastifyInstance,
  dependencies: ContactRouteDependencies,
) {
  app.get<{ Params: { workspaceId: string } }>(
    '/api/v1/workspaces/:workspaceId/contacts',
    async (request, reply) => {
      const context = dependencies.contextFactory();
      if (!UUID.test(request.params.workspaceId))
        return fail(reply, 'workspace', context.correlationId);
      try {
        const response = await listContacts(
          dependencies.repository,
          context,
          request.params.workspaceId,
        );
        return response ?? fail(reply, 'directory', context.correlationId);
      } catch {
        return fail(reply, 'unavailable', context.correlationId);
      }
    },
  );
  app.get<{ Params: { workspaceId: string; contactId: string } }>(
    '/api/v1/workspaces/:workspaceId/contacts/:contactId',
    async (request, reply) => {
      const context = dependencies.contextFactory();
      const { workspaceId, contactId } = request.params;
      if (!UUID.test(workspaceId))
        return fail(reply, 'workspace', context.correlationId);
      if (!UUID.test(contactId))
        return fail(reply, 'contactId', context.correlationId);
      try {
        const response = await findContact(
          dependencies.repository,
          context,
          workspaceId,
          contactId,
        );
        return response ?? fail(reply, 'contact', context.correlationId);
      } catch {
        return fail(reply, 'unavailable', context.correlationId);
      }
    },
  );
}
