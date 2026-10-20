import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createRequire } from 'node:module';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { startPilot } from '../../lib/suoc-pilot/server.ts';
import { PILOT_EXAMPLE } from '../../lib/suoc-pilot/plan.ts';

// Optional browser tooling, outside the production dependency tree. See the review doc.
const { chromium } = createRequire(import.meta.url)(process.env.SUOC_PLAYWRIGHT_MODULE || 'playwright');
let browser;
before(async () => {
  browser = await chromium.launch({ headless: true,
    ...(process.env.SUOC_CHROMIUM_EXECUTABLE ? { executablePath: process.env.SUOC_CHROMIUM_EXECUTABLE } : {}),
    args: JSON.parse(process.env.SUOC_CHROMIUM_ARGS || '[]'),
  });
});
after(async () => { await browser?.close(); });

async function fixture(t, intervalMs = 150) {
  const directory = mkdtempSync(join(tmpdir(), 'suoc-browser-review-'));
  const options = { database: join(directory, 'pilot.sqlite'), port: 0, assets: resolve('pilot/suoc'), intervalMs };
  let app = await startPilot(options);
  const origin = app.origin;
  options.port = Number(new URL(origin).port);
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  t.after(async () => { await context.close(); await app?.close(); rmSync(directory, { recursive: true, force: true }); assert.deepEqual(errors, []); });
  const api = async (path, method = 'GET', value) => {
    const response = await fetch(origin + path, { method, headers: { 'X-SUOC-Pilot': '1', 'Content-Type': 'application/json' }, ...(value === undefined ? {} : { body: JSON.stringify(value) }) });
    assert.ok(response.ok, `${path}: ${response.status}`);
    return response.json();
  };
  return { page, api, origin, directory,
    stop: async () => { await app.close(); app = undefined; },
    restart: async () => { app = await startPilot(options); },
  };
}
async function waitText(page, id, text) {
  await page.waitForFunction(({ id, text }) => document.getElementById(id)?.textContent.includes(text), { id, text });
}
async function createInPanel(page, name) {
  await page.locator('#plan').fill('');
  await page.locator('#example').click();
  await page.waitForFunction(() => document.getElementById('plan').value.includes('A → B: sačuvan VRH rezultat'));
  const plan = JSON.parse(await page.locator('#plan').inputValue()); plan.name = name;
  await page.locator('#plan').fill(JSON.stringify(plan));
  await page.locator('#create').click(); await waitText(page, 'detail-title', name);
}

test('browser: create A→B, run, inspect 6/21, reload and restart preserve results', { timeout: 20000 }, async t => {
  const f = await fixture(t); const { page } = f;
  await page.goto(f.origin); await waitText(page, 'health', 'dostupan');
  await createInPanel(page, 'Browser A → B');
  await page.locator('[data-action=resume]').click(); await waitText(page, 'run-status', 'Potvrđeno završeno');
  assert.match(await page.locator('#steps').innerText(), /Rezultat: 6\./);
  assert.match(await page.locator('#steps').innerText(), /Rezultat: 21\./);
  const [saved] = await f.api('/api/runs'); const before = await f.api(`/api/runs/${saved.id}`);
  assert.deepEqual(before.run.steps.map(s => s.attempts), [1, 1]);
  await page.reload(); await waitText(page, 'run-status', 'Potvrđeno završeno');
  await f.stop(); await f.restart(); await page.reload(); await waitText(page, 'run-status', 'Potvrđeno završeno');
  assert.deepEqual(await f.api(`/api/runs/${saved.id}`), before);
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
});

test('browser: pause at A boundary, resume B; cancel another run preserves A', { timeout: 30000 }, async t => {
  // Slow only the scheduler interval, not the real HTTP or numeric runner, to make boundaries observable.
  const f = await fixture(t, 2500); const { page } = f;
  await page.goto(f.origin); await waitText(page, 'health', 'dostupan');
  await createInPanel(page, 'Pause after A'); await page.locator('[data-action=resume]').click();
  t.diagnostic('Created and resumed first run');
  await waitText(page, 'progress', '1/2'); await page.locator('[data-action=pause]').click(); await waitText(page, 'run-status', 'pauzirano');
  const [run] = await f.api('/api/runs'); const paused = await f.api(`/api/runs/${run.id}`);
  t.diagnostic('Paused after A');
  await page.waitForTimeout(2700);
  assert.deepEqual(await f.api(`/api/runs/${run.id}`), paused);
  await page.locator('[data-action=resume]').click(); await waitText(page, 'run-status', 'Potvrđeno završeno');
  t.diagnostic('Resumed and completed B');
  assert.deepEqual((await f.api(`/api/runs/${run.id}`)).run.steps.map(s => s.attempts), [1, 1]);
  await createInPanel(page, 'Cancel after A'); await page.locator('[data-action=resume]').click();
  await waitText(page, 'progress', '1/2'); await page.locator('[data-action=cancel]').click(); await waitText(page, 'run-status', 'Otkazano');
  const canceled = await f.api(`/api/runs/${(await f.api('/api/runs'))[0].id}`);
  assert.deepEqual(canceled.run.steps.map(s => s.status), ['succeeded', 'canceled']);
  assert.deepEqual(canceled.run.steps.map(s => s.attempts), [1, 0]);
});

