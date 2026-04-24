// Autofinish #1003 — Unit Testovi getAutofinishProgressChangelog()
// Kompanija SPAJA — Digitalna Industrija

import { getAutofinishProgressChangelog } from '../../lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '../../lib/constants';

let passed = 0; let failed = 0; const failures: string[] = [];
async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try { await fn(); console.log(`  ✅ ${name}`); passed++; }
  catch (e) { const msg = e instanceof Error ? e.message : String(e); console.error(`  ❌ ${name}\n     ${msg}`); failed++; failures.push(`${name}: ${msg}`); }
}
function assert(c: boolean, m: string): asserts c { if (!c) throw new Error(`Assert failed: ${m}`); }
function assertEqual<T>(a: T, e: T, l?: string): void { if (a !== e) throw new Error(`${l ?? 'assertEqual'}: expected ${JSON.stringify(e)}, got ${JSON.stringify(a)}`); }

async function runTests(): Promise<void> {
  console.log('\n📋 getAutofinishProgressChangelog() — Unit Test Suite (#1003)\n');

  await test('Vraća objekat', () => { const r = getAutofinishProgressChangelog(); assert(typeof r === 'object' && r !== null, 'objekat'); });
  await test('verzija === APP_VERSION', () => { assertEqual(getAutofinishProgressChangelog().verzija, APP_VERSION, 'verzija'); });
  await test('autofinishBroj === AUTOFINISH_COUNT', () => { assertEqual(getAutofinishProgressChangelog().autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj'); });
  await test('ukupnoFaza > 0', () => { assert(getAutofinishProgressChangelog().ukupnoFaza > 0, 'ukupnoFaza > 0'); });
  await test('faze je niz', () => { assert(Array.isArray(getAutofinishProgressChangelog().faze), 'faze je niz'); });
  await test('Nema praznih faza', () => { for (const f of getAutofinishProgressChangelog().faze) assert(f.ukupnoIteracija > 0, `faza ${f.fazaId} nije prazna`); });
  await test('Svaka faza ima schema polja', () => {
    for (const f of getAutofinishProgressChangelog().faze) {
      assert(typeof f.fazaId === 'string', 'fazaId'); assert(typeof f.fazaNaziv === 'string', 'fazaNaziv');
      assert(typeof f.odBroj === 'number', 'odBroj'); assert(typeof f.doBroj === 'number', 'doBroj');
      assert(Array.isArray(f.iteracije), 'iteracije niz');
    }
  });
  await test('ukupnoIteracija = suma faza', () => {
    const r = getAutofinishProgressChangelog();
    assertEqual(r.ukupnoIteracija, r.faze.reduce((s, f) => s + f.ukupnoIteracija, 0), 'suma');
  });
  await test('timestamp je validan ISO', () => { const r = getAutofinishProgressChangelog(); assert(!isNaN(Date.parse(r.timestamp)), 'ISO'); });

  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) { console.error('\n❌ Neuspješni testovi:'); failures.forEach((f) => console.error(`  • ${f}`)); process.exit(1); }
}
runTests().catch((e) => { console.error('Greška:', e); process.exit(1); });
