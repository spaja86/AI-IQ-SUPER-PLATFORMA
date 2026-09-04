-- 022_indeksiranje_750.sql
-- AI IQ SUPER PLATFORMA — INDEKSIRANJE 750
-- KPI-aware staged auto-promotion audit layer (backward compatible)

CREATE TABLE IF NOT EXISTS knowledge_index_750_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES knowledge_index_jobs(id) ON DELETE SET NULL,
  batch_id TEXT NOT NULL,
  mode TEXT NOT NULL DEFAULT 'indeksiranje-750',
  target_completion_pct NUMERIC(5,2) NOT NULL DEFAULT 75.00,
  degradation_threshold_pct NUMERIC(5,2) NOT NULL DEFAULT 7.50,
  completion_before_pct NUMERIC(5,2) NOT NULL DEFAULT 0,
  completion_after_pct NUMERIC(5,2) NOT NULL DEFAULT 0,
  completion_delta_pct NUMERIC(6,2) NOT NULL DEFAULT 0,
  processed_chunks INTEGER NOT NULL DEFAULT 0,
  indexed_chunks INTEGER NOT NULL DEFAULT 0,
  failed_chunks INTEGER NOT NULL DEFAULT 0,
  degraded BOOLEAN NOT NULL DEFAULT FALSE,
  meets_target BOOLEAN NOT NULL DEFAULT FALSE,
  safe_stop_triggered BOOLEAN NOT NULL DEFAULT FALSE,
  summary JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_knowledge_index_750_audit_created_at
  ON knowledge_index_750_audit (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_knowledge_index_750_audit_alert_flags
  ON knowledge_index_750_audit (degraded, meets_target, created_at DESC);

ALTER TABLE knowledge_index_750_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "knowledge_index_750_audit_service_write"
  ON knowledge_index_750_audit FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY IF NOT EXISTS "knowledge_index_750_audit_authenticated_read"
  ON knowledge_index_750_audit FOR SELECT
  USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE OR REPLACE VIEW knowledge_index_750_alerts AS
SELECT
  id,
  job_id,
  batch_id,
  mode,
  completion_after_pct,
  completion_delta_pct,
  target_completion_pct,
  degradation_threshold_pct,
  degraded,
  meets_target,
  safe_stop_triggered,
  created_at
FROM knowledge_index_750_audit
WHERE degraded = TRUE
   OR meets_target = FALSE;
