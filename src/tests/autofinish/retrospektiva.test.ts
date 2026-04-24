// Autofinish #1024 — Unit Testovi getAutofinishRetrospektiva()
// Kompanija SPAJA — Digitalna Industrija

import { getAutofinishRetrospektiva } from '../../lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '../../lib/constants';

let passed = 0; let failed = 0; const failures: string[] = [];
async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try { await fn(); console.log(`  ✅ ${name}`); passed++; }
  catch (e) { const msg = e instanceof Error ? e.message : String(e); console.error(`  ❌ ${name}\n     ${msg}`); failed++; failures.push(`${name}: ${msg}`); }
}
function assert(c: boolean, m: string): asserts c { if (!c) throw new Error(`Assert failed: ${m}`); }
function assertEqual<T>(a: T, e: T, l?: string): void { if (a !== e) throw new Error(`${l ?? 'assertEqual'}: expected ${JSON.stringify(e)}, got ${JSON.stringify(a)}`); }

async function runTests(): Promise<void> {
  console.log('\n📋 getAutofinishRetrospektiva() — Unit Test Suite (#1024)\n');
  await test('Vraća objekat', () => { const r = getAutofinishRetrospektiva(); assert(typeof r === 'object' && r !== null, 'objekat'); });
  await test('verzija === APP_VERSION', () => { assertEqual(getAutofinishRetrospektiva().verzija, APP_VERSION, 'verzija'); });
  await test('autofinishBroj === AUTOFINISH_COUNT', () => { assertEqual(getAutofinishRetrospektiva().autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj'); });
  await test('ukupnoSprintova > 0', () => { assert(getAutofinishRetrospektiva().ukupnoSprintova > 0, 'ukupnoSprintova > 0'); });
  await test('sprintovi je niz', () => { assert(Array.isArray(getAutofinishRetrospektiva().sprintovi), 'niz'); });
  await test('Svaki sprint ima schema polja', () => {
    for (const s of getAutofinishRetrospektiva().sprintovi) {
      assert(typeof s.sprintId === 'string', 'sprintId'); assert(typeof s.naziv === 'string', 'naziv');
      assert(Array.isArray(s.dobro) && s.dobro.length > 0, 'dobro > 0');
      assert(Array.isArray(s.loshe) && s.loshe.length > 0, 'loshe > 0');
      assert(Array.isArray(s.akcije) && s.akcije.length > 0, 'akcije > 0');
    }
  });
  await test('Svaka akcija ima schema polja', () => {
    for (const s of getAutofinishRetrospektiva().sprintovi) {
      for (const a of s.akcije) {
        assert(typeof a.akcija === 'string', 'akcija string'); assert(typeof a.vlasnik === 'string', 'vlasnik');
        assert(typeof a.prioritet === 'number' && a.prioritet >= 1, 'prioritet >= 1');
      }
    }
  });
  await test('ukupnoAkcija = suma svih akcija', () => {
    const r = getAutofinishRetrospektiva();
    assertEqual(r.ukupnoAkcija, r.sprintovi.reduce((s, sp) => s + sp.akcije.length, 0), 'suma akcija');
  });
  await test('timestamp je validan ISO', () => { assert(!isNaN(Date.parse(getAutofinishRetrospektiva().timestamp)), 'ISO'); });
  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) { console.error('\n❌ Neuspješni testovi:'); failures.forEach((f) => console.error(`  • ${f}`)); process.exit(1); }
}
runTests().catch((e) => { console.error('Greška:', e); process.exit(1); });
