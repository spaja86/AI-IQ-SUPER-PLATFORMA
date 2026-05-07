// SpajaUltraOmegaCore -∞Ω+∞ — Enterprise SLA Tiers & Monitoring
// Kompanija SPAJA — Digitalna Industrija
//
// Talas 9 (P2/P3): Enterprise/B2B capability blokovi.
//
// Implementira:
//   • SLA tier definicije po planovima (uptime, latency, support)
//   • SLA breach detekcija i alerting
//   • Error budget kalkulacija (SRE pristup)
//   • SLA reporting metrike
//   • Incident klasifikacija po severity-u
//
// Upotreba:
//   import { getSLATier, calculateErrorBudget } from '@/lib/enterprise-sla';

import type { PlanTip } from '@/lib/supabase/types';

// ─── SLA Tier Definicije ──────────────────────────────────────────────────────

export interface SlaTier {
  /** Plan na koji se SLA primenjuje. */
  plan: PlanTip;
  /** Garantovani uptime procenat godišnje. */
  uptimePercent: number;
  /** Maksimalni godišnji downtime (minuti). */
  maxDowntimeMinutesYear: number;
  /** Maksimalni mesečni downtime (minuti). */
  maxDowntimeMinutesMonth: number;
  /** Maksimalna response latencija za API (P95, ms). */
  apiLatencyP95Ms: number;
  /** Maksimalna response latencija za AI (P95, ms). */
  aiLatencyP95Ms: number;
  /** Vreme odgovora podrške (radni sati). */
  supportResponseHours: number;
  /** Da li postoji 24/7 podrška. */
  support24x7: boolean;
  /** Kompenzacija pri SLA breach-u (% kredita). */
  breachCreditPct: number;
  /** Recovery Time Objective — maks RTO (minuti). */
  rtoMinutes: number;
  /** Recovery Point Objective — maks RPO (minuti). */
  rpoMinutes: number;
}

/**
 * SLA tieri po planovima platforme.
 */
export const SLA_TIERS: Record<PlanTip, SlaTier> = {
  starter: {
    plan: 'starter',
    uptimePercent: 99.0,
    maxDowntimeMinutesYear: 5256,
    maxDowntimeMinutesMonth: 438,
    apiLatencyP95Ms: 1000,
    aiLatencyP95Ms: 10000,
    supportResponseHours: 72,
    support24x7: false,
    breachCreditPct: 0,
    rtoMinutes: 240,
    rpoMinutes: 1440,
  },
  basic: {
    plan: 'basic',
    uptimePercent: 99.5,
    maxDowntimeMinutesYear: 2628,
    maxDowntimeMinutesMonth: 219,
    apiLatencyP95Ms: 800,
    aiLatencyP95Ms: 8000,
    supportResponseHours: 48,
    support24x7: false,
    breachCreditPct: 10,
    rtoMinutes: 120,
    rpoMinutes: 720,
  },
  pro: {
    plan: 'pro',
    uptimePercent: 99.9,
    maxDowntimeMinutesYear: 525,
    maxDowntimeMinutesMonth: 44,
    apiLatencyP95Ms: 500,
    aiLatencyP95Ms: 5000,
    supportResponseHours: 24,
    support24x7: false,
    breachCreditPct: 15,
    rtoMinutes: 60,
    rpoMinutes: 240,
  },
  enterprise: {
    plan: 'enterprise',
    uptimePercent: 99.95,
    maxDowntimeMinutesYear: 262,
    maxDowntimeMinutesMonth: 22,
    apiLatencyP95Ms: 300,
    aiLatencyP95Ms: 3000,
    supportResponseHours: 4,
    support24x7: true,
    breachCreditPct: 25,
    rtoMinutes: 30,
    rpoMinutes: 60,
  },
  unlimited: {
    plan: 'unlimited',
    uptimePercent: 99.99,
    maxDowntimeMinutesYear: 52,
    maxDowntimeMinutesMonth: 4,
    apiLatencyP95Ms: 200,
    aiLatencyP95Ms: 2000,
    supportResponseHours: 1,
    support24x7: true,
    breachCreditPct: 30,
    rtoMinutes: 15,
    rpoMinutes: 15,
  },
};

// ─── Error Budget ─────────────────────────────────────────────────────────────

export interface ErrorBudget {
  plan: PlanTip;
  /** Ukupni dozvoljen downtime u minuti za period. */
  totalBudgetMinutes: number;
  /** Potrošeni downtime minuti. */
  consumedMinutes: number;
  /** Preostali budget u minutima. */
  remainingMinutes: number;
  /** Procenat potrošenog budgeta (0-100). */
  consumedPct: number;
  /** Da li je budget premašen (breach). */
  isExhausted: boolean;
  /** Da li je u "burn alert" zoni (> 50% potrošeno). */
  isBurnAlert: boolean;
}

/**
 * Računa error budget za dati plan i period.
 *
 * @param plan           - Plan korisnika
 * @param periodDays     - Period merenja u danima (podrazumevano: 30)
 * @param downtimeMin    - Stvarni downtime u minutima
 */
