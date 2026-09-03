import {
  BASE_ALLOWED_STATUSES,
  BASE_PERSONA_ID,
  getBaseHealthReport,
  getBasePoolById,
  listBasePools,
  validateBasePools,
} from '../../lib/base';
import { getSupabaseBasePoolSnapshot, resetSupabaseServerPoolState } from '../../lib/supabase/server';

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
  resetSupabaseServerPoolState();

  console.log('\n🔎 [base] lib tests\n');

  await test('allowed statuses are stable', () => {
    assert(BASE_ALLOWED_STATUSES.join(',') === 'active,weather-hold,maintenance', 'unexpected BASE statuses');
  });

  await test('dataset validation has no issues', () => {
    const issues = validateBasePools();
    assert(issues.length === 0, `expected 0 validation issues, got ${issues.length}`);
  });

  await test('list supports status filter', () => {
    const result = listBasePools({ status: 'active' });
    assert(result.total === 1, `expected 1 active pool, got ${result.total}`);
    assert(result.items.every((pool) => pool.status === 'active'), 'status filter mismatch');
  });

  await test('list supports min prize pool filter', () => {
    const result = listBasePools({ minPrizePoolEur: 10000 });
    assert(result.total === 1, `expected 1 pool above threshold, got ${result.total}`);
    assert(result.items[0]?.id === 'base-alpine-zero', 'unexpected top pool');
  });

  await test('get by id returns base-jumping pool', () => {
    const pool = getBasePoolById('base-urban-vector');
    assert(pool !== undefined, 'pool should exist');
    assert(pool!.sportId === 'base-jumping', `unexpected sportId: ${pool!.sportId}`);
    assert(pool!.requiredGearCategories.includes('chute') && pool!.requiredGearCategories.includes('helmet'), 'required gear mismatch');
  });

  await test('health report exposes BASE persona and Supabase pool snapshot', () => {
    const health = getBaseHealthReport();
    assert(health.personaId === BASE_PERSONA_ID, 'persona id mismatch');
    assert(health.totalPools === 3, `expected 3 pools, got ${health.totalPools}`);
    assert(health.sportId === 'base-jumping', `unexpected sportId: ${health.sportId}`);
    assert(health.supabasePool.poolName === 'base', `unexpected pool name: ${health.supabasePool.poolName}`);
  });

  await test('base pool snapshot defaults to offline without env', () => {
    resetSupabaseServerPoolState('base');
    const snapshot = getSupabaseBasePoolSnapshot();
    assert(snapshot.status === 'offline', `expected offline, got ${snapshot.status}`);
    assert(snapshot.allocatedClients === 0, `expected 0 allocated clients, got ${snapshot.allocatedClients}`);
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
