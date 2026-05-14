/**
 * 🌊 LAUCENTRICNI SPEKTAR
 *
 * Spektralna analiza laucentričnog sistema — frekvencijsko razlaganje
 * četiri koncentrična sloja oko laureatskog centra u harmoničke komponente.
 *
 * Model:
 *   SpektralniSloj — svaki od 4 laucentrična sloja razložen u:
 *     - harmoničke frekvencije (H_k = snaga × radijus^k)
 *     - spektralnu gustinu (gustina_k = harmonik / ukupniHarmonik)
 *     - fazni pomak (φ_k = 2π × nivo / 4)
 *
 *   Rezonancni koeficijent ∈ [0, 1] — mera harmonične koherentnosti sistema
 *
 *   Laureatski harmonik — fundamentalna frekvencija laureatskog centra:
 *     f₀ = ukupnaSnaga / (2π × laureatskiRadijus)
 *
 * Gradi se nad LaucentricniSistem iz oktavni-monolog.ts i DIGATALNA EUREKA.
 *
 * Autofinish #1234
 */

import { getOktavniMonolog } from './oktavni-monolog';
import { buildDigatalnaEureka } from './digatalna-eureka';
import type { LaucentricniSloj } from './oktavni-monolog';

// ── Tipovi ────────────────────────────────────────────────────────────────────

export interface SpektralniHarmonik {
  /** Redni broj harmonika (k = 1..4) */
  k: number;
  /** Harmonička frekvencija H_k = snaga × radijus^k */
  frekvencija: number;
  /** Spektralna gustina — doprinos harmonika ukupnom spektru */
  gustina: number;
  /** Fazni pomak φ_k = 2π × k / 4 */
  fazniPomak: number;
  /** Amplituda — kvadratni koren harmonika */
  amplituda: number;
}

export interface SpektralniSloj {
  /** Nivo sloja (1–4) */
  nivo: number;
  /** Naziv sloja */
  naziv: string;
  /** Oktave u sloju */
  oktave: number[];
  /** Snaga sloja */
  snaga: number;
  /** Radijus sloja */
  radijus: number;
  /** Gustina sloja (persone / oktave) */
  gustina: number;
  /** Harmoničke komponente sloja */
  harmonici: SpektralniHarmonik[];
  /** Dominantni harmonik (k sa max frekvencijom) */
  dominantniHarmonik: number;
  /** Ukupna spektralna snaga sloja */
  ukupnaSpektralnaSnaga: number;
  /** Rezonancni indeks sloja ∈ [0, 1] */
  rezonancniIndeks: number;
}

export interface LaucentricniSpektarRezultat {
  /** Spektralni slojevi — 4 laucentrična sloja sa harmoničkim komponentama */
  spektralniSlojevi: SpektralniSloj[];
  /** Rezonancni koeficijent ∈ [0, 1] — mera harmonične koherentnosti sistema */
  rezonancniKoeficijent: number;
  /** Laureatski harmonik — fundamentalna frekvencija centra */
  laureatskiHarmonik: number;
  /** Spektralna gustina sistema — prosečna gustina svih slojeva */
  spektralnaGustina: number;
  /** Ukupna spektralna snaga sistema */
  ukupnaSpektralnaSnaga: number;
  /** Eureka sinergija — rezonancni koeficijent × eureka koeficijent */
  eurekaSinergija: number;
  /** Status */
  status: 'aktivan';
  /** ID korisnika */
  userId: string;
  /** ISO timestamp */
  timestamp: string;
}

// ── Računanje SpektralniSloj ──────────────────────────────────────────────────

