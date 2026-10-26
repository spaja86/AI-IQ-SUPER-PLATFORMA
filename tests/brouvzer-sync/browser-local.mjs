import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { startServer } from '../../pilot/brouvzer/server.mjs';
import { runSuite } from './browser-harness.mjs';

await runSuite('local-ui', 8, async h => {
  h.report.rtcTransfer = 'not-exercised';
  const { chromium, options } = await h.tooling();
  const app = await h.step('start-server', () => startServer(0));
  h.track('server', () => app.close());
  const profile = await h.step('create-profile', () => mkdtemp(join(tmpdir(), 'spaja-brouvzer-test-')));
  h.track('profile', () => rm(profile, { recursive: true, force: true }));
  let context, closeContext, page;
  const ready = () => page.waitForFunction(() => !!document.querySelector('#save') && !document.querySelector('#save').disabled);
  async function launch() {
    context = await chromium.launchPersistentContext(profile, options);
    // Capture this context so later restarts cannot change its cleanup target.
    const captured = context; closeContext = h.track('context', () => captured.close());
    context.setDefaultTimeout(h.timeout); context.setDefaultNavigationTimeout(h.timeout);
    const version = context.browser()?.version();
    h.report.browserVersion = /^\d+(?:\.\d+){1,3}$/.test(version || '') ? version : 'unreported';
    page = await context.newPage(); h.observe(page);
  }
  await h.step('launch-browser', launch);
  await h.step('navigate-and-ready', async () => { await page.goto(app.origin); await ready(); });
  await h.step('durable-create', async () => {
    await page.locator('#title').fill('Sintetički bookmark'); await page.locator('#save').click();
    await page.waitForFunction(() => document.querySelectorAll('#rows li').length === 1);
    h.passed('local-bookmark-durable-commit');
  });
  await h.step('rename', async () => {
    page.once('dialog', dialog => dialog.accept('Preimenovan'));
    await page.getByRole('button', { name: 'Preimenuj', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('#rows').textContent.includes('Preimenovan'));
    h.passed('rename-through-ui');
  });
  await h.step('reload', async () => {
    await page.reload(); await ready(); assert.equal(await page.locator('#rows li').count(), 1); h.passed('indexeddb-reload');
  });
  await h.step('close-before-profile-restart', closeContext);
  await h.step('restart-persistent-browser', launch);
  await h.step('verify-profile-restart', async () => {
    await page.goto(app.origin); await ready(); assert.match(await page.locator('#rows').textContent(), /Preimenovan/);
    h.passed('indexeddb-profile-restart');
  });
  await h.step('incognito-isolation', async () => {
    await page.goto(app.origin + '/?inkognito=1'); await ready();
    assert.equal(await page.locator('#rows li').count(), 0); assert.equal(await page.locator('#invite').isDisabled(), true);
    await page.locator('#save').click(); await page.waitForFunction(() => document.querySelectorAll('#rows li').length === 1);
    await page.reload(); await ready(); assert.equal(await page.locator('#rows li').count(), 0); h.passed('incognito-isolation');
  });
  await h.step('durable-delete', async () => {
    await page.goto(app.origin); await ready(); assert.equal(await page.locator('#rows li').count(), 1);
    await page.getByRole('button', { name: 'Obriši', exact: true }).click();
    await page.waitForFunction(() => document.querySelectorAll('#rows li').length === 0);
    await page.reload(); await ready(); assert.equal(await page.locator('#rows li').count(), 0); h.passed('durable-delete');
  });
  await h.step('responsive-layout', async () => {
    for (const width of [390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    }
    h.passed('responsive-layout');
    if (process.env.QA_SCREENSHOT) await page.screenshot({ path: process.env.QA_SCREENSHOT, fullPage: true });
  });
  await h.step('close-before-storage-fault', closeContext);
  await h.step('launch-storage-fault', launch);
  await h.step('storage-fault-blocks-edits', async () => {
    await context.addInitScript(() => { Object.defineProperty(window, 'indexedDB', { get() { throw Error('synthetic unavailable storage'); } }); });
    await page.goto(app.origin); await page.locator('#error').waitFor({ state: 'visible' });
    assert.equal(await page.locator('#save').isDisabled(), true); assert.equal(await page.locator('#invite').isDisabled(), true);
    h.passed('storage-fault-blocks-edits');
  });
});
