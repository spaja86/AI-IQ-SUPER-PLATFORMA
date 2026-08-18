import {
  EXTRIMLI_CONTRACT_VERSION,
  EXTRIMLI_DESTRUKCIJA_CONTRACT_VERSION,
  EXTRIMLI_DESTRUKCIJA_MODULE_VERSION,
} from '@/lib/extrimli';

export function setDestructionHeaders(res: Response): void {
  res.headers.set('X-Extrimli-Contract-Version', EXTRIMLI_CONTRACT_VERSION);
  res.headers.set('X-Extrimli-Destrukcija-Contract-Version', EXTRIMLI_DESTRUKCIJA_CONTRACT_VERSION);
  res.headers.set('X-Extrimli-Destrukcija-Module-Version', EXTRIMLI_DESTRUKCIJA_MODULE_VERSION);
}
