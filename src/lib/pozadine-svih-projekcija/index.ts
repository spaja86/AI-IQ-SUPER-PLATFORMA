// SpajaUltraOmegaCore -∞Ω+∞ — POZADINE SVIH PROJEKCIJA
// Kompanija SPAJA — Digitalna Industrija

export {
  evaluatePozadineSvihProjekcija,
  getPozadineSvihProjekcijaHealthReport,
  _resetPozadineSvihProjekcijaMetrics,
} from './engine';
export {
  mapPozadineSvihProjekcijaInput,
  setPozadineSvihProjekcijaHeaders,
  validatePozadineSvihProjekcijaRequestShape,
} from './route-utils';

export type {
  PozadineSvihProjekcijaAction,
  PozadineSvihProjekcijaDuplicateDelta,
  PozadineSvihProjekcijaHealthReport,
  PozadineSvihProjekcijaInput,
  PozadineSvihProjekcijaResult,
  PozadineSvihProjekcijaStatus,
} from './types';

export {
  POZADINE_SVIH_PROJEKCIJA_API_RESPONSE_MAX_MS,
  POZADINE_SVIH_PROJEKCIJA_CONTRACT_VERSION,
  POZADINE_SVIH_PROJEKCIJA_DISCLAIMER,
  POZADINE_SVIH_PROJEKCIJA_DISPLAY_NAME,
  POZADINE_SVIH_PROJEKCIJA_HIPERMREZA_NODE,
  POZADINE_SVIH_PROJEKCIJA_LINKED_REPO_IMPACT,
  POZADINE_SVIH_PROJEKCIJA_MAX_SIGNAL_STRENGTH,
  POZADINE_SVIH_PROJEKCIJA_MIN_SIGNAL_STRENGTH,
  POZADINE_SVIH_PROJEKCIJA_MODULE_VERSION,
  POZADINE_SVIH_PROJEKCIJA_OCTAVE,
  POZADINE_SVIH_PROJEKCIJA_PERFORMANCE_MAX_MS,
  POZADINE_SVIH_PROJEKCIJA_PERSONA_ID,
  POZADINE_SVIH_PROJEKCIJA_SLUG,
} from './types';

export {
  ACTION_BY_STATUS,
  OFFICIAL_PROJECTION_SEQUENCE,
  OFFICIAL_PROJECTION_UNIQUE_LAYERS,
  OFFICIAL_SEQUENCE_LENGTH,
  STRICT_ORDER_DEFAULT,
} from './registry';
