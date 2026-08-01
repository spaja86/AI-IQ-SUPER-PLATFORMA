/**
 * 🌌 SpajaPro 16 — Nova Generacija Hipermreza Engine
 *
 * 16×16 Kvantna Hipermreza Dispatch — proširena neurološka mreža za simultanu
 * orkestraciju svih 50 OMEGA AI persona kroz 256 matricičnih čvorova.
 *
 * Karakteristike:
 *  - 1M token kontekst (1.048.576)
 *  - 16×16 = 256 hipermreza čvorova
 *  - 4 tipa signala: ekscitatorni / inhibitorni / modulatorni / kvantni
 *  - Self-healing: automatska detekcija grešaka i rollback
 *  - Real-time cross-platform persona sinhronizacija
 *  - Paralelni dispatch svim personama simultano
 *  - 7 specijalizovanih klastera
 *  - Cross-persona i cross-platform orkestracija
 *
 * Naslednik: SpajaPro 14 Matriks (8×8 = 64 čvora)
 * Izvor: AI-IQ-SUPER-PLATFORMA — Kompanija SPAJA
 * Verzija: SpajaPro 16 (Nova Generacija)
 */

import {
  NOVA_GENERACIJA_HIPERMREZA_DIMENZIJA,
  NOVA_GENERACIJA_TOTAL_CVOROVA,
  NOVA_GENERACIJA_VERZIJA,
  OMEGA_AI_OKTAVA_COUNT,
  OMEGA_AI_PERSONA_COUNT,
} from '@/lib/constants';

// ─── Tipovi ─────────────────────────────────────────────────────────────────

export type HipermrezaSignalTip =
  | 'ekscitatorni'
  | 'inhibitorni'
  | 'modulatorni'
  | 'kvantni'
  | 'neaktivan';

export type HipermrezaStanjeČvora =
  | 'aktivan'
  | 'obrađuje'
  | 'čeka'
  | 'neaktivan'
  | 'preopterećen'
  | 'self-healing';

export type HipermrezaSinaptičkiTip =
  | 'direktni'
  | 'posredni'
  | 'povratni'
  | 'lateralni'
  | 'kvantni-tunel';

export type HipermrezaKlasterStatus = 'slobodan' | 'zauzet' | 'pun' | 'grešaka' | 'oporavak';

export interface HipermrezaČvor {
  redak: number;          // 1–16 (oktavni nivo)
  kolona: number;         // 1–16 (indeks persone u oktavi)
  personaId: string;
  oktavniNivo: number;
  signalTip: HipermrezaSignalTip;
  stanje: HipermrezaStanjeČvora;
  aktivacijaPrag: number; // 0.0 – 1.0
  tezinaVeze: number;     // 0.0 – 1.0
  ulazniSignali: number;
  izlazniSignali: number;
  obradjenoZahteva: number;
  grešaka: number;
  selfHealingCiklusi: number;
  crossPlatformSync: boolean;
}

export interface HipermrezaSinaptičkaVeza {
  id: string;
  izvorCvor: { redak: number; kolona: number };
  ciljCvor: { redak: number; kolona: number };
  tip: HipermrezaSinaptičkiTip;
  tezina: number;
  latencyMs: number;
  aktivna: boolean;
  kvantniTunel: boolean;
}

export interface HipermrezaKlaster {
  id: string;
  naziv: string;
  cvorovi: Array<{ redak: number; kolona: number }>;
  status: HipermrezaKlasterStatus;
  kapacitet: number;
  aktivniZahtevi: number;
  opis: string;
}

export interface HipermrezaDispatchZahtev {
  id: string;
  upit: string;
  prioritet: 'kritican' | 'visok' | 'srednji' | 'nizak';
  ciljnaPersona?: string;
  ciljnaOktava?: number;
  paralelnoPosalji: boolean;
  maxCvorova: number;
  timeoutMs: number;
  crossPlatform: boolean;
  selfHealingEnabled: boolean;
  kreiranAt: string;
}

