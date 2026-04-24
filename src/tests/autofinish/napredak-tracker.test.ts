// Autofinish #1033 — Unit Testovi getAutofinishNapredakTracker()
// Kompanija SPAJA — Digitalna Industrija

import { getAutofinishNapredakTracker } from '../../lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '../../lib/constants';

let passed = 0; let failed = 0; const failures: string[] = [];
async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try { await fn(); console.log(`  ✅ ${name}`); passed++; }
  catch (e) { const msg = e instanceof Error ? e.message : String(e); console.error(`  ❌ ${name}\n     ${msg}`); failed++; failures.push(`${name}: ${msg}`); }
}
function assert(c: boolean, m: string): asserts c { if (!c) throw new Error(`Assert failed: ${m}`); }
function assertEqual<T>(a: T, e: T, l?: string): void { if (a !== e) throw new Error(`${l ?? 'assertEqual'}: expected ${JSON.stringify(e)}, got ${JSON.stringify(a)}`); }

async function runTests(): Promise<void> {
  console.log('\n📋 getAutofinishNapredakTracker() — Unit Test Suite (#1033)\n');
  await test('Vraća objekat', () => { const r = getAutofinishNapredakTracker(); assert(typeof r === 'object' && r !== null, 'objekat'); });
  await test('verzija === APP_VERSION', () => { assertEqual(getAutofinishNapredakTracker().verzija, APP_VERSION, 'verzija'); });
  await test('autofinishBroj === AUTOFINISH_COUNT', () => { assertEqual(getAutofinishNapredakTracker().autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj'); });
  await test('ukupnoFaza > 0', () => { assert(getAutofinishNapredakTracker().ukupnoFaza > 0, 'ukupnoFaza > 0'); });
  await test('faze je niz', () => { assert(Array.isArray(getAutofinishNapredakTracker().faze), 'niz'); });
  await test('globalniProgres 0-100', () => { const p = getAutofinishNapredakTracker().globalniProgres; assert(p >= 0 && p <= 100, `progres: ${p}`); });
  await test('Svaka faza ima schema polja', () => {
    for (const f of getAutofinishNapredakTracker().faze) {
      assert(typeof f.fazaId === 'string', 'fazaId');
      assert(typeof f.naziv === 'string', 'naziv');
      assert(f.progres >= 0 && f.progres <= 100, `progres 0-100: ${f.progres}`);
      assert(f.zavrseno >= 0, 'zavrseno >= 0');
      assert(f.ukupno > 0, 'ukupno > 0');
      assert(Array.isArray(f.kategorije), 'kategorije niz');
    }
  });
  await test('Svaka kategorija ima naziv i progres', () => {
    for (const f of getAutofinishNapredakTracker().faze) {
      for (const k of f.kategorije) {
        assert(typeof k.naziv === 'string', 'kategorija naziv'); assert(k.progres >= 0 && k.progres <= 100, `progres: ${k.progres}`);
      }
    }
  });
  await test('ukupnoFaza === faze.length', () => { const r = getAutofinishNapredakTracker(); assertEqual(r.ukupnoFaza, r.faze.length, 'ukupno=length'); });
  await test('timestamp je validan ISO', () => { assert(!isNaN(Date.parse(getAutofinishNapredakTracker().timestamp)), 'ISO'); });
  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) { console.error('\n❌ Neuspješni testovi:'); failures.forEach((f) => console.error(`  • ${f}`)); process.exit(1); }
}
runTests().catch((e) => { console.error('Greška:', e); process.exit(1); });
