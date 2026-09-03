import type { GearCategory } from '@/lib/extrimli';
import type { SupabasePoolSnapshot } from '@/lib/supabase/pool';

export type BasePoolStatus = 'active' | 'weather-hold' | 'maintenance';

export interface BasePool {
  id: string;
  name: string;
  sportId: 'base-jumping';
  location: string;
  status: BasePoolStatus;
  jumpCapacity: number;
  activeJumpers: number;
  prizePoolEur: number;
  weatherWindowHours: number;
  safetyBufferPct: number;
  requiredGearCategories: GearCategory[];
  notes: string[];
}

export interface BasePoolFilters {
  status?: BasePoolStatus;
  minPrizePoolEur?: number;
  page?: number;
  pageSize?: number;
}

export interface BasePoolListResult {
  items: BasePool[];
  total: number;
  page: number;
  pageSize: number;
  filters: {
    status?: BasePoolStatus;
    minPrizePoolEur?: number;
  };
  audit: {
    source: string;
    generatedAt: string;
    poolName: string;
  };
}

export interface BaseValidationIssue {
  id: string;
  message: string;
}

export interface BaseHealthReport {
  status: 'ok' | 'degraded';
  module: string;
  contractVersion: string;
  personaId: string;
  totalPools: number;
  activePools: number;
  invalidPools: number;
  sportId: 'base-jumping';
  requiredGearCategories: GearCategory[];
  supabasePool: SupabasePoolSnapshot;
  lastValidatedAt: string;
}

export const BASE_MODULE_VERSION = '1.0.0';
export const BASE_CONTRACT_VERSION = 'v1';
export const BASE_PERSONA_ID = 'base-jumping-pool-core';
export const BASE_DISPLAY_NAME = 'BASE';
export const BASE_DEFAULT_SPORT_ID = 'base-jumping';
export const BASE_API_RESPONSE_MAX_MS = 200;
export const BASE_EVALUATION_MAX_MS = 50;
export const BASE_ALLOWED_STATUSES: BasePoolStatus[] = ['active', 'weather-hold', 'maintenance'];
