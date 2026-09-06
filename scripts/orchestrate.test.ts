import { spawn, spawnSync } from 'node:child_process';
import { EventEmitter, once } from 'node:events';
import * as fs from 'node:fs';
import { tmpdir } from 'node:os';
import * as path from 'node:path';
import { afterAll, expect, it, vi } from 'vitest';
import pw from '../playwright.config';
import { apiProxyTarget } from '../vite.config';
import {
  buildProcessPlan as build,
  reportError,
  runProcessPlan as run,
  spawnProcess as start,
  terminateProcessTree as terminate,
} from './orchestrate.mjs';
const real = fs.realpathSync;
const stub = (pid?: number) =>
  Object.assign(new EventEmitter(), { exitCode: null, signalCode: null, pid });
const finish = (child: ReturnType<typeof stub>, code: number) =>
  Reflect.set(child, 'exitCode', code) && child.emit('exit', code);
const killable = (child = stub()) =>
  Object.assign(child, {
    kill: vi.fn(() => queueMicrotask(() => finish(child, 143))),
  });
const rejected = (promise: Promise<unknown>) => promise.catch((error) => error);
const system = process.env.SystemRoot ?? 'C:\\Windows';
const fixture = fs.mkdtempSync(path.join(tmpdir(), 'foundation launcher '));
const at = (...parts: string[]) => path.join(fixture, ...parts);
const link = (to: string, at: string) => fs.symlinkSync(to, at, 'junction');
const repo = at('repository with spaces');
function file(relative: string) {
  const target = at(relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, 'fixture');
  return target;
}
const [node, npmCli, docker, sentinel, npmSentinel] =
  'node runtime/node.exe|node runtime/node_modules/npm/bin/npm-cli.js|user profile/Programs/DockerDesktop/resources/bin/docker.exe|repository with spaces/docker.exe|repository with spaces/npm.cmd'
    .split('|')
    .map(file);
