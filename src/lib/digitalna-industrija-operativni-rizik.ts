import { APP_VERSION } from './constants';

export type OperativniRizikKategorija =
  | 'procesni'
  | 'tehnoloski'
  | 'ljudski-faktor'
  | 'uskladjenost';

export type OperativniRizikStatus = 'nizak' | 'umeren' | 'visok' | 'kritican';

export interface OperativniRizikStavka {
  id: string;
  oblast: string;
  kategorija: OperativniRizikKategorija;
  verovatnoca: number;
  uticaj: number;
  rizikSkor: number;
  mitigacija: string;
  datumProcene: string;
  status: OperativniRizikStatus;
}

export interface DigitalnaIndustrijaOperativniRizikRezultat {
  status: 'aktivan';
  userId: string;
  timestamp: string;
  verzija: string;
  jurisdikcija: 'Republika Srbija';
  izvor: string;
  stavke: OperativniRizikStavka[];
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

export function buildDigitalnaIndustrijaOperativniRizik(
  userId: string,
): DigitalnaIndustrijaOperativniRizikRezultat {
  const stavke: OperativniRizikStavka[] = [
    {
      id: 'OR-2026-001',
      oblast: 'Obrada faktura',
      kategorija: 'procesni',
      verovatnoca: 0.31,
      uticaj: 0.62,
      rizikSkor: 0.19,
      mitigacija: 'Automatizacija validacije i dvofazna kontrola.',
      datumProcene: '2026-05-01',
      status: 'umeren',
    },
    {
      id: 'OR-2026-002',
      oblast: 'Platni gateway',
      kategorija: 'tehnoloski',
      verovatnoca: 0.44,
      uticaj: 0.88,
      rizikSkor: 0.39,
      mitigacija: 'Failover klaster i aktivni incident response.',
      datumProcene: '2026-05-01',
      status: 'visok',
    },
    {
      id: 'OR-2026-003',
      oblast: 'Administracija privilegija',
      kategorija: 'ljudski-faktor',
      verovatnoca: 0.22,
      uticaj: 0.74,
      rizikSkor: 0.16,
      mitigacija: 'Kvartalni recertifikacioni audit pristupa.',
      datumProcene: '2026-05-01',
      status: 'nizak',
    },
    {
      id: 'OR-2026-004',
      oblast: 'Regulatorna usklađenost',
      kategorija: 'uskladjenost',
      verovatnoca: 0.57,
      uticaj: 0.95,
      rizikSkor: 0.54,
      mitigacija: 'Kontinuirano praćenje regulatornih rokova i obavezna eskalacija.',
      datumProcene: '2026-05-01',
      status: 'kritican',
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
    izvor: 'Digitalna Industrija Operativni Rizik Kontroling',
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
