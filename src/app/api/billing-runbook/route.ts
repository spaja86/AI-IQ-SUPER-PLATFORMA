// SpajaUltraOmegaCore -∞Ω+∞ — Billing Runbook
// Kompanija SPAJA — Digitalna Industrija
// GET /api/billing-runbook — operativni runbook za billing incidente

import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    sistem: 'Billing Runbook — SPAJA',
    verzija: APP_VERSION,
    opis: 'Operativni runbook za billing incidente — webhook kašnjenje, DLQ rast, plan mismatch, auth/billing drift',
    runbook: [
      {
        incident: 'Webhook kašnjenje (Stripe)',
        simptomi: ['DLQ dubina raste', 'Korisnici ne dobijaju plan aktivaciju', 'billing-health avgWebhookLatencyMs > 5000ms'],
        koraci: [
          'Proveri /api/billing-health → webhook.dlqDepth',
          'Proveri Stripe Dashboard → Webhooks → Failed deliveries',
          'Replayuj failed events: POST /api/stripe/webhook-replay sa event ID-ovima',
          'Proveri circuit breaker stanje: /api/billing-health → circuitBreakers',
          'Ako je circuit OPEN: sačekaj 60s pa retry',
        ],
        eskalacija: 'Ako DLQ > 50 i ne opada: ručno procesuj via Stripe dashboard',
      },
      {
        incident: 'Webhook kašnjenje (PayPal)',
        simptomi: ['PayPal webhook events ne stižu', 'Korisnici ne dobijaju plan aktivaciju'],
        koraci: [
          'Proveri /api/billing-orchestration-status → provajderi.paypal.status',
          'Proveri PayPal Developer Dashboard → Webhooks',
          'Verifikuj PAYPAL_WEBHOOK_ID env var',
          'Ponovi ručnu PayPal webhook simulaciju via sandbox',
        ],
        eskalacija: 'Ako PAYPAL_CLIENT_ID ili PAYPAL_CLIENT_SECRET nedostaje: PayPal je u simulacionom modu',
      },
      {
        incident: 'DLQ rast',
        simptomi: ['billing-health.webhook.dlqDepth > 50', 'DLQ growth trend alert'],
        koraci: [
          'Preuzemlji sve unprocessed events: SELECT * FROM webhook_dead_letter WHERE replayed=false',
          'Pokušaj replay: POST /api/stripe/webhook-dlq-replay',
          'Identifikuj pattern: koji event_type dominira?',
          'Ako je idempotency issue: proveri stripe_webhook_events tabelu za duplikate',
        ],
        eskalacija: 'DLQ > 100: kontaktiraj billing tim',
      },
      {
        incident: 'Plan mismatch (auth/billing drift)',
        simptomi: ['Korisnik ima plan u sesiji ali ne u bazi', 'Entitlement ne odgovara planu'],
        koraci: [
          'Proveri /api/billing-integrity-check (POST sa CRON_SECRET)',
          'Pokreni /api/billing-plan-sync za Stripe price ID usklađivanje',
          'Pokreni /api/billing-reconcile-all za cross-provider provjeru',
          'Ažuriraj profiles.plan ručno ako je neophodno (uz audit log)',
        ],
        eskalacija: 'Batch popravka: UPDATE profiles SET plan=X WHERE condition',
      },
      {
        incident: 'Auth/Billing drift (korisnik ima token sa starim planom)',
        simptomi: ['Korisnik vidi stari plan u UI', 'SpajaPro chat limit ne odgovara planu'],
        koraci: [
          'Invalidate user session: korisnik se mora ponovo prijaviti',
          'Ažuriraj sacuvajSesiju() da učita sveži plan iz API-ja',
          'Proveri OMEGA auth clearanceLevel mapiranje',
        ],
        eskalacija: 'Sistem-wide drift: pokreni batch session invalidation',
      },
    ],
    kontakti: {
      billing: 'billing@spaja.rs',
      tehnickaPodrska: 'tech@spaja.rs',
      emergencyEscalation: 'spajicn@yahoo.com',
    },
    timestamp: new Date().toISOString(),
  });
}
