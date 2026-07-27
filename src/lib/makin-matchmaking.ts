/**
 * MAKIN Matchmaking Engine
 *
 * Cross-dimenzionalni matchmaking sistem sa ELO rejting algoritmom.
 * Koristi se za sve dimenzionalne igrice koje podržavaju PvP.
 *
 * Algoritam:
 *   1. Igrač se dodaje u red čekanja (queue)
 *   2. Sistem traži protivnika: isti ELO ±150, ista dimenzija, isti igricaId
 *   3. Fallback posle 30s: širi ELO raspon ±300
 *   4. Timeout: 120s → status 'greska' + razlog 'timeout'
 *   5. Pobednik dobija ELO bodove po K-faktor 32 formuli
 *
 * Sinhronizacija:
 *   Queue je in-memory singleton (u produkciji zameni sa Redis/KV store)
 */

import type { DimenzijaNivo } from './dimenzije';

// ─── Tipovi ───────────────────────────────────────────────────────────────────

export type MatchmakingStatus = 'traženje' | 'pronađen' | 'u-igri' | 'završen' | 'greska';

export type MatchRezultat = 'pobeda' | 'poraz' | 'nerešeno';

export type RegionTip = 'eu-west' | 'us-east' | 'us-west' | 'ap-south' | 'ap-east' | 'global';

export interface MatchmakingIgrac {
  userId: string;
  elo: number;
  dimenzija: DimenzijaNivo;
  igricaId: string;
  timestamp: number;        // Unix ms — kada je ušao u red
  region: RegionTip;
  displayName?: string;
}

export interface MatchmakingKonfig {
  /** Maksimalna ELO razlika za match (inicijalna) */
  eloRasponInicijalni: number;
  /** Prošireni ELO raspon posle `eloProsirenjeNakonSekundi` sekundi */
  eloRasponProsireni: number;
  /** Sekunde posle kojih se proširuje ELO raspon */
  eloProsirenjeNakonSekundi: number;
  /** Maksimalno vreme čekanja u sekundama pre timeout greške */
  timeoutSekundi: number;
  /** Da li dimenzija mora biti ista za match */
  zahtevaIstuDimenziju: boolean;
}

export interface Match {
  id: string;
  igrac1: MatchmakingIgrac;
  igrac2: MatchmakingIgrac;
  igricaId: string;
  dimenzija: DimenzijaNivo;
  startAt: number;    // Unix ms
  endAt?: number;     // Unix ms — kada je završena
  status: MatchmakingStatus;
  rezultat?: { pobednik: string | null; bodovi: number };
}

export interface MatchmakingStavka {
  igrac: MatchmakingIgrac;
  status: MatchmakingStatus;
  matchId?: string;
  greska?: string;
  uRedOd: number;    // Unix ms
}

// ─── Podrazumevane konfiguracije po igrici ────────────────────────────────────

export const MATCHMAKING_KONFIG_PO_IGRICI: Record<string, MatchmakingKonfig> = {
  'igrica-makin': {
    eloRasponInicijalni: 150,
    eloRasponProsireni: 300,
    eloProsirenjeNakonSekundi: 30,
    timeoutSekundi: 120,
    zahtevaIstuDimenziju: true,
  },
  'igrica-dimenzionalna-arena': {
    eloRasponInicijalni: 200,
    eloRasponProsireni: 400,
    eloProsirenjeNakonSekundi: 20,
    timeoutSekundi: 90,
    zahtevaIstuDimenziju: false,
  },
  'igrica-omega-battle-royale': {
    eloRasponInicijalni: 300,
    eloRasponProsireni: 600,
    eloProsirenjeNakonSekundi: 15,
    timeoutSekundi: 60,
    zahtevaIstuDimenziju: false,
  },
  'igrica-dimenzionalni-fudbal': {
    eloRasponInicijalni: 150,
    eloRasponProsireni: 350,
    eloProsirenjeNakonSekundi: 25,
    timeoutSekundi: 90,
    zahtevaIstuDimenziju: true,
  },
};

export const MATCHMAKING_KONFIG_PODRAZUMEVANO: MatchmakingKonfig = {
  eloRasponInicijalni: 200,
  eloRasponProsireni: 500,
  eloProsirenjeNakonSekundi: 30,
  timeoutSekundi: 120,
  zahtevaIstuDimenziju: false,
};

