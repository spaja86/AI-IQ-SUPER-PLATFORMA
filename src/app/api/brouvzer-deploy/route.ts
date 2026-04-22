/**
 * 🚀 BROUVZER DEPLOY MOTOR — Pravi Vercel Deploy Hook
 *
 * POST /api/brouvzer-deploy
 *
 * Aktivira Vercel Deploy za SPAJA projekte koristeći Vercel Deploy Hook URL.
 * Deploy Hook se konfigurišu u Vercel dashboard-u za svaki projekat
 * i čuvaju kao environment varijable.
 *
 * Environment varijable:
 *   VERCEL_DEPLOY_HOOK_AI_IQ        — AI IQ SUPER PLATFORMA deploy hook
 *   VERCEL_DEPLOY_HOOK_IO_OPENUI_AO — IO/OPENUI/AO deploy hook
 *   VERCEL_DEPLOY_HOOK_KOMPANIJA    — Kompanija SPAJA deploy hook
 *
 * Telo zahteva (JSON):
 *   projekat: 'ai-iq' | 'io-openui-ao' | 'kompanija' | string
 *   hookUrl?: string  — opcionalno: direktan hook URL (za napredne slučajeve)
 *
 * Odgovor:
 *   200 { status, projekat, deployId?, deployUrl?, poruka }
 *   400 { greska }   — nedostaje projekat
 *   404 { greska }   — hook nije konfigurisan za ovaj projekat
 *   500 { greska }   — Vercel API greška
 */

import { NextRequest, NextResponse } from 'next/server';

// Mapiranje projekata na env varijable
const DEPLOY_HOOK_ENV: Record<string, string | undefined> = {
  'ai-iq': process.env.VERCEL_DEPLOY_HOOK_AI_IQ,
  'io-openui-ao': process.env.VERCEL_DEPLOY_HOOK_IO_OPENUI_AO,
  'kompanija': process.env.VERCEL_DEPLOY_HOOK_KOMPANIJA,
};

// Mapiranje projekata na nazive i URL-ove
const PROJEKAT_INFO: Record<string, { naziv: string; url: string }> = {
  'ai-iq': {
    naziv: 'AI IQ SUPER PLATFORMA',
    url: 'https://ai-iq-super-platforma.vercel.app',
  },
  'io-openui-ao': {
    naziv: 'IO OPENUI AO',
    url: 'https://io-openui-ao.vercel.app',
  },
  'kompanija': {
    naziv: 'Kompanija SPAJA',
    url: 'https://kompanija-spaja.com',
  },
};

interface DeployRequestBody {
  projekat?: string;
  hookUrl?: string;
}

export async function POST(request: NextRequest) {
  let body: DeployRequestBody = {};
  try {
    body = (await request.json()) as DeployRequestBody;
  } catch {
    return NextResponse.json({ greska: 'Neispravan JSON u telu zahteva.' }, { status: 400 });
  }

  const { projekat, hookUrl: direktanHookUrl } = body;

  if (!projekat && !direktanHookUrl) {
    return NextResponse.json(
      {
        greska: 'Potrebno je navesti "projekat" (ai-iq | io-openui-ao | kompanija) ili "hookUrl".',
        dostupniProjekti: Object.keys(PROJEKAT_INFO),
      },
      { status: 400 },
    );
  }

  // Odredi hook URL
  let hookUrl: string | undefined = direktanHookUrl;
  if (!hookUrl && projekat) {
    hookUrl = DEPLOY_HOOK_ENV[projekat];
  }

  if (!hookUrl) {
    return NextResponse.json(
      {
        greska: `Deploy hook nije konfigurisan za projekat "${projekat}".`,
        uputstvo:
          'Dodaj environment varijablu VERCEL_DEPLOY_HOOK_<PROJEKAT> u Vercel dashboard → Project Settings → Environment Variables.',
        dostupniProjekti: Object.keys(PROJEKAT_INFO),
      },
      { status: 404 },
    );
  }

  // Validacija hook URL formata
  try {
    const parsed = new URL(hookUrl);
    if (parsed.protocol !== 'https:' || !parsed.hostname.endsWith('vercel.com')) {
      return NextResponse.json(
        { greska: 'hookUrl mora biti Vercel hook URL (https://*.vercel.com).' },
        { status: 400 },
      );
    }
  } catch {
    return NextResponse.json({ greska: 'hookUrl nije validan URL.' }, { status: 400 });
  }

  // Pozovi Vercel Deploy Hook
  let vercelOdgovor: Response;
  try {
    vercelOdgovor = await fetch(hookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const poruka = err instanceof Error ? err.message : 'Nepoznata greška mreže';
    return NextResponse.json(
      { greska: `Greška pri konekciji sa Vercel API: ${poruka}` },
      { status: 500 },
    );
  }

  if (!vercelOdgovor.ok) {
    return NextResponse.json(
      {
        greska: `Vercel API vratio grešku: HTTP ${vercelOdgovor.status}`,
        vercelStatus: vercelOdgovor.status,
      },
      { status: 502 },
    );
  }

  // Vercel hook vraća JSON sa job ID-em
  let vercelData: Record<string, unknown> = {};
  try {
    vercelData = (await vercelOdgovor.json()) as Record<string, unknown>;
  } catch { /* ignoriši */ }

  const info = projekat ? PROJEKAT_INFO[projekat] : undefined;

  return NextResponse.json({
    status: 'deploy-pokrenut',
    projekat: projekat ?? 'direktni-hook',
    projektNaziv: info?.naziv ?? 'Direktni Deploy',
    projektUrl: info?.url,
    deployJobId: (vercelData.job as Record<string, unknown> | undefined)?.id ?? vercelData.id ?? null,
    poruka: `🚀 Deploy uspešno pokrenut za "${info?.naziv ?? projekat ?? 'projekat'}". Prati status na Vercel dashboard-u.`,
    vercelOdgovor: vercelData,
    timestamp: new Date().toISOString(),
  });
}

// GET — pregled dostupnih projekata i statusa konfiguracije
export async function GET() {
  const konfiguracija = Object.entries(PROJEKAT_INFO).map(([kljuc, info]) => ({
    kljuc,
    naziv: info.naziv,
    url: info.url,
    hookKonfigurisan: Boolean(DEPLOY_HOOK_ENV[kljuc]),
  }));

  return NextResponse.json({
    sistem: 'Brouvzer Deploy Motor — SPAJA',
    opis: 'Aktivira Vercel Deploy Hook za SPAJA projekte. Pošalji POST sa { projekat } da pokreneš deploy.',
    uputstvo: {
      korak1: 'Otvori Vercel dashboard → izaberi projekat → Settings → Git → Deploy Hooks',
      korak2: 'Napravi hook i kopiraj URL',
      korak3: 'Dodaj env varijablu: VERCEL_DEPLOY_HOOK_AI_IQ, VERCEL_DEPLOY_HOOK_IO_OPENUI_AO, ili VERCEL_DEPLOY_HOOK_KOMPANIJA',
      korak4: 'POST /api/brouvzer-deploy sa { "projekat": "ai-iq" }',
    },
    projekti: konfiguracija,
    timestamp: new Date().toISOString(),
  });
}
