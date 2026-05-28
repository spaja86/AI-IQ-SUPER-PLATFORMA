import { APP_VERSION } from './constants';

export type InflacijaStatus = 'objavljeno' | 'na-proveri';

export interface InflacijaStavka {
  period: string;
  cpi: number;
  mesecnaStopa: number;
  godisnjaStopa: number;
  baznaInflacija: number;
  projekcijaSledeciKvartal: number;
  status: InflacijaStatus;
}

export interface DigitalnaIndustrijaInflacijeRezultat {
  status: 'aktivan';
  userId: string;
  timestamp: string;
  verzija: string;
  jurisdikcija: 'Republika Srbija';
  izvor: string;
  inflacije: InflacijaStavka[];
  kpi: {
    ukupnoPerioda: number;
    objavljeno: number;
    naProveri: number;
    prosecnaMesecnaStopa: number;
    prosecnaGodisnjaStopa: number;
    prosecnaBaznaInflacija: number;
  };
}

export function buildDigitalnaIndustrijaInflacije(
  userId: string,
): DigitalnaIndustrijaInflacijeRezultat {
  const inflacije: InflacijaStavka[] = [
    {
      period: '2026-01',
      cpi: 197.8,
      mesecnaStopa: 0.5,
      godisnjaStopa: 4.4,
      baznaInflacija: 4.0,
      projekcijaSledeciKvartal: 4.3,
      status: 'objavljeno',
    },
    {
      period: '2026-02',
      cpi: 198.6,
      mesecnaStopa: 0.4,
      godisnjaStopa: 4.2,
      baznaInflacija: 3.9,
      projekcijaSledeciKvartal: 4.1,
      status: 'objavljeno',
    },
    {
      period: '2026-03',
      cpi: 199.4,
      mesecnaStopa: 0.4,
      godisnjaStopa: 4.0,
      baznaInflacija: 3.7,
      projekcijaSledeciKvartal: 3.9,
      status: 'objavljeno',
    },
    {
      period: '2026-04',
      cpi: 200.2,
      mesecnaStopa: 0.4,
      godisnjaStopa: 3.8,
      baznaInflacija: 3.6,
      projekcijaSledeciKvartal: 3.8,
      status: 'na-proveri',
    },
  ];

  const objavljeno = inflacije.filter((stavka) => stavka.status === 'objavljeno').length;
  const naProveri = inflacije.filter((stavka) => stavka.status === 'na-proveri').length;

  const prosecnaMesecnaStopa =
    inflacije.reduce((sum, stavka) => sum + stavka.mesecnaStopa, 0) / inflacije.length;
  const prosecnaGodisnjaStopa =
    inflacije.reduce((sum, stavka) => sum + stavka.godisnjaStopa, 0) / inflacije.length;
  const prosecnaBaznaInflacija =
    inflacije.reduce((sum, stavka) => sum + stavka.baznaInflacija, 0) / inflacije.length;

  return {
    status: 'aktivan',
    userId,
    timestamp: new Date().toISOString(),
    verzija: APP_VERSION,
    jurisdikcija: 'Republika Srbija',
    izvor: 'Digitalna Industrija Makroekonomski Centar',
    inflacije,
    kpi: {
      ukupnoPerioda: inflacije.length,
      objavljeno,
      naProveri,
      prosecnaMesecnaStopa: Number(prosecnaMesecnaStopa.toFixed(2)),
      prosecnaGodisnjaStopa: Number(prosecnaGodisnjaStopa.toFixed(2)),
      prosecnaBaznaInflacija: Number(prosecnaBaznaInflacija.toFixed(2)),
    },
  };
}
