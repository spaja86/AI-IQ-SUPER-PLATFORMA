// SpajaUltraOmegaCore -∞Ω+∞ — SPAJA Kripto Trezor (domain logic)
// Kompanija SPAJA — Digitalna Industrija
//
// Kripto Trezor je custody/vault sloj iznad AI IQ Menjačnice i Pro Novčanika.
// Pruža:
//   - Vault naloge (cold storage, multi-sig, hardware-wallet simulacija)
//   - Vault depozit: korisnik "zaključava" sredstva u trezor
//   - Vault isplata: zahteva dodatne sigurnosne potvrde (time-lock, multi-sig)
//   - Sigurnosni nivo po asetu: hot / warm / cold / deep-cold
//   - Provjera limita i whitelisted adresa

import { roundLedger } from '../novcanik/ledger';

// ─── Tipovi ───────────────────────────────────────────────────────────────────

export type VaultTier = 'hot' | 'warm' | 'cold' | 'deep-cold';
export type VaultDepositStatus = 'pending' | 'confirming' | 'locked' | 'failed';
export type VaultWithdrawStatus =
  | 'pending'
  | 'time-lock'
  | 'multi-sig-required'
  | 'approved'
  | 'broadcasting'
  | 'completed'
  | 'rejected';

export interface VaultAccount {
  id: string;
  userId: string;
  assetId: string;
  tier: VaultTier;
  locked: number;
  unlocking: number;
  available: number;
  whitelistedAddresses: string[];
  multiSigThreshold: number;
  timeLockDays: number;
  lastAuditAt: string;
  enabled: boolean;
  createdAt: string;
}

export interface VaultDeposit {
  id: string;
  idempotencyKey: string;
  userId: string;
  assetId: string;
  amount: number;
  sourceTier: 'exchange' | 'novcanik' | 'external';
  targetTier: VaultTier;
  status: VaultDepositStatus;
  txHash?: string;
  confirmations: number;
  requiredConfirmations: number;
  createdAt: string;
  updatedAt: string;
}

