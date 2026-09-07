import { spawn, spawnSync } from 'node:child_process';
import { EventEmitter, once } from 'node:events';
import * as fs from 'node:fs';
import { tmpdir } from 'node:os';
import * as path from 'node:path';
import { afterAll, expect, it, vi } from 'vitest';
import pw from '../playwright.config';
import { apiProxyTarget as proxy } from '../vite.config';
import {
  buildApiCheckPlan,
  DEVELOPMENT_DATABASE_URL,
  runApiCheck,
  TEST_DATABASE_URL,
} from './api-check.mjs';
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
const killable = (c = stub()) =>
  Object.assign(c, { kill: vi.fn(() => queueMicrotask(() => finish(c, 143))) });
const rejected = (promise: Promise<unknown>) => promise.catch((error) => error);
const read = (file: string) => fs.readFileSync(file, 'utf8');
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
const BAD = 'db:reset dotenv';
type Call = [string, string[], { cwd: string; shell: boolean }];
const plan = (override?: string, exe = node) =>
  build({
    mode: 'foundation',
    ...windows,
    cwd: repo,
    repoRoot: repo,
    nodeExecutable: exe,
    env: { ...env, UNLOCKEDCRM_DOCKER_CLI: override },
  });
const gone = (pid: number) => expect(() => process.kill(pid, 0)).toThrow();
const win = it.skipIf(process.platform !== 'win32');
afterAll(() => fs.rmSync(fixture, { recursive: true }));
win('kills a real tree and bounds Windows waits', async () => {
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
  try {
    const signal = AbortSignal.timeout(3000);
    const [data] = await once(child.stdout, 'data', { signal });
    const descendantPid = Number(data);
    await terminate(child);
    for (const pid of [descendantPid, child.pid])
      if (typeof pid === 'number' && pid > 0) gone(pid);
  } finally {
    spawnSync(taskkill, ['/pid', String(child.pid), '/t', '/f'], {
      timeout: 5000,
    });
  }
  for (const wait of ['taskkill', 'child']) {
    const [child, killer] = [stub(123), stub()];
    if (wait === 'child') queueMicrotask(() => finish(killer, 0));
    await expect(
      terminate(child, { ...windows, spawn: (() => killer) as never }, 5),
    ).rejects.toThrow('timed out');
  }
});
it('keeps Foundation boundaries closed', async () => {
  const program = `import { EventEmitter } from 'node:events';import { spawnProcess } from '${new URL('./orchestrate.mjs', import.meta.url).href}';const child=Object.assign(new EventEmitter(),{exitCode:null,signalCode:null,pid:1});const handle=spawnProcess({name:'api',executable:process.execPath,args:[],cwd:process.cwd()},{spawn:()=>child});child.emit('spawn');child.emit('exit',7);setImmediate(async()=>{try{await handle.done;process.exit(2)}catch(error){if(error.message!=='api exited 7')process.exit(3);Object.defineProperty(process,'platform',{value:'linux'});const stalled=Object.assign(new EventEmitter(),{exitCode:null,signalCode:null,pid:2,kill(){}});const keep=setInterval(()=>{},1e3);const stopping=spawnProcess({name:'api',executable:process.execPath,args:[],cwd:process.cwd()},{spawn:()=>stalled,timeoutMs:5});try{await stopping.stop();process.exit(4)}catch(error){clearInterval(keep);process.exit(error.message==='Operation timed out'?0:5)}}})`;
  const args = ['--input-type=module', '-e', program];
  expect(spawnSync(process.execPath, args, { timeout: 500 }).status).toBe(0);
  const pkg = JSON.parse(read('package.json'));
  const api = JSON.parse(read('api/package.json'));
  expect(pkg.scripts).toMatchObject({
    dev: 'npm run dev:local',
    'dev:foundation': 'node scripts/orchestrate.mjs --mode foundation',
    'dev:local': 'node scripts/orchestrate.mjs --mode local',
    'db:generate': 'node scripts/api-check.mjs --generate',
    'db:migrate': 'node scripts/api-check.mjs --migrate',
    'db:seed': 'node scripts/api-check.mjs --seed',
    'test:api': 'node scripts/api-check.mjs --test',
    'typecheck:api': 'node scripts/api-check.mjs --typecheck',
  });
  const inactive = { ...pkg.scripts, ...pkg.devDependencies };
  for (const entry of BAD.split(' '))
    expect(inactive).not.toHaveProperty(entry);
  expect(pkg.devDependencies.prisma).toBe('7.10.0');
  expect(api.dependencies).toEqual({
    '@prisma/adapter-pg': '7.10.0',
    '@prisma/client': '7.10.0',
    fastify: '5.12.1',
    pg: '8.23.0',
  });
  const doc = read('docs/04-infrastructure/deployment-backup-and-updates.md');
  const [foundation, unit2] = doc.split('root command. Unit 2');
  expect(foundation).not.toContain('seed exactly one fictional workspace');
  expect(unit2).toContain('seed of exactly one fictional workspace');
  expect(unit2).not.toContain('provider scenarios');
  expect(read('docs/04-infrastructure/current-infrastructure.md')).toContain(
    'Prisma generation/connectivity, migration, deterministic seed, and scoped repository are `LOCAL-VERIFIED`',
  );
  expect(read('docs/04-infrastructure/target-architecture.md')).toContain(
    '| Prisma plus reviewed custom SQL | `PARTIAL` |',
  );
  expect(read('docs/03-roadmap/phase-1-replica.md')).toContain(
    '| Data access | `PARTIAL` (`LOCAL-VERIFIED`): Prisma 7.10.0 generation',
  );
  expect(read('docs/02-traceability/gap-register.md')).toContain(
    'renewal migration, deterministic seed, constraints and scoped repository exist',
  );
  expect(read('docs/02-traceability/capability-matrix.md')).toContain(
    'Initial migration, deterministic renewal seed, immutable audit and repository tests are `LOCAL-VERIFIED`',
  );
  expect(read('docs/06-reference/source-register.md')).toContain(
    '`UNIT2B-2026-09-07`',
  );
  for (const mode of ['preview'])
    expect(() => build({ mode, platform: 'win32' })).toThrow('Unknown mode');
  expect(() => build({ mode: 'foundation', platform: 'linux' })).toThrow(
    'Windows only',
  );
  const spawn = vi.fn();
  await terminate({ exitCode: 0, signalCode: null }, { spawn });
  expect(proxy({ API_HOST: 'x', API_PORT: '4310' })).toBe('http://x:4310');
  expect(proxy({ API_HOST: '::1' })).toBe('http://[::1]:3100');
  expect(proxy({})).toBe('http://127.0.0.1:3100');
  expect(() => proxy({ API_PORT: '0' })).toThrow('API_PORT');
  expect(pw.webServer).toMatchObject({ command: 'npm run dev:web' });
  if (process.platform !== 'win32') return;
  const apiPlan = buildApiCheckPlan({ operation: 'test' });
  expect(apiPlan.steps.map(({ name }) => name)).toEqual([
    'test-postgres-up',
    'prisma-generate',
    'prisma-migrate',
    'api-tests',
  ]);
  expect(apiPlan.cleanup.name).toBe('test-postgres-down');
  expect(
    buildApiCheckPlan({
      operation: 'migrate',
      databaseUrl: TEST_DATABASE_URL,
    }).steps.map(({ name }) => name),
  ).toEqual(['prisma-generate', 'prisma-migrate']);
  expect(
    buildApiCheckPlan({
      operation: 'seed',
      databaseUrl: TEST_DATABASE_URL,
    }).steps.map(({ name }) => name),
  ).toEqual(['prisma-generate', 'prisma-seed']);
  for (const spec of [...apiPlan.steps, apiPlan.cleanup]) {
    expect(spec.executable.toLowerCase()).not.toMatch(/(?:cmd|npm)\.exe$/);
    expect(spec.options).toMatchObject({ cwd: process.cwd(), shell: false });
    expect(spec.timeoutMs).toBeGreaterThan(0);
    expect(spec.timeoutMs).toBeLessThanOrEqual(120_000);
  }
  expect(apiPlan.cleanup.args.join(' ')).toBe(
    'compose -f compose.test.yaml --project-name unlockedcrm-renewal-test down --remove-orphans',
  );
  expect(apiPlan.cleanup.args).not.toContain('--volumes');
  for (const databaseUrl of [
    'postgresql://unlockedcrm:synthetic-local-only@127.0.0.1:54329/unlockedcrm_dev?schema=public',
    'postgresql://unlockedcrm:synthetic-local-only@127.0.0.1:54330/unlockedcrm_dev?schema=public',
  ]) {
    const execute = vi.fn();
    await expect(
      runApiCheck({ operation: 'test', databaseUrl, execute }),
    ).rejects.toThrow('test database URL');
    expect(execute).not.toHaveBeenCalled();
  }
  for (const operation of ['migrate', 'seed']) {
    const execute = vi.fn();
    await expect(
      runApiCheck({ operation, databaseUrl: 'postgresql://unsafe', execute }),
    ).rejects.toThrow('approved synthetic local database URL');
    expect(execute).not.toHaveBeenCalled();
  }
  expect(TEST_DATABASE_URL).toContain('127.0.0.1:54330/unlockedcrm_test');
  const local = build({
    mode: 'local',
    ...windows,
    cwd: repo,
    repoRoot: repo,
    nodeExecutable: node,
    env: {
      ...env,
      DATABASE_URL: DEVELOPMENT_DATABASE_URL,
      UNLOCKEDCRM_DOCKER_CLI: docker,
    },
  });
  expect(local.map(({ name }) => name)).toEqual([
    'postgres',
    'database-generate',
    'database-migrate',
    'database-seed',
    'api',
    'web',
  ]);
  expect(local.map(({ args }) => args.join(' '))).toEqual([
    'compose -p unlockedcrm-renewal -f compose.yaml up -d --wait postgres',
    `${real(npmCli)} run db:generate`,
    `${real(npmCli)} run db:migrate`,
    `${real(npmCli)} run db:seed`,
    `${real(npmCli)} run dev:api`,
    `${real(npmCli)} run dev:web`,
  ]);
  expect(local[4].env).toMatchObject({
    APP_MODE: 'local',
    DATABASE_URL: DEVELOPMENT_DATABASE_URL,
  });
  const resolveDocker = vi.fn();
  expect(() =>
    build({
      mode: 'local',
      ...windows,
      env: { ...env, DATABASE_URL: 'postgresql://unsafe' },
      resolveDocker,
    }),
  ).toThrow('development database URL');
  expect(resolveDocker).not.toHaveBeenCalled();
  const testCompose = read('compose.test.yaml');
  expect(testCompose).toContain('name: unlockedcrm-renewal-test');
  expect(testCompose).not.toContain('54329');
  expect(testCompose).not.toContain('renewal-postgres');
  const developmentCompose = read('compose.yaml');
  expect(developmentCompose).toContain('127.0.0.1:54329:5432');
  expect(developmentCompose).toContain('renewal-postgres');
  const execute = vi.fn(async ({ name }: { name: string }) => {
    if (['api-tests', 'test-postgres-down'].includes(name))
      throw new Error(`${name} failed`);
  });
  const apiFailure = await rejected(
    runApiCheck({ operation: 'test', execute }),
  );
  expect(execute.mock.calls.map(([spec]) => spec.name)).toEqual([
    'test-postgres-up',
    'prisma-generate',
    'prisma-migrate',
    'api-tests',
    'test-postgres-down',
  ]);
  expect((apiFailure as AggregateError).errors.map(String)).toEqual([
    'Error: api-tests failed',
    'Error: test-postgres-down failed',
  ]);
  const bad = { ...windows, env: { SystemRoot: 'C:\\tools' } };
  await expect(terminate(stub(123), bad, 5)).rejects.toThrow(
    'Untrusted taskkill',
  );
  const altered = plan();
  altered[0].args = ['compose', 'down'];
  await expect(run(altered, { spawn })).rejects.toThrow('Untrusted argv');
  expect(spawn).not.toHaveBeenCalled();
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
  for (const { executable, args } of processes)
    expect([executable, ...args]).not.toContain(npmSentinel);
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
  const log = vi.fn();
  reportError(failure, log);
  expect(log).toHaveBeenCalledWith(failure);
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
