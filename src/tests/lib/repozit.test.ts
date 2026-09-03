import {
  getRepozitHealthReport,
  getRepozitRepositoryById,
  listRepozitRepositories,
  REPOZIT_MVP_CAPABILITIES,
  REPOZIT_PERSONA_ID,
  validateRepozitDataset,
} from '../../lib/repozit';

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
  console.log('\n🔎 [repozit] lib tests\n');

  await test('MVP capabilities are stable', () => {
    assert(REPOZIT_MVP_CAPABILITIES.join(',') === 'overview,search,status,sync', 'unexpected MVP capabilities');
  });

  await test('health report is healthy and has persona id', () => {
    const health = getRepozitHealthReport();
    assert(health.status === 'ok', `expected ok, got ${health.status}`);
    assert(health.personaId === REPOZIT_PERSONA_ID, 'persona id mismatch');
    assert(health.totalRepositories > 0, 'total repositories should be > 0');
    assert(health.linkedRepositories >= 1, 'expected at least one linked repository');
  });

  await test('dataset validation has no issues', () => {
    const issues = validateRepozitDataset();
    assert(issues.length === 0, `expected 0 validation issues, got ${issues.length}`);
  });

  await test('list filtering by status=active returns only active', () => {
    const result = listRepozitRepositories({ status: 'active' });
    assert(result.total > 0, 'active result should not be empty');
    assert(result.items.every((repository) => repository.status === 'active'), 'status filter mismatch');
  });

  await test('list filtering by syncStatus=linked returns linked records', () => {
    const result = listRepozitRepositories({ syncStatus: 'linked' });
    assert(result.total >= 1, 'linked repositories should exist');
    assert(result.items.every((repository) => repository.metadata.syncStatus === 'linked'), 'syncStatus filter mismatch');
  });

  await test('search query IO-OPENUI-AO returns linked repository', () => {
    const result = listRepozitRepositories({ query: 'IO-OPENUI-AO' });
    assert(result.items.some((repository) => repository.id === 'io-openui-ao'), 'expected io-openui-ao in search results');
  });

  await test('get by id returns metadata', () => {
    const repository = getRepozitRepositoryById('ai-iq-super-platforma');
    assert(repository !== undefined, 'repository should exist');
    assert(repository!.metadata.mvp.length === REPOZIT_MVP_CAPABILITIES.length, 'metadata MVP should be attached');
  });

  await test('unknown id returns undefined', () => {
    const repository = getRepozitRepositoryById('does-not-exist');
    assert(repository === undefined, 'unknown id must return undefined');
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
