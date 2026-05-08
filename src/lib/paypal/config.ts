// SpajaUltraOmegaCore -∞Ω+∞ — PayPal Konfiguracija
// Kompanija SPAJA — Digitalna Industrija
// PayPal REST API klijent i definicije planova

import type { PlanTip } from '@/lib/supabase/types';

export const PAYPAL_API_BASE =
  process.env.PAYPAL_ENVIRONMENT === 'production'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

export interface PayPalPlan {
  id: PlanTip;
  naziv: string;
  opis: string;
  cenaEur: number;
  paypalPlanId: string; // PayPal Billing Plan ID
}

export const PAYPAL_PLANOVI: PayPalPlan[] = [
  {
    id: 'basic',
    naziv: 'Basic',
    opis: 'Plan za pojedince sa prosirenim mogucnostima',
    cenaEur: 9,
    paypalPlanId: process.env.PAYPAL_PLAN_BASIC ?? '',
  },
  {
    id: 'pro',
    naziv: 'Pro',
    opis: 'Profesionalni plan sa naprednim alatima',
    cenaEur: 29,
    paypalPlanId: process.env.PAYPAL_PLAN_PRO ?? '',
  },
  {
    id: 'enterprise',
    naziv: 'Enterprise',
    opis: 'Korporativni plan sa punom podrskom',
    cenaEur: 99,
    paypalPlanId: process.env.PAYPAL_PLAN_ENTERPRISE ?? '',
  },
  {
    id: 'unlimited',
    naziv: 'Unlimited',
    opis: 'Neogranicen pristup svim funkcijama',
    cenaEur: 199,
    paypalPlanId: process.env.PAYPAL_PLAN_UNLIMITED ?? '',
  },
];

export function getPayPalPlanById(id: string): PayPalPlan | undefined {
  return PAYPAL_PLANOVI.find((p) => p.id === id);
}

export function getPayPalPlanByPayPalId(paypalPlanId: string): PayPalPlan | undefined {
  return PAYPAL_PLANOVI.find((p) => p.paypalPlanId === paypalPlanId);
}

// Dobavi PayPal OAuth token
export async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('PAYPAL_CLIENT_ID i PAYPAL_CLIENT_SECRET moraju biti postavljeni.');
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error(`PayPal OAuth neuspešan: ${response.status} ${response.statusText}`);
  }

  const data = await response.json() as { access_token: string };
  return data.access_token;
}

// Verifikuj PayPal webhook potpis
export function isPayPalWebhookEnabled(): boolean {
  return Boolean(process.env.PAYPAL_WEBHOOK_ID);
}
