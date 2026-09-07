export const DEVELOPMENT_DATABASE_URL =
  'postgresql://unlockedcrm:synthetic-local-only@127.0.0.1:54329/unlockedcrm_dev?schema=public';

export function readConfig(env: NodeJS.ProcessEnv) {
  const mode = env.APP_MODE ?? 'foundation';
  const port = Number(env.API_PORT ?? 3100);
  if (!['foundation', 'local'].includes(mode))
    throw new Error('APP_MODE must be foundation or local');
  if (!Number.isInteger(port) || port < 1 || port > 65535)
    throw new Error('API_PORT must be a valid port');
  const common = {
    host: env.API_HOST ?? '127.0.0.1',
    port,
  };
  if (mode === 'local') {
    if (env.DATABASE_URL !== DEVELOPMENT_DATABASE_URL)
      throw new Error('DATABASE_URL must be the development database URL');
    return { ...common, mode, databaseUrl: DEVELOPMENT_DATABASE_URL } as const;
  }
  return { ...common, mode: 'foundation' } as const;
}
