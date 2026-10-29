import assert from 'node:assert/strict';
import { afterEach, beforeEach, test } from 'node:test';
import { mkdtempSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { GET, POST } from '../../app/api/dev/spaja-billing/world-bank/route';
import { buildAiIqWorldBankProcesiranje } from '../../lib/ai-iq-world-bank-procesiranje';

const writer = '11'.repeat(32), reader = '22'.repeat(32);
const originalEnv = { ...process.env };
let dir: string;
const payload = { schemaVersion: 1, source: 'spaja-billing-test', livemode: false,
  eventId: 'test_evt_api', paymentId: 'test_pay_api', customerId: 'test_cus_api', invoiceId: 'test_inv_api',
  type: 'payment.succeeded', amountMinor: 900, currency: 'EUR', occurredAt: '2026-10-29T13:00:00.000Z' };
beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'spaja-api-'));
  Object.assign(process.env, { NODE_ENV: 'test', SPAJA_BILLING_TEST_ENABLED: 'true', SPAJA_BILLING_TEST_DIRECTORY: dir,
    SPAJA_BILLING_TEST_TENANT: 'tenant-a', SPAJA_BILLING_TEST_WRITE_TOKEN: writer, SPAJA_BILLING_TEST_READ_TOKEN: reader });
});
afterEach(() => { for (const key of Object.keys(process.env)) if (!(key in originalEnv)) delete process.env[key]; Object.assign(process.env, originalEnv); rmSync(dir, { recursive: true, force: true }); });
function req(method = 'GET', token: string | null = reader, body: unknown = payload, headers: Record<string, string> = {}, query = '') {
  return new Request(`http://localhost/api/dev/spaja-billing/world-bank${query}`, { method,
    headers: { ...(token ? { authorization: `Bearer ${token}` } : {}), ...(method === 'POST' ? { 'content-type': 'application/json' } : {}), ...headers },
    ...(method === 'POST' ? { body: typeof body === 'string' ? body : JSON.stringify(body) } : {}) });
}
test('actual API POST → GET exposes committed test evidence and all production gates false', async () => {
  const write = await POST(req('POST', writer)); assert.equal(write.status, 201);
  const result = await write.json(); assert.equal(result.testLedgerCommitVerified, true);
  assert.equal(result.settlementVerified, false); assert.equal(result.paymentsEnabled, false);
  const response = await GET(req()); assert.equal(response.status, 200); assert.equal(response.headers.get('cache-control'), 'private, no-store');
  const view = await response.json(); assert.equal(view.ledger.counts.events, 1);
  assert.equal(view.integrations.stripeWebhook.sandboxVerified, false);
  assert.equal(view.ledger.payments[0].transactionId, result.receipt.transactionId);
});
for (const [method, token, status] of [['GET', null, 401], ['POST', null, 401], ['GET', writer, 403], ['POST', reader, 403], ['GET', 'bad', 401]] as const) {
  test(`${method} enforces financial access scope (${token === null ? 'anonymous' : token === 'bad' ? 'bad token' : 'wrong scope'})`, async () => {
    const response = await (method === 'GET' ? GET : POST)(req(method, token)); assert.equal(response.status, status);
    assert.equal(existsSync(join(dir, 'test-ledger.sqlite')), false);
    assert.equal((await response.text()).includes('test_cus'), false);
  });
}
for (const env of [{ NODE_ENV: 'production' }, { NODE_ENV: '' }, { SPAJA_BILLING_TEST_ENABLED: 'false' },
  { SPAJA_BILLING_TEST_READ_TOKEN: '' }, { SPAJA_BILLING_TEST_READ_TOKEN: writer }, { SPAJA_BILLING_TEST_DIRECTORY: 'relative' }]) {
  test(`fails closed before database access for ${Object.keys(env).join()}`, async () => {
    Object.assign(process.env, env);
    assert.equal((await GET(req())).status, 404); assert.equal((await POST(req('POST', writer))).status, 404);
    assert.equal(existsSync(join(dir, 'test-ledger.sqlite')), false);
  });
}
test('forged role, identity, forwarded IP and cookies cannot grant financial access', async () => {
  const response = await GET(req('GET', null, payload, { 'x-user-role': 'admin', 'x-tenant-id': 'tenant-a', 'x-forwarded-for': '127.0.0.1',
    'oai-authenticated-user-email': 'owner@example.test', cookie: `token=${reader}` }));
  assert.equal(response.status, 401);
});
test('server-configured tenant is isolated and cannot be overridden by body or URL', async () => {
  assert.equal((await POST(req('POST', writer, { ...payload, tenant: 'tenant-b' }))).status, 422);
  assert.equal((await GET(req('GET', reader, payload, {}, '?tenant=tenant-a'))).status, 422);
  await POST(req('POST', writer)); process.env.SPAJA_BILLING_TEST_TENANT = 'tenant-b';
  assert.equal((await (await GET(req())).json()).ledger.counts.events, 0);
});
test('duplicate is acknowledged, altered replay rejected, original record retained', async () => {
  await POST(req('POST', writer));
  const dup = await POST(req('POST', writer)); assert.equal(dup.status, 200); assert.equal((await dup.json()).receipt.disposition, 'duplicate_event');
  assert.equal((await POST(req('POST', writer, { ...payload, amountMinor: 1 }))).status, 409);
  assert.equal((await (await GET(req())).json()).ledger.counts.events, 1);
});
test('live payloads and real provider event envelopes are rejected', async () => {
  assert.equal((await POST(req('POST', writer, { ...payload, livemode: true }))).status, 422);
  assert.equal((await POST(req('POST', writer, { id: 'evt_1', type: 'invoice.paid', livemode: false }))).status, 422);
});
test('malformed JSON, oversized bodies, wrong media type and browser origin are rejected', async () => {
  assert.equal((await POST(req('POST', writer, '{'))).status, 400);
  assert.equal((await POST(req('POST', writer, ' '.repeat(17000)))).status, 413);
  assert.equal((await POST(req('POST', writer, payload, { 'content-type': 'text/plain' }))).status, 415);
  assert.equal((await POST(req('POST', writer, payload, { origin: 'https://attacker.example' }))).status, 403);
});
test('read limit is bounded and rejects coercion/unknown parameters', async () => {
  for (const query of ['?limit=0', '?limit=101', '?limit=1.5', '?limit=1&limit=2', '?cursor=1']) assert.equal((await GET(req('GET', reader, payload, {}, query))).status, 422);
  assert.equal((await GET(req('GET', reader, payload, {}, '?limit=1'))).status, 200);
});
test('storage failure returns generic 503, no successful acknowledgement or path disclosure', async () => {
  process.env.SPAJA_BILLING_TEST_DIRECTORY = '/dev/null/private';
  const response = await POST(req('POST', writer)); assert.equal(response.status, 503);
  const body = await response.text(); assert.equal(body.includes('/dev/null'), false); assert.equal(body.includes('testLedgerCommitVerified'), false);
});
test('public simulator describes fixtures and never includes authenticated ledger records', () => {
  const view = buildAiIqWorldBankProcesiranje(); assert.equal(view.environment, 'simulation');
  assert.equal(view.dataOrigin, 'static-fixtures'); assert.equal(view.paymentsEnabled, false);
  assert.equal(view.billingIntegration.integrations.stripeWebhook.sandboxVerified, false);
  assert.equal(JSON.stringify(view).includes('test_cus_api'), false);
});
