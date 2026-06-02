-- Migration 015: INDEKSIRANJE 4 — semantic vector indexing (pgvector + embeddings)
-- Kompatibilno sa v1/v2/v3: additivne kolone + rollback-safe (bez brisanja prethodnih podataka).

CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE public.knowledge_chunks
  ADD COLUMN IF NOT EXISTS embedding_model_version TEXT,
  ADD COLUMN IF NOT EXISTS embedding_generated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS embedding_vector vector(1536),
  ADD COLUMN IF NOT EXISTS semantic_score NUMERIC(8,4) NOT NULL DEFAULT 0;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'knowledge_chunks_semantic_score_check'
  ) THEN
    ALTER TABLE public.knowledge_chunks
      ADD CONSTRAINT knowledge_chunks_semantic_score_check
      CHECK (semantic_score BETWEEN 0 AND 1);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_v4_status
  ON public.knowledge_chunks (embedding_status, index_version, created_at DESC)
  WHERE embedding_status = 'indexed' AND index_version = 'v4';

CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_embedding_generated_at
  ON public.knowledge_chunks (embedding_generated_at DESC)
  WHERE embedding_generated_at IS NOT NULL;

-- ANN indeks (cosine distance) za semantic retrieval; parcijalni indeks da ne utiče na stare verzije.
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_v4_embedding_ivfflat
  ON public.knowledge_chunks
  USING ivfflat (embedding_vector vector_cosine_ops)
  WITH (lists = 100)
  WHERE embedding_status = 'indexed'
    AND index_version = 'v4'
    AND embedding_vector IS NOT NULL;

-- Retrieval metrics proširenje: vidljivost po retrieval verziji + semantic usage.
ALTER TABLE public.knowledge_retrieval_metrics
  ADD COLUMN IF NOT EXISTS retrieval_index_version TEXT NOT NULL DEFAULT 'v1',
  ADD COLUMN IF NOT EXISTS semantic_retrieval_used BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_knowledge_retrieval_metrics_index_version
  ON public.knowledge_retrieval_metrics(retrieval_index_version, created_at DESC);

-- RPC helper za v4 semantic retrieval (service_role only).
CREATE OR REPLACE FUNCTION public.match_knowledge_chunks_v4(
  query_embedding_text TEXT,
  match_count INTEGER DEFAULT 80,
  min_similarity DOUBLE PRECISION DEFAULT 0.2
)
RETURNS TABLE (
  id UUID,
  chunk_index INTEGER,
  content TEXT,
  indexed_content TEXT,
  embedding_status TEXT,
  index_version TEXT,
  keyword_density NUMERIC,
  position_score NUMERIC,
  semantic_similarity DOUBLE PRECISION,
  semantic_score NUMERIC,
  document_id UUID,
  title TEXT,
  canonical_url TEXT,
  trust_score NUMERIC,
  source_name TEXT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  WITH scored_chunks AS (
    SELECT
      kc.id,
      kc.chunk_index,
      kc.content,
      kc.indexed_content,
      kc.embedding_status,
      kc.index_version,
      kc.keyword_density,
      kc.position_score,
      kc.semantic_score,
      kc.document_id,
      (kc.embedding_vector <=> (query_embedding_text::vector)) AS cosine_distance
    FROM public.knowledge_chunks kc
    WHERE kc.embedding_status = 'indexed'
      AND kc.index_version = 'v4'
      AND kc.embedding_vector IS NOT NULL
  )
  SELECT
    sc.id,
    sc.chunk_index,
    sc.content,
    sc.indexed_content,
    sc.embedding_status,
    sc.index_version,
    sc.keyword_density,
    sc.position_score,
    GREATEST(0::double precision, 1 - sc.cosine_distance) AS semantic_similarity,
    sc.semantic_score,
    kd.id AS document_id,
    kd.title,
    kd.canonical_url,
    kd.trust_score,
    ks.name AS source_name
  FROM scored_chunks sc
  JOIN public.knowledge_documents kd ON kd.id = sc.document_id
  LEFT JOIN public.knowledge_sources ks ON ks.id = kd.source_id
  WHERE (1 - sc.cosine_distance) >= min_similarity
  ORDER BY sc.cosine_distance
  LIMIT GREATEST(1, LEAST(match_count, 200));
$$;

REVOKE ALL ON FUNCTION public.match_knowledge_chunks_v4(TEXT, INTEGER, DOUBLE PRECISION) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.match_knowledge_chunks_v4(TEXT, INTEGER, DOUBLE PRECISION) TO service_role;
