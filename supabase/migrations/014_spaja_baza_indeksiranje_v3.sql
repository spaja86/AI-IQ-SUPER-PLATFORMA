-- Migration 014: INDEKSIRANJE 3 — PostgreSQL FTS + Position Signal
-- Dodaje kolonu position_score na knowledge_chunks radi podrške za v3 indeksni pipeline
-- (PostgreSQL full-text search + pozicioni signal unutar dokumenta).
-- Kompatibilno s v1/v2: DEFAULT 0 znači da svi postojeći redovi mirno nastavljaju kao v1/v2.
-- Novi parcijalni indeksi ubrzavaju retrieval unutar v3 skupa bez utjecaja na v1/v2 upite.

ALTER TABLE public.knowledge_chunks
  ADD COLUMN IF NOT EXISTS position_score NUMERIC(8,4) NOT NULL DEFAULT 0;

-- Parcijalni indeks za efikasno iteriranje v3 indeksiranih chunk-ova.
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_v3_status
  ON public.knowledge_chunks (embedding_status, index_version, created_at DESC)
  WHERE embedding_status = 'indexed' AND index_version = 'v3';

-- Parcijalni indeks za rangiranje po position_score unutar indeksiranog skupa.
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_position_score
  ON public.knowledge_chunks (position_score DESC)
  WHERE embedding_status = 'indexed';
