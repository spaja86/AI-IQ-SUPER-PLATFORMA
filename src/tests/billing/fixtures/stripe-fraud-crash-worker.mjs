/* eslint-disable no-restricted-properties -- Dedicated disposable PGlite process. */
import { pathToFileURL } from 'node:url';
import { randomUUID } from 'node:crypto';
import { initializeFraudFixture, user, identityKeyHash } from './stripe-fraud-sql-fixture.mjs';
const { PGlite } = await import(pathToFileURL(process.env.PGLITE_MODULE).href);
const [mode, directory] = process.argv.slice(2);
const db = new PGlite(directory);
await db.waitReady;
if (mode === 'initialize') { await initializeFraudFixture(db); await db.close(); process.exit(0); }
const a = [randomUUID(),user,randomUUID(),Math.floor(Date.now()/1000),'c'.repeat(64),'d'.repeat(64),identityKeyHash];
const sql = 'SELECT record_stripe_checkout_attempt($1,$2,$3,$4,$5,$6,$7) AS result';
if (mode === 'uncommitted') {
  await db.exec('BEGIN; SET LOCAL ROLE service_role');
  await db.query(sql,a);
  // Persist the WAL/files while the transaction is open. Parent kills without COMMIT.
  await db.syncToFs();
} else if (mode === 'committed') {
  await db.transaction(async tx=>{await tx.exec('SET LOCAL ROLE service_role'); await tx.query(sql,a);});
  await db.syncToFs();
} else throw new Error('Unknown fixture mode');
process.stdout.write(JSON.stringify({ready:true,args:a})+'\n');
// Keep this process alive until the test sends SIGKILL; no close/checkpoint cleanup.
setInterval(()=>{},1000);
