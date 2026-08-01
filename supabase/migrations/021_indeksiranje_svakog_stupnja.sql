-- Migration: 021_indeksiranje_svakog_stupnja.sql
-- AI IQ SUPER PLATFORMA — INDEKSIRANJE 5: Orkestracija svakog stupnja
-- Kompanija SPAJA — Digitalna Industrija
--
-- Kreira infrastrukturu za staged auto-promotion pipeline:
--   - knowledge_index_stage_log: audit log za svaku promociju chunk-a između stupnjeva
--   - knowledge_index_stage_summary: view sa agregatima po verziji
--   - Parcijalni indeks za brzi upit chunk-ova koji nisu na ciljnoj verziji

-- ─── Stage Log: audit trail za svaku promociju ───────────────────────────────

CREATE TABLE IF NOT EXISTS knowledge_index_stage_log (
  id                   UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  chunk_id             UUID         NOT NULL
                         REFERENCES knowledge_chunks(id) ON DELETE CASCADE,
  from_version         TEXT         NOT NULL CHECK (from_version IN ('v1', 'v2', 'v3', 'v4')),
  to_version           TEXT         NOT NULL CHECK (to_version IN ('v2', 'v3', 'v4')),
  promoted_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  batch_id             TEXT,
  blocked_reason       TEXT,
  success              BOOLEAN      NOT NULL DEFAULT TRUE,
  job_id               TEXT
);

-- Indeks za brzo filtriranje po chunk-u (istorija promocija za jedan chunk)
CREATE INDEX IF NOT EXISTS idx_knowledge_index_stage_log_chunk_id
  ON knowledge_index_stage_log (chunk_id, promoted_at DESC);

-- Indeks za brzo filtriranje po batch-u (audit po pokretanju)
CREATE INDEX IF NOT EXISTS idx_knowledge_index_stage_log_batch_id
  ON knowledge_index_stage_log (batch_id, promoted_at DESC);

-- Indeks za brzo filtriranje po verzijama (analitika po stupnju)
CREATE INDEX IF NOT EXISTS idx_knowledge_index_stage_log_versions
  ON knowledge_index_stage_log (from_version, to_version, promoted_at DESC);

-- RLS: samo service_role može pisati; autentifikovani korisnici mogu čitati
ALTER TABLE knowledge_index_stage_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "knowledge_index_stage_log_service_write"
  ON knowledge_index_stage_log FOR ALL
  TO service_role USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY IF NOT EXISTS "knowledge_index_stage_log_authenticated_read"
  ON knowledge_index_stage_log FOR SELECT
  TO authenticated USING (TRUE);

-- ─── Stage Summary View ───────────────────────────────────────────────────────

CREATE OR REPLACE VIEW knowledge_index_stage_summary AS
SELECT
  index_version,
  COUNT(*)                                              AS chunk_count,
  ROUND(COUNT(*) * 100.0 /
    NULLIF(SUM(COUNT(*)) OVER (), 0), 2)               AS pct_of_total,
  COUNT(*) FILTER (WHERE embedding_status = 'indexed') AS indexed_count,
  COUNT(*) FILTER (WHERE embedding_status = 'failed')  AS failed_count,
  COUNT(*) FILTER (
    WHERE embedding_status = 'not_indexed')             AS not_indexed_count,
  MAX(indexed_at)                                       AS last_indexed_at
FROM knowledge_chunks
GROUP BY index_version;

-- ─── Partial Indexes: brzi upit za chunk-ove koji nisu na ciljnoj verziji ────

-- Chunk-ovi koji još nisu dostigli v4 (ciljni stupanj)
CREATE INDEX IF NOT EXISTS idx_kc_not_v4
  ON knowledge_chunks (id, index_version, embedding_status)
  WHERE index_version IS DISTINCT FROM 'v4'
    AND embedding_status = 'indexed';

-- Chunk-ovi koji nisu ni na v3 ni na v4 (prioritet za auto-promotion)
CREATE INDEX IF NOT EXISTS idx_kc_below_v3
  ON knowledge_chunks (id, index_version, chunk_index)
  WHERE index_version NOT IN ('v3', 'v4')
    AND embedding_status = 'indexed';
