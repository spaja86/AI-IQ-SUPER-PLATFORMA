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

// ─── Vault Recovery ───────────────────────────────────────────────────────────

export type VaultRecoveryKeyholderRole =
  | 'primary-owner'
  | 'backup-keyholder'
  | 'compliance-officer'
  | 'security-lead';

export interface VaultRecoveryKeyholder {
  id: string;
  alias: string;
  role: VaultRecoveryKeyholderRole;
  publicKeyFingerprint: string;
  activatedAt: string;
  contactMethod: 'email' | 'signal' | 'hardware-token';
}

export type VaultRecoveryStepStatus = 'pending' | 'ready' | 'completed' | 'skipped';

export interface VaultRecoveryStep {
  order: number;
  title: string;
  description: string;
  requiredRole: VaultRecoveryKeyholderRole;
  estimatedDurationMinutes: number;
  status: VaultRecoveryStepStatus;
}

export interface VaultRecoveryReport {
  userId: string;
  planVersion: string;
  lastTestedAt: string;
  recoveryThreshold: number;
  keyholders: VaultRecoveryKeyholder[];
  steps: VaultRecoveryStep[];
  emergencyContacts: Array<{ label: string; value: string }>;
  notes: string[];
  timestamp: string;
}

/** Gradi plan oporavka vault-a (keyholders, koraci, kontakti). */
export function buildVaultRecoveryReport(userId: string): VaultRecoveryReport {
  const now = new Date().toISOString();

  const keyholders: VaultRecoveryKeyholder[] = [
    {
      id: `kh-${userId}-primary`,
      alias: 'Vlasnik Naloga',
      role: 'primary-owner',
      publicKeyFingerprint: 'A1:B2:C3:D4:E5:F6:00:11',
      activatedAt: '2026-01-01T00:00:00.000Z',
      contactMethod: 'hardware-token',
    },
    {
      id: `kh-${userId}-backup`,
      alias: 'Rezervni Čuvar Ključa',
      role: 'backup-keyholder',
      publicKeyFingerprint: 'F1:E2:D3:C4:B5:A6:99:88',
      activatedAt: '2026-01-15T00:00:00.000Z',
      contactMethod: 'signal',
    },
    {
      id: `kh-${userId}-compliance`,
      alias: 'Compliance Tim SPAJA',
      role: 'compliance-officer',
      publicKeyFingerprint: '11:22:33:44:55:66:77:88',
      activatedAt: '2026-02-01T00:00:00.000Z',
      contactMethod: 'email',
    },
    {
      id: `kh-${userId}-security`,
      alias: 'Security Lead SPAJA',
      role: 'security-lead',
      publicKeyFingerprint: 'AA:BB:CC:DD:EE:FF:01:02',
      activatedAt: '2026-02-01T00:00:00.000Z',
      contactMethod: 'hardware-token',
    },
  ];

  const steps: VaultRecoveryStep[] = [
    {
      order: 1,
      title: 'Prijaviti Incident',
      description: 'Vlasnik ili security lead prijavljuje potencijalni gubitak pristupa i otvara oporavak naloga.',
      requiredRole: 'primary-owner',
      estimatedDurationMinutes: 5,
      status: 'ready',
    },
    {
      order: 2,
      title: 'Verifikacija Identiteta',
      description: 'Compliance tim potvrđuje identitet podnosioca putem KYC i internog registra.',
      requiredRole: 'compliance-officer',
      estimatedDurationMinutes: 30,
      status: 'pending',
    },
    {
      order: 3,
      title: 'Aktivacija Rezervnog Ključa',
      description: 'Rezervni čuvar aktivira backup ključ i pruža privremeni pristup recovery flow-u.',
      requiredRole: 'backup-keyholder',
      estimatedDurationMinutes: 15,
      status: 'pending',
    },
    {
      order: 4,
      title: 'Multi-Sig Potpisivanje Oporavka',
      description: 'Recovery transakcija zahteva potpis od minimalno 3 od 4 čuvara ključa.',
      requiredRole: 'security-lead',
      estimatedDurationMinutes: 60,
      status: 'pending',
    },
    {
      order: 5,
      title: 'Audit Oporavka',
      description: 'Security lead i compliance tim završavaju post-recovery audit i ažuriraju policy.',
      requiredRole: 'compliance-officer',
      estimatedDurationMinutes: 20,
      status: 'pending',
    },
  ];

  return {
    userId,
    planVersion: 'v1.2',
    lastTestedAt: '2026-04-01T10:00:00.000Z',
    recoveryThreshold: 3,
    keyholders,
    steps,
    emergencyContacts: [
      { label: 'SPAJA Security Hotline', value: '+38177-000-0001' },
      { label: 'Compliance Email', value: 'compliance@spaja.digital' },
      { label: 'Security Signal', value: '@spaja-security' },
    ],
    notes: [
      'Plan oporavka se testira kvartalno u kontrolisanom okruženju.',
      'Promene u listi čuvara ključa zahtevaju odobrenje compliance tima.',
      'Nakon svakog oporavka mandatory je rotacija svih ključeva.',
    ],
    timestamp: now,
  };
}

// ─── Vault Coverage ────────────────────────────────────────────────────────────

export type VaultCoverageProviderKind =
  | 'internal-reserve'
  | 'bank-guarantee'
  | 'custody-insurance';

export interface VaultCoverageProvider {
  id: string;
  name: string;
  kind: VaultCoverageProviderKind;
  coveredUsd: number;
  coverageRatio: number;
  backedAssets: string[];
  settlementWindowHours: number;
}

export interface VaultCoverageGap {
  assetId: string;
  uncoveredUsd: number;
  reason: string;
  action: string;
}

export interface VaultCoverageReport {
  userId: string;
  totalVaultUsd: number;
  totalCoveredUsd: number;
  uncoveredUsd: number;
  coverageRatio: number;
  providers: VaultCoverageProvider[];
  gaps: VaultCoverageGap[];
  notes: string[];
  timestamp: string;
}

/** Gradi pregled coverage/insurance sloja za vault bilans korisnika. */
export function buildVaultCoverageReport(userId: string): VaultCoverageReport {
  const vault = buildVaultStatusReport(userId);
  const totalVaultUsd = roundLedger(
    vault.totalLockedUsd + vault.totalUnlockingUsd + vault.totalAvailableUsd,
  );

  const providers: VaultCoverageProvider[] = [
    {
      id: 'coverage-internal-reserve',
      name: 'SPAJA Reserve Fund',
      kind: 'internal-reserve',
      coveredUsd: roundLedger(totalVaultUsd * 0.35),
      coverageRatio: 35,
      backedAssets: ['USDT', 'SPAJA'],
      settlementWindowHours: 2,
    },
    {
      id: 'coverage-bank-guarantee',
      name: 'ERSTE Fiat Guarantee',
      kind: 'bank-guarantee',
      coveredUsd: roundLedger(totalVaultUsd * 0.3),
      coverageRatio: 30,
      backedAssets: ['BTC', 'ETH'],
      settlementWindowHours: 24,
    },
    {
      id: 'coverage-custody-insurance',
      name: 'Cold Shield Custody Cover',
      kind: 'custody-insurance',
      coveredUsd: roundLedger(totalVaultUsd * 0.2),
      coverageRatio: 20,
      backedAssets: ['BTC', 'ETH', 'SOL'],
      settlementWindowHours: 72,
    },
  ];

  const totalCoveredUsd = roundLedger(
    Math.min(
      totalVaultUsd,
      providers.reduce((sum, provider) => sum + provider.coveredUsd, 0),
    ),
  );
  const uncoveredUsd = roundLedger(Math.max(totalVaultUsd - totalCoveredUsd, 0));

  const gaps: VaultCoverageGap[] = uncoveredUsd > 0
    ? [
      {
        assetId: 'SPAJA',
        uncoveredUsd,
        reason: 'Deo bilansa ostaje van aktivnog bank guarantee i custody insurance sloja.',
        action: 'Prebaciti dodatni deo hot/warm ekspozicije u cold tier i povećati limit police.',
      },
    ]
    : [];

  return {
    userId,
    totalVaultUsd,
    totalCoveredUsd,
    uncoveredUsd,
    coverageRatio: totalVaultUsd > 0
      ? roundLedger((totalCoveredUsd / totalVaultUsd) * 100)
      : 0,
    providers,
    gaps,
    notes: [
      'Coverage model kombinuje interni reserve fund, bank guarantee i custody insurance sloj.',
      'Deep-cold segment dobija prioritet pri aktivaciji custody insurance police.',
      'Coverage pregled se ažurira posle svake veće promene vault balansa ili policy limita.',
    ],
    timestamp: new Date().toISOString(),
  };
}

// ─── Vault Risk ───────────────────────────────────────────────────────────────

export type VaultRiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type VaultRiskCategory =
  | 'market-risk'
  | 'concentration-risk'
  | 'liquidity-risk'
  | 'custody-risk'
  | 'counterparty-risk';

export interface VaultRiskFactor {
  id: string;
  category: VaultRiskCategory;
  title: string;
  score: number;
  level: VaultRiskLevel;
  finding: string;
  recommendation: string;
}

export interface VaultRiskReport {
  userId: string;
  overallScore: number;
  overallLevel: VaultRiskLevel;
  factors: VaultRiskFactor[];
  hotTierRatio: number;
  coldTierRatio: number;
  singleAssetMaxPct: number;
  dominantAsset: string;
  recommendations: string[];
  timestamp: string;
}

function riskLevel(score: number): VaultRiskLevel {
  if (score <= 25) return 'low';
  if (score <= 50) return 'medium';
  if (score <= 75) return 'high';
  return 'critical';
}

/** Procenjuje tržišni, koncentracijski, likvidnosni i custody rizik trezora. */
export function buildVaultRiskReport(userId: string): VaultRiskReport {
  const vault = buildVaultStatusReport(userId);
  const totalUsd = roundLedger(vault.totalLockedUsd + vault.totalUnlockingUsd + vault.totalAvailableUsd);

  // Tier distribution
  const hotUsd = roundLedger(
    vault.accounts
      .filter((a) => a.tier === 'hot')
      .reduce((s, a) => s + (a.locked + a.unlocking + a.available) * (VAULT_ASSET_PRICES_USD[a.assetId] ?? 1), 0),
  );
  const coldUsd = roundLedger(
    vault.accounts
      .filter((a) => a.tier === 'cold' || a.tier === 'deep-cold')
      .reduce((s, a) => s + (a.locked + a.unlocking + a.available) * (VAULT_ASSET_PRICES_USD[a.assetId] ?? 1), 0),
  );
  const hotTierRatio = totalUsd > 0 ? roundLedger((hotUsd / totalUsd) * 100) : 0;
  const coldTierRatio = totalUsd > 0 ? roundLedger((coldUsd / totalUsd) * 100) : 0;

  // Asset concentration
  const assetUsd: Record<string, number> = {};
  for (const a of vault.accounts) {
    const price = VAULT_ASSET_PRICES_USD[a.assetId] ?? 1;
    const usd = (a.locked + a.unlocking + a.available) * price;
    assetUsd[a.assetId] = (assetUsd[a.assetId] ?? 0) + usd;
  }
  let maxUsd = 0;
  let dominantAsset = 'N/A';
  for (const [asset, usd] of Object.entries(assetUsd)) {
    if (usd > maxUsd) { maxUsd = usd; dominantAsset = asset; }
  }
  const singleAssetMaxPct = totalUsd > 0 ? roundLedger((maxUsd / totalUsd) * 100) : 0;

  // Risk factor scores
  const mktScore = Math.min(100, Math.round(hotTierRatio * 0.6));
  const conScore = Math.min(100, Math.round(Math.max(0, singleAssetMaxPct - 40) * 2));
  const liqScore = coldTierRatio < 40 ? 60 : coldTierRatio >= 70 ? 10 : 30;
  const custScore = 15;
  const cptyScore = 20;

  const factors: VaultRiskFactor[] = [
    {
      id: 'risk-market',
      category: 'market-risk',
      title: 'Tržišni Rizik',
      score: mktScore,
      level: riskLevel(mktScore),
      finding: `${hotTierRatio.toFixed(1)}% vault bilansa je u hot tieru izloženom spot cenovnoj volatilnosti.`,
      recommendation: 'Prebaciti veći deo spot ekspozicije u warm ili cold tier kako bi se smanjio mark-to-market rizik.',
    },
    {
      id: 'risk-concentration',
      category: 'concentration-risk',
      title: 'Koncentracijski Rizik',
      score: conScore,
      level: riskLevel(conScore),
      finding: `Dominantni asset ${dominantAsset} čini ${singleAssetMaxPct.toFixed(1)}% ukupnog vault bilansa.`,
      recommendation: singleAssetMaxPct > 60
        ? 'Diversifikovati portfelj — preporučuje se rebalans radi smanjivanja exposurea na jedan asset.'
        : 'Koncentracija je u prihvatljivim granicama. Pratiti promjene pri svakom velikom depozitu.',
    },
    {
      id: 'risk-liquidity',
      category: 'liquidity-risk',
      title: 'Likvidnosni Rizik',
      score: liqScore,
      level: riskLevel(liqScore),
      finding: `${coldTierRatio.toFixed(1)}% bilansa je u cold/deep-cold tieru (time-lock ≥3 dana).`,
      recommendation: 'Osigurati da hot/warm tier drži dovoljnu likvidnost za operativne isplate (preporuka: ≥20% ukupnog bilansa).',
    },
    {
      id: 'risk-custody',
      category: 'custody-risk',
      title: 'Custody Rizik',
      score: custScore,
      level: riskLevel(custScore),
      finding: 'Multi-sig i hardware key policy su aktivni na svim non-hot tierovima.',
      recommendation: 'Redovno testirati recovery plan i rotirati hardware ključeve prema policy kalendaru.',
    },
    {
      id: 'risk-counterparty',
      category: 'counterparty-risk',
      title: 'Counterparty Rizik',
      score: cptyScore,
      level: riskLevel(cptyScore),
      finding: 'Bank guarantee i custody insurance pokrivaju ~85% bilansa putem provjenih provajdera.',
      recommendation: 'Pratiti kreditni rejting provajdera polica. Obezbjediti alternativni coverage u slučaju povlačenja police.',
    },
  ];

  const totalScore = Math.round(factors.reduce((s, f) => s + f.score, 0) / factors.length);

  return {
    userId,
    overallScore: totalScore,
    overallLevel: riskLevel(totalScore),
    factors,
    hotTierRatio,
    coldTierRatio,
    singleAssetMaxPct,
    dominantAsset,
    recommendations: [
      'Revizija vault distribucije po tieru preporučuje se kvartalno ili pri promjeni >20% bilansa.',
      'Diversifikovati asset mix ako jedan asset prelazi 60% ukupnog bilansa.',
      'Provjeriti pokrivenost i limite coverage police godišnje.',
      'Security i recovery drill sprovesti bar jednom kvartalno.',
    ],
    timestamp: new Date().toISOString(),
  };
}

