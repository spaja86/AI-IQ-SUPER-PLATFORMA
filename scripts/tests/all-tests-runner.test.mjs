// @ci-isolation: exclusive — exercises real process deadlines and nested runners.
import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { processDeadline, runScheduled } from '../ci/test-scheduling.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
function fixture(t, files = { 'src/tests/a.test.mjs': "console.log('ok');" }) {
  const cwd = mkdtempSync(join(tmpdir(), 'spaja-all-tests-'));
  t.after(() => rmSync(cwd, { force: true, recursive: true }));
  function write(path, value) { mkdirSync(dirname(join(cwd, path)), { recursive: true }); writeFileSync(join(cwd, path), value); }
  function git(args) {
    const result = spawnSync('git', args, { cwd, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr); return result.stdout.trim();
  }
  git(['init', '-q']);
  // Reference an existing object without creating unsigned fixture commits.
  const objects = spawnSync('git', ['rev-parse', '--git-path', 'objects'], { cwd: root, encoding: 'utf8' }).stdout.trim();
  write('.git/objects/info/alternates', resolve(root, objects) + '\n');
  const head = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).stdout.trim();
  git(['update-ref', 'HEAD', head]);
  write('.gitignore', 'node_modules/\n.ci-evidence/\n');
  write('node_modules/tsx/package.json', JSON.stringify({ name: 'tsx', exports: './loader.mjs' }));
  write('node_modules/tsx/loader.mjs', 'export {};');
  write('scripts/ci/run-all-tests.mjs', '');
  copyFileSync(join(root, 'scripts/ci/run-all-tests.mjs'), join(cwd, 'scripts/ci/run-all-tests.mjs'));
  copyFileSync(join(root, 'scripts/ci/test-scheduling.mjs'), join(cwd, 'scripts/ci/test-scheduling.mjs'));
  for (const [path, value] of Object.entries(files)) write(path, value);
  const args = ['scripts/ci/run-all-tests.mjs'];
  return { cwd, write, run: (extra = [], env = {}) => spawnSync(process.execPath, [...args, ...extra], {
    cwd, encoding: 'utf8', timeout: 20000, env: { ...process.env, ...env },
  }), report: (suite = 'node', shard = '1-of-1') => JSON.parse(readFileSync(join(cwd, `.ci-evidence/all-tests-${suite}-${shard}/summary.json`), 'utf8')) };
}
test('discovers nested and newly added tests, with explicit browser/Python/JVM ownership', t => {
  const f = fixture(t, { 'src/tests/nested/a.test.ts': '', 'new/place/b.spec.cjs': '',
    'scripts/tests/a.test.py': '', 'src/tests/spaja-ultra/pilot-browser.test.mjs': '',
    'tools/spajascripte/compiler.test.mjs': '', 'readme.md': '' });
  const result = f.run(['--list']);
  assert.equal(result.status, 0, result.stderr);
  const data = JSON.parse(result.stdout);
  assert.deepEqual(data.counts, { node: 2, browser: 1, python: 1, java: 1 });
  assert.equal(data.selected.length, 2);
});
test('fails when inventory is empty or a new test format has no runner', t => {
  const f = fixture(t, {});
  assert.equal(f.run(['--list']).status, 1);
  f.write('src/tests/new.test.rb', '');
  assert.match(f.run(['--list']).stderr, /Unclassified/);
});
test('shards form a complete, deterministic, disjoint partition', t => {
  const f = fixture(t, Object.fromEntries(Array.from({ length: 17 }, (_, i) => [`src/tests/${i}.test.mjs`, ''])));
  const partitions = Array.from({ length: 6 }, (_, i) => JSON.parse(f.run(['--list', `--shard=${i + 1}/6`]).stdout).selected);
  const paths = partitions.flat().map(entry => entry.path);
  assert.equal(paths.length, 17); assert.equal(new Set(paths).size, 17);
  assert.deepEqual(JSON.parse(f.run(['--list', '--shard=2/6']).stdout).selected, partitions[1]);
});
test('invalid options and empty shard fail closed', t => {
  const f = fixture(t);
  for (const options of [['--wat'], ['--suite=unknown'], ['--shard=0/1'], ['--shard=2/1'], ['--shard=1/257'],
    ['--concurrency=0'], ['--concurrency=9'], ['--timeout-ms=NaN'], ['--timeout-ms=600001'], ['--list', '--list'], ['--shard=2/2']]) {
    assert.equal(f.run(options).status, 1, options.join(' '));
  }
});
test('failure does not suppress later files; reports real exit and hashed logs', t => {
  const f = fixture(t, { 'src/tests/a.test.mjs': 'process.exit(7);', 'src/tests/z.test.mjs': "console.log('ran after failure');" });
  const result = f.run(); assert.equal(result.status, 1, result.stderr);
  const report = f.report();
  assert.equal(report.completedFiles, 2); assert.equal(report.passedFiles, 1); assert.equal(report.failedFiles, 1);
  assert.equal(report.pending.length, 0); assert.equal(report.sourceStable, true);
  for (const record of report.results) {
    const log = readFileSync(join(f.cwd, '.ci-evidence/all-tests-node-1-of-1', record.log));
    assert.equal(record.logSha256, createHash('sha256').update(log).digest('hex'));
    assert.equal(record.command.includes('--test'), true);
  }
});
test('safe environment excludes inherited provider secrets and Node injection flags', t => {
  const f = fixture(t, { 'src/tests/a.test.mjs': "import assert from 'node:assert/strict'; assert.equal(process.env.OPENAI_API_KEY, undefined); assert.equal(process.env.GITHUB_TOKEN, undefined); assert.equal(process.env.NODE_OPTIONS, undefined);" });
  assert.equal(f.run([], { OPENAI_API_KEY: 'fixture-only', GITHUB_TOKEN: 'fixture-only', NODE_OPTIONS: '--no-warnings' }).status, 0);
});
test('literal paths containing shell syntax and brackets execute without shell expansion', t => {
  const f = fixture(t, { 'src/tests/$(touch BAD)[id].test.mjs': "console.log('literal');" });
  assert.equal(f.run().status, 0); assert.equal(existsSync(join(f.cwd, 'BAD')), false);
});
test('skipped/TODO tests are incomplete, never successful coverage', t => {
  const f = fixture(t, { 'src/tests/a.test.mjs': "import {test} from 'node:test'; test.skip('missing setup',()=>{});" });
  assert.equal(f.run().status, 1); assert.equal(f.report().results[0].status, 'incomplete');
});
test('a real hanging process is killed at the configured deadline', t => {
  const f = fixture(t, { 'src/tests/a.test.mjs': 'setInterval(()=>{}, 1000);' });
  assert.equal(f.run(['--timeout-ms=1500']).status, 1);
  assert.equal(f.report().results[0].status, 'timed_out');
  assert.equal(f.report().results[0].signal, 'SIGKILL');
});
test('deadlines expire exactly at budget and a later entry still runs', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const results = [];
  await runScheduled([{ path: 'hang' }, { path: 'next' }], 1, async entry => {
    let kills = 0;
    const deadline = processDeadline(1500, () => kills++);
    t.mock.timers.tick(entry.path === 'hang' ? 1499 : 1);
    assert.equal(deadline.expired, false); assert.equal(kills, 0);
    if (entry.path === 'hang') {
      t.mock.timers.tick(1);
      assert.equal(deadline.expired, true); assert.equal(kills, 1);
    }
    results.push(deadline.expired ? 'timed_out' : 'passed');
    deadline.cancel();
    t.mock.timers.tick(1500);
    assert.equal(kills, entry.path === 'hang' ? 1 : 0, 'closed children cannot be killed by a stale timer');
  });
  assert.deepEqual(results, ['timed_out', 'passed']);
});
test('termination by signal fails', t => {
  const f = fixture(t, { 'src/tests/a.test.mjs': "process.kill(process.pid,'SIGTERM');" });
  assert.equal(f.run().status, 1); assert.equal(f.report().failedFiles, 1);
});
test('source changes during execution invalidate an otherwise passing report', t => {
  const f = fixture(t, { 'src/tests/a.test.mjs': "import {writeFileSync} from 'node:fs'; writeFileSync('source.txt','changed');", 'source.txt': 'original' });
  assert.equal(f.run().status, 1); assert.equal(f.report().passedFiles, 1); assert.equal(f.report().sourceStable, false);
});
test('runner cancellation retains an incomplete report and pending files', async t => {
  const f = fixture(t, { 'src/tests/a.test.mjs': 'setInterval(()=>{},1000);', 'src/tests/z.test.mjs': '' });
  const child = spawn(process.execPath, ['scripts/ci/run-all-tests.mjs'], { cwd: f.cwd, stdio: ['ignore', 'pipe', 'pipe'] });
  t.after(() => child.kill('SIGKILL'));
  const code = await new Promise(resolveCode => {
    child.stdout.once('data', () => child.kill('SIGTERM'));
    child.on('close', resolveCode);
  });
  assert.equal(code, 1); assert.equal(f.report().status, 'failed'); assert(f.report().pending.length > 0);
});

