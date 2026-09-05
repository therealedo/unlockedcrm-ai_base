import { buildApp } from './app.js';
import { readConfig } from './config.js';

const config = readConfig(process.env);
const app = await buildApp(config);
await app.listen({ host: config.host, port: config.port });

async function close() {
  await app.close();
}
process.once('SIGINT', close);
process.once('SIGTERM', close);