// ─── Vault Analytics ─────────────────────────────────────────────────────────

export interface VaultAssetPerformance {
  assetId: string;
  priceUsd: number;
  priceChangePct7d: number;
  priceChangePct30d: number;
  totalHeld: number;
  totalHeldUsd: number;
  realizedGainUsd: number;
  unrealizedGainUsd: number;
}

export interface VaultTierYield {
  tier: VaultTier;
  balanceUsd: number;
  estimatedAprPct: number;
  estimatedAnnualYieldUsd: number;
  yieldSource: string;
}

export interface VaultAnalyticsReport {
  userId: string;
  totalValueUsd: number;
  totalRealizedGainUsd: number;
  totalUnrealizedGainUsd: number;
  totalEstimatedAnnualYieldUsd: number;
  portfolioAprPct: number;
  assetPerformance: VaultAssetPerformance[];
  tierYields: VaultTierYield[];
  topGainerAsset: string;
  topLoserAsset: string;
  notes: string[];
  timestamp: string;
}

const VAULT_PRICE_CHANGE_7D: Record<string, number> = {
  BTC: 4.2,
  ETH: 6.8,
  SOL: 11.5,
  USDT: 0.0,
  SPAJA: 18.3,
};

const VAULT_PRICE_CHANGE_30D: Record<string, number> = {
  BTC: 12.1,
  ETH: 9.4,
  SOL: 27.8,
  USDT: 0.0,
  SPAJA: 45.6,
};

const VAULT_TIER_APR: Record<VaultTier, number> = {
  hot: 0.5,
  warm: 2.0,
  cold: 4.5,
  'deep-cold': 6.0,
};

const VAULT_TIER_YIELD_SOURCE: Record<VaultTier, string> = {
  hot: 'Operativna likvidnost (bez prinosa)',
  warm: 'Kratkoročni DeFi lending protokol',
  cold: 'Strukturirani kripto prinos (cold staking)',
  'deep-cold': 'Institucioni yield vault (Custody APR Program)',
};

/** Gradi analytics i yield izvještaj za vault portfolio korisnika. */
export function buildVaultAnalyticsReport(userId: string): VaultAnalyticsReport {
  const vault = buildVaultStatusReport(userId);

  // Per-asset performance
  const assetMap: Record<string, { total: number; priceUsd: number }> = {};
  for (const a of vault.accounts) {
    const price = VAULT_ASSET_PRICES_USD[a.assetId] ?? 1;
    const total = a.locked + a.unlocking + a.available;
    if (!assetMap[a.assetId]) {
      assetMap[a.assetId] = { total: 0, priceUsd: price };
    }
    assetMap[a.assetId].total += total;
  }

  const assetPerformance: VaultAssetPerformance[] = Object.entries(assetMap).map(
    ([assetId, { total, priceUsd }]) => {
      const totalHeldUsd = roundLedger(total * priceUsd);
      const change7d = VAULT_PRICE_CHANGE_7D[assetId] ?? 0;
      const change30d = VAULT_PRICE_CHANGE_30D[assetId] ?? 0;
      const unrealizedGainUsd = roundLedger(totalHeldUsd * (change30d / 100));
      const realizedGainUsd = roundLedger(totalHeldUsd * 0.03);
      return {
        assetId,
        priceUsd,
        priceChangePct7d: change7d,
        priceChangePct30d: change30d,
        totalHeld: roundLedger(total),
        totalHeldUsd,
        realizedGainUsd,
        unrealizedGainUsd,
      };
    },
  );

  const totalValueUsd = roundLedger(assetPerformance.reduce((s, a) => s + a.totalHeldUsd, 0));
  const totalRealizedGainUsd = roundLedger(assetPerformance.reduce((s, a) => s + a.realizedGainUsd, 0));
  const totalUnrealizedGainUsd = roundLedger(assetPerformance.reduce((s, a) => s + a.unrealizedGainUsd, 0));

  // Top gainer / loser
  let topGainerAsset = 'N/A';
  let topLoserAsset = 'N/A';
  let maxChange = -Infinity;
  let minChange = Infinity;
  for (const ap of assetPerformance) {
    if (ap.priceChangePct30d > maxChange) { maxChange = ap.priceChangePct30d; topGainerAsset = ap.assetId; }
    if (ap.priceChangePct30d < minChange) { minChange = ap.priceChangePct30d; topLoserAsset = ap.assetId; }
  }

  // Tier yields
  const tierBalances: Record<VaultTier, number> = { hot: 0, warm: 0, cold: 0, 'deep-cold': 0 };
  for (const a of vault.accounts) {
    const price = VAULT_ASSET_PRICES_USD[a.assetId] ?? 1;
    tierBalances[a.tier] += (a.locked + a.unlocking + a.available) * price;
  }

  const tierYields: VaultTierYield[] = (['hot', 'warm', 'cold', 'deep-cold'] as VaultTier[]).map((tier) => {
    const balanceUsd = roundLedger(tierBalances[tier]);
    const estimatedAprPct = VAULT_TIER_APR[tier];
    const estimatedAnnualYieldUsd = roundLedger(balanceUsd * (estimatedAprPct / 100));
    return {
      tier,
      balanceUsd,
      estimatedAprPct,
      estimatedAnnualYieldUsd,
      yieldSource: VAULT_TIER_YIELD_SOURCE[tier],
    };
  });

  const totalEstimatedAnnualYieldUsd = roundLedger(tierYields.reduce((s, t) => s + t.estimatedAnnualYieldUsd, 0));
  const portfolioAprPct = totalValueUsd > 0
    ? roundLedger((totalEstimatedAnnualYieldUsd / totalValueUsd) * 100)
    : 0;

  return {
    userId,
    totalValueUsd,
    totalRealizedGainUsd,
    totalUnrealizedGainUsd,
    totalEstimatedAnnualYieldUsd,
    portfolioAprPct,
    assetPerformance,
    tierYields,
    topGainerAsset,
    topLoserAsset,
    notes: [
      'Prinos je simuliran na osnovu tier APR modela. Stvarni prinos zavisi od tržišnih uslova.',
      'Unrealized gain se izračunava na bazi 30-dnevne promjene cijene.',
      'Realized gain prikazuje procijenjeni realizovani prinos u tekućem periodu.',
    ],
    timestamp: new Date().toISOString(),
  };
}

// ─── Vault Rebalance ─────────────────────────────────────────────────────────

export type RebalanceAction = 'move' | 'none';

export interface VaultRebalanceSuggestion {
  id: string;
  fromTier: VaultTier;
  toTier: VaultTier;
  assetId: string;
  amountNative: number;
  amountUsd: number;
  reason: string;
  action: RebalanceAction;
  priority: 'high' | 'medium' | 'low';
}

export interface VaultTierAllocation {
  tier: VaultTier;
  currentPct: number;
  targetPct: number;
  deviationPct: number;
  balanceUsd: number;
}

export interface VaultRebalanceReport {
  userId: string;
  totalValueUsd: number;
  isBalanced: boolean;
  suggestions: VaultRebalanceSuggestion[];
  tierAllocations: VaultTierAllocation[];
  rebalanceCostEstimateUsd: number;
  notes: string[];
  timestamp: string;
}

// Target allocation percentages per tier
const VAULT_TARGET_ALLOCATION: Record<VaultTier, number> = {
  hot: 10,
  warm: 20,
  cold: 35,
  'deep-cold': 35,
};

const REBALANCE_THRESHOLD_PCT = 5; // suggest rebalance if deviation > 5%

/** Gradi vault rebalance prijedlog za optimalnu raspodjelu sredstava po tierovima. */
export function buildVaultRebalanceReport(userId: string): VaultRebalanceReport {
  const vault = buildVaultStatusReport(userId);

  // Compute per-tier balances
  const tierBalances: Record<VaultTier, number> = { hot: 0, warm: 0, cold: 0, 'deep-cold': 0 };
  const tierAssetAmounts: Record<VaultTier, { assetId: string; native: number; usd: number }[]> = {
    hot: [], warm: [], cold: [], 'deep-cold': [],
  };

  for (const a of vault.accounts) {
    const price = VAULT_ASSET_PRICES_USD[a.assetId] ?? 1;
    const total = a.locked + a.unlocking + a.available;
    const totalUsd = total * price;
    tierBalances[a.tier] = roundLedger(tierBalances[a.tier] + totalUsd);
    tierAssetAmounts[a.tier].push({ assetId: a.assetId, native: total, usd: roundLedger(totalUsd) });
  }

  const totalValueUsd = roundLedger(Object.values(tierBalances).reduce((s, v) => s + v, 0));

  // Compute allocations
  const tierAllocations: VaultTierAllocation[] = (['hot', 'warm', 'cold', 'deep-cold'] as VaultTier[]).map((tier) => {
    const balanceUsd = tierBalances[tier];
    const currentPct = totalValueUsd > 0 ? roundLedger((balanceUsd / totalValueUsd) * 100) : 0;
    const targetPct = VAULT_TARGET_ALLOCATION[tier];
    const deviationPct = roundLedger(currentPct - targetPct);
    return { tier, currentPct, targetPct, deviationPct, balanceUsd };
  });

  // Build suggestions
  const suggestions: VaultRebalanceSuggestion[] = [];
  let suggestionId = 1;

  for (const alloc of tierAllocations) {
    if (alloc.deviationPct > REBALANCE_THRESHOLD_PCT) {
      // Over-allocated — suggest moving excess to under-allocated tier
      const overUsd = roundLedger((alloc.deviationPct / 100) * totalValueUsd);
      // Pick best asset to move
      const assets = tierAssetAmounts[alloc.tier];
      const topAsset = assets.sort((a, b) => b.usd - a.usd)[0];
      if (topAsset && topAsset.usd > 0) {
        // Move to the most under-allocated tier
        const underAlloc = tierAllocations
          .filter((t) => t.deviationPct < -REBALANCE_THRESHOLD_PCT)
          .sort((a, b) => a.deviationPct - b.deviationPct)[0];
        const toTier: VaultTier = underAlloc?.tier ?? 'cold';
        const moveUsd = Math.min(overUsd, topAsset.usd);
        const price = VAULT_ASSET_PRICES_USD[topAsset.assetId] ?? 1;
        suggestions.push({
          id: `reb-${suggestionId++}`,
          fromTier: alloc.tier,
          toTier,
          assetId: topAsset.assetId,
          amountNative: roundLedger(moveUsd / price),
          amountUsd: roundLedger(moveUsd),
          reason: `${alloc.tier} tier je prekomjerno popunjen (${alloc.currentPct}% vs cilj ${alloc.targetPct}%). Preporučena migracija u ${toTier} tier radi optimizacije.`,
          action: 'move',
          priority: alloc.deviationPct > 15 ? 'high' : alloc.deviationPct > 10 ? 'medium' : 'low',
        });
      }
    }
  }

  const isBalanced = suggestions.length === 0;
  const rebalanceCostEstimateUsd = roundLedger(suggestions.reduce((s, sg) => s + sg.amountUsd * 0.001, 0));

  return {
    userId,
    totalValueUsd,
    isBalanced,
    suggestions,
    tierAllocations,
    rebalanceCostEstimateUsd,
    notes: [
      `Ciljana raspodjela: Hot ${VAULT_TARGET_ALLOCATION.hot}%, Warm ${VAULT_TARGET_ALLOCATION.warm}%, Cold ${VAULT_TARGET_ALLOCATION.cold}%, Deep-Cold ${VAULT_TARGET_ALLOCATION['deep-cold']}%.`,
      `Rebalans se preporučuje kada devijacija premašuje ${REBALANCE_THRESHOLD_PCT}%.`,
      'Procjena troška rebalansa iznosi 0.1% od prenesene vrijednosti.',
    ],
    timestamp: new Date().toISOString(),
  };
}

// ─── Vault Liquidity ─────────────────────────────────────────────────────────

export interface VaultLiquidityTier {
  tier: VaultTier;
  availableUsd: number;
  unlockingUsd: number;
  lockedUsd: number;
  totalUsd: number;
  sharePct: number;
}

export interface VaultLiquidityWindow {
  label: 'instant' | '24h' | '7d';
  capacityUsd: number;
  coveragePct: number;
  includesTiers: VaultTier[];
}

export interface VaultLiquidityReport {
  userId: string;
  totalValueUsd: number;
  instantLiquidityUsd: number;
  operationalBufferUsd: number;
  liquidityScore: number;
  tierBreakdown: VaultLiquidityTier[];
  withdrawalWindows: VaultLiquidityWindow[];
  recommendations: string[];
  timestamp: string;
}

const COLD_TIER_24H_AVAILABILITY_FACTOR = 0.2;
const DEEP_COLD_TIER_7D_AVAILABILITY_FACTOR = 0.35;

const LIQUIDITY_SCORE_WEIGHTS = {
  instant: 0.5,
  day1: 0.3,
  day7: 0.2,
} as const;

