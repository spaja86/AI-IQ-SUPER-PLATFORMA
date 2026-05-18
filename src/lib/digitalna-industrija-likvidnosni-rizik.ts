import { APP_VERSION } from './constants';

export type LikvidnosniRizikSegment = 'kratkorocni' | 'srednjorocni' | 'dugorocni';
export type LikvidnosniRizikStatus = 'stabilan' | 'upozorenje' | 'kritican';

export interface LikvidnosnaPozicija {
  id: string;
  instrument: string;
  segment: LikvidnosniRizikSegment;
  raspolozivoRsd: number;
  obavezeRsd: number;
  pokriceRatio: number;
  netoTokRsd: number;
  datum: string;
  status: LikvidnosniRizikStatus;
}

export interface DigitalnaIndustrijaLikvidnosniRizikRezultat {
  status: 'aktivan';
  userId: string;
  timestamp: string;
  verzija: string;
  jurisdikcija: 'Republika Srbija';
  izvor: string;
  pozicije: LikvidnosnaPozicija[];
  kpi: {
    ukupnoPozicija: number;
    stabilnih: number;
    upozorenja: number;
    kriticnih: number;
    ukupnoRaspolozivoRsd: number;
    ukupnoObavezeRsd: number;
    zbirNetoTokRsd: number;
    prosecniPokriceRatio: number;
  };
}

export function buildDigitalnaIndustrijaLikvidnosniRizik(
  userId: string,
): DigitalnaIndustrijaLikvidnosniRizikRezultat {
  const pozicije: LikvidnosnaPozicija[] = [
    {
      id: 'LR-2026-001',
      instrument: 'Operativni račun RSD',
      segment: 'kratkorocni',
      raspolozivoRsd: 6_800_000,
      obavezeRsd: 4_200_000,
      pokriceRatio: 1.62,
      netoTokRsd: 820_000,
      datum: '2026-05-01',
      status: 'stabilan',
    },
    {
      id: 'LR-2026-002',
      instrument: 'Devizni račun EUR',
      segment: 'kratkorocni',
      raspolozivoRsd: 4_100_000,
      obavezeRsd: 3_900_000,
      pokriceRatio: 1.05,
      netoTokRsd: 90_000,
      datum: '2026-05-01',
      status: 'upozorenje',
    },
    {
      id: 'LR-2026-003',
      instrument: 'Revolving kreditna linija',
      segment: 'srednjorocni',
      raspolozivoRsd: 9_000_000,
      obavezeRsd: 7_200_000,
      pokriceRatio: 1.25,
      netoTokRsd: 410_000,
      datum: '2026-05-01',
      status: 'stabilan',
    },
    {
      id: 'LR-2026-004',
      instrument: 'Kapitalni projekat — faza II',
      segment: 'dugorocni',
      raspolozivoRsd: 3_000_000,
      obavezeRsd: 3_600_000,
      pokriceRatio: 0.83,
      netoTokRsd: -280_000,
      datum: '2026-05-01',
      status: 'kritican',
    },
  ];

  const stabilnih = pozicije.filter((p) => p.status === 'stabilan').length;
  const upozorenja = pozicije.filter((p) => p.status === 'upozorenje').length;
  const kriticnih = pozicije.filter((p) => p.status === 'kritican').length;
  const ukupnoRaspolozivoRsd = pozicije.reduce((sum, p) => sum + p.raspolozivoRsd, 0);
  const ukupnoObavezeRsd = pozicije.reduce((sum, p) => sum + p.obavezeRsd, 0);
  const zbirNetoTokRsd = pozicije.reduce((sum, p) => sum + p.netoTokRsd, 0);
  const prosecniPokriceRatio =
    pozicije.reduce((sum, p) => sum + p.pokriceRatio, 0) / Math.max(pozicije.length, 1);

  return {
    status: 'aktivan',
    userId,
    timestamp: new Date().toISOString(),
    verzija: APP_VERSION,
    jurisdikcija: 'Republika Srbija',
    izvor: 'Digitalna Industrija Likvidnosni Rizik Kontroling',
    pozicije,
    kpi: {
      ukupnoPozicija: pozicije.length,
      stabilnih,
      upozorenja,
      kriticnih,
      ukupnoRaspolozivoRsd,
      ukupnoObavezeRsd,
      zbirNetoTokRsd,
      prosecniPokriceRatio: Number(prosecniPokriceRatio.toFixed(2)),
    },
  };
}
