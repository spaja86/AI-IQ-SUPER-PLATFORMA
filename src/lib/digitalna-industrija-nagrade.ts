import { APP_VERSION } from './constants';

export type NagradaTip =
  | 'godisnja-premija'
  | 'kvartal-bonus'
  | 'projekat-bonus'
  | 'performans-bonus'
  | 'referalni-bonus'
  | 'jubilarna-nagrada'
  | 'ostalo';

export interface NagradaStavka {
  id: string;
  naziv: string;
  tip: NagradaTip;
  opisKriterijuma: string;
  vrednostRsd: number;
  brojKorisnika: number;
  ukupnoIsplaceno: number;
  frekvencija: 'mesecno' | 'kvartal' | 'godisnje' | 'jednokratno';
  datumIsplate: string;
}

export interface DigitalnaIndustrijaNagradeRezultat {
  status: 'aktivan';
  userId: string;
  timestamp: string;
  verzija: string;
  jurisdikcija: 'Republika Srbija';
  izvor: string;
  nagrade: NagradaStavka[];
  kpi: {
    ukupnoNagrada: number;
    ukupnoKorisnika: number;
    ukupnoIsplacenoRsd: number;
    prosecnaVrednostPoZaposlenomRsd: number;
    ucesce: number;
  };
}

export function buildDigitalnaIndustrijaNagrade(
  userId: string,
): DigitalnaIndustrijaNagradeRezultat {
  const nagrade: NagradaStavka[] = [
    {
      id: 'NAG-2026-001',
      naziv: 'Godišnja premija za performanse',
      tip: 'godisnja-premija',
      opisKriterijuma: 'Isplata do 15% bruto godišnje zarade na osnovu ostvarenih ciljeva',
      vrednostRsd: 240_000,
      brojKorisnika: 7,
      ukupnoIsplaceno: 240_000 * 7,
      frekvencija: 'godisnje',
      datumIsplate: '2026-01-31',
    },
    {
      id: 'NAG-2026-002',
      naziv: 'Kvartal bonus Q1 2026',
      tip: 'kvartal-bonus',
      opisKriterijuma: 'Bonus za ostvarivanje kvartalnih KPI ciljeva u Q1 2026',
      vrednostRsd: 60_000,
      brojKorisnika: 6,
      ukupnoIsplaceno: 60_000 * 6,
      frekvencija: 'kvartal',
      datumIsplate: '2026-04-15',
    },
    {
      id: 'NAG-2026-003',
      naziv: 'Projekat bonus — Digitalna Platforma',
      tip: 'projekat-bonus',
      opisKriterijuma: 'Jednokratna nagrada za uspešnu isporuku Digitalne Platforme u roku',
      vrednostRsd: 120_000,
      brojKorisnika: 5,
      ukupnoIsplaceno: 120_000 * 5,
      frekvencija: 'jednokratno',
      datumIsplate: '2026-03-01',
    },
    {
      id: 'NAG-2026-004',
      naziv: 'Performans bonus — AI modul',
      tip: 'performans-bonus',
      opisKriterijuma: 'Mesečna nagrada za 360° performans ocenu iznad 4.5/5',
      vrednostRsd: 30_000,
      brojKorisnika: 4,
      ukupnoIsplaceno: 30_000 * 4,
      frekvencija: 'mesecno',
      datumIsplate: '2026-05-01',
    },
    {
      id: 'NAG-2026-005',
      naziv: 'Referalni bonus',
      tip: 'referalni-bonus',
      opisKriterijuma: 'Nagrada za uspešno preporuku novog zaposlenog koji je prošao probni period',
      vrednostRsd: 50_000,
      brojKorisnika: 2,
      ukupnoIsplaceno: 50_000 * 2,
      frekvencija: 'jednokratno',
      datumIsplate: '2026-04-01',
    },
    {
      id: 'NAG-2026-006',
      naziv: 'Jubilarna nagrada — 5 godina',
      tip: 'jubilarna-nagrada',
      opisKriterijuma: 'Jednokratna nagrada za 5 godina staža u kompaniji',
      vrednostRsd: 100_000,
      brojKorisnika: 1,
      ukupnoIsplaceno: 100_000 * 1,
      frekvencija: 'jednokratno',
      datumIsplate: '2026-02-14',
    },
  ];

  const ukupnoKorisnika = nagrade.reduce((sum, n) => sum + n.brojKorisnika, 0);
  const ukupnoIsplacenoRsd = nagrade.reduce((sum, n) => sum + n.ukupnoIsplaceno, 0);
  const prosecnaVrednostPoZaposlenomRsd =
    ukupnoIsplacenoRsd / Math.max(ukupnoKorisnika, 1);
  const ucesce = Number(((ukupnoKorisnika / 9) * 100).toFixed(2));

  return {
    status: 'aktivan',
    userId,
    timestamp: new Date().toISOString(),
    verzija: APP_VERSION,
    jurisdikcija: 'Republika Srbija',
    izvor: 'Digitalna Industrija Nagrade Centar',
    nagrade,
    kpi: {
      ukupnoNagrada: nagrade.length,
      ukupnoKorisnika,
      ukupnoIsplacenoRsd,
      prosecnaVrednostPoZaposlenomRsd: Number(prosecnaVrednostPoZaposlenomRsd.toFixed(2)),
      ucesce,
    },
  };
}
