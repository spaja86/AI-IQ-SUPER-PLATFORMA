import {
  buildPretplataSnapshot,
  STANDARDIZOVANI_PRETPLATA_STATUSI,
  STANDARDIZOVANI_PRETPLATA_STATUS_MODEL,
} from '../../lib/login-pretplata';

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
  console.log('\n🔐 [login-pretplata] normalization tests\n');

  await test('status model has four canonical statuses', () => {
    assert(STANDARDIZOVANI_PRETPLATA_STATUSI.length === 4, 'expected 4 statuses');
    assert(STANDARDIZOVANI_PRETPLATA_STATUS_MODEL.length === 4, 'expected 4 status definitions');
  });

  await test('owner email receives active Unlimited VIP plan', () => {
    const result = buildPretplataSnapshot({
      email: 'spajicn@yahoo.com',
      roles: [],
      digitalIndustryAccess: true,
    });

    assert(result.status === 'aktivan', `expected aktivan, got ${result.status}`);
    assert(result.plan === 'Unlimited VIP', `expected Unlimited VIP, got ${result.plan}`);
    assert(result.goNoGo === 'go', 'owner should be go');
    assert(result.dozvole.industrija === true, 'owner should have industry access');
  });

  await test('pending role maps to cekanje and restricted industry access', () => {
    const result = buildPretplataSnapshot({
      email: 'korisnik@example.com',
      roles: ['subscription-pending'],
      digitalIndustryAccess: true,
    });

    assert(result.status === 'cekanje', `expected cekanje, got ${result.status}`);
    assert(result.goNoGo === 'no-go', 'pending should be no-go');
    assert(result.dozvole.industrija === false, 'pending should not unlock industry');
    assert(result.dozvole.platforme === true, 'pending should keep basic platform access');
  });

  await test('verification role maps to verifikacija', () => {
    const result = buildPretplataSnapshot({
      email: 'korisnik@example.com',
      roles: ['subscription-verification'],
      digitalIndustryAccess: true,
    });

    assert(result.status === 'verifikacija', `expected verifikacija, got ${result.status}`);
    assert(result.onboarding.verifikacija === 'hold', 'verification step must be hold');
    assert(result.goNoGo === 'no-go', 'verification should be no-go');
  });

  await test('no digital industry access enforces blocked status', () => {
    const result = buildPretplataSnapshot({
      email: 'korisnik@example.com',
      roles: [],
      digitalIndustryAccess: false,
    });

    assert(result.status === 'blokiran', `expected blokiran, got ${result.status}`);
    assert(result.dozvole.platforme === false, 'blocked should deny platform access');
    assert(result.onboarding.sledeciKorak === 'manual-review', 'blocked should require manual review');
  });

  await test('digitalIndustryAccess=false forces blocked gating even with pending role', () => {
    const result = buildPretplataSnapshot({
      email: 'korisnik@example.com',
      roles: ['subscription-pending'],
      digitalIndustryAccess: false,
    });

    assert(result.status === 'blokiran', `expected blokiran, got ${result.status}`);
    assert(result.goNoGo === 'no-go', 'blocked should remain no-go');
    assert(result.dozvole.platforme === false, 'blocked status should deny platform access');
    assert(result.onboarding.sledeciKorak === 'manual-review', 'blocked status should force manual review');
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
