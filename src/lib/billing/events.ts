// SpajaUltraOmegaCore -∞Ω+∞ — Billing Events
// Kompanija SPAJA — Digitalna Industrija
// Provider-agnostic billing event types

export type BillingProvider = 'stripe' | 'paypal';

export type BillingEventType =
  | 'subscription_activated'
  | 'subscription_updated'
  | 'subscription_canceled'
  | 'payment_succeeded'
  | 'payment_failed'
  | 'payment_refunded'
  | 'trial_started'
  | 'trial_ended'
  | 'grace_period_started'
  | 'grace_period_ended'
  | 'account_locked'
  | 'account_unlocked';

export interface BillingEvent {
  id: string;
  type: BillingEventType;
  provider: BillingProvider;
  userId: string;
  planId: string;
  amount?: number;
  currency?: string;
  providerEventId: string;
  providerCustomerId: string;
  providerSubscriptionId?: string;
  metadata?: Record<string, string>;
  timestamp: string;
}

// Engine subscriber: which billing event types each engine cares about
export interface EngineSubscription {
  engineId: string;
  eventTypes: BillingEventType[];
  onEvent: (event: BillingEvent) => void;
}

// Engine-to-Event matrix
export const ENGINE_EVENT_MATRIX: Record<string, BillingEventType[]> = {
  'spaja-pro': ['subscription_activated', 'subscription_updated', 'subscription_canceled', 'payment_failed', 'grace_period_started', 'grace_period_ended', 'account_locked', 'account_unlocked'],
  'omega-ai': ['subscription_activated', 'subscription_canceled', 'account_locked', 'account_unlocked'],
  'omega-auth': ['subscription_activated', 'subscription_canceled', 'payment_failed', 'account_locked', 'account_unlocked', 'grace_period_started'],
  'dashboard': ['subscription_activated', 'subscription_updated', 'subscription_canceled', 'payment_succeeded', 'payment_failed'],
  'monitoring': ['payment_failed', 'subscription_canceled', 'account_locked', 'grace_period_started'],
  'autofinish': ['payment_failed', 'account_locked'],
  'glavni-endzin': ['subscription_activated', 'subscription_updated', 'subscription_canceled', 'payment_failed', 'account_locked'],
};

export function getEngineMatrix() {
  return Object.entries(ENGINE_EVENT_MATRIX).map(([engineId, eventTypes]) => ({
    engineId,
    eventTypes,
    ukupnoEventTipova: eventTypes.length,
  }));
}
