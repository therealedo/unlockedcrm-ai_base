import { createLocalPersistence } from './local-persistence.js';

export async function createRenewalPlugin(databaseUrl: string) {
  const persistence = await createLocalPersistence(databaseUrl);
  return {
    repository: persistence.renewals,
    contextFactory: persistence.contextFactory,
    close: () => persistence.close(),
  };
}
