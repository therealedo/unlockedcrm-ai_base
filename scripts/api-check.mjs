import { spawn as nodeSpawn } from 'node:child_process';
import { once } from 'node:events';
import { realpathSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  resolveDockerExecutable,
  terminateProcessTree,
} from './orchestrate.mjs';

const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
export const TEST_DATABASE_URL =
  'postgresql://unlockedcrm:synthetic-local-only@127.0.0.1:54330/unlockedcrm_test?schema=public';
const DEVELOPMENT_DATABASE_URL =
  'postgresql://unlockedcrm:synthetic-local-only@127.0.0.1:54329/unlockedcrm_dev?schema=public';
const COMPOSE = [
  'compose',
  '-f',
  'compose.test.yaml',
  '--project-name',
  'unlockedcrm-renewal-test',
];

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

export function buildApiCheckPlan({
  operation = '',
  databaseUrl = operation === 'test'
    ? TEST_DATABASE_URL
    : (process.env.DATABASE_URL ?? DEVELOPMENT_DATABASE_URL),
  resolveDocker = resolveDockerExecutable,
} = {}) {
  if (!['generate', 'test', 'typecheck'].includes(operation))
    throw new Error('Unknown API check operation');
  if (operation === 'test') requireTestDatabaseUrl(databaseUrl);
  const executable = nodeExecutable();
  const options = {
    cwd: ROOT,
    env: { ...process.env, DATABASE_URL: databaseUrl },
    shell: false,
    stdio: 'inherit',
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
  const cleanup = {
    name: 'test-postgres-down',
    executable: operation === 'test' ? resolveDocker() : '',
    args: [...COMPOSE, 'down', '--remove-orphans'],
    options,
    timeoutMs: 60_000,
  };
  if (operation === 'generate') return { steps: [generate], cleanup };
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
      check,
    ],
    cleanup,
  };
}

export async function executeProcess(
  spec,
  { spawn = nodeSpawn, terminate = terminateProcessTree } = {},
) {
  const child = spawn(spec.executable, spec.args, spec.options);
  let timer;
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
    ]);
    if (code !== 0) throw new Error(`${spec.name} exited ${code}`);
  } catch (error) {
    if (child.exitCode === null && child.signalCode === null)
      await terminate(child, undefined, 5_000).catch(() => {});
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

export async function runApiCheck({
  operation = '',
  databaseUrl = operation === 'test'
    ? TEST_DATABASE_URL
    : (process.env.DATABASE_URL ?? DEVELOPMENT_DATABASE_URL),
  execute = executeProcess,
} = {}) {
  if (operation === 'test') requireTestDatabaseUrl(databaseUrl);
  const plan = buildApiCheckPlan({ operation, databaseUrl });
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

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const operation = process.argv[2]?.replace(/^--/, '');
  runApiCheck({ operation }).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
