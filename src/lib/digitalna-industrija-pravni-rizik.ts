import { APP_VERSION } from './constants';

export type PravniRizikKategorija =
  | 'ugovorni'
  | 'sudski'
  | 'intelektualna-svojina'
  | 'regulatorni';

export type PravniRizikStatus = 'nizak' | 'umeren' | 'visok' | 'kritican';

export interface PravniRizikStavka {
  id: string;
  oblast: string;
  kategorija: PravniRizikKategorija;
  verovatnoca: number;
  uticaj: number;
  rizikSkor: number;
  mitigacija: string;
  datumProcene: string;
  status: PravniRizikStatus;
}

export interface DigitalnaIndustrijaPravniRizikRezultat {
  status: 'aktivan';
  userId: string;
  timestamp: string;
  verzija: string;
  jurisdikcija: 'Republika Srbija';
  izvor: string;
  stavke: PravniRizikStavka[];
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

export function buildDigitalnaIndustrijaPravniRizik(
  userId: string,
): DigitalnaIndustrijaPravniRizikRezultat {
  const stavke: PravniRizikStavka[] = [
    {
      id: 'PR-2026-001',
      oblast: 'Neusklađenost ugovornih obaveza sa partnerima',
      kategorija: 'ugovorni',
      verovatnoca: 0.44,
      uticaj: 0.71,
      rizikSkor: 0.31,
      mitigacija: 'Standardizacija ugovornih klauzula i kvartalna pravna revizija ugovora.',
      datumProcene: '2026-05-01',
      status: 'visok',
    },
    {
      id: 'PR-2026-002',
      oblast: 'Aktivni sudski postupci i potencijalna odšteta',
      kategorija: 'sudski',
      verovatnoca: 0.36,
      uticaj: 0.86,
      rizikSkor: 0.31,
      mitigacija: 'Rana procena sporova, aktivna strategija odbrane i pravovremena nagodba gde je isplativo.',
      datumProcene: '2026-05-01',
      status: 'umeren',
    },
    {
      id: 'PR-2026-003',
      oblast: 'Povreda prava intelektualne svojine',
      kategorija: 'intelektualna-svojina',
      verovatnoca: 0.28,
      uticaj: 0.93,
      rizikSkor: 0.26,
      mitigacija: 'Registracija žigova/patentne zaštite i kontinuirani IP monitoring.',
      datumProcene: '2026-05-01',
      status: 'nizak',
    },
    {
      id: 'PR-2026-004',
      oblast: 'Kazne zbog regulatorne neusklađenosti',
      kategorija: 'regulatorni',
      verovatnoca: 0.31,
      uticaj: 0.89,
      rizikSkor: 0.28,
      mitigacija: 'Kontinuirano praćenje regulatornih izmena i obavezne compliance provere.',
      datumProcene: '2026-05-01',
      status: 'umeren',
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
    izvor: 'Digitalna Industrija Pravni Rizik Kontroling',
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
