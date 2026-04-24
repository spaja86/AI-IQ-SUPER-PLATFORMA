// Autofinish #999 — Unit Testovi getAutofinishHealthScore()
// Kompanija SPAJA — Digitalna Industrija

import { getAutofinishHealthScore } from '../../lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '../../lib/constants';

let passed = 0; let failed = 0; const failures: string[] = [];
async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try { await fn(); console.log(`  ✅ ${name}`); passed++; }
  catch (e) { const msg = e instanceof Error ? e.message : String(e); console.error(`  ❌ ${name}\n     ${msg}`); failed++; failures.push(`${name}: ${msg}`); }
}
function assert(c: boolean, m: string): asserts c { if (!c) throw new Error(`Assert failed: ${m}`); }
function assertEqual<T>(a: T, e: T, l?: string): void { if (a !== e) throw new Error(`${l ?? 'assertEqual'}: expected ${JSON.stringify(e)}, got ${JSON.stringify(a)}`); }

async function runTests(): Promise<void> {
  console.log('\n📋 getAutofinishHealthScore() — Unit Test Suite (#999)\n');

  await test('Vraća objekat', () => { const r = getAutofinishHealthScore(); assert(typeof r === 'object' && r !== null, 'objekat'); });
  await test('verzija === APP_VERSION', () => { assertEqual(getAutofinishHealthScore().verzija, APP_VERSION, 'verzija'); });
  await test('autofinishBroj === AUTOFINISH_COUNT', () => { assertEqual(getAutofinishHealthScore().autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj'); });
  await test('skor je broj 0-100', () => { const r = getAutofinishHealthScore(); assert(typeof r.skor === 'number', 'skor je broj'); assert(r.skor >= 0 && r.skor <= 100, `skor 0-100: ${r.skor}`); });
  await test('ocjena je neprazan string', () => { const r = getAutofinishHealthScore(); assert(typeof r.ocjena === 'string' && r.ocjena.length > 0, 'ocjena neprazna'); });
  await test('ocjena je jedna od 4 vrijednosti', () => { const r = getAutofinishHealthScore(); assert(['Odlično', 'Dobro', 'Zadovoljavajuće', 'Kritično'].includes(r.ocjena), `ocjena: ${r.ocjena}`); });
  await test('komponente je niz od 4', () => { const r = getAutofinishHealthScore(); assert(Array.isArray(r.komponente), 'niz'); assertEqual(r.komponente.length, 4, 'length=4'); });
  await test('Svaka komponenta ima schema polja', () => {
    for (const k of getAutofinishHealthScore().komponente) {
      assert(typeof k.naziv === 'string', 'naziv'); assert(typeof k.vrijednost === 'number', 'vrijednost');
      assert(typeof k.tezina === 'number', 'tezina'); assert(typeof k.doprinos === 'number', 'doprinos');
    }
  });
  await test('Suma tezina = 100', () => { const r = getAutofinishHealthScore(); assertEqual(r.komponente.reduce((s, k) => s + k.tezina, 0), 100, 'suma tezina'); });
  await test('timestamp je validan ISO', () => { const r = getAutofinishHealthScore(); assert(!isNaN(Date.parse(r.timestamp)), 'ISO'); });

  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) { console.error('\n❌ Neuspješni testovi:'); failures.forEach((f) => console.error(`  • ${f}`)); process.exit(1); }
}
runTests().catch((e) => { console.error('Greška:', e); process.exit(1); });
