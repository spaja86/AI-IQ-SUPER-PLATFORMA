/* eslint-disable no-restricted-properties -- Local persistent PGlite recovery, no remote connections. */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const modulePath = process.env.PGLITE_MODULE;
if (!modulePath) throw new Error('PGLITE_MODULE must identify the isolated test installation');
const { PGlite } = await import(pathToFileURL(modulePath).href);
const worker=fileURLToPath(new URL('./fixtures/stripe-fraud-crash-worker.mjs',import.meta.url));
async function runWorker(mode,directory) {
  return new Promise((resolve,reject)=>{
    const child=spawn(process.execPath,[worker,mode,directory],{env:{PGLITE_MODULE:modulePath,TZ:'UTC'},stdio:['ignore','pipe','pipe']});
    let output='',errors='',ready;
    const timer=setTimeout(()=>{child.kill('SIGKILL');reject(new Error('Recovery worker timed out'));},20000);
    child.stdout.on('data',chunk=>{
      output+=chunk;
      if(output.includes('\n')&&!ready) {ready=JSON.parse(output.trim());child.kill('SIGKILL');}
    });
    child.stderr.on('data',chunk=>{errors+=chunk;});
    child.once('error',error=>{clearTimeout(timer);reject(error);});
    child.once('exit',(code,signal)=>{
      clearTimeout(timer);
      if(mode==='initialize'&&code===0) resolve(null);
      else if(ready&&signal==='SIGKILL') resolve(ready);
      else reject(new Error(`Recovery worker failed: ${code}/${signal}: ${errors}`));
    });
  });
}
test('disk-backed SQL survives SIGKILL after commit; retry reuses the persisted admission',async()=>{
  const directory=await mkdtemp(join(tmpdir(),'stripe-fraud-commit-'));let db;
  try {
    await runWorker('initialize',directory);const {args}=await runWorker('committed',directory);
    db=new PGlite(directory);await db.waitReady;
    const prior=(await db.query('SELECT result FROM stripe_checkout_attempts')).rows;
    assert.equal(prior.length,1);
    const result=await db.transaction(async tx=>{await tx.exec('SET LOCAL ROLE service_role');return(await tx.query('SELECT record_stripe_checkout_attempt($1,$2,$3,$4,$5,$6,$7) AS result',args)).rows[0].result;});
    assert.deepEqual(result,prior[0].result);
    assert.equal((await db.query('SELECT count(*)::int AS n FROM stripe_checkout_attempts')).rows[0].n,1);
  } finally {await db?.close();await rm(directory,{recursive:true,force:true});}
});
test('SIGKILL before commit recovers without a partial attempt or consumed proxy nonce',async()=>{
  const directory=await mkdtemp(join(tmpdir(),'stripe-fraud-rollback-'));let db;
  try {
    await runWorker('initialize',directory);const {args}=await runWorker('uncommitted',directory);
    db=new PGlite(directory);await db.waitReady;
    assert.equal((await db.query('SELECT count(*)::int AS n FROM stripe_checkout_attempts')).rows[0].n,0);
    const result=await db.transaction(async tx=>{await tx.exec('SET LOCAL ROLE service_role');return(await tx.query('SELECT record_stripe_checkout_attempt($1,$2,$3,$4,$5,$6,$7) AS result',args)).rows[0].result;});
    assert.equal(result.checkoutAttemptsLastHour,1);
  } finally {await db?.close();await rm(directory,{recursive:true,force:true});}
});
