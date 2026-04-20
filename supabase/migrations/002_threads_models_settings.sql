-- SpajaUltraOmegaCore -∞Ω+∞ — Migracija: Threadovi, Modeli, Custom Instructions
-- Kompanija SPAJA — Digitalna Industrija
-- Dodaje podršku za organizaciju razgovora, izbor modela i personalizaciju

-- ═══════════════════════════════════════════════════
-- 1. Proširi profiles tabelu sa custom instructions i memorijom
-- ═══════════════════════════════════════════════════

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS custom_instructions TEXT,
  ADD COLUMN IF NOT EXISTS preferred_model TEXT DEFAULT 'gpt-4o-mini',
  ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'sr',
  ADD COLUMN IF NOT EXISTS memory TEXT;

-- ═══════════════════════════════════════════════════
-- 2. Chat Threads — organizacija razgovora
-- ═══════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.chat_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Nova konverzacija',
  model TEXT NOT NULL DEFAULT 'gpt-4o-mini',
  is_shared BOOLEAN NOT NULL DEFAULT FALSE,
  share_id TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.chat_threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own threads"
  ON public.chat_threads FOR SELECT
  USING (auth.uid() = user_id OR is_shared = TRUE);

CREATE POLICY "Users can insert own threads"
  ON public.chat_threads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own threads"
  ON public.chat_threads FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own threads"
  ON public.chat_threads FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Service role full access on threads"
  ON public.chat_threads FOR ALL
  USING (auth.role() = 'service_role');

CREATE INDEX idx_chat_threads_user_id ON public.chat_threads(user_id);
CREATE INDEX idx_chat_threads_updated_at ON public.chat_threads(updated_at DESC);
CREATE INDEX idx_chat_threads_share_id ON public.chat_threads(share_id) WHERE share_id IS NOT NULL;

-- Trigger za updated_at na threadovima
CREATE OR REPLACE TRIGGER chat_threads_updated_at
  BEFORE UPDATE ON public.chat_threads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- ═══════════════════════════════════════════════════
-- 3. Proširi chat_history tabelu sa thread_id i model
-- ═══════════════════════════════════════════════════

ALTER TABLE public.chat_history
  ADD COLUMN IF NOT EXISTS thread_id UUID REFERENCES public.chat_threads(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS model TEXT;

-- Dozvoli 'system' kao role (pored 'user' i 'assistant')
ALTER TABLE public.chat_history DROP CONSTRAINT IF EXISTS chat_history_role_check;
ALTER TABLE public.chat_history ADD CONSTRAINT chat_history_role_check
  CHECK (role IN ('user', 'assistant', 'system'));

CREATE INDEX IF NOT EXISTS idx_chat_history_thread_id ON public.chat_history(thread_id);

-- Service role full access na chat_history (za API rute)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'chat_history' AND policyname = 'Service role full access on chat_history'
  ) THEN
    CREATE POLICY "Service role full access on chat_history"
      ON public.chat_history FOR ALL
      USING (auth.role() = 'service_role');
  END IF;
END
$$;

-- Dozvoli brisanje sopstvenih poruka
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'chat_history' AND policyname = 'Users can delete own chat messages'
  ) THEN
    CREATE POLICY "Users can delete own chat messages"
      ON public.chat_history FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
END
$$;

-- Service role full access na usage_logs
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'usage_logs' AND policyname = 'Service role full access on usage_logs'
  ) THEN
    CREATE POLICY "Service role full access on usage_logs"
      ON public.usage_logs FOR ALL
      USING (auth.role() = 'service_role');
  END IF;
END
$$;
