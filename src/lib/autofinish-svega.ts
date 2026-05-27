// SpajaUltraOmegaCore -∞Ω+∞ — AUTOFINISH SVEGA
// Kompanija SPAJA — Digitalna Industrija
//
// Jedinstven orkestratorski servis za sve "svega" pipeline-ove:
//   - Analiza Svega (buildAnalizaSvega)
//   - Procesuiranje Svega (buildProcesuiranjeSvega)
//   - Ekstremno Procesuiranje Svega (buildEkstremnoProcesuiranjeSvega)
//   - Autofinish Petlja (pokreniAutofinishPetlju)
//
// Politika izvršavanja: continue-on-error — greška u jednom stage-u
// ne prekida ostale. Svaki stage beleži trajanje i status nezavisno.

import { buildAnalizaSvega } from './analiza-svega';
import { buildProcesuiranjeSvega, buildEkstremnoProcesuiranjeSvega } from './procesuiranje-svega';
import { pokreniAutofinishPetlju } from './autofinish-petlja';
import { buildMaksimusSvega } from './maksimus-svega';
import { APP_VERSION, AUTOFINISH_COUNT, KOMPANIJA, TOTAL_API_ROUTES, TOTAL_ROUTES } from './constants';

// ─── Konstante ────────────────────────────────────────────────────────────────

export const AUTOFINISH_SVEGA_CONTRACT_VERSION = 'v1';
export const AUTOFINISH_SVEGA_MODEL_VERSION = '1.0.0';
export const AUTOFINISH_SVEGA_SOURCE_OF_TRUTH = '/api/autofinish-svega';

// ─── Tipovi ──────────────────────────────────────────────────────────────────

export type AutofinishSvegaStageId =
  | 'analiza-svega'
  | 'procesuiranje-svega'
  | 'ekstremno-procesuiranje-svega'
  | 'autofinish-petlja'
  | 'maksimus-svega';

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
  'ekstremno-procesuiranje-svega': 'Ekstremno Procesuiranje Svega',
  'autofinish-petlja': 'Autofinish Petlja',
  'maksimus-svega': 'Maksimus Svega',
};

const STAGE_ENDPOINTI: Record<AutofinishSvegaStageId, string> = {
  'analiza-svega': '/api/analiza-svega',
  'procesuiranje-svega': '/api/procesuiranje-svega',
  'ekstremno-procesuiranje-svega': '/api/ekstremno-procesuiranje-svega',
  'autofinish-petlja': '/api/autofinish-petlja-status',
  'maksimus-svega': '/api/maksimus-svega',
};

/** Kanonski redosled izvršavanja — ne menjati.
 * Redosled je determinišan: analiza dolazi prva jer njen rezultat utiče na alerting downstream;
 * procesuiranje i ekstremno procesiranje su nezavisni ali moraju biti pre autofinish petlje
 * kako bi dijagnostički signal bio svež kada petlja prijavlja status. */
const ALL_STAGES: AutofinishSvegaStageId[] = [
  'analiza-svega',
  'procesuiranje-svega',
  'ekstremno-procesuiranje-svega',
  'autofinish-petlja',
  'maksimus-svega',
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

async function runStage(id: AutofinishSvegaStageId): Promise<AutofinishSvegaStageRezultat> {
  const naziv = STAGE_NAZIVI[id];
  const start = Date.now();
  try {
    let sazetak: Record<string, unknown>;
    if (id === 'analiza-svega') {
      sazetak = buildSazetakAnaliza(await buildAnalizaSvega());
    } else if (id === 'procesuiranje-svega') {
      sazetak = buildSazetakProcesuiranje(buildProcesuiranjeSvega());
    } else if (id === 'ekstremno-procesuiranje-svega') {
      sazetak = buildSazetakProcesuiranje(buildEkstremnoProcesuiranjeSvega());
    } else if (id === 'maksimus-svega') {
      sazetak = buildSazetakMaksimus(await buildMaksimusSvega());
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
