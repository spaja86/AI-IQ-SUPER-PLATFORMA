import { APP_VERSION } from './constants';

export type DiskriminacijaKategorija =
  | 'zaposljavanje-i-selekcija'
  | 'zarade-i-kompenzacije'
  | 'napredovanje-i-razvoj'
  | 'beneficije-i-uslovi-rada'
  | 'partnerski-odnosi'
  | 'ai-bias-i-automatizacija';

export type DiskriminacijaStatus = 'nizak' | 'umeren' | 'visok' | 'kritican';

export interface DiskriminacijaStavka {
  id: string;
  oblast: string;
  kategorija: DiskriminacijaKategorija;
  verovatnoca: number;
  uticaj: number;
  rizikSkor: number;
  mitigacija: string;
  datumProcene: string;
  status: DiskriminacijaStatus;
}

export interface DigitalnaIndustrijaDiskriminacijaRezultat {
  status: 'aktivan';
  userId: string;
  timestamp: string;
  verzija: string;
  jurisdikcija: 'Republika Srbija';
  izvor: string;
  stavke: DiskriminacijaStavka[];
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

export function buildDigitalnaIndustrijaDiskriminacija(
  userId: string,
): DigitalnaIndustrijaDiskriminacijaRezultat {
  const stavke: DiskriminacijaStavka[] = [
    {
      id: 'DIS-2026-001',
      oblast: 'Asimetrični kriterijumi u selekciji kandidata i shortlist procesu',
      kategorija: 'zaposljavanje-i-selekcija',
      verovatnoca: 0.39,
      uticaj: 0.84,
      rizikSkor: 0.33,
      mitigacija: 'Standardizovani hiring scorecard, dualna revizija odluka i obavezna evidencija razloga odbijanja.',
      datumProcene: '2026-05-28',
      status: 'visok',
    },
    {
      id: 'DIS-2026-002',
      oblast: 'Neusklađenost zarada, bonusa i equity paketa između uporedivih uloga',
      kategorija: 'zarade-i-kompenzacije',
      verovatnoca: 0.35,
      uticaj: 0.83,
      rizikSkor: 0.29,
      mitigacija: 'Kvartalni pay-equity pregled, jasno definisani platni razredi i eskalacija odstupanja HR/compliance timu.',
      datumProcene: '2026-05-28',
      status: 'umeren',
    },
    {
      id: 'DIS-2026-003',
      oblast: 'Neujednačen pristup napredovanju, mentorstvu i razvojnom budžetu',
      kategorija: 'napredovanje-i-razvoj',
      verovatnoca: 0.34,
      uticaj: 0.79,
      rizikSkor: 0.27,
      mitigacija: 'Matrica kompetencija, periodični promotion review i transparentni kriterijumi za razvoj i mentorstvo.',
      datumProcene: '2026-05-28',
      status: 'umeren',
    },
    {
      id: 'DIS-2026-004',
      oblast: 'Razlike u benefitima, fleksibilnosti rada i pristupu internim uslugama',
      kategorija: 'beneficije-i-uslovi-rada',
      verovatnoca: 0.3,
      uticaj: 0.74,
      rizikSkor: 0.22,
      mitigacija: 'Centralni katalog beneficija, audit pristupa pogodnostima i jednaki kriterijumi za fleksibilne modele rada.',
      datumProcene: '2026-05-28',
      status: 'nizak',
    },
    {
      id: 'DIS-2026-005',
      oblast: 'Diskriminatorni obrasci u odnosu prema partnerima, dobavljačima i korisnicima',
      kategorija: 'partnerski-odnosi',
      verovatnoca: 0.28,
      uticaj: 0.87,
      rizikSkor: 0.24,
      mitigacija: 'Code of conduct za partnere, obavezna evidencija pritužbi i reputaciono-pravna eskalacija slučajeva.',
      datumProcene: '2026-05-28',
      status: 'umeren',
    },
    {
      id: 'DIS-2026-006',
      oblast: 'Bias u AI modelima, scoring pravilima i automatizovanim workflow odlukama',
      kategorija: 'ai-bias-i-automatizacija',
      verovatnoca: 0.33,
      uticaj: 0.91,
      rizikSkor: 0.3,
      mitigacija: 'Bias test setovi, ljudska revizija visokorizičnih odluka i periodični audit automatizovanih pravila.',
      datumProcene: '2026-05-28',
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
    izvor: 'Digitalna Industrija Anti-Diskriminacija Kontroling Centar',
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
