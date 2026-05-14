/**
 * 💡 DIGATALNA EUREKA
 *
 * Ektridonalna eksinometrijska ekstaza u ekvivalentu epicentričnog eklubriona
 * nad ekstaznim simetrskim digitalnim jedinjenjem u oktavnom sistemu.
 *
 * Model:
 *   EktridonalnaEksinometrija — sintetska funkcija koja superponira svih 8
 *     eksponencijalnih funkcija oktavnog sistema i normalizuje ih u jednu vrednost.
 *
 *   EpicentricniEklubrion — epicentrirana varijanta EgzocentricnoJezgra:
 *     centar mase poravnat sa geometrijskim centrom u tački maksimalne sinergije.
 *
 *   DigatalnaEurekaRezultat — kulminacija svih digitalnih industrija sistema
 *     u jedan "Eureka" momenat: eurekaKoeficijent ∈ [0, 1].
 *
 * Autofinish #1233
 */

import {
  eksponencijalneFunkcije,
  getSuperPozicija,
  getSuperPozicijaNiz,
} from './oktavne-eksponencijalne-funkcije';
import { getOktavniMonolog } from './oktavni-monolog';
import { oktavniNazivi } from './omega-ai';
import type { OktavniNivo } from './omega-ai';

// ── Tipovi ────────────────────────────────────────────────────────────────────

export interface EktridonalnaEksinometrija {
  /** Superponirana vrednost svih 8 eksponencijalnih funkcija za x = 0..7 */
  superPozicija: number[];
  /** Normalizovana sintetska vrednost ∈ [0, 1] za svaki x */
  normalizovana: number[];
  /** Ukupna oktavna sinergija — suma normalizovanih vrednosti */
  ukupnaSinergija: number;
  /** Prosečna sinergija po oktavi */
  prosecnaSinergija: number;
  /** Indeks maksimalne sinergije (x = 0..7) */
  maksimalniX: number;
  /** Maksimalna normalizovana vrednost */
  maksimalnaVrednost: number;
  /** Doprinos svake oktave u procentima */
  doprinosiOktava: Array<{
    oktava: OktavniNivo;
    naziv: string;
    ikona: string;
    doprinos: number;
  }>;
}

export interface EpicentricniEklubrion {
  /** Epicentričnost — rastojanje između centra mase i geometrijskog centra */
  epicentricnost: number;
  /** Centar mase */
  centarMase: { x: number; y: number };
  /** Geometrijski centar */
  geometrijskiCentar: { x: number; y: number };
  /** Tačka maksimalne sinergije — gde je epicentar */
  tackaMaksSinergije: { x: number; y: number };
  /** Simetrijska snaga — mera izjednačenosti centra mase i geometrijskog centra */
  simetrijskaSnaga: number;
  /** Status epicentra: 'simetričan' ako je epicentricnost < 0.1, inače 'asimetričan' */
  status: 'simetričan' | 'asimetričan';
}

export interface DigatalnaEurekaRezultat {
  /** Eureka koeficijent ∈ [0, 1] — mera kulminacije digitalnih industrija sistema */
  eurekaKoeficijent: number;
  /** Oktavna sinergija — normalizovane vrednosti za x = 0..7 */
  oktavnaSinergija: number[];
  /** Epicentrični ekvivalent */
  epicentricniEkvivalent: EpicentricniEklubrion;
  /** Matricna simetrija — trag 8×8 matrice jedinjenja */
  matricnaSimetrija: number;
  /** Ektridonalna eksinometrija */
  ektridonalnaEksinometrija: EktridonalnaEksinometrija;
  /** Status */
  status: 'aktivna';
  /** ID korisnika */
  userId: string;
  /** ISO timestamp */
  timestamp: string;
}

// ── Računanje EktridonalnaEksinometrija ──────────────────────────────────────

