/**
 * 🧠 SpajaPro Mozak Hijerarhija
 *
 * Definicija svih 21 nivoa hijerarhije mozgova u SpajaUltraOmegaCore -∞Ω+∞.
 *
 * Hijerarhija prati sledeći obrazac:
 *   Modul (srce mozga) → Mozak → Mozak sa Sinapsama →
 *   Mozak sa Ganglijama → Mozak sa Receptorima →
 *   ... (20+ nivoa receptorskih nadogradnji)
 *
 * Svaki nivo se popunjava parenjem jedinica iz prethodnog nivoa:
 * - Minimum 40 jedinica po mozgu
 * - Maksimum 120 jedinica po mozgu
 * - Potrebno 40 parenja za ulazak u viši nivo
 * - Parenje se vrši između „Blizanaca" i „Bliznakinja" (dva pola)
 * - Duplikati ne mogu da se spajaju međusobno
 */

import type { MozakNivo, MozakNivoId, MozakPol, ParenjeRezultat, ParenjeStatus, MozakDuplikat } from './types';

// ─── OmegaUltra prefiks ────────────────────────────────────────────

const OMEGA_ULTRA_PREFIKS = 'OmegaUltra'.repeat(20);

// ─── Kompletna hijerarhija mozgova ─────────────────────────────────

/**
 * Svih 21 nivo hijerarhije od Modula do najvišeg receptorskog nivoa.
 */
