import { expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
it('is live, not persistence-ready, and has no renewal routes', async () => {
  const app = await buildApp();
  try {
    const live = await app.inject('/health/live');
    expect(live.statusCode).toBe(200);
    expect(live.json()).toEqual({ status: 'live' });
    const ready = await app.inject('/health/ready');
    expect(ready.statusCode).toBe(503);
    expect(ready.json()).toEqual({
      error: {
        code: 'MIGRATIONS_UNAVAILABLE',
        message: 'Persistence is not initialized.',
      },
    });
    for (const path of '/api/renewals /api/renewals/synthetic-renewal-001'.split(
      ' ',
    ))
      expect((await app.inject(path)).statusCode).toBe(404);
  } finally {
    await app.close();
  }
});
