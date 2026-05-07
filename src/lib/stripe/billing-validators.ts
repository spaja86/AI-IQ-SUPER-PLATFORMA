// SpajaUltraOmegaCore -∞Ω+∞ — Billing Validators
// Kompanija SPAJA — Digitalna Industrija
//
// Implementira:
//   • Striktno mapiranje dozvoljenih Stripe event tipova (#18)
//   • Schema validaciju za webhook payload (#19)
//   • Webhook event ordering zaštitu (out-of-order) (#17)
//   • Zaštitu od negativnih/nelogičnih billing tranzicija (#43)
//   • Anti-fraud heuristike (geo/IP anomalije) (#12)
//   • Cooldown za prečeste promene plana (#14)
//   • Ograničenje broja aktivnih checkout sesija (#11)
//   • Validacija usklađenosti plan podataka (#41)

import type { PlanTip } from '@/lib/supabase/types';

// ─── Dozvoljeni Stripe event tipovi (#18) ─────────────────────────────────────

/**
 * Whitelist svih Stripe event tipova koje platforma smije obrađivati.
 * Svaki event van liste se odbija sa logom.
 */
export const ALLOWED_STRIPE_EVENT_TYPES = new Set([
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'customer.subscription.paused',
  'customer.subscription.resumed',
  'invoice.payment_succeeded',
  'invoice.payment_failed',
  'invoice.upcoming',
  'invoice.finalized',
  'customer.updated',
  'customer.deleted',
  'payment_intent.succeeded',
  'payment_intent.payment_failed',
  'payment_intent.canceled',
  'payment_method.attached',
  'payment_method.detached',
  'charge.dispute.created',
  'charge.dispute.closed',
  'charge.refunded',
  'billing_portal.session.created',
] as const);

export type AllowedStripeEventType = typeof ALLOWED_STRIPE_EVENT_TYPES extends Set<infer T> ? T : string;

/**
 * Vraća `true` ako je event tipa koji platforma obrađuje.
 */
export function isAllowedEventType(eventType: string): boolean {
  return ALLOWED_STRIPE_EVENT_TYPES.has(eventType as AllowedStripeEventType);
}

// ─── Schema Validacija webhook payload-a (#19) ────────────────────────────────

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validira strukturu Stripe `checkout.session.completed` objekta.
 */
export function validateCheckoutSession(obj: Record<string, unknown>): ValidationResult {
  const errors: string[] = [];
  if (typeof obj['id'] !== 'string') errors.push('session.id mora biti string');
  if (typeof obj['mode'] !== 'string') errors.push('session.mode mora biti string');
  if (!['payment', 'subscription', 'setup'].includes(obj['mode'] as string)) {
    errors.push(`session.mode "${obj['mode']}" nije validan`);
  }
  if (obj['metadata'] !== null && typeof obj['metadata'] !== 'object') {
    errors.push('session.metadata mora biti objekat ili null');
  }
  return { valid: errors.length === 0, errors };
}

/**
 * Validira strukturu Stripe `customer.subscription.*` objekta.
 */
export function validateSubscription(obj: Record<string, unknown>): ValidationResult {
  const errors: string[] = [];
  if (typeof obj['id'] !== 'string') errors.push('subscription.id mora biti string');
  if (typeof obj['status'] !== 'string') errors.push('subscription.status mora biti string');
  const validStatuses = ['trialing', 'active', 'incomplete', 'incomplete_expired', 'past_due', 'canceled', 'unpaid', 'paused'];
  if (!validStatuses.includes(obj['status'] as string)) {
    errors.push(`subscription.status "${obj['status']}" nije validan`);
  }
  if (!obj['customer']) errors.push('subscription.customer je obavezan');
  if (!Array.isArray((obj['items'] as Record<string, unknown>)?.['data'])) {
    errors.push('subscription.items.data mora biti niz');
  }
  return { valid: errors.length === 0, errors };
}

/**
 * Validira strukturu Stripe `invoice.*` objekta.
 */