test('Python skipped cases cannot be reported as complete coverage', t => {
  const f = fixture(t, { 'scripts/tests/a.test.py': "import unittest\nclass Example(unittest.TestCase):\n @unittest.skip('missing setup')\n def test_missing(self): pass\nunittest.main()\n" });
  assert.equal(f.run(['--suite=python']).status, 1);
  assert.equal(f.report('python').results[0].status, 'incomplete');
});
test('concurrent execution collects every result and preserves failure', t => {
  const f = fixture(t, Object.fromEntries(Array.from({ length: 4 }, (_, i) => [`src/tests/${i}.test.mjs`, `process.exit(${i === 1 ? 3 : 0});`])));
  assert.equal(f.run(['--concurrency=3']).status, 1);
  const report = f.report();
  assert.equal(report.completedFiles, 4); assert.equal(report.passedFiles, 3);
  assert.equal(new Set(report.results.map(r => r.path)).size, 4);
  assert.equal(report.pending.length, 0);
});
test('exclusive entries drain parallel work and block later launches', async () => {
  const entries = ['a', 'b', 'exclusive', 'c', 'd'].map(path => ({ path, isolation: path === 'exclusive' ? 'exclusive' : 'parallel' }));
  const active = new Set(); const events = []; const release = new Map();
  const running = runScheduled(entries, 2, async entry => {
    if (entry.isolation === 'exclusive') assert.equal(active.size, 0);
    else assert.equal(active.has('exclusive'), false);
    active.add(entry.path); events.push(entry.path);
    await new Promise(resolveEntry => release.set(entry.path, resolveEntry));
    active.delete(entry.path);
  });
  assert.deepEqual(events, ['a', 'b']);
  release.get('b')(); await new Promise(resolveTick => setImmediate(resolveTick));
  assert.deepEqual(events, ['a', 'b']);
  release.get('a')(); await new Promise(resolveTick => setImmediate(resolveTick));
  assert.deepEqual(events, ['a', 'b', 'exclusive']);
  release.get('exclusive')(); await new Promise(resolveTick => setImmediate(resolveTick));
  assert.deepEqual(events, ['a', 'b', 'exclusive', 'c', 'd']);
  release.get('c')(); release.get('d')(); await running;
});
test('exclusive annotations are discovered and failures remain in immutable attempts', t => {
  const f = fixture(t, { 'src/tests/a.test.mjs': '// @ci-isolation: exclusive\nprocess.exit(2);' });
  const inventory = JSON.parse(f.run(['--list']).stdout);
  assert.equal(inventory.selected[0].isolation, 'exclusive');
  assert.equal(f.run(['--concurrency=4']).status, 1);
  const first = f.report();
  const firstLog = readFileSync(join(f.cwd, '.ci-evidence/all-tests-node-1-of-1', first.results[0].log));
  f.write('src/tests/a.test.mjs', '// @ci-isolation: exclusive\n');
  assert.equal(f.run(['--concurrency=4']).status, 0);
  const second = f.report();
  assert.notEqual(first.attempt, second.attempt);
  const retained = JSON.parse(readFileSync(join(f.cwd, '.ci-evidence/all-tests-node-1-of-1', first.attempt, 'summary.json')));
  assert.equal(retained.status, 'failed');
  assert.equal(retained.results[0].isolation, 'exclusive');
  assert.deepEqual(readFileSync(join(f.cwd, '.ci-evidence/all-tests-node-1-of-1', first.results[0].log)), firstLog);
});
test('application workflow requires all four suites and six complete Node shards', () => {
  const workflow = readFileSync(join(root, '.github/workflows/application-validation.yml'), 'utf8');
  const scripts = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).scripts;
  assert.match(scripts['test:ci'], /run-all-tests\.mjs --suite=node$/u);
  assert.match(workflow, /fail-fast: false\n      matrix:\n        shard: \[1, 2, 3, 4, 5, 6\]/u);
  assert(workflow.includes('test:ci -- --shard=${{ matrix.shard }}/6'));
  for (const suite of ['python', 'java', 'browser']) {
    assert.match(scripts[`test:ci:${suite}`], new RegExp(`run-all-tests\\.mjs --suite=${suite}$`, 'u'));
    assert(workflow.includes(`npm run test:ci:${suite}`));
  }
  assert(workflow.includes('name: spaja-ci-tests-${{ matrix.shard }}'));
  assert.match(workflow, /needs: \[quality, tests, build, browser\]/u);
  assert.doesNotMatch(workflow, /continue-on-error/u);
});
