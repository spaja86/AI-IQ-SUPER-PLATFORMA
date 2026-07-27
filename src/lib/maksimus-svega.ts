// SpajaUltraOmegaCore -∞Ω+∞ — MAKSIMUS SVEGA
// Kompanija SPAJA — Digitalna Industrija
//
// Jedinstven izvor istine za objedinjeni "master" pregled:
//   - Analiza Svega (stanje)
//   - Potencijal Svega Ovoga Do Sada (uplift)
//   - Procesuiranje Svega (operativni pipeline)
//   - Autofinish Svega (orkestracija)
//
// Tanak wrapper oko `agregator-svega-core.ts`.

import {
  type AgregiranDomenSignal,
  type AgregiranFreshness,
  type AgregiranMeta,
  type AgregiranOcena,
  type AgregiranRezultat,
  buildAgregiranRezultat,
} from './agregator-svega-core';
import {
  APP_VERSION,
  AUTOFINISH_COUNT,
  KOMPANIJA,
  TOTAL_API_ROUTES,
  TOTAL_ROUTES,
} from './constants';

// ─── Re-eksporti radi backward kompatibilnosti ────────────────────────────────

export type MaksimusOcena = AgregiranOcena;
export type MaksimusDomenSignal = AgregiranDomenSignal;
export type { AgregiranFreshness as MaksimusFreshness };

export const MAKSIMUS_SVEGA_CONTRACT_VERSION = 'v1';
export const MAKSIMUS_SVEGA_MODEL_VERSION = '1.0.0';
export const MAKSIMUS_SVEGA_SOURCE_OF_TRUTH = '/api/maksimus-svega';

const MAKSIMUS_WEIGHTS = {
  analiza: 0.35,
  potencijal: 0.3,
  procesuiranje: 0.25,
  orkestracija: 0.1,
} as const;

type MaksimusWeights = typeof MAKSIMUS_WEIGHTS;

export type MaksimusMeta = AgregiranMeta<MaksimusWeights>;

export type MaksimusSvega = AgregiranRezultat<MaksimusWeights>;

// ─── Graditelj ────────────────────────────────────────────────────────────────

export async function buildMaksimusSvega(): Promise<MaksimusSvega> {
  return buildAgregiranRezultat<MaksimusWeights>({
    sistemNaziv: 'MAKSIMUS SVEGA — Digitalna Industrija',
    kompanija: KOMPANIJA,
    verzija: APP_VERSION,
    autofinishBroj: AUTOFINISH_COUNT,
    contractVersion: MAKSIMUS_SVEGA_CONTRACT_VERSION,
    modelVersion: MAKSIMUS_SVEGA_MODEL_VERSION,
    sourceOfTruth: MAKSIMUS_SVEGA_SOURCE_OF_TRUTH,
    weights: MAKSIMUS_WEIGHTS,
    coreWeightKeys: ['analiza', 'potencijal', 'procesuiranje', 'orkestracija'],
    ekosistem: {
      apiRute: TOTAL_API_ROUTES,
      ukupnoRuta: TOTAL_ROUTES,
    },
  });
}

export function getMaksimusSvegaInfo() {
  return {
    sistem: 'MAKSIMUS SVEGA — Digitalna Industrija',
    kompanija: KOMPANIJA,
    verzija: APP_VERSION,
    autofinishBroj: AUTOFINISH_COUNT,
    endpoint: MAKSIMUS_SVEGA_SOURCE_OF_TRUTH,
    contractVersion: MAKSIMUS_SVEGA_CONTRACT_VERSION,
    modelVersion: MAKSIMUS_SVEGA_MODEL_VERSION,
    scoreWeights: MAKSIMUS_WEIGHTS,
    ekosistem: {
      apiRute: TOTAL_API_ROUTES,
      ukupnoRuta: TOTAL_ROUTES,
    },
    timestamp: new Date().toISOString(),
  };
}
