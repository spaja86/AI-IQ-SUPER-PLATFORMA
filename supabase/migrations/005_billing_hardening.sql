-- SpajaUltraOmegaCore -∞Ω+∞ — Billing Hardening Migration
-- Kompanija SPAJA — Digitalna Industrija
-- Migration: 005_billing_hardening.sql
--
-- Implementira:
--   #1  Unique index na stripe_webhook_events.event_id
--   #2  Retention politika za stripe_webhook_events (90 dana)
--   #3  Arhiviranje za financial_audit_log (180 dana u main, 5 godina u arhivi)
--   #15 Soft-lock kolone na profiles
--   #16 Grace period kolone na profiles
--   #17 Webhook ordering kolone
--   #38 Least-privilege RLS politike za finansijske tabele
--   DLQ tabela za dead-letter queue (#7)

-- ─── 1. Unique index na stripe_webhook_events.event_id (#1) ──────────────────
-- Osigurava da isti Stripe event ne može biti unet duplikat.
-- Korišćen i za idempotency guard u webhook handler-u (kod 23505).
CREATE UNIQUE INDEX IF NOT EXISTS idx_stripe_webhook_events_event_id
  ON stripe_webhook_events (event_id);

-- Indeks za brze pretrage po event tipu i vremenu obrade
CREATE INDEX IF NOT EXISTS idx_stripe_webhook_events_type_processed
  ON stripe_webhook_events (event_type, processed_at DESC);

-- ─── 2. Retention politika za stripe_webhook_events (#2) ─────────────────────
-- Automatski briše zapise starije od 90 dana.
-- Zahteva pg_cron ekstenziju (dostupna na Supabase).
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.schedule(
      'billing-webhook-events-cleanup',
      '0 3 * * *',  -- Svaki dan u 03:00
      $$
        DELETE FROM stripe_webhook_events
        WHERE processed_at < NOW() - INTERVAL '90 days';
      $$
    );
  END IF;
END;
$$;

-- ─── 3. Arhiviranje financial_audit_log (#3) ──────────────────────────────────
-- Arhivska tabela za audit log stariji od 180 dana
CREATE TABLE IF NOT EXISTS financial_audit_log_archive (
  LIKE financial_audit_log INCLUDING ALL
);

-- Periodično premeštanje starih audit zapisa u arhivu
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.schedule(
      'billing-audit-log-archive',
      '0 4 * * 0',  -- Nedeljno u 04:00
      $$
        WITH moved AS (
          DELETE FROM financial_audit_log
          WHERE created_at < NOW() - INTERVAL '180 days'
          RETURNING *
        )
        INSERT INTO financial_audit_log_archive
        SELECT * FROM moved;
      $$
    );
  END IF;
END;
$$;

-- ─── Dead-Letter Queue tabela (#7) ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS webhook_dead_letter (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id      TEXT NOT NULL,
  event_type    TEXT NOT NULL,
  payload       TEXT NOT NULL,
  failure_reason TEXT NOT NULL,
  retry_count   INTEGER DEFAULT 0,
  replayed      BOOLEAN DEFAULT FALSE,
  replayed_at   TIMESTAMPTZ,
  occurred_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_webhook_dead_letter_event_id
  ON webhook_dead_letter (event_id);

CREATE INDEX IF NOT EXISTS idx_webhook_dead_letter_replayed
  ON webhook_dead_letter (replayed) WHERE replayed = FALSE;

-- ─── Soft-lock i Grace Period kolone na profiles (#15, #16) ──────────────────
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS billing_locked BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS failed_payment_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS grace_period_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_plan_changed_at TIMESTAMPTZ;

-- Indeks za brzo pronalaženje locked naloga
CREATE INDEX IF NOT EXISTS idx_profiles_billing_locked
  ON profiles (billing_locked) WHERE billing_locked = TRUE;

-- Indeks za brzo pronalaženje naloga u grace periodu
CREATE INDEX IF NOT EXISTS idx_profiles_grace_period
  ON profiles (grace_period_expires_at)
  WHERE grace_period_expires_at IS NOT NULL;

-- ─── Billing Feature Flags tabela (#33) ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS billing_feature_flags (
  id          TEXT PRIMARY KEY,
  naziv       TEXT NOT NULL,
  enabled     BOOLEAN DEFAULT FALSE,
  rollout_pct INTEGER DEFAULT 0 CHECK (rollout_pct >= 0 AND rollout_pct <= 100),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by  TEXT
);

-- ─── User Notifications tabela (#49) ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_notifications (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type        TEXT NOT NULL DEFAULT 'billing',
  action      TEXT NOT NULL,
  metadata    JSONB DEFAULT '{}',
  read        BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_notifications_user_unread
  ON user_notifications (user_id, read) WHERE read = FALSE;

-- ─── RLS politike za finansijske tabele (#38) ────────────────────────────────

-- stripe_webhook_events: samo service role može pisati; korisnici ne vide ništa
ALTER TABLE stripe_webhook_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS webhook_events_service_only ON stripe_webhook_events;
CREATE POLICY webhook_events_service_only ON stripe_webhook_events
  USING (auth.role() = 'service_role');

-- financial_audit_log: service role piše; korisnik može videti samo svoje zapise
ALTER TABLE financial_audit_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS audit_log_own_read ON financial_audit_log;
CREATE POLICY audit_log_own_read ON financial_audit_log
  FOR SELECT USING (
    auth.role() = 'service_role'
    OR user_id = auth.uid()
  );
DROP POLICY IF EXISTS audit_log_service_write ON financial_audit_log;
CREATE POLICY audit_log_service_write ON financial_audit_log
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- webhook_dead_letter: samo service role
ALTER TABLE webhook_dead_letter ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS dlq_service_only ON webhook_dead_letter;
CREATE POLICY dlq_service_only ON webhook_dead_letter
  USING (auth.role() = 'service_role');

-- user_notifications: korisnik čita samo svoje
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS notifications_own ON user_notifications;
CREATE POLICY notifications_own ON user_notifications
  USING (
    auth.role() = 'service_role'
    OR user_id = auth.uid()
  );

-- ─── Indeksi za poboljšanje performansi financial_audit_log ──────────────────
CREATE INDEX IF NOT EXISTS idx_financial_audit_log_user_id
  ON financial_audit_log (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_financial_audit_log_stripe_event
  ON financial_audit_log (stripe_event_id);

CREATE INDEX IF NOT EXISTS idx_financial_audit_log_action
  ON financial_audit_log (action, created_at DESC);

-- ─── Retention politika za webhook_dead_letter (30 dana) ─────────────────────
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.schedule(
      'billing-dlq-cleanup',
      '0 5 * * *',
      $$
        DELETE FROM webhook_dead_letter
        WHERE replayed = TRUE
          AND created_at < NOW() - INTERVAL '30 days';
      $$
    );
  END IF;
END;
$$;
