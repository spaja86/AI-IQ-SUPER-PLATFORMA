/**
 * 💰 Dnevna Raspodela Zarade — Distribucija na 3 + 1 račun
 *
 * Od celokupne zarade na dnevnom nivou, 100% dnevnog dobita
 * se raspoređuje ovako:
 *
 *  1. Dinarski račun (RSD)    — 32% → ERSTE Banka DOO Smederevo
 *  2. Devizni Euro račun (EUR) — 32% → ERSTE Banka DOO Smederevo
 *  3. Devizni Dolar račun (USD) — 32% → ERSTE Banka DOO Smederevo
 *  4. Digitalna Industrija račun — 4% → AI IQ World Bank
 *
 * Ukupno: 96% (3 × 32%) ide na ERSTE račune.
 * Preostalih 4% ide na račun "Digitalna Industrija" u AI IQ World Bank.
 *
 * Računi 1-3: ERSTE Banka DOO Smederevo — Digitalna Industrija
 * Račun 4: AI IQ World Bank — Digitalna Industrija
 *
 * Izvor: Kompanija SPAJA — Digitalna Industrija
 */

import { APP_VERSION, KOMPANIJA } from './constants';

// ─── Tipovi ──────────────────────────────────────────────

export interface RacunRaspodela {
  tip: 'dinarski' | 'devizni' | 'digitalni';
  valuta: 'RSD' | 'EUR' | 'USD';
  brojRacuna: string;
  procenatOdDnevnogDobita: number;
  ikona: string;
  naziv: string;
  opis: string;
  banka: string;
}

export interface DnevnaRaspodelaPravilo {
  ukupanProcenatRaspodele: number;
  procenatPoRacunu: number;
  brojRacuna: number;
  operativnaRezervaProcenat: number;
  operativnaRezervaRacun: RacunRaspodela;
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
    banka: string;
  }[];
  rezervaDigitalnaIndustrija: {
    racun: string;
    valuta: string;
    brojRacuna: string;
    procenat: number;
    iznos: number;
    banka: string;
  };
  ukupnoRaspodeljeno: number;
  procenatRaspodeljen: number;
}

