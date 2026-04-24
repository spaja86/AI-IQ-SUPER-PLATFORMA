// Autofinish #1079 — Unit Testovi getAutofinishIncidentLog()
// Kompanija SPAJA — Digitalna Industrija

import { getAutofinishIncidentLog } from '../../lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '../../lib/constants';

let passed = 0; let failed = 0; const failures: string[] = [];
async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try { await fn(); console.log(`  ✅ ${name}`); passed++; }
  catch (e) { const msg = e instanceof Error ? e.message : String(e); console.error(`  ❌ ${name}\n     ${msg}`); failed++; failures.push(`${name}: ${msg}`); }
}
function assert(c: boolean, m: string): asserts c { if (!c) throw new Error(`Assert failed: ${m}`); }
function assertEqual<T>(a: T, e: T, l?: string): void { if (a !== e) throw new Error(`${l ?? 'assertEqual'}: expected ${JSON.stringify(e)}, got ${JSON.stringify(a)}`); }

async function runTests(): Promise<void> {
  console.log('\n📋 getAutofinishIncidentLog() — Unit Test Suite (#1079)\n');
  await test('Vraća objekat', () => { const r = getAutofinishIncidentLog(); assert(typeof r === 'object' && r !== null, 'objekat'); });
  await test('verzija === APP_VERSION', () => { assertEqual(getAutofinishIncidentLog().verzija, APP_VERSION, 'verzija'); });
  await test('autofinishBroj === AUTOFINISH_COUNT', () => { assertEqual(getAutofinishIncidentLog().autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj'); });
  await test('ukupnoIncidenata > 0', () => { assert(getAutofinishIncidentLog().ukupnoIncidenata > 0, 'ukupno > 0'); });
  await test('incidents je niz', () => { assert(Array.isArray(getAutofinishIncidentLog().incidents), 'niz'); });
  await test('Svaki incident: schema polja', () => {
    const SEVERITIES = ['P1', 'P2', 'P3', 'P4'];
    const STATUSI = ['open', 'investigating', 'mitigated', 'resolved', 'postmortem'];
    for (const i of getAutofinishIncidentLog().incidents) {
      assert(typeof i.id === 'string', 'id'); assert(typeof i.naziv === 'string', 'naziv');
      assert(SEVERITIES.includes(i.severity), `severity: ${i.severity}`);
      assert(STATUSI.includes(i.status), `status: ${i.status}`);
      assert(i.mttrMin >= 0, `MTTR >= 0: ${i.mttrMin}`);
      assert(Array.isArray(i.zahvaceniServisi), 'zahvaceniServisi niz');
    }
  });
  await test('prosjecniMttrMin >= 0', () => { assert(getAutofinishIncidentLog().prosjecniMttrMin >= 0, 'prosjecni >= 0'); });
  await test('resolvedCount + openCount <= ukupnoIncidenata', () => {
    const r = getAutofinishIncidentLog(); assert(r.resolvedCount + r.openCount <= r.ukupnoIncidenata, 'suma <= ukupno');
  });
  await test('ukupnoIncidenata === incidents.length', () => { const r = getAutofinishIncidentLog(); assertEqual(r.ukupnoIncidenata, r.incidents.length, 'ukupno=length'); });
  await test('timestamp je validan ISO', () => { assert(!isNaN(Date.parse(getAutofinishIncidentLog().timestamp)), 'ISO'); });
  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) { console.error('\n❌ Neuspješni testovi:'); failures.forEach((f) => console.error(`  • ${f}`)); process.exit(1); }
}
runTests().catch((e) => { console.error('Greška:', e); process.exit(1); });
