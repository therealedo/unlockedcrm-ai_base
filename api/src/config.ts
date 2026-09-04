export type ApiMode = 'foundation' | 'local';

export function readConfig(env: NodeJS.ProcessEnv) {
  const mode = env.APP_MODE ?? 'foundation';
  const port = Number(env.API_PORT ?? 3100);
  if (mode !== 'foundation' && mode !== 'local')
    throw new Error('APP_MODE must be foundation or local');
  if (!Number.isInteger(port) || port < 1 || port > 65535)
    throw new Error('API_PORT must be a valid port');
  return { host: env.API_HOST ?? '127.0.0.1', port, mode: mode as ApiMode };
}