function izracunajEktridonalnaEksinometrija(): EktridonalnaEksinometrija {
  const superPozicija = getSuperPozicijaNiz();
  const maxSP = Math.max(...superPozicija);
  const normalizovana = superPozicija.map((v) =>
    maxSP > 0 ? Math.round((v / maxSP) * 10000) / 10000 : 0,
  );

  const ukupnaSinergija = Math.round(
    normalizovana.reduce((s, v) => s + v, 0) * 10000,
  ) / 10000;

  const prosecnaSinergija = Math.round((ukupnaSinergija / normalizovana.length) * 10000) / 10000;
  const maksimalnaVrednost = Math.max(...normalizovana);
  const maksimalniX = normalizovana.indexOf(maksimalnaVrednost);

  // Doprinos svake oktave u tački x=7 (maksimalni rast)
  const xMax = 7;
  const ukupnoUxMax = getSuperPozicija(xMax);
  const doprinosiOktava = eksponencijalneFunkcije.map((f) => {
    const vrednost = f.izracunaj(xMax);
    const doprinos = ukupnoUxMax > 0
      ? Math.round((vrednost / ukupnoUxMax) * 10000) / 10000
      : 0;
    return {
      oktava: f.oktava,
      naziv: oktavniNazivi[f.oktava],
      ikona: f.ikona,
      doprinos,
    };
  });

  return {
    superPozicija,
    normalizovana,
    ukupnaSinergija,
    prosecnaSinergija,
    maksimalniX,
    maksimalnaVrednost,
    doprinosiOktava,
  };
}

// ── Računanje EpicentricniEklubrion ──────────────────────────────────────────

function izracunajEpicentricniEklubrion(
  eksinometrija: EktridonalnaEksinometrija,
): EpicentricniEklubrion {
  const norm = eksinometrija.normalizovana;

  // Centar mase (težišni, po normalizovanim vrednostima)
  let cmXNumer = 0;
  let cmXDenom = 0;
  for (let x = 0; x < norm.length; x++) {
    cmXNumer += x * norm[x];
    cmXDenom += norm[x];
  }
  const cmX = cmXDenom > 0 ? Math.round((cmXNumer / cmXDenom) * 10000) / 10000 : 0;
  const cmY = Math.round((eksinometrija.prosecnaSinergija) * 10000) / 10000;

  // Geometrijski centar (sredina opsega)
  const geoX = (norm.length - 1) / 2; // 3.5
  const geoY = Math.round((norm.reduce((s, v) => s + v, 0) / norm.length) * 10000) / 10000;

  // Tačka maksimalne sinergije
  const tackaMaksX = eksinometrija.maksimalniX;
  const tackaMaksY = eksinometrija.maksimalnaVrednost;

  // Epicentričnost — rastojanje cm od geo centra
  const epicentricnost = Math.round(
    Math.sqrt((cmX - geoX) ** 2 + (cmY - geoY) ** 2) * 10000,
  ) / 10000;

  // Simetrijska snaga ∈ [0, 1] — veća kad je cm bliže geo centru
  const maxMoguceRastojanje = Math.sqrt((geoX ** 2) + (geoY ** 2));
  const simetrijskaSnaga = maxMoguceRastojanje > 0
    ? Math.round(Math.max(0, 1 - epicentricnost / maxMoguceRastojanje) * 10000) / 10000
    : 1;

  return {
    epicentricnost,
    centarMase: { x: cmX, y: cmY },
    geometrijskiCentar: { x: geoX, y: geoY },
    tackaMaksSinergije: { x: tackaMaksX, y: tackaMaksY },
    simetrijskaSnaga,
    status: epicentricnost < 0.1 ? 'simetričan' : 'asimetričan',
  };
}

// ── Glavna builder funkcija ───────────────────────────────────────────────────

export function buildDigatalnaEureka(userId: string): DigatalnaEurekaRezultat {
  const eksinometrija = izracunajEktridonalnaEksinometrija();
  const epicentricniEkvivalent = izracunajEpicentricniEklubrion(eksinometrija);

  const monolog = getOktavniMonolog();
  const matricnaSimetrija = monolog.matricnoJedinjenje.trag;

  // Eureka koeficijent — kombinacija prosečne sinergije i simetrijske snage
  // Normalizovano: prosecnaSinergija je već ∈ [0, 1], simetrijskaSnaga ∈ [0, 1]
  const eurekaKoeficijent = Math.round(
    (eksinometrija.prosecnaSinergija * 0.6 + epicentricniEkvivalent.simetrijskaSnaga * 0.4) * 10000,
  ) / 10000;

  return {
    eurekaKoeficijent: Math.min(1, Math.max(0, eurekaKoeficijent)),
    oktavnaSinergija: eksinometrija.normalizovana,
    epicentricniEkvivalent,
    matricnaSimetrija,
    ektridonalnaEksinometrija: eksinometrija,
    status: 'aktivna',
    userId,
    timestamp: new Date().toISOString(),
  };
}
