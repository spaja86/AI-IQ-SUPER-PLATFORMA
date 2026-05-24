import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import { INKOGNITO_LABEL, INKOGNITO_OPIS } from '@/lib/brouvzer-inkognito';
import { brouvzerModuli } from '@/lib/spaja-digitalni-brouvzer';
import { PLATFORM_FLAGS } from '@/lib/feature-flags';

export async function GET() {
  const inkognitoModul = brouvzerModuli.find((m) => m.id === 'modul-inkognito');
  const inkognitoFlag = PLATFORM_FLAGS.find((f) => f.id === 'brouvzer-inkognito-mode');

  return NextResponse.json(
    {
      status: 'aktivan',
      sistem: 'SPAJA Digitalni Brouvzer — Inkognito Status',
      verzija: APP_VERSION,
      inkognito: {
        dostupno: inkognitoModul?.status === 'aktivan' && inkognitoFlag?.strategy === 'enabled',
        label: INKOGNITO_LABEL,
        opis: INKOGNITO_OPIS,
        modulVerzija: inkognitoModul?.verzija ?? null,
        modulStatus: inkognitoModul?.status ?? null,
        mogucnosti: inkognitoModul?.mogucnosti ?? [],
        featureFlag: inkognitoFlag
          ? {
              id: inkognitoFlag.id,
              strategy: inkognitoFlag.strategy,
              activeFrom: inkognitoFlag.activeFrom ?? null,
            }
          : null,
        pravilaPrivatnosti: {
          istorijaSacuvana: false,
          bookmarkoviSacuvani: false,
          authAktivan: true,
          sandboxNepromenjen: true,
          precica: 'Ctrl+Shift+N',
        },
      },
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        'X-App-Version': APP_VERSION,
      },
    },
  );
}
