/**
 * Egzistencija "Priliv / Odliv" — Pravilnik
 *
 * Sveobuhvatan pravilnik koji upravlja životnim ciklusom (egzistencijom)
 * svake entitete na platformi — od nastanka do gašenja — kroz precizno
 * praćenje svih tokova resursa (novac, krediti, tokeni, bodovi, sesije).
 *
 * Kompanija SPAJA — AI IQ SUPER PLATFORMA
 */

import { APP_VERSION } from './constants';

// ─── Lifecycle State Machine ──────────────────────────────────────────────────

export type EntitetStatus =
  | 'PENDING'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'DORMANT'
  | 'FROZEN'
  | 'CLOSED';

export type EntitetTip =
  | 'PLAYER_ACCOUNT'
  | 'WALLET'
  | 'GAMING_SESSION'
  | 'LOGIN_SESSION'
  | 'BONUS'
  | 'TOKEN_PACK';

export interface LifecycleTransition {
  iz: EntitetStatus;
  u: EntitetStatus;
  razlog: string;
  timestamp: string;
  izvrsioId: string;
}

export interface Entitet {
  id: string;
  tip: EntitetTip;
  status: EntitetStatus;
  kreiran: string;
  azuriran: string;
  kycVerifikovan: boolean;
  transitions: LifecycleTransition[];
}

/** Dozvoljeni prelazi statusa po pravilniku. */
export const DOZVOLJENI_PRELAZI: Record<EntitetStatus, EntitetStatus[]> = {
  PENDING: ['ACTIVE', 'CLOSED'],
  ACTIVE: ['SUSPENDED', 'DORMANT', 'FROZEN', 'CLOSED'],
  SUSPENDED: ['ACTIVE', 'CLOSED'],
  DORMANT: ['ACTIVE', 'CLOSED'],
  FROZEN: ['ACTIVE', 'CLOSED'],
  CLOSED: [],
};

export function validateTransition(iz: EntitetStatus, u: EntitetStatus): boolean {
  return DOZVOLJENI_PRELAZI[iz].includes(u);
}

export function applyTransition(
  entitet: Entitet,
  u: EntitetStatus,
  razlog: string,
  izvrsioId: string,
): Entitet {
  if (!validateTransition(entitet.status, u)) {
    throw new Error(
      `Nevalidan prelaz: ${entitet.status} → ${u} nije dozvoljen pravilnikom.`,
    );
  }
  const now = new Date().toISOString();
  const transition: LifecycleTransition = {
    iz: entitet.status,
    u,
    razlog,
    timestamp: now,
    izvrsioId,
  };
  return {
    ...entitet,
    status: u,
    azuriran: now,
    transitions: [...entitet.transitions, transition],
  };
}

// ─── Inflow (Priliv) Types ────────────────────────────────────────────────────

export type PrilivTip =
  | 'DEPOSIT'
  | 'WIN_PAYOUT'
  | 'BONUS_CREDIT'
  | 'REFERRAL_REWARD'
  | 'SYSTEM_CREDIT';

export type PrilivStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'HELD'
  | 'COMPLETED';

export type IzvorKlasifikacija = 'trusted' | 'unverified';

export interface Priliv {
  id: string;
  referenceId: string;
  tip: PrilivTip;
  source: string;
  amount: number;
  currency: string;
  timestamp: string;
  status: PrilivStatus;
  izvorKlasifikacija: IzvorKlasifikacija;
  kycRequired: boolean;
  userId: string;
  createdBy: string;
  approvedBy?: string;
  ipAddress: string;
  deviceFingerprint: string;
  deletedAt?: null;
}

// ─── Inflow Limits ────────────────────────────────────────────────────────────

export const INFLOW_LIMITI: Record<PrilivTip, { min: number; max: number }> = {
  DEPOSIT:        { min: 1,    max: 10_000 },
  WIN_PAYOUT:     { min: 0.01, max: 100_000 },
  BONUS_CREDIT:   { min: 0.01, max: 500 },
  REFERRAL_REWARD:{ min: 0.01, max: 200 },
  SYSTEM_CREDIT:  { min: 0.01, max: 50_000 },
};

export const KYC_PRAG_EUR = 1_000;
export const RATE_LIMIT_TRANSAKCIJA_PO_SATU = 20;

// ─── Inflow Validation ────────────────────────────────────────────────────────

export interface ValidationRezultat {
  valid: boolean;
  greske: string[];
}

