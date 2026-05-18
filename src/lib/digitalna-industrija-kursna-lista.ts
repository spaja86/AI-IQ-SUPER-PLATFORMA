import { APP_VERSION } from './constants';

export type KursStatus = 'aktivan' | 'na-proveri';

export interface KursnaListaStavka {
  par: string;
  kupovni: number;
  srednji: number;
  prodajni: number;
  status: KursStatus;
}

export interface DigitalnaIndustrijaKursnaListaRezultat {
  status: 'aktivan';
  userId: string;
  timestamp: string;
  verzija: string;
  jurisdikcija: 'Republika Srbija';
  izvor: string;
  kursnaLista: KursnaListaStavka[];
  kpi: {
    ukupnoParova: number;
    aktivniParovi: number;
    proveraParovi: number;
    prosecniSpread: number;
  };
}

export function buildDigitalnaIndustrijaKursnaLista(
  userId: string,
): DigitalnaIndustrijaKursnaListaRezultat {
  const kursnaLista: KursnaListaStavka[] = [
    { par: 'EUR/RSD', kupovni: 117.06, srednji: 117.17, prodajni: 117.28, status: 'aktivan' },
    { par: 'USD/RSD', kupovni: 108.92, srednji: 109.03, prodajni: 109.14, status: 'aktivan' },
    { par: 'CHF/RSD', kupovni: 122.51, srednji: 122.65, prodajni: 122.79, status: 'na-proveri' },
    { par: 'EUR/USD', kupovni: 1.07, srednji: 1.08, prodajni: 1.09, status: 'aktivan' },
  ];

  const aktivniParovi = kursnaLista.filter((stavka) => stavka.status === 'aktivan').length;
  const proveraParovi = kursnaLista.filter((stavka) => stavka.status === 'na-proveri').length;
  const prosecniSpread =
    kursnaLista.reduce((sum, stavka) => sum + (stavka.prodajni - stavka.kupovni), 0) /
    kursnaLista.length;

  return {
    status: 'aktivan',
    userId,
    timestamp: new Date().toISOString(),
    verzija: APP_VERSION,
    jurisdikcija: 'Republika Srbija',
    izvor: 'Digitalna Industrija FX Kontrolni Centar',
    kursnaLista,
    kpi: {
      ukupnoParova: kursnaLista.length,
      aktivniParovi,
      proveraParovi,
      prosecniSpread: Number(prosecniSpread.toFixed(4)),
    },
  };
}
