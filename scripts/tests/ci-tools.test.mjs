import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
function temporary(t) {
  const path = mkdtempSync(join(tmpdir(), 'spaja-ci-'));
  t.after(() => rmSync(path, { recursive: true, force: true }));
  return path;
}
function invoke(script, args, cwd) {
  return spawnSync(process.execPath, [script, ...args], { cwd, encoding: 'utf8' });
}
function runnerFixture(t) {
  const cwd = temporary(t);
  mkdirSync(join(cwd, 'scripts'));
  copyFileSync(join(root, 'scripts/run-tsx-tests.mjs'), join(cwd, 'scripts/run-tsx-tests.mjs'));
  mkdirSync(join(cwd, 'node_modules/tsx'), { recursive: true });
  writeFileSync(join(cwd, 'node_modules/tsx/package.json'), JSON.stringify({ name: 'tsx', exports: { './cli': './cli.cjs' } }));
  // An isolated executable fixture tests runner discovery/exit propagation without npm.
  writeFileSync(join(cwd, 'node_modules/tsx/cli.cjs'), 'require(process.argv[2]);\n');
  return { cwd, run: dir => invoke(join(cwd, 'scripts/run-tsx-tests.mjs'), [dir], cwd) };
}

test('test runner rejects a missing required directory', t => {
  const f = runnerFixture(t);
  assert.equal(f.run('does-not-exist').status, 1);
});
test('test runner rejects an empty directory and files that are not tests', t => {
  const f = runnerFixture(t);
  mkdirSync(join(f.cwd, 'tests'));
  assert.equal(f.run('tests').status, 1);
  writeFileSync(join(f.cwd, 'tests/readme.ts'), '');
  assert.equal(f.run('tests').status, 1);
});
test('test runner executes every discovered nested test and reports the file count', t => {
  const f = runnerFixture(t);
  mkdirSync(join(f.cwd, 'tests/nested'), { recursive: true });
  for (const name of ['a.test.ts', 'nested/b.test.ts']) {
    writeFileSync(join(f.cwd, 'tests', name), `require('node:fs').appendFileSync('executed.txt', ${JSON.stringify(name + '\n')});`);
  }
  const result = f.run('tests');
  assert.equal(result.status, 0, result.stderr);
  assert.equal(readFileSync(join(f.cwd, 'executed.txt'), 'utf8'), 'a.test.ts\nnested/b.test.ts\n');
  assert.match(result.stdout, /Completed 2\/2 test files successfully/);
});
test('test runner preserves a failing exit code and does not run later files', t => {
  const f = runnerFixture(t);
  mkdirSync(join(f.cwd, 'tests'));
  writeFileSync(join(f.cwd, 'tests/a.test.ts'), 'process.exit(7);');
  writeFileSync(join(f.cwd, 'tests/z.test.ts'), 'throw new Error("must not run");');
  const result = f.run('tests');
  assert.equal(result.status, 7);
  assert.doesNotMatch(result.stdout + result.stderr, /must not run|Completed/);
});
test('test runner converts termination by signal to failure', t => {
  const f = runnerFixture(t);
  mkdirSync(join(f.cwd, 'tests'));
  writeFileSync(join(f.cwd, 'tests/a.test.ts'), "process.kill(process.pid, 'SIGTERM');");
  assert.equal(f.run('tests').status, 1);
});
for (const exitCode of [0, 7]) {
  test(`command evidence preserves exit ${exitCode} and hashes the actual log`, t => {
    const cwd = temporary(t);
    const result = invoke(join(root, 'scripts/ci/run-check.mjs'),
      ['fixture', process.execPath, '-e', `console.log('fixture output'); process.exit(${exitCode})`], cwd);
    assert.equal(result.status, exitCode, result.stderr);
    const log = readFileSync(join(cwd, '.ci-evidence/fixture.log'));
    const record = JSON.parse(readFileSync(join(cwd, '.ci-evidence/fixture.json'), 'utf8'));
    assert.equal(record.exitCode, exitCode);
    assert.equal(record.logSha256, createHash('sha256').update(log).digest('hex'));
    assert.equal(record.command[0], process.execPath);
    assert.match(log.toString(), /fixture output/);
  });
}
test('missing executable is a recorded failure', t => {
  const cwd = temporary(t);
  const result = invoke(join(root, 'scripts/ci/run-check.mjs'), ['missing', join(cwd, 'absent')], cwd);
  assert.equal(result.status, 1);
  const record = JSON.parse(readFileSync(join(cwd, '.ci-evidence/missing.json'), 'utf8'));
  assert.equal(record.exitCode, 1);
  assert.match(record.error, /ENOENT/);
});
test('command arguments are literal, never shell-evaluated', t => {
  const cwd = temporary(t);
  const literal = '$(touch BAD); `touch BAD2`';
  const result = invoke(join(root, 'scripts/ci/run-check.mjs'),
    ['literal', process.execPath, '-e', 'console.log(process.argv[1])', literal], cwd);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /\$\(touch BAD\)/);
});

const contracts = ['analizaSvega', 'potencijalSvegaOvogaDoSada',
  'ekstremnoProcesuiranjeSvega', 'procesuiranje3', 'maksimusSvega'];
function report() {
  return { mode: 'full', missingRequiredEnv: ['OPENAI_API_KEY'],
    ...Object.fromEntries(contracts.map(name => [name, { contractReady: true }])) };
}
function predeploy(t, content) {
  const cwd = temporary(t);
  const filename = join(cwd, 'report.txt');
  writeFileSync(filename, content);
  return invoke(join(root, 'scripts/ci/check-predeploy-contracts.mjs'), [filename], cwd);
}
test('predeploy contracts pass without production credentials and disclose the limitation', t => {
  const result = predeploy(t, '=== Predeploy Check ===\n' + JSON.stringify(report()));
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Production configuration is NOT validated/);
});
test('each missing, false or nonboolean mandatory predeploy contract fails', t => {
  for (const name of contracts) for (const value of [undefined, false, 'true', null]) {
    const data = report();
    data[name] = value === undefined ? undefined : { contractReady: value };
    assert.equal(predeploy(t, '=== Predeploy Check ===\n' + JSON.stringify(data)).status, 1);
  }
});
test('missing, invalid and fast predeploy reports fail', t => {
  for (const content of ['', '{}', '=== Predeploy Check ===\n{',
    '=== Predeploy Check ===\n' + JSON.stringify({ ...report(), mode: 'fast' })]) {
    assert.equal(predeploy(t, content).status, 1);
  }
});

test('predeploy JSON remains parseable when the command also emits stderr warnings', t => {
  const cwd = temporary(t);
  const output = '=== Predeploy Check ===\n' + JSON.stringify(report());
  const script = `console.log(${JSON.stringify(output)}); console.warn('Contract warning');`;
  const recorded = invoke(join(root, 'scripts/ci/run-check.mjs'),
    ['predeploy', process.execPath, '-e', script], cwd);
  assert.equal(recorded.status, 0);
  const result = invoke(join(root, 'scripts/ci/check-predeploy-contracts.mjs'),
    [join(cwd, '.ci-evidence/predeploy.stdout.log')], cwd);
  assert.equal(result.status, 0, result.stderr);
  assert.match(readFileSync(join(cwd, '.ci-evidence/predeploy.stderr.log'), 'utf8'), /Contract warning/);
});
