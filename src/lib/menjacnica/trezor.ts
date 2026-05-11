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
