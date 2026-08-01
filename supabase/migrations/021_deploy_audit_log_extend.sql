-- Migration: 021_deploy_audit_log_extend.sql
-- AI IQ SUPER PLATFORMA — Deploy Audit Log Extension
-- Kompanija SPAJA — Digitalna Industrija
--
-- Dodaje kolone commit_sha i razlog u deploy_audit_log tabelu.
-- Ove kolone su referencirane u deploy workflow-ima i predeploy provjeri.

ALTER TABLE deploy_audit_log
  ADD COLUMN IF NOT EXISTS commit_sha TEXT,
  ADD COLUMN IF NOT EXISTS razlog     TEXT;

-- Indeks za brzo pretraživanje po commit SHA
CREATE INDEX IF NOT EXISTS idx_deploy_audit_log_commit_sha
  ON deploy_audit_log (commit_sha)
  WHERE commit_sha IS NOT NULL;
