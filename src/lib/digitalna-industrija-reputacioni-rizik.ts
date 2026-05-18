import { APP_VERSION } from './constants';

export type ReputacioniRizikKategorija =
  | 'medijski'
  | 'socijalni'
  | 'regulatorni'
  | 'partnerski';

export type ReputacioniRizikStatus = 'nizak' | 'umeren' | 'visok' | 'kritican';

export interface ReputacioniRizikStavka {
  id: string;
  oblast: string;
  kategorija: ReputacioniRizikKategorija;
  izlozenost: number;
  uticajNaBrend: number;
  rizikSkor: number;
  mitigacija: string;
  datumProcene: string;
  status: ReputacioniRizikStatus;
}

export interface DigitalnaIndustrijaReputacioniRizikRezultat {
  status: 'aktivan';
  userId: string;
  timestamp: string;
  verzija: string;
  jurisdikcija: 'Republika Srbija';
  izvor: string;
  stavke: ReputacioniRizikStavka[];
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

export function buildDigitalnaIndustrijaReputacioniRizik(
  userId: string,
): DigitalnaIndustrijaReputacioniRizikRezultat {
  const stavke: ReputacioniRizikStavka[] = [
    {
      id: 'RR-2026-001',
      oblast: 'Negativni medijski izveštaji',
      kategorija: 'medijski',
      izlozenost: 0.48,
      uticajNaBrend: 0.72,
      rizikSkor: 0.35,
      mitigacija: 'Proaktivna PR strategija i brzi odgovor na medijske upite.',
      datumProcene: '2026-05-01',
      status: 'visok',
    },
    {
      id: 'RR-2026-002',
      oblast: 'Negativne recenzije na društvenim mrežama',
      kategorija: 'socijalni',
      izlozenost: 0.61,
      uticajNaBrend: 0.55,
      rizikSkor: 0.34,
      mitigacija: 'Aktivni community management i brzo rešavanje pritužbi.',
      datumProcene: '2026-05-01',
      status: 'visok',
    },
    {
      id: 'RR-2026-003',
      oblast: 'Regulatorne sankcije i javne objave',
      kategorija: 'regulatorni',
      izlozenost: 0.33,
      uticajNaBrend: 0.91,
      rizikSkor: 0.30,
      mitigacija: 'Striktno poštovanje propisa i transparentno izveštavanje.',
      datumProcene: '2026-05-01',
      status: 'umeren',
    },
    {
      id: 'RR-2026-004',
      oblast: 'Raskid ključnog partnerstva',
      kategorija: 'partnerski',
      izlozenost: 0.27,
      uticajNaBrend: 0.84,
      rizikSkor: 0.23,
      mitigacija: 'Diversifikacija partnerstava i redovne revizije ugovornih obaveza.',
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
    izvor: 'Digitalna Industrija Reputacioni Rizik Kontroling',
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
