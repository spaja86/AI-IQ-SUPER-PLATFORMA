import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const require = createRequire(import.meta.url);
const { parseConfig, launchOptions } = require('./native-rtc-config.cjs');
const { probe } = require('./native-rtc-probe.cjs');
const approve = text => ({ BROUVZER_RTC_APPROVED_CONFIG_SHA256: createHash('sha256').update(text).digest('hex') });

test('native defaults contact no configured ICE servers and preserve browser privacy defaults', () => {
  const config = parseConfig('{}');
  assert.deepEqual(config.rtc, { iceServers: [], iceTransportPolicy: 'all' });
  assert.deepEqual(launchOptions(config).args, []);
  assert.equal(config.scenario, 'normal');
  assert.equal(config.pageOrigin, 'blank');
});
test('loopback/mDNS test flags are opt-in, including when alternate args are empty', () => {
  const config = parseConfig('{"browserProfile":"loopback-test","headless":false}');
  const options = launchOptions(config, ['--single-process', '--disable-features=Existing']);
  assert.deepEqual(options.args, ['--disable-features=Existing,WebRtcHideLocalIpsWithMdns', '--allow-loopback-in-peer-connection']);
  assert.equal(options.headless, false);
  assert.equal(launchOptions(config).args.length, 2);
});
test('every nonempty ICE configuration requires approval bound to its exact bytes', () => {
  const text = '{"iceServers":[{"urls":"stun:approved.invalid:3478"}]}';
  assert.throws(() => parseConfig(text), /ice-config-not-approved/);
  assert.throws(() => parseConfig(text, { BROUVZER_RTC_APPROVED_CONFIG_SHA256: '1' }), /ice-config-not-approved/);
  assert.throws(() => parseConfig(text + ' ', approve(text)), /ice-config-not-approved/);
  assert.equal(parseConfig(text, approve(text)).rtc.iceServers.length, 1);
});
test('TURN credentials resolve only from explicitly named test-secret environment entries', () => {
  const text = JSON.stringify({ iceServers: [{ urls: ['turn:approved.invalid:3478?transport=udp', 'turns:approved.invalid:5349?transport=tcp'], usernameEnv: 'BROUVZER_RTC_SECRET_USER', credentialEnv: 'BROUVZER_RTC_SECRET_PASSWORD' }], iceTransportPolicy: 'relay' });
  assert.throws(() => parseConfig(text, approve(text)), /missing-test-credential/);
  const config = parseConfig(text, { ...approve(text), BROUVZER_RTC_SECRET_USER: 'synthetic-username', BROUVZER_RTC_SECRET_PASSWORD: 'synthetic-secret' });
  assert.equal(config.rtc.iceServers[0].credential, 'synthetic-secret');
  const publicText = JSON.stringify(config.publicConfig);
  for (const forbidden of ['approved.invalid', 'synthetic-', 'SECRET_', '3478', '5349']) assert.ok(!publicText.includes(forbidden));
  assert.deepEqual(config.publicConfig.schemes, ['turn', 'turns']);
});
for (const [name, input] of [
  ['unknown key', { token: 'synthetic-secret' }], ['non-object', []], ['unknown version', { version: 2 }],
  ['unknown policy', { iceTransportPolicy: 'anything' }], ['unknown profile', { browserProfile: '--arbitrary-flag' }],
  ['arbitrary origin', { pageOrigin: 'https://private.invalid' }],
  ['string boolean', { headless: 'false' }], ['unbounded timeout', { timeouts: { connectMs: 999999 } }],
  ['fractional timeout', { timeouts: { gatherMs: 100.5 } }], ['unknown timeout', { timeouts: { typo: 100 } }],
  ['inline credential', { iceServers: [{ urls: 'turn:approved.invalid', username: 'synthetic-user', credential: 'synthetic-secret' }] }],
  ['URL credentials', { iceServers: [{ urls: 'turn:user:secret@approved.invalid' }] }],
  ['URL path', { iceServers: [{ urls: 'stun:approved.invalid/private' }] }],
  ['URL port', { iceServers: [{ urls: 'stun:approved.invalid:99999' }] }],
  ['wrong URL scheme', { iceServers: [{ urls: 'https://approved.invalid' }] }],
  ['secret reference outside test namespace', { iceServers: [{ urls: 'turn:approved.invalid', usernameEnv: 'HOME', credentialEnv: 'TOKEN' }] }],
  ['empty URLs', { iceServers: [{ urls: [] }] }]
]) test(`native config rejects ${name}`, () => {
  const text = JSON.stringify(input);
  assert.throws(() => parseConfig(text, approve(text)));
});
test('invalid JSON errors never include caller-controlled file content', () => {
  assert.throws(() => parseConfig('{synthetic-private-content'), /^Error: invalid-json$/);
});

