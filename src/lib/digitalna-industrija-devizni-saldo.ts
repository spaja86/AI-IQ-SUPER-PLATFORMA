import { APP_VERSION } from './constants';

export type SaldoStatus = 'pozitivan' | 'balansiran' | 'u-minusu';
export type SaldoTok = 'priliv' | 'odliv';

export interface DevizniSaldoStavka {
  id: string;
  entitet: string;
  tok: SaldoTok;
  valuta: 'EUR' | 'USD' | 'CHF';
  iznos: number;
}

export interface DigitalnaIndustrijaDevizniSaldoRezultat {
  status: 'aktivan';
  userId: string;
  timestamp: string;
  verzija: string;
  jurisdikcija: 'Republika Srbija';
  registarNosioc: string;
  stavke: DevizniSaldoStavka[];
  kpi: {
    ukupnoStavki: number;
    prilivi: number;
    odlivi: number;
    netoEUR: number;
    saldoStatus: SaldoStatus;
  };
}

export function buildDigitalnaIndustrijaDevizniSaldo(
  userId: string,
): DigitalnaIndustrijaDevizniSaldoRezultat {
  const stavke: DevizniSaldoStavka[] = [
    {
      id: 'devizni-saldo-001',
      entitet: 'Digitalna Industrija',
      tok: 'priliv',
      valuta: 'EUR',
      iznos: 132_500,
    },
    {
      id: 'devizni-saldo-002',
      entitet: 'Digitalna Industrija',
      tok: 'odliv',
      valuta: 'EUR',
      iznos: 87_200,
    },
    {
      id: 'devizni-saldo-003',
      entitet: 'AI IQ World Bank Operativa',
      tok: 'priliv',
      valuta: 'USD',
      iznos: 63_900,
    },
    {
      id: 'devizni-saldo-004',
      entitet: 'Proksi Infrastruktura',
      tok: 'odliv',
      valuta: 'CHF',
      iznos: 28_400,
    },
  ];

  const prilivi = stavke.filter((stavka) => stavka.tok === 'priliv').length;
  const odlivi = stavke.filter((stavka) => stavka.tok === 'odliv').length;
  const priliviEUR = stavke
    .filter((stavka) => stavka.tok === 'priliv' && stavka.valuta === 'EUR')
    .reduce((sum, stavka) => sum + stavka.iznos, 0);
  const odliviEUR = stavke
    .filter((stavka) => stavka.tok === 'odliv' && stavka.valuta === 'EUR')
    .reduce((sum, stavka) => sum + stavka.iznos, 0);
  const netoEUR = priliviEUR - odliviEUR;
  const saldoStatus: SaldoStatus =
    netoEUR > 0 ? 'pozitivan' : netoEUR < 0 ? 'u-minusu' : 'balansiran';

  return {
    status: 'aktivan',
    userId,
    timestamp: new Date().toISOString(),
    verzija: APP_VERSION,
    jurisdikcija: 'Republika Srbija',
    registarNosioc: 'Digitalna Industrija',
    stavke,
    kpi: {
      ukupnoStavki: stavke.length,
      prilivi,
      odlivi,
      netoEUR,
      saldoStatus,
    },
  };
}