export function validateInvoice(obj: Record<string, unknown>): ValidationResult {
  const errors: string[] = [];
  if (typeof obj['id'] !== 'string') errors.push('invoice.id mora biti string');
  if (!obj['customer']) errors.push('invoice.customer je obavezan');
  if (typeof obj['amount_due'] !== 'number') errors.push('invoice.amount_due mora biti broj');
  if (obj['amount_due'] as number < 0) errors.push('invoice.amount_due ne sme biti negativan');
  return { valid: errors.length === 0, errors };
}

// ─── Event Ordering Guard (#17) ───────────────────────────────────────────────

/**
 * Proverava da li je dolazni event noviji od poslednjeg obrađenog eventa
 * iste pretplate / korisnika.
 *
 * Stripe šalje događaje uglavnom redom, ali retry može dostaviti stariji event
 * posle novijeg (out-of-order). Ova provera štiti od regresije stanja.
 */
export function isEventNewerThan(
  incomingEventCreatedSec: number,
  lastProcessedCreatedSec: number | null,
): boolean {
  if (lastProcessedCreatedSec === null) return true;
  // Tolerancija ±5 sekundi za event koji se ponavlja identičnim timestamp-om
  return incomingEventCreatedSec >= lastProcessedCreatedSec - 5;
}

// ─── Billing Transition Guard (#43) ──────────────────────────────────────────

/** Validne tranzicije statusa pretplate. */
const VALID_STATUS_TRANSITIONS: Record<string, readonly string[]> = {
  trialing:            ['active', 'canceled', 'incomplete', 'past_due'],
  active:              ['trialing', 'past_due', 'canceled', 'unpaid', 'paused', 'incomplete'],
  incomplete:          ['active', 'canceled', 'incomplete_expired'],
  incomplete_expired:  ['canceled'],
  past_due:            ['active', 'canceled', 'unpaid'],
  canceled:            [], // terminal state
  unpaid:              ['active', 'canceled'],
  paused:              ['active', 'canceled'],
};

/** Validne plan tranzicije (upgrade/downgrade matrica). */
const PLAN_ORDER: Record<string, number> = {
  starter: 0,
  basic: 1,
  pro: 2,
  enterprise: 3,
  unlimited: 4,
};

export function isValidStatusTransition(from: string | null, to: string): boolean {
  if (from === null) return true; // Prva aktivacija
  const allowed = VALID_STATUS_TRANSITIONS[from];
  if (!allowed) return true; // Nepoznat status — propustiti
  return allowed.includes(to);
}

export function isValidPlanTransition(from: PlanTip | null, to: PlanTip): boolean {
  if (from === null) return true;
  if (from === to) return false; // Nema smisla prelaz na isti plan
  // Sve tranzicije su dozvoljene osim starter → isto
  return PLAN_ORDER[to] !== undefined;
}

// ─── Anti-Fraud Heuristike (#12) ─────────────────────────────────────────────

export interface FraudSignal {
  level: 'low' | 'medium' | 'high';
  reason: string;
}

export interface FraudAssessment {
  blocked: boolean;
  signals: FraudSignal[];
  score: number; // 0 = čisto, 100 = blokirati
}

/**
 * Procenjuje rizik od prevare na osnovu:
 * - Previše checkout pokušaja u kratkom roku
 * - Previše neuspelih plaćanja
 * - Brza smena IP adresa
 */
export function assessFraudRisk(params: {
  checkoutAttemptsLastHour: number;
  failedPaymentsLast30Days: number;
  distinctIpsLast24h: number;
  isNewAccount: boolean;
}): FraudAssessment {
  const signals: FraudSignal[] = [];
  let score = 0;

  if (params.checkoutAttemptsLastHour >= 10) {
    signals.push({ level: 'high', reason: `${params.checkoutAttemptsLastHour} checkout pokušaja u sat vremena` });
    score += 40;
  } else if (params.checkoutAttemptsLastHour >= 5) {
    signals.push({ level: 'medium', reason: `${params.checkoutAttemptsLastHour} checkout pokušaja u sat vremena` });
    score += 20;
  }

  if (params.failedPaymentsLast30Days >= 5) {
    signals.push({ level: 'high', reason: `${params.failedPaymentsLast30Days} neuspelih plaćanja u 30 dana` });
    score += 35;
  } else if (params.failedPaymentsLast30Days >= 3) {
    signals.push({ level: 'medium', reason: `${params.failedPaymentsLast30Days} neuspelih plaćanja u 30 dana` });
    score += 15;
  }

  if (params.distinctIpsLast24h >= 5) {
    signals.push({ level: 'medium', reason: `${params.distinctIpsLast24h} različitih IP adresa u 24h` });
    score += 25;
  }

  if (params.isNewAccount && params.checkoutAttemptsLastHour >= 3) {
    signals.push({ level: 'medium', reason: 'Nov nalog sa visokim brojem checkout pokušaja' });
    score += 15;
  }

  return {
    blocked: score >= 60,
    signals,
    score: Math.min(score, 100),
  };
}

