import Fastify from 'fastify';
import {
  registerRenewalRoutes,
  type RenewalRouteDependencies,
} from './modules/renewals/routes.js';
import {
  registerContactReadRoutes,
  type ContactRouteDependencies,
} from './modules/contacts/routes.js';

export async function buildApp({
  renewals,
  contacts,
}: {
  renewals?: RenewalRouteDependencies;
  contacts?: ContactRouteDependencies;
} = {}) {
  const app = Fastify({ logger: false });
  app.get('/health/live', async () => ({ status: 'live' }));
  app.get('/health/ready', async (_request, reply) =>
    renewals
      ? { status: 'ready' }
      : reply.code(503).send({
          error: {
            code: 'MIGRATIONS_UNAVAILABLE',
            message: 'Persistence is not initialized.',
          },
        }),
  );
  if (renewals) {
    registerRenewalRoutes(app, renewals);
    if (renewals.close) app.addHook('onClose', renewals.close);
  }
  if (contacts) registerContactReadRoutes(app, contacts);
  return app;
}
