// Autofinish #1037 — Unit Testovi getAutofinishResursi()
// Kompanija SPAJA — Digitalna Industrija

import { getAutofinishResursi } from '../../lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '../../lib/constants';

let passed = 0; let failed = 0; const failures: string[] = [];
async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try { await fn(); console.log(`  ✅ ${name}`); passed++; }
  catch (e) { const msg = e instanceof Error ? e.message : String(e); console.error(`  ❌ ${name}\n     ${msg}`); failed++; failures.push(`${name}: ${msg}`); }
}
function assert(c: boolean, m: string): asserts c { if (!c) throw new Error(`Assert failed: ${m}`); }
function assertEqual<T>(a: T, e: T, l?: string): void { if (a !== e) throw new Error(`${l ?? 'assertEqual'}: expected ${JSON.stringify(e)}, got ${JSON.stringify(a)}`); }

async function runTests(): Promise<void> {
  console.log('\n📋 getAutofinishResursi() — Unit Test Suite (#1037)\n');
  await test('Vraća objekat', () => { const r = getAutofinishResursi(); assert(typeof r === 'object' && r !== null, 'objekat'); });
  await test('verzija === APP_VERSION', () => { assertEqual(getAutofinishResursi().verzija, APP_VERSION, 'verzija'); });
  await test('autofinishBroj === AUTOFINISH_COUNT', () => { assertEqual(getAutofinishResursi().autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj'); });
  await test('ukupnoResursa > 0', () => { assert(getAutofinishResursi().ukupnoResursa > 0, 'ukupnoResursa > 0'); });
  await test('resursi je niz', () => { assert(Array.isArray(getAutofinishResursi().resursi), 'niz'); });
  await test('Svaki resurs ima schema polja', () => {
    for (const r of getAutofinishResursi().resursi) {
      assert(typeof r.id === 'string', 'id'); assert(typeof r.naziv === 'string', 'naziv');
      assert(r.iskorištenost >= 0 && r.iskorištenost <= 100, `iskorištenost 0-100: ${r.iskorištenost}`);
      assert(r.kapacitet > 0, 'kapacitet > 0');
      assert(['normalno', 'povišeno', 'kritično'].includes(r.status), `status: ${r.status}`);
      assert(['rast', 'pad', 'stabilno'].includes(r.trend), `trend: ${r.trend}`);
    }
  });
  await test('prosjecnaIskoristennost 0-100', () => { const p = getAutofinishResursi().prosjecnaIskoristennost; assert(p >= 0 && p <= 100, `prosjecna: ${p}`); });
  await test('ukupnoResursa === resursi.length', () => { const r = getAutofinishResursi(); assertEqual(r.ukupnoResursa, r.resursi.length, 'ukupno=length'); });
  await test('timestamp je validan ISO', () => { assert(!isNaN(Date.parse(getAutofinishResursi().timestamp)), 'ISO'); });
  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) { console.error('\n❌ Neuspješni testovi:'); failures.forEach((f) => console.error(`  • ${f}`)); process.exit(1); }
}
runTests().catch((e) => { console.error('Greška:', e); process.exit(1); });
