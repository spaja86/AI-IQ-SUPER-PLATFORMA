// Autofinish #1058 — Unit Testovi getAutofinishDeploymentStatus()
// Kompanija SPAJA — Digitalna Industrija

import { getAutofinishDeploymentStatus } from '../../lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '../../lib/constants';

let passed = 0; let failed = 0; const failures: string[] = [];
async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try { await fn(); console.log(`  ✅ ${name}`); passed++; }
  catch (e) { const msg = e instanceof Error ? e.message : String(e); console.error(`  ❌ ${name}\n     ${msg}`); failed++; failures.push(`${name}: ${msg}`); }
}
function assert(c: boolean, m: string): asserts c { if (!c) throw new Error(`Assert failed: ${m}`); }
function assertEqual<T>(a: T, e: T, l?: string): void { if (a !== e) throw new Error(`${l ?? 'assertEqual'}: expected ${JSON.stringify(e)}, got ${JSON.stringify(a)}`); }

async function runTests(): Promise<void> {
  console.log('\n📋 getAutofinishDeploymentStatus() — Unit Test Suite (#1058)\n');
  await test('Vraća objekat', () => { const r = getAutofinishDeploymentStatus(); assert(typeof r === 'object' && r !== null, 'objekat'); });
  await test('verzija === APP_VERSION', () => { assertEqual(getAutofinishDeploymentStatus().verzija, APP_VERSION, 'verzija'); });
  await test('autofinishBroj === AUTOFINISH_COUNT', () => { assertEqual(getAutofinishDeploymentStatus().autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj'); });
  await test('ukupnoDeploymenata > 0', () => { assert(getAutofinishDeploymentStatus().ukupnoDeploymenata > 0, 'ukupno > 0'); });
  await test('deployments je niz', () => { assert(Array.isArray(getAutofinishDeploymentStatus().deployments), 'niz'); });
  await test('Svaki deployment ima schema polja', () => {
    const ENVS = ['production', 'staging', 'development', 'preview'];
    const STATUSI = ['aktivan', 'deploying', 'degradovan', 'offline', 'maintance'];
    for (const d of getAutofinishDeploymentStatus().deployments) {
      assert(typeof d.id === 'string', 'id'); assert(ENVS.includes(d.okruzenje), `okruzenje: ${d.okruzenje}`);
      assert(STATUSI.includes(d.status), `status: ${d.status}`);
      assert(d.zdravlje >= 0 && d.zdravlje <= 100, `zdravlje 0-100: ${d.zdravlje}`);
      assert(typeof d.url === 'string' && d.url.startsWith('http'), `url: ${d.url}`);
    }
  });
  await test('prosjecnoZdravlje 0-100', () => { const p = getAutofinishDeploymentStatus().prosjecnoZdravlje; assert(p >= 0 && p <= 100, `prosjecno: ${p}`); });
  await test('ukupnoDeploymenata === deployments.length', () => { const r = getAutofinishDeploymentStatus(); assertEqual(r.ukupnoDeploymenata, r.deployments.length, 'ukupno=length'); });
  await test('timestamp je validan ISO', () => { assert(!isNaN(Date.parse(getAutofinishDeploymentStatus().timestamp)), 'ISO'); });
  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) { console.error('\n❌ Neuspješni testovi:'); failures.forEach((f) => console.error(`  • ${f}`)); process.exit(1); }
}
runTests().catch((e) => { console.error('Greška:', e); process.exit(1); });
