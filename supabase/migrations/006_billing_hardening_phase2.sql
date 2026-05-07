-- SpajaUltraOmegaCore -∞Ω+∞ — Billing Hardening Phase 2
-- Kompanija SPAJA — Digitalna Industrija
--
-- Implementira:
--   #51 webhook handler versioning (v1/v2 metadata)
--   #52 quarantine mode kolone
--   #53 payload hash u audit lancu
--   #54 chain hash (tamper-evident audit trail)
--   #62 approval flow za replay
--   #65/#66 replay attempts + poison flag
--   #68/#69/#70 DLQ aging + latency metrike kolone

ALTER TABLE stripe_webhook_events
  ADD COLUMN IF NOT EXISTS handler_version TEXT NOT NULL DEFAULT 'v2',
  ADD COLUMN IF NOT EXISTS webhook_latency_ms INTEGER,
  ADD COLUMN IF NOT EXISTS consistency_latency_ms INTEGER,
  ADD COLUMN IF NOT EXISTS quarantined BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_stripe_webhook_events_handler_version
  ON stripe_webhook_events (handler_version, processed_at DESC);

ALTER TABLE financial_audit_log
  ADD COLUMN IF NOT EXISTS request_id TEXT,
  ADD COLUMN IF NOT EXISTS payload_hash TEXT,
  ADD COLUMN IF NOT EXISTS prev_hash TEXT,
  ADD COLUMN IF NOT EXISTS chain_hash TEXT;

CREATE INDEX IF NOT EXISTS idx_financial_audit_log_chain_hash
  ON financial_audit_log (chain_hash);

ALTER TABLE webhook_dead_letter
  ADD COLUMN IF NOT EXISTS replay_attempts INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS quarantine BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS quarantine_reason TEXT,
  ADD COLUMN IF NOT EXISTS poison BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS poison_reason TEXT,
  ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_replayed_by UUID REFERENCES profiles(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_webhook_dead_letter_quarantine
  ON webhook_dead_letter (quarantine, replayed, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_webhook_dead_letter_poison
  ON webhook_dead_letter (poison, replayed, created_at DESC);
