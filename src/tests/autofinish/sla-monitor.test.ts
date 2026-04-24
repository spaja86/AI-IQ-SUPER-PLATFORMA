// Autofinish #1071 — Unit Testovi getAutofinishSlaMonitor()
// Kompanija SPAJA — Digitalna Industrija

import { getAutofinishSlaMonitor } from '../../lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '../../lib/constants';

let passed = 0; let failed = 0; const failures: string[] = [];
async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try { await fn(); console.log(`  ✅ ${name}`); passed++; }
  catch (e) { const msg = e instanceof Error ? e.message : String(e); console.error(`  ❌ ${name}\n     ${msg}`); failed++; failures.push(`${name}: ${msg}`); }
}
function assert(c: boolean, m: string): asserts c { if (!c) throw new Error(`Assert failed: ${m}`); }
function assertEqual<T>(a: T, e: T, l?: string): void { if (a !== e) throw new Error(`${l ?? 'assertEqual'}: expected ${JSON.stringify(e)}, got ${JSON.stringify(a)}`); }

async function runTests(): Promise<void> {
  console.log('\n📋 getAutofinishSlaMonitor() — Unit Test Suite (#1071)\n');
  await test('Vraća objekat', () => { const r = getAutofinishSlaMonitor(); assert(typeof r === 'object' && r !== null, 'objekat'); });
  await test('verzija === APP_VERSION', () => { assertEqual(getAutofinishSlaMonitor().verzija, APP_VERSION, 'verzija'); });
  await test('autofinishBroj === AUTOFINISH_COUNT', () => { assertEqual(getAutofinishSlaMonitor().autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj'); });
  await test('ukupnoServisa > 0', () => { assert(getAutofinishSlaMonitor().ukupnoServisa > 0, 'ukupno > 0'); });
  await test('services je niz', () => { assert(Array.isArray(getAutofinishSlaMonitor().services), 'niz'); });
  await test('Svaki servis: uptime 0-100', () => {
    for (const s of getAutofinishSlaMonitor().services) {
      assert(s.targetUptimePct >= 0 && s.targetUptimePct <= 100, `target: ${s.targetUptimePct}`);
      assert(s.aktualUptimePct >= 0 && s.aktualUptimePct <= 100, `aktual: ${s.aktualUptimePct}`);
    }
  });
  await test('Svaki servis: tier validan', () => {
    const TIERS = ['platinum', 'gold', 'silver', 'bronze'];
    for (const s of getAutofinishSlaMonitor().services) { assert(TIERS.includes(s.tier), `tier: ${s.tier}`); }
  });
  await test('Svaki servis: status validan', () => {
    const STATUSI = ['ispunjen', 'na-rubu', 'probijen'];
    for (const s of getAutofinishSlaMonitor().services) { assert(STATUSI.includes(s.status), `status: ${s.status}`); }
  });
  await test('prosjecniUptime 0-100', () => { const p = getAutofinishSlaMonitor().prosjecniUptime; assert(p >= 0 && p <= 100, `prosjecni: ${p}`); });
  await test('ispunjenih + probjenih <= ukupnoServisa', () => { const r = getAutofinishSlaMonitor(); assert(r.ispunjenih + r.probjenih <= r.ukupnoServisa, 'suma <= ukupno'); });
  await test('ukupnoServisa === services.length', () => { const r = getAutofinishSlaMonitor(); assertEqual(r.ukupnoServisa, r.services.length, 'ukupno=length'); });
  await test('timestamp je validan ISO', () => { assert(!isNaN(Date.parse(getAutofinishSlaMonitor().timestamp)), 'ISO'); });
  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) { console.error('\n❌ Neuspješni testovi:'); failures.forEach((f) => console.error(`  • ${f}`)); process.exit(1); }
}
runTests().catch((e) => { console.error('Greška:', e); process.exit(1); });
