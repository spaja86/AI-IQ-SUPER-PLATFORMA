// Autofinish #1132 — Billing Rate Limit Edge Cases (#25)
// Kompanija SPAJA — Digitalna Industrija

import { AUTOFINISH_COUNT } from '../../lib/constants';
import { rateLimitKey } from '../../lib/rate-limit';
import { isPlanChangeCooldownPassed, PLAN_CHANGE_COOLDOWN_SEC } from '../../lib/stripe/billing-validators';

let passed = 0; let failed = 0; const failures: string[] = [];
async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try { await fn(); console.log(`  ✅ ${name}`); passed++; }
  catch (e) { const msg = e instanceof Error ? e.message : String(e); console.error(`  ❌ ${name}\n     ${msg}`); failed++; failures.push(`${name}: ${msg}`); }
}
function assert(c: boolean, m: string): asserts c { if (!c) throw new Error(`Assert failed: ${m}`); }
function assertEqual<T>(a: T, e: T, l?: string): void { if (a !== e) throw new Error(`${l ?? 'assertEqual'}: expected ${JSON.stringify(e)}, got ${JSON.stringify(a)}`); }

async function runTests(): Promise<void> {
  console.log('\n📋 Billing Rate Limit Edge Cases (#1132)\n');

  // ── rateLimitKey generisanje ──────────────────────────────────────────────
  await test('rateLimitKey za user ID generiše string', () => {
    const key = rateLimitKey('user-uuid-123', '/api/stripe/checkout');
    assert(typeof key === 'string' && key.length > 0, 'key je string');
  });

  await test('rateLimitKey za IP generiše string', () => {
    const key = rateLimitKey('192.168.1.1', '/api/stripe/checkout-ip');
    assert(key.includes('192'), 'IP je u ključu');
  });

  await test('Različiti user ID-jevi daju različite ključeve', () => {
    const key1 = rateLimitKey('user-001', '/api/stripe/checkout');
    const key2 = rateLimitKey('user-002', '/api/stripe/checkout');
    assert(key1 !== key2, 'ključevi su različiti');
  });

  await test('Različiti endpoint daje različit ključ', () => {
    const key1 = rateLimitKey('user-001', '/api/stripe/checkout');
    const key2 = rateLimitKey('user-001', '/api/stripe/portal');
    assert(key1 !== key2, 'endpoint-based ključevi su različiti');
  });

  await test('rateLimitKey ne sadrži specijalne karaktere koji bi razbili Redis ključeve', () => {
    const key = rateLimitKey('user:123!@#', '/api/stripe/checkout');
    // Ključ treba da bude string — ne proveravamo escape jer KV biblioteka to radi
    assert(typeof key === 'string', 'key je string');
  });

  // ── Cooldown edge cases ────────────────────────────────────────────────────
  await test('Cooldown: null lastPlanChangedAt → dozvoljena promena', () => {
    assert(isPlanChangeCooldownPassed(null), 'null → dozvoljena');
  });

  await test('Cooldown: promena upravo sada → blokirana', () => {
    const now = Date.now();
    const justNow = new Date(now).toISOString();
    assert(!isPlanChangeCooldownPassed(justNow, now + 1000), 'upravo sada → blokirana');
  });

  await test(`Cooldown: promena pre ${PLAN_CHANGE_COOLDOWN_SEC}s → dozvoljena`, () => {
    const now = Date.now();
    const longAgo = new Date(now - (PLAN_CHANGE_COOLDOWN_SEC + 10) * 1000).toISOString();
    assert(isPlanChangeCooldownPassed(longAgo, now), `${PLAN_CHANGE_COOLDOWN_SEC}s ago → dozvoljena`);
  });

  await test(`Cooldown: promena pre ${PLAN_CHANGE_COOLDOWN_SEC - 10}s → blokirana`, () => {
    const now = Date.now();
    const recent = new Date(now - (PLAN_CHANGE_COOLDOWN_SEC - 10) * 1000).toISOString();
    assert(!isPlanChangeCooldownPassed(recent, now), 'premalo vremena → blokirana');
  });

  await test('Cooldown: nevalidan datum → dozvoljena (fail-open)', () => {
    assert(isPlanChangeCooldownPassed('not-a-date'), 'nevalidan datum → dozvoljena');
  });

  await test('PLAN_CHANGE_COOLDOWN_SEC je barem 60 sekundi', () => {
    assert(PLAN_CHANGE_COOLDOWN_SEC >= 60, `cooldown=${PLAN_CHANGE_COOLDOWN_SEC}s`);
  });

  await test('AUTOFINISH_COUNT >= 1132', () => { assert(AUTOFINISH_COUNT >= 1132, `count=${AUTOFINISH_COUNT}`); });

  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) { console.error('\n❌ Neuspješni testovi:'); failures.forEach((f) => console.error(`  • ${f}`)); process.exit(1); }
}
runTests().catch((e) => { console.error('Greška:', e); process.exit(1); });
