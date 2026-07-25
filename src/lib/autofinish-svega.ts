// SpajaUltraOmegaCore -∞Ω+∞ — AUTOFINISH SVEGA
// Kompanija SPAJA — Digitalna Industrija
//
// Jedinstven orkestratorski servis za sve "svega" pipeline-ove:
//   - Analiza Svega (buildAnalizaSvega)
//   - Procesuiranje Svega (buildProcesuiranjeSvega)
//   - Ekstremno Procesuiranje Svega (buildEkstremnoProcesuiranjeSvega)
//   - Autofinish Petlja (pokreniAutofinishPetlju)
//   - Ekstrimli Ekstrem (buildEktrimliEkstrem) — V4 MOŽE SVE
//
// Politika izvršavanja: continue-on-error — greška u jednom stage-u
// ne prekida ostale. Svaki stage beleži trajanje i status nezavisno.

import { buildAnalizaSvega } from './analiza-svega';
import { buildProcesuiranje3 } from './procesuiranje-3';
import { buildProcesuiranjeSvega, buildEkstremnoProcesuiranjeSvega } from './procesuiranje-svega';
import { pokreniAutofinishPetlju } from './autofinish-petlja';
import { buildMaksimusSvega } from './maksimus-svega';
import { buildMaksimus2 } from './maksimus-2';
import { buildMaksimus3 } from './maksimus-3';
import { buildEktrimliEkstrem } from './ekstrimli-ekstrem';
import { APP_VERSION, AUTOFINISH_COUNT, KOMPANIJA, TOTAL_API_ROUTES, TOTAL_ROUTES } from './constants';

// ─── Konstante ────────────────────────────────────────────────────────────────

export const AUTOFINISH_SVEGA_CONTRACT_VERSION = 'v1';
export const AUTOFINISH_SVEGA_MODEL_VERSION = '1.0.0';
export const AUTOFINISH_SVEGA_SOURCE_OF_TRUTH = '/api/autofinish-svega';

// ─── Tipovi ──────────────────────────────────────────────────────────────────

export type AutofinishSvegaStageId =
  | 'analiza-svega'
  | 'procesuiranje-svega'
  | 'procesuiranje-3'
  | 'ekstremno-procesuiranje-svega'
  | 'autofinish-petlja'
  | 'maksimus-svega'
  | 'maksimus-2'
  | 'maksimus-3'
  | 'ekstrimli-ekstrem';

export type AutofinishSvegaStageStatus = 'ok' | 'greska' | 'preskoceno';
export type AutofinishSvegaStatus = 'ok' | 'delimicno' | 'greska';

export interface AutofinishSvegaStageRezultat {
  id: AutofinishSvegaStageId;
  naziv: string;
  status: AutofinishSvegaStageStatus;
  /** Trajanje izvršavanja u milisekundama. */
  trajanje: number;
  /** Poruka greške (samo ako je status 'greska'). */
  greska?: string;
  /** Sažetak rezultata stage-a (ne pun payload). */
  sazetak?: Record<string, unknown>;
}

export interface AutofinishSvegaRezultat {
  sistem: string;
  kompanija: string;
  verzija: string;
  autofinishBroj: number;
  status: AutofinishSvegaStatus;
  ukupnoStepova: number;
  uspesnihStepova: number;
  preskocenihStepova: number;
  gresaka: number;
  stepovi: AutofinishSvegaStageRezultat[];
  /** Ukupno trajanje orkestracije u ms. */
  trajanjeMs: number;
  ekosistem: {
    apiRute: number;
    ukupnoRuta: number;
  };
  meta: {
    contractVersion: typeof AUTOFINISH_SVEGA_CONTRACT_VERSION;
    modelVersion: string;
    sourceOfTruth: typeof AUTOFINISH_SVEGA_SOURCE_OF_TRUTH;
    dryRun: boolean;
    generatedAt: string;
  };
  timestamp: string;
}

export interface AutofinishSvegaOpcije {
  /** Ako je true, stage-ovi se preskakaju bez izvršavanja (simulacija). */
  dryRun?: boolean;
  /** Lista stage-ova za izvršavanje; ako nije navedeno, svi se pokreću. */
  stages?: AutofinishSvegaStageId[];
}

