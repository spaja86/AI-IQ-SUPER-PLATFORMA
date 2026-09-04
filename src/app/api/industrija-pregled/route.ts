import { NextResponse } from 'next/server';
import { digitalnaIndustrija, getIndustrijaStats } from '@/lib/industrija';
import { APP_VERSION } from '@/lib/constants';
import { buildDigitalnaIndustrijaPregled } from '@/lib/digitalna-industrija-domen';

export async function GET() {
  const stats = getIndustrijaStats();
  const pregled = buildDigitalnaIndustrijaPregled();

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Industrija Pregled — Kompletna Digitalna Industrija',
    verzija: APP_VERSION,

    pregled: {
      platformi: stats.totalPlatforms,
      kompanija: stats.totalCompanies,
      organizacija: stats.totalOrganizations,
      proizvoda: stats.totalProducts,
      aktivnihPlatformi: stats.activePlatforms,
    },

    industrija: {
      naziv: digitalnaIndustrija.name,
      opis: digitalnaIndustrija.description,
      verzija: digitalnaIndustrija.version,
      misija: digitalnaIndustrija.mission,
    },

    statistike: stats,
    kanonskiScope: pregled.scope,
    umbrellaNivoi: pregled.umbrellaNivoi,
    poslovniTokovi: pregled.poslovniTokovi,
    governance: pregled.governance,
    operativniPregled: pregled.operativniPregled,
    prioritetniBlokatori: pregled.prioritetniBlokatori,

    timestamp: new Date().toISOString(),
  });
}
