import { spawn as nodeSpawn } from 'node:child_process';
import { once } from 'node:events';
import { realpathSync, statSync } from 'node:fs';
import { win32 } from 'node:path';
import { fileURLToPath } from 'node:url';
const COMPOSE = 'compose -p unlockedcrm-renewal -f compose.yaml';
const DOCKER_UP = `${COMPOSE} up -d postgres`.split(' ');
const DOCKER_STOP = `${COMPOSE} stop postgres`.split(' ');
const USER_DOCKER = 'Programs/DockerDesktop/resources/bin/docker.exe';
const SYSTEM_DOCKER = 'Docker/Docker/resources/bin/docker.exe';
const INHERIT = { shell: false, stdio: 'inherit' };
const ROOT = fileURLToPath(new URL('..', import.meta.url));
function isInside(root, candidate) {
  const path = win32.relative(root, candidate);
  return !win32.isAbsolute(path) && !/^\.\.(?:\\|$)/.test(path);
}
function inspectFile(path, repoRoot, basename) {
  const name = win32.basename(path).toLowerCase();
  if (!/^[A-Za-z]:[\\/]/.test(path) || name !== basename)
    return { reason: 'invalid' };
  if (isInside(win32.resolve(repoRoot), win32.resolve(path)))
    return { reason: 'untrusted' };
  try {
    const canonicalRoot = realpathSync.native(repoRoot);
    const canonical = realpathSync.native(path);
    if (!statSync(canonical).isFile()) return { reason: 'missing' };
    if (isInside(canonicalRoot, canonical)) return { reason: 'untrusted' };
    return { canonical };
  } catch {
    return { reason: 'missing' };
  }
}
function runtimeFile(path, repoRoot, basename) {
  const result = inspectFile(path, repoRoot, basename);
  if (!result.canonical) throw new Error(`${basename} ${result.reason}`);
  return result.canonical;
}
export function resolveDockerExecutable({
  env = process.env,
  repoRoot = ROOT,
} = {}) {
  const explicit = env.UNLOCKEDCRM_DOCKER_CLI;
  if (explicit !== undefined) {
    const result = inspectFile(explicit, repoRoot, 'docker.exe');
    if (!result.canonical)
      throw new Error(`Invalid UNLOCKEDCRM_DOCKER_CLI: ${result.reason}`);
    return result.canonical;
  }
  for (const candidate of [
    win32.join(env.LOCALAPPDATA ?? '', USER_DOCKER),
    win32.join(env.ProgramFiles ?? '', SYSTEM_DOCKER),
  ]) {
    const { canonical } = inspectFile(candidate, repoRoot, 'docker.exe');
    if (canonical) return canonical;
  }
  throw new Error('Docker CLI not found; set UNLOCKEDCRM_DOCKER_CLI');
}
function resolveNpmLaunch(nodeExecutable, repoRoot) {
  const executable = runtimeFile(nodeExecutable, repoRoot, 'node.exe');
  const nodeRoot = win32.dirname(executable);
  const npmPath = win32.join(nodeRoot, 'node_modules/npm/bin/npm-cli.js');
  const npmCli = runtimeFile(npmPath, repoRoot, 'npm-cli.js');
  if (!isInside(nodeRoot, npmCli)) throw new Error('npm CLI escaped Node');
  return { executable, npmCli };
}
const appSpec = (name, npm, cwd) => ({
  name,
  executable: npm.executable,
  args: [npm.npmCli, 'run', `dev:${name}`],
  cwd,
});
export function buildProcessPlan({
  mode,
  platform = process.platform,
  env = process.env,
  cwd = process.cwd(),
  repoRoot = ROOT,
  nodeExecutable = process.execPath,
}) {
  if (!['infra', 'foundation'].includes(mode)) throw new Error('Unknown mode');
  if (platform !== 'win32') throw new Error('Windows only');
  const postgres = {
    name: 'postgres',
    executable: resolveDockerExecutable({ env, repoRoot }),
    args: DOCKER_UP,
    cwd,
  };
  if (mode === 'infra') return [postgres];
  const npm = resolveNpmLaunch(nodeExecutable, repoRoot);
  return [postgres, ...['api', 'web'].map((name) => appSpec(name, npm, cwd))];
}
function validateSpec(spec) {
  const docker = spec.name === 'postgres';
  if (!docker && !['api', 'web'].includes(spec.name))
    throw new Error('Untrusted argv');
  const basename = `${docker ? 'docker' : 'node'}.exe`;
  const executable = runtimeFile(spec.executable, ROOT, basename);
  const args = docker
    ? DOCKER_UP
    : [resolveNpmLaunch(executable, ROOT).npmCli, 'run', `dev:${spec.name}`];
  const received = [spec.executable, ...spec.args].join('\0');
  const expected = [executable, ...args].join('\0');
  if (received !== expected) throw new Error('Untrusted argv');
}
async function exit(child, name) {
  const [code] = await once(child, 'exit');
  if (code !== 0) throw new Error(`${name} exited ${code}`);
}
const hasExited = (child) => child.exitCode !== null || child.signalCode;
async function cancel(child, timeoutMs) {
  if (!hasExited(child) && !child.killed) child.kill();
  if (!hasExited(child)) await within(once(child, 'exit'), timeoutMs);
}
export async function terminateProcessTree(
  child,
  { platform = process.platform, env = process.env, spawn = nodeSpawn } = {},
  timeoutMs = 5000,
) {
  if (hasExited(child)) return;
  if (platform !== 'win32') return cancel(child, timeoutMs);
  if (!Number.isSafeInteger(child.pid) || child.pid <= 0)
    throw new Error('Invalid child PID');
  const candidate = `${env.SystemRoot ?? 'C:\\Windows'}\\System32\\taskkill.exe`;
  if (!/^[A-Za-z]:\\Windows\\System32\\taskkill\.exe$/i.test(candidate))
    throw new Error('Untrusted taskkill');
  const taskkill = runtimeFile(candidate, ROOT, 'taskkill.exe');
  const killer = spawn(taskkill, ['/pid', `${child.pid}`, '/t', '/f'], INHERIT);
  try {
    await within(exit(killer, 'taskkill'), timeoutMs);
  } catch (error) {
    if (!hasExited(killer) && !killer.killed) killer.kill?.();
    if (!hasExited(child)) throw error;
  }
  if (!hasExited(child)) await within(once(child, 'exit'), timeoutMs);
}
function stopCompose(up, spec, spawn, options, ms) {
  const stop = () => {
    const cleanup = spawn(spec.executable, DOCKER_STOP, options);
    return within(exit(cleanup, 'postgres cleanup'), ms).catch((error) =>
      stopProcessHandles([{ stop: () => cancel(cleanup, ms) }], error),
    );
  };
  return stopProcessHandles([{ stop }, { stop: () => cancel(up, ms) }]);
}
export function spawnProcess(
  spec,
  { spawn = nodeSpawn, env = process.env, timeoutMs = 5000 } = {},
) {
  const options = { cwd: spec.cwd, env, ...INHERIT };
  const child = spawn(spec.executable, spec.args, options);
  const postgres = spec.name === 'postgres';
  const done = postgres ? undefined : exit(child, spec.name);
  done?.catch(() => {});
  return {
    ready: postgres ? exit(child, spec.name) : once(child, 'spawn'),
    done,
    stop: postgres
      ? () => stopCompose(child, spec, spawn, options, timeoutMs)
      : () => terminateProcessTree(child, undefined, timeoutMs),
  };
}
function within(operation, timeoutMs) {
  if (timeoutMs <= 0) return Promise.reject(new Error('Operation timed out'));
  return Promise.race([
    operation,
    new Promise((_, reject) =>
      setTimeout(reject, timeoutMs, new Error('Operation timed out')).unref(),
    ),
  ]);
}
export async function stopProcessHandles(handles, primaryError) {
  const errors = [];
  for (const { stop } of [...handles].reverse())
    await stop().catch((error) => errors.push(error));
  if (primaryError !== undefined) errors.unshift(primaryError);
  if (errors.length === 1) throw errors[0];
  if (errors.length > 1) throw new AggregateError(errors, 'Cleanup failed');
}
export async function runProcessPlan(
  plan,
  { spawn = spawnProcess, timeoutMs = 120_000 } = {},
) {
  const handles = [];
  try {
    for (const spec of plan) {
      validateSpec(spec);
      handles.push(spawn(spec, { timeoutMs }));
      await within(handles.at(-1).ready, timeoutMs);
    }
    return handles;
  } catch (error) {
    await stopProcessHandles(handles, error);
  }
}
export const reportError = (error, log = console.error) => log(error);
async function main() {
  const mode = process.argv.find((_, i, args) => args[i - 1] === '--mode');
  const handles = await runProcessPlan(buildProcessPlan({ mode }));
  if (mode === 'infra') return;
  const primaryError = await Promise.race([
    ...['SIGINT', 'SIGTERM'].map((event) => once(process, event)),
    ...handles.flatMap(({ done }) => (done ? [done] : [])),
  ]).then(
    () => undefined,
    (error) => error,
  );
  await stopProcessHandles(handles, primaryError);
}
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((error) => {
    reportError(error);
    process.exitCode = 1;
  });
}
