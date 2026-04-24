// Autofinish #1011 — Unit Testovi getAutofinishExportSummary()
// Kompanija SPAJA — Digitalna Industrija

import { getAutofinishExportSummary } from '../../lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '../../lib/constants';

let passed = 0; let failed = 0; const failures: string[] = [];
async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try { await fn(); console.log(`  ✅ ${name}`); passed++; }
  catch (e) { const msg = e instanceof Error ? e.message : String(e); console.error(`  ❌ ${name}\n     ${msg}`); failed++; failures.push(`${name}: ${msg}`); }
}
function assert(c: boolean, m: string): asserts c { if (!c) throw new Error(`Assert failed: ${m}`); }
function assertEqual<T>(a: T, e: T, l?: string): void { if (a !== e) throw new Error(`${l ?? 'assertEqual'}: expected ${JSON.stringify(e)}, got ${JSON.stringify(a)}`); }

async function runTests(): Promise<void> {
  console.log('\n📋 getAutofinishExportSummary() — Unit Test Suite (#1011)\n');

  await test('Vraća objekat', () => { const r = getAutofinishExportSummary(); assert(typeof r === 'object' && r !== null, 'objekat'); });
  await test('verzija === APP_VERSION', () => { assertEqual(getAutofinishExportSummary().verzija, APP_VERSION, 'verzija'); });
  await test('autofinishBroj === AUTOFINISH_COUNT', () => { assertEqual(getAutofinishExportSummary().autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj'); });
  await test('generisanoU je validan ISO', () => { assert(!isNaN(Date.parse(getAutofinishExportSummary().generisanoU)), 'ISO'); });
  await test('petlja prisutan', () => { assert(typeof getAutofinishExportSummary().petlja === 'object', 'petlja'); });
  await test('zdravlje prisutan', () => { assert(typeof getAutofinishExportSummary().zdravlje === 'object', 'zdravlje'); });
  await test('statistika prisutan', () => { assert(typeof getAutofinishExportSummary().statistika === 'object', 'statistika'); });
  await test('roadmap prisutan', () => { assert(typeof getAutofinishExportSummary().roadmap === 'object', 'roadmap'); });
  await test('velocity prisutan', () => { assert(typeof getAutofinishExportSummary().velocity === 'object', 'velocity'); });
  await test('coverage prisutan', () => { assert(typeof getAutofinishExportSummary().coverage === 'object', 'coverage'); });
  await test('healthScore prisutan', () => { assert(typeof getAutofinishExportSummary().healthScore === 'object', 'healthScore'); });
  await test('dependencies prisutan', () => { assert(typeof getAutofinishExportSummary().dependencies === 'object', 'dependencies'); });

  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) { console.error('\n❌ Neuspješni testovi:'); failures.forEach((f) => console.error(`  • ${f}`)); process.exit(1); }
}
runTests().catch((e) => { console.error('Greška:', e); process.exit(1); });