test('browser: malformed input and incomplete VRH never show success; retry is explicit', { timeout: 20000 }, async t => {
  const f = await fixture(t); const { page } = f;
  await page.goto(f.origin); await waitText(page, 'health', 'dostupan');
  await page.locator('#plan').fill('{'); await page.locator('#create').click();
  await page.locator('#error').waitFor({ state: 'visible' }); assert.deepEqual(await f.api('/api/runs'), []);
  const plan = structuredClone(PILOT_EXAMPLE); plan.name = 'Incomplete'; plan.steps[0].request.input.maxIterations = 1;
  await page.locator('#plan').fill(JSON.stringify(plan)); await page.locator('#create').click(); await waitText(page, 'detail-title', 'Incomplete');
  await page.locator('[data-action=resume]').click(); await waitText(page, 'run-status', 'Neuspešno');
  assert.match(await page.locator('#progress').innerText(), /0\/2/);
  await page.locator('[data-action=retry]').click(); await waitText(page, 'run-status', 'pauzirano');
  const [run] = await f.api('/api/runs');
  assert.deepEqual((await f.api(`/api/runs/${run.id}`)).run.steps.map(s => s.attempts), [1, 0]);
  await page.locator('[data-action=resume]').click(); await waitText(page, 'run-status', 'Neuspešno');
  assert.deepEqual((await f.api(`/api/runs/${run.id}`)).run.steps.map(s => s.attempts), [2, 0]);
});

test('browser: changing selection during delayed refresh never controls a different visible run', { timeout: 20000 }, async t => {
  const f = await fixture(t); const { page } = f;
  const a = await f.api('/api/runs', 'POST', { ...structuredClone(PILOT_EXAMPLE), name: 'Task Alpha' });
  const b = await f.api('/api/runs', 'POST', { ...structuredClone(PILOT_EXAMPLE), name: 'Task Beta' });
  await page.goto(f.origin); await waitText(page, 'detail-title', 'Task Beta');
  await page.getByRole('button', { name: /Task Alpha/ }).click(); await waitText(page, 'detail-title', 'Task Alpha');
  let release, observed;
  const held = new Promise(resolve => { release = resolve; });
  const requested = new Promise(resolve => { observed = resolve; });
  let delayed = false;
  await page.route(`**/api/runs/${a.id}`, async route => {
    if (delayed) return route.continue();
    delayed = true; const response = await route.fetch(); observed(); await held;
    await route.fulfill({ response });
  });
  t.after(() => release());
  await page.locator('#refresh').click(); await requested;
  await page.getByRole('button', { name: /Task Beta/ }).click();
  const delivered = page.waitForResponse(response => response.url().endsWith(`/api/runs/${a.id}`));
  release(); await delivered;
  await page.locator('#detail').waitFor({ state: 'visible' });
  const visibleName = await page.locator('#detail-title').innerText();
  await page.locator('[data-action=cancel]').click(); await waitText(page, 'run-status', 'Otkazano');
  const states = await f.api('/api/runs'); const canceled = states.filter(run => run.status === 'canceled');
  assert.equal(canceled.length, 1); assert.equal(canceled[0].name, visibleName, 'The command must target the run visible to the operator');
  assert.equal(canceled[0].id, b.id);
});

test('browser: service loss invalidates visible success and recovery clears connection error', { timeout: 20000 }, async t => {
  const f = await fixture(t); const { page } = f;
  await page.goto(f.origin); await waitText(page, 'health', 'dostupan');
  await createInPanel(page, 'Connection recovery'); await page.locator('[data-action=resume]').click(); await waitText(page, 'run-status', 'Potvrđeno završeno');
  await f.stop(); await page.locator('#refresh').click(); await waitText(page, 'health', 'nije dostupan');
  assert.equal(await page.locator('#detail').isVisible(), false, 'Unverified cached success must not remain as the current detail');
  assert.equal(await page.locator('#runs .done').count(), 0);
  await f.restart(); await page.locator('#refresh').click(); await page.locator('#detail').waitFor({ state: 'visible' }); await waitText(page, 'run-status', 'Potvrđeno završeno');
  assert.equal(await page.locator('#error').isVisible(), false, 'Recovered connection must clear its obsolete error');
});

