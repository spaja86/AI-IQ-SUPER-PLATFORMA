import { NextResponse } from 'next/server';
import { getStatistike } from '@/lib/statistika';
import { companies, getActiveCompanies } from '@/lib/companies';
import { organizations, getActiveOrganizations } from '@/lib/organizations';
import { products, getActiveProducts } from '@/lib/products';
import { APP_VERSION, AUTOFINISH_COUNT, AUTOFINISH_TARGET } from '@/lib/constants';

export async function GET() {
  const stats = getStatistike();

  return NextResponse.json({
    status: 'operational',
    platforma: 'AI IQ SUPER PLATFORMA',
    verzija: APP_VERSION,

    ekosistem: {
      platforme: stats.ukupnoPlatformi,
      aktivnihPlatformi: stats.aktivnihPlatformi,
      itProizvodi: stats.ukupnoProizvoda,
      igrice: stats.ukupnoIgrica,
      omegaAI: stats.ukupnoOmegaPersona,
      promptovi: stats.ukupnoPromptova,
      spajaPro: stats.spajaProVerzija,
      dimenzije: stats.ukupnoDimenzija,
      sajtovi: stats.ukupnoSajtova,
    },

    en: {
      kompanije: companies.length,
      aktivnihKompanija: getActiveCompanies().length,
      organizacije: organizations.length,
      aktivnihOrganizacija: getActiveOrganizations().length,
      proizvodi: products.length,
      aktivnihProizvoda: getActiveProducts().length,
    },

    infrastruktura: {
      stranice: stats.ukupnoStranica,
      rute: stats.ukupnoRuta,
      apiRute: stats.ukupnoAPIRuta,
      mobilneCentrale: stats.ukupnoMobilnihCentrala,
      proksiCvorovi: stats.ukupnoProksiCvorova,
    },

    zdravlje: {
      procenat: stats.zdravljeSistema,
      dijagnostike: stats.ukupnoDijagnostika,
      uspesnih: stats.uspesnihDijagnostika,
    },

    autofinish: {
      iteracija: AUTOFINISH_COUNT,
      cilj: AUTOFINISH_TARGET,
      ciljFormatiran: '3×10¹⁷',
    },

    timestamp: new Date().toISOString(),
  });
}
