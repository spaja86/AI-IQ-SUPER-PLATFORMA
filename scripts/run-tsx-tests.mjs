import { existsSync, readdirSync } from 'node:fs';
import { dirname, isAbsolute, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const directory = process.argv[2];
const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, '..');

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
    if (entry.isFile() && /\.test\.(ts|mts|tsx)$/u.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files.sort();
}

const targetDirectory = isAbsolute(directory) ? directory : resolve(repoRoot, directory);
if (!existsSync(targetDirectory)) {
  console.error(`Required test directory does not exist: ${targetDirectory}`);
  process.exit(1);
}

const testFiles = collectTestFiles(targetDirectory);

if (testFiles.length === 0) {
  console.error(`No test files found in required directory: ${targetDirectory}`);
  process.exit(1);
}

console.log(`Discovered ${testFiles.length} test files in ${directory}`);

for (const file of testFiles) {
  console.log(`Running ${file}`);
  const command = spawnSync(process.execPath, ['--import', 'tsx', file], {
    stdio: 'inherit',
    cwd: repoRoot,
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

console.log(`Completed ${testFiles.length}/${testFiles.length} test files successfully.`);
