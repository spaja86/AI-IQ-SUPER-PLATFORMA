// Separate-process contention/crash probe. No inherited credentials or network calls.
import { TestBillingLedger } from '../../../lib/billing-world-bank/ledger';
import type { DatabaseSync } from 'node:sqlite';
const [directory, mode] = process.argv.slice(2);
const ledger = new TestBillingLedger(directory);
const event = { schemaVersion: 1, source: 'spaja-billing-test', livemode: false,
  eventId: 'test_evt_worker', paymentId: 'test_pay_worker', customerId: 'test_cus_worker', invoiceId: 'test_inv_worker',
  type: 'payment.succeeded', amountMinor: 2500, currency: 'RSD', occurredAt: '2026-10-29T14:00:00.000Z' };
if (mode === 'before-commit') {
  // Test-only fault injection into the actual connection; no production test hooks.
  const db = (ledger as unknown as { db: DatabaseSync }).db;
  db.function('pause_receipt', () => { process.send?.('before-commit'); Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0); return 0; });
  db.exec('CREATE TEMP TRIGGER pause_receipt BEFORE INSERT ON events BEGIN SELECT pause_receipt(); END');
}
process.send?.('ready');
process.once('message', () => {
  try {
    const receipt = ledger.ingest('tenant-a', event);
    if (mode === 'after-commit') { process.send?.('after-commit'); Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0); }
    process.send?.(receipt); ledger.close(); process.disconnect?.();
  } catch { ledger.close(); process.exit(1); }
});
