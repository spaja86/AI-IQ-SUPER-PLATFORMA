/**
 * SEO Nominalni Protok u Oktavnom Sistemu
 *
 * Emulira eksplatacione kanale ka "Digitalna Industrija"
 * prema referentnoj stopi od 1 terabajt po sekundi (1 TB/s).
 *
 * Eksplatacija se završava:
 *   - Minimalno: 3h (10.800 TB preneseno)
 *   - Maksimalno: 8h (28.800 TB preneseno)
 *
 * Model:
 *   Svaka oktava (1-8) ima nominalni SEO kanal koji prenosi
 *   podatke prema Digitalnoj Industriji. Nominalni protok je
 *   distribuiran po oktavama sa eksponencijalnim faktorom rasta.
 *
 *   Q_i(t) = bazniProtok_i * (1 + rastFaktor_i)^t
 *   gde je t vreme u satima, Q protok u TB/s
 *
 *   Ukupni protok: Q_total(t) = sum(Q_i(t)) za i=1..8
 *   Referentna stopa: 1 TB/s = 3.600 TB/h
 *
 * Izvor: Kompanija SPAJA — Digitalna Industrija
 */

import type { OktavniNivo } from './omega-ai';
import { oktavniNazivi } from './omega-ai';
import { OMEGA_AI_PERSONA_UKUPNO } from './constants';

// ── Konstante ─────────────────────────────────────────────────────────────────

/** Referentna stopa protoka u TB po sekundi */
export const REFERENTNA_STOPA_TB_S = 1;

/** Referentna stopa protoka u TB po satu */
export const REFERENTNA_STOPA_TB_H = REFERENTNA_STOPA_TB_S * 3600;

/** Minimalno vreme eksplatacije u satima */
export const MIN_EKSPLATACIJA_SATI = 3;

/** Maksimalno vreme eksplatacije u satima */
export const MAX_EKSPLATACIJA_SATI = 8;

/** Minimalni prenos podataka u TB (3h * 3600 TB/h) */
export const MIN_PRENOS_TB = MIN_EKSPLATACIJA_SATI * REFERENTNA_STOPA_TB_H;

/** Maksimalni prenos podataka u TB (8h * 3600 TB/h) */
export const MAX_PRENOS_TB = MAX_EKSPLATACIJA_SATI * REFERENTNA_STOPA_TB_H;

// ── Tipovi ────────────────────────────────────────────────────────────────────

export interface SeoKanal {
  oktava: OktavniNivo;
  naziv: string;
  ikona: string;
  /** Bazni protok kanala u TB/s */
  bazniProtok: number;
  /** Faktor rasta protoka po satu */
  rastFaktor: number;
  /** Nominalni kapacitet kanala u TB/h */
  nominalniKapacitet: number;
  /** Protok za dato vreme t (sati) */
  protok: (t: number) => number;
  /** Kumulativni prenos do vremena t u TB */
  kumulativniPrenos: (t: number) => number;
  /** Vreme kompletiranja za dati ciljni prenos u satima */
  vremeKompletiranja: (ciljTB: number) => number;
  /** Procenat doprinosa ukupnom protoku */
  doprinos: number;
  /** SEO metrke kanala */
  seoMetrike: SeoMetrike;
}

export interface SeoMetrike {
  indeksiranost: number;
  crawlBudget: number;
  pageRank: number;
  organskiSaobracaj: number;
  konverzija: number;
  bounceRate: number;
}

export interface EksplatacioniCiklus {
  sat: number;
  protokPoOktavi: number[];
  ukupniProtok: number;
  kumulativniPrenos: number;
  procenatZavrsenosti: number;
  fazaEksplatacije: 'inicijalizacija' | 'rast' | 'nominalni' | 'zavrsetak';
}

