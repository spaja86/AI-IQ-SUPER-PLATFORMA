import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { Store } from '../../../scripts/spaja-dev-orchestrator/store.mjs';
import { validatePlan, MODES } from '../../../scripts/spaja-dev-orchestrator/policy.mjs';

export const plan = (hours = 3) => ({ version: 1, hours, tasks: [
  { id: 'generate', kind: 'generate-module', moduleName: 'spajaSum', operation: 'sum' },
  { id: 'verify', kind: 'verify-module', source: 'generate', dependsOn: ['generate'] },
] });
function fixture(t, input = plan()) {
  const dir = mkdtempSync(join(tmpdir(), 'spaja-orchestrator-'));
  let now = 1_800_000_000_000;
  const path = join(dir, 'queue.sqlite');
  let store = new Store(path, () => now);
  store.create(input);
  t.after(() => { store.close(); rmSync(dir, { recursive: true, force: true }); });
  return { path, get store() { return store; }, advance: ms => now += ms,
    reopen: () => { store.close(); store = new Store(path, () => now); return store; } };
}

test('creation is durable and inert until explicit start; successful steps never repeat', t => {
  const f = fixture(t);
  assert.equal(f.store.claim(), null);
  f.reopen();
  assert.equal(f.store.get().status, 'ready');
  f.store.control('start');
  const a = f.store.claim();
  assert.equal(a.task.id, 'generate');
  assert.equal(f.store.claim(), null);
  f.store.finish(a.token, { ok: true, summary: 'generated' });
  f.store.control('pause');
  assert.equal(f.store.claim(), null);
  f.store.control('resume');
  const b = f.store.claim();
  assert.equal(b.task.id, 'verify');
  f.store.finish(b.token, { ok: true, summary: 'tested' });
  f.reopen();
  assert.equal(f.store.get().status, 'succeeded');
  assert.equal(f.store.claim(), null);
});

for (const hours of MODES) test(`${hours}h boundary uses simulated time; pauses do not extend deadline`, t => {
  const f = fixture(t, plan(hours));
  f.store.control('start');
  const deadline = f.store.get().deadline;
  f.advance(hours * 3_600_000 - 1);
  f.store.control('pause');
  f.store.control('resume');
  assert.equal(f.store.get().deadline, deadline);
  f.advance(1);
  assert.equal(f.store.claim(), null);
  assert.equal(f.store.get().status, 'expired');
  assert.throws(() => f.store.control('resume'));
});

test('restart fences uncertain work and requires explicit retry then resume', t => {
  const f = fixture(t);
  f.store.control('start');
  const a = f.store.claim();
  f.reopen();
  assert.equal(f.store.get().status, 'paused');
  assert.equal(f.store.get().tasks[0].status, 'interrupted');
  assert.throws(() => f.store.control('resume'));
  assert.throws(() => f.store.control('retry'), /lease/i);
  f.advance(a.timeoutMs + 2001);
  f.store.control('retry');
  assert.equal(f.store.claim(), null);
  f.store.control('resume');
  const b = f.store.claim();
  assert.notEqual(b.token, a.token);
  assert.throws(() => f.store.finish(a.token, { ok: true }), /stale/i);
  assert.equal(f.store.get().tasks[0].attempts, 2);
});

test('restart between tasks pauses the queue; never auto-resumes', t => {
  const f = fixture(t);
  f.store.control('start');
  const a = f.store.claim();
  f.store.finish(a.token, { ok: true });
  f.reopen();
  assert.equal(f.store.get().status, 'paused');
  assert.equal(f.store.claim(), null);
  f.store.control('resume');
  assert.equal(f.store.claim().task.id, 'verify');
});

test('pause during execution remains paused after result; cancel cannot be revived', t => {
  const f = fixture(t);
  f.store.control('start');
  const a = f.store.claim();
  f.store.control('pause');
  f.store.finish(a.token, { ok: false, reason: 'interrupted' });
  assert.equal(f.store.get().status, 'paused');
  f.store.control('retry');
  f.store.control('cancel');
  assert.equal(f.store.claim(), null);
  assert.throws(() => f.store.control('resume'));
});

test('dependency failure stops dispatch and attempt limits survive retry', t => {
  const f = fixture(t);
  f.store.control('start');
  for (let i = 0; i < 3; i++) {
    const a = f.store.claim();
    f.store.finish(a.token, { ok: false, reason: 'failed' });
    assert.equal(f.store.claim(), null);
    if (i < 2) { f.store.control('retry'); f.store.control('resume'); }
  }
  assert.throws(() => f.store.control('retry'), /attempt/i);
  assert.equal(f.store.get().tasks[1].attempts, 0);
});

