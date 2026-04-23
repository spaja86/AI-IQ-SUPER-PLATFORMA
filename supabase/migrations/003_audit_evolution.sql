-- SpajaUltraOmegaCore -∞Ω+∞ — Migracija: Audit Događaji + Evolucioni Ciklusi
-- Kompanija SPAJA — Digitalna Industrija
--
-- Svrha:
--   1. Trajna pohrana audit log-a (umesto in-memory)
--   2. Trajna pohrana evolucijskih ciklusa i preporuka (umesto stub-a)
--   3. RLS politike za sigurnu izolaciju podataka

-- ═══════════════════════════════════════════════════
-- 1. Audit Događaji — nepromenjivi append-only log
-- ═══════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.audit_events (
  id           TEXT         PRIMARY KEY,
  timestamp    BIGINT       NOT NULL,                        -- Unix ms
  user_id      TEXT         NOT NULL,
  action       TEXT         NOT NULL,
  resource     TEXT         NOT NULL,
  ip           TEXT         NOT NULL DEFAULT '0.0.0.0',
  user_agent   TEXT         NOT NULL DEFAULT '',
  outcome      TEXT         NOT NULL
                            CHECK (outcome IN ('SUCCESS', 'DENIED', 'ERROR')),
  previous_hash TEXT        NOT NULL DEFAULT '',
  hash         TEXT         NOT NULL,
  details      JSONB,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Zabrani UPDATE i DELETE — append-only semantika
CREATE RULE audit_no_update AS ON UPDATE TO public.audit_events DO INSTEAD NOTHING;
CREATE RULE audit_no_delete AS ON DELETE TO public.audit_events DO INSTEAD NOTHING;

-- RLS
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;

-- Samo ADMIN može čitati audit log
CREATE POLICY "Admins can read audit events"
  ON public.audit_events FOR SELECT
  USING (auth.role() = 'service_role');

-- Service role može insertovati (API rute koriste service_role ključ)
CREATE POLICY "Service role can insert audit events"
  ON public.audit_events FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- Indeksi za brze upite
CREATE INDEX IF NOT EXISTS idx_audit_user_id     ON public.audit_events(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_action      ON public.audit_events(action);
CREATE INDEX IF NOT EXISTS idx_audit_outcome     ON public.audit_events(outcome);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp   ON public.audit_events(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_created_at  ON public.audit_events(created_at DESC);

-- ═══════════════════════════════════════════════════
-- 2. Evolucioni Ciklusi — trajno skladište za Omega Evolucioni Motor
-- ═══════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.evolution_cycles (
  id              TEXT         PRIMARY KEY,
  started_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  finished_at     TIMESTAMPTZ,
  status          TEXT         NOT NULL DEFAULT 'active'
                               CHECK (status IN ('scheduled', 'active', 'completed', 'failed')),
  zdravlje        INTEGER      NOT NULL DEFAULT 100
                               CHECK (zdravlje BETWEEN 0 AND 100),
  ukupno_provera  INTEGER      NOT NULL DEFAULT 0,
  uspesnih        INTEGER      NOT NULL DEFAULT 0,
  upozorenja      INTEGER      NOT NULL DEFAULT 0,
  gresaka         INTEGER      NOT NULL DEFAULT 0,
  kriticnih       INTEGER      NOT NULL DEFAULT 0,
  verzija         TEXT         NOT NULL DEFAULT '1.0.0',
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

ALTER TABLE public.evolution_cycles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on evolution_cycles"
  ON public.evolution_cycles FOR ALL
  USING (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_evo_cycles_status     ON public.evolution_cycles(status);
CREATE INDEX IF NOT EXISTS idx_evo_cycles_created_at ON public.evolution_cycles(created_at DESC);

-- ═══════════════════════════════════════════════════
-- 3. Evolucijske Preporuke — preporuke per ciklus
-- ═══════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.evolution_recommendations (
  id              TEXT         PRIMARY KEY,
  cycle_id        TEXT         NOT NULL REFERENCES public.evolution_cycles(id) ON DELETE CASCADE,
  naslov          TEXT         NOT NULL,
  opis            TEXT         NOT NULL DEFAULT '',
  tip             TEXT         NOT NULL
                               CHECK (tip IN ('popravka', 'optimizacija', 'nadogradnja', 'nova-funkcija', 'bezbednost')),
  prioritet       TEXT         NOT NULL
                               CHECK (prioritet IN ('kritican', 'visok', 'srednji', 'nizak')),
  persona         TEXT         NOT NULL DEFAULT '',
  procenjeni_napor TEXT        NOT NULL DEFAULT 'umeren'
                               CHECK (procenjeni_napor IN ('minimalan', 'umeren', 'znacajan')),
  github_issue_id  INTEGER,
  github_pr_id     INTEGER,
  akcija_status   TEXT         NOT NULL DEFAULT 'kreirana'
                               CHECK (akcija_status IN ('kreirana', 'u_toku', 'zavrsena', 'neuspesna')),
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

ALTER TABLE public.evolution_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on evolution_recommendations"
  ON public.evolution_recommendations FOR ALL
  USING (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_evo_rec_cycle_id  ON public.evolution_recommendations(cycle_id);
CREATE INDEX IF NOT EXISTS idx_evo_rec_prioritet ON public.evolution_recommendations(prioritet);
CREATE INDEX IF NOT EXISTS idx_evo_rec_status    ON public.evolution_recommendations(akcija_status);

-- ═══════════════════════════════════════════════════
-- 4. Health Snapshots — snapshot zdravlja sistema (svaki cron)
-- ═══════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.health_snapshots (
  id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  zdravlje        INTEGER      NOT NULL CHECK (zdravlje BETWEEN 0 AND 100),
  status          TEXT         NOT NULL
                               CHECK (status IN ('zdravo', 'upozorenje', 'kriticno')),
  ukupno_provera  INTEGER      NOT NULL DEFAULT 0,
  uspesnih        INTEGER      NOT NULL DEFAULT 0,
  upozorenja      INTEGER      NOT NULL DEFAULT 0,
  gresaka         INTEGER      NOT NULL DEFAULT 0,
  kriticnih       INTEGER      NOT NULL DEFAULT 0,
  verzija         TEXT         NOT NULL DEFAULT '1.0.0',
  snapshot_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

ALTER TABLE public.health_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on health_snapshots"
  ON public.health_snapshots FOR ALL
  USING (auth.role() = 'service_role');

-- Čuvaj samo 30 dana snapshot-a (operativni period)
CREATE INDEX IF NOT EXISTS idx_health_snapshot_at ON public.health_snapshots(snapshot_at DESC);

-- Automatsko čišćenje starih snapshot-a (> 30 dana)
CREATE OR REPLACE FUNCTION public.cleanup_old_health_snapshots()
RETURNS void AS $$
BEGIN
  DELETE FROM public.health_snapshots
  WHERE snapshot_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
