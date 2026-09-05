import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          include: [
            'lib/**/*.test.ts',
            'hooks/**/*.test.ts',
            'scripts/**/*.test.ts',
            'api/test/{server.config,app.inject}.test.ts',
          ],
        },
      },
      {
        test: {
          name: 'api',
          include: ['api/test/**/*.test.ts'],
          exclude: ['api/test/{server.config,app.inject}.test.ts'],
        },
      },
    ],
  },
});
