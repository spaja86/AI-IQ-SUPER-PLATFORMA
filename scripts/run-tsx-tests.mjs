import { existsSync, readdirSync } from 'node:fs';
import { dirname, isAbsolute, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const directory = process.argv[2];
const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, '..');
const require = createRequire(import.meta.url);

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
const testFiles = collectTestFiles(targetDirectory);
const tsxPackagePath = require.resolve('tsx/package.json', { paths: [repoRoot] });
const tsxPackage = require(tsxPackagePath);
const tsxBinEntry = typeof tsxPackage.bin === 'string' ? tsxPackage.bin : tsxPackage.bin?.tsx;

if (!tsxBinEntry) {
  console.error('Unable to resolve tsx CLI entrypoint from package metadata.');
  process.exit(1);
}

const tsxCliPath = resolve(dirname(tsxPackagePath), tsxBinEntry);

if (testFiles.length === 0) {
  console.error(`No test files found in: ${targetDirectory}`);
  process.exit(1);
}

for (const file of testFiles) {
  const command = spawnSync(process.execPath, [tsxCliPath, file], {
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