const env = {
  SystemRoot: system,
  LOCALAPPDATA: at('user profile'),
  ProgramFiles: at('program files'),
};
const windows = { platform: 'win32' as const, env };
const UP = 'compose -p unlockedcrm-renewal -f compose.yaml up -d postgres';
const STOP = 'compose -p unlockedcrm-renewal -f compose.yaml stop postgres';
type Call = [string, string[], { cwd: string; shell: boolean }];
function plan(override?: string, exe = node) {
  return build({
    mode: 'foundation',
    ...windows,
    cwd: repo,
    repoRoot: repo,
    nodeExecutable: exe,
    env: { ...env, UNLOCKEDCRM_DOCKER_CLI: override },
  });
}
const gone = (pid: number) => expect(() => process.kill(pid, 0)).toThrow();
afterAll(() => fs.rmSync(fixture, { recursive: true }));
it('terminates a real cmd.exe descendant tree and awaits its exit', async () => {
  const taskkill = `${system}\\System32\\taskkill.exe`;
  const script = at(`tree-${process.pid}.cjs`);
  fs.writeFileSync(script, 'console.log(process.pid);setInterval(()=>0,1e3)');
  const child = spawn(
    `${system}\\System32\\cmd.exe`,
    ['/d', '/s', '/c', `call "${process.execPath}" "${script}"`],
    {
      stdio: ['ignore', 'pipe', 'ignore'],
      windowsHide: true,
      windowsVerbatimArguments: true,
    },
  );
  let descendantPid = 0;
  try {
    const [data] = await once(child.stdout, 'data', {
      signal: AbortSignal.timeout(3000),
    });
    descendantPid = Number(data);
    await terminate(child);
    for (const pid of [descendantPid, child.pid])
      if (typeof pid === 'number' && pid > 0) gone(pid);
  } finally {
    spawnSync(taskkill, ['/pid', String(child.pid), '/t', '/f'], {
      timeout: 5000,
    });
  }
});
it('bounds stalled taskkill and child-exit waits', async () => {
  for (const wait of ['taskkill', 'child']) {
    const child = stub(123);
    const killer = stub();
    if (wait === 'child') queueMicrotask(() => finish(killer, 0));
    await expect(
      terminate(child, { ...windows, spawn: (() => killer) as never }, 5),
    ).rejects.toThrow('timed out');
  }
  const moduleUrl = new URL('./orchestrate.mjs', import.meta.url).href;
  const program = `import { EventEmitter } from 'node:events';import { spawnProcess } from '${moduleUrl}';const child=Object.assign(new EventEmitter(),{exitCode:null,signalCode:null,pid:1});const handle=spawnProcess({name:'api',executable:process.execPath,args:[],cwd:process.cwd()},{spawn:()=>child});child.emit('spawn');child.emit('exit',7);setImmediate(async()=>{try{await handle.done;process.exit(2)}catch(error){process.exit(error.message==='api exited 7'?0:3)}})`;
  const args = ['--input-type=module', '-e', program];
  const code = spawnSync(process.execPath, args).status;
  expect(code).toBe(0);
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const api = JSON.parse(fs.readFileSync('api/package.json', 'utf8'));
  expect(pkg.scripts).toMatchObject({
    dev: 'npm run dev:foundation',
    'test:api': 'vitest run --project api',
    'typecheck:api': 'tsc -p api/tsconfig.json --noEmit --incremental false',
  });
  const inactive = Object.keys({ ...pkg.scripts, ...pkg.devDependencies });
  const forbidden =
    'dev:local db:generate db:migrate db:seed db:reset dotenv prisma';
  expect(inactive).not.toEqual(expect.arrayContaining(forbidden.split(' ')));
  expect(api.dependencies).toEqual({ fastify: '5.12.1' });
  for (const mode of ['preview', 'local'])
    expect(() => build({ mode, platform: 'win32' })).toThrow('Unknown mode');
  expect(() => build({ mode: 'foundation', platform: 'linux' })).toThrow(
    'Windows only',
  );
  const spawn = vi.fn();
  await terminate({ exitCode: 0, signalCode: null }, { spawn });
  const bad = { ...windows, env: { SystemRoot: 'C:\\tools' } };
  await expect(terminate(stub(123), bad, 5)).rejects.toThrow(
    'Untrusted taskkill',
  );
  const altered = plan();
  altered[0].args = ['compose', 'down'];
  await expect(run(altered, { spawn })).rejects.toThrow('Untrusted argv');
  expect(spawn).not.toHaveBeenCalled();
  expect(apiProxyTarget({ API_PORT: '4310' })).toBe('http://127.0.0.1:4310');
  expect(apiProxyTarget({})).toBe('http://127.0.0.1:3100');
  expect(() => apiProxyTarget({ API_PORT: '0' })).toThrow('API_PORT');
  expect(pw.webServer).toMatchObject({ command: 'npm run dev:web' });
  const repoLink = at('canonical repository link');
  link(repo, repoLink);
  for (const [override, message] of [
    ['docker.exe', 'invalid'],
    ['\\\\server\\share\\docker.exe', 'invalid'],
    [sentinel, 'untrusted'],
    [path.join(repoLink, 'docker.exe'), 'untrusted'],
    [at('missing/docker.exe'), 'missing'],
  ])
    expect(() => plan(override)).toThrow(message);
  const linkedNode = file('linked node runtime/node.exe');
  file('repository with spaces/npm/bin/npm-cli.js');
  link(repo, path.join(path.dirname(linkedNode), 'node_modules'));
  expect(() => plan(undefined, linkedNode)).toThrow('untrusted');
  expect(() =>
    build({ mode: 'infra', platform: 'win32', env: {}, repoRoot: repo }),
  ).toThrow('UNLOCKEDCRM_DOCKER_CLI');
  const processes = plan();
  expect(
    processes.map(({ executable: exe, args }) => [exe, args.join(' ')]),
  ).toEqual([
    [real(docker), UP],
    [real(node), `${real(npmCli)} run dev:api`],
    [real(node), `${real(npmCli)} run dev:web`],
  ]);
  expect(JSON.stringify(processes)).not.toContain(npmSentinel);
  const messages = 'child failed|stop timed out|postgres cleanup failed';
  const errors = messages.split('|').map((message) => new Error(message));
  const events: string[] = [];
  const launch = vi.fn(({ name }) => {
    events.push(`start:${name}`);
    if (name === 'web') throw errors[0];
    return {
      ready: Promise.resolve(),
      stop: async () => {
        events.push(`stop:${name}`);
        if (name === 'api') throw errors[1];
        if (name === 'postgres') throw errors[2];
      },
    };
  });
  const runner = { spawn: launch, timeoutMs: 50 } as never;
  const failure = await rejected(run(processes, runner));
  expect((failure as AggregateError).errors).toEqual(errors);
  const order = 'start:postgres,start:api,start:web,stop:api,stop:postgres';
  expect(events.join()).toBe(order);
  events.length = 0;
  const stalled = vi.fn(({ name }: { name: string }) => ({
    ready: name === 'api' ? new Promise<never>(() => {}) : Promise.resolve(),
    stop: async () => void events.push(`stop:${name}`),
  }));
  const waiting = run(plan(), { spawn: stalled as never, timeoutMs: 5 });
  await expect(waiting).rejects.toThrow('timed out');
  expect(events).toEqual(['stop:api', 'stop:postgres']);
  const aggregate = new AggregateError(errors.slice(0, 2));
  const log = vi.fn();
  reportError(aggregate, log);
  expect(log).toHaveBeenCalledWith(aggregate);
  for (const kind of ['timeout', 'failure', 'stop-timeout']) {
    const up = killable();
    const stop = killable();
    const spawn = vi.fn((_executable, args: string[]) => {
      const stopping = args.includes('stop');
      const child = stopping ? stop : up;
      const code = stopping ? 0 : 1;
      if (kind !== `${stopping ? 'stop-' : ''}timeout`)
        queueMicrotask(() => finish(child, code));
      return child;
    });
    const launch = (spec: Parameters<typeof start>[0]) =>
      start(spec, { spawn: spawn as never, env, timeoutMs: 5 });
    const bound = new Promise((done) => setTimeout(done, 30, Error('bound')));
    const result = await Promise.race([
      rejected(run([plan(docker)[0]], { spawn: launch, timeoutMs: 5 })),
      bound,
    ]);
    const calls = spawn.mock.calls as unknown as Call[];
    const commands = calls.map(([, args]) => args.join(' '));
    expect(commands).toEqual([UP, STOP]);
    for (const [exe, , options] of calls) {
      expect(exe).toBe(real(docker));
      expect(options).toMatchObject({ cwd: repo, shell: false });
    }
    const want = kind === 'failure' ? 'postgres exited 1' : 'timed out';
    const text = result instanceof AggregateError ? result.errors : result;
    expect(String(text)).toContain(want);
    if (kind === 'timeout') expect(up.kill).toHaveBeenCalledOnce();
    if (kind === 'stop-timeout') expect(stop.kill).toHaveBeenCalledOnce();
  }
});
