-- SpajaUltraOmegaCore -∞Ω+∞ — Enterprise Ugovori i Komunikacija Istorija
-- Kompanija SPAJA — Digitalna Industrija
--
-- Implementira:
--   - Praćenje statusa enterprise ugovora (pending -> kontaktiran -> potpisano)
--   - Istoriju enterprise komunikacije (email/forma/poziv/sastanak)

CREATE TABLE IF NOT EXISTS enterprise_komunikacija_istorija (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL CHECK (provider IN ('vercel', 'github', 'openai')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'kontaktiran', 'potpisano')),
  kanal TEXT NOT NULL CHECK (kanal IN ('kontakt_forma', 'email', 'poziv', 'sastanak')),
  naslov TEXT NOT NULL,
  telo TEXT NOT NULL,
  kontakt_osoba TEXT,
  napomena TEXT,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_enterprise_kom_istorija_provider_created
  ON enterprise_komunikacija_istorija (provider, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_enterprise_kom_istorija_status_created
  ON enterprise_komunikacija_istorija (status, created_at DESC);

CREATE TABLE IF NOT EXISTS enterprise_ugovori (
  provider TEXT PRIMARY KEY CHECK (provider IN ('vercel', 'github', 'openai')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'kontaktiran', 'potpisano')),
  poslednja_aktivnost_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  poslednja_napomena TEXT,
  poslednji_kontakt_kanal TEXT CHECK (poslednji_kontakt_kanal IN ('kontakt_forma', 'email', 'poziv', 'sastanak')),
  kontakt_osoba TEXT,
  pending_at TIMESTAMPTZ,
  kontaktiran_at TIMESTAMPTZ,
  potpisano_at TIMESTAMPTZ,
  poslednji_istorija_id UUID REFERENCES enterprise_komunikacija_istorija(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_enterprise_ugovori_status
  ON enterprise_ugovori (status, updated_at DESC);
