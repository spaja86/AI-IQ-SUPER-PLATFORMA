import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';

export type PlatformTokenType = 'access' | 'refresh';

export interface PlatformTokenPayload {
  sub: string;
  sid: string;
  scopes: string[];
  type: PlatformTokenType;
  iat: number;
  exp: number;
  jti: string;
}

const DEFAULT_SECRET = 'spaja-platform-unified-auth-dev-secret-32-char-minimum-2026';

function getSecret(): string {
  const secret = process.env.PLATFORM_JWT_SECRET?.trim();
  if (secret) return secret;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('PLATFORM_JWT_SECRET must be configured in production.');
  }
  return DEFAULT_SECRET;
}

function toBase64Url(input: string | Buffer): string {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function fromBase64Url(input: string): string {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = base64.length % 4;
  const normalized = pad ? `${base64}${'='.repeat(4 - pad)}` : base64;
  return Buffer.from(normalized, 'base64').toString('utf8');
}

function sign(data: string): string {
  const mac = createHmac('sha256', getSecret()).update(data).digest();
  return toBase64Url(mac);
}

function createToken(payload: PlatformTokenPayload): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = toBase64Url(JSON.stringify(header));
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = sign(`${encodedHeader}.${encodedPayload}`);
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export function mintAccessToken(userId: string, sessionId: string, scopes: string[], ttlSec = 15 * 60): string {
  const now = Math.floor(Date.now() / 1000);
  return createToken({
    sub: userId,
    sid: sessionId,
    scopes: [...new Set(scopes)],
    type: 'access',
    iat: now,
    exp: now + ttlSec,
    jti: randomUUID(),
  });
}

export function mintRefreshToken(userId: string, sessionId: string, scopes: string[], ttlSec = 60 * 60 * 24 * 30): string {
  const now = Math.floor(Date.now() / 1000);
  return createToken({
    sub: userId,
    sid: sessionId,
    scopes: [...new Set(scopes)],
    type: 'refresh',
    iat: now,
    exp: now + ttlSec,
    jti: randomUUID(),
  });
}

export function verifyToken(token: string, expectedType?: PlatformTokenType): PlatformTokenPayload | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [header, payload, signature] = parts;
  const computed = sign(`${header}.${payload}`);

  if (computed.length !== signature.length) return null;
  if (!timingSafeEqual(Buffer.from(computed), Buffer.from(signature))) return null;

  try {
    const data = JSON.parse(fromBase64Url(payload)) as PlatformTokenPayload;
    if (expectedType && data.type !== expectedType) return null;
    if (!data.sub || !data.sid || !Array.isArray(data.scopes)) return null;
    if (Math.floor(Date.now() / 1000) >= data.exp) return null;
    return data;
  } catch {
    return null;
  }
}
