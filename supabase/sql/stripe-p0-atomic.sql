-- REVIEW-ONLY schema proposal. Apply in an isolated database before deployment.
-- Requires profiles + financial_audit_log + stripe_webhook_events + webhook_dead_letter.
-- No SECURITY DEFINER: only service_role may execute the transaction.
BEGIN;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS billing_revision bigint NOT NULL DEFAULT 0;
-- The old constraint excluded Stripe states already emitted by the existing handler.
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_subscription_status_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_subscription_status_check CHECK
  (subscription_status IN ('inactive','active','trialing','past_due','canceled','incomplete','incomplete_expired','unpaid','paused','grace_period'));

CREATE TABLE public.stripe_billing_commits (
  event_id text PRIMARY KEY, event_type text NOT NULL, object_id text NOT NULL,
  customer_id text, subscription_id text, event_created bigint NOT NULL,
  payload_hash text NOT NULL, result jsonb NOT NULL,
  processed_at timestamptz NOT NULL DEFAULT clock_timestamp()
);
CREATE INDEX stripe_billing_commits_subscription_order ON public.stripe_billing_commits (subscription_id, event_created DESC);
CREATE TABLE public.stripe_billing_effects (
  effect_key text PRIMARY KEY, event_id text NOT NULL REFERENCES public.stripe_billing_commits(event_id),
  user_id uuid NOT NULL REFERENCES public.profiles(id)
);
ALTER TABLE public.stripe_billing_commits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_billing_effects ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.stripe_billing_commits, public.stripe_billing_effects FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT ON public.stripe_billing_commits, public.stripe_billing_effects TO service_role;
CREATE POLICY billing_commits_service ON public.stripe_billing_commits TO service_role USING (true) WITH CHECK (true);
CREATE POLICY billing_effects_service ON public.stripe_billing_effects TO service_role USING (true) WITH CHECK (true);
-- The initial schema's broad self-update policy otherwise lets a user grant a paid plan directly.
REVOKE UPDATE ON public.profiles FROM anon, authenticated;
REVOKE UPDATE (plan, stripe_customer_id, stripe_subscription_id, subscription_status,
  chat_messages_used, chat_messages_limit, billing_locked, failed_payment_count,
  grace_period_expires_at, last_plan_changed_at, billing_revision) ON public.profiles FROM anon, authenticated;
-- Preserve existing non-financial profile/preferences editing when those columns exist.
DO $$ DECLARE col text; BEGIN
  FOR col IN SELECT column_name FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name IN
    ('full_name','custom_instructions','preferred_model','preferred_language','memory',
     'stable_preferences','contextual_preferences','personalization_enabled','personalization_opt_out',
     'adaptive_preferences','personalization_feedback')
  LOOP EXECUTE format('GRANT UPDATE (%I) ON public.profiles TO authenticated', col); END LOOP;
END $$;

CREATE FUNCTION public.commit_stripe_billing_event(p_event jsonb, p_user_id uuid,
  p_expected_revision bigint, p_patch jsonb, p_audit jsonb) RETURNS jsonb
LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE
  prior public.stripe_billing_commits%ROWTYPE;
  profile public.profiles%ROWTYPE;
  prev_hash text;
  prev_created timestamptz;
  last_created bigint;
  applied boolean := false;
  duplicate_effect boolean := false;
  stale boolean := false;
  outcome jsonb;
