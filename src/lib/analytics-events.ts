// SpajaUltraOmegaCore -∞Ω+∞ — Analytics Events
// Kompanija SPAJA — Digitalna Industrija
//
// Talas 6 (P1/P2): Analytics i BI — funnel, cohort, LTV metrike.
//
// Implementira:
//   • Standardizovane event tipove za funnel tracking
//   • Cohort event konstante
//   • LTV signal definicije
//   • In-memory event buffer sa flush mehanizmom
//   • Kategorije za segmentaciju korisnika
//
// Upotreba:
//   import { trackEvent, FUNNEL_EVENTS } from '@/lib/analytics-events';
//   trackEvent({ tip: FUNNEL_EVENTS.SIGNUP_STARTED, userId: '...' });

// ─── Event Kategorije ─────────────────────────────────────────────────────────

/**
 * Standardizovani funnel eventi za akviziciju i konverziju.
 */
export const FUNNEL_EVENTS = {
  // Akvizicija
  PAGE_VIEW: 'page_view',
  LANDING_VIEW: 'landing_view',
  PRICING_VIEW: 'pricing_view',
  // Registracija
  SIGNUP_STARTED: 'signup_started',
  SIGNUP_COMPLETED: 'signup_completed',
  EMAIL_VERIFIED: 'email_verified',
  // Onboarding
  ONBOARDING_STARTED: 'onboarding_started',
  ONBOARDING_STEP: 'onboarding_step',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  // AI Usage
  AI_CHAT_STARTED: 'ai_chat_started',
  AI_MESSAGE_SENT: 'ai_message_sent',
  AI_TOOL_USED: 'ai_tool_used',
  AI_RESPONSE_RATED: 'ai_response_rated',
  // Billing
  CHECKOUT_STARTED: 'checkout_started',
  CHECKOUT_COMPLETED: 'checkout_completed',
  CHECKOUT_ABANDONED: 'checkout_abandoned',
  PLAN_UPGRADED: 'plan_upgraded',
  PLAN_DOWNGRADED: 'plan_downgraded',
  PLAN_CANCELLED: 'plan_cancelled',
  PAYMENT_FAILED: 'payment_failed',
  // Gaming
  GAME_STARTED: 'game_started',
  GAME_COMPLETED: 'game_completed',
  GAME_ABANDONED: 'game_abandoned',
  HIGH_SCORE: 'high_score',
  // Retention
  SESSION_START: 'session_start',
  SESSION_END: 'session_end',
  FEATURE_DISCOVERED: 'feature_discovered',
  // Error
  ERROR_ENCOUNTERED: 'error_encountered',
  RATE_LIMITED: 'rate_limited',
  // Deployment
  DEPLOYMENT_TRIGGERED: 'deployment_triggered',
  DEPLOYMENT_SUCCESS: 'deployment_success',
  DEPLOYMENT_FAILED: 'deployment_failed',
  VERCEL_CONNECTED: 'vercel_connected',
  VERCEL_KV_PING_SUCCESS: 'vercel_kv_ping_success',
  VERCEL_KV_PING_FAILED: 'vercel_kv_ping_failed',
} as const;

export type FunnelEvent = (typeof FUNNEL_EVENTS)[keyof typeof FUNNEL_EVENTS];

/**
 * LTV (Life Time Value) signal eventi — direktni prihodni indikatori.
 */
export const LTV_SIGNALS = {
  FIRST_PAYMENT: 'ltv_first_payment',
  RECURRING_PAYMENT: 'ltv_recurring_payment',
  UPGRADE: 'ltv_upgrade',
  CHURN: 'ltv_churn',
  REACTIVATION: 'ltv_reactivation',
  REFERRAL_CONVERTED: 'ltv_referral_converted',
} as const;

export type LtvSignal = (typeof LTV_SIGNALS)[keyof typeof LTV_SIGNALS];

// ─── Event Interface ──────────────────────────────────────────────────────────

export interface AnalyticsEvent {
  /** Tip eventa. */
  tip: string;
  /** Timestamp (ISO). Automatski se popunjava ako se ne navede. */
  timestamp?: string;
  /** ID korisnika (null za anonimne). */
  userId?: string | null;
  /** Anonymous session ID. */
  sessionId?: string;
  /** Stranica/ruta na kojoj se desio event. */
  page?: string;
  /** Dodatni properties. */
  properties?: Record<string, unknown>;
  /** Source (npr. 'web', 'api', 'mobile'). */
  source?: string;
}

export interface EnrichedAnalyticsEvent extends AnalyticsEvent {
  eventId: string;
  timestamp: string;
  source: string;
}

// ─── Cohort Definicije ────────────────────────────────────────────────────────

export interface CohortDefinition {
  id: string;
  naziv: string;
  opis: string;
  /** Kriterijum ulaska u cohort. */
  entryEvent: string;
  /** Kriterijum konverzije. */
  conversionEvent: string;
  /** Okno merenja u danima. */
  windowDays: number;
}

