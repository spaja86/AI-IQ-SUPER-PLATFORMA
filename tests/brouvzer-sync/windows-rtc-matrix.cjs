'use strict';
// Reuses the PR #1374 native probe. Never forwards child stdout/stderr verbatim.
const { spawn } = require('node:child_process');
const { existsSync, writeFileSync, readFileSync } = require('node:fs');
const {createHash} = require('node:crypto');
const path = require('node:path');
const profiles = ['host-default', 'host-loopback', 'loopback-origin', 'relay-without-servers', 'withhold-answer'];
const types = ['host', 'srflx', 'prflx', 'relay', 'unknown'];
const outcomes = ['native-transfer-verified', 'gather-timeout', 'no-ice-candidates', 'relay-without-servers', 'connection-timeout', 'ice-connection-failed', 'operation-timeout', 'transfer-timeout', 'channel-close-timeout', 'cleanup-failed', 'native-error', 'webrtc-unavailable', 'harness-error'];
const phases = ['capability', 'construct', 'create-offer', 'local-offer', 'gather-a', 'remote-offer', 'create-answer', 'local-answer', 'gather-b', 'remote-answer', 'connect', 'transfer', 'stats-a', 'stats-b', 'channel-close', 'configuration', 'browser-launch', 'browser-context', 'browser-page', 'loopback-origin', 'native-probe'];
const count = n => Number.isSafeInteger(n) && n >= 0 && n <= 1000000 ? n : null;
function sanitize(raw, exitCode) {
  const r = raw && typeof raw === 'object' ? raw : {};
  const yes = x => x === true;
  const transferVerified = yes(r.transferVerified) && yes(r.received?.a) && yes(r.received?.b);
  const cleanupVerified = yes(r.cleanup?.verified) && yes(r.harnessCleanup?.contextClosed) && yes(r.harnessCleanup?.browserClosed) && yes(r.harnessCleanup?.originServerClosed);
  const pass = exitCode === 0 && r.outcome === 'native-transfer-verified' && transferVerified && cleanupVerified && yes(r.channelOpen) && yes(r.channelCloseHandshake);
  const pair = field => Object.fromEntries(['a', 'b'].map(peer => [peer, field(peer)]));
  return {
    status: pass ? 'PASS' : 'FAIL', evidence: 'native-webrtc', applicationProtocol: 'not-tested',
    outcome: outcomes.includes(r.outcome) ? r.outcome : 'invalid-or-missing-report',
    phase: phases.includes(r.phase || r.stage) ? (r.phase || r.stage) : 'unknown',
    browserVersion: typeof r.browserVersion === 'string' && /^\d+(?:\.\d+){1,3}$/.test(r.browserVersion) ? r.browserVersion : 'unreported',
    candidates: pair(p => count(r.candidates?.[p])),
    candidateTypes: pair(p => Object.fromEntries(types.map(t => [t, count(r.candidateTypes?.[p]?.[t])]))),
    gathering: pair(p => ['complete', 'timeout', 'not-started'].includes(r.gathering?.[p]) ? r.gathering[p] : 'unknown'),
    sdpCandidateCount: pair(p => count(r.sdpCandidateCount?.[p])),
    channelOpen: yes(r.channelOpen), transferVerified, channelCloseHandshake: yes(r.channelCloseHandshake), cleanupVerified,
    iceErrorCodes: Array.isArray(r.iceErrorCodes) ? r.iceErrorCodes.filter(n => Number.isInteger(n) && n >= 300 && n <= 701).slice(0,16) : []
  };
}
function discover(env = process.env, exists = existsSync, platform = process.platform) {
  if (platform !== 'win32') return [];
  const roots = [env.PROGRAMFILES, env['PROGRAMFILES(X86)'], env.ProgramFiles, env['ProgramFiles(x86)'], env.LOCALAPPDATA].filter(Boolean);
  return [['chromium', ['Chromium', 'Application', 'chrome.exe']], ['chrome', ['Google', 'Chrome', 'Application', 'chrome.exe']], ['msedge', ['Microsoft', 'Edge', 'Application', 'msedge.exe']]].map(([browser, suffix]) => ({browser, executable: roots.map(root => path.win32.join(root, ...suffix)).find(exists)}));
}
function childEnvironment(env, profile, executable) {
  const clean = {...env};
  for (const key of Object.keys(clean)) if (/^(BROUVZER_RTC_|CHROMIUM_|DEBUG$|PWDEBUG$|NODE_OPTIONS$)/.test(key)) delete clean[key];
  clean.BROUVZER_RTC_CONFIG = path.join(__dirname, 'native-configs', profile + '.json');
  clean.CHROMIUM_EXECUTABLE = executable;
  return clean;
}
function runProbe(env) {
  return new Promise(resolve => {
    let output = '', oversized = false, settled = false, timedOut = false;
    const child = spawn(process.execPath, [path.join(__dirname, 'native-rtc.cjs')], {env, stdio: ['ignore','pipe','pipe'], windowsHide: true});
    const finish = row => { if (!settled) { settled = true; clearTimeout(timer); resolve(row); } };
    const timer = setTimeout(() => { timedOut = true; child.kill(); }, 240000);
    child.stdout.on('data', b => { if (output.length + b.length > 262144) { oversized = true; child.kill(); } else output += b.toString(); });
    child.stderr.on('data', () => {}); // Browser errors can contain paths, network addresses and identifiers.
    child.on('error', () => finish(sanitize(null, 1)));
    child.on('close', code => {
      let raw; try { if (!oversized && !timedOut) raw = JSON.parse(output); } catch { /* allowlist failure report */ }
      finish(sanitize(raw, code));
    });
  });
}
async function main() {
  const targets = discover();
  // Standard Chromium install first; otherwise use the existing Playwright-managed build.
  if (process.platform === 'win32' && !targets[0].executable) {
    try {
      if (process.env.DEBUG || (process.env.PWDEBUG && process.env.PWDEBUG !== '0')) throw new Error();
      const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
      const executable = chromium.executablePath();
      if (existsSync(executable)) { targets[0].executable = executable; targets[0].managed = true; }
    } catch { /* Missing tooling is SKIP, never print raw loader errors. */ }
  }
  const sourceHashes = Object.fromEntries(['windows-rtc-matrix.cjs', 'native-rtc.cjs', 'native-rtc-probe.cjs', 'native-rtc-config.cjs', ...profiles.map(p => 'native-configs/' + p + '.json')].map(file => [file, createHash('sha256').update(readFileSync(path.join(__dirname,file))).digest('hex')]));
  const report = {schemaVersion: 1, nodeVersion: process.versions.node, sourceHashes, platform: process.platform === 'win32' ? 'windows' : 'unsupported', windowsExecution: process.platform === 'win32', syntheticTests: 'separate-node-suite', applicationProtocol: 'not-tested', externalIceServers: false, rows: []};
  for (const {browser, executable, managed} of targets) {
    if (!executable) { report.rows.push({browser, status: 'SKIP', reason: 'not-installed-in-standard-location'}); continue; }
    for (const profile of profiles) {
      const row = await runProbe(childEnvironment(process.env, profile, executable));
      report.rows.push({browser, browserSource: managed ? 'playwright-managed' : 'standard-install', profile, negativeControl: ['relay-without-servers', 'withhold-answer'].includes(profile), ...row});
    }
  }
  console.log(JSON.stringify(report, null, 2));
  // Missing browser is SKIP; zero executed tests is never success. Negative controls remain FAIL for transport.
  process.exitCode = report.rows.some(r => r.status !== 'SKIP') && report.rows.filter(r => r.status !== 'SKIP').every(r => r.status === 'PASS') ? 0 : 2;
  if (process.argv[2]) writeFileSync(process.argv[2], JSON.stringify(report, null, 2) + '\n', {flag:'wx'});
}
if (require.main === module) main().catch(() => { console.error('{"status":"FAIL","reason":"matrix-runner-failed"}'); process.exitCode = 1; });
module.exports = {sanitize, discover, childEnvironment, profiles};
