// SpajaUltraOmegaCore -∞Ω+∞ — Unit Testovi za Performance Budget
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/lib/perf-budget.test.ts

import {
  checkLatencyBudget,
  checkBundleSizeBudget,
  evaluateQualityGates,
  CORE_WEB_VITALS_BUDGET,
  BUNDLE_SIZE_BUDGET_KB,
  API_LATENCY_BUDGET_MS,
  CI_QUALITY_GATES,
  FLAKY_TEST_QUARANTINE,
} from '../../lib/perf-budget';

// ─── Test Runner ──────────────────────────────────────────────────────────────

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

function assertEqual<T>(actual: T, expected: T, label?: string): void {
  if (actual !== expected) {
    throw new Error(`${label ?? 'assertEqual'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

// ─── Tests ────────────────────────────────────────────────────────────────────

async function runTests(): Promise<void> {
  console.log('\n⚡ Performance Budget Test Suite\n');

  // ── Konstante ──────────────────────────────────────────────────────────────
  console.log('📋 CORE_WEB_VITALS_BUDGET');

  await test('LCP budget je 2500ms', () => {
    assertEqual(CORE_WEB_VITALS_BUDGET.LCP_MS, 2500, 'LCP mora biti 2500ms');
  });

  await test('FID budget je 100ms', () => {
    assertEqual(CORE_WEB_VITALS_BUDGET.FID_MS, 100, 'FID mora biti 100ms');
  });

  await test('CLS max je 0.1', () => {
    assertEqual(CORE_WEB_VITALS_BUDGET.CLS_MAX, 0.1, 'CLS mora biti 0.1');
  });

  await test('TTFB budget je 600ms', () => {
    assertEqual(CORE_WEB_VITALS_BUDGET.TTFB_MS, 600, 'TTFB mora biti 600ms');
  });

  await test('FCP budget je 1800ms', () => {
    assertEqual(CORE_WEB_VITALS_BUDGET.FCP_MS, 1800, 'FCP mora biti 1800ms');
  });

  await test('TBT budget je 200ms', () => {
    assertEqual(CORE_WEB_VITALS_BUDGET.TBT_MS, 200, 'TBT mora biti 200ms');
  });

  await test('INP budget je 200ms', () => {
    assertEqual(CORE_WEB_VITALS_BUDGET.INP_MS, 200, 'INP mora biti 200ms');
  });

  console.log('\n📦 BUNDLE_SIZE_BUDGET_KB');

  await test('Total JS budget je 500KB', () => {
    assertEqual(BUNDLE_SIZE_BUDGET_KB.TOTAL_JS, 500, 'total JS mora biti 500KB');
  });

  await test('First Load JS budget je 200KB', () => {
    assertEqual(BUNDLE_SIZE_BUDGET_KB.FIRST_LOAD_JS, 200, 'first load mora biti 200KB');
  });

  await test('Max chunk budget je 150KB', () => {
    assertEqual(BUNDLE_SIZE_BUDGET_KB.MAX_CHUNK, 150, 'max chunk mora biti 150KB');
  });

  await test('CSS budget je 50KB', () => {
    assertEqual(BUNDLE_SIZE_BUDGET_KB.CSS, 50, 'CSS mora biti 50KB');
  });

  await test('HTML budget je 20KB', () => {
    assertEqual(BUNDLE_SIZE_BUDGET_KB.HTML, 20, 'HTML mora biti 20KB');
  });

  console.log('\n🌐 API_LATENCY_BUDGET_MS');

  await test('Auth latency budget je 300ms', () => {
    assertEqual(API_LATENCY_BUDGET_MS.auth, 300, 'auth mora biti 300ms');
  });

  await test('Billing latency budget je 500ms', () => {
    assertEqual(API_LATENCY_BUDGET_MS.billing, 500, 'billing mora biti 500ms');
  });

  await test('AI latency budget je 5000ms', () => {
    assertEqual(API_LATENCY_BUDGET_MS.ai, 5000, 'AI mora biti 5000ms');
  });

  await test('Gaming latency budget je 100ms', () => {
    assertEqual(API_LATENCY_BUDGET_MS.gaming, 100, 'gaming mora biti 100ms');
  });

  await test('Health check latency budget je 50ms', () => {
    assertEqual(API_LATENCY_BUDGET_MS.health, 50, 'health mora biti 50ms');
  });

  await test('Default latency budget je 500ms', () => {
    assertEqual(API_LATENCY_BUDGET_MS.default, 500, 'default mora biti 500ms');
  });

  // ── CI_QUALITY_GATES ───────────────────────────────────────────────────────
  console.log('\n🚪 CI_QUALITY_GATES');

  await test('CI_QUALITY_GATES je neprazan niz', () => {
    assert(Array.isArray(CI_QUALITY_GATES), 'mora biti niz');
    assert(CI_QUALITY_GATES.length > 0, 'mora biti neprazan');
  });

  await test('Svaki gate ima obavezna polja', () => {
    for (const gate of CI_QUALITY_GATES) {
      assert(typeof gate.id === 'string' && gate.id.length > 0, `gate.id mora biti neprazan`);
      assert(typeof gate.naziv === 'string', 'gate.naziv mora biti string');
      assert(typeof gate.opis === 'string', 'gate.opis mora biti string');
      assert(typeof gate.blocker === 'boolean', 'gate.blocker mora biti boolean');
    }
  });

  await test('Gate ID-jevi su jedinstveni', () => {
    const ids = CI_QUALITY_GATES.map((g) => g.id);
    const unique = new Set(ids);
    assert(ids.length === unique.size, 'gate ID-jevi moraju biti jedinstveni');
  });

  await test('test-coverage-lines gate postoji i blokira', () => {
    const gate = CI_QUALITY_GATES.find((g) => g.id === 'test-coverage-lines');
    assert(gate !== undefined, 'test-coverage-lines gate mora postojati');
    assert(gate!.blocker === true, 'mora biti blokator');
    assert(gate!.minValue !== undefined, 'mora imati minValue');
    assert(gate!.minValue! > 0, 'minValue mora biti pozitivan');
  });

  await test('bundle-total-js gate postoji i blokira', () => {
    const gate = CI_QUALITY_GATES.find((g) => g.id === 'bundle-total-js');
    assert(gate !== undefined, 'bundle-total-js gate mora postojati');
    assert(gate!.blocker === true, 'mora biti blokator');
    assertEqual(gate!.maxValue, BUNDLE_SIZE_BUDGET_KB.TOTAL_JS, 'maxValue mora odgovarati bundle budgetu');
  });

  await test('typescript-errors gate blokira', () => {
    const gate = CI_QUALITY_GATES.find((g) => g.id === 'typescript-errors');
    assert(gate !== undefined, 'typescript-errors gate mora postojati');
    assert(gate!.blocker === true, 'TS greške moraju biti blokator');
    assertEqual(gate!.maxValue, 0, 'nula TS grešaka je limit');
  });

  // ── FLAKY_TEST_QUARANTINE ──────────────────────────────────────────────────
  console.log('\n🦠 FLAKY_TEST_QUARANTINE');

  await test('FLAKY_TEST_QUARANTINE je niz', () => {
    assert(Array.isArray(FLAKY_TEST_QUARANTINE), 'mora biti niz');
  });

  await test('Svi flaky test entry-i imaju obavezna polja', () => {
    for (const entry of FLAKY_TEST_QUARANTINE) {
      assert(typeof entry.testFile === 'string', 'testFile mora biti string');
      assert(typeof entry.testName === 'string', 'testName mora biti string');
      assert(typeof entry.reason === 'string', 'reason mora biti string');
      assert(typeof entry.quarantinedAt === 'string', 'quarantinedAt mora biti string');
      assert(typeof entry.fixed === 'boolean', 'fixed mora biti boolean');
    }
  });

  // ── checkLatencyBudget ─────────────────────────────────────────────────────
  console.log('\n⏱️ checkLatencyBudget');

  await test('Prolazi kada je latencija ispod budgeta', () => {
    const result = checkLatencyBudget('auth', 200);
    assert(result.passed === true, 'mora proći (200ms < 300ms auth budget)');
    assertEqual(result.budget, 300, 'budget mora biti 300ms');
    assertEqual(result.measured, 200, 'measured mora biti 200ms');
    assertEqual(result.overByMs, 0, 'overByMs mora biti 0');
  });

  await test('Prolazi kada je latencija tačno na budgetu', () => {
    const result = checkLatencyBudget('auth', 300);
    assert(result.passed === true, 'mora proći (300ms = 300ms auth budget)');
    assertEqual(result.overByMs, 0, 'overByMs mora biti 0');
  });

  await test('Pada kada je latencija iznad budgeta', () => {
    const result = checkLatencyBudget('gaming', 150);
    assert(result.passed === false, 'mora pasti (150ms > 100ms gaming budget)');
    assertEqual(result.budget, 100, 'budget mora biti 100ms');
    assertEqual(result.measured, 150, 'measured mora biti 150ms');
    assertEqual(result.overByMs, 50, 'overByMs mora biti 50ms');
  });

  await test('Billing latency check prolazi za brz odgovor', () => {
    const result = checkLatencyBudget('billing', 300);
    assert(result.passed === true, 'mora proći (300ms < 500ms billing budget)');
  });

  await test('AI latency check prolazi za streaming odgovor', () => {
    const result = checkLatencyBudget('ai', 3000);
    assert(result.passed === true, 'mora proći (3000ms < 5000ms AI budget)');
  });

  await test('AI latency check pada za predugo čekanje', () => {
    const result = checkLatencyBudget('ai', 6000);
    assert(result.passed === false, 'mora pasti (6000ms > 5000ms AI budget)');
    assertEqual(result.overByMs, 1000, 'overByMs mora biti 1000ms');
  });

  await test('Nepoznata kategorija koristi default budget', () => {
    const result = checkLatencyBudget('nepoznata-kategorija', 400);
    assertEqual(result.budget, API_LATENCY_BUDGET_MS.default, 'mora koristiti default budget');
    assert(result.passed === true, 'mora proći (400ms < 500ms default)');
  });

  await test('Nepoznata kategorija pada iznad default budgeta', () => {
    const result = checkLatencyBudget('nepoznata-kategorija', 600);
    assert(result.passed === false, 'mora pasti (600ms > 500ms default)');
    assertEqual(result.overByMs, 100, 'overByMs mora biti 100ms');
  });

  await test('Health check pada za spor odgovor', () => {
    const result = checkLatencyBudget('health', 100);
    assert(result.passed === false, 'mora pasti (100ms > 50ms health budget)');
    assertEqual(result.overByMs, 50, 'overByMs mora biti 50ms');
  });

  await test('Health check prolazi za brz odgovor', () => {
    const result = checkLatencyBudget('health', 30);
    assert(result.passed === true, 'mora proći (30ms < 50ms health budget)');
  });

  // ── checkBundleSizeBudget ──────────────────────────────────────────────────
  console.log('\n📏 checkBundleSizeBudget');

  await test('Prolazi kada je bundle ispod budgeta', () => {
    const result = checkBundleSizeBudget('TOTAL_JS', 300);
    assert(result.passed === true, 'mora proći (300KB < 500KB)');
    assertEqual(result.budget, 500, 'budget mora biti 500KB');
    assertEqual(result.measured, 300, 'measured mora biti 300KB');
    assertEqual(result.overByKb, 0, 'overByKb mora biti 0');
  });

  await test('Prolazi kada je bundle tačno na budgetu', () => {
    const result = checkBundleSizeBudget('TOTAL_JS', 500);
    assert(result.passed === true, 'mora proći (500KB = 500KB)');
    assertEqual(result.overByKb, 0, 'overByKb mora biti 0');
  });

  await test('Pada kada je bundle iznad budgeta', () => {
    const result = checkBundleSizeBudget('FIRST_LOAD_JS', 250);
    assert(result.passed === false, 'mora pasti (250KB > 200KB)');
    assertEqual(result.budget, 200, 'budget mora biti 200KB');
    assertEqual(result.overByKb, 50, 'overByKb mora biti 50KB');
  });

  await test('CSS budget check prolazi', () => {
    const result = checkBundleSizeBudget('CSS', 30);
    assert(result.passed === true, 'mora proći (30KB < 50KB CSS budget)');
  });

  await test('CSS budget check pada', () => {
    const result = checkBundleSizeBudget('CSS', 60);
    assert(result.passed === false, 'mora pasti (60KB > 50KB CSS budget)');
    assertEqual(result.overByKb, 10, 'overByKb mora biti 10KB');
  });

  await test('HTML budget check', () => {
    const result = checkBundleSizeBudget('HTML', 25);
    assert(result.passed === false, 'mora pasti (25KB > 20KB HTML budget)');
  });

  await test('MAX_CHUNK budget check prolazi', () => {
    const result = checkBundleSizeBudget('MAX_CHUNK', 100);
    assert(result.passed === true, 'mora proći (100KB < 150KB chunk budget)');
  });

  // ── evaluateQualityGates ───────────────────────────────────────────────────
  console.log('\n🚦 evaluateQualityGates');

  await test('evaluateQualityGates vraća rezultat za svaki gate', () => {
    const metrics: Record<string, number> = {};
    const results = evaluateQualityGates(metrics);
    assertEqual(results.length, CI_QUALITY_GATES.length, 'mora biti rezultat za svaki gate');
  });

  await test('Gate bez metrike se preskače (passed=true)', () => {
    const results = evaluateQualityGates({});
    for (const r of results) {
      assert(r.passed === true, `gate '${r.gateId}' bez metrike mora biti passed=true`);
      assert(r.blocking === false, `gate '${r.gateId}' bez metrike mora biti blocking=false`);
    }
  });

  await test('test-coverage-lines prolazi sa dovoljnim pokrivanjem', () => {
    const metrics = { 'test-coverage-lines': 80 };
    const results = evaluateQualityGates(metrics);
    const gate = results.find((r) => r.gateId === 'test-coverage-lines');
    assert(gate !== undefined, 'gate mora biti u rezultatima');
    assert(gate!.passed === true, '80% coverage mora proći (min 70%)');
    assert(gate!.blocking === false, 'ne sme biti blocking ako prođe');
  });

  await test('test-coverage-lines pada sa nedovoljnim pokrivanjem', () => {
    const metrics = { 'test-coverage-lines': 50 };
    const results = evaluateQualityGates(metrics);
    const gate = results.find((r) => r.gateId === 'test-coverage-lines');
    assert(gate !== undefined, 'gate mora biti u rezultatima');
    assert(gate!.passed === false, '50% coverage mora pasti (min 70%)');
    assert(gate!.blocking === true, 'mora biti blocking jer je blokator');
  });

  await test('bundle-total-js prolazi ispod limita', () => {
    const metrics = { 'bundle-total-js': 400 };
    const results = evaluateQualityGates(metrics);
    const gate = results.find((r) => r.gateId === 'bundle-total-js');
    assert(gate!.passed === true, '400KB mora proći (max 500KB)');
    assert(gate!.blocking === false, 'ne sme biti blocking');
  });

  await test('bundle-total-js pada iznad limita', () => {
    const metrics = { 'bundle-total-js': 600 };
    const results = evaluateQualityGates(metrics);
    const gate = results.find((r) => r.gateId === 'bundle-total-js');
    assert(gate!.passed === false, '600KB mora pasti (max 500KB)');
    assert(gate!.blocking === true, 'mora biti blocking');
  });

  await test('typescript-errors pada sa TS greškama', () => {
    const metrics = { 'typescript-errors': 5 };
    const results = evaluateQualityGates(metrics);
    const gate = results.find((r) => r.gateId === 'typescript-errors');
    assert(gate!.passed === false, '5 TS grešaka mora pasti (max 0)');
    assert(gate!.blocking === true, 'mora biti blocking');
  });

  await test('typescript-errors prolazi bez grešaka', () => {
    const metrics = { 'typescript-errors': 0 };
    const results = evaluateQualityGates(metrics);
    const gate = results.find((r) => r.gateId === 'typescript-errors');
    assert(gate!.passed === true, '0 TS grešaka mora proći');
  });

  await test('Non-blokator gate ne blokira čak i kad pada', () => {
    // test-coverage-branches je blocker: false
    const metrics = { 'test-coverage-branches': 30 };
    const results = evaluateQualityGates(metrics);
    const gate = results.find((r) => r.gateId === 'test-coverage-branches');
    if (gate) {
      assert(gate.passed === false, '30% branch coverage mora pasti (min 60%)');
      assert(gate.blocking === false, 'non-blokator gate ne sme biti blocking');
    } else {
      assert(true, 'gate nije u listi — skip');
    }
  });

  await test('evaluateQualityGates radi sa više metrika istovremeno', () => {
    const metrics = {
      'test-coverage-lines': 85,
      'bundle-total-js': 450,
      'typescript-errors': 0,
      'security-vulnerabilities': 0,
    };
    const results = evaluateQualityGates(metrics);
    const passed = results.filter((r) => r.passed);
    assert(passed.length >= 4, 'mora proći bar 4 gatea');
  });

  await test('evaluateQualityGates blokira samo blokatore koji padnu', () => {
    const metrics = {
      'test-coverage-lines': 50,          // blocker, pada
      'test-coverage-branches': 40,        // ne-blocker, pada
      'typescript-errors': 0,              // blocker, prolazi
    };
    const results = evaluateQualityGates(metrics);

    const coverageLines = results.find((r) => r.gateId === 'test-coverage-lines');
    const coverageBranches = results.find((r) => r.gateId === 'test-coverage-branches');
    const tsErrors = results.find((r) => r.gateId === 'typescript-errors');

    assert(coverageLines!.blocking === true, 'test-coverage-lines mora biti blocking');
    if (coverageBranches) {
      assert(coverageBranches.blocking === false, 'test-coverage-branches ne sme biti blocking');
    }
    assert(tsErrors!.blocking === false, 'typescript-errors prolazi pa ne sme biti blocking');
  });

  // ─────────────────────────────────────────────────────────────────────────

  console.log('\n──────────────────────────────────────────────────');
  console.log(`✅ Passed: ${passed}  ❌ Failed: ${failed}  📊 Total: ${passed + failed}`);
  console.log('──────────────────────────────────────────────────\n');

  if (failed > 0) {
    console.error('Failures:');
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }
}

runTests().catch((error) => {
  console.error('Runner error:', error);
  process.exit(1);
});
