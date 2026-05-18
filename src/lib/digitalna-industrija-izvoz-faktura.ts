import { APP_VERSION } from './constants';

export type IzvozStatus = 'spremno' | 'u-pripremi' | 'zahteva-reviziju';

export interface IzvozFakturaStavka {
  id: string;
  entitet: string;
  brojFakture: string;
  trziste: string;
  valuta: 'EUR' | 'USD' | 'CHF';
  iznos: number;
  status: IzvozStatus;
}

export interface DigitalnaIndustrijaIzvozFakturaRezultat {
  status: 'aktivan';
  userId: string;
  timestamp: string;
  verzija: string;
  jurisdikcija: 'Republika Srbija';
  registarNosioc: string;
  fakture: IzvozFakturaStavka[];
  kpi: {
    ukupnoFaktura: number;
    spremno: number;
    uPripremi: number;
    zahtevaReviziju: number;
    ukupnoEUR: number;
  };
}

export function buildDigitalnaIndustrijaIzvozFaktura(
  userId: string,
): DigitalnaIndustrijaIzvozFakturaRezultat {
  const fakture: IzvozFakturaStavka[] = [
    {
      id: 'izvoz-faktura-001',
      entitet: 'Digitalna Industrija',
      brojFakture: 'DI-EXP-2026-001',
      trziste: 'EU',
      valuta: 'EUR',
      iznos: 82_500,
      status: 'spremno',
    },
    {
      id: 'izvoz-faktura-002',
      entitet: 'AI IQ World Bank Operativa',
      brojFakture: 'WB-EXP-2026-014',
      trziste: 'SAD',
      valuta: 'USD',
      iznos: 104_000,
      status: 'u-pripremi',
    },
    {
      id: 'izvoz-faktura-003',
      entitet: 'SPAJA Tehnološki Centar',
      brojFakture: 'STC-EXP-2026-007',
      trziste: 'Švajcarska',
      valuta: 'CHF',
      iznos: 48_300,
      status: 'zahteva-reviziju',
    },
    {
      id: 'izvoz-faktura-004',
      entitet: 'Proksi Infrastruktura',
      brojFakture: 'PI-EXP-2026-003',
      trziste: 'EU',
      valuta: 'EUR',
      iznos: 63_400,
      status: 'spremno',
    },
  ];

  const spremno = fakture.filter((stavka) => stavka.status === 'spremno').length;
  const uPripremi = fakture.filter((stavka) => stavka.status === 'u-pripremi').length;
  const zahtevaReviziju = fakture.filter((stavka) => stavka.status === 'zahteva-reviziju').length;
  const ukupnoEUR = fakture
    .filter((stavka) => stavka.valuta === 'EUR')
    .reduce((sum, stavka) => sum + stavka.iznos, 0);

  return {
    status: 'aktivan',
    userId,
    timestamp: new Date().toISOString(),
    verzija: APP_VERSION,
    jurisdikcija: 'Republika Srbija',
    registarNosioc: 'Digitalna Industrija',
    fakture,
    kpi: {
      ukupnoFaktura: fakture.length,
      spremno,
      uPripremi,
      zahtevaReviziju,
      ukupnoEUR,
    },
  };
}
