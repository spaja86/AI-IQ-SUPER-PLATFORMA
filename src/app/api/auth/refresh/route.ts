// SpajaUltraOmegaCore -∞Ω+∞ — Refresh Token Route
// Kompanija SPAJA — Digitalna Industrija
// POST /api/auth/refresh

import { NextRequest, NextResponse } from 'next/server';
import { ΩAuthProvider } from '@/lib/auth/omega-auth';
import { ΩAuditLogger } from '@/middleware/omega-audit';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
  const userAgent = request.headers.get('user-agent') ?? 'unknown';

  // Dohvati refresh token iz kolačića ili body-ja
  const cookieToken = request.cookies.get('omega-refresh')?.value;

  let bodyToken: string | undefined;
  try {
    const body = (await request.json()) as { refreshToken?: string };
    bodyToken = body.refreshToken;
  } catch {
    // Nije obavezno — može biti u kolačiću
  }

  const refreshTokenValue = cookieToken ?? bodyToken;

  if (!refreshTokenValue) {
    return NextResponse.json({ error: 'Refresh token nije pronađen' }, { status: 401 });
  }

  const result = await ΩAuthProvider.refreshAccessToken(refreshTokenValue);

  if (!result) {
    ΩAuditLogger.log({
      userId: 'unknown',
      action: 'TOKEN_REFRESH_FAILED',
      resource: '/api/auth/refresh',
      ip,
      userAgent,
      outcome: 'DENIED',
    });

    return NextResponse.json({ error: 'Nevažeći ili istekli refresh token' }, { status: 401 });
  }

  ΩAuditLogger.log({
    userId: result.accessToken.scope.join(','),
    action: 'TOKEN_REFRESH_SUCCESS',
    resource: '/api/auth/refresh',
    ip,
    userAgent,
    outcome: 'SUCCESS',
  });

  const response = NextResponse.json({
    token: result.accessToken,
    refreshToken: result.refreshToken,
    expiresAt: result.accessToken.expiresAt,
  });

  // Token Rotation: novi refresh token u kolačiću
  response.cookies.set('omega-refresh', result.refreshToken.value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 3600,
    path: '/api/auth',
  });

  return response;
}
