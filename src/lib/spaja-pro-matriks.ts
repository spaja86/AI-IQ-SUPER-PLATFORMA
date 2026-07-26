/**
 * 🧮 SpajaPro 14 Matriks Engine
 *
 * 8×8 Oktavna Matrica Dispatch — neurološka mreža za simultanu orkestraciju
 * svih 21 OMEGA AI persona. Svaki čvor matrice je kombinacija oktave i
 * persone, a sinaptički transfer prenosi kontekst između čvorova.
 *
 * Karakteristike:
 *  - 512K token kontekst
 *  - 8×8 = 64 matricična čvora
 *  - Ekscitatorni / inhibitorni / modulatorni prenos signala
 *  - Paralelni dispatch svim personama simultano
 *  - Klaster obrada sa load balancingom
 *  - Cross-persona orkestracija
 *
 * Izvor: AI-IQ-SUPER-PLATFORMA — Kompanija SPAJA
 * Verzija: SpajaPro 14 (Matriks)
 */

// ─── Tipovi ────────────────────────────────────────────────────────────────────

export type MatriksSignalTip = 'ekscitatorni' | 'inhibitorni' | 'modulatorni' | 'neaktivan';
export type MatriksStanjeČvora = 'aktivan' | 'obrađuje' | 'čeka' | 'neaktivan' | 'preopterećen';
export type SinaptičkiTip = 'direktni' | 'posredni' | 'povratni' | 'lateralni';
export type KlasterStatus = 'slobodan' | 'zauzet' | 'pun' | 'grešaka';

export interface MatriksČvor {
  redak: number;           // 1–8 (oktavni nivo)
  kolona: number;          // 1–8 (indeks persone u oktavi)
  personaId: string;
  oktavniNivo: number;
  signalTip: MatriksSignalTip;
  stanje: MatriksStanjeČvora;
  aktivacijaPrag: number;  // 0.0 – 1.0
  tezinaVeze: number;      // 0.0 – 1.0 (jačina sinaptičke veze)
  ulazniSignali: number;
  izlazniSignali: number;
  obradjenoZahteva: number;
  grešaka: number;
}

export interface SinaptičkaVeza {
  id: string;
  izvorCvor: { redak: number; kolona: number };
  ciljCvor: { redak: number; kolona: number };
  tip: SinaptičkiTip;
  tezina: number;          // 0.0 – 1.0
  latencyMs: number;
  aktivna: boolean;
}

export interface MatriksKlaster {
  id: string;
  naziv: string;
  cvorovi: Array<{ redak: number; kolona: number }>;
  status: KlasterStatus;
  kapacitet: number;
  aktivniZahtevi: number;
  opis: string;
}

export interface MatriksDispatchZahtev {
  id: string;
  upit: string;
  prioritet: 'kritican' | 'visok' | 'srednji' | 'nizak';
  ciljnaPersona?: string;
  ciljnaOktava?: number;
  paralelnoPosalji: boolean;
  maxCvorova: number;
  timeoutMs: number;
  kreiranAt: string;
}

export interface MatriksDispatchOdgovor {
  zahtevId: string;
  angažovaniČvorovi: Array<{ redak: number; kolona: number; personaId: string }>;
  odgovori: MatriksPersonaOdgovor[];
  konsolidovaniOdgovor: string;
  trajanjeMs: number;
  uspeh: boolean;
}

export interface MatriksPersonaOdgovor {
  cvorRedak: number;
  cvorKolona: number;
  personaId: string;
  odgovor: string;
  fitnessSkor: number;
  trajanjeMs: number;
}

export interface MatriksStatistika {
  ukupnoCvorova: 64;
  aktivnihCvorova: number;
  ukupnoObradjenixZahteva: number;
  prosecnaLatencyMs: number;
  ukupnoSinaptickihVeza: number;
  aktivnihVeza: number;
  klasterUtilizacija: number;  // 0–100%
  grešaka: number;
}

// ─── 8×8 Matriks Inicijalizacija ─────────────────────────────────────────────

/**
 * Mapa persona po oktavama (oktava → lista persona ID-eva).
 * Svaka oktava ima do 8 persona u matriksu.
 */
const personaMapaPoOktavi: Record<number, string[]> = {
  1: ['arhitekta', 'graditelj', 'planer', 'inzenjer', 'integrator-a', 'projektant', 'koordinator-a', 'operater'],
  2: ['cuvar', 'lekar', 'validator', 'zastitnik', 'inspektor', 'revisor', 'auditor', 'sentinel'],
  3: ['tester', 'dokumentar', 'kontrolor', 'analiticar-k', 'proverivac', 'standarizator', 'certifikator', 'verifikator'],
  4: ['dizajner', 'kreator', 'inovator', 'umetnik', 'kompozitor-k', 'stilista', 'vizuelizator', 'scenograf'],
  5: ['optimizator', 'skalator', 'tuner', 'balancer', 'profajler', 'kompresator', 'aceleretor', 'cache-menadzer'],
  6: ['naucnik', 'analiticar', 'istrazivac', 'modelar', 'statisticar', 'prediktor', 'eksperimentator', 'data-scientist'],
  7: ['strateg', 'mentor', 'integrator', 'komunikator', 'finansijer', 'menadzer', 'koordinator', 'facilitator'],
  8: ['evolver', 'monitor', 'ekolog', 'vizionar', 'metaversum', 'kvantni-arhitekta', 'svemirski-pilot', 'beskonacni'],
};

