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
