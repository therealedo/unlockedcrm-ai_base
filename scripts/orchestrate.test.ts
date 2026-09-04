/// <reference types="node" />
import { spawn, spawnSync } from 'node:child_process';
import { EventEmitter } from 'node:events';
import { unlinkSync, writeFileSync } from 'node:fs';

import { describe, expect, it, vi } from 'vitest';

import {
  buildProcessPlan,
  runProcessPlan,
  terminateProcessTree,
  validateExecutablePath,
} from './orchestrate.mjs';

const processStub = (pid?: number) =>
  Object.assign(new EventEmitter(), { exitCode: null, signalCode: null, pid });

describe('the closed Windows process launcher', () => {
  it('terminates a real cmd.exe descendant tree and awaits its exit', async () => {
    const root = process.env.SystemRoot ?? 'C:\\Windows';
    const taskkill = `${root}\\System32\\taskkill.exe`;
    const script = `${process.env.TEMP}\\tree-${process.pid}.cjs`;
    writeFileSync(script, 'console.log(process.pid);setInterval(()=>0,1e3)');
    const child = spawn(
      `${root}\\System32\\cmd.exe`,
      ['/d', '/s', '/c', `call ${process.execPath} ${script}`],
      { shell: false, stdio: ['ignore', 'pipe', 'ignore'], windowsHide: true },
    );
    let descendantPid = 0;
    try {
      descendantPid = await new Promise<number>((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('PID timeout')), 3000);
        child.once('error', reject);
        child.stdout.once('data', (data) => {
          clearTimeout(timer);
          resolve(Number(data));
        });
      });
      await terminateProcessTree(child);
      expect(() => process.kill(descendantPid, 0)).toThrow();
    } finally {
      for (const pid of [descendantPid, child.pid])
        if (
          typeof pid === 'number' &&
          pid > 0 &&
          spawnSync(taskkill, ['/pid', String(pid), '/t', '/f'], {
            shell: false,
            timeout: 5000,
          }).status !== 0
        )
          expect(() => process.kill(pid, 0)).toThrow();
      expect(() => process.kill(descendantPid, 0)).toThrow();
      unlinkSync(script);
    }
  });

  it.each(['taskkill completion', 'child exit'])(
    'bounds a stalled %s wait',
    async (wait) => {
      const child = processStub(123),
        killer = processStub();
      if (wait === 'child exit') queueMicrotask(() => killer.emit('exit', 0));
      const options = {
        platform: 'win32',
        env: { SystemRoot: 'C:\\Windows' },
        spawn: () => killer,
      };
      await expect(
        terminateProcessTree(child, options as never, 5),
      ).rejects.toThrow('timed out');
    },
  );

  it.each([
    'requirements.txt',
    'CMakeLists.txt',
    'guide.md',
    'component.mdx',
    'README.sh',
  ])('rejects documentation-like executable path %s before spawn', (path) => {
    expect(() => validateExecutablePath(path)).toThrow('Untrusted executable');
  });

  it('rejects bad configuration and ignores an exited child', async () => {
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
    const spawn = vi.fn();
    await terminateProcessTree({ exitCode: 0, signalCode: null }, { spawn });
    expect(spawn).not.toHaveBeenCalled();
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

    const primaryError = new Error('child failed');
    const cleanupErrors = [
      new Error('postgres cleanup failed'),
      new Error('stop timed out'),
    ];
    const events: string[] = [];
    const spawn = vi.fn(async (process) => {
      events.push(`start:${process.name}`);
      if (process.name === 'web') throw primaryError;
      return {
        done: undefined,
        stop: async () => {
          events.push(`stop:${process.name}`);
          if (process.name === 'api') {
            await new Promise((resolve) => setTimeout(resolve, 5));
            throw cleanupErrors[1];
          }
          if (process.name === 'postgres') throw cleanupErrors[0];
        },
      };
    });
    const failure = await runProcessPlan(plan, { spawn, timeoutMs: 50 }).catch(
      (error: unknown) => error,
    );
    expect((failure as AggregateError).errors).toEqual([
      primaryError,
      cleanupErrors[1],
      cleanupErrors[0],
    ]);
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
    const plan = [
      { name: 'postgres', executable: 'docker.exe', args: ['compose', 'down'] },
    ];
    await expect(runProcessPlan(plan, { spawn })).rejects.toThrow(
      'Untrusted argv',
    );
    expect(spawn).not.toHaveBeenCalled();
  });
});
