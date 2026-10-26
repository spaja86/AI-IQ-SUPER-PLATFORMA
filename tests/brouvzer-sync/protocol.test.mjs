import test from 'node:test';
import assert from 'node:assert/strict';
import { SessionGate, pairingCode, validateSignal, MAX_BUFFER } from '../../pilot/brouvzer/protocol.mjs';
import { DOCUMENT, BookmarkModel } from '../../pilot/brouvzer/model.mjs';
import { PeerSync } from '../../pilot/brouvzer/transport.mjs';
const id='12345678-1234-1234-1234-123456789abc';
const sdp='v=0\r\nm=application 9 UDP/DTLS/SCTP webrtc-datachannel\r\na=fingerprint:sha-256 '+Array(32).fill('AB').join(':')+'\r\n';
const signal=type=>({v:1,document:DOCUMENT,session:id,type,sdp});
test('pairing digest binds full SDP, session and document',async()=>{
  const code=await pairingCode(signal('offer'),signal('answer')); assert.equal(code.length,64);
  assert.notEqual(code,await pairingCode({...signal('offer'),sdp:sdp+'a=x-test\r\n'},signal('answer')));
  await assert.rejects(pairingCode(signal('offer'),{...signal('answer'),session:crypto.randomUUID()}));
  assert.throws(()=>validateSignal({...signal('offer'),sdp:sdp+'m=audio 9 foo\r\n'},'offer'));
});
test('no messages before confirmation, invalid peer code, replay, tampering and revocation',()=>{
  const a=new SessionGate(id,'offer','expected'),b=new SessionGate(id,'answer','expected');
  assert.throws(()=>a.encode('ready')); assert.throws(()=>a.confirm('wrong')); a.confirm('expected'); b.confirm('expected');
  const raw=a.encode('ready'); assert.equal(b.decode(raw).type,'ready'); assert.throws(()=>b.decode(raw));
  for(const patch of [{document:'other'},{session:crypto.randomUUID()},{from:'answer'},{seq:100},{type:'evil'}]){
    assert.throws(()=>b.decode(JSON.stringify({...JSON.parse(raw),seq:2,...patch})));
  }
  assert.throws(()=>b.decode(JSON.stringify({...JSON.parse(raw),seq:2,type:'update',payload:'!'})));
  b.revoke(); assert.throws(()=>b.decode(a.encode('ready')));
});
test('incognito cannot instantiate a peer',()=>assert.throws(()=>new PeerSync(new BookmarkModel({incognito:true})),/Inkognito/));
test('flow control retains pending state and sends latest snapshot after buffer drains',async()=>{
  const model=new BookmarkModel(); const peer=new PeerSync(model); const frames=[];
  peer.gate=new SessionGate(id,'offer','code'); peer.gate.confirm('code'); peer.remoteReady=true; peer.readySent=true;peer.sentVector=true;
  peer.dc={readyState:'open',bufferedAmount:MAX_BUFFER,send:s=>frames.push(s),close:()=>{}};
  await model.put('x',{title:'test',url:'https://example.com/'}); assert.equal(frames.length,0);assert.equal(peer.pending,true);
  peer.dc.bufferedAmount=0;peer.flush();assert.equal(frames.length,1);assert.equal(peer.pending,false);peer.destroy();
});
test('two channel adapters with delayed second confirmation converge; revoke stops exchange (mock transport)',async()=>{
  const aModel=new BookmarkModel(),bModel=new BookmarkModel();await aModel.put('a',{title:'A',url:'https://example.com/'});await bModel.put('b',{title:'B',url:'https://example.com/'});
  const errors=[];const a=new PeerSync(aModel,{onError:e=>errors.push(e)}),b=new PeerSync(bModel,{onError:e=>errors.push(e)});
  const channel=()=>({label:'spaja-bookmarks-v1',ordered:true,maxRetransmits:null,maxPacketLifeTime:null,readyState:'open',bufferedAmount:0,close(){this.readyState='closed';}});
  const ac=channel(),bc=channel();ac.send=s=>queueMicrotask(()=>bc.onmessage?.({data:s}));bc.send=s=>queueMicrotask(()=>ac.onmessage?.({data:s}));
  a.attach(ac);b.attach(bc);a.gate=new SessionGate(id,'offer','code');b.gate=new SessionGate(id,'answer','code');
  a.confirm('code');await new Promise(resolve=>setImmediate(resolve));assert.equal(aModel.rows().length,1);assert.equal(bModel.rows().length,1);
  b.confirm('code');for(let i=0;i<20;i++){await new Promise(resolve=>setImmediate(resolve));await a.chain;await b.chain;}
  assert.deepEqual(aModel.rows(),bModel.rows());assert.equal(aModel.rows().length,2);assert.deepEqual(errors,[]);
  a.close();b.close();await aModel.put('after',{title:'local',url:'https://example.com/'});assert.equal(bModel.rows().length,2);a.destroy();b.destroy();
});
test('concurrent pairing is rejected and revocation cancels pending certificate creation',async()=>{
  const original=globalThis.RTCPeerConnection;let release;
  class FakeRTC { static generateCertificate(){return new Promise(resolve=>{release=resolve;});} }
  globalThis.RTCPeerConnection=FakeRTC;
  const peer=new PeerSync(new BookmarkModel());
  try{const creating=peer.create();await assert.rejects(peer.create(),/Jedan učesnik/);peer.close();release({});await assert.rejects(creating,/opozvano/);assert.equal(peer.pc,null);}finally{peer.destroy();globalThis.RTCPeerConnection=original;}
});
