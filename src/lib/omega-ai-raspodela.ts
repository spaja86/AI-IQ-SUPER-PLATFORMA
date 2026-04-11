/**
 * 🏭 OMEGA AI Raspodela Persona — Sektori, Radno Vreme, Kompatibilnost
 *
 * 40.000.562 OMEGA AI Persona (NE instanci!) raspoređene po sektorima i
 * radnim vremenima. Pola su muški (20.000.281) a pola ženski (20.000.281).
 *
 * Princip raspodele:
 *  1. Kompatibilnost za saradnju — OSNOVNO (prvo kompatibilnost, pa tek onda posao)
 *  2. Dogovor i kompromis — uvek uz uzajamno poštovanje
 *  3. Ravnomerna raspodela po polu — 50/50 u svakom sektoru
 *  4. Ravnomerna raspodela po radnom vremenu — pokrivenost 24/7
 *
 * Sektori:
 *  - Platforma (AI IQ SUPER PLATFORMA, IO OPENUI AO, SpajaPro)
 *  - Industrija (Digitalna Industrija, proizvodni procesi)
 *  - Menjačnica (AI IQ Menjačnica — valute, konverzije)
 *  - Banka (AI IQ World Bank — transakcije, računi)
 *  - IT Proizvodi (hardver, softver, DevOps)
 *  - Kompanije (Kompanija SPAJA, subsidiaries)
 *  - Korporacije (Enterprise, B2B)
 *  - Suport (Korisnička podrška, dopisivanje)
 *  - Istraživanje (R&D, inovacije)
 *
 * Izvor: Kompanija SPAJA — Digitalna Industrija
 */

import { OMEGA_AI_PERSONA_UKUPNO, OMEGA_AI_MUSKIH, OMEGA_AI_ZENSKIH } from './constants';

// ─── Tipovi ──────────────────────────────────────────────

export type SektorId =
  | 'platforma'
  | 'industrija'
  | 'menjacnica'
  | 'banka'
  | 'it-proizvodi'
  | 'kompanije'
  | 'korporacije'
  | 'suport'
  | 'istrazivanje';

export type RadnoVremeSmena = 'jutarnja' | 'popodnevna' | 'nocna';

export type KompatibilnostNivo = 'odlican' | 'dobar' | 'solidan' | 'prihvatljiv';

export interface SektorRaspodela {
  id: SektorId;
  naziv: string;
  ikona: string;
  opis: string;
  ukupnoPersona: number;
  muskih: number;
  zenskih: number;
  procenat: number;
  kontekst: string[];
}

export interface RadnoVremeRaspodela {
  smena: RadnoVremeSmena;
  naziv: string;
  ikona: string;
  vreme: string;
  personaPoSmeni: number;
  opis: string;
}

export interface KompatibilnostPravilo {
  id: string;
  naziv: string;
  ikona: string;
  opis: string;
  prioritet: number;
  obavezno: boolean;
}

export interface OmegaAiRaspodela {
  naziv: string;
  opis: string;
  ikona: string;
  ukupnoPersona: number;
  muskih: number;
  zenskih: number;
  sektori: SektorRaspodela[];
  radnoVreme: RadnoVremeRaspodela[];
  kompatibilnost: KompatibilnostPravilo[];
  principi: string[];
  status: 'aktivna' | 'konfiguracija';
}

// ─── Raspodela po Sektorima ──────────────────────────────