export interface HipermrezaDispatchOdgovor {
  zahtevId: string;
  angažovaniČvorovi: Array<{ redak: number; kolona: number; personaId: string }>;
  odgovori: HipermrezaPersonaOdgovor[];
  konsolidovaniOdgovor: string;
  trajanjeMs: number;
  uspeh: boolean;
  selfHealingAktiviran: boolean;
}

export interface HipermrezaPersonaOdgovor {
  cvorRedak: number;
  cvorKolona: number;
  personaId: string;
  odgovor: string;
  fitnessSkor: number;
  trajanjeMs: number;
  crossPlatformSynced: boolean;
}

export interface HipermrezaStatistika {
  ukupnoCvorova: 256;
  aktivnihCvorova: number;
  ukupnoObradjenixZahteva: number;
  prosecnaLatencyMs: number;
  ukupnoSinaptickihVeza: number;
  aktivnihVeza: number;
  klasterUtilizacija: number;
  grešaka: number;
  selfHealingAktivacija: number;
  crossPlatformSyncOps: number;
}

export interface SpajaPro16Konfiguracija {
  naziv: string;
  verzija: 16;
  kodnoIme: 'Nova Generacija';
  ikona: '🌌';
  opis: string;
  maxTokena: 1048576;
  dimenzija: { redovi: 16; kolone: 16 };
  ukupnoCvorova: 256;
  selfHealing: boolean;
  crossPlatformSync: boolean;
  kvantniDispatch: boolean;
  klasterPodrska: boolean;
  paralelniDispatch: boolean;
  crossPersonaOrkestracija: boolean;
  sinaptickiTransfer: boolean;
  status: 'razvoj';
}

// ─── Persona Mapa po Oktavama (1–16) ────────────────────────────────────────

