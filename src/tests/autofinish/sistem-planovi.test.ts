// Autofinish #1028 — Unit Testovi getAutofinishSistemPlanovi()
// Kompanija SPAJA — Digitalna Industrija

import { getAutofinishSistemPlanovi } from '../../lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '../../lib/constants';

let passed = 0; let failed = 0; const failures: string[] = [];
async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try { await fn(); console.log(`  ✅ ${name}`); passed++; }
  catch (e) { const msg = e instanceof Error ? e.message : String(e); console.error(`  ❌ ${name}\n     ${msg}`); failed++; failures.push(`${name}: ${msg}`); }
}
function assert(c: boolean, m: string): asserts c { if (!c) throw new Error(`Assert failed: ${m}`); }
function assertEqual<T>(a: T, e: T, l?: string): void { if (a !== e) throw new Error(`${l ?? 'assertEqual'}: expected ${JSON.stringify(e)}, got ${JSON.stringify(a)}`); }

async function runTests(): Promise<void> {
  console.log('\n📋 getAutofinishSistemPlanovi() — Unit Test Suite (#1028)\n');
  await test('Vraća objekat', () => { const r = getAutofinishSistemPlanovi(); assert(typeof r === 'object' && r !== null, 'objekat'); });
  await test('verzija === APP_VERSION', () => { assertEqual(getAutofinishSistemPlanovi().verzija, APP_VERSION, 'verzija'); });
  await test('autofinishBroj === AUTOFINISH_COUNT', () => { assertEqual(getAutofinishSistemPlanovi().autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj'); });
  await test('ukupnoPlan > 0', () => { assert(getAutofinishSistemPlanovi().ukupnoPlan > 0, 'ukupnoPlan > 0'); });
  await test('planovi je niz', () => { assert(Array.isArray(getAutofinishSistemPlanovi().planovi), 'niz'); });
  await test('Svaki plan ima schema polja', () => {
    for (const p of getAutofinishSistemPlanovi().planovi) {
      assert(typeof p.id === 'string', 'id'); assert(typeof p.naziv === 'string', 'naziv');
      assert(typeof p.prioritet === 'number' && p.prioritet >= 1 && p.prioritet <= 5, `prioritet 1-5: ${p.prioritet}`);
      assert(['planiran', 'u-toku', 'završen', 'odgođen'].includes(p.status), `status: ${p.status}`);
      assert(typeof p.rokISO === 'string', 'rokISO');
      assert(Array.isArray(p.zavisnosti), 'zavisnosti niz');
    }
  });
  await test('planirani + uToku + zavrseni + odgodjeni === ukupnoPlan', () => {
    const r = getAutofinishSistemPlanovi();
    assertEqual(r.planirani + r.uToku + r.zavrseni + r.odgodjeni, r.ukupnoPlan, 'suma statusa');
  });
  await test('timestamp je validan ISO', () => { assert(!isNaN(Date.parse(getAutofinishSistemPlanovi().timestamp)), 'ISO'); });
  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) { console.error('\n❌ Neuspješni testovi:'); failures.forEach((f) => console.error(`  • ${f}`)); process.exit(1); }
}
runTests().catch((e) => { console.error('Greška:', e); process.exit(1); });