export interface AutofinishSvegaInfoRezultat {
  sistem: string;
  kompanija: string;
  verzija: string;
  autofinishBroj: number;
  dostupniStepovi: Array<{ id: AutofinishSvegaStageId; naziv: string; endpoint: string }>;
  endpoint: string;
  contractVersion: string;
  modelVersion: string;
  ekosistem: {
    apiRute: number;
    ukupnoRuta: number;
  };
  timestamp: string;
}

// ─── Konstante stage-ova ─────────────────────────────────────────────────────

const STAGE_NAZIVI: Record<AutofinishSvegaStageId, string> = {
  'analiza-svega': 'Analiza Svega',
  'procesuiranje-svega': 'Procesuiranje Svega',
  'procesuiranje-3': 'Procesuiranje 3',
  'ekstremno-procesuiranje-svega': 'Ekstremno Procesuiranje Svega',
  'autofinish-petlja': 'Autofinish Petlja',
  'maksimus-svega': 'Maksimus Svega',
  'maksimus-2': 'Maksimus 2',
  'maksimus-3': 'Maksimus 3',
  'ekstrimli-ekstrem': 'Ekstrimli Ekstrem',
};

const STAGE_ENDPOINTI: Record<AutofinishSvegaStageId, string> = {
  'analiza-svega': '/api/analiza-svega',
  'procesuiranje-svega': '/api/procesuiranje-svega',
  'procesuiranje-3': '/api/procesuiranje-3',
  'ekstremno-procesuiranje-svega': '/api/ekstremno-procesuiranje-svega',
  'autofinish-petlja': '/api/autofinish-petlja-status',
  'maksimus-svega': '/api/maksimus-svega',
  'maksimus-2': '/api/maksimus-2',
  'maksimus-3': '/api/maksimus-3',
  'ekstrimli-ekstrem': '/api/ekstrimli-ekstrem',
};

/** Kanonski redosled izvršavanja — ne menjati.
 * Redosled je determinišan: analiza dolazi prva jer njen rezultat utiče na alerting downstream;
 * procesuiranje i ekstremno procesiranje su nezavisni ali moraju biti pre autofinish petlje
 * kako bi dijagnostički signal bio svež kada petlja prijavlja status. */
const ALL_STAGES: AutofinishSvegaStageId[] = [
  'analiza-svega',
  'procesuiranje-svega',
  'procesuiranje-3',
  'ekstremno-procesuiranje-svega',
  'autofinish-petlja',
  'maksimus-svega',
  'maksimus-2',
  'maksimus-3',
  'ekstrimli-ekstrem',
];

// ─── Interni pomoćnici ───────────────────────────────────────────────────────

function buildSazetakAnaliza(result: Awaited<ReturnType<typeof buildAnalizaSvega>>): Record<string, unknown> {
  return {
    ukupanScore: result.ukupanScore,
    konacnaOcena: result.konacnaOcena,
    kriticniDomeni: result.kriticniDomeni,
    degraded: result.meta.degraded,
  };
}

function buildSazetakProcesuiranje(result: ReturnType<typeof buildProcesuiranjeSvega>): Record<string, unknown> {
  return {
    ukupanProcenat: result.ukupanProcenat,
    aktivnihProcesa: result.aktivnihProcesa,
    gresakaUkupno: result.gresakaUkupno,
    degraded: result.meta.degraded,
  };
}

function buildSazetakProcesuiranje3(result: ReturnType<typeof buildProcesuiranje3>): Record<string, unknown> {
  return {
    ukupanScore: result.ukupanScore,
    aktivnihProcesa: result.aktivnihProcesa,
    queueDepth: result.scheduler.queueDepth,
    trend: result.trend.direction,
    degraded: result.meta.degraded,
    compatibilityMode: result.meta.compatibilityMode,
  };
}

function buildSazetakPetlja(result: ReturnType<typeof pokreniAutofinishPetlju>): Record<string, unknown> {
  return {
    status: result.status,
    ukupniProgres: result.ukupniProgres,
    podsistemiNa100: result.podsistemiNa100,
    ukupnoPodsistema: result.ukupnoPodsistema,
  };
}

