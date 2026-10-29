import test from 'node:test';
import assert from 'node:assert/strict';
import { BrowserHarness, HarnessError, bounded, failureCode, timeoutFromEnv } from './browser-harness.mjs';

test('browser harness timeouts are bounded and reject unexpected input', () => {
  assert.equal(timeoutFromEnv({}), 30000);
  assert.equal(timeoutFromEnv({ BROUVZER_BROWSER_STEP_TIMEOUT_MS: '1000' }), 1000);
  for (const value of ['0', '-1', 'NaN', '100.5', '60001', 'https://private.invalid']) {
    assert.throws(() => timeoutFromEnv({ BROUVZER_BROWSER_STEP_TIMEOUT_MS: value }), /invalid-step-timeout/);
  }
});
test('browser stage timeout records the interrupted stage without raw error text', async () => {
  const h = new BrowserHarness('synthetic', {}); h.timeout = 20;
  await assert.rejects(h.step('pending-operation', () => new Promise(() => {})), error => failureCode(error) === 'stage-timeout');
  assert.equal(h.report.phase, 'pending-operation');
  assert.equal(failureCode(new Error('synthetic-private-token-and-sdp')), 'runtime-error');
  await assert.rejects(h.step('https://private.invalid', () => {}), /invalid-stage-label/);
});
test('bounded operation rejection keeps the original error available for safe classification', async () => {
  const failure = new HarnessError('ice-no-candidates');
  await assert.rejects(bounded(() => { throw failure; }, 20), error => error === failure);
  assert.equal(failureCode({ name: 'TimeoutError', message: 'private' }), 'stage-timeout');
  assert.equal(failureCode({ code: 'ERR_ASSERTION', actual: 'private' }), 'assertion-failed');
});
test('cleanup runs in reverse acquisition order, skips closed resources and preserves failed closure', async () => {
  const h = new BrowserHarness('synthetic', {}); h.timeout = 20; const order = [];
  h.track('server', () => { order.push('server'); });
  const close = h.track('context', () => { order.push('context-one'); }); await close();
  h.track('context', () => { order.push('context-two'); throw Error('synthetic-private-error'); });
  assert.equal(await h.cleanup(), false);
  assert.deepEqual(order, ['context-one', 'context-two', 'server']);
  assert.deepEqual(h.report.cleanup.map(x => x.closed), [true, true, false]);
  assert.equal(h.report.cleanup[2].errorCode, 'runtime-error');
  assert.ok(!JSON.stringify(h.report).includes('synthetic-private'));
});
test('a stuck cleanup has a deadline and does not prevent cleanup of other resources', async () => {
  const h = new BrowserHarness('synthetic', {}); h.timeout = 20; let serverClosed = false;
  h.track('server', () => { serverClosed = true; }); h.track('context', () => new Promise(() => {}));
  assert.equal(await h.cleanup(), false); assert.equal(serverClosed, true);
  assert.equal(h.report.cleanup[1].errorCode, 'stage-timeout');
});
test('browser diagnostic capture counts page errors without retaining their contents', () => {
  const h = new BrowserHarness('synthetic', {}); let listener; const limits = [];
  h.observe({ setDefaultTimeout: ms => limits.push(ms), setDefaultNavigationTimeout: ms => limits.push(ms), on: (_, fn) => { listener = fn; } });
  listener(Error('private-address-token-sdp'));
  assert.deepEqual(limits, [30000, 30000]); assert.equal(h.report.pageErrors, 1);
  assert.ok(!JSON.stringify(h.report).includes('private-address'));
});
test('browser tooling rejects debug logging before loading any module', async () => {
  const h = new BrowserHarness('synthetic', { DEBUG: 'pw:*', PLAYWRIGHT_MODULE: 'synthetic-not-installed' });
  await assert.rejects(h.tooling(), /debug-logging-disabled/);
});
