import { APP_VERSION } from './constants';

export type KreditniRizikSegment = 'korporativni' | 'msp' | 'stanovnistvo' | 'institucionalni';
export type KreditniRizikStatus = 'aktivan' | 'kasnjenje' | 'restrukturiran';

export interface KreditnaIzlozenost {
  id: string;
  klijent: string;
  segment: KreditniRizikSegment;
  iznosRsd: number;
  rocnostMeseci: number;
  pdPct: number;
  lgdPct: number;
  kolateralPct: number;
  datumOdobrenja: string;
  datumDospeca: string;
  status: KreditniRizikStatus;
}

export interface DigitalnaIndustrijaKreditniRizikRezultat {
  status: 'aktivan';
  userId: string;
  timestamp: string;
  verzija: string;
  jurisdikcija: 'Republika Srbija';
  izvor: string;
  izlozenosti: KreditnaIzlozenost[];
  kpi: {
    ukupnoIzlozenosti: number;
    aktivnih: number;
    kasnjenje: number;
    restrukturiranih: number;
    ukupnaIzlozenostRsd: number;
    prosecniPdPct: number;
    prosecniLgdPct: number;
    pokrivenostKolateralomPct: number;
  };
}

export function buildDigitalnaIndustrijaKreditniRizik(
  userId: string,
): DigitalnaIndustrijaKreditniRizikRezultat {
  const izlozenosti: KreditnaIzlozenost[] = [
    {
      id: 'KRD-2026-001',
      klijent: 'Spaja Industrija Export',
      segment: 'korporativni',
      iznosRsd: 14_500_000,
      rocnostMeseci: 48,
      pdPct: 2.4,
      lgdPct: 36,
      kolateralPct: 72,
      datumOdobrenja: '2026-01-12',
      datumDospeca: '2030-01-12',
      status: 'aktivan',
    },
    {
      id: 'KRD-2026-002',
      klijent: 'Digitalna Fabrika Nova',
      segment: 'msp',
      iznosRsd: 6_200_000,
      rocnostMeseci: 36,
      pdPct: 3.8,
      lgdPct: 42,
      kolateralPct: 64,
      datumOdobrenja: '2026-02-01',
      datumDospeca: '2029-02-01',
      status: 'aktivan',
    },
    {
      id: 'KRD-2025-014',
      klijent: 'Inženjering Delta',
      segment: 'korporativni',
      iznosRsd: 9_000_000,
      rocnostMeseci: 60,
      pdPct: 5.1,
      lgdPct: 48,
      kolateralPct: 55,
      datumOdobrenja: '2025-06-15',
      datumDospeca: '2030-06-15',
      status: 'kasnjenje',
    },
    {
      id: 'KRD-2024-021',
      klijent: 'Tehno Servis Plus',
      segment: 'msp',
      iznosRsd: 3_800_000,
      rocnostMeseci: 30,
      pdPct: 4.6,
      lgdPct: 44,
      kolateralPct: 60,
      datumOdobrenja: '2024-10-01',
      datumDospeca: '2027-04-01',
      status: 'restrukturiran',
    },
  ];

  const aktivnih = izlozenosti.filter((i) => i.status === 'aktivan').length;
  const kasnjenje = izlozenosti.filter((i) => i.status === 'kasnjenje').length;
  const restrukturiranih = izlozenosti.filter((i) => i.status === 'restrukturiran').length;
  const ukupnaIzlozenostRsd = izlozenosti.reduce((sum, i) => sum + i.iznosRsd, 0);
  const prosecniPdPct =
    izlozenosti.reduce((sum, i) => sum + i.pdPct, 0) / Math.max(izlozenosti.length, 1);
  const prosecniLgdPct =
    izlozenosti.reduce((sum, i) => sum + i.lgdPct, 0) / Math.max(izlozenosti.length, 1);
  const pokrivenostKolateralomPct =
    izlozenosti.reduce((sum, i) => sum + i.kolateralPct, 0) / Math.max(izlozenosti.length, 1);

  return {
    status: 'aktivan',
    userId,
    timestamp: new Date().toISOString(),
    verzija: APP_VERSION,
    jurisdikcija: 'Republika Srbija',
    izvor: 'Digitalna Industrija Kreditni Rizik Kontroling',
    izlozenosti,
    kpi: {
      ukupnoIzlozenosti: izlozenosti.length,
      aktivnih,
      kasnjenje,
      restrukturiranih,
      ukupnaIzlozenostRsd,
      prosecniPdPct: Number(prosecniPdPct.toFixed(2)),
      prosecniLgdPct: Number(prosecniLgdPct.toFixed(2)),
      pokrivenostKolateralomPct: Number(pokrivenostKolateralomPct.toFixed(2)),
    },
  };
}