export function validatePriliv(
  p: Pick<Priliv, 'tip' | 'amount' | 'currency' | 'referenceId' | 'kycRequired'>,
  postojeciReferenceIds: Set<string>,
  transakcijePoslednjiSat: number,
): ValidationRezultat {
  const greske: string[] = [];
  const lim = INFLOW_LIMITI[p.tip];

  if (!Number.isFinite(p.amount) || p.amount <= 0) {
    greske.push('Iznos mora biti pozitivan konačan broj.');
  } else {
    if (p.amount < lim.min) {
      greske.push(`Iznos ${p.amount} je ispod minimalnog limita ${lim.min} za tip ${p.tip}.`);
    }
    if (p.amount > lim.max) {
      greske.push(`Iznos ${p.amount} prelazi maksimalni limit ${lim.max} za tip ${p.tip}.`);
    }
  }

  if (postojeciReferenceIds.has(p.referenceId)) {
    greske.push(`Duplikat: referenceId '${p.referenceId}' već postoji (anti-duplication check).`);
  }

  if (transakcijePoslednjiSat >= RATE_LIMIT_TRANSAKCIJA_PO_SATU) {
    greske.push(
      `Rate limit: korisnik je dostigao ${RATE_LIMIT_TRANSAKCIJA_PO_SATU} transakcija/sat.`,
    );
  }

  if (p.currency === 'EUR' && p.amount > KYC_PRAG_EUR && !p.kycRequired) {
    greske.push(`KYC verifikacija je obavezna za uplate iznad ${KYC_PRAG_EUR} EUR.`);
  }

  return { valid: greske.length === 0, greske };
}

export function klasifikujIzvor(source: string): IzvorKlasifikacija {
  const TRUSTED_SOURCES = ['stripe', 'paypal', 'bank_transfer', 'sepa', 'swift'];
  return TRUSTED_SOURCES.some((s) => source.toLowerCase().includes(s))
    ? 'trusted'
    : 'unverified';
}

// ─── Outflow (Odliv) Types ────────────────────────────────────────────────────

export type OdlivTip =
  | 'WITHDRAWAL'
  | 'GAME_LOSS'
  | 'FEE_COMMISSION'
  | 'BONUS_EXPIRY'
  | 'SYSTEM_DEDUCTION'
  | 'ACCOUNT_CLOSURE_PAYOUT';

export type OdlivStatus =
  | 'PENDING'
  | 'COOLING_OFF'
  | 'APPROVED'
  | 'REJECTED'
  | 'HELD'
  | 'COMPLETED';

export type ReasonCode =
  | 'WITHDRAWAL_REQUEST'
  | 'GAME_LOSS'
  | 'PLATFORM_FEE'
  | 'BONUS_EXPIRED'
  | 'SYSTEM_CORRECTION'
  | 'ACCOUNT_CLOSED'
  | 'AML_HOLD'
  | 'INSUFFICIENT_FUNDS';

export interface Odliv {
  id: string;
  tip: OdlivTip;
  destination: string;
  amount: number;
  currency: string;
  timestamp: string;
  status: OdlivStatus;
  reasonCode: ReasonCode;
  userId: string;
  createdBy: string;
  approvedBy?: string;
  ipAddress: string;
  deviceFingerprint: string;
  coolingOffUntil?: string;
  wageringRequirementMet: boolean;
  amlChecked: boolean;
  deletedAt?: null;
}

// ─── Outflow Limits ───────────────────────────────────────────────────────────

export const OUTFLOW_LIMITI = {
  WITHDRAWAL_MIN_EUR: 10,
  WITHDRAWAL_MAX_DAILY_EUR: 5_000,
  AML_PRAG_EUR: 2_000,
  MIN_BALANCE_EUR: 0,
  COOLING_OFF_VERIFIED_H: 24,
  COOLING_OFF_UNVERIFIED_H: 72,
};

// ─── Outflow Validation ───────────────────────────────────────────────────────

export interface OdlivValidationKontekst {
  currentBalance: number;
  wageringRequirementMet: boolean;
  kycVerifikovan: boolean;
  dnevniOdlivUkupno: number;
  suspiciousActivityDetected: boolean;
}

