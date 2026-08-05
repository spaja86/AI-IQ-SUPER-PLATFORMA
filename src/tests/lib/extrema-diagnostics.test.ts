// Dijagnostika Ekstrimiteta Ekstrema — Unit testovi
// Pokretanje: npx tsx src/tests/lib/extrema-diagnostics.test.ts

import { strict as assert } from 'node:assert';
import {
  EXTREMA_CATALOG,
  getExtremaCatalog,
  getExtremaByModule,
  getExtremaBySeverity,
  getExtremaById,
  getExtremaCatalogStats,
} from '../../lib/diagnostics/extrema-catalog';
import {
  detectExtreme,
  classifyExtreme,
  runExtremaDiagnostics,
  generateReport,
  runFullDiagnostics,
  type ExtremaFinding,
} from '../../lib/diagnostics/extrema-engine';
import {
  reportFinding,
  reportExtrema,
  formatReportAsMarkdown,
  buildGitHubIssuePayload,
  getAuditLog,
  clearAuditLog,
} from '../../lib/diagnostics/extrema-reporter';

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

async function runTests(): Promise<void> {
  console.log('\n🔬 Dijagnostika Ekstrimiteta Ekstrema — Unit testovi\n');

  // ── ExtremaCatalog testovi ──────────────────────────────────────────────────
  console.log('📋 ExtremaCatalog:');

  await test('EXTREMA_CATALOG nije prazan', () => {
    assert(EXTREMA_CATALOG.length > 0, 'Katalog mora imati unose');
  });

  await test('getExtremaCatalog vraća sve unose', () => {
    assert.equal(getExtremaCatalog().length, EXTREMA_CATALOG.length);
  });

  await test('Svi katalog unosi imaju obavezna polja', () => {
    for (const entry of EXTREMA_CATALOG) {
      assert(entry.id, `Entry mora imati id`);
      assert(entry.module, `${entry.id}: mora imati module`);
      assert(entry.conditionType, `${entry.id}: mora imati conditionType`);
      assert(entry.condition, `${entry.id}: mora imati condition`);
      assert(
        ['CRITICAL', 'WARNING', 'INFO'].includes(entry.severity),
        `${entry.id}: severity mora biti CRITICAL|WARNING|INFO`,
      );
      assert(entry.remediation, `${entry.id}: mora imati remediation`);
    }
  });

  await test('ID-evi su jedinstveni', () => {
    const ids = EXTREMA_CATALOG.map((e) => e.id);
    const unique = new Set(ids);
    assert.equal(unique.size, ids.length, 'Svi ID-evi moraju biti jedinstveni');
  });

  await test('getExtremaByModule vraća samo gigatron unose', () => {
    const gig = getExtremaByModule('gigatron');
    assert(gig.length > 0, 'mora biti bar jedan gigatron unos');
    assert(gig.every((e) => e.module === 'gigatron'), 'svi moraju biti gigatron');
  });

  await test('getExtremaBySeverity vraća samo CRITICAL unose', () => {
    const critical = getExtremaBySeverity('CRITICAL');
    assert(critical.length > 0, 'mora biti bar jedan CRITICAL');
    assert(critical.every((e) => e.severity === 'CRITICAL'), 'svi moraju biti CRITICAL');
  });

  await test('getExtremaById vraća ispravan unos za GIG-001', () => {
    const entry = getExtremaById('GIG-001');
    assert(entry !== undefined, 'GIG-001 mora postojati');
    assert.equal(entry!.module, 'gigatron');
    assert.equal(entry!.severity, 'CRITICAL');
  });

  await test('getExtremaById vraća undefined za nepostojeći ID', () => {
    const entry = getExtremaById('FAKE-999');
    assert.equal(entry, undefined);
  });

  await test('getExtremaCatalogStats ima ispravne ukupne vrednosti', () => {
    const stats = getExtremaCatalogStats();
    assert.equal(stats.total, EXTREMA_CATALOG.length);
    assert(stats.byModule['gigatron'] > 0, 'mora biti gigatron unosa');
    assert(stats.bySeverity['CRITICAL'] > 0, 'mora biti CRITICAL unosa');
  });

  await test('Pokrivenost svih modula u katalogu', () => {
    const modules = new Set(EXTREMA_CATALOG.map((e) => e.module));
    assert(modules.has('gigatron'), 'mora imati gigatron');
    assert(modules.has('nova-generacija'), 'mora imati nova-generacija');
    assert(modules.has('calculator'), 'mora imati calculator');
    assert(modules.has('ci-cd'), 'mora imati ci-cd');
    assert(modules.has('network'), 'mora imati network');
  });

  // ── DiagnosticsEngine testovi ──────────────────────────────────────────────
  console.log('\n⚙️  DiagnosticsEngine:');

  await test('detectExtreme: GIG-001 detektuje negativnu cenu', () => {
    const found = detectExtreme('GIG-001', -10);
    assert(found !== undefined, 'mora detektovati negativnu cenu');
    assert.equal(found!.id, 'GIG-001');
  });

  await test('detectExtreme: GIG-001 ne detektuje pozitivnu cenu', () => {
    const found = detectExtreme('GIG-001', 100);
    assert.equal(found, undefined, 'pozitivna cena nije ekstrem');
  });

  await test('detectExtreme: CALC-002 detektuje NaN', () => {
    const found = detectExtreme('CALC-002', NaN);
    assert(found !== undefined, 'mora detektovati NaN');
  });

  await test('detectExtreme: CALC-003 detektuje Infinity', () => {
    const found = detectExtreme('CALC-003', Infinity);
    assert(found !== undefined, 'mora detektovati Infinity');
  });

  await test('detectExtreme: CALC-001 detektuje deljenje nulom (divisor=0)', () => {
    const found = detectExtreme('CALC-001', 0);
    assert(found !== undefined, 'mora detektovati nulu kao divisor');
  });

  await test('detectExtreme: GIG-003 detektuje PDV > 100', () => {
    const found = detectExtreme('GIG-003', 150);
    assert(found !== undefined, 'PDV 150 je ekstrem');
  });

  await test('detectExtreme: GIG-003 ne detektuje validan PDV', () => {
    const found = detectExtreme('GIG-003', 20);
    assert.equal(found, undefined, 'PDV 20 nije ekstrem');
  });

  await test('detectExtreme: NG-002 detektuje RTP < 85', () => {
    const found = detectExtreme('NG-002', 80);
    assert(found !== undefined, 'RTP 80 je ekstrem');
  });

  await test('detectExtreme: NG-002 ne detektuje validan RTP', () => {
    const found = detectExtreme('NG-002', 96);
    assert.equal(found, undefined, 'RTP 96 nije ekstrem');
  });

  await test('detectExtreme: NG-005 detektuje oktavu van opsega', () => {
    const tooLow = detectExtreme('NG-005', 0);
    const tooHigh = detectExtreme('NG-005', 17);
    assert(tooLow !== undefined, 'oktava 0 je ekstrem');
    assert(tooHigh !== undefined, 'oktava 17 je ekstrem');
  });

  await test('detectExtreme: GIG-004 detektuje nevalidni SKU', () => {
    const found = detectExtreme('GIG-004', 'INVALID-SKU');
    assert(found !== undefined, 'nevalidan SKU je ekstrem');
  });

  await test('detectExtreme: GIG-004 ne detektuje validan SKU', () => {
    const found = detectExtreme('GIG-004', 'GIG-12345');
    assert.equal(found, undefined, 'validan SKU nije ekstrem');
  });

  await test('detectExtreme: custom check funkcija radi', () => {
    const found = detectExtreme('GIG-001', 'test', (v) => v === 'test');
    assert(found !== undefined, 'custom check mora raditi');
  });

  await test('detectExtreme: nepostojeći catalogId vraća undefined', () => {
    const found = detectExtreme('FAKE-999', -1);
    assert.equal(found, undefined);
  });

  await test('classifyExtreme vraća severity iz finding-a', () => {
    const finding: ExtremaFinding = {
      catalogEntry: EXTREMA_CATALOG[0],
      detectedAt: new Date().toISOString(),
      value: -1,
      module: 'gigatron',
      severity: 'CRITICAL',
    };
    assert.equal(classifyExtreme(finding), 'CRITICAL');
  });

  await test('runExtremaDiagnostics detektuje gigatron nalaze', () => {
    const findings = runExtremaDiagnostics('gigatron', {
      'GIG-001': -50,  // negativna cena
      'GIG-003': 150,  // PDV > 100
    });
    assert(findings.length >= 2, `mora biti bar 2 nalaza, dobijeno: ${findings.length}`);
  });

  await test('runExtremaDiagnostics ne detektuje lažne alarme', () => {
    const findings = runExtremaDiagnostics('gigatron', {
      'GIG-001': 100,  // validna cena
    });
    assert.equal(findings.length, 0, 'ne sme biti nalaza za validne vrednosti');
  });

  await test('runExtremaDiagnostics ignoriše nepoznate catalogId-ove', () => {
    const findings = runExtremaDiagnostics('gigatron', {
      'FAKE-999': -999,
    });
    assert.equal(findings.length, 0);
  });

  await test('generateReport vraća ispravan status za CRITICAL', () => {
    const findings = runExtremaDiagnostics('gigatron', {
      'GIG-001': -50,
    });
    const report = generateReport(findings, 'gigatron');
    assert.equal(report.status, 'CRITICAL');
    assert(report.criticalCount > 0);
  });

  await test('generateReport vraća OK kada nema nalaza', () => {
    const report = generateReport([], 'gigatron');
    assert.equal(report.status, 'OK');
    assert.equal(report.totalFindings, 0);
  });

  await test('generateReport DEGRADED za samo WARNING', () => {
    const findings = runExtremaDiagnostics('gigatron', {
      'GIG-006': 0,  // cena = 0 (WARNING)
    });
    const warningFindings = findings.filter((f) => f.severity === 'WARNING');
    if (warningFindings.length > 0) {
      const report = generateReport(warningFindings, 'gigatron');
      assert.equal(report.status, 'DEGRADED');
    }
  });

  await test('runFullDiagnostics radi sa više modula', () => {
    const report = runFullDiagnostics({
      gigatron: { 'GIG-001': -10 },
      calculator: { 'CALC-002': NaN },
    });
    assert.equal(report.module, 'all');
    assert(report.criticalCount >= 2, 'mora biti bar 2 CRITICAL nalaza');
  });

  // ── ExtremaReporter testovi ────────────────────────────────────────────────
  console.log('\n📢 ExtremaReporter:');

  await test('reportFinding dodaje u audit log', () => {
    clearAuditLog();
    const finding: ExtremaFinding = {
      catalogEntry: EXTREMA_CATALOG[0],
      detectedAt: new Date().toISOString(),
      value: -5,
      module: 'gigatron',
      severity: 'CRITICAL',
    };
    reportFinding(finding, { consoleOutput: false });
    const log = getAuditLog();
    assert.equal(log.length, 1);
    assert.equal(log[0].findingId, EXTREMA_CATALOG[0].id);
  });

  await test('reportExtrema loguje sve nalaze', () => {
    clearAuditLog();
    const findings = runExtremaDiagnostics('calculator', {
      'CALC-002': NaN,
      'CALC-003': Infinity,
    });
    const report = generateReport(findings, 'calculator');
    reportExtrema(report, { consoleOutput: false });
    const log = getAuditLog();
    assert(log.length >= 2, 'mora biti bar 2 audit log unosa');
  });

  await test('formatReportAsMarkdown vraća markdown string', () => {
    const report = generateReport([], 'all');
    const md = formatReportAsMarkdown(report);
    assert(md.includes('Dijagnostika Ekstrimiteta Ekstrema'), 'mora sadržati naslov');
    assert(md.includes('Status'), 'mora sadržati Status');
  });

  await test('buildGitHubIssuePayload vraća null za prazan findings', () => {
    const payload = buildGitHubIssuePayload([]);
    assert.equal(payload, null);
  });

  await test('buildGitHubIssuePayload vraća payload za CRITICAL findings', () => {
    const finding: ExtremaFinding = {
      catalogEntry: EXTREMA_CATALOG.find((e) => e.severity === 'CRITICAL')!,
      detectedAt: new Date().toISOString(),
      value: -1,
      module: 'gigatron',
      severity: 'CRITICAL',
    };
    const payload = buildGitHubIssuePayload([finding]);
    assert(payload !== null, 'mora kreirati payload');
    assert(payload!.title.includes('CRITICAL'), 'naslov mora sadržati CRITICAL');
    assert(Array.isArray(payload!.labels), 'labels mora biti niz');
    assert(payload!.labels.includes('extrema:critical'), 'mora imati extrema:critical label');
  });

  await test('clearAuditLog prazni log', () => {
    clearAuditLog();
    assert.equal(getAuditLog().length, 0, 'audit log mora biti prazan');
  });

  // ── 5×5 Edge case matrix ───────────────────────────────────────────────────
  console.log('\n🧪 Edge case matrix (5 modula × 5 vrsta ekstrema):');

  await test('GIGATRON × invalid-input: sve invalid-input detekcije rade', () => {
    const cases = [
      { id: 'GIG-001', value: -1 },
      { id: 'GIG-003', value: -5 },
      { id: 'GIG-004', value: 'bad-sku' },
      { id: 'GIG-005', value: 150 },
    ];
    for (const c of cases) {
      const found = detectExtreme(c.id, c.value);
      assert(found !== undefined, `${c.id} sa vrednoscu ${c.value} mora biti detektovan`);
    }
  });

  await test('NOVA-GENERACIJA × system-event: node unavailable', () => {
    const found = detectExtreme('NG-001', null);
    assert(found !== undefined, 'nedostupan čvor mora biti detektovan');
  });

  await test('CALCULATOR × NaN/Infinity: oba su detektovana', () => {
    assert(detectExtreme('CALC-002', NaN) !== undefined, 'NaN mora biti detektovan');
    assert(detectExtreme('CALC-003', Infinity) !== undefined, 'Infinity mora biti detektovan');
    assert(detectExtreme('CALC-003', -Infinity) !== undefined, '-Infinity mora biti detektovan');
  });

  await test('CI-CD × agent-event: loop i deadlock', () => {
    assert(detectExtreme('CICD-001', true) !== undefined, 'agent loop mora biti detektovan');
    assert(detectExtreme('CICD-003', true) !== undefined, 'deadlock mora biti detektovan');
  });

  await test('NETWORK × network-event: 5xx, DNS, CORS', () => {
    assert(detectExtreme('NET-002', 500) !== undefined, '500 status mora biti detektovan');
    assert(detectExtreme('NET-002', 503) !== undefined, '503 status mora biti detektovan');
    assert(detectExtreme('NET-003', true) !== undefined, 'DNS fail mora biti detektovan');
    assert(detectExtreme('NET-004', true) !== undefined, 'CORS mora biti detektovan');
  });

  await test('GIGATRON × performance: API response > 200ms', () => {
    assert(detectExtreme('GIG-007', 201) !== undefined, '201ms mora biti detektovan');
    assert(detectExtreme('GIG-007', 200) === undefined, '200ms nije ekstrem');
  });

  await test('NOVA-GENERACIJA × performance: evaluacija > 50ms', () => {
    assert(detectExtreme('NG-006', 51) !== undefined, '51ms mora biti detektovan');
    assert(detectExtreme('NG-006', 50) === undefined, '50ms nije ekstrem');
  });

  await test('CI-CD × performance: build > 3 min (180000ms)', () => {
    assert(detectExtreme('CICD-002', 180001) !== undefined, '>3min mora biti detektovan');
    assert(detectExtreme('CICD-002', 180000) === undefined, '3min tačno nije ekstrem');
  });

  await test('CALCULATOR × performance: > 100ms', () => {
    assert(detectExtreme('CALC-004', 101) !== undefined, '101ms mora biti detektovan');
    assert(detectExtreme('CALC-004', 100) === undefined, '100ms nije ekstrem');
  });

  await test('Nema false pozitiva za granične vrednosti', () => {
    // Upravo na granici — ne smeju biti detektovani
    assert.equal(detectExtreme('GIG-001', 0), undefined, 'cena=0 nije negativna');
    assert.equal(detectExtreme('GIG-003', 0), undefined, 'PDV=0 je validan');
    assert.equal(detectExtreme('GIG-003', 100), undefined, 'PDV=100 je validan');
    assert.equal(detectExtreme('NG-002', 85), undefined, 'RTP=85 je validan');
    assert.equal(detectExtreme('NG-002', 100), undefined, 'RTP=100 je validan');
    assert.equal(detectExtreme('NG-005', 1), undefined, 'oktava=1 je validan');
    assert.equal(detectExtreme('NG-005', 16), undefined, 'oktava=16 je validan');
  });

  // ── Rezultati ──────────────────────────────────────────────────────────────
  console.log(`\n📊 Rezultat: ${passed} passed, ${failed} failed`);
  if (failed > 0) {
    console.error('\n❌ Greške:\n' + failures.join('\n'));
    process.exitCode = 1;
  } else {
    console.log('✅ Svi testovi prošli!\n');
  }
}

void runTests();
