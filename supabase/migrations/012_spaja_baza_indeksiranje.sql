-- SPAJA BAZA — indeksiranje chunk-ova i operativni job tracking

ALTER TABLE public.knowledge_chunks
  ADD COLUMN IF NOT EXISTS indexing_attempts INTEGER NOT NULL DEFAULT 0
    CHECK (indexing_attempts BETWEEN 0 AND 20),
  ADD COLUMN IF NOT EXISTS indexing_error TEXT,
  ADD COLUMN IF NOT EXISTS last_index_attempt_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS indexed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS index_version TEXT NOT NULL DEFAULT 'v1',
  ADD COLUMN IF NOT EXISTS indexed_content TEXT NOT NULL DEFAULT '';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'knowledge_chunks_indexed_content_length_check'
  ) THEN
    ALTER TABLE public.knowledge_chunks
      ADD CONSTRAINT knowledge_chunks_indexed_content_length_check
      CHECK (char_length(indexed_content) <= 6000);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_status_retry
  ON public.knowledge_chunks (embedding_status, indexing_attempts, created_at DESC)
  WHERE embedding_status IN ('not_indexed', 'failed');

CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_indexed_at
  ON public.knowledge_chunks (indexed_at DESC);

CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_indexed_content_fts
  ON public.knowledge_chunks
  USING GIN (to_tsvector('simple', indexed_content));

CREATE TABLE IF NOT EXISTS public.knowledge_index_jobs (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status                TEXT NOT NULL DEFAULT 'queued'
                        CHECK (status IN ('queued', 'running', 'completed', 'failed', 'partial')),
  trigger_type          TEXT NOT NULL DEFAULT 'manual'
                        CHECK (trigger_type IN ('manual', 'schedule', 'reindex')),
  source_id             UUID REFERENCES public.knowledge_sources(id) ON DELETE SET NULL,
  document_id           UUID REFERENCES public.knowledge_documents(id) ON DELETE SET NULL,
  requested_by          UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  batch_size            INTEGER NOT NULL DEFAULT 25 CHECK (batch_size BETWEEN 1 AND 500),
  max_batches           INTEGER NOT NULL DEFAULT 1 CHECK (max_batches BETWEEN 1 AND 1000),
  processed_chunks      INTEGER NOT NULL DEFAULT 0,
  indexed_chunks        INTEGER NOT NULL DEFAULT 0,
  failed_chunks         INTEGER NOT NULL DEFAULT 0,
  throughput_per_minute NUMERIC(10,2) NOT NULL DEFAULT 0,
  average_latency_ms    INTEGER NOT NULL DEFAULT 0,
  started_at            TIMESTAMPTZ,
  finished_at           TIMESTAMPTZ,
  error_log             JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.knowledge_index_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on knowledge_index_jobs"
  ON public.knowledge_index_jobs FOR ALL
  USING (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_knowledge_index_jobs_status
  ON public.knowledge_index_jobs(status);

CREATE INDEX IF NOT EXISTS idx_knowledge_index_jobs_created_at
  ON public.knowledge_index_jobs(created_at DESC);
