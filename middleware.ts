// SpajaUltraOmegaCore -∞Ω+∞ — Next.js Edge Middleware
// Autofinish #858 — X-Request-Id header na svakom API odgovoru
// Kompanija SPAJA — Digitalna Industrija
//
// Edge-compatible middleware: IP blocking + rate limiting + X-Request-Id.
// Runs in the Vercel Edge Runtime before every request.
//
// Arhitektura:
//   1. IP blok lista (OMEGA_BLOCKED_IPS env var)
//   2. Rate limiting — cross-instance ako je VERCEL_KV konfigurisan, in-memory fallback
//   3. X-Request-Id — propagira ulazni header ili generiše req-XXXXXXXX fallback
//   4. Security headers su postavljeni u vercel.json (ne ovde, da bi se izbegli duplikati)
//   5. Brute-force zaštita za auth endpoint-e je u /api/auth/login via omega-security.ts

import { NextRequest, NextResponse } from 'next/server';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';

// ─── IP Block List ────────────────────────────────────────────────────────────

const BLOCKED_IPS = new Set<string>(
  (process.env.OMEGA_BLOCKED_IPS ?? '')
    .split(',')
    .map((ip) => ip.trim())
    .filter(Boolean),
);

// ─── Rate Limiter ─────────────────────────────────────────────────────────────
// Dva nivoa:
//   1. Vercel KV (cross-instance, produkcija) — ako su VERCEL_KV_* env vars postavljeni
//   2. In-memory fallback — za razvoj i serverless okruženja bez KV-a
//
// Limit-i:
//   - Anonimni korisnici: 200 zahteva / min
//   - Autentifikovani korisnici: 1000 zahteva / min

const RATE_LIMIT_WINDOW_SEC = 60;
const RATE_LIMIT_ANON = 200;
const RATE_LIMIT_AUTH = 1_000;

// In-memory fallback store
const memRateMap = new Map<string, { count: number; resetAt: number }>();

async function checkRateLimit(ip: string, isAuthenticated: boolean): Promise<boolean> {
  const limit = isAuthenticated ? RATE_LIMIT_AUTH : RATE_LIMIT_ANON;
  const key = `rl:edge:${ip}`;

  // Pokušaj Vercel KV (cross-instance) ako je konfigurisan
  const kvUrl = process.env.VERCEL_KV_REST_API_URL;
  const kvToken = process.env.VERCEL_KV_REST_API_TOKEN;

  if (kvUrl && kvToken) {
    try {
      const incrResp = await fetch(`${kvUrl}/incr/${encodeURIComponent(key)}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${kvToken}` },
      });
      if (incrResp.ok) {
        const { result: count } = (await incrResp.json()) as { result: number };
        if (count === 1) {
          // Postavi TTL za novi prozor
          void fetch(`${kvUrl}/expire/${encodeURIComponent(key)}/${RATE_LIMIT_WINDOW_SEC}`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${kvToken}` },
          });
        }
        return count <= limit;
      }
    } catch {
      // KV nije dostupan — fallback na in-memory
    }
  }

  // In-memory fallback
  const now = Date.now();
  const existing = memRateMap.get(key);
  if (!existing || now > existing.resetAt) {
    memRateMap.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_SEC * 1000 });
    return true;
  }
  if (existing.count >= limit) return false;
  existing.count++;
  return true;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getClientIP(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    '127.0.0.1'
  );
}

/** Generišu req-XXXXXXXX ID ako ulazni request nema x-request-id. */
function resolveRequestId(request: NextRequest): string {
  return (
    request.headers.get('x-request-id') ??
    request.headers.get('x-correlation-id') ??
    `req-${Math.random().toString(36).slice(2, 10)}`
  );
}

// ─── Middleware ───────────────────────────────────────────────────────────────

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const ip = getClientIP(request);
  const requestId = resolveRequestId(request);

  // 1. Blok lista — odmah odbaci blokirane IP adrese
  if (BLOCKED_IPS.has(ip)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // 2. Rate limiting — autentifikovani korisnici dobijaju viši limit
  const isAuthenticated = request.headers.get('authorization')?.startsWith('Bearer ') ?? false;
  const allowed = await checkRateLimit(ip, isAuthenticated);
  if (!allowed) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': String(RATE_LIMIT_WINDOW_SEC),
        'X-Request-Id': requestId,
      },
    });
  }

  // 3. Propusti zahtev dalje i dodaj X-Request-Id na odgovor (#858)
  const response = NextResponse.next();
  response.headers.set('X-Request-Id', requestId);
  response.headers.set('X-App-Version', APP_VERSION);
  response.headers.set('X-Autofinish-Iteracija', String(AUTOFINISH_COUNT));
  return response;
}

// Apply to all routes except static assets and Next.js internals
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
