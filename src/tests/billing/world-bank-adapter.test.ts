import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { TestBillingLedger } from '../../lib/billing-world-bank/ledger';
import { type BillingTestEvent } from '../../lib/billing-world-bank/contract';

const dirs: string[] = [];
const ledgers: TestBillingLedger[] = [];
afterEach(() => { ledgers.splice(0).forEach(l => l.close()); dirs.splice(0).forEach(d => rmSync(d, { recursive: true, force: true })); });
function setup() {
  const dir = mkdtempSync(join(tmpdir(), 'spaja-ledger-')); dirs.push(dir);
  const ledger = new TestBillingLedger(dir); ledgers.push(ledger); return { dir, ledger };
}
export function event(overrides: Partial<BillingTestEvent> = {}): BillingTestEvent {
  return { schemaVersion: 1, source: 'spaja-billing-test', livemode: false,
    eventId: 'test_evt_1', paymentId: 'test_pay_1', customerId: 'test_cus_1', invoiceId: 'test_inv_1',
    type: 'payment.succeeded', amountMinor: 12500, currency: 'RSD',
    occurredAt: '2026-10-29T12:00:00.000Z', ...overrides };
}
test('successful test billing event creates balanced, traceable World Bank postings', () => {
  const { ledger } = setup(); const receipt = ledger.ingest('tenant-a', event());
  assert.equal(receipt.disposition, 'applied'); assert.equal(receipt.paymentStatus, 'succeeded');
  const view = ledger.snapshot('tenant-a');
  assert.equal(view.payments[0].transactionId, receipt.transactionId);
  assert.equal(view.payments[0].invoiceId, 'test_inv_1');
  assert.equal(view.payments[0].capturedMinor, 12500);
  assert.equal(view.counts.postings, 2); assert.equal(view.totals[0].balanceMinor, '0');
  assert.equal(view.events[0].eventId, 'test_evt_1');
});
test('failure has no money postings and a later success can settle the test payment once', () => {
  const { ledger } = setup();
  assert.equal(ledger.ingest('tenant-a', event({ type: 'payment.failed', attemptId: 'test_attempt_1' })).paymentStatus, 'failed');
  assert.equal(ledger.snapshot('tenant-a').counts.postings, 0);
  ledger.ingest('tenant-a', event({ eventId: 'test_evt_2' }));
  assert.equal(ledger.snapshot('tenant-a').payments[0].status, 'succeeded');
  assert.equal(ledger.snapshot('tenant-a').counts.postings, 2);
});
test('same event ID replay survives reopening the database without duplicate postings', () => {
  const { ledger, dir } = setup(); const first = ledger.ingest('tenant-a', event());
  ledger.close(); const reopened = new TestBillingLedger(dir); ledgers.push(reopened);
  const retry = reopened.ingest('tenant-a', event());
  assert.equal(retry.disposition, 'duplicate_event'); assert.equal(retry.transactionId, first.transactionId);
  assert.equal(reopened.snapshot('tenant-a').counts.events, 1);
  assert.equal(reopened.snapshot('tenant-a').counts.postings, 2);
});
test('different event ID for same business effect is recorded without duplicate money', () => {
  const { ledger } = setup(); ledger.ingest('tenant-a', event());
  assert.equal(ledger.ingest('tenant-a', event({ eventId: 'test_evt_2', occurredAt: '2026-10-29T12:01:00.000Z' })).disposition, 'duplicate_effect');
  assert.equal(ledger.snapshot('tenant-a').counts.events, 2);
  assert.equal(ledger.snapshot('tenant-a').counts.postings, 2);
});
test('reused event ID with changed content fails without mutations', () => {
  const { ledger } = setup(); ledger.ingest('tenant-a', event()); const before = ledger.snapshot('tenant-a');
  assert.throws(() => ledger.ingest('tenant-a', event({ amountMinor: 999 })), /event_conflict/);
  assert.deepEqual(ledger.snapshot('tenant-a'), before);
});
test('partial and full reversal keep the original capture and append inverse entries', () => {
  const { ledger } = setup(); ledger.ingest('tenant-a', event());
  const partial = event({ eventId: 'test_evt_2', type: 'payment.reversed', reversalId: 'test_rev_1', amountMinor: 2500 });
  assert.equal(ledger.ingest('tenant-a', partial).paymentStatus, 'partially_reversed');
  assert.equal(ledger.ingest('tenant-a', { ...partial, eventId: 'test_evt_3' }).disposition, 'duplicate_effect');
  assert.equal(ledger.ingest('tenant-a', { ...partial, eventId: 'test_evt_4', reversalId: 'test_rev_2', amountMinor: 10000 }).paymentStatus, 'reversed');
  const view = ledger.snapshot('tenant-a');
  assert.equal(view.payments[0].capturedMinor, 12500); assert.equal(view.payments[0].reversedMinor, 12500);
  assert.equal(view.counts.postings, 6); assert.equal(view.totals[0].netMinor, '0');
});
test('over-reversal and changed reversal effect payload are rejected atomically', () => {
  const { ledger } = setup(); ledger.ingest('tenant-a', event());
  const rev = event({ eventId: 'test_evt_2', type: 'payment.reversed', reversalId: 'test_rev_1', amountMinor: 500 });
  ledger.ingest('tenant-a', rev); const before = ledger.snapshot('tenant-a');
  assert.throws(() => ledger.ingest('tenant-a', { ...rev, eventId: 'test_evt_3', amountMinor: 100 }), /effect_conflict/);
  assert.throws(() => ledger.ingest('tenant-a', { ...rev, eventId: 'test_evt_4', reversalId: 'test_rev_2', amountMinor: 12500 }), /excess_reversal/);
  assert.deepEqual(ledger.snapshot('tenant-a'), before);
});
test('reversal before capture is retriable and is not prematurely acknowledged', () => {
  const { ledger } = setup(); const rev = event({ eventId: 'test_evt_2', type: 'payment.reversed', reversalId: 'test_rev_1' });
  assert.throws(() => ledger.ingest('tenant-a', rev), /capture_required/);
  assert.equal(ledger.snapshot('tenant-a').counts.events, 0);
  ledger.ingest('tenant-a', event()); assert.equal(ledger.ingest('tenant-a', rev).paymentStatus, 'reversed');
});
test('late failure and repeated success never regress a captured/reversed payment', () => {
  const { ledger } = setup(); ledger.ingest('tenant-a', event());
  ledger.ingest('tenant-a', event({ eventId: 'test_evt_2', type: 'payment.reversed', reversalId: 'test_rev_1' }));
  assert.equal(ledger.ingest('tenant-a', event({ eventId: 'test_evt_3', type: 'payment.failed', attemptId: 'test_attempt_2' })).disposition, 'ignored_stale');
  assert.equal(ledger.ingest('tenant-a', event({ eventId: 'test_evt_4' })).disposition, 'duplicate_effect');
  assert.equal(ledger.snapshot('tenant-a').payments[0].status, 'reversed');
});
for (const field of ['customerId', 'invoiceId', 'currency', 'amountMinor'] as const) {
  test(`payment binding rejects changed ${field}`, () => {
    const { ledger } = setup(); ledger.ingest('tenant-a', event());
    const changes = { customerId: 'test_cus_other', invoiceId: 'test_inv_other', currency: 'EUR', amountMinor: 1 };
    assert.throws(() => ledger.ingest('tenant-a', event({ eventId: 'test_evt_2', [field]: changes[field] })), /binding_conflict/);
  });
}
test('tenant isolation includes read, event deduplication and effect deduplication', () => {
  const { ledger } = setup(); const a = ledger.ingest('tenant-a', event());
  assert.equal(ledger.snapshot('tenant-b').counts.events, 0);
  const b = ledger.ingest('tenant-b', event()); assert.notEqual(a.transactionId, b.transactionId);
  assert.equal(ledger.snapshot('tenant-a').counts.events, 1);
});
test('same invoice cannot be captured again under a different payment ID', () => {
  const { ledger } = setup(); ledger.ingest('tenant-a', event());
  assert.throws(() => ledger.ingest('tenant-a', event({ eventId: 'test_evt_other', paymentId: 'test_pay_other' })), /invoice_binding_conflict/);
  assert.equal(ledger.snapshot('tenant-a').counts.postings, 2);
});
test('currency totals remain separate and decimal exponents explicit', () => {
  const { ledger } = setup(); ledger.ingest('tenant-a', event());
  ledger.ingest('tenant-a', event({ eventId: 'test_evt_2', paymentId: 'test_pay_2', invoiceId: 'test_inv_2', currency: 'JPY', amountMinor: 500 }));
  const totals = ledger.snapshot('tenant-a').totals;
  assert.equal(totals.length, 2); assert.equal(totals.find(t => t.currency === 'JPY')?.exponent, 0);
  assert.equal(totals.find(t => t.currency === 'RSD')?.capturedMinor, '12500');
});
test('failure during receipt insert rolls back payment, effect and postings; retry recovers', () => {
  const { ledger, dir } = setup(); const db = new DatabaseSync(join(dir, 'test-ledger.sqlite'));
  db.exec("CREATE TRIGGER fail_receipt BEFORE INSERT ON events BEGIN SELECT RAISE(ABORT, 'injected failure'); END");
  assert.throws(() => ledger.ingest('tenant-a', event()), /injected failure/);
  assert.deepEqual(ledger.snapshot('tenant-a').counts, { events: 0, payments: 0, postings: 0 });
  db.exec('DROP TRIGGER fail_receipt'); db.close();
  assert.equal(ledger.ingest('tenant-a', event()).disposition, 'applied');
});
for (const patch of [
  { livemode: true }, { source: 'stripe' }, { amountMinor: 0 }, { amountMinor: -1 },
  { amountMinor: 1.1 }, { amountMinor: Number.MAX_SAFE_INTEGER + 1 }, { amountMinor: '100' },
  { currency: 'rsd' }, { currency: 'FAKE' }, { occurredAt: 'yesterday' },
  { eventId: 'evt_live_1' }, { type: 'checkout.session.completed' }, { tenantId: 'attacker' },
  { cardNumber: 'fixture-private-data' }, { type: 'payment.failed' }, { type: 'payment.reversed' },
  { reversalId: 'test_rev_unexpected' }, { schemaVersion: 2 },
]) {
  test(`reject invalid/test-boundary input ${JSON.stringify(patch)}`, () => {
    const { ledger } = setup(); assert.throws(() => ledger.ingest('tenant-a', { ...event(), ...patch }));
    assert.equal(ledger.snapshot('tenant-a').counts.events, 0);
  });
}
