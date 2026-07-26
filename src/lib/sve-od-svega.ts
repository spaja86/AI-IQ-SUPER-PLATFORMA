// SpajaUltraOmegaCore — SVE OD SVEGA
// Kompanija SPAJA — Digitalna Industrija
//
// Ultimativni agregator koji unifikuje sve "svega" domene u jedan
// mega-signal Digitalne Industrije:
//   - Analiza Svega (ekosistem dijagnostika)
//   - Potencijal Svega Ovoga Do Sada (uplift)
//   - Procesuiranje Svega (operativni pipeline)
//   - Autofinish Orkestracija
//   - Gaming Industrija (gaming score)
//   - Issuer Licensing (licencna uskladenost)
//
// Tanak wrapper oko `agregator-svega-core.ts`.

import {
  type AgregiranDomenSignal,
  type AgregiranFreshness,
  type AgregiranMeta,
  type AgregiranOcena,
  type AgregiranRezultat,
  buildAgregiranRezultat,
  clampScore,
  safeAgregiranSync,
} from './agregator-svega-core';
import {
  APP_VERSION,
  AUTOFINISH_COUNT,
  KOMPANIJA,
  TOTAL_API_ROUTES,
  TOTAL_ROUTES,
} from './constants';
import { buildGejmingIndustrija } from './gejming-industrija';
import { getIssuerLicensingSummary } from './issuer-licensing';

// --- Konstante ----------------------------------------------------------------

export const SVE_OD_SVEGA_CONTRACT_VERSION = 'v2';
export const SVE_OD_SVEGA_MODEL_VERSION = '2.0.0';
export const SVE_OD_SVEGA_SOURCE_OF_TRUTH = '/api/sve-od-svega';

const SVE_WEIGHTS = {
  analiza: 0.25,
  potencijal: 0.15,
  procesuiranje: 0.20,
  orkestracija: 0.20,
  gaming: 0.10,
  licensing: 0.10,
} as const;

// Osiguravamo da zbir tezina = 1.0
const _weightSum = Object.values(SVE_WEIGHTS).reduce((s, w) => s + w, 0);
if (Math.abs(_weightSum - 1) > 0.0001) {
  throw new Error(`SVE_WEIGHTS mora biti normalizovano na 1.0 (trenutno: ${_weightSum})`);
}

type SveWeights = typeof SVE_WEIGHTS;

// --- Re-eksporti radi backward kompatibilnosti --------------------------------

export type SveOcena = AgregiranOcena;
export type SveFreshness = AgregiranFreshness;
export type SveDomenSignal = AgregiranDomenSignal;
export type SveOdSvegaMeta = AgregiranMeta<SveWeights>;
export type SveOdSvega = AgregiranRezultat<SveWeights>;

export interface SveOdSvegaInfo {
  sistem: string;
  kompanija: string;
  verzija: string;
  autofinishBroj: number;
  endpoint: string;
  contractVersion: string;
  modelVersion: string;
  scoreWeights: SveWeights;
  ekosistem: {
    apiRute: number;
    ukupnoRuta: number;
  };
  timestamp: string;
}

// --- Extra domeni: Gaming i Licensing ----------------------------------------

function buildGamingDomen(degradedSources: string[]): AgregiranDomenSignal | null {
  const gaming = safeAgregiranSync('gejming-industrija', degradedSources, () =>
    buildGejmingIndustrija('system'),
  );
  if (!gaming) return null;
  const score = clampScore(gaming.pregled.prosecnaOptimizacija);
  return {
    naziv: 'Gaming Industrija',
    score,
    tezina: SVE_WEIGHTS.gaming,
    doprinos: clampScore(score * SVE_WEIGHTS.gaming),
    sourceOfTruth: '/api/gejming-industrija',
    freshness: 'fresh',
  };
}

function buildLicensingDomen(degradedSources: string[]): AgregiranDomenSignal | null {
  const summary = safeAgregiranSync('issuer-licensing', degradedSources, () =>
    getIssuerLicensingSummary(),
  );
  if (!summary) return null;
  // Score: procenat slobodne kvote + bonus za aktivno izdavanje - kazna za blokere
  const kvotaOk = summary.kvotaUkupno > 0
    ? clampScore(100 - summary.procenatKvota)
    : 100;
  const aktivnostBonus = summary.aktivnoIzdavanje > 0 ? 10 : 0;
  const blockerPenalty = summary.suspendovano * 5 + summary.opozvano * 3;
  const score = clampScore(kvotaOk + aktivnostBonus - blockerPenalty);
  return {
    naziv: 'Issuer Licensing',
    score,
    tezina: SVE_WEIGHTS.licensing,
    doprinos: clampScore(score * SVE_WEIGHTS.licensing),
    sourceOfTruth: '/api/issuer-licensing',
    freshness: 'fresh',
  };
}

// --- Graditelj ----------------------------------------------------------------

export async function buildSveOdSvega(): Promise<SveOdSvega> {
  return buildAgregiranRezultat<SveWeights>({
    sistemNaziv: 'SVE OD SVEGA — Digitalna Industrija',
    kompanija: KOMPANIJA,
    verzija: APP_VERSION,
    autofinishBroj: AUTOFINISH_COUNT,
    contractVersion: SVE_OD_SVEGA_CONTRACT_VERSION,
    modelVersion: SVE_OD_SVEGA_MODEL_VERSION,
    sourceOfTruth: SVE_OD_SVEGA_SOURCE_OF_TRUTH,
    weights: SVE_WEIGHTS,
    coreWeightKeys: ['analiza', 'potencijal', 'procesuiranje', 'orkestracija'],
    ekosistem: {
      apiRute: TOTAL_API_ROUTES,
      ukupnoRuta: TOTAL_ROUTES,
    },
    extraDomeni: [buildGamingDomen, buildLicensingDomen],
  });
}

export function getSveOdSvegaInfo(): SveOdSvegaInfo {
  return {
    sistem: 'SVE OD SVEGA — Digitalna Industrija',
    kompanija: KOMPANIJA,
    verzija: APP_VERSION,
    autofinishBroj: AUTOFINISH_COUNT,
    endpoint: SVE_OD_SVEGA_SOURCE_OF_TRUTH,
    contractVersion: SVE_OD_SVEGA_CONTRACT_VERSION,
    modelVersion: SVE_OD_SVEGA_MODEL_VERSION,
    scoreWeights: SVE_WEIGHTS,
    ekosistem: {
      apiRute: TOTAL_API_ROUTES,
      ukupnoRuta: TOTAL_ROUTES,
    },
    timestamp: new Date().toISOString(),
  };
}
