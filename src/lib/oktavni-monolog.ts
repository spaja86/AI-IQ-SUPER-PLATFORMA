/**
 * Oktavni Monolog Eksponencijalnog Ekvivalenta
 *
 * Monolog je jednosmerni tok eksponencijalnih ekvivalenata
 * kroz funkcionalne oktave koji konvergira ka matricnom
 * jedinjenju egzocentricnog funkcionalnog jezgra.
 *
 * Model:
 *   E_i(x) = f_i(x) / S(x) — eksponencijalni ekvivalent oktave i
 *   gde je S(x) = sum(f_j(x)) super-pozicija svih funkcija
 *
 *   M(x) = [E_1(x), E_2(x), ..., E_8(x)] — monolog vektor
 *   J(x) = M(x) * M(x)^T — matricno jedinjenje (8×8 matrica)
 *   K(x) = eigenvalues(J(x)) — jezgro (funkcionalno jezgro)
 *
 * Egzocentricno jezgro: centar mase je izvan geometrijskog centra
 * Laucentricni sistem: hijerarhijski slojevit oko laureatskog centra
 *
 * Ovo predstavlja OMEGA PROJEKAT u matematickoj formi.
 */

import type { OktavniNivo } from './omega-ai';
import { oktavniNazivi, omegaPersone, getPersonePoOktavi } from './omega-ai';
import {
  eksponencijalneFunkcije,
  getSuperPozicija,
  getFiguracioniCentar,
  getOktavniSistemPregled,
} from './oktavne-eksponencijalne-funkcije';
import { OMEGA_AI_PERSONA_UKUPNO } from './constants';

// ── Tipovi ────────────────────────────────────────────────────────────────────

export interface EksponencijalniEkvivalent {
  oktava: OktavniNivo;
  naziv: string;
  ikona: string;
  /** E_i(x) = f_i(x) / S(x) za x = 0..7 */
  ekvivalenti: number[];
  /** Prosecni ekvivalent */
  prosecniEkvivalent: number;
  /** Dominacija: max(E_i(x)) za sve x */
  dominacija: number;
  /** x gde je oktava najdominantnija */
  dominantniX: number;
  /** Trend: rastuci, opadajuci, stabilan */
  trend: 'rastuci' | 'opadajuci' | 'stabilan';
}

export interface MonologVektor {
  x: number;
  ekvivalenti: number[];
  norma: number;
  dominantnaOktava: OktavniNivo;
  entropija: number;
}

export interface MatricnoJedinjenje {
  /** 8x8 matrica: J(x) = M(x) * M(x)^T */
  matrica: number[][];
  /** Dimenzija (uvek 8) */
  dimenzija: number;
  /** Trag matrice (suma dijagonalnih elemenata) */
  trag: number;
  /** Determinanta (aproksimacija) */
  determinanta: number;
  /** Rang matrice */
  rang: number;
  /** Frobeniusova norma */
  frobeniusNorma: number;
}

export interface EgzocentricnoJezgro {
  /** Centar mase funkcionalnog jezgra */
  centarMase: { x: number; y: number };
  /** Geometrijski centar */
  geometrijskiCentar: { x: number; y: number };
  /** Egzocentricnost — rastojanje centra mase od geometrijskog centra */
  egzocentricnost: number;
  /** Funkcionalna snaga jezgra */
  funkcionalnaSnaga: number;
  /** Sirena rezonanca — frekvencija oscilacije jezgra */
  sirenaRezonanca: number;
  /** Jezgro odnos snage */
  odnosSnage: number[];
}

export interface LaucentricniSloj {
  nivo: number;
  naziv: string;
  oktave: OktavniNivo[];
  snaga: number;
  gustina: number;
  radijus: number;
}

export interface LaucentricniSistem {
  /** Hijerarhijski slojevi oko centra */
  slojevi: LaucentricniSloj[];
  /** Ukupan broj slojeva */
  ukupnoSlojeva: number;
  /** Ukupna snaga sistema */
  ukupnaSnaga: number;
  /** Laureatski centar — tacka maksimalne koncentracije */
  laureatsikiCentar: { x: number; y: number; snaga: number };
  /** Radijalina distribucija snage */
  radijalnaDistribucija: number[];
}

