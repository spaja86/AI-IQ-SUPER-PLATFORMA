import { APP_VERSION } from './constants';

export type SajberRizikKategorija =
  | 'mrezna-bezbednost'
  | 'zastita-podataka'
  | 'upravljanje-pristupom'
  | 'incidentni-odgovor';

export type SajberRizikStatus = 'nizak' | 'umeren' | 'visok' | 'kritican';

export interface SajberRizikStavka {
  id: string;
  oblast: string;
  kategorija: SajberRizikKategorija;
  verovatnoca: number;
  uticaj: number;
  rizikSkor: number;
  mitigacija: string;
  datumProcene: string;
  status: SajberRizikStatus;
}

export interface DigitalnaIndustrijaSajberRizikRezultat {
  status: 'aktivan';
  userId: string;
  timestamp: string;
  verzija: string;
  jurisdikcija: 'Republika Srbija';
  izvor: string;
  stavke: SajberRizikStavka[];
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

export function buildDigitalnaIndustrijaSajberRizik(
  userId: string,
): DigitalnaIndustrijaSajberRizikRezultat {
  const stavke: SajberRizikStavka[] = [
    {
      id: 'CYB-2026-001',
      oblast: 'Izloženost mrežnih servisa DDoS i napadima na perimetar',
      kategorija: 'mrezna-bezbednost',
      verovatnoca: 0.44,
      uticaj: 0.86,
      rizikSkor: 0.38,
      mitigacija: 'Kontinuirani monitoring mrežnog saobraćaja i automatsko blokiranje sumnjivih obrazaca.',
      datumProcene: '2026-05-18',
      status: 'kritican',
    },
    {
      id: 'CYB-2026-002',
      oblast: 'Neadekvatna zaštita osetljivih podataka i slab data-loss nadzor',
      kategorija: 'zastita-podataka',
      verovatnoca: 0.39,
      uticaj: 0.74,
      rizikSkor: 0.29,
      mitigacija: 'Kriptovanje podataka u mirovanju i prenosu uz periodične DLP provere i revizije.',
      datumProcene: '2026-05-18',
      status: 'umeren',
    },
    {
      id: 'CYB-2026-003',
      oblast: 'Neadekvatna politika upravljanja privilegovanim pristupima i MFA kontrola',
      kategorija: 'upravljanje-pristupom',
      verovatnoca: 0.31,
      uticaj: 0.83,
      rizikSkor: 0.26,
      mitigacija: 'Kvartalna recertifikacija privilegovanih naloga i obavezni MFA za kritične sisteme.',
      datumProcene: '2026-05-18',
      status: 'umeren',
    },
    {
      id: 'CYB-2026-004',
      oblast: 'Nedovoljna spremnost na incidente i produžen oporavak kritičnih servisa',
      kategorija: 'incidentni-odgovor',
      verovatnoca: 0.33,
      uticaj: 0.78,
      rizikSkor: 0.26,
      mitigacija: 'Definisani playbook-ovi, redovne tabletop vežbe i automatizovan incident-response protokol.',
      datumProcene: '2026-05-18',
      status: 'visok',
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
    izvor: 'Digitalna Industrija Sajber Bezbednost Kontroling Centar',
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
