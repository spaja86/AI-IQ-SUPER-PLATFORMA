// Autofinish #1084 — Unit Testovi getAutofinishErrorBudget()
// Kompanija SPAJA — Digitalna Industrija

import { getAutofinishErrorBudget } from '../../lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '../../lib/constants';

let passed = 0; let failed = 0; const failures: string[] = [];
async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try { await fn(); console.log(`  ✅ ${name}`); passed++; }
  catch (e) { const msg = e instanceof Error ? e.message : String(e); console.error(`  ❌ ${name}\n     ${msg}`); failed++; failures.push(`${name}: ${msg}`); }
}
function assert(c: boolean, m: string): asserts c { if (!c) throw new Error(`Assert failed: ${m}`); }
function assertEqual<T>(a: T, e: T, l?: string): void { if (a !== e) throw new Error(`${l ?? 'assertEqual'}: expected ${JSON.stringify(e)}, got ${JSON.stringify(a)}`); }

async function runTests(): Promise<void> {
  console.log('\n📋 getAutofinishErrorBudget() — Unit Test Suite (#1084)\n');
  await test('Vraća objekat', () => { const r = getAutofinishErrorBudget(); assert(typeof r === 'object' && r !== null, 'objekat'); });
  await test('verzija === APP_VERSION', () => { assertEqual(getAutofinishErrorBudget().verzija, APP_VERSION, 'verzija'); });
  await test('autofinishBroj === AUTOFINISH_COUNT', () => { assertEqual(getAutofinishErrorBudget().autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj'); });
  await test('ukupnoServisa > 0', () => { assert(getAutofinishErrorBudget().ukupnoServisa > 0, 'ukupno > 0'); });
  await test('servisi je niz', () => { assert(Array.isArray(getAutofinishErrorBudget().servisi), 'niz'); });
  await test('ukupnoServisa === servisi.length', () => { const r = getAutofinishErrorBudget(); assertEqual(r.ukupnoServisa, r.servisi.length, 'ukupno=length'); });
  await test('Svaki servis: schema polja', () => {
    const STATUSI = ['zdravo', 'upozorenje', 'kriticno', 'iscrpljen'];
    for (const s of getAutofinishErrorBudget().servisi) {
      assert(typeof s.id === 'string', 'id');
      assert(typeof s.naziv === 'string', 'naziv');
      assert(s.sloTarget > 0 && s.sloTarget <= 100, `sloTarget: ${s.sloTarget}`);
      assert(s.potrosenoPct >= 0 && s.potrosenoPct <= 100, `potrosenoPct: ${s.potrosenoPct}`);
      assert(s.preostalo >= 0, `preostalo >= 0: ${s.preostalo}`);
      assert(STATUSI.includes(s.status), `status: ${s.status}`);
    }
  });
  await test('zdravih + uUpozorenju + kriticnih + iscrpljenih === ukupnoServisa', () => {
    const r = getAutofinishErrorBudget();
    assertEqual(r.zdravih + r.uUpozorenju + r.kriticnih + r.iscrpljenih, r.ukupnoServisa, 'suma=ukupno');
  });
  await test('prosjecnaPotrosenjaOst >= 0', () => { assert(getAutofinishErrorBudget().prosjecnaPotrosenjaOst >= 0, 'prosjek >= 0'); });
  await test('timestamp je validan ISO', () => { assert(!isNaN(Date.parse(getAutofinishErrorBudget().timestamp)), 'ISO'); });
  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) { console.error('\n❌ Neuspješni testovi:'); failures.forEach((f) => console.error(`  • ${f}`)); process.exit(1); }
}
runTests().catch((e) => { console.error('Greška:', e); process.exit(1); });
