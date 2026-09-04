import { buildExtrimliKoronHealthReport } from './core';

export function getExtrimliKoronHealthReport() {
  return buildExtrimliKoronHealthReport();
}

export type { ExtrimliKoronHealthReport, ExtrimliKoronStatus } from './types';

export {
  EXTRIMLI_KORON_API_MAX_MS,
  EXTRIMLI_KORON_CONTRACT_VERSION,
  EXTRIMLI_KORON_EVALUATION_MAX_MS,
  EXTRIMLI_KORON_MODULE_VERSION,
  EXTRIMLI_KORON_PERSONA_ID,
  EXTRIMLI_KORON_SOURCE_OF_TRUTH,
} from './types';
