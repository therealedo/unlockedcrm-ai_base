import { expect, it } from 'vitest';
import { readConfig } from '../src/config.js';
it('accepts only the synthetic Foundation profile and a valid port', () => {
  expect(readConfig({})).toEqual({
    host: '127.0.0.1',
    port: 3100,
    mode: 'foundation',
  });
  for (const mode of ['production', 'local'])
    expect(() => readConfig({ APP_MODE: mode })).toThrow('APP_MODE');
  expect(() => readConfig({ API_PORT: '0' })).toThrow('API_PORT');
});
