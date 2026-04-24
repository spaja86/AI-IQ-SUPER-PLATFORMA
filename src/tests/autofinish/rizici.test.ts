// Autofinish #1041 — Unit Testovi getAutofinishRizici()
// Kompanija SPAJA — Digitalna Industrija

import { getAutofinishRizici } from '../../lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '../../lib/constants';

let passed = 0; let failed = 0; const failures: string[] = [];
async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try { await fn(); console.log(`  ✅ ${name}`); passed++; }
  catch (e) { const msg = e instanceof Error ? e.message : String(e); console.error(`  ❌ ${name}\n     ${msg}`); failed++; failures.push(`${name}: ${msg}`); }
}
function assert(c: boolean, m: string): asserts c { if (!c) throw new Error(`Assert failed: ${m}`); }
function assertEqual<T>(a: T, e: T, l?: string): void { if (a !== e) throw new Error(`${l ?? 'assertEqual'}: expected ${JSON.stringify(e)}, got ${JSON.stringify(a)}`); }

async function runTests(): Promise<void> {
  console.log('\n📋 getAutofinishRizici() — Unit Test Suite (#1041)\n');
  await test('Vraća objekat', () => { const r = getAutofinishRizici(); assert(typeof r === 'object' && r !== null, 'objekat'); });
  await test('verzija === APP_VERSION', () => { assertEqual(getAutofinishRizici().verzija, APP_VERSION, 'verzija'); });
  await test('autofinishBroj === AUTOFINISH_COUNT', () => { assertEqual(getAutofinishRizici().autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj'); });
  await test('ukupnoRizika > 0', () => { assert(getAutofinishRizici().ukupnoRizika > 0, 'ukupnoRizika > 0'); });
  await test('rizici je niz', () => { assert(Array.isArray(getAutofinishRizici().rizici), 'niz'); });
  await test('Svaki rizik ima schema polja', () => {
    for (const r of getAutofinishRizici().rizici) {
      assert(typeof r.id === 'string', 'id'); assert(typeof r.naziv === 'string', 'naziv');
      assert(r.vjerovatnoća >= 1 && r.vjerovatnoća <= 5, `vjerovatnoća 1-5: ${r.vjerovatnoća}`);
      assert(r.uticaj >= 1 && r.uticaj <= 5, `uticaj 1-5: ${r.uticaj}`);
      assert(r.rizikScore === r.vjerovatnoća * r.uticaj, `rizikScore=${r.rizikScore} !== ${r.vjerovatnoća}×${r.uticaj}`);
      assert(['nizak', 'srednji', 'visok', 'kritičan'].includes(r.nivo), `nivo: ${r.nivo}`);
      assert(['aktivan', 'mitigiran', 'prihvaćen', 'zatvoren'].includes(r.status), `status: ${r.status}`);
    }
  });
  await test('aktivnih + mitigiranihIliZatvorenih <= ukupnoRizika', () => {
    const r = getAutofinishRizici();
    assert(r.aktivnih + r.mitigiranihIliZatvorenih <= r.ukupnoRizika, 'suma <= ukupno');
  });
  await test('ukupnoRizika === rizici.length', () => { const r = getAutofinishRizici(); assertEqual(r.ukupnoRizika, r.rizici.length, 'ukupno=length'); });
  await test('timestamp je validan ISO', () => { assert(!isNaN(Date.parse(getAutofinishRizici().timestamp)), 'ISO'); });
  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) { console.error('\n❌ Neuspješni testovi:'); failures.forEach((f) => console.error(`  • ${f}`)); process.exit(1); }
}
runTests().catch((e) => { console.error('Greška:', e); process.exit(1); });
