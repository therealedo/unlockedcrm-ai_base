import { afterEach, describe, expect, it } from 'vitest';

import { buildApp } from '../src/app.js';

const apps: Awaited<ReturnType<typeof buildApp>>[] = [];
afterEach(async () => Promise.all(apps.splice(0).map((app) => app.close())));

describe('foundation health', () => {
  it('reports liveness without generated persistence assets', async () => {
    const app = await buildApp({ mode: 'foundation' });
    apps.push(app);
    const response = await app.inject('/health/live');
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: 'live' });
  });

  it('reports migrations unavailable instead of importing persistence', async () => {
    const app = await buildApp({ mode: 'foundation' });
    apps.push(app);
    const response = await app.inject('/health/ready');
    expect(response.statusCode).toBe(503);
    expect(response.json()).toEqual({
      error: {
        code: 'MIGRATIONS_UNAVAILABLE',
        message: 'Persistence is not initialized.',
      },
    });
  });
});