/** Gradi izvještaj o likvidnosti trezora i kapacitetu isplate po vremenskim prozorima. */
export function buildVaultLiquidityReport(userId: string): VaultLiquidityReport {
  const vault = buildVaultStatusReport(userId);

  const tierRaw: Record<VaultTier, { availableUsd: number; unlockingUsd: number; lockedUsd: number; totalUsd: number }> = {
    hot: { availableUsd: 0, unlockingUsd: 0, lockedUsd: 0, totalUsd: 0 },
    warm: { availableUsd: 0, unlockingUsd: 0, lockedUsd: 0, totalUsd: 0 },
    cold: { availableUsd: 0, unlockingUsd: 0, lockedUsd: 0, totalUsd: 0 },
    'deep-cold': { availableUsd: 0, unlockingUsd: 0, lockedUsd: 0, totalUsd: 0 },
  };

  for (const account of vault.accounts) {
    const price = VAULT_ASSET_PRICES_USD[account.assetId] ?? 1;
    const availableUsd = roundLedger(account.available * price);
    const unlockingUsd = roundLedger(account.unlocking * price);
    const lockedUsd = roundLedger(account.locked * price);
    const totalUsd = roundLedger(availableUsd + unlockingUsd + lockedUsd);

    tierRaw[account.tier].availableUsd = roundLedger(tierRaw[account.tier].availableUsd + availableUsd);
    tierRaw[account.tier].unlockingUsd = roundLedger(tierRaw[account.tier].unlockingUsd + unlockingUsd);
    tierRaw[account.tier].lockedUsd = roundLedger(tierRaw[account.tier].lockedUsd + lockedUsd);
    tierRaw[account.tier].totalUsd = roundLedger(tierRaw[account.tier].totalUsd + totalUsd);
  }

  const totalValueUsd = roundLedger(
    Object.values(tierRaw).reduce((sum, t) => sum + t.totalUsd, 0),
  );

  const tierBreakdown: VaultLiquidityTier[] = (['hot', 'warm', 'cold', 'deep-cold'] as VaultTier[]).map((tier) => {
    const row = tierRaw[tier];
    const sharePct = totalValueUsd > 0 ? roundLedger((row.totalUsd / totalValueUsd) * 100) : 0;
    return {
      tier,
      availableUsd: row.availableUsd,
      unlockingUsd: row.unlockingUsd,
      lockedUsd: row.lockedUsd,
      totalUsd: row.totalUsd,
      sharePct,
    };
  });

  const hot = tierRaw.hot;
  const warm = tierRaw.warm;
  const cold = tierRaw.cold;
  const deepCold = tierRaw['deep-cold'];

  const instantLiquidityUsd = roundLedger(hot.availableUsd + warm.availableUsd);
  const operationalBufferUsd = roundLedger(hot.availableUsd + warm.availableUsd + warm.unlockingUsd);

  const instantCapacityUsd = instantLiquidityUsd;
  const day1CapacityUsd = roundLedger(
    instantLiquidityUsd + warm.unlockingUsd + cold.availableUsd * COLD_TIER_24H_AVAILABILITY_FACTOR,
  );
  const day7CapacityUsd = roundLedger(
    instantLiquidityUsd
    + warm.unlockingUsd
    + cold.availableUsd
    + cold.unlockingUsd
    + deepCold.availableUsd * DEEP_COLD_TIER_7D_AVAILABILITY_FACTOR,
  );

  const withdrawalWindows: VaultLiquidityWindow[] = [
    {
      label: 'instant',
      capacityUsd: instantCapacityUsd,
      coveragePct: totalValueUsd > 0 ? roundLedger((instantCapacityUsd / totalValueUsd) * 100) : 0,
      includesTiers: ['hot', 'warm'],
    },
    {
      label: '24h',
      capacityUsd: day1CapacityUsd,
      coveragePct: totalValueUsd > 0 ? roundLedger((day1CapacityUsd / totalValueUsd) * 100) : 0,
      includesTiers: ['hot', 'warm', 'cold'],
    },
    {
      label: '7d',
      capacityUsd: day7CapacityUsd,
      coveragePct: totalValueUsd > 0 ? roundLedger((day7CapacityUsd / totalValueUsd) * 100) : 0,
      includesTiers: ['hot', 'warm', 'cold', 'deep-cold'],
    },
  ];

  const liquidityScore = Math.max(
    0,
    Math.min(
      100,
      roundLedger(
        withdrawalWindows[0].coveragePct * LIQUIDITY_SCORE_WEIGHTS.instant
        + withdrawalWindows[1].coveragePct * LIQUIDITY_SCORE_WEIGHTS.day1
        + withdrawalWindows[2].coveragePct * LIQUIDITY_SCORE_WEIGHTS.day7,
      ),
    ),
  );

  const recommendations: string[] = [];
  if (withdrawalWindows[0].coveragePct < 20) {
    recommendations.push('Povećati hot/warm likvidnost za operativna instant povlačenja (cilj: ≥20% ukupnog vault bilansa).');
  }
  if (withdrawalWindows[1].coveragePct < 35) {
    recommendations.push('Poboljšati 24h likvidnost kroz dio prebacivanja iz cold u warm tier ili kroz staged unlock schedule.');
  }
  if (liquidityScore >= 70) {
    recommendations.push('Likvidnosni profil je stabilan; zadržati postojeću tier raspodjelu uz sedmični monitoring.');
  }

  return {
    userId,
    totalValueUsd,
    instantLiquidityUsd,
    operationalBufferUsd,
    liquidityScore,
    tierBreakdown,
    withdrawalWindows,
    recommendations,
    timestamp: new Date().toISOString(),
  };
}

// ─── Vault Forecast ──────────────────────────────────────────────────────────

export type ForecastHorizon = '30d' | '90d' | '180d' | '365d';

export interface VaultForecastDataPoint {
  date: string;
  estimatedValueUsd: number;
  estimatedYieldUsd: number;
  cumulativeYieldUsd: number;
}

export interface VaultForecastScenario {
  scenario: 'bull' | 'base' | 'bear';
  aprPct: number;
  endValueUsd: number;
  totalYieldUsd: number;
  returnPct: number;
  dataPoints: VaultForecastDataPoint[];
}

export interface VaultForecastReport {
  userId: string;
  currentValueUsd: number;
  horizon: ForecastHorizon;
  horizonDays: number;
  baseScenario: VaultForecastScenario;
  bullScenario: VaultForecastScenario;
  bearScenario: VaultForecastScenario;
  assumptions: string[];
  timestamp: string;
}

const HORIZON_DAYS: Record<ForecastHorizon, number> = {
  '30d': 30,
  '90d': 90,
  '180d': 180,
  '365d': 365,
};

// Scenario APR multipliers relative to portfolio baseline APR
const SCENARIO_APR_MULTIPLIER = {
  bull: 1.6,
  base: 1.0,
  bear: 0.35,
} as const;

const FORECAST_MONTHLY_POINTS = 4; // data points per 30-day block

function buildForecastScenario(
  scenario: 'bull' | 'base' | 'bear',
  currentValueUsd: number,
  baseAprPct: number,
  horizonDays: number,
): VaultForecastScenario {
  const aprPct = roundLedger(baseAprPct * SCENARIO_APR_MULTIPLIER[scenario]);
  const dailyRate = aprPct / 100 / 365;
  const totalPoints = Math.max(1, Math.round((horizonDays / 30) * FORECAST_MONTHLY_POINTS));
  const intervalDays = horizonDays / totalPoints;
  const now = new Date('2026-05-11T00:00:00.000Z');

  const dataPoints: VaultForecastDataPoint[] = [];
  let cumulativeYieldUsd = 0;
  let prevValue = currentValueUsd;

  for (let i = 1; i <= totalPoints; i++) {
    const daysElapsed = Math.round(i * intervalDays);
    const date = new Date(now.getTime() + daysElapsed * 86_400_000).toISOString().substring(0, 10);
    const periodDays = intervalDays;
    const yieldForPeriod = roundLedger(prevValue * dailyRate * periodDays);
    const estimatedValueUsd = roundLedger(prevValue + yieldForPeriod);
    cumulativeYieldUsd = roundLedger(cumulativeYieldUsd + yieldForPeriod);
    dataPoints.push({
      date,
      estimatedValueUsd,
      estimatedYieldUsd: yieldForPeriod,
      cumulativeYieldUsd,
    });
    prevValue = estimatedValueUsd;
  }

  const endValueUsd = dataPoints[dataPoints.length - 1]?.estimatedValueUsd ?? currentValueUsd;
  const totalYieldUsd = roundLedger(endValueUsd - currentValueUsd);
  const returnPct = currentValueUsd > 0 ? roundLedger((totalYieldUsd / currentValueUsd) * 100) : 0;

  return { scenario, aprPct, endValueUsd, totalYieldUsd, returnPct, dataPoints };
}

/** Gradi vault performance forecast za zadani horizont. */
export function buildVaultForecastReport(userId: string, horizon: ForecastHorizon = '90d'): VaultForecastReport {
  const analytics = buildVaultAnalyticsReport(userId);
  const currentValueUsd = analytics.totalValueUsd;
  const baseAprPct = analytics.portfolioAprPct > 0 ? analytics.portfolioAprPct : 3.5;
  const horizonDays = HORIZON_DAYS[horizon];

  const baseScenario = buildForecastScenario('base', currentValueUsd, baseAprPct, horizonDays);
  const bullScenario = buildForecastScenario('bull', currentValueUsd, baseAprPct, horizonDays);
  const bearScenario = buildForecastScenario('bear', currentValueUsd, baseAprPct, horizonDays);

  return {
    userId,
    currentValueUsd,
    horizon,
    horizonDays,
    baseScenario,
    bullScenario,
    bearScenario,
    assumptions: [
      `Bazni APR scenarij koristi trenutni portfolio APR od ${baseAprPct.toFixed(2)}%.`,
      `Bull scenarij pretpostavlja ${(SCENARIO_APR_MULTIPLIER.bull * 100).toFixed(0)}% od baznog APR-a (povoljni tržišni uslovi).`,
      `Bear scenarij pretpostavlja ${(SCENARIO_APR_MULTIPLIER.bear * 100).toFixed(0)}% od baznog APR-a (nepovoljni tržišni uslovi).`,
      'Prognoza je simulirana i ne predstavlja financijski savjet. Stvarni prinos zavisi od tržišnih uslova.',
    ],
    timestamp: new Date().toISOString(),
  };
}

// ─── Vault Stress ──────────────────────────────────────────────────────────────

export type VaultStressScenarioId =
  | 'flash-crash'
  | 'liquidity-freeze'
  | 'custody-incident';

export interface VaultStressScenario {
  id: VaultStressScenarioId;
  naziv: string;
  marketShockPct: number;
  liquidityShockPct: number;
  recoveryDays: number;
  estimatedDrawdownUsd: number;
  projectedValueUsd: number;
  projectedCoveragePct: number;
  projectedLiquidityScore: number;
  pass: boolean;
  notes: string[];
}

export interface VaultStressReport {
  userId: string;
  baselineValueUsd: number;
  baselineCoveragePct: number;
  baselineLiquidityScore: number;
  scenarios: VaultStressScenario[];
  worstScenarioId: VaultStressScenarioId;
  resilienceScore: number;
  recommendations: string[];
  timestamp: string;
}

/** Gradi stress test izvještaj za ključne tržišne i operativne šokove. */
export function buildVaultStressReport(userId: string): VaultStressReport {
  const analytics = buildVaultAnalyticsReport(userId);
  const liquidity = buildVaultLiquidityReport(userId);
  const coverage = buildVaultCoverageReport(userId);

  const baselineValueUsd = analytics.totalValueUsd;
  const baselineCoveragePct = coverage.coverageRatio;
  const baselineLiquidityScore = liquidity.liquidityScore;

  const scenarioInputs: Array<{
    id: VaultStressScenarioId;
    naziv: string;
    marketShockPct: number;
    liquidityShockPct: number;
    recoveryDays: number;
    notes: string[];
  }> = [
    {
      id: 'flash-crash',
      naziv: 'Flash Crash -35%',
      marketShockPct: 35,
      liquidityShockPct: 20,
      recoveryDays: 21,
      notes: [
        'Brzi pad glavnih crypto tržišta uz kratkoročan spread spike.',
        'Likvidnost warm/cold tierova se smanjuje zbog povećanih povlačenja.',
      ],
    },
    {
      id: 'liquidity-freeze',
      naziv: 'Liquidity Freeze',
      marketShockPct: 18,
      liquidityShockPct: 45,
      recoveryDays: 30,
      notes: [
        'Smanjen market depth i usporen execution većih OTC naloga.',
        'Prioritet daje instant i 24h prozorima povlačenja.',
      ],
    },
    {
      id: 'custody-incident',
      naziv: 'Custody Incident',
      marketShockPct: 12,
      liquidityShockPct: 30,
      recoveryDays: 14,
      notes: [
        'Privremena izolacija dijela cold/deep-cold sredstava tokom sigurnosnog incidenta.',
        'Aktivacija reserve + insurance sloja umanjuje dugoročni gubitak.',
      ],
    },
  ];

  const scenarios: VaultStressScenario[] = scenarioInputs.map((input) => {
    const blendedShockPct = input.marketShockPct * 0.7 + input.liquidityShockPct * 0.3;
    const estimatedDrawdownUsd = roundLedger(baselineValueUsd * (blendedShockPct / 100));
    const projectedValueUsd = roundLedger(Math.max(0, baselineValueUsd - estimatedDrawdownUsd));

    const recoveryReliefPct = input.id === 'custody-incident' ? 12 : input.id === 'flash-crash' ? 9 : 7;
    const projectedCoveragePct = Math.max(
      0,
      Math.min(
        100,
        roundLedger(
          baselineCoveragePct
          - input.marketShockPct * 0.3
          + recoveryReliefPct,
        ),
      ),
    );

    const projectedLiquidityScore = Math.max(
      0,
      Math.min(
        100,
        roundLedger(
          baselineLiquidityScore
          - input.liquidityShockPct * 0.6
          + (input.id === 'liquidity-freeze' ? 4 : 7),
        ),
      ),
    );

    const pass = projectedValueUsd >= baselineValueUsd * 0.6
      && projectedCoveragePct >= 45
      && projectedLiquidityScore >= 35;

    return {
      id: input.id,
      naziv: input.naziv,
      marketShockPct: input.marketShockPct,
      liquidityShockPct: input.liquidityShockPct,
      recoveryDays: input.recoveryDays,
      estimatedDrawdownUsd,
      projectedValueUsd,
      projectedCoveragePct,
      projectedLiquidityScore,
      pass,
      notes: input.notes,
    };
  });

  const worstScenario = scenarios.length > 0
    ? scenarios.reduce((worst, current) =>
      current.projectedValueUsd < worst.projectedValueUsd ? current : worst,
    scenarios[0])
    : undefined;

  const passRatePct = scenarios.length > 0
    ? (scenarios.filter((s) => s.pass).length / scenarios.length) * 100
    : 0;
  const resilienceScore = Math.max(
    0,
    Math.min(
      100,
      roundLedger(
        passRatePct * 0.5
        + baselineCoveragePct * 0.3
        + baselineLiquidityScore * 0.2,
      ),
    ),
  );

  const recommendations: string[] = [];
  if (scenarios.some((s) => s.projectedLiquidityScore < 40)) {
    recommendations.push('Povećati operativni buffer hot/warm tiera radi boljeg preživljavanja liquidity shock scenarija.');
  }
  if (scenarios.some((s) => s.projectedCoveragePct < 50)) {
    recommendations.push('Proširiti coverage limite (reserve fund / bank guarantee / custody insurance) za stres periode.');
  }
  if (recommendations.length === 0) {
    recommendations.push('Stress profil je stabilan; nastaviti mesečne stress simulacije i kvartalne policy revizije.');
  }

  return {
    userId,
    baselineValueUsd,
    baselineCoveragePct,
    baselineLiquidityScore,
    scenarios,
    worstScenarioId: worstScenario?.id ?? 'flash-crash',
    resilienceScore,
    recommendations,
    timestamp: new Date().toISOString(),
  };
}

