import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('foundation clean-checkout seam', () => {
  it.each(['api/src/app.ts', 'api/src/server.ts'])(
    '%s has no static persistence import',
    async (path) => {
      const source = await readFile(path, 'utf8');
      expect(source).not.toMatch(
        /^import .*?(generated\/prisma|database\/prisma|modules\/renewals)/m,
      );
    },
  );
});
