// Autofinish #1082 — E2E Svih 42 Autofinish API Endpoints
// Kompanija SPAJA — Digitalna Industrija

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
  getAutofinishHealthScore,
  getAutofinishProgressChangelog,
  getAutofinishKompletiranjMatrix,
  getAutofinishExportSummary,
  getAutofinishTagSystem,
  getAutofinishKpiScorecard,
  getAutofinishRetrospektiva,
  getAutofinishSistemPlanovi,
  getAutofinishNapredakTracker,
  getAutofinishResursi,
  getAutofinishRizici,
  getAutofinishKomunikacioniLog,
  getAutofinishPerfLatency,
  getAutofinishChangelogAutomated,
  getAutofinishDeploymentStatus,
  getAutofinishSecurityAudit,
  getAutofinishCostAnalytics,
  getAutofinishSlaMonitor,
  getAutofinishFeatureFlags,
  getAutofinishIncidentLog,
} from '../../lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '../../lib/constants';

let passed = 0; let failed = 0; const failures: string[] = [];
async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try { await fn(); console.log(`  ✅ ${name}`); passed++; }
  catch (e) { const msg = e instanceof Error ? e.message : String(e); console.error(`  ❌ ${name}\n     ${msg}`); failed++; failures.push(`${name}: ${msg}`); }
}
function assert(c: boolean, m: string): asserts c { if (!c) throw new Error(`Assert failed: ${m}`); }

async function runTests(): Promise<void> {
  console.log('\n📋 E2E Svih 42 Autofinish API Endpoints — Test Suite (#1082)\n');

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
    { name: '/api/autofinish-health-score', fn: () => getAutofinishHealthScore() },
    { name: '/api/autofinish-progress-changelog', fn: () => getAutofinishProgressChangelog() },
    { name: '/api/autofinish-kompletiranje-matrix', fn: () => getAutofinishKompletiranjMatrix() },
    { name: '/api/autofinish-export', fn: () => getAutofinishExportSummary() },
    { name: '/api/autofinish-tag-system', fn: () => getAutofinishTagSystem() },
    { name: '/api/autofinish-kpi-scorecard', fn: () => getAutofinishKpiScorecard() },
    { name: '/api/autofinish-retrospektiva', fn: () => getAutofinishRetrospektiva() },
    { name: '/api/autofinish-sistem-planovi', fn: () => getAutofinishSistemPlanovi() },
    { name: '/api/autofinish-napredak-tracker', fn: () => getAutofinishNapredakTracker() },
    { name: '/api/autofinish-resursi', fn: () => getAutofinishResursi() },
    { name: '/api/autofinish-rizici', fn: () => getAutofinishRizici() },
    { name: '/api/autofinish-komunikacioni-log', fn: () => getAutofinishKomunikacioniLog() },
    { name: '/api/autofinish-perf-latency', fn: () => getAutofinishPerfLatency() },
    { name: '/api/autofinish-changelog-automated', fn: () => getAutofinishChangelogAutomated() },
    { name: '/api/autofinish-deployment-status', fn: () => getAutofinishDeploymentStatus() },
    { name: '/api/autofinish-security-audit', fn: () => getAutofinishSecurityAudit() },
    { name: '/api/autofinish-cost-analytics', fn: () => getAutofinishCostAnalytics() },
    { name: '/api/autofinish-sla-monitor', fn: () => getAutofinishSlaMonitor() },
    { name: '/api/autofinish-feature-flags', fn: () => getAutofinishFeatureFlags() },
    { name: '/api/autofinish-incident-log', fn: () => getAutofinishIncidentLog() },
  ];

  assert(endpoints.length === 42, `Ukupno 42 endpoints, dobijeno: ${endpoints.length}`);

  for (const ep of endpoints) {
    await test(`${ep.name} — verzija konzistentnost`, () => {
      const r = ep.fn() as Record<string, unknown>;
      if ('verzija' in r) assert(r.verzija === APP_VERSION, `${ep.name}: verzija=${r.verzija} !== APP_VERSION`);
    });
    await test(`${ep.name} — autofinishBroj konzistentnost`, () => {
      const r = ep.fn() as Record<string, unknown>;
      if ('autofinishBroj' in r) assert(r.autofinishBroj === AUTOFINISH_COUNT, `${ep.name}: autofinishBroj mismatch`);
    });
  }

  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) { console.error('\n❌ Neuspješni testovi:'); failures.forEach((f) => console.error(`  • ${f}`)); process.exit(1); }
}
runTests().catch((e) => { console.error('Greška:', e); process.exit(1); });
