import { APP_VERSION } from './constants';

export type RazlikaStatus = 'knjizeno' | 'na-usaglasavanju';

export interface KursnaRazlikaStavka {
  dokument: string;
  valuta: string;
  iznosOsnovice: number;
  prethodniKurs: number;
  tekuciKurs: number;
  kursnaRazlikaRsd: number;
  status: RazlikaStatus;
}

export interface DigitalnaIndustrijaKursneRazlikeRezultat {
  status: 'aktivan';
  userId: string;
  timestamp: string;
  verzija: string;
  jurisdikcija: 'Republika Srbija';
  izvor: string;
  kursneRazlike: KursnaRazlikaStavka[];
  kpi: {
    ukupnoDokumenata: number;
    knjizeno: number;
    naUsaglasavanju: number;
    netoRazlikaRsd: number;
  };
}

export function buildDigitalnaIndustrijaKursneRazlike(
  userId: string,
): DigitalnaIndustrijaKursneRazlikeRezultat {
  const kursneRazlike: KursnaRazlikaStavka[] = [
    {
      dokument: 'INV-DI-2026-041',
      valuta: 'EUR',
      iznosOsnovice: 12_500,
      prethodniKurs: 117.02,
      tekuciKurs: 117.21,
      kursnaRazlikaRsd: 2_375,
      status: 'knjizeno',
    },
    {
      dokument: 'INV-DI-2026-042',
      valuta: 'USD',
      iznosOsnovice: 8_100,
      prethodniKurs: 108.41,
      tekuciKurs: 109.03,
      kursnaRazlikaRsd: 5_022,
      status: 'knjizeno',
    },
    {
      dokument: 'PO-DI-2026-118',
      valuta: 'CHF',
      iznosOsnovice: 4_900,
      prethodniKurs: 123.08,
      tekuciKurs: 122.65,
      kursnaRazlikaRsd: -2_107,
      status: 'na-usaglasavanju',
    },
    {
      dokument: 'LC-DI-2026-009',
      valuta: 'EUR',
      iznosOsnovice: 21_300,
      prethodniKurs: 116.94,
      tekuciKurs: 117.17,
      kursnaRazlikaRsd: 4_899,
      status: 'knjizeno',
    },
  ];

  const knjizeno = kursneRazlike.filter((stavka) => stavka.status === 'knjizeno').length;
  const naUsaglasavanju = kursneRazlike.filter(
    (stavka) => stavka.status === 'na-usaglasavanju',
  ).length;
  const netoRazlikaRsd = kursneRazlike.reduce(
    (sum, stavka) => sum + stavka.kursnaRazlikaRsd,
    0,
  );

  return {
    status: 'aktivan',
    userId,
    timestamp: new Date().toISOString(),
    verzija: APP_VERSION,
    jurisdikcija: 'Republika Srbija',
    izvor: 'Digitalna Industrija FX Obračunski Centar',
    kursneRazlike,
    kpi: {
      ukupnoDokumenata: kursneRazlike.length,
      knjizeno,
      naUsaglasavanju,
      netoRazlikaRsd,
    },
  };
}
