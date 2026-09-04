import { NextResponse } from 'next/server';
import { igrice, getSveKategorijeIgrica, GAMES_REQUIRED_OUTPUTS, GAMES_SCOPE } from '@/lib/igrice';
import { APP_VERSION, TOTAL_IGRICA } from '@/lib/constants';
import { getRunnerKompatibilnostZaIgricu } from '@/lib/gaming-endzin';

export async function GET() {
  const kategorije = getSveKategorijeIgrica();

  return NextResponse.json({
    ukupno: igrice.length,
    kategorija: kategorije.length,
    kategorijeNazivi: kategorije,
    gamesScope: {
      targetSurface: GAMES_SCOPE,
      requiredOutputs: GAMES_REQUIRED_OUTPUTS,
    },
    igrice: igrice.map((ig) => ({
      id: ig.id,
      naziv: ig.naziv,
      kategorija: ig.kategorija,
      opis: ig.opis,
      ikona: ig.ikona,
      status: ig.status,
      podrazumevanaDimenzija: ig.podrazumevanaDimenzija,
      runnerKompatibilnost: getRunnerKompatibilnostZaIgricu(ig),
    })),
    analytics: {
      byStatus: {
        aktivna: igrice.filter((ig) => ig.status === 'aktivna').length,
        beta: igrice.filter((ig) => ig.status === 'beta').length,
        razvoj: igrice.filter((ig) => ig.status === 'razvoj').length,
        planirana: igrice.filter((ig) => ig.status === 'planirana').length,
      },
      byRunnerTip: igrice.reduce<Record<string, number>>((acc, ig) => {
        const tip = getRunnerKompatibilnostZaIgricu(ig).runnerTip;
        acc[tip] = (acc[tip] ?? 0) + 1;
        return acc;
      }, {}),
    },
    konstante: {
      totalIgrica: TOTAL_IGRICA,
      appVersion: APP_VERSION,
    },
    timestamp: new Date().toISOString(),
  });
}
