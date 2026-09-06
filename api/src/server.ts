import { buildApp } from './app.js';
import { readConfig } from './config.js';
const app = await buildApp();
await app.listen(readConfig(process.env));
for (const signal of ['SIGINT', 'SIGTERM'] as const)
  process.once(signal, () => app.close());