export function calculateErrorBudget(
  plan: PlanTip,
  periodDays: number,
  downtimeMin: number,
): ErrorBudget {
  const tier = SLA_TIERS[plan];
  const totalBudgetMinutes =
    periodDays <= 30
      ? tier.maxDowntimeMinutesMonth
      : Math.round((tier.maxDowntimeMinutesYear * periodDays) / 365);

  const consumedMinutes = Math.min(downtimeMin, totalBudgetMinutes * 2); // Cap at 2x za readability
  const remainingMinutes = Math.max(0, totalBudgetMinutes - consumedMinutes);
  const consumedPct = Math.round((consumedMinutes / totalBudgetMinutes) * 100 * 10) / 10;

  return {
    plan,
    totalBudgetMinutes,
    consumedMinutes,
    remainingMinutes,
    consumedPct,
    isExhausted: consumedMinutes >= totalBudgetMinutes,
    isBurnAlert: consumedPct >= 50,
  };
}

// ─── Incident Klasifikacija ───────────────────────────────────────────────────

export type IncidentSeverity = 'P1' | 'P2' | 'P3' | 'P4';

export interface IncidentPolicy {
  severity: IncidentSeverity;
  naziv: string;
  opis: string;
  /** Maksimalno vreme odgovora (minuti). */
  responseTimeMin: number;
  /** Maksimalno vreme rešavanja (minuti). */
  resolutionTimeMin: number;
  /** Da li zahteva 24/7 on-call. */
  requires24x7: boolean;
}

export const INCIDENT_POLICIES: Record<IncidentSeverity, IncidentPolicy> = {
  P1: {
    severity: 'P1',
    naziv: 'Kritičan Incident',
    opis: 'Platforma nedostupna ili potpun gubitak kritične funkcionalnosti.',
    responseTimeMin: 15,
    resolutionTimeMin: 60,
    requires24x7: true,
  },
  P2: {
    severity: 'P2',
    naziv: 'Ozbiljan Incident',
    opis: 'Značajno degradovana funkcionalnost, >50% korisnika pogođeno.',
    responseTimeMin: 30,
    resolutionTimeMin: 240,
    requires24x7: true,
  },
  P3: {
    severity: 'P3',
    naziv: 'Umereni Incident',
    opis: 'Delimično degradovana funkcionalnost, workaround postoji.',
    responseTimeMin: 120,
    resolutionTimeMin: 1440,
    requires24x7: false,
  },
  P4: {
    severity: 'P4',
    naziv: 'Manji Incident',
    opis: 'Kozmetička ili manja greška bez uticaja na poslovne operacije.',
    responseTimeMin: 480,
    resolutionTimeMin: 10080,
    requires24x7: false,
  },
};

// ─── SLA Breach Detekcija ─────────────────────────────────────────────────────

export interface SlaBreachResult {
  isBreach: boolean;
  plan: PlanTip;
  uptimePct: number;
  slaUptimePct: number;
  downtimeMin: number;
  allowedDowntimeMin: number;
  excessDowntimeMin: number;
  creditPct: number;
  severity: IncidentSeverity | null;
}

/**
 * Detektuje SLA breach za dati plan i period.
 *
 * @param plan          - Plan korisnika
 * @param periodDays    - Period merenja u danima
 * @param downtimeMin   - Stvarni downtime u minutima
 */
export function detectSlaBreach(
  plan: PlanTip,
  periodDays: number,
  downtimeMin: number,
): SlaBreachResult {
  const tier = SLA_TIERS[plan];
  const totalMinutes = periodDays * 24 * 60;
  const uptimePct = ((totalMinutes - downtimeMin) / totalMinutes) * 100;
  const allowedDowntimeMin =
    periodDays <= 30 ? tier.maxDowntimeMinutesMonth : Math.round((tier.maxDowntimeMinutesYear * periodDays) / 365);

  const isBreach = downtimeMin > allowedDowntimeMin;
  const excessDowntimeMin = Math.max(0, downtimeMin - allowedDowntimeMin);

  let severity: IncidentSeverity | null = null;
  if (isBreach) {
    if (excessDowntimeMin > 60) severity = 'P1';
    else if (excessDowntimeMin > 15) severity = 'P2';
    else if (excessDowntimeMin > 5) severity = 'P3';
    else severity = 'P4';
  }

  return {
    isBreach,
    plan,
    uptimePct: Math.round(uptimePct * 1000) / 1000,
    slaUptimePct: tier.uptimePercent,
    downtimeMin,
    allowedDowntimeMin,
    excessDowntimeMin,
    creditPct: isBreach ? tier.breachCreditPct : 0,
    severity,
  };
}

/**
 * Dohvata SLA tier za plan.
 */
export function getSLATier(plan: PlanTip): SlaTier {
  return SLA_TIERS[plan];
}

/**
 * Generiše SLA izveštaj za admin panel.
 */
export function generateSlaReport(
  measurements: Array<{ plan: PlanTip; periodDays: number; downtimeMin: number }>,
): {
  ukupnoPlanova: number;
  ukupnoBreachova: number;
  breachovi: SlaBreachResult[];
  prosecniUptimePct: number;
} {
  const results = measurements.map((m) =>
    detectSlaBreach(m.plan, m.periodDays, m.downtimeMin),
  );

  const breachovi = results.filter((r) => r.isBreach);
  const prosecniUptimePct =
    results.reduce((sum, r) => sum + r.uptimePct, 0) / (results.length || 1);

  return {
    ukupnoPlanova: results.length,
    ukupnoBreachova: breachovi.length,
    breachovi,
    prosecniUptimePct: Math.round(prosecniUptimePct * 1000) / 1000,
  };
}
