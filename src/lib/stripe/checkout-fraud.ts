// Server-only Checkout admission. No fallback to client IP headers or process memory.
import { createHash, createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { isIP } from 'node:net';
import { withRetry } from '@/lib/stripe/billing-guard';
import { assessFraudRisk } from '@/lib/stripe/billing-validators';
import type { getSupabaseServerClient } from '@/lib/supabase/server';

export const CHECKOUT_PATH = '/api/stripe/checkout';
export const MAX_CHECKOUT_BODY_BYTES = 16_384;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const HEX_KEY = /^[0-9a-f]{64}$/;
export class CheckoutAdmissionError extends Error {
  constructor() { super('Checkout admission unavailable'); }
}

export function canonicalIp(value: string): string {
  if (value.includes('%') || value !== value.trim()) throw new CheckoutAdmissionError();
  const version = isIP(value);
  if (version === 4) return value;
  if (version !== 6) throw new CheckoutAdmissionError();
  // WHATWG normalizes compressed/expanded IPv6. Treat mapped IPv4 as the same source.
  const normalized = new URL(`http://[${value}]/`).hostname.slice(1, -1);
  const mapped = normalized.match(/^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/);
  if (!mapped) return normalized;
  const n = [parseInt(mapped[1], 16), parseInt(mapped[2], 16)];
  return [n[0] >> 8, n[0] & 255, n[1] >> 8, n[1] & 255].join('.');
}

const digest = (value: string) => createHash('sha256').update(value).digest('hex');

// Contract for a separately approved ingress: derive IP from its trusted transport,
// strip ALL incoming x-spaja-* headers, mint a new nonce for EVERY ingress request.
export function checkoutProxyMessage(input: {
  audience: string; proxyId: string; timestamp: string; nonce: string; ip: string;
  authorization: string; idempotencyKey: string; body: string;
}): string {
  return ['spaja-checkout-source-v1', input.audience, input.proxyId, input.timestamp,
    input.nonce, canonicalIp(input.ip), 'POST', CHECKOUT_PATH,
    digest(input.authorization), digest(input.idempotencyKey), digest(input.body)].join('\n');
}

export async function readCheckoutBody(request: Request): Promise<string> {
  const reader = request.body?.getReader();
  if (!reader) return '';
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_CHECKOUT_BODY_BYTES) { await reader.cancel(); throw new RangeError('Checkout body too large'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  return new TextDecoder('utf-8', { fatal: true }).decode(Buffer.concat(chunks));
}

export function verifyCheckoutSource(request: Request, body: string, now = Date.now()) {
  const proxyId = process.env.STRIPE_CHECKOUT_PROXY_ID ?? '';
  const audience = process.env.STRIPE_CHECKOUT_PROXY_AUDIENCE ?? '';
  const key = process.env.STRIPE_CHECKOUT_PROXY_KEY ?? '';
  const privacyKey = process.env.STRIPE_CHECKOUT_IP_HASH_KEY ?? '';
  if (!/^[a-zA-Z0-9_-]{1,64}$/.test(proxyId) || !/^[a-zA-Z0-9_-]{1,64}$/.test(audience) ||
      !HEX_KEY.test(key) || !HEX_KEY.test(privacyKey) || key === privacyKey) throw new CheckoutAdmissionError();
  const h = request.headers;
  const timestamp = h.get('x-spaja-source-time') ?? '';
  const nonce = h.get('x-spaja-source-nonce') ?? '';
  const ip = canonicalIp(h.get('x-spaja-source-ip') ?? '');
  const signature = h.get('x-spaja-source-signature') ?? '';
  if (h.get('x-spaja-source-proxy') !== proxyId || !/^\d{10}$/.test(timestamp) || !UUID.test(nonce) ||
      !HEX_KEY.test(signature) || request.method !== 'POST' || new URL(request.url).pathname !== CHECKOUT_PATH ||
      new URL(request.url).search || Number(timestamp) * 1000 < now - 60_000 || Number(timestamp) * 1000 > now + 10_000) {
    throw new CheckoutAdmissionError();
  }
  const message = checkoutProxyMessage({ audience, proxyId, timestamp, nonce, ip, body,
    authorization: h.get('authorization') ?? '', idempotencyKey: h.get('idempotency-key') ?? '' });
  const expected = createHmac('sha256', Buffer.from(key, 'hex')).update(message).digest();
  if (!timingSafeEqual(expected, Buffer.from(signature, 'hex'))) throw new CheckoutAdmissionError();
  return {
    nonce, issuedAt: Number(timestamp), requestHash: digest(message),
    ipHash: createHmac('sha256', Buffer.from(privacyKey, 'hex')).update(`checkout-ip-v1\n${ip}`).digest('hex'),
    identityKeyHash: digest(privacyKey),
  };
}

type Decision = 'allow' | 'fraud' | 'rate_user' | 'rate_ip' | 'billing_locked';
export async function recordCheckoutAdmission(
  db: ReturnType<typeof getSupabaseServerClient>, userId: string,
  source: ReturnType<typeof verifyCheckoutSource>,
) {
  // Internal RPC retries reuse this server ID. A fresh HTTP invocation gets a fresh ID,
  // even with the same Stripe Idempotency-Key. Reusing a proxy nonce is rejected by SQL.
  const attemptId = randomUUID();
  try {
    const result = await withRetry(async () => db.rpc('record_stripe_checkout_attempt', {
      p_attempt_id: attemptId, p_user_id: userId, p_proxy_nonce: source.nonce,
      p_issued_at: source.issuedAt, p_request_hash: source.requestHash,
      p_ip_hash: source.ipHash, p_identity_key_hash: source.identityKeyHash,
    }));
    const data = result.data;
    const counts = ['checkoutAttemptsLastHour', 'distinctIpsLast24h', 'ipAttemptsLastHour', 'failedPaymentsLast30Days'] as const;
    if (!data || data.committed !== true || data.attemptId !== attemptId ||
        counts.some(k => !Number.isSafeInteger(data[k]) || data[k] < 0) ||
        data.checkoutAttemptsLastHour < 1 || data.distinctIpsLast24h < 1 || data.ipAttemptsLastHour < 1 ||
        typeof data.isNewAccount !== 'boolean' || typeof data.billingLocked !== 'boolean') throw new CheckoutAdmissionError();
    const fraud = assessFraudRisk(data);
    const expected: Decision = data.billingLocked ? 'billing_locked' : fraud.blocked ? 'fraud'
      : data.checkoutAttemptsLastHour > 5 ? 'rate_user' : data.ipAttemptsLastHour > 20 ? 'rate_ip' : 'allow';
    if (data.decision !== expected || data.score !== fraud.score) throw new CheckoutAdmissionError();
    return { decision: expected, score: fraud.score };
  } catch {
    // Do not log provider errors: they may contain SQL parameters or pseudonymous data.
    throw new CheckoutAdmissionError();
  }
}
