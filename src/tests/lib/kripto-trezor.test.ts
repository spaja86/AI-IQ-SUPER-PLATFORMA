// SpajaUltraOmegaCore -∞Ω+∞ — Unit Testovi za Kripto Trezor
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/lib/kripto-trezor.test.ts

import {
  validateVaultDepositAmount,
  isAddressWhitelisted,
  requiresTimeLock,
  requiresMultiSig,
  calcTimeLockExpiry,
  buildVaultStatusReport,
  buildVaultDepositRecord,
  buildVaultWithdrawalRecord,
  buildVaultAuditLog,
  buildVaultSecurityCheckReport,
  buildVaultPolicyReport,
  buildVaultRecoveryReport,
  buildVaultCoverageReport,
  buildVaultRiskReport,
  buildVaultAnalyticsReport,
  buildVaultRebalanceReport,
  buildVaultLiquidityReport,
  buildVaultForecastReport,
  buildVaultStressReport,
  buildVaultResilienceReport,
  buildVaultBenchmarkReport,
  buildVaultAttributionReport,
  buildVaultExposureReport,
  buildVaultAllocationReport,
  VAULT_MIN_DEPOSIT,
  VAULT_TIME_LOCK_DAYS,
  VAULT_MULTISIG_THRESHOLD,
  type VaultTier,
  type VaultAccount,
} from '../../lib/menjacnica/trezor';

// ─── Test Runner ──────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
const failures: string[] = [];

