// Independent native WebRTC probe: no SPAJA transport, CRDT or pairing code.
// Uses an externally installed Playwright; alternate Chromium is optional.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
(async () => {
  const alternate = process.env.CHROMIUM_MODULE ? require(process.env.CHROMIUM_MODULE) : null;
  const args = alternate?.args.filter(s => s !== '--single-process').map(s => s.startsWith('--disable-features=') ? s + ',WebRtcHideLocalIpsWithMdns' : s).concat('--allow-loopback-in-peer-connection');
  const browser = await chromium.launch({ headless: true, ...(alternate ? { executablePath: process.env.CHROMIUM_EXECUTABLE || await alternate.executablePath(), args } : {}) });
  try {
    const page = await browser.newPage();
    const result = await page.evaluate(async () => {
      const a = new RTCPeerConnection({ iceServers: [] }), b = new RTCPeerConnection({ iceServers: [] });
      const events = [], count = { a: 0, b: 0 }; let open = false;
      for (const [name, pc] of [['a', a], ['b', b]]) {
        pc.onicecandidate = e => { if (e.candidate) count[name]++; };
        pc.onicegatheringstatechange = () => events.push([name, 'gathering', pc.iceGatheringState]);
        pc.oniceconnectionstatechange = () => events.push([name, 'ice', pc.iceConnectionState]);
      }
      const dc = a.createDataChannel('native-probe'); dc.onopen = () => { open = true; };
      const gather = pc => new Promise(resolve => {
        if (pc.iceGatheringState === 'complete') return resolve();
        const timer = setTimeout(resolve, 6000);
        pc.addEventListener('icegatheringstatechange', () => { if (pc.iceGatheringState === 'complete') { clearTimeout(timer); resolve(); } });
      });
      await a.setLocalDescription(await a.createOffer()); await gather(a);
      await b.setRemoteDescription(a.localDescription); await b.setLocalDescription(await b.createAnswer()); await gather(b);
      await a.setRemoteDescription(b.localDescription); await new Promise(resolve => setTimeout(resolve, 6000));
      const state = pc => ({ ice: pc.iceConnectionState, connection: pc.connectionState, gathering: pc.iceGatheringState });
      const result = { nativeOnly: true, candidates: count, sdpCandidateCount: { a: (a.localDescription.sdp.match(/^a=candidate:/gm) || []).length, b: (b.localDescription.sdp.match(/^a=candidate:/gm) || []).length }, channelOpen: open, a: state(a), b: state(b), events };
      a.close(); b.close(); return result;
    });
    // A closed channel is an observed failure/limitation, never a passing RTC test.
    console.log(JSON.stringify({ browser: browser.version(), outcome: result.channelOpen ? 'native-channel-open' : 'native-channel-not-open', ...result }, null, 2));
    if (!result.channelOpen) process.exitCode = 2;
  } finally { await browser.close(); }
})().catch(e => { console.error(e.message); process.exitCode = 1; });