export function validateOdliv(
  o: Pick<Odliv, 'tip' | 'amount' | 'currency'>,
  ctx: OdlivValidationKontekst,
): ValidationRezultat {
  const greske: string[] = [];

  if (!Number.isFinite(o.amount) || o.amount <= 0) {
    greske.push('Iznos mora biti pozitivan konačan broj.');
  }

  if (o.tip === 'WITHDRAWAL') {
    if (o.amount < OUTFLOW_LIMITI.WITHDRAWAL_MIN_EUR) {
      greske.push(`Minimalna isplata je ${OUTFLOW_LIMITI.WITHDRAWAL_MIN_EUR} EUR.`);
    }
    if (ctx.dnevniOdlivUkupno + o.amount > OUTFLOW_LIMITI.WITHDRAWAL_MAX_DAILY_EUR) {
      greske.push(
        `Dnevni limit isplate (${OUTFLOW_LIMITI.WITHDRAWAL_MAX_DAILY_EUR} EUR) bi bio prekoračen.`,
      );
    }
  }

  if (ctx.currentBalance - o.amount < OUTFLOW_LIMITI.MIN_BALANCE_EUR) {
    greske.push('Insufficient funds: saldo bi pao ispod minimalnog praga.');
  }

  if (o.tip === 'WITHDRAWAL' && !ctx.wageringRequirementMet) {
    greske.push('Wagering requirement nije ispunjen — isplata bonusa nije dozvoljena.');
  }

  if (o.currency === 'EUR' && o.amount > OUTFLOW_LIMITI.AML_PRAG_EUR && !ctx.kycVerifikovan) {
    greske.push(`AML compliance: KYC verifikacija je obavezna za isplate iznad ${OUTFLOW_LIMITI.AML_PRAG_EUR} EUR.`);
  }

  if (ctx.suspiciousActivityDetected) {
    greske.push('Automatski hold: detektovana sumnjiva aktivnost (fraud detection).');
  }

  return { valid: greske.length === 0, greske };
}

export function izracunajCoolingOff(kycVerifikovan: boolean, od: Date = new Date()): Date {
  const h = kycVerifikovan
    ? OUTFLOW_LIMITI.COOLING_OFF_VERIFIED_H
    : OUTFLOW_LIMITI.COOLING_OFF_UNVERIFIED_H;
  return new Date(od.getTime() + h * 3_600_000);
}

// ─── Balance & Reconciliation ─────────────────────────────────────────────────

export interface BalansTransakcija {
  direction: 'credit' | 'debit';
  amount: number;
}

export function izracunajBalans(transakcije: BalansTransakcija[]): number {
  return transakcije.reduce((sum, t) => {
    return t.direction === 'credit' ? sum + t.amount : sum - t.amount;
  }, 0);
}

export interface ReconciliationRezultat {
  storedBalance: number;
  calculatedBalance: number;
  discrepancy: number;
  uskladjen: boolean;
  alert: boolean;
}

export function reconcile(
  storedBalance: number,
  transakcije: BalansTransakcija[],
): ReconciliationRezultat {
  const calculatedBalance = izracunajBalans(transakcije);
  const discrepancy = Math.abs(storedBalance - calculatedBalance);
  const uskladjen = discrepancy < 0.000001;
  return {
    storedBalance,
    calculatedBalance,
    discrepancy,
    uskladjen,
    alert: !uskladjen,
  };
}

// ─── Anomaly Detection & Self-Healing ────────────────────────────────────────

export type AnomalijaTip =
  | 'NEGATIVE_BALANCE'
  | 'DUPLICATE_ENTITY'
  | 'BALANCE_DISCREPANCY'
  | 'BONUS_EXPIRED_PENDING';

export interface Anomalija {
  tip: AnomalijaTip;
  entitetId: string;
  opis: string;
  detektovano: string;
  akcija: string;
}

export function detektujAnomalije(
  entitetId: string,
  balans: number,
  reconciliationRezultat: ReconciliationRezultat,
): Anomalija[] {
  const anomalije: Anomalija[] = [];
  const now = new Date().toISOString();

  if (balans < 0) {
    anomalije.push({
      tip: 'NEGATIVE_BALANCE',
      entitetId,
      opis: `Negativan saldo: ${balans} EUR`,
      detektovano: now,
      akcija: 'FREEZE_ACCOUNT',
    });
  }

  if (reconciliationRezultat.alert) {
    anomalije.push({
      tip: 'BALANCE_DISCREPANCY',
      entitetId,
      opis: `Neslaganje salda: stored=${reconciliationRezultat.storedBalance}, calculated=${reconciliationRezultat.calculatedBalance}, razlika=${reconciliationRezultat.discrepancy}`,
      detektovano: now,
      akcija: 'TRIGGER_RECONCILIATION_JOB',
    });
  }

  return anomalije;
}

