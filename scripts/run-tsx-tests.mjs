import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const directory = process.argv[2];

if (!directory) {
  console.error('Usage: node scripts/run-tsx-tests.mjs <tests-directory>');
  process.exit(1);
}

const testFiles = readdirSync(directory)
  .filter((name) => name.endsWith('.test.ts'))
  .sort();

for (const file of testFiles) {
  const command = spawnSync(process.execPath, ['./node_modules/tsx/dist/cli.mjs', join(directory, file)], {
    stdio: 'inherit',
  });

  if (command.status !== 0) {
    process.exit(command.status ?? 1);
  }
}
