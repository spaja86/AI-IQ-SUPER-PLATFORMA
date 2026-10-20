import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawn, type ChildProcess } from 'node:child_process';
import { once } from 'node:events';
import { request as httpRequest } from 'node:http';
import { DatabaseSync } from 'node:sqlite';
import { PilotStore } from '../../lib/suoc-pilot/store';
import { tick } from '../../lib/suoc-pilot/worker';
import { PILOT_EXAMPLE, validatePlan } from '../../lib/suoc-pilot/plan';

function fixture() {
  const directory = mkdtempSync(join(tmpdir(), 'suoc-pilot-test-'));
  const path = join(directory, 'pilot.sqlite');
  const store = new PilotStore(path);
  return { store, path, directory, close: () => { store.close(); rmSync(directory, { recursive: true, force: true }); } };
}
const clone = () => structuredClone(PILOT_EXAMPLE);

test('A→B binds persisted output: 6 then 21, with durable ordered audit', async () => {
  const f = fixture();
  try {
    const run = f.store.create(clone());
    assert.equal(run.status, 'paused'); assert.equal(await tick(f.store), false);
    f.store.control(run.id, 'resume'); await tick(f.store);
    let saved = f.store.get(run.id);
    assert.equal(saved.steps[0].result?.output, 6); assert.equal(saved.steps[1].attempts, 0);
    await tick(f.store); saved = f.store.get(run.id);
    assert.equal(saved.status, 'succeeded'); assert.equal(saved.steps[1].result?.output, 21);
    assert.equal(saved.steps[1].result?.input.start, 6);
    assert.deepEqual(f.store.events(run.id).map(event => event.kind), ['created', 'resume', 'claimed', 'succeeded', 'claimed', 'succeeded']);
    assert.equal(await tick(f.store), false);
  } finally { f.close(); }
});

test('pause persists at a step boundary; cancel prevents dependent execution', async () => {
  const f = fixture();
  try {
    const run = f.store.create(clone()); f.store.control(run.id, 'resume'); await tick(f.store);
    f.store.control(run.id, 'pause'); assert.equal(await tick(f.store), false);
    f.store.control(run.id, 'cancel'); assert.equal(await tick(f.store), false);
    const saved = f.store.get(run.id);
    assert.deepEqual(saved.steps.map(step => step.status), ['succeeded', 'canceled']);
    assert.throws(() => f.store.control(run.id, 'resume'), /Završeni/);
  } finally { f.close(); }
});

test('incomplete result blocks dependencies and retry is explicit, paused and bounded', async () => {
  const f = fixture();
  try {
    const plan = clone(); plan.steps[0].request.input.maxIterations = 1;
    const run = f.store.create(plan); f.store.control(run.id, 'resume'); await tick(f.store);
    assert.equal(f.store.get(run.id).status, 'failed'); assert.equal(f.store.get(run.id).steps[1].attempts, 0);
    assert.equal(f.store.get(run.id).steps[0].result?.completed, false);
    for (let attempt = 2; attempt <= 3; attempt++) {
      f.store.control(run.id, 'retry'); assert.equal(await tick(f.store), false);
      f.store.control(run.id, 'resume'); await tick(f.store);
      assert.equal(f.store.get(run.id).steps[0].attempts, attempt);
    }
    assert.throws(() => f.store.control(run.id, 'retry'), /3 pokušaja/);
  } finally { f.close(); }
});

test('dependency output is revalidated before the next numerical runner', async () => {
  const f = fixture();
  try {
    const plan = clone(); plan.steps[1].request.input.end = 2;
    const run = f.store.create(plan); f.store.control(run.id, 'resume'); await tick(f.store); await tick(f.store);
    assert.equal(f.store.get(run.id).status, 'failed');
    assert.equal(f.store.get(run.id).steps[0].status, 'succeeded');
  } finally { f.close(); }
});

for (const [name, value] of [
  ['cycle', { name: 'cycle', steps: [{ ...clone().steps[0], dependsOn: ['B'] }, clone().steps[1]] }],
  ['unknown dependency', { name: 'missing', steps: [{ ...clone().steps[0], dependsOn: ['missing'] }] }],
  ['duplicate ID', { name: 'duplicate', steps: [clone().steps[0], clone().steps[0]] }],
  ['unknown field', { ...clone(), command: 'shell' }],
  ['excess budget', { name: 'large', steps: [0, 1].map(i => ({ id: `S${i}`, request: { ...clone().steps[0].request, input: { ...clone().steps[0].request.input, maxIterations: 600 } } })) }],
  ['invalid request', { name: 'invalid', steps: [{ id: 'A', request: { version: '9' } }] }],
  ['missing binding dependency', { name: 'binding', steps: [{ ...clone().steps[0], startFrom: 'A' }] }],
] as const) test(`invalid plan rejected without a persisted run: ${name}`, () => {
  const f = fixture();
  try { assert.throws(() => f.store.create(value)); assert.deepEqual(f.store.list(), []); }
  finally { f.close(); }
});

