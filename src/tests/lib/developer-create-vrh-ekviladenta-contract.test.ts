import {
  DEVELOPER_CREATE_NAVIGACIONI_SISTEM_SA_TREKEROM_TRACKER_CONTRACT,
  DEVELOPER_CREATE_VRH_INTERPRETATION_ALIASES,
  DEVELOPER_CREATE_VRH_NAVIGACIONI_SISTEM_SA_TREKEROM_ALIAS,
} from '../../lib/extrimli/developer-create-vrh-ekviladenta-contract';

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

function assertArrayEquals(actual: readonly string[], expected: readonly string[], label: string): void {
  assert(actual.length === expected.length, `${label}: expected ${expected.length} items, got ${actual.length}`);
  for (let index = 0; index < expected.length; index += 1) {
    assert(actual[index] === expected[index], `${label}: mismatch at index ${index}, expected ${expected[index]}, got ${actual[index]}`);
  }
}

async function runTests(): Promise<void> {
  console.log('\n🔗 [developer-create-vrh-contract] tests\n');

  await test('navigacioni alias is registered in interpretation aliases', () => {
    assert(
      DEVELOPER_CREATE_VRH_INTERPRETATION_ALIASES.includes(
        DEVELOPER_CREATE_VRH_NAVIGACIONI_SISTEM_SA_TREKEROM_ALIAS,
      ),
      'NAVIGACIONI SISTEM SA TREKEROM alias must be present in interpretation aliases',
    );
  });

  await test('navigacioni tracker required fields remain stable', () => {
    const expected = [
      'canonicalAlias',
      'status',
      'conflictIntensity',
      'currentWave',
      'auditEvidence',
      'rollbackReadiness',
      'downstreamReference',
    ];
    assertArrayEquals(
      DEVELOPER_CREATE_NAVIGACIONI_SISTEM_SA_TREKEROM_TRACKER_CONTRACT.requiredTrackerFields,
      expected,
      'unexpected navigacioni tracker required fields',
    );
  });

  await test('navigacioni governance outputs remain stable', () => {
    const expected = [
      'promotionFreeze',
      'humanReviewStatus',
      'reviewPosture',
      'releaseAuditSummary',
      'rolloutPlan',
      'rollbackPlan',
    ];
    assertArrayEquals(
      DEVELOPER_CREATE_NAVIGACIONI_SISTEM_SA_TREKEROM_TRACKER_CONTRACT.requiredGovernanceOutputs,
      expected,
      'unexpected navigacioni governance outputs',
    );
  });

  console.log(`\n📊 developer-create-vrh-contract: ${passed} passed, ${failed} failed`);
  if (failed > 0) {
    console.error('Failures:');
    failures.forEach((failure) => console.error(` - ${failure}`));
    process.exitCode = 1;
  }
}

void runTests();
