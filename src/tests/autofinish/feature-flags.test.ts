// Autofinish #1075 — Unit Testovi getAutofinishFeatureFlags()
// Kompanija SPAJA — Digitalna Industrija

import { getAutofinishFeatureFlags } from '../../lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '../../lib/constants';

let passed = 0; let failed = 0; const failures: string[] = [];
async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try { await fn(); console.log(`  ✅ ${name}`); passed++; }
  catch (e) { const msg = e instanceof Error ? e.message : String(e); console.error(`  ❌ ${name}\n     ${msg}`); failed++; failures.push(`${name}: ${msg}`); }
}
function assert(c: boolean, m: string): asserts c { if (!c) throw new Error(`Assert failed: ${m}`); }
function assertEqual<T>(a: T, e: T, l?: string): void { if (a !== e) throw new Error(`${l ?? 'assertEqual'}: expected ${JSON.stringify(e)}, got ${JSON.stringify(a)}`); }

async function runTests(): Promise<void> {
  console.log('\n📋 getAutofinishFeatureFlags() — Unit Test Suite (#1075)\n');
  await test('Vraća objekat', () => { const r = getAutofinishFeatureFlags(); assert(typeof r === 'object' && r !== null, 'objekat'); });
  await test('verzija === APP_VERSION', () => { assertEqual(getAutofinishFeatureFlags().verzija, APP_VERSION, 'verzija'); });
  await test('autofinishBroj === AUTOFINISH_COUNT', () => { assertEqual(getAutofinishFeatureFlags().autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj'); });
  await test('ukupnoFlagova > 0', () => { assert(getAutofinishFeatureFlags().ukupnoFlagova > 0, 'ukupno > 0'); });
  await test('flags je niz', () => { assert(Array.isArray(getAutofinishFeatureFlags().flags), 'niz'); });
  await test('Svaki flag: rollout 0-100', () => {
    for (const f of getAutofinishFeatureFlags().flags) {
      assert(f.rolloutPct >= 0 && f.rolloutPct <= 100, `rollout: ${f.rolloutPct}`);
    }
  });
  await test('Svaki flag: tip validan', () => {
    const TIPOVI = ['boolean', 'percentage', 'ab-test', 'multivariant'];
    for (const f of getAutofinishFeatureFlags().flags) { assert(TIPOVI.includes(f.tip), `tip: ${f.tip}`); }
  });
  await test('Svaki flag: status validan', () => {
    const STATUSI = ['aktivan', 'neaktivan', 'testiranje', 'depreciran'];
    for (const f of getAutofinishFeatureFlags().flags) { assert(STATUSI.includes(f.status), `status: ${f.status}`); }
  });
  await test('aktivnih + neaktivnih + uTestiranju <= ukupnoFlagova', () => {
    const r = getAutofinishFeatureFlags(); assert(r.aktivnih + r.neaktivnih + r.uTestiranju <= r.ukupnoFlagova, 'suma <= ukupno');
  });
  await test('ukupnoFlagova === flags.length', () => { const r = getAutofinishFeatureFlags(); assertEqual(r.ukupnoFlagova, r.flags.length, 'ukupno=length'); });
  await test('timestamp je validan ISO', () => { assert(!isNaN(Date.parse(getAutofinishFeatureFlags().timestamp)), 'ISO'); });
  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) { console.error('\n❌ Neuspješni testovi:'); failures.forEach((f) => console.error(`  • ${f}`)); process.exit(1); }
}
runTests().catch((e) => { console.error('Greška:', e); process.exit(1); });
