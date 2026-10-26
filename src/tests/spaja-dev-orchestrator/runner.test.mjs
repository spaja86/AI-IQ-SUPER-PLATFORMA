import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, readFileSync, writeFileSync, symlinkSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fork, spawn } from 'node:child_process';
import { once } from 'node:events';
import { Store } from '../../../scripts/spaja-dev-orchestrator/store.mjs';
import { Runner } from '../../../scripts/spaja-dev-orchestrator/runner.mjs';
import { DEFAULT_LIMITS, manifest } from '../../../scripts/spaja-dev-orchestrator/policy.mjs';

const root = resolve(import.meta.dirname, '../../..');
const cli = join(root, 'scripts/spaja-dev-orchestrator/cli.mjs');
const supervisorPath = join(root, 'scripts/spaja-dev-orchestrator/supervisor.mjs');
const plan = operation => ({ version: 1, tasks: [
  { id: 'generate', kind: 'generate-module', moduleName: 'spaja', operation },
  { id: 'verify', kind: 'verify-module', source: 'generate', dependsOn: ['generate'] },
] });
function temporary(t) {
  const dir = mkdtempSync(join(tmpdir(), 'spaja-dev-runner-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  return dir;
}
function fixture(t, input = plan('sum')) {
  const dir = temporary(t);
  const store = new Store(join(dir, 'queue.sqlite'));
  store.create(input, dir);
  const runner = new Runner(store);
  t.after(async () => { await runner.close(); store.close(); });
  return { dir, store, runner };
}
async function waitUntil(check, ms = 10_000) {
  const end = Date.now() + ms;
  while (!check()) { if (Date.now() >= end) throw new Error('Condition timeout'); await new Promise(r => setTimeout(r, 20)); }
}

for (const operation of ['sum', 'clamp']) test(`real ${operation} generation and Node tests produce durable evidence`, async t => {
  const { store, runner } = fixture(t, plan(operation));
  assert.equal(await runner.tick(), false);
  await runner.control('start');
  await runner.tick();
  assert.equal(store.get().tasks[0].status, 'succeeded', JSON.stringify(store.get()));
  await runner.tick();
  const state = store.get();
  assert.equal(state.status, 'succeeded', JSON.stringify(state));
  assert.match(state.tasks[1].result.summary, /# pass 2/);
  assert.match(readFileSync(join(state.tasks[0].result.artifact, 'spaja.mjs'), 'utf8'), /export function calculate/);
  assert.equal(state.spentMicros, 0);
});

test('tampered generated source prevents test execution', async t => {
  const { store, runner } = fixture(t);
  await runner.control('start'); await runner.tick();
  const source = store.get().tasks[0];
  writeFileSync(join(source.result.artifact, 'spaja.mjs'), 'throw new Error("unapproved code")');
  await runner.tick();
  assert.equal(store.get().status, 'failed');
  assert.match(store.get().tasks[1].result.summary, /artifact changed/);
});

test('source inventory hashes actual files and rejects symlink escape', async t => {
  const { dir, store, runner } = fixture(t, { version: 1, tasks: [{ id: 'inventory', kind: 'file-manifest', files: ['readme.md'] }] });
  writeFileSync(join(dir, 'readme.md'), 'SPAJA');
  await runner.control('start'); await runner.tick();
  assert.equal(store.get().status, 'succeeded', JSON.stringify(store.get()));
  const output = JSON.parse(readFileSync(join(store.get().tasks[0].result.artifact, 'manifest.json')));
  assert.deepEqual(output, manifest(dir, ['readme.md']));
  symlinkSync('/etc/passwd', join(dir, 'escape.md'));
  assert.throws(() => manifest(dir, ['escape.md']), /Symlinks/);
});

test('simultaneous ticks claim only one task', async t => {
  const { store, runner } = fixture(t);
  await runner.control('start');
  const outcomes = await Promise.all([runner.tick(), runner.tick(), runner.tick()]);
  assert.equal(outcomes.filter(Boolean).length, 1);
  assert.equal(store.get().tasks[0].attempts, 1);
});

test('pause aborts in-flight work and leaves dependency untouched', async t => {
  const { store, runner } = fixture(t);
  await runner.control('start');
  const executing = runner.tick();
  await runner.control('pause');
  await executing;
  assert.equal(store.get().status, 'paused');
  assert.equal(store.get().tasks[0].status, 'interrupted');
  assert.equal(store.get().tasks[1].attempts, 0);
});

// Raw supervisor test inputs are test fixtures, not accepted by CLI/plan adapters.
async function supervised(t, code, overrides = {}) {
  const dir = temporary(t);
  const child = fork(supervisorPath, [], { execArgv: [], stdio: ['ignore', 'ignore', 'pipe', 'ipc'], env: {} });
  t.after(() => { if (child.connected) child.disconnect(); });
  child.stderr.resume();
  let result;
  child.on('message', m => { if (m.type === 'result') result = m.result; });
  child.send({ type: 'execute', args: ['--permission', '--max-old-space-size=64', '-e', code],
    directory: dir, timeoutMs: 3000, limits: { ...DEFAULT_LIMITS, ...overrides.limits }, ...overrides,
  });
  await once(child, 'close');
  return result;
}
test('timeout stops a real busy task', async t => {
  const result = await supervised(t, 'while (true) {}', { timeoutMs: 200 });
  assert.equal(result.ok, false); assert.equal(result.reason, 'task-timeout');
});
test('a delayed supervisor refuses work after the persisted lease deadline', async t => {
  const result = await supervised(t, 'console.log("must not execute")', { expiresAt: Date.now() - 1 });
  assert.equal(result.ok, false); assert.equal(result.reason, 'task-timeout');
  assert.equal(result.summary, '');
});
test('output flood is bounded and terminates task', async t => {
  const result = await supervised(t, 'setInterval(() => process.stdout.write("X".repeat(8192)), 1)');
  assert.equal(result.ok, false); assert.equal(result.reason, 'output-limit');
  assert.ok(Buffer.byteLength(result.summary) <= DEFAULT_LIMITS.outputBytes);
});
test('RSS ceiling is monitored independently of task event loop', async t => {
  const result = await supervised(t, 'const a=[]; setInterval(() => a.push(Buffer.alloc(16*1024*1024, 1)), 10)', { limits: { ...DEFAULT_LIMITS, rssMb: 80 } });
  assert.equal(result.ok, false); assert.equal(result.reason, 'rss-limit');
});
test('task cannot spawn children or receive parent credentials', async t => {
  const before = process.env.SPAJA_TEST_SECRET;
  process.env.SPAJA_TEST_SECRET = 'fixture-do-not-inherit';
  try {
    const result = await supervised(t, 'if(process.env.SPAJA_TEST_SECRET) throw Error("credential leaked"); try { require("node:child_process").spawnSync("true"); throw Error("child allowed"); } catch(e) { if(e.code !== "ERR_ACCESS_DENIED") throw e; }');
    assert.equal(result.ok, true, result.summary);
  } finally { if (before === undefined) delete process.env.SPAJA_TEST_SECRET; else process.env.SPAJA_TEST_SECRET = before; }
});
test('supervisor kills task when parent IPC disconnects', async t => {
  const dir = temporary(t);
  const child = fork(supervisorPath, [], { execArgv: [], stdio: ['ignore', 'ignore', 'ignore', 'ipc'] });
  const started = once(child, 'message');
  const exited = once(child, 'exit');
  child.send({ type: 'execute', args: ['-e', 'setInterval(()=>{},1000)'], directory: dir, timeoutMs: 30_000, limits: DEFAULT_LIMITS });
  await started;
  child.disconnect();
  await Promise.race([exited, new Promise((_, reject) => { const timer = setTimeout(() => reject(new Error('Orphan supervisor')), 5000); timer.unref(); })]);
});

test('CLI create/run is inert; SIGKILL restart retains pause and requires resume', async t => {
  const dir = temporary(t), database = join(dir, 'queue.sqlite'), planPath = join(dir, 'plan.json');
  writeFileSync(planPath, JSON.stringify(plan('sum')));
  const create = spawn(process.execPath, [cli, 'create', database, planPath, dir], { stdio: 'pipe' });
  let created = ''; create.stdout.on('data', x => created += x); create.stderr.resume();
  const [code] = await once(create, 'close');
  assert.equal(code, 0); assert.match(created, /"status":"ready"/);
  const run = spawn(process.execPath, [cli, 'run', database], { stdio: 'pipe' });
  t.after(() => run.kill('SIGKILL'));
  let text = ''; run.stdout.on('data', x => text += x); run.stderr.resume();
  await waitUntil(() => text.includes('"status":"ready"'));
  run.stdin.write('start\npause\n');
  await waitUntil(() => text.includes('"status":"paused"'));
  run.kill('SIGKILL'); await once(run, 'close');
  const store = new Store(database); t.after(() => store.close());
  assert.equal(store.get().status, 'paused');
  assert.equal(store.get().tasks[0].attempts, 0);
  assert.equal(store.claim(), null);
});

test('CLI quit releases database and exits even if caller keeps stdin open', async t => {
  const dir = temporary(t), database = join(dir, 'queue.sqlite');
  const store = new Store(database); store.create(plan('sum')); store.close();
  const run = spawn(process.execPath, [cli, 'run', database], { stdio: 'pipe' });
  t.after(() => run.kill('SIGKILL'));
  let text = ''; run.stdout.on('data', x => text += x); run.stderr.resume();
  await waitUntil(() => text.includes('"status":"ready"'));
  const exited = once(run, 'exit'); run.stdin.write('quit\n');
  const [code] = await Promise.race([exited, new Promise((_, reject) => {
    const timer = setTimeout(() => reject(new Error('CLI did not exit')), 5000); timer.unref();
  })]);
  assert.equal(code, 0);
  const reopened = new Store(database); reopened.close();
});

test('SIGKILL after durable claim recovers only uncertain work, preserving prior result', async t => {
  const dir = temporary(t), database = join(dir, 'queue.sqlite');
  let store = new Store(database); store.create(plan('sum'), dir); store.control('start');
  const a = store.claim(); store.finish(a.token, { ok: true, summary: 'already confirmed' }); store.close();
  const script = `import { Store } from ${JSON.stringify(new URL('../../../scripts/spaja-dev-orchestrator/store.mjs', import.meta.url).href)};
    const store = new Store(process.argv[1]); store.control('resume');
    const task = store.claim(); process.send({task:task.task.id}); setInterval(()=>{},1000);`;
  const child = spawn(process.execPath, ['--input-type=module', '-e', script, database], { stdio: ['ignore', 'ignore', 'pipe', 'ipc'] });
  child.stderr.resume();
  t.after(() => child.kill('SIGKILL'));
  const [message] = await once(child, 'message'); assert.equal(message.task, 'verify');
  const exited = once(child, 'exit'); child.kill('SIGKILL'); await exited;
  store = new Store(database); t.after(() => store.close());
  assert.equal(store.get().status, 'paused');
  assert.equal(store.get().tasks[0].status, 'succeeded');
  assert.equal(store.get().tasks[0].attempts, 1);
  assert.equal(store.get().tasks[1].status, 'interrupted');
  assert.equal(store.claim(), null);
});

test('independent watchdog stops task even after supervisor SIGKILL', async t => {
  const dir = temporary(t), heartbeat = join(dir, 'heartbeat');
  const supervisor = fork(supervisorPath, [], { execArgv: [], stdio: ['ignore', 'ignore', 'ignore', 'ipc'] });
  t.after(() => supervisor.kill('SIGKILL'));
  const code = `const fs=require('node:fs');setInterval(()=>fs.writeFileSync(${JSON.stringify(heartbeat)},String(Date.now())),20);`;
  supervisor.send({ type: 'execute', args: ['-e', code], directory: dir, timeoutMs: 1500, limits: DEFAULT_LIMITS });
  await waitUntil(() => existsSync(heartbeat));
  const exited = once(supervisor, 'exit'); supervisor.kill('SIGKILL'); await exited;
  // Deliberately allow the independent watchdog's 1.5s + 0.2s kill grace to elapse.
  await new Promise(r => setTimeout(r, 2000));
  const last = readFileSync(heartbeat, 'utf8');
  await new Promise(r => setTimeout(r, 200));
  assert.equal(readFileSync(heartbeat, 'utf8'), last);
});
