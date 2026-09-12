import { PLANOVI } from './stripe/config';
import { STANDARDIZOVANI_PRETPLATA_STATUS_MODEL } from './login-pretplata';
import { APP_VERSION } from './constants';

export function getStartPretplateData() {
  return {
    naziv: 'Start Pretplate',
    verzija: APP_VERSION,
    planovi: PLANOVI.map((plan) => ({
      id: plan.id,
      naziv: plan.naziv,
      cenaEur: plan.cenaEur,
      mesecno: plan.mesecno,
      chatLimit: plan.chatLimit,
      funkcije: plan.funkcije,
      imaStripePrice: Boolean(plan.stripePriceId),
    })),
    statusModel: STANDARDIZOVANI_PRETPLATA_STATUS_MODEL,
    readiness: [
      'checkout → /api/stripe/checkout',
      'portal → /api/stripe/portal',
      'status pretplate → /api/spaja-pricing-login-status',
      'sync planova → /api/billing-plan-sync',
      'reconcile subscriptions → /api/admin/billing-reconcile-subscriptions',
      'reconcile invoices → /api/admin/billing-reconcile-invoices',
      'vercel governance → /api/vercel-status',
    ],
    onboarding: [
      'Registracija i verifikacija naloga',
      'Odabir plana i checkout',
      'Portal za upravljanje pretplatom',
      'Automatsko usklađivanje statusa i planova',
      'Otključavanje Digitalna Industrija dozvola i modula',
    ],
  };
}
