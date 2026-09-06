import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    projects: [
      { test: { name: 'unit', include: ['{lib,hooks,scripts}/**/*.test.ts'] } },
      { test: { name: 'api', include: ['api/test/**/*.test.ts'] } },
    ],
  },
});
