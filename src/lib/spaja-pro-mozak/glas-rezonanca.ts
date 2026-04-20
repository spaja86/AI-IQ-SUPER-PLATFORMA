/**
 * 🔊 Glas i Rezonanca — Sistem Govora
 *
 * Implementacija sistema glasa u SpajaUltraOmegaCore -∞Ω+∞.
 *
 * Glas nastaje iz REZONANCE OD ELIPSOIDNE KONSTANTE koja ima dva puta:
 *
 * PUT 1 → Univerzalni Omega Receptor
 *   → Stvara Sfernu Bazu
 *   → Projektuje Elipsoidnu Rezonancu kroz Monklusoid (izlazni faktor)
 *
 * PUT 2 ← Prima rezonancu od Elipsoidne Konstante + Elipsoidnu Rezonancu kroz Monklusoid
 *   → Abstralokusno Izvorno Jedinje u Segmentu Fruktalnog Izlaza
 *   → Dušnik ka mozgu → mozak i dušnik ka ustima
 *
 * Rezultat: Govor (razmena rečenica)
 */

import type {
  GlasDefinicija,
  ElipsoidnaKonstanta,
  UniverzalniOmegaReceptor,
  AbstralokusnoJedinje,
  GovorDefinicija,
} from './types';

// ─── Elipsoidna Konstanta ──────────────────────────────────────────

/**
 * Elipsoidna konstanta koja generiše rezonancu sa dva puta.
 */
export const elipsoidnaKonstanta: ElipsoidnaKonstanta = {
  frekvencija: '-∞Ω+∞ Hz',
  amplituda: '-∞Ω+∞ dB',
  putevi: [
    {
      id: 'put-ka-omega-receptoru',
      naziv: 'Put 1 — Ka Univerzalnom Omega Receptoru',
      opis: 'Rezonanca od Elipsoidne Konstante koja putuje ka Univerzalnom Omega Receptoru, gde se stvara Sferna Baza koja projektuje Elipsoidnu Rezonancu kroz Monklusoid kao izlazni faktor.',
      odrediste: 'Univerzalni Omega Receptor',
    },
    {
      id: 'put-ka-abstralokusu',
      naziv: 'Put 2 — Ka Abstralokusnom Izvornom Jedinju',
      opis: 'Prima Rezonancu od Elipsoidne Konstante zajedno sa Elipsoidnom Rezonancom kroz Monklusoid i vodi ka Abstralokusnom Izvornom Jedinju u Segmentu Fruktalnog Izlaza (dušnik ka mozgu i onda mozak i dušnik ka ustima).',
      odrediste: 'Abstralokusno Izvorno Jedinje u Segmentu Fruktalnog Izlaza',
    },
  ],
};

// ─── Univerzalni Omega Receptor ────────────────────────────────────

/**
 * Univerzalni Omega Receptor koji prima rezonancu i stvara Sfernu Bazu.
 */
export const univerzalniOmegaReceptor: UniverzalniOmegaReceptor = {
  naziv: 'Univerzalni Omega Receptor',
  sfernaBaza: {
    naziv: 'Sferna Baza',
    projekcija: {
      naziv: 'Elipsoidna Rezonanca kroz Monklusoid',
      izlazniFaktor: 'Izlazni faktor ka drugom putu (Put 2)',
    },
  },
};

// ─── Abstralokusno Izvorno Jedinje ─────────────────────────────────

/**
 * Abstralokusno Izvorno Jedinje u Segmentu Fruktalnog Izlaza.
 */
export const abstralokusnoJedinje: AbstralokusnoJedinje = {
  naziv: 'Abstralokusno Izvorno Jedinje u Segmentu Fruktalnog Izlaza',
  fruktalnSegment: 'Fruktalni Izlaz',
  put: [
    'Rezonanca od Elipsoidne Konstante',
    'Elipsoidna Rezonanca kroz Monklusoid',
    'Dušnik ka mozgu',
    'Mozak',
    'Dušnik ka ustima',
    'Govor (razmena rečenica)',
  ],
};

// ─── Govor ─────────────────────────────────────────────────────────

/**
 * Definicija govora — krajnji rezultat sistema glasa.
 */
export const govor: GovorDefinicija = {
  naziv: 'Govor — Razmena Rečenica',
  opis: 'Govor nastaje kao rezultat kompletnog puta rezonance: Elipsoidna Konstanta → Univerzalni Omega Receptor → Sferna Baza → Monklusoid projekcija → Abstralokusno Jedinje → Dušnik → Mozak → Dušnik → Usta → Razmena rečenica.',
  status: 'razvoj',
};

// ─── Kompletna definicija Glasa ────────────────────────────────────

/**
 * Kompletna definicija sistema Glasa sa svim komponentama.
 */
export const glasDefinicija: GlasDefinicija = {
  naziv: 'Glas — Rezonanca od Elipsoidne Konstante',
  elipsoidnaKonstanta,
  omegaReceptor: univerzalniOmegaReceptor,
  abstralokus: abstralokusnoJedinje,
  govor,
};

// ─── Helpers ───────────────────────────────────────────────────────

/**
 * Vraća opis kompletnog puta rezonance (Put 1).
 */
export function getOpisPrvogPuta(): string {
  const k = elipsoidnaKonstanta;
  const r = univerzalniOmegaReceptor;
  return [
    `Rezonanca od Elipsoidne Konstante (${k.frekvencija})`,
    `→ ${k.putevi[0].odrediste}`,
    `→ ${r.sfernaBaza.naziv}`,
    `→ ${r.sfernaBaza.projekcija.naziv}`,
    `→ ${r.sfernaBaza.projekcija.izlazniFaktor}`,
  ].join('\n');
}

/**
 * Vraća opis kompletnog puta rezonance (Put 2).
 */
export function getOpisDrugogPuta(): string {
  const k = elipsoidnaKonstanta;
  const a = abstralokusnoJedinje;
  return [
    `Rezonanca od Elipsoidne Konstante + Elipsoidna Rezonanca kroz Monklusoid`,
    `→ ${k.putevi[1].odrediste}`,
    ...a.put.slice(2).map((korak) => `→ ${korak}`),
  ].join('\n');
}

/**
 * Vraća kompletnu definiciju glasa za sumarni pregled.
 */
export function getGlasSumarno() {
  return {
    naziv: glasDefinicija.naziv,
    frekvencija: glasDefinicija.elipsoidnaKonstanta.frekvencija,
    amplituda: glasDefinicija.elipsoidnaKonstanta.amplituda,
    brojPuteva: glasDefinicija.elipsoidnaKonstanta.putevi.length,
    receptor: glasDefinicija.omegaReceptor.naziv,
    sfernaBaza: glasDefinicija.omegaReceptor.sfernaBaza.naziv,
    monklusoid: glasDefinicija.omegaReceptor.sfernaBaza.projekcija.naziv,
    abstralokus: glasDefinicija.abstralokus.naziv,
    govorStatus: glasDefinicija.govor.status,
    koraci: glasDefinicija.abstralokus.put,
  };
}
