-- SpajaUltraOmegaCore -∞Ω+∞ — Menjačnica + Poslovni Novčanik Schema
-- Kompanija SPAJA — Digitalna Industrija
--
-- Pokriva:
--   - Asset katalog (kripto + fiat + SPAJA BTC)
--   - Market pair konfiguracije
--   - Order book / trades
--   - Quote snapshots (price feed)
--   - Wallet accounts / ledger (double-entry)
--   - Deposits / withdrawals
--   - AML/risk signali i compliance odluke

-- ═══════════════════════════════════════════════════
-- 1. Asset katalog
-- ═══════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS exchange_assets (
  id            TEXT    PRIMARY KEY,          -- 'BTC', 'ETH', 'SPAJA', 'EUR', 'RSD', ...
  naziv         TEXT    NOT NULL,
  tip           TEXT    NOT NULL CHECK (tip IN ('crypto', 'fiat', 'stablecoin')),
  decimals      INTEGER NOT NULL DEFAULT 8,
  min_order_qty NUMERIC(30,18) NOT NULL DEFAULT 0,
  max_order_qty NUMERIC(30,18),
  mreza         TEXT,                         -- blockchain network za kripto
  ugovor_adresa TEXT,                         -- smart contract adresa ako postoji
  is_spaja_btc  BOOLEAN NOT NULL DEFAULT FALSE,
  enabled       BOOLEAN NOT NULL DEFAULT TRUE,
  metadata      JSONB   NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exchange_assets_tip
  ON exchange_assets (tip, enabled);

-- ═══════════════════════════════════════════════════
-- 2. Market pair konfiguracije
-- ═══════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS exchange_market_pairs (
  id               TEXT PRIMARY KEY,          -- 'BTC_EUR', 'SPAJA_BTC', ...
  base_asset_id    TEXT NOT NULL REFERENCES exchange_assets(id),
  quote_asset_id   TEXT NOT NULL REFERENCES exchange_assets(id),
  min_qty          NUMERIC(30,18) NOT NULL DEFAULT 0,
  max_qty          NUMERIC(30,18),
  price_precision  INTEGER NOT NULL DEFAULT 8,
  qty_precision    INTEGER NOT NULL DEFAULT 8,
  taker_fee_pct    NUMERIC(10,6) NOT NULL DEFAULT 0.002,  -- 0.2%
  maker_fee_pct    NUMERIC(10,6) NOT NULL DEFAULT 0.001,  -- 0.1%
  is_spaja_pair    BOOLEAN NOT NULL DEFAULT FALSE,
  simulation_only  BOOLEAN NOT NULL DEFAULT TRUE,
  enabled          BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (base_asset_id, quote_asset_id)
);

CREATE INDEX IF NOT EXISTS idx_exchange_pairs_enabled
  ON exchange_market_pairs (enabled, simulation_only);

-- ═══════════════════════════════════════════════════
-- 3. Quote snapshots (price feed)
-- ═══════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS exchange_quote_snapshots (
  id             UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  pair_id        TEXT    NOT NULL REFERENCES exchange_market_pairs(id),
  bid            NUMERIC(30,18) NOT NULL,
  ask            NUMERIC(30,18) NOT NULL,
  last           NUMERIC(30,18) NOT NULL,
  volume_24h     NUMERIC(30,18) NOT NULL DEFAULT 0,
  change_pct_24h NUMERIC(10,4),
  source         TEXT    NOT NULL DEFAULT 'simulator',  -- 'simulator' | 'coingecko' | 'binance'
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quote_snapshots_pair_time
  ON exchange_quote_snapshots (pair_id, created_at DESC);

-- ═══════════════════════════════════════════════════
-- 4. Order book
-- ═══════════════════════════════════════════════════

CREATE TYPE IF NOT EXISTS order_side AS ENUM ('buy', 'sell');
CREATE TYPE IF NOT EXISTS order_type AS ENUM ('market', 'limit');
CREATE TYPE IF NOT EXISTS order_status AS ENUM (
  'pending', 'open', 'partially_filled', 'filled', 'cancelled', 'rejected', 'expired'
);

CREATE TABLE IF NOT EXISTS exchange_orders (
  id                UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  idempotency_key   TEXT         UNIQUE,     -- klijentski idempotency key
  user_id           UUID         NOT NULL,   -- references auth.users
  pair_id           TEXT         NOT NULL REFERENCES exchange_market_pairs(id),
  side              order_side   NOT NULL,
  tip               order_type   NOT NULL,
  qty               NUMERIC(30,18) NOT NULL,
  price             NUMERIC(30,18),          -- NULL za market ordere
  filled_qty        NUMERIC(30,18) NOT NULL DEFAULT 0,
  avg_fill_price    NUMERIC(30,18),
  fee_asset_id      TEXT         REFERENCES exchange_assets(id),
  fee_total         NUMERIC(30,18) NOT NULL DEFAULT 0,
  status            order_status NOT NULL DEFAULT 'pending',
  simulation_mode   BOOLEAN      NOT NULL DEFAULT TRUE,
  reject_reason     TEXT,
  aml_score         NUMERIC(5,4),
  risk_flags        JSONB        NOT NULL DEFAULT '[]',
  metadata          JSONB        NOT NULL DEFAULT '{}',
  created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  expires_at        TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_exchange_orders_user
  ON exchange_orders (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_exchange_orders_pair_status
  ON exchange_orders (pair_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_exchange_orders_idempotency
  ON exchange_orders (idempotency_key) WHERE idempotency_key IS NOT NULL;

-- ═══════════════════════════════════════════════════
-- 5. Executed trades (fills)
-- ═══════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS exchange_trades (
  id               UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id         UUID         NOT NULL REFERENCES exchange_orders(id),
  pair_id          TEXT         NOT NULL REFERENCES exchange_market_pairs(id),
  user_id          UUID         NOT NULL,
  side             order_side   NOT NULL,
  qty              NUMERIC(30,18) NOT NULL,
  price            NUMERIC(30,18) NOT NULL,
  fee              NUMERIC(30,18) NOT NULL DEFAULT 0,
  fee_asset_id     TEXT         REFERENCES exchange_assets(id),
  simulation_mode  BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exchange_trades_order
  ON exchange_trades (order_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_exchange_trades_user
  ON exchange_trades (user_id, created_at DESC);

-- ═══════════════════════════════════════════════════
-- 6. Wallet accounts (per user, per asset)
-- ═══════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS novcanik_accounts (
  id              UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID    NOT NULL,
  asset_id        TEXT    NOT NULL REFERENCES exchange_assets(id),
  available       NUMERIC(30,18) NOT NULL DEFAULT 0,
  reserved        NUMERIC(30,18) NOT NULL DEFAULT 0,   -- locked in open orders
  total           NUMERIC(30,18) GENERATED ALWAYS AS (available + reserved) STORED,
  kyc_tier        TEXT    NOT NULL DEFAULT 'basic'
    CHECK (kyc_tier IN ('basic', 'verified', 'enterprise')),
  enabled         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, asset_id)
);

CREATE INDEX IF NOT EXISTS idx_novcanik_accounts_user
  ON novcanik_accounts (user_id, enabled);

-- ═══════════════════════════════════════════════════
-- 7. Wallet ledger (double-entry accounting)
-- ═══════════════════════════════════════════════════

CREATE TYPE IF NOT EXISTS ledger_entry_type AS ENUM (
  'deposit', 'withdrawal', 'trade_debit', 'trade_credit',
  'fee', 'transfer_out', 'transfer_in', 'adjustment'
);

CREATE TABLE IF NOT EXISTS novcanik_ledger (
  id              UUID             PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id      UUID             NOT NULL REFERENCES novcanik_accounts(id),
  user_id         UUID             NOT NULL,
  asset_id        TEXT             NOT NULL REFERENCES exchange_assets(id),
  entry_type      ledger_entry_type NOT NULL,
  amount          NUMERIC(30,18)   NOT NULL,   -- uvek pozitivan
  direction       TEXT             NOT NULL CHECK (direction IN ('credit', 'debit')),
  balance_after   NUMERIC(30,18)   NOT NULL,   -- stanje posle ove stavke
  reference_id    TEXT,                        -- order_id, deposit_id, withdrawal_id, ...
  reference_type  TEXT,                        -- 'order', 'deposit', 'withdrawal', 'transfer'
  idempotency_key TEXT             UNIQUE,
  description     TEXT,
  metadata        JSONB            NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_novcanik_ledger_account
  ON novcanik_ledger (account_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_novcanik_ledger_user
  ON novcanik_ledger (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_novcanik_ledger_idempotency
  ON novcanik_ledger (idempotency_key) WHERE idempotency_key IS NOT NULL;

-- ═══════════════════════════════════════════════════
-- 8. Deposits
-- ═══════════════════════════════════════════════════

CREATE TYPE IF NOT EXISTS deposit_status AS ENUM (
  'pending', 'confirming', 'credited', 'failed', 'rejected'
);

CREATE TABLE IF NOT EXISTS novcanik_deposits (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  idempotency_key TEXT          UNIQUE NOT NULL,
  user_id         UUID          NOT NULL,
  asset_id        TEXT          NOT NULL REFERENCES exchange_assets(id),
  amount          NUMERIC(30,18) NOT NULL,
  status          deposit_status NOT NULL DEFAULT 'pending',
  network         TEXT,                         -- blockchain network za kripto
  tx_hash         TEXT,                         -- blockchain tx hash
  confirmations   INTEGER       NOT NULL DEFAULT 0,
  required_confirmations INTEGER NOT NULL DEFAULT 3,
  source_address  TEXT,
  destination_address TEXT,
  kyc_tier_required TEXT NOT NULL DEFAULT 'basic',
  aml_score       NUMERIC(5,4),
  aml_flags       JSONB         NOT NULL DEFAULT '[]',
  ledger_entry_id UUID          REFERENCES novcanik_ledger(id),
  metadata        JSONB         NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_novcanik_deposits_user
  ON novcanik_deposits (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_novcanik_deposits_status
  ON novcanik_deposits (status, created_at DESC);

-- ═══════════════════════════════════════════════════
-- 9. Withdrawals
-- ═══════════════════════════════════════════════════

CREATE TYPE IF NOT EXISTS withdrawal_status AS ENUM (
  'pending', 'review', 'approved', 'processing', 'completed', 'failed', 'rejected'
);

CREATE TABLE IF NOT EXISTS novcanik_withdrawals (
  id                UUID               PRIMARY KEY DEFAULT gen_random_uuid(),
  idempotency_key   TEXT               UNIQUE NOT NULL,
  user_id           UUID               NOT NULL,
  asset_id          TEXT               NOT NULL REFERENCES exchange_assets(id),
  amount            NUMERIC(30,18)     NOT NULL,
  fee               NUMERIC(30,18)     NOT NULL DEFAULT 0,
  amount_net        NUMERIC(30,18)     GENERATED ALWAYS AS (amount - fee) STORED,
  status            withdrawal_status  NOT NULL DEFAULT 'pending',
  network           TEXT,
  tx_hash           TEXT,
  destination_address TEXT             NOT NULL,
  kyc_tier_required TEXT              NOT NULL DEFAULT 'verified',
  aml_score         NUMERIC(5,4),
  aml_flags         JSONB             NOT NULL DEFAULT '[]',
  review_reason     TEXT,
  approved_by       TEXT,
  ledger_entry_id   UUID              REFERENCES novcanik_ledger(id),
  metadata          JSONB             NOT NULL DEFAULT '{}',
  created_at        TIMESTAMPTZ       NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ       NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_novcanik_withdrawals_user
  ON novcanik_withdrawals (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_novcanik_withdrawals_status
  ON novcanik_withdrawals (status, created_at DESC);

-- ═══════════════════════════════════════════════════
-- 10. AML/risk signals
-- ═══════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS exchange_aml_signals (
  id              UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID    NOT NULL,
  reference_id    TEXT    NOT NULL,   -- order_id, deposit_id, withdrawal_id
  reference_type  TEXT    NOT NULL,   -- 'order', 'deposit', 'withdrawal'
  score           NUMERIC(5,4) NOT NULL,
  flags           JSONB   NOT NULL DEFAULT '[]',
  action          TEXT    NOT NULL CHECK (action IN ('allow', 'review', 'block')),
  reviewed_by     TEXT,
  resolved_at     TIMESTAMPTZ,
  metadata        JSONB   NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_aml_signals_user
  ON exchange_aml_signals (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_aml_signals_action
  ON exchange_aml_signals (action, created_at DESC) WHERE resolved_at IS NULL;

-- ═══════════════════════════════════════════════════
-- 11. Seed: base asset catalog
-- ═══════════════════════════════════════════════════

INSERT INTO exchange_assets (id, naziv, tip, decimals, mreza, is_spaja_btc, enabled) VALUES
  ('BTC',   'Bitcoin',              'crypto',     8,  'bitcoin',       FALSE, TRUE),
  ('ETH',   'Ethereum',             'crypto',     18, 'ethereum',      FALSE, TRUE),
  ('USDT',  'Tether USD',           'stablecoin', 6,  'ethereum',      FALSE, TRUE),
  ('SOL',   'Solana',               'crypto',     9,  'solana',        FALSE, TRUE),
  ('MATIC', 'Polygon',              'crypto',     18, 'polygon',       FALSE, TRUE),
  ('SPAJA', 'SPAJA Bitkoin',        'crypto',     8,  'polygon',       TRUE,  TRUE),
  ('EUR',   'Euro',                 'fiat',        2,  NULL,           FALSE, TRUE),
  ('RSD',   'Srpski dinar',         'fiat',        2,  NULL,           FALSE, TRUE),
  ('USD',   'US Dollar',            'fiat',        2,  NULL,           FALSE, TRUE)
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════════
-- 12. Seed: market pair config
-- ═══════════════════════════════════════════════════

INSERT INTO exchange_market_pairs
  (id, base_asset_id, quote_asset_id, taker_fee_pct, maker_fee_pct, is_spaja_pair, simulation_only, enabled)
VALUES
  ('BTC_USDT',   'BTC',   'USDT',  0.002, 0.001, FALSE, TRUE, TRUE),
  ('ETH_USDT',   'ETH',   'USDT',  0.002, 0.001, FALSE, TRUE, TRUE),
  ('SOL_USDT',   'SOL',   'USDT',  0.002, 0.001, FALSE, TRUE, TRUE),
  ('MATIC_USDT', 'MATIC', 'USDT',  0.002, 0.001, FALSE, TRUE, TRUE),
  ('BTC_EUR',    'BTC',   'EUR',   0.002, 0.001, FALSE, TRUE, TRUE),
  ('ETH_EUR',    'ETH',   'EUR',   0.002, 0.001, FALSE, TRUE, TRUE),
  ('BTC_RSD',    'BTC',   'RSD',   0.002, 0.001, FALSE, TRUE, TRUE),
  ('SPAJA_BTC',  'SPAJA', 'BTC',   0.001, 0.000, TRUE,  TRUE, TRUE),
  ('SPAJA_EUR',  'SPAJA', 'EUR',   0.001, 0.000, TRUE,  TRUE, TRUE),
  ('SPAJA_USDT', 'SPAJA', 'USDT',  0.001, 0.000, TRUE,  TRUE, TRUE)
ON CONFLICT (base_asset_id, quote_asset_id) DO NOTHING;

-- ═══════════════════════════════════════════════════
-- 13. updated_at triggers
-- ═══════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION update_menjacnica_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER exchange_assets_updated_at
  BEFORE UPDATE ON exchange_assets
  FOR EACH ROW EXECUTE FUNCTION update_menjacnica_updated_at();

CREATE OR REPLACE TRIGGER exchange_market_pairs_updated_at
  BEFORE UPDATE ON exchange_market_pairs
  FOR EACH ROW EXECUTE FUNCTION update_menjacnica_updated_at();

CREATE OR REPLACE TRIGGER exchange_orders_updated_at
  BEFORE UPDATE ON exchange_orders
  FOR EACH ROW EXECUTE FUNCTION update_menjacnica_updated_at();

CREATE OR REPLACE TRIGGER novcanik_accounts_updated_at
  BEFORE UPDATE ON novcanik_accounts
  FOR EACH ROW EXECUTE FUNCTION update_menjacnica_updated_at();

CREATE OR REPLACE TRIGGER novcanik_deposits_updated_at
  BEFORE UPDATE ON novcanik_deposits
  FOR EACH ROW EXECUTE FUNCTION update_menjacnica_updated_at();

CREATE OR REPLACE TRIGGER novcanik_withdrawals_updated_at
  BEFORE UPDATE ON novcanik_withdrawals
  FOR EACH ROW EXECUTE FUNCTION update_menjacnica_updated_at();
