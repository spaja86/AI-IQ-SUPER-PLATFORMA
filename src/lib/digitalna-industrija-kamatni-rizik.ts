import { APP_VERSION } from './constants';

export type KamatniRizikTip = 'fiksna' | 'varijabilna' | 'mesovita';
export type KamatniRizikStatus = 'aktivan' | 'zatvoren' | 'u-restrukturiranju';

export interface KamatniRizikPozicija {
  id: string;
  instrument: string;
  tip: KamatniRizikTip;
  nominalnaVrednostRsd: number;
  kamatnaStopaGodisnjaPct: number;
  referentnaStopa: string;
  datumPocetka: string;
  datumDospeca: string;
  trajanjeMeseci: number;
  status: KamatniRizikStatus;
  dur01Rsd: number;
}

export interface DigitalnaIndustrijaKamatniRizikRezultat {
  status: 'aktivan';
  userId: string;
  timestamp: string;
  verzija: string;
  jurisdikcija: 'Republika Srbija';
  izvor: string;
  pozicije: KamatniRizikPozicija[];
  kpi: {
    ukupnoPozicija: number;
    aktivnih: number;
    zatvorenih: number;
    uRestrukturiranju: number;
    ukupnoNominalnaRsd: number;
    prosecnaKamatnaStopaGodisnjaPct: number;
    ukupnoDur01Rsd: number;
  };
}

export function buildDigitalnaIndustrijaKamatniRizik(
  userId: string,
): DigitalnaIndustrijaKamatniRizikRezultat {
  const pozicije: KamatniRizikPozicija[] = [
    {
      id: 'KR-2026-001',
      instrument: 'Obveznička emisija A',
      tip: 'fiksna',
      nominalnaVrednostRsd: 12_000_000,
      kamatnaStopaGodisnjaPct: 6.25,
      referentnaStopa: 'NBS repo stopa',
      datumPocetka: '2026-01-10',
      datumDospeca: '2029-01-10',
      trajanjeMeseci: 36,
      status: 'aktivan',
      dur01Rsd: 34_200,
    },
    {
      id: 'KR-2026-002',
      instrument: 'Kredit ERSTE — varijabilni',
      tip: 'varijabilna',
      nominalnaVrednostRsd: 8_400_000,
      kamatnaStopaGodisnjaPct: 4.75,
      referentnaStopa: 'EURIBOR 3M + 1.20%',
      datumPocetka: '2026-02-15',
      datumDospeca: '2028-02-15',
      trajanjeMeseci: 24,
      status: 'aktivan',
      dur01Rsd: 18_060,
    },
    {
      id: 'KR-2025-008',
      instrument: 'Lizing oprema B',
      tip: 'fiksna',
      nominalnaVrednostRsd: 3_600_000,
      kamatnaStopaGodisnjaPct: 7.10,
      referentnaStopa: 'fiksna',
      datumPocetka: '2025-07-01',
      datumDospeca: '2027-07-01',
      trajanjeMeseci: 24,
      status: 'aktivan',
      dur01Rsd: 8_640,
    },
    {
      id: 'KR-2026-003',
      instrument: 'Obveznica mešovita C',
      tip: 'mesovita',
      nominalnaVrednostRsd: 5_200_000,
      kamatnaStopaGodisnjaPct: 5.50,
      referentnaStopa: 'BELIBOR 6M + 0.80%',
      datumPocetka: '2026-03-01',
      datumDospeca: '2031-03-01',
      trajanjeMeseci: 60,
      status: 'aktivan',
      dur01Rsd: 24_960,
    },
    {
      id: 'KR-2024-015',
      instrument: 'Stari kredit D',
      tip: 'varijabilna',
      nominalnaVrednostRsd: 2_000_000,
      kamatnaStopaGodisnjaPct: 3.90,
      referentnaStopa: 'EURIBOR 6M + 0.95%',
      datumPocetka: '2024-01-01',
      datumDospeca: '2026-01-01',
      trajanjeMeseci: 24,
      status: 'zatvoren',
      dur01Rsd: 0,
    },
  ];

  const aktivnih = pozicije.filter((p) => p.status === 'aktivan').length;
  const zatvorenih = pozicije.filter((p) => p.status === 'zatvoren').length;
  const uRestrukturiranju = pozicije.filter((p) => p.status === 'u-restrukturiranju').length;
  const ukupnoNominalnaRsd = pozicije.reduce((sum, p) => sum + p.nominalnaVrednostRsd, 0);
  const aktivnePozicije = pozicije.filter((p) => p.status === 'aktivan');
  const prosecnaKamatnaStopaGodisnjaPct =
    aktivnePozicije.length > 0
      ? aktivnePozicije.reduce((sum, p) => sum + p.kamatnaStopaGodisnjaPct, 0) /
        aktivnePozicije.length
      : 0;
  const ukupnoDur01Rsd = pozicije.reduce((sum, p) => sum + p.dur01Rsd, 0);

  return {
    status: 'aktivan',
    userId,
    timestamp: new Date().toISOString(),
    verzija: APP_VERSION,
    jurisdikcija: 'Republika Srbija',
    izvor: 'Digitalna Industrija Kamatni Rizik Kontroling',
    pozicije,
    kpi: {
      ukupnoPozicija: pozicije.length,
      aktivnih,
      zatvorenih,
      uRestrukturiranju,
      ukupnoNominalnaRsd,
      prosecnaKamatnaStopaGodisnjaPct: Number(prosecnaKamatnaStopaGodisnjaPct.toFixed(2)),
      ukupnoDur01Rsd,
    },
  };
}