function buildSazetakMaksimus(maksimusSvega: Awaited<ReturnType<typeof buildMaksimusSvega>>): Record<string, unknown> {
  return {
    ukupanScore: maksimusSvega.ukupanScore,
    konacnaOcena: maksimusSvega.konacnaOcena,
    kriticniDomeni: maksimusSvega.kriticniDomeni,
    degraded: maksimusSvega.meta.degraded,
  };
}

function buildSazetakMaksimus2(maksimus2: Awaited<ReturnType<typeof buildMaksimus2>>): Record<string, unknown> {
  return {
    ukupanScore: maksimus2.ukupanScore,
    konacnaOcena: maksimus2.konacnaOcena,
    kriticniDomeni: maksimus2.kriticniDomeni,
    trend: maksimus2.trend.direction,
    degraded: maksimus2.meta.degraded,
  };
}

function buildSazetakMaksimus3(maksimus3: Awaited<ReturnType<typeof buildMaksimus3>>): Record<string, unknown> {
  return {
    ukupanScore: maksimus3.ukupanScore,
    konacnaOcena: maksimus3.konacnaOcena,
    kriticniDomeni: maksimus3.kriticniDomeni,
    trend: maksimus3.trend.direction,
    degraded: maksimus3.meta.degraded,
  };
}

function buildSazetakEktrimliEkstrem(rezultat: Awaited<ReturnType<typeof buildEktrimliEkstrem>>): Record<string, unknown> {
  return {
    ukupanScore: rezultat.ukupanScore,
    konacnaOcena: rezultat.konacnaOcena,
    kriticniDomeni: rezultat.kriticniDomeni,
    domeniBrojKriticnih: rezultat.domeniBrojKriticnih,
    trend: rezultat.trend.direction,
    degraded: rezultat.meta.degraded,
  };
}

async function runStage(id: AutofinishSvegaStageId): Promise<AutofinishSvegaStageRezultat> {
  const naziv = STAGE_NAZIVI[id];
  const start = Date.now();
  try {
    let sazetak: Record<string, unknown>;
    if (id === 'analiza-svega') {
      sazetak = buildSazetakAnaliza(await buildAnalizaSvega());
    } else if (id === 'procesuiranje-svega') {
      sazetak = buildSazetakProcesuiranje(buildProcesuiranjeSvega());
    } else if (id === 'procesuiranje-3') {
      sazetak = buildSazetakProcesuiranje3(buildProcesuiranje3());
    } else if (id === 'ekstremno-procesuiranje-svega') {
      sazetak = buildSazetakProcesuiranje(buildEkstremnoProcesuiranjeSvega());
    } else if (id === 'maksimus-svega') {
      sazetak = buildSazetakMaksimus(await buildMaksimusSvega());
    } else if (id === 'maksimus-2') {
      sazetak = buildSazetakMaksimus2(await buildMaksimus2());
    } else if (id === 'maksimus-3') {
      sazetak = buildSazetakMaksimus3(await buildMaksimus3());
    } else if (id === 'ekstrimli-ekstrem') {
      sazetak = buildSazetakEktrimliEkstrem(await buildEktrimliEkstrem());
    } else {
      sazetak = buildSazetakPetlja(pokreniAutofinishPetlju());
    }
    return { id, naziv, status: 'ok', trajanje: Date.now() - start, sazetak };
  } catch (error) {
    return {
      id,
      naziv,
      status: 'greska',
      trajanje: Date.now() - start,
      greska: error instanceof Error ? error.message : String(error),
    };
  }
}

// ─── Javni API ────────────────────────────────────────────────────────────────

/**
 * Vraća metapodatke o AUTOFINISH SVEGA sistemu bez pokretanja pipeline-ova.
 * Koristi se za GET endpoint (bez auth).
 */