// ─── Cooldown Guard (#14) ─────────────────────────────────────────────────────

/** Minimalno vreme između dve promene plana u sekundama (podrazumevano 300 = 5 min). */
export const PLAN_CHANGE_COOLDOWN_SEC = 300;

/**
 * Proverava da li je korisnik u periodu čekanja za promenu plana.
 *
 * @param lastPlanChangedAt ISO8601 timestamp ili null
 * @param nowMs Trenutno vreme u ms (za testiranje)
 * @returns `true` ako je cooldown prošao (promena dozvoljena)
 */
export function isPlanChangeCooldownPassed(
  lastPlanChangedAt: string | null,
  nowMs = Date.now(),
): boolean {
  if (!lastPlanChangedAt) return true;
  const lastMs = Date.parse(lastPlanChangedAt);
  if (isNaN(lastMs)) return true;
  return nowMs - lastMs >= PLAN_CHANGE_COOLDOWN_SEC * 1000;
}

// ─── Active Checkout Session Limit (#11) ─────────────────────────────────────

/** Maksimalan broj istovremeno aktivnih checkout sesija po korisniku. */
export const MAX_ACTIVE_CHECKOUT_SESSIONS = 3;

// ─── Plan Sync Validator (#41) ────────────────────────────────────────────────

export interface PlanSyncResult {
  inSync: boolean;
  mismatches: Array<{ planId: string; field: string; local: unknown; remote: unknown }>;
}

/**
 * Poredi lokalne definicije planova sa podacima sa Stripe API-ja.
 */
export function validatePlanSync(
  localPlans: Array<{ id: string; stripePriceId: string; cenaEur: number }>,
  remotePrices: Array<{ id: string; unit_amount: number | null; currency: string }>,
): PlanSyncResult {
  const mismatches: PlanSyncResult['mismatches'] = [];

  for (const local of localPlans) {
    if (!local.stripePriceId) continue;
    const remote = remotePrices.find((r) => r.id === local.stripePriceId);

    if (!remote) {
      mismatches.push({ planId: local.id, field: 'stripePriceId', local: local.stripePriceId, remote: 'not found' });
      continue;
    }

    const remoteEur = remote.currency === 'eur' && remote.unit_amount !== null
      ? remote.unit_amount / 100
      : null;

    if (remoteEur !== null && Math.abs(remoteEur - local.cenaEur) > 0.01) {
      mismatches.push({ planId: local.id, field: 'cenaEur', local: local.cenaEur, remote: remoteEur });
    }
  }

  return { inSync: mismatches.length === 0, mismatches };
}

// ─── Soft-Lock (#15) ─────────────────────────────────────────────────────────

/** Broj neuspelih naplate posle kojih se nalog soft-lockuje. */
export const SOFT_LOCK_FAILURE_THRESHOLD = 3;

/**
 * Vraća `true` ako nalog treba soft-lockati na osnovu broja neuspelih naplata.
 */
export function shouldSoftLock(failedPaymentCount: number): boolean {
  return failedPaymentCount >= SOFT_LOCK_FAILURE_THRESHOLD;
}

// ─── Grace Period (#16) ──────────────────────────────────────────────────────

/** Trajanje grace perioda u danima pre downgrade-a. */
export const GRACE_PERIOD_DAYS = 3;

/**
 * Računa krajnji datum grace perioda od trenutnog momenta.
 */
export function graceExpiresAt(fromMs = Date.now()): string {
  return new Date(fromMs + GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000).toISOString();
}