test('validation accepts out-of-order DAG and worker executes dependencies first', async () => {
  const f = fixture();
  try {
    const plan = clone(); plan.steps.reverse(); validatePlan(plan);
    const run = f.store.create(plan); f.store.control(run.id, 'resume'); await tick(f.store); await tick(f.store);
    assert.equal(f.store.get(run.id).status, 'succeeded');
    assert.deepEqual(f.store.events(run.id).filter(e => e.kind === 'claimed').map(e => e.detail), ['A', 'B']);
  } finally { f.close(); }
});

test('second store cannot own an active database; returned states are detached', () => {
  const f = fixture();
  try {
    assert.throws(() => new PilotStore(f.path), /drugom procesu/);
    const run = f.store.create(clone()); run.name = 'changed';
    assert.notEqual(f.store.get(run.id).name, 'changed');
  } finally { f.close(); }
});

test('state and event metadata tampering fail closed on reopen', () => {
  for (const sql of ["UPDATE runs SET document='{}'", "UPDATE events SET detail='changed'", 'DELETE FROM events']) {
    const f = fixture(); f.store.create(clone()); f.store.close();
    const db = new DatabaseSync(f.path); db.exec(sql); db.close();
    assert.throws(() => new PilotStore(f.path), /zapis|lanac/);
    rmSync(f.directory, { recursive: true, force: true });
  }
});

test('failed audit insert rolls back the matching state update', () => {
  const f = fixture();
  try {
    const run = f.store.create(clone()), before = f.store.get(run.id);
    const db = new DatabaseSync(f.path);
    db.exec("CREATE TRIGGER fail_event BEFORE INSERT ON events BEGIN SELECT RAISE(ABORT, 'injected write failure'); END;");
    try {
      assert.throws(() => f.store.control(run.id, 'resume'), /injected write failure/);
      assert.deepEqual(f.store.get(run.id), before);
      assert.equal(f.store.events(run.id).length, 1);
    } finally { db.exec('DROP TRIGGER fail_event'); db.close(); }
  } finally { f.close(); }
});

test('failed result commit cannot become success and restart requires retry of B only', async () => {
  const f = fixture();
  const run = f.store.create(clone()); f.store.control(run.id, 'resume'); await tick(f.store);
  const confirmedA = f.store.get(run.id).steps[0];
  const db = new DatabaseSync(f.path);
  db.exec("CREATE TRIGGER fail_result BEFORE INSERT ON events WHEN NEW.kind='succeeded' BEGIN SELECT RAISE(ABORT, 'injected result write failure'); END;");
  try {
    await assert.rejects(tick(f.store), /injected result write failure/);
    const state = f.store.get(run.id);
    assert.equal(state.status, 'running'); assert.equal(state.steps[1].result, undefined);
    assert.deepEqual(state.steps[0], confirmedA);
    assert.equal(f.store.events(run.id).filter(event => event.kind === 'succeeded').length, 1);
  } finally { db.exec('DROP TRIGGER fail_result'); db.close(); f.store.close(); }
  const reopened = new PilotStore(f.path);
  try {
    assert.equal(reopened.get(run.id).status, 'interrupted'); assert.equal(await tick(reopened), false);
    reopened.control(run.id, 'retry'); reopened.control(run.id, 'resume'); await tick(reopened);
    const recovered = reopened.get(run.id);
    assert.equal(recovered.status, 'succeeded'); assert.deepEqual(recovered.steps[0], confirmedA);
    assert.deepEqual(recovered.steps.map(step => step.attempts), [1, 2]);
    assert.equal(recovered.steps[1].result?.output, 21);
  } finally { reopened.close(); rmSync(f.directory, { recursive: true, force: true }); }
});

test('queued and paused states survive reopen with their execution intent', async () => {
  const f = fixture();
  const paused = f.store.create(clone()), queued = f.store.create(clone());
  f.store.control(queued.id, 'resume'); f.store.close();
  const store = new PilotStore(f.path);
  try {
    assert.equal(store.get(paused.id).status, 'paused');
    await tick(store); await tick(store);
    assert.equal(store.get(queued.id).status, 'succeeded');
    assert.equal(store.get(paused.id).steps[0].attempts, 0);
  } finally { store.close(); rmSync(f.directory, { recursive: true, force: true }); }
});

