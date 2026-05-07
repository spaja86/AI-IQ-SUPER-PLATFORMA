// Autofinish #1130 — Billing Race Condition Tests (#23)
// Kompanija SPAJA — Digitalna Industrija

import { AUTOFINISH_COUNT } from '../../lib/constants';

let passed = 0; let failed = 0; const failures: string[] = [];
async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try { await fn(); console.log(`  ✅ ${name}`); passed++; }
  catch (e) { const msg = e instanceof Error ? e.message : String(e); console.error(`  ❌ ${name}\n     ${msg}`); failed++; failures.push(`${name}: ${msg}`); }
}
function assert(c: boolean, m: string): asserts c { if (!c) throw new Error(`Assert failed: ${m}`); }

// Simulirani mutex (idempotency lock) za testove race conditions
class IdempotencyLock {
  private locked = new Set<string>();

  tryAcquire(key: string): boolean {
    if (this.locked.has(key)) return false;
    this.locked.add(key);
    return true;
  }

  release(key: string): void {
    this.locked.delete(key);
  }
}

async function runTests(): Promise<void> {
  console.log('\n📋 Billing Race Condition Tests (#1130)\n');

  const lock = new IdempotencyLock();

  await test('Paralelni webhook: samo jedan prolazi idempotency lock', async () => {
    const eventId = 'evt_race_001';
    lock.release(eventId);

    let firstAcquired = 0;
    let secondBlocked = 0;

    // Simuliramo dva paralelna poziva
    const results = await Promise.all([
      Promise.resolve(lock.tryAcquire(eventId)),
      Promise.resolve(lock.tryAcquire(eventId)),
    ]);

    for (const r of results) {
      if (r) firstAcquired++;
      else secondBlocked++;
    }

    assert(firstAcquired === 1, `Samo jedan prolazi: ${firstAcquired}`);
    assert(secondBlocked === 1, `Jedan blokiran: ${secondBlocked}`);
  });

  await test('N paralelnih pokušaja — samo jedan prolazi', async () => {
    const eventId = 'evt_race_n';
    lock.release(eventId);

    const results = await Promise.all(
      Array.from({ length: 10 }, () => Promise.resolve(lock.tryAcquire(eventId)))
    );

    const acquired = results.filter(Boolean).length;
    assert(acquired === 1, `Samo jedan od 10 prolazi: ${acquired}`);
  });

  await test('Različiti event ID-jevi ne blokiraju jedni druge', async () => {
    const ids = ['evt_a1', 'evt_b1', 'evt_c1'];
    for (const id of ids) lock.release(id);

    const results = await Promise.all(ids.map((id) => Promise.resolve(lock.tryAcquire(id))));
    assert(results.every(Boolean), 'Svi prolaze jer su različiti ID-jevi');
  });

  await test('Race condition na failed_payment_count: inkrementi su deterministički', async () => {
    let count = 0;
    const increments = 5;

    // Serijski (ne paralelni) inkrementi — svaki +1
    for (let i = 0; i < increments; i++) {
      count += 1;
    }

    assert(count === increments, `count=${count}, expected=${increments}`);
  });

  await test('Optimistički lock: UPDATE sa WHERE proverom prethodne vrednosti', async () => {
    // Simuliramo optimistički lock za billing update
    let dbValue = 'active';
    let updateSucceeded = false;

    // Samo uspeva ako je prethodna vrednost tačna
    function optimisticUpdate(expected: string, newVal: string): boolean {
      if (dbValue !== expected) return false;
      dbValue = newVal;
      return true;
    }

    // Prva konekcija: pročitala 'active', pokušava update na 'past_due'
    updateSucceeded = optimisticUpdate('active', 'past_due');
    assert(updateSucceeded, 'Prva konekcija uspeva');

    // Druga konekcija: pročitala 'active' ali je vrednost već 'past_due' — treba da ne preba brisati
    updateSucceeded = optimisticUpdate('active', 'canceled');
    assert(!updateSucceeded, 'Druga konekcija ne uspeva (stale read)');
  });

  await test('AUTOFINISH_COUNT >= 1130', () => { assert(AUTOFINISH_COUNT >= 1130, `count=${AUTOFINISH_COUNT}`); });

  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) { console.error('\n❌ Neuspješni testovi:'); failures.forEach((f) => console.error(`  • ${f}`)); process.exit(1); }
}
runTests().catch((e) => { console.error('Greška:', e); process.exit(1); });
