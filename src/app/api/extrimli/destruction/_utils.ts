import {
  EXTRIMLI_CONTRACT_VERSION,
  EXTRIMLI_DESTRUKCIJA_CONTRACT_VERSION,
  EXTRIMLI_DESTRUKCIJA_MODULE_VERSION,
} from '@/lib/extrimli';
import { setExtrimliSurfaceHeaders } from '@/app/api/extrimli/_shared';

export function setDestructionHeaders(res: Response): void {
  setExtrimliSurfaceHeaders(res, {
    surface: 'extrimli',
    contractVersion: EXTRIMLI_CONTRACT_VERSION,
    moduleVersion: EXTRIMLI_DESTRUKCIJA_MODULE_VERSION,
  });
  res.headers.set('X-Extrimli-Destrukcija-Contract-Version', EXTRIMLI_DESTRUKCIJA_CONTRACT_VERSION);
  res.headers.set('X-Extrimli-Destrukcija-Module-Version', EXTRIMLI_DESTRUKCIJA_MODULE_VERSION);
}
