// SpajaUltraOmegaCore -∞Ω+∞ — MRKLI MRAK
// Kompanija SPAJA — Digitalna Industrija

export { evaluateMrkliMrak, getMrkliMrakHealthReport, _resetMrkliMrakMetrics } from './engine';
export { setMrkliMrakHeaders } from './route-utils';

export type {
  MrkliMrakHealthReport,
  MrkliMrakInput,
  MrkliMrakMode,
  MrkliMrakResult,
  MrkliMrakRiskTolerance,
  MrkliMrakStatus,
  MrkliMrakSupportTool,
} from './types';

export {
  MRKLI_MRAK_API_RESPONSE_MAX_MS,
  MRKLI_MRAK_CONTRACT_VERSION,
  MRKLI_MRAK_DISCLAIMER,
  MRKLI_MRAK_DISPLAY_NAME,
  MRKLI_MRAK_HIPERMREZA_NODE,
  MRKLI_MRAK_LINKED_REPO_IMPACT,
  MRKLI_MRAK_MAX_AMBIENT_LUX,
  MRKLI_MRAK_MAX_FOCUS_LEVEL,
  MRKLI_MRAK_MAX_SCORE,
  MRKLI_MRAK_MAX_SESSION_MINUTES,
  MRKLI_MRAK_MAX_SLEEP_HOURS,
  MRKLI_MRAK_MIN_SCORE,
  MRKLI_MRAK_MODULE_VERSION,
  MRKLI_MRAK_OCTAVE,
  MRKLI_MRAK_PERFORMANCE_MAX_MS,
  MRKLI_MRAK_PERSONA_ID,
  MRKLI_MRAK_SLUG,
} from './types';