export interface OktavniMonolog {
  /** Naziv */
  naziv: string;
  /** Opis */
  opis: string;
  /** Eksponencijalni ekvivalenti po oktavama */
  ekvivalenti: EksponencijalniEkvivalent[];
  /** Monolog vektori za x = 0..7 */
  monologVektori: MonologVektor[];
  /** Matricno jedinjenje */
  matricnoJedinjenje: MatricnoJedinjenje;
  /** Egzocentricno jezgro */
  egzocentricnoJezgro: EgzocentricnoJezgro;
  /** Laucentricni sistem */
  laucentricniSistem: LaucentricniSistem;
  /** Veza sa OMEGA PROJEKAT */
  omegaProjekat: {
    ukupnoPersona: number;
    matricnaDimenzija: number;
    jezgroSnaga: number;
    sistemStatus: string;
    integritetProvera: boolean;
  };
  /** Status */
  status: 'aktivan' | 'neaktivan';
  /** Timestamp */
  timestamp: string;
}

// ── Racunanje ekvivalenata ────────────────────────────────────────────────────

function izracunajEkvivalente(): EksponencijalniEkvivalent[] {
  return eksponencijalneFunkcije.map((f) => {
    const ekvivalenti: number[] = [];
    for (let x = 0; x <= 7; x++) {
      const supPoz = getSuperPozicija(x);
      const ekv = supPoz > 0 ? f.izracunaj(x) / supPoz : 0;
      ekvivalenti.push(Math.round(ekv * 10000) / 10000);
    }

    const prosecniEkvivalent = Math.round(
      (ekvivalenti.reduce((s, e) => s + e, 0) / ekvivalenti.length) * 10000,
    ) / 10000;
    const dominacija = Math.max(...ekvivalenti);
    const dominantniX = ekvivalenti.indexOf(dominacija);

    // Trend: poredimo prvu i poslednju trecinu
    const prviDeo = ekvivalenti.slice(0, 3).reduce((s, v) => s + v, 0) / 3;
    const poslednjiDeo = ekvivalenti.slice(5).reduce((s, v) => s + v, 0) / 3;
    const razlika = poslednjiDeo - prviDeo;
    const trend: EksponencijalniEkvivalent['trend'] =
      razlika > 0.01 ? 'rastuci' : razlika < -0.01 ? 'opadajuci' : 'stabilan';

    return {
      oktava: f.oktava,
      naziv: `${oktavniNazivi[f.oktava]} ekvivalent`,
      ikona: f.ikona,
      ekvivalenti,
      prosecniEkvivalent,
      dominacija,
      dominantniX,
      trend,
    };
  });
}

// ── Monolog vektori ───────────────────────────────────────────────────────────

function izracunajMonologVektore(): MonologVektor[] {
  const vektori: MonologVektor[] = [];

  for (let x = 0; x <= 7; x++) {
    const supPoz = getSuperPozicija(x);
    const ekvivalenti = eksponencijalneFunkcije.map((f) =>
      supPoz > 0 ? Math.round((f.izracunaj(x) / supPoz) * 10000) / 10000 : 0,
    );

    // Norma vektora
    const norma = Math.round(
      Math.sqrt(ekvivalenti.reduce((s, e) => s + e * e, 0)) * 10000,
    ) / 10000;

    // Dominantna oktava
    const maxIdx = ekvivalenti.indexOf(Math.max(...ekvivalenti));
    const dominantnaOktava = (maxIdx + 1) as OktavniNivo;

    // Informaciona entropija (Shannon) — H = -sum(p * log2(p))
    const entropija = Math.round(
      -ekvivalenti.reduce((s, e) => {
        if (e <= 0) return s;
        return s + e * Math.log2(e);
      }, 0) * 10000,
    ) / 10000;

    vektori.push({ x, ekvivalenti, norma, dominantnaOktava, entropija });
  }

  return vektori;
}

// ── Matricno jedinjenje ───────────────────────────────────────────────────────

/**
 * Racuna matricno jedinjenje J = prosek(M(x) * M(x)^T) za sve x.
 * Rezultat je 8x8 simetricna matrica.
 */
