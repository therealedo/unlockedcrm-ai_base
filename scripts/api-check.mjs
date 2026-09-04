import { spawnSync } from 'node:child_process';

const mode = process.argv[2];
const commands = {
  test: [
    ['npm', ['run', 'db:generate']],
    ['npx', ['vitest', 'run', '--project', 'api']],
  ],
  typecheck: [
    ['npm', ['run', 'db:generate']],
    [
      'npx',
      ['tsc', '-p', 'api/tsconfig.json', '--noEmit', '--incremental', 'false'],
    ],
  ],
};
if (!commands[mode]) throw new Error(`Unknown API check: ${mode}`);
for (const [command, args] of commands[mode]) {
  const executable = process.platform === 'win32' ? `${command}.cmd` : command;
  const result = spawnSync(executable, args, {
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: false,
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
