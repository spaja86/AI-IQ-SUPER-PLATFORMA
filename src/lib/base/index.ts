export {
  getBaseHealthReport,
  getBasePoolById,
  listBasePools,
  validateBasePools,
} from './service';
export { setBaseHeaders } from './route-utils';

export type {
  BaseHealthReport,
  BasePool,
  BasePoolFilters,
  BasePoolListResult,
  BasePoolStatus,
  BaseValidationIssue,
} from './types';

export {
  BASE_ALLOWED_STATUSES,
  BASE_API_RESPONSE_MAX_MS,
  BASE_CONTRACT_VERSION,
  BASE_DEFAULT_SPORT_ID,
  BASE_DISPLAY_NAME,
  BASE_EVALUATION_MAX_MS,
  BASE_MODULE_VERSION,
  BASE_PERSONA_ID,
} from './types';
