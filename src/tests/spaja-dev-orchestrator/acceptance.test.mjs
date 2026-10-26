import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { Store } from '../../../scripts/spaja-dev-orchestrator/store.mjs';

const root = resolve(import.meta.dirname, '../../..');
const cli = join(root, 'scripts/spaja-dev-orchestrator/cli.mjs');
async function until(check, ms = 90_000) {
  const end = Date.now() + ms;
  while (!check()) {
    if (Date.now() >= end) throw new Error('Acceptance condition timeout');
    await new Promise(r => setTimeout(r, 10));
  }
}
function run(t, database) {
  const child = spawn(process.execPath, [cli, 'run', database], { stdio: 'pipe' });
  const closed = once(child, 'close');
  const states = [];
  let buffer = '', errors = '';
  child.stdout.on('data', chunk => {
    buffer += chunk;
    let newline;
    while ((newline = buffer.indexOf('\n')) !== -1) {
      const line = buffer.slice(0, newline); buffer = buffer.slice(newline + 1);
      if (line.startsWith('{')) states.push(JSON.parse(line));
    }
  });
  child.stderr.on('data', chunk => { errors += chunk; });
  t.after(async () => {
    if (child.exitCode === null && child.signalCode === null) child.kill('SIGKILL');
    await closed;
  });
  return { states, closed, command: value => child.stdin.write(`${value}\n`),
    get latest() { return states.at(-1); }, get errors() { return errors; } };
}

test('supervised 3h configuration completes 64 real tasks across an explicit pause/reopen', { timeout: 120_000 }, async t => {
  const started = performance.now();
  const directory = mkdtempSync(join(tmpdir(), 'spaja-acceptance-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const database = join(directory, 'session.sqlite'), planPath = join(directory, 'plan.json');
  const tasks = [{ id: 'inventory', kind: 'file-manifest', files: ['scripts/spaja-dev-orchestrator/runner.mjs'] }];
  for (let i = 0; i < 31; i++) {
    const source = `generate-${i}`;
    tasks.push({ id: source, kind: 'generate-module', moduleName: `spaja${i}`, operation: i % 2 ? 'clamp' : 'sum', dependsOn: [tasks.at(-1).id] });
    tasks.push({ id: `verify-${i}`, kind: 'verify-module', source, dependsOn: [source] });
  }
  tasks.push({ id: 'final-inventory', kind: 'file-manifest', files: ['scripts/spaja-dev-orchestrator/cli.mjs'], dependsOn: [tasks.at(-1).id] });
  assert.equal(tasks.length, 64);
  writeFileSync(planPath, JSON.stringify({ version: 1, hours: 3, limits: { taskMs: 5000, totalTaskMs: 330_000 }, tasks }));
  const create = spawn(process.execPath, [cli, 'create', database, planPath, root], { stdio: 'ignore' });
  assert.equal((await once(create, 'close'))[0], 0);

  const first = run(t, database);
  await until(() => first.latest);
  assert.equal(first.latest.status, 'ready');
  assert.ok(first.latest.tasks.every(task => task.attempts === 0));
  first.command('start');
  await until(() => first.latest.tasks.some(task => task.status === 'succeeded'));
  const deadline = first.latest.deadline;
  first.command('pause\nquit');
  assert.equal((await first.closed)[0], 0, first.errors);
  let store = new Store(database);
  const paused = store.get(); store.close();
  assert.equal(paused.status, 'paused');
  const preserved = paused.tasks.filter(task => task.status === 'succeeded');
  assert.ok(preserved.length >= 1);

  const second = run(t, database);
  await until(() => second.latest);
  assert.equal(second.latest.status, 'paused');
  assert.equal(second.latest.deadline, deadline);
  await new Promise(r => setTimeout(r, 250));
  second.command('status');
  await until(() => second.states.length >= 2);
  assert.deepEqual(second.latest.tasks.map(task => task.attempts), paused.tasks.map(task => task.attempts));
  if (paused.tasks.some(task => task.status === 'interrupted')) second.command('retry');
  second.command('resume');
  await until(() => ['succeeded', 'failed', 'expired', 'budget_exhausted'].includes(second.latest.status));
  assert.equal(second.latest.status, 'succeeded', JSON.stringify(second.latest));
  second.command('quit');
  assert.equal((await second.closed)[0], 0, second.errors);
  store = new Store(database);
  try {
    const state = store.get(), events = store.events();
    assert.equal(state.deadline, deadline);
    assert.equal(state.spentMicros, 0);
    assert.equal(state.tasks.filter(task => task.status === 'succeeded').length, 64);
    for (const task of preserved) assert.equal(state.tasks.find(item => item.id === task.id).attempts, task.attempts);
    const verifications = state.tasks.filter(task => task.kind === 'verify-module');
    for (const task of verifications) assert.match(task.result.summary, /# pass 2/);
    assert.ok(events.some(event => event.kind === 'pause'));
    assert.ok(events.some(event => event.kind === 'resume'));
    t.diagnostic(JSON.stringify({ tasks: 64, generatedModules: 31, generatedTestsPassed: 62,
      auditEvents: events.length, reservedTaskMs: state.reservedTaskMs, spentMicros: state.spentMicros,
      durationMs: Math.round(performance.now() - started), realThreeHourSoak: false }));
  } finally { store.close(); }
});
