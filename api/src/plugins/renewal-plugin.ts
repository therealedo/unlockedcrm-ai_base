import type { FastifyInstance } from 'fastify';

export async function registerRenewalPlugin(app: FastifyInstance) {
  const databaseModule = '../database/' + 'prisma.js';
  const renewalModule = '../modules/renewals/' + 'routes.js';
  const [{ createPrisma }, { registerRenewalRoutes }] = await Promise.all([
    import(databaseModule),
    import(renewalModule),
  ]);
  await registerRenewalRoutes(app, createPrisma());
}
