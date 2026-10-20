// Optional production HTTP regression: run npm run build, then node src/tests/auth/login-http-security.mjs.
// Starts and stops only a loopback server on port 4319. It never deploys.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createWriteStream } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { setTimeout as delay } from 'node:timers/promises';

const env = { ...process.env, OMEGA_JWT_SECRET: randomBytes(48).toString('hex') };
for (const key of ['OMEGA_LOGIN_TRUSTED_PROXY_HOPS','OMEGA_VAULT_KEY','KV_REST_API_URL','KV_REST_API_TOKEN','VERCEL_KV_REST_API_URL','VERCEL_KV_REST_API_TOKEN']) delete env[key];
const log = createWriteStream('/tmp/login-parity-server.log');
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '4319'], { env, stdio: ['ignore','pipe','pipe'] });
server.stdout.pipe(log); server.stderr.pipe(log);
let failures = 0;
async function check(name, fn) { try { await fn(); console.log('PASS', name); } catch(e) { failures++; console.error('FAIL', name, e.message); } }
async function post(path, body, headers = {}) {
 const res = await fetch(`http://127.0.0.1:4319${path}`, {method:'POST', headers:{'Content-Type':'application/json', ...headers}, body:JSON.stringify(body)});
 const data = await res.json();
 return {res,data};
}
function denied({res,data},status,key) { assert.equal(res.status,status); assert.equal(typeof data[key],'string'); for(const f of ['token','refreshToken','identity','sesija']) assert.equal(data[f],undefined); assert.equal(res.headers.get('set-cookie'),null); }
try {
 let ready = false;
 for (let i=0;i<60;i++) {
  if(server.exitCode !== null) throw new Error('Next server exited: '+server.exitCode);
  try { if((await fetch('http://127.0.0.1:4319/api/login')).ok) {ready=true;break;} } catch {}
  await delay(500);
 }
 if(!ready) throw new Error('Next server not reachable within 30s');
 for(const [path,key] of [['/api/login','greska'],['/api/auth/login','error']]) {
  await check(path+' success contract and production cookie',async()=>{
   const {res,data}=await post(path,{email:'demo@spaja.ai',password:'Demo2024!'});
   assert.equal(res.status,200); assert.equal(data.token.type,'ACCESS'); assert.ok(data.pretplata);
   assert.match(res.headers.get('set-cookie'),/Secure/); assert.match(res.headers.get('set-cookie'),/HttpOnly/);
   if(path==='/api/login') {assert.equal(data.uspesno,true); assert.equal(data.sesija.token,data.token.value);}
  });
  await check(path+' threshold through production HTTP',async()=>{
   for(let i=0;i<6;i++) denied(await post(path,{email:`http-${key}@example.test`,password:'Wrong-password!42'},{'x-forwarded-for':`203.0.113.${i+1}`} ),i<5?401:429,key);
  });
 }
 await check('legacy lozinka through production HTTP',async()=>{
  const {res,data}=await post('/api/login',{email:' DEMO@SPAJA.AI ',lozinka:'Demo2024!'});
  assert.equal(res.status,200);assert.equal(data.sesija.email,'demo@spaja.ai');
 });
 await check('shared counter across compiled route bundles',async()=>{
  for(let i=0;i<6;i++) {
   const path=i%2?'/api/auth/login':'/api/login', key=i%2?'error':'greska';
   denied(await post(path,{email:i%2?' HTTP-CROSS@EXAMPLE.TEST ':'http-cross@example.test',password:'Wrong-password!42'},{'x-forwarded-for':`198.51.100.${i+1}`} ),i<5?401:429,key);
  }
 });
} catch (e) { failures++; console.error('HTTP HARNESS ERROR', e.message); }
finally {
 if (server.exitCode === null) {
  server.kill('SIGTERM');
  await new Promise(resolve => server.once('exit', resolve));
 }
 log.end();
}
process.exitCode=failures?1:0;
