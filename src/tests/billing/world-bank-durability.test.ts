import assert from 'node:assert/strict';
import { test } from 'node:test';
import { spawn, type ChildProcess } from 'node:child_process';
import { mkdtempSync, rmSync, statSync, chmodSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { TestBillingLedger } from '../../lib/billing-world-bank/ledger';

function worker(directory: string, mode = 'normal') {
  return spawn(process.execPath, ['--import', 'tsx', resolve('src/tests/billing/fixtures/world-bank-worker.ts'), directory, mode],
    { cwd: process.cwd(), env: { NODE_ENV: 'test' }, stdio: ['ignore', 'ignore', 'pipe', 'ipc'] });
}
function message(child: ChildProcess) {
  return new Promise<unknown>((resolve, reject) => {
    const timer = setTimeout(() => { cleanup(); reject(new Error('worker timeout')); }, 15000);
    function cleanup() { clearTimeout(timer); child.off('message', ready); child.off('exit', exited); child.off('error', error); }
    function ready(value: unknown) { cleanup(); resolve(value); }
    function exited(code: number | null) { cleanup(); reject(new Error(`worker exited: ${code}`)); }
    function error(e: Error) { cleanup(); reject(e); }
    child.once('message', ready); child.once('exit', exited); child.once('error', error);
  });
}
async function kill(child: ChildProcess) {
  if (child.exitCode !== null || child.signalCode !== null) return;
  await new Promise<void>(resolve => { child.once('exit', () => resolve()); child.kill('SIGKILL'); });
}
test('eight independent processes race one event: exactly one financial effect persists', { timeout: 20000 }, async () => {
  const dir = mkdtempSync(join(tmpdir(), 'spaja-race-')); const children: ChildProcess[] = [];
  try {
    const seed = new TestBillingLedger(dir); seed.close();
    const waits = Array.from({ length: 8 }, () => { const c = worker(dir); children.push(c); return message(c); });
    assert.deepEqual(await Promise.all(waits), Array(8).fill('ready'));
    const results = children.map(c => { const pending = message(c); c.send('go'); return pending; });
    const receipts = await Promise.all(results) as Array<{ disposition: string }>;
    assert.equal(receipts.filter(r => r.disposition === 'applied').length, 1);
    assert.equal(receipts.filter(r => r.disposition === 'duplicate_event').length, 7);
    const reopened = new TestBillingLedger(dir);
    try { assert.deepEqual(reopened.snapshot('tenant-a').counts, { payments: 1, events: 1, postings: 2 }); }
    finally { reopened.close(); }
  } finally { await Promise.all(children.map(kill)); rmSync(dir, { recursive: true, force: true }); }
});
for (const phase of ['before-commit', 'after-commit']) {
  test(`process death ${phase}: restart and replay recover without partial/double postings`, { timeout: 20000 }, async () => {
    const dir = mkdtempSync(join(tmpdir(), 'spaja-crash-')); let child: ChildProcess | undefined;
    try {
      child = worker(dir, phase); assert.equal(await message(child), 'ready');
      const paused = message(child); child.send('go'); assert.equal(await paused, phase); await kill(child);
      const reopened = new TestBillingLedger(dir);
      try { assert.equal(reopened.snapshot('tenant-a').counts.events, phase === 'before-commit' ? 0 : 1); }
      finally { reopened.close(); }
      child = worker(dir); assert.equal(await message(child), 'ready');
      const replay = message(child); child.send('go');
      assert.equal((await replay as { disposition: string }).disposition, phase === 'before-commit' ? 'applied' : 'duplicate_event');
      const final = new TestBillingLedger(dir);
      try { assert.deepEqual(final.snapshot('tenant-a').counts, { events: 1, payments: 1, postings: 2 }); }
      finally { final.close(); }
    } finally { if (child) await kill(child); rmSync(dir, { recursive: true, force: true }); }
  });
}
test('database permissions restrict local access; symlink and shared directories fail closed', () => {
  const dir = mkdtempSync(join(tmpdir(), 'spaja-perms-'));
  try {
    const ledger = new TestBillingLedger(dir); ledger.close();
    assert.equal(statSync(join(dir, 'test-ledger.sqlite')).mode & 0o777, 0o600);
    symlinkSync(dir, join(dir, 'alias'));
    assert.throws(() => new TestBillingLedger(join(dir, 'alias')), /private_directory_required/);
    chmodSync(dir, 0o755); assert.throws(() => new TestBillingLedger(dir), /private_directory_required/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