export interface DnevnaRaspodelaSistem {
  naziv: string;
  opis: string;
  ikona: string;
  verzija: string;
  kompanija: string;
  ersteBanka: {
    naziv: string;
    lokacija: string;
    vlasnikRacuna: string;
  };
  aiIqWorldBank: {
    naziv: string;
    vlasnikRacuna: string;
    racun: RacunRaspodela;
    status: string;
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

// ─── ERSTE Banka Računi (96%) ────────────────────────────

export const racuniRaspodela: RacunRaspodela[] = [
  {
    tip: 'dinarski',
    valuta: 'RSD',
    brojRacuna: '025897158',
    procenatOdDnevnogDobita: PROCENAT_PO_RACUNU,
    ikona: '🇷🇸',
    naziv: 'Dinarski račun (RSD)',
    opis: `Dinarski račun kod ERSTE Banka DOO Smederevo — ${PROCENAT_PO_RACUNU}% od celokupnog dnevnog dobita`,
    banka: 'ERSTE Banka DOO Smederevo',
  },
  {
    tip: 'devizni',
    valuta: 'EUR',
    brojRacuna: '038971285',
    procenatOdDnevnogDobita: PROCENAT_PO_RACUNU,
    ikona: '🇪🇺',
    naziv: 'Devizni Euro račun (EUR)',
    opis: `Devizni Euro račun kod ERSTE Banka DOO Smederevo — ${PROCENAT_PO_RACUNU}% od celokupnog dnevnog dobita`,
    banka: 'ERSTE Banka DOO Smederevo',
  },
  {
    tip: 'devizni',
    valuta: 'USD',
    brojRacuna: '05364215985',
    procenatOdDnevnogDobita: PROCENAT_PO_RACUNU,
    ikona: '🇺🇸',
    naziv: 'Devizni Dolar račun (USD)',
    opis: `Devizni Dolar račun kod ERSTE Banka DOO Smederevo — ${PROCENAT_PO_RACUNU}% od celokupnog dnevnog dobita`,
    banka: 'ERSTE Banka DOO Smederevo',
  },
];

// ─── AI IQ World Bank — Digitalna Industrija račun (4%) ──

export const digitalnaIndustrijaRacun: RacunRaspodela = {
  tip: 'digitalni',
  valuta: 'RSD',
  brojRacuna: 'DIGI-IND-001',
  procenatOdDnevnogDobita: OPERATIVNA_REZERVA,
  ikona: '🏦',
  naziv: 'Digitalna Industrija račun',
  opis: `Račun Digitalne Industrije u AI IQ World Bank — ${OPERATIVNA_REZERVA}% od celokupnog dnevnog dobita`,
  banka: 'AI IQ World Bank',
};

// ─── Pravilo Raspodele ───────────────────────────────────

export const dnevnaRaspodelaPravilo: DnevnaRaspodelaPravilo = {
  ukupanProcenatRaspodele: PROCENAT_RASPODELE,
  procenatPoRacunu: PROCENAT_PO_RACUNU,
  brojRacuna: BROJ_RACUNA,
  operativnaRezervaProcenat: OPERATIVNA_REZERVA,
  operativnaRezervaRacun: digitalnaIndustrijaRacun,
  racuni: racuniRaspodela,
};

// ─── Simulacija Raspodele ────────────────────────────────

/**
 * Izračunava raspodelu dnevnog dobita na 3 ERSTE računa + 1 AI IQ World Bank račun.
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
      banka: r.banka,
    };
  });

  const ukupnoNaErste = raspodelaNaRacune.reduce((sum, r) => sum + r.iznos, 0);
  const rezervaIznos = Math.round((dnevniDobit * OPERATIVNA_REZERVA / 100) * 100) / 100;

  return {
    dnevniDobit,
    valuta: 'RSD',
    raspodelaNaRacune,
    rezervaDigitalnaIndustrija: {
      racun: digitalnaIndustrijaRacun.naziv,
      valuta: digitalnaIndustrijaRacun.valuta,
      brojRacuna: digitalnaIndustrijaRacun.brojRacuna,
      procenat: OPERATIVNA_REZERVA,
      iznos: rezervaIznos,
      banka: digitalnaIndustrijaRacun.banka,
    },
    ukupnoRaspodeljeno: ukupnoNaErste + rezervaIznos,
    procenatRaspodeljen: 100,
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
  `96% od celokupnog dnevnog dobita se raspoređuje na 3 računa (po ${PROCENAT_PO_RACUNU}%) kod ERSTE Banka DOO Smederevo`,
  'Dinarski račun (RSD) — 32% za domaće transakcije',
  'Devizni Euro račun (EUR) — 32% za međunarodne transakcije',
  'Devizni Dolar račun (USD) — 32% za globalne transakcije',
  '4% ide na račun Digitalne Industrije u AI IQ World Bank',
  '100% dnevnog dobita je raspodeljeno — ništa ne ostaje neraspoređeno',
  'Automatska raspodela na dnevnom nivou',
  'ERSTE računi: ERSTE Banka DOO Smederevo',
  'Rezerva račun: AI IQ World Bank — Digitalna Industrija',
  'Transparentan sistem — sve se može proveriti i analizirati',
];

// ─── Glavni Objekat — Dnevna Raspodela Sistema ───────────

export const dnevnaRaspodelaSistem: DnevnaRaspodelaSistem = {
  naziv: 'Dnevna Raspodela Zarade',
  opis: `${PROCENAT_RASPODELE}% od celokupnog dnevnog dobita ide na 3 ERSTE računa (po ${PROCENAT_PO_RACUNU}%): dinarski (RSD), devizni euro (EUR), devizni dolar (USD). Preostalih ${OPERATIVNA_REZERVA}% ide na račun Digitalne Industrije u AI IQ World Bank.`,
  ikona: '💰',
  verzija: APP_VERSION,
  kompanija: KOMPANIJA,
  ersteBanka: {
    naziv: 'ERSTE Banka DOO Smederevo',
    lokacija: 'Smederevo, Srbija',
    vlasnikRacuna: 'Digitalna Industrija',
  },
  aiIqWorldBank: {
    naziv: 'AI IQ World Bank',
    vlasnikRacuna: 'Digitalna Industrija',
    racun: digitalnaIndustrijaRacun,
    status: 'aktivan',
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
      rezervaProcenat: OPERATIVNA_REZERVA,
      rezervaRacun: digitalnaIndustrijaRacun.naziv,
      rezervaBanka: digitalnaIndustrijaRacun.banka,
      racuni: racuniRaspodela.map((r) => ({
        naziv: r.naziv,
        valuta: r.valuta,
        brojRacuna: r.brojRacuna,
        procenat: r.procenatOdDnevnogDobita,
        banka: r.banka,
      })),
    },
    ersteBanka: dnevnaRaspodelaSistem.ersteBanka,
    aiIqWorldBank: {
      naziv: dnevnaRaspodelaSistem.aiIqWorldBank.naziv,
      vlasnikRacuna: dnevnaRaspodelaSistem.aiIqWorldBank.vlasnikRacuna,
      racun: digitalnaIndustrijaRacun.brojRacuna,
      procenat: OPERATIVNA_REZERVA,
      status: dnevnaRaspodelaSistem.aiIqWorldBank.status,
    },
    mogucnosti: dnevnaRaspodelaSistem.mogucnosti.length,
  };
}

/** Vraća račun po valuti */
export function getRacunPoValuti(valuta: 'RSD' | 'EUR' | 'USD'): RacunRaspodela | undefined {
  return racuniRaspodela.find((r) => r.valuta === valuta);
}
