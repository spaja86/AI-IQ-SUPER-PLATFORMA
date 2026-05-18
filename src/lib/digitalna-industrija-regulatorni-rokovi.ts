import { APP_VERSION } from './constants';

export type RokStatus = 'na-vreme' | 'u-toku' | 'kriticno';

export interface RegulatorniRokStavka {
  id: string;
  entitet: string;
  regulator: string;
  obaveza: string;
  rok: string;
  status: RokStatus;
  prioritet: 'visok' | 'srednji';
}

export interface DigitalnaIndustrijaRegulatorniRokoviRezultat {
  status: 'aktivan';
  userId: string;
  timestamp: string;
  verzija: string;
  jurisdikcija: 'Republika Srbija';
  registarNosioc: string;
  rokovi: RegulatorniRokStavka[];
  kpi: {
    ukupnoRokova: number;
    naVreme: number;
    uToku: number;
    kriticno: number;
  };
}

export function buildDigitalnaIndustrijaRegulatorniRokovi(
  userId: string,
): DigitalnaIndustrijaRegulatorniRokoviRezultat {
  const rokovi: RegulatorniRokStavka[] = [
    {
      id: 'apr-godisnji-finansijski-izvestaj',
      entitet: 'Digitalna Industrija',
      regulator: 'APR',
      obaveza: 'Godišnji finansijski izveštaj',
      rok: '2026-03-31',
      status: 'na-vreme',
      prioritet: 'visok',
    },
    {
      id: 'nbs-izvestaj-platne-usluge',
      entitet: 'AI IQ World Bank Operativa',
      regulator: 'NBS',
      obaveza: 'Kvartalni izveštaj o platnim uslugama',
      rok: '2026-06-15',
      status: 'u-toku',
      prioritet: 'visok',
    },
    {
      id: 'poverenik-zastita-podataka',
      entitet: 'SPAJA Tehnološki Centar',
      regulator: 'Poverenik',
      obaveza: 'Godišnja revizija zaštite podataka',
      rok: '2026-05-30',
      status: 'kriticno',
      prioritet: 'visok',
    },
    {
      id: 'ratel-mrezna-sertifikacija',
      entitet: 'Proksi Infrastruktura',
      regulator: 'RATEL',
      obaveza: 'Obnova mrežne sertifikacije',
      rok: '2026-07-20',
      status: 'u-toku',
      prioritet: 'srednji',
    },
  ];

  const naVreme = rokovi.filter((stavka) => stavka.status === 'na-vreme').length;
  const uToku = rokovi.filter((stavka) => stavka.status === 'u-toku').length;
  const kriticno = rokovi.filter((stavka) => stavka.status === 'kriticno').length;

  return {
    status: 'aktivan',
    userId,
    timestamp: new Date().toISOString(),
    verzija: APP_VERSION,
    jurisdikcija: 'Republika Srbija',
    registarNosioc: 'Digitalna Industrija',
    rokovi,
    kpi: {
      ukupnoRokova: rokovi.length,
      naVreme,
      uToku,
      kriticno,
    },
  };
}
