import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { randomUUID } from 'node:crypto';
import { createHarness, checkoutEvent, invoiceEvent, USER } from './fixtures/stripe-isolated-harness.mjs';

// All original safety expectations execute as strict assertions.
const harnesses = [];
function setup(options) { const h = createHarness(options); harnesses.push(h); return h; }
function gap(id, name, fn) { test(`[${id}] ${name}`, fn); }
afterEach(() => {
  for (const h of harnesses.splice(0)) assert.deepEqual(h.state.networkAttempts, [], 'no network operation is permitted');
});
const stableHeaders = { 'idempotency-key': 'fixture-request-001', 'x-request-id': 'fixture-trace-stable' };
function noCheckoutSideEffects(h) {
  assert.equal(h.state.sessionCalls.length, 0);
  assert.equal(h.state.customerCalls.length, 0);
  assert.equal(h.state.profileWrites, 0);
}

test('isolation refuses any non-fixture API key, including live and real test keys', () => {
  for (const key of ['sk_live_forbidden', 'rk_live_forbidden', 'sk_test_external', 'rk_test_external']) {
    assert.throws(() => createHarness({ env: { STRIPE_SECRET_KEY: key } }), /synthetic fixture key/);
  }
});
test('Stripe config fails when API key is absent', () => {
  const h = setup({ env: { STRIPE_SECRET_KEY: undefined } });
  assert.throws(() => h.load('src/lib/stripe/config.ts').getStripe(), /STRIPE_SECRET_KEY/);
});
test('Supabase config fails when URL or service role is absent', () => {
  for (const key of ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']) {
    const h = setup({ env: { [key]: undefined } });
    assert.throws(() => h.load('src/lib/supabase/server.ts').getSupabaseServerClient(), /kredencijali/);
  }
});
test('missing Price configuration returns 500 before Stripe effects', async () => {
  const h = setup({ env: { STRIPE_PRICE_BASIC: undefined } });
  assert.equal((await h.checkout()).status, 500); noCheckoutSideEffects(h);
});
test('missing Stripe key returns controlled Checkout failure', async () => {
  const h = setup({ env: { STRIPE_SECRET_KEY: undefined } });
  assert.equal((await h.checkout()).status, 500); noCheckoutSideEffects(h);
});
for (const authorization of ['', 'Basic abc', 'Bearer', 'Bearer invalid-fixture-token']) {
  test(`real auth adapter rejects ${authorization || 'missing credentials'} when providers do not verify`, async () => {
    const h = setup();
    assert.equal((await h.checkout(undefined, { authorization })).status, 401);
    noCheckoutSideEffects(h);
  });
}
test('auth adapter passes token to Supabase boundary and does not trust client user ID', async () => {
  const h = setup();
  assert.equal((await h.checkout({ planId: 'basic', userId: 'attacker', priceId: 'price_attacker' })).status, 200);
  assert.deepEqual(h.state.authTokens, ['fixture-valid-token']);
  assert.equal(h.state.sessionCalls[0].params.metadata.supabase_user_id, USER);
  assert.equal(h.state.sessionCalls[0].params.line_items[0].price, 'price_fixture_basic');
});
for (const [name, body, status] of [
  ['malformed JSON', '{', 400], ['null body', null, 400], ['array body', [], 400],
  ['missing plan', {}, 400], ['non-string plan', { planId: 1 }, 400],
  ['unknown plan', { planId: 'not-a-plan' }, 404], ['free plan', { planId: 'starter' }, 400],
]) {
  test(`Checkout rejects ${name}`, async () => {
    const h = setup(); assert.equal((await h.checkout(body)).status, status); noCheckoutSideEffects(h);
  });
}
for (const [flag, plan] of [
  ['billing-read-only-mode', 'basic'], ['billing-kill-switch-checkout', 'basic'], ['billing-kill-switch-enterprise', 'enterprise'],
]) {
  test(`${flag} blocks the applicable Checkout`, async () => {
    const h = setup({ flags: { [flag]: true } });
    assert.equal((await h.checkout({ planId: plan })).status, 503); noCheckoutSideEffects(h);
  });
}
test('sixth Checkout request is rate limited per user in one process', async () => {
  const h = setup();
  for (let i = 0; i < 5; i++) assert.equal((await h.checkout()).status, 200);
  assert.equal((await h.checkout()).status, 429);
  assert.equal(h.state.sessionCalls.length, 5);
});
test('twenty-first request from same trusted IP is blocked across fixture users', async () => {
  const h = setup();
  for (let i = 0; i < 21; i++) {
    const response = await h.checkout({}, { authorization: `Bearer fixture-user-${i}`, 'x-forwarded-for': '192.0.2.1' });
    assert.equal(response.status, i === 20 ? 429 : 400);
  }
  noCheckoutSideEffects(h);
});
test('recent plan change enforces five-minute cooldown', async () => {
  const h = setup({ profile: { last_plan_changed_at: new Date().toISOString() } });
  assert.equal((await h.checkout()).status, 429); noCheckoutSideEffects(h);
});
test('three open sessions blocks Checkout for existing customer', async () => {
  const h = setup({ activeSessions: 3 });
  assert.equal((await h.checkout()).status, 429); noCheckoutSideEffects(h);
});
test('non-EUR Price rejects Checkout', async () => {
  const h = setup({ price: { currency: 'rsd' } });
  assert.equal((await h.checkout()).status, 409); noCheckoutSideEffects(h);
});
test('unknown Stripe Price API failure does not create a Checkout session', async () => {
  const h = setup({ priceError: true });
  assert.equal((await h.checkout()).status, 500); noCheckoutSideEffects(h);
});
test('malformed idempotency key returns 400', async () => {
  const h = setup();
  assert.equal((await h.checkout(undefined, { 'idempotency-key': 'bad key' })).status, 400);
  noCheckoutSideEffects(h);
});
test('Checkout success sends server-owned subscription parameters without granting access', async () => {
  const h = setup();
  assert.equal((await h.checkout(undefined, stableHeaders)).status, 200);
  const call = h.state.sessionCalls[0];
  assert.equal(call.params.customer, 'cus_fixture');
  assert.equal(call.params.mode, 'subscription');
  assert.deepEqual(call.params.line_items, [{ price: 'price_fixture_basic', quantity: 1 }]);
  assert.equal(call.options.idempotencyKey, `checkout:${USER}:basic:fixture-request-001`);
  assert.equal(h.state.profile.plan, 'starter');
  assert.equal(h.state.profile.subscription_status, null);
  assert.equal(h.state.profileWrites, 0);
});
test('new fixture customer is linked to profile before session creation', async () => {
  const h = setup({ profile: { stripe_customer_id: null } });
  assert.equal((await h.checkout()).status, 200);
  assert.equal(h.state.customerCalls.length, 1);
  assert.equal(h.state.profile.stripe_customer_id, 'cus_fixture_new_1');
});
test('same idempotency key AND stable trace reuse simulated session', async () => {
  const h = setup();
  const responses = await Promise.all([h.checkout(undefined, stableHeaders), h.checkout(undefined, stableHeaders)]);
  assert.deepEqual(responses.map(r => r.status), [200, 200]);
  assert.equal(h.state.sessions.size, 1);
});
test('Checkout API exceptions open real circuit and next request receives 503', async () => {
  const h = setup({ sessionError: true });
  for (let i = 0; i < 3; i++) assert.equal((await h.checkout()).status, 500);
  assert.equal((await h.checkout()).status, 503);
  assert.equal(h.state.sessionCalls.length, 3);
  assert.equal(h.state.profile.subscription_status, null);
});
test('Checkout response without URL fails with 503 and no activation', async () => {
  const h = setup({ noSessionUrl: true });
  assert.equal((await h.checkout()).status, 503);
  assert.equal(h.state.profile.subscription_status, null);
});
test('real fraud assessor blocks genuinely high signals when supplied', () => {
  const h = setup();
  const result = h.load('src/lib/stripe/billing-validators.ts').assessFraudRisk({
    checkoutAttemptsLastHour: 5, failedPaymentsLast30Days: 5, distinctIpsLast24h: 5, isNewAccount: true,
  });
  assert.equal(result.blocked, true); assert.equal(result.score, 95);
});
test('missing webhook signature fails before DB access', async () => {
  const h = setup(); assert.equal((await h.webhook(checkoutEvent(), { noSignature: true })).status, 400);
  assert.equal(h.state.queries.length, 0);
});
test('missing webhook secret fails before DB access', async () => {
  const h = setup({ env: { STRIPE_WEBHOOK_SECRET: undefined } });
  assert.equal((await h.webhook(checkoutEvent())).status, 500); assert.equal(h.state.queries.length, 0);
});
for (const [name, options] of [
  ['wrong signing secret', { secret: 'whsec_wrong_fixture' }],
  ['modified raw body', { body: JSON.stringify(checkoutEvent()) + ' ' }],
  ['stale signature', { timestamp: Math.floor(Date.now() / 1000) - 1000 }],
]) {
  test(`real Stripe SDK rejects ${name}`, async () => {
    const h = setup(); assert.equal((await h.webhook(checkoutEvent(), options)).status, 400);
    assert.equal(h.state.queries.length, 0);
  });
}
test('invalid tolerance configuration falls back to 300 seconds', async () => {
  const h = setup({ env: { STRIPE_WEBHOOK_TOLERANCE_SEC: '0' } });
  assert.equal((await h.webhook(checkoutEvent(), { timestamp: Math.floor(Date.now() / 1000) - 400 })).status, 400);
});
test('correct signature plus invalid Checkout schema is rejected', async () => {
  const h = setup();
  assert.equal((await h.webhook(checkoutEvent({ mode: 'invalid' }))).status, 422);
  assert.equal(h.state.queries.length, 0);
});
test('non-allowlisted event is acknowledged without billing writes', async () => {
  const h = setup();
  const response = await h.webhook(checkoutEvent({}, { type: 'payout.created' }));
  assert.equal(response.status, 200); assert.equal((await response.json()).ignored, true);
  assert.equal(h.state.queries.length, 0);
});
test('signed paid Checkout event activates fixture subscription and records audit', async () => {
  const h = setup(); assert.equal((await h.webhook(checkoutEvent())).status, 200);
  assert.equal(h.state.profile.plan, 'basic'); assert.equal(h.state.profile.subscription_status, 'active');
  assert.equal(h.state.profile.stripe_subscription_id, 'sub_fixture');
  assert.equal(h.state.profile.chat_messages_limit, 100);
  assert.equal(h.state.audits[0].action, 'subscription.activated');
});
test('same webhook event ID delivered five times concurrently has one simulated profile write', async () => {
  const h = setup();
  const responses = await Promise.all(Array.from({ length: 5 }, () => h.webhook(checkoutEvent())));
  const bodies = await Promise.all(responses.map(r => r.json()));
  assert.equal(bodies.filter(b => b.duplicate).length, 4);
  assert.equal(h.state.profileWrites, 1); assert.equal(h.state.audits.length, 1);
});
test('invoice failure sets past_due and soft-lock on third failure', async () => {
  const h = setup({ profile: { failed_payment_count: 2, stripe_subscription_id: 'sub_fixture' }, subscription: { latest_invoice: { id: 'in_fixture', status: 'open' } } });
  assert.equal((await h.webhook(invoiceEvent())).status, 200);
  assert.equal(h.state.profile.failed_payment_count, 3);
  assert.equal(h.state.profile.subscription_status, 'past_due');
  assert.equal(h.state.profile.billing_locked, true);
});
test('real retry helper retries thrown transient DB errors', async () => {
  const h = setup(); let calls = 0;
  const result = await h.load('src/lib/stripe/billing-guard.ts').withRetry(async () => {
    if (++calls < 3) throw Object.assign(new Error('fixture transient error'), { code: '40001' });
    return 'ok';
  }, { initialDelayMs: 0 });
  assert.equal(result, 'ok'); assert.equal(calls, 3);
});

