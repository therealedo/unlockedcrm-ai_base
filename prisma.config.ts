import { defineConfig } from 'prisma/config';

const developmentDatabaseUrl =
  'postgresql://unlockedcrm:synthetic-local-only@127.0.0.1:54329/unlockedcrm_dev?schema=public';

export default defineConfig({
  schema: 'api/prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL ?? developmentDatabaseUrl,
  },
});
