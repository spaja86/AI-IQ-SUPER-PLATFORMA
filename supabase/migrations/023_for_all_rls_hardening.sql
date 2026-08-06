-- Migration: 023_for_all_rls_hardening.sql
-- AI IQ SUPER PLATFORMA — FOR ALL RLS hardening
-- Purpose:
--   1) Enforce explicit role boundaries with USING + WITH CHECK for service-role FOR ALL policies
--   2) Split user-scoped FOR ALL policies into operation-specific policies for least privilege clarity

-- ────────────────────────────────────────────────────────────────────────────────
-- Wave 1: Service-role FOR ALL policy hardening
-- ────────────────────────────────────────────────────────────────────────────────

-- profiles
DROP POLICY IF EXISTS "Service role full access" ON public.profiles;
CREATE POLICY "Service role full access"
  ON public.profiles FOR ALL
  TO service_role
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- chat
DROP POLICY IF EXISTS "Service role full access on threads" ON public.chat_threads;
CREATE POLICY "Service role full access on threads"
  ON public.chat_threads FOR ALL
  TO service_role
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access on chat_history" ON public.chat_history;
CREATE POLICY "Service role full access on chat_history"
  ON public.chat_history FOR ALL
  TO service_role
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access on usage_logs" ON public.usage_logs;
CREATE POLICY "Service role full access on usage_logs"
  ON public.usage_logs FOR ALL
  TO service_role
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- knowledge ingestion/retrieval
DROP POLICY IF EXISTS "Service role full access on knowledge_sources" ON public.knowledge_sources;
CREATE POLICY "Service role full access on knowledge_sources"
  ON public.knowledge_sources FOR ALL
  TO service_role
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access on knowledge_documents" ON public.knowledge_documents;
CREATE POLICY "Service role full access on knowledge_documents"
  ON public.knowledge_documents FOR ALL
  TO service_role
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access on knowledge_chunks" ON public.knowledge_chunks;
CREATE POLICY "Service role full access on knowledge_chunks"
  ON public.knowledge_chunks FOR ALL
  TO service_role
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access on knowledge_crawl_jobs" ON public.knowledge_crawl_jobs;
CREATE POLICY "Service role full access on knowledge_crawl_jobs"
  ON public.knowledge_crawl_jobs FOR ALL
  TO service_role
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access on knowledge_dead_letters" ON public.knowledge_dead_letters;
CREATE POLICY "Service role full access on knowledge_dead_letters"
  ON public.knowledge_dead_letters FOR ALL
  TO service_role
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access on knowledge_citations" ON public.knowledge_citations;
CREATE POLICY "Service role full access on knowledge_citations"
  ON public.knowledge_citations FOR ALL
  TO service_role
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access on knowledge_retrieval_metrics" ON public.knowledge_retrieval_metrics;
CREATE POLICY "Service role full access on knowledge_retrieval_metrics"
  ON public.knowledge_retrieval_metrics FOR ALL
  TO service_role
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access on knowledge_index_jobs" ON public.knowledge_index_jobs;
CREATE POLICY "Service role full access on knowledge_index_jobs"
  ON public.knowledge_index_jobs FOR ALL
  TO service_role
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- evolution/audit support
DROP POLICY IF EXISTS "Service role full access on evolution_cycles" ON public.evolution_cycles;
CREATE POLICY "Service role full access on evolution_cycles"
  ON public.evolution_cycles FOR ALL
  TO service_role
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access on evolution_recommendations" ON public.evolution_recommendations;
CREATE POLICY "Service role full access on evolution_recommendations"
  ON public.evolution_recommendations FOR ALL
  TO service_role
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access on health_snapshots" ON public.health_snapshots;
CREATE POLICY "Service role full access on health_snapshots"
  ON public.health_snapshots FOR ALL
  TO service_role
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ────────────────────────────────────────────────────────────────────────────────
-- Wave 2: Split user-scoped FOR ALL policies (DEPON multi-tenant surfaces)
-- ────────────────────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "users_own_data" ON public.platform_users;
CREATE POLICY "users_own_data_select" ON public.platform_users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);
CREATE POLICY "users_own_data_insert" ON public.platform_users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "users_own_data_update" ON public.platform_users
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id::text)
  WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "users_own_data_delete" ON public.platform_users
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "users_own_sessions" ON public.platform_sessions;
CREATE POLICY "users_own_sessions_select" ON public.platform_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);
CREATE POLICY "users_own_sessions_insert" ON public.platform_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "users_own_sessions_update" ON public.platform_sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id::text)
  WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "users_own_sessions_delete" ON public.platform_sessions
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "users_own_payments" ON public.platform_payments;
CREATE POLICY "users_own_payments_select" ON public.platform_payments
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);
CREATE POLICY "users_own_payments_insert" ON public.platform_payments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "users_own_payments_update" ON public.platform_payments
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id::text)
  WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "users_own_payments_delete" ON public.platform_payments
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id::text);