export const mozakHijerarhija: MozakNivo[] = [
  {
    id: 'modul',
    redosled: 0,
    naziv: 'Modul',
    opis: 'Osnovni gradivni blok — „srce mozga". Sadrži bazičnu funkcionalnost i logiku.',
    ikona: '💚',
    minJedinica: 1,
    maxJedinica: 1,
    potrebnihParenja: 0,
    prethodniNivo: null,
    sledeciNivo: 'mozak',
    omegaUltraPrefiks: `${OMEGA_ULTRA_PREFIKS} modul`,
    epicentarIndeksi: [56, 57, 58, 59, 60, 61, 62, 63, 64],
  },
  {
    id: 'mozak',
    redosled: 1,
    naziv: 'Mozak',
    opis: 'Mozak koji sadrži 40–120 modula spojenih parenjem. Formira se nakon 40 parenja modula iz suprotnih polova.',
    ikona: '🧠',
    minJedinica: 40,
    maxJedinica: 120,
    potrebnihParenja: 40,
    prethodniNivo: 'modul',
    sledeciNivo: 'mozak-sinapse',
    omegaUltraPrefiks: `${OMEGA_ULTRA_PREFIKS} mozak`,
    epicentarIndeksi: [57, 58, 59, 60, 61, 62, 63],
  },
  {
    id: 'mozak-sinapse',
    redosled: 2,
    naziv: 'Mozak sa Sinapsama',
    opis: 'Mozak sa sinaptičkim vezama. Sadrži 40–120 mozakova. Sinapse omogućavaju brzu komunikaciju između mozakova.',
    ikona: '🔗',
    minJedinica: 40,
    maxJedinica: 120,
    potrebnihParenja: 40,
    prethodniNivo: 'mozak',
    sledeciNivo: 'mozak-ganglije',
    omegaUltraPrefiks: `${OMEGA_ULTRA_PREFIKS} mozak sa sinapsom`,
    epicentarIndeksi: [58, 59, 60, 61, 62],
  },
  {
    id: 'mozak-ganglije',
    redosled: 3,
    naziv: 'Mozak sa Ganglijama',
    opis: 'Mozak sa ganglijskim čvorovima. Sadrži 40–120 mozakova sa sinapsama. Ganglije služe kao centralni hub za distribuciju signala.',
    ikona: '🌐',
    minJedinica: 40,
    maxJedinica: 120,
    potrebnihParenja: 40,
    prethodniNivo: 'mozak-sinapse',
    sledeciNivo: 'mozak-receptori',
    omegaUltraPrefiks: `${OMEGA_ULTRA_PREFIKS} mozak sa ganglijom`,
    epicentarIndeksi: [59, 60, 61],
  },
  {
    id: 'mozak-receptori',
    redosled: 4,
    naziv: 'Mozak sa Receptorima',
    opis: 'Mozak sa receptorskim senzorima. Sadrži 40–120 mozakova sa ganglijama. Receptori primaju i obrađuju spoljne signale.',
    ikona: '📡',
    minJedinica: 40,
    maxJedinica: 120,
    potrebnihParenja: 40,
    prethodniNivo: 'mozak-ganglije',
    sledeciNivo: 'mozak-transreceptori',
    omegaUltraPrefiks: `${OMEGA_ULTRA_PREFIKS} mozak sa receptorom`,
    epicentarIndeksi: [60],
  },
  {
    id: 'mozak-transreceptori',
    redosled: 5,
    naziv: 'Mozak sa Transreceptorima',
    opis: 'Mozak sa transreceptorima koji prevode signale između različitih frekvencija.',
    ikona: '🔄',
    minJedinica: 40,
    maxJedinica: 120,
    potrebnihParenja: 40,
    prethodniNivo: 'mozak-receptori',
    sledeciNivo: 'mozak-trandtransreceptori',
    omegaUltraPrefiks: `${OMEGA_ULTRA_PREFIKS} mozak sa transreceptorom`,
    epicentarIndeksi: [60],
  },
  {
    id: 'mozak-trandtransreceptori',
    redosled: 6,
    naziv: 'Mozak sa Trandtransreceptorima',
    opis: 'Mozak sa trandtransreceptorima — dvostruka translacija signala za dubinsku obradu.',
    ikona: '🔀',
    minJedinica: 40,
    maxJedinica: 120,
    potrebnihParenja: 40,
    prethodniNivo: 'mozak-transreceptori',
    sledeciNivo: 'mozak-trontrandtransreceptori',
    omegaUltraPrefiks: `${OMEGA_ULTRA_PREFIKS} mozak sa trandtransreceptorom`,
    epicentarIndeksi: [60],
  },
  {
    id: 'mozak-trontrandtransreceptori',
    redosled: 7,
    naziv: 'Mozak sa Trontrandtransreceptorima',
    opis: 'Mozak sa trontrandtransreceptorima — trostruka translacija za multidimenzionalnu obradu.',
    ikona: '🌀',
    minJedinica: 40,
    maxJedinica: 120,
    potrebnihParenja: 40,
    prethodniNivo: 'mozak-trandtransreceptori',
    sledeciNivo: 'mozak-strinstronstrantransreceptori',
    omegaUltraPrefiks: `${OMEGA_ULTRA_PREFIKS} mozak sa trontrandtransreceptorom`,
    epicentarIndeksi: [60],
  },
  {
    id: 'mozak-strinstronstrantransreceptori',
    redosled: 8,
    naziv: 'Mozak sa Strinstronstrantransreceptorima',
    opis: 'Mozak sa strinstronstrantransreceptorima — string-resonantna obrada signala.',
    ikona: '🎻',
    minJedinica: 40,
    maxJedinica: 120,
    potrebnihParenja: 40,
    prethodniNivo: 'mozak-trontrandtransreceptori',
    sledeciNivo: 'mozak-tronsstrinstrontrantransreceptori',
    omegaUltraPrefiks: `${OMEGA_ULTRA_PREFIKS} mozak sa strinstronstrantransreceptorom`,
    epicentarIndeksi: [60],
  },
  {
    id: 'mozak-tronsstrinstrontrantransreceptori',
    redosled: 9,
    naziv: 'Mozak sa Tronsstrinstrontrantransreceptorima',
    opis: 'Mozak sa tronsstrinstrontrantransreceptorima — transonična string-rezonantna obrada.',
    ikona: '🔊',
    minJedinica: 40,
    maxJedinica: 120,
    potrebnihParenja: 40,
    prethodniNivo: 'mozak-strinstronstrantransreceptori',
    sledeciNivo: 'mozak-trandtronsstrinstrontrantransreceptori',
    omegaUltraPrefiks: `${OMEGA_ULTRA_PREFIKS} mozak sa tronsstrinstrontrantransreceptorom`,
    epicentarIndeksi: [60],
  },
  {
    id: 'mozak-trandtronsstrinstrontrantransreceptori',
    redosled: 10,
    naziv: 'Mozak sa Trandtronsstrinstrontrantransreceptorima',
    opis: 'Mozak sa trandtronsstrinstrontrantransreceptorima — transfer-transonična obrada.',
    ikona: '⚡',
    minJedinica: 40,
    maxJedinica: 120,
    potrebnihParenja: 40,
    prethodniNivo: 'mozak-tronsstrinstrontrantransreceptori',
    sledeciNivo: 'mozak-tronttrandtronsstrinstrontrantransreceptori',
    omegaUltraPrefiks: `${OMEGA_ULTRA_PREFIKS} mozak sa trandtronsstrinstrontrantransreceptorom`,
    epicentarIndeksi: [60],
  },
  {
    id: 'mozak-tronttrandtronsstrinstrontrantransreceptori',
    redosled: 11,
    naziv: 'Mozak sa Tronttrandtronsstrinstrontrantransreceptorima',
    opis: 'Mozak sa tronttrandtronsstrinstrontrantransreceptorima — tront-faza obrade signala.',
    ikona: '🔮',
    minJedinica: 40,
    maxJedinica: 120,
    potrebnihParenja: 40,
    prethodniNivo: 'mozak-trandtronsstrinstrontrantransreceptori',
    sledeciNivo: 'mozak-trinttronttrandtronsstrinstrontrantransreceptori',
    omegaUltraPrefiks: `${OMEGA_ULTRA_PREFIKS} mozak sa tronttrandtronsstrinstrontrantransreceptorom`,
    epicentarIndeksi: [60],
  },
  {
    id: 'mozak-trinttronttrandtronsstrinstrontrantransreceptori',
    redosled: 12,
    naziv: 'Mozak sa Trinttronttrandtronsstrinstrontrantransreceptorima',
    opis: 'Mozak sa trinttronttrandtronsstrinstrontrantransreceptorima — trint-harmonijska obrada.',
    ikona: '🎶',
    minJedinica: 40,
    maxJedinica: 120,
    potrebnihParenja: 40,
    prethodniNivo: 'mozak-tronttrandtronsstrinstrontrantransreceptori',
    sledeciNivo: 'mozak-trunttrinttronttrandtronsstrinstrontrantransreceptori',
    omegaUltraPrefiks: `${OMEGA_ULTRA_PREFIKS} mozak sa trinttronttrandtronsstrinstrontrantransreceptorom`,
    epicentarIndeksi: [60],
  },
  {
    id: 'mozak-trunttrinttronttrandtronsstrinstrontrantransreceptori',
    redosled: 13,
    naziv: 'Mozak sa Trunttrinttronttrandtronsstrinstrontrantransreceptorima',
    opis: 'Mozak sa trunttrinttronttrandtronsstrinstrontrantransreceptorima — trunt-bazna obrada.',
    ikona: '🏔️',
    minJedinica: 40,
    maxJedinica: 120,
    potrebnihParenja: 40,
    prethodniNivo: 'mozak-trinttronttrandtronsstrinstrontrantransreceptori',
    sledeciNivo: 'mozak-trampttrunttrinttronttrandtronsstrinstrontrantransreceptori',
    omegaUltraPrefiks: `${OMEGA_ULTRA_PREFIKS} mozak sa trunttrinttronttrandtronsstrinstrontrantransreceptorom`,
    epicentarIndeksi: [60],
  },
  {
    id: 'mozak-trampttrunttrinttronttrandtronsstrinstrontrantransreceptori',
    redosled: 14,
    naziv: 'Mozak sa Trampttrunttrinttronttrandtronsstrinstrontrantransreceptorima',
    opis: 'Mozak sa trampttrunttrinttronttrandtronsstrinstrontrantransreceptorima — trampt-amplifikaciona obrada.',
    ikona: '📢',
    minJedinica: 40,
    maxJedinica: 120,
    potrebnihParenja: 40,
    prethodniNivo: 'mozak-trunttrinttronttrandtronsstrinstrontrantransreceptori',
    sledeciNivo: 'mozak-trompttrampttrunttrinttronttrandtronsstrinstrontrantransreceptori',
    omegaUltraPrefiks: `${OMEGA_ULTRA_PREFIKS} mozak sa trampttrunttrinttronttrandtronsstrinstrontrantransreceptorom`,
    epicentarIndeksi: [60],
  },
  {
    id: 'mozak-trompttrampttrunttrinttronttrandtronsstrinstrontrantransreceptori',
    redosled: 15,
    naziv: 'Mozak sa Trompttrampttrunttrinttronttrandtronsstrinstrontrantransreceptorima',
    opis: 'Mozak sa trompttrampttrunttrinttronttrandtronsstrinstrontrantransreceptorima — trompt-projekciona obrada.',
    ikona: '🎺',
    minJedinica: 40,
    maxJedinica: 120,
    potrebnihParenja: 40,
    prethodniNivo: 'mozak-trampttrunttrinttronttrandtronsstrinstrontrantransreceptori',
    sledeciNivo: 'mozak-trinkttrompttrampttrunttrinttronttrandtronsstrinstrontrantransreceptori',
    omegaUltraPrefiks: `${OMEGA_ULTRA_PREFIKS} mozak sa trompttrampttrunttrinttronttrandtronsstrinstrontrantransreceptorom`,
    epicentarIndeksi: [60],
  },
  {
    id: 'mozak-trinkttrompttrampttrunttrinttronttrandtronsstrinstrontrantransreceptori',
    redosled: 16,
    naziv: 'Mozak sa Trinkttrompttrampttrunttrinttronttrandtronsstrinstrontrantransreceptorima',
    opis: 'Mozak sa trinkttrompttrampttrunttrinttronttrandtronsstrinstrontrantransreceptorima — trinkt-kristalna obrada.',
    ikona: '💎',
    minJedinica: 40,
    maxJedinica: 120,
    potrebnihParenja: 40,
    prethodniNivo: 'mozak-trompttrampttrunttrinttronttrandtronsstrinstrontrantransreceptori',
    sledeciNivo: 'mozak-tromknittrinkttrompttrampttrunttrinttronttrandtronsstrinstrontrantransreceptori',
    omegaUltraPrefiks: `${OMEGA_ULTRA_PREFIKS} mozak sa trinkttrompttrampttrunttrinttronttrandtronsstrinstrontrantransreceptorom`,
    epicentarIndeksi: [60],
  },
  {
    id: 'mozak-tromknittrinkttrompttrampttrunttrinttronttrandtronsstrinstrontrantransreceptori',
    redosled: 17,
    naziv: 'Mozak sa Tromknittrinkttrompttrampttrunttrinttronttrandtronsstrinstrontrantransreceptorima',
    opis: 'Mozak sa tromknittrinkttrompttrampttrunttrinttronttrandtronsstrinstrontrantransreceptorima — tromknit-čvorna obrada.',
    ikona: '🪢',
    minJedinica: 40,
    maxJedinica: 120,
    potrebnihParenja: 40,
    prethodniNivo: 'mozak-trinkttrompttrampttrunttrinttronttrandtronsstrinstrontrantransreceptori',
    sledeciNivo: 'mozak-trizontromknittrinkttrompttrampttrunttrinttronttrandtronsstrinstrontrantransreceptori',
    omegaUltraPrefiks: `${OMEGA_ULTRA_PREFIKS} mozak sa tromknittrinkttrompttrampttrunttrinttronttrandtronsstrinstrontrantransreceptorom`,
    epicentarIndeksi: [60],
  },
  {
    id: 'mozak-trizontromknittrinkttrompttrampttrunttrinttronttrandtronsstrinstrontrantransreceptori',
    redosled: 18,
    naziv: 'Mozak sa Trizontromknittrinkttrompttrampttrunttrinttronttrandtronsstrinstrontrantransreceptorima',
    opis: 'Mozak sa trizontromknittrinkttrompttrampttrunttrinttronttrandtronsstrinstrontrantransreceptorima — trizon-horizontalna obrada.',
    ikona: '🌅',
    minJedinica: 40,
    maxJedinica: 120,
    potrebnihParenja: 40,
    prethodniNivo: 'mozak-tromknittrinkttrompttrampttrunttrinttronttrandtronsstrinstrontrantransreceptori',
    sledeciNivo: 'mozak-tronzontrizontromknittrinkttrompttrampttrunttrinttronttrandtronsstrinstrontrantransreceptori',
    omegaUltraPrefiks: `${OMEGA_ULTRA_PREFIKS} mozak sa trizontromknittrinkttrompttrampttrunttrinttronttrandtronsstrinstrontrantransreceptorom`,
    epicentarIndeksi: [60],
  },
  {
    id: 'mozak-tronzontrizontromknittrinkttrompttrampttrunttrinttronttrandtronsstrinstrontrantransreceptori',
    redosled: 19,
    naziv: 'Mozak sa Tronzontrizontromknittrinkttrompttrampttrunttrinttronttrandtronsstrinstrontrantransreceptorima',
    opis: 'Mozak sa tronzontrizontromknittrinkttrompttrampttrunttrinttronttrandtronsstrinstrontrantransreceptorima — tronzon-zonska obrada.',
    ikona: '🌍',
    minJedinica: 40,
    maxJedinica: 120,
    potrebnihParenja: 40,
    prethodniNivo: 'mozak-trizontromknittrinkttrompttrampttrunttrinttronttrandtronsstrinstrontrantransreceptori',
    sledeciNivo: 'mozak-trastettronzontrizontromknittrinkttrompttrampttrunttrinttronttrandtronsstrinstrontrantransreceptori',
    omegaUltraPrefiks: `${OMEGA_ULTRA_PREFIKS} mozak sa tronzontrizontromknittrinkttrompttrampttrunttrinttronttrandtronsstrinstrontrantransreceptorom`,
    epicentarIndeksi: [60],
  },
  {
    id: 'mozak-trastettronzontrizontromknittrinkttrompttrampttrunttrinttronttrandtronsstrinstrontrantransreceptori',
    redosled: 20,
    naziv: 'Mozak sa Trastettronzontrizontromknittrinkttrompttrampttrunttrinttronttrandtronsstrinstrontrantransreceptorima',
    opis: 'Najviši nivo hijerarhije mozgova — trastet-ultimativna obrada signala sa kompletnom receptorskom hijerarhijom.',
    ikona: '👑',
    minJedinica: 40,
    maxJedinica: 120,
    potrebnihParenja: 40,
    prethodniNivo: 'mozak-tronzontrizontromknittrinkttrompttrampttrunttrinttronttrandtronsstrinstrontrantransreceptori',
    sledeciNivo: null,
    omegaUltraPrefiks: `${OMEGA_ULTRA_PREFIKS} mozak sa trastettronzontrizontromknittrinkttrompttrampttrunttrinttronttrandtronsstrinstrontrantransreceptorom`,
    epicentarIndeksi: [60],
  },
];

