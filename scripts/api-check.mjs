import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';

const mode = process.argv[2];
if (!['test', 'typecheck'].includes(mode))
  throw new Error(`Unknown API check: ${mode}`);
const require = createRequire(resolve('package.json'));
function run(packageName, entry, ...args) {
  const packagePath = require.resolve(`${packageName}/package.json`);
  const result = spawnSync(
    process.execPath,
    [resolve(dirname(packagePath), entry), ...args],
    {
      cwd: process.cwd(),
      stdio: 'inherit',
      shell: false,
    },
  );
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
run('prisma', 'build/index.js', 'generate', '--config', 'prisma.config.ts');
if (mode === 'test') run('vitest', 'vitest.mjs', 'run', '--project', 'api');
else
  run(
    'typescript',
    'bin/tsc',
    '-p',
    'api/tsconfig.json',
    '--noEmit',
    '--incremental',
    'false',
  );
