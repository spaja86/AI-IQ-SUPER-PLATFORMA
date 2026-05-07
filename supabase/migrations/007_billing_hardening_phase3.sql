-- SpajaUltraOmegaCore -∞Ω+∞ — Billing Hardening Phase 3
-- Kompanija SPAJA — Digitalna Industrija
--
-- Implementira:
--   #55 reconcile invoice columns
--   #56 reconcile subscription columns
--   #93 PII scan support
--   #98 churn_events tabela sa reason klasifikacijom
--   #99 churn_risk_scores tabela za predikciju

-- Reconcile audit columns (podrška za #55, #56)
ALTER TABLE financial_audit_log
  ADD COLUMN IF NOT EXISTS old_plan TEXT,
  ADD COLUMN IF NOT EXISTS new_plan TEXT;

-- user_notifications tabela za in-app notifikacije (#60)
CREATE TABLE IF NOT EXISTS user_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  channel TEXT NOT NULL DEFAULT 'in-app',
  metadata JSONB NOT NULL DEFAULT '{}',
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_notifications_user_id_read
  ON user_notifications (user_id, read, created_at DESC);

-- Churn events tabela (#98)
CREATE TABLE IF NOT EXISTS churn_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reason TEXT NOT NULL,  -- payment_failed, explicit_cancellation, trial_expired, dispute_lost, etc.
  plan_at_churn TEXT,
  mrr_lost_eur NUMERIC(10,2) DEFAULT 0,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_churn_events_reason ON churn_events (reason, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_churn_events_created_at ON churn_events (created_at DESC);

-- Churn risk scores tabela (#99)
CREATE TABLE IF NOT EXISTS churn_risk_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  risk_score INTEGER NOT NULL DEFAULT 0,  -- 0-100
  risk_level TEXT NOT NULL DEFAULT 'low', -- low, medium, high, critical
  risk_factors JSONB NOT NULL DEFAULT '[]',
  computed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_risk_score CHECK (risk_score BETWEEN 0 AND 100)
);

CREATE INDEX IF NOT EXISTS idx_churn_risk_scores_risk_level
  ON churn_risk_scores (risk_level, risk_score DESC);

-- billing_incidents tabela za auto-incident logs (#67)
CREATE TABLE IF NOT EXISTS billing_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  severity TEXT NOT NULL DEFAULT 'warning', -- warning, critical
  title TEXT NOT NULL,
  description TEXT,
  source TEXT NOT NULL DEFAULT 'billing-health-monitor',
  resolved BOOLEAN NOT NULL DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_billing_incidents_severity
  ON billing_incidents (severity, resolved, created_at DESC);
