/* eslint-disable no-restricted-properties -- Disposable local PostgreSQL fixture, no remote database. */
import assert from 'node:assert/strict';
import { test, before, after, beforeEach } from 'node:test';
import { randomUUID } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { initializeFraudFixture, user, identityKeyHash } from './fixtures/stripe-fraud-sql-fixture.mjs';
import { createHarness } from './fixtures/stripe-isolated-harness.mjs';
const { PGlite } = await import(process.env.PGLITE_MODULE ? pathToFileURL(process.env.PGLITE_MODULE).href : '@electric-sql/pglite');
let db;
before(async () => { db = new PGlite(); await initializeFraudFixture(db); });
after(async () => { await db?.close(); });
beforeEach(async () => {
  await db.exec(`TRUNCATE stripe_checkout_attempts, stripe_billing_effects, stripe_billing_commits, stripe_webhook_events, financial_audit_log CASCADE;
    UPDATE profiles SET created_at=now()-interval '1 year',billing_locked=false,failed_payment_count=0,billing_revision=0,stripe_subscription_id=NULL;
    UPDATE stripe_checkout_fraud_policy SET enabled=true,history_verified=true;`);
});
function args(overrides = {}) {
  return { p_attempt_id: randomUUID(), p_user_id: user, p_proxy_nonce: randomUUID(),
    p_issued_at: Math.floor(Date.now()/1000), p_request_hash: 'c'.repeat(64), p_ip_hash: 'd'.repeat(64),
    p_identity_key_hash: identityKeyHash, ...overrides };
}
const callSql = 'SELECT public.record_stripe_checkout_attempt($1,$2,$3,$4,$5,$6,$7) AS result';
const values = a => [a.p_attempt_id,a.p_user_id,a.p_proxy_nonce,a.p_issued_at,a.p_request_hash,a.p_ip_hash,a.p_identity_key_hash];
async function call(a = args(), role = 'service_role') {
  return db.transaction(async tx => {
    await tx.exec(`SET LOCAL ROLE ${role}`);
    return (await tx.query(callSql, values(a))).rows[0].result;
  });
}
const rows = async () => (await db.query('SELECT * FROM stripe_checkout_attempts')).rows;
async function failure({ id = randomUUID(), attempt = 1, created = Math.floor(Date.now()/1000), userId = user, applied = true } = {}) {
  const event = `evt_${randomUUID()}`;
  await db.query(`INSERT INTO stripe_billing_commits(event_id,event_type,object_id,customer_id,subscription_id,event_created,payload_hash,result)
    VALUES($1,'invoice.payment_failed',$2,'cus_fixture','sub_fixture',$3,$4,$5)`,[event,id,created,'a'.repeat(64),{ applied }]);
  await db.query('INSERT INTO stripe_billing_effects(effect_key,event_id,user_id) VALUES($1,$2,$3)',[`invoice-failure:${id}:${attempt}`,event,userId]);
}
test('actual SQL measures attempts 1..6 and denies sixth without mutating financial records', async () => {
  for (let n=1;n<=6;n++) {
    const r=await call(); assert.equal(r.checkoutAttemptsLastHour,n); assert.equal(r.decision,n<=5?'allow':'rate_user');
  }
  assert.equal((await rows()).length,6);
  assert.equal((await db.query('SELECT count(*)::int AS n FROM financial_audit_log')).rows[0].n,0);
});
test('actual SQL measures five IPs, five committed failures and new-account block score 95', async () => {
  await db.exec("UPDATE profiles SET created_at=now()-interval '1 day'");
  for(let n=0;n<5;n++) await failure();
  let result;
  for(let n=1;n<=5;n++) result=await call(args({p_ip_hash:String(n).repeat(64)}));
  assert.equal(result.distinctIpsLast24h,5); assert.equal(result.failedPaymentsLast30Days,5);
  assert.equal(result.score,95); assert.equal(result.decision,'fraud');
});
test('same attempt retry returns identical result; replay nonce and changed binding fail', async () => {
  const a=args(); const first=await call(a);
  assert.deepEqual(await call(a),first); assert.equal((await rows()).length,1);
  await assert.rejects(call(args({p_proxy_nonce:a.p_proxy_nonce})),/replay/);
  await assert.rejects(call({...a,p_ip_hash:'e'.repeat(64)}),/conflict/);
  await assert.rejects(call({...a,p_request_hash:'f'.repeat(64)}),/conflict/);
});
test('25 parallel submissions are serialized, retain every attempt and admit at most five', async () => {
  // PGlite queues transactions on one connection; native multi-process contention is a separate gate.
  const results=await Promise.all(Array.from({length:25},()=>call()));
  assert.deepEqual(results.map(r=>r.checkoutAttemptsLastHour).sort((a,b)=>a-b),Array.from({length:25},(_,i)=>i+1));
  assert.equal(results.filter(r=>r.decision==='allow').length,5); assert.equal((await rows()).length,25);
});
test('IP quota is shared by separate users; user counters stay independent', async () => {
  for(let n=1;n<=21;n++) {
    const id=randomUUID(); await db.query('INSERT INTO auth.users VALUES($1)',[id]);
    await db.query("INSERT INTO profiles(id,email,created_at) VALUES($1,$2,now()-interval '1 year')",[id,`fixture-${n}@example.test`]);
    const r=await call(args({p_user_id:id}));
    assert.equal(r.ipAttemptsLastHour,n); assert.equal(r.checkoutAttemptsLastHour,1);
    assert.equal(r.decision,n<=20?'allow':'rate_ip');
  }
});
test('SQL windows include current activity and exclude expired/future attempts and IP observations', async () => {
  const a=args({p_ip_hash:'1'.repeat(64)}); await call(a);
  await db.query("UPDATE stripe_checkout_attempts SET observed_at=clock_timestamp()-interval '61 minutes' WHERE attempt_id=$1",[a.p_attempt_id]);
  let r=await call(); assert.equal(r.checkoutAttemptsLastHour,1); assert.equal(r.distinctIpsLast24h,2);
  await db.query("UPDATE stripe_checkout_attempts SET observed_at=clock_timestamp()-interval '25 hours' WHERE attempt_id=$1",[a.p_attempt_id]);
  r=await call(); assert.equal(r.distinctIpsLast24h,1);
  await db.query("UPDATE stripe_checkout_attempts SET observed_at=clock_timestamp()+interval '1 hour' WHERE attempt_id=$1",[a.p_attempt_id]);
  r=await call(); assert.equal(r.checkoutAttemptsLastHour,3); assert.equal(r.distinctIpsLast24h,1);
});
test('30-day failures use committed unique effects, exclude old/future/unapplied rows and ignore lifetime counter', async () => {
  const now=Math.floor(Date.now()/1000);
  await failure({created:now-29*86400}); await failure({created:now-31*86400});
  await failure({created:now+3600}); await failure({applied:false});
  await db.exec('UPDATE profiles SET failed_payment_count=500');
  // Receipt-only rows do not establish a business effect.
  await db.exec("INSERT INTO stripe_webhook_events(event_id,event_type) VALUES('evt_raw_receipt','invoice.payment_failed')");
  assert.equal((await call()).failedPaymentsLast30Days,1);
});
test('preexisting billing lock remains authoritative even with a low measured fraud score', async () => {
  await db.exec('UPDATE profiles SET billing_locked=true');
  const r=await call(); assert.equal(r.score,0); assert.equal(r.decision,'billing_locked');
});
test('missing policy approval, unreconciled history and key changes fail closed without resetting counters', async () => {
  await call();
  await db.exec('UPDATE stripe_checkout_fraud_policy SET enabled=false'); await assert.rejects(call(),/policy not ready/);
  await db.exec('UPDATE stripe_checkout_fraud_policy SET enabled=true,history_verified=false'); await assert.rejects(call(),/policy not ready/);
  await db.exec('UPDATE stripe_checkout_fraud_policy SET history_verified=true');
  await assert.rejects(call(args({p_identity_key_hash:'e'.repeat(64)})),/policy not ready/);
  assert.equal((await call()).checkoutAttemptsLastHour,2);
});
test('stale or future attestations, missing profiles and invalid input never create admission rows', async () => {
  for(const extra of [{p_issued_at:Math.floor(Date.now()/1000)-61},{p_issued_at:Math.floor(Date.now()/1000)+30},
    {p_user_id:randomUUID()},{p_ip_hash:'192.0.2.10'},{p_attempt_id:null}]) await assert.rejects(call(args(extra)));
  assert.equal((await rows()).length,0);
});
test('future or absent account creation dates fail closed rather than lowering risk', async () => {
  await db.exec("UPDATE profiles SET created_at=clock_timestamp()+interval '1 day'");
  await assert.rejects(call(),/account age/);
});
test('insert failure rolls back admission; retry after recovery counts once', async () => {
  await db.exec(`CREATE FUNCTION reject_fraud_insert() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'fixture insert failure'; END $$;
    CREATE TRIGGER reject_fraud_insert BEFORE INSERT ON stripe_checkout_attempts FOR EACH ROW EXECUTE FUNCTION reject_fraud_insert();`);
  const a=args(); await assert.rejects(call(a),/fixture insert failure/); assert.equal((await rows()).length,0);
  await db.exec('DROP TRIGGER reject_fraud_insert ON stripe_checkout_attempts');
  assert.equal((await call(a)).checkoutAttemptsLastHour,1);
});
test('caller rollback leaves no count and a committed response can be recovered exactly', async () => {
  const a=args();
  await assert.rejects(db.transaction(async tx=>{
    await tx.exec('SET LOCAL ROLE service_role'); await tx.query(callSql,values(a)); throw new Error('simulated interrupted transaction');
  }),/interrupted/);
  assert.equal((await rows()).length,0);
  const r=await call(a); assert.deepEqual(await call(a),r);
});
test('anon/authenticated cannot read, forge, prune, configure or execute admission', async () => {
  for(const role of ['anon','authenticated']) {
    await assert.rejects(call(args(),role),/permission denied/);
    for(const sql of ['SELECT * FROM stripe_checkout_attempts','SELECT * FROM stripe_checkout_fraud_policy',
      'DELETE FROM stripe_checkout_attempts','SELECT prune_stripe_checkout_attempts()',
      'UPDATE stripe_checkout_fraud_policy SET enabled=true']) {
      await assert.rejects(db.transaction(async tx=>{await tx.exec(`SET LOCAL ROLE ${role}`); await tx.exec(sql);}),/permission denied/);
    }
  }
  await assert.rejects(db.transaction(async tx=>{await tx.exec('SET LOCAL ROLE service_role');await tx.exec('UPDATE stripe_checkout_fraud_policy SET enabled=true');}),/permission denied/);
});
test('retention removes only expired transient attempts and keeps all financial records', async () => {
  await failure(); const old=args(); await call(old); await call();
  await db.query("UPDATE stripe_checkout_attempts SET observed_at=clock_timestamp()-interval '26 hours' WHERE attempt_id=$1",[old.p_attempt_id]);
  const n=await db.transaction(async tx=>{ await tx.exec('SET LOCAL ROLE service_role'); return (await tx.query('SELECT prune_stripe_checkout_attempts() AS n')).rows[0].n; });
  assert.equal(n,1); assert.equal((await rows()).length,1);
  assert.equal((await db.query('SELECT count(*)::int AS n FROM stripe_billing_effects')).rows[0].n,1);
  assert.equal((await db.query('SELECT count(*)::int AS n FROM stripe_billing_commits')).rows[0].n,1);
});
test('actual Next Checkout handlers consume real SQL results across fresh instances', async () => {
  const harnesses=[];
  const rpcExecutor=async (name,a)=>{
    assert.equal(name,'record_stripe_checkout_attempt');
    try {return {data:await call(a),error:null};} catch(error) {return {data:null,error:{code:error.code}};}
  };
  const responses=await Promise.all(Array.from({length:12},()=>{
    const h=createHarness({rpcExecutor});harnesses.push(h);return h.checkout();
  }));
  assert.equal(responses.filter(r=>r.status===200).length,5);
  assert.equal(responses.filter(r=>r.status===429).length,7);
  assert.equal(harnesses.reduce((n,h)=>n+h.state.sessionCalls.length,0),5);
  for(const h of harnesses) assert.deepEqual(h.state.networkAttempts,[]);
});
test('SQL thresholds agree with the existing assessor across 48 measured risk combinations', async () => {
  const assess=createHarness().load('src/lib/stripe/billing-validators.ts').assessFraudRisk;
  for(const attempts of [1,3,5,10]) for(const ips of [1,5]) for(const failures of [0,3,5]) for(const isNew of [false,true]) {
    await db.exec('TRUNCATE stripe_checkout_attempts, stripe_billing_effects, stripe_billing_commits CASCADE');
    await db.query("UPDATE profiles SET created_at=clock_timestamp()-($1::int * interval '1 day')",[isNew?1:8]);
    for(let i=0;i<ips-1;i++) {
      await db.query(`INSERT INTO stripe_checkout_attempts VALUES($1,$2,$3,$4,$5,clock_timestamp()-interval '2 hours','{}')`,
        [randomUUID(),user,randomUUID(),'a'.repeat(64),String(i+1).repeat(64)]);
    }
    for(let i=1;i<attempts;i++) await db.query(`INSERT INTO stripe_checkout_attempts VALUES($1,$2,$3,$4,$5,clock_timestamp()-interval '1 minute','{}')`,
      [randomUUID(),user,randomUUID(),'a'.repeat(64),'d'.repeat(64)]);
    for(let i=0;i<failures;i++) await failure();
    const result=await call(); const expected=assess(result);
    assert.equal(result.checkoutAttemptsLastHour,attempts); assert.equal(result.distinctIpsLast24h,ips);
    assert.equal(result.failedPaymentsLast30Days,failures); assert.equal(result.isNewAccount,isNew);
    assert.equal(result.score,expected.score); assert.equal(result.decision==='fraud',expected.blocked);
  }
});
test('route blocks measured high-risk SQL account before Stripe side effects', async () => {
  await db.exec("UPDATE profiles SET created_at=now()-interval '1 day'");
  for(let n=0;n<5;n++) await failure();
  const rpcExecutor=async(_name,a)=>({data:await call(a),error:null});
  const h=createHarness({rpcExecutor});
  for(let n=1;n<=5;n++) assert.equal((await h.checkout(undefined,{}, {ip:`192.0.2.${n}`})).status,n<5?200:403);
  assert.equal(h.state.sessionCalls.length,4); assert.equal(h.state.fraudInputs.at(-1).score,95);
});
