/**
 * Tipovi za Omega Evolucioni Motor
 *
 * Definicije za autonomnu evoluciju platforme:
 * - Dijagnostički ciklus
 * - Evolucionu akciju
 * - Evolucioni izveštaj
 */

export type EvolucijaPrioritet = 'kritican' | 'visok' | 'srednji' | 'nizak';
export type EvolucijaTip = 'popravka' | 'optimizacija' | 'nadogradnja' | 'nova-funkcija' | 'bezbednost';
export type EvolucijaCiklusStatus = 'zakazan' | 'aktivan' | 'zavrsen' | 'neuspesan';

export interface EvolucijaCiklus {
  id: string;
  pocetak: string;
  zavrsetak: string | null;
  status: EvolucijaCiklusStatus;
  dijagnostika: EvolucijaDijagnostika;
  akcije: EvolucijskaAkcija[];
  verzija: string;
}

export interface EvolucijaDijagnostika {
  zdravlje: number;              // 0-100
  ukupnoProvera: number;
  uspesnih: number;
  upozorenja: number;
  gresaka: number;
  kriticnih: number;
  preporuke: EvolucijskaPreporuka[];
}

export interface EvolucijskaPreporuka {
  id: string;
  naslov: string;
  opis: string;
  tip: EvolucijaTip;
  prioritet: EvolucijaPrioritet;
  persona: string;               // ID omega persone odgovorne za ovo
  procenjeniNapor: 'minimalan' | 'umeren' | 'znacajan';
  githubIssueNaslov: string;     // predlog za GitHub Issue
  githubIssueTelo: string;       // predlog za Issue body
}

export interface EvolucijskaAkcija {
  id: string;
  preporukaId: string;
  tip: EvolucijaTip;
  status: 'kreirana' | 'u_toku' | 'zavrsena' | 'neuspesna';
  githubIssueId?: number;
  githubPrId?: number;
  timestamp: string;
}

export interface EvolucijskaIstorija {
  ciklusi: EvolucijaCiklus[];
  ukupnoCiklusa: number;
  uspesnihCiklusa: number;
  ukupnoAkcija: number;
  uspesnihAkcija: number;
  poslednjiCiklus: string | null;
  sledeciCiklus: string | null;
}

export interface EvolucijskaKonfiguracija {
  cronInterval: string;          // cron izraz
  maxIssuePoDanu: number;        // ograničenje issue-a po danu
  autoMerge: boolean;            // da li automatski merge-ovati
  graneZaSinhronizaciju: string[];
  aktivnePersone: string[];      // ID-jevi persona koje učestvuju
}
