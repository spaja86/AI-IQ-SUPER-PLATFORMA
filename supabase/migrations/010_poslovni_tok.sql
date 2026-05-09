-- SpajaUltraOmegaCore -∞Ω+∞ — Poslovni Tok (Unified Business Flow)
-- Kompanija SPAJA — Digitalna Industrija
--
-- Implementira:
--   - Jedinstven poslovni tok (lead → kontaktiran → ponuda → ugovor → uplata → isporuka → zatvoreno)
--   - Delivery arrival event sa checklistom i signaturom
--   - KPI snapshots za operativni pregled

CREATE TABLE IF NOT EXISTS poslovni_tok_slucajevi (
  id TEXT PRIMARY KEY,
  tip TEXT NOT NULL CHECK (tip IN ('enterprise', 'b2b')),
  status TEXT NOT NULL CHECK (status IN ('lead', 'kontaktiran', 'ponuda', 'ugovor', 'uplata', 'isporuka', 'zatvoreno', 'otkazano')),
  prioritet TEXT NOT NULL CHECK (prioritet IN ('nizak', 'srednji', 'visok', 'kritican')),
  naziv TEXT NOT NULL,
  vlasnik TEXT NOT NULL,
  kontakt_email TEXT NOT NULL,
  enterprise_sourcing_id TEXT,
  b2b_procurement_id TEXT,
  blockchain_tx_hash TEXT,
  blockchain_mreza TEXT CHECK (blockchain_mreza IN ('polygon-mainnet', 'polygon-amoy-testnet')),
  blockchain_dogadjaj TEXT,
  blockchain_timestamp TIMESTAMPTZ,
  blockchain_adresa_ugovora TEXT,
  -- SLA timestamps po fazi
  lead_at TIMESTAMPTZ,
  kontaktiran_at TIMESTAMPTZ,
  ponuda_at TIMESTAMPTZ,
  ugovor_at TIMESTAMPTZ,
  uplata_at TIMESTAMPTZ,
  isporuka_at TIMESTAMPTZ,
  zatvoreno_at TIMESTAMPTZ,
  otkazano_at TIMESTAMPTZ,
  -- Audit
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_poslovni_tok_status
  ON poslovni_tok_slucajevi (status, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_poslovni_tok_tip_status
  ON poslovni_tok_slucajevi (tip, status);

CREATE INDEX IF NOT EXISTS idx_poslovni_tok_prioritet
  ON poslovni_tok_slucajevi (prioritet, status);

-- Dokumentacija po slučaju (document gate)
CREATE TABLE IF NOT EXISTS poslovni_tok_dokumentacija (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slucaj_id TEXT NOT NULL REFERENCES poslovni_tok_slucajevi(id) ON DELETE CASCADE,
  kljuc TEXT NOT NULL,
  naziv TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('nedostaje', 'primljeno', 'verifikovano')),
  verifikovao TEXT,
  blockchain_tx_hash TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (slucaj_id, kljuc)
);

CREATE INDEX IF NOT EXISTS idx_poslovni_tok_dok_slucaj
  ON poslovni_tok_dokumentacija (slucaj_id, kljuc);

-- Komunikacija po slučaju
CREATE TABLE IF NOT EXISTS poslovni_tok_komunikacija (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slucaj_id TEXT NOT NULL REFERENCES poslovni_tok_slucajevi(id) ON DELETE CASCADE,
  kanal TEXT NOT NULL CHECK (kanal IN ('kontakt_forma', 'email', 'poziv', 'sastanak')),
  kontakt_osoba TEXT,
  napomena TEXT,
  fallback_razlog TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_poslovni_tok_kom_slucaj
  ON poslovni_tok_komunikacija (slucaj_id, created_at DESC);

-- Delivery arrival events
CREATE TABLE IF NOT EXISTS delivery_arrival_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slucaj_id TEXT NOT NULL REFERENCES poslovni_tok_slucajevi(id) ON DELETE CASCADE,
  lokacija TEXT NOT NULL,
  kontakt_na_licu_mesta TEXT NOT NULL,
  checklist JSONB NOT NULL DEFAULT '[]',
  signatura JSONB,
  zatvoreno_at TIMESTAMPTZ,
  napomena TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_delivery_arrival_slucaj
  ON delivery_arrival_events (slucaj_id, created_at DESC);

-- KPI snapshots za dnevni operativni pregled
CREATE TABLE IF NOT EXISTS kpi_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ukupno_slucajeva INTEGER NOT NULL DEFAULT 0,
  zatvorenih INTEGER NOT NULL DEFAULT 0,
  otkazanih INTEGER NOT NULL DEFAULT 0,
  aktivnih INTEGER NOT NULL DEFAULT 0,
  stopa_zatvaranja INTEGER NOT NULL DEFAULT 0,
  prosecno_vreme_ugovora_sati INTEGER,
  prosecno_vreme_isporuke_sati INTEGER,
  slucajevi_sa_kompletnim_dokumentima INTEGER NOT NULL DEFAULT 0,
  procenat_kompletnih_dokumenata INTEGER NOT NULL DEFAULT 0,
  slucajevi_sa_blockchain_tragom INTEGER NOT NULL DEFAULT 0,
  procenat_blockchain_traga INTEGER NOT NULL DEFAULT 0,
  sla_prekoracenih INTEGER NOT NULL DEFAULT 0,
  sla_u_toleranciji INTEGER NOT NULL DEFAULT 0,
  kpi_ocena INTEGER NOT NULL DEFAULT 0,
  snapshot_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_kpi_snapshots_at
  ON kpi_snapshots (snapshot_at DESC);
