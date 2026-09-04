import { NextResponse } from 'next/server';
import { digitalnaIndustrija, getIndustrijaStats } from '@/lib/industrija';
import { APP_VERSION } from '@/lib/constants';
import { getGlavniEndzinPregled } from '@/lib/glavni-endzin-digitalne-industrije';
import { buildDigitalnaIndustrijaPregled } from '@/lib/digitalna-industrija-domen';

export async function GET() {
  const stats = getIndustrijaStats();
  const glavniEndzin = getGlavniEndzinPregled();
  const pregled = buildDigitalnaIndustrijaPregled();

  return NextResponse.json({
    status: 'operational',
    verzija: APP_VERSION,
    industrija: {
      naziv: digitalnaIndustrija.name,
      opis: digitalnaIndustrija.description,
      verzija: digitalnaIndustrija.version,
      osnovana: digitalnaIndustrija.founded,
      misija: digitalnaIndustrija.mission,
      vizija: digitalnaIndustrija.vision,
    },
    statistike: {
      ukupnoPlatformi: stats.totalPlatforms,
      aktivnihPlatformi: stats.activePlatforms,
      ukupnoOrganizacija: stats.totalOrganizations,
      aktivnihOrganizacija: stats.activeOrganizations,
      ukupnoKompanija: stats.totalCompanies,
      aktivnihKompanija: stats.activeCompanies,
      ukupnoProizvoda: stats.totalProducts,
      aktivnihProizvoda: stats.activeProducts,
    },
    glavniEndzin,
    kanonskiScope: pregled.scope,
    umbrellaNivoi: pregled.umbrellaNivoi,
    poslovniTokovi: pregled.poslovniTokovi,
    governance: pregled.governance,
    operativniPregled: pregled.operativniPregled,
    prioritetniBlokatori: pregled.prioritetniBlokatori,
    timestamp: new Date().toISOString(),
  });
}