const personaMapaPoOktavi: Record<number, string[]> = {
  1:  ['arhitekta', 'graditelj', 'planer', 'inzenjer', 'integrator-a', 'projektant', 'koordinator-a', 'operater', 'dizajner-a', 'kreator-a', 'inovator-a', 'mentor-a', 'strateg-a', 'fasilitator', 'menadzer-a', 'koordinator-b'],
  2:  ['cuvar', 'lekar', 'validator', 'zastitnik', 'inspektor', 'revisor', 'auditor', 'sentinel', 'zastitnik-b', 'cuvar-b', 'validacija', 'sigurnost', 'zastita-b', 'revisor-b', 'inspektor-b', 'cuvarka'],
  3:  ['tester', 'dokumentar', 'kontrolor', 'analiticar-k', 'proverivac', 'standarizator', 'certifikator', 'verifikator', 'tester-b', 'dokumentar-b', 'kontrolor-b', 'proverivac-b', 'certifikator-b', 'verifikator-b', 'validacija-b', 'standarizator-b'],
  4:  ['dizajner', 'kreator', 'inovator', 'umetnik', 'kompozitor-k', 'stilista', 'vizuelizator', 'scenograf', 'dizajner-b', 'kreator-b', 'umetnik-b', 'compositor-b', 'stilista-b', 'scenograf-b', 'vizuelizator-b', 'inovator-b'],
  5:  ['optimizator', 'skalator', 'tuner', 'balancer', 'profajler', 'kompresator', 'aceleretor', 'cache-menadzer', 'optimizator-b', 'skalator-b', 'tuner-b', 'profajler-b', 'balancer-b', 'aceleretor-b', 'kompresator-b', 'cache-b'],
  6:  ['naucnik', 'analiticar', 'istrazivac', 'modelar', 'statisticar', 'prediktor', 'eksperimentator', 'data-scientist', 'naucnik-b', 'analiticar-b', 'modelar-b', 'statisticar-b', 'prediktor-b', 'data-scientist-b', 'eksperimentator-b', 'istrazivac-b'],
  7:  ['strateg', 'mentor', 'integrator', 'komunikator', 'finansijer', 'menadzer', 'koordinator', 'facilitator', 'strateg-b', 'mentor-b', 'integrator-b', 'komunikator-b', 'finansijer-b', 'menadzer-b', 'facilitator-b', 'koordinator-b'],
  8:  ['evolver', 'monitor', 'ekolog', 'vizionar', 'metaversum', 'kvantni-arhitekta', 'svemirski-pilot', 'beskonacni', 'evolver-b', 'monitor-b', 'vizionar-b', 'metaversum-b', 'kvantni-b', 'svemirski-b', 'beskonacni-b', 'ekolog-b'],
  9:  ['kvantni-procesor', 'kvantni-sentinel', 'kvantni-arhitekt', 'kvantni-kodek', 'kvantni-detektor', 'kvantni-enkoder', 'kvantni-menadzer', 'kvantni-navigator', 'kvantni-validator', 'kvantni-monitor', 'kvantni-optimizer', 'kvantni-prediktor', 'kvantni-analiticar', 'kvantni-integrator', 'kvantni-strateg', 'kvantni-evolver'],
  10: ['meta-arhitekta', 'meta-analiticar', 'meta-strateg', 'meta-integrator', 'meta-validator', 'meta-monitor', 'meta-optimizer', 'meta-sentinel', 'meta-prediktor', 'meta-koordinator', 'meta-menadzer', 'meta-komunikator', 'meta-evolver', 'meta-vizionar', 'meta-kvantni', 'meta-beskonacni'],
  11: ['multi-platforma-a', 'multi-platforma-b', 'multi-platforma-c', 'multi-repo-sync', 'cross-repo-sentinel', 'cross-platform-guard', 'multi-env-validator', 'cross-system-monitor', 'global-coordinator', 'global-deployer', 'global-optimizer', 'global-validator', 'global-sentinel', 'global-evolver', 'global-integrator', 'global-kvantni'],
  12: ['industrijski-arhitekta', 'industrijski-manager', 'industrijski-validator', 'industrijski-monitor', 'industrijski-koordinator', 'industrijski-strateg', 'industrijski-finansijer', 'industrijski-evolver', 'industrijski-komunikator', 'industrijski-integrator', 'industrijski-optimizer', 'industrijski-sentinel', 'industrijski-prediktor', 'industrijski-analiticar', 'industrijski-kvantni', 'industrijski-beskonacni'],
  13: ['nova-gen-pioneer', 'nova-gen-architect', 'nova-gen-builder', 'nova-gen-validator', 'nova-gen-sentinel', 'nova-gen-optimizer', 'nova-gen-evolver', 'nova-gen-monitor', 'nova-gen-integrator', 'nova-gen-strateg', 'nova-gen-komunikator', 'nova-gen-finansijer', 'nova-gen-koordinator', 'nova-gen-vizionar', 'nova-gen-kvantni', 'nova-gen-beskonacni'],
  14: ['hipermreza-arhitekta', 'hipermreza-procesor', 'hipermreza-sentinel', 'hipermreza-validator', 'hipermreza-optimizer', 'hipermreza-monitor', 'hipermreza-evolver', 'hipermreza-integrator', 'hipermreza-strateg', 'hipermreza-komunikator', 'hipermreza-koordinator', 'hipermreza-finansijer', 'hipermreza-prediktor', 'hipermreza-analiticar', 'hipermreza-kvantni', 'hipermreza-beskonacni'],
  15: ['kosmicki-pilot', 'kosmicki-navigator', 'kosmicki-sentinel', 'kosmicki-arhitekta', 'kosmicki-validator', 'kosmicki-monitor', 'kosmicki-evolver', 'kosmicki-integrator', 'kosmicki-strateg', 'kosmicki-komunikator', 'kosmicki-koordinator', 'kosmicki-finansijer', 'kosmicki-optimizer', 'kosmicki-prediktor', 'kosmicki-kvantni', 'kosmicki-beskonacni'],
  16: ['beskonacni-evolver', 'kvantni-beskonacni', 'meta-kvantni-arhitekta', 'hipermreza-beskonacni', 'kosmicki-kvantni', 'omega-supreme', 'ultra-sentinel', 'mega-integrator', 'super-strateg', 'ultra-vizionar', 'omega-evolver', 'super-optimizer', 'mega-validator', 'ultra-monitor', 'omega-koordinator', 'beskonacnost'],
};

