import {
  DIJAGNOZA_CONTRACT_VERSION,
  DIJAGNOZA_MODULE_VERSION,
} from './types';

export function setDijagnozaHeaders(res: Response): void {
  res.headers.set('X-Dijagnoza-Contract-Version', DIJAGNOZA_CONTRACT_VERSION);
  res.headers.set('X-Dijagnoza-Module-Version', DIJAGNOZA_MODULE_VERSION);
}
