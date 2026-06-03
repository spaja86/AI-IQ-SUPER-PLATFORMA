// Panetracija 2 — Unit Testovi (lib)
// Kompanija SPAJA — Digitalna Industrija
//
// Testira: buildPentestReportV2(), getPentestFindingsV2(), calculatePentestScoreV2(),
//          getPentestSummaryV2(), startScanSession(), completeScanSession(),
//          getScanHistory(), getPentestTrend()

import {
  buildPentestReportV2,
  getPentestFindingsV2,
  calculatePentestScoreV2,
  getPentestSummaryV2,
  startScanSession,
  completeScanSession,
  getScanHistory,
  getPentestTrend,
} from '../../lib/panetracija-2';
import type { PentestFindingV2 } from '../../lib/panetracija-2';
import { APP_VERSION } from '../../lib/constants';

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
    console.error(`  ❌ ${name}\n     ${msg}`);
    failed++;
    failures.push(`${name}: ${msg}`);
  }
}

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(`Assert failed: ${message}`);
}

function assertEqual<T>(actual: T, expected: T, label?: string): void {
  if (actual !== expected) {
    throw new Error(
      `${label ?? 'assertEqual'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
    );
  }
}

async function runTests(): Promise<void> {
  console.log('\n🎯 Panetracija 2 — Unit Test Suite\n');

  // ─── buildPentestReportV2() ───────────────────────────────────────────────
  await test('buildPentestReportV2() vraća objekat', () => {
    const r = buildPentestReportV2();
    assert(typeof r === 'object' && r !== null, 'mora biti objekat');
  });

  await test('buildPentestReportV2() status === "ok"', () => {
    assertEqual(buildPentestReportV2().status, 'ok', 'status');
  });

  await test('buildPentestReportV2() verzija === APP_VERSION', () => {
    assertEqual(buildPentestReportV2().verzija, APP_VERSION, 'verzija');
  });

  await test('buildPentestReportV2() ukupnoNalaza > 0', () => {
    assert(buildPentestReportV2().ukupnoNalaza > 0, 'ukupnoNalaza > 0');
  });

  await test('buildPentestReportV2() ukupnoNalaza === findings.length', () => {
    const r = buildPentestReportV2();
    assertEqual(r.ukupnoNalaza, r.findings.length, 'ukupno=length');
  });

  await test('buildPentestReportV2() findings je niz', () => {
    assert(Array.isArray(buildPentestReportV2().findings), 'mora biti niz');
  });

  await test('buildPentestReportV2() overallScore je u opsegu 0–100', () => {
    const s = buildPentestReportV2().overallScore;
    assert(s >= 0 && s <= 100, `overallScore van opsega: ${s}`);
  });

  await test('buildPentestReportV2() zbrojevi severity-a konzistentni', () => {
    const r = buildPentestReportV2();
    const suma = r.critical + r.high + r.medium + r.low + r.info;
    assertEqual(suma, r.ukupnoNalaza, 'suma severity-a');
  });

  await test('buildPentestReportV2() scanId je string', () => {
    assert(typeof buildPentestReportV2().scanId === 'string', 'scanId mora biti string');
  });

  await test('buildPentestReportV2() durationMs > 0', () => {
    assert(buildPentestReportV2().durationMs > 0, 'durationMs > 0');
  });

  await test('buildPentestReportV2() history je niz', () => {
    assert(Array.isArray(buildPentestReportV2().history), 'history mora biti niz');
  });

  await test('buildPentestReportV2() trendovi je niz neprazan', () => {
    const t = buildPentestReportV2().trendovi;
    assert(Array.isArray(t) && t.length > 0, 'trendovi mora biti neprazan niz');
  });

  await test('buildPentestReportV2() timestamp je validan ISO', () => {
    assert(!isNaN(Date.parse(buildPentestReportV2().timestamp)), 'timestamp mora biti validan ISO');
  });

  await test('buildPentestReportV2() svaki finding ima V2 polja', () => {
    const VALID_SEVERITIES = ['info', 'low', 'medium', 'high', 'critical'];
    const VALID_STATUSI = ['open', 'mitigated', 'fixed', 'accepted', 'wontfix'];
    const VALID_PRIORITETI = [1, 2, 3];
    for (const f of buildPentestReportV2().findings) {
      assert(typeof f.id === 'string' && f.id.length > 0, `id nevalidan: ${f.id}`);
      assert(typeof f.cvssVector === 'string' && f.cvssVector.length > 0, `cvssVector nevalidan: ${f.id}`);
      assert(typeof f.cweId === 'string' && f.cweId.startsWith('CWE-'), `cweId nevalidan: ${f.cweId}`);
      assert(VALID_SEVERITIES.includes(f.severity), `severity nevalidan: ${f.severity}`);
      assert(VALID_STATUSI.includes(f.status), `status nevalidan: ${f.status}`);
      assert(VALID_PRIORITETI.includes(f.prioritet), `prioritet nevalidan: ${f.prioritet}`);
    }
  });

  await test('buildPentestReportV2() prima opcioni scanId', () => {
    const r = buildPentestReportV2('test-scan-id-123');
    assertEqual(r.scanId, 'test-scan-id-123', 'scanId mora biti prosljeđeni');
  });

  // ─── getPentestFindingsV2() ───────────────────────────────────────────────
  await test('getPentestFindingsV2() bez filtera vraća sve nalaze', () => {
    const all = getPentestFindingsV2();
    assert(Array.isArray(all), 'mora biti niz');
    assert(all.length > 0, 'ne sme biti prazan');
  });

  await test('getPentestFindingsV2({severity:"critical"}) vraća samo critical', () => {
    const critical = getPentestFindingsV2({ severity: 'critical' });
    for (const f of critical) {
      assertEqual(f.severity, 'critical' as PentestFindingV2['severity'], 'severity');
    }
  });

  await test('getPentestFindingsV2({severity:"high"}) vraća samo high', () => {
    const high = getPentestFindingsV2({ severity: 'high' });
    assert(high.length > 0, 'mora postojati bar jedan high nalaz');
    for (const f of high) {
      assertEqual(f.severity, 'high' as PentestFindingV2['severity'], 'severity');
    }
  });

  await test('getPentestFindingsV2({status:"open"}) vraća samo open', () => {
    const open = getPentestFindingsV2({ status: 'open' });
    for (const f of open) {
      assertEqual(f.status, 'open' as PentestFindingV2['status'], 'status');
    }
  });

  await test('getPentestFindingsV2({kategorija:"injection"}) vraća samo injection', () => {
    const inj = getPentestFindingsV2({ kategorija: 'injection' });
    assert(inj.length > 0, 'mora postojati bar jedan injection nalaz');
    for (const f of inj) {
      assertEqual(f.kategorija, 'injection' as PentestFindingV2['kategorija'], 'kategorija');
    }
  });

  await test('getPentestFindingsV2() kombinovani filteri rade zajedno', () => {
    const result = getPentestFindingsV2({ severity: 'medium', status: 'open' });
    for (const f of result) {
      assertEqual(f.severity, 'medium', 'severity mora biti medium');
      assertEqual(f.status, 'open', 'status mora biti open');
    }
  });

  await test('getPentestFindingsV2() ne mutira originalni niz', () => {
    const a1 = getPentestFindingsV2();
    const a2 = getPentestFindingsV2();
    assertEqual(a1.length, a2.length, 'dužina mora biti konzistentna');
  });

  // ─── calculatePentestScoreV2() ────────────────────────────────────────────
  await test('calculatePentestScoreV2() vraća vrednost 0–100', () => {
    const findings = getPentestFindingsV2();
    const score = calculatePentestScoreV2(findings);
    assert(score >= 0 && score <= 100, `skor ${score} van opsega 0–100`);
  });

  await test('calculatePentestScoreV2([]) vraća 100', () => {
    assertEqual(calculatePentestScoreV2([]), 100, 'prazna lista = skor 100');
  });

  await test('calculatePentestScoreV2() ignoruje fixed i wontfix nalaze', () => {
    const fixedOnly: PentestFindingV2[] = [
      {
        id: 'x-001', naziv: 'Test', opis: 'Test', kategorija: 'injection',
        owaspRef: 'A03', attackVector: 'network', cvssScore: 9.8,
        severity: 'critical', status: 'fixed', remedijacija: 'Fixed', otkriveno: '2026-01-01',
        cvssVector: 'AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H', cweId: 'CWE-89', prioritet: 1,
      },
    ];
    assertEqual(calculatePentestScoreV2(fixedOnly), 100, 'fixed critical ne sme umanjiti skor');
  });

  await test('calculatePentestScoreV2() smanjuje skor za open critical', () => {
    const openCritical: PentestFindingV2[] = [
      {
        id: 'x-002', naziv: 'Test', opis: 'Test', kategorija: 'injection',
        owaspRef: 'A03', attackVector: 'network', cvssScore: 9.8,
        severity: 'critical', status: 'open', remedijacija: 'Plan', otkriveno: '2026-01-01',
        cvssVector: 'AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H', cweId: 'CWE-78', prioritet: 1,
      },
    ];
    const score = calculatePentestScoreV2(openCritical);
    assert(score < 100, `skor ${score} trebao biti manji od 100 za open critical`);
  });

  // ─── getPentestSummaryV2() ────────────────────────────────────────────────
  await test('getPentestSummaryV2() vraća objekat sa verzijom', () => {
    const s = getPentestSummaryV2();
    assertEqual(s.verzija, APP_VERSION, 'verzija');
  });

  await test('getPentestSummaryV2() overallScore 0–100', () => {
    const s = getPentestSummaryV2();
    assert(s.overallScore >= 0 && s.overallScore <= 100, `overallScore ${s.overallScore} van opsega`);
  });

  await test('getPentestSummaryV2() ukupnoNalaza > 0', () => {
    assert(getPentestSummaryV2().ukupnoNalaza > 0, 'ukupno mora biti > 0');
  });

  await test('getPentestSummaryV2() openNalaza >= 0', () => {
    assert(getPentestSummaryV2().openNalaza >= 0, 'openNalaza mora biti >= 0');
  });

  await test('getPentestSummaryV2() timestamp je validan ISO', () => {
    assert(!isNaN(Date.parse(getPentestSummaryV2().timestamp)), 'timestamp mora biti ISO');
  });

  // ─── startScanSession() / completeScanSession() ───────────────────────────
  await test('startScanSession() vraća sesiju sa scanId i started statusom', () => {
    const session = startScanSession('test');
    assert(typeof session.scanId === 'string' && session.scanId.length > 0, 'scanId');
    assertEqual(session.status, 'running', 'status mora biti running');
    assertEqual(session.triggeredBy, 'test', 'triggeredBy');
    assert(!isNaN(Date.parse(session.startedAt)), 'startedAt mora biti ISO');
  });

  await test('completeScanSession() ažurira status i durationMs', () => {
    const session = startScanSession('unit-test');
    const completed = completeScanSession(session.scanId);
    assertEqual(completed.status, 'completed', 'status mora biti completed');
    assert(completed.durationMs !== undefined && completed.durationMs >= 0, 'durationMs mora biti >= 0');
    assert(completed.completedAt !== undefined, 'completedAt mora biti definisan');
  });

  await test('completeScanSession() baca grešku za nepoznati scanId', () => {
    let threw = false;
    try {
      completeScanSession('nepostojeci-scan-id-xyz');
    } catch {
      threw = true;
    }
    assert(threw, 'mora baciti grešku za nepoznati scanId');
  });

  // ─── getScanHistory() ────────────────────────────────────────────────────
  await test('getScanHistory() vraća niz', () => {
    assert(Array.isArray(getScanHistory()), 'mora biti niz');
  });

  await test('getScanHistory() sadrži pokrenute sesije', () => {
    startScanSession('history-test');
    const history = getScanHistory();
    assert(history.length > 0, 'istorija mora imati bar jedan unos');
  });

  await test('getScanHistory() unosi imaju obavezna polja', () => {
    const history = getScanHistory();
    for (const s of history) {
      assert(typeof s.scanId === 'string', 'scanId mora biti string');
      assert(typeof s.startedAt === 'string', 'startedAt mora biti string');
      assert(['pending', 'running', 'completed', 'failed'].includes(s.status), `status nevalidan: ${s.status}`);
    }
  });

  // ─── getPentestTrend() ────────────────────────────────────────────────────
  await test('getPentestTrend(5) vraća niz', () => {
    const trend = getPentestTrend(5);
    assert(Array.isArray(trend), 'mora biti niz');
  });

  await test('getPentestTrend(5) unosi imaju overallScore 0–100', () => {
    const trend = getPentestTrend(5);
    for (const t of trend) {
      assert(t.overallScore >= 0 && t.overallScore <= 100, `overallScore ${t.overallScore} van opsega`);
    }
  });

  await test('getPentestTrend(1) vraća max 1 unos iz istorije', () => {
    const trend = getPentestTrend(1);
    assert(trend.length <= 1, `trend(1) mora imati <= 1 unos, dobijen: ${trend.length}`);
  });

  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) {
    console.error('\n❌ Neuspješni testovi:');
    failures.forEach((f) => console.error(`  • ${f}`));
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Greška:', e);
  process.exit(1);
});
