import { GAMELORD_CONTRACT_VERSION, GAMELORD_MODULE_VERSION } from './types';

export function setGamelordHeaders(res: Response): void {
  res.headers.set('X-Gamelord-Contract-Version', GAMELORD_CONTRACT_VERSION);
  res.headers.set('X-Gamelord-Module-Version', GAMELORD_MODULE_VERSION);
}
