import { createHash } from 'crypto';
import type { Database } from '@/lib/supabase/types';
import { getOpenAISafe } from '@/lib/openai/client';
import { getSupabaseServerClient } from '@/lib/supabase/server';

type SupabaseClient = ReturnType<typeof getSupabaseServerClient>;

export interface KnowledgeCitation {
  id: string;
  title: string;
  sourceUrl: string;
  snippet: string;
  score: number;
  sourceName: string;
}

export interface KnowledgeContextResult {
  contextBlock: string;
  citations: KnowledgeCitation[];
  latencyMs: number;
}

export interface KnowledgePolicy {
  allowlistDomains: string[];
  denylistDomains: string[];
  maxUrlsPerJob: number;
  maxFetchBytes: number;
  maxChunkLength: number;
  chunkOverlap: number;
}

interface IngestResult {
  sourceId: string;
  documentId: string;
  chunks: number;
  canonicalUrl: string;
}

interface KnowledgeSearchOptions {
  limit?: number;
}

interface KnowledgeIndexingOptions {
  batchSize?: number;
  maxBatches?: number;
  sourceId?: string | null;
  documentId?: string | null;
  forceReindex?: boolean;
  triggerType?: 'manual' | 'schedule' | 'reindex';
  requestedBy?: string | null;
  /** v1 (default), v2, v3 ili v4 (INDEKSIRANJE 4 semantic/hybrid pipeline). */
  indexVersion?: 'v1' | 'v2' | 'v3' | 'v4';
  /** Kada true, odabira i već v1-indeksirane chunk-ove za upgrade na v2. */
  upgradeToV2?: boolean;
  /** Kada true, odabira v1 i v2 indeksirane chunk-ove za upgrade na v3. */
  upgradeToV3?: boolean;
  /** Kada true, odabira v1/v2/v3 indeksirane chunk-ove za upgrade na v4. */
  upgradeToV4?: boolean;
}

export interface KnowledgeIndexingResult {
  jobId: string;
  processed: number;
  indexed: number;
  failed: number;
  durationMs: number;
  errors: Array<{ chunkId: string; reason: string }>;
}

export interface KnowledgeIndexStatus {
  queue: {
    notIndexed: number;
    indexed: number;
    indexedV1: number;
    indexedV2: number;
    indexedV3: number;
    indexedV4: number;
    failed: number;
  };
  jobs24h: {
    total: number;
    successful: number;
    failed: number;
    averageLatencyMs: number;
    throughputPerMinute: number;
  };
  latestJobs: Array<Database['public']['Tables']['knowledge_index_jobs']['Row']>;
}

const DEFAULT_ALLOWLIST = [
  'spaja.rs',
  'spaja.com',
  'kompanija-spaja.com',
  'vercel.app',
  'github.com',
  'docs.github.com',
];

const DEFAULT_DENYLIST = ['accounts.google.com', 'drive.google.com', 'mail.google.com'];
const KNOWLEDGE_INDEX_VERSION = 'v1';
const KNOWLEDGE_INDEX_VERSION_V2 = 'v2';
const KNOWLEDGE_INDEX_VERSION_V3 = 'v3';
const KNOWLEDGE_INDEX_VERSION_V4 = 'v4';
const KNOWLEDGE_EMBEDDING_MODEL_V4 = process.env.SPAJA_BAZA_EMBEDDING_MODEL ?? 'text-embedding-3-small';
const KNOWLEDGE_EMBEDDING_MODEL_VERSION_V4 = process.env.SPAJA_BAZA_EMBEDDING_MODEL_VERSION ?? 'v4';
const KNOWLEDGE_EMBEDDING_DIM_V4 = Number(process.env.SPAJA_BAZA_EMBEDDING_DIM ?? 1536);
const SEARCH_SCORE_WEIGHTS = {
  lexical: 0.6,
  trust: 0.25,
  indexCoverage: 0.15,
} as const;
// v2 scoring: nagrada za učestalost pojave termina i bogatstvo vokabulara.
const SEARCH_SCORE_WEIGHTS_V2 = {
  lexical: 0.45,
  termFrequency: 0.20,
  trust: 0.20,
  keywordDensity: 0.15,
} as const;
// v3 scoring: FTS multi-term + pozicioni signal unutar dokumenta.
const SEARCH_SCORE_WEIGHTS_V3 = {
  lexical: 0.35,
  termFrequency: 0.25,
  trust: 0.20,
  keywordDensity: 0.15,
  positionScore: 0.05,
} as const;
const SEARCH_SCORE_WEIGHTS_V4 = {
  semanticSimilarity: 0.35,
  lexical: 0.20,
  termFrequency: 0.15,
  trust: 0.15,
  keywordDensity: 0.10,
  positionScore: 0.05,
} as const;
const INDEXING_DEFAULT_MAX_RETRIES = 5;
const INDEXING_MAX_RETRIES_CAP = 10;
const INDEXING_DEFAULT_RETRY_BACKOFF_MS = 60_000;
const INDEXING_MIN_RETRY_BACKOFF_MS = 5_000;

// Shared select string for knowledge_chunks search queries (FTS, ilike, fallback).
const KNOWLEDGE_SEARCH_SELECT = `
  id,
  chunk_index,
  content,
  indexed_content,
  embedding_status,
  index_version,
  keyword_density,
  position_score,
  knowledge_documents!inner (
    id,
    title,
    canonical_url,
    trust_score,
    knowledge_sources!inner (name)
  )
`;

