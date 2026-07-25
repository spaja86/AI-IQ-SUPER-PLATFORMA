/**
 * /api/owner/vercel-ownership
 *
 * GET  — Vraća kompletni Vercel ownership status i checklist
 * POST — Ažurira status enterprise zahteva (postavljanjem env flag-a u memoriju)
 *
 * Ownership prenos zahteva:
 *  1. Telefonska verifikacija vlasnika (owner-phone-auth)
 *  2. SPAJA_VERCEL_ENTERPRISE_REQUEST_READY=true (spreman za slanje)
 *  3. SPAJA_VERCEL_ENTERPRISE_REQUEST_SUBMITTED=true (zahtev poslat)
 *
 * Autofinish — VERCEL PRIKLJUČENJE Faza 4
 */

import { NextRequest, NextResponse } from 'next/server';
import { APP_VERSION, KOMPANIJA } from '@/lib/constants';
import { getOwnerIdentity } from '@/lib/owner-identity';
import { getOwnerPhoneVerifikacijaStatus, getOwnerPoslednja_verifikacija } from '@/lib/owner-phone-auth';
import { OWNER_PHONE_DEFAULT, OWNER_PHONE_NUMBER_ENV_KEY } from '@/lib/constants';
import { kvGet, kvSet } from '@/lib/kv-client';

// KV ključevi za enterprise request status (persists over restarts)
const KV_ENTERPRISE_READY_KEY = 'owner:vercel:enterprise-request-ready';
const KV_ENTERPRISE_SUBMITTED_KEY = 'owner:vercel:enterprise-request-submitted';

async function getEnterpriseFlags(): Promise<{ ready: boolean; submitted: boolean }> {
  // Env var ima prioritet, zatim KV, zatim false
  const envReady = /^(1|true|yes)$/i.test(process.env.SPAJA_VERCEL_ENTERPRISE_REQUEST_READY ?? '');
  const envSubmitted = /^(1|true|yes)$/i.test(process.env.SPAJA_VERCEL_ENTERPRISE_REQUEST_SUBMITTED ?? '');

  if (envReady || envSubmitted) return { ready: envReady, submitted: envSubmitted };

  const kvReady = await kvGet<boolean>(KV_ENTERPRISE_READY_KEY);
  const kvSubmitted = await kvGet<boolean>(KV_ENTERPRISE_SUBMITTED_KEY);

  return {
    ready: kvReady === true,
    submitted: kvSubmitted === true,
  };
}

export async function GET() {
  const telefonBroj = process.env[OWNER_PHONE_NUMBER_ENV_KEY] ?? OWNER_PHONE_DEFAULT;
  const phoneStatus = getOwnerPhoneVerifikacijaStatus(telefonBroj);
  const poslednja_verifikacija = getOwnerPoslednja_verifikacija(telefonBroj);

  const identity = getOwnerIdentity(phoneStatus, poslednja_verifikacija);
  const { ready, submitted } = await getEnterpriseFlags();

  // Override checklist sa KV vrednostima
  const checklist = {
    ...identity.vercel.checklist,
    enterpriseRequestSpreman: ready || identity.vercel.checklist.enterpriseRequestSpreman,
    enterpriseRequestPoslato: submitted || identity.vercel.checklist.enterpriseRequestPoslato,
  };

  const vercelStatus = submitted
    ? 'u-procesu'
    : identity.vercel.status;

  const blokator = !checklist.phoneVerified
    ? 'Telefonska verifikacija je obavezna pre slanja Vercel enterprise zahteva.'
    : null;

  return NextResponse.json({
    sistem: 'Vercel Ownership — Kompanija SPAJA',
    verzija: APP_VERSION,
    izvor: KOMPANIJA,
    vercel: {
      accountEmail: identity.vercel.accountEmail,
      billingKontakt: identity.vercel.billingKontakt,
      status: vercelStatus,
      checklist,
      zahtevaTelefonVerifikaciju: identity.vercel.zahtevaTelefonVerifikaciju,
      blokator,
    },
    telefon: {
      maskiranBroj: identity.telefon.maskiranBroj,
      status: identity.telefon.status,
      verifikovan: identity.verifikovan,
    },
    sledećiKoraci: checklist.phoneVerified
      ? [
          ready ? '✅ Enterprise zahtev spreman za slanje' : '⬜ Postaviti SPAJA_VERCEL_ENTERPRISE_REQUEST_READY=true',
          submitted ? '✅ Enterprise zahtev poslat — čekamo potvrdu' : '⬜ Poslati Vercel Enterprise Request',
          '📧 Pratiti email: ' + identity.vercel.accountEmail,
        ]
      : [
          '📱 Pokrenuti OTP: POST /api/owner-phone-auth/request-otp',
          '🔑 Verifikovati OTP: POST /api/owner-phone-auth/verify-otp',
          '📋 Nakon verifikacije — enterprise zahtev se može poslati',
        ],
    uputstvo: {
      korak1: 'Verifikovati telefon vlasnika putem OTP sistema',
      korak2: 'Kontaktirati Vercel Enterprise tim sa zahtevom za ownership prenos',
      korak3: 'Priložiti: ime, email, GitHub nalog, billing podaci',
      korak4: 'Pratiti status na: https://vercel.com/account',
    },
    timestamp: new Date().toISOString(),
  }, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      'X-App-Version': APP_VERSION,
    },
  });
}

