// SpajaUltraOmegaCore -∞Ω+∞ — SPAJA Društvena Mreža Route Utils
// Kompanija SPAJA — Digitalna Industrija

import { apiError, apiInternalError } from '@/lib/api/response';
import type {
  SocialAudience,
  SocialGroupJoinMode,
  SocialProfileRole,
  SocialIssueCode,
  SocialReadinessStatus,
  SocialVisibility,
} from './types';
import {
  SPAJA_DRUSTVENA_MREZA_CONTRACT_VERSION,
  SPAJA_DRUSTVENA_MREZA_LINKED_REPO_IMPACT,
  SPAJA_DRUSTVENA_MREZA_MODULE_VERSION,
} from './types';

const SOCIAL_AUDIENCES: SocialAudience[] = ['internal', 'partner', 'public'];
const SOCIAL_VISIBILITIES: SocialVisibility[] = ['internal', 'network', 'public'];
const SOCIAL_PROFILE_ROLES: SocialProfileRole[] = ['employee', 'partner-admin', 'customer', 'moderator'];
const SOCIAL_GROUP_JOIN_MODES: SocialGroupJoinMode[] = ['open', 'approval'];

export function setSpajaDrustvenaMrezaHeaders(res: Response, readinessStatus?: SocialReadinessStatus): void {
  res.headers.set('X-Spaja-Drustvena-Mreza-Contract-Version', SPAJA_DRUSTVENA_MREZA_CONTRACT_VERSION);
  res.headers.set('X-Spaja-Drustvena-Mreza-Module-Version', SPAJA_DRUSTVENA_MREZA_MODULE_VERSION);
  res.headers.set('X-Spaja-Drustvena-Mreza-Linked-Repo-Impact', SPAJA_DRUSTVENA_MREZA_LINKED_REPO_IMPACT);
  if (readinessStatus) {
    res.headers.set('X-Spaja-Drustvena-Mreza-Readiness', readinessStatus);
  }
}

export function withSpajaDrustvenaMrezaHeaders<T extends Response>(res: T, readinessStatus?: SocialReadinessStatus): T {
  setSpajaDrustvenaMrezaHeaders(res, readinessStatus);
  return res;
}

export function spajaDrustvenaMrezaApiError(code: SocialIssueCode | 'BAD_REQUEST', message: string): Response {
  return withSpajaDrustvenaMrezaHeaders(apiError(code, message));
}

export function spajaDrustvenaMrezaApiInternalError(context: string, error: unknown): Response {
  return withSpajaDrustvenaMrezaHeaders(apiInternalError(context, error));
}

export function isSocialAudience(value: unknown): value is SocialAudience {
  return typeof value === 'string' && SOCIAL_AUDIENCES.includes(value as SocialAudience);
}

export function isSocialVisibility(value: unknown): value is SocialVisibility {
  return typeof value === 'string' && SOCIAL_VISIBILITIES.includes(value as SocialVisibility);
}

export function isSocialProfileRole(value: unknown): value is SocialProfileRole {
  return typeof value === 'string' && SOCIAL_PROFILE_ROLES.includes(value as SocialProfileRole);
}

export function isSocialGroupJoinMode(value: unknown): value is SocialGroupJoinMode {
  return typeof value === 'string' && SOCIAL_GROUP_JOIN_MODES.includes(value as SocialGroupJoinMode);
}
