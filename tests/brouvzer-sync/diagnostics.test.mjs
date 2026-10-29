import test from 'node:test';
import assert from 'node:assert/strict';
import { BookmarkModel } from '../../pilot/brouvzer/model.mjs';
import { PeerSync } from '../../pilot/brouvzer/transport.mjs';
import { candidateSummary } from '../../pilot/brouvzer/diagnostics.mjs';
const candidates = 'a=candidate:1 1 udp 123 192.0.2.10 4444 typ host\r\na=candidate:2 1 udp 123 198.51.100.20 5555 typ relay\r\na=ice-pwd:example-secret';
class FakePC extends EventTarget {
  constructor(sdp = '') { super(); this.localDescription = { sdp }; this.iceGatheringState = 'gathering'; this.iceConnectionState = 'new'; this.connectionState = 'new'; this.closes = 0; }
  close() { this.closes++; this.connectionState = 'closed'; }
}
test('diagnostics count candidates without exposing addresses, ports, SDP or credentials', () => {
  assert.deepEqual(candidateSummary(candidates), { total: 2, host: 1, srflx: 0, relay: 1, prflx: 0, other: 0 });
  const peer = new PeerSync(new BookmarkModel()); peer.pc = new FakePC(candidates);
  const output = JSON.stringify(peer.diagnostics()); assert.doesNotMatch(output, /192\.0\.2|198\.51\.100|4444|5555|example-secret|candidate:/); peer.destroy();
});
test('completed ICE with zero candidates fails before generating a usable invitation', async () => {
  const peer = new PeerSync(new BookmarkModel()); peer.pc = new FakePC(); peer.pc.iceGatheringState = 'complete';
  await assert.rejects(peer.gather(), /nijednog mrežnog kandidata/); assert.equal(peer.offer, null); peer.destroy();
});
test('ICE completion with candidates succeeds and releases listeners', async () => {
  const peer = new PeerSync(new BookmarkModel()); peer.pc = new FakePC(candidates);
  const gathering = peer.gather(); peer.pc.iceGatheringState = 'complete'; peer.pc.dispatchEvent(new Event('icegatheringstatechange'));
  await gathering; assert.equal(peer.cancelGather, null); peer.destroy();
});
test('revoke cancels pending ICE gathering immediately', { timeout: 2000 }, async () => {
  const peer = new PeerSync(new BookmarkModel()); peer.pc = new FakePC();
  const gathering = peer.gather(); const rejection = assert.rejects(gathering, /opozvano/); peer.close(); await rejection;
  assert.equal(peer.cancelGather, null); peer.destroy();
});
test('connection deadline fails closed even when native peer never emits a failure event', { timeout: 2000 }, async () => {
  const model = new BookmarkModel(); await model.put('offline', { title: 'saved', url: 'https://example.com/' });
  let done; const failed = new Promise(resolve => { done = resolve; }); const summaries = [];
  const peer = new PeerSync(model, { connectionTimeoutMs: 5, onError: done, onDiagnostics: d => summaries.push(d) });
  const pc = new FakePC(candidates); peer.pc = pc; peer.dc = { readyState: 'connecting', close() {} }; peer.armConnectionTimeout();
  assert.match((await failed).message, /nije otvoren/); assert.equal(pc.closes, 1); assert.equal(peer.pc, null); assert.equal(peer.gate, null);
  assert.equal(model.rows().length, 1); assert.ok(summaries.some(d => d.channel === 'connecting')); peer.destroy();
});
test('opened channel cancels the deadline without requiring user identity confirmation', { timeout: 2000 }, async () => {
  const errors = []; const peer = new PeerSync(new BookmarkModel(), { connectionTimeoutMs: 5, onError: e => errors.push(e) });
  peer.pc = new FakePC(candidates); const dc = { readyState: 'open', close() {} }; peer.attach(dc); peer.armConnectionTimeout(); dc.onopen();
  await new Promise(resolve => setTimeout(resolve, 20)); assert.deepEqual(errors, []); assert.equal(peer.gate, null); peer.destroy();
});
