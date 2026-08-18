import {
  DIREKT_CONTRACT_VERSION,
  DIREKT_MODULE_VERSION,
} from './types';

export function setDirektHeaders(res: Response): void {
  res.headers.set('X-Direkt-Contract-Version', DIREKT_CONTRACT_VERSION);
  res.headers.set('X-Direkt-Module-Version', DIREKT_MODULE_VERSION);
}
