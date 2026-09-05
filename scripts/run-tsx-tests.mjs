import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const directory = process.argv[2];

if (!directory) {
  console.error('Usage: node scripts/run-tsx-tests.mjs <tests-directory>');
  process.exit(1);
}

function collectTestFiles(baseDir) {
  if (!existsSync(baseDir)) {
    return [];
  }

  const entries = readdirSync(baseDir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = join(baseDir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectTestFiles(fullPath));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.test.ts')) {
      files.push(fullPath);
    }
  }

  return files.sort();
}

const testFiles = collectTestFiles(directory);
const npxCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx';

if (testFiles.length === 0) {
  console.error(`No test files found in: ${directory}`);
  process.exit(1);
}

for (const file of testFiles) {
  const command = spawnSync(npxCommand, ['tsx', file], {
    stdio: 'inherit',
  });

  if (command.error) {
    console.error(`Failed to execute test file: ${file}`);
    console.error(command.error);
    process.exit(1);
  }

  if (command.status !== 0) {
    process.exit(command.status ?? 1);
  }
}
