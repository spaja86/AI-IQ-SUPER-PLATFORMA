// Autofinish #1016 — Unit Testovi getAutofinishTagSystem()
// Kompanija SPAJA — Digitalna Industrija

import { getAutofinishTagSystem } from '../../lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '../../lib/constants';

let passed = 0; let failed = 0; const failures: string[] = [];
async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try { await fn(); console.log(`  ✅ ${name}`); passed++; }
  catch (e) { const msg = e instanceof Error ? e.message : String(e); console.error(`  ❌ ${name}\n     ${msg}`); failed++; failures.push(`${name}: ${msg}`); }
}
function assert(c: boolean, m: string): asserts c { if (!c) throw new Error(`Assert failed: ${m}`); }
function assertEqual<T>(a: T, e: T, l?: string): void { if (a !== e) throw new Error(`${l ?? 'assertEqual'}: expected ${JSON.stringify(e)}, got ${JSON.stringify(a)}`); }

async function runTests(): Promise<void> {
  console.log('\n📋 getAutofinishTagSystem() — Unit Test Suite (#1016)\n');
  await test('Vraća objekat', () => { const r = getAutofinishTagSystem(); assert(typeof r === 'object' && r !== null, 'objekat'); });
  await test('verzija === APP_VERSION', () => { assertEqual(getAutofinishTagSystem().verzija, APP_VERSION, 'verzija'); });
  await test('autofinishBroj === AUTOFINISH_COUNT', () => { assertEqual(getAutofinishTagSystem().autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj'); });
  await test('ukupnoTagova > 0', () => { assert(getAutofinishTagSystem().ukupnoTagova > 0, 'ukupnoTagova > 0'); });
  await test('tagovi je niz', () => { assert(Array.isArray(getAutofinishTagSystem().tagovi), 'tagovi niz'); });
  await test('Svaki tag ima schema polja', () => {
    for (const t of getAutofinishTagSystem().tagovi) {
      assert(typeof t.tag === 'string' && t.tag.length > 0, 'tag string');
      assert(typeof t.kategorija === 'string', 'kategorija');
      assert(typeof t.frekventnost === 'number' && t.frekventnost > 0, `frekventnost > 0: ${t.frekventnost}`);
      assert(Array.isArray(t.iteracije), 'iteracije niz');
    }
  });
  await test('topTagovi je niz do 5', () => { const r = getAutofinishTagSystem(); assert(Array.isArray(r.topTagovi), 'niz'); assert(r.topTagovi.length <= 5, 'max 5'); });
  await test('topTagovi sortirani po frekventnosti desc', () => {
    const top = getAutofinishTagSystem().topTagovi;
    for (let i = 1; i < top.length; i++) assert(top[i-1].frekventnost >= top[i].frekventnost, 'sortiran desc');
  });
  await test('ukupnoTagova === tagovi.length', () => { const r = getAutofinishTagSystem(); assertEqual(r.ukupnoTagova, r.tagovi.length, 'ukupno=length'); });
  await test('timestamp je validan ISO', () => { assert(!isNaN(Date.parse(getAutofinishTagSystem().timestamp)), 'ISO'); });
  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) { console.error('\n❌ Neuspješni testovi:'); failures.forEach((f) => console.error(`  • ${f}`)); process.exit(1); }
}
runTests().catch((e) => { console.error('Greška:', e); process.exit(1); });