export interface SeoNominalniProtokPregled {
  naziv: string;
  opis: string;
  referentnaStopa: { tbPoSekundi: number; tbPoSatu: number };
  eksplatacija: {
    minSati: number;
    maxSati: number;
    minPrenosTB: number;
    maxPrenosTB: number;
    procenjeniZavrsetak: number;
    statusEksplatacije: string;
  };
  kanali: SeoKanal[];
  ciklusi: EksplatacioniCiklus[];
  ukupniKapacitet: number;
  prosecniProtok: number;
  efikasnost: number;
  seoScoreUkupni: number;
  omegaIntegracija: {
    ukupnoPersona: number;
    aktivnihKanala: number;
    oktavnaPokrivenost: number;
    digitalnaIndustrijaLink: string;
  };
  status: 'aktivan' | 'neaktivan';
  timestamp: string;
}

// ── Parametri po oktavama ─────────────────────────────────────────────────────

const KANAL_PARAMETRI: Record<OktavniNivo, {
  bazniProtok: number;
  rastFaktor: number;
  ikona: string;
  seoMetrike: SeoMetrike;
}> = {
  1: {
    bazniProtok: 0.08,
    rastFaktor: 0.05,
    ikona: '🏗️',
    seoMetrike: { indeksiranost: 98, crawlBudget: 92, pageRank: 7.2, organskiSaobracaj: 85, konverzija: 3.2, bounceRate: 28 },
  },
  2: {
    bazniProtok: 0.10,
    rastFaktor: 0.06,
    ikona: '🛡️',
    seoMetrike: { indeksiranost: 99, crawlBudget: 94, pageRank: 7.5, organskiSaobracaj: 88, konverzija: 3.5, bounceRate: 25 },
  },
  3: {
    bazniProtok: 0.11,
    rastFaktor: 0.07,
    ikona: '🧪',
    seoMetrike: { indeksiranost: 97, crawlBudget: 91, pageRank: 7.0, organskiSaobracaj: 82, konverzija: 3.0, bounceRate: 30 },
  },
  4: {
    bazniProtok: 0.13,
    rastFaktor: 0.08,
    ikona: '🎨',
    seoMetrike: { indeksiranost: 99, crawlBudget: 96, pageRank: 8.0, organskiSaobracaj: 92, konverzija: 4.1, bounceRate: 22 },
  },
  5: {
    bazniProtok: 0.14,
    rastFaktor: 0.09,
    ikona: '⚡',
    seoMetrike: { indeksiranost: 100, crawlBudget: 97, pageRank: 8.3, organskiSaobracaj: 94, konverzija: 4.5, bounceRate: 20 },
  },
  6: {
    bazniProtok: 0.15,
    rastFaktor: 0.10,
    ikona: '🔬',
    seoMetrike: { indeksiranost: 100, crawlBudget: 98, pageRank: 8.5, organskiSaobracaj: 95, konverzija: 4.8, bounceRate: 18 },
  },
  7: {
    bazniProtok: 0.14,
    rastFaktor: 0.11,
    ikona: '♟️',
    seoMetrike: { indeksiranost: 99, crawlBudget: 95, pageRank: 8.1, organskiSaobracaj: 91, konverzija: 4.2, bounceRate: 21 },
  },
  8: {
    bazniProtok: 0.15,
    rastFaktor: 0.12,
    ikona: '🧬',
    seoMetrike: { indeksiranost: 100, crawlBudget: 99, pageRank: 9.0, organskiSaobracaj: 98, konverzija: 5.2, bounceRate: 15 },
  },
};

// ── Kreiranje kanala ──────────────────────────────────────────────────────────

