import { APP_VERSION } from './constants';

export type RizikStatus = 'stabilan' | 'povecan' | 'kritican';

export interface ValutniRizikStavka {
  portfolio: string;
  valuta: string;
  otvorenaPozicijaRsd: number;
  limitRsd: number;
  iskoriscenostLimitaPct: number;
  status: RizikStatus;
}

export interface DigitalnaIndustrijaValutniRizikRezultat {
  status: 'aktivan';
  userId: string;
  timestamp: string;
  verzija: string;
  jurisdikcija: 'Republika Srbija';
  izvor: string;
  izlozenosti: ValutniRizikStavka[];
  kpi: {
    ukupnoPortfolija: number;
    stabilni: number;
    povecani: number;
    kriticni: number;
    prosecnaIskoriscenostPct: number;
  };
}

export function buildDigitalnaIndustrijaValutniRizik(
  userId: string,
): DigitalnaIndustrijaValutniRizikRezultat {
  const izlozenosti: ValutniRizikStavka[] = [
    {
      portfolio: 'Izvozna naplata',
      valuta: 'EUR',
      otvorenaPozicijaRsd: 4_920_000,
      limitRsd: 6_000_000,
      iskoriscenostLimitaPct: 82,
      status: 'stabilan',
    },
    {
      portfolio: 'Uvoz komponenti',
      valuta: 'USD',
      otvorenaPozicijaRsd: 5_470_000,
      limitRsd: 5_800_000,
      iskoriscenostLimitaPct: 94.31,
      status: 'povecan',
    },
    {
      portfolio: 'Licencni transferi',
      valuta: 'CHF',
      otvorenaPozicijaRsd: 3_180_000,
      limitRsd: 3_000_000,
      iskoriscenostLimitaPct: 106,
      status: 'kritican',
    },
    {
      portfolio: 'Regionalni SaaS obračun',
      valuta: 'EUR',
      otvorenaPozicijaRsd: 2_760_000,
      limitRsd: 3_400_000,
      iskoriscenostLimitaPct: 81.18,
      status: 'stabilan',
    },
  ];

  const stabilni = izlozenosti.filter((stavka) => stavka.status === 'stabilan').length;
  const povecani = izlozenosti.filter((stavka) => stavka.status === 'povecan').length;
  const kriticni = izlozenosti.filter((stavka) => stavka.status === 'kritican').length;
  const prosecnaIskoriscenostPct =
    izlozenosti.reduce((sum, stavka) => sum + stavka.iskoriscenostLimitaPct, 0) /
    izlozenosti.length;

  return {
    status: 'aktivan',
    userId,
    timestamp: new Date().toISOString(),
    verzija: APP_VERSION,
    jurisdikcija: 'Republika Srbija',
    izvor: 'Digitalna Industrija FX Risk Kontroling',
    izlozenosti,
    kpi: {
      ukupnoPortfolija: izlozenosti.length,
      stabilni,
      povecani,
      kriticni,
      prosecnaIskoriscenostPct: Number(prosecnaIskoriscenostPct.toFixed(2)),
    },
  };
}
