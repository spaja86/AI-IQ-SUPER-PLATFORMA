import { repositories } from '@/lib/repositories';
import type { RepositoryMetadata } from '@/lib/types';
import {
  REPOZIT_ALLOWED_CATEGORIES,
  REPOZIT_ALLOWED_STATUSES,
  REPOZIT_CONTRACT_VERSION,
  REPOZIT_DISPLAY_NAME,
  REPOZIT_MODULE_VERSION,
  REPOZIT_MVP_CAPABILITIES,
  REPOZIT_PERSONA_ID,
  type RepozitHealthReport,
  type RepozitListFilters,
  type RepozitListResult,
  type RepozitRepository,
} from './types';

const PRIMARY_LINKED_REPO = 'spaja86/IO-OPENUI-AO';

function resolveSyncStatus(fullName: string): RepositoryMetadata['syncStatus'] {
  if (fullName === PRIMARY_LINKED_REPO) return 'linked';
  if (fullName.startsWith('spaja86/')) return 'local-only';
  return 'concept-only';
}

function toMetadata(fullName: string): RepositoryMetadata {
  const syncStatus = resolveSyncStatus(fullName);
  return {
    owner: fullName.split('/')[0] ?? 'unknown',
    source: 'static-registry',
    mvp: [...REPOZIT_MVP_CAPABILITIES],
    syncStatus,
    tags: syncStatus === 'linked' ? ['primary-linked', 'cross-repo'] : ['repo-local'],
    lastValidatedAt: new Date().toISOString(),
  };
}

function toRepozitRepository(): RepozitRepository[] {
  return repositories.map((repository) => ({
    ...repository,
    metadata: toMetadata(repository.fullName),
  }));
}

export interface RepozitValidationIssue {
  id: string;
  message: string;
}

export function validateRepozitDataset(dataset: RepozitRepository[] = toRepozitRepository()): RepozitValidationIssue[] {
  const issues: RepozitValidationIssue[] = [];
  const seenIds = new Set<string>();

  for (const repository of dataset) {
    const id = repository.id.trim();
    const fullName = repository.fullName.trim();
    const url = repository.url.trim();

    if (!id) issues.push({ id: repository.id, message: 'id is required' });
    if (!fullName.includes('/')) issues.push({ id: repository.id, message: 'fullName must use owner/repo format' });
    if (!url.startsWith('https://github.com/')) issues.push({ id: repository.id, message: 'url must start with https://github.com/' });
    if (!REPOZIT_ALLOWED_STATUSES.includes(repository.status)) issues.push({ id: repository.id, message: `invalid status: ${repository.status}` });
    if (!REPOZIT_ALLOWED_CATEGORIES.includes(repository.category)) issues.push({ id: repository.id, message: `invalid category: ${repository.category}` });

    const normalizedId = id.toLowerCase();
    if (seenIds.has(normalizedId)) {
      issues.push({ id: repository.id, message: 'duplicate repository id' });
    } else {
      seenIds.add(normalizedId);
    }
  }

  return issues;
}

export function listRepozitRepositories(filters: RepozitListFilters = {}): RepozitListResult {
  const page = Number.isFinite(filters.page) && (filters.page ?? 0) > 0 ? Math.floor(filters.page as number) : 1;
  const pageSizeRaw = Number.isFinite(filters.pageSize) && (filters.pageSize ?? 0) > 0 ? Math.floor(filters.pageSize as number) : 20;
  const pageSize = Math.min(pageSizeRaw, 100);
  const searchTerm = filters.searchTerm?.trim().toLowerCase();

  let dataset = toRepozitRepository();
  if (searchTerm) {
    dataset = dataset.filter((repository) => {
      const haystack = [
        repository.id,
        repository.name,
        repository.fullName,
        repository.description,
        ...repository.technologies,
        ...repository.features,
      ].join(' ').toLowerCase();
      return haystack.includes(searchTerm);
    });
  }

  if (filters.status) dataset = dataset.filter((repository) => repository.status === filters.status);
  if (filters.category) dataset = dataset.filter((repository) => repository.category === filters.category);
  if (filters.syncStatus) dataset = dataset.filter((repository) => repository.metadata.syncStatus === filters.syncStatus);

  const total = dataset.length;
  const startIndex = (page - 1) * pageSize;
  const items = dataset.slice(startIndex, startIndex + pageSize);

  return {
    items,
    total,
    page,
    pageSize,
    mvp: [...REPOZIT_MVP_CAPABILITIES],
    filters: {
      searchTerm: filters.searchTerm?.trim() || undefined,
      status: filters.status,
      category: filters.category,
      syncStatus: filters.syncStatus,
    },
    audit: {
      source: 'src/lib/repositories.ts',
      generatedAt: new Date().toISOString(),
      linkedRepo: PRIMARY_LINKED_REPO,
    },
  };
}

export function getRepozitRepositoryById(id: string): RepozitRepository | undefined {
  const normalized = id.trim().toLowerCase();
  if (!normalized) return undefined;
  return toRepozitRepository().find((repository) => repository.id.toLowerCase() === normalized);
}

export function getRepozitHealthReport(): RepozitHealthReport {
  const dataset = toRepozitRepository();
  const issues = validateRepozitDataset(dataset);
  const linkedRepositories = dataset.filter((repository) => repository.metadata.syncStatus === 'linked').length;
  const activeRepositories = dataset.filter((repository) => repository.status === 'active').length;

  return {
    status: issues.length === 0 ? 'ok' : 'degraded',
    module: `${REPOZIT_DISPLAY_NAME}@${REPOZIT_MODULE_VERSION}`,
    contractVersion: REPOZIT_CONTRACT_VERSION,
    personaId: REPOZIT_PERSONA_ID,
    totalRepositories: dataset.length,
    activeRepositories,
    linkedRepositories,
    invalidRecords: issues.length,
    allowedStatuses: [...REPOZIT_ALLOWED_STATUSES],
    allowedCategories: [...REPOZIT_ALLOWED_CATEGORIES],
    mvp: [...REPOZIT_MVP_CAPABILITIES],
    lastValidatedAt: new Date().toISOString(),
  };
}
