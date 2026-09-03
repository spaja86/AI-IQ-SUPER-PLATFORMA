import type { Repository, RepositoryCategory, RepositoryMetadata, RepositoryStatus, RepozitMvpCapability } from '@/lib/types';

export const REPOZIT_MODULE_VERSION = '1.0.0';
export const REPOZIT_CONTRACT_VERSION = 'v1';
export const REPOZIT_PERSONA_ID = 'repozit-core';
export const REPOZIT_DISPLAY_NAME = 'REPOZIT';
export const REPOZIT_API_RESPONSE_MAX_MS = 200;
export const REPOZIT_EVALUATION_MAX_MS = 50;

export const REPOZIT_ALLOWED_STATUSES: RepositoryStatus[] = ['active', 'skeleton', 'concept'];
export const REPOZIT_ALLOWED_CATEGORIES: RepositoryCategory[] = ['platform', 'finance', 'ai', 'tools', 'omega', 'legacy'];
export const REPOZIT_MVP_CAPABILITIES: RepozitMvpCapability[] = ['overview', 'search', 'status', 'sync'];

export interface RepozitRepository extends Repository {
  metadata: RepositoryMetadata;
}

export interface RepozitListFilters {
  searchTerm?: string;
  status?: RepositoryStatus;
  category?: RepositoryCategory;
  syncStatus?: RepositoryMetadata['syncStatus'];
  page?: number;
  pageSize?: number;
}

export interface RepozitListResult {
  items: RepozitRepository[];
  total: number;
  page: number;
  pageSize: number;
  mvp: RepozitMvpCapability[];
  filters: {
    searchTerm?: string;
    status?: RepositoryStatus;
    category?: RepositoryCategory;
    syncStatus?: RepositoryMetadata['syncStatus'];
  };
  audit: {
    source: string;
    generatedAt: string;
    linkedRepo: string;
  };
}

export interface RepozitHealthReport {
  status: 'ok' | 'degraded';
  module: string;
  contractVersion: string;
  personaId: string;
  totalRepositories: number;
  activeRepositories: number;
  linkedRepositories: number;
  invalidRecords: number;
  allowedStatuses: RepositoryStatus[];
  allowedCategories: RepositoryCategory[];
  mvp: RepozitMvpCapability[];
  lastValidatedAt: string;
}
