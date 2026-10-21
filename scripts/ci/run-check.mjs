import { createHash } from 'node:crypto';
import { closeSync, mkdirSync, openSync, readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

// No shell, token, deployment, or GitHub status API. GitHub owns job conclusions.
const [name, command, ...args] = process.argv.slice(2);
if (!/^[a-z][a-z0-9-]*$/.test(name ?? '') || !command) {
  console.error('Usage: node scripts/ci/run-check.mjs <check-name> <command> [args...]');
  process.exit(1);
}
const directory = '.ci-evidence';
mkdirSync(directory, { recursive: true });
const logPath = join(directory, `${name}.log`);
const stdoutPath = join(directory, `${name}.stdout.log`);
const stderrPath = join(directory, `${name}.stderr.log`);
const stdoutFd = openSync(stdoutPath, 'w', 0o600);
const stderrFd = openSync(stderrPath, 'w', 0o600);
const startedAt = new Date().toISOString();
let result;
try {
  result = spawnSync(command, args, { stdio: ['ignore', stdoutFd, stderrFd], shell: false });
} finally {
  closeSync(stdoutFd);
  closeSync(stderrFd);
}
const stdout = readFileSync(stdoutPath);
const stderr = readFileSync(stderrPath);
const log = Buffer.concat([stdout, stderr]);
writeFileSync(logPath, log, { mode: 0o600 });
process.stdout.write(stdout);
process.stderr.write(stderr);
const exitCode = result.status ?? 1;
if (result.error) console.error(result.error.message);
writeFileSync(join(directory, `${name}.json`), JSON.stringify({
  name, command: [command, ...args], startedAt, finishedAt: new Date().toISOString(),
  exitCode, signal: result.signal, error: result.error?.message ?? null,
  node: process.version, testedSha: process.env.GITHUB_SHA ?? null,
  headSha: process.env.PR_HEAD_SHA ?? null, baseSha: process.env.PR_BASE_SHA ?? null,
  runId: process.env.GITHUB_RUN_ID ?? null, runAttempt: process.env.GITHUB_RUN_ATTEMPT ?? null,
  logSha256: createHash('sha256').update(log).digest('hex'),
  stdoutSha256: createHash('sha256').update(stdout).digest('hex'),
  stderrSha256: createHash('sha256').update(stderr).digest('hex'),
}, null, 2) + '\n');
process.exit(exitCode);
