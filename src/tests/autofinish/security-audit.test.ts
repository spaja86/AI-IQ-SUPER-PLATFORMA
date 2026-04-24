// Autofinish #1062 — Unit Testovi getAutofinishSecurityAudit()
// Kompanija SPAJA — Digitalna Industrija

import { getAutofinishSecurityAudit } from '../../lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '../../lib/constants';

let passed = 0; let failed = 0; const failures: string[] = [];
async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try { await fn(); console.log(`  ✅ ${name}`); passed++; }
  catch (e) { const msg = e instanceof Error ? e.message : String(e); console.error(`  ❌ ${name}\n     ${msg}`); failed++; failures.push(`${name}: ${msg}`); }
}
function assert(c: boolean, m: string): asserts c { if (!c) throw new Error(`Assert failed: ${m}`); }
function assertEqual<T>(a: T, e: T, l?: string): void { if (a !== e) throw new Error(`${l ?? 'assertEqual'}: expected ${JSON.stringify(e)}, got ${JSON.stringify(a)}`); }

async function runTests(): Promise<void> {
  console.log('\n📋 getAutofinishSecurityAudit() — Unit Test Suite (#1062)\n');
  await test('Vraća objekat', () => { const r = getAutofinishSecurityAudit(); assert(typeof r === 'object' && r !== null, 'objekat'); });
  await test('verzija === APP_VERSION', () => { assertEqual(getAutofinishSecurityAudit().verzija, APP_VERSION, 'verzija'); });
  await test('autofinishBroj === AUTOFINISH_COUNT', () => { assertEqual(getAutofinishSecurityAudit().autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj'); });
  await test('ukupnoNalaza > 0', () => { assert(getAutofinishSecurityAudit().ukupnoNalaza > 0, 'ukupnoNalaza > 0'); });
  await test('findings je niz', () => { assert(Array.isArray(getAutofinishSecurityAudit().findings), 'niz'); });
  await test('Svaki finding ima schema polja', () => {
    const SEVERITIES = ['info', 'low', 'medium', 'high', 'critical'];
    const STATUSI = ['open', 'mitigated', 'accepted', 'fixed', 'wontfix'];
    for (const f of getAutofinishSecurityAudit().findings) {
      assert(typeof f.id === 'string', 'id'); assert(typeof f.naziv === 'string', 'naziv');
      assert(f.cvssScore >= 0 && f.cvssScore <= 10, `CVSS 0-10: ${f.cvssScore}`);
      assert(SEVERITIES.includes(f.severity), `severity: ${f.severity}`);
      assert(STATUSI.includes(f.status), `status: ${f.status}`);
    }
  });
  await test('overallScore 0-100', () => { const s = getAutofinishSecurityAudit().overallScore; assert(s >= 0 && s <= 100, `score: ${s}`); });
  await test('critical + high + medium + low <= ukupnoNalaza', () => {
    const r = getAutofinishSecurityAudit();
    assert(r.critical + r.high + r.medium + r.low <= r.ukupnoNalaza, 'suma <= ukupno');
  });
  await test('ukupnoNalaza === findings.length', () => { const r = getAutofinishSecurityAudit(); assertEqual(r.ukupnoNalaza, r.findings.length, 'ukupno=length'); });
  await test('timestamp je validan ISO', () => { assert(!isNaN(Date.parse(getAutofinishSecurityAudit().timestamp)), 'ISO'); });
  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) { console.error('\n❌ Neuspješni testovi:'); failures.forEach((f) => console.error(`  • ${f}`)); process.exit(1); }
}
runTests().catch((e) => { console.error('Greška:', e); process.exit(1); });