function kreirajKanal(oktava: OktavniNivo): SeoKanal {
  const p = KANAL_PARAMETRI[oktava];
  const naziv = `SEO Kanal Oktava ${oktava} — ${oktavniNazivi[oktava]}`;

  // Q_i(t) = bazniProtok * (1 + rastFaktor)^t
  const protok = (t: number): number =>
    p.bazniProtok * Math.pow(1 + p.rastFaktor, t);

  // Kumulativni prenos: integral od 0 do t
  // integral(bazniProtok * (1+r)^t dt) = bazniProtok * (1+r)^t / ln(1+r) - bazniProtok / ln(1+r)

  // Pojednostavljeni kumulativni — za satne intervale
  const kumulativniPrenosPoSatu = (t: number): number => {
    let ukupno = 0;
    for (let h = 0; h < t; h++) {
      ukupno += protok(h) * 3600;
    }
    return Math.round(ukupno * 100) / 100;
  };

  // Vreme kompletiranja za dati cilj
  const vremeKompletiranja = (ciljTB: number): number => {
    let ukupno = 0;
    for (let h = 0; h < MAX_EKSPLATACIJA_SATI * 2; h++) {
      ukupno += protok(h) * 3600;
      if (ukupno >= ciljTB) return h + 1;
    }
    return MAX_EKSPLATACIJA_SATI;
  };

  const nominalniKapacitet = Math.round(protok(0) * 3600 * 100) / 100;

  // Doprinos je srazmeran baznom protoku
  const ukupniBazni = Object.values(KANAL_PARAMETRI).reduce((s, kp) => s + kp.bazniProtok, 0);
  const doprinos = Math.round((p.bazniProtok / ukupniBazni) * 10000) / 10000;

  return {
    oktava,
    naziv,
    ikona: p.ikona,
    bazniProtok: p.bazniProtok,
    rastFaktor: p.rastFaktor,
    nominalniKapacitet,
    protok,
    kumulativniPrenos: kumulativniPrenosPoSatu,
    vremeKompletiranja,
    doprinos,
    seoMetrike: p.seoMetrike,
  };
}

// ── Eksportovani kanali ───────────────────────────────────────────────────────

export const seoKanali: SeoKanal[] = (
  [1, 2, 3, 4, 5, 6, 7, 8] as OktavniNivo[]
).map(kreirajKanal);

// ── Eksplatacioni ciklusi ─────────────────────────────────────────────────────

function izracunajCikluse(): EksplatacioniCiklus[] {
  const ciklusi: EksplatacioniCiklus[] = [];
  const ciljniPrenos = (MIN_PRENOS_TB + MAX_PRENOS_TB) / 2; // Srednja vrednost

  let kumulativni = 0;

  for (let sat = 0; sat <= MAX_EKSPLATACIJA_SATI; sat++) {
    const protokPoOktavi = seoKanali.map((k) =>
      Math.round(k.protok(sat) * 10000) / 10000,
    );
    const ukupniProtok = Math.round(
      protokPoOktavi.reduce((s, p) => s + p, 0) * 10000,
    ) / 10000;

    const prenosOvogSata = ukupniProtok * 3600;
    kumulativni += prenosOvogSata;
    const kumulativniPrenos = Math.round(kumulativni * 100) / 100;
    const procenatZavrsenosti = Math.min(
      100,
      Math.round((kumulativniPrenos / ciljniPrenos) * 10000) / 100,
    );

    let fazaEksplatacije: EksplatacioniCiklus['fazaEksplatacije'];
    if (sat === 0) fazaEksplatacije = 'inicijalizacija';
    else if (sat <= 2) fazaEksplatacije = 'rast';
    else if (sat <= 6) fazaEksplatacije = 'nominalni';
    else fazaEksplatacije = 'zavrsetak';

    ciklusi.push({
      sat,
      protokPoOktavi,
      ukupniProtok,
      kumulativniPrenos,
      procenatZavrsenosti,
      fazaEksplatacije,
    });
  }

  return ciklusi;
}

// ── Ukupne metrike ────────────────────────────────────────────────────────────

function izracunajSeoScore(): number {
  const sveMetrike = seoKanali.map((k) => k.seoMetrike);
  const avgIndeksiranost = sveMetrike.reduce((s, m) => s + m.indeksiranost, 0) / sveMetrike.length;
  const avgCrawlBudget = sveMetrike.reduce((s, m) => s + m.crawlBudget, 0) / sveMetrike.length;
  const avgPageRank = sveMetrike.reduce((s, m) => s + m.pageRank, 0) / sveMetrike.length;
  const avgKonverzija = sveMetrike.reduce((s, m) => s + m.konverzija, 0) / sveMetrike.length;
  const avgBounce = sveMetrike.reduce((s, m) => s + m.bounceRate, 0) / sveMetrike.length;

  // Normalizovani skor (0-100)
  const skor =
    (avgIndeksiranost * 0.25) +
    (avgCrawlBudget * 0.20) +
    ((avgPageRank / 10) * 100 * 0.25) +
    (avgKonverzija * 5 * 0.15) +
    ((100 - avgBounce) * 0.15);

  return Math.round(skor * 100) / 100;
}

