import {
  PETLJA_CONTRACT_VERSION,
  PETLJA_DEFAULT_MAX_DURATION_MS,
  PETLJA_DEFAULT_MAX_ITERATIONS,
  runForPetlja,
  runItchPetlja,
  runUrPelja,
  runNikPetlja,
  runUmbrelPetlja,
} from '../../lib/petlje';

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

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function assertEqual<T>(actual: T, expected: T, message: string): void {
  if (actual !== expected) throw new Error(`${message}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}

async function runTests(): Promise<void> {
  console.log('\n🔁 [petlje] Test suite\n');

  await test('constants are defined', () => {
    assertEqual(PETLJA_CONTRACT_VERSION, '1.0.0', 'contract version');
    assertEqual(PETLJA_DEFAULT_MAX_ITERATIONS, 10_000, 'default max iterations');
    assertEqual(PETLJA_DEFAULT_MAX_DURATION_MS, 50, 'default max duration');
  });

  await test('FOR PETLJA basic scenario sums 0..3', () => {
    const result = runForPetlja({ start: 0, end: 3, step: 1, maxDurationMs: 100 });
    assert(result.completed, 'FOR should complete');
    assertEqual(result.output, 6, 'FOR sum');
    assertEqual(result.reason, 'completed', 'FOR reason');
    assertEqual(result.status, 'ACTIVATED', 'FOR status');
    assert(result.statusTrail.some((s) => s.to === 'MONSTER'), 'FOR should enter MONSTER while running');
  });

  await test('FOR PETLJA boundary: one iteration when start=end', () => {
    const result = runForPetlja({ start: 5, end: 5, step: 1, maxDurationMs: 100 });
    assert(result.completed, 'FOR should complete');
    assertEqual(result.iterations, 1, 'FOR one-iteration boundary');
    assertEqual(result.output, 5, 'FOR boundary output');
  });

  await test('FOR PETLJA invalid input when step direction mismatches range', () => {
    const result = runForPetlja({ start: 0, end: 10, step: -1 });
    assert(!result.completed, 'FOR should fail');
    assertEqual(result.reason, 'invalid-input', 'FOR invalid reason');
    assertEqual(result.status, 'DISABLED', 'invalid input should disable FOR');
  });

  await test('ITCH PETLJA basic scenario reaches target', () => {
    const result = runItchPetlja({ start: 0, target: 10, step: 3, maxDurationMs: 100 });
    assert(result.completed, 'ITCH should complete');
    assertEqual(result.output, 10, 'ITCH output target');
    assert(result.iterations > 0, 'ITCH should iterate');
  });

  await test('ITCH PETLJA boundary: start already target', () => {
    const result = runItchPetlja({ start: 8, target: 8, step: 1, maxDurationMs: 100 });
    assert(result.completed, 'ITCH should complete immediately');
    assertEqual(result.iterations, 0, 'ITCH zero iterations boundary');
  });

  await test('ITCH PETLJA max-iteration protection works', () => {
    const result = runItchPetlja({ start: 0, target: 100, step: 1, maxIterations: 3, maxDurationMs: 100 });
    assert(!result.completed, 'ITCH should stop early');
    assertEqual(result.reason, 'max-iterations', 'ITCH guard reason');
    assertEqual(result.status, 'DEAD', 'max-iterations should map to DEAD');
  });

  await test('UR PELJA basic scenario sums sequence', () => {
    const result = runUrPelja({ sequence: [1, 2, 3], maxDurationMs: 100 });
    assert(result.completed, 'UR should complete');
    assertEqual(result.output, 6, 'UR sum');
  });

  await test('UR PELJA boundary: empty sequence', () => {
    const result = runUrPelja({ sequence: [], maxDurationMs: 100 });
    assert(result.completed, 'UR should complete for empty array');
    assertEqual(result.output, 0, 'UR empty output');
    assertEqual(result.iterations, 0, 'UR empty iterations');
  });

  await test('UR PELJA invalid input rejects NaN/Infinity', () => {
    const result = runUrPelja({ sequence: [1, NaN, Infinity] });
    assert(!result.completed, 'UR should fail for invalid sequence');
    assertEqual(result.reason, 'invalid-input', 'UR invalid reason');
  });

  await test('NIK PETLJA basic countdown scenario', () => {
    const result = runNikPetlja({ start: 3, end: 0, step: 1, maxDurationMs: 100 });
    assert(result.completed, 'NIK should complete');
    assertEqual(result.output, 6, 'NIK sum 3+2+1+0');
  });

  await test('NIK PETLJA boundary: single value when start=end', () => {
    const result = runNikPetlja({ start: 0, end: 0, step: 1, maxDurationMs: 100 });
    assert(result.completed, 'NIK should complete');
    assertEqual(result.iterations, 1, 'NIK single iteration');
    assertEqual(result.output, 0, 'NIK boundary output');
  });

  await test('NIK PETLJA invalid input for negative step', () => {
    const result = runNikPetlja({ start: 10, end: 0, step: -1 });
    assert(!result.completed, 'NIK should fail');
    assertEqual(result.reason, 'invalid-input', 'NIK invalid reason');
    assertEqual(result.status, 'DISABLED', 'NIK invalid input status');
  });

  await test('time-limit protection works when maxDurationMs is zero', () => {
    const result = runForPetlja({ start: 0, end: 1000, step: 1, maxDurationMs: 0 });
    assert(!result.completed, 'Loop should stop by time limit');
    assertEqual(result.reason, 'time-limit', 'time limit reason');
    assertEqual(result.status, 'DEAD', 'time-limit should map to DEAD');
  });

  await test('UMBREL PETLJA returns unified aggregate result', () => {
    const result = runUmbrelPetlja({ start: 0, end: 3, step: 1, target: 2, sequence: [2, 2], maxDurationMs: 100 });
    assert(result.trace.length === 4, 'UMBREL trace should contain 4 parts');
    assert(result.reason === 'completed' || result.reason === 'invalid-input', 'UMBREL reason should be valid enum');
    assert(['ACTIVATED', 'DISABLED', 'DEAD'].includes(result.status), 'UMBREL status should be canonical');
  });

  await test('status aliases normalize to canonical values', () => {
    const activated = runForPetlja({ start: 0, end: 1, step: 1, status: 'AKTIVEJT', maxDurationMs: 100 });
    assertEqual(activated.input.status, 'ACTIVATED', 'AKTIVEJT alias');
    assertEqual(activated.status, 'ACTIVATED', 'AKTIVEJT final status');

    const disabled = runForPetlja({ start: 0, end: 1, step: 1, status: 'DISEBLED', maxDurationMs: 100 });
    assertEqual(disabled.input.status, 'DISABLED', 'DISEBLED alias');
    assertEqual(disabled.status, 'DISABLED', 'DISEBLED final status');
    assertEqual(disabled.reason, 'invalid-input', 'DISEBLED blocks execution');

    const dead = runForPetlja({ start: 0, end: 1, step: 1, status: 'DED', maxDurationMs: 100 });
    assertEqual(dead.input.status, 'DEAD', 'DED alias');
    assertEqual(dead.status, 'DEAD', 'DED final status');
    assertEqual(dead.reason, 'invalid-input', 'DED blocks execution');
  });

  await test('MONSTER status is reachable and preserved in trail', () => {
    const result = runForPetlja({ start: 0, end: 2, step: 1, status: 'MONSTER', maxDurationMs: 100 });
    assert(result.statusTrail.length > 0, 'status trail should exist');
    assert(result.statusTrail.some((s) => s.to === 'MONSTER'), 'MONSTER should appear in status trail');
    assertEqual(result.status, 'ACTIVATED', 'completed MONSTER run returns to ACTIVATED');
  });

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);
  if (failed > 0) {
    console.error('Failures:');
    failures.forEach((f) => console.error(`  - ${f}`));
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal error in test suite:', err);
  process.exit(1);
});