async function test(name: string, fn: () => void): Promise<void> {
  try {
    fn();
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

function assert(cond: boolean, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

function assertClose(a: number, b: number, tol = 1e-6, label = ''): void {
  if (Math.abs(a - b) > tol) {
    throw new Error(`${label}Expected ~${b}, got ${a}`);
  }
}

// ─── Test Suite ───────────────────────────────────────────────────────────────

async function runTests(): Promise<void> {

  // ─── validateVaultDepositAmount ───────────────────────────────────────────

  console.log('\n✅ validateVaultDepositAmount');

  await test('validan iznos za hot tier', () => {
    const r = validateVaultDepositAmount(0.01, 'hot');
    assert(r.valid, `Mora biti validan: ${r.reason}`);
  });

  await test('iznos ispod minimuma za cold tier → nevažeći', () => {
    const r = validateVaultDepositAmount(0.05, 'cold'); // min je 0.1
    assert(!r.valid, 'Mora biti nevažeći');
    assert(typeof r.reason === 'string' && r.reason.length > 0, 'Razlog mora biti naveden');
  });

  await test('tačno minimalni iznos za deep-cold → validan', () => {
    const r = validateVaultDepositAmount(VAULT_MIN_DEPOSIT['deep-cold'], 'deep-cold');
    assert(r.valid, `Mora biti validan: ${r.reason}`);
  });

  await test('negativan iznos → nevažeći', () => {
    const r = validateVaultDepositAmount(-1, 'hot');
    assert(!r.valid, 'Negativan iznos mora biti nevažeći');
  });

  await test('nula → nevažeći', () => {
    const r = validateVaultDepositAmount(0, 'warm');
    assert(!r.valid, 'Nula mora biti nevažeća');
  });

  await test('NaN → nevažeći', () => {
    const r = validateVaultDepositAmount(NaN, 'cold');
    assert(!r.valid, 'NaN mora biti nevažeći');
  });

  await test('prekomjeran iznos (>1e9) → nevažeći', () => {
    const r = validateVaultDepositAmount(2e9, 'hot');
    assert(!r.valid, 'Previše veliki iznos mora biti nevažeći');
  });

  // ─── isAddressWhitelisted ─────────────────────────────────────────────────

  console.log('\n📋 isAddressWhitelisted');

  const mockAccount: VaultAccount = {
    id: 'test-vault-1',
    userId: 'user-1',
    assetId: 'BTC',
    tier: 'cold',
    locked: 1,
    unlocking: 0,
    available: 0,
    whitelistedAddresses: ['bc1qTest01', 'bc1qTest02'],
    multiSigThreshold: 3,
    timeLockDays: 3,
    lastAuditAt: '2026-05-01T00:00:00Z',
    enabled: true,
    createdAt: '2026-01-01T00:00:00Z',
  };

  await test('adresa u whitelist-u → true', () => {
    assert(isAddressWhitelisted(mockAccount, 'bc1qTest01'), 'Mora biti u whitelist-u');
  });

  await test('adresa nije u whitelist-u → false', () => {
    assert(!isAddressWhitelisted(mockAccount, 'bc1qInvalid'), 'Ne sme biti u whitelist-u');
  });

  await test('prazan string → false', () => {
    assert(!isAddressWhitelisted(mockAccount, ''), 'Prazan string nije u whitelist-u');
  });

  // ─── requiresTimeLock / requiresMultiSig ──────────────────────────────────

  console.log('\n⏳ requiresTimeLock / requiresMultiSig');

  await test('hot tier ne zahteva time-lock', () => {
    assert(!requiresTimeLock('hot'), 'Hot ne zahteva time-lock');
  });

  await test('cold tier zahteva time-lock', () => {
    assert(requiresTimeLock('cold'), 'Cold zahteva time-lock');
  });

  await test('deep-cold tier zahteva time-lock', () => {
    assert(requiresTimeLock('deep-cold'), 'Deep-cold zahteva time-lock');
  });

  await test('hot tier ne zahteva multi-sig (1-of-1)', () => {
    assert(!requiresMultiSig('hot'), 'Hot (1-of-1) ne zahteva multi-sig');
  });

  await test('warm tier zahteva multi-sig (2-of-3)', () => {
    assert(requiresMultiSig('warm'), 'Warm zahteva multi-sig');
  });

  await test('deep-cold tier zahteva multi-sig (5-of-7)', () => {
    assert(requiresMultiSig('deep-cold'), 'Deep-cold zahteva multi-sig');
    assert(VAULT_MULTISIG_THRESHOLD['deep-cold'] === 5, 'Deep-cold threshold mora biti 5');
  });

  // ─── calcTimeLockExpiry ────────────────────────────────────────────────────

  console.log('\n📅 calcTimeLockExpiry');

  await test('cold tier — expiry je 3 dana nakon now', () => {
    const now = new Date('2026-05-11T12:00:00Z');
    const expiry = calcTimeLockExpiry('cold', now);
    const expectedDate = new Date('2026-05-14T12:00:00Z');
    assert(expiry.getTime() === expectedDate.getTime(), `Expiry=${expiry.toISOString()}, očekivano=${expectedDate.toISOString()}`);
  });

  await test('deep-cold tier — expiry je 7 dana nakon now', () => {
    const now = new Date('2026-05-11T00:00:00Z');
    const expiry = calcTimeLockExpiry('deep-cold', now);
    const diff = expiry.getTime() - now.getTime();
    const diffDays = diff / (1000 * 60 * 60 * 24);
    assertClose(diffDays, VAULT_TIME_LOCK_DAYS['deep-cold'], 1e-9, 'days ');
  });

  await test('hot tier — expiry je isti momenat (0 dana)', () => {
    const now = new Date('2026-05-11T00:00:00Z');
    const expiry = calcTimeLockExpiry('hot', now);
    assert(expiry.getTime() === now.getTime(), 'Hot expiry mora biti isti momenat');
  });

  // ─── buildVaultStatusReport ────────────────────────────────────────────────

  console.log('\n🔐 buildVaultStatusReport');

  await test('vraća report za korisnika', () => {
    const r = buildVaultStatusReport('test-user-1');
    assert(r.userId === 'test-user-1', 'userId ne odgovara');
    assert(Array.isArray(r.accounts), 'accounts mora biti niz');
    assert(r.accounts.length > 0, 'mora imati bar jedan račun');
  });

  await test('svaki vault nalog ima obavezne atribute', () => {
    const r = buildVaultStatusReport('test-user-2');
    for (const a of r.accounts) {
      assert(typeof a.id === 'string', 'id mora biti string');
      assert(typeof a.assetId === 'string', 'assetId mora biti string');
      assert(['hot', 'warm', 'cold', 'deep-cold'].includes(a.tier), `tier nevažeći: ${a.tier}`);
      assert(Number.isFinite(a.locked) && a.locked >= 0, 'locked mora biti >=0');
      assert(Number.isFinite(a.unlocking) && a.unlocking >= 0, 'unlocking mora biti >=0');
      assert(Number.isFinite(a.available) && a.available >= 0, 'available mora biti >=0');
      assert(Array.isArray(a.whitelistedAddresses), 'whitelistedAddresses mora biti niz');
    }
  });

  await test('totalLockedUsd je pozitivan', () => {
    const r = buildVaultStatusReport('test-user-3');
    assert(r.totalLockedUsd > 0, 'totalLockedUsd mora biti pozitivan');
  });

  await test('securityScore je između 0 i 100', () => {
    const r = buildVaultStatusReport('test-user-4');
    assert(r.securityScore >= 0 && r.securityScore <= 100, `securityScore=${r.securityScore} van opsega`);
  });

  await test('timestamp je validan ISO 8601', () => {
    const r = buildVaultStatusReport('test-user-5');
    assert(!isNaN(Date.parse(r.timestamp)), `timestamp nije validan: ${r.timestamp}`);
  });

  // ─── buildVaultDepositRecord ───────────────────────────────────────────────

  console.log('\n📥 buildVaultDepositRecord');

  await test('kreira depozit zapis sa ispravnim atributima', () => {
    const dep = buildVaultDepositRecord('user-1', {
      assetId: 'BTC',
      amount: 0.5,
      targetTier: 'cold',
      sourceTier: 'novcanik',
    });
    assert(dep.userId === 'user-1', 'userId ne odgovara');
    assert(dep.assetId === 'BTC', 'assetId ne odgovara');
    assert(dep.amount === 0.5, 'amount ne odgovara');
    assert(dep.targetTier === 'cold', 'targetTier ne odgovara');
    assert(dep.status === 'pending', 'početni status mora biti pending');
    assert(dep.confirmations === 0, 'potvrde moraju biti 0 na startu');
    assert(dep.requiredConfirmations > 0, 'mora zahtevati bar jednu potvrdu');
  });

  await test('deep-cold tier zahteva više potvrda od hot', () => {
    const hotDep = buildVaultDepositRecord('user-1', { assetId: 'ETH', amount: 0.1, targetTier: 'hot' });
    const coldDep = buildVaultDepositRecord('user-1', { assetId: 'ETH', amount: 0.1, targetTier: 'deep-cold' });
    assert(coldDep.requiredConfirmations > hotDep.requiredConfirmations,
      `deep-cold(${coldDep.requiredConfirmations}) mora zahtevati više od hot(${hotDep.requiredConfirmations})`);
  });

  await test('idempotencyKey se čuva ako je prosleđen', () => {
    const dep = buildVaultDepositRecord('user-1', {
      assetId: 'BTC',
      amount: 1,
      idempotencyKey: 'idem-key-001',
    });
    assert(dep.idempotencyKey === 'idem-key-001', 'idempotencyKey mora biti sačuvan');
  });

  // ─── buildVaultWithdrawalRecord ────────────────────────────────────────────

  console.log('\n📤 buildVaultWithdrawalRecord');

  await test('kreira withdrawal zapis za cold tier — time-lock', () => {
    const wit = buildVaultWithdrawalRecord('user-1', {
      assetId: 'BTC',
      amount: 0.1,
      destinationAddress: 'bc1qTestWithdraw01',
    }, 'cold');
    assert(wit.userId === 'user-1', 'userId ne odgovara');
    assert(wit.status === 'time-lock', `Za cold tier status mora biti time-lock: ${wit.status}`);
    assert(wit.timeLockExpiresAt !== undefined, 'timeLockExpiresAt mora biti setovan');
    assert(wit.multiSigThreshold === VAULT_MULTISIG_THRESHOLD['cold'], 'threshold ne odgovara');
  });

  await test('hot tier withdrawal — bez time-lock-a, multi-sig-required', () => {
    const wit = buildVaultWithdrawalRecord('user-1', {
      assetId: 'USDT',
      amount: 100,
      destinationAddress: '0xHotWithdrawAddr',
    }, 'hot');
    assert(wit.status === 'multi-sig-required', `Za hot tier status mora biti multi-sig-required: ${wit.status}`);
    assert(wit.timeLockExpiresAt === undefined, 'hot tier ne sme imati timeLockExpiresAt');
  });

  await test('multiSigSignaturesCollected je 0 na startu', () => {
    const wit = buildVaultWithdrawalRecord('user-1', {
      assetId: 'ETH',
      amount: 1,
      destinationAddress: '0xEthAddr01',
    }, 'warm');
    assert(wit.multiSigSignaturesCollected === 0, 'Početni potpisi moraju biti 0');
  });

  await test('deep-cold tier ima max threshold i time-lock', () => {
    const wit = buildVaultWithdrawalRecord('user-1', {
      assetId: 'SPAJA',
      amount: 1,
      destinationAddress: '0xSpajaDeepCold01',
    }, 'deep-cold');
    assert(wit.multiSigThreshold === 5, `Threshold mora biti 5: ${wit.multiSigThreshold}`);
    const lockDays = VAULT_TIME_LOCK_DAYS['deep-cold'];
    assert(lockDays === 7, `Deep-cold time-lock mora biti 7 dana: ${lockDays}`);
  });

  // ─── buildVaultAuditLog ─────────────────────────────────────────────────────

  console.log('\n📚 buildVaultAuditLog');

  await test('vraća audit događaje za korisnika', () => {
    const events = buildVaultAuditLog('audit-user-1');
    assert(Array.isArray(events), 'Mora vratiti niz');
    assert(events.length > 0, 'Mora vratiti bar jedan događaj');
  });

  await test('svi eventi pripadaju prosleđenom userId', () => {
    const userId = 'audit-user-2';
    const events = buildVaultAuditLog(userId);
    assert(events.every((e) => e.userId === userId), 'Svi eventi moraju imati isti userId');
  });

  await test('limit parametar ograničava broj događaja', () => {
    const events = buildVaultAuditLog('audit-user-3', 3);
    assert(events.length === 3, `Očekivano 3 događaja, dobili ${events.length}`);
  });

  await test('limit > 100 se clamp-uje na 100', () => {
    const events = buildVaultAuditLog('audit-user-4', 999);
    assert(events.length <= 100, `Broj događaja ne sme biti >100: ${events.length}`);
  });

  await test('limit < 1 se clamp-uje na 1', () => {
    const events = buildVaultAuditLog('audit-user-5', 0);
    assert(events.length === 1, `Broj događaja mora biti 1: ${events.length}`);
  });

  await test('događaji su sortirani opadajuće po createdAt', () => {
    const events = buildVaultAuditLog('audit-user-6');
    for (let i = 1; i < events.length; i++) {
      const prev = Date.parse(events[i - 1].createdAt);
      const curr = Date.parse(events[i].createdAt);
      assert(prev >= curr, `Sortiranje nije opadajuće na indexu ${i}`);
    }
  });

  await test('audit eventi imaju validne severity vrednosti', () => {
    const events = buildVaultAuditLog('audit-user-7');
    const allowed = new Set(['info', 'warning', 'critical']);
    for (const e of events) {
      assert(allowed.has(e.severity), `Nevažeći severity: ${e.severity}`);
    }
  });

  // ─── buildVaultSecurityCheckReport ───────────────────────────────────────────

  console.log('\n🛡️ buildVaultSecurityCheckReport');

  await test('vraća security report za korisnika', () => {
    const report = buildVaultSecurityCheckReport('sec-user-1');
    assert(report.userId === 'sec-user-1', 'userId ne odgovara');
    assert(Number.isFinite(report.overallScore), 'overallScore mora biti broj');
    assert(Array.isArray(report.checks), 'checks mora biti niz');
    assert(Array.isArray(report.alerts), 'alerts mora biti niz');
  });

  await test('overallScore je između 0 i 100', () => {
    const report = buildVaultSecurityCheckReport('sec-user-2');
    assert(report.overallScore >= 0 && report.overallScore <= 100, `overallScore van opsega: ${report.overallScore}`);
  });

  await test('report ima očekivane check tipove', () => {
    const report = buildVaultSecurityCheckReport('sec-user-3');
    const kinds = new Set(report.checks.map((c) => c.kind));
    const expected = ['cold-storage-ratio', 'multi-sig-policy', 'time-lock-policy', 'whitelist-hygiene', 'audit-freshness'];
    for (const kind of expected) {
      assert(kinds.has(kind), `Nedostaje check kind: ${kind}`);
    }
  });

  await test('svi check score-ovi su između 0 i 100', () => {
    const report = buildVaultSecurityCheckReport('sec-user-4');
    for (const check of report.checks) {
      assert(check.score >= 0 && check.score <= 100, `Nevažeći score za ${check.id}: ${check.score}`);
    }
  });

  // ─── buildVaultPolicyReport ───────────────────────────────────────────────────

  console.log('\n📋 buildVaultPolicyReport');

  await test('vraća policy report za korisnika', () => {
    const report = buildVaultPolicyReport('pol-user-1');
    assert(report.userId === 'pol-user-1', 'userId ne odgovara');
    assert(typeof report.version === 'string', 'version mora biti string');
    assert(Array.isArray(report.tiers), 'tiers mora biti niz');
    assert(report.tiers.length === 4, 'mora imati politiku za sva 4 tiera');
  });

  await test('policy ima sve tierove', () => {
    const report = buildVaultPolicyReport('pol-user-2');
    const tierNames = new Set(report.tiers.map((t) => t.tier));
    for (const tier of ['hot', 'warm', 'cold', 'deep-cold'] as const) {
      assert(tierNames.has(tier), `Nedostaje tier: ${tier}`);
    }
  });

  await test('maxDailyWithdrawUsd raste sa sigurnosnim nivoom', () => {
    const report = buildVaultPolicyReport('pol-user-3');
    const get = (tier: string) => report.tiers.find((t) => t.tier === tier)!.maxDailyWithdrawUsd;
    assert(get('hot') < get('warm'), 'warm > hot');
    assert(get('warm') < get('cold'), 'cold > warm');
    assert(get('cold') < get('deep-cold'), 'deep-cold > cold');
  });

  await test('globalRules ima sve obavezne atribute', () => {
    const report = buildVaultPolicyReport('pol-user-4');
    const gr = report.globalRules;
    assert(Number.isFinite(gr.maxConcurrentUnlocks), 'maxConcurrentUnlocks mora biti broj');
    assert(Number.isFinite(gr.withdrawCooldownMinutes), 'withdrawCooldownMinutes mora biti broj');
    assert(Number.isFinite(gr.kycRequiredAboveUsd), 'kycRequiredAboveUsd mora biti broj');
    assert(Array.isArray(gr.supportedAssets) && gr.supportedAssets.length > 0, 'supportedAssets mora biti neprazan niz');
  });

  // ─── Vault Konstante ────────────────────────────────────────────────────────

  console.log('\n📌 Vault Konstante');

  const tiers: VaultTier[] = ['hot', 'warm', 'cold', 'deep-cold'];

  await test('svi tierovi imaju VAULT_MIN_DEPOSIT', () => {
    for (const tier of tiers) {
      assert(Number.isFinite(VAULT_MIN_DEPOSIT[tier]) && VAULT_MIN_DEPOSIT[tier] > 0,
        `VAULT_MIN_DEPOSIT[${tier}] mora biti pozitivan`);
    }
  });

  await test('VAULT_TIME_LOCK_DAYS raste sa nivoom sigurnosti', () => {
    assert(VAULT_TIME_LOCK_DAYS['hot'] === 0, 'hot mora biti 0');
    assert(VAULT_TIME_LOCK_DAYS['warm'] >= 1, 'warm mora biti >=1');
    assert(VAULT_TIME_LOCK_DAYS['cold'] >= VAULT_TIME_LOCK_DAYS['warm'], 'cold >= warm');
    assert(VAULT_TIME_LOCK_DAYS['deep-cold'] >= VAULT_TIME_LOCK_DAYS['cold'], 'deep-cold >= cold');
  });

  await test('VAULT_MULTISIG_THRESHOLD raste sa nivoom sigurnosti', () => {
    assert(VAULT_MULTISIG_THRESHOLD['hot'] === 1, 'hot mora biti 1');
    assert(VAULT_MULTISIG_THRESHOLD['warm'] >= 2, 'warm mora biti >=2');
    assert(VAULT_MULTISIG_THRESHOLD['cold'] >= VAULT_MULTISIG_THRESHOLD['warm'], 'cold >= warm');
    assert(VAULT_MULTISIG_THRESHOLD['deep-cold'] >= VAULT_MULTISIG_THRESHOLD['cold'], 'deep-cold >= cold');
  });

  // ─── buildVaultRecoveryReport ─────────────────────────────────────────────────

  console.log('\n🔑 buildVaultRecoveryReport');

  await test('vraća recovery report za korisnika', () => {
    const report = buildVaultRecoveryReport('rec-user-1');
    assert(report.userId === 'rec-user-1', 'userId ne odgovara');
    assert(typeof report.planVersion === 'string', 'planVersion mora biti string');
    assert(Array.isArray(report.keyholders), 'keyholders mora biti niz');
    assert(Array.isArray(report.steps), 'steps mora biti niz');
  });

  await test('ima bar 2 čuvara ključa', () => {
    const report = buildVaultRecoveryReport('rec-user-2');
    assert(report.keyholders.length >= 2, `Mora imati bar 2 čuvara ključa: ${report.keyholders.length}`);
  });

  await test('recoveryThreshold je pozitivan i <= broj čuvara', () => {
    const report = buildVaultRecoveryReport('rec-user-3');
    assert(report.recoveryThreshold >= 1, 'recoveryThreshold mora biti >=1');
    assert(report.recoveryThreshold <= report.keyholders.length, 'threshold ne sme biti veći od broja čuvara');
  });

  await test('svaki korak ima ispravan order, title i estimatedDurationMinutes', () => {
    const report = buildVaultRecoveryReport('rec-user-4');
    for (const step of report.steps) {
      assert(typeof step.order === 'number' && step.order >= 1, `Nevažeći order: ${step.order}`);
      assert(typeof step.title === 'string' && step.title.length > 0, 'title mora biti neprazan string');
      assert(step.estimatedDurationMinutes > 0, `estimatedDurationMinutes mora biti pozitivan: ${step.estimatedDurationMinutes}`);
    }
  });

  await test('koraci su sortirani po order polju', () => {
    const report = buildVaultRecoveryReport('rec-user-5');
    for (let i = 1; i < report.steps.length; i++) {
      assert(report.steps[i].order > report.steps[i - 1].order, `Koraci nisu sortirani na indexu ${i}`);
    }
  });

  await test('ima bar jedan kontakt za hitne slučajeve', () => {
    const report = buildVaultRecoveryReport('rec-user-6');
    assert(report.emergencyContacts.length >= 1, 'Mora imati bar jedan hitni kontakt');
    for (const contact of report.emergencyContacts) {
      assert(typeof contact.label === 'string' && contact.label.length > 0, 'label mora biti neprazan');
      assert(typeof contact.value === 'string' && contact.value.length > 0, 'value mora biti neprazan');
    }
  });

  await test('timestamp je validan ISO 8601', () => {
    const report = buildVaultRecoveryReport('rec-user-7');
    assert(!isNaN(Date.parse(report.timestamp)), `timestamp nije validan: ${report.timestamp}`);
  });

  await test('svaki keyholder ima javni ključ i kontakt metodu', () => {
    const report = buildVaultRecoveryReport('rec-user-8');
    const validMethods = new Set(['email', 'signal', 'hardware-token']);
    for (const kh of report.keyholders) {
      assert(typeof kh.publicKeyFingerprint === 'string' && kh.publicKeyFingerprint.length > 0,
        `publicKeyFingerprint mora biti neprazan za ${kh.alias}`);
      assert(validMethods.has(kh.contactMethod), `Nevažeći contactMethod: ${kh.contactMethod}`);
    }
  });

  // ─── buildVaultCoverageReport ─────────────────────────────────────────────────

  console.log('\n🛡️ buildVaultCoverageReport');

  await test('vraća coverage report za korisnika', () => {
    const report = buildVaultCoverageReport('cov-user-1');
    assert(report.userId === 'cov-user-1', 'userId ne odgovara');
    assert(Number.isFinite(report.totalVaultUsd) && report.totalVaultUsd > 0, 'totalVaultUsd mora biti pozitivan');
    assert(Array.isArray(report.providers), 'providers mora biti niz');
  });

  await test('coverage ratio je između 0 i 100', () => {
    const report = buildVaultCoverageReport('cov-user-2');
    assert(report.coverageRatio >= 0 && report.coverageRatio <= 100, `coverageRatio van opsega: ${report.coverageRatio}`);
  });

  await test('ukupni covered iznos ne prelazi vault bilans', () => {
    const report = buildVaultCoverageReport('cov-user-3');
    assert(report.totalCoveredUsd <= report.totalVaultUsd, 'covered iznos ne sme biti veći od ukupnog vault bilansa');
    assert(report.uncoveredUsd >= 0, 'uncoveredUsd ne sme biti negativan');
  });

  await test('provideri imaju validne coverage podatke', () => {
    const report = buildVaultCoverageReport('cov-user-4');
    const validKinds = new Set(['internal-reserve', 'bank-guarantee', 'custody-insurance']);
    for (const provider of report.providers) {
      assert(validKinds.has(provider.kind), `Nevažeći kind: ${provider.kind}`);
      assert(provider.coveredUsd > 0, `coveredUsd mora biti pozitivan za ${provider.name}`);
      assert(Array.isArray(provider.backedAssets) && provider.backedAssets.length > 0,
        `backedAssets mora biti neprazan za ${provider.name}`);
    }
  });

  await test('coverage gap analiza je konzistentna', () => {
    const report = buildVaultCoverageReport('cov-user-5');
    if (report.uncoveredUsd === 0) {
      assert(report.gaps.length === 0, 'Ako nema uncovered iznosa, gaps mora biti prazan');
    } else {
      assert(report.gaps.length > 0, 'Ako postoji uncovered iznos, mora postojati gap zapis');
      assert(report.gaps.every((gap) => gap.uncoveredUsd > 0), 'Svaki gap mora imati pozitivan uncoveredUsd');
    }
  });

  await test('coverage timestamp je validan ISO 8601', () => {
    const report = buildVaultCoverageReport('cov-user-6');
    assert(!isNaN(Date.parse(report.timestamp)), `timestamp nije validan: ${report.timestamp}`);
  });

  // ─── buildVaultRiskReport ─────────────────────────────────────────────────────

  console.log('\n⚠️ buildVaultRiskReport');

  await test('vraća risk report za korisnika', () => {
    const report = buildVaultRiskReport('risk-user-1');
    assert(report.userId === 'risk-user-1', 'userId ne odgovara');
    assert(Number.isFinite(report.overallScore), 'overallScore mora biti broj');
    assert(Array.isArray(report.factors) && report.factors.length > 0, 'factors mora biti neprazan niz');
  });

  await test('overallScore je između 0 i 100', () => {
    const report = buildVaultRiskReport('risk-user-2');
    assert(report.overallScore >= 0 && report.overallScore <= 100, `overallScore van opsega: ${report.overallScore}`);
  });

  await test('overallLevel je validan risk level', () => {
    const report = buildVaultRiskReport('risk-user-3');
    const valid = new Set(['low', 'medium', 'high', 'critical']);
    assert(valid.has(report.overallLevel), `Nevažeći overallLevel: ${report.overallLevel}`);
  });

  await test('report ima sve očekivane kategorije rizika', () => {
    const report = buildVaultRiskReport('risk-user-4');
    const cats = new Set(report.factors.map((f) => f.category));
    const expected = ['market-risk', 'concentration-risk', 'liquidity-risk', 'custody-risk', 'counterparty-risk'];
    for (const cat of expected) {
      assert(cats.has(cat), `Nedostaje kategorija: ${cat}`);
    }
  });

  await test('svaki faktor ima validne score i level vrednosti', () => {
    const report = buildVaultRiskReport('risk-user-5');
    const validLevels = new Set(['low', 'medium', 'high', 'critical']);
    for (const f of report.factors) {
      assert(f.score >= 0 && f.score <= 100, `score van opsega za ${f.id}: ${f.score}`);
      assert(validLevels.has(f.level), `Nevažeći level za ${f.id}: ${f.level}`);
    }
  });

  await test('tier ratio-i su između 0 i 100', () => {
    const report = buildVaultRiskReport('risk-user-6');
    assert(report.hotTierRatio >= 0 && report.hotTierRatio <= 100, `hotTierRatio van opsega: ${report.hotTierRatio}`);
    assert(report.coldTierRatio >= 0 && report.coldTierRatio <= 100, `coldTierRatio van opsega: ${report.coldTierRatio}`);
  });

  await test('singleAssetMaxPct je između 0 i 100', () => {
    const report = buildVaultRiskReport('risk-user-7');
    assert(report.singleAssetMaxPct >= 0 && report.singleAssetMaxPct <= 100,
      `singleAssetMaxPct van opsega: ${report.singleAssetMaxPct}`);
  });

  await test('risk timestamp je validan ISO 8601', () => {
    const report = buildVaultRiskReport('risk-user-8');
    assert(!isNaN(Date.parse(report.timestamp)), `timestamp nije validan: ${report.timestamp}`);
  });

  // ─── buildVaultAnalyticsReport ───────────────────────────────────────────────

  console.log('\n📊 buildVaultAnalyticsReport');

  await test('vraća analytics report za korisnika', () => {
    const report = buildVaultAnalyticsReport('ana-user-1');
    assert(report.userId === 'ana-user-1', 'userId ne odgovara');
    assert(Number.isFinite(report.totalValueUsd) && report.totalValueUsd > 0, 'totalValueUsd mora biti pozitivan');
    assert(Array.isArray(report.assetPerformance) && report.assetPerformance.length > 0, 'assetPerformance mora biti neprazan niz');
  });

  await test('portfolioAprPct je između 0 i 100', () => {
    const report = buildVaultAnalyticsReport('ana-user-2');
    assert(report.portfolioAprPct >= 0 && report.portfolioAprPct <= 100,
      `portfolioAprPct van opsega: ${report.portfolioAprPct}`);
  });

  await test('tierYields pokriva sve tierove', () => {
    const report = buildVaultAnalyticsReport('ana-user-3');
    const tiers = new Set(report.tierYields.map((t) => t.tier));
    for (const tier of ['hot', 'warm', 'cold', 'deep-cold']) {
      assert(tiers.has(tier), `Nedostaje tier: ${tier}`);
    }
  });

  await test('svaki tier yield ima ne-negativan balans i APR', () => {
    const report = buildVaultAnalyticsReport('ana-user-4');
    for (const t of report.tierYields) {
      assert(t.balanceUsd >= 0, `balanceUsd negativan za ${t.tier}`);
      assert(t.estimatedAprPct >= 0, `estimatedAprPct negativan za ${t.tier}`);
      assert(t.estimatedAnnualYieldUsd >= 0, `estimatedAnnualYieldUsd negativan za ${t.tier}`);
    }
  });

  await test('asset performance ima validne price change vrednosti', () => {
    const report = buildVaultAnalyticsReport('ana-user-5');
    for (const ap of report.assetPerformance) {
      assert(ap.totalHeldUsd > 0, `totalHeldUsd mora biti pozitivan za ${ap.assetId}`);
      assert(ap.priceUsd > 0, `priceUsd mora biti pozitivan za ${ap.assetId}`);
    }
  });

  await test('totalEstimatedAnnualYieldUsd je konzistentan sa tierYields', () => {
    const report = buildVaultAnalyticsReport('ana-user-6');
    const sumYield = report.tierYields.reduce((s, t) => s + t.estimatedAnnualYieldUsd, 0);
    assert(Math.abs(report.totalEstimatedAnnualYieldUsd - sumYield) < 0.01,
      `totalEstimatedAnnualYieldUsd (${report.totalEstimatedAnnualYieldUsd}) ne odgovara sumi tierYields (${sumYield})`);
  });

  await test('topGainerAsset i topLoserAsset su validni aseti', () => {
    const report = buildVaultAnalyticsReport('ana-user-7');
    const assetIds = new Set(report.assetPerformance.map((a) => a.assetId));
    assert(assetIds.has(report.topGainerAsset) || report.topGainerAsset === 'N/A',
      `topGainerAsset nije validan: ${report.topGainerAsset}`);
    assert(assetIds.has(report.topLoserAsset) || report.topLoserAsset === 'N/A',
      `topLoserAsset nije validan: ${report.topLoserAsset}`);
  });

  await test('analytics timestamp je validan ISO 8601', () => {
    const report = buildVaultAnalyticsReport('ana-user-8');
    assert(!isNaN(Date.parse(report.timestamp)), `timestamp nije validan: ${report.timestamp}`);
  });

  // ─── buildVaultRebalanceReport ───────────────────────────────────────────────

  console.log('\n⚖️ buildVaultRebalanceReport');

  await test('vraća rebalance report za korisnika', () => {
    const report = buildVaultRebalanceReport('reb-user-1');
    assert(report.userId === 'reb-user-1', 'userId ne odgovara');
    assert(Number.isFinite(report.totalValueUsd) && report.totalValueUsd > 0, 'totalValueUsd mora biti pozitivan');
    assert(Array.isArray(report.tierAllocations) && report.tierAllocations.length === 4, 'tierAllocations mora imati 4 elementa');
  });

  await test('tierAllocations pokriva sve tierove', () => {
    const report = buildVaultRebalanceReport('reb-user-2');
    const tiers = new Set(report.tierAllocations.map((t) => t.tier));
    for (const tier of ['hot', 'warm', 'cold', 'deep-cold']) {
      assert(tiers.has(tier), `Nedostaje tier: ${tier}`);
    }
  });

  await test('currentPct zbir je blizu 100%', () => {
    const report = buildVaultRebalanceReport('reb-user-3');
    const total = report.tierAllocations.reduce((s, t) => s + t.currentPct, 0);
    assert(Math.abs(total - 100) < 1, `Zbir currentPct nije 100%: ${total}`);
  });

  await test('sugestije imaju validne from/to tierove', () => {
    const report = buildVaultRebalanceReport('reb-user-4');
    const validTiers = new Set(['hot', 'warm', 'cold', 'deep-cold']);
    for (const s of report.suggestions) {
      assert(validTiers.has(s.fromTier), `fromTier nije validan: ${s.fromTier}`);
      assert(validTiers.has(s.toTier), `toTier nije validan: ${s.toTier}`);
      assert(s.amountUsd > 0, `amountUsd mora biti pozitivan za ${s.id}`);
    }
  });

  await test('rebalanceCostEstimateUsd je ne-negativan', () => {
    const report = buildVaultRebalanceReport('reb-user-5');
    assert(report.rebalanceCostEstimateUsd >= 0,
      `rebalanceCostEstimateUsd negativan: ${report.rebalanceCostEstimateUsd}`);
  });

  await test('isBalanced je konzistentan sa suggestions', () => {
    const report = buildVaultRebalanceReport('reb-user-6');
    const expectedBalanced = report.suggestions.length === 0;
    assert(report.isBalanced === expectedBalanced,
      `isBalanced (${report.isBalanced}) nije konzistentan sa suggestions.length (${report.suggestions.length})`);
  });

  await test('sugestije imaju validne priority vrednosti', () => {
    const report = buildVaultRebalanceReport('reb-user-7');
    const validPriorities = new Set(['high', 'medium', 'low']);
    for (const s of report.suggestions) {
      assert(validPriorities.has(s.priority), `priority nije validan: ${s.priority}`);
    }
  });

  await test('rebalance timestamp je validan ISO 8601', () => {
    const report = buildVaultRebalanceReport('reb-user-8');
    assert(!isNaN(Date.parse(report.timestamp)), `timestamp nije validan: ${report.timestamp}`);
  });

  // ─── buildVaultLiquidityReport ───────────────────────────────────────────────

  console.log('\n💧 buildVaultLiquidityReport');

  await test('vraća liquidity report za korisnika', () => {
    const report = buildVaultLiquidityReport('liq-user-1');
    assert(report.userId === 'liq-user-1', 'userId ne odgovara');
    assert(Number.isFinite(report.totalValueUsd) && report.totalValueUsd > 0, 'totalValueUsd mora biti pozitivan');
    assert(Array.isArray(report.tierBreakdown) && report.tierBreakdown.length === 4, 'tierBreakdown mora imati 4 elementa');
  });

  await test('tierBreakdown pokriva sve tierove', () => {
    const report = buildVaultLiquidityReport('liq-user-2');
    const tiers = new Set(report.tierBreakdown.map((t) => t.tier));
    for (const tier of ['hot', 'warm', 'cold', 'deep-cold']) {
      assert(tiers.has(tier), `Nedostaje tier: ${tier}`);
    }
  });

  await test('sharePct zbir je blizu 100%', () => {
    const report = buildVaultLiquidityReport('liq-user-3');
    const total = report.tierBreakdown.reduce((s, t) => s + t.sharePct, 0);
    assert(Math.abs(total - 100) < 1, `Zbir sharePct nije 100%: ${total}`);
  });

  await test('withdrawal windows imaju očekivane labele i ne-negativne kapacitete', () => {
    const report = buildVaultLiquidityReport('liq-user-4');
    const labels = report.withdrawalWindows.map((w) => w.label);
    assert(labels.includes('instant') && labels.includes('24h') && labels.includes('7d'), 'Nedostaju očekivani windows');
    for (const w of report.withdrawalWindows) {
      assert(w.capacityUsd >= 0, `capacityUsd negativan za ${w.label}`);
      assert(w.coveragePct >= 0, `coveragePct negativan za ${w.label}`);
    }
  });

  await test('instantLiquidityUsd i operationalBufferUsd su konzistentni', () => {
    const report = buildVaultLiquidityReport('liq-user-5');
    assert(report.instantLiquidityUsd >= 0, 'instantLiquidityUsd mora biti ne-negativan');
    assert(report.operationalBufferUsd >= report.instantLiquidityUsd,
      'operationalBufferUsd mora biti >= instantLiquidityUsd');
  });

  await test('liquidityScore je u opsegu 0-100', () => {
    const report = buildVaultLiquidityReport('liq-user-6');
    assert(report.liquidityScore >= 0 && report.liquidityScore <= 100,
      `liquidityScore van opsega: ${report.liquidityScore}`);
  });

  await test('instant <= 24h <= 7d kapacitet', () => {
    const report = buildVaultLiquidityReport('liq-user-7');
    const instant = report.withdrawalWindows.find((w) => w.label === 'instant')?.capacityUsd ?? 0;
    const day1 = report.withdrawalWindows.find((w) => w.label === '24h')?.capacityUsd ?? 0;
    const day7 = report.withdrawalWindows.find((w) => w.label === '7d')?.capacityUsd ?? 0;
    assert(instant <= day1 && day1 <= day7, `Kapaciteti nisu monotoni: instant=${instant}, 24h=${day1}, 7d=${day7}`);
  });

  await test('liquidity timestamp je validan ISO 8601', () => {
    const report = buildVaultLiquidityReport('liq-user-8');
    assert(!isNaN(Date.parse(report.timestamp)), `timestamp nije validan: ${report.timestamp}`);
  });

  // ─── buildVaultForecastReport ─────────────────────────────────────────────────

  console.log('\n📈 buildVaultForecastReport');

  await test('vraća forecast report za korisnika (podrazumevani horizont 90d)', () => {
    const report = buildVaultForecastReport('frc-user-1');
    assert(report.userId === 'frc-user-1', 'userId ne odgovara');
    assert(report.horizon === '90d', `horizont mora biti 90d, dobijen: ${report.horizon}`);
    assert(report.horizonDays === 90, `horizonDays mora biti 90, dobijen: ${report.horizonDays}`);
    assert(Number.isFinite(report.currentValueUsd) && report.currentValueUsd > 0, 'currentValueUsd mora biti pozitivan');
  });

  await test('svi scenariji su prisutni i imaju konzistentne vrednosti', () => {
    const report = buildVaultForecastReport('frc-user-2');
    for (const sc of [report.baseScenario, report.bullScenario, report.bearScenario]) {
      assert(Number.isFinite(sc.aprPct) && sc.aprPct >= 0, `aprPct mora biti ne-negativan za ${sc.scenario}`);
      assert(Number.isFinite(sc.endValueUsd) && sc.endValueUsd > 0, `endValueUsd mora biti pozitivan za ${sc.scenario}`);
      assert(Array.isArray(sc.dataPoints) && sc.dataPoints.length > 0, `dataPoints mora biti neprazan za ${sc.scenario}`);
    }
  });

  await test('bull endValue >= base endValue >= bear endValue', () => {
    const report = buildVaultForecastReport('frc-user-3');
    assert(report.bullScenario.endValueUsd >= report.baseScenario.endValueUsd,
      `bull (${report.bullScenario.endValueUsd}) mora biti >= base (${report.baseScenario.endValueUsd})`);
    assert(report.baseScenario.endValueUsd >= report.bearScenario.endValueUsd,
      `base (${report.baseScenario.endValueUsd}) mora biti >= bear (${report.bearScenario.endValueUsd})`);
  });

  await test('data points imaju monotono rastuće cumulative yield vrednosti', () => {
    const report = buildVaultForecastReport('frc-user-4');
    const pts = report.baseScenario.dataPoints;
    for (let i = 1; i < pts.length; i++) {
      assert(pts[i].cumulativeYieldUsd >= pts[i - 1].cumulativeYieldUsd,
        `cumulativeYieldUsd nije monotono rastući na indeksu ${i}`);
    }
  });

  await test('forecast radi za horizont 30d', () => {
    const report = buildVaultForecastReport('frc-user-5', '30d');
    assert(report.horizon === '30d', `horizont mora biti 30d`);
    assert(report.horizonDays === 30, `horizonDays mora biti 30`);
    assert(report.baseScenario.dataPoints.length > 0, 'mora imati data points');
  });

  await test('forecast radi za horizont 365d', () => {
    const report = buildVaultForecastReport('frc-user-6', '365d');
    assert(report.horizon === '365d', `horizont mora biti 365d`);
    assert(report.horizonDays === 365, `horizonDays mora biti 365`);
    assert(report.baseScenario.dataPoints.length > 0, 'mora imati data points');
    assert(report.baseScenario.dataPoints.length >= report.bullScenario.dataPoints.length,
      'base i bull scenariji moraju imati isti broj data points');
  });

  await test('assumptions je neprazan niz stringova', () => {
    const report = buildVaultForecastReport('frc-user-7');
    assert(Array.isArray(report.assumptions) && report.assumptions.length > 0, 'assumptions mora biti neprazan niz');
    for (const a of report.assumptions) {
      assert(typeof a === 'string' && a.length > 0, 'svaka pretpostavka mora biti neprazan string');
    }
  });

  await test('forecast timestamp je validan ISO 8601', () => {
    const report = buildVaultForecastReport('frc-user-8');
    assert(!isNaN(Date.parse(report.timestamp)), `timestamp nije validan: ${report.timestamp}`);
  });

  // ─── buildVaultStressReport ───────────────────────────────────────────────────

  console.log('\n🔥 buildVaultStressReport');

  await test('vraća stress report za korisnika', () => {
    const report = buildVaultStressReport('str-user-1');
    assert(report.userId === 'str-user-1', 'userId ne odgovara');
    assert(Number.isFinite(report.baselineValueUsd) && report.baselineValueUsd > 0, 'baselineValueUsd mora biti pozitivan');
    assert(Array.isArray(report.scenarios) && report.scenarios.length === 3, 'mora postojati 3 stress scenarija');
  });

  await test('stress scenariji imaju očekivane id vrednosti', () => {
    const report = buildVaultStressReport('str-user-2');
    const ids = new Set(report.scenarios.map((s) => s.id));
    for (const id of ['flash-crash', 'liquidity-freeze', 'custody-incident']) {
      assert(ids.has(id), `nedostaje scenario ${id}`);
    }
  });

  await test('drawdown i projected value su konzistentni', () => {
    const report = buildVaultStressReport('str-user-3');
    for (const s of report.scenarios) {
      assert(s.estimatedDrawdownUsd >= 0, 'drawdown mora biti ne-negativan');
      assert(s.projectedValueUsd >= 0, 'projectedValueUsd mora biti ne-negativan');
      assert(s.projectedValueUsd <= report.baselineValueUsd, 'projectedValueUsd ne sme preći baseline');
    }
  });

  await test('projected coverage i liquidity score su u opsegu 0-100', () => {
    const report = buildVaultStressReport('str-user-4');
    for (const s of report.scenarios) {
      assert(s.projectedCoveragePct >= 0 && s.projectedCoveragePct <= 100,
        `projectedCoveragePct van opsega za ${s.id}: ${s.projectedCoveragePct}`);
      assert(s.projectedLiquidityScore >= 0 && s.projectedLiquidityScore <= 100,
        `projectedLiquidityScore van opsega za ${s.id}: ${s.projectedLiquidityScore}`);
    }
  });

  await test('worstScenarioId odgovara scenariju sa najmanjom projectedValueUsd', () => {
    const report = buildVaultStressReport('str-user-5');
    const sorted = [...report.scenarios].sort((a, b) => a.projectedValueUsd - b.projectedValueUsd);
    assert(report.worstScenarioId === sorted[0].id, 'worstScenarioId nije konzistentan');
  });

  await test('resilienceScore je u opsegu 0-100', () => {
    const report = buildVaultStressReport('str-user-6');
    assert(report.resilienceScore >= 0 && report.resilienceScore <= 100,
      `resilienceScore van opsega: ${report.resilienceScore}`);
  });

  await test('recommendations je neprazan niz', () => {
    const report = buildVaultStressReport('str-user-7');
    assert(Array.isArray(report.recommendations) && report.recommendations.length > 0,
      'recommendations mora biti neprazan niz');
    for (const rec of report.recommendations) {
      assert(typeof rec === 'string' && rec.length > 0, 'preporuka mora biti neprazan string');
    }
  });

  await test('stress timestamp je validan ISO 8601', () => {
    const report = buildVaultStressReport('str-user-8');
    assert(!isNaN(Date.parse(report.timestamp)), `timestamp nije validan: ${report.timestamp}`);
  });

  // ─── buildVaultResilienceReport ───────────────────────────────────────────────

  console.log('\n🧭 buildVaultResilienceReport');

  await test('vraća resilience report za korisnika', () => {
    const report = buildVaultResilienceReport('rsl-user-1');
    assert(report.userId === 'rsl-user-1', 'userId ne odgovara');
    assert(Number.isFinite(report.overallScore), 'overallScore mora biti broj');
    assert(['strong', 'watch', 'critical'].includes(report.status), 'status nije validan');
  });

  await test('overallScore je u opsegu 0-100', () => {
    const report = buildVaultResilienceReport('rsl-user-2');
    assert(report.overallScore >= 0 && report.overallScore <= 100,
      `overallScore van opsega: ${report.overallScore}`);
  });

  await test('komponente pokrivaju coverage, liquidity, stress i risk-mitigation', () => {
    const report = buildVaultResilienceReport('rsl-user-3');
    const ids = new Set(report.components.map((c) => c.id));
    for (const id of ['coverage', 'liquidity', 'stress', 'risk-mitigation']) {
      assert(ids.has(id), `nedostaje komponenta ${id}`);
    }
    assert(report.components.length === 4, 'mora biti tačno 4 komponente');
  });

  await test('sve komponente imaju score u opsegu 0-100', () => {
    const report = buildVaultResilienceReport('rsl-user-4');
    for (const c of report.components) {
      assert(c.score >= 0 && c.score <= 100, `score van opsega za ${c.id}: ${c.score}`);
    }
  });

  await test('stressPassRatePct je u opsegu 0-100', () => {
    const report = buildVaultResilienceReport('rsl-user-5');
    assert(report.stressPassRatePct >= 0 && report.stressPassRatePct <= 100,
      `stressPassRatePct van opsega: ${report.stressPassRatePct}`);
  });

  await test('hardeningActions je neprazan niz stringova', () => {
    const report = buildVaultResilienceReport('rsl-user-6');
    assert(Array.isArray(report.hardeningActions) && report.hardeningActions.length > 0,
      'hardeningActions mora biti neprazan niz');
    for (const action of report.hardeningActions) {
      assert(typeof action === 'string' && action.length > 0, 'svaka akcija mora biti neprazan string');
    }
  });

  await test('resilience timestamp je validan ISO 8601', () => {
    const report = buildVaultResilienceReport('rsl-user-7');
    assert(!isNaN(Date.parse(report.timestamp)), `timestamp nije validan: ${report.timestamp}`);
  });

  // ─── buildVaultBenchmarkReport ───────────────────────────────────────────────

  console.log('\n📊 buildVaultBenchmarkReport');

  await test('vraća benchmark report za korisnika', () => {
    const report = buildVaultBenchmarkReport('bmk-user-1');
    assert(report.userId === 'bmk-user-1', 'userId ne odgovara');
    assert(Number.isFinite(report.vaultAprPct) && report.vaultAprPct >= 0, 'vaultAprPct mora biti ne-negativan');
    assert(Array.isArray(report.benchmarks) && report.benchmarks.length === 3, 'mora biti 3 benchmark-a');
  });

  await test('komparacije pokrivaju sve benchmark-e', () => {
    const report = buildVaultBenchmarkReport('bmk-user-2');
    const ids = new Set(report.comparisons.map((c) => c.benchmarkId));
    for (const id of ['BTC', 'ETH', 'crypto-market-index']) {
      assert(ids.has(id), `nedostaje komparacija za ${id}`);
    }
    assert(report.comparisons.length === 3, 'mora biti tačno 3 komparacije');
  });

  await test('alpha je konzistentan sa outperforms zastavicom', () => {
    const report = buildVaultBenchmarkReport('bmk-user-3');
    for (const c of report.comparisons) {
      const expectedOutperforms = c.alphaPct > 0;
      assert(c.outperforms === expectedOutperforms,
        `outperforms nije konzistentan sa alphaPct za ${c.benchmarkId}`);
    }
  });

  await test('outperformsCount odgovara broju komparacija sa pozitivnom alpha', () => {
    const report = buildVaultBenchmarkReport('bmk-user-4');
    const expected = report.comparisons.filter((c) => c.outperforms).length;
    assert(report.outperformsCount === expected,
      `outperformsCount nije konzistentan: ${report.outperformsCount} vs ${expected}`);
  });

  await test('period returnovi su konzistentni (7d <= 365d)', () => {
    const report = buildVaultBenchmarkReport('bmk-user-5');
    assert(report.vaultReturn7dPct <= report.vaultReturn365dPct,
      `vaultReturn7dPct (${report.vaultReturn7dPct}) mora biti <= vaultReturn365dPct (${report.vaultReturn365dPct})`);
  });

  await test('bestBenchmark i worstBenchmark su validni benchmark ID-ovi', () => {
    const report = buildVaultBenchmarkReport('bmk-user-6');
    const validIds = ['BTC', 'ETH', 'crypto-market-index'];
    assert(validIds.includes(report.bestBenchmark), `bestBenchmark nije validan: ${report.bestBenchmark}`);
    assert(validIds.includes(report.worstBenchmark), `worstBenchmark nije validan: ${report.worstBenchmark}`);
  });

  await test('insights je neprazan niz stringova', () => {
    const report = buildVaultBenchmarkReport('bmk-user-7');
    assert(Array.isArray(report.insights) && report.insights.length > 0, 'insights mora biti neprazan niz');
    for (const ins of report.insights) {
      assert(typeof ins === 'string' && ins.length > 0, 'svaki insight mora biti neprazan string');
    }
  });

  await test('benchmark timestamp je validan ISO 8601', () => {
    const report = buildVaultBenchmarkReport('bmk-user-8');
    assert(!isNaN(Date.parse(report.timestamp)), `timestamp nije validan: ${report.timestamp}`);
  });

  // ─── buildVaultAttributionReport ────────────────────────────────────────────

  console.log('\n🧩 buildVaultAttributionReport');

  await test('vraća attribution report za korisnika', () => {
    const report = buildVaultAttributionReport('att-user-1');
    assert(report.userId === 'att-user-1', 'userId ne odgovara');
    assert(Number.isFinite(report.totalValueUsd) && report.totalValueUsd >= 0, 'totalValueUsd mora biti ne-negativan');
    assert(Number.isFinite(report.totalAnnualYieldUsd) && report.totalAnnualYieldUsd >= 0, 'totalAnnualYieldUsd mora biti ne-negativan');
  });

  await test('assetAttribution i tierAttribution nisu prazni', () => {
    const report = buildVaultAttributionReport('att-user-2');
    assert(Array.isArray(report.assetAttribution) && report.assetAttribution.length > 0, 'assetAttribution ne sme biti prazan');
    assert(Array.isArray(report.tierAttribution) && report.tierAttribution.length > 0, 'tierAttribution ne sme biti prazan');
  });

  await test('topAssetContributor postoji u asset attribution listi', () => {
    const report = buildVaultAttributionReport('att-user-3');
    const keys = new Set(report.assetAttribution.map((slice) => slice.key));
    assert(keys.has(report.topAssetContributor), `topAssetContributor nije prisutan: ${report.topAssetContributor}`);
  });

  await test('topTierContributor je validan tier', () => {
    const report = buildVaultAttributionReport('att-user-4');
    assert(['hot', 'warm', 'cold', 'deep-cold'].includes(report.topTierContributor),
      `topTierContributor nije validan: ${report.topTierContributor}`);
  });

  await test('concentrationRisk je validna vrednost', () => {
    const report = buildVaultAttributionReport('att-user-5');
    assert(['low', 'watch', 'high'].includes(report.concentrationRisk),
      `concentrationRisk nije validan: ${report.concentrationRisk}`);
  });

  await test('svaka attribution stavka ima validne numeričke vrednosti', () => {
    const report = buildVaultAttributionReport('att-user-6');
    const all = [...report.assetAttribution, ...report.tierAttribution];
    for (const slice of all) {
      assert(Number.isFinite(slice.valueUsd) && slice.valueUsd >= 0, `valueUsd nije validan za ${slice.key}`);
      assert(Number.isFinite(slice.weightPct) && slice.weightPct >= 0, `weightPct nije validan za ${slice.key}`);
      assert(Number.isFinite(slice.annualYieldUsd), `annualYieldUsd nije validan za ${slice.key}`);
      assert(Number.isFinite(slice.contributionPct), `contributionPct nije validan za ${slice.key}`);
    }
  });

  await test('insights je neprazan niz stringova', () => {
    const report = buildVaultAttributionReport('att-user-7');
    assert(Array.isArray(report.insights) && report.insights.length > 0, 'insights mora biti neprazan niz');
    for (const insight of report.insights) {
      assert(typeof insight === 'string' && insight.length > 0, 'insight mora biti neprazan string');
    }
  });

  await test('attribution timestamp je validan ISO 8601', () => {
    const report = buildVaultAttributionReport('att-user-8');
    assert(!isNaN(Date.parse(report.timestamp)), `timestamp nije validan: ${report.timestamp}`);
  });

  // ─── buildVaultExposureReport ───────────────────────────────────────────────

  console.log('\n🌐 buildVaultExposureReport');

  await test('vraća exposure report za korisnika', () => {
    const report = buildVaultExposureReport('exp-user-1');
    assert(report.userId === 'exp-user-1', 'userId ne odgovara');
    assert(Number.isFinite(report.totalValueUsd) && report.totalValueUsd >= 0, 'totalValueUsd mora biti ne-negativan');
  });

  await test('assetExposure i tierExposure nisu prazni', () => {
    const report = buildVaultExposureReport('exp-user-2');
    assert(Array.isArray(report.assetExposure) && report.assetExposure.length > 0, 'assetExposure ne sme biti prazan');
    assert(Array.isArray(report.tierExposure) && report.tierExposure.length > 0, 'tierExposure ne sme biti prazan');
  });

  await test('dominantAsset postoji u asset exposure listi', () => {
    const report = buildVaultExposureReport('exp-user-3');
    const ids = new Set(report.assetExposure.map((slice) => slice.assetId));
    assert(ids.has(report.dominantAsset), `dominantAsset nije prisutan: ${report.dominantAsset}`);
  });

  await test('dominantTier je validan tier', () => {
    const report = buildVaultExposureReport('exp-user-4');
    assert(['hot', 'warm', 'cold', 'deep-cold'].includes(report.dominantTier),
      `dominantTier nije validan: ${report.dominantTier}`);
  });

  await test('procenti exposure-a su u validnom opsegu', () => {
    const report = buildVaultExposureReport('exp-user-5');
    assert(report.instantExposurePct >= 0 && report.instantExposurePct <= 100,
      `instantExposurePct nije validan: ${report.instantExposurePct}`);
    assert(report.lockedExposurePct >= 0 && report.lockedExposurePct <= 100,
      `lockedExposurePct nije validan: ${report.lockedExposurePct}`);
  });

  await test('concentrationRisk je validna vrednost', () => {
    const report = buildVaultExposureReport('exp-user-6');
    assert(['low', 'watch', 'high'].includes(report.concentrationRisk),
      `concentrationRisk nije validan: ${report.concentrationRisk}`);
  });

  await test('mitigationActions je neprazan niz stringova', () => {
    const report = buildVaultExposureReport('exp-user-7');
    assert(Array.isArray(report.mitigationActions) && report.mitigationActions.length > 0,
      'mitigationActions mora biti neprazan niz');
    for (const action of report.mitigationActions) {
      assert(typeof action === 'string' && action.length > 0, 'svaka akcija mora biti neprazan string');
    }
  });

  await test('exposure timestamp je validan ISO 8601', () => {
    const report = buildVaultExposureReport('exp-user-8');
    assert(!isNaN(Date.parse(report.timestamp)), `timestamp nije validan: ${report.timestamp}`);
  });

  // ─── buildVaultAllocationReport ─────────────────────────────────────────────

  console.log('\n🎯 buildVaultAllocationReport');

  await test('vraća allocation report za korisnika', () => {
    const report = buildVaultAllocationReport('alloc-user-1');
    assert(report.userId === 'alloc-user-1', 'userId ne odgovara');
    assert(Number.isFinite(report.totalValueUsd) && report.totalValueUsd >= 0, 'totalValueUsd mora biti ne-negativan');
    assert(Number.isFinite(report.totalAnnualYieldUsd) && report.totalAnnualYieldUsd >= 0, 'totalAnnualYieldUsd mora biti ne-negativan');
  });

  await test('assetAllocations i tierAllocations nisu prazni', () => {
    const report = buildVaultAllocationReport('alloc-user-2');
    assert(Array.isArray(report.assetAllocations) && report.assetAllocations.length > 0, 'assetAllocations ne sme biti prazan');
    assert(Array.isArray(report.tierAllocations) && report.tierAllocations.length > 0, 'tierAllocations ne sme biti prazan');
  });

  await test('mostOverweightAsset i mostUnderweightAsset postoje u asset allocation listi', () => {
    const report = buildVaultAllocationReport('alloc-user-3');
    const ids = new Set(report.assetAllocations.map((asset) => asset.assetId));
    assert(ids.has(report.mostOverweightAsset), `mostOverweightAsset nije prisutan: ${report.mostOverweightAsset}`);
    assert(ids.has(report.mostUnderweightAsset), `mostUnderweightAsset nije prisutan: ${report.mostUnderweightAsset}`);
  });

  await test('svaka asset allocation stavka ima validne procente', () => {
    const report = buildVaultAllocationReport('alloc-user-4');
    for (const asset of report.assetAllocations) {
      assert(Number.isFinite(asset.currentPct) && asset.currentPct >= 0 && asset.currentPct <= 100,
        `currentPct nije validan za ${asset.assetId}`);
      assert(Number.isFinite(asset.targetPct) && asset.targetPct >= 0 && asset.targetPct <= 100,
        `targetPct nije validan za ${asset.assetId}`);
      assert(Number.isFinite(asset.deviationPct), `deviationPct nije validan za ${asset.assetId}`);
    }
  });

  await test('tierAllocations pokriva sve tierove', () => {
    const report = buildVaultAllocationReport('alloc-user-5');
    const tiers = new Set(report.tierAllocations.map((tier) => tier.tier));
    for (const tier of ['hot', 'warm', 'cold', 'deep-cold']) {
      assert(tiers.has(tier), `nedostaje tier ${tier}`);
    }
  });

  await test('suggestedShiftUsd je ne-negativan', () => {
    const report = buildVaultAllocationReport('alloc-user-6');
    assert(Number.isFinite(report.suggestedShiftUsd) && report.suggestedShiftUsd >= 0,
      `suggestedShiftUsd nije validan: ${report.suggestedShiftUsd}`);
  });

  await test('actions je neprazan niz stringova', () => {
    const report = buildVaultAllocationReport('alloc-user-7');
    assert(Array.isArray(report.actions) && report.actions.length > 0, 'actions mora biti neprazan niz');
    for (const action of report.actions) {
      assert(typeof action === 'string' && action.length > 0, 'svaka action mora biti neprazan string');
    }
  });

  await test('allocation timestamp je validan ISO 8601', () => {
    const report = buildVaultAllocationReport('alloc-user-8');
    assert(!isNaN(Date.parse(report.timestamp)), `timestamp nije validan: ${report.timestamp}`);
  });

  // ─── Rezime ──────────────────────────────────────────────────────────────

  console.log(`\n─── Kripto Trezor: ${passed} prošlo, ${failed} palo ───`);
  if (failures.length > 0) {
    console.error('\nNeuspeli testovi:');
    failures.forEach((f) => console.error(`  - ${f}`));
  }

  if (failed > 0) process.exit(1);
}

runTests().catch((e) => {
  console.error('Fatalna greška u test suite:', e);
  process.exit(1);
});
