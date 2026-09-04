import { spawn as nodeSpawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const DOCKER_UP =
  'compose -p unlockedcrm-renewal -f compose.yaml up -d postgres'.split(' ');
const DOCKER_STOP =
  'compose -p unlockedcrm-renewal -f compose.yaml stop postgres'.split(' ');
const COMMANDS = new Set([
  'npm.cmd run db:generate',
  'npm.cmd run db:migrate',
  'npm.cmd run db:seed',
  'npm.cmd run dev:api',
  'npm.cmd run dev:web',
]);

export function validateExecutablePath(path) {
  if (
    path === 'docker.exe' ||
    /^[A-Za-z]:\\Windows\\System32\\(?:cmd|taskkill)\.exe$/i.test(path)
  )
    return;
  throw new Error(`Untrusted executable: ${path}`);
}

function cmdPath(env) {
  const expected = `${env.SystemRoot ?? 'C:\\Windows'}\\System32\\cmd.exe`;
  if (env.ComSpec && env.ComSpec.toLowerCase() !== expected.toLowerCase())
    throw new Error('Untrusted ComSpec');
  validateExecutablePath(expected);
  return expected;
}

function cmd(name, command, executable, wait = false, mode) {
  return {
    name,
    executable,
    args: ['/d', '/s', '/c', command],
    wait,
    env: mode ? { APP_MODE: mode } : undefined,
  };
}

export function buildProcessPlan({
  mode,
  platform = process.platform,
  env = process.env,
}) {
  if (!['infra', 'foundation', 'local'].includes(mode))
    throw new Error(`Unknown mode: ${mode}`);
  if (platform !== 'win32')
    throw new Error('This launcher currently supports Windows only');
  const executable = cmdPath(env);
  const plan = [
    { name: 'postgres', executable: 'docker.exe', args: DOCKER_UP, wait: true },
  ];
  if (mode === 'infra') return plan;
  if (mode === 'local')
    for (const name of ['db:generate', 'db:migrate', 'db:seed'])
      plan.push(cmd(name, `npm.cmd run ${name}`, executable, true));
  plan.push(cmd('api', 'npm.cmd run dev:api', executable, false, mode));
  plan.push(cmd('web', 'npm.cmd run dev:web', executable, false, mode));
  return plan;
}

function validateSpec(spec) {
  validateExecutablePath(spec.executable);
  if (spec.executable === 'docker.exe') {
    if (spec.args.join(' ') !== DOCKER_UP.join(' '))
      throw new Error('Untrusted argv');
  } else if (
    spec.args.slice(0, 3).join(' ') !== '/d /s /c' ||
    !COMMANDS.has(spec.args[3])
  )
    throw new Error('Untrusted argv');
}

function exit(child, name) {
  return new Promise((resolve, reject) => {
    child.once('error', reject);
    child.once('exit', (code) =>
      code === 0 ? resolve() : reject(new Error(`${name} exited ${code}`)),
    );
  });
}

const hasExited = (child) => child.exitCode !== null || child.signalCode;

export async function terminateProcessTree(
  child,
  { platform = process.platform, env = process.env, spawn = nodeSpawn } = {},
  timeoutMs = 5000,
) {
  if (hasExited(child)) return;
  if (platform !== 'win32') {
    if (!child.killed) child.kill();
    return;
  }
  if (!Number.isSafeInteger(child.pid) || child.pid <= 0)
    throw new Error('Invalid child PID');
  const executable = `${env.SystemRoot ?? 'C:\\Windows'}\\System32\\taskkill.exe`;
  validateExecutablePath(executable);
  const killer = spawn(executable, ['/pid', String(child.pid), '/t', '/f'], {
    shell: false,
    stdio: 'inherit',
  });
  try {
    await within(() => exit(killer, 'taskkill'), timeoutMs);
  } catch (error) {
    if (!hasExited(killer) && !killer.killed) killer.kill?.();
    if (!hasExited(child)) throw error;
  }
  if (!hasExited(child))
    await within(
      () => new Promise((resolve) => child.once('exit', resolve)),
      timeoutMs,
    );
}

async function spawnProcess(spec) {
  const child = nodeSpawn(spec.executable, spec.args, {
    cwd: process.cwd(),
    env: { ...process.env, ...spec.env },
    shell: false,
    stdio: 'inherit',
  });
  if (spec.wait) await exit(child, spec.name);
  else
    await new Promise((resolve, reject) => {
      child.once('error', reject);
      child.once('spawn', resolve);
    });
  return {
    done: spec.wait ? undefined : exit(child, spec.name),
    stop: async () => {
      if (!spec.wait) await terminateProcessTree(child);
      if (spec.name === 'postgres')
        await exit(
          nodeSpawn('docker.exe', DOCKER_STOP, {
            shell: false,
            stdio: 'inherit',
          }),
          'postgres cleanup',
        );
    },
  };
}

async function within(start, timeoutMs) {
  if (timeoutMs <= 0) throw new Error('Operation timed out');
  let timer;
  return Promise.race([
    start(),
    new Promise((_, reject) => {
      timer = setTimeout(
        () => reject(new Error('Operation timed out')),
        timeoutMs,
      );
    }),
  ]).finally(() => clearTimeout(timer));
}

export async function stopProcessHandles(handles, primaryError) {
  const errors = [];
  for (const handle of [...handles].reverse()) {
    try {
      await handle.stop();
    } catch (error) {
      errors.push(error);
    }
  }
  if (primaryError !== undefined) errors.unshift(primaryError);
  if (errors.length === 1) throw errors[0];
  if (errors.length > 1)
    throw new AggregateError(errors, 'Process cleanup failed');
}

export async function runProcessPlan(
  plan,
  { spawn = spawnProcess, timeoutMs = 120_000 } = {},
) {
  const handles = [];
  try {
    for (const spec of plan) {
      validateSpec(spec);
      handles.push(await within(() => spawn(spec), timeoutMs));
    }
    return handles;
  } catch (error) {
    await stopProcessHandles(handles, error);
  }
}

async function main() {
  const index = process.argv.indexOf('--mode');
  const mode = index >= 0 ? process.argv[index + 1] : undefined;
  const handles = await runProcessPlan(buildProcessPlan({ mode }));
  if (mode === 'infra') return;
  const signal = new Promise((resolve) => {
    process.once('SIGINT', resolve);
    process.once('SIGTERM', resolve);
  });
  let primaryError;
  try {
    await Promise.race([
      signal,
      ...handles.flatMap((handle) => (handle.done ? [handle.done] : [])),
    ]);
  } catch (error) {
    primaryError = error;
  }
  await stopProcessHandles(handles, primaryError);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
