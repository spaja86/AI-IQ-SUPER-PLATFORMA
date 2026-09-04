import {
  TRENAZER_CONTRACT_VERSION,
  TRENAZER_MODULE_VERSION,
} from './types';

export function setTrenazerHeaders(res: Response): void {
  res.headers.set('X-Trenazer-Contract-Version', TRENAZER_CONTRACT_VERSION);
  res.headers.set('X-Trenazer-Module-Version', TRENAZER_MODULE_VERSION);
}
