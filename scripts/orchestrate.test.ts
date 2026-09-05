/// <reference types="node" />
import { spawn, spawnSync } from 'node:child_process';
import { EventEmitter } from 'node:events';
import * as fs from 'node:fs';
import { tmpdir } from 'node:os';
import * as path from 'node:path';

import { describe, expect, it, vi } from 'vitest';

import {
  buildProcessPlan,
  runProcessPlan,
  terminateProcessTree,
  validateExecutablePath,
} from './orchestrate.mjs';

const processStub = (pid?: number) =>
  Object.assign(new EventEmitter(), { exitCode: null, signalCode: null, pid });
const root = process.env.SystemRoot ?? 'C:\\Windows';
const windows = {
  platform: 'win32' as const,
  env: { SystemRoot: root, ComSpec: `${root}\\System32\\cmd.exe` },
};
const basePlan = () => buildProcessPlan({ mode: 'foundation', ...windows });
const expectGone = (pid: number) =>
  expect(() => process.kill(pid, 0)).toThrow();
const apiScript = path.resolve('scripts/api-check.mjs');
const untrustedPaths =
  'requirements.txt CMakeLists.txt guide.md component.mdx README.sh'.split(' ');
const persistenceImport =
  /^import .*?(generated\/prisma|database\/prisma|modules\/renewals)/m;
function apiFixture() {
  const project = fs.mkdtempSync(path.join(tmpdir(), 'api check '));
  fs.writeFileSync(path.join(project, 'package.json'), '{}');
  for (const [name, entry] of [
    ['prisma', 'build/index.js'],
    ['vitest', 'vitest.mjs'],
  ]) {
    const packageRoot = path.join(project, 'node_modules', name);
    fs.mkdirSync(path.dirname(path.join(packageRoot, entry)), {
      recursive: true,
    });
    fs.writeFileSync(path.join(packageRoot, 'package.json'), '{}');
    fs.writeFileSync(
      path.join(packageRoot, entry),
      `console.log('${name}:' + process.argv.slice(2).join(' '));if(process.env.FAIL_CLI==='${name}')process.exitCode=7`,
    );
  }
  return project;
}
function checkApi(cwd: string, mode: string, extraEnv = {}) {
  return spawnSync(process.execPath, [apiScript, mode], {
    cwd,
    encoding: 'utf8',
    env: { ...extraEnv, PATH: '' },
  });
}
describe('the closed Windows process launcher', () => {
  it('terminates a real cmd.exe descendant tree and awaits its exit', async () => {
    const taskkill = `${root}\\System32\\taskkill.exe`;
    const script = `${process.env.TEMP}\\tree-${process.pid}.cjs`;
    fs.writeFileSync(script, 'console.log(process.pid);setInterval(()=>0,1e3)');
    const child = spawn(
      `${root}\\System32\\cmd.exe`,
      ['/d', '/s', '/c', `call "${process.execPath}" "${script}"`],
      {
        shell: false,
        stdio: ['ignore', 'pipe', 'ignore'],
        windowsHide: true,
        windowsVerbatimArguments: true,
      },
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
      expectGone(descendantPid);
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
          expectGone(pid);
      expectGone(descendantPid);
      fs.unlinkSync(script);
    }
  });
  it.each(['taskkill completion', 'child exit'])(
    'bounds a stalled %s wait',
    async (wait) => {
      const child = processStub(123),
        killer = processStub();
      if (wait === 'child exit') queueMicrotask(() => killer.emit('exit', 0));
      const options = {
        ...windows,
        spawn: () => killer,
      };
      await expect(
        terminateProcessTree(child, options as never, 5),
      ).rejects.toThrow('timed out');
    },
  );
  it.each(untrustedPaths)(
    'rejects documentation-like executable path %s before spawn',
    (path) => {
      expect(() => validateExecutablePath(path)).toThrow(
        'Untrusted executable',
      );
    },
  );
  it.each(['api/src/app.ts', 'api/src/server.ts'])(
    '%s has no static persistence import',
    (file) => {
      expect(fs.readFileSync(file, 'utf8')).not.toMatch(persistenceImport);
    },
  );
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
    const plan = basePlan();
    expect(
      plan.map(({ executable, args }) => [executable, ...args].join('|')),
    ).toEqual([
      'docker.exe|compose|-p|unlockedcrm-renewal|-f|compose.yaml|up|-d|postgres',
      `${root}\\System32\\cmd.exe|/d|/s|/c|npm.cmd run dev:api`,
      `${root}\\System32\\cmd.exe|/d|/s|/c|npm.cmd run dev:web`,
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
    const plan = basePlan();
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
  it('runs installed API CLIs without command shims and propagates failure', () => {
    const project = apiFixture();
    try {
      const test = checkApi(project, 'test');
      expect(test.error).toBeUndefined();
      expect(test.status, test.stderr).toBe(0);
      expect(test.stdout.trim().split(/\r?\n/)).toEqual([
        'prisma:generate --config prisma.config.ts',
        'vitest:run --project api',
      ]);
      expect(checkApi(project, 'test', { FAIL_CLI: 'vitest' }).status).toBe(7);
    } finally {
      fs.rmSync(project, { recursive: true });
    }
  });
});