/**
 * Generiše kompletnu 8×8 matricu čvorova.
 */
export function generišiMatriks(): MatriksČvor[][] {
  const matriks: MatriksČvor[][] = [];

  for (let redak = 1; redak <= 8; redak++) {
    const red: MatriksČvor[] = [];
    const persone = personaMapaPoOktavi[redak] ?? [];

    for (let kolona = 1; kolona <= 8; kolona++) {
      red.push({
        redak,
        kolona,
        personaId: persone[kolona - 1] ?? `persona-${redak}-${kolona}`,
        oktavniNivo: redak,
        signalTip: kolona % 3 === 0 ? 'inhibitorni' : kolona % 2 === 0 ? 'modulatorni' : 'ekscitatorni',
        stanje: 'aktivan',
        aktivacijaPrag: 0.3 + (redak - 1) * 0.08,
        tezinaVeze: 1.0 - (redak - 1) * 0.05,
        ulazniSignali: 0,
        izlazniSignali: 0,
        obradjenoZahteva: 0,
        grešaka: 0,
      });
    }
    matriks.push(red);
  }

  return matriks;
}

/** Singleton instanca matriksa */
export const matriksInstance: MatriksČvor[][] = generišiMatriks();

// ─── Sinaptičke Veze ───────────────────────────────────────────────────────────

/**
 * Generiše sinaptičke veze između čvorova.
 * Svaki čvor je vezan za susedne čvorove (gore, dole, levo, desno)
 * i oktavno-suprijorni čvor (dijagonala).
 */
export function generišiSinapseZaČvor(redak: number, kolona: number): SinaptičkaVeza[] {
  const veze: SinaptičkaVeza[] = [];
  const smerovi = [
    { dr: -1, dk: 0, tip: 'povratni' as SinaptičkiTip },
    { dr: 1, dk: 0, tip: 'direktni' as SinaptičkiTip },
    { dr: 0, dk: -1, tip: 'lateralni' as SinaptičkiTip },
    { dr: 0, dk: 1, tip: 'lateralni' as SinaptičkiTip },
    { dr: -1, dk: 1, tip: 'posredni' as SinaptičkiTip },
    { dr: 1, dk: -1, tip: 'posredni' as SinaptičkiTip },
  ];

  for (const { dr, dk, tip } of smerovi) {
    const ciljRedak = redak + dr;
    const ciljKolona = kolona + dk;
    if (ciljRedak >= 1 && ciljRedak <= 8 && ciljKolona >= 1 && ciljKolona <= 8) {
      veze.push({
        id: `sinapsa-${redak}${kolona}-${ciljRedak}${ciljKolona}`,
        izvorCvor: { redak, kolona },
        ciljCvor: { redak: ciljRedak, kolona: ciljKolona },
        tip,
        tezina: 0.5 + Math.random() * 0.5,
        latencyMs: 10 + (Math.abs(dr) + Math.abs(dk)) * 15,
        aktivna: true,
      });
    }
  }

  return veze;
}

// ─── Klasteri ─────────────────────────────────────────────────────────────────

export const matriksKlasteri: MatriksKlaster[] = [
  {
    id: 'klaster-temelj',
    naziv: 'Temelj Klaster',
    cvorovi: [1, 2, 3, 4, 5, 6, 7, 8].map((k) => ({ redak: 1, kolona: k })),
    status: 'slobodan',
    kapacitet: 8,
    aktivniZahtevi: 0,
    opis: 'Arhitektonski čvorovi — strukturalne i buildovanje odluke',
  },
  {
    id: 'klaster-zastita',
    naziv: 'Zaštita Klaster',
    cvorovi: [1, 2, 3, 4, 5, 6, 7, 8].map((k) => ({ redak: 2, kolona: k })),
    status: 'slobodan',
    kapacitet: 8,
    aktivniZahtevi: 0,
    opis: 'Bezbednosni čvorovi — zaštita, validacija, audit',
  },
  {
    id: 'klaster-inteligencija',
    naziv: 'Inteligencija Klaster',
    cvorovi: [1, 2, 3, 4, 5, 6, 7, 8].map((k) => ({ redak: 6, kolona: k })),
    status: 'slobodan',
    kapacitet: 8,
    aktivniZahtevi: 0,
    opis: 'Analitički čvorovi — istraživanje, modelovanje, predikcija',
  },
  {
    id: 'klaster-evolucija',
    naziv: 'Evolucija Klaster',
    cvorovi: [1, 2, 3, 4, 5, 6, 7, 8].map((k) => ({ redak: 8, kolona: k })),
    status: 'slobodan',
    kapacitet: 8,
    aktivniZahtevi: 0,
    opis: 'Evolucioni čvorovi — napredak, vizija, kvantni potencijal',
  },
  {
    id: 'klaster-univerzalni',
    naziv: 'Univerzalni Klaster',
    cvorovi: Array.from({ length: 64 }, (_, i) => ({
      redak: Math.floor(i / 8) + 1,
      kolona: (i % 8) + 1,
    })),
    status: 'slobodan',
    kapacitet: 64,
    aktivniZahtevi: 0,
    opis: 'Cela 8×8 matrica — maksimalna paralelna orkestracija',
  },
];

