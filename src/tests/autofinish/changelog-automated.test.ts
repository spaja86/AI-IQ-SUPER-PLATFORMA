// Autofinish #1054 — Unit Testovi getAutofinishChangelogAutomated()
// Kompanija SPAJA — Digitalna Industrija

import { getAutofinishChangelogAutomated } from '../../lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '../../lib/constants';

let passed = 0; let failed = 0; const failures: string[] = [];
async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try { await fn(); console.log(`  ✅ ${name}`); passed++; }
  catch (e) { const msg = e instanceof Error ? e.message : String(e); console.error(`  ❌ ${name}\n     ${msg}`); failed++; failures.push(`${name}: ${msg}`); }
}
function assert(c: boolean, m: string): asserts c { if (!c) throw new Error(`Assert failed: ${m}`); }
function assertEqual<T>(a: T, e: T, l?: string): void { if (a !== e) throw new Error(`${l ?? 'assertEqual'}: expected ${JSON.stringify(e)}, got ${JSON.stringify(a)}`); }

async function runTests(): Promise<void> {
  console.log('\n📋 getAutofinishChangelogAutomated() — Unit Test Suite (#1054)\n');
  await test('Vraća objekat', () => { const r = getAutofinishChangelogAutomated(); assert(typeof r === 'object' && r !== null, 'objekat'); });
  await test('verzija === APP_VERSION', () => { assertEqual(getAutofinishChangelogAutomated().verzija, APP_VERSION, 'verzija'); });
  await test('autofinishBroj === AUTOFINISH_COUNT', () => { assertEqual(getAutofinishChangelogAutomated().autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj'); });
  await test('ukupnoEntries > 0', () => { assert(getAutofinishChangelogAutomated().ukupnoEntries > 0, 'ukupnoEntries > 0'); });
  await test('entries je niz', () => { assert(Array.isArray(getAutofinishChangelogAutomated().entries), 'niz'); });
  await test('Svaki entry ima schema polja', () => {
    const TIPOVI = ['feature', 'fix', 'perf', 'refactor', 'test', 'docs', 'chore'];
    for (const e of getAutofinishChangelogAutomated().entries) {
      assert(typeof e.verzija === 'string', 'verzija'); assert(typeof e.opis === 'string', 'opis');
      assert(TIPOVI.includes(e.tip), `tip: ${e.tip}`);
      assert(typeof e.autofinishBroj === 'number' && e.autofinishBroj > 0, 'autofinishBroj > 0');
      assert(typeof e.breakingChange === 'boolean', 'breakingChange boolean');
    }
  });
  await test('features >= 1', () => { assert(getAutofinishChangelogAutomated().features >= 1, 'features >= 1'); });
  await test('ukupnoEntries === entries.length', () => { const r = getAutofinishChangelogAutomated(); assertEqual(r.ukupnoEntries, r.entries.length, 'ukupno=length'); });
  await test('timestamp je validan ISO', () => { assert(!isNaN(Date.parse(getAutofinishChangelogAutomated().timestamp)), 'ISO'); });
  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) { console.error('\n❌ Neuspješni testovi:'); failures.forEach((f) => console.error(`  • ${f}`)); process.exit(1); }
}
runTests().catch((e) => { console.error('Greška:', e); process.exit(1); });
