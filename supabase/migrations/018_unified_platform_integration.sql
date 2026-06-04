-- Unified cross-platform integration schema

CREATE TABLE IF NOT EXISTS world_bank_accounts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  account_number TEXT UNIQUE NOT NULL,
  balance DECIMAL(18,8) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  blockchain_address TEXT
);

CREATE TABLE IF NOT EXISTS world_bank_transactions (
  id UUID PRIMARY KEY,
  from_account_id UUID REFERENCES world_bank_accounts(id),
  to_account_id UUID REFERENCES world_bank_accounts(id),
  amount DECIMAL(18,8) NOT NULL,
  status TEXT NOT NULL,
  tx_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS menja_nica_wallets (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  cryptocurrency TEXT NOT NULL,
  balance DECIMAL(36,18) NOT NULL DEFAULT 0,
  wallet_address TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS menja_nica_trades (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  from_currency TEXT NOT NULL,
  to_currency TEXT NOT NULL,
  from_amount DECIMAL(36,18) NOT NULL,
  to_amount DECIMAL(36,18) NOT NULL,
  status TEXT NOT NULL,
  tx_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS io_openui_user_sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  session_token TEXT NOT NULL,
  platform_token TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS platform_sync_log (
  id UUID PRIMARY KEY,
  platform_from TEXT NOT NULL,
  platform_to TEXT,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_world_bank_accounts_user_id ON world_bank_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_world_bank_transactions_from_account_id ON world_bank_transactions(from_account_id);
CREATE INDEX IF NOT EXISTS idx_world_bank_transactions_to_account_id ON world_bank_transactions(to_account_id);
CREATE INDEX IF NOT EXISTS idx_menja_nica_wallets_user_id ON menja_nica_wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_menja_nica_trades_user_id ON menja_nica_trades(user_id);
CREATE INDEX IF NOT EXISTS idx_io_openui_user_sessions_user_id ON io_openui_user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_io_openui_user_sessions_expires_at ON io_openui_user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_io_openui_user_sessions_session_token ON io_openui_user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_io_openui_user_sessions_platform_token ON io_openui_user_sessions(platform_token);
CREATE INDEX IF NOT EXISTS idx_platform_sync_log_platform_from ON platform_sync_log(platform_from);
CREATE INDEX IF NOT EXISTS idx_platform_sync_log_event_type ON platform_sync_log(event_type);
