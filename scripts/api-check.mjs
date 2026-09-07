import { spawn as nodeSpawn } from 'node:child_process';
import { once } from 'node:events';
import { realpathSync, statSync } from 'node:fs';
import { createServer } from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  resolveDockerExecutable,
  terminateProcessTree,
} from './orchestrate.mjs';

const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
export const TEST_DATABASE_URL =
  'postgresql://unlockedcrm:synthetic-local-only@127.0.0.1:54330/unlockedcrm_test?schema=public';
export const DEVELOPMENT_DATABASE_URL =
  'postgresql://unlockedcrm:synthetic-local-only@127.0.0.1:54329/unlockedcrm_dev?schema=public';
const COMPOSE = [
  'compose',
  '-f',
  'compose.test.yaml',
  '--project-name',
  'unlockedcrm-renewal-test',
];
export const PLAYWRIGHT_API_PORT = 4310;
export const PLAYWRIGHT_WEB_PORT = 4173;
const API_READY_URL = `http://127.0.0.1:${PLAYWRIGHT_API_PORT}/health/ready`;
const WEB_READY_URL = `http://127.0.0.1:${PLAYWRIGHT_WEB_PORT}`;

function repositoryFile(relative, basename) {
  const candidate = realpathSync.native(path.join(ROOT, relative));
  const root = `${realpathSync.native(ROOT)}${path.sep}`;
  if (
    !candidate.startsWith(root) ||
    path.basename(candidate).toLowerCase() !== basename ||
    !statSync(candidate).isFile()
  )
    throw new Error(`Untrusted ${basename}`);
  return candidate;
}

function nodeExecutable() {
  const candidate = realpathSync.native(process.execPath);
  if (path.basename(candidate).toLowerCase() !== 'node.exe')
    throw new Error('Untrusted Node executable');
  return candidate;
}

export function requireTestDatabaseUrl(value) {
  if (value !== TEST_DATABASE_URL)
    throw new Error('DATABASE_URL must be the isolated test database URL');
  return value;
}

export function requireLocalDatabaseUrl(value) {
  if (![TEST_DATABASE_URL, DEVELOPMENT_DATABASE_URL].includes(value))
    throw new Error(
      'DATABASE_URL must be an approved synthetic local database URL',
    );
  return value;
}

export function parsePlaywrightArgs(args = []) {
  const accepted = [];
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (
      ['--headed', '--list'].includes(argument) ||
      argument.startsWith('--grep=')
    ) {
      if (argument === '--grep=')
        throw new Error('Playwright argument --grep needs a value');
      accepted.push(argument);
    } else if (
      argument === '--grep' &&
      args[index + 1] &&
      !args[index + 1].startsWith('--')
    ) {
      accepted.push(argument, args[(index += 1)]);
    } else throw new Error(`Unsupported Playwright argument: ${argument}`);
  }
  return accepted;
}