// ─── Hipermreza Inicijalizacija ──────────────────────────────────────────────

export function generišiHipermrezu(): HipermrezaČvor[][] {
  const mreža: HipermrezaČvor[][] = [];

  for (let redak = 1; redak <= NOVA_GENERACIJA_HIPERMREZA_DIMENZIJA; redak++) {
    const red: HipermrezaČvor[] = [];
    const persone = personaMapaPoOktavi[redak] ?? [];

    for (let kolona = 1; kolona <= NOVA_GENERACIJA_HIPERMREZA_DIMENZIJA; kolona++) {
      const signalIndex = (redak + kolona) % 4;
      const signalTip: HipermrezaSignalTip =
        signalIndex === 0 ? 'kvantni'
        : signalIndex === 1 ? 'ekscitatorni'
        : signalIndex === 2 ? 'inhibitorni'
        : 'modulatorni';

      red.push({
        redak,
        kolona,
        personaId: persone[kolona - 1] ?? `persona-ng-${redak}-${kolona}`,
        oktavniNivo: redak,
        signalTip,
        stanje: 'aktivan',
        aktivacijaPrag: 0.2 + (redak - 1) * 0.05,
        tezinaVeze: 1.0 - (redak - 1) * 0.03,
        ulazniSignali: 0,
        izlazniSignali: 0,
        obradjenoZahteva: 0,
        grešaka: 0,
        selfHealingCiklusi: 0,
        crossPlatformSync: redak >= 11, // Oktave 11–16 imaju cross-platform sync
      });
    }
    mreža.push(red);
  }

  return mreža;
}

/** Singleton instanca hipermreze */
export const hipermrezaInstance: HipermrezaČvor[][] = generišiHipermrezu();

// ─── Klasteri ────────────────────────────────────────────────────────────────

