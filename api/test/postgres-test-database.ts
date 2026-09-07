import type { PrismaClient } from '../src/generated/prisma/client.js';
import { createPrismaClient } from '../src/database/prisma.js';

export const TEST_DATABASE_URL =
  'postgresql://unlockedcrm:synthetic-local-only@127.0.0.1:54330/unlockedcrm_test?schema=public';

export function requireTestDatabaseUrl(value: string | undefined) {
  if (value !== TEST_DATABASE_URL)
    throw new Error('DATABASE_URL must be the isolated test database URL');
  return value;
}

export async function withPostgresTestDatabase<T>(
  databaseUrl: string | undefined,
  work: (client: PrismaClient) => Promise<T>,
  createClient = createPrismaClient,
) {
  const client = createClient(requireTestDatabaseUrl(databaseUrl));
  try {
    return await work(client);
  } finally {
    await client.$disconnect();
  }
}
