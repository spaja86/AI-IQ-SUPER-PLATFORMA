/**
 * 💰 Dnevna Raspodela Zarade — Distribucija na 3 računa
 *
 * Od celokupne zarade na dnevnom nivou, 96% od ukupnog dnevnog
 * dobita se raspoređuje na tri računa kod ERSTE Banka DOO Smederevo:
 *
 *  1. Dinarski račun (RSD)    — 32% od celokupnog dnevnog dobita
 *  2. Devizni Euro račun (EUR) — 32% od celokupnog dnevnog dobita
 *  3. Devizni Dolar račun (USD) — 32% od celokupnog dnevnog dobita
 *
 * Ukupno: 96% (3 × 32%) se raspoređuje na račune.
 * Preostalih 4% ostaje kao operativna rezerva.
 *
 * Računi: ERSTE Banka DOO Smederevo — Digitalna Industrija
 * Vlasnik: Nikola Spajic
 *
 * Izvor: Kompanija SPAJA — Digitalna Industrija
 */

import { APP_VERSION, KOMPANIJA } from './constants';

// ─── Tipovi ──────────────────────────────────────────────

export interface RacunRaspodela {
  tip: 'dinarski' | 'devizni';
  valuta: 'RSD' | 'EUR' | 'USD';
  brojRacuna: string;
  procenatOdDnevnogDobita: number;
  ikona: string;
  naziv: string;
  opis: string;
}

export interface DnevnaRaspodelaPravilo {
  ukupanProcenatRaspodele: number;
  procenatPoRacunu: number;
  brojRacuna: number;
  operativnaRezerva: number;
  racuni: RacunRaspodela[];
}

export interface DnevnaZaradaSimulacija {
  dnevniDobit: number;
  valuta: string;
  raspodelaNaRacune: {
    racun: string;
    valuta: string;
    brojRacuna: string;
    procenat: number;
    iznos: number;
  }[];
  ukupnoRaspodeljeno: number;
  operativnaRezerva: number;
  procenatRaspodeljen: number;
  procenatRezerve: number;
}

export interface DnevnaRaspodelaSistem {
  naziv: string;
  opis: string;
  ikona: string;
  verzija: string;
  kompanija: string;
  banka: {
    naziv: string;
    lokacija: string;
    vlasnikRacuna: string;
  };
  pravilo: DnevnaRaspodelaPravilo;
  primerSimulacije: DnevnaZaradaSimulacija[];
  mogucnosti: string[];
  status: 'aktivan' | 'konfiguracija';
}

// ─── Konstante Raspodele ─────────────────────────────────

export const PROCENAT_RASPODELE = 96;
export const PROCENAT_PO_RACUNU = 32;
export const BROJ_RACUNA = 3;
export const OPERATIVNA_REZERVA = 4;

// ─── Računi ──────────────────────────────────────────────

export const racuniRaspodela: RacunRaspodela[] = [
  {
    tip: 'dinarski',
    valuta: 'RSD',
    brojRacuna: '025897158',
    procenatOdDnevnogDobita: PROCENAT_PO_RACUNU,
    ikona: '🇷🇸',
    naziv: 'Dinarski račun (RSD)',
    opis: `Dinarski račun kod ERSTE Banka DOO Smederevo — ${PROCENAT_PO_RACUNU}% od celokupnog dnevnog dobita`,
  },
  {
    tip: 'devizni',
    valuta: 'EUR',
    brojRacuna: '038971285',
    procenatOdDnevnogDobita: PROCENAT_PO_RACUNU,
    ikona: '🇪🇺',
    naziv: 'Devizni Euro račun (EUR)',
    opis: `Devizni Euro račun kod ERSTE Banka DOO Smederevo — ${PROCENAT_PO_RACUNU}% od celokupnog dnevnog dobita`,
  },
  {
    tip: 'devizni',
    valuta: 'USD',
    brojRacuna: '05364215985',
    procenatOdDnevnogDobita: PROCENAT_PO_RACUNU,
    ikona: '🇺🇸',
    naziv: 'Devizni Dolar račun (USD)',
    opis: `Devizni Dolar račun kod ERSTE Banka DOO Smederevo — ${PROCENAT_PO_RACUNU}% od celokupnog dnevnog dobita`,
  },
];

// ─── Pravilo Raspodele ───────────────────────────────────

export const dnevnaRaspodelaPravilo: DnevnaRaspodelaPravilo = {
  ukupanProcenatRaspodele: PROCENAT_RASPODELE,
  procenatPoRacunu: PROCENAT_PO_RACUNU,
  brojRacuna: BROJ_RACUNA,
  operativnaRezerva: OPERATIVNA_REZERVA,
  racuni: racuniRaspodela,
};