// ─── Vault Resilience ──────────────────────────────────────────────────────────

export type VaultResilienceStatus = 'strong' | 'watch' | 'critical';

export interface VaultResilienceComponent {
  id: 'coverage' | 'liquidity' | 'stress' | 'risk-mitigation';
  score: number;
  status: VaultResilienceStatus;
  detail: string;
}

export interface VaultResilienceReport {
  userId: string;
  overallScore: number;
  status: VaultResilienceStatus;
  baselineRiskLevel: VaultRiskLevel;
  stressPassRatePct: number;
  components: VaultResilienceComponent[];
  hardeningActions: string[];
  timestamp: string;
}

function resilienceStatus(score: number): VaultResilienceStatus {
  if (score >= 75) return 'strong';
  if (score >= 55) return 'watch';
  return 'critical';
}

/** Gradi objedinjeni resilience izvještaj zasnovan na coverage, liquidity, stress i risk signalima. */
export function buildVaultResilienceReport(userId: string): VaultResilienceReport {
  const coverage = buildVaultCoverageReport(userId);
  const liquidity = buildVaultLiquidityReport(userId);
  const stress = buildVaultStressReport(userId);
  const risk = buildVaultRiskReport(userId);

  const stressPassRatePct = stress.scenarios.length > 0
    ? roundLedger((stress.scenarios.filter((s) => s.pass).length / stress.scenarios.length) * 100)
    : 0;
  const riskMitigationScore = Math.max(0, roundLedger(100 - risk.overallScore));

  const components: VaultResilienceComponent[] = [
    {
      id: 'coverage',
      score: coverage.coverageRatio,
      status: resilienceStatus(coverage.coverageRatio),
      detail: `Coverage ratio iznosi ${coverage.coverageRatio.toFixed(2)}%.`,
    },
    {
      id: 'liquidity',
      score: liquidity.liquidityScore,
      status: resilienceStatus(liquidity.liquidityScore),
      detail: `Likvidnosni score iznosi ${liquidity.liquidityScore.toFixed(2)} za instant/24h/7d prozore.`,
    },
    {
      id: 'stress',
      score: stress.resilienceScore,
      status: resilienceStatus(stress.resilienceScore),
      detail: `Stress resilience score iznosi ${stress.resilienceScore.toFixed(2)} uz prolaznost ${stressPassRatePct.toFixed(2)}%.`,
    },
    {
      id: 'risk-mitigation',
      score: riskMitigationScore,
      status: resilienceStatus(riskMitigationScore),
      detail: `Risk mitigation score iznosi ${riskMitigationScore.toFixed(2)} (izvedeno iz risk overallScore ${risk.overallScore}).`,
    },
  ];

  const overallScore = Math.max(
    0,
    Math.min(
      100,
      roundLedger(
        coverage.coverageRatio * 0.3
        + liquidity.liquidityScore * 0.25
        + stress.resilienceScore * 0.3
        + riskMitigationScore * 0.15,
      ),
    ),
  );

  const hardeningActions: string[] = [];
  if (coverage.coverageRatio < 70) {
    hardeningActions.push('Povećati coverage kapacitet i limit polisa kako bi pokrivenost bila ≥70%.');
  }
  if (liquidity.liquidityScore < 55) {
    hardeningActions.push('Poboljšati operativni buffer hot/warm tiera radi bržeg odgovora na talase povlačenja.');
  }
  if (stressPassRatePct < 67) {
    hardeningActions.push('Pojačati stress readiness plan i smanjiti osjetljivost na liquidity-freeze scenarije.');
  }
  if (risk.overallLevel === 'high' || risk.overallLevel === 'critical') {
    hardeningActions.push('Sprovesti prioritetni risk-rebalance i smanjiti koncentraciju dominantnog asseta.');
  }
  if (hardeningActions.length === 0) {
    hardeningActions.push('Resilience profil je stabilan; nastaviti mjesečni monitoring i kvartalni drill.');
  }

  return {
    userId,
    overallScore,
    status: resilienceStatus(overallScore),
    baselineRiskLevel: risk.overallLevel,
    stressPassRatePct,
    components,
    hardeningActions,
    timestamp: new Date().toISOString(),
  };
}

// ─── Vault Benchmark ──────────────────────────────────────────────────────────

export type BenchmarkId = 'BTC' | 'ETH' | 'crypto-market-index';

export interface BenchmarkEntry {
  id: BenchmarkId;
  naziv: string;
  returnPct7d: number;
  returnPct30d: number;
  returnPct90d: number;
  returnPct365d: number;
}

export interface VaultBenchmarkComparison {
  benchmarkId: BenchmarkId;
  benchmarkNaziv: string;
  benchmarkReturn30dPct: number;
  vaultReturn30dPct: number;
  alphaPct: number;
  outperforms: boolean;
}

export interface VaultBenchmarkReport {
  userId: string;
  vaultAprPct: number;
  vaultReturn7dPct: number;
  vaultReturn30dPct: number;
  vaultReturn90dPct: number;
  vaultReturn365dPct: number;
  benchmarks: BenchmarkEntry[];
  comparisons: VaultBenchmarkComparison[];
  bestBenchmark: BenchmarkId;
  worstBenchmark: BenchmarkId;
  outperformsCount: number;
  insights: string[];
  timestamp: string;
}

export type VaultAttributionRisk = 'low' | 'watch' | 'high';

export interface VaultAttributionSlice {
  key: string;
  valueUsd: number;
  weightPct: number;
  annualYieldUsd: number;
  contributionPct: number;
}

export interface VaultAttributionReport {
  userId: string;
  totalValueUsd: number;
  totalAnnualYieldUsd: number;
  assetAttribution: VaultAttributionSlice[];
  tierAttribution: VaultAttributionSlice[];
  topAssetContributor: string;
  topTierContributor: VaultTier;
  concentrationRisk: VaultAttributionRisk;
  insights: string[];
  timestamp: string;
}

export interface VaultExposureAsset {
  assetId: string;
  valueUsd: number;
  sharePct: number;
  priceChangePct30d: number;
}

export interface VaultExposureTier {
  tier: VaultTier;
  valueUsd: number;
  sharePct: number;
  unlockProfile: 'instant' | '24h' | '3d+' | '7d+';
}

export interface VaultExposureReport {
  userId: string;
  totalValueUsd: number;
  assetExposure: VaultExposureAsset[];
  tierExposure: VaultExposureTier[];
  dominantAsset: string;
  dominantTier: VaultTier;
  instantExposurePct: number;
  lockedExposurePct: number;
  concentrationRisk: VaultAttributionRisk;
  mitigationActions: string[];
  timestamp: string;
}

export interface VaultAssetAllocation {
  assetId: string;
  valueUsd: number;
  annualYieldUsd: number;
  currentPct: number;
  targetPct: number;
  deviationPct: number;
}

export interface VaultAllocationReport {
  userId: string;
  totalValueUsd: number;
  totalAnnualYieldUsd: number;
  assetAllocations: VaultAssetAllocation[];
  tierAllocations: VaultTierAllocation[];
  mostOverweightAsset: string;
  mostUnderweightAsset: string;
  suggestedShiftUsd: number;
  actions: string[];
  timestamp: string;
}

export type PerformancePeriod = '7d' | '30d' | '90d' | '365d';

export interface VaultAssetPerformanceEntry {
  assetId: string;
  valueUsd: number;
  pnlUsd: number;
  returnPct: number;
  contributionPct: number;
}

export interface VaultPeriodReturn {
  period: PerformancePeriod;
  startValueUsd: number;
  endValueUsd: number;
  pnlUsd: number;
  returnPct: number;
  annualizedReturnPct: number;
}

export interface VaultPerformanceReport {
  userId: string;
  totalValueUsd: number;
  totalPnlUsd: number;
  totalReturnPct: number;
  annualizedReturnPct: number;
  portfolioAprPct: number;
  assetPerformance: VaultAssetPerformanceEntry[];
  periodReturns: VaultPeriodReturn[];
  bestPeriod: PerformancePeriod;
  worstPeriod: PerformancePeriod;
  insights: string[];
  timestamp: string;
}

const VAULT_BENCHMARKS: BenchmarkEntry[] = [
  {
    id: 'BTC',
    naziv: 'Bitcoin (BTC)',
    returnPct7d: 4.2,
    returnPct30d: 12.1,
    returnPct90d: 28.4,
    returnPct365d: 82.3,
  },
  {
    id: 'ETH',
    naziv: 'Ethereum (ETH)',
    returnPct7d: 6.8,
    returnPct30d: 9.4,
    returnPct90d: 21.7,
    returnPct365d: 61.8,
  },
  {
    id: 'crypto-market-index',
    naziv: 'Crypto Market Index',
    returnPct7d: 5.5,
    returnPct30d: 10.8,
    returnPct90d: 25.0,
    returnPct365d: 72.1,
  },
];

const VAULT_TARGET_ASSET_ALLOCATION: Record<string, number> = {
  BTC: 40,
  ETH: 25,
  SOL: 15,
  USDT: 10,
  SPAJA: 10,
};

const PERIOD_DAYS: Record<PerformancePeriod, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
  '365d': 365,
};

/** Gradi benchmark izvještaj — upoređuje vault portfolio performanse sa tržišnim benchmarkima. */
export function buildVaultBenchmarkReport(userId: string): VaultBenchmarkReport {
  const analytics = buildVaultAnalyticsReport(userId);

  const vaultAprPct = analytics.portfolioAprPct;
  // Derive period returns from APR (simplified linear approximation)
  const vaultReturn7dPct = roundLedger(vaultAprPct / 365 * 7);
  const vaultReturn30dPct = roundLedger(vaultAprPct / 365 * 30);
  const vaultReturn90dPct = roundLedger(vaultAprPct / 365 * 90);
  const vaultReturn365dPct = roundLedger(vaultAprPct);

  const comparisons: VaultBenchmarkComparison[] = VAULT_BENCHMARKS.map((bm) => {
    const alphaPct = roundLedger(vaultReturn30dPct - bm.returnPct30d);
    return {
      benchmarkId: bm.id,
      benchmarkNaziv: bm.naziv,
      benchmarkReturn30dPct: bm.returnPct30d,
      vaultReturn30dPct,
      alphaPct,
      outperforms: alphaPct > 0,
    };
  });

  const best = VAULT_BENCHMARKS.reduce((a, b) =>
    b.returnPct30d > a.returnPct30d ? b : a,
  VAULT_BENCHMARKS[0]);
  const worst = VAULT_BENCHMARKS.reduce((a, b) =>
    b.returnPct30d < a.returnPct30d ? b : a,
  VAULT_BENCHMARKS[0]);

  const outperformsCount = comparisons.filter((c) => c.outperforms).length;

  const insights: string[] = [];
  if (outperformsCount === comparisons.length) {
    insights.push('Vault portfolio nadmašuje sve praćene benchmark-e u 30-dnevnom periodu — odlična aktivna alokacija.');
  } else if (outperformsCount === 0) {
    insights.push('Vault portfolio zaostaje za svim benchmarkima; razmotriti rebalans prema višeprinosnim segmentima tržišta.');
  } else {
    insights.push(`Vault nadmašuje ${outperformsCount} od ${comparisons.length} benchmark-a — selektivna izloženost daje mješovite rezultate.`);
  }
  const btcAlpha = comparisons.find((c) => c.benchmarkId === 'BTC')?.alphaPct ?? 0;
  if (btcAlpha < -5) {
    insights.push('Značajno zaostajanje za BTC sugerira prenisko prisustvo kripto asseta s visokim beta-om.');
  }
  insights.push(`Annualized vault APR od ${vaultAprPct.toFixed(2)}% odražava konzervativnu custody strategiju s naglaskom na zaštiti kapitala.`);

  return {
    userId,
    vaultAprPct,
    vaultReturn7dPct,
    vaultReturn30dPct,
    vaultReturn90dPct,
    vaultReturn365dPct,
    benchmarks: VAULT_BENCHMARKS,
    comparisons,
    bestBenchmark: best.id,
    worstBenchmark: worst.id,
    outperformsCount,
    insights,
    timestamp: new Date().toISOString(),
  };
}

function attributionRisk(maxWeightPct: number): VaultAttributionRisk {
  if (maxWeightPct >= 60) return 'high';
  if (maxWeightPct >= 40) return 'watch';
  return 'low';
}

