import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

export async function startTestWebServer({ create = createServer } = {}) {
  const server = await create({
    server: { host: '127.0.0.1', port: 4173, strictPort: true },
  });
  try {
    await server.listen();
  } catch (error) {
    await server.close();
    throw error;
  }
  server.printUrls();
  return () => server.close();
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  startTestWebServer().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
