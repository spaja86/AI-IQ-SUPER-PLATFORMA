// SpajaUltraOmegaCore -∞Ω+∞ — Logout Route
// Kompanija SPAJA — Digitalna Industrija
// POST /api/auth/logout

import { NextRequest, NextResponse } from 'next/server';
import { ΩAuthProvider } from '@/lib/auth/omega-auth';
import { ΩAuditLogger } from '@/middleware/omega-audit';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
  const userAgent = request.headers.get('user-agent') ?? 'unknown';

  const authHeader = request.headers.get('authorization');
  const tokenValue = authHeader?.replace(/^Bearer\s+/i, '');

  let userId = 'unknown';

  if (tokenValue) {
    const identity = await ΩAuthProvider.verifyIdentity(tokenValue);
    if (identity) {
      userId = identity.id;
      // Opozovi sve tokene korisnika
      ΩAuthProvider.revokeAll(identity.id);
    } else {
      // Opozivi samo ovaj token
      ΩAuthProvider.revokeToken(tokenValue);
    }
  }

  // Opozivi refresh token iz kolačića
  const refreshCookie = request.cookies.get('omega-refresh')?.value;
  if (refreshCookie) {
    ΩAuthProvider.revokeToken(refreshCookie);
  }

  ΩAuditLogger.log({
    userId,
    action: 'LOGOUT',
    resource: '/api/auth/logout',
    ip,
    userAgent,
    outcome: 'SUCCESS',
  });

  const response = NextResponse.json({ success: true, message: 'Uspešno odjavljivanje' });

  // Briši sve kolačiće (httpOnly, secure, sameSite: strict)
  response.cookies.set('omega-refresh', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/api/auth',
  });

  response.cookies.set('omega-csrf', '', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });

  return response;
}
