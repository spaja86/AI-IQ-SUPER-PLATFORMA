// SpajaUltraOmegaCore -∞Ω+∞ — Unit Testovi za Feature Flags
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/lib/feature-flags.test.ts

import {
  isFeatureEnabled,
  getFlag,
  getEnabledFlags,
  getFlagsReport,
  setFlagOverride,
  removeFlagOverride,
  PLATFORM_FLAGS,
} from '../../lib/feature-flags';

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
  console.log('\n🚩 Feature Flags Test Suite\n');

  // ── PLATFORM_FLAGS registar ────────────────────────────────────────────────
  console.log('📋 PLATFORM_FLAGS registar');

  await test('PLATFORM_FLAGS je neprazan niz', () => {
    assert(Array.isArray(PLATFORM_FLAGS), 'mora biti niz');
    assert(PLATFORM_FLAGS.length > 0, 'mora imati bar jedan flag');
  });

  await test('Svaki flag ima obavezna polja', () => {
    for (const flag of PLATFORM_FLAGS) {
      assert(typeof flag.id === 'string' && flag.id.length > 0, `flag.id mora biti neprazan string (${flag.id})`);
      assert(typeof flag.naziv === 'string' && flag.naziv.length > 0, `flag.naziv mora biti neprazan (${flag.id})`);
      assert(typeof flag.opis === 'string' && flag.opis.length > 0, `flag.opis mora biti neprazan (${flag.id})`);
      assert(typeof flag.strategy === 'string', `flag.strategy mora biti string (${flag.id})`);
    }
  });

  await test('ID-jevi flagova su jedinstveni', () => {
    const ids = PLATFORM_FLAGS.map((f) => f.id);
    const unique = new Set(ids);
    assert(ids.length === unique.size, 'svi flag ID-jevi moraju biti jedinstveni');
  });

  await test('Kill switch flagovi su disabled', () => {
    const killSwitches = PLATFORM_FLAGS.filter((f) => f.killSwitch);
    for (const ks of killSwitches) {
      assertEqual(ks.strategy, 'disabled', `kill switch '${ks.id}' mora imati strategy disabled`);
    }
  });

  // ── getFlag ────────────────────────────────────────────────────────────────
  console.log('\n🔍 getFlag');

  await test('getFlag vraća flag po ID-u', () => {
    const flag = getFlag('ai-prompt-versioning');
    assert(flag !== null, 'flag mora biti pronađen');
    assertEqual(flag!.id, 'ai-prompt-versioning', 'ID mora odgovarati');
  });

  await test('getFlag vraća null za nepostojeći ID', () => {
    const flag = getFlag('nepostojeci-flag-xyz');
    assert(flag === null, 'mora vratiti null');
  });

  // ── isFeatureEnabled — strategy: disabled ──────────────────────────────────
  console.log('\n🔴 strategy: disabled');

  await test('Disabled flag uvek vraća false', () => {
    const result = isFeatureEnabled('dx-openapi-docs');
    assert(result === false, 'disabled flag mora biti false');
  });

  await test('Kill switch vraća false', () => {
    const result = isFeatureEnabled('kill-switch-checkout');
    assert(result === false, 'kill switch mora biti false');
  });

  await test('Kill switch vraća false i sa userId', () => {
    const result = isFeatureEnabled('kill-switch-ai', 'user-123');
    assert(result === false, 'kill switch sa userId mora biti false');
  });

  // ── isFeatureEnabled — strategy: enabled ──────────────────────────────────
  console.log('\n🟢 strategy: enabled');

  await test('Enabled flag vraća true', () => {
    const result = isFeatureEnabled('ai-prompt-versioning');
    assert(result === true, 'enabled flag mora biti true');
  });

  await test('Enabled flag vraća true i bez userId', () => {
    const result = isFeatureEnabled('gaming-anti-cheat-v2');
    assert(result === true, 'enabled flag bez userId mora biti true');
  });

  // ── isFeatureEnabled — strategy: percentage ────────────────────────────────
  console.log('\n📊 strategy: percentage');

  await test('Percentage flag vraća false bez userId', () => {
    const result = isFeatureEnabled('ai-response-caching', undefined, { env: 'production' });
    assert(result === false, 'percentage bez userId mora biti false');
  });

  await test('Percentage flag je deterministički za isti userId', () => {
    const userId = 'user-deterministic-123';
    const flagId = 'ai-response-caching';
    const r1 = isFeatureEnabled(flagId, userId, { env: 'production' });
    const r2 = isFeatureEnabled(flagId, userId, { env: 'production' });
    assertEqual(r1, r2, 'isti userId mora dati isti rezultat');
  });

  await test('Različiti userId-jevi mogu dati različite rezultate za percentage flag', () => {
    let trueCount = 0;
    let falseCount = 0;
    for (let i = 0; i < 100; i++) {
      const result = isFeatureEnabled('gaming-highscore-ledger', `user-${i}`, { env: 'production' });
      if (result) trueCount++;
      else falseCount++;
    }
    // Sa 20% rollout, treba i true i false
    assert(trueCount + falseCount === 100, 'ukupno mora biti 100');
    assert(trueCount > 0, 'bar neki userId mora proći sa 20% rollout-om');
    assert(falseCount > 0, 'bar neki userId ne sme proći sa 20% rollout-om');
  });

  // ── isFeatureEnabled — strategy: users ────────────────────────────────────
  console.log('\n👤 strategy: users');

  await test('Users flag vraća true za korisnika u listi', () => {
    const usersFlag = PLATFORM_FLAGS.find((f) => f.strategy === 'users');
    if (usersFlag && usersFlag.userIds && usersFlag.userIds.length > 0) {
      const targetUserId = usersFlag.userIds[0];
      const result = isFeatureEnabled(usersFlag.id, targetUserId);
      assert(result === true, 'korisnik u listi mora dobiti true');
    } else {
      // Nema users strategije u trenutnom registru — skip
      assert(true, 'nema users strategije — skip');
    }
  });

  await test('Users flag vraća false za korisnika koji nije u listi', () => {
    const usersFlag = PLATFORM_FLAGS.find((f) => f.strategy === 'users');
    if (usersFlag) {
      const result = isFeatureEnabled(usersFlag.id, 'non-existent-user-999');
      assert(result === false, 'korisnik van liste mora dobiti false');
    } else {
      assert(true, 'nema users strategije — skip');
    }
  });

  // ── isFeatureEnabled — strategy: plans ────────────────────────────────────
  console.log('\n💳 strategy: plans');

  await test('Plans flag vraća true za odgovarajući plan', () => {
    const result = isFeatureEnabled('ai-confidence-scoring', 'user-1', { plan: 'pro' });
    assert(result === true, 'pro plan mora dobiti true za ai-confidence-scoring');
  });

  await test('Plans flag vraća false za neodgovarajući plan', () => {
    const result = isFeatureEnabled('ai-confidence-scoring', 'user-1', { plan: 'starter' });
    assert(result === false, 'starter plan mora dobiti false za ai-confidence-scoring');
  });

  await test('Plans flag vraća false bez konteksta plana', () => {
    const result = isFeatureEnabled('ai-confidence-scoring', 'user-1');
    assert(result === false, 'bez plana mora biti false');
  });

  await test('Enterprise SLA monitoring samo za enterprise plan', () => {
    const enterprise = isFeatureEnabled('enterprise-sla-monitoring', 'user-1', {
      plan: 'enterprise',
      env: 'production',
    });
    assert(enterprise === true, 'enterprise plan mora dobiti true');

    const basic = isFeatureEnabled('enterprise-sla-monitoring', 'user-1', {
      plan: 'basic',
      env: 'production',
    });
    assert(basic === false, 'basic plan mora dobiti false');
  });

  // ── isFeatureEnabled — env filtering ──────────────────────────────────────
  console.log('\n🌍 Env filtering');

  await test('Flag sa envs production ne važi u development', () => {
    const result = isFeatureEnabled('analytics-cohort-reporting', 'user-1', {
      plan: 'enterprise',
      env: 'development',
    });
    assert(result === false, 'production-only flag ne sme biti aktivan u development');
  });

  await test('Flag sa envs production važi u production', () => {
    const result = isFeatureEnabled('analytics-cohort-reporting', 'user-1', {
      plan: 'enterprise',
      env: 'production',
    });
    assert(result === true, 'flag mora biti aktivan u production');
  });

  await test('Flag sa envs: all važi u svim okruženjima', () => {
    const devResult = isFeatureEnabled('ai-prompt-versioning', undefined, { env: 'development' });
    const prodResult = isFeatureEnabled('ai-prompt-versioning', undefined, { env: 'production' });
    const stagingResult = isFeatureEnabled('ai-prompt-versioning', undefined, { env: 'staging' });
    assert(devResult === true, 'mora biti aktivan u development');
    assert(prodResult === true, 'mora biti aktivan u production');
    assert(stagingResult === true, 'mora biti aktivan u staging');
  });

  // ── Admin Override ─────────────────────────────────────────────────────────
  console.log('\n🛡️ Admin Override');

  await test('setFlagOverride aktivira disabled flag', () => {
    setFlagOverride('kill-switch-checkout', true);
    const result = isFeatureEnabled('kill-switch-checkout');
    assert(result === true, 'override mora aktivirati flag');
    removeFlagOverride('kill-switch-checkout');
  });

  await test('setFlagOverride deaktivira enabled flag', () => {
    setFlagOverride('ai-prompt-versioning', false);
    const result = isFeatureEnabled('ai-prompt-versioning');
    assert(result === false, 'override mora deaktivirati flag');
    removeFlagOverride('ai-prompt-versioning');
  });

  await test('removeFlagOverride vraća originalno ponašanje', () => {
    setFlagOverride('ai-prompt-versioning', false);
    removeFlagOverride('ai-prompt-versioning');
    const result = isFeatureEnabled('ai-prompt-versioning');
    assert(result === true, 'posle uklanjanja override-a mora biti originalna vrednost');
  });

  await test('Override ima prednost nad percentage strategijom', () => {
    setFlagOverride('ai-response-caching', true);
    const result = isFeatureEnabled('ai-response-caching', undefined, { env: 'production' });
    assert(result === true, 'override mora imati prednost nad percentage strategijom');
    removeFlagOverride('ai-response-caching');
  });

  // ── getEnabledFlags ────────────────────────────────────────────────────────
  console.log('\n📋 getEnabledFlags');

  await test('getEnabledFlags vraća niz stringova', () => {
    const flags = getEnabledFlags();
    assert(Array.isArray(flags), 'mora biti niz');
    for (const flagId of flags) {
      assert(typeof flagId === 'string', 'svaki element mora biti string');
    }
  });

  await test('getEnabledFlags uključuje enabled flagove', () => {
    const flags = getEnabledFlags('user-1', { plan: 'pro', env: 'production' });
    assert(flags.includes('ai-prompt-versioning'), 'mora sadržati enabled flag');
  });

  await test('getEnabledFlags ne uključuje disabled flagove', () => {
    const flags = getEnabledFlags('user-1', { plan: 'pro', env: 'production' });
    assert(!flags.includes('kill-switch-checkout'), 'ne sme sadržati kill switch');
    assert(!flags.includes('enterprise-sso'), 'ne sme sadržati disabled flag');
  });

  await test('getEnabledFlags uključuje plans flagove za odgovarajući plan', () => {
    const flags = getEnabledFlags('user-1', { plan: 'pro', env: 'production' });
    assert(flags.includes('ai-confidence-scoring'), 'pro plan mora imati ai-confidence-scoring');
  });

  // ── getFlagsReport ─────────────────────────────────────────────────────────
  console.log('\n📊 getFlagsReport');

  await test('getFlagsReport ima ispravnu strukturu', () => {
    const report = getFlagsReport();
    assert(typeof report.total === 'number', 'total mora biti broj');
    assert(typeof report.enabled === 'number', 'enabled mora biti broj');
    assert(typeof report.disabled === 'number', 'disabled mora biti broj');
    assert(typeof report.killSwitches === 'number', 'killSwitches mora biti broj');
    assert(typeof report.canary === 'number', 'canary mora biti broj');
    assert(typeof report.overrides === 'number', 'overrides mora biti broj');
    assert(Array.isArray(report.flags), 'flags mora biti niz');
  });

  await test('getFlagsReport total odgovara veličini registra', () => {
    const report = getFlagsReport();
    assertEqual(report.total, PLATFORM_FLAGS.length, 'total mora odgovarati broju flagova');
  });

  await test('getFlagsReport killSwitches su ispravno prebrojani', () => {
    const report = getFlagsReport();
    const expectedKs = PLATFORM_FLAGS.filter((f) => f.killSwitch).length;
    assertEqual(report.killSwitches, expectedKs, 'broj kill switcheva mora odgovarati');
  });

  await test('getFlagsReport canary su ispravno prebrojani', () => {
    const report = getFlagsReport();
    const expectedCanary = PLATFORM_FLAGS.filter((f) => f.strategy === 'percentage').length;
    assertEqual(report.canary, expectedCanary, 'broj canary flagova mora odgovarati');
  });

  await test('getFlagsReport flags imaju obavezna polja', () => {
    const report = getFlagsReport();
    for (const flag of report.flags) {
      assert(typeof flag.id === 'string', 'flag.id mora biti string');
      assert(typeof flag.naziv === 'string', 'flag.naziv mora biti string');
      assert(typeof flag.strategy === 'string', 'flag.strategy mora biti string');
      assert(typeof flag.killSwitch === 'boolean', 'flag.killSwitch mora biti boolean');
    }
  });

  await test('getFlagsReport overrides broji aktivne override-e', () => {
    setFlagOverride('dx-openapi-docs', true);
    const report = getFlagsReport();
    assert(report.overrides >= 1, 'mora imati bar jedan override');
    removeFlagOverride('dx-openapi-docs');
  });

  // ── Nepostojeći flagovi ────────────────────────────────────────────────────
  console.log('\n❓ Nepostojeći flagovi');

  await test('isFeatureEnabled vraća false za nepostojeći flagId', () => {
    const result = isFeatureEnabled('flagId-koji-ne-postoji');
    assert(result === false, 'nepostojeći flag mora biti false');
  });

  await test('getFlag vraća null za nepostojeći flagId', () => {
    const flag = getFlag('nepostojeci-flag');
    assert(flag === null, 'mora biti null');
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
