// SpajaUltraOmegaCore -∞Ω+∞ — Billing Tracing
// Kompanija SPAJA — Digitalna Industrija
//
// Implementira:
//   • Request-ID tracing kroz ceo billing tok (#31)
//   • Korelacija Stripe event ID ↔ user action log (#32)

import type { NextRequest } from 'next/server';
import { randomUUID } from 'crypto';

// ─── Request-ID generisanje ───────────────────────────────────────────────────

/**
 * Dohvata ili generiše `X-Request-ID` za billing zahtev.
 * Koristi `X-Request-ID` ili `X-Trace-ID` header ako postoje,
 * inače generiše novi UUID v4.
 */
export function getBillingRequestId(request: NextRequest): string {
  return (
    request.headers.get('x-request-id') ??
    request.headers.get('x-trace-id') ??
    `billing-${randomUUID()}`
  );
}

// ─── Billing Trace Context ────────────────────────────────────────────────────

export interface BillingTraceContext {
  requestId: string;
  stripeEventId?: string;
  userId?: string;
  endpoint: string;
  startedAt: number;
}

export function createTraceContext(
  request: NextRequest,
  endpoint: string,
): BillingTraceContext {
  return {
    requestId: getBillingRequestId(request),
    endpoint,
    startedAt: Date.now(),
  };
}

/**
 * Loguje početak billing operacije.
 */
export function traceStart(ctx: BillingTraceContext): void {
  console.info(
    `[billing-trace] START requestId=${ctx.requestId} endpoint=${ctx.endpoint}`,
  );
}

/**
 * Loguje kraj billing operacije sa durationom.
 */
export function traceEnd(
  ctx: BillingTraceContext,
  status: 'ok' | 'error' | 'duplicate' | 'blocked',
  details?: string,
): void {
  const duration = Date.now() - ctx.startedAt;
  console.info(
    `[billing-trace] END requestId=${ctx.requestId} endpoint=${ctx.endpoint} ` +
    `status=${status} duration=${duration}ms` +
    (ctx.stripeEventId ? ` stripeEventId=${ctx.stripeEventId}` : '') +
    (ctx.userId ? ` userId=${ctx.userId}` : '') +
    (details ? ` details=${details}` : ''),
  );
}

/**
 * Loguje korelaciju između Stripe event ID i korisničke akcije.
 * Korišćenje: posle svake promene profila izazvane Stripe event-om.
 */
export function traceStripeUserCorrelation(params: {
  requestId: string;
  stripeEventId: string;
  stripeEventType: string;
  userId: string | null | undefined;
  action: string;
}): void {
  console.info(
    `[billing-correlation] requestId=${params.requestId} ` +
    `stripeEvent=${params.stripeEventId} (${params.stripeEventType}) ` +
    `-> userId=${params.userId ?? 'unknown'} action=${params.action}`,
  );
}

/**
 * Loguje webhook grešku sa request ID-em za lakšu dijagnostiku.
 */
export function traceWebhookError(params: {
  requestId: string;
  stripeEventId?: string;
  stripeEventType?: string;
  error: unknown;
  step: string;
}): void {
  const msg = params.error instanceof Error ? params.error.message : String(params.error);
  console.error(
    `[billing-error] requestId=${params.requestId} step=${params.step} ` +
    (params.stripeEventId ? `stripeEvent=${params.stripeEventId} ` : '') +
    (params.stripeEventType ? `type=${params.stripeEventType} ` : '') +
    `error="${msg}"`,
  );
}
