// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI
// Kompanija SPAJA — Digitalna Industrija
// EXPORT BUNDLE — Snapshot za multi-repo sync

import type { ExtrimliExportBundle } from './types';
import {
  EXTRIMLI_CONTRACT_VERSION,
  EXTRIMLI_MODULE_VERSION,
  EXTRIMLI_PERSONA_ID,
} from './types';
import { SPORT_REGISTRY } from './registry';
import { listGearItems } from './gear-catalog';
import { listInstrukcije } from './instrukcija';

export const EXTRIMLI_EXPORT_BUNDLE_VERSION = 'v1';

export function buildExtrimliExportBundle(): ExtrimliExportBundle {
  const instrukcije = listInstrukcije().map(({ id, naziv, opis, inputType, outputType, endpointPath, methods, edgeCases }) => ({
    id,
    naziv,
    opis,
    inputType,
    outputType,
    endpointPath,
    methods,
    edgeCases,
  }));

  return {
    bundleVersion:   EXTRIMLI_EXPORT_BUNDLE_VERSION,
    contractVersion: EXTRIMLI_CONTRACT_VERSION,
    moduleVersion:   EXTRIMLI_MODULE_VERSION,
    personaId:       EXTRIMLI_PERSONA_ID,
    generatedAt:     new Date().toISOString(),
    sportRegistry:   SPORT_REGISTRY.slice(),
    gearListing:     listGearItems(),
    instrukcije,
  };
}
