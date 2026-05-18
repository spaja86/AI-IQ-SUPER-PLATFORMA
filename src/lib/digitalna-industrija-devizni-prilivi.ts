import { APP_VERSION } from './constants';

export type PrilivStatus = 'evidentirano' | 'na-uskladjivanju' | 'blokirano';

export interface DevizniPrilivStavka {
  id: string;
  entitet: string;
  izvor: string;
  valuta: 'EUR' | 'USD' | 'CHF';
  iznos: number;
  status: PrilivStatus;
}

export interface DigitalnaIndustrijaDevizniPriliviRezultat {
  status: 'aktivan';
  userId: string;
  timestamp: string;
  verzija: string;
  jurisdikcija: 'Republika Srbija';
  registarNosioc: string;
  prilivi: DevizniPrilivStavka[];
  kpi: {
    ukupnoPriliva: number;
    evidentirano: number;
    naUskladjivanju: number;
    blokirano: number;
    ukupnoEUR: number;
  };
}

export function buildDigitalnaIndustrijaDevizniPrilivi(
  userId: string,
): DigitalnaIndustrijaDevizniPriliviRezultat {
  const prilivi: DevizniPrilivStavka[] = [
    {
      id: 'devizni-priliv-001',
      entitet: 'Digitalna Industrija',
      izvor: 'Enterprise SaaS ugovor',
      valuta: 'EUR',
      iznos: 126_400,
      status: 'evidentirano',
    },
    {
      id: 'devizni-priliv-002',
      entitet: 'AI IQ World Bank Operativa',
      izvor: 'Cross-border processing fee',
      valuta: 'USD',
      iznos: 74_900,
      status: 'na-uskladjivanju',
    },
    {
      id: 'devizni-priliv-003',
      entitet: 'SPAJA Tehnološki Centar',
      izvor: 'Licenca platforme',
      valuta: 'CHF',
      iznos: 52_000,
      status: 'evidentirano',
    },
    {
      id: 'devizni-priliv-004',
      entitet: 'Proksi Infrastruktura',
      izvor: 'Managed infra retainer',
      valuta: 'EUR',
      iznos: 41_600,
      status: 'blokirano',
    },
  ];

  const evidentirano = prilivi.filter((stavka) => stavka.status === 'evidentirano').length;
  const naUskladjivanju = prilivi.filter((stavka) => stavka.status === 'na-uskladjivanju').length;
  const blokirano = prilivi.filter((stavka) => stavka.status === 'blokirano').length;
  const ukupnoEUR = prilivi
    .filter((stavka) => stavka.valuta === 'EUR')
    .reduce((sum, stavka) => sum + stavka.iznos, 0);

  return {
    status: 'aktivan',
    userId,
    timestamp: new Date().toISOString(),
    verzija: APP_VERSION,
    jurisdikcija: 'Republika Srbija',
    registarNosioc: 'Digitalna Industrija',
    prilivi,
    kpi: {
      ukupnoPriliva: prilivi.length,
      evidentirano,
      naUskladjivanju,
      blokirano,
      ukupnoEUR,
    },
  };
}
