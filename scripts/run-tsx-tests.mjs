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
const npxCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx';

for (const file of testFiles) {
  const command = spawnSync(npxCommand, ['tsx', join(directory, file)], {
    stdio: 'inherit',
  });

  if (command.status !== 0) {
    process.exit(command.status ?? 1);
  }
}
