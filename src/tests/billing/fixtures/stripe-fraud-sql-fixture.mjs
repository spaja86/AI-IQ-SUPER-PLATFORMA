/* eslint-disable no-restricted-properties -- Disposable local PostgreSQL fixture. */
// Explicit local billing schema fixture; never connects to a remote database.
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
export const user = '00000000-0000-4000-8000-000000000001';
export const identityKeyHash = createHash('sha256').update('b2'.repeat(32)).digest('hex');
export async function initializeFraudFixture(db) {
  await db.exec(`
    CREATE ROLE service_role BYPASSRLS; CREATE ROLE anon; CREATE ROLE authenticated;
    CREATE SCHEMA auth; CREATE TABLE auth.users (id uuid PRIMARY KEY);
    INSERT INTO auth.users VALUES ('${user}');
  `);
  const initial = readFileSync(new URL('../../../../supabase/migrations/001_initial_schema.sql', import.meta.url), 'utf8');
  const profiles = initial.slice(initial.indexOf('CREATE TABLE IF NOT EXISTS public.profiles'), initial.indexOf('-- RLS'));
  await db.exec(profiles);
  // Explicit fixture for pre-existing tables whose CREATE statements are absent from main.
  await db.exec(`
    ALTER TABLE profiles ADD COLUMN billing_locked boolean DEFAULT false,
      ADD COLUMN failed_payment_count integer DEFAULT 0, ADD COLUMN grace_period_expires_at timestamptz,
      ADD COLUMN last_plan_changed_at timestamptz;
    CREATE TABLE stripe_webhook_events(event_id text PRIMARY KEY, event_type text NOT NULL,
      processed_at timestamptz DEFAULT now(), handler_version text DEFAULT 'v2', quarantined boolean DEFAULT false, webhook_latency_ms integer, consistency_latency_ms integer);
    CREATE TABLE financial_audit_log(id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid REFERENCES profiles(id),
      action text NOT NULL, old_plan text, new_plan text, old_status text, new_status text, stripe_event_id text,
      stripe_customer_id text, metadata jsonb, request_id text, payload_hash text, prev_hash text, chain_hash text,
      created_at timestamptz NOT NULL DEFAULT now());
    CREATE TABLE webhook_dead_letter(event_id text, event_type text, payload text, failure_reason text,
      quarantine boolean, quarantine_reason text, occurred_at timestamptz);
    GRANT USAGE ON SCHEMA public TO service_role, authenticated, anon;
    GRANT ALL ON profiles, stripe_webhook_events, financial_audit_log, webhook_dead_letter TO service_role;
    GRANT SELECT, UPDATE ON profiles TO authenticated;
    INSERT INTO profiles(id,email,stripe_customer_id) VALUES('${user}','fixture@example.test','cus_fixture');
  `);
  await db.exec(readFileSync(new URL('../../../../supabase/sql/stripe-p0-atomic.sql', import.meta.url), 'utf8'));
  await db.exec(readFileSync(new URL('../../../../supabase/sql/stripe-checkout-fraud.sql', import.meta.url), 'utf8'));
  // Approved ONLY for this synthetic local fixture with complete seeded history.
  await db.query('UPDATE stripe_checkout_fraud_policy SET enabled=true, history_verified=true, identity_key_hash=$1', [identityKeyHash]);
}