gap('FRAUD-01', 'route must use measured Checkout attempt count', async () => {
  const h = setup();
  for (let i = 0; i < 5; i++) await h.checkout();
  assert.equal(h.state.fraudInputs.at(-1).checkoutAttemptsLastHour, 5);
});
gap('FRAUD-02', 'route must use measured distinct IP count', async () => {
  const h = setup();
  for (let i = 1; i <= 5; i++) await h.checkout(undefined, {}, { ip: `192.0.2.${i}` });
  assert.equal(h.state.fraudInputs.at(-1).distinctIpsLast24h, 5);
});
gap('FRAUD-03', 'new account with five failures and five IP attempts must be blocked', async () => {
  const durable = { attempts: [], failures: Array.from({ length: 5 }, (_, i) => ({ userId: USER, at: Date.now() - (i + 1) * 1000 })) };
  const h = setup({ durable, profile: { failed_payment_count: 5, created_at: new Date(Date.now() - 1000).toISOString() } });
  let response;
  for (let i = 1; i <= 5; i++) response = await h.checkout(undefined, {}, { ip: `192.0.2.${i}` });
  assert.equal(response.status, 403);
  assert.equal(h.state.fraudInputs.at(-1).failedPaymentsLast30Days, 5);
  assert.equal(h.state.sessionCalls.length, 4);
});

