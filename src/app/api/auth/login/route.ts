// SpajaUltraOmegaCore -∞Ω+∞ — Login API Route
// Kompanija SPAJA — Digitalna Industrija
// POST /api/auth/login

import { NextRequest, NextResponse } from 'next/server';
import { ΩAuthProvider, ensureDemoSeeded } from '@/lib/auth/omega-auth';
import { checkBruteForce, recordFailedLoginAttempt, resetLoginAttempts } from '@/middleware/omega-security';
import { ΩAuditLogger } from '@/middleware/omega-audit';
import type { ΩLoginRequest } from '@/lib/auth/types';
import { APP_VERSION, KOMPANIJA } from '@/lib/constants';
import {
  gamingStatistika,
  gamingKonfiguracija,
  gejmingKonstrukcija,
  getAktivneIgriceSaEndzinom,
  IOOPENUIAO_URL,
} from '@/lib/io-openui-ao-gaming-platforma';
import { digitalnaIndustrija, getIndustrijaStats } from '@/lib/industrija';
import { platforme } from '@/lib/platforme';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
  const userAgent = request.headers.get('user-agent') ?? 'unknown';

  // Brute-force zaštita: max 5 pokušaja / 15 min po IP
  if (!checkBruteForce(ip)) {
    ΩAuditLogger.log({
      userId: 'anonymous',
      action: 'LOGIN_BLOCKED_BRUTE_FORCE',
      resource: '/api/auth/login',
      ip,
      userAgent,
      outcome: 'DENIED',
    });

    return NextResponse.json(
      { error: 'Previše neuspešnih pokušaja. Pokušajte ponovo za 15 minuta.' },
      { status: 429 }
    );
  }

  let body: ΩLoginRequest;
  try {
    body = (await request.json()) as ΩLoginRequest;
  } catch {
    return NextResponse.json({ error: 'Nevalidan JSON' }, { status: 400 });
  }

  if (!body.email || typeof body.email !== 'string' || !body.email.trim()) {
    return NextResponse.json({ error: 'Email je obavezan' }, { status: 400 });
  }

  // Validacija email formata
  const emailTrimmed = body.email.trim();
  if (!emailTrimmed.includes('@') || !emailTrimmed.includes('.') || emailTrimmed.length < 5) {
    return NextResponse.json({ error: 'Neispravan format email adrese' }, { status: 400 });
  }

  if (!body.password && !body.oauthCode) {
    return NextResponse.json({ error: 'Lozinka ili OAuth kod je obavezan' }, { status: 400 });
  }

  // Validacija lozinke — minimalna duzina i prazni stringovi
  if (body.password) {
    if (typeof body.password !== 'string' || !body.password.trim()) {
      return NextResponse.json({ error: 'Lozinka ne moze biti prazna' }, { status: 400 });
    }
    if (body.password.length < 8) {
      return NextResponse.json(
        { error: 'Lozinka mora imati najmanje 8 karaktera' },
        { status: 400 }
      );
    }
  }

  // Osiguraj da je demo nalog kreiran pre logina (resava race condition u serverless okruzenju)
  await ensureDemoSeeded();

  const result = await ΩAuthProvider.login(body);

  if (!result) {
    recordFailedLoginAttempt(ip);

    ΩAuditLogger.log({
      userId: body.email,
      action: 'LOGIN_FAILED',
      resource: '/api/auth/login',
      ip,
      userAgent,
      outcome: 'DENIED',
      details: { reason: 'invalid_credentials', email: body.email },
    });

    console.error(`[OMEGA-AUTH] Login failed for ${body.email} from IP ${ip}`);

    return NextResponse.json(
      { error: 'Neispravni podaci za prijavu' },
      { status: 401 }
    );
  }

  // Uspešna prijava
  resetLoginAttempts(ip);

  ΩAuditLogger.log({
    userId: result.identity.id,
    action: 'LOGIN_SUCCESS',
    resource: '/api/auth/login',
    ip,
    userAgent,
    outcome: 'SUCCESS',
    details: { clearanceLevel: result.identity.clearanceLevel, email: body.email },
  });

  console.info(`[OMEGA-AUTH] Login success for ${body.email} (clearance: ${result.identity.clearanceLevel})`);

  // Priprema pristupa industriji i gaming platformi
  const industrijaStats = getIndustrijaStats();
  const aktivneIgrice = getAktivneIgriceSaEndzinom();

  const industrijaPristup = {
    aktiviran: true,
    naziv: digitalnaIndustrija.name,
    statistika: industrijaStats,
    platforme: platforme.map((p) => ({
      id: p.id,
      naziv: p.naziv,
      kategorija: p.kategorija,
      url: `https://${p.deploy.domen}`,
      status: p.deploy.status,
    })),
    delatnosti: [
      'Digitalna Industrija',
      'Gaming Platforma',
      'AI Platforma',
      'Finansije',
      'Proksi Mreza',
      'Mobilna Mreza',
      'IT Proizvodi',
      'SpajaPro Engine',
      'SPAJA Generator za Endzine',
      'OpenAI Platforma',
    ],
  };

  const gamingPristup = {
    aktiviran: true,
    platforma: gamingKonfiguracija.platformaNaziv,
    url: IOOPENUIAO_URL,
    domen: gamingKonfiguracija.domen,
    ukupnoIgrica: gamingStatistika.ukupnoIgrica,
    aktivnihIgrica: aktivneIgrice.length,
    kategorija: gamingStatistika.ukupnoKategorija,
    optimizacija: `${gamingStatistika.prosecnaOptimizacija}%`,
    gejmingKonstrukcija: {
      id: gejmingKonstrukcija.id,
      naziv: gejmingKonstrukcija.naziv,
      aktivna: gejmingKonstrukcija.aktivna,
    },
    pristupKrozIndustriju: true,
  };

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
    pristup: {
      industrija: true,
      platforme: true,
      ekosistem: true,
      gamingPlatforma: true,
      delatnosti: true,
      gejmingKonstrukcija: true,
    },
    industrijaPristup,
    gamingPristup,
    verzija: APP_VERSION,
    kompanija: KOMPANIJA,
  });

  // Postavi httpOnly kolačić za refresh token
  response.cookies.set('omega-refresh', result.refreshToken.value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 3600,
    path: '/api/auth',
  });

  return response;
}