// Deliberately synthetic RTC API: tests diagnosis/cleanup, not real ICE/DTLS.
function fakeRTC(mode) {
  const peers = [], targets = [];
  class Target extends EventTarget {
    active = new Set();
    constructor() { super(); targets.push(this); }
    addEventListener(type, fn) { this.active.add(fn); super.addEventListener(type, fn); }
    removeEventListener(type, fn) { this.active.delete(fn); super.removeEventListener(type, fn); }
    emit(type, data = {}) { const event = new Event(type); Object.assign(event, data); this.dispatchEvent(event); }
  }
  class Channel extends Target {
    readyState = 'connecting';
    send(data) { if (mode !== 'transfer-timeout') queueMicrotask(() => this.other.emit('message', { data })); }
    close() {
      if (mode === 'cleanup-failure') return;
      for (const channel of [this, this.other].filter(Boolean)) {
        channel.readyState = 'closed'; channel.emit('close');
      }
    }
  }
  class Peer extends Target {
    iceGatheringState = 'new'; iceConnectionState = 'new'; connectionState = 'new'; signalingState = 'stable';
    constructor() {
      super();
      if (mode === 'partial-constructor' && peers.length === 1) throw new Error('synthetic-private-constructor');
      peers.push(this);
    }
    createDataChannel() { this.channel = new Channel(); return this.channel; }
    async createOffer() {
      if (mode === 'native-error') throw new Error('synthetic-private-address-token-sdp');
      if (mode === 'operation-timeout') return new Promise(() => {});
      return { type: 'offer' };
    }
    async createAnswer() { return { type: 'answer' }; }
    async getStats() {
      return new Map([
        ['transport', { type: 'transport', selectedCandidatePairId: 'private-pair-id' }],
        ['private-pair-id', { localCandidateId: 'local', remoteCandidateId: 'remote' }],
        ['local', { candidateType: 'host', protocol: 'udp', address: 'synthetic-private-address', port: 55555 }],
        ['remote', { candidateType: 'host', protocol: 'udp', address: 'synthetic-private-address', port: 55555 }]
      ]);
    }
    async setLocalDescription(description) {
      const hasCandidate = mode !== 'zero' && !(mode === 'one-sided-zero' && peers.indexOf(this) === 1);
      this.localDescription = { type: description.type, sdp: hasCandidate ? 'a=candidate:synthetic-private-sdp\r\n' : '' };
      this.iceGatheringState = 'gathering'; this.emit('icegatheringstatechange');
      this.emit('icecandidateerror', { errorCode: 701, errorText: 'synthetic-private-error', url: 'turn:private.invalid', address: 'synthetic-private-address' });
      if (mode === 'gather-timeout') return;
      if (hasCandidate) this.emit('icecandidate', { candidate: { candidate: 'synthetic-private-candidate', type: 'host' } });
      this.emit('icecandidate', { candidate: null });
      this.iceGatheringState = 'complete'; this.emit('icegatheringstatechange');
    }
    async setRemoteDescription(description) {
      if (description.type !== 'answer' || mode === 'connection-timeout') return;
      if (mode === 'ice-failed') { this.iceConnectionState = 'failed'; return; }
      const a = peers[0].channel, b = new Channel(); peers[1].channel = b;
      a.other = b; b.other = a; peers[1].emit('datachannel', { channel: b });
      for (const peer of peers) { peer.connectionState = 'connected'; peer.iceConnectionState = 'connected'; }
      for (const channel of [a, b]) { channel.readyState = 'open'; channel.emit('open'); }
    }
    close() { this.connectionState = 'closed'; this.signalingState = 'closed'; this.iceConnectionState = 'closed'; this.channel?.close(); }
  }
  return { Peer, peers, targets };
}
async function runFake(mode, overrides = {}) {
  const fake = fakeRTC(mode);
  const previous = globalThis.RTCPeerConnection;
  globalThis.RTCPeerConnection = mode === 'unavailable' ? undefined : fake.Peer;
  try {
    const config = { ...parseConfig('{}'), timeouts: { operationMs: 25, gatherMs: 25, connectMs: 25, transferMs: 25, closeMs: 25 }, ...overrides };
    const result = await probe(config);
    assert.equal(fake.targets.reduce((n, target) => n + target.active.size, 0), 0, 'all listeners removed');
    for (const peer of fake.peers) assert.equal(peer.signalingState, 'closed', 'all created peers closed');
    const text = JSON.stringify(result);
    for (const forbidden of ['synthetic-private', 'private.invalid', 'a=candidate:']) assert.ok(!text.includes(forbidden), 'no raw error/SDP/address');
    fake.peers[0]?.emit('icecandidate', { candidate: { candidate: 'late', type: 'host' } });
    assert.equal(JSON.stringify(result), text, 'late events cannot modify completed report');
    return result;
  } finally {
    if (previous === undefined) delete globalThis.RTCPeerConnection;
    else globalThis.RTCPeerConnection = previous;
  }
}
test('synthetic API: both channels must open, both exact messages arrive and close handshake finish', async () => {
  const result = await runFake('success');
  assert.equal(result.outcome, 'native-transfer-verified');
  assert.equal(result.channelOpen, true);
  assert.deepEqual(result.received, { a: true, b: true });
  assert.equal(result.channelCloseHandshake, true);
  assert.equal(result.cleanup.verified, true);
  assert.equal(result.applicationProtocol, 'not-tested');
  assert.deepEqual(result.selectedPair.a, { localType: 'host', remoteType: 'host', protocol: 'udp' });
});
for (const [mode, outcome] of [
  ['zero', 'no-ice-candidates'], ['one-sided-zero', 'no-ice-candidates'],
  ['gather-timeout', 'gather-timeout'], ['connection-timeout', 'connection-timeout'],
  ['transfer-timeout', 'transfer-timeout'], ['operation-timeout', 'operation-timeout'],
  ['native-error', 'native-error'], ['partial-constructor', 'native-error'],
  ['ice-failed', 'ice-connection-failed'], ['unavailable', 'webrtc-unavailable']
]) test(`synthetic API: ${mode} is a failure with bounded cleanup`, async () => {
  const result = await runFake(mode);
  assert.equal(result.outcome, outcome);
  assert.equal(result.transferVerified, false);
  assert.equal(result.cleanup.verified, true);
  assert.ok(Number.isFinite(result.elapsedMs));
});
test('synthetic API: incomplete channel closure cannot pass even after payload transfer', async () => {
  const result = await runFake('cleanup-failure');
  assert.equal(result.outcome, 'channel-close-timeout');
  assert.equal(result.transferVerified, true);
  assert.equal(result.cleanup.verified, false);
});
test('relay-only with no servers is identified as intentional ICE configuration restriction', async () => {
  const result = await runFake('zero', { rtc: { iceServers: [], iceTransportPolicy: 'relay' } });
  assert.equal(result.outcome, 'relay-without-servers');
});
test('withholding answer times out even when gathering succeeds; never passes as transfer', async () => {
  const result = await runFake('success', { scenario: 'withhold-answer' });
  assert.equal(result.outcome, 'connection-timeout');
  assert.equal(result.channelOpen, false);
  assert.equal(result.cleanup.verified, true);
});
test('CLI rejects unapproved ICE before browser loading and does not leak config or paths', () => {
  const directory = mkdtempSync(join(tmpdir(), 'native-rtc-test-'));
  try {
    const file = join(directory, 'synthetic-private-config.json');
    writeFileSync(file, '{"iceServers":[{"urls":"stun:synthetic-private.invalid"}]}');
    const env = { ...process.env, BROUVZER_RTC_CONFIG: file, PLAYWRIGHT_MODULE: 'synthetic-unavailable-module' };
    delete env.BROUVZER_RTC_APPROVED_CONFIG_SHA256; delete env.DEBUG; delete env.PWDEBUG;
    const child = spawnSync(process.execPath, [new URL('./native-rtc.cjs', import.meta.url).pathname], { env, encoding: 'utf8', timeout: 5000 });
    assert.equal(child.status, 1);
    assert.equal(JSON.parse(child.stdout).errorCode, 'ice-config-not-approved');
    assert.ok(!(child.stdout + child.stderr).includes('synthetic-private'));
    assert.ok(!(child.stdout + child.stderr).includes(directory));
  } finally { rmSync(directory, { recursive: true, force: true }); }
});