async function launch(path: string, crashBeforeBCommit = false) {
  // Test-only fault injection in the real worker: compute B, then die before result commit.
  const crashScript = `import { PilotStore } from './src/lib/suoc-pilot/store.ts';
    const finish = PilotStore.prototype.finish;
    PilotStore.prototype.finish = function(id, stepId, result, error) {
      if (stepId === 'B') { process.kill(process.pid, 'SIGKILL'); return; }
      return finish.call(this, id, stepId, result, error);
    };
    await import('./scripts/suoc-pilot.ts');`;
  const args = crashBeforeBCommit ? ['--import', 'tsx', '--input-type=module', '-e', crashScript] : ['--import', 'tsx', 'scripts/suoc-pilot.ts'];
  const child = spawn(process.execPath, args, { cwd: resolve('.'), env: { ...process.env, SUOC_PILOT_DB: path, SUOC_PILOT_PORT: '0' }, stdio: ['ignore', 'pipe', 'pipe'] });
  let stdout = '', stderr = '';
  child.stdout!.on('data', data => { stdout += data; }); child.stderr!.on('data', data => { stderr += data; });
  const deadline = Date.now() + 15000;
  while (Date.now() < deadline) {
    const origin = /SUOC pilot: (http:\/\/127\.0\.0\.1:\d+)/.exec(stdout)?.[1];
    if (origin) return { child, origin };
    if (child.exitCode !== null) throw new Error(stderr);
    await new Promise(accept => setTimeout(accept, 30));
  }
  child.kill('SIGKILL'); throw new Error(`Server nije pokrenut: ${stderr}`);
}
async function stop(child: ChildProcess, signal: NodeJS.Signals = 'SIGTERM') {
  if (child.exitCode !== null || child.signalCode !== null) return;
  const done = once(child, 'exit'); child.kill(signal); await done;
}
async function rawStatus(origin: string, headers: Record<string, string>) {
  return new Promise<number>((accept, reject) => {
    const request = httpRequest(`${origin}/api/runs`, { headers }, response => { response.resume(); accept(response.statusCode!); });
    request.on('error', reject); request.end();
  });
}

test('real HTTP process: create/resume/result, security boundary, SIGKILL/restart persistence', { timeout: 30000 }, async () => {
  const directory = mkdtempSync(join(tmpdir(), 'suoc-http-test-')), path = join(directory, 'pilot.sqlite');
  let app = await launch(path);
  const headers = { 'X-SUOC-Pilot': '1', 'Content-Type': 'application/json' };
  try {
    assert.equal((await fetch(app.origin)).status, 200);
    assert.equal((await fetch(`${app.origin}/api/runs`)).status, 403);
    assert.equal((await fetch(`${app.origin}/api/runs`, { headers: { ...headers, Origin: 'https://evil.example' } })).status, 403);
    assert.equal(await rawStatus(app.origin, { ...headers, Host: 'evil.example' }), 403);
    assert.equal(await rawStatus(app.origin, { ...headers, 'Sec-Fetch-Site': 'cross-site' }), 403);
    assert.equal((await fetch(`${app.origin}/api/runs`, { method: 'POST', headers, body: '{' })).status, 400);
    assert.deepEqual(await (await fetch(`${app.origin}/api/runs`, { headers })).json(), []);
    const response = await fetch(`${app.origin}/api/runs`, { method: 'POST', headers, body: JSON.stringify(clone()) });
    assert.equal(response.status, 201); const created = await response.json();
    assert.equal(created.status, 'paused');
    assert.equal((await fetch(`${app.origin}/api/runs/${created.id}/resume`, { method: 'POST', headers })).status, 200);
    let saved;
    for (let i = 0; i < 80; i++) {
      saved = await (await fetch(`${app.origin}/api/runs/${created.id}`, { headers })).json();
      if (saved.run.status === 'succeeded') break;
      await new Promise(accept => setTimeout(accept, 50));
    }
    assert.equal(saved.run.status, 'succeeded'); assert.equal(saved.run.steps[1].result.output, 21);
    await stop(app.child, 'SIGKILL'); app = await launch(path);
    const restored = await (await fetch(`${app.origin}/api/runs/${created.id}`, { headers })).json();
    assert.deepEqual(restored, saved);
  } finally { await stop(app.child); rmSync(directory, { recursive: true, force: true }); }
});

test('aborted HTTP plan upload leaves no partial run or success', { timeout: 15000 }, async () => {
  const directory = mkdtempSync(join(tmpdir(), 'suoc-aborted-upload-')), path = join(directory, 'pilot.sqlite');
  const app = await launch(path);
  try {
    await new Promise<void>((accept, reject) => {
      const request = httpRequest(`${app.origin}/api/runs`, { method: 'POST', headers: {
        'X-SUOC-Pilot': '1', 'Content-Type': 'application/json', 'Content-Length': '60000',
      } });
      request.on('error', error => { if (!request.destroyed) reject(error); });
      request.on('close', accept);
      request.write('{"name":"incomplete upload","steps":[');
      setTimeout(() => request.destroy(), 50);
    });
    const headers = { 'X-SUOC-Pilot': '1' };
    assert.deepEqual(await (await fetch(`${app.origin}/api/runs`, { headers })).json(), []);
    assert.equal((await fetch(`${app.origin}/api/status`, { headers })).status, 200);
    await stop(app.child, 'SIGKILL');
    const store = new PilotStore(path);
    try { assert.deepEqual(store.list(), []); } finally { store.close(); }
  } finally { await stop(app.child); rmSync(directory, { recursive: true, force: true }); }
});