/** Gradi attribution izvještaj — razdvaja doprinos prinosa po asetu i tieru. */
export function buildVaultAttributionReport(userId: string): VaultAttributionReport {
  const analytics = buildVaultAnalyticsReport(userId);

  const totalAnnualYieldUsd = Math.max(analytics.totalEstimatedAnnualYieldUsd, 0);
  const totalValueUsd = Math.max(analytics.totalValueUsd, 0);

  const assetAttribution: VaultAttributionSlice[] = analytics.assetPerformance
    .map((asset) => {
      const weightPct = totalValueUsd > 0 ? roundLedger((asset.totalHeldUsd / totalValueUsd) * 100) : 0;
      const annualYieldUsd = roundLedger(asset.totalHeldUsd * (analytics.portfolioAprPct / 100));
      const contributionPct = totalAnnualYieldUsd > 0
        ? roundLedger((annualYieldUsd / totalAnnualYieldUsd) * 100)
        : 0;
      return {
        key: asset.assetId,
        valueUsd: roundLedger(asset.totalHeldUsd),
        weightPct,
        annualYieldUsd,
        contributionPct,
      };
    })
    .sort((a, b) => b.annualYieldUsd - a.annualYieldUsd);

  const tierAttribution: VaultAttributionSlice[] = analytics.tierYields
    .map((tier) => {
      const weightPct = totalValueUsd > 0 ? roundLedger((tier.balanceUsd / totalValueUsd) * 100) : 0;
      const contributionPct = totalAnnualYieldUsd > 0
        ? roundLedger((tier.estimatedAnnualYieldUsd / totalAnnualYieldUsd) * 100)
        : 0;
      return {
        key: tier.tier,
        valueUsd: roundLedger(tier.balanceUsd),
        weightPct,
        annualYieldUsd: roundLedger(tier.estimatedAnnualYieldUsd),
        contributionPct,
      };
    })
    .sort((a, b) => b.annualYieldUsd - a.annualYieldUsd);

  const topAssetContributor = assetAttribution[0]?.key ?? 'BTC';
  const topTierContributor = (tierAttribution[0]?.key as VaultTier | undefined) ?? 'warm';
  const maxAssetWeight = assetAttribution[0]?.weightPct ?? 0;
  const concentrationRisk = attributionRisk(maxAssetWeight);

  const insights: string[] = [
    `Najveći doprinos godišnjem prinosu dolazi od asseta ${topAssetContributor}.`,
    `Tier sa najvećim prinosnim doprinosom je ${topTierContributor}.`,
    `Koncentracioni rizik je procijenjen kao ${concentrationRisk} (max asset weight ${maxAssetWeight.toFixed(2)}%).`,
  ];
  if (concentrationRisk !== 'low') {
    insights.push('Razmotriti dodatnu diverzifikaciju kako bi pojedinačni asset imao manji udio u ukupnom portfoliu.');
  }

  return {
    userId,
    totalValueUsd,
    totalAnnualYieldUsd,
    assetAttribution,
    tierAttribution,
    topAssetContributor,
    topTierContributor,
    concentrationRisk,
    insights,
    timestamp: new Date().toISOString(),
  };
}

function exposureUnlockProfile(tier: VaultTier): VaultExposureTier['unlockProfile'] {
  if (tier === 'hot') return 'instant';
  if (tier === 'warm') return '24h';
  if (tier === 'cold') return '3d+';
  return '7d+';
}

/** Gradi exposure izvještaj — prikazuje raspodjelu izloženosti po asetu i tieru. */
export function buildVaultExposureReport(userId: string): VaultExposureReport {
  const analytics = buildVaultAnalyticsReport(userId);
  const liquidity = buildVaultLiquidityReport(userId);
  const risk = buildVaultRiskReport(userId);

  const totalValueUsd = Math.max(analytics.totalValueUsd, 0);

  const assetExposure: VaultExposureAsset[] = analytics.assetPerformance
    .map((asset) => ({
      assetId: asset.assetId,
      valueUsd: roundLedger(asset.totalHeldUsd),
      sharePct: totalValueUsd > 0 ? roundLedger((asset.totalHeldUsd / totalValueUsd) * 100) : 0,
      priceChangePct30d: asset.priceChangePct30d,
    }))
    .sort((a, b) => b.valueUsd - a.valueUsd);

  const tierExposure: VaultExposureTier[] = liquidity.tierBreakdown
    .map((tier) => ({
      tier: tier.tier,
      valueUsd: roundLedger(tier.totalUsd),
      sharePct: roundLedger(tier.sharePct),
      unlockProfile: exposureUnlockProfile(tier.tier),
    }))
    .sort((a, b) => b.valueUsd - a.valueUsd);

  const dominantAsset = assetExposure[0]?.assetId ?? risk.dominantAsset;
  const dominantTier = tierExposure[0]?.tier ?? 'warm';
  const instantExposurePct = totalValueUsd > 0
    ? roundLedger((liquidity.instantLiquidityUsd / totalValueUsd) * 100)
    : 0;
  const lockedExposureUsd = liquidity.tierBreakdown.reduce((sum, tier) => sum + tier.lockedUsd, 0);
  const lockedExposurePct = totalValueUsd > 0
    ? roundLedger((lockedExposureUsd / totalValueUsd) * 100)
    : 0;
  const concentrationRisk = attributionRisk(Math.max(
    risk.singleAssetMaxPct,
    tierExposure[0]?.sharePct ?? 0,
  ));

  const mitigationActions: string[] = [
    `Pratiti dominantni asset ${dominantAsset} i održavati ga ispod 60% ukupne izloženosti.`,
    `Održavati instant exposure iznad 15% ukupnog portfolia (trenutno ${instantExposurePct.toFixed(2)}%).`,
    `Zaključana izloženost od ${lockedExposurePct.toFixed(2)}% treba biti usklađena sa planiranim isplatama i time-lock politikom.`,
  ];
  if (concentrationRisk !== 'low') {
    mitigationActions.push('Pokrenuti rebalance ili dodatne depozite u slabije zastupljene assete/tierove radi smanjenja koncentracije.');
  }

  return {
    userId,
    totalValueUsd,
    assetExposure,
    tierExposure,
    dominantAsset,
    dominantTier,
    instantExposurePct,
    lockedExposurePct,
    concentrationRisk,
    mitigationActions,
    timestamp: new Date().toISOString(),
  };
}

/** Gradi allocation izvještaj — poredi trenutnu raspodjelu sa ciljanim asset i tier miksom. */
export function buildVaultAllocationReport(userId: string): VaultAllocationReport {
  const analytics = buildVaultAnalyticsReport(userId);
  const rebalance = buildVaultRebalanceReport(userId);
  const attribution = buildVaultAttributionReport(userId);

  const totalValueUsd = Math.max(analytics.totalValueUsd, 0);
  const totalAnnualYieldUsd = Math.max(analytics.totalEstimatedAnnualYieldUsd, 0);

  const assetAllocations: VaultAssetAllocation[] = analytics.assetPerformance
    .map((asset) => {
      const currentPct = totalValueUsd > 0 ? roundLedger((asset.totalHeldUsd / totalValueUsd) * 100) : 0;
      const targetPct = VAULT_TARGET_ASSET_ALLOCATION[asset.assetId] ?? 0;
      return {
        assetId: asset.assetId,
        valueUsd: roundLedger(asset.totalHeldUsd),
        annualYieldUsd: roundLedger(asset.totalHeldUsd * (analytics.portfolioAprPct / 100)),
        currentPct,
        targetPct,
        deviationPct: roundLedger(currentPct - targetPct),
      };
    })
    .sort((a, b) => Math.abs(b.deviationPct) - Math.abs(a.deviationPct));

  const overweight = assetAllocations
    .filter((asset) => asset.deviationPct > 0)
    .sort((a, b) => b.deviationPct - a.deviationPct)[0];
  const underweight = assetAllocations
    .filter((asset) => asset.deviationPct < 0)
    .sort((a, b) => a.deviationPct - b.deviationPct)[0];

  const mostOverweightAsset = overweight?.assetId ?? attribution.topAssetContributor;
  const mostUnderweightAsset = underweight?.assetId ?? 'USDT';
  const suggestedShiftUsd = roundLedger(Math.max(
    overweight?.deviationPct ?? 0,
    Math.abs(underweight?.deviationPct ?? 0),
  ) / 100 * totalValueUsd);

  const actions: string[] = [
    `Smanjiti overweight poziciju u assetu ${mostOverweightAsset} prema ciljanoj raspodjeli od ${VAULT_TARGET_ASSET_ALLOCATION[mostOverweightAsset] ?? 0}%.`,
    `Povećati alokaciju prema assetu ${mostUnderweightAsset} kako bi se približila ciljanoj raspodjeli.`,
    `Tier raspodjelu uskladiti sa ciljem ${rebalance.tierAllocations.map((tier) => `${tier.tier}:${tier.targetPct}%`).join(', ')}.`,
  ];
  if (!rebalance.isBalanced) {
    actions.push(`Procijenjeni prioritetni shift iznosi oko ${suggestedShiftUsd.toFixed(2)} USD uz oslanjanje na postojeće rebalance prijedloge.`);
  }

  return {
    userId,
    totalValueUsd,
    totalAnnualYieldUsd,
    assetAllocations,
    tierAllocations: rebalance.tierAllocations,
    mostOverweightAsset,
    mostUnderweightAsset,
    suggestedShiftUsd,
    actions,
    timestamp: new Date().toISOString(),
  };
}

/** Gradi performance izvještaj — PnL, return i annualized return po periodu i assetu. */
export function buildVaultPerformanceReport(userId: string): VaultPerformanceReport {
  const analytics = buildVaultAnalyticsReport(userId);
  const benchmark = buildVaultBenchmarkReport(userId);

  const totalValueUsd = Math.max(analytics.totalValueUsd, 0);
  const portfolioAprPct = Math.max(analytics.portfolioAprPct, 0);

  // PnL po assetu na osnovu 7d price change iz analytics-a
  const assetPerformance: VaultAssetPerformanceEntry[] = analytics.assetPerformance.map((asset) => {
    const returnPct = asset.priceChangePct7d;
    const pnlUsd = roundLedger(asset.totalHeldUsd * (returnPct / 100));
    const contributionPct = totalValueUsd > 0 ? roundLedger((asset.totalHeldUsd / totalValueUsd) * returnPct) : 0;
    return {
      assetId: asset.assetId,
      valueUsd: roundLedger(asset.totalHeldUsd),
      pnlUsd,
      returnPct: roundLedger(returnPct),
      contributionPct,
    };
  }).sort((a, b) => b.returnPct - a.returnPct);

  const totalPnlUsd = roundLedger(assetPerformance.reduce((sum, a) => sum + a.pnlUsd, 0));
  const totalReturnPct = totalValueUsd > 0 ? roundLedger((totalPnlUsd / ((totalValueUsd - totalPnlUsd) || 1)) * 100) : 0;

  // Period returns koristeći vault return polja iz benchmark reporta
  const periodReturns: VaultPeriodReturn[] = (['7d', '30d', '90d', '365d'] as PerformancePeriod[]).map((period) => {
    const periodReturn =
      period === '7d' ? benchmark.vaultReturn7dPct
      : period === '30d' ? benchmark.vaultReturn30dPct
      : period === '90d' ? benchmark.vaultReturn90dPct
      : benchmark.vaultReturn365dPct;
    const days = PERIOD_DAYS[period];
    const annualizedReturnPct = roundLedger(periodReturn * (365 / days));
    const startValueUsd = roundLedger(totalValueUsd / (1 + periodReturn / 100));
    return {
      period,
      startValueUsd,
      endValueUsd: totalValueUsd,
      pnlUsd: roundLedger(totalValueUsd - startValueUsd),
      returnPct: roundLedger(periodReturn),
      annualizedReturnPct,
    };
  });

  const bestPeriod = periodReturns.reduce((best, p) => p.returnPct > best.returnPct ? p : best, periodReturns[0]).period;
  const worstPeriod = periodReturns.reduce((worst, p) => p.returnPct < worst.returnPct ? p : worst, periodReturns[0]).period;
  const annualizedReturnPct = periodReturns.find((p) => p.period === '365d')?.annualizedReturnPct ?? portfolioAprPct;

  const insights: string[] = [
    `Ukupni PnL iznosi ${totalPnlUsd >= 0 ? '+' : ''}${totalPnlUsd.toFixed(2)} USD (${totalReturnPct >= 0 ? '+' : ''}${totalReturnPct.toFixed(2)}%).`,
    `Annualized return vaulta: ${annualizedReturnPct.toFixed(2)}% godišnje, portfolio APR: ${portfolioAprPct.toFixed(2)}%.`,
    `Najbolji asset po performansi: ${assetPerformance[0]?.assetId ?? 'N/A'} (${assetPerformance[0]?.returnPct?.toFixed(2) ?? 0}% 7d return).`,
    `Najslabiji period: ${worstPeriod} uz return ${periodReturns.find((p) => p.period === worstPeriod)?.returnPct?.toFixed(2) ?? 0}%.`,
  ];

  return {
    userId,
    totalValueUsd,
    totalPnlUsd,
    totalReturnPct,
    annualizedReturnPct,
    portfolioAprPct,
    assetPerformance,
    periodReturns,
    bestPeriod,
    worstPeriod,
    insights,
    timestamp: new Date().toISOString(),
  };
}

// ─── Vault Yield (#1220) ──────────────────────────────────────────────────────

export type YieldHorizon = '30d' | '90d' | '365d';
export type CompoundFrequency = 'daily' | 'weekly' | 'monthly';

export interface VaultAssetYield {
  assetId: string;
  tier: VaultTier;
  principalUsd: number;
  aprPct: number;
  yieldSource: string;
  compoundFrequency: CompoundFrequency;
  dailyRewardUsd: number;
  weeklyRewardUsd: number;
  monthlyRewardUsd: number;
  annualRewardUsd: number;
  accumulatedLast30dUsd: number;
}

export interface VaultYieldProjection {
  horizon: YieldHorizon;
  projectedPrincipalUsd: number;
  projectedRewardUsd: number;
  projectedTotalUsd: number;
  effectiveAprPct: number;
}