for (const [name, patch, expected] of [
  ['complete native result', {}, 0],
  ['channel opening without payload', { transferVerified: false }, 2],
  ['payload without close handshake', { channelCloseHandshake: false }, 2],
  ['failed resource cleanup', { cleanup: { verified: false } }, 2]
]) test(`CLI exit contract with synthetic browser: ${name}`, () => {
  const directory = mkdtempSync(join(tmpdir(), 'native-rtc-cli-test-'));
  try {
    const result = { outcome: 'native-transfer-verified', channelOpen: true, transferVerified: true, channelCloseHandshake: true, cleanup: { verified: true }, ...patch };
    const module = join(directory, 'synthetic-browser.cjs');
    writeFileSync(module, `module.exports = { chromium: { launch: async () => ({ version: () => '1.2.3.4', close: async () => {}, newContext: async () => ({ close: async () => {}, newPage: async () => ({ evaluate: async () => (${JSON.stringify(result)}) }) }) }) } };`);
    const env = { ...process.env, PLAYWRIGHT_MODULE: module };
    for (const key of ['DEBUG', 'PWDEBUG', 'BROUVZER_RTC_CONFIG', 'CHROMIUM_MODULE', 'CHROMIUM_EXECUTABLE']) delete env[key];
    const child = spawnSync(process.execPath, [new URL('./native-rtc.cjs', import.meta.url).pathname], { env, encoding: 'utf8', timeout: 15000 });
    assert.equal(child.status, expected);
    assert.equal(JSON.parse(child.stdout).harnessCleanup.browserClosed, true);
  } finally { rmSync(directory, { recursive: true, force: true }); }
});

test('debug logging is rejected before loading browser tooling or secret configuration', () => {
  const env = { ...process.env, DEBUG: 'pw:*', PLAYWRIGHT_MODULE: 'synthetic-unavailable-module' };
  const child = spawnSync(process.execPath, [new URL('./native-rtc.cjs', import.meta.url).pathname], { env, encoding: 'utf8', timeout: 15000 });
  assert.equal(child.status, 1);
  assert.equal(JSON.parse(child.stdout).errorCode, 'debug-logging-disabled');
  assert.equal(child.stderr, '');
});