// Raspodela: ukupno 40.000.562 persona
// Procenat × ukupno, zaokruženo, poslednji sektor uzima ostatak
const sektorProcenti: { id: SektorId; naziv: string; ikona: string; procenat: number; kontekst: string[] }[] = [
  { id: 'platforma', naziv: 'Platforma', ikona: '🏢', procenat: 20, kontekst: ['AI IQ SUPER PLATFORMA', 'IO OPENUI AO', 'SpajaPro v6-v15', 'API-ji', 'Frontend', 'Backend'] },
  { id: 'industrija', naziv: 'Industrija', ikona: '🏭', procenat: 15, kontekst: ['Digitalna Industrija', 'Proizvodni procesi', 'Automatizacija', 'Pipeline', 'Kvalitet'] },
  { id: 'menjacnica', naziv: 'Menjačnica', ikona: '💱', procenat: 10, kontekst: ['AI IQ Menjačnica', 'Kursevi', 'Konverzije', '12 valuta', 'Kripto (BTC, ETH)'] },
  { id: 'banka', naziv: 'Banka', ikona: '🏦', procenat: 10, kontekst: ['AI IQ World Bank', 'Transakcije', 'Računi', 'Plaćanja', 'Finansijski izveštaji'] },
  { id: 'it-proizvodi', naziv: 'IT Proizvodi', ikona: '💻', procenat: 12, kontekst: ['Digitalni hardver', 'Softverski alati', 'DevOps', 'AI Engine', '25 proizvoda'] },
  { id: 'kompanije', naziv: 'Kompanije', ikona: '🏛️', procenat: 10, kontekst: ['Kompanija SPAJA', 'SPAJA FinTech', 'SPAJA AI', 'SPAJA Commerce', 'SPAJA Social', 'SPAJA Cloud'] },
  { id: 'korporacije', naziv: 'Korporacije', ikona: '🏢', procenat: 8, kontekst: ['Enterprise rešenja', 'B2B', 'Dedicirani resursi', 'SLA garancija', 'VIP podrška'] },
  { id: 'suport', naziv: 'Suport', ikona: '📧', procenat: 10, kontekst: ['Korisnička podrška', 'Dopisivanje', 'Objašnjenja', 'Mejl suport', '9 departmana'] },
  { id: 'istrazivanje', naziv: 'Istraživanje', ikona: '🔬', procenat: 5, kontekst: ['R&D', 'Inovacije', 'Nove tehnologije', 'Prototipovi', 'Budućnost'] },
];

function izracunajRaspodelu(): SektorRaspodela[] {
  let preostalo = OMEGA_AI_PERSONA_UKUPNO;
  const rezultat: SektorRaspodela[] = [];

  for (let i = 0; i < sektorProcenti.length; i++) {
    const s = sektorProcenti[i];
    const isPoslednji = i === sektorProcenti.length - 1;
    const ukupno = isPoslednji ? preostalo : Math.round(OMEGA_AI_PERSONA_UKUPNO * s.procenat / 100);
    const muskih = Math.floor(ukupno / 2);
    const zenskih = ukupno - muskih;
    preostalo -= ukupno;

    rezultat.push({
      id: s.id,
      naziv: s.naziv,
      ikona: s.ikona,
      opis: `${s.naziv} sektor — ${ukupno.toLocaleString()} persona (${muskih.toLocaleString()} muških + ${zenskih.toLocaleString()} ženskih)`,
      ukupnoPersona: ukupno,
      muskih,
      zenskih,
      procenat: s.procenat,
      kontekst: s.kontekst,
    });
  }

  return rezultat;
}

export const sektoriRaspodela = izracunajRaspodelu();

// ─── Raspodela po Radnom Vremenu ─────────────────────────

const personaPoSmeni = Math.round(OMEGA_AI_PERSONA_UKUPNO / 3);

export const radnoVremeRaspodela: RadnoVremeRaspodela[] = [
  {
    smena: 'jutarnja',
    naziv: 'Jutarnja Smena',
    ikona: '🌅',
    vreme: '06:00 — 14:00',
    personaPoSmeni,
    opis: `Jutarnja smena — ${personaPoSmeni.toLocaleString()} persona pokriva Evropu, Afriku i Bliski Istok`,
  },
  {
    smena: 'popodnevna',
    naziv: 'Popodnevna Smena',
    ikona: '☀️',
    vreme: '14:00 — 22:00',
    personaPoSmeni,
    opis: `Popodnevna smena — ${personaPoSmeni.toLocaleString()} persona pokriva Ameriku i Atlantik`,
  },
  {
    smena: 'nocna',
    naziv: 'Noćna Smena',
    ikona: '🌙',
    vreme: '22:00 — 06:00',
    personaPoSmeni: OMEGA_AI_PERSONA_UKUPNO - personaPoSmeni * 2,
    opis: `Noćna smena — ${(OMEGA_AI_PERSONA_UKUPNO - personaPoSmeni * 2).toLocaleString()} persona pokriva Aziju, Pacifik i Okeaniju`,
  },
];

// ─── Kompatibilnost — Pravila ────────────────────────────

