import {
  buildPolimerizacija2Report,
  buildPolimerizacija2Summary,
  completePolimerizacija2Scan,
  filterLanci,
  getPolimerizacija2History,
  getPolimerizacija2Status,
  getPolimerizacija2Trend,
  startPolimerizacija2Scan,
} from '../../lib/polimerizacija-2';
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
  console.log('\n🧬 Polimerizacija 2 — Unit Test Suite\n');

  await test('buildPolimerizacija2Report() status i verzija', () => {
    const report = buildPolimerizacija2Report('unit');
    assertEqual(report.status, 'aktivan', 'status');
    assertEqual(report.verzija, APP_VERSION, 'verzija');
  });

  await test('buildPolimerizacija2Report() ima 6+ lanaca', () => {
    const report = buildPolimerizacija2Report('unit');
    assert(report.lanci.length >= 6, 'lanci >= 6');
  });

  await test('buildPolimerizacija2Report() KPI opseg 0-1', () => {
    const report = buildPolimerizacija2Report('unit');
    assert(report.indeksKohezije >= 0 && report.indeksKohezije <= 1, 'indeksKohezije');
    assert(report.stabilnost >= 0 && report.stabilnost <= 1, 'stabilnost');
    assert(report.prosekIskoriscenosti >= 0 && report.prosekIskoriscenosti <= 1, 'prosekIskoriscenosti');
  });

  await test('buildPolimerizacija2Report() count-ovi statusa su konzistentni', () => {
    const report = buildPolimerizacija2Report('unit');
    assertEqual(report.aktivnih + report.optimizacija + report.kriticnih, report.lanci.length, 'status count');
  });

  await test('buildPolimerizacija2Report() trendovi nisu prazni', () => {
    const report = buildPolimerizacija2Report('unit');
    assert(report.trendovi.length > 0, 'trendovi > 0');
  });

  await test('startPolimerizacija2Scan/completePolimerizacija2Scan lifecycle', () => {
    const session = startPolimerizacija2Scan('test');
    assertEqual(session.status, 'running', 'running');
    const completed = completePolimerizacija2Scan(session.scanId, { indeksKohezije: 0.88, ukupnoLanaca: 6 });
    assertEqual(completed.status, 'completed', 'completed');
    assert(completed.durationMs !== undefined && completed.durationMs >= 0, 'durationMs');
  });

  await test('getPolimerizacija2History() ring-buffer maksimalno 10', () => {
    for (let i = 0; i < 12; i += 1) {
      const session = startPolimerizacija2Scan('history');
      completePolimerizacija2Scan(session.scanId, { indeksKohezije: 0.7, ukupnoLanaca: 6 });
    }
    const history = getPolimerizacija2History();
    assert(history.length <= 10, `history > 10 (${history.length})`);
  });

  await test('getPolimerizacija2Trend(n) poštuje n', () => {
    const trend = getPolimerizacija2Trend(3);
    assert(trend.length <= 3, 'trend <= 3');
  });

  await test('filterLanci radi po fazi/status/minKohezija', () => {
    const report = buildPolimerizacija2Report('unit');
    const fazaFiltered = filterLanci(report.lanci, 'inicijacija');
    assert(fazaFiltered.every((l) => l.fazaProcesa === 'inicijacija'), 'faza filter');
    const statusFiltered = filterLanci(report.lanci, undefined, undefined, 'aktivan');
    assert(statusFiltered.every((l) => l.status === 'aktivan'), 'status filter');
    const kohezijaFiltered = filterLanci(report.lanci, undefined, 0.8);
    assert(kohezijaFiltered.every((l) => l.iskoriscenost >= 0.8), 'minKohezija filter');
  });

  await test('buildPolimerizacija2Summary/getPolimerizacija2Status shape', () => {
    const summary = buildPolimerizacija2Summary('summary');
    const status = getPolimerizacija2Status();
    assertEqual(summary.verzija, APP_VERSION, 'summary.verzija');
    assertEqual(status.status, 'aktivan', 'status.status');
    assert(typeof summary.lastScanId === 'string' && summary.lastScanId.length > 0, 'lastScanId');
  });

  console.log(`\n🏁 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) {
    console.error('\n❌ Neuspešni testovi:');
    failures.forEach((f) => console.error(`  • ${f}`));
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Kritična greška u test runneru:', e);
  process.exit(1);
});
