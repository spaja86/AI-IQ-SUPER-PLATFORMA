import { NextRequest, NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import {
  getEnterpriseUgovorPlan,
  ucitajEnterpriseKomunikacijaIstoriju,
  ucitajEnterpriseUgovore,
  upisiEnterpriseKomunikaciju,
  type EnterpriseKontaktKanal,
  type EnterpriseUgovorStatus,
} from '@/lib/enterprise-ugovor-modul';
import { type EnterpriseProvajder } from '@/lib/kompanija-spaja-operativa';

const VALID_PROVAJDERI = new Set<EnterpriseProvajder>(['vercel', 'github', 'openai']);
const VALID_STATUSI = new Set<EnterpriseUgovorStatus>(['pending', 'kontaktiran', 'potpisano']);
const VALID_KANALI = new Set<EnterpriseKontaktKanal>(['kontakt_forma', 'email', 'poziv', 'sastanak']);

export async function GET() {
  const [ugovori, istorija] = await Promise.all([
    ucitajEnterpriseUgovore(),
    ucitajEnterpriseKomunikacijaIstoriju(100),
  ]);

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Enterprise Ugovor Modul',
    verzija: APP_VERSION,
    opis:
      'Modul za formalne enterprise kontakt zahteve, status ugovora (pending → kontaktiran → potpisano) i istoriju komunikacije u Supabase.',
    plan: getEnterpriseUgovorPlan(),
    ugovori,
    istorija,
    summary: {
      ukupno: ugovori.length,
      pending: ugovori.filter((item) => item.status === 'pending').length,
      kontaktiran: ugovori.filter((item) => item.status === 'kontaktiran').length,
      potpisano: ugovori.filter((item) => item.status === 'potpisano').length,
      istorijaZapisa: istorija.length,
    },
    napomena:
      'Ako dokumenta ne mogu da se razmene digitalno, koristiti kanal "poziv" ili "sastanak" i uneti napomenu za potpisivanje ugovora.',
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: 'Nevalidan JSON payload.',
        code: 'BAD_REQUEST',
        verzija: APP_VERSION,
        timestamp: new Date().toISOString(),
      },
      { status: 400 },
    );
  }

  const payload = (body ?? {}) as {
    provider?: string;
    status?: string;
    kanal?: string;
    kontaktOsoba?: string;
    napomena?: string;
  };

  if (!payload.provider || !VALID_PROVAJDERI.has(payload.provider as EnterpriseProvajder)) {
    return NextResponse.json(
      {
        error: 'provider mora biti jedan od: vercel, github, openai.',
        code: 'UNPROCESSABLE_ENTITY',
        verzija: APP_VERSION,
        timestamp: new Date().toISOString(),
      },
      { status: 422 },
    );
  }
  if (!payload.status || !VALID_STATUSI.has(payload.status as EnterpriseUgovorStatus)) {
    return NextResponse.json(
      {
        error: 'status mora biti: pending, kontaktiran ili potpisano.',
        code: 'UNPROCESSABLE_ENTITY',
        verzija: APP_VERSION,
        timestamp: new Date().toISOString(),
      },
      { status: 422 },
    );
  }
  if (!payload.kanal || !VALID_KANALI.has(payload.kanal as EnterpriseKontaktKanal)) {
    return NextResponse.json(
      {
        error: 'kanal mora biti: kontakt_forma, email, poziv ili sastanak.',
        code: 'UNPROCESSABLE_ENTITY',
        verzija: APP_VERSION,
        timestamp: new Date().toISOString(),
      },
      { status: 422 },
    );
  }

  const result = await upisiEnterpriseKomunikaciju({
    provider: payload.provider as EnterpriseProvajder,
    status: payload.status as EnterpriseUgovorStatus,
    kanal: payload.kanal as EnterpriseKontaktKanal,
    kontaktOsoba: payload.kontaktOsoba?.trim() || null,
    napomena: payload.napomena?.trim() || null,
  });

  if (!result.stored) {
    return NextResponse.json(
      {
        status: 'neupisano',
        razlog: result.reason ?? 'Upis nije uspeo.',
        napomena:
          'Konfiguracija bez Supabase ne čuva istoriju trajno; podesiti NEXT_PUBLIC_SUPABASE_URL i SUPABASE_SERVICE_ROLE_KEY.',
        verzija: APP_VERSION,
        timestamp: new Date().toISOString(),
      },
      { status: 202 },
    );
  }

  return NextResponse.json(
    {
      status: 'upisano',
      poruka: 'Enterprise komunikacija i status ugovora su uspešno sačuvani.',
      verzija: APP_VERSION,
      timestamp: new Date().toISOString(),
    },
    { status: 201 },
  );
}