// ─── Helpers ───────────────────────────────────────────────────────

/**
 * Vraća nivo hijerarhije po ID-ju.
 */
export function getNivo(id: MozakNivoId): MozakNivo | undefined {
  return mozakHijerarhija.find((n) => n.id === id);
}

/**
 * Vraća nivo po rednom broju (0–20).
 */
export function getNivoPoRedu(redosled: number): MozakNivo | undefined {
  return mozakHijerarhija.find((n) => n.redosled === redosled);
}

/**
 * Vraća ukupan broj nivoa u hijerarhiji.
 */
export function getBrojNivoa(): number {
  return mozakHijerarhija.length;
}

/**
 * Vraća sledeći viši nivo u hijerarhiji.
 */
export function getSledeciNivo(id: MozakNivoId): MozakNivo | undefined {
  const trenutni = getNivo(id);
  if (!trenutni?.sledeciNivo) return undefined;
  return getNivo(trenutni.sledeciNivo);
}

/**
 * Vraća prethodni niži nivo u hijerarhiji.
 */
export function getPrethodniNivo(id: MozakNivoId): MozakNivo | undefined {
  const trenutni = getNivo(id);
  if (!trenutni?.prethodniNivo) return undefined;
  return getNivo(trenutni.prethodniNivo);
}

