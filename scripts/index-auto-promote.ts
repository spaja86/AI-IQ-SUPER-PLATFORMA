/**
 * scripts/index-auto-promote.ts
 *
 * INDEKSIRANJE 5 — Staged Auto-Promotion CLI script.
 *
 * Pokretanje:
 *   npx tsx scripts/index-auto-promote.ts
 *
 * Env varijable (obavezne za Supabase pristup):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   OPENAI_API_KEY  (opciono — potrebno samo za v3→v4 promociju)
 *
 * Opcione env varijable:
 *   PROMOTE_ALL_BATCH_SIZE     (default: 50)
 *   PROMOTE_ALL_MAX_BATCHES    (default: 10)
 *   PROMOTE_ALL_COOLDOWN_MS    (default: 500)
 *   INDEX_750_MODE             (default: false)
 *   INDEX_750_TARGET_PCT       (default: 75)
 *   INDEX_750_DEGRADE_PCT      (default: 7.5)
 *   INDEX_750_SAFE_STOP        (default: false)
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌  NEXT_PUBLIC_SUPABASE_URL i SUPABASE_SERVICE_ROLE_KEY moraju biti postavljeni.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const BATCH_SIZE = Math.max(1, Math.min(Number(process.env.PROMOTE_ALL_BATCH_SIZE ?? 50), 200));
const MAX_BATCHES = Math.max(1, Math.min(Number(process.env.PROMOTE_ALL_MAX_BATCHES ?? 10), 100));
const COOLDOWN_MS = Math.max(0, Number(process.env.PROMOTE_ALL_COOLDOWN_MS ?? 500));

const PROMOTE_V2_MIN_CONTENT_LENGTH = 100;
const INDEX_750_MODE = String(process.env.INDEX_750_MODE ?? 'false').toLowerCase() === 'true';
const INDEX_750_TARGET_PCT = Math.max(0, Math.min(Number(process.env.INDEX_750_TARGET_PCT ?? 75), 100));
const INDEX_750_DEGRADE_PCT = Math.max(0, Math.min(Number(process.env.INDEX_750_DEGRADE_PCT ?? 7.5), 100));
const INDEX_750_SAFE_STOP = String(process.env.INDEX_750_SAFE_STOP ?? 'false').toLowerCase() === 'true';

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

interface ChunkRow {
  id: string;
  document_id: string;
  chunk_index: number;
  content: string;
  embedding_status: string;
  indexing_attempts: number;
  last_index_attempt_at: string | null;
  index_version: string;
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

function extractBigrams(words: string[]): string[] {
  const bigrams: string[] = [];
  for (let i = 0; i < words.length - 1; i++) {
    if (words[i].length > 2 && words[i + 1].length > 2) {
      bigrams.push(`${words[i]}_${words[i + 1]}`);
    }
  }
  return bigrams;
}

function buildIndexedContentV2(content: string): string {
  const normalized = normalizeIndexText(content);
  const words = normalized.split(/\s+/).filter((w) => w.length > 2);
  const bigrams = extractBigrams(words).slice(0, 40);
  const enriched = bigrams.length > 0 ? `${normalized} ${bigrams.join(' ')}` : normalized;
  return enriched.slice(0, 6000);
}

function computeKeywordDensity(content: string): number {
  const normalized = normalizeIndexText(content);
  const words = normalized.split(/\s+/).filter((w) => w.length > 2);
  if (words.length === 0) return 0;
  const unique = new Set(words);
  return Number((unique.size / words.length).toFixed(4));
}

function computeUniqueTermCount(content: string): number {
  const normalized = normalizeIndexText(content);
  const words = normalized.split(/\s+/).filter((w) => w.length > 2);
  return new Set(words).size;
}

function computePositionScore(chunkIndex: number): number {
  const idx = Math.max(0, chunkIndex);
  return Math.round(Math.exp(-idx * 0.1) * 10000) / 10000;
}

async function logStagePromotion(params: {
  chunkId: string;
  fromVersion: string;
  toVersion: string;
  batchId: string;
  jobId: string;
  success: boolean;
  blockedReason?: string;
}): Promise<void> {
  await supabase.from('knowledge_index_stage_log').insert({
    chunk_id: params.chunkId,
    from_version: params.fromVersion,
    to_version: params.toVersion,
    batch_id: params.batchId,
    job_id: params.jobId,
    success: params.success,
    blocked_reason: params.blockedReason ?? null,
  });
}

async function createJob(): Promise<string> {
  const { data, error } = await supabase
    .from('knowledge_index_jobs')
    .insert({
      status: 'running',
      trigger_type: 'schedule',
      batch_size: BATCH_SIZE,
      max_batches: MAX_BATCHES,
      started_at: new Date().toISOString(),
    })
    .select('id')
    .single();
  if (error || !data) throw new Error(`Kreiranje job-a neuspešno: ${error?.message ?? 'unknown'}`);
  return data.id;
}

async function updateJob(jobId: string, params: {
  processed: number;
  indexed: number;
  failed: number;
  durationMs: number;
  errors: Array<{ chunkId: string; reason: string }>;
}): Promise<void> {
  const throughput = params.durationMs > 0
    ? Number(((params.indexed * 60_000) / params.durationMs).toFixed(2))
    : 0;
  await supabase.from('knowledge_index_jobs').update({
    status: params.failed === 0 ? 'completed' : params.indexed > 0 ? 'partial' : 'failed',
    processed_chunks: params.processed,
    indexed_chunks: params.indexed,
    failed_chunks: params.failed,
    average_latency_ms: params.processed > 0 ? Math.round(params.durationMs / params.processed) : 0,
    throughput_per_minute: throughput,
    finished_at: new Date().toISOString(),
    error_log: params.errors,
  }).eq('id', jobId);
}

async function promoteV1ToV2(batchId: string, jobId: string): Promise<{ promoted: number; blocked: number; failed: number }> {
  let promoted = 0, failed = 0;
  const blocked = 0;
  for (let batch = 0; batch < MAX_BATCHES; batch++) {
    const { data } = await supabase
      .from('knowledge_chunks')
      .select('id, document_id, chunk_index, content, embedding_status, indexing_attempts, last_index_attempt_at, index_version')
      .eq('embedding_status', 'indexed')
      .eq('index_version', 'v1')
      .order('created_at', { ascending: true })
      .limit(BATCH_SIZE);
    const candidates = (data ?? []) as ChunkRow[];
    if (candidates.length === 0) break;
    for (const chunk of candidates) {
      if ((chunk.content ?? '').length < PROMOTE_V2_MIN_CONTENT_LENGTH) {
        const reason = `Sadržaj prekratak za v2 bigrams (${(chunk.content ?? '').length} < ${PROMOTE_V2_MIN_CONTENT_LENGTH})`;
        await logStagePromotion({ chunkId: chunk.id, fromVersion: 'v1', toVersion: 'v2', batchId, jobId, success: false, blockedReason: reason });
        blocked++;
        continue;
      }
      try {
        const { error } = await supabase.from('knowledge_chunks').update({
          indexed_content: buildIndexedContentV2(chunk.content),
          indexing_attempts: (chunk.indexing_attempts ?? 0) + 1,
          indexing_error: null,
          last_index_attempt_at: new Date().toISOString(),
          indexed_at: new Date().toISOString(),
          index_version: 'v2',
          keyword_density: computeKeywordDensity(chunk.content),
          unique_term_count: computeUniqueTermCount(chunk.content),
        }).eq('id', chunk.id);
        if (error) throw new Error(error.message);
        await logStagePromotion({ chunkId: chunk.id, fromVersion: 'v1', toVersion: 'v2', batchId, jobId, success: true });
        promoted++;
      } catch (err) {
        const reason = err instanceof Error ? err.message : 'Nepoznata greška';
        await logStagePromotion({ chunkId: chunk.id, fromVersion: 'v1', toVersion: 'v2', batchId, jobId, success: false, blockedReason: reason });
        failed++;
      }
    }
  }
  return { promoted, blocked, failed };
}

async function promoteV2ToV3(batchId: string, jobId: string): Promise<{ promoted: number; blocked: number; failed: number }> {
  let promoted = 0, failed = 0;
  const blocked = 0;
  for (let batch = 0; batch < MAX_BATCHES; batch++) {
    const { data } = await supabase
      .from('knowledge_chunks')
      .select('id, document_id, chunk_index, content, embedding_status, indexing_attempts, last_index_attempt_at, index_version')
      .eq('embedding_status', 'indexed')
      .eq('index_version', 'v2')
      .order('created_at', { ascending: true })
      .limit(BATCH_SIZE);
    const candidates = (data ?? []) as ChunkRow[];
    if (candidates.length === 0) break;
    for (const chunk of candidates) {
      if (chunk.chunk_index == null || chunk.chunk_index < 0) {
        const reason = `chunk_index nije postavljen — position_score ne može biti izračunat`;
        await logStagePromotion({ chunkId: chunk.id, fromVersion: 'v2', toVersion: 'v3', batchId, jobId, success: false, blockedReason: reason });
        blocked++;
        continue;
      }
      try {
        const { error } = await supabase.from('knowledge_chunks').update({
          indexed_content: buildIndexedContentV2(chunk.content),
          indexing_attempts: (chunk.indexing_attempts ?? 0) + 1,
          indexing_error: null,
          last_index_attempt_at: new Date().toISOString(),
          indexed_at: new Date().toISOString(),
          index_version: 'v3',
          keyword_density: computeKeywordDensity(chunk.content),
          unique_term_count: computeUniqueTermCount(chunk.content),
          position_score: computePositionScore(chunk.chunk_index),
        }).eq('id', chunk.id);
        if (error) throw new Error(error.message);
        await logStagePromotion({ chunkId: chunk.id, fromVersion: 'v2', toVersion: 'v3', batchId, jobId, success: true });
        promoted++;
      } catch (err) {
        const reason = err instanceof Error ? err.message : 'Nepoznata greška';
        await logStagePromotion({ chunkId: chunk.id, fromVersion: 'v2', toVersion: 'v3', batchId, jobId, success: false, blockedReason: reason });
        failed++;
      }
    }
  }
  return { promoted, blocked, failed };
}

async function promoteV3ToV4(batchId: string, jobId: string): Promise<{ promoted: number; blocked: number; failed: number }> {
  // v4 requires OpenAI embeddings — skip if not configured
  const openaiApiKey = process.env.OPENAI_API_KEY;
  let promoted = 0, failed = 0;
  const blocked = 0;
  if (!openaiApiKey) {
    console.warn('⚠️  OPENAI_API_KEY nije postavljen — v3→v4 promocija preskočena.');
    return { promoted: 0, blocked: 0, failed: 0 };
  }

  for (let batch = 0; batch < MAX_BATCHES; batch++) {
    const { data } = await supabase
      .from('knowledge_chunks')
      .select('id, document_id, chunk_index, content, embedding_status, indexing_attempts, last_index_attempt_at, index_version')
      .eq('embedding_status', 'indexed')
      .eq('index_version', 'v3')
      .order('created_at', { ascending: true })
      .limit(BATCH_SIZE);
    const candidates = (data ?? []) as ChunkRow[];
    if (candidates.length === 0) break;
    for (const chunk of candidates) {
      try {
        // Inline embedding creation to avoid circular import
        const embeddingModel = process.env.SPAJA_BAZA_EMBEDDING_MODEL ?? 'text-embedding-3-small';
        const embeddingDim = Number(process.env.SPAJA_BAZA_EMBEDDING_DIM ?? 1536);
        const input = chunk.content.replace(/\s+/g, ' ').trim().slice(0, 4000);
        const resp = await fetch('https://api.openai.com/v1/embeddings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + openaiApiKey },
          body: JSON.stringify({ model: embeddingModel, input }),
        });
        if (!resp.ok) throw new Error(`OpenAI API error: ${resp.status} ${resp.statusText}`);
        const json = await resp.json() as { data: Array<{ embedding: number[] }> };
        const vector = json.data?.[0]?.embedding;
        if (!Array.isArray(vector) || vector.length !== embeddingDim) {
          throw new Error(`Neočekivana embedding dimenzija: ${vector?.length} (očekivano ${embeddingDim})`);
        }
        const vectorLiteral = `[${vector.map((v) => Number(v.toFixed(8))).join(',')}]`;
        const attemptAt = new Date().toISOString();
        const { error } = await supabase.from('knowledge_chunks').update({
          indexed_content: buildIndexedContentV2(chunk.content),
          embedding_status: 'indexed',
          indexing_attempts: (chunk.indexing_attempts ?? 0) + 1,
          indexing_error: null,
          last_index_attempt_at: attemptAt,
          indexed_at: attemptAt,
          index_version: 'v4',
          keyword_density: computeKeywordDensity(chunk.content),
          unique_term_count: computeUniqueTermCount(chunk.content),
          position_score: computePositionScore(chunk.chunk_index),
          embedding_model: embeddingModel,
          embedding_model_version: process.env.SPAJA_BAZA_EMBEDDING_MODEL_VERSION ?? 'v4',
          embedding_generated_at: attemptAt,
          embedding_vector: vectorLiteral,
          semantic_score: 1,
        }).eq('id', chunk.id);
        if (error) throw new Error(error.message);
        await logStagePromotion({ chunkId: chunk.id, fromVersion: 'v3', toVersion: 'v4', batchId, jobId, success: true });
        promoted++;
      } catch (err) {
        const reason = err instanceof Error ? err.message : 'Nepoznata greška';
        await logStagePromotion({ chunkId: chunk.id, fromVersion: 'v3', toVersion: 'v4', batchId, jobId, success: false, blockedReason: reason });
        failed++;
      }
    }
  }
  return { promoted, blocked, failed };
}

async function getStageBreakdown(): Promise<Record<string, number>> {
  const versions = ['v1', 'v2', 'v3', 'v4'];
  const results: Record<string, number> = {};
  await Promise.all(versions.map(async (v) => {
    const { count } = await supabase.from('knowledge_chunks').select('*', { count: 'exact', head: true }).eq('embedding_status', 'indexed').eq('index_version', v);
    results[v] = count ?? 0;
  }));
  return results;
}

async function logIndex750Audit(params: {
  jobId: string;
  batchId: string;
  processed: number;
  indexed: number;
  failed: number;
  completionBeforePct: number;
  completionAfterPct: number;
  safeStopTriggered: boolean;
}) {
  if (!INDEX_750_MODE) return;
  const completionDeltaPct = Number((params.completionAfterPct - params.completionBeforePct).toFixed(2));
  const degraded = completionDeltaPct < 0 && Math.abs(completionDeltaPct) >= INDEX_750_DEGRADE_PCT;
  const meetsTarget = params.completionAfterPct >= INDEX_750_TARGET_PCT && !degraded;
  await supabase.from('knowledge_index_750_audit').insert({
    job_id: params.jobId,
    batch_id: params.batchId,
    mode: 'indeksiranje-750',
    target_completion_pct: INDEX_750_TARGET_PCT,
    degradation_threshold_pct: INDEX_750_DEGRADE_PCT,
    completion_before_pct: params.completionBeforePct,
    completion_after_pct: params.completionAfterPct,
    completion_delta_pct: completionDeltaPct,
    processed_chunks: params.processed,
    indexed_chunks: params.indexed,
    failed_chunks: params.failed,
    degraded,
    meets_target: meetsTarget,
    safe_stop_triggered: params.safeStopTriggered,
    summary: {
      targetVersion: 'v4',
      schedule: 'nightly',
      script: 'scripts/index-auto-promote.ts',
    },
  });
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`  ${INDEX_750_MODE ? 'INDEKSIRANJE 750' : 'INDEKSIRANJE 5'} — Staged Auto-Promotion Pipeline`);
  console.log(`  batchSize: ${BATCH_SIZE} | maxBatches: ${MAX_BATCHES} | cooldown: ${COOLDOWN_MS}ms`);
  if (INDEX_750_MODE) {
    console.log(`  750 targetPct: ${INDEX_750_TARGET_PCT} | degradePct: ${INDEX_750_DEGRADE_PCT} | safeStop: ${INDEX_750_SAFE_STOP}`);
  }
  console.log('═══════════════════════════════════════════════════════════');

  const startAt = Date.now();
  const jobId = await createJob();
  const batchId = `auto-promote-${jobId}`;

  console.log(`📋 Job ID: ${jobId}`);
  console.log('');

  // Stage distribution before
  const before = await getStageBreakdown();
  const totalBefore = Object.values(before).reduce((a, b) => a + b, 0);
  const completionBeforePct = totalBefore > 0 ? Number((((before.v4 ?? 0) / totalBefore) * 100).toFixed(2)) : 0;
  console.log('Distribucija pre promocije:');
  console.log(`  v1: ${before.v1 ?? 0}  v2: ${before.v2 ?? 0}  v3: ${before.v3 ?? 0}  v4: ${before.v4 ?? 0}  total: ${totalBefore}`);
  if (INDEX_750_MODE) console.log(`  completionPct pre: ${completionBeforePct}%`);
  console.log('');

  let totalProcessed = 0;
  let totalIndexed = 0;
  let totalFailed = 0;
  const allErrors: Array<{ chunkId: string; reason: string }> = [];

  if (INDEX_750_SAFE_STOP) {
    console.log('⏸ INDEKSIRANJE 750 safe stop aktivan — faze promocije preskočene.');
  } else {
    // v1 → v2
    console.log('──── Faza 1: v1 → v2 ────────────────────────────────────');
    const r1 = await promoteV1ToV2(batchId, jobId);
    console.log(`  ✅ Promovisano: ${r1.promoted}  ⏸ Blokirano: ${r1.blocked}  ❌ Neuspešno: ${r1.failed}`);
    totalProcessed += r1.promoted + r1.blocked + r1.failed;
    totalIndexed += r1.promoted;
    totalFailed += r1.failed;

    if (COOLDOWN_MS > 0) {
      console.log(`  ⏱  Cooldown ${COOLDOWN_MS}ms...`);
      await delay(COOLDOWN_MS);
    }

    // v2 → v3
    console.log('──── Faza 2: v2 → v3 ────────────────────────────────────');
    const r2 = await promoteV2ToV3(batchId, jobId);
    console.log(`  ✅ Promovisano: ${r2.promoted}  ⏸ Blokirano: ${r2.blocked}  ❌ Neuspešno: ${r2.failed}`);
    totalProcessed += r2.promoted + r2.blocked + r2.failed;
    totalIndexed += r2.promoted;
    totalFailed += r2.failed;

    if (COOLDOWN_MS > 0) {
      console.log(`  ⏱  Cooldown ${COOLDOWN_MS}ms...`);
      await delay(COOLDOWN_MS);
    }

    // v3 → v4
    console.log('──── Faza 3: v3 → v4 ────────────────────────────────────');
    const r3 = await promoteV3ToV4(batchId, jobId);
    console.log(`  ✅ Promovisano: ${r3.promoted}  ⏸ Blokirano: ${r3.blocked}  ❌ Neuspešno: ${r3.failed}`);
    totalProcessed += r3.promoted + r3.blocked + r3.failed;
    totalIndexed += r3.promoted;
    totalFailed += r3.failed;
  }

  // Stage distribution after
  const after = await getStageBreakdown();
  const totalAfter = Object.values(after).reduce((a, b) => a + b, 0);
  const completionPct = totalAfter > 0 ? Number(((after.v4 ?? 0) / totalAfter * 100).toFixed(2)) : 0;

  console.log('');
  console.log('Distribucija posle promocije:');
  console.log(`  v1: ${after.v1 ?? 0}  v2: ${after.v2 ?? 0}  v3: ${after.v3 ?? 0}  v4: ${after.v4 ?? 0}  total: ${totalAfter}`);
  console.log(`  completionPct (v4): ${completionPct}%`);
  if (INDEX_750_MODE) {
    const delta = Number((completionPct - completionBeforePct).toFixed(2));
    const degraded = delta < 0 && Math.abs(delta) >= INDEX_750_DEGRADE_PCT;
    const meetsTarget = completionPct >= INDEX_750_TARGET_PCT && !degraded;
    console.log(`  750 completion delta: ${delta}%`);
    console.log(`  750 degraded: ${degraded ? 'yes' : 'no'} | meetsTarget: ${meetsTarget ? 'yes' : 'no'}`);
  }

  const durationMs = Date.now() - startAt;
  await updateJob(jobId, { processed: totalProcessed, indexed: totalIndexed, failed: totalFailed, durationMs, errors: allErrors });
  await logIndex750Audit({
    jobId,
    batchId,
    processed: totalProcessed,
    indexed: totalIndexed,
    failed: totalFailed,
    completionBeforePct,
    completionAfterPct: completionPct,
    safeStopTriggered: INDEX_750_SAFE_STOP,
  });

  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`  Ukupno obrađeno: ${totalProcessed}  Promovisano: ${totalIndexed}  Neuspešno: ${totalFailed}`);
  console.log(`  Trajanje: ${durationMs}ms`);
  console.log('═══════════════════════════════════════════════════════════');

  if (totalFailed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('❌ Auto-promotion neuspešan:', err instanceof Error ? err.message : err);
  process.exit(1);
});