// ─── In-memory Queue (singleton) ─────────────────────────────────────────────

const queue = new Map<string, MatchmakingStavka>();
const matchovi = new Map<string, Match>();

// ─── ELO Kalkulator ───────────────────────────────────────────────────────────

const ELO_K_FAKTOR = 32;
const ELO_POCETNI = 1000;

/**
 * Izračunava novi ELO rejting oba igrača.
 * @param eloIgrac1 - trenutni ELO igrača 1
 * @param eloIgrac2 - trenutni ELO igrača 2
 * @param rezultatIgrac1 - 1 = pobeda, 0.5 = nerešeno, 0 = poraz
 * @returns novi ELO za oba igrača
 */
export function izracunajNoviElo(
  eloIgrac1: number,
  eloIgrac2: number,
  rezultatIgrac1: 0 | 0.5 | 1,
): { noviElo1: number; noviElo2: number; promena1: number; promena2: number } {
  const ocekivano1 = 1 / (1 + Math.pow(10, (eloIgrac2 - eloIgrac1) / 400));
  const ocekivano2 = 1 - ocekivano1;
  const rezultatIgrac2 = 1 - rezultatIgrac1;

  const promena1 = Math.round(ELO_K_FAKTOR * (rezultatIgrac1 - ocekivano1));
  const promena2 = Math.round(ELO_K_FAKTOR * (rezultatIgrac2 - ocekivano2));

  return {
    noviElo1: Math.max(100, eloIgrac1 + promena1),
    noviElo2: Math.max(100, eloIgrac2 + promena2),
    promena1,
    promena2,
  };
}

/** Vraća inicijalni ELO za novog igrača */
export function pocetniElo(): number {
  return ELO_POCETNI;
}

// ─── Queue Menadžment ─────────────────────────────────────────────────────────

/**
 * Dodaje igrača u red čekanja za matchmaking.
 * Ako je igrač već u redu, ažurira njegovu stavku.
 */
export function dodajURedCekanja(igrac: MatchmakingIgrac): MatchmakingStavka {
  const stavka: MatchmakingStavka = {
    igrac,
    status: 'traženje',
    uRedOd: Date.now(),
  };
  queue.set(igrac.userId, stavka);
  return stavka;
}

/**
 * Uklanja igrača iz reda čekanja.
 * Vraća true ako je igrač bio u redu.
 */
export function ukloniIzRedaCekanja(userId: string): boolean {
  return queue.delete(userId);
}

/**
 * Vraća trenutni status matchmaking-a za datog korisnika.
 */
export function statusMatchmaking(userId: string): MatchmakingStavka | null {
  return queue.get(userId) ?? null;
}

/**
 * Vraća sve igrače koji trenutno čekaju u redu za datu igricu.
 */
export function getQueueZaIgricu(igricaId: string): MatchmakingStavka[] {
  return Array.from(queue.values()).filter(
    (s) => s.igrac.igricaId === igricaId && s.status === 'traženje',
  );
}

// ─── Match algoritam ─────────────────────────────────────────────────────────

/**
 * Pokušava da pronađe odgovarajući match za datog igrača u queue-u.
 *
 * Algoritam:
 *  1. Filtrira po igricaId (oba moraju igrati istu igricu)
 *  2. Ako je konfig.zahtevaIstuDimenziju = true, filtrira i po dimenziji
 *  3. Kalkuliše ELO raspon (inicijalni ili prošireni zavisno od čekanja)
 *  4. Birа najbliži ELO match
 *  5. Ako niko nije pronađen → timeout provera
 */