test('time reservation survives crash and cannot overspend total resource budget', t => {
  const p = plan(); p.limits = { totalTaskMs: 1000, taskMs: 1000 };
  const f = fixture(t, p);
  f.store.control('start');
  const a = f.store.claim();
  f.store.finish(a.token, { ok: true });
  assert.equal(f.store.claim(), null);
  assert.equal(f.store.get().status, 'budget_exhausted');
  assert.equal(f.store.get().reservedTaskMs, 1000);
});

test('clock rollback fails closed and late success is not reported as success', t => {
  const f = fixture(t);
  f.store.control('start');
  const a = f.store.claim();
  f.advance(-1);
  assert.throws(() => f.store.control('pause'), /clock/i);
  f.advance(3 * 3_600_000 + 1);
  f.store.finish(a.token, { ok: true });
  assert.equal(f.store.get().status, 'expired');
  assert.equal(f.store.get().tasks[0].status, 'interrupted');
});

test('exclusive SQLite ownership prevents concurrent dispatch', t => {
  const f = fixture(t);
  assert.throws(() => new Store(f.path), /owner/i);
});

test('audit/state tampering blocks reads and mutations', t => {
  const f = fixture(t);
  const db = new DatabaseSync(f.path);
  db.exec("UPDATE events SET kind='forged' WHERE seq=1"); db.close();
  assert.throws(() => f.store.get(), /audit/i);
  assert.throws(() => f.store.control('start'), /audit/i);
});

test('failed audit write rolls back queue transition atomically', t => {
  const f = fixture(t);
  const db = new DatabaseSync(f.path);
  db.exec("CREATE TRIGGER fail_audit BEFORE INSERT ON events BEGIN SELECT RAISE(ABORT, 'test fault'); END");
  assert.throws(() => f.store.control('start'), /test fault/);
  assert.equal(f.store.get().status, 'ready');
  db.close();
});

test('strict validation rejects executable payloads, costs, traversal, duplicates and cycles', () => {
  for (const mutate of [
    p => p.hours = 4,
    p => p.command = 'sh',
    p => p.limits = { costMicros: 1 },
    p => p.limits = { taskMs: Infinity },
    p => p.tasks[0].kind = 'shell',
    p => delete p.tasks[0].id,
    p => delete p.tasks[0].moduleName,
    p => p.tasks[0].moduleName = '../escape',
    p => p.tasks[0].dependsOn = ['verify'],
    p => p.tasks[1].dependsOn = ['missing'],
    p => p.tasks[1].id = 'generate',
    p => p.tasks[1].dependsOn = [],
    p => p.tasks = [{ id: 'read', kind: 'file-manifest', files: ['../secret.json'] }],
    p => p.tasks = [{ id: 'read', kind: 'file-manifest', files: ['.env'] }],
  ]) {
    const p = plan(); mutate(p); assert.throws(() => validatePlan(p));
  }
});

test('out-of-order dependencies are scheduled without changing queue identities', t => {
  const p = plan(); p.tasks.reverse();
  const f = fixture(t, p); f.store.control('start');
  assert.equal(f.store.claim().task.id, 'generate');
});

test('lost supervisor preserves lease and spent reservation until explicit recovery', t => {
  const f = fixture(t); f.store.control('start');
  const a = f.store.claim(); f.store.uncertain(a.token);
  assert.equal(f.store.get().status, 'paused');
  assert.equal(f.store.get().reservedTaskMs, a.state.limits.taskMs);
  assert.throws(() => f.store.control('retry'), /lease/i);
  f.advance(a.timeoutMs + 2001);
  f.store.control('retry'); f.store.control('resume'); f.store.claim();
  assert.equal(f.store.get().reservedTaskMs, 2 * a.state.limits.taskMs);
});

test('last-state tampering and truncated audit tail are detected', t => {
  const f = fixture(t); f.store.control('start');
  const db = new DatabaseSync(f.path);
  db.exec('DELETE FROM events WHERE seq=2'); db.close();
  assert.throws(() => f.store.get(), /audit/);
});

test('cancellation during execution stays canceled after a late successful callback', t => {
  const f = fixture(t); f.store.control('start');
  const a = f.store.claim(); f.store.control('cancel');
  f.store.finish(a.token, { ok: true });
  assert.equal(f.store.get().status, 'canceled');
  assert.equal(f.store.get().tasks[0].status, 'interrupted');
  assert.equal(f.store.get().tasks[1].status, 'canceled');
});
