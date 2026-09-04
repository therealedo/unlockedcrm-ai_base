import { describe, expect, it, vi } from 'vitest';

import {
  buildProcessPlan,
  runProcessPlan,
  validateExecutablePath,
} from './orchestrate.mjs';

describe('the closed Windows process launcher', () => {
  it.each([
    'requirements.txt',
    'CMakeLists.txt',
    'guide.md',
    'component.mdx',
    'README.sh',
  ])('rejects documentation-like executable path %s before spawn', (path) => {
    expect(() => validateExecutablePath(path)).toThrow('Untrusted executable');
  });

  it('rejects unknown modes and an altered ComSpec before spawn', () => {
    expect(() =>
      buildProcessPlan({ mode: 'preview', platform: 'win32' }),
    ).toThrow('Unknown mode');
    expect(() =>
      buildProcessPlan({
        mode: 'foundation',
        platform: 'win32',
        env: { SystemRoot: 'C:\\Windows', ComSpec: 'C:\\tools\\cmd.exe' },
      }),
    ).toThrow('Untrusted ComSpec');
  });

  it('uses fixed argv and propagates failure after reverse-order cleanup', async () => {
    const plan = buildProcessPlan({
      mode: 'foundation',
      platform: 'win32',
      env: {
        SystemRoot: 'C:\\Windows',
        ComSpec: 'C:\\Windows\\System32\\cmd.exe',
      },
    });
    expect(plan.map(({ executable, args }) => [executable, args])).toEqual([
      [
        'docker.exe',
        [
          'compose',
          '-p',
          'unlockedcrm-renewal',
          '-f',
          'compose.yaml',
          'up',
          '-d',
          'postgres',
        ],
      ],
      [
        'C:\\Windows\\System32\\cmd.exe',
        ['/d', '/s', '/c', 'npm.cmd run dev:api'],
      ],
      [
        'C:\\Windows\\System32\\cmd.exe',
        ['/d', '/s', '/c', 'npm.cmd run dev:web'],
      ],
    ]);

    const events: string[] = [];
    const spawn = vi.fn(async (process) => {
      events.push(`start:${process.name}`);
      if (process.name === 'web') throw new Error('child failed');
      return {
        done: undefined,
        stop: async () => {
          events.push(`stop:${process.name}`);
        },
      };
    });
    await expect(
      runProcessPlan(plan, { spawn, timeoutMs: 50 }),
    ).rejects.toThrow('child failed');
    expect(events).toEqual([
      'start:postgres',
      'start:api',
      'start:web',
      'stop:api',
      'stop:postgres',
    ]);
  });

  it('times out and cleans up children', async () => {
    const events: string[] = [];
    const plan = buildProcessPlan({
      mode: 'foundation',
      platform: 'win32',
      env: {
        SystemRoot: 'C:\\Windows',
        ComSpec: 'C:\\Windows\\System32\\cmd.exe',
      },
    });
    const spawn = vi.fn(async (process: { name: string }) => {
      if (process.name === 'api') return new Promise<never>(() => {});
      return {
        done: undefined,
        stop: async () => {
          events.push(`stop:${process.name}`);
        },
      };
    });
    await expect(runProcessPlan(plan, { spawn, timeoutMs: 5 })).rejects.toThrow(
      'timed out',
    );
    expect(events).toEqual(['stop:postgres']);
  });

  it('rejects altered argv before spawn', async () => {
    const spawn = vi.fn();
    await expect(
      runProcessPlan(
        [
          {
            name: 'postgres',
            executable: 'docker.exe',
            args: ['compose', 'down'],
          },
        ],
        { spawn },
      ),
    ).rejects.toThrow('Untrusted argv');
    expect(spawn).not.toHaveBeenCalled();
  });
});