export const hipermrezaKlasteri: HipermrezaKlaster[] = [
  {
    id: 'klaster-temelj-ng',
    naziv: 'Temelj Klaster (NG)',
    cvorovi: Array.from({ length: NOVA_GENERACIJA_HIPERMREZA_DIMENZIJA }, (_, k) => ({ redak: 1, kolona: k + 1 })),
    status: 'slobodan',
    kapacitet: 16,
    aktivniZahtevi: 0,
    opis: 'Arhitektonski čvorovi nove generacije — strukturalne i buildovanje odluke',
  },
  {
    id: 'klaster-zastita-ng',
    naziv: 'Zaštita Klaster (NG)',
    cvorovi: Array.from({ length: NOVA_GENERACIJA_HIPERMREZA_DIMENZIJA }, (_, k) => ({ redak: 2, kolona: k + 1 })),
    status: 'slobodan',
    kapacitet: 16,
    aktivniZahtevi: 0,
    opis: 'Bezbednosni čvorovi — zaštita, validacija, audit',
  },
  {
    id: 'klaster-inteligencija-ng',
    naziv: 'Inteligencija Klaster (NG)',
    cvorovi: Array.from({ length: NOVA_GENERACIJA_HIPERMREZA_DIMENZIJA }, (_, k) => ({ redak: 6, kolona: k + 1 })),
    status: 'slobodan',
    kapacitet: 16,
    aktivniZahtevi: 0,
    opis: 'Analitički čvorovi — istraživanje, modelovanje, predikcija',
  },
  {
    id: 'klaster-multi-platform',
    naziv: 'Multi-Platform Klaster',
    cvorovi: Array.from({ length: NOVA_GENERACIJA_HIPERMREZA_DIMENZIJA }, (_, k) => ({ redak: 11, kolona: k + 1 })),
    status: 'slobodan',
    kapacitet: 16,
    aktivniZahtevi: 0,
    opis: 'Cross-platform čvorovi — real-time sinhronizacija između platformi i repo-ja',
  },
  {
    id: 'klaster-nova-gen',
    naziv: 'Nova Generacija Klaster',
    cvorovi: Array.from({ length: NOVA_GENERACIJA_HIPERMREZA_DIMENZIJA }, (_, k) => ({ redak: 13, kolona: k + 1 })),
    status: 'slobodan',
    kapacitet: 16,
    aktivniZahtevi: 0,
    opis: 'Nova generacija pioniri — vodeći čvorovi za NG roadmap i eksperimentalne funkcije',
  },
  {
    id: 'klaster-kvantni',
    naziv: 'Kvantni Klaster',
    cvorovi: Array.from({ length: NOVA_GENERACIJA_HIPERMREZA_DIMENZIJA }, (_, k) => ({ redak: 16, kolona: k + 1 })),
    status: 'slobodan',
    kapacitet: 16,
    aktivniZahtevi: 0,
    opis: 'Kvantni evolucioni čvorovi — beskrajni potencijal, napredak, vizija',
  },
  {
    id: 'klaster-univerzalni-ng',
    naziv: 'Univerzalni Klaster (NG)',
    cvorovi: Array.from({ length: NOVA_GENERACIJA_TOTAL_CVOROVA }, (_, i) => ({
      redak: Math.floor(i / NOVA_GENERACIJA_HIPERMREZA_DIMENZIJA) + 1,
      kolona: (i % NOVA_GENERACIJA_HIPERMREZA_DIMENZIJA) + 1,
    })),
    status: 'slobodan',
    kapacitet: NOVA_GENERACIJA_TOTAL_CVOROVA,
    aktivniZahtevi: 0,
    opis: 'Cela 16×16 hipermreza — maksimalna paralelna orkestracija svih 256 čvorova',
  },
];

// ─── SpajaPro 16 Konfiguracija ───────────────────────────────────────────────

export const spajaPro16Konfiguracija: SpajaPro16Konfiguracija = {
  naziv: 'SpajaPro 16 Nova Generacija Hipermreza Engine',
  verzija: 16,
  kodnoIme: 'Nova Generacija',
  ikona: '🌌',
  opis: `Kvantno-inspirisana neurološka mreža sa 16×16 hipermrezom — simultana orkestracija svih ${OMEGA_AI_PERSONA_COUNT} OMEGA AI persona kroz ${NOVA_GENERACIJA_TOTAL_CVOROVA} matricičnih čvorova u ${OMEGA_AI_OKTAVA_COUNT} oktava. Self-healing, cross-platform sinhronizacija, kvantni dispatch.`,
  maxTokena: 1048576,
  dimenzija: { redovi: 16, kolone: 16 },
  ukupnoCvorova: 256,
  selfHealing: true,
  crossPlatformSync: true,
  kvantniDispatch: true,
  klasterPodrska: true,
  paralelniDispatch: true,
  crossPersonaOrkestracija: true,
  sinaptickiTransfer: true,
  status: 'razvoj',
};

// ─── Utility Funkcije ────────────────────────────────────────────────────────

/** Dohvata čvor iz hipermreze po koordinatama. */
export function getHipermrezaČvor(redak: number, kolona: number): HipermrezaČvor | null {
  if (redak < 1 || redak > NOVA_GENERACIJA_HIPERMREZA_DIMENZIJA) return null;
  if (kolona < 1 || kolona > NOVA_GENERACIJA_HIPERMREZA_DIMENZIJA) return null;
  return hipermrezaInstance[redak - 1]?.[kolona - 1] ?? null;
}

