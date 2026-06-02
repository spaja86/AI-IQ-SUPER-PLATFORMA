-- Migration 016: PERTENIZACIJA 2 — Personalization v2 profile columns
-- Additive migration; no existing columns removed; rollback-safe.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS personalization_version         TEXT    NOT NULL DEFAULT 'v1',
  ADD COLUMN IF NOT EXISTS stable_preferences              JSONB,
  ADD COLUMN IF NOT EXISTS contextual_preferences          JSONB,
  ADD COLUMN IF NOT EXISTS personalization_confidence      NUMERIC(4,3) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS personalization_updated_at      TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS personalization_enabled         BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS personalization_opt_out         BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN public.profiles.personalization_version     IS 'Active personalization engine version: v1 or v2';
COMMENT ON COLUMN public.profiles.stable_preferences          IS 'Long-term stable user preferences (tone, detail level, language style, topics)';
COMMENT ON COLUMN public.profiles.contextual_preferences      IS 'Short-term contextual preferences inferred from recent sessions';
COMMENT ON COLUMN public.profiles.personalization_confidence  IS 'Confidence score 0–1 for computed personalization profile';
COMMENT ON COLUMN public.profiles.personalization_updated_at  IS 'Timestamp of last personalization profile refresh';
COMMENT ON COLUMN public.profiles.personalization_enabled     IS 'Master kill-switch for personalization per user';
COMMENT ON COLUMN public.profiles.personalization_opt_out     IS 'User opt-out flag; overrides personalization_enabled when true';
