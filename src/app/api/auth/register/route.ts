// SpajaUltraOmegaCore -∞Ω+∞ — Register API Route
// Kompanija SPAJA — Digitalna Industrija
// POST /api/auth/register

import { NextRequest, NextResponse } from 'next/server';
import { ΩAuthProvider } from '@/lib/auth/omega-auth';
import { checkBruteForce, recordFailedLoginAttempt, resetLoginAttempts } from '@/middleware/omega-security';
import { ΩAuditLogger } from '@/middleware/omega-audit';

interface RegisterBody {
  email: string;
  password: string;
  fullName?: string;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
  const userAgent = request.headers.get('user-agent') ?? 'unknown';

  // Brute-force zastita: max 5 pokusaja / 15 min po IP
  if (!checkBruteForce(ip)) {
    ΩAuditLogger.log({
      userId: 'anonymous',
      action: 'REGISTER_BLOCKED_BRUTE_FORCE',
      resource: '/api/auth/register',
      ip,
      userAgent,
      outcome: 'DENIED',
    });

    return NextResponse.json(
      { error: 'Previse neuspesnih pokusaja. Pokusajte ponovo za 15 minuta.' },
      { status: 429 }
    );
  }

  let body: RegisterBody;
  try {
    body = (await request.json()) as RegisterBody;
  } catch {
    return NextResponse.json({ error: 'Nevalidan JSON' }, { status: 400 });
  }

  // Validacija email-a
  if (!body.email || typeof body.email !== 'string' || !body.email.trim()) {
    return NextResponse.json({ error: 'Email je obavezan' }, { status: 400 });
  }

  const emailTrimmed = body.email.trim().toLowerCase();
  if (!emailTrimmed.includes('@') || !emailTrimmed.includes('.') || emailTrimmed.length < 5) {
    return NextResponse.json({ error: 'Neispravan format email adrese' }, { status: 400 });
  }

  // Validacija lozinke
  if (!body.password || typeof body.password !== 'string' || !body.password.trim()) {
    return NextResponse.json({ error: 'Lozinka je obavezna' }, { status: 400 });
  }

  if (body.password.length < 8) {
    return NextResponse.json(
      { error: 'Lozinka mora imati najmanje 8 karaktera' },
      { status: 400 }
    );
  }

  // Validacija imena
  const fullName = body.fullName?.trim() ?? '';

  const result = await ΩAuthProvider.register({
    email: emailTrimmed,
    password: body.password,
    fullName: fullName || undefined,
  });

  if (!result) {
    recordFailedLoginAttempt(ip);

    ΩAuditLogger.log({
      userId: emailTrimmed,
      action: 'REGISTER_FAILED',
      resource: '/api/auth/register',
      ip,
      userAgent,
      outcome: 'DENIED',
      details: { reason: 'email_already_exists' },
    });

    return NextResponse.json(
      { error: 'Korisnik sa ovim email-om vec postoji.' },
      { status: 409 }
    );
  }

  // Uspesna registracija
  resetLoginAttempts(ip);

  ΩAuditLogger.log({
    userId: result.identity.id,
    action: 'REGISTER_SUCCESS',
    resource: '/api/auth/register',
    ip,
    userAgent,
    outcome: 'SUCCESS',
    details: { email: emailTrimmed },
  });

  const response = NextResponse.json({
    token: result.token,
    identity: {
      id: result.identity.id,
      did: result.identity.did,
      roles: result.identity.roles,
      clearanceLevel: result.identity.clearanceLevel,
      digitalIndustryAccess: result.identity.digitalIndustryAccess,
      mfaEnabled: result.identity.mfaEnabled,
    },
    expiresAt: result.expiresAt,
  });

  // Postavi httpOnly kolacic za refresh token
  response.cookies.set('omega-refresh', result.refreshToken.value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 3600,
    path: '/api/auth',
  });

  return response;
}
