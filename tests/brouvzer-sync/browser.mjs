// Real application acceptance checks: mock-channel tests are separate.
import assert from 'node:assert/strict';
import { startServer } from '../../pilot/brouvzer/server.mjs';
import { runSuite, HarnessError } from './browser-harness.mjs';

await runSuite('application-rtc', 11, async h => {
  const { chromium, options } = await h.tooling({ rtc: true });
  const app = await h.step('start-server', () => startServer(0)); h.track('server', () => app.close());
  const browser = await h.step('launch-browser', () => chromium.launch(options)); h.track('browser', () => browser.close());
  const version = browser.version(); h.report.browserVersion = /^\d+(?:\.\d+){1,3}$/.test(version) ? version : 'unreported';
  async function newContext() {
    const context = await browser.newContext(); h.track('context', () => context.close());
    context.setDefaultTimeout(h.timeout); context.setDefaultNavigationTimeout(h.timeout); return context;
  }
  const aContext = await h.step('create-first-context', newContext), bContext = await h.step('create-second-context', newContext);
  const a = await h.step('create-first-page', () => aContext.newPage()), b = await h.step('create-second-page', () => bContext.newPage());
  h.observe(a); h.observe(b);
  const ready = page => page.waitForFunction(() => !!document.querySelector('#save') && !document.querySelector('#save').disabled);
  await h.step('navigate-and-ready', async () => { await Promise.all([a.goto(app.origin), b.goto(app.origin)]); await Promise.all([ready(a), ready(b)]); });
  const add = async (page, title) => {
    await page.locator('#title').fill(title); await page.locator('#save').click();
    await page.waitForFunction(t => document.querySelector('#rows').textContent.includes(t), title);
  };
  await h.step('offline-independent-edits', async () => {
    await add(a, 'A-offline'); await add(b, 'B-offline');
    assert.equal(await a.locator('#rows li').count(), 1); assert.equal(await b.locator('#rows li').count(), 1);
    h.passed('offline-independent-edits');
  });
  async function signalReady(page, type) {
    await page.waitForFunction(t => document.querySelector('#outgoing').value.includes(t) || !document.querySelector('#error').hidden, type);
    // Only fixed labels leave the browser; never log the SDP or arbitrary DOM/error text.
    const code = await page.evaluate(() => {
      const error = document.querySelector('#error'); if (error.hidden) return null;
      if (error.textContent.includes('ICE nije pronašao nijednog')) return 'ice-no-candidates';
      if (error.textContent.includes('ICE prikupljanje je isteklo')) return 'ice-gather-timeout';
      return 'application-pairing-error';
    });
    if (code) throw new HarnessError(code);
  }
  async function pair(testGate = false) {
    const offer = await h.step('pair-offer', async () => {
      await a.locator('#invite').click(); await signalReady(a, 'offer'); return a.locator('#outgoing').inputValue();
    });
    const answer = await h.step('pair-answer', async () => {
      await b.locator('#incoming').fill(offer); await b.locator('#accept').click(); await signalReady(b, 'answer'); return b.locator('#outgoing').inputValue();
    });
    await h.step('pair-first-confirmation', async () => {
      await a.locator('#incoming').fill(answer); await a.locator('#finish').click();
      await Promise.all([a.waitForFunction(() => document.querySelector('#code').textContent.length === 64), b.waitForFunction(() => document.querySelector('#code').textContent.length === 64)]);
      const code = await a.locator('#code').textContent(); assert.equal(code, await b.locator('#code').textContent());
      await a.locator('#peerCode').fill(code); await a.locator('#confirm').click();
    });
    if (testGate) await h.step('one-sided-confirmation-gate', async () => {
      await b.waitForFunction(() => document.querySelector('#network').textContent.includes('kanal: open'));
      assert.equal(await a.locator('#rows li').count(), 1); assert.equal(await b.locator('#rows li').count(), 1);
      h.passed('one-sided-confirmation-gate');
    });
    await h.step('pair-second-confirmation', async () => {
      await b.locator('#peerCode').fill(await b.locator('#code').textContent()); await b.locator('#confirm').click();
      await Promise.all([a.waitForFunction(() => document.querySelector('#status').textContent.includes('Oba uređaja')), b.waitForFunction(() => document.querySelector('#status').textContent.includes('Oba uređaja'))]);
    });
  }
  await pair(true);
  await h.step('initial-convergence', async () => {
    await Promise.all([a.waitForFunction(() => document.querySelectorAll('#rows li').length === 2), b.waitForFunction(() => document.querySelectorAll('#rows li').length === 2)]);
    h.report.rtcTransfer = 'confirmed'; h.passed('real-rtc-initial-convergence');
  });
  await h.step('live-update', async () => {
    await add(a, 'A-online'); await b.waitForFunction(() => document.querySelector('#rows').textContent.includes('A-online')); h.passed('live-update');
  });
  await h.step('revoke-and-offline-edit', async () => {
    await a.locator('#revoke').click(); await b.waitForFunction(() => !document.querySelector('#invite').disabled);
    await add(a, 'A-after-revoke'); assert.equal(await b.locator('#rows li').count(), 3); h.passed('revocation-stops-transfer');
  });
  await h.step('reload-peer', async () => {
    await b.reload(); await ready(b); assert.equal(await b.locator('#rows li').count(), 3); h.passed('indexeddb-reload');
  });
  await pair();
  await h.step('fresh-pairing-convergence', async () => {
    await b.waitForFunction(() => document.querySelector('#rows').textContent.includes('A-after-revoke')); h.passed('fresh-pairing-convergence');
    assert.equal(await b.locator('#accept').isDisabled(), true); h.passed('participant-slot-closed');
  });
  await h.step('incognito-isolation', async () => {
    const inc = await aContext.newPage(); h.observe(inc); await inc.goto(app.origin + '/?inkognito=1'); await ready(inc);
    assert.equal(await inc.locator('#rows li').count(), 0); assert.equal(await inc.locator('#invite').isDisabled(), true);
    await add(inc, 'Secret-test-only'); await inc.reload(); await ready(inc); assert.equal(await inc.locator('#rows li').count(), 0); h.passed('incognito-isolation');
  });
  await h.step('wrong-independent-code', async () => {
    await a.locator('#revoke').click(); await b.waitForFunction(() => !document.querySelector('#invite').disabled);
    await a.locator('#invite').click(); await signalReady(a, 'offer');
    await b.locator('#incoming').fill(await a.locator('#outgoing').inputValue()); await b.locator('#accept').click();
    await b.waitForFunction(() => document.querySelector('#code').textContent.length === 64);
    await b.locator('#peerCode').fill('0'.repeat(64)); await b.locator('#confirm').click(); await b.locator('#error').waitFor({ state: 'visible' });
    assert.match(await b.locator('#error').textContent(), /Otisci/); h.passed('wrong-code-revokes');
  });
  await h.step('responsive-layout', async () => {
    await a.setViewportSize({ width: 390, height: 844 }); assert.equal(await a.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true); h.passed('responsive-layout');
  });
});
