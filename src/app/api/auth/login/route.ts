// SpajaUltraOmegaCore -∞Ω+∞ — Login API Route
// Kompanija SPAJA — Digitalna Industrija
// POST /api/auth/login

import { NextRequest, NextResponse } from 'next/server';
import { ΩAuthProvider, ensureDemoSeeded } from '@/lib/auth/omega-auth';
import { createLoginProtection } from '@/lib/auth/login-protection';
import type { ΩLoginRequest } from '@/lib/auth/types';
import { APP_VERSION, KOMPANIJA } from '@/lib/constants';
import { buildPretplataSnapshot } from '@/lib/login-pretplata';
import { auditLoginPretplataEvents } from '@/lib/login-pretplata-audit';
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
  let body: ΩLoginRequest;
  try {
    body = (await request.json()) as ΩLoginRequest;
  } catch {
    return NextResponse.json({ error: 'Nevalidan JSON' }, { status: 400 });
  }

  if (!body || typeof body !== 'object' || Array.isArray(body) ||
      typeof body.email !== 'string' || !body.email.trim()) {
    return NextResponse.json({ error: 'Email je obavezan' }, { status: 400 });
  }

  // Validacija email formata
  const emailTrimmed = body.email.trim().toLowerCase();
  if (!emailTrimmed.includes('@') || !emailTrimmed.includes('.') || emailTrimmed.length < 5) {
    return NextResponse.json({ error: 'Neispravan format email adrese' }, { status: 400 });
  }

  if (!body.password) {
    return NextResponse.json({ error: 'Lozinka je obavezna' }, { status: 400 });
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

  if (body.totpCode !== undefined && typeof body.totpCode !== 'string') {
    return NextResponse.json({ error: 'Neispravan format MFA koda' }, { status: 400 });
  }

  const protection = createLoginProtection(emailTrimmed, request.headers, '/api/auth/login');
  const { ip, userAgent } = protection;
  if (!protection.isAllowed()) {
    return NextResponse.json(
      { error: 'Previše neuspešnih pokušaja. Pokušajte ponovo za 15 minuta.' },
      { status: 429 },
    );
  }

  // Osiguraj da je demo nalog kreiran pre logina (resava race condition u serverless okruzenju)
  await ensureDemoSeeded();

  const result = await ΩAuthProvider.login(body);

  if (!result) {
    protection.recordFailure();

    console.error(`[OMEGA-AUTH] Login failed from IP ${ip}`);

    return NextResponse.json(
      { error: 'Neispravni podaci za prijavu' },
      { status: 401 }
    );
  }

  // Uspešna prijava
  protection.reset();

  const pretplata = buildPretplataSnapshot({
    email: body.email,
    roles: result.identity.roles,
    digitalIndustryAccess: result.identity.digitalIndustryAccess,
  });

  auditLoginPretplataEvents({
    userId: result.identity.id,
    resource: '/api/auth/login',
    ip,
    userAgent,
    clearanceLevel: result.identity.clearanceLevel,
    pretplata,
  });

  console.info(`[OMEGA-AUTH] Login success (clearance: ${result.identity.clearanceLevel})`);

  // Priprema pristupa industriji i gaming platformi
  const industrijaStats = getIndustrijaStats();
  const aktivneIgrice = getAktivneIgriceSaEndzinom();

  const industrijaPristup = {
    aktiviran: pretplata.dozvole.industrija,
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
    aktiviran: pretplata.dozvole.gamingPlatforma,
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
    pristupKrozIndustriju: pretplata.dozvole.industrija,
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
      ...pretplata.dozvole,
    },
    pretplata,
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
