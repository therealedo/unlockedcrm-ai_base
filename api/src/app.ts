import Fastify from 'fastify';
import type { ApiMode } from './config.js';

export async function buildApp({ mode }: { mode: ApiMode }) {
  const app = Fastify({ logger: false });
  app.get('/health/live', async () => ({ status: 'live' }));
  if (mode === 'foundation') {
    app.get('/health/ready', async (_request, reply) =>
      reply.code(503).send({
        error: {
          code: 'MIGRATIONS_UNAVAILABLE',
          message: 'Persistence is not initialized.',
        },
      }),
    );
  } else {
    const { registerRenewalPlugin } =
      await import('./plugins/renewal-plugin.js');
    await registerRenewalPlugin(app);
    app.get('/health/ready', async () => ({ status: 'ready' }));
  }
  return app;
}