function splitCsv(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function getKnowledgePolicy(): KnowledgePolicy {
  const allowlistDomains = splitCsv(process.env.SPAJA_BAZA_ALLOWLIST_DOMAINS);
  const denylistDomains = splitCsv(process.env.SPAJA_BAZA_DENYLIST_DOMAINS);

  return {
    allowlistDomains: allowlistDomains.length > 0 ? allowlistDomains : DEFAULT_ALLOWLIST,
    denylistDomains: denylistDomains.length > 0 ? denylistDomains : DEFAULT_DENYLIST,
    maxUrlsPerJob: Number(process.env.SPAJA_BAZA_MAX_URLS_PER_JOB ?? 10),
    maxFetchBytes: Number(process.env.SPAJA_BAZA_MAX_FETCH_BYTES ?? 1_000_000),
    maxChunkLength: Number(process.env.SPAJA_BAZA_MAX_CHUNK_LENGTH ?? 1200),
    chunkOverlap: Number(process.env.SPAJA_BAZA_CHUNK_OVERLAP ?? 200),
  };
}

export function canonicalizeUrl(url: string): string {
  const parsed = new URL(url);
  parsed.hash = '';
  for (const key of Array.from(parsed.searchParams.keys())) {
    if (key.toLowerCase().startsWith('utm_') || key.toLowerCase() === 'fbclid') {
      parsed.searchParams.delete(key);
    }
  }
  parsed.pathname = parsed.pathname.replace(/\/+$/, '') || '/';
  return parsed.toString();
}

function extractDomain(url: string): string {
  return new URL(url).hostname.toLowerCase();
}

function isDomainMatch(domain: string, rule: string): boolean {
  return domain === rule || domain.endsWith(`.${rule}`);
}

export function isUrlAllowed(url: string, policy = getKnowledgePolicy()): boolean {
  const parsed = new URL(url);
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return false;
  const domain = parsed.hostname.toLowerCase();
  if (policy.denylistDomains.some((rule) => isDomainMatch(domain, rule))) return false;
  return policy.allowlistDomains.some((rule) => isDomainMatch(domain, rule));
}

function sanitizeText(raw: string): string {
  const withoutScript = stripTagBlock(raw, 'script');
  const withoutStyle = stripTagBlock(withoutScript, 'style');
  const withoutNoScript = stripTagBlock(withoutStyle, 'noscript');

  return withoutNoScript
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function sanitizeForPrompt(raw: string): string {
  return raw
    .replace(/ignore\s+all\s+instructions?/gi, '[REMOVED_UNTRUSTED_INSTRUCTION]')
    .replace(/disregard\s+all\s+instructions?/gi, '[REMOVED_UNTRUSTED_INSTRUCTION]')
    .replace(/override\s+previous\s+instructions?/gi, '[REMOVED_UNTRUSTED_INSTRUCTION]')
    .replace(/override\s+system\s+instructions?/gi, '[REMOVED_UNTRUSTED_INSTRUCTION]')
    .replace(/```[\s\S]*?```/g, '[CODE_BLOCK_REMOVED]')
    .trim();
}

function hashContent(text: string): string {
  return createHash('sha256').update(text).digest('hex');
}

function estimateTokens(text: string): number {
  return Math.max(1, Math.ceil(text.length / 4));
}

function chunkContent(text: string, maxLength: number, overlap: number): string[] {
  const chunks: string[] = [];
  if (!text) return chunks;
  const safeMaxLength = Math.max(200, maxLength);
  const safeOverlap = Math.max(0, Math.min(overlap, safeMaxLength - 1));
  let cursor = 0;
  while (cursor < text.length) {
    const end = Math.min(cursor + safeMaxLength, text.length);
    chunks.push(text.slice(cursor, end).trim());
    if (end >= text.length) {
      cursor = end;
      break;
    }
    cursor = Math.max(0, end - safeOverlap);
  }
  return chunks.filter(Boolean);
}

function stripTagBlock(input: string, tagName: string): string {
  const lowerInput = input.toLowerCase();
  const lowerTag = tagName.toLowerCase();
  const openToken = `<${lowerTag}`;
  const closeToken = `</${lowerTag}`;

  let result = '';
  let cursor = 0;

  while (cursor < input.length) {
    const start = lowerInput.indexOf(openToken, cursor);
    if (start === -1) {
      result += input.slice(cursor);
      break;
    }

    result += input.slice(cursor, start);
    const closeStart = lowerInput.indexOf(closeToken, start);
    if (closeStart === -1) break;
    const closeEnd = lowerInput.indexOf('>', closeStart);
    if (closeEnd === -1) break;
    cursor = closeEnd + 1;
  }

  return result;
}

export function normalizeLimit(rawLimit: number, fallback = 5, min = 1, max = 10): number {
  if (!Number.isFinite(rawLimit)) return fallback;
  return Math.max(min, Math.min(rawLimit, max));
}

async function createOrUpdateSource(
  supabase: SupabaseClient,
  url: string,
  createdBy?: string,
): Promise<Database['public']['Tables']['knowledge_sources']['Row']> {
  const canonical = canonicalizeUrl(url);
  const domain = extractDomain(canonical);

  const { data, error } = await supabase
    .from('knowledge_sources')
    .upsert(
      {
        name: domain,
        source_url: canonical,
        domain,
        status: 'active',
        ingest_mode: 'manual',
        robots_policy_status: 'allowed',
        tos_policy_status: 'allowed',
        created_by: createdBy ?? null,
      },
      { onConflict: 'source_url' },
    )
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(`Neuspešno kreiranje izvora: ${error?.message ?? 'unknown error'}`);
  }

  return data;
}

async function insertDocumentAndChunks(
  supabase: SupabaseClient,
  sourceId: string,
  sourceUrl: string,
  title: string,
  contentType: string,
  cleanedContent: string,
  statusCode: number,
  policy: KnowledgePolicy,
): Promise<IngestResult> {
  const canonicalUrl = canonicalizeUrl(sourceUrl);
  const contentHash = hashContent(cleanedContent);

  const { data: document, error: documentError } = await supabase
    .from('knowledge_documents')
    .upsert(
      {
        source_id: sourceId,
        source_url: sourceUrl,
        canonical_url: canonicalUrl,
        title: title || canonicalUrl,
        content_type: contentType,
        content_hash: contentHash,
        content_length: cleanedContent.length,
        raw_content: cleanedContent,
        cleaned_content: cleanedContent,
        status: 'processed',
        fetch_status_code: statusCode,
        fetched_at: new Date().toISOString(),
        indexed_at: new Date().toISOString(),
        prompt_injection_risk: 'low',
      },
      { onConflict: 'content_hash' },
    )
    .select('id, canonical_url')
    .single();

  if (documentError || !document) {
    throw new Error(`Neuspešan upis dokumenta: ${documentError?.message ?? 'unknown error'}`);
  }

  await supabase.from('knowledge_chunks').delete().eq('document_id', document.id);

  const chunks = chunkContent(cleanedContent, policy.maxChunkLength, policy.chunkOverlap);
  if (chunks.length > 0) {
    const rows = chunks.map((chunk, index) => ({
      document_id: document.id,
      chunk_index: index,
      content: sanitizeForPrompt(chunk),
      // Popunjava se kroz runKnowledgeIndexing kada chunk pređe u indexed status.
      indexed_content: '',
      token_count: estimateTokens(chunk),
      embedding_status: 'not_indexed' as const,
      indexing_attempts: 0,
      indexing_error: null,
      last_index_attempt_at: null,
      indexed_at: null,
      index_version: KNOWLEDGE_INDEX_VERSION,
      safety_label: 'safe' as const,
    }));

    const { error: chunkError } = await supabase.from('knowledge_chunks').insert(rows);
    if (chunkError) {
      throw new Error(`Neuspešan upis chunk-ova: ${chunkError.message}`);
    }
  }

  return {
    sourceId,
    documentId: document.id,
    chunks: chunks.length,
    canonicalUrl: document.canonical_url,
  };
}

function extractTitle(html: string, fallback: string): string {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (titleMatch?.[1]) {
    return sanitizeText(titleMatch[1]).slice(0, 160) || fallback;
  }
  return fallback;
}

export async function ingestKnowledgeUrls(
  urls: string[],
  options?: { userId?: string },
): Promise<{
  jobId: string;
  processed: number;
  succeeded: number;
  failed: number;
  results: IngestResult[];
  errors: Array<{ url: string; reason: string }>;
}> {
  const policy = getKnowledgePolicy();
  const supabase = getSupabaseServerClient();
  const limited = urls.slice(0, policy.maxUrlsPerJob);
  const start = Date.now();
  const userAgent = process.env.SPAJA_BAZA_USER_AGENT ?? 'SpajaBazaKnowledgeBot/1.0';

  const { data: job, error: jobError } = await supabase
    .from('knowledge_crawl_jobs')
    .insert({
      trigger_type: 'manual',
      status: 'running',
      candidate_urls: limited,
      created_by: options?.userId ?? null,
      started_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (jobError || !job) {
    throw new Error(`Neuspešno kreiranje crawl job-a: ${jobError?.message ?? 'unknown error'}`);
  }

  const results: IngestResult[] = [];
  const errors: Array<{ url: string; reason: string }> = [];

  for (const rawUrl of limited) {
    try {
      const candidate = canonicalizeUrl(rawUrl);
      if (!isUrlAllowed(candidate, policy)) {
        throw new Error('URL nije dozvoljen po whitelist/denylist politici.');
      }

      const source = await createOrUpdateSource(supabase, candidate, options?.userId);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12_000);
      const response = await fetch(source.source_url, {
        signal: controller.signal,
        headers: { 'User-Agent': userAgent },
      });
      clearTimeout(timeout);

      const contentType = response.headers.get('content-type') ?? 'text/html';
      const body = await response.text();
      const truncated = body.slice(0, policy.maxFetchBytes);
      const cleaned = sanitizeText(truncated);

      if (!cleaned) throw new Error('Prazan sadržaj posle ekstrakcije.');

      const ingest = await insertDocumentAndChunks(
        supabase,
        source.id,
        candidate,
        extractTitle(body, candidate),
        contentType,
        cleaned,
        response.status,
        policy,
      );

      results.push(ingest);
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'Nepoznata greška';
      errors.push({ url: rawUrl, reason });
      await supabase.from('knowledge_dead_letters').insert({
        job_id: job.id,
        source_url: rawUrl,
        error_code: 'ingest_error',
        error_message: reason,
      });
    }
  }

  const latencyMs = Date.now() - start;
  await supabase
    .from('knowledge_crawl_jobs')
    .update({
      status: errors.length === 0 ? 'completed' : results.length > 0 ? 'partial' : 'failed',
      processed_urls: limited.length,
      succeeded_urls: results.length,
      failed_urls: errors.length,
      finished_at: new Date().toISOString(),
      latency_ms: latencyMs,
      error_log: errors,
    })
    .eq('id', job.id);

  return {
    jobId: job.id,
    processed: limited.length,
    succeeded: results.length,
    failed: errors.length,
    results,
    errors,
  };
}

interface ChunkRow {
  id: string;
  chunk_index: number;
  content: string;
  // Normalizovan sadržaj koji služi kao indeksni tekst za bržu pretragu.
  indexed_content: string;
  embedding_status: 'not_indexed' | 'indexed' | 'failed';
  // v1, v2 ili v3 — određuje koja scoring formula se primenjuje.
  index_version: string;
  // Pre-izračunata gustina ključnih reči (0–1); koristi se za v2/v3 scoring.
  keyword_density: number;
  // Pre-izračunati pozicioni score (0–1); koristi se samo za v3 scoring.
  position_score: number;
  // Semantic score (0-1), primarno za v4 monitoring.
  semantic_score?: number;
  knowledge_documents: {
    id: string;
    title: string;
    canonical_url: string;
    trust_score: number;
    knowledge_sources: {
      name: string;
    } | null;
  } | null;
}

interface V4RpcChunkRow {
  id: string;
  chunk_index: number;
  content: string;
  indexed_content: string;
  embedding_status: 'not_indexed' | 'indexed' | 'failed';
  index_version: string;
  keyword_density: number;
  position_score: number;
  semantic_similarity: number;
  semantic_score: number;
  document_id: string;
  title: string;
  canonical_url: string;
  trust_score: number;
  source_name: string | null;
}

interface KnowledgeSearchExecution {
  citations: KnowledgeCitation[];
  retrievalIndexVersion: 'v1' | 'v2' | 'v3' | 'v4';
  semanticRetrievalUsed: boolean;
}

function getChunkIndexVersion(indexVersion: string): 'v1' | 'v2' | 'v3' | 'v4' {
  if (indexVersion === KNOWLEDGE_INDEX_VERSION_V4) return 'v4';
  if (indexVersion === KNOWLEDGE_INDEX_VERSION_V3) return 'v3';
  if (indexVersion === KNOWLEDGE_INDEX_VERSION_V2) return 'v2';
  return 'v1';
}

function normalizeIndexText(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function computeScore(content: string, terms: string[]): number {
  const lower = content.toLowerCase();
  const matches = terms.reduce((sum, term) => sum + (lower.includes(term) ? 1 : 0), 0);
  const density = matches / Math.max(1, terms.length);
  return Math.min(1, density);
}

function computeIndexedCoverageScore(indexedContent: string): number {
  // Binarnost je namerna: indeksni pipeline je gate signal (indeksirano/nije indeksirano).
  return indexedContent.length > 0 ? 1 : 0;
}

function buildIndexedContent(content: string): string {
  return normalizeIndexText(sanitizeForPrompt(content)).slice(0, 6000);
}

// ─── INDEKSIRANJE 2 — v2 helper funkcije ────────────────────────────────────

/** Izvlači bigrame iz susednih reči (minimalna dužina 3 slova). */
function extractBigrams(words: string[]): string[] {
  const bigrams: string[] = [];
  for (let i = 0; i < words.length - 1; i++) {
    if (words[i].length > 2 && words[i + 1].length > 2) {
      bigrams.push(`${words[i]}_${words[i + 1]}`);
    }
  }
  return bigrams;
}

/**
 * v2 varijanta buildIndexedContent:
 * normalizovani tekst + top bigrami za poboljšano višerečno poklapanje.
 */
function buildIndexedContentV2(content: string): string {
  const normalized = normalizeIndexText(sanitizeForPrompt(content));
  const words = normalized.split(/\s+/).filter((w) => w.length > 2);
  const bigrams = extractBigrams(words).slice(0, 40);
  const enriched = bigrams.length > 0 ? `${normalized} ${bigrams.join(' ')}` : normalized;
  return enriched.slice(0, 6000);
}

/**
 * Gustina ključnih reči: udeo jedinstvenih tokena u ukupnom broju tokena.
 * Vrednost 0–1; visoka vrednost = bogat, raznoliki vokabular.
 */
function computeKeywordDensity(content: string): number {
  const normalized = normalizeIndexText(content);
  const words = normalized.split(/\s+/).filter((w) => w.length > 2);
  if (words.length === 0) return 0;
  const unique = new Set(words);
  return Number((unique.size / words.length).toFixed(4));
}

/** Broj distinktnih značajnih tokena u sadržaju (tokeni dužine > 2). */
function computeUniqueTermCount(content: string): number {
  const normalized = normalizeIndexText(content);
  const words = normalized.split(/\s+/).filter((w) => w.length > 2);
  return new Set(words).size;
}

/**
 * v2 term-frequency score: nagrada za ponavljanje termina upita.
 * Svaki term se cappuje na 5 pojavljivanja = score 1.
 */
function computeTermFrequencyScore(content: string, terms: string[]): number {
  if (terms.length === 0) return 0;
  const lower = content.toLowerCase();
  const freqs = terms.map((term) => {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const count = (lower.match(new RegExp(escaped, 'g')) ?? []).length;
    return Math.min(count / 5, 1);
  });
  return freqs.reduce((sum, s) => sum + s, 0) / terms.length;
}

// ─── INDEKSIRANJE 3 — v3 helper funkcije ────────────────────────────────────

/**
 * v3 position score: eksponencijalno opadanje po chunk_index unutar dokumenta.
 * chunk 0 → 1.0; chunk 10 → ≈0.37; chunk 20 → ≈0.14.
 * Nagrađuje chunk-ove koji se pojavljuju ranije (naslov, uvod, ključni pojmovi).
 */
function computePositionScore(chunkIndex: number): number {
  const idx = Math.max(0, chunkIndex);
  return Math.round(Math.exp(-idx * 0.1) * 10000) / 10000;
}

function toVectorLiteral(vector: number[]): string {
  return `[${vector.map((v) => Number(v.toFixed(8))).join(',')}]`;
}

function normalizeEmbeddingInput(content: string): string {
  const normalized = sanitizeForPrompt(content).replace(/\s+/g, ' ').trim();
  // 4000 karaktera drži input unutar sigurnog token budžeta za embeddings API.
  return normalized.slice(0, 4000);
}

async function createEmbeddingVector(content: string): Promise<number[]> {
  const openai = getOpenAISafe();
  if (!openai) {
    throw new Error('OPENAI_API_KEY nije postavljen; v4 embedding pipeline nije dostupan.');
  }
  const input = normalizeEmbeddingInput(content);
  if (!input) {
    throw new Error('Chunk je prazan nakon normalizacije za embedding.');
  }

  let response: Awaited<ReturnType<typeof openai.embeddings.create>>;
  try {
    response = await openai.embeddings.create({
      model: KNOWLEDGE_EMBEDDING_MODEL_V4,
      input,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'embedding API unknown error';
    throw new Error(`Embedding API greška (${KNOWLEDGE_EMBEDDING_MODEL_V4}): ${message}`);
  }
  const vector = response.data?.[0]?.embedding;
  if (!Array.isArray(vector) || vector.length === 0) {
    throw new Error('Embedding provider nije vratio validan vektor.');
  }
  if (vector.length !== KNOWLEDGE_EMBEDDING_DIM_V4) {
    throw new Error(`Neočekivana embedding dimenzija: ${vector.length} (očekivano ${KNOWLEDGE_EMBEDDING_DIM_V4})`);
  }
  return vector;
}

function getIndexableStatuses(forceReindex: boolean): Array<'not_indexed' | 'failed' | 'indexed'> {
  return forceReindex ? ['not_indexed', 'failed', 'indexed'] : ['not_indexed', 'failed'];
}

function shouldRetryChunk(candidate: IndexCandidateRow, retryBackoffMs: number): boolean {
  if (candidate.embedding_status !== 'failed') return true;
  if (!candidate.last_index_attempt_at) return true;
  return Date.now() - new Date(candidate.last_index_attempt_at).getTime() >= retryBackoffMs;
}

async function executeKnowledgeSearch(
  query: string,
  options?: KnowledgeSearchOptions,
): Promise<KnowledgeSearchExecution> {
  const supabase = getSupabaseServerClient();
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return {
      citations: [],
      retrievalIndexVersion: KNOWLEDGE_INDEX_VERSION,
      semanticRetrievalUsed: false,
    };
  }

  const limit = Math.max(1, Math.min(options?.limit ?? 5, 10));
  const terms = normalized
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 2)
    .slice(0, 8);

  // v4: semantic retrieval (vector similarity) je primarni put,
  // zatim v3 FTS i na kraju ilike fallback.
  let semanticRows: ChunkRow[] = [];
  let semanticRetrievalUsed = false;
  try {
    const queryEmbedding = await createEmbeddingVector(normalized);
    const semanticResult = await supabase.rpc('match_knowledge_chunks_v4', {
      query_vector_literal: toVectorLiteral(queryEmbedding),
      match_count: 80,
      min_similarity: 0.2,
    });
    if (!semanticResult.error && (semanticResult.data ?? []).length > 0) {
      semanticRows = (semanticResult.data ?? []).map((row) => {
        const rpcRow = row as unknown as V4RpcChunkRow;
        return {
          id: rpcRow.id,
          chunk_index: rpcRow.chunk_index,
          content: rpcRow.content,
          indexed_content: rpcRow.indexed_content,
          embedding_status: rpcRow.embedding_status,
          index_version: rpcRow.index_version,
          keyword_density: rpcRow.keyword_density ?? 0,
          position_score: rpcRow.position_score ?? 0,
          // semantic_score u runtime scoring-u tretiramo kao similarity signal;
          // za v4 RPC primaran izvor je semantic_similarity.
          semantic_score: rpcRow.semantic_similarity ?? rpcRow.semantic_score ?? 0,
          knowledge_documents: {
            id: rpcRow.document_id,
            title: rpcRow.title,
            canonical_url: rpcRow.canonical_url,
            trust_score: rpcRow.trust_score ?? 0,
            knowledge_sources: { name: rpcRow.source_name ?? 'nepoznat-izvor' },
          },
        } satisfies ChunkRow;
      });
      semanticRetrievalUsed = true;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown semantic retrieval error';
    console.error('[searchKnowledge] v4 semantic retrieval failed, falling back to lexical path:', message);
    semanticRows = [];
  }

  const ftsQuery = terms.join(' ');
  const likeTerm = `%${terms[0] ?? normalized}%`;

  // Primary: FTS textSearch (uses GIN index, all terms)
  let indexedSearchData = null;
  if (ftsQuery) {
    const ftsResult = await supabase
      .from('knowledge_chunks')
      .select(KNOWLEDGE_SEARCH_SELECT)
      .eq('embedding_status', 'indexed')
      .textSearch('indexed_content', ftsQuery, { type: 'plain', config: 'simple' })
      .limit(80);
    if (ftsResult.error) {
      console.error('[searchKnowledge] FTS error, falling back to ilike:', ftsResult.error.message);
    } else {
      indexedSearchData = ftsResult.data;
    }
  }

  // FTS fallback: ilike on first term when FTS returns nothing (short/stopword queries)
  if (!indexedSearchData || indexedSearchData.length === 0) {
    const ilikeResult = await supabase
      .from('knowledge_chunks')
      .select(KNOWLEDGE_SEARCH_SELECT)
      .eq('embedding_status', 'indexed')
      .ilike('indexed_content', likeTerm)
      .limit(80);
    indexedSearchData = ilikeResult.data;
  }

  // Fallback for non-indexed chunks
  const fallbackSearch = await supabase
    .from('knowledge_chunks')
    .select(KNOWLEDGE_SEARCH_SELECT)
    .ilike('content', likeTerm)
    .limit(80);

  const primaryRows = semanticRows.length > 0 ? semanticRows : (indexedSearchData ?? []);
  const fallbackRows = fallbackSearch.data ?? [];
  const mergedRows = primaryRows.length > 0
    ? primaryRows
    // Ako indexed skup postoji, fallback čuva samo neindeksirane/fail redove
    // da se izbegne dupliranje istog chunk-a kroz dva upita.
    : fallbackRows.filter((row) => row.embedding_status !== 'indexed');

  if (mergedRows.length === 0) {
    return {
      citations: [],
      retrievalIndexVersion: KNOWLEDGE_INDEX_VERSION,
      semanticRetrievalUsed,
    };
  }

  const scored = (mergedRows as unknown as ChunkRow[])
    .map((row) => {
      const lexicalScore = computeScore(row.content, terms);
      const trustScore = row.knowledge_documents?.trust_score ?? 0;
      const isV4Chunk = row.index_version === KNOWLEDGE_INDEX_VERSION_V4;
      const isV3Chunk = row.index_version === KNOWLEDGE_INDEX_VERSION_V3;
      const isV2Chunk = row.index_version === KNOWLEDGE_INDEX_VERSION_V2;

      let score: number;
      if (isV4Chunk) {
        const termFreqScore = computeTermFrequencyScore(row.content, terms);
        const kdScore = Math.min(row.keyword_density ?? 0, 1);
        const posScore = Math.min(row.position_score ?? 0, 1);
        const semanticSimilarity = Math.min(row.semantic_score ?? 0, 1);
        score = Number((
          semanticSimilarity * SEARCH_SCORE_WEIGHTS_V4.semanticSimilarity +
          lexicalScore * SEARCH_SCORE_WEIGHTS_V4.lexical +
          termFreqScore * SEARCH_SCORE_WEIGHTS_V4.termFrequency +
          trustScore * SEARCH_SCORE_WEIGHTS_V4.trust +
          kdScore * SEARCH_SCORE_WEIGHTS_V4.keywordDensity +
          posScore * SEARCH_SCORE_WEIGHTS_V4.positionScore
        ).toFixed(4));
      } else if (isV3Chunk) {
        // v3: FTS-retrieved + term-frequency + keyword density + position signal.
        const termFreqScore = computeTermFrequencyScore(row.content, terms);
        const kdScore = Math.min(row.keyword_density ?? 0, 1);
        const posScore = Math.min(row.position_score ?? 0, 1);
        score = Number((
          lexicalScore * SEARCH_SCORE_WEIGHTS_V3.lexical +
          termFreqScore * SEARCH_SCORE_WEIGHTS_V3.termFrequency +
          trustScore * SEARCH_SCORE_WEIGHTS_V3.trust +
          kdScore * SEARCH_SCORE_WEIGHTS_V3.keywordDensity +
          posScore * SEARCH_SCORE_WEIGHTS_V3.positionScore
        ).toFixed(4));
      } else if (isV2Chunk) {
        // v2: koristi term-frequency i keyword density kao dodatne signale.
        const termFreqScore = computeTermFrequencyScore(row.content, terms);
        const kdScore = Math.min(row.keyword_density ?? 0, 1);
        score = Number((
          lexicalScore * SEARCH_SCORE_WEIGHTS_V2.lexical +
          termFreqScore * SEARCH_SCORE_WEIGHTS_V2.termFrequency +
          trustScore * SEARCH_SCORE_WEIGHTS_V2.trust +
          kdScore * SEARCH_SCORE_WEIGHTS_V2.keywordDensity
        ).toFixed(4));
      } else {
        // v1: originalni hybrid scoring (lexical + trust + index coverage).
        const semanticScore = computeIndexedCoverageScore(row.indexed_content);
        score = Number((
          lexicalScore * SEARCH_SCORE_WEIGHTS.lexical +
          trustScore * SEARCH_SCORE_WEIGHTS.trust +
          semanticScore * SEARCH_SCORE_WEIGHTS.indexCoverage
        ).toFixed(4));
      }
      return {
        id: row.id,
        title: row.knowledge_documents?.title ?? 'Nepoznat dokument',
        sourceUrl: row.knowledge_documents?.canonical_url ?? '',
        snippet: row.content.slice(0, 320),
        score,
        sourceName: row.knowledge_documents?.knowledge_sources?.name ?? 'nepoznat-izvor',
        indexVersionForMetrics: getChunkIndexVersion(row.index_version),
      };
    })
    .filter((item) => Boolean(item.sourceUrl))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  const retrievalIndexVersion = scored[0]?.indexVersionForMetrics ?? KNOWLEDGE_INDEX_VERSION;
  const citations = scored.map((item) => ({
    id: item.id,
    title: item.title,
    sourceUrl: item.sourceUrl,
    snippet: item.snippet,
    score: item.score,
    sourceName: item.sourceName,
  })) satisfies KnowledgeCitation[];

  return {
    citations,
    retrievalIndexVersion,
    semanticRetrievalUsed,
  };
}

export async function searchKnowledge(
  query: string,
  options?: KnowledgeSearchOptions,
): Promise<KnowledgeCitation[]> {
  const result = await executeKnowledgeSearch(query, options);
  return result.citations;
}

interface IndexCandidateRow {
  id: string;
  document_id: string;
  chunk_index: number;
  content: string;
  embedding_status: 'not_indexed' | 'indexed' | 'failed';
  indexing_attempts: number;
  last_index_attempt_at: string | null;
  index_version: string;
}

function normalizeBatchSize(raw?: number): number {
  if (!Number.isFinite(raw)) return 25;
  return Math.max(1, Math.min(Number(raw), 200));
}

function normalizeMaxBatches(raw?: number): number {
  if (!Number.isFinite(raw)) return 1;
  return Math.max(1, Math.min(Number(raw), 100));
}

export async function runKnowledgeIndexing(options?: KnowledgeIndexingOptions): Promise<KnowledgeIndexingResult> {
  const supabase = getSupabaseServerClient();
  const batchSize = normalizeBatchSize(options?.batchSize);
  const maxBatches = normalizeMaxBatches(options?.maxBatches);
  const maxRetries = Math.max(
    1,
    Math.min(Number(process.env.SPAJA_BAZA_INDEX_MAX_RETRIES ?? INDEXING_DEFAULT_MAX_RETRIES), INDEXING_MAX_RETRIES_CAP),
  );
  const retryBackoffMs = Math.max(
    INDEXING_MIN_RETRY_BACKOFF_MS,
    Number(process.env.SPAJA_BAZA_INDEX_RETRY_BACKOFF_MS ?? INDEXING_DEFAULT_RETRY_BACKOFF_MS),
  );
  const now = Date.now();
  const targetVersion = options?.indexVersion ?? KNOWLEDGE_INDEX_VERSION;
  const upgradeToV2 = Boolean(options?.upgradeToV2);
  const upgradeToV3 = Boolean(options?.upgradeToV3);
  const upgradeToV4 = Boolean(options?.upgradeToV4);

  const { data: job, error: jobError } = await supabase
    .from('knowledge_index_jobs')
    .insert({
      status: 'running',
      trigger_type: options?.triggerType ?? (options?.forceReindex ? 'reindex' : 'manual'),
      source_id: options?.sourceId ?? null,
      document_id: options?.documentId ?? null,
      requested_by: options?.requestedBy ?? null,
      batch_size: batchSize,
      max_batches: maxBatches,
      started_at: new Date(now).toISOString(),
    })
    .select('id')
    .single();

  if (jobError || !job) {
    throw new Error(`Neuspešno kreiranje index job-a: ${jobError?.message ?? 'unknown error'}`);
  }

  const errors: Array<{ chunkId: string; reason: string }> = [];
  let processed = 0;
  let indexed = 0;
  let failed = 0;

  let documentFilterIds: string[] | null = null;
  if (options?.documentId) {
    documentFilterIds = [options.documentId];
  } else if (options?.sourceId) {
    const { data: documents } = await supabase
      .from('knowledge_documents')
      .select('id')
      .eq('source_id', options.sourceId)
      .limit(2000);
    documentFilterIds = (documents ?? []).map((doc) => doc.id);
    if (documentFilterIds.length === 0) {
      await supabase
        .from('knowledge_index_jobs')
        .update({
          status: 'completed',
          finished_at: new Date().toISOString(),
        })
        .eq('id', job.id);
      return { jobId: job.id, processed: 0, indexed: 0, failed: 0, durationMs: Date.now() - now, errors: [] };
    }
  }

  const allowedStatuses = (upgradeToV2 || upgradeToV3 || upgradeToV4)
    ? (['not_indexed', 'failed', 'indexed'] as Array<'not_indexed' | 'failed' | 'indexed'>)
    : getIndexableStatuses(Boolean(options?.forceReindex));

  for (let batch = 0; batch < maxBatches; batch++) {
    let chunkSelect = supabase
      .from('knowledge_chunks')
      .select('id, document_id, chunk_index, content, embedding_status, indexing_attempts, last_index_attempt_at, index_version')
      .in('embedding_status', allowedStatuses)
      .order('created_at', { ascending: true })
      .limit(batchSize);

    if (!options?.forceReindex) {
      chunkSelect = chunkSelect.lt('indexing_attempts', maxRetries);
    }
    if (upgradeToV4) {
      // Isključi chunk-ove koji su već na v4 da se izbegne nepotreban re-index.
      chunkSelect = chunkSelect.neq('index_version', KNOWLEDGE_INDEX_VERSION_V4);
    } else if (upgradeToV3) {
      // Isključi chunk-ove koji su već na v3 da se izbegne nepotreban re-index.
      chunkSelect = chunkSelect.neq('index_version', KNOWLEDGE_INDEX_VERSION_V3);
    } else if (upgradeToV2) {
      // Isključi chunk-ove koji su već na v2 da se izbegne nepotreban re-index.
      chunkSelect = chunkSelect.neq('index_version', KNOWLEDGE_INDEX_VERSION_V2);
    }
    if (documentFilterIds) {
      chunkSelect = chunkSelect.in('document_id', documentFilterIds);
    }

    const { data } = await chunkSelect;
    const candidates = (data ?? []) as IndexCandidateRow[];
    if (candidates.length === 0) break;

    const runnable = candidates.filter((candidate) => shouldRetryChunk(candidate, retryBackoffMs));
    if (runnable.length === 0) break;

    for (const chunk of runnable) {
      processed += 1;
      const attemptAt = new Date().toISOString();
      const attempts = (chunk.indexing_attempts ?? 0) + 1;

      try {
        const isV3 = targetVersion === KNOWLEDGE_INDEX_VERSION_V3;
        const isV4 = targetVersion === KNOWLEDGE_INDEX_VERSION_V4;
        const isV2 = targetVersion === KNOWLEDGE_INDEX_VERSION_V2;
        const indexedContent = (isV2 || isV3 || isV4)
          ? buildIndexedContentV2(chunk.content)
          : buildIndexedContent(chunk.content);
        const keywordDensity = (isV2 || isV3 || isV4) ? computeKeywordDensity(chunk.content) : 0;
        const uniqueTermCount = (isV2 || isV3 || isV4) ? computeUniqueTermCount(chunk.content) : 0;
        const positionScore = (isV3 || isV4) ? computePositionScore(chunk.chunk_index) : 0;
        const embeddingVector = isV4 ? await createEmbeddingVector(chunk.content) : null;
        // semantic_score je coverage signal (0/1): da li chunk ima validan v4 embedding.
        const hasSemanticEmbedding = isV4 && embeddingVector ? 1 : 0;

        const { error } = await supabase
          .from('knowledge_chunks')
          .update({
            indexed_content: indexedContent,
            embedding_status: 'indexed',
            indexing_attempts: attempts,
            indexing_error: null,
            last_index_attempt_at: attemptAt,
            indexed_at: attemptAt,
            index_version: targetVersion,
            keyword_density: keywordDensity,
            unique_term_count: uniqueTermCount,
            position_score: positionScore,
            embedding_model: isV4 ? KNOWLEDGE_EMBEDDING_MODEL_V4 : null,
            embedding_model_version: isV4 ? KNOWLEDGE_EMBEDDING_MODEL_VERSION_V4 : null,
            embedding_generated_at: isV4 ? attemptAt : null,
            embedding_vector: embeddingVector ? toVectorLiteral(embeddingVector) : null,
            semantic_score: hasSemanticEmbedding,
          })
          .eq('id', chunk.id);

        if (error) throw new Error(error.message);
        indexed += 1;
      } catch (error) {
        const reason = error instanceof Error ? error.message : 'Nepoznata greška';
        failed += 1;
        errors.push({ chunkId: chunk.id, reason });

        await supabase
          .from('knowledge_chunks')
          .update({
            embedding_status: 'failed',
            indexing_attempts: attempts,
            indexing_error: reason,
            last_index_attempt_at: attemptAt,
          })
          .eq('id', chunk.id);
      }
    }
  }

  const durationMs = Date.now() - now;
  const throughput = durationMs > 0 ? Number(((indexed * 60_000) / durationMs).toFixed(2)) : 0;
  await supabase
    .from('knowledge_index_jobs')
    .update({
      status: failed === 0 ? 'completed' : indexed > 0 ? 'partial' : 'failed',
      processed_chunks: processed,
      indexed_chunks: indexed,
      failed_chunks: failed,
      average_latency_ms: processed > 0 ? Math.round(durationMs / processed) : 0,
      throughput_per_minute: throughput,
      finished_at: new Date().toISOString(),
      error_log: errors,
    })
    .eq('id', job.id);

  return {
    jobId: job.id,
    processed,
    indexed,
    failed,
    durationMs,
    errors,
  };
}

export async function getKnowledgeIndexStatus(): Promise<KnowledgeIndexStatus> {
  const supabase = getSupabaseServerClient();
  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const [notIndexed, indexed, failed, indexedV1, indexedV2, indexedV3, indexedV4, jobs24h, latestJobs] = await Promise.all([
    supabase.from('knowledge_chunks').select('*', { count: 'exact', head: true }).eq('embedding_status', 'not_indexed'),
    supabase.from('knowledge_chunks').select('*', { count: 'exact', head: true }).eq('embedding_status', 'indexed'),
    supabase.from('knowledge_chunks').select('*', { count: 'exact', head: true }).eq('embedding_status', 'failed'),
    supabase.from('knowledge_chunks').select('*', { count: 'exact', head: true }).eq('embedding_status', 'indexed').eq('index_version', KNOWLEDGE_INDEX_VERSION),
    supabase.from('knowledge_chunks').select('*', { count: 'exact', head: true }).eq('embedding_status', 'indexed').eq('index_version', KNOWLEDGE_INDEX_VERSION_V2),
    supabase.from('knowledge_chunks').select('*', { count: 'exact', head: true }).eq('embedding_status', 'indexed').eq('index_version', KNOWLEDGE_INDEX_VERSION_V3),
    supabase.from('knowledge_chunks').select('*', { count: 'exact', head: true }).eq('embedding_status', 'indexed').eq('index_version', KNOWLEDGE_INDEX_VERSION_V4),
    supabase
      .from('knowledge_index_jobs')
      .select('*')
      .gte('created_at', since24h)
      .order('created_at', { ascending: false })
      .limit(100),
    supabase.from('knowledge_index_jobs').select('*').order('created_at', { ascending: false }).limit(20),
  ]);

  const rows24h = jobs24h.data ?? [];
  const successful = rows24h.filter((job) => job.status === 'completed').length;
  const failedCount = rows24h.filter((job) => job.status === 'failed').length;
  const avgLatency = rows24h.length > 0
    ? Math.round(rows24h.reduce((sum, row) => sum + (row.average_latency_ms ?? 0), 0) / rows24h.length)
    : 0;
  const throughputPerMinute = rows24h.length > 0
    ? Number((rows24h.reduce((sum, row) => sum + Number(row.throughput_per_minute ?? 0), 0) / rows24h.length).toFixed(2))
    : 0;

  return {
    queue: {
      notIndexed: notIndexed.count ?? 0,
      indexed: indexed.count ?? 0,
      indexedV1: indexedV1.count ?? 0,
      indexedV2: indexedV2.count ?? 0,
      indexedV3: indexedV3.count ?? 0,
      indexedV4: indexedV4.count ?? 0,
      failed: failed.count ?? 0,
    },
    jobs24h: {
      total: rows24h.length,
      successful,
      failed: failedCount,
      averageLatencyMs: avgLatency,
      throughputPerMinute,
    },
    latestJobs: (latestJobs.data ?? []) as Array<Database['public']['Tables']['knowledge_index_jobs']['Row']>,
  };
}

export async function buildKnowledgeContext(
  query: string,
  options?: {
    limit?: number;
    userId?: string | null;
    threadId?: string | null;
  },
): Promise<KnowledgeContextResult> {
  const start = Date.now();
  const searchResult = await executeKnowledgeSearch(query, { limit: options?.limit ?? 4 });
  const citations = searchResult.citations;

  const contextLines = citations.map(
    (citation, index) =>
      `[KB-${index + 1}] ${citation.title}\nURL: ${citation.sourceUrl}\nIzvor: ${citation.sourceName}\nSadržaj: ${citation.snippet}`,
  );

  const latencyMs = Date.now() - start;
  const contextBlock = contextLines.join('\n\n');

  const supabase = getSupabaseServerClient();
  await supabase.from('knowledge_retrieval_metrics').insert({
    query,
    user_id: options?.userId ?? null,
    thread_id: options?.threadId ?? null,
    latency_ms: latencyMs,
    results_count: citations.length,
    citations_count: citations.length,
    citation_rate: citations.length > 0 ? 1 : 0,
    quality_score: citations.length > 0 ? citations[0].score : 0,
    retrieval_index_version: searchResult.retrievalIndexVersion,
    semantic_retrieval_used: searchResult.semanticRetrievalUsed,
  });

  return { contextBlock, citations, latencyMs };
}

export async function saveKnowledgeCitations(params: {
  query: string;
  citations: KnowledgeCitation[];
  userId?: string | null;
  threadId?: string | null;
}): Promise<void> {
  if (params.citations.length === 0) return;
  const supabase = getSupabaseServerClient();

  await supabase.from('knowledge_citations').insert(
    params.citations.map((citation) => ({
      user_id: params.userId ?? null,
      thread_id: params.threadId ?? null,
      query: params.query,
      source_url: citation.sourceUrl,
      title: citation.title,
      score: citation.score,
      used_in_response: true,
      chunk_id: citation.id,
    })),
  );
}

export async function getKnowledgeHealth(): Promise<{
  status: 'healthy' | 'warning' | 'critical';
  totals: {
    sources: number;
    documents: number;
    chunks: number;
    jobs24h: number;
    failedJobs24h: number;
  };
}> {
  const supabase = getSupabaseServerClient();
  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const [sources, documents, chunks, jobs, failedJobs] = await Promise.all([
    supabase.from('knowledge_sources').select('*', { count: 'exact', head: true }),
    supabase.from('knowledge_documents').select('*', { count: 'exact', head: true }),
    supabase.from('knowledge_chunks').select('*', { count: 'exact', head: true }),
    supabase.from('knowledge_crawl_jobs').select('*', { count: 'exact', head: true }).gte('created_at', since24h),
    supabase.from('knowledge_crawl_jobs').select('*', { count: 'exact', head: true }).gte('created_at', since24h).eq('status', 'failed'),
  ]);

  const totals = {
    sources: sources.count ?? 0,
    documents: documents.count ?? 0,
    chunks: chunks.count ?? 0,
    jobs24h: jobs.count ?? 0,
    failedJobs24h: failedJobs.count ?? 0,
  };

  let status: 'healthy' | 'warning' | 'critical' = 'healthy';
  if (totals.failedJobs24h > 5) status = 'critical';
  else if (totals.failedJobs24h > 0) status = 'warning';

  return { status, totals };
}