// ─── Limiti — Egzistencija ────────────────────────────────────────────────────

export const EGZISTENCIJA_LIMITI = {
  DEPOSIT_MIN_EUR: 1,
  DEPOSIT_MAX_EUR: 10_000,
  WITHDRAWAL_MIN_EUR: 10,
  WITHDRAWAL_MAX_DAILY_EUR: 5_000,
  BONUS_MAX_EUR: 500,
  SESSION_MAX_H: 24,
  DORMANT_PERIOD_MONTHS: 12,
  ACCOUNT_CLOSURE_HOLD_DAYS: 30,
};

// ─── Builder / Report ─────────────────────────────────────────────────────────

export interface EgzistencijaPravilnikIzvestaj {
  status: 'aktivan';
  userId: string;
  timestamp: string;
  verzija: string;
  pravilnikVerzija: '1.0.0';
  egzistencijaLimiti: typeof EGZISTENCIJA_LIMITI;
  inflowLimiti: typeof INFLOW_LIMITI;
  outflowLimiti: typeof OUTFLOW_LIMITI;
  prilivTipovi: PrilivTip[];
  odlivTipovi: OdlivTip[];
  statusPrelazi: typeof DOZVOLJENI_PRELAZI;
  kpi: {
    ukupnoPrilivTipova: number;
    ukupnoOdlivTipova: number;
    ukupnoStatusova: number;
    maxDepositEUR: number;
    maxWithdrawalDnevnoEUR: number;
    coolingOffVerifiedH: number;
    coolingOffUnverifiedH: number;
    dormantPeriodMeseci: number;
    accountClosureHoldDana: number;
  };
}

export function buildEgzistencijaPravilnikIzvestaj(
  userId: string,
): EgzistencijaPravilnikIzvestaj {
  const prilivTipovi: PrilivTip[] = [
    'DEPOSIT', 'WIN_PAYOUT', 'BONUS_CREDIT', 'REFERRAL_REWARD', 'SYSTEM_CREDIT',
  ];
  const odlivTipovi: OdlivTip[] = [
    'WITHDRAWAL', 'GAME_LOSS', 'FEE_COMMISSION', 'BONUS_EXPIRY', 'SYSTEM_DEDUCTION', 'ACCOUNT_CLOSURE_PAYOUT',
  ];
  const statusovi: EntitetStatus[] = ['PENDING', 'ACTIVE', 'SUSPENDED', 'DORMANT', 'FROZEN', 'CLOSED'];

  return {
    status: 'aktivan',
    userId,
    timestamp: new Date().toISOString(),
    verzija: APP_VERSION,
    pravilnikVerzija: '1.0.0',
    egzistencijaLimiti: EGZISTENCIJA_LIMITI,
    inflowLimiti: INFLOW_LIMITI,
    outflowLimiti: OUTFLOW_LIMITI,
    prilivTipovi,
    odlivTipovi,
    statusPrelazi: DOZVOLJENI_PRELAZI,
    kpi: {
      ukupnoPrilivTipova: prilivTipovi.length,
      ukupnoOdlivTipova: odlivTipovi.length,
      ukupnoStatusova: statusovi.length,
      maxDepositEUR: EGZISTENCIJA_LIMITI.DEPOSIT_MAX_EUR,
      maxWithdrawalDnevnoEUR: EGZISTENCIJA_LIMITI.WITHDRAWAL_MAX_DAILY_EUR,
      coolingOffVerifiedH: OUTFLOW_LIMITI.COOLING_OFF_VERIFIED_H,
      coolingOffUnverifiedH: OUTFLOW_LIMITI.COOLING_OFF_UNVERIFIED_H,
      dormantPeriodMeseci: EGZISTENCIJA_LIMITI.DORMANT_PERIOD_MONTHS,
      accountClosureHoldDana: EGZISTENCIJA_LIMITI.ACCOUNT_CLOSURE_HOLD_DAYS,
    },
  };
}

// ─── Inflow Builder ───────────────────────────────────────────────────────────

