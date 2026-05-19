import { APP_VERSION } from './constants';

export type PozicijaKategorija =
  | 'inzenjering-i-razvoj'
  | 'analitika-i-ai'
  | 'operacije-i-infrastruktura'
  | 'prodaja-i-rast';

export type PozicijaStatus = 'popunjena' | 'u-zaposljavanju' | 'planirana';

export interface PozicijaStavka {
  id: string;
  nazivPozicije: string;
  kategorija: PozicijaKategorija;
  sektor: string;
  nivo: 'junior' | 'medior' | 'senior' | 'lead';
  brojIzvrsilaca: number;
  popunjeno: number;
  prosecnaBrutoZaradaRsd: number;
  prioritetZaposljavanja: 'nizak' | 'umeren' | 'visok';
  datumAzuriranja: string;
  status: PozicijaStatus;
}

export interface DigitalnaIndustrijaPozicijeRezultat {
  status: 'aktivan';
  userId: string;
  timestamp: string;
  verzija: string;
  jurisdikcija: 'Republika Srbija';
  izvor: string;
  pozicije: PozicijaStavka[];
  kpi: {
    ukupnoPozicija: number;
    ukupnoPlaniranoIzvrsilaca: number;
    ukupnoPopunjenoIzvrsilaca: number;
    popunjenihPozicija: number;
    uZaposljavanju: number;
    planiranih: number;
    prosecnaPopunjenostPct: number;
  };
}

export function buildDigitalnaIndustrijaPozicije(
  userId: string,
): DigitalnaIndustrijaPozicijeRezultat {
  const pozicije: PozicijaStavka[] = [
    {
      id: 'POZ-2026-001',
      nazivPozicije: 'Senior Full-Stack Inženjer',
      kategorija: 'inzenjering-i-razvoj',
      sektor: 'Razvoj platforme',
      nivo: 'senior',
      brojIzvrsilaca: 4,
      popunjeno: 3,
      prosecnaBrutoZaradaRsd: 345_000,
      prioritetZaposljavanja: 'visok',
      datumAzuriranja: '2026-05-19',
      status: 'u-zaposljavanju',
    },
    {
      id: 'POZ-2026-002',
      nazivPozicije: 'AI/ML Inženjer',
      kategorija: 'analitika-i-ai',
      sektor: 'OMEGA AI',
      nivo: 'senior',
      brojIzvrsilaca: 3,
      popunjeno: 2,
      prosecnaBrutoZaradaRsd: 390_000,
      prioritetZaposljavanja: 'visok',
      datumAzuriranja: '2026-05-19',
      status: 'u-zaposljavanju',
    },
    {
      id: 'POZ-2026-003',
      nazivPozicije: 'DevOps / SRE Inženjer',
      kategorija: 'operacije-i-infrastruktura',
      sektor: 'Infrastruktura i observability',
      nivo: 'medior',
      brojIzvrsilaca: 2,
      popunjeno: 2,
      prosecnaBrutoZaradaRsd: 310_000,
      prioritetZaposljavanja: 'umeren',
      datumAzuriranja: '2026-05-19',
      status: 'popunjena',
    },
    {
      id: 'POZ-2026-004',
      nazivPozicije: 'Specijalista za B2B rast',
      kategorija: 'prodaja-i-rast',
      sektor: 'Komercijala i partnerstva',
      nivo: 'medior',
      brojIzvrsilaca: 2,
      popunjeno: 1,
      prosecnaBrutoZaradaRsd: 225_000,
      prioritetZaposljavanja: 'umeren',
      datumAzuriranja: '2026-05-19',
      status: 'u-zaposljavanju',
    },
    {
      id: 'POZ-2026-005',
      nazivPozicije: 'Product Lead',
      kategorija: 'inzenjering-i-razvoj',
      sektor: 'Digitalni proizvodi',
      nivo: 'lead',
      brojIzvrsilaca: 1,
      popunjeno: 0,
      prosecnaBrutoZaradaRsd: 420_000,
      prioritetZaposljavanja: 'visok',
      datumAzuriranja: '2026-05-19',
      status: 'planirana',
    },
  ];

  const ukupnoPlaniranoIzvrsilaca = pozicije.reduce((sum, p) => sum + p.brojIzvrsilaca, 0);
  const ukupnoPopunjenoIzvrsilaca = pozicije.reduce((sum, p) => sum + p.popunjeno, 0);
  const popunjenihPozicija = pozicije.filter((p) => p.status === 'popunjena').length;
  const uZaposljavanju = pozicije.filter((p) => p.status === 'u-zaposljavanju').length;
  const planiranih = pozicije.filter((p) => p.status === 'planirana').length;
  const prosecnaPopunjenostPct =
    (ukupnoPopunjenoIzvrsilaca / Math.max(ukupnoPlaniranoIzvrsilaca, 1)) * 100;

  return {
    status: 'aktivan',
    userId,
    timestamp: new Date().toISOString(),
    verzija: APP_VERSION,
    jurisdikcija: 'Republika Srbija',
    izvor: 'Digitalna Industrija Pozicije Centar',
    pozicije,
    kpi: {
      ukupnoPozicija: pozicije.length,
      ukupnoPlaniranoIzvrsilaca,
      ukupnoPopunjenoIzvrsilaca,
      popunjenihPozicija,
      uZaposljavanju,
      planiranih,
      prosecnaPopunjenostPct: Number(prosecnaPopunjenostPct.toFixed(2)),
    },
  };
}