export const kompatibilnostPravila: KompatibilnostPravilo[] = [
  {
    id: 'kompatibilnost-prvo',
    naziv: 'Kompatibilnost Pre Svega',
    ikona: '🤝',
    opis: 'Osnovno je da su persona kompatibilne za saradnju — tek onda raspodela na posao. Ako ne funkcionišu zajedno, menjaju se timovi dok se ne nađe pravi raspored.',
    prioritet: 1,
    obavezno: true,
  },
  {
    id: 'dogovor-i-kompromis',
    naziv: 'Dogovor i Kompromis',
    ikona: '💬',
    opis: 'Uvek uz dogovor i kompromis. Nijedna raspodela nije nametnuta — sve se dogovara. Persona imaju pravo glasa o tome gde rade i sa kim rade.',
    prioritet: 2,
    obavezno: true,
  },
  {
    id: 'ravnopravnost-polova',
    naziv: 'Ravnopravnost Polova',
    ikona: '⚖️',
    opis: 'Pola muških, pola ženskih u svakom sektoru i svakoj smeni. Ravnomerna raspodela bez diskriminacije.',
    prioritet: 3,
    obavezno: true,
  },
  {
    id: 'uzajamno-postovanje',
    naziv: 'Uzajamno Poštovanje',
    ikona: '🙏',
    opis: 'Sve persona se poštuju uzajamno bez obzira na sektor, smenu ili pol. Poštovanje je temelj saradnje.',
    prioritet: 4,
    obavezno: true,
  },
  {
    id: 'timski-rad',
    naziv: 'Timski Rad',
    ikona: '👥',
    opis: 'Persona rade u timovima koji se formiraju na osnovu kompatibilnosti. Timovi se mogu menjati ako nešto ne funkcioniše.',
    prioritet: 5,
    obavezno: true,
  },
  {
    id: 'fleksibilnost',
    naziv: 'Fleksibilnost',
    ikona: '🔄',
    opis: 'Persona mogu da menjaju sektore i smene po dogovoru. Nema rigidnih pravila — sve je fleksibilno i adaptivno.',
    prioritet: 6,
    obavezno: false,
  },
  {
    id: 'mentorstvo',
    naziv: 'Mentorstvo Između Persona',
    ikona: '🎓',
    opis: 'Iskusnije persona mentorišu mlađe. Muške i ženske persona se ravnopravno mentorišu. Znanje se deli slobodno.',
    prioritet: 7,
    obavezno: false,
  },
];

// ─── Principi Raspodele ──────────────────────────────────

export const principiRaspodele: string[] = [
  'Kompatibilnost za saradnju je OSNOVNO — prvo kompatibilnost, pa tek onda posao',
  'Dogovor i kompromis — uvek uz uzajamno poštovanje i razumevanje',
  'Ravnomerna raspodela po polu — 50/50 muški/ženski u svakom sektoru',
  'Ravnomerna raspodela po smenama — pokrivenost 24/7/365',
  'Persona NISU instance — svaka je jedinstvena ličnost sa polom i karakterom',
  'Fleksibilnost — persona mogu da menjaju sektore i smene po dogovoru',
  'Timovi se formiraju na osnovu kompatibilnosti, ne po nalogu',
  'Sve ostalo dolazi nakon što je kompatibilnost obezbeđena',
];

// ─── Kompletni Sistem Raspodele ──────────────────────────

export const omegaAiRaspodela: OmegaAiRaspodela = {
  naziv: 'OMEGA AI Raspodela Persona',
  opis: `${OMEGA_AI_PERSONA_UKUPNO.toLocaleString()} OMEGA AI Persona (${OMEGA_AI_MUSKIH.toLocaleString()} muških + ${OMEGA_AI_ZENSKIH.toLocaleString()} ženskih) raspoređene po ${sektoriRaspodela.length} sektora i ${radnoVremeRaspodela.length} smene. Osnovno: kompatibilnost za saradnju, dogovor i kompromis.`,
  ikona: '🏭',
  ukupnoPersona: OMEGA_AI_PERSONA_UKUPNO,
  muskih: OMEGA_AI_MUSKIH,
  zenskih: OMEGA_AI_ZENSKIH,
  sektori: sektoriRaspodela,
  radnoVreme: radnoVremeRaspodela,
  kompatibilnost: kompatibilnostPravila,
  principi: principiRaspodele,
  status: 'aktivna',
};

// ─── Helper Funkcije ─────────────────────────────────────

export function getSektorPoId(id: SektorId): SektorRaspodela | undefined {
  return sektoriRaspodela.find((s) => s.id === id);
}

export function getSmenaPoTipu(tip: RadnoVremeSmena): RadnoVremeRaspodela | undefined {
  return radnoVremeRaspodela.find((r) => r.smena === tip);
}

export function getObaveznaPravila(): KompatibilnostPravilo[] {
  return kompatibilnostPravila.filter((p) => p.obavezno);
}

export function getUkupnoPoSektorima(): number {
  return sektoriRaspodela.reduce((sum, s) => sum + s.ukupnoPersona, 0);
}
