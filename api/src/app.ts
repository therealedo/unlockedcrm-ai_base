import Fastify from 'fastify';
export async function buildApp() {
  const app = Fastify({ logger: false });
  app.get('/health/live', async () => ({ status: 'live' }));
  app.get('/health/ready', async (_request, reply) =>
    reply.code(503).send({
      error: {
        code: 'MIGRATIONS_UNAVAILABLE',
        message: 'Persistence is not initialized.',
      },
    }),
  );
  return app;
}
