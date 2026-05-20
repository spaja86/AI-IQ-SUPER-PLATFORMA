import { APP_VERSION } from './constants';

export type BeneficijaTip =
  | 'zdravstveno-osiguranje'
  | 'penzijsko-osiguranje'
  | 'godisnji-odmor'
  | 'slobodni-dani'
  | 'obuka-i-razvoj'
  | 'ostalo';

export interface BeneficijaStavka {
  id: string;
  naziv: string;
  tip: BeneficijaTip;
  opisPaketa: string;
  vrednostRsdGodisnje: number;
  brojKorisnika: number;
  ukupnoTrosak: number;
  pokrivenostPct: number;
  datumAzuriranja: string;
}

export interface DigitalnaIndustrijaBeneficijeRezultat {
  status: 'aktivan';
  userId: string;
  timestamp: string;
  verzija: string;
  jurisdikcija: 'Republika Srbija';
  izvor: string;
  beneficije: BeneficijaStavka[];
  kpi: {
    ukupnoBeneficija: number;
    ukupnoKorisnika: number;
    ukupnoTrosakRsd: number;
    prosecnaVrednostPoZaposlenomRsd: number;
    pokrivenostProsecanPct: number;
  };
}

export function buildDigitalnaIndustrijaBeneficije(
  userId: string,
): DigitalnaIndustrijaBeneficijeRezultat {
  const beneficije: BeneficijaStavka[] = [
    {
      id: 'BEN-2026-001',
      naziv: 'Privatno zdravstveno osiguranje',
      tip: 'zdravstveno-osiguranje',
      opisPaketa: 'Premijum zdravstveni paket sa stomatologijom i specijalistima',
      vrednostRsdGodisnje: 96_000,
      brojKorisnika: 9,
      ukupnoTrosak: 96_000 * 9,
      pokrivenostPct: 100,
      datumAzuriranja: '2026-05-19',
    },
    {
      id: 'BEN-2026-002',
      naziv: 'Dopunsko penzijsko osiguranje',
      tip: 'penzijsko-osiguranje',
      opisPaketa: 'Doprinos poslodavca 5% bruto zarade na mesečnom nivou',
      vrednostRsdGodisnje: 180_000,
      brojKorisnika: 9,
      ukupnoTrosak: 180_000 * 9,
      pokrivenostPct: 100,
      datumAzuriranja: '2026-05-19',
    },
    {
      id: 'BEN-2026-003',
      naziv: 'Prošireni godišnji odmor',
      tip: 'godisnji-odmor',
      opisPaketa: 'Do 30 dana plaćenog odmora godišnje (zakonski minimum + bonus dani)',
      vrednostRsdGodisnje: 48_000,
      brojKorisnika: 9,
      ukupnoTrosak: 48_000 * 9,
      pokrivenostPct: 100,
      datumAzuriranja: '2026-05-19',
    },
    {
      id: 'BEN-2026-004',
      naziv: 'Fleksibilni slobodni dani',
      tip: 'slobodni-dani',
      opisPaketa: '5 dodatnih slobodnih dana za lične potrebe i vanredne okolnosti',
      vrednostRsdGodisnje: 24_000,
      brojKorisnika: 9,
      ukupnoTrosak: 24_000 * 9,
      pokrivenostPct: 100,
      datumAzuriranja: '2026-05-19',
    },
    {
      id: 'BEN-2026-005',
      naziv: 'Budžet za obuke i sertifikate',
      tip: 'obuka-i-razvoj',
      opisPaketa: 'Godišnji budžet za tehničke sertifikate, kurseve i konferencije',
      vrednostRsdGodisnje: 60_000,
      brojKorisnika: 7,
      ukupnoTrosak: 60_000 * 7,
      pokrivenostPct: 78,
      datumAzuriranja: '2026-05-19',
    },
    {
      id: 'BEN-2026-006',
      naziv: 'Subvencija za prehranu',
      tip: 'ostalo',
      opisPaketa: 'Mesečni bon za obroke ili refundacija troškova ishrane',
      vrednostRsdGodisnje: 36_000,
      brojKorisnika: 9,
      ukupnoTrosak: 36_000 * 9,
      pokrivenostPct: 100,
      datumAzuriranja: '2026-05-19',
    },
  ];

  const ukupnoKorisnika = beneficije.reduce((sum, b) => sum + b.brojKorisnika, 0);
  const ukupnoTrosakRsd = beneficije.reduce((sum, b) => sum + b.ukupnoTrosak, 0);
  const prosecnaVrednostPoZaposlenomRsd =
    ukupnoTrosakRsd / Math.max(ukupnoKorisnika, 1);
  const pokrivenostProsecanPct =
    beneficije.reduce((sum, b) => sum + b.pokrivenostPct, 0) / beneficije.length;

  return {
    status: 'aktivan',
    userId,
    timestamp: new Date().toISOString(),
    verzija: APP_VERSION,
    jurisdikcija: 'Republika Srbija',
    izvor: 'Digitalna Industrija Beneficije Centar',
    beneficije,
    kpi: {
      ukupnoBeneficija: beneficije.length,
      ukupnoKorisnika,
      ukupnoTrosakRsd,
      prosecnaVrednostPoZaposlenomRsd: Number(prosecnaVrednostPoZaposlenomRsd.toFixed(2)),
      pokrivenostProsecanPct: Number(pokrivenostProsecanPct.toFixed(2)),
    },
  };
}
