import {
  PETLJA_CONTRACT_VERSION,
  PETLJA_DEFAULT_MAX_DURATION_MS,
  PETLJA_DEFAULT_MAX_ITERATIONS,
  runForPetlja,
  runItchPetlja,
  runUrPelja,
  runNikPetlja,
  runDorPetlja,
  runExePetlja,
  runKurPetlja,
  runDarPetlja,
  runYuPetlja,
  runZarPetlja,
  runDerPetlja,
  runGarPetlja,
  runZurPetlja,
  runIziPetlja,
  runUkPetlja,
  runZumPetlja,
  runDurmitorPetlja,
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

const extendedPetljaSpecs = [
  {
    kind: 'DOR PETLJA',
    run: runDorPetlja,
    validInput: { start: 0, end: 3, step: 1, target: 2, maxDurationMs: 100 },
    expectedOutput: 4,
    invalidInput: { start: 0, end: 3, step: 0, target: 2 },
    guardInput: { start: 0, end: 10, step: 1, target: 0, maxIterations: 2, maxDurationMs: 100 },
  },
  {
    kind: 'EXE PETLJA',
    run: runExePetlja,
    validInput: { sequence: [2, 1, 3], maxDurationMs: 100 },
    expectedOutput: 13,
    invalidInput: { sequence: [1, NaN, Infinity] },
    guardInput: { sequence: [5, 4, 3, 2], maxIterations: 2, maxDurationMs: 100 },
  },
  {
    kind: 'KUR PETLJA',
    run: runKurPetlja,
    validInput: { start: 0, target: 5, step: 2, maxDurationMs: 100 },
    expectedOutput: 11,
    invalidInput: { start: 0, target: 5, step: 0 },
    guardInput: { start: 0, target: 100, step: 1, maxIterations: 3, maxDurationMs: 100 },
  },
  {
    kind: 'DAR PETLJA',
    run: runDarPetlja,
    validInput: { start: 2, end: 8, step: 2, maxDurationMs: 100 },
    expectedOutput: 5,
    invalidInput: { start: 0, end: 10, step: -1 },
    guardInput: { start: 0, end: 100, step: 1, maxIterations: 3, maxDurationMs: 100 },
  },
  {
    kind: 'YU PETLJA',
    run: runYuPetlja,
    validInput: { sequence: [1, 5, 3, 7], target: 4, maxDurationMs: 100 },
    expectedOutput: 2,
    invalidInput: { sequence: [1, 2, NaN], target: 4 },
    guardInput: { sequence: [9, 8, 7, 6], target: 7, maxIterations: 2, maxDurationMs: 100 },
  },
  {
    kind: 'ZAR PETLJA',
    run: runZarPetlja,
    validInput: { sequence: [1, 4, 2, 7], maxDurationMs: 100 },
    expectedOutput: 10,
    invalidInput: { sequence: [1, Infinity] },
    guardInput: { sequence: [1, 4, 2, 7, 9], maxIterations: 2, maxDurationMs: 100 },
  },
  {
    kind: 'DER PETLJA',
    run: runDerPetlja,
    validInput: { sequence: [2, -1, 4, -2], maxDurationMs: 100 },
    expectedOutput: 5,
    invalidInput: { sequence: [1, Number.NaN] },
    guardInput: { sequence: [2, -1, 4, -2, 6], maxIterations: 2, maxDurationMs: 100 },
  },
  {
    kind: 'GAR PETLJA',
    run: runGarPetlja,
    validInput: { start: -2, end: 4, step: 2, maxDurationMs: 100 },
    expectedOutput: 4,
    invalidInput: { start: 0, end: 4, step: -1 },
    guardInput: { start: 0, end: 100, step: 1, maxIterations: 2, maxDurationMs: 100 },
  },
  {
    kind: 'ZUR PETLJA',
    run: runZurPetlja,
    validInput: { sequence: [10, 4, 7], target: 6, maxDurationMs: 100 },
    expectedOutput: 7,
    invalidInput: { sequence: [10, Infinity], target: 6 },
    guardInput: { sequence: [10, 9, 8, 7], target: 1, maxIterations: 2, maxDurationMs: 100 },
  },
  {
    kind: 'IZI PETLJA',
    run: runIziPetlja,
    validInput: { sequence: [5, 8, 5], target: 8, maxDurationMs: 100 },
    expectedOutput: 1,
    invalidInput: { sequence: [5, Number.NaN], target: 8 },
    guardInput: { sequence: [1, 2, 3, 4], target: 99, maxIterations: 2, maxDurationMs: 100 },
  },
  {
    kind: 'UK PETLJA',
    run: runUkPetlja,
    validInput: { start: 0, end: 5, step: 1, target: 3, maxDurationMs: 100 },
    expectedOutput: 4,
    invalidInput: { start: 0, end: 5, step: 0, target: 3 },
    guardInput: { start: 0, end: 100, step: 1, target: 50, maxIterations: 2, maxDurationMs: 100 },
  },
  {
    kind: 'ZUM PETLJA',
    run: runZumPetlja,
    validInput: { start: 1, end: 3, step: 1, maxDurationMs: 100 },
    expectedOutput: 14,
    invalidInput: { start: 0, end: 3, step: -1 },
    guardInput: { start: 0, end: 100, step: 1, maxIterations: 2, maxDurationMs: 100 },
  },
] as const;

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

  for (const spec of extendedPetljaSpecs) {
    await test(`${spec.kind} basic scenario completes with expected output`, () => {
      const result = spec.run(spec.validInput);
      assert(result.completed, `${spec.kind} should complete`);
      assertEqual(result.output, spec.expectedOutput, `${spec.kind} output`);
      assertEqual(result.reason, 'completed', `${spec.kind} reason`);
      assertEqual(result.status, 'ACTIVATED', `${spec.kind} status`);
      assert(result.statusTrail.some((entry) => entry.to === 'MONSTER'), `${spec.kind} should enter MONSTER`);
    });

    await test(`${spec.kind} invalid input is disabled`, () => {
      const result = spec.run(spec.invalidInput);
      assert(!result.completed, `${spec.kind} should fail`);
      assertEqual(result.reason, 'invalid-input', `${spec.kind} invalid reason`);
      assertEqual(result.status, 'DISABLED', `${spec.kind} invalid status`);
    });

    await test(`${spec.kind} guard stop maps to DEAD`, () => {
      const result = spec.run(spec.guardInput);
      assert(!result.completed, `${spec.kind} should stop early`);
      assertEqual(result.reason, 'max-iterations', `${spec.kind} guard reason`);
      assertEqual(result.status, 'DEAD', `${spec.kind} guard status`);
    });

    await test(`${spec.kind} DISEBLED alias blocks execution`, () => {
      const result = spec.run({ ...spec.validInput, status: 'DISEBLED' });
      assert(!result.completed, `${spec.kind} should be blocked`);
      assertEqual(result.input.status, 'DISABLED', `${spec.kind} alias normalization`);
      assertEqual(result.reason, 'blocked-status', `${spec.kind} blocked reason`);
      assertEqual(result.status, 'DISABLED', `${spec.kind} blocked status`);
    });
  }

  await test('KUR PETLJA accepts negative step by normalizing its magnitude', () => {
    const result = runKurPetlja({ start: 0, target: 5, step: -2, maxDurationMs: 100 });
    assert(result.completed, 'KUR should complete with negative step');
    assertEqual(result.output, 11, 'KUR normalized negative-step output');
    assertEqual(result.reason, 'completed', 'KUR normalized negative-step reason');
  });

  await test('time-limit protection works when maxDurationMs is zero', () => {
    const result = runForPetlja({ start: 0, end: 1000, step: 1, maxDurationMs: 0 });
    assert(!result.completed, 'Loop should stop by time limit');
    assertEqual(result.reason, 'time-limit', 'time limit reason');
    assertEqual(result.status, 'DEAD', 'time-limit should map to DEAD');
  });

  await test('DURMITOR PETLJA layers the mountain shape and embeds UMBREL output', () => {
    const input = { start: 2, end: 2, step: 1, target: 2, sequence: [1, 2], maxDurationMs: 100 };
    const result = runDurmitorPetlja(input);
    const umbrella = runUmbrelPetlja(input);
    const expectedMountain = (Math.abs(2) + input.sequence.length + 5) * 1;
    assert(result.completed, 'DURMITOR should complete');
    assertEqual(result.status, 'ACTIVATED', 'DURMITOR final status');
    assertEqual(result.reason, 'completed', 'DURMITOR completion reason');
    assertEqual(result.output, expectedMountain + umbrella.output, 'DURMITOR output should include mountain layer and umbrella core');
    assert(result.statusTrail.some((entry) => entry.reason.includes('[UMBREL PETLJA]')), 'DURMITOR should carry umbrella audit trail');
  });

  await test('DURMITOR PETLJA inherits incomplete status from embedded UMBREL output', () => {
    const input = { start: 0, end: 3, step: 1, target: 2, sequence: [2, 2], maxDurationMs: 100 };
    const result = runDurmitorPetlja(input);
    assert(!result.completed, 'DURMITOR should not complete when UMBREL fails');
    assertEqual(result.status, 'DISABLED', 'DURMITOR should inherit DISABLED aggregate');
    assertEqual(result.reason, 'invalid-input', 'DURMITOR should inherit umbrella reason');
    assert(result.warnings.some((warning) => warning.includes('[UMBREL PETLJA] [NIK PETLJA]')), 'DURMITOR should expose nested umbrella warnings');
  });

  await test('DURMITOR PETLJA guard stop maps to DEAD', () => {
    const result = runDurmitorPetlja({ start: 0, end: 10, step: 1, target: 0, sequence: [1], maxIterations: 2, maxDurationMs: 100 });
    assert(!result.completed, 'DURMITOR should stop early');
    assertEqual(result.reason, 'max-iterations', 'DURMITOR guard reason');
    assertEqual(result.status, 'DEAD', 'DURMITOR guard status');
  });

  await test('UMBREL PETLJA returns unified aggregate result', () => {
    const input = { start: 0, end: 3, step: 1, target: 2, sequence: [2, 2], maxDurationMs: 100 };
    const result = runUmbrelPetlja(input);
    const childOutputs = [
      runForPetlja(input).output,
      runItchPetlja(input).output,
      runUrPelja(input).output,
      runNikPetlja(input).output,
      runDorPetlja(input).output,
      runExePetlja(input).output,
      runKurPetlja(input).output,
      runDarPetlja(input).output,
      runYuPetlja(input).output,
      runZarPetlja(input).output,
      runDerPetlja(input).output,
      runGarPetlja(input).output,
      runZurPetlja(input).output,
      runIziPetlja(input).output,
      runUkPetlja(input).output,
      runZumPetlja(input).output,
    ].reduce((acc, value) => acc + value, 0);
    assert(result.trace.length === 16, 'UMBREL trace should contain 16 parts');
    assertEqual(result.reason, 'invalid-input', 'UMBREL invalid-input reason should match DISABLED aggregate');
    assert(['ACTIVATED', 'DISABLED', 'DEAD'].includes(result.status), 'UMBREL status should be canonical');
    assertEqual(result.statusTrail[0]?.to, 'MONSTER', 'UMBREL should enter MONSTER first');
    assert(result.statusTrail[result.statusTrail.length - 1]?.reason === 'umbrella-aggregate', 'UMBREL should aggregate status last');
    const last = result.statusTrail[result.statusTrail.length - 1];
    assert(last?.from === 'MONSTER' && last?.to === result.status, 'UMBREL aggregate transition should be valid');
    assertEqual(result.status, 'DISABLED', 'mixed child outcomes should aggregate to DISABLED');
    assertEqual(result.output, childOutputs, 'UMBREL output should sum child outputs');
    assertEqual(result.trace[result.trace.length - 1]?.accumulator, result.output, 'UMBREL final accumulator');
    assert(result.warnings.some((warning) => warning.includes('[NIK PETLJA] start mora biti >= end za NIK PETLJU')), 'UMBREL should include child warnings');
  });

  await test('UMBREL PETLJA gives DEAD precedence over DISABLED child failures', () => {
    const input = { start: 0, end: 100, step: 1, target: 100, sequence: [1, 2, 3, 4], maxIterations: 2, maxDurationMs: 100 };
    const result = runUmbrelPetlja(input);
    assert(!result.completed, 'UMBREL should not complete');
    assertEqual(result.status, 'DEAD', 'UMBREL should prioritize DEAD child statuses');
    assertEqual(result.reason, 'max-iterations', 'UMBREL should prioritize guard-stop reason');
    assert(result.warnings.some((warning) => warning.includes('[NIK PETLJA] start mora biti >= end for NIK PETLJA') || warning.includes('[NIK PETLJA] start mora biti >= end za NIK PETLJU')), 'UMBREL should preserve DISABLED child warnings');
  });

  await test('UMBREL PETLJA reports time-limit when a child hits the time guard first', () => {
    const input = { start: 0, end: 100, step: 1, target: 100, sequence: [1, 2, 3, 4], maxIterations: 100, maxDurationMs: 0 };
    const result = runUmbrelPetlja(input);
    assert(!result.completed, 'UMBREL should stop early on time-limit');
    assertEqual(result.status, 'DEAD', 'UMBREL time-limit status');
    assertEqual(result.reason, 'time-limit', 'UMBREL time-limit reason');
  });

  await test('status aliases normalize to canonical values', () => {
    const activated = runForPetlja({ start: 0, end: 1, step: 1, status: 'AKTIVEJT', maxDurationMs: 100 });
    assertEqual(activated.input.status, 'ACTIVATED', 'AKTIVEJT alias');
    assertEqual(activated.status, 'ACTIVATED', 'AKTIVEJT final status');

    const disabled = runForPetlja({ start: 0, end: 1, step: 1, status: 'DISEBLED', maxDurationMs: 100 });
    assertEqual(disabled.input.status, 'DISABLED', 'DISEBLED alias');
    assertEqual(disabled.status, 'DISABLED', 'DISEBLED final status');
    assertEqual(disabled.reason, 'blocked-status', 'DISEBLED blocks execution');

    const dead = runForPetlja({ start: 0, end: 1, step: 1, status: 'DED', maxDurationMs: 100 });
    assertEqual(dead.input.status, 'DEAD', 'DED alias');
    assertEqual(dead.status, 'DEAD', 'DED final status');
    assertEqual(dead.reason, 'blocked-status', 'DED blocks execution');
  });

  await test('MONSTER input status is blocked', () => {
    const result = runForPetlja({ start: 0, end: 2, step: 1, status: 'MONSTER', maxDurationMs: 100 });
    assertEqual(result.reason, 'blocked-status', 'MONSTER input should be blocked');
    assertEqual(result.status, 'MONSTER', 'blocked run preserves MONSTER status');
    assert(result.statusTrail.some((entry) => entry.from === 'MONSTER' && entry.to === 'MONSTER'), 'MONSTER blocked transition audit');
  });

  await test('UMBREL short-circuits when status is DISABLED', () => {
    const result = runUmbrelPetlja({ start: 0, end: 3, step: 1, status: 'DISEBLED', maxDurationMs: 100 });
    assertEqual(result.reason, 'blocked-status', 'umbrella blocked reason');
    assertEqual(result.status, 'DISABLED', 'umbrella blocked status');
    assertEqual(result.iterations, 0, 'umbrella blocked iterations');
    assert(result.statusTrail.some((entry) => entry.from === 'DISABLED' && entry.to === 'DISABLED'), 'umbrella blocked transition audit');
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
