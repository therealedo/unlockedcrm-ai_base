import type { PrismaClient } from '../generated/prisma/client.js';
import { createSyntheticRequestContext } from '../context/request-context.js';
import { createPrismaClient } from '../database/prisma.js';
import { PrismaRenewalRepository } from '../modules/renewals/prisma-renewal-repository.js';

type PrismaClientFactory = (databaseUrl: string) => PrismaClient;

export async function createLocalPersistence(
  databaseUrl: string,
  createClient: PrismaClientFactory = createPrismaClient,
) {
  const client = createClient(databaseUrl);
  let closed = false;
  await client.$connect();
  return {
    client,
    renewals: new PrismaRenewalRepository(client),
    contextFactory: createSyntheticRequestContext,
    async close() {
      if (closed) return;
      closed = true;
      await client.$disconnect();
    },
  };
}
