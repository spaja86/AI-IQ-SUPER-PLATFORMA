import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require = createRequire(import.meta.url);
const {sanitize, discover, childEnvironment, profiles} = require('./windows-rtc-matrix.cjs');
const good = () => ({outcome:'native-transfer-verified', phase:'channel-close', browserVersion:'138.0.1.2', channelOpen:true, channelCloseHandshake:true, transferVerified:true, received:{a:true,b:true}, cleanup:{verified:true}, harnessCleanup:{contextClosed:true,browserClosed:true,originServerClosed:true}});
test('PASS requires actual bidirectional payload, handshake and all cleanup', () => {
  assert.equal(sanitize(good(),0).status,'PASS');
  for (const mutate of [r=>r.received.a=false,r=>r.channelOpen=false,r=>r.channelCloseHandshake=false,r=>r.cleanup.verified=false,r=>r.harnessCleanup.browserClosed=false,r=>r.harnessCleanup.contextClosed=false,r=>r.harnessCleanup.originServerClosed=false]) {
    const r=good(); mutate(r); assert.equal(sanitize(r,0).status,'FAIL');
  }
  assert.equal(sanitize(good(),2).status,'FAIL');
});
test('strict projection excludes addresses SDP identifiers secrets and arbitrary strings', () => {
  const secret='192.168.11.23 secret-fingerprint SDP-content';
  const r = sanitize({...good(), phase:secret, browserVersion:secret, candidates:{a:secret,b:2}, candidateTypes:{a:{host:secret}}, gathering:{a:secret}, iceErrorCodes:[secret,701,702], sdp:secret, error:secret, selectedPair:{address:secret}},0);
  assert.ok(!JSON.stringify(r).includes(secret));
  assert.equal(r.phase,'unknown'); assert.equal(r.candidates.a,null); assert.deepEqual(r.iceErrorCodes,[701]);
});
test('missing malformed and harness reports cannot pass', () => {
  for (const raw of [null,{},'raw-secret',{outcome:'harness-error',stage:'browser-launch'}]) assert.equal(sanitize(raw,0).status,'FAIL');
});
test('Windows standard installs include per-user Chrome Edge and Chromium without exposing paths', () => {
  const targets=discover({LOCALAPPDATA:'C:\\Users\\private\\AppData\\Local'}, p=>p.endsWith('chrome.exe') || p.endsWith('msedge.exe'),'win32');
  assert.deepEqual(targets.map(t=>t.browser),['chromium','chrome','msedge']); assert.ok(targets.every(t=>t.executable));
  assert.deepEqual(discover({},()=>false,'linux'),[]);
  assert.ok(discover({},()=>false,'win32').every(t=>!t.executable));
});
test('matrix ignores ambient external ICE approval, alternate modules and debug flags', () => {
  const env=childEnvironment({PATH:'safe',BROUVZER_RTC_CONFIG:'private',BROUVZER_RTC_APPROVED_CONFIG_SHA256:'secret',BROUVZER_RTC_SECRET_PASSWORD:'secret',CHROMIUM_MODULE:'alternate',DEBUG:'pw:*',PWDEBUG:'1',NODE_OPTIONS:'--inspect'}, profiles[0],'local-exe');
  assert.equal(env.PATH,'safe'); assert.equal(env.CHROMIUM_EXECUTABLE,'local-exe');
  for (const k of ['CHROMIUM_MODULE','DEBUG','PWDEBUG','NODE_OPTIONS','BROUVZER_RTC_APPROVED_CONFIG_SHA256','BROUVZER_RTC_SECRET_PASSWORD']) assert.equal(env[k],undefined);
  assert.ok(env.BROUVZER_RTC_CONFIG.endsWith('host-default.json'));
});
test('candidate types and gathering counts survive strict projection', () => {
  const r=sanitize({...good(),candidates:{a:2,b:1},candidateTypes:{a:{host:2,relay:0},b:{host:1}}, gathering:{a:'complete',b:'timeout'},sdpCandidateCount:{a:2,b:1}},0);
  assert.equal(r.candidateTypes.a.host,2); assert.equal(r.gathering.b,'timeout'); assert.equal(r.sdpCandidateCount.b,1);
});
test('all matrix profiles retain empty ICE server lists and bounded existing configs', async () => {
  const {readFileSync}=await import('node:fs');
  const {parseConfig}=require('./native-rtc-config.cjs');
  for (const p of profiles) {
    const config=parseConfig(readFileSync(new URL('./native-configs/'+p+'.json',import.meta.url),'utf8'));
    assert.deepEqual(config.rtc.iceServers,[]);
    assert.equal(config.publicConfig.externalIceApproved,false);
  }
});
test('non-Windows CLI explicitly reports no Windows execution and exits 2', async () => {
  if (process.platform==='win32') return;
  const {spawnSync}=await import('node:child_process');
  const r=spawnSync(process.execPath,[new URL('./windows-rtc-matrix.cjs',import.meta.url).pathname],{encoding:'utf8'});
  assert.equal(r.status,2);
  const report=JSON.parse(r.stdout);
  assert.equal(report.windowsExecution,false); assert.deepEqual(report.rows,[]);
});
