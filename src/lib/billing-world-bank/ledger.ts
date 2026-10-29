import { createHash, randomUUID } from 'node:crypto';
import { lstatSync, mkdirSync, openSync, closeSync, constants } from 'node:fs';
import { isAbsolute, join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { CURRENCY_EXPONENTS, LedgerError, parseTestEvent, validateTenant, type Currency, type PaymentStatus } from './contract';

type Disposition = 'applied' | 'duplicate_event' | 'duplicate_effect' | 'ignored_stale';
export interface Receipt { eventId: string; transactionId: string; paymentStatus: PaymentStatus; disposition: Disposition }
interface Payment {
  transactionId: string; paymentId: string; customerId: string; invoiceId: string; currency: Currency;
  amountMinor: number; capturedMinor: number; reversedMinor: number; status: PaymentStatus;
}
const digest = (value: unknown) => createHash('sha256').update(JSON.stringify(value)).digest('hex');

/** Local, private, synthetic ledger only. No Stripe/Supabase SDK, credentials, or network. */
export class TestBillingLedger {
  private db: DatabaseSync;
  private closed = false;
  constructor(directory: string) {
    if (!isAbsolute(directory)) throw new LedgerError('absolute_private_directory_required', 503);
    mkdirSync(directory, { recursive: true, mode: 0o700 });
    const stat = lstatSync(directory);
    if (!stat.isDirectory() || stat.isSymbolicLink() || (stat.mode & 0o077) !== 0 ||
        (process.getuid && stat.uid !== process.getuid())) throw new LedgerError('private_directory_required', 503);
    const path = join(directory, 'test-ledger.sqlite');
    // Refuse symlink targets and overly permissive files. Parent is private and server-configured.
    const fd = openSync(path, constants.O_CREAT | constants.O_RDWR | constants.O_NOFOLLOW, 0o600); closeSync(fd);
    const file = lstatSync(path);
    if (!file.isFile() || (file.mode & 0o077) !== 0 || (process.getuid && file.uid !== process.getuid())) throw new LedgerError('private_database_required', 503);
    this.db = new DatabaseSync(path, { timeout: 5000 });
    try {
      this.db.exec(`PRAGMA foreign_keys=ON; PRAGMA journal_mode=DELETE; PRAGMA synchronous=FULL;
        CREATE TABLE IF NOT EXISTS payments (
          tenant TEXT NOT NULL, paymentId TEXT NOT NULL, transactionId TEXT NOT NULL UNIQUE,
          customerId TEXT NOT NULL, invoiceId TEXT NOT NULL, currency TEXT NOT NULL,
          amountMinor INTEGER NOT NULL CHECK(amountMinor>0), capturedMinor INTEGER NOT NULL CHECK(capturedMinor>=0),
          reversedMinor INTEGER NOT NULL CHECK(reversedMinor>=0 AND reversedMinor<=capturedMinor), status TEXT NOT NULL,
          PRIMARY KEY(tenant,paymentId));
        CREATE TABLE IF NOT EXISTS effects (
          tenant TEXT NOT NULL, effectKey TEXT NOT NULL, effectHash TEXT NOT NULL, transactionId TEXT NOT NULL,
          PRIMARY KEY(tenant,effectKey), FOREIGN KEY(transactionId) REFERENCES payments(transactionId));
        CREATE TABLE IF NOT EXISTS postings (
          tenant TEXT NOT NULL, effectKey TEXT NOT NULL, transactionId TEXT NOT NULL, eventId TEXT NOT NULL,
          account TEXT NOT NULL CHECK(account IN ('test-clearing','test-revenue')), currency TEXT NOT NULL,
          signedMinor INTEGER NOT NULL, PRIMARY KEY(tenant,effectKey,account),
          FOREIGN KEY(tenant,effectKey) REFERENCES effects(tenant,effectKey));
        CREATE TABLE IF NOT EXISTS events (
          sequence INTEGER PRIMARY KEY, tenant TEXT NOT NULL, eventId TEXT NOT NULL, eventHash TEXT NOT NULL,
          transactionId TEXT NOT NULL, eventType TEXT NOT NULL, amountMinor INTEGER NOT NULL, currency TEXT NOT NULL,
          occurredAt TEXT NOT NULL, recordedAt TEXT NOT NULL, disposition TEXT NOT NULL, receipt TEXT NOT NULL,
          UNIQUE(tenant,eventId), FOREIGN KEY(transactionId) REFERENCES payments(transactionId));
        CREATE INDEX IF NOT EXISTS events_tenant_sequence ON events(tenant,sequence);
        CREATE UNIQUE INDEX IF NOT EXISTS payments_tenant_invoice ON payments(tenant,invoiceId);
      `);
    } catch (error) { this.db.close(); throw error; }
  }
  close() { if (!this.closed) { this.db.close(); this.closed = true; } }

  ingest(tenant: string, input: unknown): Receipt {
    validateTenant(tenant);
    const e = parseTestEvent(input);
    const eventHash = digest(e);
    const effectKey = e.type === 'payment.succeeded' ? `capture:${e.paymentId}`
      : e.type === 'payment.failed' ? `failure:${e.paymentId}:${e.attemptId}` : `reversal:${e.reversalId}`;
    const effectHash = digest({ paymentId: e.paymentId, customerId: e.customerId, invoiceId: e.invoiceId,
      type: e.type, currency: e.currency, amountMinor: e.amountMinor, effectKey });
    this.db.exec('BEGIN IMMEDIATE');
    try {
      const existing = this.db.prepare('SELECT eventHash,receipt FROM events WHERE tenant=? AND eventId=?').get(tenant, e.eventId);
      if (existing) {
        if (existing.eventHash !== eventHash) throw new LedgerError('event_conflict', 409);
        const result = { ...JSON.parse(existing.receipt as string), disposition: 'duplicate_event' } as Receipt;
        this.db.exec('COMMIT'); return result;
      }
      let payment = this.db.prepare('SELECT * FROM payments WHERE tenant=? AND paymentId=?').get(tenant, e.paymentId) as unknown as Payment | undefined;
      if (payment && (payment.customerId !== e.customerId || payment.invoiceId !== e.invoiceId || payment.currency !== e.currency ||
          (e.type !== 'payment.reversed' && payment.amountMinor !== e.amountMinor))) throw new LedgerError('binding_conflict', 409);
      if (!payment) {
        if (e.type === 'payment.reversed') throw new LedgerError('capture_required', 409);
        if (this.db.prepare('SELECT 1 FROM payments WHERE tenant=? AND invoiceId=?').get(tenant, e.invoiceId)) throw new LedgerError('invoice_binding_conflict', 409);
        payment = { transactionId: `test_trx_${randomUUID()}`, paymentId: e.paymentId, customerId: e.customerId,
          invoiceId: e.invoiceId, currency: e.currency, amountMinor: e.amountMinor, capturedMinor: 0, reversedMinor: 0, status: 'failed' };
        this.db.prepare('INSERT INTO payments VALUES (?,?,?,?,?,?,?,?,?,?)').run(tenant, e.paymentId,
          payment.transactionId, e.customerId, e.invoiceId, e.currency, e.amountMinor, 0, 0, 'failed');
      }
      const effect = this.db.prepare('SELECT effectHash FROM effects WHERE tenant=? AND effectKey=?').get(tenant, effectKey);
      let disposition: Disposition = 'applied';
      let delta = 0;
      if (effect) {
        if (effect.effectHash !== effectHash) throw new LedgerError('effect_conflict', 409);
        disposition = 'duplicate_effect';
      } else {
        if (e.type === 'payment.succeeded') {
          if (payment.capturedMinor !== 0) throw new LedgerError('inconsistent_capture', 409);
          payment.capturedMinor = e.amountMinor; payment.status = 'succeeded'; delta = e.amountMinor;
        } else if (e.type === 'payment.reversed') {
          if (!payment.capturedMinor) throw new LedgerError('capture_required', 409);
          if (e.amountMinor > payment.capturedMinor - payment.reversedMinor) throw new LedgerError('excess_reversal', 409);
          payment.reversedMinor += e.amountMinor; delta = -e.amountMinor;
          payment.status = payment.reversedMinor === payment.capturedMinor ? 'reversed' : 'partially_reversed';
        } else if (payment.capturedMinor > 0) { disposition = 'ignored_stale'; }
        this.db.prepare('INSERT INTO effects VALUES (?,?,?,?)').run(tenant, effectKey, effectHash, payment.transactionId);
        if (delta !== 0) {
          const insert = this.db.prepare('INSERT INTO postings VALUES (?,?,?,?,?,?,?)');
          insert.run(tenant, effectKey, payment.transactionId, e.eventId, 'test-clearing', e.currency, delta);
          insert.run(tenant, effectKey, payment.transactionId, e.eventId, 'test-revenue', e.currency, -delta);
        }
        this.db.prepare('UPDATE payments SET capturedMinor=?,reversedMinor=?,status=? WHERE tenant=? AND paymentId=?')
          .run(payment.capturedMinor, payment.reversedMinor, payment.status, tenant, e.paymentId);
      }
      const receipt: Receipt = { eventId: e.eventId, transactionId: payment.transactionId, paymentStatus: payment.status, disposition };
      this.db.prepare('INSERT INTO events (tenant,eventId,eventHash,transactionId,eventType,amountMinor,currency,occurredAt,recordedAt,disposition,receipt) VALUES (?,?,?,?,?,?,?,?,?,?,?)')
        .run(tenant, e.eventId, eventHash, payment.transactionId, e.type, e.amountMinor, e.currency, e.occurredAt, new Date().toISOString(), disposition, JSON.stringify(receipt));
      this.db.exec('COMMIT'); return receipt;
    } catch (error) { this.db.exec('ROLLBACK'); throw error; }
  }

  snapshot(tenant: string, limit = 100) {
    validateTenant(tenant);
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) throw new LedgerError('invalid_limit');
    this.db.exec('BEGIN');
    try {
      const counts = this.db.prepare(`SELECT (SELECT count(*) FROM events WHERE tenant=?) AS events,
        (SELECT count(*) FROM payments WHERE tenant=?) AS payments, (SELECT count(*) FROM postings WHERE tenant=?) AS postings`).get(tenant, tenant, tenant) as { events: number; payments: number; postings: number };
      const payments = this.db.prepare('SELECT transactionId,paymentId,customerId,invoiceId,currency,amountMinor,capturedMinor,reversedMinor,status FROM payments WHERE tenant=? ORDER BY rowid DESC LIMIT ?').all(tenant, limit) as unknown as Payment[];
      const events = this.db.prepare('SELECT eventId,transactionId,eventType,amountMinor,currency,occurredAt,recordedAt,disposition FROM events WHERE tenant=? ORDER BY sequence DESC LIMIT ?').all(tenant, limit);
      const totals = this.db.prepare(`SELECT currency,CAST(SUM(capturedMinor) AS TEXT) AS capturedMinor,
        CAST(SUM(reversedMinor) AS TEXT) AS reversedMinor,CAST(SUM(capturedMinor-reversedMinor) AS TEXT) AS netMinor,
        (SELECT CAST(COALESCE(SUM(signedMinor),0) AS TEXT) FROM postings s WHERE s.tenant=p.tenant AND s.currency=p.currency) AS balanceMinor
        FROM payments p WHERE tenant=? GROUP BY currency ORDER BY currency`).all(tenant).map(row => ({ ...row,
          currency: row.currency as Currency, capturedMinor: row.capturedMinor as string, reversedMinor: row.reversedMinor as string,
          netMinor: row.netMinor as string, balanceMinor: row.balanceMinor as string, exponent: CURRENCY_EXPONENTS[row.currency as Currency] }));
      this.db.exec('COMMIT');
      return { counts: { ...counts }, payments, events, totals, limit, truncated: counts.events > limit || counts.payments > limit };
    } catch (error) { this.db.exec('ROLLBACK'); throw error; }
  }
}
