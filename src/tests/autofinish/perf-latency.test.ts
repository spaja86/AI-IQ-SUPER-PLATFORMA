// Autofinish #1050 — Unit Testovi getAutofinishPerfLatency()
// Kompanija SPAJA — Digitalna Industrija

import { getAutofinishPerfLatency } from '../../lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '../../lib/constants';

let passed = 0; let failed = 0; const failures: string[] = [];
async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try { await fn(); console.log(`  ✅ ${name}`); passed++; }
  catch (e) { const msg = e instanceof Error ? e.message : String(e); console.error(`  ❌ ${name}\n     ${msg}`); failed++; failures.push(`${name}: ${msg}`); }
}
function assert(c: boolean, m: string): asserts c { if (!c) throw new Error(`Assert failed: ${m}`); }
function assertEqual<T>(a: T, e: T, l?: string): void { if (a !== e) throw new Error(`${l ?? 'assertEqual'}: expected ${JSON.stringify(e)}, got ${JSON.stringify(a)}`); }

async function runTests(): Promise<void> {
  console.log('\n📋 getAutofinishPerfLatency() — Unit Test Suite (#1050)\n');
  await test('Vraća objekat', () => { const r = getAutofinishPerfLatency(); assert(typeof r === 'object' && r !== null, 'objekat'); });
  await test('verzija === APP_VERSION', () => { assertEqual(getAutofinishPerfLatency().verzija, APP_VERSION, 'verzija'); });
  await test('autofinishBroj === AUTOFINISH_COUNT', () => { assertEqual(getAutofinishPerfLatency().autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj'); });
  await test('ukupnoEndpointa > 0', () => { assert(getAutofinishPerfLatency().ukupnoEndpointa > 0, 'ukupnoEndpointa > 0'); });
  await test('endpoints je niz', () => { assert(Array.isArray(getAutofinishPerfLatency().endpoints), 'niz'); });
  await test('Svaki endpoint: p50 <= p95 <= p99', () => {
    for (const e of getAutofinishPerfLatency().endpoints) {
      assert(e.p50ms <= e.p95ms, `${e.endpoint}: p50(${e.p50ms}) > p95(${e.p95ms})`);
      assert(e.p95ms <= e.p99ms, `${e.endpoint}: p95(${e.p95ms}) > p99(${e.p99ms})`);
    }
  });
  await test('Svaki endpoint: errorRate 0-100', () => {
    for (const e of getAutofinishPerfLatency().endpoints) {
      assert(e.errorRate >= 0 && e.errorRate <= 100, `errorRate: ${e.errorRate}`);
    }
  });
  await test('Svaki endpoint: status validan', () => {
    const STATUSI = ['odlično', 'dobro', 'sporo', 'kritično'];
    for (const e of getAutofinishPerfLatency().endpoints) {
      assert(STATUSI.includes(e.status), `status: ${e.status}`);
    }
  });
  await test('prosjecniP95ms > 0', () => { assert(getAutofinishPerfLatency().prosjecniP95ms > 0, 'prosjecni > 0'); });
  await test('ukupnoEndpointa === endpoints.length', () => { const r = getAutofinishPerfLatency(); assertEqual(r.ukupnoEndpointa, r.endpoints.length, 'ukupno=length'); });
  await test('timestamp je validan ISO', () => { assert(!isNaN(Date.parse(getAutofinishPerfLatency().timestamp)), 'ISO'); });
  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) { console.error('\n❌ Neuspješni testovi:'); failures.forEach((f) => console.error(`  • ${f}`)); process.exit(1); }
}
runTests().catch((e) => { console.error('Greška:', e); process.exit(1); });
