/* eslint-disable no-restricted-properties -- Isolated PostgreSQL regression, no remote database. */
// Real PostgreSQL execution via PGlite, without network or production credentials.
// PGLITE_MODULE is an explicit path to the pinned isolated test installation.
import assert from 'node:assert/strict';
import { test, before, after } from 'node:test';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
const { PGlite } = await import(process.env.PGLITE_MODULE
  ? pathToFileURL(process.env.PGLITE_MODULE).href : '@electric-sql/pglite');
let db;
const user = '00000000-0000-4000-8000-000000000001';
before(async () => {
  db = new PGlite();
  await db.exec(`
    CREATE ROLE service_role BYPASSRLS; CREATE ROLE anon; CREATE ROLE authenticated;
    CREATE SCHEMA auth; CREATE TABLE auth.users (id uuid PRIMARY KEY);
    INSERT INTO auth.users VALUES ('${user}');
  `);
  const initial = readFileSync(new URL('../../../supabase/migrations/001_initial_schema.sql', import.meta.url), 'utf8');
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
  await db.exec(readFileSync(new URL('../../../supabase/sql/stripe-p0-atomic.sql', import.meta.url), 'utf8'));
});
after(async () => { await db?.close(); });
let sequence = 0;
async function args(overrides = {}) {
  const p = (await db.query('SELECT * FROM profiles')).rows[0];
  const audit = (await db.query('SELECT chain_hash,created_at FROM financial_audit_log ORDER BY created_at DESC,id DESC LIMIT 1')).rows[0];
  const n = ++sequence;
  return {
    p_event: { id: `evt_${n}`, type: 'checkout.session.completed', created: 1000 + n, object_id: `cs_${n}`,
      payload_hash: 'a'.repeat(64), customer_id: 'cus_fixture', subscription_id: 'sub_fixture', effect_key: `activation:${n}` },
    p_user_id: user, p_expected_revision: Number(p.billing_revision),
    p_patch: { plan: 'basic', stripe_subscription_id: 'sub_fixture', subscription_status: 'active', chat_messages_limit: 100, chat_messages_used: 0 },
    p_audit: { action: 'subscription.activated', old_plan: p.plan, new_plan: 'basic', old_status: p.subscription_status,
      new_status: 'active', metadata: {}, payload_hash: 'b'.repeat(64), prev_hash: audit?.chain_hash ?? null,
      chain_hash: `chain_${n}`, created_at: new Date(Date.now() + n).toISOString() },
    ...overrides,
  };
}
async function commit(a, role = 'service_role') {
  await db.exec(`SET ROLE ${role}`);
  try {
    return (await db.query('SELECT public.commit_stripe_billing_event($1,$2,$3,$4,$5) AS result',
      [a.p_event, a.p_user_id, a.p_expected_revision, a.p_patch, a.p_audit])).rows[0].result;
  } finally { await db.exec('RESET ROLE'); }
}
async function snapshot() {
  return (await db.query(`SELECT (SELECT row_to_json(p) FROM profiles p) AS profile,
    (SELECT count(*)::int FROM stripe_billing_commits) AS commits,
    (SELECT count(*)::int FROM stripe_billing_effects) AS effects,
    (SELECT count(*)::int FROM financial_audit_log) AS audits,
    (SELECT count(*)::int FROM stripe_webhook_events) AS events`)).rows[0];
}
test('transaction commits profile, audit, effect and completion together', async () => {
  const result = await commit(await args()); assert.equal(result.applied, true);
  const s = await snapshot(); assert.equal(s.profile.plan, 'basic');
  assert.deepEqual([s.commits,s.effects,s.audits,s.events],[1,1,1,1]);
});
test('completed event replay is a no-op; changed payload is rejected', async () => {
  const a = await args(); await commit(a); const before = await snapshot();
  assert.equal((await commit(a)).duplicate, true); assert.deepEqual(await snapshot(), before);
  a.p_event.payload_hash = 'c'.repeat(64);
  await assert.rejects(commit(a), /payload conflict/); assert.deepEqual(await snapshot(), before);
});
test('different event for same business effect preserves usage', async () => {
  const a = await args(); await commit(a); await db.exec('UPDATE profiles SET chat_messages_used = 17');
  const b = await args(); b.p_event.effect_key = a.p_event.effect_key;
  assert.equal((await commit(b)).duplicate_effect, true);
  assert.equal((await snapshot()).profile.chat_messages_used, 17);
});
test('audit failure rolls back profile and event; redelivery succeeds after recovery', async () => {
  const a = await args(); const before = await snapshot();
  await db.exec(`CREATE FUNCTION reject_audit() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'injected audit failure'; END $$;
    CREATE TRIGGER reject_audit BEFORE INSERT ON financial_audit_log FOR EACH ROW EXECUTE FUNCTION reject_audit();`);
  await assert.rejects(commit(a), /injected audit failure/); assert.deepEqual(await snapshot(), before);
  await db.exec('DROP TRIGGER reject_audit ON financial_audit_log');
  assert.equal((await commit(a)).applied, true);
});
test('final event receipt failure rolls back all financial effects', async () => {
  const a = await args(); const before = await snapshot();
  await db.exec(`CREATE TRIGGER reject_event BEFORE INSERT ON stripe_webhook_events FOR EACH ROW EXECUTE FUNCTION reject_audit();`);
  await assert.rejects(commit(a), /injected audit failure/); assert.deepEqual(await snapshot(), before);
  await db.exec('DROP TRIGGER reject_event ON stripe_webhook_events');
  assert.equal((await commit(a)).applied, true);
});
test('stale revision and stale audit head reject without a partial write', async () => {
  const a = await args(); const b = await args(); await commit(a); const before = await snapshot();
  await assert.rejects(commit(b), /revision conflict/); assert.deepEqual(await snapshot(), before);
  const c = await args(); c.p_audit.prev_hash = 'bad';
  await assert.rejects(commit(c), /audit chain conflict/); assert.deepEqual(await snapshot(), before);
});
test('customer and subscription mismatches cannot mutate a profile', async () => {
  const before = await snapshot();
  for (const field of ['customer_id','subscription_id']) {
    const a = await args(); a.p_event[field] = 'wrong';
    await assert.rejects(commit(a), /mismatch/);
  }
  assert.deepEqual(await snapshot(), before);
});
test('older source event cannot regress the same subscription', async () => {
  const a = await args(); a.p_event.created = 1;
  const before = await snapshot(); assert.equal((await commit(a)).out_of_order, true);
  assert.deepEqual((await snapshot()).profile,before.profile);
});
test('quarantine receipt is atomic with durable dead-letter storage', async () => {
  const a = await args({ p_user_id: null, p_patch: {} });
  a.p_event.quarantine_reason = 'test quarantine'; a.p_event.payload = '{}';
  await db.exec(`CREATE TRIGGER reject_dlq BEFORE INSERT ON webhook_dead_letter FOR EACH ROW EXECUTE FUNCTION reject_audit();`);
  const before = await snapshot(); await assert.rejects(commit(a), /injected audit failure/);
  assert.deepEqual(await snapshot(),before); await db.exec('DROP TRIGGER reject_dlq ON webhook_dead_letter');
  assert.equal((await commit(a)).quarantined, true);
});
test('unproven legacy event receipts require reconciliation', async () => {
  const a = await args(); await db.query('INSERT INTO stripe_webhook_events(event_id,event_type) VALUES($1,$2)',[a.p_event.id,a.p_event.type]);
  const before = await snapshot(); await assert.rejects(commit(a), /legacy event needs reconciliation/);
  assert.deepEqual(await snapshot(),before);
});
test('anon and authenticated cannot execute billing transaction or forge ledger', async () => {
  const a = await args();
  for (const role of ['anon','authenticated']) {
    await assert.rejects(commit(a,role), /permission denied/);
    await db.exec(`SET ROLE ${role}`);
    try { await assert.rejects(db.query('SELECT * FROM stripe_billing_commits'), /permission denied/); }
    finally { await db.exec('RESET ROLE'); }
  }
});
test('authenticated user cannot grant plan directly; permitted name edit remains', async () => {
  await db.exec('SET ROLE authenticated');
  try {
    await assert.rejects(db.query("UPDATE profiles SET plan='unlimited'"), /permission denied/);
    await db.query("UPDATE profiles SET full_name='Fixture'");
  } finally { await db.exec('RESET ROLE'); }
});
test('missing profile and unsupported update fields fail atomically', async () => {
  const before = await snapshot();
  await assert.rejects(commit(await args({ p_user_id: '00000000-0000-4000-8000-000000000099' })), /no rows/);
  await assert.rejects(commit(await args({ p_patch: { email: 'attacker@example.test' } })), /unsupported billing field/);
  assert.deepEqual(await snapshot(),before);
});
test('ordering is scoped to subscription, independent of other customers', async () => {
  const user2 = '00000000-0000-4000-8000-000000000002';
  await db.exec(`INSERT INTO auth.users VALUES('${user2}');
    INSERT INTO profiles(id,email,stripe_customer_id) VALUES('${user2}','second@example.test','cus_second')`);
  const a = { p_event: { id: 'evt_second', type: 'checkout.session.completed', created: 2, object_id: 'cs_second',
    payload_hash: 'd'.repeat(64), customer_id: 'cus_second', subscription_id: 'sub_second', effect_key: 'activation:second' },
    p_user_id: user2, p_expected_revision: 0,
    p_patch: { plan: 'basic', stripe_subscription_id: 'sub_second', subscription_status: 'active' } };
  const prev = (await db.query('SELECT chain_hash,created_at FROM financial_audit_log ORDER BY created_at DESC,id DESC LIMIT 1')).rows[0];
  a.p_audit = { action: 'subscription.activated', prev_hash: prev.chain_hash,
    payload_hash: 'e'.repeat(64), chain_hash: 'second', created_at: new Date(Date.now() + 1000).toISOString() };
  assert.equal((await commit(a)).applied, true);
});
