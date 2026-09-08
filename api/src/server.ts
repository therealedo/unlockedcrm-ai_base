import { buildApp } from './app.js';
import { readConfig } from './config.js';
const config = readConfig(process.env);
const persistence =
  config.mode === 'local'
    ? await import('./plugins/local-persistence.js').then(
        ({ createLocalPersistence }) =>
          createLocalPersistence(config.databaseUrl),
      )
    : undefined;
const app = await buildApp({
  contacts: persistence && {
    repository: persistence.contacts,
    contextFactory: persistence.contextFactory,
  },
  renewals: persistence && {
    repository: persistence.renewals,
    contextFactory: persistence.contextFactory,
    close: () => persistence.close(),
  },
});
await app.listen({ host: config.host, port: config.port });
for (const signal of ['SIGINT', 'SIGTERM'] as const)
  process.once(signal, () => app.close());
