import { createPrismaClient } from '../database/prisma.js';
import { createSyntheticRequestContext } from '../context/request-context.js';
import { PrismaRenewalRepository } from '../modules/renewals/prisma-renewal-repository.js';

export async function createRenewalPlugin(databaseUrl: string) {
  const client = createPrismaClient(databaseUrl);
  await client.$connect();
  return {
    repository: new PrismaRenewalRepository(client),
    contextFactory: createSyntheticRequestContext,
    close: () => client.$disconnect(),
  };
}
