import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import {
  TAB_MENADZER_LABEL,
  TAB_MENADZER_OPIS,
  TAB_MENADZER_MAX_AKTIVNIH,
  TAB_MENADZER_MAX_PINIRANIH,
  TAB_MENADZER_MAX_GRUPA,
} from '@/lib/brouvzer-tab-menadzer';
import { brouvzerModuli } from '@/lib/spaja-digitalni-brouvzer';
import { PLATFORM_FLAGS } from '@/lib/feature-flags';

export async function GET() {
  const tabModul = brouvzerModuli.find((m) => m.id === 'modul-tab-menadzer');
  const tabFlag = PLATFORM_FLAGS.find((f) => f.id === 'brouvzer-tab-menadzer');

  return NextResponse.json(
    {
      status: 'aktivan',
      sistem: 'SPAJA Digitalni Brouvzer — Tab Menadžer Status',
      verzija: APP_VERSION,
      tabMenadzer: {
        dostupno: tabModul?.status === 'aktivan' && tabFlag?.strategy === 'enabled',
        label: TAB_MENADZER_LABEL,
        opis: TAB_MENADZER_OPIS,
        modulVerzija: tabModul?.verzija ?? null,
        modulStatus: tabModul?.status ?? null,
        mogucnosti: tabModul?.mogucnosti ?? [],
        limiti: {
          maxAktivnih: TAB_MENADZER_MAX_AKTIVNIH,
          maxPiniranih: TAB_MENADZER_MAX_PINIRANIH,
          maxGrupa: TAB_MENADZER_MAX_GRUPA,
        },
        featureFlag: tabFlag
          ? {
              id: tabFlag.id,
              strategy: tabFlag.strategy,
              activeFrom: tabFlag.activeFrom ?? null,
            }
          : null,
        funkcionalnosti: {
          multiTab: true,
          tabGrupe: true,
          hibernacija: true,
          pinTabovi: true,
          sinhronizacija: true,
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