for (const [name, headers, proxy] of [
  ['forwarded headers alone', { 'x-forwarded-for': '192.0.2.1', 'x-real-ip': '192.0.2.1', 'cf-connecting-ip': '192.0.2.1' }, { signed: false }],
  ['unapproved proxy', {}, { proxyId: 'unapproved' }],
  ['wrong signature key', {}, { key: 'ff'.repeat(32) }],
  ['wrong audience', {}, { audience: 'other-deployment' }],
  ['wrong route', {}, { path: '/api/stripe/portal' }],
  ['expired signature', {}, { timestamp: Math.floor(Date.now() / 1000) - 61 }],
  ['future signature', {}, { timestamp: Math.floor(Date.now() / 1000) + 30 }],
  ['IP list', {}, { ip: '192.0.2.1, 192.0.2.2' }],
  ['IP port', {}, { ip: '192.0.2.1:443' }],
  ['IPv6 zone ID', {}, { ip: 'fe80::1%eth0' }],
  ['changed signed source', {}, { tamperHeaders: { 'x-spaja-source-ip': '192.0.2.99' } }],
  ['changed signed authorization', {}, { tamperHeaders: { authorization: 'Bearer fixture-user-other' } }],
  ['changed signed idempotency', {}, { tamperHeaders: { 'idempotency-key': 'changed-after-signing' } }],
  ['changed signed body', {}, { tamperBody: '{"planId":"pro"}' }],
  ['duplicate signature header', {}, { tamperHeaders: { 'x-spaja-source-signature': 'aa'.repeat(32) + ', ' + 'bb'.repeat(32) } }],
]) {
  test(`trusted ingress rejects ${name} before any database or Stripe effect`, async () => {
    const h = setup();
    assert.equal((await h.checkout(undefined, headers, proxy)).status, 503);
    assert.equal(h.state.admissionCalls.length, 0); noCheckoutSideEffects(h);
  });
}
for (const field of ['STRIPE_CHECKOUT_PROXY_KEY', 'STRIPE_CHECKOUT_PROXY_ID', 'STRIPE_CHECKOUT_PROXY_AUDIENCE', 'STRIPE_CHECKOUT_IP_HASH_KEY']) {
  test(`missing ${field} fails closed`, async () => {
    const h = setup({ env: { [field]: undefined } });
    assert.equal((await h.checkout()).status, 503); noCheckoutSideEffects(h);
  });
}
test('forged forwarding headers cannot change measured source or risk score', async () => {
  const h = setup();
  for (let i = 0; i < 5; i++) {
    assert.equal((await h.checkout(undefined, { 'x-forwarded-for': `192.0.2.${i + 1}`, 'x-real-ip': `198.51.100.${i + 1}` })).status, 200);
  }
  assert.equal(h.state.fraudInputs.at(-1).checkoutAttemptsLastHour, 5);
  assert.equal(h.state.fraudInputs.at(-1).distinctIpsLast24h, 1);
});
test('canonical IPv4, mapped IPv4 and expanded/compressed IPv6 identify the same source', () => {
  const canonical = setup().load('src/lib/stripe/checkout-fraud.ts').canonicalIp;
  assert.equal(canonical('::ffff:c000:20a'), canonical('192.0.2.10'));
  assert.equal(canonical('::ffff:192.0.2.10'), canonical('192.0.2.10'));
  assert.equal(canonical('2001:0DB8:0000:0000:0000:0000:0000:0001'), canonical('2001:db8::1'));
  for (const invalid of ['unknown', '', ' 192.0.2.1', '127.1', '192.000.002.1', '[::1]', '::1%lo', '0x7f000001']) assert.throws(() => canonical(invalid));
});
test('an exact attestation replay cannot start another Checkout request', async () => {
  const h = setup(); const nonce = randomUUID();
  assert.equal((await h.checkout(undefined, stableHeaders, { nonce })).status, 200);
  assert.equal((await h.checkout(undefined, stableHeaders, { nonce })).status, 503);
  assert.equal(h.state.durable.attempts.length, 1); assert.equal(h.state.sessionCalls.length, 1);
});
test('fresh HTTP retries count even with the same Stripe idempotency key', async () => {
  const h = setup();
  for (let i = 0; i < 6; i++) assert.equal((await h.checkout(undefined, stableHeaders)).status, i < 5 ? 200 : 429);
  assert.equal(h.state.durable.attempts.length, 6);
  assert.equal(h.state.sessions.size, 1);
});
test('lost database response retries one committed admission without double counting', async () => {
  const h = setup({ loseAdmissionResponseOnce: true });
  assert.equal((await h.checkout()).status, 200);
  assert.equal(h.state.admissionCalls.length, 2);
  assert.equal(h.state.admissionCalls[0].p_attempt_id, h.state.admissionCalls[1].p_attempt_id);
  assert.equal(h.state.durable.attempts.length, 1);
});
for (const failure of [
  { admissionError: { code: '08006', message: 'fixture-private-provider-error' } },
  { admissionThrow: true }, { admissionResult: { committed: false } },
  { admissionResult: { committed: true, checkoutAttemptsLastHour: NaN } },
]) {
  test(`unconfirmed or invalid durable admission fails closed: ${JSON.stringify(failure)}`, async () => {
    const h = setup(failure);
    assert.equal((await h.checkout()).status, 503); noCheckoutSideEffects(h);
    assert.ok(!JSON.stringify(h.state.logs).includes('fixture-private-provider-error'));
  });
}
test('fifty parallel HTTP calls across restarted handlers share the durable user limit', async () => {
  const durable = { attempts: [], failures: [] };
  const handlers = Array.from({ length: 5 }, () => setup({ durable }));
  const responses = await Promise.all(Array.from({ length: 50 }, (_, i) => handlers[i % 5].checkout()));
  assert.equal(responses.filter(r => r.status === 200).length, 5);
  assert.equal(responses.filter(r => r.status === 429).length, 45);
  assert.equal(durable.attempts.length, 50);
});
test('historical profile failure counter is not misrepresented as a rolling 30-day measurement', async () => {
  const h = setup({ profile: { failed_payment_count: 500 } });
  assert.equal((await h.checkout()).status, 200);
  assert.equal(h.state.fraudInputs.at(-1).failedPaymentsLast30Days, 0);
});
test('durable windows expire at their exact open lower bound in deterministic route fixture', async () => {
  const now = Date.parse('2026-10-27T12:00:00Z');
  const durable = { attempts: [], failures: [{ userId: USER, at: now - 30 * 86400000 }] };
  const h = setup({ durable, now }); await h.checkout();
  const first = durable.attempts[0];
  first.at = now - 3600000;
  await h.checkout(); assert.equal(h.state.fraudInputs.at(-1).checkoutAttemptsLastHour, 1);
  first.at = now - 86400000; first.ipHash = 'c'.repeat(64);
  await h.checkout(); assert.equal(h.state.fraudInputs.at(-1).distinctIpsLast24h, 1);
  assert.equal(h.state.fraudInputs.at(-1).failedPaymentsLast30Days, 0);
});
test('body limit is enforced independently of the claimed Content-Length', async () => {
  const h = setup(); assert.equal((await h.checkout('x'.repeat(16385), { 'content-length': '1' })).status, 413);
  assert.equal(h.state.admissionCalls.length, 0); noCheckoutSideEffects(h);
});
test('raw IPs, source headers, tokens and client trace strings do not enter admission storage or logs', async () => {
  const h = setup();
  await h.checkout(undefined, { 'x-request-id': 'private-client-trace', 'x-forwarded-for': '198.51.100.99' }, { ip: '192.0.2.123' });
  const recorded = JSON.stringify([h.state.admissionCalls, h.state.durable, h.state.logs]);
  for (const secret of ['192.0.2.123', '198.51.100.99', 'private-client-trace', 'fixture-valid-token', 'a1'.repeat(32), 'b2'.repeat(32)]) assert.ok(!recorded.includes(secret));
});
test('ingress adapter signs socket IP and strips all caller source, trace and forwarding headers', async () => {
  const h = setup(); const body = '{"planId":"basic"}';
  const attest = h.load('src/lib/stripe/checkout-proxy.ts').attestCheckoutAtIngress;
  const request = { method: 'POST', url: '/api/stripe/checkout', socket: { remoteAddress: '::ffff:192.0.2.10' },
    headers: { authorization: 'Bearer fixture-valid-token', 'x-forwarded-for': '192.0.2.99',
      'x-spaja-source-ip': '192.0.2.99', 'x-spaja-source-signature': 'forged', 'x-request-id': 'private' } };
  const config = { proxyId: 'fixture-ingress', audience: 'fixture-development', key: 'a1'.repeat(32) };
  const first = attest(request, body, config); const second = attest(request, body, config);
  assert.equal(first['x-spaja-source-ip'], '192.0.2.10');
  assert.equal(first['x-forwarded-for'], undefined); assert.equal(first['x-request-id'], undefined);
  assert.notEqual(first['x-spaja-source-nonce'], second['x-spaja-source-nonce']);
  assert.equal((await h.checkout(body, first, { signed: false })).status, 200);
  assert.throws(() => attest({ ...request, socket: {}, headers: { 'x-real-ip': '192.0.2.10' } }, body, config));
});
gap('CHECKOUT-01', 'same idempotency key with independently generated request IDs must retry successfully', async () => {
  const h = setup();
  assert.equal((await h.checkout(undefined, { 'idempotency-key': 'fixture-retry' })).status, 200);
  assert.equal((await h.checkout(undefined, { 'idempotency-key': 'fixture-retry' })).status, 200);
});
gap('CHECKOUT-02', 'distinct 255-character keys must not collide after namespacing', async () => {
  const h = setup();
  for (const suffix of ['a', 'b']) await h.checkout(undefined, { ...stableHeaders, 'idempotency-key': 'x'.repeat(254) + suffix });
  assert.notEqual(h.state.sessionCalls[0].options.idempotencyKey, h.state.sessionCalls[1].options.idempotencyKey);
});
gap('CHECKOUT-03', 'invalid key must be rejected before new customer/profile mutations', async () => {
  const h = setup({ profile: { stripe_customer_id: null } });
  assert.equal((await h.checkout(undefined, { 'idempotency-key': 'bad key' })).status, 400);
  noCheckoutSideEffects(h);
});
gap('CHECKOUT-04', 'profile read error must stop Checkout before Stripe effects', async () => {
  const h = setup({ profileReadError: { code: '08006' } });
  await h.checkout(); noCheckoutSideEffects(h);
});
gap('CHECKOUT-05', 'failed customer link must prevent creation of unlinked session', async () => {
  const h = setup({ profile: { stripe_customer_id: null }, profileWriteError: { code: '08006' } });
  await h.checkout(); assert.equal(h.state.sessionCalls.length, 0);
});
gap('CHECKOUT-06', 'billing-locked profile must not create a new session', async () => {
  const h = setup({ profile: { billing_locked: true, failed_payment_count: 10 } });
  await h.checkout(); assert.equal(h.state.sessionCalls.length, 0);
});
gap('WEBHOOK-01', 'unpaid completed Checkout must not activate subscription', async () => {
  const h = setup(); await h.webhook(checkoutEvent({ payment_status: 'unpaid' }));
  assert.equal(h.state.profile.subscription_status, null);
});
gap('WEBHOOK-02', 'non-subscription Checkout must not activate subscription', async () => {
  const h = setup(); await h.webhook(checkoutEvent({ mode: 'payment', subscription: null }));
  assert.equal(h.state.profile.subscription_status, null);
});
gap('WEBHOOK-03', 'unknown metadata plan must not grant access', async () => {
  const h = setup(); await h.webhook(checkoutEvent({ metadata: { supabase_user_id: USER, plan_id: 'unknown-paid-plan' } }));
  assert.equal(h.state.profileWrites, 0);
});
gap('WEBHOOK-04', 'failed deduplication insert must stop billing mutations', async () => {
  const h = setup({ eventInsertError: { code: '08006' } });
  const response = await h.webhook(checkoutEvent());
  assert.equal(h.state.profileWrites, 0); assert.ok(response.status >= 500);
});
gap('WEBHOOK-05', 'resolved Supabase write error must retry and preserve webhook delivery', async () => {
  const h = setup({ profileWriteError: { code: '08006' } });
  const response = await h.webhook(checkoutEvent());
  assert.ok(h.state.profileWrites > 1, 'withRetry must inspect resolved errors, not only rejections');
  assert.ok(response.status >= 500 || h.state.deadLetters.length > 0);
});
gap('WEBHOOK-06', 'failed write must not consume event ID and discard its redelivery', async () => {
  const h = setup({ profileWriteError: { code: '08006' } });
  await h.webhook(checkoutEvent()); h.state.options.profileWriteError = null;
  await h.webhook(checkoutEvent()); assert.equal(h.state.profile.subscription_status, 'active');
});
gap('WEBHOOK-07', 'handler and dead-letter failure must return retryable HTTP status', async () => {
  const h = setup({ profileWriteThrow: true, deadLetterError: { code: '08006' } });
  const response = await h.webhook(checkoutEvent());
  assert.ok(response.status >= 500); assert.equal(h.state.deadLetters.length, 0);
});
gap('WEBHOOK-08', 'first valid delayed event must not be discarded by its own insertion timestamp', async () => {
  const h = setup();
  await h.webhook(checkoutEvent({}, { created: Math.floor(Date.now() / 1000) - 60 }));
  assert.equal(h.state.profile.subscription_status, 'active');
});
gap('WEBHOOK-09', 'different event IDs for same Checkout must not reset usage twice', async () => {
  const h = setup(); await h.webhook(checkoutEvent()); h.state.profile.chat_messages_used = 17;
  await h.webhook(checkoutEvent({}, { id: 'evt_fixture_duplicate_object' }));
  assert.equal(h.state.profile.chat_messages_used, 17);
});
gap('WEBHOOK-10', 'paid asynchronous Checkout must activate fixture subscription', async () => {
  const h = setup();
  await h.webhook(checkoutEvent({}, { type: 'checkout.session.async_payment_succeeded' }));
  assert.equal(h.state.profile.subscription_status, 'active');
});
gap('WEBHOOK-11', 'missing Stripe key must return a controlled webhook configuration response', async () => {
  const h = setup({ env: { STRIPE_SECRET_KEY: undefined } });
  const response = await h.webhook(checkoutEvent()); assert.equal(response.status, 500);
});

