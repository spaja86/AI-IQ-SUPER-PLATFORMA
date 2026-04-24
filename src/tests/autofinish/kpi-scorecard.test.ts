// Autofinish #1020 — Unit Testovi getAutofinishKpiScorecard()
// Kompanija SPAJA — Digitalna Industrija

import { getAutofinishKpiScorecard } from '../../lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '../../lib/constants';

let passed = 0; let failed = 0; const failures: string[] = [];
async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try { await fn(); console.log(`  ✅ ${name}`); passed++; }
  catch (e) { const msg = e instanceof Error ? e.message : String(e); console.error(`  ❌ ${name}\n     ${msg}`); failed++; failures.push(`${name}: ${msg}`); }
}
function assert(c: boolean, m: string): asserts c { if (!c) throw new Error(`Assert failed: ${m}`); }
function assertEqual<T>(a: T, e: T, l?: string): void { if (a !== e) throw new Error(`${l ?? 'assertEqual'}: expected ${JSON.stringify(e)}, got ${JSON.stringify(a)}`); }

async function runTests(): Promise<void> {
  console.log('\n📋 getAutofinishKpiScorecard() — Unit Test Suite (#1020)\n');
  await test('Vraća objekat', () => { const r = getAutofinishKpiScorecard(); assert(typeof r === 'object' && r !== null, 'objekat'); });
  await test('verzija === APP_VERSION', () => { assertEqual(getAutofinishKpiScorecard().verzija, APP_VERSION, 'verzija'); });
  await test('autofinishBroj === AUTOFINISH_COUNT', () => { assertEqual(getAutofinishKpiScorecard().autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj'); });
  await test('ukupnoKpi > 0', () => { assert(getAutofinishKpiScorecard().ukupnoKpi > 0, 'ukupnoKpi > 0'); });
  await test('kpis je niz', () => { assert(Array.isArray(getAutofinishKpiScorecard().kpis), 'niz'); });
  await test('Svaki KPI ima schema polja', () => {
    for (const k of getAutofinishKpiScorecard().kpis) {
      assert(typeof k.id === 'string', 'id'); assert(typeof k.naziv === 'string', 'naziv');
      assert(typeof k.vrijednost === 'number', 'vrijednost'); assert(typeof k.cilj === 'number' && k.cilj > 0, 'cilj > 0');
      assert(typeof k.jedinica === 'string', 'jedinica');
      assert(['postignut', 'u-toku', 'zaostaje'].includes(k.status), `status: ${k.status}`);
      assert(k.postotakCilja >= 0 && k.postotakCilja <= 100, `postotakCilja 0-100: ${k.postotakCilja}`);
    }
  });
  await test('postignutih + uToku + zaostaje === ukupnoKpi', () => {
    const r = getAutofinishKpiScorecard();
    assertEqual(r.postignutih + r.uToku + r.zaostaje, r.ukupnoKpi, 'suma statusova');
  });
  await test('ukupnoKpi === kpis.length', () => { const r = getAutofinishKpiScorecard(); assertEqual(r.ukupnoKpi, r.kpis.length, 'ukupno=length'); });
  await test('timestamp je validan ISO', () => { assert(!isNaN(Date.parse(getAutofinishKpiScorecard().timestamp)), 'ISO'); });
  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) { console.error('\n❌ Neuspješni testovi:'); failures.forEach((f) => console.error(`  • ${f}`)); process.exit(1); }
}
runTests().catch((e) => { console.error('Greška:', e); process.exit(1); });
