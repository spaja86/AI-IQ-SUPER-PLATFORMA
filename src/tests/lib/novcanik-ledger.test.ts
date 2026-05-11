// SpajaUltraOmegaCore -∞Ω+∞ — Unit Testovi za Novčanik Ledger
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/lib/novcanik-ledger.test.ts

import {
  validateLedgerAmount,
  canDebit,
  applyLedgerEntry,
  roundLedger,
  validateDoubleEntry,
  buildLedgerEntry,
  reconcileLedger,
} from '../../lib/novcanik/ledger';

// ─── Test Runner ──────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
const failures: string[] = [];

async function test(name: string, fn: () => void): Promise<void> {
  try {
    fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`  ❌ ${name}`);
    console.error(`     ${msg}`);
    failed++;
    failures.push(`${name}: ${msg}`);
  }
}

function assert(cond: boolean, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

function assertClose(a: number, b: number, tolerance = 1e-8, label = ''): void {
  if (Math.abs(a - b) > tolerance) {
    throw new Error(`${label}: expected ${b}, got ${a}`);
  }
}

function assertThrows(fn: () => unknown, expectedMsg?: string): void {
  try {
    fn();
    throw new Error('Očekivana greška nije bačena.');
  } catch (e) {
    if (e instanceof Error && e.message === 'Očekivana greška nije bačena.') throw e;
    if (expectedMsg) {
      const actual = e instanceof Error ? e.message : String(e);
      if (!actual.includes(expectedMsg)) {
        throw new Error(`Greška treba da sadrži '${expectedMsg}', ali sadrži '${actual}'`);
      }
    }
  }
}

// ─── Tests ────────────────────────────────────────────────────────────────────

async function runTests(): Promise<void> {
  console.log('\n💼 Novčanik Ledger Test Suite\n');

  // ─── validateLedgerAmount ─────────────────────────────────────────────────

  await test('validateLedgerAmount — validan iznos prolazi', () => {
    assert(validateLedgerAmount(100).valid === true, '100 je validan');
    assert(validateLedgerAmount(0.00000001).valid === true, '1 satoshi je validan');
    assert(validateLedgerAmount(1e20).valid === true, 'veliki iznos je validan');
  });

  await test('validateLedgerAmount — nula je nevalidna', () => {
    const r = validateLedgerAmount(0);
    assert(r.valid === false, 'nula nije validna');
    assert(r.reason !== undefined, 'treba da ima reason');
  });

  await test('validateLedgerAmount — negativan broj je nevalidan', () => {
    assert(validateLedgerAmount(-1).valid === false, 'negativan nije validan');
    assert(validateLedgerAmount(-0.001).valid === false, 'mali negativan nije validan');
  });

  await test('validateLedgerAmount — NaN i Infinity su nevalidni', () => {
    assert(validateLedgerAmount(NaN).valid === false, 'NaN nije validan');
    assert(validateLedgerAmount(Infinity).valid === false, 'Infinity nije validan');
  });

  // ─── canDebit ─────────────────────────────────────────────────────────────

  await test('canDebit — vraća true ako ima dovoljno sredstava', () => {
    assert(canDebit(100, 50) === true, '100 >= 50');
    assert(canDebit(100, 100) === true, 'tačno stanje');
  });

  await test('canDebit — vraća false ako nema dovoljno', () => {
    assert(canDebit(50, 100) === false, 'nedovoljno');
    assert(canDebit(0, 0.001) === false, 'nema ništa');
  });

  // ─── applyLedgerEntry ─────────────────────────────────────────────────────

  await test('applyLedgerEntry credit — povećava stanje', () => {
    const newBalance = applyLedgerEntry(100, 'credit', 50);
    assertClose(newBalance, 150, 1e-8, 'credit');
  });

  await test('applyLedgerEntry debit — smanjuje stanje', () => {
    const newBalance = applyLedgerEntry(100, 'debit', 30);
    assertClose(newBalance, 70, 1e-8, 'debit');
  });

  await test('applyLedgerEntry debit — baca grešku za prekoračenje', () => {
    assertThrows(
      () => applyLedgerEntry(50, 'debit', 100),
      'Nedovoljno sredstava',
    );
  });

  await test('applyLedgerEntry — tačan kredit na nuli', () => {
    const newBalance = applyLedgerEntry(0, 'credit', 0.5);
    assertClose(newBalance, 0.5, 1e-8);
  });

  // ─── roundLedger ──────────────────────────────────────────────────────────

  await test('roundLedger — zaokružuje na 8 decimala', () => {
    assertClose(roundLedger(1.123456789), 1.12345679, 1e-8);
    assertClose(roundLedger(0.00000001), 0.00000001, 1e-10, '1 satoshi');
    assertClose(roundLedger(0.000000005), 0.00000001, 1e-10, 'round up satoshi');
  });

  await test('roundLedger — celi brojevi se ne menjaju', () => {
    assertClose(roundLedger(100), 100, 1e-8);
  });

  // ─── validateDoubleEntry ──────────────────────────────────────────────────

  await test('validateDoubleEntry — validan par prolazi', () => {
    const result = validateDoubleEntry({
      debitEntry: { direction: 'debit', amount: 100, entryType: 'transfer_out' },
      creditEntry: { direction: 'credit', amount: 100, entryType: 'transfer_in' },
    });
    assert(result.valid === true, 'validan par treba da prođe');
  });

  await test('validateDoubleEntry — debit i credit moraju imati isti iznos', () => {
    const result = validateDoubleEntry({
      debitEntry: { direction: 'debit', amount: 100, entryType: 'transfer_out' },
      creditEntry: { direction: 'credit', amount: 99.99, entryType: 'transfer_in' },
    });
    assert(result.valid === false, 'nejednaki iznosi su nevalidni');
  });

  await test('validateDoubleEntry — prva stavka mora biti debit', () => {
    const result = validateDoubleEntry({
      debitEntry: { direction: 'credit', amount: 100, entryType: 'deposit' },
      creditEntry: { direction: 'credit', amount: 100, entryType: 'deposit' },
    });
    assert(result.valid === false, 'credit kao "debit" nije validan');
  });

  // ─── buildLedgerEntry ────────────────────────────────────────────────────

  await test('buildLedgerEntry credit — kreće ispravno balanceAfter', () => {
    const entry = buildLedgerEntry({
      accountId: 'acc-1',
      userId: 'user-1',
      assetId: 'BTC',
      entryType: 'deposit',
      direction: 'credit',
      amount: 0.5,
      currentBalance: 1.0,
    });
    assertClose(entry.balanceAfter, 1.5, 1e-8);
    assert(entry.direction === 'credit', 'direction');
    assert(entry.entryType === 'deposit', 'entryType');
  });

  await test('buildLedgerEntry debit — smanjuje balanceAfter', () => {
    const entry = buildLedgerEntry({
      accountId: 'acc-1',
      userId: 'user-1',
      assetId: 'BTC',
      entryType: 'withdrawal',
      direction: 'debit',
      amount: 0.3,
      currentBalance: 1.0,
    });
    assertClose(entry.balanceAfter, 0.7, 1e-8);
  });

  await test('buildLedgerEntry — baca grešku za negativan iznos', () => {
    assertThrows(
      () =>
        buildLedgerEntry({
          accountId: 'acc-1',
          userId: 'user-1',
          assetId: 'BTC',
          entryType: 'deposit',
          direction: 'credit',
          amount: -1,
          currentBalance: 100,
        }),
      'Neispravni iznos',
    );
  });

  await test('buildLedgerEntry — baca grešku za overdraft', () => {
    assertThrows(
      () =>
        buildLedgerEntry({
          accountId: 'acc-1',
          userId: 'user-1',
          assetId: 'BTC',
          entryType: 'withdrawal',
          direction: 'debit',
          amount: 2,
          currentBalance: 1,
        }),
      'Nedovoljno sredstava',
    );
  });

  await test('buildLedgerEntry — idempotency key se pravilno prenosi', () => {
    const entry = buildLedgerEntry({
      accountId: 'acc-1',
      userId: 'user-1',
      assetId: 'EUR',
      entryType: 'deposit',
      direction: 'credit',
      amount: 100,
      currentBalance: 0,
      idempotencyKey: 'ik-abc-123',
      referenceId: 'dep-001',
      referenceType: 'deposit',
    });
    assert(entry.idempotencyKey === 'ik-abc-123', 'idempotency key');
    assert(entry.referenceId === 'dep-001', 'referenceId');
    assert(entry.referenceType === 'deposit', 'referenceType');
  });

  // ─── reconcileLedger ─────────────────────────────────────────────────────

  await test('reconcileLedger — prazan niz vraća 0', () => {
    assertClose(reconcileLedger([]), 0, 1e-9);
  });

  await test('reconcileLedger — suma credits i debits daje pravo stanje', () => {
    const entries = [
      { direction: 'credit' as const, amount: 100 },
      { direction: 'credit' as const, amount: 50 },
      { direction: 'debit' as const, amount: 30 },
      { direction: 'credit' as const, amount: 20 },
      { direction: 'debit' as const, amount: 10 },
    ];
    assertClose(reconcileLedger(entries), 130, 1e-8, '100+50-30+20-10=130');
  });

  await test('reconcileLedger — double-entry konzistentnost', () => {
    // Deposit: credit 100, debit 0 (nema para) => balance = 100
    // Transfer: debit 40 + credit 40 => balance ostaje isti (ako su isti asset)
    const entries = [
      { direction: 'credit' as const, amount: 100 }, // deposit
      { direction: 'debit' as const, amount: 40 },   // transfer_out
      { direction: 'credit' as const, amount: 40 },  // transfer_in
    ];
    assertClose(reconcileLedger(entries), 100, 1e-8, 'transfer ne menja balans');
  });

  await test('reconcileLedger — satoshi preciznost', () => {
    const entries = [
      { direction: 'credit' as const, amount: 0.00000001 },
      { direction: 'credit' as const, amount: 0.00000001 },
      { direction: 'debit' as const, amount: 0.00000001 },
    ];
    assertClose(reconcileLedger(entries), 0.00000001, 1e-10, '1 satoshi ostatak');
  });

  // ─── Rezultat ────────────────────────────────────────────────────────────

  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo\n`);
  if (failures.length > 0) {
    console.error('Neuspeli testovi:');
    failures.forEach((f) => console.error(`  - ${f}`));
  }

  if (failed > 0) process.exit(1);
}

runTests().catch((e) => {
  console.error('Fatalna greška u test suite:', e);
  process.exit(1);
});
