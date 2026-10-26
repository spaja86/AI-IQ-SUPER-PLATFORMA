import { DOCUMENT } from './model.mjs';
import { candidateSummary, connectionSummary } from './diagnostics.mjs';
import { SessionGate, validateSignal, pairingCode, to64, from64, MAX_BUFFER, LOW_BUFFER } from './protocol.mjs';
export class PeerSync {
  constructor(model, { onStatus = () => {}, onError = () => {}, onDiagnostics = () => {}, connectionTimeoutMs = 20000, rtcConfig = { iceServers: [] } } = {}) {
    if (model.incognito) throw Error('Inkognito isključuje uparivanje i slanje.');
    if (!Number.isInteger(connectionTimeoutMs) || connectionTimeoutMs < 1 || connectionTimeoutMs > 60000) throw Error('Neispravan vremenski limit veze.');
    this.onDiagnostics = onDiagnostics; this.connectionTimeoutMs = connectionTimeoutMs;
    this.model = model; this.onStatus = onStatus; this.onError = onError; this.rtcConfig = rtcConfig;
    this.pc = null; this.dc = null; this.gate = null; this.offer = null; this.answer = null;
    this.remoteReady = false; this.readySent = false; this.sentVector = false; this.pending = false; this.pendingVector = null;
    this.chain = Promise.resolve(); this.epoch = 0;
    this.unlisten = model.onChange(origin => { if (origin === 'local') { this.pending = true; this.flush(); } });
  }
  diagnostics() { return connectionSummary(this.pc, this.dc); }
  report() { this.onDiagnostics(this.diagnostics()); }
  fail(e) { this.report(); this.close(); this.onError(e); }
  armConnectionTimeout() {
    clearTimeout(this.connectionTimer);
    if (this.dc?.readyState === 'open') return;
    const epoch = this.epoch;
    this.connectionTimer = setTimeout(() => {
      if (epoch === this.epoch && this.pc && this.dc?.readyState !== 'open') this.fail(Error('WebRTC kanal nije otvoren u zadatom roku. Proverite mrežnu putanju, pa ponovo uparite uređaje.'));
    }, this.connectionTimeoutMs);
  }
  async create() {
    if (this.pc || this.creating) throw Error('Jedan učesnik po sesiji. Prvo opozovite prethodnu.');
    const epochBeforeCertificate = this.epoch; this.creating = true;
    let certificate;
    try { certificate = await RTCPeerConnection.generateCertificate({ name: 'ECDSA', namedCurve: 'P-256' }); }
    finally { this.creating = false; }
    if (epochBeforeCertificate !== this.epoch) throw Error('Uparivanje je opozvano.');
    this.pc = new RTCPeerConnection({ ...this.rtcConfig, certificates: [certificate] }); const epoch = this.epoch;
    this.pc.onconnectionstatechange = () => {
      if (epoch !== this.epoch) return;
      this.report(); this.onStatus(`WebRTC: ${this.pc.connectionState}`);
      if (this.pc.connectionState === 'failed') this.fail(Error('Veza je prekinuta. Ponovo uparite uređaje; offline izmene su sačuvane.'));
    };
    this.pc.oniceconnectionstatechange = () => { if (epoch === this.epoch) this.report(); };
    this.pc.onicegatheringstatechange = () => { if (epoch === this.epoch) this.report(); };
    this.pc.ondatachannel = e => {
      if (this.dc || e.channel.label !== 'spaja-bookmarks-v1' || !e.channel.ordered || e.channel.maxRetransmits !== null || e.channel.maxPacketLifeTime !== null) { e.channel.close(); this.fail(Error('Neočekivan kanal.')); return; }
      this.attach(e.channel);
    };
  }
  attach(dc) {
    this.dc = dc; dc.bufferedAmountLowThreshold = LOW_BUFFER; this.report();
    dc.onopen = () => { clearTimeout(this.connectionTimer); this.report(); this.onStatus('Kanal otvoren; potrebna potvrda otiska na oba uređaja.'); this.flush(); };
    dc.onbufferedamountlow = () => this.flush();
    const epoch = this.epoch;
    dc.onmessage = e => {
      // A ready frame may arrive while the human is still checking the independent code.
      // Keep at most one bounded ready frame, then validate it after local confirmation.
      if (!this.gate?.confirmed) {
        if (typeof e.data === 'string' && e.data.length < 1000 && !this.earlyReady) {
          try { const f = JSON.parse(e.data); if (f.type === 'ready' && f.seq === 1) this.earlyReady = e.data; } catch { /* discard unconfirmed input */ }
        }
        return;
      }
      this.chain = this.chain.then(async () => {
        if (epoch !== this.epoch) return;
        const f = this.gate.decode(e.data);
        if (f.type === 'ready') { this.remoteReady = true; this.onStatus('Oba uređaja potvrđena. Sinhronizacija je dozvoljena.'); this.flush(); }
        else {
          if (!this.remoteReady) throw Error('Učesnik nije potvrdio sesiju.');
          if (f.type === 'vector') this.pendingVector = from64(f.payload);
          else await this.model.apply(from64(f.payload));
          if (epoch === this.epoch) this.flush();
        }
      }).catch(e => { if (epoch === this.epoch) this.fail(e); });
    };
    dc.onclose = () => { if (epoch === this.epoch) this.close(); };
  }
  async gather() {
    const pc = this.pc; const epoch = this.epoch;
    if (!pc) throw Error('Sesija je zatvorena.');
    if (pc.iceGatheringState !== 'complete') await new Promise((resolve, reject) => {
      let timer;
      const cleanup = () => { clearTimeout(timer); pc.removeEventListener('icegatheringstatechange', done); pc.removeEventListener('connectionstatechange', closed); this.cancelGather = null; };
      const done = () => { if (pc.iceGatheringState === 'complete') { cleanup(); resolve(); } };
      const closed = () => { if (pc.connectionState === 'closed') { cleanup(); reject(Error('Uparivanje je opozvano.')); } };
      this.cancelGather = () => { cleanup(); reject(Error('Uparivanje je opozvano.')); };
      timer = setTimeout(() => { cleanup(); reject(Error('ICE prikupljanje je isteklo.')); }, 15000);
      pc.addEventListener('icegatheringstatechange', done); pc.addEventListener('connectionstatechange', closed); done();
    });
    if (epoch !== this.epoch || pc !== this.pc) throw Error('Uparivanje je opozvano.');
    this.report();
    if (candidateSummary(pc.localDescription?.sdp).total === 0) throw Error('ICE nije pronašao nijednog mrežnog kandidata. Proverite mrežu i podršku pregledača; bez kandidata nema putanje za prenos.');
  }
  async invite() {
    await this.create(); this.attach(this.pc.createDataChannel('spaja-bookmarks-v1', { ordered: true }));
    const session = crypto.randomUUID(); await this.pc.setLocalDescription(await this.pc.createOffer()); await this.gather();
    return this.offer = validateSignal({ v: 1, document: DOCUMENT, session, type: 'offer', sdp: this.pc.localDescription.sdp }, 'offer');
  }
  async accept(input) {
    const offer = validateSignal(input, 'offer'); await this.create(); this.offer = offer;
    await this.pc.setRemoteDescription({ type: 'offer', sdp: offer.sdp });
    await this.pc.setLocalDescription(await this.pc.createAnswer()); await this.gather();
    this.answer = validateSignal({ ...offer, type: 'answer', sdp: this.pc.localDescription.sdp }, 'answer');
    this.gate = new SessionGate(offer.session, 'answer', await pairingCode(offer, this.answer)); return this.answer;
  }
  async finish(input) {
    if (!this.offer || this.answer || !this.pc || this.gate) throw Error('Neočekivan odgovor.');
    const answer = validateSignal(input, 'answer');
    if (answer.session !== this.offer.session) throw Error('Odgovor nije za ovu sesiju.');
    await this.pc.setRemoteDescription({ type: 'answer', sdp: answer.sdp }); this.answer = answer;
    this.gate = new SessionGate(answer.session, 'offer', await pairingCode(this.offer, answer));
  }
  confirm(code) {
    if (!this.gate) throw Error('Prvo završite razmenu ponude i odgovora.');
    this.gate.confirm(code); this.armConnectionTimeout();
    if (this.earlyReady && this.dc?.onmessage) { const data = this.earlyReady; this.earlyReady = null; this.dc.onmessage({ data }); }
    this.flush();
    clearInterval(this.timer);
    this.timer = setInterval(() => { this.flush(); }, 500);
  }
  send(type, bytes = null) {
    const dc = this.dc;
    if (!dc || dc.readyState !== 'open' || dc.bufferedAmount + 100000 > MAX_BUFFER) return false;
    const raw = this.gate.encode(type, bytes ? to64(bytes) : '');
    const limit = this.pc?.sctp?.maxMessageSize;
    if (limit && raw.length > limit) throw Error('Poruka prelazi dogovoreni limit kanala; potreban je zaseban chunking adapter.');
    dc.send(raw); return true;
  }
  flush() {
    if (!this.gate?.confirmed || this.gate.revoked || this.dc?.readyState !== 'open') return;
    try {
      // Ready uses sequence 1 only once. The peer can confirm later: it must be
      // able to receive this first ready after confirmation without sequence gaps.
      if (!this.readySent) this.readySent = this.send('ready');
      if (!this.remoteReady) return;
      if (!this.sentVector) this.sentVector = this.send('vector', this.model.vector());
      if (this.pendingVector) { if (this.send('update', this.model.diff(this.pendingVector))) this.pendingVector = null; }
      if (this.pending) { if (this.send('update', this.model.snapshot())) this.pending = false; }
    } catch (e) { this.fail(e); }
  }
  close() {
    this.epoch++; this.cancelGather?.(); this.earlyReady = null; clearInterval(this.timer); clearTimeout(this.connectionTimer); this.gate?.revoke();
    if (this.dc) { this.dc.onclose = null; this.dc.onmessage = null; this.dc.close(); }
    if (this.pc) { this.pc.onconnectionstatechange = null; this.pc.oniceconnectionstatechange = null; this.pc.onicegatheringstatechange = null; this.pc.ondatachannel = null; this.pc.close(); }
    this.pc = null; this.dc = null; this.gate = null; this.offer = null; this.answer = null;
    this.remoteReady = false; this.readySent = false; this.sentVector = false; this.pendingVector = null; this.pending = false;
    this.chain = Promise.resolve(); this.report(); this.onStatus('Veza opozvana. Za nastavak je potrebno novo uparivanje.');
  }
  destroy() { this.close(); this.unlisten(); }
}
