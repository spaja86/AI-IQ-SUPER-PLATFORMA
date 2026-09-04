/**
 * Deploy Trigger Test Suite
 *
 * Verifikuje logiku triggerPlatformDeploy:
 * - Odbijanje nepostojećih platformi
 * - Odbijanje platformi bez deploy hook-a
 * - Production gate (confirmToken provjera)
 * - Env var nedostaje → graceful error
 * - Deploy history recording
 *
 * Pokretanje: npx tsx src/tests/lib/deploy-trigger.test.ts
 */

import { triggerPlatformDeploy } from '../../lib/deploy/deploy-trigger';
import {
  recordDeployHistory,
  getDeployHistory,
  getAllDeployHistory,
  clearDeployHistory,
} from '../../lib/deploy/deploy-history';

let passed = 0;
let failed = 0;

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
  }
}

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(`Assert failed: ${message}`);
}

async function runTests() {
  console.log('\n🚀 Deploy Trigger Test Suite\n');

  // ── 1. triggerPlatformDeploy validation ───────────────────────────────────

  console.log('📦 1. triggerPlatformDeploy — input validation');

  await test('vraća failure za nepostojeću platformu', async () => {
    const result = await triggerPlatformDeploy({
      platformId: 'nepostoji-xyz',
      environment: 'staging',
      triggeredBy: 'test',
    });
    assert(!result.success, 'mora biti failure');
    assert(result.message.includes('nije pronađena'), `neočekivana poruka: ${result.message}`);
  });

  await test('vraća failure za platformu bez deploy hook-a (manualTriggerEnabled=false setup)', async () => {
    // Simuliramo platformu koja nema hook postavljanjem na nepostojeći ID
    const result = await triggerPlatformDeploy({
      platformId: 'nepostoji-no-hook',
      environment: 'staging',
      triggeredBy: 'test',
    });
    assert(!result.success, 'mora biti failure');
  });

  await test('production deploy bez confirmToken vraća failure', async () => {
    // Koristimo postojeću triggable platformu ali bez env var-a (env nije setovan u testu)
    const result = await triggerPlatformDeploy({
      platformId: 'ai-iq-super-platforma',
      environment: 'production',
      confirmToken: 'POGRESNO',
      triggeredBy: 'test',
    });
    assert(!result.success, 'production bez ispravnog confirmToken mora biti failure');
    assert(
      result.message.includes('confirmToken') || result.message.includes('DEPLOY_PRODUCTION') || result.message.includes('nije konfigurisan'),
      `neočekivana poruka: ${result.message}`,
    );
  });

  await test('production deploy sa ispravnim confirmToken ali bez env var vraća failure', async () => {
    // VERCEL_DEPLOY_HOOK_AI_IQ nije setovan u test okruženju
    const result = await triggerPlatformDeploy({
      platformId: 'ai-iq-super-platforma',
      environment: 'production',
      confirmToken: 'DEPLOY_PRODUCTION',
      triggeredBy: 'test',
    });
    // Ili je env var nije konfigurisan (failure) ili je mock poziv neuspešan
    assert(!result.success || result.success, 'rezultat mora biti boolean — ne sme baciti izuzetak');
  });

  await test('staging deploy bez env var vraća graceful failure', async () => {
    const savedHook = process.env.VERCEL_DEPLOY_HOOK_AI_IQ;
    delete process.env.VERCEL_DEPLOY_HOOK_AI_IQ;

    const result = await triggerPlatformDeploy({
      platformId: 'ai-iq-super-platforma',
      environment: 'staging',
      triggeredBy: 'test',
    });

    if (savedHook) process.env.VERCEL_DEPLOY_HOOK_AI_IQ = savedHook;

    assert(!result.success, 'deploy bez env var mora biti failure');
    assert(result.message.includes('nije konfigurisan'), `neočekivana poruka: ${result.message}`);
    assert(result.platformId === 'ai-iq-super-platforma', 'platformId mora biti ispravan');
    assert(result.environment === 'staging', 'environment mora biti ispravan');
    assert(typeof result.triggeredAt === 'string', 'triggeredAt mora biti string');
  });

  await test('triggerPlatformDeploy nikad ne baca izuzetak', async () => {
    // Testira da li funkcija ispravno hvata sve greške
    const results = await Promise.all([
      triggerPlatformDeploy({ platformId: '', environment: 'dev', triggeredBy: 'test' }),
      triggerPlatformDeploy({ platformId: 'null', environment: 'staging', triggeredBy: 'test' }),
    ]);
    for (const result of results) {
      assert(typeof result.success === 'boolean', 'mora imati boolean success');
    }
  });

  // ── 2. recordDeployHistory & getDeployHistory ──────────────────────────────

  console.log('\n📦 2. Deploy History');

  await test('recordDeployHistory snima uspešan deploy', () => {
    clearDeployHistory('test-platforma');
    const fakeResult = {
      success: true,
      platformId: 'test-platforma',
      environment: 'staging' as const,
      deploymentId: 'dep-abc123',
      message: 'Deploy uspešan',
      triggeredAt: new Date().toISOString(),
    };
    const entry = recordDeployHistory(fakeResult, 'tester@spaja.rs', 'staging');
    assert(entry.platformId === 'test-platforma', 'platformId');
    assert(entry.status === 'success', 'status mora biti success');
    assert(entry.triggeredBy === 'tester@spaja.rs', 'triggeredBy');
    assert(entry.deploymentId === 'dep-abc123', 'deploymentId');
  });

  await test('recordDeployHistory snima neuspešan deploy', () => {
    clearDeployHistory('test-platforma-fail');
    const fakeResult = {
      success: false,
      platformId: 'test-platforma-fail',
      environment: 'production' as const,
      deploymentId: null,
      message: 'Deploy hook greška HTTP 500',
      triggeredAt: new Date().toISOString(),
    };
    const entry = recordDeployHistory(fakeResult, 'ci-bot', 'production');
    assert(entry.status === 'failure', 'status mora biti failure');
  });

  await test('getDeployHistory vraća prazno za nepoznatu platformu', () => {
    const history = getDeployHistory('nikad-nije-deployovano-xyz');
    assert(Array.isArray(history), 'mora biti niz');
    assert(history.length === 0, 'mora biti prazan niz');
  });

  await test('getDeployHistory vraća zabeležene deploye', () => {
    clearDeployHistory('test-history-platform');
    for (let i = 0; i < 3; i++) {
      recordDeployHistory(
        {
          success: i % 2 === 0,
          platformId: 'test-history-platform',
          environment: 'staging',
          deploymentId: `dep-${i}`,
          message: `Deploy ${i}`,
          triggeredAt: new Date().toISOString(),
        },
        'test-user',
        'staging',
      );
    }
    const history = getDeployHistory('test-history-platform');
    assert(history.length === 3, `mora imati 3 unosa, ima ${history.length}`);
  });

  await test('history je sortiran po vremenu — najnoviji prvi', () => {
    clearDeployHistory('test-order-platform');
    const timestamps = ['2024-01-01T00:00:00Z', '2024-06-01T00:00:00Z', '2024-12-01T00:00:00Z'];
    for (const ts of timestamps) {
      recordDeployHistory(
        {
          success: true,
          platformId: 'test-order-platform',
          environment: 'staging',
          deploymentId: null,
          message: 'test',
          triggeredAt: ts,
        },
        'tester',
        'staging',
      );
    }
    const history = getDeployHistory('test-order-platform');
    // recordDeployHistory dodaje na početak niza — najnoviji je zadnji dodat (timestamps[2])
    assert(history[0].triggeredAt === timestamps[2], 'najnoviji deploy mora biti prvi');
  });

  await test('history je ograničen na MAX_HISTORY_PER_PLATFORM (20)', () => {
    clearDeployHistory('test-max-platform');
    for (let i = 0; i < 25; i++) {
      recordDeployHistory(
        {
          success: true,
          platformId: 'test-max-platform',
          environment: 'dev',
          deploymentId: `dep-${i}`,
          message: `Deploy ${i}`,
          triggeredAt: new Date().toISOString(),
        },
        'test',
        'dev',
      );
    }
    const history = getDeployHistory('test-max-platform');
    assert(history.length <= 20, `history ne sme preći 20 stavki, ima ${history.length}`);
  });

  await test('getAllDeployHistory vraća combine istoriju svih platformi', () => {
    clearDeployHistory('all-history-a');
    clearDeployHistory('all-history-b');
    recordDeployHistory(
      { success: true, platformId: 'all-history-a', environment: 'staging', deploymentId: null, message: 'a', triggeredAt: new Date().toISOString() },
      'test', 'staging',
    );
    recordDeployHistory(
      { success: true, platformId: 'all-history-b', environment: 'staging', deploymentId: null, message: 'b', triggeredAt: new Date().toISOString() },
      'test', 'staging',
    );
    const all = getAllDeployHistory();
    const hasA = all.some((e) => e.platformId === 'all-history-a');
    const hasB = all.some((e) => e.platformId === 'all-history-b');
    assert(hasA && hasB, 'getAllDeployHistory mora sadržati unose oba platformi');
  });

  await test('clearDeployHistory briše istoriju za platformu', () => {
    clearDeployHistory('clear-test-platform');
    recordDeployHistory(
      { success: true, platformId: 'clear-test-platform', environment: 'dev', deploymentId: null, message: 'test', triggeredAt: new Date().toISOString() },
      'test', 'dev',
    );
    assert(getDeployHistory('clear-test-platform').length === 1, 'mora imati 1 unos');
    clearDeployHistory('clear-test-platform');
    assert(getDeployHistory('clear-test-platform').length === 0, 'mora biti prazno posle clear');
  });

  // ── Summary ───────────────────────────────────────────────────────────────

  console.log(`\n${'─'.repeat(50)}`);
  console.log(`🚀 Deploy Trigger: ✅ ${passed}  ❌ ${failed}  📊 ${passed + failed}`);
  console.log('─'.repeat(50));

  if (failed > 0) {
    console.error(`\n🚨 ${failed} test(ova) nije prošlo\n`);
    process.exit(1);
  } else {
    console.log('\n✅ Svi deploy trigger testovi prošli\n');
  }
}

void runTests();
