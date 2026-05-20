import { APP_VERSION } from './constants';

export type PlataKategorija =
  | 'inzenjering-i-razvoj'
  | 'analitika-i-ai'
  | 'operacije-i-infrastruktura'
  | 'prodaja-i-rast';

export type PlataNivo = 'junior' | 'medior' | 'senior' | 'lead';

export interface PlataStavka {
  id: string;
  nazivPozicije: string;
  kategorija: PlataKategorija;
  sektor: string;
  nivo: PlataNivo;
  brutoRsd: number;
  netoRsd: number;
  doprinosiRsd: number;
  porezRsd: number;
  brojZaposlenih: number;
  ukupnoFondRsd: number;
  datumAzuriranja: string;
}

export interface DigitalnaIndustrijaPlateRezultat {
  status: 'aktivan';
  userId: string;
  timestamp: string;
  verzija: string;
  jurisdikcija: 'Republika Srbija';
  izvor: string;
  plate: PlataStavka[];
  kpi: {
    ukupnoPozicija: number;
    ukupnoZaposlenih: number;
    ukupnoFondRsd: number;
    prosecnoBrutoRsd: number;
    prosecnoNetoRsd: number;
    ukupnoDoprinosiRsd: number;
    ukupnoPorezRsd: number;
  };
}

export function buildDigitalnaIndustrijaPlate(
  userId: string,
): DigitalnaIndustrijaPlateRezultat {
  const plate: PlataStavka[] = [
    {
      id: 'PLT-2026-001',
      nazivPozicije: 'Senior Full-Stack Inženjer',
      kategorija: 'inzenjering-i-razvoj',
      sektor: 'Razvoj platforme',
      nivo: 'senior',
      brutoRsd: 345_000,
      netoRsd: 218_000,
      doprinosiRsd: 86_250,
      porezRsd: 40_750,
      brojZaposlenih: 3,
      ukupnoFondRsd: 345_000 * 3,
      datumAzuriranja: '2026-05-19',
    },
    {
      id: 'PLT-2026-002',
      nazivPozicije: 'AI/ML Inženjer',
      kategorija: 'analitika-i-ai',
      sektor: 'OMEGA AI',
      nivo: 'senior',
      brutoRsd: 390_000,
      netoRsd: 246_000,
      doprinosiRsd: 97_500,
      porezRsd: 46_500,
      brojZaposlenih: 2,
      ukupnoFondRsd: 390_000 * 2,
      datumAzuriranja: '2026-05-19',
    },
    {
      id: 'PLT-2026-003',
      nazivPozicije: 'DevOps / SRE Inženjer',
      kategorija: 'operacije-i-infrastruktura',
      sektor: 'Infrastruktura i observability',
      nivo: 'medior',
      brutoRsd: 310_000,
      netoRsd: 196_000,
      doprinosiRsd: 77_500,
      porezRsd: 36_500,
      brojZaposlenih: 2,
      ukupnoFondRsd: 310_000 * 2,
      datumAzuriranja: '2026-05-19',
    },
    {
      id: 'PLT-2026-004',
      nazivPozicije: 'Specijalista za B2B rast',
      kategorija: 'prodaja-i-rast',
      sektor: 'Komercijala i partnerstva',
      nivo: 'medior',
      brutoRsd: 225_000,
      netoRsd: 143_000,
      doprinosiRsd: 56_250,
      porezRsd: 25_750,
      brojZaposlenih: 1,
      ukupnoFondRsd: 225_000 * 1,
      datumAzuriranja: '2026-05-19',
    },
    {
      id: 'PLT-2026-005',
      nazivPozicije: 'Product Lead',
      kategorija: 'inzenjering-i-razvoj',
      sektor: 'Digitalni proizvodi',
      nivo: 'lead',
      brutoRsd: 420_000,
      netoRsd: 265_000,
      doprinosiRsd: 105_000,
      porezRsd: 50_000,
      brojZaposlenih: 1,
      ukupnoFondRsd: 420_000 * 1,
      datumAzuriranja: '2026-05-19',
    },
  ];

  const ukupnoZaposlenih = plate.reduce((sum, p) => sum + p.brojZaposlenih, 0);
  const ukupnoFondRsd = plate.reduce((sum, p) => sum + p.ukupnoFondRsd, 0);
  const ukupnoDoprinosiRsd = plate.reduce(
    (sum, p) => sum + p.doprinosiRsd * p.brojZaposlenih,
    0,
  );
  const ukupnoPorezRsd = plate.reduce(
    (sum, p) => sum + p.porezRsd * p.brojZaposlenih,
    0,
  );
  const prosecnoBrutoRsd = ukupnoFondRsd / Math.max(ukupnoZaposlenih, 1);
  const prosecnoNetoRsd =
    plate.reduce((sum, p) => sum + p.netoRsd * p.brojZaposlenih, 0) /
    Math.max(ukupnoZaposlenih, 1);

  return {
    status: 'aktivan',
    userId,
    timestamp: new Date().toISOString(),
    verzija: APP_VERSION,
    jurisdikcija: 'Republika Srbija',
    izvor: 'Digitalna Industrija Plate Centar',
    plate,
    kpi: {
      ukupnoPozicija: plate.length,
      ukupnoZaposlenih,
      ukupnoFondRsd,
      prosecnoBrutoRsd: Number(prosecnoBrutoRsd.toFixed(2)),
      prosecnoNetoRsd: Number(prosecnoNetoRsd.toFixed(2)),
      ukupnoDoprinosiRsd,
      ukupnoPorezRsd,
    },
  };
}