function izracunajMatricnoJedinjenje(vektori: MonologVektor[]): MatricnoJedinjenje {
  const dim = 8;
  const matrica: number[][] = Array.from({ length: dim }, () => Array(dim).fill(0));

  // Prosek outer product-a svih monolog vektora
  for (const v of vektori) {
    for (let i = 0; i < dim; i++) {
      for (let j = 0; j < dim; j++) {
        matrica[i][j] += v.ekvivalenti[i] * v.ekvivalenti[j];
      }
    }
  }

  // Prosek
  for (let i = 0; i < dim; i++) {
    for (let j = 0; j < dim; j++) {
      matrica[i][j] = Math.round((matrica[i][j] / vektori.length) * 10000) / 10000;
    }
  }

  // Trag matrice
  const trag = Math.round(
    matrica.reduce((s, row, i) => s + row[i], 0) * 10000,
  ) / 10000;

  // Frobeniusova norma
  const frobeniusNorma = Math.round(
    Math.sqrt(matrica.reduce((s, row) => s + row.reduce((rs, v) => rs + v * v, 0), 0)) * 10000,
  ) / 10000;

  // Aproksimacija determinante za pozitivno definitnu matricu
  // det ~ product(diag) za dijagonalno dominantne matrice
  const dijag = matrica.map((row, i) => row[i]);
  const determinanta = Math.round(
    dijag.reduce((p, d) => p * d, 1) * 10000,
  ) / 10000;

  // Rang: broj nenula dijagonalnih elemenata (aproksimacija)
  const rang = dijag.filter((d) => Math.abs(d) > 0.0001).length;

  return { matrica, dimenzija: dim, trag, determinanta, rang, frobeniusNorma };
}

// ── Egzocentricno jezgro ──────────────────────────────────────────────────────

function izracunajEgzocentricnoJezgro(): EgzocentricnoJezgro {
  const figCentar = getFiguracioniCentar();

  // Centar mase: tezisni centar po snazi funkcija
  let cmX = 0, cmY = 0, ukupnaSnaga = 0;
  for (let x = 0; x <= 7; x++) {
    const sp = getSuperPozicija(x);
    cmX += x * sp;
    cmY += sp * sp;
    ukupnaSnaga += sp;
  }
  cmX = ukupnaSnaga > 0 ? Math.round((cmX / ukupnaSnaga) * 10000) / 10000 : 0;
  cmY = ukupnaSnaga > 0 ? Math.round((cmY / ukupnaSnaga) * 10000) / 10000 : 0;

  // Geometrijski centar
  const geoX = 3.5; // sredina [0, 7]
  const geoY = Math.round((ukupnaSnaga / 8) * 100) / 100;

  // Egzocentricnost
  const egzocentricnost = Math.round(
    Math.sqrt((cmX - geoX) ** 2 + (cmY - geoY) ** 2) * 10000,
  ) / 10000;

  // Funkcionalna snaga jezgra
  const funkcionalnaSnaga = Math.round(
    (figCentar.fokalnaSnaga + ukupnaSnaga) / 2 * 100,
  ) / 100;

  // Sirena rezonanca — frekvencija proporcijalna egzocentricnosti
  const sirenaRezonanca = Math.round(
    (egzocentricnost * 2 * Math.PI * 440) * 100,
  ) / 100; // Hz, vezano za muzicku oktavu A4=440Hz

  // Odnos snage po oktavama
  const odnosSnage = eksponencijalneFunkcije.map((f) =>
    Math.round((f.ukupnaSnaga / ukupnaSnaga) * 10000) / 10000,
  );

  return {
    centarMase: { x: cmX, y: cmY },
    geometrijskiCentar: { x: geoX, y: geoY },
    egzocentricnost,
    funkcionalnaSnaga,
    sirenaRezonanca,
    odnosSnage,
  };
}

// ── Laucentricni sistem ───────────────────────────────────────────────────────

