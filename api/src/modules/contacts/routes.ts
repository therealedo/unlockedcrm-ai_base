import type { FastifyInstance, FastifyReply } from 'fastify';
import type { RequestContext } from '../../context/request-context.js';
import { normalizeContactRequest } from './domain.js';
import type {
  ContactCreateRepository,
  ContactRepository,
} from './repository.js';
import { createContact, findContact, listContacts } from './service.js';

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const KEY = /^[A-Za-z0-9._:-]{8,128}$/;
const errors = {
  workspace: [400, 'INVALID_WORKSPACE_ID', 'Workspace ID must be a UUID.'],
  contactId: [400, 'INVALID_CONTACT_ID', 'Contact ID must be a UUID.'],
  key: [400, 'INVALID_IDEMPOTENCY_KEY', 'Idempotency key is invalid.'],
  request: [400, 'INVALID_CONTACT_REQUEST', 'Contact request is invalid.'],
  directory: [
    404,
    'CONTACT_DIRECTORY_NOT_FOUND',
    'Contact directory not found.',
  ],
  contact: [404, 'CONTACT_NOT_FOUND', 'Contact not found.'],
  conflict: [
    409,
    'IDEMPOTENCY_KEY_CONFLICT',
    'Idempotency key conflicts with the original request.',
  ],
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

export interface ContactCreateRouteDependencies {
  repository: ContactCreateRepository;
  contextFactory: () => RequestContext;
  now?: () => Date;
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

export function registerContactCreateRoute(
  app: FastifyInstance,
  dependencies: ContactCreateRouteDependencies,
) {
  app.post<{ Params: { workspaceId: string }; Body: unknown }>(
    '/api/v1/workspaces/:workspaceId/contacts',
    async (request, reply) => {
      const context = dependencies.contextFactory();
      const { workspaceId } = request.params;
      if (!UUID.test(workspaceId))
        return fail(reply, 'workspace', context.correlationId);
      if (context.workspaceId !== workspaceId)
        return fail(reply, 'contact', context.correlationId);
      const key = request.headers['idempotency-key'];
      if (typeof key !== 'string' || !KEY.test(key))
        return fail(reply, 'key', context.correlationId);
      const now = dependencies.now?.() ?? new Date();
      const input = normalizeContactRequest(request.body, now);
      if (!input) return fail(reply, 'request', context.correlationId);
      try {
        const result = await createContact(
          dependencies.repository,
          context,
          workspaceId,
          key,
          input,
          now,
        );
        if (result.kind === 'not-found')
          return fail(reply, 'contact', context.correlationId);
        if (result.kind === 'conflict')
          return fail(reply, 'conflict', context.correlationId);
        if (result.kind === 'unavailable')
          return fail(reply, 'unavailable', context.correlationId);
        reply.header('Idempotency-Replayed', String(result.replayed));
        return reply.code(result.replayed ? 200 : 201).send(result.value);
      } catch {
        return fail(reply, 'unavailable', context.correlationId);
      }
    },
  );
}
