-- Migration: 020_deploy_audit_log.sql
-- AI IQ SUPER PLATFORMA — Deploy Platforma Audit Log
-- Kompanija SPAJA — Digitalna Industrija
--
-- Kreira tabele za audit log deploy-platforma hub-a:
--   - deploy_audit_log: svaki trigger događaj
--   - deploy_platform_registry: DB-driven konfiguracija (opciono)

-- ─── Deploy Audit Log ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS deploy_audit_log (
  id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  platform_id     TEXT         NOT NULL,
  environment     TEXT         NOT NULL CHECK (environment IN ('dev', 'staging', 'production')),
  triggered_by    TEXT         NOT NULL,
  status          TEXT         NOT NULL CHECK (status IN ('success', 'failure', 'pending')),
  deployment_id   TEXT,
  message         TEXT,
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Indeks za brzo filtriranje po platform_id i vremenu
CREATE INDEX IF NOT EXISTS idx_deploy_audit_log_platform_id
  ON deploy_audit_log (platform_id, created_at DESC);

-- Indeks za filtriranje po okruženju
CREATE INDEX IF NOT EXISTS idx_deploy_audit_log_environment
  ON deploy_audit_log (environment, created_at DESC);

-- RLS: samo service role može pisati; read otvoreno za autentifikovane
ALTER TABLE deploy_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "deploy_audit_log_service_insert"
  ON deploy_audit_log FOR INSERT
  TO service_role WITH CHECK (TRUE);

CREATE POLICY IF NOT EXISTS "deploy_audit_log_authenticated_read"
  ON deploy_audit_log FOR SELECT
  TO authenticated USING (TRUE);

-- ─── Deploy Platform Registry (opciono, DB-driven config) ─────────────────────

CREATE TABLE IF NOT EXISTS deploy_platform_registry (
  id                    TEXT         PRIMARY KEY,
  naziv                 TEXT         NOT NULL,
  opis                  TEXT,
  ikona                 TEXT         NOT NULL DEFAULT '🚀',
  vercel_project_id     TEXT         NOT NULL,
  deploy_hook_env_var   TEXT,
  produktion_url        TEXT         NOT NULL,
  health_url            TEXT,
  framework             TEXT         NOT NULL DEFAULT 'Next.js',
  status                TEXT         NOT NULL DEFAULT 'aktivan'
                          CHECK (status IN ('aktivan', 'u_pripremi', 'neaktivan', 'greska')),
  manual_trigger_enabled BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at            TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

ALTER TABLE deploy_platform_registry ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "deploy_platform_registry_service_write"
  ON deploy_platform_registry FOR ALL
  TO service_role USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY IF NOT EXISTS "deploy_platform_registry_authenticated_read"
  ON deploy_platform_registry FOR SELECT
  TO authenticated USING (TRUE);

-- Trigger za automatsko ažuriranje updated_at
CREATE OR REPLACE FUNCTION update_deploy_platform_registry_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER deploy_platform_registry_updated_at
  BEFORE UPDATE ON deploy_platform_registry
  FOR EACH ROW EXECUTE FUNCTION update_deploy_platform_registry_updated_at();