function izracunajSpektralniSloj(sloj: LaucentricniSloj): SpektralniSloj {
  const harmonici: SpektralniHarmonik[] = [];

  // Izračunaj 4 harmonika za svaki sloj
  for (let k = 1; k <= 4; k++) {
    const frekvencija = Math.round(sloj.snaga * Math.pow(sloj.radijus, k) * 10000) / 10000;
    const fazniPomak = Math.round((2 * Math.PI * k) / 4 * 10000) / 10000;
    const amplituda = Math.round(Math.sqrt(Math.abs(frekvencija)) * 10000) / 10000;

    harmonici.push({
      k,
      frekvencija,
      gustina: 0, // popunjava se posle normalizacije
      fazniPomak,
      amplituda,
    });
  }

  // Normalizuj gustinu
  const ukupnaSpektralnaSnaga = harmonici.reduce((s, h) => s + h.frekvencija, 0);
  for (const h of harmonici) {
    h.gustina = ukupnaSpektralnaSnaga > 0
      ? Math.round((h.frekvencija / ukupnaSpektralnaSnaga) * 10000) / 10000
      : 0;
  }

  // Dominantni harmonik
  const dominantniHarmonik = harmonici.reduce(
    (best, h) => (h.frekvencija > best.frekvencija ? h : best),
    harmonici[0],
  ).k;

  // Rezonancni indeks: koliko je snaga homogeno raspoređena kroz harmonike
  // Maksimalna entropija je log2(4) ≈ 2 (uniformna distribucija)
  const entropija = harmonici.reduce((s, h) => {
    if (h.gustina <= 0) return s;
    return s - h.gustina * Math.log2(h.gustina);
  }, 0);
  const maxEntropija = Math.log2(4);
  const rezonancniIndeks = maxEntropija > 0
    ? Math.round((entropija / maxEntropija) * 10000) / 10000
    : 0;

  return {
    nivo: sloj.nivo,
    naziv: sloj.naziv,
    oktave: [...sloj.oktave],
    snaga: sloj.snaga,
    radijus: sloj.radijus,
    gustina: sloj.gustina,
    harmonici,
    dominantniHarmonik,
    ukupnaSpektralnaSnaga: Math.round(ukupnaSpektralnaSnaga * 10000) / 10000,
    rezonancniIndeks: Math.min(1, Math.max(0, rezonancniIndeks)),
  };
}

// ── Glavna builder funkcija ───────────────────────────────────────────────────

export function buildLaucentricniSpektar(userId: string): LaucentricniSpektarRezultat {
  const monolog = getOktavniMonolog();
  const eureka = buildDigatalnaEureka(userId);
  const lauSistem = monolog.laucentricniSistem;

  // Spektralni slojevi
  const spektralniSlojevi = lauSistem.slojevi.map(izracunajSpektralniSloj);

  // Ukupna spektralna snaga
  const ukupnaSpektralnaSnaga = Math.round(
    spektralniSlojevi.reduce((s, sl) => s + sl.ukupnaSpektralnaSnaga, 0) * 10000,
  ) / 10000;

  // Spektralna gustina sistema — prosek rezonancnih indeksa
  const spektralnaGustina = Math.round(
    spektralniSlojevi.reduce((s, sl) => s + sl.rezonancniIndeks, 0) / spektralniSlojevi.length * 10000,
  ) / 10000;

  // Laureatski harmonik — fundamentalna frekvencija centra
  // f₀ = ukupnaSnaga / (2π × radijus_centra)  (radijus centra = 0, koristimo 0.25 = 1/4)
  const laureatskiRadijus = 0.25;
  const laureatskiHarmonik = Math.round(
    lauSistem.laureatskiCentar.snaga / (2 * Math.PI * laureatskiRadijus) * 100,
  ) / 100;

  // Rezonancni koeficijent — prosek svih rezonancnih indeksa, ponderisan snagom
  const ukupnaSnagaSistema = lauSistem.ukupnaSnaga;
  const rezonancniKoeficijent = ukupnaSnagaSistema > 0
    ? Math.round(
      spektralniSlojevi.reduce((s, sl) => s + sl.rezonancniIndeks * (sl.snaga / ukupnaSnagaSistema), 0) * 10000,
    ) / 10000
    : 0;

  // Eureka sinergija — kombinacija rezonancnog koeficijenta i eureka koeficijenta
  const eurekaSinergija = Math.round(
    (rezonancniKoeficijent * 0.5 + eureka.eurekaKoeficijent * 0.5) * 10000,
  ) / 10000;

  return {
    spektralniSlojevi,
    rezonancniKoeficijent: Math.min(1, Math.max(0, rezonancniKoeficijent)),
    laureatskiHarmonik,
    spektralnaGustina: Math.min(1, Math.max(0, spektralnaGustina)),
    ukupnaSpektralnaSnaga,
    eurekaSinergija: Math.min(1, Math.max(0, eurekaSinergija)),
    status: 'aktivan',
    userId,
    timestamp: new Date().toISOString(),
  };
}