test('browser: live audit corruption removes cached green state and disables controls', { timeout: 20000 }, async t => {
  const f = await fixture(t); const { page } = f;
  await page.goto(f.origin); await waitText(page, 'health', 'dostupan');
  await createInPanel(page, 'Audit failure'); await page.locator('[data-action=resume]').click(); await waitText(page, 'run-status', 'Potvrđeno završeno');
  const db = new DatabaseSync(join(f.directory, 'pilot.sqlite'));
  db.exec("UPDATE events SET detail='tampered'"); db.close();
  await page.locator('#refresh').click(); await waitText(page, 'health', 'nije dostupan');
  assert.equal(await page.locator('#detail').isVisible(), false);
  assert.equal(await page.locator('#runs .done').count(), 0);
  for (const button of await page.locator('#controls button').all()) assert.equal(await button.isDisabled(), true);
  assert.match(await page.locator('#error').innerText(), /lanac|zapis/);
});

test('browser: SIGKILL before B commit, restart, explicit retry/resume retain confirmed A', { timeout: 20000 }, async t => {
  const directory = mkdtempSync(join(tmpdir(), 'suoc-browser-kill-'));
  let child, port = 0;
  async function stop() {
    if (child && child.exitCode === null && child.signalCode === null) { const exited = once(child, 'exit'); child.kill('SIGTERM'); await exited; }
  }
  async function launch(crash) {
    const script = `import { PilotStore } from './src/lib/suoc-pilot/store.ts';
      const finish = PilotStore.prototype.finish;
      if (${crash}) PilotStore.prototype.finish = function(id, stepId, result, error) {
        if (stepId === 'B') { process.kill(process.pid, 'SIGKILL'); return; }
        return finish.call(this, id, stepId, result, error);
      };
      await import('./scripts/suoc-pilot.ts');`;
    child = spawn(process.execPath, ['--import', 'tsx', '--input-type=module', '-e', script], {
      env: { ...process.env, SUOC_PILOT_DB: join(directory, 'pilot.sqlite'), SUOC_PILOT_PORT: String(port) }, stdio: ['ignore', 'pipe', 'pipe'],
    });
    let output = '', error = ''; child.stdout.on('data', chunk => { output += chunk; }); child.stderr.on('data', chunk => { error += chunk; });
    for (let i = 0; i < 150; i++) {
      const origin = /SUOC pilot: (http:\/\/127\.0\.0\.1:\d+)/.exec(output)?.[1];
      if (origin) { port = Number(new URL(origin).port); return origin; }
      if (child.exitCode !== null) throw new Error(error);
      await new Promise(resolve => setTimeout(resolve, 30));
    }
    throw new Error(`Service did not start: ${error}`);
  }
  const context = await browser.newContext(); const page = await context.newPage();
  t.after(async () => { await context.close(); await stop(); rmSync(directory, { recursive: true, force: true }); });
  const origin = await launch(true);
  await page.goto(origin); await waitText(page, 'health', 'dostupan'); await createInPanel(page, 'Crash recovery');
  const died = once(child, 'exit'); await page.locator('[data-action=resume]').click();
  assert.equal((await died)[1], 'SIGKILL');
  await page.locator('#refresh').click(); await waitText(page, 'health', 'nije dostupan');
  assert.equal(await page.locator('#detail').isVisible(), false);
  await launch(false); await page.locator('#refresh').click(); await page.locator('#detail').waitFor({ state: 'visible' });
  await waitText(page, 'run-status', 'Prekinuto');
  const recovered = JSON.parse(await page.locator('#json').textContent());
  assert.deepEqual(recovered.run.steps.map(s => s.status), ['succeeded', 'interrupted']);
  assert.equal(recovered.run.steps[1].result, undefined);
  await page.locator('[data-action=retry]').click(); await waitText(page, 'run-status', 'pauzirano');
  await page.locator('[data-action=resume]').click(); await waitText(page, 'run-status', 'Potvrđeno završeno');
  const finished = JSON.parse(await page.locator('#json').textContent());
  assert.deepEqual(finished.run.steps[0], recovered.run.steps[0]);
  assert.deepEqual(finished.run.steps.map(s => s.attempts), [1, 2]); assert.equal(finished.run.steps[1].result.output, 21);
});
