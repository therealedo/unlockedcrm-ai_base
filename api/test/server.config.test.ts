import { expect, it } from 'vitest';
import { DEVELOPMENT_DATABASE_URL, readConfig } from '../src/config.js';
import {
  PLAYWRIGHT_API_PORT,
  readPlaywrightServerConfig,
} from './playwright-server.js';
it('accepts only the synthetic Foundation profile and a valid port', () => {
  expect(readConfig({})).toEqual({
    host: '127.0.0.1',
    port: 3100,
    mode: 'foundation',
  });
  expect(
    readConfig({
      APP_MODE: 'local',
      DATABASE_URL: DEVELOPMENT_DATABASE_URL,
    }),
  ).toEqual({
    host: '127.0.0.1',
    port: 3100,
    mode: 'local',
    databaseUrl: DEVELOPMENT_DATABASE_URL,
  });
  expect(() => readConfig({ APP_MODE: 'production' })).toThrow('APP_MODE');
  for (const databaseUrl of [undefined, 'postgresql://unsafe'])
    expect(() =>
      readConfig({ APP_MODE: 'local', DATABASE_URL: databaseUrl }),
    ).toThrow('DATABASE_URL');
  expect(() => readConfig({ API_PORT: '0' })).toThrow('API_PORT');
});

it('accepts only the isolated Playwright database and API port', () => {
  expect(
    readPlaywrightServerConfig({
      DATABASE_URL:
        'postgresql://unlockedcrm:synthetic-local-only@127.0.0.1:54330/unlockedcrm_test?schema=public',
      API_HOST: '127.0.0.1',
      API_PORT: String(PLAYWRIGHT_API_PORT),
    }),
  ).toEqual({
    databaseUrl:
      'postgresql://unlockedcrm:synthetic-local-only@127.0.0.1:54330/unlockedcrm_test?schema=public',
    host: '127.0.0.1',
    port: 4310,
  });
  for (const env of [
    {},
    {
      DATABASE_URL:
        'postgresql://unlockedcrm:synthetic-local-only@127.0.0.1:54329/unlockedcrm_dev?schema=public',
      API_PORT: '4310',
    },
    {
      DATABASE_URL:
        'postgresql://unlockedcrm:synthetic-local-only@127.0.0.1:54330/unlockedcrm_test?schema=public',
      API_PORT: '3100',
    },
  ])
    expect(() => readPlaywrightServerConfig(env)).toThrow(
      /isolated Playwright/,
    );
});
