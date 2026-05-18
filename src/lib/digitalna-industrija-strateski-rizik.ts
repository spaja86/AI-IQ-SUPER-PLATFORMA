import { APP_VERSION } from './constants';

export type StrateskiRizikKategorija =
  | 'konkurentski'
  | 'trzisni'
  | 'inovacioni'
  | 'regulatorni';

export type StrateskiRizikStatus = 'nizak' | 'umeren' | 'visok' | 'kritican';

export interface StrateskiRizikStavka {
  id: string;
  oblast: string;
  kategorija: StrateskiRizikKategorija;
  verovatnoca: number;
  uticaj: number;
  rizikSkor: number;
  mitigacija: string;
  datumProcene: string;
  status: StrateskiRizikStatus;
}

export interface DigitalnaIndustrijaStrateskiRizikRezultat {
  status: 'aktivan';
  userId: string;
  timestamp: string;
  verzija: string;
  jurisdikcija: 'Republika Srbija';
  izvor: string;
  stavke: StrateskiRizikStavka[];
  kpi: {
    ukupnoStavki: number;
    kriticnih: number;
    visokih: number;
    umerenih: number;
    niskih: number;
    prosecniRizikSkor: number;
    maxRizikSkor: number;
  };
}

export function buildDigitalnaIndustrijaStrateskiRizik(
  userId: string,
): DigitalnaIndustrijaStrateskiRizikRezultat {
  const stavke: StrateskiRizikStavka[] = [
    {
      id: 'SR-2026-001',
      oblast: 'Gubitak tržišnog udela usled novih konkurenata',
      kategorija: 'konkurentski',
      verovatnoca: 0.42,
      uticaj: 0.76,
      rizikSkor: 0.32,
      mitigacija: 'Kontinuirana analiza konkurentskog okruženja i diferencijacija ponude.',
      datumProcene: '2026-05-01',
      status: 'visok',
    },
    {
      id: 'SR-2026-002',
      oblast: 'Promene u tržišnoj tražnji i preferencijama korisnika',
      kategorija: 'trzisni',
      verovatnoca: 0.55,
      uticaj: 0.61,
      rizikSkor: 0.34,
      mitigacija: 'Redovna istraživanja tržišta i agilna prilagodba poslovnog modela.',
      datumProcene: '2026-05-01',
      status: 'visok',
    },
    {
      id: 'SR-2026-003',
      oblast: 'Zaostajanje za tehnološkim inovacijama',
      kategorija: 'inovacioni',
      verovatnoca: 0.38,
      uticaj: 0.83,
      rizikSkor: 0.31,
      mitigacija: 'Ulaganje u R&D, partnerstva sa inovativnim kompanijama i praćenje tehno trendova.',
      datumProcene: '2026-05-01',
      status: 'umeren',
    },
    {
      id: 'SR-2026-004',
      oblast: 'Izmena regulatornog okvira za digitalne platforme',
      kategorija: 'regulatorni',
      verovatnoca: 0.29,
      uticaj: 0.92,
      rizikSkor: 0.27,
      mitigacija: 'Aktivno praćenje zakonodavnih promena i angažovanje sa regulatorima.',
      datumProcene: '2026-05-01',
      status: 'nizak',
    },
  ];

  const kriticnih = stavke.filter((s) => s.status === 'kritican').length;
  const visokih = stavke.filter((s) => s.status === 'visok').length;
  const umerenih = stavke.filter((s) => s.status === 'umeren').length;
  const niskih = stavke.filter((s) => s.status === 'nizak').length;
  const prosecniRizikSkor =
    stavke.reduce((sum, s) => sum + s.rizikSkor, 0) / Math.max(stavke.length, 1);
  const maxRizikSkor = stavke.reduce((max, s) => Math.max(max, s.rizikSkor), 0);

  return {
    status: 'aktivan',
    userId,
    timestamp: new Date().toISOString(),
    verzija: APP_VERSION,
    jurisdikcija: 'Republika Srbija',
    izvor: 'Digitalna Industrija Strateški Rizik Kontroling',
    stavke,
    kpi: {
      ukupnoStavki: stavke.length,
      kriticnih,
      visokih,
      umerenih,
      niskih,
      prosecniRizikSkor: Number(prosecniRizikSkor.toFixed(2)),
      maxRizikSkor: Number(maxRizikSkor.toFixed(2)),
    },
  };
}