export const COHORTS: CohortDefinition[] = [
  {
    id: 'signup-to-first-ai',
    naziv: 'Signup → Prva AI poruka',
    opis: 'Vreme od registracije do prve AI chat poruke.',
    entryEvent: FUNNEL_EVENTS.SIGNUP_COMPLETED,
    conversionEvent: FUNNEL_EVENTS.AI_MESSAGE_SENT,
    windowDays: 7,
  },
  {
    id: 'pricing-to-checkout',
    naziv: 'Pricing → Checkout',
    opis: 'Konverzija posete pricing stranice u checkout.',
    entryEvent: FUNNEL_EVENTS.PRICING_VIEW,
    conversionEvent: FUNNEL_EVENTS.CHECKOUT_STARTED,
    windowDays: 3,
  },
  {
    id: 'checkout-to-paid',
    naziv: 'Checkout → Plaćeno',
    opis: 'Stopa završavanja checkout procesa.',
    entryEvent: FUNNEL_EVENTS.CHECKOUT_STARTED,
    conversionEvent: FUNNEL_EVENTS.CHECKOUT_COMPLETED,
    windowDays: 1,
  },
  {
    id: 'free-to-paid',
    naziv: 'Free → Paid',
    opis: 'Konverzija besplatnih korisnika u plaćene u 30 dana.',
    entryEvent: FUNNEL_EVENTS.SIGNUP_COMPLETED,
    conversionEvent: FUNNEL_EVENTS.CHECKOUT_COMPLETED,
    windowDays: 30,
  },
  {
    id: 'paid-retention-30d',
    naziv: 'Paid Retention 30d',
    opis: 'Procenat plaćenih korisnika koji ostaju aktivi posle 30 dana.',
    entryEvent: FUNNEL_EVENTS.CHECKOUT_COMPLETED,
    conversionEvent: FUNNEL_EVENTS.SESSION_START,
    windowDays: 30,
  },
];

// ─── Event Buffer ─────────────────────────────────────────────────────────────

const _eventBuffer: EnrichedAnalyticsEvent[] = [];
const MAX_BUFFER_SIZE = 1000;

let _flushCallback: ((events: EnrichedAnalyticsEvent[]) => Promise<void>) | null = null;

/**
 * Registruje callback za flush eventi (npr. slanje na analytics backend).
 */
export function registerAnalyticsFlush(
  callback: (events: EnrichedAnalyticsEvent[]) => Promise<void>,
): void {
  _flushCallback = callback;
}

/**
 * Prati analytics event.
 *
 * @param event - Analytics event koji se prati.
 * @returns Enriched event sa eventId i timestampom.
 */
export function trackEvent(event: AnalyticsEvent): EnrichedAnalyticsEvent {
  const enriched: EnrichedAnalyticsEvent = {
    ...event,
    eventId: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    timestamp: event.timestamp ?? new Date().toISOString(),
    source: event.source ?? 'web',
  };

  _eventBuffer.push(enriched);

  // Auto-flush pri prepunjenju
  if (_eventBuffer.length >= MAX_BUFFER_SIZE) {
    void flushAnalyticsEvents();
  }

  return enriched;
}

/**
 * Flushuje sve buffered evente na backend.
 */
export async function flushAnalyticsEvents(): Promise<EnrichedAnalyticsEvent[]> {
  if (_eventBuffer.length === 0) return [];

  const toFlush = _eventBuffer.splice(0, _eventBuffer.length);

  if (_flushCallback) {
    try {
      await _flushCallback(toFlush);
    } catch {
      // Vrati evente u buffer pri grešci (tail)
      _eventBuffer.unshift(...toFlush.slice(-100));
    }
  }

  return toFlush;
}

/**
 * Vraća broj buffovanih eventi.
 */
export function getBufferSize(): number {
  return _eventBuffer.length;
}

// ─── Funnel Statistike ────────────────────────────────────────────────────────

export interface FunnelStep {
  event: string;
  naziv: string;
  count: number;
  conversionRate: number; // 0-1 od prethodnog koraka
}

/**
 * Kreira funnel statistiku iz liste event count-ova.
 */
export function buildFunnelStats(
  steps: Array<{ event: string; naziv: string; count: number }>,
): FunnelStep[] {
  return steps.map((step, idx) => {
    const prevCount = idx === 0 ? step.count : steps[idx - 1].count;
    const conversionRate = prevCount > 0 ? step.count / prevCount : 0;
    return { ...step, conversionRate: Math.round(conversionRate * 1000) / 1000 };
  });
}

// ─── User Segmentacija ────────────────────────────────────────────────────────

export type UserSegment =
  | 'free'       // Starter plan, < 10 poruka
  | 'active_free' // Starter, >= 10 poruka
  | 'paid'       // Basic/Pro
  | 'enterprise' // Enterprise/Unlimited
  | 'churned'    // Otkazao pretplatu
  | 'at_risk'    // Smanjena aktivnost posle plaćanja
  | 'champion';  // Visoka aktivnost + plaćanje

/**
 * Određuje user segment na osnovu metrika.
 */
export function determineUserSegment(
  params: {
    plan: string;
    messageCount: number;
    daysSinceLastLogin: number;
    hasEverPaid: boolean;
    isSubscriptionActive: boolean;
  }
): UserSegment {
  const { plan, messageCount, daysSinceLastLogin, hasEverPaid, isSubscriptionActive } = params;

  if (!isSubscriptionActive && hasEverPaid) return 'churned';
  if (plan === 'enterprise' || plan === 'unlimited') {
    return messageCount > 500 && daysSinceLastLogin < 7 ? 'champion' : 'enterprise';
  }
  if (plan === 'basic' || plan === 'pro') {
    if (daysSinceLastLogin > 14) return 'at_risk';
    return 'paid';
  }
  // Free tier
  return messageCount >= 10 ? 'active_free' : 'free';
}