// P0 patch regressions. Assertions execute actual route code and fail strictly.
for (const options of [
  { missingProfile: true }, { profileReadError: { code: '23514' } },
]) test('Checkout fails closed for missing/unreadable profile ' + JSON.stringify(options), async () => {
  const h = setup(options); assert.ok((await h.checkout()).status >= 500); noCheckoutSideEffects(h);
});
test('zero-row customer link cannot create an unlinked Checkout', async () => {
  const h = setup({ profile: { stripe_customer_id: null }, zeroProfileWrite: true });
  assert.ok((await h.checkout()).status >= 500); assert.equal(h.state.sessionCalls.length, 0);
});
test('customer creation retries use a stable per-user idempotency key', async () => {
  const h = setup({ profile: { stripe_customer_id: null }, profileWriteError: { code: '23514' } });
  await h.checkout(); h.state.options.profileWriteError = null; assert.equal((await h.checkout()).status, 200);
  assert.equal(h.state.customerCalls[0][1].idempotencyKey, h.state.customerCalls[1][1].idempotencyKey);
});
for (const price of [{ active: false }, { recurring: null }, { unit_amount: 1 }]) {
  test('Checkout rejects misconfigured Price ' + JSON.stringify(price), async () => {
    const h = setup({ price }); assert.equal((await h.checkout()).status, 409); noCheckoutSideEffects(h);
  });
}
for (const session of [
  { customer: 'cus_wrong' }, { subscription: null }, { subscription: {} },
  { metadata: { supabase_user_id: USER, plan_id: 'starter' } },
  { metadata: { supabase_user_id: 'unknown-user', plan_id: 'basic' } },
]) test('paid Checkout rejects incorrect identity ' + JSON.stringify(session), async () => {
  const h = setup(); assert.ok((await h.webhook(checkoutEvent(session))).status >= 500);
  assert.equal(h.state.profileWrites, 0); assert.equal(h.state.commits.length, 0);
});
for (const subscription of [
  { id: 'sub_wrong' }, { customer: 'cus_wrong' }, { livemode: true }, { status: 'canceled' },
  { latest_invoice: null }, { latest_invoice: 'in_unexpanded' },
  { latest_invoice: { id: 'in_fixture', customer: 'cus_fixture', status: 'open', livemode: false } },
  { latest_invoice: { id: 'in_fixture', customer: 'cus_wrong', status: 'paid', livemode: false } },
  { items: { data: [{ price: { id: 'price_fixture_pro' }, quantity: 1 }] } },
  { items: { data: [{ price: { id: 'price_fixture_basic' }, quantity: 2 }] } },
]) test('activation requires confirmed current subscription ' + JSON.stringify(subscription), async () => {
  const h = setup({ subscription }); assert.ok((await h.webhook(checkoutEvent())).status >= 500);
  assert.equal(h.state.profileWrites, 0); assert.equal(h.state.commits.length, 0);
});
test('expanded customer and subscription objects use their IDs', async () => {
  const h = setup();
  assert.equal((await h.webhook(checkoutEvent({ customer: { id: 'cus_fixture' }, subscription: { id: 'sub_fixture' } }))).status, 200);
  assert.equal(h.state.profile.subscription_status, 'active');
});
test('unpaid completion then independent async paid event activates only once', async () => {
  const h = setup();
  assert.equal((await h.webhook(checkoutEvent({ payment_status: 'unpaid' }))).status, 200);
  assert.equal(h.state.profileWrites, 0);
  assert.equal((await h.webhook(checkoutEvent({}, { id: 'evt_async', type: 'checkout.session.async_payment_succeeded' }))).status, 200);
  assert.equal(h.state.profileWrites, 1);
});
test('no_payment_required does not grant a paid plan implicitly', async () => {
  const h = setup(); await h.webhook(checkoutEvent({ payment_status: 'no_payment_required' }));
  assert.equal(h.state.profileWrites, 0);
});
for (const failure of ['commitReadError','eventInsertError','auditReadError','auditWriteError','commitWriteError']) {
  test(`${failure} returns 5xx and leaves all financial state retryable`, async () => {
    const h = setup({ [failure]: { code: '23514' } });
    const event = checkoutEvent(); const before = JSON.stringify(h.state.profile);
    assert.ok((await h.webhook(event)).status >= 500);
    assert.equal(JSON.stringify(h.state.profile), before);
    assert.equal(h.state.commits.length, 0); assert.equal(h.state.audits.length, 0);
    h.state.options[failure] = null;
    assert.equal((await h.webhook(event)).status, 200);
    assert.equal(h.state.profile.subscription_status, 'active');
  });
}
test('open database circuit returns 5xx without profile effects', async () => {
  const h = setup({ eventInsertThrow: true });
  for (let i = 0; i < 5; i++) assert.equal((await h.webhook(checkoutEvent())).status, 503);
  h.state.options.eventInsertThrow = false;
  assert.equal((await h.webhook(checkoutEvent())).status, 503);
  assert.equal(h.state.profileWrites, 0);
});
test('lost commit response retries without repeating business effect', async () => {
  const h = setup({ loseCommitResponseOnce: true });
  assert.equal((await h.webhook(checkoutEvent())).status, 200);
  assert.equal(h.state.profileWrites, 1); assert.equal(h.state.audits.length, 1);
});
test('quarantine storage failure returns 5xx and does not consume event', async () => {
  const h = setup({ flags: { 'billing-webhook-quarantine': true }, deadLetterError: { code: '23514' } });
  const event = invoiceEvent(); event.data.object.amount_due = 10000001;
  assert.equal((await h.webhook(event)).status, 503); assert.equal(h.state.commits.length, 0);
  h.state.options.deadLetterError = null;
  const response = await h.webhook(event); assert.equal(response.status, 200);
  assert.equal((await response.json()).quarantined, true); assert.equal(h.state.profileWrites, 0);
});
function subscriptionEvent(overrides = {}, type = 'customer.subscription.updated') {
  return checkoutEvent({}, { id: 'evt_sub_update', type, data: { object: { id: 'sub_fixture', customer: 'cus_fixture',
    status: 'active', items: { data: [{ price: { id: 'price_fixture_basic' }, quantity: 1 }] }, ...overrides } } });
}
test('subscription update cannot create first entitlement without paid Checkout binding', async () => {
  const h = setup(); assert.equal((await h.webhook(subscriptionEvent())).status, 503); assert.equal(h.state.profileWrites, 0);
});
test('subscription update cannot activate an unpaid invoice', async () => {
  const h = setup({ profile: { stripe_subscription_id: 'sub_fixture', subscription_status: 'past_due' },
    subscription: { latest_invoice: { id: 'in_fixture', customer: 'cus_fixture', status: 'open', livemode: false } } });
  assert.equal((await h.webhook(subscriptionEvent())).status, 503); assert.equal(h.state.profileWrites, 0);
});
for (const type of ['customer.subscription.updated','customer.subscription.deleted']) {
  test(`${type} for another subscription cannot alter current entitlement`, async () => {
    const h = setup({ profile: { stripe_subscription_id: 'sub_current', subscription_status: 'active' } });
    assert.equal((await h.webhook(subscriptionEvent({},type))).status, 503); assert.equal(h.state.profileWrites, 0);
  });
}
test('bound paid subscription update recovers past_due without resetting usage', async () => {
  const h = setup({ profile: { stripe_subscription_id: 'sub_fixture', subscription_status: 'past_due', chat_messages_used: 17 } });
  assert.equal((await h.webhook(subscriptionEvent())).status, 200);
  assert.equal(h.state.profile.subscription_status, 'active'); assert.equal(h.state.profile.chat_messages_used, 17);
});
test('bound cancellation retains configured grace-period protection', async () => {
  const h = setup({ profile: { stripe_subscription_id: 'sub_fixture', subscription_status: 'active', plan: 'basic', chat_messages_limit: 100 },
    subscription: { status: 'canceled' }, flags: { 'billing-grace-period': true } });
  assert.equal((await h.webhook(subscriptionEvent({ status: 'canceled' }, 'customer.subscription.deleted'))).status, 200);
  assert.equal(h.state.profile.subscription_status, 'grace_period'); assert.equal(h.state.profile.chat_messages_limit, 100);
});
test('invoice event for a different subscription cannot soft-lock profile', async () => {
  const h = setup({ profile: { stripe_subscription_id: 'sub_current' } });
  assert.equal((await h.webhook(invoiceEvent())).status, 503); assert.equal(h.state.profileWrites, 0);
});
test('already paid invoice failure delivery cannot regress active status', async () => {
  const h = setup({ profile: { stripe_subscription_id: 'sub_fixture', subscription_status: 'active' } });
  assert.equal((await h.webhook(invoiceEvent())).status, 200); assert.equal(h.state.profileWrites, 0);
});