interface OwnershipUpdateBody {
  akcija?: 'set-ready' | 'set-submitted' | 'reset';
}

export async function POST(request: NextRequest) {
  let body: OwnershipUpdateBody = {};
  try {
    body = (await request.json()) as OwnershipUpdateBody;
  } catch {
    return NextResponse.json({ greska: 'Neispravan JSON u telu zahteva.' }, { status: 400 });
  }

  const { akcija } = body;
  if (!akcija || !['set-ready', 'set-submitted', 'reset'].includes(akcija)) {
    return NextResponse.json(
      { greska: 'Nepoznata akcija. Dostupne: set-ready, set-submitted, reset.' },
      { status: 400 },
    );
  }

  // Proveriti da li je vlasnik telefonski verifikovan
  const telefonBroj = process.env[OWNER_PHONE_NUMBER_ENV_KEY] ?? OWNER_PHONE_DEFAULT;
  const phoneStatus = getOwnerPhoneVerifikacijaStatus(telefonBroj);

  if (phoneStatus !== 'verifikovan' && akcija !== 'reset') {
    return NextResponse.json(
      {
        greska: 'Telefonska verifikacija je obavezna pre ažuriranja Vercel ownership statusa.',
        uputstvo: 'POST /api/owner-phone-auth/request-otp → POST /api/owner-phone-auth/verify-otp',
      },
      { status: 403 },
    );
  }

  switch (akcija) {
    case 'set-ready':
      await kvSet(KV_ENTERPRISE_READY_KEY, true);
      return NextResponse.json({
        status: 'ok',
        poruka: 'Enterprise zahtev označen kao spreman za slanje.',
        sledeci: 'POST /api/owner/vercel-ownership { "akcija": "set-submitted" }',
        timestamp: new Date().toISOString(),
      });

    case 'set-submitted':
      await kvSet(KV_ENTERPRISE_READY_KEY, true);
      await kvSet(KV_ENTERPRISE_SUBMITTED_KEY, true);
      return NextResponse.json({
        status: 'ok',
        poruka: 'Enterprise zahtev označen kao poslat. Status: u-procesu.',
        sledeci: 'Pratiti email i Vercel dashboard za potvrdu ownership prenosa.',
        timestamp: new Date().toISOString(),
      });

    case 'reset':
      await kvSet(KV_ENTERPRISE_READY_KEY, false);
      await kvSet(KV_ENTERPRISE_SUBMITTED_KEY, false);
      return NextResponse.json({
        status: 'ok',
        poruka: 'Vercel ownership status resetovan.',
        timestamp: new Date().toISOString(),
      });
  }
}