export function pronadjiMatch(
  igrac: MatchmakingIgrac,
  konfig?: MatchmakingKonfig,
): Match | null {
  const k = konfig ?? MATCHMAKING_KONFIG_PODRAZUMEVANO;
  const stavkaIgraca = queue.get(igrac.userId);
  if (!stavkaIgraca) return null;

  const cekanjeSekundi = (Date.now() - stavkaIgraca.uRedOd) / 1000;

  // Timeout provera
  if (cekanjeSekundi > k.timeoutSekundi) {
    stavkaIgraca.status = 'greska';
    stavkaIgraca.greska = 'timeout';
    queue.set(igrac.userId, stavkaIgraca);
    return null;
  }

  // Izračunaj aktuelni ELO raspon
  const eloRaspon = cekanjeSekundi > k.eloProsirenjeNakonSekundi
    ? k.eloRasponProsireni
    : k.eloRasponInicijalni;

  // Pronađi kandidate
  const kandidati = Array.from(queue.values()).filter((s) => {
    if (s.igrac.userId === igrac.userId) return false;
    if (s.status !== 'traženje') return false;
    if (s.igrac.igricaId !== igrac.igricaId) return false;
    if (k.zahtevaIstuDimenziju && s.igrac.dimenzija !== igrac.dimenzija) return false;
    const eloDiff = Math.abs(s.igrac.elo - igrac.elo);
    return eloDiff <= eloRaspon;
  });

  if (kandidati.length === 0) return null;

  // Sortiranje po ELO blizini (najbliži ELO prvi)
  kandidati.sort((a, b) =>
    Math.abs(a.igrac.elo - igrac.elo) - Math.abs(b.igrac.elo - igrac.elo),
  );

  const protivnik = kandidati[0];
  const match = kreirajMatch(igrac, protivnik.igrac);

  // Ažuriraj oboje u queue-u
  const stavkaIgrac1 = queue.get(igrac.userId);
  const stavkaIgrac2 = queue.get(protivnik.igrac.userId);
  if (stavkaIgrac1) {
    stavkaIgrac1.status = 'pronađen';
    stavkaIgrac1.matchId = match.id;
    queue.set(igrac.userId, stavkaIgrac1);
  }
  if (stavkaIgrac2) {
    stavkaIgrac2.status = 'pronađen';
    stavkaIgrac2.matchId = match.id;
    queue.set(protivnik.igrac.userId, stavkaIgrac2);
  }

  matchovi.set(match.id, match);
  return match;
}

/**
 * Kreira novi Match objekat za dva igrača.
 * Dimenzija se uzima od igrača 1 (inicijatora searcha).
 */
export function kreirajMatch(igrac1: MatchmakingIgrac, igrac2: MatchmakingIgrac): Match {
  const id = `match-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return {
    id,
    igrac1,
    igrac2,
    igricaId: igrac1.igricaId,
    dimenzija: igrac1.dimenzija,
    startAt: Date.now(),
    status: 'u-igri',
  };
}

/**
 * Završava match i uklanja oba igrača iz queue-a.
 */
export function završiMatch(
  matchId: string,
  pobednikUserId: string | null,
): Match | null {
  const match = matchovi.get(matchId);
  if (!match) return null;

  match.status = 'završen';
  match.endAt = Date.now();
  match.rezultat = {
    pobednik: pobednikUserId,
    bodovi: pobednikUserId ? 500 : 100,
  };

  // Ukloni iz queue-a
  queue.delete(match.igrac1.userId);
  queue.delete(match.igrac2.userId);

  matchovi.set(matchId, match);
  return match;
}

/**
 * Vraća match po ID-u.
 */
export function getMatch(matchId: string): Match | null {
  return matchovi.get(matchId) ?? null;
}

// ─── Statistike ───────────────────────────────────────────────────────────────

export interface MatchmakingStatistike {
  ukupnoURedu: number;
  poIgrici: Record<string, number>;
  prosecnoElo: number;
  ukupnoMatchova: number;
  aktivniMatchovi: number;
}

/** Vraća trenutne statistike matchmaking sistema */
export function getMatchmakingStatistike(): MatchmakingStatistike {
  const stavke = Array.from(queue.values());
  const poIgrici: Record<string, number> = {};
  let sumaElo = 0;

  for (const s of stavke) {
    poIgrici[s.igrac.igricaId] = (poIgrici[s.igrac.igricaId] ?? 0) + 1;
    sumaElo += s.igrac.elo;
  }

  const aktivniMatchovi = Array.from(matchovi.values()).filter(
    (m) => m.status === 'u-igri',
  ).length;

  return {
    ukupnoURedu: stavke.length,
    poIgrici,
    prosecnoElo: stavke.length > 0 ? Math.round(sumaElo / stavke.length) : ELO_POCETNI,
    ukupnoMatchova: matchovi.size,
    aktivniMatchovi,
  };
}