export function buildApiCheckPlan({
  operation = '',
  playwrightArgs = [],
  environment = process.env,
  databaseUrl = ['test', 'e2e'].includes(operation)
    ? TEST_DATABASE_URL
    : (process.env.DATABASE_URL ?? DEVELOPMENT_DATABASE_URL),
  resolveDocker = resolveDockerExecutable,
} = {}) {
  if (
    !['generate', 'migrate', 'seed', 'test', 'typecheck', 'e2e'].includes(
      operation,
    )
  )
    throw new Error('Unknown API check operation');
  if (['test', 'e2e'].includes(operation)) requireTestDatabaseUrl(databaseUrl);
  if (['migrate', 'seed'].includes(operation))
    requireLocalDatabaseUrl(databaseUrl);
  const executable = nodeExecutable();
  const env = {
    ...environment,
    DATABASE_URL: databaseUrl,
    ...(operation === 'e2e'
      ? {
          APP_MODE: 'foundation',
          API_HOST: '127.0.0.1',
          API_PORT: String(PLAYWRIGHT_API_PORT),
        }
      : {}),
  };
  const options = {
    cwd: ROOT,
    env,
    shell: false,
    stdio: 'inherit',
    windowsHide: true,
  };
  const node = (name, relative, args) => ({
    name,
    executable,
    args: [
      repositoryFile(relative, path.basename(relative).toLowerCase()),
      ...args,
    ],
    options,
    timeoutMs: 120_000,
  });
  const generate = node(
    'prisma-generate',
    'node_modules/prisma/build/index.js',
    ['generate'],
  );
  const migrate = node('prisma-migrate', 'node_modules/prisma/build/index.js', [
    'migrate',
    'deploy',
  ]);
  const seed = node('prisma-seed', 'node_modules/tsx/dist/cli.mjs', [
    'api/prisma/seed.ts',
  ]);
  const cleanup = {
    name: 'test-postgres-down',
    executable: ['test', 'e2e'].includes(operation) ? resolveDocker() : '',
    args: [...COMPOSE, 'down', '--remove-orphans'],
    options,
    timeoutMs: 60_000,
  };
  if (operation === 'generate') return { steps: [generate], cleanup };
  if (operation === 'migrate') return { steps: [generate, migrate], cleanup };
  if (operation === 'seed') return { steps: [generate, seed], cleanup };
  const check =
    operation === 'test'
      ? node('api-tests', 'node_modules/vitest/vitest.mjs', [
          'run',
          '--project',
          'api',
        ])
      : node('api-typecheck', 'node_modules/typescript/bin/tsc', [
          '-p',
          'api/tsconfig.json',
          '--noEmit',
          '--incremental',
          'false',
        ]);
  if (operation === 'typecheck') return { steps: [generate, check], cleanup };
  if (operation === 'e2e') {
    const browserArgs = parsePlaywrightArgs(playwrightArgs);
    const server = (name, args) => ({
      name,
      executable,
      args,
      options,
      timeoutMs: 120_000,
    });
    return {
      steps: [
        {
          name: 'test-postgres-up',
          executable: resolveDocker(),
          args: [...COMPOSE, 'up', '-d', '--wait', 'postgres'],
          options,
          timeoutMs: 120_000,
        },
        generate,
        migrate,
        seed,
      ],
      servers: [
        server('playwright-api', [
          repositoryFile('node_modules/tsx/dist/cli.mjs', 'cli.mjs'),
          repositoryFile(
            'api/test/playwright-server.ts',
            'playwright-server.ts',
          ),
        ]),
        server('playwright-web', [
          repositoryFile('scripts/playwright-web.mjs', 'playwright-web.mjs'),
        ]),
      ],
      readiness: [API_READY_URL, WEB_READY_URL],
      ports: [
        { host: '127.0.0.1', port: PLAYWRIGHT_API_PORT },
        { host: '127.0.0.1', port: PLAYWRIGHT_WEB_PORT },
      ],
      browser: server('playwright-tests', [
        repositoryFile('node_modules/@playwright/test/cli.js', 'cli.js'),
        'test',
        ...browserArgs,
      ]),
      cleanup,
    };
  }
  return {
    steps: [
      {
        name: 'test-postgres-up',
        executable: resolveDocker(),
        args: [...COMPOSE, 'up', '-d', '--wait', 'postgres'],
        options,
        timeoutMs: 120_000,
      },
      generate,
      migrate,
      check,
    ],
    cleanup,
  };
}

const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const cancellationError = () => new Error('API check cancelled');

async function cancellable(value, signal) {
  if (!signal) return value;
  if (signal.aborted) throw cancellationError();
  let onAbort;
  try {
    return await Promise.race([
      value,
      new Promise((_, reject) => {
        onAbort = () => reject(cancellationError());
        signal.addEventListener('abort', onAbort, { once: true });
      }),
    ]);
  } finally {
    signal.removeEventListener('abort', onAbort);
  }
}

export async function assertPortsAvailable(ports, { signal } = {}) {
  for (const { host, port } of ports)
    await cancellable(
      new Promise((resolve, reject) => {
        const probe = createServer();
        probe.once('error', (error) =>
          reject(
            new Error(`E2E test port ${port} is already in use`, {
              cause: error,
            }),
          ),
        );
        probe.listen(port, host, () =>
          probe.close((error) => (error ? reject(error) : resolve())),
        );
      }),
      signal,
    );
}

export async function waitForHttp(
  url,
  {
    fetcher = fetch,
    timeoutMs = 120_000,
    intervalMs = 250,
    serverDone,
    signal,
  } = {},
) {
  const deadline = Date.now() + timeoutMs;
  const ownerExited = serverDone?.then(
    () => {
      throw new Error(`${url} server exited before readiness`);
    },
    (error) => {
      throw new Error(`${url} server exited before readiness: ${error}`, {
        cause: error,
      });
    },
  );
  while (Date.now() < deadline) {
    const controller = new AbortController();
    const timeout = new Error(`${url} readiness timed out`);
    let timer;
    try {
      const response = await cancellable(
        Promise.race([
          fetcher(url, { signal: controller.signal }),
          ...(ownerExited ? [ownerExited] : []),
          new Promise((_, reject) => {
            timer = setTimeout(
              () => {
                controller.abort(timeout);
                reject(timeout);
              },
              Math.max(1, deadline - Date.now()),
            );
          }),
        ]),
        signal,
      );
      if (response.ok) {
        await Promise.race([delay(0), ...(ownerExited ? [ownerExited] : [])]);
        return;
      }
    } catch (error) {
      if (signal?.aborted || error === timeout) throw error;
      if (String(error).includes('server exited')) throw error;
    } finally {
      clearTimeout(timer);
      controller.abort();
    }
    await cancellable(
      Promise.race([delay(intervalMs), ...(ownerExited ? [ownerExited] : [])]),
      signal,
    );
  }
  throw new Error(`${url} readiness timed out`);
}