test('real HTTP worker SIGKILL after computation cannot confirm B; retry keeps A exactly', { timeout: 30000 }, async () => {
  const directory = mkdtempSync(join(tmpdir(), 'suoc-before-commit-')), path = join(directory, 'pilot.sqlite');
  let app = await launch(path, true);
  const headers = { 'X-SUOC-Pilot': '1', 'Content-Type': 'application/json' };
  try {
    const response = await fetch(`${app.origin}/api/runs`, { method: 'POST', headers, body: JSON.stringify(clone()) });
    assert.equal(response.status, 201); const run = await response.json();
    const died = once(app.child, 'exit');
    await fetch(`${app.origin}/api/runs/${run.id}/resume`, { method: 'POST', headers });
    const [, signal] = await died; assert.equal(signal, 'SIGKILL');
    app = await launch(path);
    const read = async () => (await fetch(`${app.origin}/api/runs/${run.id}`, { headers })).json();
    const recovered = await read();
    assert.equal(recovered.run.status, 'interrupted');
    assert.deepEqual(recovered.run.steps.map((step: { status: string }) => step.status), ['succeeded', 'interrupted']);
    assert.equal(recovered.run.steps[0].result.output, 6); assert.equal(recovered.run.steps[1].result, undefined);
    assert.deepEqual(recovered.events.filter((event: { kind: string }) => event.kind === 'succeeded').map((event: { detail: string }) => event.detail), ['A']);
    await fetch(`${app.origin}/api/runs/${run.id}/retry`, { method: 'POST', headers });
    assert.equal((await read()).run.status, 'paused');
    await fetch(`${app.origin}/api/runs/${run.id}/resume`, { method: 'POST', headers });
    let finished;
    for (let i = 0; i < 80; i++) {
      finished = await read(); if (finished.run.status === 'succeeded') break;
      await new Promise(accept => setTimeout(accept, 50));
    }
    assert.equal(finished.run.status, 'succeeded');
    assert.deepEqual(finished.run.steps[0], recovered.run.steps[0]);
    assert.deepEqual(finished.run.steps.map((step: { attempts: number }) => step.attempts), [1, 2]);
    assert.equal(finished.run.steps[1].result.output, 21);
    assert.deepEqual(finished.events.filter((event: { kind: string }) => event.kind === 'claimed').map((event: { detail: string }) => event.detail), ['A', 'B', 'B']);
  } finally { await stop(app.child); rmSync(directory, { recursive: true, force: true }); }
});

test('SIGKILL after durable claim marks interrupted; retry preserves completed A', { timeout: 15000 }, async () => {
  const f = fixture();
  const run = f.store.create(clone()); f.store.control(run.id, 'resume'); await tick(f.store); f.store.close();
  const child = spawn(process.execPath, ['--import', 'tsx', '--input-type=module', '-e', `import { PilotStore } from './src/lib/suoc-pilot/store.ts'; const store = new PilotStore(process.env.SUOC_TEST_DB); store.claim(); console.log('claimed'); setInterval(() => {}, 1000);`], { env: { ...process.env, SUOC_TEST_DB: f.path }, stdio: ['ignore', 'pipe', 'pipe'] });
  let reopened: PilotStore | undefined;
  try {
    const data = await Promise.race([once(child.stdout!, 'data'), once(child, 'exit').then(() => { throw new Error('Claim process failed'); })]);
    assert.match(String(data[0]), /claimed/); await stop(child, 'SIGKILL');
    reopened = new PilotStore(f.path);
    const recovered = reopened.get(run.id);
    assert.equal(recovered.status, 'interrupted'); assert.deepEqual(recovered.steps.map(step => step.status), ['succeeded', 'interrupted']);
    assert.equal(await tick(reopened), false);
    reopened.control(run.id, 'retry'); assert.equal(await tick(reopened), false);
    reopened.control(run.id, 'resume'); await tick(reopened);
    const finished = reopened.get(run.id);
    assert.equal(finished.status, 'succeeded'); assert.deepEqual(finished.steps.map(step => step.attempts), [1, 2]);
    assert.equal(finished.steps[1].result?.output, 21);
  } finally { await stop(child, 'SIGKILL'); reopened?.close(); rmSync(f.directory, { recursive: true, force: true }); }
});
