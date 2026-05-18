import { APP_VERSION } from './constants';

export type HedzingTip = 'forvard' | 'svop' | 'opcija' | 'fjucers';
export type HedzingStatus = 'aktivan' | 'istekao' | 'zatvoren';

export interface HedzingUgovor {
  id: string;
  tip: HedzingTip;
  valutaPar: string;
  nominalnaVrednostRsd: number;
  stopa: number;
  datumPocetka: string;
  datumIsteka: string;
  status: HedzingStatus;
  pokriveniRizikPct: number;
}

export interface DigitalnaIndustrijaHedzingRezultat {
  status: 'aktivan';
  userId: string;
  timestamp: string;
  verzija: string;
  jurisdikcija: 'Republika Srbija';
  izvor: string;
  ugovori: HedzingUgovor[];
  kpi: {
    ukupnoUgovora: number;
    aktivnih: number;
    istek: number;
    zatvorenih: number;
    ukupnoNominalnaRsd: number;
    prosecnoPokriveniRizikPct: number;
  };
}

export function buildDigitalnaIndustrijaHedzing(
  userId: string,
): DigitalnaIndustrijaHedzingRezultat {
  const ugovori: HedzingUgovor[] = [
    {
      id: 'HDZ-2026-001',
      tip: 'forvard',
      valutaPar: 'EUR/RSD',
      nominalnaVrednostRsd: 7_200_000,
      stopa: 117.42,
      datumPocetka: '2026-01-15',
      datumIsteka: '2026-07-15',
      status: 'aktivan',
      pokriveniRizikPct: 85,
    },
    {
      id: 'HDZ-2026-002',
      tip: 'svop',
      valutaPar: 'USD/RSD',
      nominalnaVrednostRsd: 4_860_000,
      stopa: 108.77,
      datumPocetka: '2026-02-01',
      datumIsteka: '2026-08-01',
      status: 'aktivan',
      pokriveniRizikPct: 72,
    },
    {
      id: 'HDZ-2025-015',
      tip: 'opcija',
      valutaPar: 'CHF/RSD',
      nominalnaVrednostRsd: 3_150_000,
      stopa: 121.03,
      datumPocetka: '2025-10-01',
      datumIsteka: '2026-04-01',
      status: 'istekao',
      pokriveniRizikPct: 60,
    },
    {
      id: 'HDZ-2026-003',
      tip: 'fjucers',
      valutaPar: 'EUR/RSD',
      nominalnaVrednostRsd: 5_540_000,
      stopa: 117.80,
      datumPocetka: '2026-03-01',
      datumIsteka: '2026-09-30',
      status: 'aktivan',
      pokriveniRizikPct: 90,
    },
  ];

  const aktivnih = ugovori.filter((u) => u.status === 'aktivan').length;
  const istek = ugovori.filter((u) => u.status === 'istekao').length;
  const zatvorenih = ugovori.filter((u) => u.status === 'zatvoren').length;
  const ukupnoNominalnaRsd = ugovori.reduce((sum, u) => sum + u.nominalnaVrednostRsd, 0);
  const prosecnoPokriveniRizikPct =
    ugovori.reduce((sum, u) => sum + u.pokriveniRizikPct, 0) / ugovori.length;

  return {
    status: 'aktivan',
    userId,
    timestamp: new Date().toISOString(),
    verzija: APP_VERSION,
    jurisdikcija: 'Republika Srbija',
    izvor: 'Digitalna Industrija Hedzing Kontroling',
    ugovori,
    kpi: {
      ukupnoUgovora: ugovori.length,
      aktivnih,
      istek,
      zatvorenih,
      ukupnoNominalnaRsd,
      prosecnoPokriveniRizikPct: Number(prosecnoPokriveniRizikPct.toFixed(2)),
    },
  };
}
