import { expect, it } from 'vitest';
import { DEVELOPMENT_DATABASE_URL, readConfig } from '../src/config.js';
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
