// Autofinish #1045 — Unit Testovi getAutofinishKomunikacioniLog()
// Kompanija SPAJA — Digitalna Industrija

import { getAutofinishKomunikacioniLog } from '../../lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '../../lib/constants';

let passed = 0; let failed = 0; const failures: string[] = [];
async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try { await fn(); console.log(`  ✅ ${name}`); passed++; }
  catch (e) { const msg = e instanceof Error ? e.message : String(e); console.error(`  ❌ ${name}\n     ${msg}`); failed++; failures.push(`${name}: ${msg}`); }
}
function assert(c: boolean, m: string): asserts c { if (!c) throw new Error(`Assert failed: ${m}`); }
function assertEqual<T>(a: T, e: T, l?: string): void { if (a !== e) throw new Error(`${l ?? 'assertEqual'}: expected ${JSON.stringify(e)}, got ${JSON.stringify(a)}`); }

async function runTests(): Promise<void> {
  console.log('\n📋 getAutofinishKomunikacioniLog() — Unit Test Suite (#1045)\n');
  await test('Vraća objekat', () => { const r = getAutofinishKomunikacioniLog(); assert(typeof r === 'object' && r !== null, 'objekat'); });
  await test('verzija === APP_VERSION', () => { assertEqual(getAutofinishKomunikacioniLog().verzija, APP_VERSION, 'verzija'); });
  await test('autofinishBroj === AUTOFINISH_COUNT', () => { assertEqual(getAutofinishKomunikacioniLog().autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj'); });
  await test('ukupnoEntries > 0', () => { assert(getAutofinishKomunikacioniLog().ukupnoEntries > 0, 'ukupnoEntries > 0'); });
  await test('entries je niz', () => { assert(Array.isArray(getAutofinishKomunikacioniLog().entries), 'niz'); });
  await test('Svaki entry ima schema polja', () => {
    const TIPOVI = ['odluka', 'info', 'upozorenje', 'akcija', 'milestone'];
    for (const e of getAutofinishKomunikacioniLog().entries) {
      assert(typeof e.id === 'string', 'id'); assert(typeof e.poruka === 'string', 'poruka');
      assert(TIPOVI.includes(e.tip), `tip: ${e.tip}`);
      assert(typeof e.iteracija === 'number' && e.iteracija > 0, 'iteracija > 0');
      assert(Array.isArray(e.tagovi), 'tagovi niz');
    }
  });
  await test('odluke >= 1', () => { assert(getAutofinishKomunikacioniLog().odluke >= 1, 'odluke >= 1'); });
  await test('milestones >= 1', () => { assert(getAutofinishKomunikacioniLog().milestones >= 1, 'milestones >= 1'); });
  await test('ukupnoEntries === entries.length', () => { const r = getAutofinishKomunikacioniLog(); assertEqual(r.ukupnoEntries, r.entries.length, 'ukupno=length'); });
  await test('timestamp je validan ISO', () => { assert(!isNaN(Date.parse(getAutofinishKomunikacioniLog().timestamp)), 'ISO'); });
  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) { console.error('\n❌ Neuspješni testovi:'); failures.forEach((f) => console.error(`  • ${f}`)); process.exit(1); }
}
runTests().catch((e) => { console.error('Greška:', e); process.exit(1); });
