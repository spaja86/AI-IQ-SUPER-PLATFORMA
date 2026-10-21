/** Registry status describes evidence scope, never a provider configuration flag. */
export const kindLabels = {
  application: 'Aplikacije', platform: 'Platforme', repository: 'GitHub repozitorijumi',
  deployment: 'Deploy metapodaci', module: 'OMEGA moduli', integration: 'Integracije', concept: 'Konceptualne stavke',
} as const;
export const statusLabels = {
  local: 'Implementirano lokalno', partial: 'Delimično implementirano',
  documented: 'Dokumentovano u registru', planned: 'Planirana integracija', concept: 'Koncept',
} as const;
export const availabilityLabels = {
  unknown: 'Dostupnost nije proverena', available: 'Dostupno — provereno',
  unavailable: 'Nedostupno pri proveri', stale: 'Provera je zastarela',
} as const;
export type RegistryKind = keyof typeof kindLabels;
export type RegistryStatus = keyof typeof statusLabels;
export type Availability = keyof typeof availabilityLabels;
export interface AvailabilityEvidence {
  address: string;
  checkedAt: string;
  evidenceUrl: string;
  method: 'http-smoke';
  result: 'passed' | 'failed';
  scope: string;
}
export interface RegistryEntry {
  id: string;
  name: string;
  description: string;
  kind: RegistryKind;
  status: RegistryStatus;
  address: string;
  addressScope: 'application' | 'external' | 'local-pilot' | 'documentation';
  source: { label: string; url: string; recordId: string };
  evidence: { url: string; scope: string };
  availability: AvailabilityEvidence | null;
  metadata?: Record<string, string>;
  conceptId?: string;
}

/** Reject executable schemes, protocol-relative URLs and credential-bearing links. */
export function isRegistryAddress(value: string): boolean {
  if (!value || /[\s\\\u0000-\u001f]/.test(value)) return false;
  if (value.startsWith('/') && !value.startsWith('//')) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password;
  } catch { return false; }
}

// Availability is time-bound and applies only to the exact checked address.
export const AVAILABILITY_MAX_AGE_MS = 24 * 60 * 60 * 1000;
export function availabilityOf(entry: RegistryEntry, now: number): Availability {
  const check = entry.availability;
  if (!check || check.address !== entry.address || check.method !== 'http-smoke'
    || !check.scope.trim() || !isRegistryAddress(check.evidenceUrl)
    || !check.evidenceUrl.startsWith('https:') || !Number.isFinite(now)
    || !/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(check.checkedAt)
    || !['passed', 'failed'].includes(check.result)) return 'unknown';
  const checked = Date.parse(check.checkedAt);
  if (!Number.isFinite(checked) || checked > now) return 'unknown';
  if (now - checked > AVAILABILITY_MAX_AGE_MS) return 'stale';
  return check.result === 'passed' ? 'available' : 'unavailable';
}

export interface RegistryFilters { search?: string; kind?: string; status?: string; availability?: string }
const normalize = (text: string) => text.toLocaleLowerCase('sr').normalize('NFD').replace(/\p{M}/gu, '').replaceAll('đ', 'dj');
export function filterRegistry(entries: readonly RegistryEntry[], filters: RegistryFilters, now: number): RegistryEntry[] {
  const terms = normalize(filters.search ?? '').trim().split(/\s+/).filter(Boolean);
  return entries.filter(entry => (!filters.kind || entry.kind === filters.kind)
    && (!filters.status || entry.status === filters.status)
    && (!filters.availability || availabilityOf(entry, now) === filters.availability)
    && terms.every(term => normalize([entry.id, entry.name, entry.description, entry.address,
      entry.source.label, entry.source.recordId, entry.evidence.scope, ...Object.values(entry.metadata ?? {})].join(' ')).includes(term)));
}

export function validateRegistry(entries: readonly RegistryEntry[]): void {
  const ids = new Set<string>();
  for (const entry of entries) {
    if (!entry.id || ids.has(entry.id)) throw new Error(`Duplicate or empty registry ID: ${entry.id}`);
    ids.add(entry.id);
    if (!Object.hasOwn(kindLabels, entry.kind) || !Object.hasOwn(statusLabels, entry.status)
      || !entry.name.trim() || !entry.source.recordId || !entry.source.label
      || !entry.evidence.scope.trim()
      || ![entry.address, entry.source.url, entry.evidence.url].every(isRegistryAddress)) {
      throw new Error(`Invalid registry entry: ${entry.id}`);
    }
  }
}