export function getAutofinishSvegaInfo(): AutofinishSvegaInfoRezultat {
  return {
    sistem: 'AUTOFINISH SVEGA — Digitalna Industrija',
    kompanija: KOMPANIJA,
    verzija: APP_VERSION,
    autofinishBroj: AUTOFINISH_COUNT,
    dostupniStepovi: ALL_STAGES.map((id) => ({
      id,
      naziv: STAGE_NAZIVI[id],
      endpoint: STAGE_ENDPOINTI[id],
    })),
    endpoint: AUTOFINISH_SVEGA_SOURCE_OF_TRUTH,
    contractVersion: AUTOFINISH_SVEGA_CONTRACT_VERSION,
    modelVersion: AUTOFINISH_SVEGA_MODEL_VERSION,
    ekosistem: {
      apiRute: TOTAL_API_ROUTES,
      ukupnoRuta: TOTAL_ROUTES,
    },
    timestamp: new Date().toISOString(),
  };
}

/**
 * Orkestrira sve (ili odabrane) "svega" pipeline-ove.
 * Politika: continue-on-error — greška jednog stage-a ne prekida ostale.
 * Koristi se za POST endpoint (zahteva auth token).
 *
 * @param opcije - dryRun i/ili lista stage-ova
 */
export async function buildAutofinishSvega(opcije?: AutofinishSvegaOpcije): Promise<AutofinishSvegaRezultat> {
  const dryRun = opcije?.dryRun ?? false;
  const odabraniIds = opcije?.stages ?? ALL_STAGES;
  // Kanonski redosled — preskačemo one koji nisu odabrani.
  const stepIds = ALL_STAGES.filter((id) => odabraniIds.includes(id));

  if (stepIds.length === 0) {
    const nowIso = new Date().toISOString();
    return {
      sistem: 'AUTOFINISH SVEGA — Digitalna Industrija',
      kompanija: KOMPANIJA,
      verzija: APP_VERSION,
      autofinishBroj: AUTOFINISH_COUNT,
      status: 'ok',
      ukupnoStepova: 0,
      uspesnihStepova: 0,
      preskocenihStepova: 0,
      gresaka: 0,
      stepovi: [],
      trajanjeMs: 0,
      ekosistem: { apiRute: TOTAL_API_ROUTES, ukupnoRuta: TOTAL_ROUTES },
      meta: {
        contractVersion: AUTOFINISH_SVEGA_CONTRACT_VERSION,
        modelVersion: AUTOFINISH_SVEGA_MODEL_VERSION,
        sourceOfTruth: AUTOFINISH_SVEGA_SOURCE_OF_TRUTH,
        dryRun,
        generatedAt: nowIso,
      },
      timestamp: nowIso,
    };
  }

  const start = Date.now();
  const stepovi: AutofinishSvegaStageRezultat[] = [];

  for (const id of stepIds) {
    if (dryRun) {
      stepovi.push({ id, naziv: STAGE_NAZIVI[id], status: 'preskoceno', trajanje: 0 });
    } else {
      stepovi.push(await runStage(id));
    }
  }

  const trajanjeMs = Date.now() - start;
  const uspesnihStepova = stepovi.filter((s) => s.status === 'ok').length;
  const preskocenihStepova = stepovi.filter((s) => s.status === 'preskoceno').length;
  const gresaka = stepovi.filter((s) => s.status === 'greska').length;

  let status: AutofinishSvegaStatus;
  if (gresaka === 0 && preskocenihStepova === 0) {
    status = 'ok';
  } else if (uspesnihStepova === 0 && preskocenihStepova === 0) {
    status = 'greska';
  } else {
    status = 'delimicno';
  }

  const nowIso = new Date().toISOString();

  return {
    sistem: 'AUTOFINISH SVEGA — Digitalna Industrija',
    kompanija: KOMPANIJA,
    verzija: APP_VERSION,
    autofinishBroj: AUTOFINISH_COUNT,
    status,
    ukupnoStepova: stepovi.length,
    uspesnihStepova,
    preskocenihStepova,
    gresaka,
    stepovi,
    trajanjeMs,
    ekosistem: {
      apiRute: TOTAL_API_ROUTES,
      ukupnoRuta: TOTAL_ROUTES,
    },
    meta: {
      contractVersion: AUTOFINISH_SVEGA_CONTRACT_VERSION,
      modelVersion: AUTOFINISH_SVEGA_MODEL_VERSION,
      sourceOfTruth: AUTOFINISH_SVEGA_SOURCE_OF_TRUTH,
      dryRun,
      generatedAt: nowIso,
    },
    timestamp: nowIso,
  };
}
