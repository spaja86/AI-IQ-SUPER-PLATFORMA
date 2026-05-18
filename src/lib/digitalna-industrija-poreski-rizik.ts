import { APP_VERSION } from './constants';

export type PoreskiRizikKategorija =
  | 'pdv-uskladjenost'
  | 'poreske-prijave'
  | 'transferne-cene'
  | 'poreske-kazne';

export type PoreskiRizikStatus = 'nizak' | 'umeren' | 'visok' | 'kritican';

export interface PoreskiRizikStavka {
  id: string;
  oblast: string;
  kategorija: PoreskiRizikKategorija;
  verovatnoca: number;
  uticaj: number;
  rizikSkor: number;
  mitigacija: string;
  datumProcene: string;
  status: PoreskiRizikStatus;
}

export interface DigitalnaIndustrijaPoreskiRizikRezultat {
  status: 'aktivan';
  userId: string;
  timestamp: string;
  verzija: string;
  jurisdikcija: 'Republika Srbija';
  izvor: string;
  stavke: PoreskiRizikStavka[];
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

export function buildDigitalnaIndustrijaPoreskiRizik(
  userId: string,
): DigitalnaIndustrijaPoreskiRizikRezultat {
  const stavke: PoreskiRizikStavka[] = [
    {
      id: 'POR-2026-001',
      oblast: 'Neusklađenost PDV evidencija i ulazno/izlaznih faktura',
      kategorija: 'pdv-uskladjenost',
      verovatnoca: 0.41,
      uticaj: 0.79,
      rizikSkor: 0.32,
      mitigacija: 'Mesečno usaglašavanje PDV knjiga i automatske kontrole faktura.',
      datumProcene: '2026-05-18',
      status: 'visok',
    },
    {
      id: 'POR-2026-002',
      oblast: 'Kašnjenje i greške u poreskim prijavama',
      kategorija: 'poreske-prijave',
      verovatnoca: 0.36,
      uticaj: 0.72,
      rizikSkor: 0.26,
      mitigacija: 'Poreski kalendar sa kontrolnim tačkama i dualnom proverom podataka.',
      datumProcene: '2026-05-18',
      status: 'umeren',
    },
    {
      id: 'POR-2026-003',
      oblast: 'Neadekvatna dokumentacija transfernih cena',
      kategorija: 'transferne-cene',
      verovatnoca: 0.29,
      uticaj: 0.88,
      rizikSkor: 0.26,
      mitigacija: 'Godišnje osvežavanje transfer pricing dokumentacije i benchmark analiza.',
      datumProcene: '2026-05-18',
      status: 'umeren',
    },
    {
      id: 'POR-2026-004',
      oblast: 'Potencijalne novčane kazne i zatezne kamate',
      kategorija: 'poreske-kazne',
      verovatnoca: 0.25,
      uticaj: 0.92,
      rizikSkor: 0.23,
      mitigacija: 'Rani warning sistem za poreske obaveze i proaktivna komunikacija sa savetnicima.',
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
    izvor: 'Digitalna Industrija Poreski Rizik Kontroling',
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
