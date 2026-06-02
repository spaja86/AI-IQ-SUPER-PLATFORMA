-- Migration 013: INDEKSIRANJE 2 — v2 indexing signals
-- Dodaje kolone keyword_density i unique_term_count na knowledge_chunks radi podrške
-- za poboljšani v2 indeksni pipeline (enhanced lexical + keyword density scoring).
-- Kompatibilno s v1: DEFAULT 0 znači da svi postojeći redovi mirno nastavljaju kao v1.
-- Novi parcijalni indeksi ubrzavaju retrieval unutar v2 skupa bez utjecaja na v1 upite.

ALTER TABLE public.knowledge_chunks
  ADD COLUMN IF NOT EXISTS keyword_density   NUMERIC(8,4) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS unique_term_count INTEGER      NOT NULL DEFAULT 0;

-- Parcijalni indeks za efikasno iteriranje v2 indeksiranih chunk-ova.
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_v2_status
  ON public.knowledge_chunks (embedding_status, index_version, created_at DESC)
  WHERE embedding_status = 'indexed' AND index_version = 'v2';

-- Parcijalni indeks za rangiranje po keyword density unutar indeksiranog skupa.
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_keyword_density
  ON public.knowledge_chunks (keyword_density DESC)
  WHERE embedding_status = 'indexed';
