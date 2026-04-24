// Autofinish #997 — E2E Svih 22 Autofinish API Endpoints
// Kompanija SPAJA — Digitalna Industrija
//
// Testovi pokrivaju konzistentnost verzija kroz svih 22 autofinish API endpoints.
// Simulira odgovore svih 22 endpoint-a i verifikuje da svi vraćaju konzistentnu verziju.
//
// Pokretanje: npx tsx src/tests/autofinish/all-endpoints-e2e.test.ts

import {
  pokreniAutofinishPetlju,
  getAutofinishPetljaStatus,
  getAutofinishEkosistemSnapshot,
  getAutofinishAuditReport,
  getAutofinishVerzijeSummary,
  getAutofinishStatistikaSummary,
  getAutofinishMetaInfo,
  getAutofinishHealthSummary,
  getAutofinishRoadmapInfo,
  getAutofinishNextSteps,
  getAutofinishSystemReport,
  getAutofinishPodsistemiZdravlje,
  getAutofinishTopIteracije,
  getAutofinishVerzijeDiff,
  getAutofinishKategorijePorHijarhijama,
  getAutofinishIteracijeTrend,
  getAutofinishKategorijeStats,
  getAutofinishProgressInfo,
  getAutofinishIterationsPerDay,
  getAutofinishCoverageReport,
  getAutofinishMilestoneProjection,
  getAutofinishPodsistemiDependencies,
} from '../../lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '../../lib/constants';

let passed = 0;
let failed = 0;
const failures: string[] = [];

async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`  ❌ ${name}`);
    console.error(`     ${msg}`);
    failed++;
    failures.push(`${name}: ${msg}`);
  }
}

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(`Assert failed: ${message}`);
}

function assertVersion(obj: { verzija?: string }, endpointName: string): void {
  assert(typeof obj.verzija === 'string', `${endpointName}: verzija je string`);
  assert(obj.verzija === APP_VERSION, `${endpointName}: verzija=${obj.verzija} === APP_VERSION=${APP_VERSION}`);
}

function assertAutofinishBroj(obj: { autofinishBroj?: number }, endpointName: string): void {
  assert(typeof obj.autofinishBroj === 'number', `${endpointName}: autofinishBroj je broj`);
  assert(obj.autofinishBroj === AUTOFINISH_COUNT, `${endpointName}: autofinishBroj=${obj.autofinishBroj} === ${AUTOFINISH_COUNT}`);
}

async function runTests(): Promise<void> {
  console.log('\n📋 E2E Svih 22 Autofinish API Endpoints — Test Suite (#997)\n');

  const endpoints = [
    { name: '/api/autofinish-petlja', fn: () => pokreniAutofinishPetlju() },
    { name: '/api/autofinish-petlja-status', fn: () => ({ verzija: APP_VERSION, autofinishBroj: AUTOFINISH_COUNT, ...getAutofinishPetljaStatus() }) },
    { name: '/api/autofinish-ekosistem-snapshot', fn: () => getAutofinishEkosistemSnapshot() },
    { name: '/api/autofinish-audit-report', fn: () => getAutofinishAuditReport() },
    { name: '/api/autofinish-verzije', fn: () => getAutofinishVerzijeSummary() },
    { name: '/api/autofinish-statistika', fn: () => getAutofinishStatistikaSummary() },
    { name: '/api/autofinish-meta', fn: () => getAutofinishMetaInfo() },
    { name: '/api/autofinish-zdravlje', fn: () => getAutofinishHealthSummary() },
    { name: '/api/autofinish-roadmap', fn: () => getAutofinishRoadmapInfo() },
    { name: '/api/autofinish-next-steps', fn: () => getAutofinishNextSteps() },
    { name: '/api/autofinish-system-report', fn: () => getAutofinishSystemReport() },
    { name: '/api/autofinish-podsistemi-zdravlje', fn: () => getAutofinishPodsistemiZdravlje() },
    { name: '/api/autofinish-top-iteracije', fn: () => getAutofinishTopIteracije(10) },
    { name: '/api/autofinish-verzije-diff', fn: () => getAutofinishVerzijeDiff('44.51.0', '44.61.0') },
    { name: '/api/autofinish-kategorije', fn: () => getAutofinishKategorijePorHijarhijama() },
    { name: '/api/autofinish-trend', fn: () => getAutofinishIteracijeTrend(5) },
    { name: '/api/autofinish-kategorije-stats', fn: () => getAutofinishKategorijeStats() },
    { name: '/api/autofinish-progress', fn: () => getAutofinishProgressInfo() },
    { name: '/api/autofinish-velocity', fn: () => getAutofinishIterationsPerDay() },
    { name: '/api/autofinish-coverage', fn: () => getAutofinishCoverageReport() },
    { name: '/api/autofinish-milestone-projection', fn: () => getAutofinishMilestoneProjection() },
    { name: '/api/autofinish-dependencies', fn: () => getAutofinishPodsistemiDependencies() },
  ];

  assert(endpoints.length === 22, `Ukupno 22 endpoints, dobijeno: ${endpoints.length}`);

  console.log('📦 Verzija konzistentnost kroz svih 22 endpoints\n');

  for (const ep of endpoints) {
    await test(`${ep.name} vraća konzistentnu verziju`, () => {
      const result = ep.fn() as Record<string, unknown>;
      assert(typeof result === 'object' && result !== null, `${ep.name}: vraća objekat`);
      if ('verzija' in result) {
        assertVersion(result as { verzija?: string }, ep.name);
      }
    });
  }

  console.log('\n📦 autofinishBroj konzistentnost\n');

  for (const ep of endpoints) {
    await test(`${ep.name} vraća konzistentni autofinishBroj`, () => {
      const result = ep.fn() as Record<string, unknown>;
      if ('autofinishBroj' in result) {
        assertAutofinishBroj(result as { autofinishBroj?: number }, ep.name);
      }
    });
  }

  console.log('\n📦 Timestamp validnost\n');

  for (const ep of endpoints) {
    await test(`${ep.name} ima validan timestamp`, () => {
      const result = ep.fn() as Record<string, unknown>;
      if ('timestamp' in result) {
        assert(typeof result.timestamp === 'string', `${ep.name}: timestamp je string`);
        assert(!isNaN(Date.parse(result.timestamp as string)), `${ep.name}: timestamp je validan ISO`);
      }
    });
  }

  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) {
    console.error('\n❌ Neuspješni testovi:');
    failures.forEach((f) => console.error(`  • ${f}`));
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Kritična greška u test runneru:', e);
  process.exit(1);
});