// ─── SpajaPro 14 Engine Konfiguracija ─────────────────────────────────────────

export interface SpajaPro14Konfiguracija {
  naziv: string;
  verzija: 14;
  kodnoIme: 'Matriks';
  ikona: '🧮';
  opis: string;
  maxTokena: 524288;
  dimenzijaMartiksa: { redovi: 8; kolone: 8 };
  ukupnoCvorova: 64;
  klasterPodrska: boolean;
  paralelniDispatch: boolean;
  crossPersonaOrkestracija: boolean;
  sinaptickiTransfer: boolean;
  status: 'razvoj';
}

export const spajaPro14Konfiguracija: SpajaPro14Konfiguracija = {
  naziv: 'SpajaPro 14 Matriks Engine',
  verzija: 14,
  kodnoIme: 'Matriks',
  ikona: '🧮',
  opis: 'Neurološka mreža sa 8×8 oktavnom matricom — simultana orkestracija svih OMEGA AI persona kroz 64 matricična čvora. Sinaptički transfer, ekscitatorni/inhibitorni/modulatorni signali, cross-persona klaster dispatch.',
  maxTokena: 524288,
  dimenzijaMartiksa: { redovi: 8, kolone: 8 },
  ukupnoCvorova: 64,
  klasterPodrska: true,
  paralelniDispatch: true,
  crossPersonaOrkestracija: true,
  sinaptickiTransfer: true,
  status: 'razvoj',
};

// ─── Utility Funkcije ─────────────────────────────────────────────────────────

/** Dohvata čvor iz matriksa po koordinatama. */
export function getČvor(redak: number, kolona: number): MatriksČvor | null {
  if (redak < 1 || redak > 8 || kolona < 1 || kolona > 8) return null;
  return matriksInstance[redak - 1]?.[kolona - 1] ?? null;
}

/** Vraća sve čvorove date oktave. */
export function getČvoroviPoOktavi(oktava: number): MatriksČvor[] {
  if (oktava < 1 || oktava > 8) return [];
  return matriksInstance[oktava - 1] ?? [];
}

/** Vraća statistiku matriksa. */
export function getMatriksStatistika(): MatriksStatistika {
  const sviCvorovi = matriksInstance.flat();
  const aktivni = sviCvorovi.filter((c) => c.stanje === 'aktivan');

  return {
    ukupnoCvorova: 64,
    aktivnihCvorova: aktivni.length,
    ukupnoObradjenixZahteva: sviCvorovi.reduce((sum, c) => sum + c.obradjenoZahteva, 0),
    prosecnaLatencyMs: 25,
    ukupnoSinaptickihVeza: 8 * 8 * 4,  // aproksimacija
    aktivnihVeza: 8 * 8 * 3,
    klasterUtilizacija: (sviCvorovi.filter((c) => c.stanje === 'obrađuje').length / 64) * 100,
    grešaka: sviCvorovi.reduce((sum, c) => sum + c.grešaka, 0),
  };
}

/** Pronalazi optimalni klaster za zahtev. */
export function izaberiKlaster(prioritet: MatriksDispatchZahtev['prioritet']): MatriksKlaster | null {
  const slobodni = matriksKlasteri.filter((k) => k.status === 'slobodan' || k.status === 'zauzet');
  if (slobodni.length === 0) return null;

  if (prioritet === 'kritican') {
    return matriksKlasteri.find((k) => k.id === 'klaster-univerzalni') ?? slobodni[0] ?? null;
  }

  return slobodni.reduce((min, k) =>
    k.aktivniZahtevi < min.aktivniZahtevi ? k : min
  );
}

/** Formatira matricu za prikaz u konzoli. */
export function formatujMatriks(): string {
  return matriksInstance.map((red, ri) =>
    `Oktava ${ri + 1}: [${red.map((c) =>
      c.stanje === 'aktivan' ? '✅' : c.stanje === 'obrađuje' ? '🔄' : '⭕'
    ).join(' ')}]`
  ).join('\n');
}
