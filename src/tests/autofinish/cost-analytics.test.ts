// Autofinish #1067 — Unit Testovi getAutofinishCostAnalytics()
// Kompanija SPAJA — Digitalna Industrija

import { getAutofinishCostAnalytics } from '../../lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '../../lib/constants';

let passed = 0; let failed = 0; const failures: string[] = [];
async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try { await fn(); console.log(`  ✅ ${name}`); passed++; }
  catch (e) { const msg = e instanceof Error ? e.message : String(e); console.error(`  ❌ ${name}\n     ${msg}`); failed++; failures.push(`${name}: ${msg}`); }
}
function assert(c: boolean, m: string): asserts c { if (!c) throw new Error(`Assert failed: ${m}`); }
function assertEqual<T>(a: T, e: T, l?: string): void { if (a !== e) throw new Error(`${l ?? 'assertEqual'}: expected ${JSON.stringify(e)}, got ${JSON.stringify(a)}`); }

async function runTests(): Promise<void> {
  console.log('\n📋 getAutofinishCostAnalytics() — Unit Test Suite (#1067)\n');
  await test('Vraća objekat', () => { const r = getAutofinishCostAnalytics(); assert(typeof r === 'object' && r !== null, 'objekat'); });
  await test('verzija === APP_VERSION', () => { assertEqual(getAutofinishCostAnalytics().verzija, APP_VERSION, 'verzija'); });
  await test('autofinishBroj === AUTOFINISH_COUNT', () => { assertEqual(getAutofinishCostAnalytics().autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj'); });
  await test('ukupnoServisa > 0', () => { assert(getAutofinishCostAnalytics().ukupnoServisa > 0, 'ukupnoServisa > 0'); });
  await test('services je niz', () => { assert(Array.isArray(getAutofinishCostAnalytics().services), 'niz'); });
  await test('Svaki servis: troškovi >= 0', () => {
    for (const s of getAutofinishCostAnalytics().services) {
      assert(s.mjesecniAktual >= 0, `${s.id}: aktual < 0`);
      assert(s.mjesecniBudzet >= 0, `${s.id}: budzet < 0`);
      assert(s.dnevniAktual >= 0, `${s.id}: dnevni < 0`);
    }
  });
  await test('Svaki servis: trend validan', () => {
    const TRENDOVI = ['rast', 'pad', 'stabilan'];
    for (const s of getAutofinishCostAnalytics().services) {
      assert(TRENDOVI.includes(s.trend), `trend: ${s.trend}`);
    }
  });
  await test('budzetnoPokrice 0-200', () => { const b = getAutofinishCostAnalytics().budzetnoPokrice; assert(b >= 0 && b <= 200, `pokrice: ${b}`); });
  await test('valuta je string', () => { assert(typeof getAutofinishCostAnalytics().valuta === 'string', 'valuta'); });
  await test('ukupnoServisa === services.length', () => { const r = getAutofinishCostAnalytics(); assertEqual(r.ukupnoServisa, r.services.length, 'ukupno=length'); });
  await test('timestamp je validan ISO', () => { assert(!isNaN(Date.parse(getAutofinishCostAnalytics().timestamp)), 'ISO'); });
  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) { console.error('\n❌ Neuspješni testovi:'); failures.forEach((f) => console.error(`  • ${f}`)); process.exit(1); }
}
runTests().catch((e) => { console.error('Greška:', e); process.exit(1); });
