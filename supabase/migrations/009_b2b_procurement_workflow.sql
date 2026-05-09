-- SpajaUltraOmegaCore -∞Ω+∞ — Internal B2B Procurement Workflow
-- Kompanija SPAJA — Digitalna Industrija
--
-- Implementira:
--   - Partnerstvo + nabavka lifecycle (upit -> ponuda -> pregovori -> odobrenje -> placanje -> isporuka -> preuzeto)
--   - Dokumentacioni i approval tok
--   - Payment i delivery tracking
--   - Snapshot polje za kompletnu internu evidenciju slučaja (admin-only detalji)

CREATE TABLE IF NOT EXISTS b2b_partneri (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  naziv TEXT NOT NULL,
  tip TEXT NOT NULL CHECK (tip IN ('proizvodjac', 'ovlasceni_diler', 'posrednik', 'tehnoloski_partner')),
  trziste TEXT NOT NULL,
  kanal_kontakta TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('lead', 'kontaktiran', 'u_pregovorima', 'aktivan', 'odbijen')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS b2b_nabavke (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES b2b_partneri(id) ON DELETE RESTRICT,
  case_code TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('upit', 'ponuda', 'pregovori', 'odobrenje', 'placanje', 'isporuka', 'preuzeto', 'otkazano')),
  market TEXT NOT NULL,
  vehicle_make TEXT NOT NULL,
  vehicle_model TEXT NOT NULL,
  vehicle_trim TEXT NOT NULL,
  budget_amount NUMERIC(18, 2) NOT NULL DEFAULT 0,
  budget_currency TEXT NOT NULL CHECK (budget_currency IN ('EUR', 'USD', 'RSD')),
  priority TEXT NOT NULL CHECK (priority IN ('nizak', 'srednji', 'visok', 'kritican')),
  due_date DATE,
  financing_source TEXT NOT NULL,
  owner_name TEXT,
  private_phone TEXT,
  delivery_address TEXT,
  snapshot JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_b2b_nabavke_status ON b2b_nabavke(status, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_b2b_nabavke_partner ON b2b_nabavke(partner_id);

CREATE TABLE IF NOT EXISTS b2b_ponude (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nabavka_id UUID NOT NULL REFERENCES b2b_nabavke(id) ON DELETE CASCADE,
  source TEXT NOT NULL,
  amount NUMERIC(18, 2) NOT NULL,
  currency TEXT NOT NULL CHECK (currency IN ('EUR', 'USD', 'RSD')),
  valid_until DATE,
  full_oprema JSONB NOT NULL DEFAULT '[]',
  status TEXT NOT NULL CHECK (status IN ('primljena', 'u_analizi', 'prihvacena', 'odbijena')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_b2b_ponude_nabavka ON b2b_ponude(nabavka_id, created_at DESC);

CREATE TABLE IF NOT EXISTS b2b_pregovori_istorija (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nabavka_id UUID NOT NULL REFERENCES b2b_nabavke(id) ON DELETE CASCADE,
  kanal TEXT NOT NULL CHECK (kanal IN ('email', 'poziv', 'sastanak', 'kontakt_forma')),
  napomena TEXT NOT NULL,
  sledeci_korak TEXT,
  odgovorna_osoba TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_b2b_pregovori_nabavka ON b2b_pregovori_istorija(nabavka_id, created_at DESC);

CREATE TABLE IF NOT EXISTS b2b_dokumentacija (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nabavka_id UUID NOT NULL REFERENCES b2b_nabavke(id) ON DELETE CASCADE,
  doc_key TEXT NOT NULL,
  naziv TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('nedostaje', 'primljeno', 'verifikovano')),
  required_for_payment BOOLEAN NOT NULL DEFAULT true,
  verified_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (nabavka_id, doc_key)
);

CREATE TABLE IF NOT EXISTS b2b_payment_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nabavka_id UUID NOT NULL REFERENCES b2b_nabavke(id) ON DELETE CASCADE,
  approval_key TEXT NOT NULL,
  naziv TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (nabavka_id, approval_key)
);

CREATE TABLE IF NOT EXISTS b2b_placanja (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nabavka_id UUID UNIQUE NOT NULL REFERENCES b2b_nabavke(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('ceka_odobrenje', 'spremno_za_uplatu', 'uplaceno')),
  source_of_funds TEXT NOT NULL,
  invoice_number TEXT,
  proforma_number TEXT,
  payment_confirmation TEXT,
  paid_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS b2b_delivery_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nabavka_id UUID UNIQUE NOT NULL REFERENCES b2b_nabavke(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('nije_zakazano', 'zakazano', 'u_toku', 'isporuceno', 'preuzeto')),
  delivery_address TEXT NOT NULL,
  delivery_contact TEXT NOT NULL,
  eta TIMESTAMPTZ,
  napomena TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
