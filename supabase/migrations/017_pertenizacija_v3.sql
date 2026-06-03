-- Migration 017: PERTENIZACIJA 3 — Personalization v3 profile columns
-- Additive migration; no existing columns removed; rollback-safe.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS adaptive_preferences          JSONB,
  ADD COLUMN IF NOT EXISTS personalization_feedback      JSONB,
  ADD COLUMN IF NOT EXISTS personalization_v3_score      NUMERIC(4,3) NOT NULL DEFAULT 0;

COMMENT ON COLUMN public.profiles.adaptive_preferences       IS 'Learned adaptive preferences updated by session feedback (v3 engine)';
COMMENT ON COLUMN public.profiles.personalization_feedback   IS 'Implicit and explicit feedback signals captured during sessions (v3 engine)';
COMMENT ON COLUMN public.profiles.personalization_v3_score   IS 'Composite v3 personalization score 0–1 (stable confidence + adaptive signals + session frequency)';
