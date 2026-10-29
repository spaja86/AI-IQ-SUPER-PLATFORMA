// Executes the actual development route with synthetic events and private temporary SQLite.
// No HTTP listener, provider calls, production credentials, or remote database operations.
import { randomBytes } from 'node:crypto';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { GET, POST } from '../src/app/api/dev/spaja-billing/world-bank/route';

if (process.env.NODE_ENV === 'production') throw new Error('Development demonstration only');
const directory = mkdtempSync(join(tmpdir(), 'spaja-billing-demo-'));
const originalEnv = { ...process.env };
const read = randomBytes(32).toString('hex'), write = randomBytes(32).toString('hex');
Object.assign(process.env, { NODE_ENV: 'test', SPAJA_BILLING_TEST_ENABLED: 'true',
  SPAJA_BILLING_TEST_DIRECTORY: directory, SPAJA_BILLING_TEST_TENANT: 'demo',
  SPAJA_BILLING_TEST_READ_TOKEN: read, SPAJA_BILLING_TEST_WRITE_TOKEN: write });
try {
  const base = { schemaVersion: 1, source: 'spaja-billing-test', livemode: false,
    paymentId: 'test_pay_demo', invoiceId: 'test_inv_demo', customerId: 'test_cus_demo', amountMinor: 120000,
    currency: 'RSD', occurredAt: '2026-10-29T15:00:00.000Z' };
  const capture = { ...base, eventId: 'test_evt_capture', type: 'payment.succeeded' };
  const sequence = [
    { ...base, eventId: 'test_evt_failure', type: 'payment.failed', attemptId: 'test_attempt_1' },
    capture, capture, { ...capture, eventId: 'test_evt_capture_redelivery' },
    { ...base, eventId: 'test_evt_partial', type: 'payment.reversed', reversalId: 'test_rev_partial', amountMinor: 20000 },
    { ...base, eventId: 'test_evt_full', type: 'payment.reversed', reversalId: 'test_rev_remaining', amountMinor: 100000 },
    { ...base, eventId: 'test_evt_late_failure', type: 'payment.failed', attemptId: 'test_attempt_2' },
  ];
  const deliveries = [];
  for (const event of sequence) {
    const response = await POST(new Request('http://localhost/api/dev/spaja-billing/world-bank', {
      method: 'POST', headers: { authorization: `Bearer ${write}`, 'content-type': 'application/json' }, body: JSON.stringify(event),
    }));
    if (!response.ok) throw new Error(`Demo failed: ${response.status}`);
    const body = await response.json(); deliveries.push({ httpStatus: response.status, ...body.receipt });
  }
  const response = await GET(new Request('http://localhost/api/dev/spaja-billing/world-bank', { headers: { authorization: `Bearer ${read}` } }));
  if (!response.ok) throw new Error(`Demo read failed: ${response.status}`);
  console.log(JSON.stringify({ scenario: 'SPAJA Billing → AI IQ WORLD BANK: synthetic test ledger', deliveries, final: await response.json() }, null, 2));
} finally {
  for (const key of Object.keys(process.env)) if (!(key in originalEnv)) delete process.env[key];
  Object.assign(process.env, originalEnv); rmSync(directory, { recursive: true, force: true });
}
