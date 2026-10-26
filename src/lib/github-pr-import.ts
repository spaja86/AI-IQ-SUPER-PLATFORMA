export const PR_IMPORT_MAX_BYTES = 16 * 1024 * 1024;
export const PR_IMPORT_MAX_RECORDS = 10_000;
export const PR_IMPORT_PAGE_SIZE = 20;
export type PrStatus = 'open' | 'merged' | 'closed';
export type PrVisibility = 'public' | 'private' | 'internal' | 'unknown';
export type PrBranch = { branch: string; sha: string };
export type ImportedPr = {
  repository: string; repository_visibility: PrVisibility; number: number; id: number;
  title: string; body: string; status: PrStatus; state: 'open' | 'closed'; draft: boolean;
  author: string; created_at: string; updated_at: string; retrieved_at: string;
  merged_at: string | null; closed_at: string | null; head: PrBranch; base: PrBranch;
  labels: string[]; url: string;
};
export type PrSnapshot = { schema_version: '1.0'; owner: 'spaja86'; total: number; pull_requests: ImportedPr[] };
export type PrFilters = { search?: string; repository?: string; status?: PrStatus | 'all'; visibility?: PrVisibility | 'all'; draftsOnly?: boolean };

function fail(message: string): never { throw new Error(message); }
function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail('Očekivan je JSON objekat.');
  return value as Record<string, unknown>;
}
function str(value: unknown, max: number, empty = false): string {
  if (typeof value !== 'string' || value.length > max || (!empty && !value.length)) fail('Neispravno tekstualno polje.');
  return value;
}
function integer(value: unknown): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value <= 0) fail('Neispravan PR broj ili identifikator.');
  return value;
}
function date(value: unknown): string {
  const text = str(value, 30);
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(text) || !Number.isFinite(Date.parse(text))) fail('Neispravan UTC datum.');
  return text;
}
function branch(value: unknown): PrBranch {
  const row = object(value), sha = str(row.sha, 64);
  if (!/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/.test(sha)) fail('Neispravan commit SHA.');
  return { branch: str(row.branch, 1024), sha };
}

export function parsePrSnapshot(input: string): PrSnapshot {
  if (new TextEncoder().encode(input).length > PR_IMPORT_MAX_BYTES) fail('Paket je veći od 16 MiB.');
  let decoded: unknown;
  try { decoded = JSON.parse(input); } catch { fail('Datoteka nije ispravan JSON.'); }
  const data = object(decoded);
  if (data.schema_version !== '1.0' || data.owner !== 'spaja86') fail('Potreban je SPAJA PR paket verzije 1.0 za nalog spaja86.');
  if (!Array.isArray(data.pull_requests) || data.pull_requests.length > PR_IMPORT_MAX_RECORDS) fail('Paket mora sadržati najviše 10.000 PR zapisa.');
  if (data.total !== data.pull_requests.length) fail('Broj zapisa se ne slaže sa poljem total.');
  const keys = new Set<string>(), ids = new Set<number>();
  const pull_requests = data.pull_requests.map((value): ImportedPr => {
    const row = object(value), repository = str(row.repository, 108);
    if (!/^spaja86\/[A-Za-z0-9_.-]{1,100}$/.test(repository) || ['.', '..'].includes(repository.split('/')[1])) fail('Neispravan repozitorijum naloga spaja86.');
    const number = integer(row.number), id = integer(row.id), key = `${repository.toLowerCase()}#${number}`;
    if (keys.has(key) || ids.has(id)) fail('Paket sadrži duplirane PR zapise.');
    keys.add(key); ids.add(id);
    const url = `https://github.com/${repository}/pull/${number}`;
    if (row.url !== url) fail('PR URL mora biti kanonski GitHub link.');
    const merged_at = row.merged_at === null ? null : date(row.merged_at);
    const closed_at = row.closed_at === null ? null : date(row.closed_at);
    if (row.state !== 'open' && row.state !== 'closed') fail('Neispravno PR stanje.');
    const state = row.state, status = merged_at ? 'merged' : state;
    if (row.status !== status || (state === 'open' && (closed_at || merged_at)) || (state === 'closed' && !closed_at)) fail('PR status i datumi nisu usklađeni.');
    if (typeof row.draft !== 'boolean') fail('Neispravna draft oznaka.');
    const visibility = row.repository_visibility ?? 'unknown';
    if (!['public', 'private', 'internal', 'unknown'].includes(String(visibility))) fail('Neispravna vidljivost repozitorijuma.');
    if (!Array.isArray(row.labels) || row.labels.length > 100) fail('Neispravne PR oznake.');
    return {
      repository, number, id, url, repository_visibility: visibility as PrVisibility,
      title: str(row.title, 1024), body: str(row.body ?? '', 300_000, true), status, state, draft: row.draft,
      author: str(row.author, 256), created_at: date(row.created_at), updated_at: date(row.updated_at), retrieved_at: date(row.retrieved_at),
      merged_at, closed_at, head: branch(row.head), base: branch(row.base), labels: row.labels.map(label => str(label, 256)),
    };
  });
  return { schema_version: '1.0', owner: 'spaja86', total: pull_requests.length, pull_requests };
}

export function summarizePrs(rows: ImportedPr[]) {
  const dates = rows.map(row => row.retrieved_at).sort();
  return {
    total: rows.length, open: rows.filter(row => row.status === 'open').length,
    merged: rows.filter(row => row.status === 'merged').length, closed: rows.filter(row => row.status === 'closed').length,
    drafts: rows.filter(row => row.status === 'open' && row.draft).length,
    nonPublic: rows.filter(row => row.repository_visibility !== 'public').length,
    repositories: [...new Set(rows.map(row => row.repository))].sort(),
    retrievedFrom: dates[0] ?? null, retrievedTo: dates.at(-1) ?? null,
  };
}
export function filterPrs(rows: ImportedPr[], filters: PrFilters): ImportedPr[] {
  const search = filters.search?.trim().toLocaleLowerCase('sr-Latn') ?? '';
  return rows.filter(row =>
    (!filters.repository || filters.repository === 'all' || row.repository === filters.repository) &&
    (!filters.status || filters.status === 'all' || row.status === filters.status) &&
    (!filters.visibility || filters.visibility === 'all' || row.repository_visibility === filters.visibility) &&
    (!filters.draftsOnly || (row.status === 'open' && row.draft)) &&
    (!search || `${row.repository} #${row.number} ${row.title} ${row.author} ${row.body} ${row.labels.join(' ')}`.toLocaleLowerCase('sr-Latn').includes(search))
  ).sort((a, b) => b.updated_at.localeCompare(a.updated_at) || a.repository.localeCompare(b.repository) || b.number - a.number);
}
export function serializePrs(rows: ImportedPr[]): string {
  return JSON.stringify({ schema_version: '1.0', owner: 'spaja86', total: rows.length, pull_requests: rows }, null, 2);
}
