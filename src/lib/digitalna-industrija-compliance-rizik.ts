import { APP_VERSION } from './constants';

export type ComplianceRizikKategorija =
  | 'regulatorna-uskladjenost'
  | 'kontrolne-procedure'
  | 'interni-audit'
  | 'regulatorne-kazne';

export type ComplianceRizikStatus = 'nizak' | 'umeren' | 'visok' | 'kritican';

export interface ComplianceRizikStavka {
  id: string;
  oblast: string;
  kategorija: ComplianceRizikKategorija;
  verovatnoca: number;
  uticaj: number;
  rizikSkor: number;
  mitigacija: string;
  datumProcene: string;
  status: ComplianceRizikStatus;
}

export interface DigitalnaIndustrijaComplianceRizikRezultat {
  status: 'aktivan';
  userId: string;
  timestamp: string;
  verzija: string;
  jurisdikcija: 'Republika Srbija';
  izvor: string;
  stavke: ComplianceRizikStavka[];
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

export function buildDigitalnaIndustrijaComplianceRizik(
  userId: string,
): DigitalnaIndustrijaComplianceRizikRezultat {
  const stavke: ComplianceRizikStavka[] = [
    {
      id: 'COM-2026-001',
      oblast: 'Neusklađenost regulatornih evidencija i internih kontrola',
      kategorija: 'regulatorna-uskladjenost',
      verovatnoca: 0.41,
      uticaj: 0.79,
      rizikSkor: 0.32,
      mitigacija: 'Mesečno usaglašavanje regulatornih evidencija i automatske kontrole procesa.',
      datumProcene: '2026-05-18',
      status: 'visok',
    },
    {
      id: 'COM-2026-002',
      oblast: 'Kašnjenje i propusti u compliance kontrolnim procedurama',
      kategorija: 'kontrolne-procedure',
      verovatnoca: 0.36,
      uticaj: 0.72,
      rizikSkor: 0.26,
      mitigacija: 'Compliance kalendar sa kontrolnim tačkama i dualnom proverom podataka.',
      datumProcene: '2026-05-18',
      status: 'umeren',
    },
    {
      id: 'COM-2026-003',
      oblast: 'Neadekvatna dokumentacija internih audit tragova',
      kategorija: 'interni-audit',
      verovatnoca: 0.29,
      uticaj: 0.88,
      rizikSkor: 0.26,
      mitigacija: 'Kvartalno osvežavanje audit dokumentacije i nezavisna verifikacija procedura.',
      datumProcene: '2026-05-18',
      status: 'umeren',
    },
    {
      id: 'COM-2026-004',
      oblast: 'Potencijalne regulatorne kazne i reputaciona šteta',
      kategorija: 'regulatorne-kazne',
      verovatnoca: 0.25,
      uticaj: 0.92,
      rizikSkor: 0.23,
      mitigacija: 'Rani warning sistem za compliance obaveze i proaktivna komunikacija sa nadležnim timovima.',
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
    izvor: 'Digitalna Industrija Compliance Rizik Kontroling',
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
