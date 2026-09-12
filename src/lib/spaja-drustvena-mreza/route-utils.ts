// SpajaUltraOmegaCore -∞Ω+∞ — SPAJA Društvena Mreža Route Utils
// Kompanija SPAJA — Digitalna Industrija

import type { SocialReadinessStatus } from './types';
import {
  SPAJA_DRUSTVENA_MREZA_CONTRACT_VERSION,
  SPAJA_DRUSTVENA_MREZA_LINKED_REPO_IMPACT,
  SPAJA_DRUSTVENA_MREZA_MODULE_VERSION,
} from './types';

export function setSpajaDrustvenaMrezaHeaders(res: Response, readinessStatus?: SocialReadinessStatus): void {
  res.headers.set('X-Spaja-Drustvena-Mreza-Contract-Version', SPAJA_DRUSTVENA_MREZA_CONTRACT_VERSION);
  res.headers.set('X-Spaja-Drustvena-Mreza-Module-Version', SPAJA_DRUSTVENA_MREZA_MODULE_VERSION);
  res.headers.set('X-Spaja-Drustvena-Mreza-Linked-Repo-Impact', SPAJA_DRUSTVENA_MREZA_LINKED_REPO_IMPACT);
  if (readinessStatus) {
    res.headers.set('X-Spaja-Drustvena-Mreza-Readiness', readinessStatus);
  }
}
