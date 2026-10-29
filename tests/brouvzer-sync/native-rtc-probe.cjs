'use strict';

// Self-contained for page.evaluate and deterministic Node fault-injection tests.
// No imports from SPAJA, Yjs, pairing code, or application signaling.
async function probe(config) {
  const report = {
    nativeOnly: true, applicationProtocol: 'not-tested', scenario: config.scenario,
    capabilities: { peerConnection: typeof RTCPeerConnection === 'function', secureContext: globalThis.isSecureContext === true },
    outcome: 'not-started', phase: 'capability', candidates: { a: 0, b: 0 },
    candidateTypes: { a: { host: 0, srflx: 0, prflx: 0, relay: 0, unknown: 0 }, b: { host: 0, srflx: 0, prflx: 0, relay: 0, unknown: 0 } },
    sdpCandidateCount: { a: 0, b: 0 }, gathering: { a: 'not-started', b: 'not-started' },
    channelOpen: false, received: { a: false, b: false }, transferVerified: false,
    iceErrorCodes: [], events: [], selectedPair: { a: null, b: null },
    cleanup: { peersClosed: false, channelsClosed: false, verified: false }
  };
  const peers = {}, channels = {}, listeners = [], timers = new Set();
  const started = Date.now();
  const timeout = (callback, ms) => { const id = setTimeout(() => { timers.delete(id); callback(); }, ms); timers.add(id); return id; };
  const clear = id => { clearTimeout(id); timers.delete(id); };
  const on = (target, type, handler) => { target.addEventListener(type, handler); listeners.push(() => target.removeEventListener(type, handler)); };
  const allowed = (value, values) => values.includes(value) ? value : 'unknown';
  const state = pc => ({
    ice: allowed(pc.iceConnectionState, ['new', 'checking', 'connected', 'completed', 'failed', 'disconnected', 'closed']),
    connection: allowed(pc.connectionState, ['new', 'connecting', 'connected', 'failed', 'disconnected', 'closed']),
    gathering: allowed(pc.iceGatheringState, ['new', 'gathering', 'complete']),
    signaling: allowed(pc.signalingState, ['stable', 'have-local-offer', 'have-remote-offer', 'have-local-pranswer', 'have-remote-pranswer', 'closed'])
  });
  const event = (peer, kind, value) => { if (report.events.length < 64) report.events.push({ peer, kind, value }); };
  async function operation(phase, fn) {
    report.phase = phase;
    let timer;
    try {
      return await Promise.race([Promise.resolve().then(fn), new Promise((_, reject) => {
        timer = timeout(() => reject({ diagnostic: 'operation-timeout' }), config.timeouts.operationMs);
      })]);
    } finally { clear(timer); }
  }
  function waitUntil(predicate, ms) {
    const deadline = Date.now() + ms;
    return new Promise((resolve, reject) => {
      const check = () => {
        try {
          if (predicate()) return resolve(true);
          if (Date.now() >= deadline) return resolve(false);
          timeout(check, Math.min(20, Math.max(1, deadline - Date.now())));
        } catch (error) { reject(error); }
      };
      check();
    });
  }
  async function gather(name) {
    report.phase = 'gather-' + name;
    const pc = peers[name];
    const complete = await waitUntil(() => pc.iceGatheringState === 'complete', config.timeouts.gatherMs);
    report.gathering[name] = complete ? 'complete' : 'timeout';
    report.sdpCandidateCount[name] = (pc.localDescription?.sdp?.match(/^a=candidate:/gm) || []).length;
    return complete;
  }
  function attach(name, channel) {
    channels[name] = channel;
    on(channel, 'open', () => event(name, 'channel', 'open'));
    on(channel, 'close', () => event(name, 'channel', 'closed'));
    on(channel, 'error', () => event(name, 'channel', 'error'));
    on(channel, 'message', e => {
      // Exact synthetic payloads only. Neither received bytes nor errors are logged.
      if (e.data === (name === 'a' ? 'native-probe:b:1' : 'native-probe:a:1')) report.received[name] = true;
    });
  }
  try {
    if (!report.capabilities.peerConnection) { report.outcome = 'webrtc-unavailable'; return report; }
    report.phase = 'construct';
    for (const name of ['a', 'b']) {
      const pc = new RTCPeerConnection(config.rtc); peers[name] = pc;
      on(pc, 'icecandidate', e => {
        if (!e.candidate || !e.candidate.candidate) return;
        report.candidates[name]++;
        const kind = allowed(e.candidate.type, ['host', 'srflx', 'prflx', 'relay']);
        report.candidateTypes[name][kind]++;
      });
      on(pc, 'icecandidateerror', e => {
        // errorText/url/address/port may contain sensitive information.
        if (Number.isInteger(e.errorCode) && e.errorCode >= 300 && e.errorCode <= 701 && report.iceErrorCodes.length < 16) report.iceErrorCodes.push(e.errorCode);
      });
      for (const [type, field] of [['icegatheringstatechange', 'gathering'], ['iceconnectionstatechange', 'ice'], ['connectionstatechange', 'connection']]) {
        on(pc, type, () => event(name, field, state(pc)[field]));
      }
    }
    on(peers.b, 'datachannel', e => attach('b', e.channel));
    attach('a', peers.a.createDataChannel('native-probe'));
    const offer = await operation('create-offer', () => peers.a.createOffer());
    await operation('local-offer', () => peers.a.setLocalDescription(offer));
    if (!await gather('a')) { report.outcome = 'gather-timeout'; return report; }
    await operation('remote-offer', () => peers.b.setRemoteDescription(peers.a.localDescription));
    const answer = await operation('create-answer', () => peers.b.createAnswer());
    await operation('local-answer', () => peers.b.setLocalDescription(answer));
    if (!await gather('b')) { report.outcome = 'gather-timeout'; return report; }
    if (config.scenario === 'normal') {
      if (!report.sdpCandidateCount.a || !report.sdpCandidateCount.b) {
        report.outcome = config.rtc.iceTransportPolicy === 'relay' && config.rtc.iceServers.length === 0
          ? 'relay-without-servers' : 'no-ice-candidates';
        return report;
      }
      await operation('remote-answer', () => peers.a.setRemoteDescription(peers.b.localDescription));
    }
    report.phase = 'connect';
    const connected = await waitUntil(() =>
      (channels.a?.readyState === 'open' && channels.b?.readyState === 'open') ||
      Object.values(peers).some(pc => pc.connectionState === 'failed' || pc.iceConnectionState === 'failed'), config.timeouts.connectMs);
    report.channelOpen = channels.a?.readyState === 'open' && channels.b?.readyState === 'open';
    if (!report.channelOpen) { report.outcome = connected ? 'ice-connection-failed' : 'connection-timeout'; return report; }
    report.phase = 'transfer';
    channels.a.send('native-probe:a:1'); channels.b.send('native-probe:b:1');
    report.transferVerified = await waitUntil(() => report.received.a && report.received.b, config.timeouts.transferMs);
    report.outcome = report.transferVerified ? 'native-transfer-verified' : 'transfer-timeout';
    // Stats are optional evidence, never a reason to expose the complete stats report.
    for (const name of ['a', 'b']) {
      try {
        const stats = await operation('stats-' + name, () => peers[name].getStats());
        const transport = [...stats.values()].find(item => item.type === 'transport' && item.selectedCandidatePairId);
        const pair = transport && stats.get(transport.selectedCandidatePairId);
        if (pair) {
          const local = stats.get(pair.localCandidateId), remote = stats.get(pair.remoteCandidateId);
          report.selectedPair[name] = {
            localType: allowed(local?.candidateType, ['host', 'srflx', 'prflx', 'relay']),
            remoteType: allowed(remote?.candidateType, ['host', 'srflx', 'prflx', 'relay']),
            protocol: allowed(local?.protocol, ['udp', 'tcp'])
          };
        }
      } catch { /* stats unavailable; do not log exception text */ }
    }
    // Prove DataChannel close handshake before forcing peer connections closed.
    if (report.transferVerified) {
      report.phase = 'channel-close'; channels.a.close();
      report.channelCloseHandshake = await waitUntil(() => channels.a.readyState === 'closed' && channels.b.readyState === 'closed', config.timeouts.closeMs);
      if (!report.channelCloseHandshake) report.outcome = 'channel-close-timeout';
    }
  } catch (error) {
    report.outcome = error?.diagnostic === 'operation-timeout' ? 'operation-timeout' : 'native-error';
    report.errorName = allowed(error?.name, ['NotSupportedError', 'InvalidStateError', 'OperationError', 'SecurityError', 'TypeError', 'SyntaxError', 'InvalidAccessError']);
  } finally {
    report.beforeClose = Object.fromEntries(Object.entries(peers).map(([name, pc]) => [name, state(pc)]));
    // Always attempt every resource even if one close operation throws.
    let closeError = false;
    for (const channel of Object.values(channels)) { try { channel.close(); } catch { closeError = true; } }
    for (const pc of Object.values(peers)) { try { pc.close(); } catch { closeError = true; } }
    const settled = await waitUntil(() => Object.values(channels).every(channel => channel.readyState === 'closed'), config.timeouts.closeMs);
    report.afterClose = Object.fromEntries(Object.entries(peers).map(([name, pc]) => [name, state(pc)]));
    report.cleanup = {
      peersCreated: Object.keys(peers).length, channelsCreated: Object.keys(channels).length,
      peersClosed: Object.values(peers).every(pc => pc.signalingState === 'closed' && pc.connectionState === 'closed'),
      channelsClosed: settled, closeError
    };
    report.cleanup.verified = !closeError && report.cleanup.peersClosed && report.cleanup.channelsClosed;
    if (!report.cleanup.verified && report.outcome === 'native-transfer-verified') report.outcome = 'cleanup-failed';
    for (const remove of listeners) remove();
    for (const timer of timers) clearTimeout(timer);
    timers.clear();
    report.elapsedMs = Date.now() - started;
  }
  return report;
}
module.exports = { probe };
