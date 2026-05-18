import { APP_VERSION } from './constants';

export type OdlivStatus = 'odobreno' | 'na-proveri' | 'zadrzano';

export interface DevizniOdlivStavka {
  id: string;
  entitet: string;
  namena: string;
  valuta: 'EUR' | 'USD' | 'CHF';
  iznos: number;
  status: OdlivStatus;
}

export interface DigitalnaIndustrijaDevizniOdliviRezultat {
  status: 'aktivan';
  userId: string;
  timestamp: string;
  verzija: string;
  jurisdikcija: 'Republika Srbija';
  registarNosioc: string;
  odlivi: DevizniOdlivStavka[];
  kpi: {
    ukupnoOdliva: number;
    odobreno: number;
    naProveri: number;
    zadrzano: number;
    ukupnoEUR: number;
  };
}

export function buildDigitalnaIndustrijaDevizniOdlivi(
  userId: string,
): DigitalnaIndustrijaDevizniOdliviRezultat {
  const odlivi: DevizniOdlivStavka[] = [
    {
      id: 'devizni-odliv-001',
      entitet: 'Digitalna Industrija',
      namena: 'Cloud infrastruktura',
      valuta: 'EUR',
      iznos: 91_300,
      status: 'odobreno',
    },
    {
      id: 'devizni-odliv-002',
      entitet: 'AI IQ World Bank Operativa',
      namena: 'Compliance i licenciranje',
      valuta: 'USD',
      iznos: 58_700,
      status: 'na-proveri',
    },
    {
      id: 'devizni-odliv-003',
      entitet: 'SPAJA Tehnološki Centar',
      namena: 'R&D alati',
      valuta: 'CHF',
      iznos: 36_500,
      status: 'odobreno',
    },
    {
      id: 'devizni-odliv-004',
      entitet: 'Proksi Infrastruktura',
      namena: 'Mrežna oprema',
      valuta: 'EUR',
      iznos: 44_200,
      status: 'zadrzano',
    },
  ];

  const odobreno = odlivi.filter((stavka) => stavka.status === 'odobreno').length;
  const naProveri = odlivi.filter((stavka) => stavka.status === 'na-proveri').length;
  const zadrzano = odlivi.filter((stavka) => stavka.status === 'zadrzano').length;
  const ukupnoEUR = odlivi
    .filter((stavka) => stavka.valuta === 'EUR')
    .reduce((sum, stavka) => sum + stavka.iznos, 0);

  return {
    status: 'aktivan',
    userId,
    timestamp: new Date().toISOString(),
    verzija: APP_VERSION,
    jurisdikcija: 'Republika Srbija',
    registarNosioc: 'Digitalna Industrija',
    odlivi,
    kpi: {
      ukupnoOdliva: odlivi.length,
      odobreno,
      naProveri,
      zadrzano,
      ukupnoEUR,
    },
  };
}
