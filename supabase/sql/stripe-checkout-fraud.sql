-- REVIEW ONLY. Apply AFTER stripe-p0-atomic.sql in an isolated database first.
-- No production migration or policy approval is implied. Financial tables are never pruned.
BEGIN;
CREATE TABLE public.stripe_checkout_fraud_policy (
  singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton),
  enabled boolean NOT NULL DEFAULT false,
  identity_key_hash text CHECK (identity_key_hash ~ '^[a-f0-9]{64}$'),
  history_verified boolean NOT NULL DEFAULT false
);
INSERT INTO public.stripe_checkout_fraud_policy DEFAULT VALUES;
CREATE TABLE public.stripe_checkout_attempts (
  attempt_id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  proxy_nonce uuid NOT NULL UNIQUE,
  request_hash text NOT NULL CHECK (request_hash ~ '^[a-f0-9]{64}$'),
  ip_hash text NOT NULL CHECK (ip_hash ~ '^[a-f0-9]{64}$'),
  observed_at timestamptz NOT NULL,
  result jsonb NOT NULL
);
CREATE INDEX stripe_checkout_attempts_user_window ON public.stripe_checkout_attempts(user_id, observed_at);
CREATE INDEX stripe_checkout_attempts_ip_window ON public.stripe_checkout_attempts(ip_hash, observed_at);
CREATE INDEX stripe_checkout_attempts_retention ON public.stripe_checkout_attempts(observed_at);
CREATE INDEX stripe_billing_effects_user_event ON public.stripe_billing_effects(user_id, event_id);
ALTER TABLE public.stripe_checkout_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_checkout_fraud_policy ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.stripe_checkout_attempts, public.stripe_checkout_fraud_policy FROM PUBLIC, anon, authenticated, service_role;
GRANT SELECT, INSERT, DELETE ON public.stripe_checkout_attempts TO service_role;
GRANT SELECT ON public.stripe_checkout_fraud_policy TO service_role;
CREATE POLICY checkout_attempts_service ON public.stripe_checkout_attempts TO service_role USING (true) WITH CHECK (true);
CREATE POLICY checkout_policy_service ON public.stripe_checkout_fraud_policy FOR SELECT TO service_role USING (true);

CREATE FUNCTION public.record_stripe_checkout_attempt(p_attempt_id uuid, p_user_id uuid,
  p_proxy_nonce uuid, p_issued_at bigint, p_request_hash text, p_ip_hash text, p_identity_key_hash text)
RETURNS jsonb LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE
  prior public.stripe_checkout_attempts%ROWTYPE;
  policy public.stripe_checkout_fraud_policy%ROWTYPE;
  profile public.profiles%ROWTYPE;
  observed timestamptz;
  attempts integer; ips integer; ip_attempts integer; failures integer;
  is_new boolean; score integer := 0; decision text; outcome jsonb;
