import { APP_VERSION } from './constants';

export type EsgRizikKategorija =
  | 'ekoloski-rizici'
  | 'socijalni-rizici'
  | 'upravljacki-rizici'
  | 'esg-kaznena-izlozenost';

export type EsgRizikStatus = 'nizak' | 'umeren' | 'visok' | 'kritican';

export interface EsgRizikStavka {
  id: string;
  oblast: string;
  kategorija: EsgRizikKategorija;
  verovatnoca: number;
  uticaj: number;
  rizikSkor: number;
  mitigacija: string;
  datumProcene: string;
  status: EsgRizikStatus;
}

export interface DigitalnaIndustrijaEsgRizikRezultat {
  status: 'aktivan';
  userId: string;
  timestamp: string;
  verzija: string;
  jurisdikcija: 'Republika Srbija';
  izvor: string;
  stavke: EsgRizikStavka[];
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

export function buildDigitalnaIndustrijaEsgRizik(
  userId: string,
): DigitalnaIndustrijaEsgRizikRezultat {
  const stavke: EsgRizikStavka[] = [
    {
      id: 'ESG-2026-001',
      oblast: 'Neusklađenost ekoloških standarda i emisijskih evidencija',
      kategorija: 'ekoloski-rizici',
      verovatnoca: 0.41,
      uticaj: 0.79,
      rizikSkor: 0.32,
      mitigacija: 'Mesečno usaglašavanje ESG ekoloških evidencija i automatizovane kontrole emisija.',
      datumProcene: '2026-05-18',
      status: 'visok',
    },
    {
      id: 'ESG-2026-002',
      oblast: 'Neadekvatni socijalni standardi i slab nadzor lanca dobavljača',
      kategorija: 'socijalni-rizici',
      verovatnoca: 0.36,
      uticaj: 0.72,
      rizikSkor: 0.26,
      mitigacija: 'Uvođenje ESG due-diligence kontrolnih tačaka i periodične provere socijalnih kriterijuma.',
      datumProcene: '2026-05-18',
      status: 'umeren',
    },
    {
      id: 'ESG-2026-003',
      oblast: 'Neadekvatna dokumentacija upravljačkih politika i konflikta interesa',
      kategorija: 'upravljacki-rizici',
      verovatnoca: 0.29,
      uticaj: 0.88,
      rizikSkor: 0.26,
      mitigacija: 'Kvartalno osvežavanje governance politika i nezavisna verifikacija upravljačkih procedura.',
      datumProcene: '2026-05-18',
      status: 'umeren',
    },
    {
      id: 'ESG-2026-004',
      oblast: 'Potencijalne ESG kazne, reputaciona šteta i gubitak investicionog rejtinga',
      kategorija: 'esg-kaznena-izlozenost',
      verovatnoca: 0.25,
      uticaj: 0.92,
      rizikSkor: 0.23,
      mitigacija: 'Rani warning sistem za ESG obaveze i proaktivna komunikacija sa regulatorima i investitorima.',
      datumProcene: '2026-05-18',
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
    izvor: 'Digitalna Industrija ESG Rizik Kontroling Centar',
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
