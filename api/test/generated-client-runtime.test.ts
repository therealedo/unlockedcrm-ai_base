import { expect, it, vi } from 'vitest';
import {
  TEST_DATABASE_URL,
  withPostgresTestDatabase,
} from './postgres-test-database.js';

it('rejects every non-test DSN before creating a client', async () => {
  for (const databaseUrl of [
    undefined,
    TEST_DATABASE_URL.replace('54330', '54329'),
    TEST_DATABASE_URL.replace('unlockedcrm_test', 'unlockedcrm_dev'),
  ]) {
    const createClient = vi.fn();
    await expect(
      withPostgresTestDatabase(
        databaseUrl,
        async () => undefined,
        createClient,
      ),
    ).rejects.toThrow('isolated test database URL');
    expect(createClient).not.toHaveBeenCalled();
  }
});

it('imports the generated client and connects only to isolated PostgreSQL', async () => {
  await withPostgresTestDatabase(process.env.DATABASE_URL, async (client) => {
    const rows = await client.$queryRaw<
      Array<{ value: number }>
    >`SELECT 1 AS value`;
    expect(rows).toEqual([{ value: 1 }]);
  });
});