export interface EgzistencijaPrilivIzvestaj {
  status: 'aktivan';
  userId: string;
  timestamp: string;
  verzija: string;
  pravilnikVerzija: '1.0.0';
  prilivTipovi: PrilivTip[];
  limiti: typeof INFLOW_LIMITI;
  pravila: {
    antiDuplication: boolean;
    rateLimitPoSatu: number;
    kycPragEUR: number;
    klasifikacijaIzvora: string[];
  };
  kpi: {
    ukupnoTipova: number;
    maxDepositEUR: number;
    maxWinPayoutEUR: number;
    maxBonusCreditEUR: number;
    kycPragEUR: number;
    rateLimitPoSatu: number;
  };
}

export function buildEgzistencijaPrilivIzvestaj(
  userId: string,
): EgzistencijaPrilivIzvestaj {
  const prilivTipovi: PrilivTip[] = [
    'DEPOSIT', 'WIN_PAYOUT', 'BONUS_CREDIT', 'REFERRAL_REWARD', 'SYSTEM_CREDIT',
  ];
  return {
    status: 'aktivan',
    userId,
    timestamp: new Date().toISOString(),
    verzija: APP_VERSION,
    pravilnikVerzija: '1.0.0',
    prilivTipovi,
    limiti: INFLOW_LIMITI,
    pravila: {
      antiDuplication: true,
      rateLimitPoSatu: RATE_LIMIT_TRANSAKCIJA_PO_SATU,
      kycPragEUR: KYC_PRAG_EUR,
      klasifikacijaIzvora: ['trusted', 'unverified'],
    },
    kpi: {
      ukupnoTipova: prilivTipovi.length,
      maxDepositEUR: INFLOW_LIMITI.DEPOSIT.max,
      maxWinPayoutEUR: INFLOW_LIMITI.WIN_PAYOUT.max,
      maxBonusCreditEUR: INFLOW_LIMITI.BONUS_CREDIT.max,
      kycPragEUR: KYC_PRAG_EUR,
      rateLimitPoSatu: RATE_LIMIT_TRANSAKCIJA_PO_SATU,
    },
  };
}

// ─── Outflow Builder ──────────────────────────────────────────────────────────

export interface EgzistencijaOdlivIzvestaj {
  status: 'aktivan';
  userId: string;
  timestamp: string;
  verzija: string;
  pravilnikVerzija: '1.0.0';
  odlivTipovi: OdlivTip[];
  limiti: typeof OUTFLOW_LIMITI;
  pravila: {
    coolingOffVerifiedH: number;
    coolingOffUnverifiedH: number;
    wageringRequirementCheck: boolean;
    amlCheckPragEUR: number;
    autoHoldOnFraud: boolean;
  };
  kpi: {
    ukupnoTipova: number;
    minWithdrawalEUR: number;
    maxDnevnoWithdrawalEUR: number;
    amlPragEUR: number;
    coolingOffVerifiedH: number;
    coolingOffUnverifiedH: number;
  };
}

export function buildEgzistencijaOdlivIzvestaj(
  userId: string,
): EgzistencijaOdlivIzvestaj {
  const odlivTipovi: OdlivTip[] = [
    'WITHDRAWAL', 'GAME_LOSS', 'FEE_COMMISSION', 'BONUS_EXPIRY', 'SYSTEM_DEDUCTION', 'ACCOUNT_CLOSURE_PAYOUT',
  ];
  return {
    status: 'aktivan',
    userId,
    timestamp: new Date().toISOString(),
    verzija: APP_VERSION,
    pravilnikVerzija: '1.0.0',
    odlivTipovi,
    limiti: OUTFLOW_LIMITI,
    pravila: {
      coolingOffVerifiedH: OUTFLOW_LIMITI.COOLING_OFF_VERIFIED_H,
      coolingOffUnverifiedH: OUTFLOW_LIMITI.COOLING_OFF_UNVERIFIED_H,
      wageringRequirementCheck: true,
      amlCheckPragEUR: OUTFLOW_LIMITI.AML_PRAG_EUR,
      autoHoldOnFraud: true,
    },
    kpi: {
      ukupnoTipova: odlivTipovi.length,
      minWithdrawalEUR: OUTFLOW_LIMITI.WITHDRAWAL_MIN_EUR,
      maxDnevnoWithdrawalEUR: OUTFLOW_LIMITI.WITHDRAWAL_MAX_DAILY_EUR,
      amlPragEUR: OUTFLOW_LIMITI.AML_PRAG_EUR,
      coolingOffVerifiedH: OUTFLOW_LIMITI.COOLING_OFF_VERIFIED_H,
      coolingOffUnverifiedH: OUTFLOW_LIMITI.COOLING_OFF_UNVERIFIED_H,
    },
  };
}