BEGIN
  IF current_user <> 'service_role' THEN RAISE EXCEPTION 'service role required' USING ERRCODE = '42501'; END IF;
  IF p_attempt_id IS NULL OR p_user_id IS NULL OR p_proxy_nonce IS NULL OR p_issued_at IS NULL
    OR coalesce(p_request_hash,'') !~ '^[a-f0-9]{64}$' OR coalesce(p_ip_hash,'') !~ '^[a-f0-9]{64}$'
    OR coalesce(p_identity_key_hash,'') !~ '^[a-f0-9]{64}$' THEN RAISE EXCEPTION 'invalid admission input'; END IF;
  IF current_setting('transaction_isolation') <> 'read committed' THEN
    RAISE EXCEPTION 'admission requires read committed isolation';
  END IF;
  -- Same ordering as the existing financial transaction: global lock, then profile.
  -- Time is sampled AFTER waiting: a stale queued request never receives a fresh window.
  PERFORM pg_catalog.pg_advisory_xact_lock(1372, 1);
  observed := clock_timestamp();
  IF p_issued_at < extract(epoch FROM observed) - 60 OR p_issued_at > extract(epoch FROM observed) + 10 THEN
    RAISE EXCEPTION 'expired source attestation';
  END IF;
  SELECT * INTO STRICT policy FROM public.stripe_checkout_fraud_policy WHERE singleton;
  IF NOT policy.enabled OR NOT policy.history_verified OR policy.identity_key_hash IS DISTINCT FROM p_identity_key_hash THEN
    RAISE EXCEPTION 'admission policy not ready';
  END IF;
  SELECT * INTO prior FROM public.stripe_checkout_attempts WHERE attempt_id = p_attempt_id;
  IF FOUND THEN
    IF prior.user_id <> p_user_id OR prior.proxy_nonce <> p_proxy_nonce OR prior.request_hash <> p_request_hash OR prior.ip_hash <> p_ip_hash THEN
      RAISE EXCEPTION 'attempt conflict';
    END IF;
    RETURN prior.result; -- Lost RPC response, NOT a fresh HTTP attempt.
  END IF;
  IF EXISTS (SELECT 1 FROM public.stripe_checkout_attempts WHERE proxy_nonce = p_proxy_nonce) THEN
    RAISE EXCEPTION 'source attestation replay';
  END IF;
  SELECT * INTO STRICT profile FROM public.profiles WHERE id = p_user_id FOR UPDATE;
  IF profile.created_at IS NULL OR profile.created_at > observed THEN RAISE EXCEPTION 'invalid account age'; END IF;
  SELECT count(*)::integer + 1 INTO attempts FROM public.stripe_checkout_attempts
    WHERE user_id = p_user_id AND observed_at > observed - interval '1 hour' AND observed_at <= observed;
  SELECT count(DISTINCT ip_hash)::integer INTO ips FROM (
    SELECT ip_hash FROM public.stripe_checkout_attempts WHERE user_id = p_user_id
      AND observed_at > observed - interval '24 hours' AND observed_at <= observed
    UNION ALL SELECT p_ip_hash
  ) sources;
  SELECT count(*)::integer + 1 INTO ip_attempts FROM public.stripe_checkout_attempts
    WHERE ip_hash = p_ip_hash AND observed_at > observed - interval '1 hour' AND observed_at <= observed;
  -- Use already committed business effects, not lifetime profile counters or raw receipts.
  -- Different deliveries of the same invoice attempt have only one effect row.
  SELECT count(*)::integer INTO failures FROM public.stripe_billing_effects e
    JOIN public.stripe_billing_commits c ON c.event_id = e.event_id
    WHERE e.user_id = p_user_id AND c.event_type = 'invoice.payment_failed'
      AND c.result->>'applied' = 'true' AND e.effect_key LIKE 'invoice-failure:%'
      AND c.event_created > extract(epoch FROM observed - interval '30 days')
      AND c.event_created <= extract(epoch FROM observed);
  is_new := profile.created_at > observed - interval '7 days';
  score := (CASE WHEN attempts >= 10 THEN 40 WHEN attempts >= 5 THEN 20 ELSE 0 END)
    + (CASE WHEN failures >= 5 THEN 35 WHEN failures >= 3 THEN 15 ELSE 0 END)
    + (CASE WHEN ips >= 5 THEN 25 ELSE 0 END)
    + (CASE WHEN is_new AND attempts >= 3 THEN 15 ELSE 0 END);
  decision := CASE WHEN coalesce(profile.billing_locked,false) THEN 'billing_locked'
    WHEN score >= 60 THEN 'fraud' WHEN attempts > 5 THEN 'rate_user'
    WHEN ip_attempts > 20 THEN 'rate_ip' ELSE 'allow' END;
  outcome := jsonb_build_object('committed',true,'attemptId',p_attempt_id,
    'checkoutAttemptsLastHour',attempts,'distinctIpsLast24h',ips,'ipAttemptsLastHour',ip_attempts,
    'failedPaymentsLast30Days',failures,'isNewAccount',is_new,'billingLocked',coalesce(profile.billing_locked,false),
    'score',least(score,100),'decision',decision);
  -- Count DENIED attempts too. No raw IP, token, body, idempotency key or trace header is stored.
  INSERT INTO public.stripe_checkout_attempts VALUES(p_attempt_id,p_user_id,p_proxy_nonce,p_request_hash,p_ip_hash,observed,outcome);
  RETURN outcome;
END $$;
REVOKE ALL ON FUNCTION public.record_stripe_checkout_attempt(uuid,uuid,uuid,bigint,text,text,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.record_stripe_checkout_attempt(uuid,uuid,uuid,bigint,text,text,text) TO service_role;

-- Invoke hourly from an approved maintenance worker, repeat until fewer than 1000 deleted.
-- 25h retention preserves the full rolling 24h horizon; inactive accounts also get cleaned.
CREATE FUNCTION public.prune_stripe_checkout_attempts() RETURNS integer
LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE removed integer;
BEGIN
  IF current_user <> 'service_role' THEN RAISE EXCEPTION 'service role required' USING ERRCODE = '42501'; END IF;
  PERFORM pg_catalog.pg_advisory_xact_lock(1372, 1);
  DELETE FROM public.stripe_checkout_attempts WHERE attempt_id IN
    (SELECT attempt_id FROM public.stripe_checkout_attempts
      WHERE observed_at <= clock_timestamp() - interval '25 hours' ORDER BY observed_at LIMIT 1000);
  GET DIAGNOSTICS removed = ROW_COUNT;
  RETURN removed;
END $$;
REVOKE ALL ON FUNCTION public.prune_stripe_checkout_attempts() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.prune_stripe_checkout_attempts() TO service_role;
COMMIT;
