-- Migration: 019_depon_us_states_platform.sql
-- AI IQ SUPER PLATFORMA — DEPON 120M Scale US States Platform
-- Kompanija SPAJA — Digitalna Industrija
--
-- Creates core tables for the 12 DEPON modules and
-- US-state multi-tenant data architecture.

-- ─── US States Reference ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS us_states (
  state_code     CHAR(2)      PRIMARY KEY,
  state_name     TEXT         NOT NULL,
  region         TEXT         NOT NULL CHECK (region IN ('northeast','southeast','midwest','southwest','west','northwest')),
  timezone       TEXT         NOT NULL,
  data_region    TEXT         NOT NULL DEFAULT 'us-east-1',
  active         BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

INSERT INTO us_states (state_code, state_name, region, timezone) VALUES
  ('AL','Alabama','southeast','America/Chicago'),
  ('AK','Alaska','northwest','America/Anchorage'),
  ('AZ','Arizona','southwest','America/Phoenix'),
  ('AR','Arkansas','southeast','America/Chicago'),
  ('CA','California','west','America/Los_Angeles'),
  ('CO','Colorado','west','America/Denver'),
  ('CT','Connecticut','northeast','America/New_York'),
  ('DE','Delaware','northeast','America/New_York'),
  ('FL','Florida','southeast','America/New_York'),
  ('GA','Georgia','southeast','America/New_York'),
  ('HI','Hawaii','west','Pacific/Honolulu'),
  ('ID','Idaho','northwest','America/Denver'),
  ('IL','Illinois','midwest','America/Chicago'),
  ('IN','Indiana','midwest','America/Indiana/Indianapolis'),
  ('IA','Iowa','midwest','America/Chicago'),
  ('KS','Kansas','midwest','America/Chicago'),
  ('KY','Kentucky','southeast','America/New_York'),
  ('LA','Louisiana','southeast','America/Chicago'),
  ('ME','Maine','northeast','America/New_York'),
  ('MD','Maryland','northeast','America/New_York'),
  ('MA','Massachusetts','northeast','America/New_York'),
  ('MI','Michigan','midwest','America/Detroit'),
  ('MN','Minnesota','midwest','America/Chicago'),
  ('MS','Mississippi','southeast','America/Chicago'),
  ('MO','Missouri','midwest','America/Chicago'),
  ('MT','Montana','northwest','America/Denver'),
  ('NE','Nebraska','midwest','America/Chicago'),
  ('NV','Nevada','west','America/Los_Angeles'),
  ('NH','New Hampshire','northeast','America/New_York'),
  ('NJ','New Jersey','northeast','America/New_York'),
  ('NM','New Mexico','southwest','America/Denver'),
  ('NY','New York','northeast','America/New_York'),
  ('NC','North Carolina','southeast','America/New_York'),
  ('ND','North Dakota','midwest','America/Chicago'),
  ('OH','Ohio','midwest','America/New_York'),
  ('OK','Oklahoma','southwest','America/Chicago'),
  ('OR','Oregon','northwest','America/Los_Angeles'),
  ('PA','Pennsylvania','northeast','America/New_York'),
  ('RI','Rhode Island','northeast','America/New_York'),
  ('SC','South Carolina','southeast','America/New_York'),
  ('SD','South Dakota','midwest','America/Chicago'),
  ('TN','Tennessee','southeast','America/Chicago'),
  ('TX','Texas','southwest','America/Chicago'),
  ('UT','Utah','west','America/Denver'),
  ('VT','Vermont','northeast','America/New_York'),
  ('VA','Virginia','southeast','America/New_York'),
  ('WA','Washington','northwest','America/Los_Angeles'),
  ('WV','West Virginia','southeast','America/New_York'),
  ('WI','Wisconsin','midwest','America/Chicago'),
  ('WY','Wyoming','west','America/Denver')
ON CONFLICT (state_code) DO NOTHING;

-- ─── State Compliance Laws ────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS state_compliance_laws (
  id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  state_code  CHAR(2)      NOT NULL REFERENCES us_states(state_code),
  law_code    TEXT         NOT NULL,
  description TEXT,
  effective   DATE,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  UNIQUE (state_code, law_code)
);

INSERT INTO state_compliance_laws (state_code, law_code) VALUES
  ('CA','CCPA'), ('CA','CPRA'), ('CA','HIPAA'), ('CA','PCI-DSS'),
  ('NY','SHIELD'), ('NY','NYDFS'), ('NY','HIPAA'), ('NY','PCI-DSS'),
  ('TX','TDPSA'), ('TX','HIPAA'), ('TX','PCI-DSS'),
  ('VA','VCDPA'), ('VA','HIPAA'), ('VA','PCI-DSS'),
  ('CO','CPA'),   ('CO','HIPAA'), ('CO','PCI-DSS'),
  ('CT','CTDPA'), ('CT','HIPAA'), ('CT','PCI-DSS'),
  ('UT','UCPA'),  ('UT','HIPAA'), ('UT','PCI-DSS'),
  ('FL','FDBR'),  ('FL','HIPAA'), ('FL','PCI-DSS')
ON CONFLICT (state_code, law_code) DO NOTHING;

-- ─── DEPON Module Registry ────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS depon_modules (
  depon_id      TEXT         PRIMARY KEY,
  name          TEXT         NOT NULL,
  description   TEXT,
  scope         TEXT,
  status        TEXT         NOT NULL DEFAULT 'planned' CHECK (status IN ('active','planned','degraded','offline')),
  phase         SMALLINT     NOT NULL CHECK (phase BETWEEN 1 AND 3),
  port          INTEGER      NOT NULL UNIQUE,
  health_path   TEXT         NOT NULL,
  version       TEXT         NOT NULL DEFAULT '1.0.0',
  deployed_at   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

INSERT INTO depon_modules (depon_id, name, scope, status, phase, port, health_path) VALUES
  ('DEPON-01', 'User Identity & Auth',    'All 50 states',             'active',  1, 3001, '/api/depon/01/health'),
  ('DEPON-02', 'State Dashboard Portal',  'Per-state customization',   'active',  1, 3002, '/api/depon/02/health'),
  ('DEPON-03', 'Analytics Engine',        'Real-time, 120M events/day','active',  1, 3003, '/api/depon/03/health'),
  ('DEPON-04', 'Payment & Billing',       'PCI-DSS compliant',         'active',  1, 3004, '/api/depon/04/health'),
  ('DEPON-05', 'Notification Service',    'Push, Email, SMS',          'planned', 2, 3005, '/api/depon/05/health'),
  ('DEPON-06', 'Content Management',      'Multi-language, multi-state','planned',2, 3006, '/api/depon/06/health'),
  ('DEPON-07', 'Search & Discovery',      'Elasticsearch cluster',     'planned', 2, 3007, '/api/depon/07/health'),
  ('DEPON-08', 'API Gateway',             'Rate limiting, routing',    'planned', 2, 3008, '/api/depon/08/health'),
  ('DEPON-09', 'AI/ML Service',           'Recommendations, predictions','planned',3, 3009,'/api/depon/09/health'),
  ('DEPON-10', 'Admin & Compliance',      'HIPAA/GDPR/State laws',     'planned', 3, 3010, '/api/depon/10/health'),
  ('DEPON-11', 'Mobile Backend (BFF)',    'iOS + Android',             'planned', 3, 3011, '/api/depon/11/health'),
  ('DEPON-12', 'Reporting & Exports',     'CSV, PDF, BI tools',        'planned', 3, 3012, '/api/depon/12/health')
ON CONFLICT (depon_id) DO NOTHING;

-- ─── DEPON-01: Users (State-Partitioned) ─────────────────────────────────────

CREATE TABLE IF NOT EXISTS platform_users (
  user_id       UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT         NOT NULL UNIQUE,
  role          TEXT         NOT NULL DEFAULT 'user' CHECK (role IN ('user','admin','state-admin','compliance-officer','super-admin')),
  state_code    CHAR(2)      REFERENCES us_states(state_code),
  provider      TEXT         NOT NULL DEFAULT 'email',
  mfa_enabled   BOOLEAN      NOT NULL DEFAULT FALSE,
  subscription_tier TEXT     NOT NULL DEFAULT 'free',
  last_login_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_platform_users_state ON platform_users(state_code);
CREATE INDEX IF NOT EXISTS idx_platform_users_email ON platform_users(email);

-- ─── DEPON-01: Sessions ───────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS platform_sessions (
  session_id    TEXT         PRIMARY KEY,
  user_id       UUID         NOT NULL REFERENCES platform_users(user_id) ON DELETE CASCADE,
  state_code    CHAR(2)      REFERENCES us_states(state_code),
  status        TEXT         NOT NULL DEFAULT 'active' CHECK (status IN ('active','expired','revoked','suspicious')),
  ip_address    INET,
  user_agent    TEXT,
  expires_at    TIMESTAMPTZ  NOT NULL,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON platform_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON platform_sessions(expires_at);

-- ─── DEPON-03: Analytics Events ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS analytics_events (
  event_id      TEXT         PRIMARY KEY,
  category      TEXT         NOT NULL,
  name          TEXT         NOT NULL,
  user_id       UUID         REFERENCES platform_users(user_id),
  state_code    CHAR(2)      REFERENCES us_states(state_code),
  session_id    TEXT,
  depon_source  TEXT         REFERENCES depon_modules(depon_id),
  properties    JSONB        NOT NULL DEFAULT '{}',
  recorded_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
) PARTITION BY RANGE (recorded_at);

CREATE TABLE IF NOT EXISTS analytics_events_y2025
  PARTITION OF analytics_events
  FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

CREATE TABLE IF NOT EXISTS analytics_events_y2026
  PARTITION OF analytics_events
  FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');

CREATE INDEX IF NOT EXISTS idx_analytics_state ON analytics_events(state_code, recorded_at);
CREATE INDEX IF NOT EXISTS idx_analytics_user  ON analytics_events(user_id, recorded_at);
CREATE INDEX IF NOT EXISTS idx_analytics_cat   ON analytics_events(category, recorded_at);

-- ─── DEPON-04: Payments ───────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS platform_payments (
  payment_id       TEXT         PRIMARY KEY,
  user_id          UUID         NOT NULL REFERENCES platform_users(user_id),
  state_code       CHAR(2)      REFERENCES us_states(state_code),
  amount_usd       NUMERIC(12,2) NOT NULL CHECK (amount_usd >= 0),
  currency         CHAR(3)      NOT NULL DEFAULT 'USD',
  method           TEXT         NOT NULL,
  status           TEXT         NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processing','succeeded','failed','refunded','disputed')),
  state_tax_rate   NUMERIC(8,6) NOT NULL DEFAULT 0,
  state_tax_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  idempotency_key  TEXT         NOT NULL UNIQUE,
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_user  ON platform_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_state ON platform_payments(state_code);
CREATE INDEX IF NOT EXISTS idx_payments_status ON platform_payments(status);

CREATE TABLE IF NOT EXISTS platform_subscriptions (
  subscription_id     TEXT         PRIMARY KEY,
  user_id             UUID         NOT NULL REFERENCES platform_users(user_id),
  state_code          CHAR(2)      REFERENCES us_states(state_code),
  tier                TEXT         NOT NULL DEFAULT 'free',
  cycle               TEXT         NOT NULL DEFAULT 'monthly',
  price_usd           NUMERIC(10,2) NOT NULL DEFAULT 0,
  status              TEXT         NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  current_period_end  TIMESTAMPTZ  NOT NULL,
  cancel_at_period_end BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON platform_subscriptions(user_id);

-- ─── DEPON-05: Notifications ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS notifications (
  notification_id TEXT         PRIMARY KEY,
  user_id         UUID         NOT NULL REFERENCES platform_users(user_id),
  state_code      CHAR(2)      REFERENCES us_states(state_code),
  channel         TEXT         NOT NULL CHECK (channel IN ('push','email','sms','in-app','webhook')),
  priority        TEXT         NOT NULL DEFAULT 'normal' CHECK (priority IN ('low','normal','high','critical')),
  subject         TEXT         NOT NULL,
  body            TEXT         NOT NULL,
  template_id     TEXT,
  template_vars   JSONB        NOT NULL DEFAULT '{}',
  status          TEXT         NOT NULL DEFAULT 'queued',
  scheduled_at    TIMESTAMPTZ,
  sent_at         TIMESTAMPTZ,
  delivered_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user   ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status, created_at);

-- ─── DEPON-10: Audit Log ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS audit_log (
  audit_id      TEXT         PRIMARY KEY,
  action        TEXT         NOT NULL,
  actor_id      TEXT         NOT NULL,
  actor_role    TEXT         NOT NULL,
  target_id     TEXT,
  target_type   TEXT,
  state_code    CHAR(2)      REFERENCES us_states(state_code),
  ip_address    INET,
  laws          TEXT[]       NOT NULL DEFAULT '{}',
  metadata      JSONB        NOT NULL DEFAULT '{}',
  recorded_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_actor    ON audit_log(actor_id, recorded_at);
CREATE INDEX IF NOT EXISTS idx_audit_state    ON audit_log(state_code, recorded_at);
CREATE INDEX IF NOT EXISTS idx_audit_action   ON audit_log(action, recorded_at);

-- ─── DEPON-10: Data Subject Requests ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS data_subject_requests (
  request_id    TEXT         PRIMARY KEY,
  type          TEXT         NOT NULL CHECK (type IN ('access','deletion','portability','correction','opt-out')),
  user_id       UUID         NOT NULL REFERENCES platform_users(user_id),
  state_code    CHAR(2)      REFERENCES us_states(state_code),
  status        TEXT         NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processing','completed','rejected')),
  submitted_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  completed_at  TIMESTAMPTZ,
  deadline      TIMESTAMPTZ  NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_dsr_user   ON data_subject_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_dsr_status ON data_subject_requests(status, deadline);

-- ─── DEPON-12: Report Jobs ────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS report_jobs (
  job_id              TEXT         PRIMARY KEY,
  type                TEXT         NOT NULL,
  format              TEXT         NOT NULL,
  state_code          CHAR(2)      REFERENCES us_states(state_code),
  requested_by        TEXT         NOT NULL,
  schedule            TEXT         NOT NULL DEFAULT 'on-demand',
  status              TEXT         NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','generating','ready','failed','expired')),
  date_range_start    DATE         NOT NULL,
  date_range_end      DATE         NOT NULL,
  file_size_bytes     BIGINT,
  download_url        TEXT,
  expires_at          TIMESTAMPTZ,
  created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  completed_at        TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_reports_status    ON report_jobs(status, created_at);
CREATE INDEX IF NOT EXISTS idx_reports_requester ON report_jobs(requested_by);

-- ─── Updated_at triggers ─────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_platform_users_updated_at') THEN
    CREATE TRIGGER trg_platform_users_updated_at
      BEFORE UPDATE ON platform_users
      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_payments_updated_at') THEN
    CREATE TRIGGER trg_payments_updated_at
      BEFORE UPDATE ON platform_payments
      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_subscriptions_updated_at') THEN
    CREATE TRIGGER trg_subscriptions_updated_at
      BEFORE UPDATE ON platform_subscriptions
      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
END $$;

-- ─── RLS Policies (Supabase) ──────────────────────────────────────────────────

ALTER TABLE platform_users    ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications      ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log          ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "users_own_data" ON platform_users
  FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "users_own_sessions" ON platform_sessions
  FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "users_own_payments" ON platform_payments
  FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "users_own_notifications" ON notifications
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- Audit log: read-only for compliance officers and admins
CREATE POLICY "audit_read_admins" ON audit_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM platform_users
      WHERE user_id = auth.uid()
        AND role IN ('admin','super-admin','compliance-officer')
    )
  );
