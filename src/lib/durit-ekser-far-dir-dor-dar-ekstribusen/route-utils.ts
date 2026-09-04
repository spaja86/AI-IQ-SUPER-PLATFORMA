import type { NextResponse } from 'next/server';
import {
  DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_CONTRACT_VERSION,
  DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_MODULE_VERSION,
} from './types';

export function setDuritEkstribusenHeaders(res: NextResponse): void {
  res.headers.set('X-Durit-Ekstribusen-Contract-Version', DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_CONTRACT_VERSION);
  res.headers.set('X-Durit-Ekstribusen-Module-Version', DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_MODULE_VERSION);
}