// ─── Simulacija Raspodele ────────────────────────────────

/**
 * Izračunava raspodelu dnevnog dobita na 3 računa.
 *
 * @param dnevniDobit - celokupni dnevni dobit u RSD
 * @returns simulacija raspodele sa iznosima po računu
 */
export function izracunajDnevnuRaspodelu(dnevniDobit: number): DnevnaZaradaSimulacija {
  const raspodelaNaRacune = racuniRaspodela.map((r) => {
    const iznos = Math.round((dnevniDobit * r.procenatOdDnevnogDobita / 100) * 100) / 100;
    return {
      racun: r.naziv,
      valuta: r.valuta,
      brojRacuna: r.brojRacuna,
      procenat: r.procenatOdDnevnogDobita,
      iznos,
    };
  });

  const ukupnoRaspodeljeno = raspodelaNaRacune.reduce((sum, r) => sum + r.iznos, 0);
  const operativnaRezerva = Math.round((dnevniDobit - ukupnoRaspodeljeno) * 100) / 100;

  return {
    dnevniDobit,
    valuta: 'RSD',
    raspodelaNaRacune,
    ukupnoRaspodeljeno,
    operativnaRezerva,
    procenatRaspodeljen: PROCENAT_RASPODELE,
    procenatRezerve: OPERATIVNA_REZERVA,
  };
}

// ─── Primeri Simulacija ──────────────────────────────────

export const primerSimulacije: DnevnaZaradaSimulacija[] = [
  izracunajDnevnuRaspodelu(10_000),
  izracunajDnevnuRaspodelu(50_000),
  izracunajDnevnuRaspodelu(100_000),
  izracunajDnevnuRaspodelu(500_000),
  izracunajDnevnuRaspodelu(1_000_000),
];

// ─── Mogućnosti ──────────────────────────────────────────

const mogucnosti: string[] = [
  `96% od celokupnog dnevnog dobita se raspoređuje na 3 računa (po ${PROCENAT_PO_RACUNU}%)`,
  'Dinarski račun (RSD) — 32% za domaće transakcije',
  'Devizni Euro račun (EUR) — 32% za međunarodne transakcije',
  'Devizni Dolar račun (USD) — 32% za globalne transakcije',
  '4% ostaje kao operativna rezerva',
  'Automatska raspodela na dnevnom nivou',
  'Svi računi kod ERSTE Banka DOO Smederevo',
  'Vlasnik računa: Digitalna Industrija',
  'Transparentan sistem — sve se može proveriti i analizirati',
];

// ─── Glavni Objekat — Dnevna Raspodela Sistema ───────────

export const dnevnaRaspodelaSistem: DnevnaRaspodelaSistem = {
  naziv: 'Dnevna Raspodela Zarade',
  opis: `${PROCENAT_RASPODELE}% od celokupnog dnevnog dobita se raspoređuje na 3 računa (po ${PROCENAT_PO_RACUNU}%): dinarski (RSD), devizni euro (EUR), devizni dolar (USD) kod ERSTE Banka DOO Smederevo`,
  ikona: '💰',
  verzija: APP_VERSION,
  kompanija: KOMPANIJA,
  banka: {
    naziv: 'ERSTE Banka DOO Smederevo',
    lokacija: 'Smederevo, Srbija',
    vlasnikRacuna: 'Digitalna Industrija',
  },
  pravilo: dnevnaRaspodelaPravilo,
  primerSimulacije,
  mogucnosti,
  status: 'aktivan',
};

// ─── Helper Funkcije ─────────────────────────────────────

/** Vraća pregled sistema raspodele */
export function getDnevnaRaspodelaSummary() {
  return {
    naziv: dnevnaRaspodelaSistem.naziv,
    verzija: dnevnaRaspodelaSistem.verzija,
    status: dnevnaRaspodelaSistem.status,
    pravilo: {
      ukupanProcenat: PROCENAT_RASPODELE,
      procenatPoRacunu: PROCENAT_PO_RACUNU,
      operativnaRezerva: OPERATIVNA_REZERVA,
      racuni: racuniRaspodela.map((r) => ({
        naziv: r.naziv,
        valuta: r.valuta,
        brojRacuna: r.brojRacuna,
        procenat: r.procenatOdDnevnogDobita,
      })),
    },
    banka: dnevnaRaspodelaSistem.banka,
    mogucnosti: dnevnaRaspodelaSistem.mogucnosti.length,
  };
}

/** Vraća račun po valuti */
export function getRacunPoValuti(valuta: 'RSD' | 'EUR' | 'USD'): RacunRaspodela | undefined {
  return racuniRaspodela.find((r) => r.valuta === valuta);
}