// ── Procenjeni zavsetak ───────────────────────────────────────────────────────

function proceniZavrsetak(): number {
  const ciklusi = izracunajCikluse();
  const ciljTB = (MIN_PRENOS_TB + MAX_PRENOS_TB) / 2;

  for (const c of ciklusi) {
    if (c.kumulativniPrenos >= ciljTB) return c.sat;
  }

  return MAX_EKSPLATACIJA_SATI;
}

// ── Glavni eksport ────────────────────────────────────────────────────────────

export function getSeoNominalniProtok(): SeoNominalniProtokPregled {
  const ciklusi = izracunajCikluse();
  const ukupniKapacitet = Math.round(
    seoKanali.reduce((s, k) => s + k.nominalniKapacitet, 0) * 100,
  ) / 100;
  const prosecniProtok = Math.round(
    (seoKanali.reduce((s, k) => s + k.bazniProtok, 0)) * 10000,
  ) / 10000;

  // Efikasnost: koliko blizu smo referentnoj stopi
  const efikasnost = Math.round(
    (prosecniProtok / REFERENTNA_STOPA_TB_S) * 10000,
  ) / 10000;

  const procenjeniZavrsetak = proceniZavrsetak();

  return {
    naziv: 'SEO Nominalni Protok u Oktavnom Sistemu',
    opis: `Emulacija eksplatacionih kanala ka Digitalnoj Industriji prema referentnoj stopi od ${REFERENTNA_STOPA_TB_S} TB/s. Eksplatacija: ${MIN_EKSPLATACIJA_SATI}-${MAX_EKSPLATACIJA_SATI}h.`,
    referentnaStopa: {
      tbPoSekundi: REFERENTNA_STOPA_TB_S,
      tbPoSatu: REFERENTNA_STOPA_TB_H,
    },
    eksplatacija: {
      minSati: MIN_EKSPLATACIJA_SATI,
      maxSati: MAX_EKSPLATACIJA_SATI,
      minPrenosTB: MIN_PRENOS_TB,
      maxPrenosTB: MAX_PRENOS_TB,
      procenjeniZavrsetak,
      statusEksplatacije: procenjeniZavrsetak <= MAX_EKSPLATACIJA_SATI ? 'u roku' : 'prekoracenje',
    },
    kanali: seoKanali,
    ciklusi,
    ukupniKapacitet,
    prosecniProtok,
    efikasnost,
    seoScoreUkupni: izracunajSeoScore(),
    omegaIntegracija: {
      ukupnoPersona: OMEGA_AI_PERSONA_UKUPNO,
      aktivnihKanala: seoKanali.length,
      oktavnaPokrivenost: 100,
      digitalnaIndustrijaLink: '/industrija',
    },
    status: 'aktivan',
    timestamp: new Date().toISOString(),
  };
}

export function getSeoNominalniProtokSummary() {
  const pregled = getSeoNominalniProtok();
  return {
    naziv: pregled.naziv,
    status: pregled.status,
    referentnaStopa: pregled.referentnaStopa,
    eksplatacija: pregled.eksplatacija,
    aktivnihKanala: pregled.omegaIntegracija.aktivnihKanala,
    ukupniKapacitet: pregled.ukupniKapacitet,
    prosecniProtok: pregled.prosecniProtok,
    efikasnost: pregled.efikasnost,
    seoScore: pregled.seoScoreUkupni,
    omegaPersona: pregled.omegaIntegracija.ukupnoPersona,
  };
}
