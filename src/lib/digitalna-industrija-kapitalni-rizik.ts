import { APP_VERSION } from './constants';

export type KapitalniRizikTip = 'CET1' | 'Tier1' | 'Tier2' | 'ukupni_kapital';
export type KapitalniRizikStatus = 'uskladjen' | 'upozorenje' | 'prekrsaj';

export interface KapitalnaAdekvatnost {
  id: string;
  entitet: string;
  tip: KapitalniRizikTip;
  kapitalRsd: number;
  rwaPonderisanaAktivaRsd: number;
  carPct: number;
  minimalniCarPct: number;
  kapitalniBufferPct: number;
  datum: string;
  status: KapitalniRizikStatus;
}

export interface DigitalnaIndustrijaKapitalniRizikRezultat {
  status: 'aktivan';
  userId: string;
  timestamp: string;
  verzija: string;
  jurisdikcija: 'Republika Srbija';
  izvor: string;
  pozicije: KapitalnaAdekvatnost[];
  kpi: {
    ukupnoPozicija: number;
    uskladjenih: number;
    upozorenja: number;
    prekrsaja: number;
    ukupnoKapitalRsd: number;
    ukupnoRwaRsd: number;
    prosecniCarPct: number;
    prosecniKapitalniBufferPct: number;
  };
}

export function buildDigitalnaIndustrijaKapitalniRizik(
  userId: string,
): DigitalnaIndustrijaKapitalniRizikRezultat {
  const pozicije: KapitalnaAdekvatnost[] = [
    {
      id: 'KAP-2026-001',
      entitet: 'Spaja Digitalna Banka',
      tip: 'CET1',
      kapitalRsd: 42_000_000,
      rwaPonderisanaAktivaRsd: 280_000_000,
      carPct: 15.0,
      minimalniCarPct: 8.0,
      kapitalniBufferPct: 7.0,
      datum: '2026-05-31',
      status: 'uskladjen',
    },
    {
      id: 'KAP-2026-002',
      entitet: 'Digitalna Fabrika Nova',
      tip: 'Tier1',
      kapitalRsd: 18_500_000,
      rwaPonderisanaAktivaRsd: 165_000_000,
      carPct: 11.2,
      minimalniCarPct: 10.5,
      kapitalniBufferPct: 0.7,
      datum: '2026-05-31',
      status: 'upozorenje',
    },
    {
      id: 'KAP-2026-003',
      entitet: 'Spaja Industrija Export',
      tip: 'ukupni_kapital',
      kapitalRsd: 55_000_000,
      rwaPonderisanaAktivaRsd: 320_000_000,
      carPct: 17.2,
      minimalniCarPct: 8.0,
      kapitalniBufferPct: 9.2,
      datum: '2026-05-31',
      status: 'uskladjen',
    },
    {
      id: 'KAP-2025-041',
      entitet: 'Inženjering Delta',
      tip: 'Tier2',
      kapitalRsd: 8_200_000,
      rwaPonderisanaAktivaRsd: 112_000_000,
      carPct: 7.3,
      minimalniCarPct: 8.0,
      kapitalniBufferPct: -0.7,
      datum: '2025-12-31',
      status: 'prekrsaj',
    },
  ];

  const uskladjenih = pozicije.filter((p) => p.status === 'uskladjen').length;
  const upozorenja = pozicije.filter((p) => p.status === 'upozorenje').length;
  const prekrsaja = pozicije.filter((p) => p.status === 'prekrsaj').length;
  const ukupnoKapitalRsd = pozicije.reduce((sum, p) => sum + p.kapitalRsd, 0);
  const ukupnoRwaRsd = pozicije.reduce((sum, p) => sum + p.rwaPonderisanaAktivaRsd, 0);
  const prosecniCarPct =
    pozicije.reduce((sum, p) => sum + p.carPct, 0) / Math.max(pozicije.length, 1);
  const prosecniKapitalniBufferPct =
    pozicije.reduce((sum, p) => sum + p.kapitalniBufferPct, 0) / Math.max(pozicije.length, 1);

  return {
    status: 'aktivan',
    userId,
    timestamp: new Date().toISOString(),
    verzija: APP_VERSION,
    jurisdikcija: 'Republika Srbija',
    izvor: 'Digitalna Industrija Kapitalni Rizik Kontroling',
    pozicije,
    kpi: {
      ukupnoPozicija: pozicije.length,
      uskladjenih,
      upozorenja,
      prekrsaja,
      ukupnoKapitalRsd,
      ukupnoRwaRsd,
      prosecniCarPct: Number(prosecniCarPct.toFixed(2)),
      prosecniKapitalniBufferPct: Number(prosecniKapitalniBufferPct.toFixed(2)),
    },
  };
}