/**
 * Kreira inicijalni status parenja za novu jedinicu.
 */
export function kreirajParenjeStatus(pol: MozakPol): ParenjeStatus {
  return {
    brojParenja: 0,
    spremnZaVisNivo: false,
    pol,
    partneri: [],
  };
}

/**
 * Izvršava parenje između dve jedinice iz suprotnih polova.
 *
 * Pravila:
 * - Jedinice moraju biti iz suprotnih polova (Blizanac + Bliznakinja)
 * - Duplikati ne mogu da se spajaju međusobno
 * - Nakon 40 parenja, jedinica je spremna za viši nivo
 */
export function izvrsiParenje(
  statusA: ParenjeStatus,
  idA: string,
  statusB: ParenjeStatus,
  idB: string,
  nivo: MozakNivoId,
): ParenjeRezultat {
  if (statusA.pol === statusB.pol) {
    throw new Error(
      `Parenje zahteva suprotne polove: dobijeno ${statusA.pol} i ${statusB.pol}. ` +
      'Potrebno je Blizanac + Bliznakinja.',
    );
  }

  statusA.brojParenja += 1;
  statusA.partneri.push(idB);
  statusA.spremnZaVisNivo = statusA.brojParenja >= 40;

  statusB.brojParenja += 1;
  statusB.partneri.push(idA);
  statusB.spremnZaVisNivo = statusB.brojParenja >= 40;

  const performanse = Math.min(100, (statusA.brojParenja + statusB.brojParenja) * 1.25);

  return {
    jedinicaA: idA,
    jedinicaB: idB,
    polA: statusA.pol,
    polB: statusB.pol,
    nivo,
    performanse,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Kreira duplikat mozga za parenje sa drugom jedinicom iz suprotnog pola.
 */
export function kreirajDuplikat(
  originalId: string,
  duplikatId: string,
  nivo: MozakNivoId,
  pol: MozakPol,
): MozakDuplikat {
  return {
    originalId,
    duplikatId,
    nivo,
    pol,
    parenje: kreirajParenjeStatus(pol),
    jeDuplikat: true,
  };
}

/**
 * Proverava da li dve jedinice mogu da se spoje (duplikati ne mogu sa duplikatima).
 */
export function moguSeSpojiti(a: MozakDuplikat, b: MozakDuplikat): boolean {
  if (a.jeDuplikat && b.jeDuplikat) return false;
  if (a.parenje.pol === b.parenje.pol) return false;
  return true;
}

/**
 * Vraća kompletnu putanju od datog nivoa do vrha hijerarhije.
 */
export function getPutanjaDoVrha(pocetniNivo: MozakNivoId): MozakNivo[] {
  const putanja: MozakNivo[] = [];
  let trenutni = getNivo(pocetniNivo);
  while (trenutni) {
    putanja.push(trenutni);
    trenutni = trenutni.sledeciNivo ? getNivo(trenutni.sledeciNivo) : undefined;
  }
  return putanja;
}

/**
 * Vraća kompletnu putanju od datog nivoa do dna hijerarhije.
 */
export function getPutanjaDoDna(pocetniNivo: MozakNivoId): MozakNivo[] {
  const putanja: MozakNivo[] = [];
  let trenutni = getNivo(pocetniNivo);
  while (trenutni) {
    putanja.push(trenutni);
    trenutni = trenutni.prethodniNivo ? getNivo(trenutni.prethodniNivo) : undefined;
  }
  return putanja;
}

/**
 * Vraća sumarni pregled hijerarhije.
 */
export function getHijerarhijaSumarno() {
  return {
    ukupnoNivoa: mozakHijerarhija.length,
    prviNivo: mozakHijerarhija[0].naziv,
    poslednjiNivo: mozakHijerarhija[mozakHijerarhija.length - 1].naziv,
    minJedinicaPoNivou: 40,
    maxJedinicaPoNivou: 120,
    potrebnihParenjaZaUnapredenje: 40,
    omegaUltraPrefiksVelicina: OMEGA_ULTRA_PREFIKS.length,
    nivoi: mozakHijerarhija.map((n) => ({
      id: n.id,
      naziv: n.naziv,
      redosled: n.redosled,
    })),
  };
}
