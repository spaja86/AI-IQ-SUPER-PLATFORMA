/**
 * Deploy Registry Test Suite
 *
 * Verifikuje integritet deployRegistry — svaka platforma mora imati
 * sve obavezne polja i biti konzistentna sa deploy model pravilima.
 *
 * Pokretanje: npx tsx src/tests/lib/deploy-registry.test.ts
 */

import {
  deployRegistry,
  getDeployPlatformById,
  getTriggablePlatforms,
  getPlatformsWithHealthCheck,
} from '../../lib/deploy/deploy-registry';

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void): void {
  try {
    fn();
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

function assertEqual<T>(a: T, b: T, message?: string): void {
  if (a !== b) throw new Error(`${message ?? 'assertEqual'}: expected ${String(b)}, got ${String(a)}`);
}

function runTests() {
  console.log('\n🗂️  Deploy Registry Test Suite\n');

  // ── 1. Registry integrity ──────────────────────────────────────────────────

  console.log('📦 1. Registry integrity');

  test('deployRegistry nije prazan', () => {
    assert(deployRegistry.length > 0, 'Registry mora imati bar jednu platformu');
  });

  test('svaka platforma ima id, naziv, opis, ikona, vercelProjectId', () => {
    for (const p of deployRegistry) {
      assert(typeof p.id === 'string' && p.id.length > 0, `platforma bez id: ${JSON.stringify(p)}`);
      assert(typeof p.naziv === 'string' && p.naziv.length > 0, `platforma ${p.id} nema naziv`);
      assert(typeof p.opis === 'string' && p.opis.length > 0, `platforma ${p.id} nema opis`);
      assert(typeof p.ikona === 'string' && p.ikona.length > 0, `platforma ${p.id} nema ikona`);
      assert(typeof p.vercelProjectId === 'string' && p.vercelProjectId.length > 0, `platforma ${p.id} nema vercelProjectId`);
    }
  });

  test('svaka platforma ima produktionUrl koji počinje sa https://', () => {
    for (const p of deployRegistry) {
      assert(
        typeof p.produktionUrl === 'string' && p.produktionUrl.startsWith('https://'),
        `platforma ${p.id} ima neispravan produktionUrl: ${String(p.produktionUrl)}`,
      );
    }
  });

  test('svaka platforma ima ispravan framework string', () => {
    for (const p of deployRegistry) {
      assert(typeof p.framework === 'string' && p.framework.length > 0, `platforma ${p.id} nema framework`);
    }
  });

  test('svaka platforma ima ispravan status', () => {
    const validStatuses = ['aktivan', 'u_pripremi', 'neaktivan', 'greska'];
    for (const p of deployRegistry) {
      assert(validStatuses.includes(p.status), `platforma ${p.id} ima neispravan status: ${p.status}`);
    }
  });

  test('nema dupliranih ID-eva u registru', () => {
    const ids = new Set<string>();
    for (const p of deployRegistry) {
      assert(!ids.has(p.id), `duplirani platformId: ${p.id}`);
      ids.add(p.id);
    }
  });

  test('nema dupliranih vercelProjectId-eva u registru', () => {
    const projectIds = new Set<string>();
    for (const p of deployRegistry) {
      assert(!projectIds.has(p.vercelProjectId), `duplirani vercelProjectId: ${p.vercelProjectId}`);
      projectIds.add(p.vercelProjectId);
    }
  });

  // ── 2. Trigger-capable platforms ──────────────────────────────────────────

  console.log('\n📦 2. Trigger-capable platforms');

  test('platforme sa manualTriggerEnabled=true moraju imati deployHookEnvVar', () => {
    for (const p of deployRegistry) {
      if (p.manualTriggerEnabled) {
        assert(
          typeof p.deployHookEnvVar === 'string' && p.deployHookEnvVar.length > 0,
          `platforma ${p.id} ima manualTriggerEnabled=true ali nema deployHookEnvVar`,
        );
      }
    }
  });

  test('getTriggablePlatforms vraća samo platforme sa deployHookEnvVar i manualTriggerEnabled', () => {
    const triggable = getTriggablePlatforms();
    for (const p of triggable) {
      assert(p.deployHookEnvVar !== null, `triggable platforma ${p.id} nema deployHookEnvVar`);
      assert(p.manualTriggerEnabled, `triggable platforma ${p.id} nema manualTriggerEnabled`);
    }
    const manualCount = deployRegistry.filter((p) => p.manualTriggerEnabled && p.deployHookEnvVar !== null).length;
    assertEqual(triggable.length, manualCount, 'getTriggablePlatforms count');
  });

  // ── 3. Health check platforms ──────────────────────────────────────────────

  console.log('\n📦 3. Health check platforms');

  test('getPlatformsWithHealthCheck vraća samo platforme sa healthUrl', () => {
    const withHealth = getPlatformsWithHealthCheck();
    for (const p of withHealth) {
      assert(p.healthUrl !== null, `platforma ${p.id} nema healthUrl ali je u withHealth listi`);
    }
    const expectedCount = deployRegistry.filter((p) => p.healthUrl !== null).length;
    assertEqual(withHealth.length, expectedCount, 'getPlatformsWithHealthCheck count');
  });

  test('healthUrl-ovi počinju sa https://', () => {
    const withHealth = getPlatformsWithHealthCheck();
    for (const p of withHealth) {
      assert(
        p.healthUrl!.startsWith('https://'),
        `platforma ${p.id} ima neispravan healthUrl: ${String(p.healthUrl)}`,
      );
    }
  });

  // ── 4. Specific platform presence ─────────────────────────────────────────

  console.log('\n📦 4. Specific platform presence');

  test('ai-iq-super-platforma postoji u registru', () => {
    const p = getDeployPlatformById('ai-iq-super-platforma');
    assert(p !== undefined, 'ai-iq-super-platforma mora biti u registru');
    assert(p!.status === 'aktivan', 'ai-iq-super-platforma mora biti aktivan');
  });

  test('nova-generacija postoji u registru', () => {
    const p = getDeployPlatformById('nova-generacija');
    assert(p !== undefined, 'nova-generacija mora biti u registru');
  });

  test('poslovni-novcanik postoji u registru', () => {
    const p = getDeployPlatformById('poslovni-novcanik');
    assert(p !== undefined, 'poslovni-novcanik mora biti u registru');
    assert(
      typeof p!.deployHookEnvVar === 'string',
      'poslovni-novcanik mora imati deployHookEnvVar string',
    );
  });

  test('kompanija-spaja postoji u registru', () => {
    const p = getDeployPlatformById('kompanija-spaja');
    assert(p !== undefined, 'kompanija-spaja mora biti u registru');
  });

  test('getDeployPlatformById vraća undefined za nepostojeci ID', () => {
    const p = getDeployPlatformById('nepostoji-platforma-xyz');
    assertEqual(p, undefined, 'mora biti undefined za nepostojeći ID');
  });

  // ── Summary ───────────────────────────────────────────────────────────────

  console.log(`\n${'─'.repeat(50)}`);
  console.log(`🗂️  Deploy Registry: ✅ ${passed}  ❌ ${failed}  📊 ${passed + failed}`);
  console.log('─'.repeat(50));

  if (failed > 0) {
    console.error(`\n🚨 ${failed} test(ova) nije prošlo\n`);
    process.exit(1);
  } else {
    console.log('\n✅ Svi deploy registry testovi prošli\n');
  }
}

runTests();
