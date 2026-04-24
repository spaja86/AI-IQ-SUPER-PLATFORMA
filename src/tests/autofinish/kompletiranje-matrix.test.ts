// Autofinish #1007 — Unit Testovi getAutofinishKompletiranjMatrix()
// Kompanija SPAJA — Digitalna Industrija

import { getAutofinishKompletiranjMatrix } from '../../lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '../../lib/constants';

let passed = 0; let failed = 0; const failures: string[] = [];
async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try { await fn(); console.log(`  ✅ ${name}`); passed++; }
  catch (e) { const msg = e instanceof Error ? e.message : String(e); console.error(`  ❌ ${name}\n     ${msg}`); failed++; failures.push(`${name}: ${msg}`); }
}
function assert(c: boolean, m: string): asserts c { if (!c) throw new Error(`Assert failed: ${m}`); }
function assertEqual<T>(a: T, e: T, l?: string): void { if (a !== e) throw new Error(`${l ?? 'assertEqual'}: expected ${JSON.stringify(e)}, got ${JSON.stringify(a)}`); }

async function runTests(): Promise<void> {
  console.log('\n📋 getAutofinishKompletiranjMatrix() — Unit Test Suite (#1007)\n');

  await test('Vraća objekat', () => { const r = getAutofinishKompletiranjMatrix(); assert(typeof r === 'object' && r !== null, 'objekat'); });
  await test('verzija === APP_VERSION', () => { assertEqual(getAutofinishKompletiranjMatrix().verzija, APP_VERSION, 'verzija'); });
  await test('autofinishBroj === AUTOFINISH_COUNT', () => { assertEqual(getAutofinishKompletiranjMatrix().autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj'); });
  await test('dimenzija === 9', () => { assertEqual(getAutofinishKompletiranjMatrix().dimenzija, 9, 'dimenzija=9'); });
  await test('redovi.length === 9', () => { assertEqual(getAutofinishKompletiranjMatrix().redovi.length, 9, 'redovi=9'); });
  await test('kolone.length === 9', () => { assertEqual(getAutofinishKompletiranjMatrix().kolone.length, 9, 'kolone=9'); });
  await test('matrica je 9x9 niz nizova', () => {
    const r = getAutofinishKompletiranjMatrix();
    assert(Array.isArray(r.matrica), 'matrica je niz'); assertEqual(r.matrica.length, 9, 'matrica.length=9');
    for (const red of r.matrica) { assert(Array.isArray(red), 'red je niz'); assertEqual(red.length, 9, 'red.length=9'); }
  });
  await test('Dijagonala = 100', () => {
    const r = getAutofinishKompletiranjMatrix();
    for (let i = 0; i < 9; i++) assert(r.matrica[i][i].vrijednost === 100, `dijagonala[${i}]=100`);
  });
  await test('Sve vrijednosti 0-100', () => {
    const r = getAutofinishKompletiranjMatrix();
    for (const red of r.matrica) for (const c of red) assert(c.vrijednost >= 0 && c.vrijednost <= 100, `vrijednost 0-100: ${c.vrijednost}`);
  });
  await test('timestamp je validan ISO', () => { const r = getAutofinishKompletiranjMatrix(); assert(!isNaN(Date.parse(r.timestamp)), 'ISO'); });

  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) { console.error('\n❌ Neuspješni testovi:'); failures.forEach((f) => console.error(`  • ${f}`)); process.exit(1); }
}
runTests().catch((e) => { console.error('Greška:', e); process.exit(1); });
