// Autofinish #1137 — Billing Chaos Tests — Stripe Timeout Scenariji (#48)
// Kompanija SPAJA — Digitalna Industrija

import { AUTOFINISH_COUNT } from '../../lib/constants';
import { CircuitBreaker, withRetry } from '../../lib/stripe/billing-guard';

let passed = 0; let failed = 0; const failures: string[] = [];
async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try { await fn(); console.log(`  ✅ ${name}`); passed++; }
  catch (e) { const msg = e instanceof Error ? e.message : String(e); console.error(`  ❌ ${name}\n     ${msg}`); failed++; failures.push(`${name}: ${msg}`); }
}
function assert(c: boolean, m: string): asserts c { if (!c) throw new Error(`Assert failed: ${m}`); }
function assertEqual<T>(a: T, e: T, l?: string): void { if (a !== e) throw new Error(`${l ?? 'assertEqual'}: expected ${JSON.stringify(e)}, got ${JSON.stringify(a)}`); }

async function runTests(): Promise<void> {
  console.log('\n📋 Billing Chaos Tests — Stripe Timeouts (#1137)\n');

  // ── Circuit Breaker testovi ───────────────────────────────────────────────
  await test('CircuitBreaker počinje u closed stanju', () => {
    const cb = new CircuitBreaker('test-cb-1');
    assertEqual(cb.getState(), 'closed', 'počinje closed');
  });

  await test('CircuitBreaker otvara nakon threshold grešaka', async () => {
    const cb = new CircuitBreaker('test-cb-2', { failureThreshold: 3 });
    const fail = () => { throw new Error('timeout'); };

    for (let i = 0; i < 3; i++) {
      try { await cb.execute(fail, () => null); } catch { /* expected */ }
    }

    assertEqual(cb.getState(), 'open', 'otvara se nakon 3 grešaka');
  });

  await test('CircuitBreaker koristi fallback kad je otvoren', async () => {
    const cb = new CircuitBreaker('test-cb-3', { failureThreshold: 1 });
    const fail = () => { throw new Error('stripe-timeout'); };
    const fallback = () => 'fallback-value';

    try { await cb.execute(fail, fallback); } catch { /* first fail */ }
    const result = await cb.execute(fail, fallback);
    assertEqual(result, 'fallback-value', 'koristi fallback');
  });

  await test('CircuitBreaker metrics vraćaju ispravne podatke', async () => {
    const cb = new CircuitBreaker('test-cb-4', { failureThreshold: 2 });
    assertEqual(cb.metrics().state, 'closed', 'closed');
    assertEqual(cb.metrics().failures, 0, 'failures=0');
    assertEqual(cb.metrics().name, 'test-cb-4', 'name');
  });

  await test('CircuitBreaker prelazi u half-open posle recoveryTime', async () => {
    const cb = new CircuitBreaker('test-cb-5', { failureThreshold: 1, recoveryTimeMs: 10 });
    const fail = () => { throw new Error('timeout'); };

    try { await cb.execute(fail, () => null); } catch { /* expected */ }
    assertEqual(cb.getState(), 'open', 'open');

    // Sačekaj recovery time
    await new Promise((r) => setTimeout(r, 15));
    assertEqual(cb.getState(), 'half-open', 'half-open posle recovery');
  });

  // ── Retry/Backoff testovi ────────────────────────────────────────────────
  await test('withRetry uspeva na prvom pokušaju', async () => {
    let attempts = 0;
    const result = await withRetry(async () => { attempts++; return 'ok'; }, { maxAttempts: 3 });
    assertEqual(result, 'ok', 'result');
    assertEqual(attempts, 1, 'attempts=1');
  });

  await test('withRetry pokušava maxAttempts puta za retryable grešku', async () => {
    let attempts = 0;
    const retryableErr = Object.assign(new Error('connection_failure'), { code: '08006' });

    try {
      await withRetry(
        async () => { attempts++; throw retryableErr; },
        { maxAttempts: 3, initialDelayMs: 1 }
      );
    } catch { /* expected */ }

    assertEqual(attempts, 3, 'attempts=3');
  });

  await test('withRetry ne pokušava ponovo za non-retryable grešku', async () => {
    let attempts = 0;
    const nonRetryableErr = Object.assign(new Error('permission_denied'), { code: '42501' });

    try {
      await withRetry(
        async () => { attempts++; throw nonRetryableErr; },
        { maxAttempts: 3, initialDelayMs: 1 }
      );
    } catch { /* expected */ }

    assertEqual(attempts, 1, 'attempts=1 za non-retryable');
  });

  await test('withRetry vraća rezultat ako drugi pokušaj uspe', async () => {
    let attempts = 0;
    const retryableErr = Object.assign(new Error('conn'), { code: '08006' });

    const result = await withRetry(
      async () => {
        attempts++;
        if (attempts < 2) throw retryableErr;
        return 'recovered';
      },
      { maxAttempts: 3, initialDelayMs: 1 }
    );

    assertEqual(result, 'recovered', 'recovered on 2nd attempt');
    assertEqual(attempts, 2, 'attempts=2');
  });

  await test('AUTOFINISH_COUNT >= 1137', () => { assert(AUTOFINISH_COUNT >= 1137, `count=${AUTOFINISH_COUNT}`); });

  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) { console.error('\n❌ Neuspješni testovi:'); failures.forEach((f) => console.error(`  • ${f}`)); process.exit(1); }
}
runTests().catch((e) => { console.error('Greška:', e); process.exit(1); });