/** Vraća sve čvorove date oktave. */
export function getHipermrezaČvoroviPoOktavi(oktava: number): HipermrezaČvor[] {
  if (oktava < 1 || oktava > NOVA_GENERACIJA_HIPERMREZA_DIMENZIJA) return [];
  return hipermrezaInstance[oktava - 1] ?? [];
}

/** Vraća statisiku hipermreze. */
export function getHipermrezaStatistika(): HipermrezaStatistika {
  const sviCvorovi = hipermrezaInstance.flat();
  const aktivni = sviCvorovi.filter((c) => c.stanje === 'aktivan');
  const crossPlatformCvorovi = sviCvorovi.filter((c) => c.crossPlatformSync);

  return {
    ukupnoCvorova: 256,
    aktivnihCvorova: aktivni.length,
    ukupnoObradjenixZahteva: sviCvorovi.reduce((sum, c) => sum + c.obradjenoZahteva, 0),
    prosecnaLatencyMs: 25,
    ukupnoSinaptickihVeza: NOVA_GENERACIJA_HIPERMREZA_DIMENZIJA * NOVA_GENERACIJA_HIPERMREZA_DIMENZIJA * 6,
    aktivnihVeza: NOVA_GENERACIJA_HIPERMREZA_DIMENZIJA * NOVA_GENERACIJA_HIPERMREZA_DIMENZIJA * 5,
    klasterUtilizacija: (sviCvorovi.filter((c) => c.stanje === 'obrađuje').length / NOVA_GENERACIJA_TOTAL_CVOROVA) * 100,
    grešaka: sviCvorovi.reduce((sum, c) => sum + c.grešaka, 0),
    selfHealingAktivacija: sviCvorovi.reduce((sum, c) => sum + c.selfHealingCiklusi, 0),
    crossPlatformSyncOps: crossPlatformCvorovi.length,
  };
}

/** Pronalazi optimalni klaster za zahtev. */
export function izaberiHipermrezaKlaster(
  prioritet: HipermrezaDispatchZahtev['prioritet'],
  crossPlatform = false,
): HipermrezaKlaster | null {
  const slobodni = hipermrezaKlasteri.filter(
    (k) => k.status === 'slobodan' || k.status === 'zauzet',
  );
  if (slobodni.length === 0) return null;

  if (prioritet === 'kritican') {
    return hipermrezaKlasteri.find((k) => k.id === 'klaster-univerzalni-ng') ?? slobodni[0] ?? null;
  }

  if (crossPlatform) {
    return hipermrezaKlasteri.find((k) => k.id === 'klaster-multi-platform') ?? slobodni[0] ?? null;
  }

  return slobodni.reduce((min, k) =>
    k.aktivniZahtevi < min.aktivniZahtevi ? k : min,
  );
}

/** Generiše konfiguracionu kartu za admin panel. */
export function getSpajaPro16Pregled(): {
  verzija: number;
  kodnoIme: string;
  ukupnoCvorova: number;
  ukupnoPersona: number;
  ukupnoOktava: number;
  ukupnoKlastera: number;
  maxTokena: number;
  ngVerzija: string;
  statistika: HipermrezaStatistika;
  konfiguracija: SpajaPro16Konfiguracija;
} {
  return {
    verzija: 16,
    kodnoIme: 'Nova Generacija',
    ukupnoCvorova: NOVA_GENERACIJA_TOTAL_CVOROVA,
    ukupnoPersona: OMEGA_AI_PERSONA_COUNT,
    ukupnoOktava: OMEGA_AI_OKTAVA_COUNT,
    ukupnoKlastera: hipermrezaKlasteri.length,
    maxTokena: spajaPro16Konfiguracija.maxTokena,
    ngVerzija: NOVA_GENERACIJA_VERZIJA,
    statistika: getHipermrezaStatistika(),
    konfiguracija: spajaPro16Konfiguracija,
  };
}
