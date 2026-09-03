import { NextResponse } from 'next/server';
import {
  igrice,
  getSveKategorijeIgrica,
  getIgricePoKategoriji,
  getBrojAktivnihIgrica,
} from '@/lib/igrice';
import { APP_VERSION, TOTAL_IGRICA } from '@/lib/constants';
import { getRunnerKompatibilnostZaIgricu } from '@/lib/gaming-endzin';

export async function GET() {
  const kategorije = getSveKategorijeIgrica();
  const aktivnih = getBrojAktivnihIgrica();

  const poKategorijama = kategorije.map((kat) => ({
    kategorija: kat,
    broj: getIgricePoKategoriji(kat).length,
    runnerTipovi: [...new Set(getIgricePoKategoriji(kat).map((ig) => getRunnerKompatibilnostZaIgricu(ig).runnerTip))],
  }));

  const poStatusu = {
    aktivna: igrice.filter((i) => i.status === 'aktivna').length,
    beta: igrice.filter((i) => i.status === 'beta').length,
    razvoj: igrice.filter((i) => i.status === 'razvoj').length,
    planirana: igrice.filter((i) => i.status === 'planirana').length,
  };

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Igrice Kategorije — Pregled po Kategorijama',
    verzija: APP_VERSION,

    pregled: {
      ukupnoIgrica: TOTAL_IGRICA,
      aktivnih,
      kategorija: kategorije.length,
      poStatusu,
    },

    poKategorijama,

    igrice: igrice.map((i) => ({
      id: i.id,
      naziv: i.naziv,
      kategorija: i.kategorija,
      status: i.status,
      runnerTip: getRunnerKompatibilnostZaIgricu(i).runnerTip,
    })),

    timestamp: new Date().toISOString(),
  });
}
