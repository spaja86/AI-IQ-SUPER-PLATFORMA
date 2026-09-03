import { NextResponse } from 'next/server';
import { igrice, getSveKategorijeIgrica } from '@/lib/igrice';
import { APP_VERSION, TOTAL_IGRICA } from '@/lib/constants';
import { getRunnerKompatibilnostZaIgricu } from '@/lib/gaming-endzin';

export async function GET() {
  const kategorije = getSveKategorijeIgrica();
  const poKategoriji = kategorije.map((kat) => ({
    kategorija: kat,
    brojIgrica: igrice.filter((i) => i.kategorija === kat).length,
  }));

  const saLinkom = igrice.filter((i) => 'link' in i && i.link);
  const poStatusu = {
    aktivna: igrice.filter((i) => i.status === 'aktivna').length,
    beta: igrice.filter((i) => i.status === 'beta').length,
    razvoj: igrice.filter((i) => i.status === 'razvoj').length,
    planirana: igrice.filter((i) => i.status === 'planirana').length,
  };
  const runnerKompatibilnost = igrice.map((i) => getRunnerKompatibilnostZaIgricu(i));
  const runnerStatistika = runnerKompatibilnost.reduce<Record<string, number>>((acc, item) => {
    acc[item.runnerTip] = (acc[item.runnerTip] ?? 0) + 1;
    return acc;
  }, {});

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Igrice Statistike',
    verzija: APP_VERSION,

    pregled: {
      ukupnoIgrica: TOTAL_IGRICA,
      detektovano: igrice.length,
      kategorija: kategorije.length,
      saEksternimLinkom: saLinkom.length,
      poStatusu,
    },

    poKategoriji,
    runnerStatistika,
    runnerCoverage: {
      existingRunner: runnerKompatibilnost.filter((item) => item.status === 'existing-runner').length,
      requiresNewRunner: runnerKompatibilnost.filter((item) => item.status === 'requires-new-runner').length,
    },

    topIgrice: igrice.slice(0, 10).map((i) => ({
      id: i.id,
      naziv: i.naziv,
      kategorija: i.kategorija,
      status: i.status,
      runnerTip: getRunnerKompatibilnostZaIgricu(i).runnerTip,
    })),

    timestamp: new Date().toISOString(),
  });
}
