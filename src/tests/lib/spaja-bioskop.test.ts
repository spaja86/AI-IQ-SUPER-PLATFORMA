import {
  _resetSpajaBioskopMetrics,
  evaluateSpajaBioskop,
  getSpajaBioskopHealthReport,
  SPAJA_BIOSKOP_CONTRACT_VERSION,
  SPAJA_BIOSKOP_KANONSKA_SEKVENCA,
  SPAJA_BIOSKOP_LINKED_REPO_IMPACT,
  SPAJA_BIOSKOP_MODULE_VERSION,
  SPAJA_BIOSKOP_PERSONA_ID,
  SPAJA_BIOSKOP_VISUAL_REFERENCE,
} from '../../lib/spaja-bioskop';

let passed = 0;
let failed = 0;
const failures: string[] = [];

async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`  ❌ ${name}`);
    console.error(`     ${message}`);
    failed++;
    failures.push(`${name}: ${message}`);
  }
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

async function runTests(): Promise<void> {
  _resetSpajaBioskopMetrics();

  console.log('\n🎬 [spaja-bioskop] module tests\n');

  await test('constants are stable', () => {
    assert(SPAJA_BIOSKOP_CONTRACT_VERSION === 'v1-spaja-bioskop', 'unexpected contract version');
    assert(SPAJA_BIOSKOP_MODULE_VERSION === '1.0.0', 'unexpected module version');
    assert(SPAJA_BIOSKOP_PERSONA_ID === 'spaja-bioskop-core', 'unexpected persona');
    assert(SPAJA_BIOSKOP_LINKED_REPO_IMPACT === 'none', 'linked repo impact must be none');
    assert(SPAJA_BIOSKOP_KANONSKA_SEKVENCA.length === 8, 'canonical sequence must have 8 tokens');
    assert(
      SPAJA_BIOSKOP_VISUAL_REFERENCE.includes('github.com/user-attachments/assets/1ba7c168'),
      'visual reference must be pinned',
    );
  });

  await test('canonical sequence returns NORMAL and go', () => {
    const result = evaluateSpajaBioskop({
      sequence: SPAJA_BIOSKOP_KANONSKA_SEKVENCA.join(' '),
      signalStrength: 95,
    });

    assert(result.valid, 'canonical sequence must be valid');
    assert(result.status === 'NORMAL', `expected NORMAL, got ${result.status}`);
    assert(result.goNoGo === 'go', 'canonical should be go');
    assert(result.errors.length === 0, 'canonical should have no errors');
    assert(result.readinessScore >= 90, 'canonical should have high readiness score');
  });

  await test('unknown token blocks the sequence', () => {
    const result = evaluateSpajaBioskop({
      sequence: 'KAGON ERAGON SIROKE DJUKAR EPAR DOPER OKTAN UNKNOWN',
    });

    assert(!result.valid, 'sequence with unknown token must be invalid');
    assert(result.status === 'BLOCKED', `expected BLOCKED, got ${result.status}`);
    assert(result.unknownTokens.includes('UNKNOWN'), 'unknown token must be reported');
    assert(result.readinessScore < 60, 'invalid sequence must stay in blocked readiness range');
  });

  await test('duplicate token blocks the sequence', () => {
    const result = evaluateSpajaBioskop({
      sequence: 'KAGON ERAGON SIROKE DJUKAR EPAR DOPER OKTAN OKTAN',
    });

    assert(!result.valid, 'duplicate tokens must be invalid');
    assert(result.duplicateTokens.includes('OKTAN'), 'duplicate should be reported');
    assert(result.status === 'BLOCKED', 'duplicate sequence should be blocked');
  });

  await test('non-strict order surfaces warning when all tokens are known', () => {
    const result = evaluateSpajaBioskop({
      sequence: 'ERAGON KAGON SIROKE DJUKAR EPAR DOPER OKTAN DUKAT',
      strictOrder: false,
      signalStrength: 100,
    });

    assert(result.valid, 'non-strict mode should keep known-token sequence valid');
    assert(result.status === 'WARNING', `expected WARNING, got ${result.status}`);
    assert(result.goNoGo === 'no-go', 'WARNING status must stay no-go');
    assert(result.warnings.length >= 1, 'warning expected for reordered tokens');
  });

  await test('health metrics update after evaluations', () => {
    const health = getSpajaBioskopHealthReport();
    assert(health.evaluations >= 4, `expected evaluations >= 4, got ${health.evaluations}`);
    assert(health.lastStatus !== null, 'last status should be present');
    assert(health.lastEvaluatedAt !== null, 'last evaluation timestamp should be present');
  });

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);
  if (failed > 0) {
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exit(1);
  }
}

runTests().catch((error) => {
  console.error('Fatal:', error);
  process.exit(1);
});
