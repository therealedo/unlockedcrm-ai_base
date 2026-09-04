import { describe, expect, it } from 'vitest';

import { readConfig } from '../src/config.js';

describe('API configuration', () => {
  it('defaults to the synthetic-only foundation profile', () => {
    expect(readConfig({})).toEqual({
      host: '127.0.0.1',
      port: 3100,
      mode: 'foundation',
    });
  });

  it('rejects an unknown mode and invalid port', () => {
    expect(() => readConfig({ APP_MODE: 'production' })).toThrow('APP_MODE');
    expect(() => readConfig({ API_PORT: '0' })).toThrow('API_PORT');
  });
});
