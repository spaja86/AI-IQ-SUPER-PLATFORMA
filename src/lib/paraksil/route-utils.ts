import {
  PARAKSIL_CONTRACT_VERSION,
  PARAKSIL_MODULE_VERSION,
} from './types';

export function setParaksilHeaders(res: Response): void {
  res.headers.set('X-Paraksil-Contract-Version', PARAKSIL_CONTRACT_VERSION);
  res.headers.set('X-Paraksil-Module-Version', PARAKSIL_MODULE_VERSION);
}