export interface VaultYieldReport {
  userId: string;
  totalPrincipalUsd: number;
  weightedAprPct: number;
  totalDailyRewardUsd: number;
  totalWeeklyRewardUsd: number;
  totalMonthlyRewardUsd: number;
  totalAnnualRewardUsd: number;
  totalAccumulatedLast30dUsd: number;
  assetYields: VaultAssetYield[];
  projections: VaultYieldProjection[];
  insights: string[];
  timestamp: string;
}

const COMPOUND_FREQ: Record<VaultTier, CompoundFrequency> = {
  hot: 'daily',
  warm: 'weekly',
  cold: 'weekly',
  'deep-cold': 'monthly',
};

const YIELD_HORIZON_DAYS: Record<YieldHorizon, number> = {
  '30d': 30,
  '90d': 90,
  '365d': 365,
};

/** Gradi yield/staking reward izvještaj za vault portfolio korisnika. */
export function buildVaultYieldReport(userId: string): VaultYieldReport {
  const analytics = buildVaultAnalyticsReport(userId);
  const vault = buildVaultStatusReport(userId);
  const totalPrincipalUsd = Math.max(analytics.totalValueUsd, 0);

  // Aggregate per-asset-tier principal using vault accounts
  const assetTierMap: Record<string, { tier: VaultTier; principalUsd: number }[]> = {};
  for (const account of vault.accounts) {
    const price = VAULT_ASSET_PRICES_USD[account.assetId] ?? 1;
    const principalUsd = roundLedger((account.locked + account.unlocking + account.available) * price);
    if (principalUsd <= 0) continue;
    if (!assetTierMap[account.assetId]) assetTierMap[account.assetId] = [];
    const existing = assetTierMap[account.assetId].find((e) => e.tier === account.tier);
    if (existing) {
      existing.principalUsd = roundLedger(existing.principalUsd + principalUsd);
    } else {
      assetTierMap[account.assetId].push({ tier: account.tier, principalUsd });
    }
  }

  // Build per-asset yield entries (dominant tier = tier with largest balance)
  const assetYields: VaultAssetYield[] = Object.entries(assetTierMap).map(([assetId, entries]) => {
    const dominant = entries.reduce((best, e) => e.principalUsd > best.principalUsd ? e : best, entries[0]);
    const tier = dominant.tier;
    const aprPct = VAULT_TIER_APR[tier];
    const yieldSource = VAULT_TIER_YIELD_SOURCE[tier];
    const compoundFrequency = COMPOUND_FREQ[tier];
    const principalUsd = roundLedger(entries.reduce((s, e) => s + e.principalUsd, 0));
    const annualRewardUsd = roundLedger(principalUsd * (aprPct / 100));
    const dailyRewardUsd = roundLedger(annualRewardUsd / 365);
    const weeklyRewardUsd = roundLedger(annualRewardUsd / 52);
    const monthlyRewardUsd = roundLedger(annualRewardUsd / 12);
    const accumulatedLast30dUsd = roundLedger(monthlyRewardUsd);
    return {
      assetId,
      tier,
      principalUsd,
      aprPct,
      yieldSource,
      compoundFrequency,
      dailyRewardUsd,
      weeklyRewardUsd,
      monthlyRewardUsd,
      annualRewardUsd,
      accumulatedLast30dUsd,
    };
  }).sort((a, b) => b.annualRewardUsd - a.annualRewardUsd);

  const totalAnnualRewardUsd = roundLedger(assetYields.reduce((s, a) => s + a.annualRewardUsd, 0));
  const totalDailyRewardUsd = roundLedger(totalAnnualRewardUsd / 365);
  const totalWeeklyRewardUsd = roundLedger(totalAnnualRewardUsd / 52);
  const totalMonthlyRewardUsd = roundLedger(totalAnnualRewardUsd / 12);
  const totalAccumulatedLast30dUsd = roundLedger(totalMonthlyRewardUsd);
  const weightedAprPct = totalPrincipalUsd > 0
    ? roundLedger((totalAnnualRewardUsd / totalPrincipalUsd) * 100)
    : 0;

  const projections: VaultYieldProjection[] = (['30d', '90d', '365d'] as YieldHorizon[]).map((horizon) => {
    const days = YIELD_HORIZON_DAYS[horizon];
    const dailyRate = weightedAprPct / 100 / 365;
    const projectedTotalUsd = roundLedger(totalPrincipalUsd * Math.pow(1 + dailyRate, days));
    const projectedRewardUsd = roundLedger(projectedTotalUsd - totalPrincipalUsd);
    const effectiveAprPct = days > 0 ? roundLedger((projectedRewardUsd / (totalPrincipalUsd || 1)) * (365 / days) * 100) : weightedAprPct;
    return {
      horizon,
      projectedPrincipalUsd: totalPrincipalUsd,
      projectedRewardUsd,
      projectedTotalUsd,
      effectiveAprPct,
    };
  });

  const topAsset = assetYields[0];
  const insights: string[] = [
    `Portfolio yield: ${totalAnnualRewardUsd.toFixed(2)} USD godišnje pri weighted APR-u od ${weightedAprPct.toFixed(2)}%.`,
    `Dnevni prinos: ~${totalDailyRewardUsd.toFixed(4)} USD, mjesečni: ~${totalMonthlyRewardUsd.toFixed(2)} USD.`,
    `Najinosniji asset: ${topAsset?.assetId ?? 'N/A'} — ${topAsset?.annualRewardUsd?.toFixed(2) ?? '0'} USD/godišnje (APR: ${topAsset?.aprPct?.toFixed(2) ?? 0}%).`,
    `Procijenjeni prinos za 365d uz compounding: +${projections.find((p) => p.horizon === '365d')?.projectedRewardUsd?.toFixed(2) ?? '0'} USD.`,
  ];

  return {
    userId,
    totalPrincipalUsd,
    weightedAprPct,
    totalDailyRewardUsd,
    totalWeeklyRewardUsd,
    totalMonthlyRewardUsd,
    totalAnnualRewardUsd,
    totalAccumulatedLast30dUsd,
    assetYields,
    projections,
    insights,
    timestamp: new Date().toISOString(),
  };
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

// ─── Vault Governance ────────────────────────────────────────────────────────

export type VaultProposalStatus = 'active' | 'passed' | 'rejected' | 'executed' | 'expired';

export interface VaultGovernanceProposal {
  proposalId:    string;
  title:         string;
  description:   string;
  proposedBy:    string;
  status:        VaultProposalStatus;
  votesFor:      number;
  votesAgainst:  number;
  quorumPct:     number;
  reachedQuorum: boolean;
  createdAt:     string;
  expiresAt:     string;
  executedAt:    string | null;
  category:      'time-lock' | 'multi-sig' | 'limits' | 'assets' | 'compliance';
  parameterChanges: Array<{ param: string; from: string; to: string }>;
}

export interface VaultGovernanceSummary {
  totalProposals:  number;
  activeProposals: number;
  passedTotal:     number;
  rejectedTotal:   number;
  executedTotal:   number;
  avgTurnoutPct:   number;
}

export interface VaultGovernanceReport {
  userId:     string;
  votingPower: number;
  summary:    VaultGovernanceSummary;
  proposals:  VaultGovernanceProposal[];
  timestamp:  string;
}

const GOVERNANCE_PROPOSALS: Omit<VaultGovernanceProposal, 'proposedBy'>[] = [
  {
    proposalId:      'GOV-2026-001',
    title:           'Smanjenje time-lock Hot Tiera na 0 dana',
    description:     'Prijedlog za uklanjanje minimalnog time-lock perioda iz Hot Tiera radi bolje instant likvidnosti za male iznose.',
    status:          'executed',
    votesFor:        1240,
    votesAgainst:    185,
    quorumPct:       67.0,
    reachedQuorum:   true,
    createdAt:       '2026-01-10T09:00:00.000Z',
    expiresAt:       '2026-01-17T09:00:00.000Z',
    executedAt:      '2026-01-18T14:30:00.000Z',
    category:        'time-lock',
    parameterChanges: [
      { param: 'hot.timeLockDays', from: '0.5', to: '0' },
    ],
  },
  {
    proposalId:      'GOV-2026-002',
    title:           'Povećanje KYC praga na $25,000 USD',
    description:     'Prijedlog da se KYC verifikacija zahtijeva tek za isplate iznad $25,000 USD umjesto $10,000 USD.',
    status:          'rejected',
    votesFor:        640,
    votesAgainst:    920,
    quorumPct:       59.3,
    reachedQuorum:   true,
    createdAt:       '2026-02-01T09:00:00.000Z',
    expiresAt:       '2026-02-08T09:00:00.000Z',
    executedAt:      null,
    category:        'compliance',
    parameterChanges: [
      { param: 'global.kycRequiredAboveUsd', from: '10000', to: '25000' },
    ],
  },
  {
    proposalId:      'GOV-2026-003',
    title:           'Dodavanje MATIC kao podržanog aseta',
    description:     'Prijedlog za dodavanje Polygon (MATIC) u listu podržanih vault aseta sa minimalnim depozitom 100 MATIC.',
    status:          'passed',
    votesFor:        1580,
    votesAgainst:    210,
    quorumPct:       72.5,
    reachedQuorum:   true,
    createdAt:       '2026-03-05T09:00:00.000Z',
    expiresAt:       '2026-03-12T09:00:00.000Z',
    executedAt:      null,
    category:        'assets',
    parameterChanges: [
      { param: 'global.supportedAssets', from: 'BTC,ETH,SOL,USDT,SPAJA', to: 'BTC,ETH,SOL,USDT,SPAJA,MATIC' },
    ],
  },
  {
    proposalId:      'GOV-2026-004',
    title:           'Smanjenje Warm Tier multi-sig praga na 1-of-3',
    description:     'Prijedlog za smanjenje obaveznog broja potpisa za Warm Tier sa 2-of-3 na 1-of-3 radi operativne fleksibilnosti.',
    status:          'active',
    votesFor:        420,
    votesAgainst:    380,
    quorumPct:       32.1,
    reachedQuorum:   false,
    createdAt:       '2026-05-08T09:00:00.000Z',
    expiresAt:       '2026-05-15T09:00:00.000Z',
    executedAt:      null,
    category:        'multi-sig',
    parameterChanges: [
      { param: 'warm.multiSigThreshold', from: '2', to: '1' },
    ],
  },
  {
    proposalId:      'GOV-2026-005',
    title:           'Povećanje Cold Tier dnevnog limita na $200,000 USD',
    description:     'Prijedlog za povećanje maksimalnog dnevnog iznosa isplate iz Cold Tiera sa $100,000 na $200,000 USD.',
    status:          'active',
    votesFor:        890,
    votesAgainst:    310,
    quorumPct:       48.7,
    reachedQuorum:   false,
    createdAt:       '2026-05-10T09:00:00.000Z',
    expiresAt:       '2026-05-17T09:00:00.000Z',
    executedAt:      null,
    category:        'limits',
    parameterChanges: [
      { param: 'cold.maxDailyWithdrawUsd', from: '100000', to: '200000' },
    ],
  },
];

/** Gradi governance izvještaj sa prijedlozima i glasačkom moći korisnika. */
export function buildVaultGovernanceReport(userId: string): VaultGovernanceReport {
  const proposals: VaultGovernanceProposal[] = GOVERNANCE_PROPOSALS.map((p) => ({
    ...p,
    proposedBy: p.status === 'active' ? 'community' : 'spaja-governance-council',
  }));

  const activeProposals  = proposals.filter((p) => p.status === 'active').length;
  const passedTotal      = proposals.filter((p) => p.status === 'passed' || p.status === 'executed').length;
  const rejectedTotal    = proposals.filter((p) => p.status === 'rejected').length;
  const executedTotal    = proposals.filter((p) => p.status === 'executed').length;
  const totalTurnout     = proposals.reduce((s, p) => s + p.votesFor + p.votesAgainst, 0);
  const maxTurnout       = proposals.length * 2_000;
  const avgTurnoutPct    = Math.round((totalTurnout / maxTurnout) * 100 * 10) / 10;

  const summary: VaultGovernanceSummary = {
    totalProposals: proposals.length,
    activeProposals,
    passedTotal,
    rejectedTotal,
    executedTotal,
    avgTurnoutPct,
  };

  const seed         = userId.split('').reduce((s, c) => s + c.charCodeAt(0), 0);
  const votingPower  = Math.round(100 + (seed % 4_900));

  return {
    userId,
    votingPower,
    summary,
    proposals,
    timestamp: new Date().toISOString(),
  };
}

// ─── Autofinish #1221 — Kripto Trezor Vault Governance ───────────────────────
// VaultGovernanceReport + buildVaultGovernanceReport dodati u trezor.ts.
// Feature flag: kripto-trezor-governance. Nova ruta: GET /api/kripto-trezor/governance.
// APP_VERSION=49.0.0 | AUTOFINISH_COUNT=1221 | TOTAL_API_ROUTES=1088 | TOTAL_ROUTES=1149

// ─── Vault Compliance ─────────────────────────────────────────────────────────

export type VaultComplianceStatus = 'compliant' | 'warning' | 'breach';

export interface VaultComplianceCheck {
  id:             string;
  title:          string;
  status:         VaultComplianceStatus;
  severity:       'low' | 'medium' | 'high' | 'critical';
  lastCheckedAt:  string;
  details:        string;
  requiredAction: string | null;
}

export interface VaultComplianceSummary {
  totalChecks:      number;
  compliantChecks:  number;
  warningChecks:    number;
  breachChecks:     number;
  overallScore:     number;
}

export interface VaultComplianceReport {
  userId:     string;
  summary:    VaultComplianceSummary;
  checks:     VaultComplianceCheck[];
  controls:   {
    amlEnabled: boolean;
    kycTier: 'basic' | 'advanced' | 'institutional';
    sanctionsScreeningIntervalHours: number;
    travelRuleEnabled: boolean;
  };
  timestamp:  string;
}

/** Gradi compliance izvještaj za vault: AML/KYC/sanctions kontrole i status provjera. */
export function buildVaultComplianceReport(userId: string): VaultComplianceReport {
  const seed = userId.split('').reduce((s, c) => s + c.charCodeAt(0), 0);
  const kycTier: VaultComplianceReport['controls']['kycTier'] =
    seed % 3 === 0 ? 'institutional' : seed % 2 === 0 ? 'advanced' : 'basic';

  const checks: VaultComplianceCheck[] = [
    {
      id: 'kyc-refresh',
      title: 'KYC dokumentacija ažurirana',
      status: 'compliant',
      severity: 'medium',
      lastCheckedAt: '2026-05-10T08:00:00.000Z',
      details: 'Svi obavezni KYC dokumenti su validni i ne isteknu u narednih 30 dana.',
      requiredAction: null,
    },
    {
      id: 'sanctions-screening',
      title: 'Sanctions screening adresa',
      status: 'compliant',
      severity: 'high',
      lastCheckedAt: '2026-05-11T07:00:00.000Z',
      details: 'Nema pogodaka na OFAC/EU listama za aktivne withdrawal adrese.',
      requiredAction: null,
    },
    {
      id: 'aml-patterns',
      title: 'AML monitoring transakcijskih obrazaca',
      status: 'warning',
      severity: 'medium',
      lastCheckedAt: '2026-05-11T09:30:00.000Z',
      details: 'Uočen je pojačan broj transfera blizu internog AML praga u poslednja 24h.',
      requiredAction: 'Pokrenuti enhanced due diligence za narednu veću isplatu.',
    },
    {
      id: 'travel-rule',
      title: 'Travel Rule metadata kompletnost',
      status: seed % 5 === 0 ? 'breach' : 'compliant',
      severity: seed % 5 === 0 ? 'critical' : 'low',
      lastCheckedAt: '2026-05-11T10:00:00.000Z',
      details: seed % 5 === 0
        ? 'Nedostaje originator beneficiary metadata za deo outbound transfera.'
        : 'Travel Rule payload je kompletan za sve transfer događaje.',
      requiredAction: seed % 5 === 0
        ? 'Blokirati nove outbound transfere dok se metadata ne dopuni.'
        : null,
    },
  ];

  const compliantChecks = checks.filter((c) => c.status === 'compliant').length;
  const warningChecks   = checks.filter((c) => c.status === 'warning').length;
  const breachChecks    = checks.filter((c) => c.status === 'breach').length;
  const totalChecks     = checks.length;
  const overallScore    = Math.max(0, 100 - warningChecks * 12 - breachChecks * 35);

  return {
    userId,
    summary: {
      totalChecks,
      compliantChecks,
      warningChecks,
      breachChecks,
      overallScore,
    },
    checks,
    controls: {
      amlEnabled: true,
      kycTier,
      sanctionsScreeningIntervalHours: 6,
      travelRuleEnabled: true,
    },
    timestamp: new Date().toISOString(),
  };
}

// ─── Autofinish #1222 — Kripto Trezor Vault Compliance ───────────────────────
// VaultComplianceReport + buildVaultComplianceReport dodati u trezor.ts.
// Feature flag: kripto-trezor-compliance. Nova ruta: GET /api/kripto-trezor/compliance.
// APP_VERSION=49.1.0 | AUTOFINISH_COUNT=1222 | TOTAL_API_ROUTES=1089 | TOTAL_ROUTES=1150

// ─── Autofinish #1225 — Kripto Trezor Vault Insurance ────────────────────────

export type VaultInsuranceCoverageType =
  | 'cold-storage'
  | 'hot-wallet'
  | 'smart-contract'
  | 'custodian-failure'
  | 'cyber-theft';

export type VaultInsuranceClaimStatus =
  | 'no-claim'
  | 'under-review'
  | 'approved'
  | 'rejected'
  | 'paid';

export interface VaultInsuranceCoverage {
  type: VaultInsuranceCoverageType;
  label: string;
  maxCoverageUsd: number;
  premiumAnnualPct: number;
  deductibleUsd: number;
  active: boolean;
}

export interface VaultInsuranceClaim {
  id: string;
  coverageType: VaultInsuranceCoverageType;
  amountUsd: number;
  filedAt: string;
  status: VaultInsuranceClaimStatus;
  description: string;
}

export interface VaultInsuranceSummary {
  totalCoverageUsd: number;
  activePolicies: number;
  inactivePolicies: number;
  totalAnnualPremiumUsd: number;
  openClaims: number;
  paidClaimsUsd: number;
  insuranceScore: number;
}

export interface VaultInsuranceReport {
  userId: string;
  summary: VaultInsuranceSummary;
  coverages: VaultInsuranceCoverage[];
  claims: VaultInsuranceClaim[];
  recommendations: string[];
  timestamp: string;
}

/** Gradi insurance izvještaj za vault: pokrivenost, premije i status zahtjeva. */
export function buildVaultInsuranceReport(userId: string): VaultInsuranceReport {
  const seed = userId.split('').reduce((s, c) => s + c.charCodeAt(0), 0);

  const coverages: VaultInsuranceCoverage[] = [
    {
      type: 'cold-storage',
      label: 'Cold Storage Pokrivenost',
      maxCoverageUsd: 5_000_000,
      premiumAnnualPct: 0.25,
      deductibleUsd: 10_000,
      active: true,
    },
    {
      type: 'hot-wallet',
      label: 'Hot Wallet Pokrivenost',
      maxCoverageUsd: 500_000,
      premiumAnnualPct: 1.2,
      deductibleUsd: 5_000,
      active: true,
    },
    {
      type: 'smart-contract',
      label: 'Smart Contract Rizik',
      maxCoverageUsd: 1_000_000,
      premiumAnnualPct: 0.8,
      deductibleUsd: 20_000,
      active: seed % 3 !== 0,
    },
    {
      type: 'custodian-failure',
      label: 'Custodian Neuspjeh',
      maxCoverageUsd: 2_000_000,
      premiumAnnualPct: 0.5,
      deductibleUsd: 15_000,
      active: true,
    },
    {
      type: 'cyber-theft',
      label: 'Cyber Krađa i Hakovanje',
      maxCoverageUsd: 3_000_000,
      premiumAnnualPct: 0.95,
      deductibleUsd: 25_000,
      active: seed % 2 === 0,
    },
  ];

  const activePolicies  = coverages.filter((c) => c.active).length;
  const inactivePolicies = coverages.filter((c) => !c.active).length;
  const totalCoverageUsd = coverages
    .filter((c) => c.active)
    .reduce((s, c) => s + c.maxCoverageUsd, 0);
  const totalAnnualPremiumUsd = roundLedger(
    coverages
      .filter((c) => c.active)
      .reduce((s, c) => s + c.maxCoverageUsd * (c.premiumAnnualPct / 100), 0),
  );

  const claimStatus: VaultInsuranceClaimStatus = seed % 7 === 0 ? 'under-review' : 'no-claim';
  const claimDate = new Date(Date.now() - (seed % 7) * 24 * 60 * 60 * 1000).toISOString();
  const claims: VaultInsuranceClaim[] = claimStatus === 'under-review'
    ? [
        {
          id: `clm-${seed % 10000}`,
          coverageType: 'cyber-theft',
          amountUsd: 45_000,
          filedAt: claimDate,
          status: 'under-review',
          description: 'Sumnjiva aktivnost na hot wallet adresi — istraga u toku.',
        },
      ]
    : [];

  const openClaims   = claims.filter((c) => c.status === 'under-review').length;
  const paidClaimsUsd = 0;
  const insuranceScore = Math.max(
    0,
    100 - inactivePolicies * 10 - openClaims * 15,
  );

  const recommendations: string[] = [];
  if (inactivePolicies > 0) {
    recommendations.push('Aktivirati sve neaktivne police za potpunu zaštitu vault imovine.');
  }
  if (openClaims > 0) {
    recommendations.push('Pratiti status otvorenih zahtjeva i dostaviti svu traženu dokumentaciju.');
  }
  if (insuranceScore < 80) {
    recommendations.push('Razmotriti povećanje pokrivenosti cyber-theft i smart-contract policyja.');
  }
  if (recommendations.length === 0) {
    recommendations.push('Sve police su aktivne i nema otvorenih zahtjeva — vault je optimalno zaštićen.');
  }

  return {
    userId,
    summary: {
      totalCoverageUsd,
      activePolicies,
      inactivePolicies,
      totalAnnualPremiumUsd,
      openClaims,
      paidClaimsUsd,
      insuranceScore,
    },
    coverages,
    claims,
    recommendations,
    timestamp: new Date().toISOString(),
  };
}

// ─── Autofinish #1225 — Kripto Trezor Vault Insurance ────────────────────────
// VaultInsuranceReport + buildVaultInsuranceReport dodati u trezor.ts.
// Feature flag: kripto-trezor-insurance. Nova ruta: GET /api/kripto-trezor/insurance.
// APP_VERSION=49.4.0 | AUTOFINISH_COUNT=1225 | TOTAL_API_ROUTES=1094 | TOTAL_ROUTES=1156

// ─── Vault Diversification ────────────────────────────────────────────────────

export type DiversificationAssetClass =
  | 'btc'
  | 'eth'
  | 'stablecoins'
  | 'altcoins'
  | 'defi'
  | 'nft'
  | 'rwa';

export interface VaultDiversificationSlice {
  assetClass: DiversificationAssetClass;
  label: string;
  valueUsd: number;
  weightPct: number;
  targetWeightPct: number;
  deviation: number;
  status: 'balanced' | 'overweight' | 'underweight';
}

export interface VaultDiversificationSummary {
  totalValueUsd: number;
  numberOfAssetClasses: number;
  herfindahlIndex: number;
  diversificationScore: number;
  maxSingleWeightPct: number;
  balancedSlices: number;
  rebalanceNeeded: boolean;
}

export interface VaultDiversificationReport {
  userId: string;
  summary: VaultDiversificationSummary;
  slices: VaultDiversificationSlice[];
  recommendations: string[];
  timestamp: string;
}

/** Gradi diversification izvještaj za vault: raspodjela po asset klasama, HHI i preporuke. */
export function buildVaultDiversificationReport(userId: string): VaultDiversificationReport {
  // HHI > 0.25 označava visoku koncentraciju portfolio-a prema standardu OECD/DOJ smjernica
  const HHI_CONCENTRATION_THRESHOLD = 0.25;
  const seed = userId.split('').reduce((s, c) => s + c.charCodeAt(0), 0);

  const rawSlices: { assetClass: DiversificationAssetClass; label: string; rawWeight: number; targetPct: number }[] = [
    { assetClass: 'btc',         label: 'Bitcoin (BTC)',        rawWeight: 30 + (seed % 15),     targetPct: 35 },
    { assetClass: 'eth',         label: 'Ethereum (ETH)',       rawWeight: 20 + (seed % 10),     targetPct: 25 },
    { assetClass: 'stablecoins', label: 'Stablecoins',          rawWeight: 15 + (seed % 8),      targetPct: 15 },
    { assetClass: 'altcoins',    label: 'Altcoins',             rawWeight: 10 + (seed % 7),      targetPct: 10 },
    { assetClass: 'defi',        label: 'DeFi Protokoli',       rawWeight: 8  + (seed % 5),      targetPct: 8  },
    { assetClass: 'nft',         label: 'NFT i Digitalna Imovina', rawWeight: 5 + (seed % 4),   targetPct: 4  },
    { assetClass: 'rwa',         label: 'Real-World Assets',    rawWeight: 3  + (seed % 3),      targetPct: 3  },
  ];

  const totalRaw = rawSlices.reduce((s, r) => s + r.rawWeight, 0);
  const totalValueUsd = 1_200_000 + (seed % 800_000);

  const slices: VaultDiversificationSlice[] = rawSlices.map((r) => {
    const weightPct = roundLedger((r.rawWeight / totalRaw) * 100);
    const deviation = roundLedger(weightPct - r.targetPct);
    const status: VaultDiversificationSlice['status'] =
      Math.abs(deviation) <= 2 ? 'balanced' : deviation > 0 ? 'overweight' : 'underweight';
    return {
      assetClass: r.assetClass,
      label: r.label,
      valueUsd: roundLedger((weightPct / 100) * totalValueUsd),
      weightPct,
      targetWeightPct: r.targetPct,
      deviation,
      status,
    };
  });

  const maxSingleWeightPct = Math.max(...slices.map((s) => s.weightPct));
  const herfindahlIndex = roundLedger(
    slices.reduce((s, sl) => s + Math.pow(sl.weightPct / 100, 2), 0),
  );
  const balancedSlices = slices.filter((s) => s.status === 'balanced').length;
  const rebalanceNeeded = slices.some((s) => s.status !== 'balanced');
  const diversificationScore = Math.max(
    0,
    Math.round(100 - herfindahlIndex * 100 - (slices.length - balancedSlices) * 4),
  );

  const recommendations: string[] = [];
  for (const s of slices) {
    if (s.status === 'overweight') {
      recommendations.push(`Smanjiti ${s.label} sa ${s.weightPct}% na ciljanih ${s.targetWeightPct}% (prekomjerno +${s.deviation}%).`);
    } else if (s.status === 'underweight') {
      recommendations.push(`Povećati ${s.label} sa ${s.weightPct}% na ciljanih ${s.targetWeightPct}% (nedostatak ${s.deviation}%).`);
    }
  }
  if (!rebalanceNeeded) {
    recommendations.push('Portfolio je u okviru ciljane raspodjele — nije potreban rebalans.');
  }
  if (herfindahlIndex > HHI_CONCENTRATION_THRESHOLD) {
    recommendations.push(`Visoka koncentracija portfolio-a (HHI > ${HHI_CONCENTRATION_THRESHOLD}) — razmotriti povećanje diversifikacije.`);
  }

  return {
    userId,
    summary: {
      totalValueUsd,
      numberOfAssetClasses: slices.length,
      herfindahlIndex,
      diversificationScore,
      maxSingleWeightPct,
      balancedSlices,
      rebalanceNeeded,
    },
    slices,
    recommendations,
    timestamp: new Date().toISOString(),
  };
}

// ─── Autofinish #1226 — Kripto Trezor Vault Diversification ──────────────────
// VaultDiversificationReport + buildVaultDiversificationReport dodati u trezor.ts.
// Feature flag: kripto-trezor-diversification. Nova ruta: GET /api/kripto-trezor/diversification.
// APP_VERSION=49.5.0 | AUTOFINISH_COUNT=1226 | TOTAL_API_ROUTES=1095 | TOTAL_ROUTES=1157

// ─── Vault Collateral ─────────────────────────────────────────────────────────

export type CollateralAssetClass = 'btc' | 'eth' | 'stablecoin' | 'cbdc' | 'tokenized-bond' | 'lp-token';
export type CollateralStatus = 'healthy' | 'margin-call' | 'liquidation-risk' | 'liquidated';

export interface VaultCollateralPosition {
  id: string;
  assetClass: CollateralAssetClass;
  label: string;
  collateralValueUsd: number;
  loanValueUsd: number;
  ltv: number;
  maxLtv: number;
  liquidationLtv: number;
  status: CollateralStatus;
  healthFactor: number;
}

export interface VaultCollateralSummary {
  totalCollateralUsd: number;
  totalLoanUsd: number;
  weightedLtv: number;
  healthyPositions: number;
  marginCallPositions: number;
  liquidationRiskPositions: number;
  liquidatedPositions: number;
  overallHealthFactor: number;
  collateralScore: number;
}

export interface VaultCollateralReport {
  userId: string;
  summary: VaultCollateralSummary;
  positions: VaultCollateralPosition[];
  recommendations: string[];
  timestamp: string;
}

/** LTV pri kojoj se pozicija smatra u zoni likvidacije (85%). */
const VAULT_COLLATERAL_LIQUIDATION_LTV = 0.85;
/** LTV pri kojoj se aktivira margin call upozorenje (75%). */
const VAULT_COLLATERAL_MARGIN_CALL_LTV = 0.75;

/** Gradi collateral izvještaj za vault: pozicije, LTV, zdravlje i preporuke. */
export function buildVaultCollateralReport(userId: string): VaultCollateralReport {
  const seed = userId.split('').reduce((s, c) => s + c.charCodeAt(0), 0);

  const rawPositions: {
    id: string;
    assetClass: CollateralAssetClass;
    label: string;
    collateralUsd: number;
    currentLtv: number;
    maxLtv: number;
  }[] = [
    { id: 'col-btc',   assetClass: 'btc',            label: 'Bitcoin Kolateral',       collateralUsd: 800_000 + (seed % 200_000), currentLtv: 0.55 + (seed % 20) / 100, maxLtv: 0.70 },
    { id: 'col-eth',   assetClass: 'eth',            label: 'Ethereum Kolateral',      collateralUsd: 400_000 + (seed % 100_000), currentLtv: 0.60 + (seed % 15) / 100, maxLtv: 0.65 },
    { id: 'col-usdc',  assetClass: 'stablecoin',     label: 'USDC Stablecoin',         collateralUsd: 200_000 + (seed % 50_000),  currentLtv: 0.80 + (seed % 10) / 100, maxLtv: 0.90 },
    { id: 'col-cbdc',  assetClass: 'cbdc',           label: 'CBDC Dinar Digitalni',    collateralUsd: 100_000 + (seed % 30_000),  currentLtv: 0.70 + (seed % 8)  / 100, maxLtv: 0.80 },
    { id: 'col-bond',  assetClass: 'tokenized-bond', label: 'Tokenizovane Obveznice',  collateralUsd: 150_000 + (seed % 40_000),  currentLtv: 0.50 + (seed % 12) / 100, maxLtv: 0.60 },
    { id: 'col-lp',    assetClass: 'lp-token',       label: 'LP Token Kolateral',      collateralUsd: 80_000  + (seed % 20_000),  currentLtv: 0.42 + (seed % 10) / 100, maxLtv: 0.55 },
  ];

  const positions: VaultCollateralPosition[] = rawPositions.map((r) => {
    const ltv = Math.min(0.99, roundLedger(r.currentLtv));
    const loanValueUsd = roundLedger(r.collateralUsd * ltv);
    const healthFactor = roundLedger(r.maxLtv / ltv);
    const status: CollateralStatus =
      ltv >= VAULT_COLLATERAL_LIQUIDATION_LTV ? 'liquidation-risk' :
      ltv >= VAULT_COLLATERAL_MARGIN_CALL_LTV ? 'margin-call' : 'healthy';
    return {
      id: r.id,
      assetClass: r.assetClass,
      label: r.label,
      collateralValueUsd: r.collateralUsd,
      loanValueUsd,
      ltv,
      maxLtv: r.maxLtv,
      liquidationLtv: VAULT_COLLATERAL_LIQUIDATION_LTV,
      status,
      healthFactor,
    };
  });

  const totalCollateralUsd = positions.reduce((s, p) => s + p.collateralValueUsd, 0);
  const totalLoanUsd        = roundLedger(positions.reduce((s, p) => s + p.loanValueUsd, 0));
  const weightedLtv         = roundLedger(totalLoanUsd / totalCollateralUsd);
  const healthyPositions          = positions.filter((p) => p.status === 'healthy').length;
  const marginCallPositions       = positions.filter((p) => p.status === 'margin-call').length;
  const liquidationRiskPositions  = positions.filter((p) => p.status === 'liquidation-risk').length;
  const liquidatedPositions       = positions.filter((p) => p.status === 'liquidated').length;
  const overallHealthFactor       = roundLedger(
    positions.reduce((s, p) => s + p.healthFactor, 0) / positions.length,
  );
  const collateralScore = Math.max(
    0,
    Math.round(
      100 - liquidationRiskPositions * 25 - marginCallPositions * 10 - liquidatedPositions * 30,
    ),
  );

  const recommendations: string[] = [];
  for (const p of positions) {
    if (p.status === 'liquidation-risk') {
      recommendations.push(`Kritično: ${p.label} — LTV ${(p.ltv * 100).toFixed(1)}% blizu likvidacione granice (${(p.liquidationLtv * 100).toFixed(0)}%). Odmah dodati kolateral ili smanjiti kredit.`);
    } else if (p.status === 'margin-call') {
      recommendations.push(`Upozorenje: ${p.label} — LTV ${(p.ltv * 100).toFixed(1)}% dostigao margin call zonu. Razmotriti dopunu kolaterala.`);
    }
  }
  if (recommendations.length === 0) {
    recommendations.push('Sve pozicije su zdrave — LTV je ispod margin call praga za sve instrumente.');
  }
  if (weightedLtv > 0.70) {
    recommendations.push(`Ukupni ponderisani LTV od ${(weightedLtv * 100).toFixed(1)}% je visok — razmotriti smanjenje leveridža.`);
  }

  return {
    userId,
    summary: {
      totalCollateralUsd,
      totalLoanUsd,
      weightedLtv,
      healthyPositions,
      marginCallPositions,
      liquidationRiskPositions,
      liquidatedPositions,
      overallHealthFactor,
      collateralScore,
    },
    positions,
    recommendations,
    timestamp: new Date().toISOString(),
  };
}

// ─── Autofinish #1227 — Kripto Trezor Vault Collateral ───────────────────────
// VaultCollateralReport + buildVaultCollateralReport dodati u trezor.ts.
// Feature flag: kripto-trezor-collateral. Nova ruta: GET /api/kripto-trezor/collateral.
// APP_VERSION=49.6.0 | AUTOFINISH_COUNT=1227 | TOTAL_API_ROUTES=1096 | TOTAL_ROUTES=1158

// ─── Vault Solvency ────────────────────────────────────────────────────────────

export type SolvencyTier = 'hot' | 'warm' | 'cold' | 'deep-cold';

export interface VaultSolvencyBucket {
  id: string;
  tier: SolvencyTier;
  label: string;
  assetValueUsd: number;
  liabilityValueUsd: number;
  solvencyRatio: number;
  targetRatio: number;
  capitalBufferUsd: number;
  status: 'healthy' | 'watch' | 'critical';
}

export interface VaultSolvencySummary {
  totalAssetsUsd: number;
  totalLiabilitiesUsd: number;
  totalCapitalBufferUsd: number;
  aggregateSolvencyRatio: number;
  stressedSolvencyRatio: number;
  healthyBuckets: number;
  watchBuckets: number;
  criticalBuckets: number;
  solvencyScore: number;
}

export interface VaultSolvencyReport {
  userId: string;
  summary: VaultSolvencySummary;
  buckets: VaultSolvencyBucket[];
  recommendations: string[];
  timestamp: string;
}

const VAULT_SOLVENCY_MIN_RATIO = 1.1;
const VAULT_SOLVENCY_WATCH_RATIO = 1.2;

/** Gradi solvency izvještaj: assets/liabilities odnos, buffer i stress signal. */
export function buildVaultSolvencyReport(userId: string): VaultSolvencyReport {
  const seed = userId.split('').reduce((s, c) => s + c.charCodeAt(0), 0);
  const rawBuckets: Array<{
    id: string;
    tier: SolvencyTier;
    label: string;
    assetsUsd: number;
    liabilitiesUsd: number;
    targetRatio: number;
  }> = [
    {
      id: 'sol-hot',
      tier: 'hot',
      label: 'Hot Operativni Layer',
      assetsUsd: 420_000 + (seed % 90_000),
      liabilitiesUsd: 320_000 + (seed % 75_000),
      targetRatio: 1.25,
    },
    {
      id: 'sol-warm',
      tier: 'warm',
      label: 'Warm Transfer Layer',
      assetsUsd: 680_000 + (seed % 120_000),
      liabilitiesUsd: 500_000 + (seed % 85_000),
      targetRatio: 1.30,
    },
    {
      id: 'sol-cold',
      tier: 'cold',
      label: 'Cold Custody Layer',
      assetsUsd: 2_800_000 + (seed % 240_000),
      liabilitiesUsd: 2_150_000 + (seed % 180_000),
      targetRatio: 1.22,
    },
    {
      id: 'sol-deep-cold',
      tier: 'deep-cold',
      label: 'Deep Cold Rezervni Layer',
      assetsUsd: 4_100_000 + (seed % 300_000),
      liabilitiesUsd: 3_050_000 + (seed % 210_000),
      targetRatio: 1.28,
    },
  ];

  const buckets: VaultSolvencyBucket[] = rawBuckets.map((bucket) => {
    const solvencyRatio = roundLedger(bucket.assetsUsd / bucket.liabilitiesUsd);
    const capitalBufferUsd = roundLedger(bucket.assetsUsd - bucket.liabilitiesUsd);
    const status: VaultSolvencyBucket['status'] =
      solvencyRatio < VAULT_SOLVENCY_MIN_RATIO
        ? 'critical'
        : solvencyRatio < VAULT_SOLVENCY_WATCH_RATIO
          ? 'watch'
          : 'healthy';
    return {
      id: bucket.id,
      tier: bucket.tier,
      label: bucket.label,
      assetValueUsd: bucket.assetsUsd,
      liabilityValueUsd: bucket.liabilitiesUsd,
      solvencyRatio,
      targetRatio: bucket.targetRatio,
      capitalBufferUsd,
      status,
    };
  });

  const totalAssetsUsd = buckets.reduce((sum, bucket) => sum + bucket.assetValueUsd, 0);
  const totalLiabilitiesUsd = buckets.reduce((sum, bucket) => sum + bucket.liabilityValueUsd, 0);
  const totalCapitalBufferUsd = roundLedger(totalAssetsUsd - totalLiabilitiesUsd);
  const aggregateSolvencyRatio = roundLedger(totalAssetsUsd / totalLiabilitiesUsd);
  const stressedSolvencyRatio = roundLedger(aggregateSolvencyRatio * 0.92);
  const healthyBuckets = buckets.filter((bucket) => bucket.status === 'healthy').length;
  const watchBuckets = buckets.filter((bucket) => bucket.status === 'watch').length;
  const criticalBuckets = buckets.filter((bucket) => bucket.status === 'critical').length;
  const solvencyScore = Math.max(0, Math.round(100 - watchBuckets * 14 - criticalBuckets * 28));

  const recommendations: string[] = [];
  for (const bucket of buckets) {
    if (bucket.status === 'critical') {
      recommendations.push(
        `Kritično: ${bucket.label} ratio ${bucket.solvencyRatio.toFixed(2)} je ispod minimuma ${VAULT_SOLVENCY_MIN_RATIO.toFixed(2)}. Potrebna je hitna dokapitalizacija.`,
      );
    } else if (bucket.status === 'watch') {
      recommendations.push(
        `Upozorenje: ${bucket.label} ratio ${bucket.solvencyRatio.toFixed(2)} je u watch zoni. Razmotriti dodatni buffer ili smanjenje obaveza.`,
      );
    }
  }
  if (recommendations.length === 0) {
    recommendations.push('Svi solvency bucket-i su iznad watch praga; kapitalni buffer je stabilan.');
  }
  if (stressedSolvencyRatio < VAULT_SOLVENCY_MIN_RATIO) {
    recommendations.push(
      `Stress scenario signalizira ratio ${stressedSolvencyRatio.toFixed(2)} ispod minimuma; preporučen je dodatni rezervni sloj.`,
    );
  }

  return {
    userId,
    summary: {
      totalAssetsUsd,
      totalLiabilitiesUsd,
      totalCapitalBufferUsd,
      aggregateSolvencyRatio,
      stressedSolvencyRatio,
      healthyBuckets,
      watchBuckets,
      criticalBuckets,
      solvencyScore,
    },
    buckets,
    recommendations,
    timestamp: new Date().toISOString(),
  };
}

// ─── Autofinish #1228 — Kripto Trezor Vault Solvency ─────────────────────────
// VaultSolvencyReport + buildVaultSolvencyReport dodati u trezor.ts.
// Feature flag: kripto-trezor-solvency. Nova ruta: GET /api/kripto-trezor/solvency.
// APP_VERSION=49.7.0 | AUTOFINISH_COUNT=1228 | TOTAL_API_ROUTES=1097 | TOTAL_ROUTES=1159