BEGIN
  IF current_user <> 'service_role' THEN RAISE EXCEPTION 'service role required' USING ERRCODE = '42501'; END IF;
  IF coalesce(p_event->>'id','') = '' OR coalesce(p_event->>'object_id','') = ''
    OR coalesce(p_event->>'payload_hash','') !~ '^[a-f0-9]{64}$' THEN
    RAISE EXCEPTION 'invalid billing event';
  END IF;
  -- Serialize financial state + audit chain. No lease can expire mid-transaction.
  PERFORM pg_catalog.pg_advisory_xact_lock(1372, 1);
  SELECT * INTO prior FROM public.stripe_billing_commits WHERE event_id = p_event->>'id';
  IF FOUND THEN
    IF prior.payload_hash <> p_event->>'payload_hash' THEN RAISE EXCEPTION 'event payload conflict'; END IF;
    RETURN prior.result || jsonb_build_object('duplicate', true, 'applied', false);
  END IF;
  -- Old rows did not prove completion: never silently trust them as successful.
  IF EXISTS (SELECT 1 FROM public.stripe_webhook_events WHERE event_id = p_event->>'id') THEN
    RAISE EXCEPTION 'legacy event needs reconciliation';
  END IF;
  IF p_user_id IS NOT NULL THEN
    SELECT * INTO STRICT profile FROM public.profiles WHERE id = p_user_id FOR UPDATE;
    IF profile.stripe_customer_id IS DISTINCT FROM p_event->>'customer_id' THEN RAISE EXCEPTION 'customer mismatch'; END IF;
    IF profile.stripe_subscription_id IS NOT NULL AND profile.stripe_subscription_id IS DISTINCT FROM p_event->>'subscription_id' THEN
      RAISE EXCEPTION 'subscription mismatch';
    END IF;
    SELECT EXISTS (SELECT 1 FROM public.stripe_billing_effects WHERE effect_key = p_event->>'effect_key') INTO duplicate_effect;
    SELECT max(event_created) INTO last_created FROM public.stripe_billing_commits
      WHERE subscription_id = p_event->>'subscription_id' AND result->>'applied' = 'true';
    stale := last_created IS NOT NULL AND (p_event->>'created')::bigint < last_created;
    IF NOT duplicate_effect AND NOT stale AND p_patch <> '{}'::jsonb THEN
      IF profile.billing_revision <> p_expected_revision THEN RAISE EXCEPTION 'billing revision conflict' USING ERRCODE = '40001'; END IF;
      IF EXISTS (SELECT 1 FROM jsonb_object_keys(p_patch) AS k(key) WHERE key NOT IN
        ('plan','stripe_subscription_id','subscription_status','chat_messages_limit','chat_messages_used',
         'last_plan_changed_at','failed_payment_count','billing_locked','grace_period_expires_at')) THEN
        RAISE EXCEPTION 'unsupported billing field';
      END IF;
      UPDATE public.profiles SET
        plan = CASE WHEN p_patch ? 'plan' THEN p_patch->>'plan' ELSE plan END,
        stripe_subscription_id = CASE WHEN p_patch ? 'stripe_subscription_id' THEN p_patch->>'stripe_subscription_id' ELSE stripe_subscription_id END,
        subscription_status = CASE WHEN p_patch ? 'subscription_status' THEN p_patch->>'subscription_status' ELSE subscription_status END,
        chat_messages_limit = CASE WHEN p_patch ? 'chat_messages_limit' THEN (p_patch->>'chat_messages_limit')::integer ELSE chat_messages_limit END,
        chat_messages_used = CASE WHEN p_patch ? 'chat_messages_used' THEN (p_patch->>'chat_messages_used')::integer ELSE chat_messages_used END,
        failed_payment_count = CASE WHEN p_patch ? 'failed_payment_count' THEN (p_patch->>'failed_payment_count')::integer ELSE failed_payment_count END,
        billing_locked = CASE WHEN p_patch ? 'billing_locked' THEN (p_patch->>'billing_locked')::boolean ELSE billing_locked END,
        last_plan_changed_at = CASE WHEN p_patch ? 'last_plan_changed_at' THEN (p_patch->>'last_plan_changed_at')::timestamptz ELSE last_plan_changed_at END,
        grace_period_expires_at = CASE WHEN p_patch ? 'grace_period_expires_at' THEN (p_patch->>'grace_period_expires_at')::timestamptz ELSE grace_period_expires_at END,
        billing_revision = billing_revision + 1
      WHERE id = p_user_id;
      applied := true;
    END IF;
  ELSIF p_patch <> '{}'::jsonb THEN RAISE EXCEPTION 'billing patch without user';
  END IF;
  outcome := jsonb_build_object('committed',true,'applied',applied,'duplicate_effect',duplicate_effect,
    'out_of_order',stale,'quarantined',p_event->>'quarantine_reason' IS NOT NULL);
  INSERT INTO public.stripe_billing_commits(event_id,event_type,object_id,customer_id,subscription_id,event_created,payload_hash,result)
    VALUES(p_event->>'id',p_event->>'type',p_event->>'object_id',p_event->>'customer_id',p_event->>'subscription_id',
      (p_event->>'created')::bigint,p_event->>'payload_hash',outcome);
  IF applied AND p_event->>'effect_key' IS NOT NULL THEN
    INSERT INTO public.stripe_billing_effects VALUES(p_event->>'effect_key',p_event->>'id',p_user_id);
  END IF;
  IF p_event->>'quarantine_reason' IS NOT NULL THEN
    INSERT INTO public.webhook_dead_letter(event_id,event_type,payload,failure_reason,quarantine,quarantine_reason,occurred_at)
      VALUES(p_event->>'id',p_event->>'type',p_event->>'payload',p_event->>'quarantine_reason',true,p_event->>'quarantine_reason',clock_timestamp());
  END IF;
  IF applied THEN
    SELECT chain_hash, created_at INTO prev_hash, prev_created FROM public.financial_audit_log ORDER BY created_at DESC, id DESC LIMIT 1;
    IF prev_hash IS DISTINCT FROM p_audit->>'prev_hash' OR (p_audit->>'created_at')::timestamptz <= prev_created THEN RAISE EXCEPTION 'audit chain conflict' USING ERRCODE = '40001'; END IF;
    INSERT INTO public.financial_audit_log(user_id,action,old_plan,new_plan,old_status,new_status,stripe_event_id,stripe_customer_id,
      metadata,request_id,payload_hash,prev_hash,chain_hash,created_at)
      VALUES(p_user_id,p_audit->>'action',p_audit->>'old_plan',p_audit->>'new_plan',p_audit->>'old_status',p_audit->>'new_status',
        p_event->>'id',p_event->>'customer_id',p_audit->'metadata',p_audit->>'request_id',p_audit->>'payload_hash',
        p_audit->>'prev_hash',p_audit->>'chain_hash',(p_audit->>'created_at')::timestamptz);
  END IF;
  INSERT INTO public.stripe_webhook_events(event_id,event_type,handler_version,quarantined,webhook_latency_ms,consistency_latency_ms)
    VALUES(p_event->>'id',p_event->>'type','v3',p_event->>'quarantine_reason' IS NOT NULL,
      least(2147483647, greatest(0, extract(epoch FROM clock_timestamp()) * 1000 - (p_event->>'created')::bigint * 1000))::integer,
      CASE WHEN applied THEN least(2147483647, greatest(0, extract(epoch FROM clock_timestamp()) * 1000 - (p_event->>'created')::bigint * 1000))::integer END);
  RETURN outcome;
END $$;
REVOKE ALL ON FUNCTION public.commit_stripe_billing_event(jsonb,uuid,bigint,jsonb,jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.commit_stripe_billing_event(jsonb,uuid,bigint,jsonb,jsonb) TO service_role;
COMMIT;