export function startE2eServer(
  spec,
  { spawn = nodeSpawn, terminate = terminateProcessTree } = {},
) {
  const child = spawn(spec.executable, spec.args, spec.options);
  const done = once(child, 'exit').then(([code]) => {
    if (code !== 0) throw new Error(`${spec.name} exited ${code}`);
  });
  done.catch(() => {});
  return {
    ready: once(child, 'spawn'),
    done,
    stop: () => terminate(child, undefined, 5_000),
  };
}

async function stopServers(handles) {
  const errors = [];
  for (const handle of [...handles].reverse())
    await handle.stop().catch((error) => errors.push(error));
  if (errors.length === 1) throw errors[0];
  if (errors.length > 1)
    throw new AggregateError(errors, 'Server cleanup failed');
}

async function runE2eCheck(
  plan,
  { execute, start, waitForReady, checkPorts, signal },
) {
  const handles = [];
  let primaryError;
  let effectsStarted = false;
  try {
    await cancellable(checkPorts(plan.ports, { signal }), signal);
    effectsStarted = true;
    for (const step of plan.steps) await execute(step, { signal });
    for (const server of plan.servers) {
      const handle = start(server);
      handles.push(handle);
      await cancellable(handle.ready, signal);
    }
    await Promise.all(
      plan.readiness.map((url, index) =>
        waitForReady(url, { serverDone: handles[index].done, signal }),
      ),
    );
    await execute(plan.browser, { signal });
  } catch (error) {
    primaryError = error;
  }
  const cleanupErrors = [];
  await stopServers(handles).catch((error) => cleanupErrors.push(error));
  if (effectsStarted)
    await execute(plan.cleanup).catch((error) => cleanupErrors.push(error));
  if (primaryError && cleanupErrors.length)
    throw new AggregateError(
      [primaryError, ...cleanupErrors],
      'E2E check cleanup failed',
    );
  if (primaryError) throw primaryError;
  if (cleanupErrors.length === 1) throw cleanupErrors[0];
  if (cleanupErrors.length)
    throw new AggregateError(cleanupErrors, 'E2E check cleanup failed');
}

export async function executeProcess(
  spec,
  { spawn = nodeSpawn, terminate = terminateProcessTree, signal } = {},
) {
  const child = spawn(spec.executable, spec.args, spec.options);
  let timer;
  let onAbort;
  try {
    const [code] = await Promise.race([
      once(child, 'exit'),
      new Promise((_, reject) => {
        timer = setTimeout(
          reject,
          spec.timeoutMs,
          new Error(`${spec.name} timed out`),
        );
      }),
      ...(signal
        ? [
            new Promise((_, reject) => {
              onAbort = () => reject(cancellationError());
              if (signal.aborted) onAbort();
              else signal.addEventListener('abort', onAbort, { once: true });
            }),
          ]
        : []),
    ]);
    if (code !== 0) throw new Error(`${spec.name} exited ${code}`);
  } catch (error) {
    if (child.exitCode === null && child.signalCode === null)
      await terminate(child, undefined, 5_000).catch(() => {});
    throw error;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', onAbort);
  }
}

export async function runApiCheck({
  operation = '',
  playwrightArgs = [],
  environment = process.env,
  databaseUrl = ['test', 'e2e'].includes(operation)
    ? TEST_DATABASE_URL
    : (process.env.DATABASE_URL ?? DEVELOPMENT_DATABASE_URL),
  execute = executeProcess,
  start = startE2eServer,
  waitForReady = waitForHttp,
  checkPorts = assertPortsAvailable,
  signal,
} = {}) {
  if (['test', 'e2e'].includes(operation)) requireTestDatabaseUrl(databaseUrl);
  const plan = buildApiCheckPlan({
    operation,
    databaseUrl,
    playwrightArgs,
    environment,
  });
  if (operation === 'e2e')
    return runE2eCheck(plan, {
      execute,
      start,
      waitForReady,
      checkPorts,
      signal,
    });
  let primaryError;
  try {
    for (const step of plan.steps) await execute(step);
  } catch (error) {
    primaryError = error;
  }
  if (operation === 'test') {
    try {
      await execute(plan.cleanup);
    } catch (error) {
      if (primaryError)
        throw new AggregateError(
          [primaryError, error],
          'API check cleanup failed',
        );
      throw error;
    }
  }
  if (primaryError) throw primaryError;
}

export async function runApiCheckCli(
  argv = process.argv,
  { processLike = process, run = runApiCheck } = {},
) {
  const operation = argv[2]?.replace(/^--/, '');
  const tail = argv.slice(3);
  const playwrightArgs = operation === 'e2e' ? parsePlaywrightArgs(tail) : [];
  if (operation !== 'e2e' && tail.length)
    throw new Error(`Unsupported Playwright argument: ${tail[0]}`);
  if (operation !== 'e2e') return run({ operation, playwrightArgs });
  const controller = new AbortController();
  const cancel = () => controller.abort();
  processLike.on('SIGINT', cancel);
  processLike.on('SIGTERM', cancel);
  try {
    await run({ operation, playwrightArgs, signal: controller.signal });
  } finally {
    processLike.removeListener('SIGINT', cancel);
    processLike.removeListener('SIGTERM', cancel);
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  runApiCheckCli().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
