-- SpajaUltraOmegaCore -∞Ω+∞ — Inicijalna Sema Baze
-- Kompanija SPAJA — Digitalna Industrija
-- PostgreSQL (Supabase) sema za korisnike, pretplate i chat

-- ═══════════════════════════════════════════════════
-- 1. Korisnicki profili (extends Supabase auth.users)
-- ═══════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  plan TEXT NOT NULL DEFAULT 'starter'
    CHECK (plan IN ('starter', 'basic', 'pro', 'enterprise', 'unlimited')),
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  subscription_status TEXT DEFAULT 'inactive'
    CHECK (subscription_status IN ('active', 'inactive', 'past_due', 'canceled', 'trialing')),
  chat_messages_used INTEGER NOT NULL DEFAULT 0,
  chat_messages_limit INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Korisnik moze citati samo svoj profil
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Korisnik moze azurirati samo svoj profil (osim plan i stripe polja)
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Service role moze sve (za webhook-ove)
CREATE POLICY "Service role full access"
  ON public.profiles FOR ALL
  USING (auth.role() = 'service_role');

-- ═══════════════════════════════════════════════════
-- 2. Chat istorija (SpajaPro AI razgovori)
-- ═══════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  tokens_used INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own chat history"
  ON public.chat_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat messages"
  ON public.chat_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_chat_history_user_id ON public.chat_history(user_id);
CREATE INDEX idx_chat_history_created_at ON public.chat_history(created_at DESC);

-- ═══════════════════════════════════════════════════
-- 3. Usage logs (pracenje koriscenja)
-- ═══════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  tokens_used INTEGER NOT NULL DEFAULT 0,
  cost_eur NUMERIC(10,6) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own usage logs"
  ON public.usage_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE INDEX idx_usage_logs_user_id ON public.usage_logs(user_id);
CREATE INDEX idx_usage_logs_created_at ON public.usage_logs(created_at DESC);

-- ═══════════════════════════════════════════════════
-- 4. Trigger: automatski kreiraj profil pri registraciji
-- ═══════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ═══════════════════════════════════════════════════
-- 5. Trigger: updated_at automatski
-- ═══════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();
