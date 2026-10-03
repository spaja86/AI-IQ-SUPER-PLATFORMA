import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { checks, discoverLanguages, runChecks } from '../../scripts/node-1450-all.mjs';

test('fixed allowlist has no deploy or financial commands', () => {
  assert.equal(checks('/tmp').length, 6);
  assert.ok(checks('/tmp').every(c => !c.args.some(a => /deploy|payment|migration/.test(a))));
});
test('failure stops subsequent checks', () => {
  let calls = 0;
  const result = runChecks('/tmp', (_exe, _args, options) => {
    calls++;
    assert.equal(options.shell, false);
    return { status: 2 };
  });
  assert.equal(calls, 1);
  assert.equal(result.passed, false);
  assert.equal(result.skipped.length, 5);
});
test('success runs all fixed checks', () => {
  assert.equal(runChecks('/tmp', () => ({ status: 0 })).passed, true);
});
test('timeout/process error is not success', () => {
  assert.equal(runChecks('/tmp', () => ({ error: new Error('timeout'), status: null })).checks[0].status, 'execution-error');
});
test('discovery labels unsupported languages', () => {
  const root = mkdtempSync(join(tmpdir(), 'node1450-all-'));
  try {
    mkdirSync(join(root, 'src'));
    writeFileSync(join(root, 'src/example.ts'), '');
    writeFileSync(join(root, 'src/example.py'), '');
    assert.deepEqual(discoverLanguages(root), [
      { language: 'TypeScript', status: 'bounded-adapter' },
      { language: 'Python', status: 'unsupported-not-executed' },
    ]);
  } finally { rmSync(root, { recursive: true, force: true }); }
});
