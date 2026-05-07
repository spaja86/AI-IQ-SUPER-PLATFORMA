-- SpajaUltraOmegaCore -∞Ω+∞ — Migracija: SPAJA BAZA Knowledge Ingestion + Retrieval
-- Kompanija SPAJA — Digitalna Industrija
--
-- Svrha:
--   1) Kontrolisan ingestion znanja (whitelist/TOS-compliant)
--   2) Dokumenti + chunkovi + citati za retrieval sloj u SpajaPro chat-u
--   3) Operativni jobovi i metrike (crawl/index/health)

-- ═══════════════════════════════════════════════════
-- 1. Izvori znanja
-- ═══════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.knowledge_sources (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                  TEXT NOT NULL,
  source_url            TEXT NOT NULL UNIQUE,
  domain                TEXT NOT NULL,
  category              TEXT NOT NULL DEFAULT 'web',
  status                TEXT NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active', 'paused', 'disabled', 'error')),
  ingest_mode           TEXT NOT NULL DEFAULT 'whitelist'
                        CHECK (ingest_mode IN ('whitelist', 'manual', 'api-discovery')),
  robots_policy_status  TEXT NOT NULL DEFAULT 'unknown'
                        CHECK (robots_policy_status IN ('unknown', 'allowed', 'blocked')),
  tos_policy_status     TEXT NOT NULL DEFAULT 'unknown'
                        CHECK (tos_policy_status IN ('unknown', 'allowed', 'blocked')),
  trust_score           NUMERIC(5,2) NOT NULL DEFAULT 0.70 CHECK (trust_score >= 0 AND trust_score <= 1),
  language              TEXT NOT NULL DEFAULT 'sr',
  priority              INTEGER NOT NULL DEFAULT 50 CHECK (priority BETWEEN 1 AND 100),
  ttl_minutes           INTEGER NOT NULL DEFAULT 1440 CHECK (ttl_minutes BETWEEN 5 AND 43200),
  retry_limit           INTEGER NOT NULL DEFAULT 3 CHECK (retry_limit BETWEEN 0 AND 10),
  rate_limit_per_minute INTEGER NOT NULL DEFAULT 30 CHECK (rate_limit_per_minute BETWEEN 1 AND 600),
  metadata              JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by            UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.knowledge_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on knowledge_sources"
  ON public.knowledge_sources FOR ALL
  USING (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_knowledge_sources_domain ON public.knowledge_sources(domain);
CREATE INDEX IF NOT EXISTS idx_knowledge_sources_status ON public.knowledge_sources(status);
CREATE INDEX IF NOT EXISTS idx_knowledge_sources_updated_at ON public.knowledge_sources(updated_at DESC);

CREATE OR REPLACE TRIGGER knowledge_sources_updated_at
  BEFORE UPDATE ON public.knowledge_sources
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- ═══════════════════════════════════════════════════
-- 2. Dokumenti znanja
-- ═══════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.knowledge_documents (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id             UUID NOT NULL REFERENCES public.knowledge_sources(id) ON DELETE CASCADE,
  source_url            TEXT NOT NULL,
  canonical_url         TEXT NOT NULL,
  title                 TEXT NOT NULL DEFAULT '',
  language              TEXT NOT NULL DEFAULT 'sr',
  content_type          TEXT NOT NULL DEFAULT 'text/html',
  content_hash          TEXT NOT NULL UNIQUE,
  content_length        INTEGER NOT NULL DEFAULT 0,
  raw_content           TEXT NOT NULL DEFAULT '',
  cleaned_content       TEXT NOT NULL DEFAULT '',
  status                TEXT NOT NULL DEFAULT 'processed'
                        CHECK (status IN ('queued', 'running', 'processed', 'failed', 'archived')),
  fetch_status_code     INTEGER,
  fetched_at            TIMESTAMPTZ,
  indexed_at            TIMESTAMPTZ,
  last_error            TEXT,
  trust_score           NUMERIC(5,2) NOT NULL DEFAULT 0.70 CHECK (trust_score >= 0 AND trust_score <= 1),
  prompt_injection_risk TEXT NOT NULL DEFAULT 'low'
                        CHECK (prompt_injection_risk IN ('low', 'medium', 'high')),
  metadata              JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.knowledge_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on knowledge_documents"
  ON public.knowledge_documents FOR ALL
  USING (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_knowledge_documents_source_id ON public.knowledge_documents(source_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_documents_status ON public.knowledge_documents(status);
CREATE INDEX IF NOT EXISTS idx_knowledge_documents_canonical_url ON public.knowledge_documents(canonical_url);
CREATE INDEX IF NOT EXISTS idx_knowledge_documents_fetched_at ON public.knowledge_documents(fetched_at DESC);
CREATE INDEX IF NOT EXISTS idx_knowledge_documents_indexed_at ON public.knowledge_documents(indexed_at DESC);

CREATE OR REPLACE TRIGGER knowledge_documents_updated_at
  BEFORE UPDATE ON public.knowledge_documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- ═══════════════════════════════════════════════════
-- 3. Chunkovi za retrieval
-- ═══════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.knowledge_chunks (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id           UUID NOT NULL REFERENCES public.knowledge_documents(id) ON DELETE CASCADE,
  chunk_index           INTEGER NOT NULL,
  content               TEXT NOT NULL,
  token_count           INTEGER NOT NULL DEFAULT 0,
  embedding_model       TEXT,
  embedding_status      TEXT NOT NULL DEFAULT 'not_indexed'
                        CHECK (embedding_status IN ('not_indexed', 'indexed', 'failed')),
  safety_label          TEXT NOT NULL DEFAULT 'safe'
                        CHECK (safety_label IN ('safe', 'needs_review', 'blocked')),
  metadata              JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (document_id, chunk_index)
);

ALTER TABLE public.knowledge_chunks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on knowledge_chunks"
  ON public.knowledge_chunks FOR ALL
  USING (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_document_id ON public.knowledge_chunks(document_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_embedding_status ON public.knowledge_chunks(embedding_status);

-- ═══════════════════════════════════════════════════
-- 4. Crawl/Index jobovi + dead letter
-- ═══════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.knowledge_crawl_jobs (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id             UUID REFERENCES public.knowledge_sources(id) ON DELETE SET NULL,
  trigger_type          TEXT NOT NULL DEFAULT 'manual'
                        CHECK (trigger_type IN ('manual', 'schedule', 'api-discovery')),
  status                TEXT NOT NULL DEFAULT 'queued'
                        CHECK (status IN ('queued', 'running', 'completed', 'failed', 'partial')),
  candidate_urls        JSONB NOT NULL DEFAULT '[]'::jsonb,
  processed_urls        INTEGER NOT NULL DEFAULT 0,
  succeeded_urls        INTEGER NOT NULL DEFAULT 0,
  failed_urls           INTEGER NOT NULL DEFAULT 0,
  retry_count           INTEGER NOT NULL DEFAULT 0,
  max_retries           INTEGER NOT NULL DEFAULT 3,
  started_at            TIMESTAMPTZ,
  finished_at           TIMESTAMPTZ,
  latency_ms            INTEGER,
  error_log             JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_by            UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.knowledge_crawl_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on knowledge_crawl_jobs"
  ON public.knowledge_crawl_jobs FOR ALL
  USING (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_knowledge_crawl_jobs_status ON public.knowledge_crawl_jobs(status);
CREATE INDEX IF NOT EXISTS idx_knowledge_crawl_jobs_created_at ON public.knowledge_crawl_jobs(created_at DESC);

CREATE TABLE IF NOT EXISTS public.knowledge_dead_letters (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id                UUID REFERENCES public.knowledge_crawl_jobs(id) ON DELETE CASCADE,
  source_id             UUID REFERENCES public.knowledge_sources(id) ON DELETE SET NULL,
  source_url            TEXT NOT NULL,
  canonical_url         TEXT,
  error_code            TEXT NOT NULL DEFAULT 'ingest_error',
  error_message         TEXT NOT NULL DEFAULT '',
  retry_count           INTEGER NOT NULL DEFAULT 0,
  last_attempt_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  payload               JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.knowledge_dead_letters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on knowledge_dead_letters"
  ON public.knowledge_dead_letters FOR ALL
  USING (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_knowledge_dead_letters_created_at ON public.knowledge_dead_letters(created_at DESC);

-- ═══════════════════════════════════════════════════
-- 5. Citati/provenijencija + retrieval metrike
-- ═══════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.knowledge_citations (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  thread_id             UUID REFERENCES public.chat_threads(id) ON DELETE SET NULL,
  query                 TEXT NOT NULL DEFAULT '',
  document_id           UUID REFERENCES public.knowledge_documents(id) ON DELETE SET NULL,
  chunk_id              UUID REFERENCES public.knowledge_chunks(id) ON DELETE SET NULL,
  source_url            TEXT NOT NULL DEFAULT '',
  title                 TEXT NOT NULL DEFAULT '',
  score                 NUMERIC(8,4) NOT NULL DEFAULT 0,
  used_in_response      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.knowledge_citations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on knowledge_citations"
  ON public.knowledge_citations FOR ALL
  USING (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_knowledge_citations_user_id ON public.knowledge_citations(user_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_citations_thread_id ON public.knowledge_citations(thread_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_citations_created_at ON public.knowledge_citations(created_at DESC);

CREATE TABLE IF NOT EXISTS public.knowledge_retrieval_metrics (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query                 TEXT NOT NULL DEFAULT '',
  user_id               UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  thread_id             UUID REFERENCES public.chat_threads(id) ON DELETE SET NULL,
  latency_ms            INTEGER NOT NULL DEFAULT 0,
  results_count         INTEGER NOT NULL DEFAULT 0,
  citations_count       INTEGER NOT NULL DEFAULT 0,
  citation_rate         NUMERIC(5,2) NOT NULL DEFAULT 0,
  quality_score         NUMERIC(5,2) NOT NULL DEFAULT 0,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.knowledge_retrieval_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on knowledge_retrieval_metrics"
  ON public.knowledge_retrieval_metrics FOR ALL
  USING (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_knowledge_retrieval_metrics_created_at ON public.knowledge_retrieval_metrics(created_at DESC);

