import { fileURLToPath } from 'node:url';
import { buildApp } from '../src/app.js';
import { createRenewalPlugin } from '../src/plugins/renewal-plugin.js';

export const PLAYWRIGHT_API_PORT = 4310;
const PLAYWRIGHT_DATABASE_URL =
  'postgresql://unlockedcrm:synthetic-local-only@127.0.0.1:54330/unlockedcrm_test?schema=public';

export function readPlaywrightServerConfig(env: NodeJS.ProcessEnv) {
  if (
    env.DATABASE_URL !== PLAYWRIGHT_DATABASE_URL ||
    env.API_HOST !== '127.0.0.1' ||
    env.API_PORT !== String(PLAYWRIGHT_API_PORT)
  )
    throw new Error(
      'The isolated Playwright server requires its exact database, host, and API port',
    );
  return {
    databaseUrl: PLAYWRIGHT_DATABASE_URL,
    host: '127.0.0.1',
    port: PLAYWRIGHT_API_PORT,
  } as const;
}

export async function startPlaywrightServer(env: NodeJS.ProcessEnv) {
  const config = readPlaywrightServerConfig(env);
  const renewals = await createRenewalPlugin(config.databaseUrl);
  const app = await buildApp({ renewals });
  try {
    await app.listen({ host: config.host, port: config.port });
  } catch (error) {
    await app.close();
    throw error;
  }
  return app;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const app = await startPlaywrightServer(process.env);
  for (const signal of ['SIGINT', 'SIGTERM'] as const)
    process.once(signal, () => app.close());
}
