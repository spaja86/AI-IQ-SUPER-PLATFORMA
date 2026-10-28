// Adapter for an approved Node ingress terminating the CLIENT connection directly.
// Do not place it behind another proxy without a separately reviewed transport policy.
import type { IncomingMessage } from 'node:http';
import { createHmac, randomUUID } from 'node:crypto';
import { canonicalIp, checkoutProxyMessage, CHECKOUT_PATH, MAX_CHECKOUT_BODY_BYTES } from '@/lib/stripe/checkout-fraud';

export function attestCheckoutAtIngress(
  request: Pick<IncomingMessage, 'method' | 'url' | 'headers' | 'socket'>,
  rawBody: string,
  config: { proxyId: string; audience: string; key: string },
): Record<string, string> {
  if (request.method !== 'POST' || request.url !== CHECKOUT_PATH ||
      !/^[a-zA-Z0-9_-]{1,64}$/.test(config.proxyId) || !/^[a-zA-Z0-9_-]{1,64}$/.test(config.audience) ||
      !/^[a-f0-9]{64}$/.test(config.key) || Buffer.byteLength(rawBody) > MAX_CHECKOUT_BODY_BYTES) {
    throw new Error('Invalid Checkout ingress request');
  }
  // IncomingMessage.socket is transport-owned; NO HTTP header is consulted for identity.
  const ip = canonicalIp(request.socket.remoteAddress ?? '');
  const headers: Record<string, string> = {};
  // Forward only application inputs. Drops client source/forwarding/trace/hop-by-hop headers.
  for (const name of ['authorization', 'content-type', 'idempotency-key']) {
    const value = request.headers[name];
    if (Array.isArray(value)) throw new Error('Ambiguous Checkout ingress header');
    if (value !== undefined) headers[name] = value;
  }
  const timestamp = String(Math.floor(Date.now() / 1000));
  const nonce = randomUUID();
  const message = checkoutProxyMessage({ ...config, timestamp, nonce, ip, body: rawBody,
    authorization: headers.authorization ?? '', idempotencyKey: headers['idempotency-key'] ?? '' });
  return { ...headers, 'x-spaja-source-proxy': config.proxyId, 'x-spaja-source-time': timestamp,
    'x-spaja-source-nonce': nonce, 'x-spaja-source-ip': ip,
    'x-spaja-source-signature': createHmac('sha256', Buffer.from(config.key, 'hex')).update(message).digest('hex') };
}
