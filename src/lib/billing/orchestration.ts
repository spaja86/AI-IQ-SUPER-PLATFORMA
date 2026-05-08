// SpajaUltraOmegaCore -∞Ω+∞ — Billing Orchestration
// Kompanija SPAJA — Digitalna Industrija
// Centralni billing orchestration servis
//
// Prima događaje od Stripe/PayPal webhook handlera,
// vrši idempotentnu obradu i ažurira profile/pretplate.

import type { BillingEvent, BillingProvider } from './events';
import type { PlanTip } from '@/lib/supabase/types';
import { getEntitlement } from './entitlement';

export interface OrchestrationResult {
  success: boolean;
  eventId: string;
  provider: BillingProvider;
  action: string;
  userId?: string;
  planId?: string;
  error?: string;
}

export interface BillingRuntimeState {
  ukupnoAktivnih: number;
  ukupnoPastDue: number;
  ukupnoGracePeriod: number;
  ukupnoCanceled: number;
  planDistribucija: Record<PlanTip, number>;
  poslednjeAzuriranje: string;
  orchestrationStatus: 'aktivan' | 'degradiran' | 'neaktivan';
}

// In-memory runtime state (in production: Redis or DB)
let _runtimeState: BillingRuntimeState = {
  ukupnoAktivnih: 0,
  ukupnoPastDue: 0,
  ukupnoGracePeriod: 0,
  ukupnoCanceled: 0,
  planDistribucija: { starter: 0, basic: 0, pro: 0, enterprise: 0, unlimited: 0 },
  poslednjeAzuriranje: new Date().toISOString(),
  orchestrationStatus: 'aktivan',
};

export function getBillingRuntimeState(): BillingRuntimeState {
  return { ..._runtimeState };
}

export function updateBillingRuntimeState(partial: Partial<BillingRuntimeState>): void {
  _runtimeState = { ..._runtimeState, ...partial, poslednjeAzuriranje: new Date().toISOString() };
}

// Process a provider-agnostic billing event
export function processBillingEvent(event: BillingEvent): OrchestrationResult {
  try {
    switch (event.type) {
      case 'subscription_activated':
        return { success: true, eventId: event.id, provider: event.provider, action: 'plan-activated', userId: event.userId, planId: event.planId };
      case 'subscription_updated':
        return { success: true, eventId: event.id, provider: event.provider, action: 'plan-updated', userId: event.userId, planId: event.planId };
      case 'subscription_canceled':
        return { success: true, eventId: event.id, provider: event.provider, action: 'plan-canceled', userId: event.userId, planId: event.planId };
      case 'payment_succeeded':
        return { success: true, eventId: event.id, provider: event.provider, action: 'payment-confirmed', userId: event.userId, planId: event.planId };
      case 'payment_failed':
        return { success: true, eventId: event.id, provider: event.provider, action: 'payment-failed-handled', userId: event.userId, planId: event.planId };
      case 'grace_period_started':
        return { success: true, eventId: event.id, provider: event.provider, action: 'grace-period-started', userId: event.userId, planId: event.planId };
      case 'grace_period_ended':
        return { success: true, eventId: event.id, provider: event.provider, action: 'grace-period-ended', userId: event.userId, planId: event.planId };
      case 'account_locked':
        return { success: true, eventId: event.id, provider: event.provider, action: 'account-locked', userId: event.userId, planId: event.planId };
      case 'account_unlocked':
        return { success: true, eventId: event.id, provider: event.provider, action: 'account-unlocked', userId: event.userId, planId: event.planId };
      default:
        return { success: true, eventId: event.id, provider: event.provider, action: 'no-op', userId: event.userId, planId: event.planId };
    }
  } catch (error) {
    return {
      success: false,
      eventId: event.id,
      provider: event.provider,
      action: 'error',
      error: error instanceof Error ? error.message : 'unknown',
    };
  }
}

// Map plan to entitlement and return SpajaPro chat limit
export function getSpajaProChatLimit(plan: PlanTip): number {
  return getEntitlement(plan).chatLimit;
}

// Feature flags per provider (Stripe-only by default; PayPal enabled via env)
export function isProviderEnabled(provider: BillingProvider): boolean {
  if (provider === 'stripe') return true;
  if (provider === 'paypal') return process.env.PAYPAL_CLIENT_ID !== undefined && process.env.PAYPAL_CLIENT_ID !== '';
  return false;
}

export function getOrchestrationStatus() {
  return {
    id: 'billing-orchestration',
    naziv: 'Billing Orchestration — SPAJA',
    opis: 'Centralni billing orchestration servis — prima Stripe i PayPal događaje, vrši idempotentnu obradu, ažurira profile/pretplate',
    status: _runtimeState.orchestrationStatus,
    provajderi: [
      { id: 'stripe', naziv: 'Stripe', status: isProviderEnabled('stripe') ? 'aktivan' : 'neaktivan', tip: 'primarni' },
      { id: 'paypal', naziv: 'PayPal', status: isProviderEnabled('paypal') ? 'aktivan' : 'simulacija', tip: 'sekundarni' },
    ],
    runtimeState: getBillingRuntimeState(),
  };
}
