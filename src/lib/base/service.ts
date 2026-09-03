import { getSportById } from '@/lib/extrimli';
import { getSupabaseBasePoolSnapshot, getSupabaseBaseServerClientSafe } from '@/lib/supabase/server';
import {
  BASE_ALLOWED_STATUSES,
  BASE_CONTRACT_VERSION,
  BASE_DEFAULT_SPORT_ID,
  BASE_DISPLAY_NAME,
  BASE_MODULE_VERSION,
  BASE_PERSONA_ID,
  type BaseHealthReport,
  type BasePool,
  type BasePoolFilters,
  type BasePoolListResult,
  type BaseValidationIssue,
} from './types';

const BASE_POOLS: BasePool[] = [
  {
    id: 'base-alpine-zero',
    name: 'Alpine Zero Exit Pool',
    sportId: 'base-jumping',
    location: 'Dolomiti Ridge, IT',
    status: 'active',
    jumpCapacity: 12,
    activeJumpers: 5,
    prizePoolEur: 15000,
    weatherWindowHours: 4,
    safetyBufferPct: 30,
    requiredGearCategories: ['chute', 'helmet'],
    notes: ['Morning window only', 'Wind tolerance ≤ 18 kph'],
  },
  {
    id: 'base-urban-vector',
    name: 'Urban Vector Tower Pool',
    sportId: 'base-jumping',
    location: 'Belgrade Vertical Sector, RS',
    status: 'weather-hold',
    jumpCapacity: 8,
    activeJumpers: 0,
    prizePoolEur: 9000,
    weatherWindowHours: 2,
    safetyBufferPct: 40,
    requiredGearCategories: ['chute', 'helmet'],
    notes: ['Night operations disabled', 'Spotter confirmation required'],
  },
  {
    id: 'base-canyon-flux',
    name: 'Canyon Flux Mentor Pool',
    sportId: 'base-jumping',
    location: 'Tara Canyon, ME',
    status: 'maintenance',
    jumpCapacity: 10,
    activeJumpers: 2,
    prizePoolEur: 6000,
    weatherWindowHours: 3,
    safetyBufferPct: 35,
    requiredGearCategories: ['chute', 'helmet'],
    notes: ['Landing zone under inspection', 'Mentor-led jumps only'],
  },
];

function getRequiredGear(): BasePool['requiredGearCategories'] {
  const requiredGear = getSportById(BASE_DEFAULT_SPORT_ID)?.requiredGear ?? ['chute', 'helmet'];
  return requiredGear as BasePool['requiredGearCategories'];
}

export function validateBasePools(dataset: BasePool[] = BASE_POOLS): BaseValidationIssue[] {
  const issues: BaseValidationIssue[] = [];
  const seenIds = new Set<string>();
  const requiredGear = new Set(getRequiredGear());

  for (const pool of dataset) {
    const normalizedId = pool.id.trim().toLowerCase();

    if (!pool.id.trim()) issues.push({ id: pool.id, message: 'id is required' });
    if (seenIds.has(normalizedId)) {
      issues.push({ id: pool.id, message: 'duplicate pool id' });
    } else {
      seenIds.add(normalizedId);
    }

    if (pool.sportId !== BASE_DEFAULT_SPORT_ID) {
      issues.push({ id: pool.id, message: `sportId must be ${BASE_DEFAULT_SPORT_ID}` });
    }
    if (!BASE_ALLOWED_STATUSES.includes(pool.status)) {
      issues.push({ id: pool.id, message: `invalid status: ${pool.status}` });
    }
    if (!Number.isInteger(pool.jumpCapacity) || pool.jumpCapacity <= 0) {
      issues.push({ id: pool.id, message: 'jumpCapacity must be a positive integer' });
    }
    if (!Number.isInteger(pool.activeJumpers) || pool.activeJumpers < 0) {
      issues.push({ id: pool.id, message: 'activeJumpers must be a non-negative integer' });
    }
    if (pool.activeJumpers > pool.jumpCapacity) {
      issues.push({ id: pool.id, message: 'activeJumpers cannot exceed jumpCapacity' });
    }
    if (!Number.isFinite(pool.prizePoolEur) || pool.prizePoolEur < 0) {
      issues.push({ id: pool.id, message: 'prizePoolEur must be a finite non-negative number' });
    }
    if (!Number.isFinite(pool.weatherWindowHours) || pool.weatherWindowHours <= 0) {
      issues.push({ id: pool.id, message: 'weatherWindowHours must be a finite positive number' });
    }
    if (!Number.isFinite(pool.safetyBufferPct) || pool.safetyBufferPct < 0 || pool.safetyBufferPct > 100) {
      issues.push({ id: pool.id, message: 'safetyBufferPct must be between 0 and 100' });
    }
    for (const gear of requiredGear) {
      if (!pool.requiredGearCategories.includes(gear as BasePool['requiredGearCategories'][number])) {
        issues.push({ id: pool.id, message: `requiredGearCategories must include ${gear}` });
      }
    }
  }

  return issues;
}

export function listBasePools(filters: BasePoolFilters = {}): BasePoolListResult {
  const page = Number.isFinite(filters.page) && (filters.page ?? 0) > 0 ? Math.floor(filters.page as number) : 1;
  const pageSizeRaw = Number.isFinite(filters.pageSize) && (filters.pageSize ?? 0) > 0 ? Math.floor(filters.pageSize as number) : 20;
  const pageSize = Math.min(pageSizeRaw, 100);

  let dataset = [...BASE_POOLS];
  if (filters.status) dataset = dataset.filter((pool) => pool.status === filters.status);
  if (typeof filters.minPrizePoolEur === 'number' && Number.isFinite(filters.minPrizePoolEur)) {
    dataset = dataset.filter((pool) => pool.prizePoolEur >= filters.minPrizePoolEur!);
  }

  const total = dataset.length;
  const startIndex = (page - 1) * pageSize;
  const items = dataset.slice(startIndex, startIndex + pageSize);

  return {
    items,
    total,
    page,
    pageSize,
    filters: {
      status: filters.status,
      minPrizePoolEur: filters.minPrizePoolEur,
    },
    audit: {
      source: 'src/lib/base/service.ts',
      generatedAt: new Date().toISOString(),
      poolName: 'base',
    },
  };
}

export function getBasePoolById(id: string): BasePool | undefined {
  const normalized = id.trim().toLowerCase();
  if (!normalized) return undefined;
  return BASE_POOLS.find((pool) => pool.id.toLowerCase() === normalized);
}

export function getBaseHealthReport(): BaseHealthReport {
  getSupabaseBaseServerClientSafe();
  const issues = validateBasePools();
  const supabasePool = getSupabaseBasePoolSnapshot();
  const activePools = BASE_POOLS.filter((pool) => pool.status === 'active').length;
  const requiredGearCategories = getRequiredGear();

  return {
    status: issues.length === 0 && supabasePool.status === 'ok' ? 'ok' : 'degraded',
    module: `${BASE_DISPLAY_NAME}@${BASE_MODULE_VERSION}`,
    contractVersion: BASE_CONTRACT_VERSION,
    personaId: BASE_PERSONA_ID,
    totalPools: BASE_POOLS.length,
    activePools,
    invalidPools: issues.length,
    sportId: 'base-jumping',
    requiredGearCategories,
    supabasePool,
    lastValidatedAt: new Date().toISOString(),
  };
}