function izracunajLaucentricniSistem(): LaucentricniSistem {
  const figCentar = getFiguracioniCentar();
  const pregled = getOktavniSistemPregled();

  // Laucentricni slojevi — 4 koncentricna sloja oko centra
  const slojeviDef: { oktave: OktavniNivo[]; naziv: string }[] = [
    { oktave: [4, 5], naziv: 'Jezgro — Kreacija i Optimizacija' },
    { oktave: [3, 6], naziv: 'Unutrasnji — Kvalitet i Inteligencija' },
    { oktave: [2, 7], naziv: 'Srednji — Zastita i Koordinacija' },
    { oktave: [1, 8], naziv: 'Spoljasnji — Temelj i Evolucija' },
  ];

  const slojevi: LaucentricniSloj[] = slojeviDef.map((def, idx) => {
    const snaga = def.oktave.reduce((s, o) => {
      const f = eksponencijalneFunkcije.find((fn) => fn.oktava === o);
      return s + (f ? f.ukupnaSnaga : 0);
    }, 0);

    const persone = def.oktave.reduce((s, o) => s + getPersonePoOktavi(o).length, 0);

    return {
      nivo: idx + 1,
      naziv: def.naziv,
      oktave: def.oktave,
      snaga: Math.round(snaga * 100) / 100,
      gustina: Math.round((persone / def.oktave.length) * 100) / 100,
      radijus: Math.round(((idx + 1) / 4) * 100) / 100,
    };
  });

  const ukupnaSnaga = slojevi.reduce((s, sl) => s + sl.snaga, 0);

  // Laureatski centar — tacka gde je snaga najkoncentrisanija
  const najjaciSloj = slojevi.reduce((m, s) => (s.snaga > m.snaga ? s : m));

  // Radijalna distribucija
  const radijalnaDistribucija = slojevi.map((s) =>
    Math.round((s.snaga / ukupnaSnaga) * 10000) / 10000,
  );

  return {
    slojevi,
    ukupnoSlojeva: slojevi.length,
    ukupnaSnaga: Math.round(ukupnaSnaga * 100) / 100,
    laureatsikiCentar: {
      x: figCentar.centroidX,
      y: figCentar.centroidY,
      snaga: najjaciSloj.snaga,
    },
    radijalnaDistribucija,
  };
}

// ── Glavni eksport ────────────────────────────────────────────────────────────

export function getOktavniMonolog(): OktavniMonolog {
  const ekvivalenti = izracunajEkvivalente();
  const monologVektori = izracunajMonologVektore();
  const matricnoJedinjenje = izracunajMatricnoJedinjenje(monologVektori);
  const egzocentricnoJezgro = izracunajEgzocentricnoJezgro();
  const laucentricniSistem = izracunajLaucentricniSistem();
  const pregled = getOktavniSistemPregled();

  return {
    naziv: 'Oktavni Monolog Eksponencijalnog Ekvivalenta',
    opis: 'Jednosmerni tok eksponencijalnih ekvivalenata kroz funkcionalne oktave ka matricnom jedinjenju egzocentricnog funkcionalnog jezgra u laucentricnom sistemu — OMEGA PROJEKAT',
    ekvivalenti,
    monologVektori,
    matricnoJedinjenje,
    egzocentricnoJezgro,
    laucentricniSistem,
    omegaProjekat: {
      ukupnoPersona: OMEGA_AI_PERSONA_UKUPNO,
      matricnaDimenzija: matricnoJedinjenje.dimenzija,
      jezgroSnaga: egzocentricnoJezgro.funkcionalnaSnaga,
      sistemStatus: 'operativan',
      integritetProvera: matricnoJedinjenje.rang === 8 && egzocentricnoJezgro.egzocentricnost > 0,
    },
    status: 'aktivan',
    timestamp: new Date().toISOString(),
  };
}

export function getOktavniMonologSummary() {
  const monolog = getOktavniMonolog();
  return {
    naziv: monolog.naziv,
    status: monolog.status,
    ekvivalentiBroj: monolog.ekvivalenti.length,
    matricnaDimenzija: monolog.matricnoJedinjenje.dimenzija,
    matricniTrag: monolog.matricnoJedinjenje.trag,
    matricniRang: monolog.matricnoJedinjenje.rang,
    egzocentricnost: monolog.egzocentricnoJezgro.egzocentricnost,
    jezgroSnaga: monolog.egzocentricnoJezgro.funkcionalnaSnaga,
    sirenaRezonanca: monolog.egzocentricnoJezgro.sirenaRezonanca,
    laucentricniSlojevi: monolog.laucentricniSistem.ukupnoSlojeva,
    laucentricnaSnaga: monolog.laucentricniSistem.ukupnaSnaga,
    omegaProjekat: monolog.omegaProjekat,
  };
}