export interface VaultWithdrawal {
  id: string;
  idempotencyKey: string;
  userId: string;
  assetId: string;
  amount: number;
  destinationAddress: string;
  sourceTier: VaultTier;
  destinationTier: 'exchange' | 'novcanik' | 'external';
  status: VaultWithdrawStatus;
  timeLockExpiresAt?: string;
  multiSigSignaturesCollected: number;
  multiSigThreshold: number;
  txHash?: string;
  rejectReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VaultDepositRequest {
  assetId: string;
  amount: number;
  sourceTier?: 'exchange' | 'novcanik' | 'external';
  targetTier?: VaultTier;
  idempotencyKey?: string;
}

export interface VaultWithdrawRequest {
  assetId: string;
  amount: number;
  destinationAddress: string;
  destinationTier?: 'exchange' | 'novcanik' | 'external';
  idempotencyKey?: string;
}

export interface VaultStatusReport {
  userId: string;
  accounts: VaultAccount[];
  totalLockedUsd: number;
  totalUnlockingUsd: number;
  totalAvailableUsd: number;
  securityScore: number;
  lastAuditAt: string;
  timestamp: string;
}

export type VaultAuditSeverity = 'info' | 'warning' | 'critical';
export type VaultAuditEventType =
  | 'deposit_initiated'
  | 'deposit_locked'
  | 'withdraw_initiated'
  | 'withdraw_time_lock_started'
  | 'withdraw_approved'
  | 'withdraw_rejected'
  | 'policy_updated'
  | 'whitelist_updated'
  | 'security_check';

export interface VaultAuditEvent {
  id: string;
  userId: string;
  assetId: string;
  tier: VaultTier;
  type: VaultAuditEventType;
  severity: VaultAuditSeverity;
  message: string;
  actor: 'user' | 'system' | 'compliance' | 'security-bot';
  createdAt: string;
}

export type VaultSecurityCheckStatus = 'ok' | 'warning' | 'critical';
export type VaultSecurityCheckKind =
  | 'cold-storage-ratio'
  | 'multi-sig-policy'
  | 'time-lock-policy'
  | 'whitelist-hygiene'
  | 'audit-freshness';

export interface VaultSecurityCheckItem {
  id: string;
  kind: VaultSecurityCheckKind;
  status: VaultSecurityCheckStatus;
  score: number;
  detail: string;
}

export interface VaultSecurityCheckAlert {
  id: string;
  severity: 'medium' | 'high';
  title: string;
  detail: string;
}

export interface VaultSecurityCheckReport {
  userId: string;
  overallScore: number;
  checks: VaultSecurityCheckItem[];
  alerts: VaultSecurityCheckAlert[];
  recommendedActions: string[];
  timestamp: string;
}

// ─── Konstante ────────────────────────────────────────────────────────────────

/** Minimalni iznos za vault depozit po tieru. */
export const VAULT_MIN_DEPOSIT: Record<VaultTier, number> = {
  hot: 0.001,
  warm: 0.01,
  cold: 0.1,
  'deep-cold': 1.0,
};

/** Time-lock trajanje u danima po tieru. */
export const VAULT_TIME_LOCK_DAYS: Record<VaultTier, number> = {
  hot: 0,
  warm: 1,
  cold: 3,
  'deep-cold': 7,
};

/** Multi-sig prag po tieru (koliko potpisa treba). */
export const VAULT_MULTISIG_THRESHOLD: Record<VaultTier, number> = {
  hot: 1,
  warm: 2,
  cold: 3,
  'deep-cold': 5,
};

// ─── Validacija ───────────────────────────────────────────────────────────────

export interface VaultValidationResult {
  valid: boolean;
  reason?: string;
}

/** Validira iznos vault depozita za dati tier. */
export function validateVaultDepositAmount(
  amount: number,
  tier: VaultTier,
): VaultValidationResult {
  if (!Number.isFinite(amount) || amount <= 0) {
    return { valid: false, reason: 'Iznos mora biti pozitivan konačan broj.' };
  }
  const min = VAULT_MIN_DEPOSIT[tier];
  if (amount < min) {
    return { valid: false, reason: `Minimalni iznos za ${tier} tier je ${min}.` };
  }
  if (amount > 1e9) {
    return { valid: false, reason: 'Iznos premašuje maksimalnu granicu trezora.' };
  }
  return { valid: true };
}

/** Provjera da li je adresa u whitelist-u naloga. */
export function isAddressWhitelisted(account: VaultAccount, address: string): boolean {
  return account.whitelistedAddresses.includes(address);
}

/** Određuje da li isplata iz vault-a zahteva time-lock. */
export function requiresTimeLock(tier: VaultTier): boolean {
  return VAULT_TIME_LOCK_DAYS[tier] > 0;
}

/** Određuje da li isplata zahteva multi-sig. */
export function requiresMultiSig(tier: VaultTier): boolean {
  return VAULT_MULTISIG_THRESHOLD[tier] > 1;
}

/** Izračunava datum isteka time-lock-a za isplatu. */
export function calcTimeLockExpiry(tier: VaultTier, fromDate = new Date()): Date {
  const days = VAULT_TIME_LOCK_DAYS[tier];
  const expiry = new Date(fromDate.getTime());
  expiry.setDate(expiry.getDate() + days);
  return expiry;
}

// ─── Simulovani Vault Status ──────────────────────────────────────────────────

/** Simulovane cene po asetu u USD (za vrednost trezora). */
const VAULT_ASSET_PRICES_USD: Record<string, number> = {
  BTC:   67_000,
  ETH:    3_500,
  SOL:      160,
  USDT:     1.0,
  SPAJA: 670_000, // SPAJA = 10× BTC
};

function assetPriceUsd(assetId: string): number {
  return VAULT_ASSET_PRICES_USD[assetId] ?? 1;
}

/** Gradi simulovani vault status report za korisnika. */
export function buildVaultStatusReport(userId: string): VaultStatusReport {
  const now = new Date().toISOString();

  const accounts: VaultAccount[] = [
    {
      id: `vault-${userId}-spaja-cold`,
      userId,
      assetId: 'SPAJA',
      tier: 'cold',
      locked: 1.2,
      unlocking: 0,
      available: 0,
      whitelistedAddresses: ['0xSpajaVaultCold01', '0xSpajaVaultCold02'],
      multiSigThreshold: VAULT_MULTISIG_THRESHOLD['cold'],
      timeLockDays: VAULT_TIME_LOCK_DAYS['cold'],
      lastAuditAt: '2026-05-01T12:00:00.000Z',
      enabled: true,
      createdAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: `vault-${userId}-btc-deep-cold`,
      userId,
      assetId: 'BTC',
      tier: 'deep-cold',
      locked: 0.25,
      unlocking: 0.01,
      available: 0,
      whitelistedAddresses: ['bc1qVaultMain01', 'bc1qVaultBackup01'],
      multiSigThreshold: VAULT_MULTISIG_THRESHOLD['deep-cold'],
      timeLockDays: VAULT_TIME_LOCK_DAYS['deep-cold'],
      lastAuditAt: '2026-04-28T09:00:00.000Z',
      enabled: true,
      createdAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: `vault-${userId}-eth-warm`,
      userId,
      assetId: 'ETH',
      tier: 'warm',
      locked: 5.0,
      unlocking: 0.5,
      available: 0.2,
      whitelistedAddresses: ['0xEthVaultWarm01'],
      multiSigThreshold: VAULT_MULTISIG_THRESHOLD['warm'],
      timeLockDays: VAULT_TIME_LOCK_DAYS['warm'],
      lastAuditAt: '2026-05-10T14:30:00.000Z',
      enabled: true,
      createdAt: '2026-02-15T00:00:00.000Z',
    },
    {
      id: `vault-${userId}-usdt-hot`,
      userId,
      assetId: 'USDT',
      tier: 'hot',
      locked: 10_000,
      unlocking: 0,
      available: 2_500,
      whitelistedAddresses: [],
      multiSigThreshold: VAULT_MULTISIG_THRESHOLD['hot'],
      timeLockDays: VAULT_TIME_LOCK_DAYS['hot'],
      lastAuditAt: '2026-05-11T00:00:00.000Z',
      enabled: true,
      createdAt: '2026-03-01T00:00:00.000Z',
    },
  ];

  let totalLockedUsd = 0;
  let totalUnlockingUsd = 0;
  let totalAvailableUsd = 0;

  for (const acc of accounts) {
    const price = assetPriceUsd(acc.assetId);
    totalLockedUsd += acc.locked * price;
    totalUnlockingUsd += acc.unlocking * price;
    totalAvailableUsd += acc.available * price;
  }

  // Security score: ponderisan prema udelu cold/deep-cold u ukupnoj vrednosti
  const coldLockedUsd = accounts
    .filter((a) => a.tier === 'cold' || a.tier === 'deep-cold')
    .reduce((s, a) => s + a.locked * assetPriceUsd(a.assetId), 0);
  const totalAllUsd = totalLockedUsd + totalUnlockingUsd + totalAvailableUsd;
  const securityScore = totalAllUsd > 0
    ? Math.round((coldLockedUsd / totalAllUsd) * 100)
    : 0;

  return {
    userId,
    accounts,
    totalLockedUsd: roundLedger(totalLockedUsd),
    totalUnlockingUsd: roundLedger(totalUnlockingUsd),
    totalAvailableUsd: roundLedger(totalAvailableUsd),
    securityScore,
    lastAuditAt: '2026-05-11T00:00:00.000Z',
    timestamp: now,
  };
}

// ─── Simulovani Depozit ───────────────────────────────────────────────────────

/** Kreira simulovani vault depozit zapis (bez DB upisa). */
export function buildVaultDepositRecord(
  userId: string,
  req: VaultDepositRequest,
): VaultDeposit {
  const tier: VaultTier = req.targetTier ?? 'cold';
  const now = new Date().toISOString();
  const requiredConfirmations = tier === 'hot' ? 1 : tier === 'warm' ? 3 : 6;

  return {
    id: `vdep-${userId}-${Date.now()}`,
    idempotencyKey: req.idempotencyKey ?? `vdep-auto-${Date.now()}`,
    userId,
    assetId: req.assetId,
    amount: req.amount,
    sourceTier: req.sourceTier ?? 'novcanik',
    targetTier: tier,
    status: 'pending',
    confirmations: 0,
    requiredConfirmations,
    createdAt: now,
    updatedAt: now,
  };
}

// ─── Simulovana Isplata ───────────────────────────────────────────────────────

/** Kreira simulovani vault withdrawal zapis (bez DB upisa). */
export function buildVaultWithdrawalRecord(
  userId: string,
  req: VaultWithdrawRequest,
  sourceTier: VaultTier = 'cold',
): VaultWithdrawal {
  const now = new Date();
  const needsTimeLock = requiresTimeLock(sourceTier);
  const threshold = VAULT_MULTISIG_THRESHOLD[sourceTier];
  const timeLockExpiresAt = needsTimeLock
    ? calcTimeLockExpiry(sourceTier, now).toISOString()
    : undefined;
  const initialStatus: VaultWithdrawStatus = needsTimeLock ? 'time-lock' : 'multi-sig-required';

  return {
    id: `vwit-${userId}-${now.getTime()}`,
    idempotencyKey: req.idempotencyKey ?? `vwit-auto-${now.getTime()}`,
    userId,
    assetId: req.assetId,
    amount: req.amount,
    destinationAddress: req.destinationAddress,
    sourceTier,
    destinationTier: req.destinationTier ?? 'novcanik',
    status: initialStatus,
    timeLockExpiresAt,
    multiSigSignaturesCollected: 0,
    multiSigThreshold: threshold,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
}

/** Simulira audit log događaje za Kripto Trezor (najnoviji prvi). */
export function buildVaultAuditLog(userId: string, limit = 20): VaultAuditEvent[] {
  const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(Math.trunc(limit), 1), 100) : 20;
  const baseEvents: VaultAuditEvent[] = [
    {
      id: `vaud-${userId}-001`,
      userId,
      assetId: 'BTC',
      tier: 'deep-cold',
      type: 'security_check',
      severity: 'info',
      message: 'Periodični sigurnosni sken završen bez anomalija.',
      actor: 'security-bot',
      createdAt: '2026-05-11T19:45:00.000Z',
    },
    {
      id: `vaud-${userId}-002`,
      userId,
      assetId: 'ETH',
      tier: 'warm',
      type: 'withdraw_rejected',
      severity: 'warning',
      message: 'Isplata odbijena: adresa nije na whitelist listi.',
      actor: 'compliance',
      createdAt: '2026-05-11T18:10:00.000Z',
    },
    {
      id: `vaud-${userId}-003`,
      userId,
      assetId: 'SPAJA',
      tier: 'cold',
      type: 'withdraw_time_lock_started',
      severity: 'info',
      message: 'Pokrenut time-lock od 3 dana za zahtev isplate.',
      actor: 'system',
      createdAt: '2026-05-11T17:00:00.000Z',
    },
    {
      id: `vaud-${userId}-004`,
      userId,
      assetId: 'SPAJA',
      tier: 'cold',
      type: 'withdraw_initiated',
      severity: 'info',
      message: 'Korisnik inicirao isplatu iz Cold Vault naloga.',
      actor: 'user',
      createdAt: '2026-05-11T16:58:00.000Z',
    },
    {
      id: `vaud-${userId}-005`,
      userId,
      assetId: 'BTC',
      tier: 'deep-cold',
      type: 'deposit_locked',
      severity: 'info',
      message: 'Depozit uspešno zaključan nakon 6 potvrda mreže.',
      actor: 'system',
      createdAt: '2026-05-11T10:12:00.000Z',
    },
    {
      id: `vaud-${userId}-006`,
      userId,
      assetId: 'BTC',
      tier: 'deep-cold',
      type: 'deposit_initiated',
      severity: 'info',
      message: 'Iniciran depozit u Deep-Cold Vault.',
      actor: 'user',
      createdAt: '2026-05-11T09:50:00.000Z',
    },
    {
      id: `vaud-${userId}-007`,
      userId,
      assetId: 'ETH',
      tier: 'warm',
      type: 'whitelist_updated',
      severity: 'warning',
      message: 'Whitelist adresa ažurirana za ETH Warm Vault.',
      actor: 'compliance',
      createdAt: '2026-05-10T22:20:00.000Z',
    },
    {
      id: `vaud-${userId}-008`,
      userId,
      assetId: 'USDT',
      tier: 'hot',
      type: 'policy_updated',
      severity: 'critical',
      message: 'Promenjena politika limita isplate za Hot Vault.',
      actor: 'security-bot',
      createdAt: '2026-05-10T20:00:00.000Z',
    },
  ];

  return baseEvents
    .slice()
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .slice(0, safeLimit);
}

/** Gradi sigurnosni pregled trezora na osnovu vault statusa i audit traga. */
export function buildVaultSecurityCheckReport(userId: string): VaultSecurityCheckReport {
  const vault = buildVaultStatusReport(userId);
  const audit = buildVaultAuditLog(userId, 25);

  const ratioCheck: VaultSecurityCheckItem = vault.securityScore >= 80
    ? { id: 'check-cold-storage-ratio', kind: 'cold-storage-ratio', status: 'ok', score: 96, detail: 'Udeo sredstava u cold/deep-cold vault-u je na očekivanom nivou.' }
    : { id: 'check-cold-storage-ratio', kind: 'cold-storage-ratio', status: 'warning', score: 70, detail: 'Povećati udeo sredstava u cold/deep-cold segmentu.' };

  const policyCheck: VaultSecurityCheckItem = {
    id: 'check-multi-sig-policy',
    kind: 'multi-sig-policy',
    status: 'ok',
    score: 94,
    detail: 'Multi-sig pragovi po tieru su usklađeni sa internom politikom.',
  };

  const timeLockCheck: VaultSecurityCheckItem = {
    id: 'check-time-lock-policy',
    kind: 'time-lock-policy',
    status: 'ok',
    score: 92,
    detail: 'Time-lock politike su aktivne za warm/cold/deep-cold tier.',
  };

  const whitelistWarnings = audit.filter((e) => e.type === 'withdraw_rejected').length;
  const whitelistCheck: VaultSecurityCheckItem = whitelistWarnings > 0
    ? {
      id: 'check-whitelist-hygiene',
      kind: 'whitelist-hygiene',
      status: 'warning',
      score: 78,
      detail: 'Detektovani pokušaji isplate ka neodobrenim adresama.',
    }
    : {
      id: 'check-whitelist-hygiene',
      kind: 'whitelist-hygiene',
      status: 'ok',
      score: 90,
      detail: 'Nema pokušaja isplate ka neodobrenim adresama.',
    };

  const freshnessHours = (Date.now() - Date.parse(vault.lastAuditAt)) / (1000 * 60 * 60);
  const auditFreshnessCheck: VaultSecurityCheckItem = freshnessHours <= 48
    ? {
      id: 'check-audit-freshness',
      kind: 'audit-freshness',
      status: 'ok',
      score: 93,
      detail: 'Poslednji audit je izvršen u poslednja 48h.',
    }
    : {
      id: 'check-audit-freshness',
      kind: 'audit-freshness',
      status: 'warning',
      score: 74,
      detail: 'Audit je zastareo; potreban je novi sigurnosni pregled.',
    };

  const checks: VaultSecurityCheckItem[] = [
    ratioCheck,
    policyCheck,
    timeLockCheck,
    whitelistCheck,
    auditFreshnessCheck,
  ];

  const overallScore = Math.round(
    checks.reduce((sum, check) => sum + check.score, 0) / checks.length,
  );

  const alerts: VaultSecurityCheckAlert[] = [];
  if (ratioCheck.status !== 'ok') {
    alerts.push({
      id: 'alert-cold-storage-ratio',
      severity: 'high',
      title: 'Nizak cold-storage ratio',
      detail: 'Povećajte transfer sredstava iz hot/warm u cold/deep-cold tier.',
    });
  }
  if (whitelistCheck.status !== 'ok') {
    alerts.push({
      id: 'alert-whitelist-rejections',
      severity: 'medium',
      title: 'Whitelist incidenti',
      detail: 'Pregledati odbijene adrese i pooštriti kontrolu izlaznih adresa.',
    });
  }
  if (auditFreshnessCheck.status !== 'ok') {
    alerts.push({
      id: 'alert-audit-freshness',
      severity: 'medium',
      title: 'Zastareo audit',
      detail: 'Pokrenuti vanredni audit i potvrdu politika.',
    });
  }

  return {
    userId,
    overallScore,
    checks,
    alerts,
    recommendedActions: [
      'Rotirati whitelist adrese prema kvartalnoj politici.',
      'Potvrditi multi-sig ključne učesnike i dostupnost potpisnika.',
      'Izvršiti dodatni audit nakon svake policy promene visokog rizika.',
    ],
    timestamp: new Date().toISOString(),
  };
}

// ─── Vault Policy ─────────────────────────────────────────────────────────────

export interface VaultTierPolicy {
  tier: VaultTier;
  minDepositNative: number;
  timeLockDays: number;
  multiSigThreshold: number;
  maxDailyWithdrawUsd: number;
  maxSingleWithdrawUsd: number;
  whitelistRequired: boolean;
  auditIntervalHours: number;
}

export interface VaultPolicyReport {
  userId: string;
  version: string;
  effectiveFrom: string;
  tiers: VaultTierPolicy[];
  globalRules: {
    maxConcurrentUnlocks: number;
    withdrawCooldownMinutes: number;
    kycRequiredAboveUsd: number;
    supportedAssets: string[];
  };
  complianceNotes: string[];
  timestamp: string;
}

/** Gradi prikaz aktivnih vault politika za sve tierove. */
export function buildVaultPolicyReport(userId: string): VaultPolicyReport {
  const tiers: VaultTierPolicy[] = [
    {
      tier: 'hot',
      minDepositNative: VAULT_MIN_DEPOSIT['hot'],
      timeLockDays: VAULT_TIME_LOCK_DAYS['hot'],
      multiSigThreshold: VAULT_MULTISIG_THRESHOLD['hot'],
      maxDailyWithdrawUsd: 10_000,
      maxSingleWithdrawUsd: 5_000,
      whitelistRequired: false,
      auditIntervalHours: 24,
    },
    {
      tier: 'warm',
      minDepositNative: VAULT_MIN_DEPOSIT['warm'],
      timeLockDays: VAULT_TIME_LOCK_DAYS['warm'],
      multiSigThreshold: VAULT_MULTISIG_THRESHOLD['warm'],
      maxDailyWithdrawUsd: 100_000,
      maxSingleWithdrawUsd: 50_000,
      whitelistRequired: true,
      auditIntervalHours: 48,
    },
    {
      tier: 'cold',
      minDepositNative: VAULT_MIN_DEPOSIT['cold'],
      timeLockDays: VAULT_TIME_LOCK_DAYS['cold'],
      multiSigThreshold: VAULT_MULTISIG_THRESHOLD['cold'],
      maxDailyWithdrawUsd: 500_000,
      maxSingleWithdrawUsd: 250_000,
      whitelistRequired: true,
      auditIntervalHours: 72,
    },
    {
      tier: 'deep-cold',
      minDepositNative: VAULT_MIN_DEPOSIT['deep-cold'],
      timeLockDays: VAULT_TIME_LOCK_DAYS['deep-cold'],
      multiSigThreshold: VAULT_MULTISIG_THRESHOLD['deep-cold'],
      maxDailyWithdrawUsd: 5_000_000,
      maxSingleWithdrawUsd: 2_000_000,
      whitelistRequired: true,
      auditIntervalHours: 168,
    },
  ];

  return {
    userId,
    version: 'v2.0',
    effectiveFrom: '2026-01-01T00:00:00.000Z',
    tiers,
    globalRules: {
      maxConcurrentUnlocks: 3,
      withdrawCooldownMinutes: 15,
      kycRequiredAboveUsd: 10_000,
      supportedAssets: ['BTC', 'ETH', 'SOL', 'USDT', 'SPAJA'],
    },
    complianceNotes: [
      'Sve isplate iznad $10,000 USD podležu KYC verifikaciji.',
      'Whitelist adrese moraju biti potvrđene od compliance tima.',
      'Policy promene stupaju na snagu 24h nakon odobrenja.',
    ],
    timestamp: new Date().toISOString(),
  };
}
