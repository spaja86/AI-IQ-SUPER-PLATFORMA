import { NextResponse } from 'next/server';
import { getStatistike } from '@/lib/statistika';
import { runDiagnostics } from '@/lib/auto-repair';
import { APP_VERSION, AUTOFINISH_COUNT, AUTOFINISH_TARGET, TOTAL_ROUTES, TOTAL_API_ROUTES, TOTAL_DIAGNOSTIKA } from '@/lib/constants';

export async function GET() {
  const stats = getStatistike();
  const dijagnostika = runDiagnostics();

  return NextResponse.json({
    platforma: 'AI IQ SUPER PLATFORMA',
    verzija: APP_VERSION,

    performanse: {
      zdravljeSistema: dijagnostika.zdravlje,
      ukupnoProvera: dijagnostika.ukupnoProvera,
      uspesnihProvera: dijagnostika.uspesnih,
      upozorenja: dijagnostika.upozorenja,
      greške: dijagnostika.gresaka,
      kriticnih: dijagnostika.kriticnih,
    },

    velicina: {
      ukupnoRuta: TOTAL_ROUTES,
      apiRuta: TOTAL_API_ROUTES,
      dijagnostika: TOTAL_DIAGNOSTIKA,
      stranica: stats.ukupnoStranica,
      platformi: stats.ukupnoPlatformi,
      proizvoda: stats.ukupnoProizvoda,
      igrica: stats.ukupnoIgrica,
      omegaAI: stats.ukupnoOmegaPersona,
      promptova: stats.ukupnoPromptova,
      dimenzija: stats.ukupnoDimenzija,
      sajtova: stats.ukupnoSajtova,
      kompanija: stats.ukupnoKompanija,
      organizacija: stats.ukupnoOrganizacija,
      products: stats.ukupnoProducts,
    },

    autofinish: {
      iteracija: AUTOFINISH_COUNT,
      cilj: AUTOFINISH_TARGET,
      procenatZavrsen: ((AUTOFINISH_COUNT / AUTOFINISH_TARGET) * 100).toExponential(2),
    },

    timestamp: new Date().toISOString(),
  });
}
