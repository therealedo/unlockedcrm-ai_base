import { buildApp } from './app.js';
import { readConfig } from './config.js';
const config = readConfig(process.env);
const renewals =
  config.mode === 'local'
    ? await import('./plugins/renewal-plugin.js').then(
        ({ createRenewalPlugin }) => createRenewalPlugin(config.databaseUrl),
      )
    : undefined;
const app = await buildApp({ renewals });
await app.listen({ host: config.host, port: config.port });
for (const signal of ['SIGINT', 'SIGTERM'] as const)
  process.once(signal, () => app.close());
