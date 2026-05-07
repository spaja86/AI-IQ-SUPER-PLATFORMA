import { createHash } from 'crypto';
import type { Database } from '@/lib/supabase/types';
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

const DEFAULT_ALLOWLIST = [
  'spaja.rs',
  'spaja.com',
  'kompanija-spaja.com',
  'vercel.app',
  'github.com',
  'docs.github.com',
];

const DEFAULT_DENYLIST = ['accounts.google.com', 'drive.google.com', 'mail.google.com'];

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
  parsed.searchParams.forEach((_, key) => {
    if (key.toLowerCase().startsWith('utm_') || key.toLowerCase() === 'fbclid') {
      parsed.searchParams.delete(key);
    }
  });
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
  const domain = extractDomain(url);
  if (policy.denylistDomains.some((rule) => isDomainMatch(domain, rule))) return false;
  return policy.allowlistDomains.some((rule) => isDomainMatch(domain, rule));
}

function sanitizeText(raw: string): string {
  return raw
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function sanitizeForPrompt(raw: string): string {
  return raw
    .replace(/\b(ignore|disregard|override)\s+(all|previous|system)\s+(instructions?)\b/gi, '[REMOVED_UNTRUSTED_INSTRUCTION]')
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
  let cursor = 0;
  while (cursor < text.length) {
    const end = Math.min(cursor + maxLength, text.length);
    chunks.push(text.slice(cursor, end).trim());
    if (end >= text.length) break;
    cursor = Math.max(0, end - overlap);
  }
  return chunks.filter(Boolean);
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
      token_count: estimateTokens(chunk),
      embedding_status: 'not_indexed' as const,
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
      const response = await fetch(candidate, {
        signal: controller.signal,
        headers: { 'User-Agent': 'SpajaBazaKnowledgeBot/1.0 (+https://ai-iq-super-platforma.vercel.app)' },
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

function computeScore(content: string, terms: string[]): number {
  const lower = content.toLowerCase();
  const matches = terms.reduce((sum, term) => sum + (lower.includes(term) ? 1 : 0), 0);
  const density = matches / Math.max(1, terms.length);
  return Math.min(1, density);
}

export async function searchKnowledge(
  query: string,
  options?: { limit?: number },
): Promise<KnowledgeCitation[]> {
  const supabase = getSupabaseServerClient();
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  const limit = Math.max(1, Math.min(options?.limit ?? 5, 10));
  const terms = normalized
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 2)
    .slice(0, 8);

  const likeTerm = `%${terms[0] ?? normalized}%`;
  const { data, error } = await supabase
    .from('knowledge_chunks')
    .select(`
      id,
      chunk_index,
      content,
      knowledge_documents!inner (
        id,
        title,
        canonical_url,
        trust_score,
        knowledge_sources!inner (name)
      )
    `)
    .ilike('content', likeTerm)
    .limit(80);

  if (error || !data) return [];

  const scored = (data as unknown as ChunkRow[])
    .map((row) => {
      const score = computeScore(row.content, terms);
      const trustScore = row.knowledge_documents?.trust_score ?? 0;
      return {
        id: row.id,
        title: row.knowledge_documents?.title ?? 'Nepoznat dokument',
        sourceUrl: row.knowledge_documents?.canonical_url ?? '',
        snippet: row.content.slice(0, 320),
        score: Number((score * 0.7 + trustScore * 0.3).toFixed(4)),
        sourceName: row.knowledge_documents?.knowledge_sources?.name ?? 'nepoznat-izvor',
      } satisfies KnowledgeCitation;
    })
    .filter((item) => Boolean(item.sourceUrl))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored;
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
  const citations = await searchKnowledge(query, { limit: options?.limit ?? 4 });

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

