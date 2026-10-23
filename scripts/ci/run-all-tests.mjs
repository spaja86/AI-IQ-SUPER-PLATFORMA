import { createHash } from 'node:crypto';
import { spawn, spawnSync } from 'node:child_process';
import { closeSync, mkdirSync, openSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const suites = ['node', 'browser', 'python', 'java'];
const hash = value => createHash('sha256').update(value).digest('hex');
function git(args) {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`Git inventory failed: ${result.stderr}`);
  return result.stdout;
}
function inventory() {
  // Include new, nonignored files so local validation also covers an uncommitted patch.
  const paths = [...new Set(git(['ls-files', '-z', '--cached', '--others', '--exclude-standard']).split('\0').filter(Boolean))].sort();
  const tests = paths.filter(path => /\.(?:test|spec)\.[^/]+$/u.test(path));
  const entries = tests.map(path => {
    let suite;
    if (path === 'src/tests/spaja-ultra/pilot-browser.test.mjs') suite = 'browser';
    else if (path === 'tools/spajascripte/compiler.test.mjs') suite = 'java';
    else if (/\.(?:test|spec)\.py$/u.test(path)) suite = 'python';
    else if (/\.(?:test|spec)\.(?:[cm]?[jt]s|tsx|jsx)$/u.test(path)) suite = 'node';
    else throw new Error(`Unclassified test: ${path}; assign a runner before CI can pass.`);
    return { path, suite };
  });
  if (!entries.length) throw new Error('No test files discovered.');
  return { paths, entries };
}
function sourceDigest(paths) {
  const digest = createHash('sha256');
  for (const path of paths) digest.update(path + '\0').update(hash(readFileSync(join(root, path))) + '\0');
  return digest.digest('hex');
}
function options(args) {
  const value = { suite: 'node', shard: 1, shards: 1, concurrency: 1, timeoutMs: 120000, list: false };
  const seen = new Set();
  for (const argument of args) {
    const [key, parameter, extra] = argument.split('=');
    if (seen.has(key) || extra !== undefined) throw new Error(`Invalid or duplicate option: ${argument}`);
    seen.add(key);
    if (key === '--list' && parameter === undefined) value.list = true;
    else if (key === '--suite' && suites.includes(parameter)) value.suite = parameter;
    else if (key === '--shard' && /^[1-9]\d*\/[1-9]\d*$/u.test(parameter ?? '')) {
      [value.shard, value.shards] = parameter.split('/').map(Number);
      if (value.shard > value.shards || value.shards > 256) throw new Error('Invalid shard range.');
    } else if (['--concurrency', '--timeout-ms'].includes(key) && /^[1-9]\d*$/u.test(parameter ?? '')) {
      const number = Number(parameter);
      if (key === '--concurrency' && number <= 8) value.concurrency = number;
      else if (key === '--timeout-ms' && number <= 600000) value.timeoutMs = number;
      else throw new Error(`Out-of-range option: ${argument}`);
    } else throw new Error(`Unknown or invalid option: ${argument}`);
  }
  return value;
}
function environment() {
  const allowed = ['PATH', 'HOME', 'LANG', 'LC_ALL', 'TMPDIR', 'TEMP', 'TMP', 'SystemRoot',
    'SUOC_PLAYWRIGHT_MODULE', 'SUOC_CHROMIUM_EXECUTABLE', 'SUOC_CHROMIUM_ARGS', 'PLAYWRIGHT_BROWSERS_PATH'];
  return { ...Object.fromEntries(allowed.filter(key => process.env[key] !== undefined).map(key => [key, process.env[key]])),
    CI: 'true', NEXT_TELEMETRY_DISABLED: '1' };
}
async function main() {
  const config = options(process.argv.slice(2));
  const { paths, entries } = inventory();
  const selected = entries.filter(entry => entry.suite === config.suite)
    .filter((_, index) => index % config.shards === config.shard - 1);
  if (!selected.length) throw new Error(`No tests selected for ${config.suite} ${config.shard}/${config.shards}.`);
  if (config.list) {
    console.log(JSON.stringify({ total: entries.length, counts: Object.fromEntries(suites.map(suite => [suite, entries.filter(e => e.suite === suite).length])), selected }, null, 2));
    return;
  }
  const directory = join(root, '.ci-evidence', `all-tests-${config.suite}-${config.shard}-of-${config.shards}`);
  mkdirSync(directory, { recursive: true });
  const report = { schema: 'spaja-test-files-v1', status: 'running', startedAt: new Date().toISOString(),
    revision: git(['rev-parse', 'HEAD']).trim(), dirty: Boolean(git(['status', '--porcelain']).trim()),
    sourceSha256: sourceDigest(paths), inventorySha256: hash(JSON.stringify(entries)), config,
    discoveredFiles: entries.length, selectedFiles: selected.length, completedFiles: 0, passedFiles: 0, failedFiles: 0,
    results: [], pending: selected.map(e => e.path), productionVerified: false };
  function save() {
    writeFileSync(join(directory, 'summary.json.tmp'), JSON.stringify(report, null, 2) + '\n');
    renameSync(join(directory, 'summary.json.tmp'), join(directory, 'summary.json'));
  }
  save();
  const env = environment();
  if (config.suite === 'java' && spawnSync('javac', ['-version'], { env }).status !== 0) {
    report.status = 'blocked'; report.finishedAt = new Date().toISOString(); report.error = 'javac is required; JVM integration must not silently skip.'; save();
    throw new Error(report.error);
  }
  console.log(`Discovered ${entries.length} files; running ${selected.length} ${config.suite} files, shard ${config.shard}/${config.shards}.`);
  const active = new Set();
  let interrupted = false;
  function kill(child) {
    try { if (process.platform === 'win32') child.kill('SIGKILL'); else process.kill(-child.pid, 'SIGKILL'); } catch { /* Already exited. */ }
  }
  const stop = () => { interrupted = true; for (const child of active) kill(child); };
  process.on('SIGTERM', stop); process.on('SIGINT', stop);
  async function run(entry) {
    const logName = `${hash(entry.path).slice(0, 16)}-${basename(entry.path).slice(0, 80)}.log`;
    const fd = openSync(join(directory, logName), 'w', 0o600);
    const command = config.suite === 'python' ? 'python3' : process.execPath;
    const args = config.suite === 'python' ? [entry.path] : ['--import', 'tsx', '--test', '--test-reporter=tap', entry.path];
    const startedAt = Date.now();
    let timedOut = false;
    const result = await new Promise(resolveResult => {
      const child = spawn(command, args, { cwd: root, env, shell: false, detached: process.platform !== 'win32', stdio: ['ignore', fd, fd] });
      active.add(child);
      let error = null;
      child.on('error', cause => { error = cause.message; });
      const timer = setTimeout(() => { timedOut = true; kill(child); }, config.timeoutMs);
      child.on('close', (code, signal) => { clearTimeout(timer); active.delete(child); resolveResult({ exitCode: code, signal, error }); });
    });
    closeSync(fd);
    const log = readFileSync(join(directory, logName));
    const output = log.toString('utf8');
    const hasSkips = /^# skipped [1-9]\d*$/mu.test(output) || /\bSKIP:/u.test(output) || /# (?:SKIP|TODO)\b/u.test(output) || /\bskipped=[1-9]\d*/u.test(output);
    const status = timedOut ? 'timed_out' : interrupted ? 'cancelled' : result.exitCode === 0 && !result.error && !hasSkips ? 'passed' : hasSkips && result.exitCode === 0 ? 'incomplete' : 'failed';
    report.results.push({ path: entry.path, status, ...result, durationMs: Date.now() - startedAt,
      command: [command, ...args], log: logName, logSha256: hash(log) });
    report.pending = report.pending.filter(path => path !== entry.path);
    report.completedFiles++;
    if (status === 'passed') report.passedFiles++; else report.failedFiles++;
    save();
    if (status !== 'passed' || report.completedFiles % 50 === 0) console.log(`${report.completedFiles}/${selected.length}: ${status} ${entry.path}`);
  }
  let cursor = 0;
  await Promise.all(Array.from({ length: config.concurrency }, async () => {
    while (!interrupted && cursor < selected.length) await run(selected[cursor++]);
  }));
  process.off('SIGTERM', stop); process.off('SIGINT', stop);
  report.finishedAt = new Date().toISOString();
  const after = inventory();
  report.sourceStable = sourceDigest(after.paths) === report.sourceSha256;
  report.status = !interrupted && report.sourceStable && report.completedFiles === selected.length && report.failedFiles === 0 ? 'passed' : 'failed';
  save();
  console.log(`${report.status}: ${report.passedFiles}/${selected.length} test files passed; ${report.failedFiles} failed/incomplete; ${report.pending.length} pending. Summary: ${directory}/summary.json`);
  process.exitCode = report.status === 'passed' ? 0 : 1;
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
