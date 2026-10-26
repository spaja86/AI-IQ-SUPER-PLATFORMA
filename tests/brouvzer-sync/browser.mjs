// Optional real-browser acceptance check. Set PLAYWRIGHT_MODULE to an installed
// playwright entrypoint. Test tooling is separate from production dependencies.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { startServer } from '../../pilot/brouvzer/server.mjs';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const app = await startServer(0);
let browser; let observed = []; const results = [];
try {
  const alternate = process.env.CHROMIUM_MODULE ? require(process.env.CHROMIUM_MODULE) : null;
  browser = await chromium.launch({ headless: true, ...(alternate ? { executablePath: process.env.CHROMIUM_EXECUTABLE || await alternate.executablePath(), args: alternate.args.filter(s => s !== '--single-process').map(s => s.startsWith('--disable-features=') ? s + ',WebRtcHideLocalIpsWithMdns' : s).concat('--allow-loopback-in-peer-connection') } : {}) });
  const aContext = await browser.newContext(), bContext = await browser.newContext();
  const a = await aContext.newPage(), b = await bContext.newPage(); observed = [a,b];
  const errors=[]; for(const page of [a,b]) page.on('pageerror',e=>errors.push(e.message));
  await Promise.all([a.goto(app.origin), b.goto(app.origin)]);
  const ready=page=>page.locator('#save').waitFor({state:'visible'}).then(()=>page.waitForFunction(()=>!document.querySelector('#save').disabled));
  await Promise.all([ready(a),ready(b)]);
  const add = async(page,title)=>{await page.locator('#title').fill(title);await page.locator('#save').click();await page.waitForFunction(t=>document.querySelector('#rows').textContent.includes(t),title);};
  await add(a,'A-offline');await add(b,'B-offline');
  assert.equal(await a.locator('#rows li').count(),1);assert.equal(await b.locator('#rows li').count(),1);results.push('offline independent edits');
  async function signalReady(page, type) {
    await page.waitForFunction(t => document.querySelector('#outgoing').value.includes(t) || !document.querySelector('#error').hidden, type);
    if (await page.locator('#error').isVisible()) throw Error(await page.locator('#error').textContent());
  }
  async function pair({testGate=false}={}) {
    await a.locator('#invite').click();await signalReady(a, 'offer');
    const offer=await a.locator('#outgoing').inputValue();
    await b.locator('#incoming').fill(offer);await b.locator('#accept').click();await signalReady(b, 'answer');
    const answer=await b.locator('#outgoing').inputValue();
    await a.locator('#incoming').fill(answer);await a.locator('#finish').click();
    await Promise.all([a.waitForFunction(()=>document.querySelector('#code').textContent.length===64),b.waitForFunction(()=>document.querySelector('#code').textContent.length===64)]);
    const code=await a.locator('#code').textContent(); assert.equal(code,await b.locator('#code').textContent());
    await a.locator('#peerCode').fill(code);await a.locator('#confirm').click();
    if(testGate){
      // Wait on a real browser observation rather than assuming an open channel implies approval.
      await b.waitForFunction(()=>document.querySelector('#network').textContent.includes('kanal: open'));
      assert.equal(await a.locator('#rows li').count(),1);assert.equal(await b.locator('#rows li').count(),1);
      results.push('one-sided confirmation does not exchange bookmarks');
    }
    await b.locator('#peerCode').fill(code);await b.locator('#confirm').click();
    await Promise.all([a.waitForFunction(()=>document.querySelector('#status').textContent.includes('Oba uređaja')),b.waitForFunction(()=>document.querySelector('#status').textContent.includes('Oba uređaja'))]);
  }
  await pair({testGate:true});
  await Promise.all([a.waitForFunction(()=>document.querySelectorAll('#rows li').length===2),b.waitForFunction(()=>document.querySelectorAll('#rows li').length===2)]);
  results.push('real WebRTC DataChannel two-way initial convergence');
  await add(a,'A-online');await b.waitForFunction(()=>document.querySelector('#rows').textContent.includes('A-online'));results.push('live update reaches peer');
  await a.locator('#revoke').click();await b.waitForFunction(()=>!document.querySelector('#invite').disabled);
  await add(a,'A-after-revoke');assert.equal(await b.locator('#rows li').count(),3);results.push('revocation stops application transport');
  await b.reload();await ready(b);assert.equal(await b.locator('#rows li').count(),3);results.push('IndexedDB survives page reload');
  await pair();await b.waitForFunction(()=>document.querySelector('#rows').textContent.includes('A-after-revoke'));results.push('fresh pairing recovers offline changes');
  // A duplicate response/third participant cannot replace the existing authenticated session.
  assert.equal(await b.locator('#accept').isDisabled(),true);results.push('second participant slot is closed after pairing');
  const inc=await aContext.newPage();await inc.goto(app.origin+'/?inkognito=1');await ready(inc);
  assert.equal(await inc.locator('#rows li').count(),0);assert.equal(await inc.locator('#invite').isDisabled(),true);
  await add(inc,'Secret-test-only');await inc.reload();await ready(inc);assert.equal(await inc.locator('#rows li').count(),0);results.push('incognito has no saved rows and no networking');
  await a.locator('#revoke').click();
  await b.waitForFunction(()=>!document.querySelector('#invite').disabled);
  // Wrong independent code fails closed, without sending model data.
  await a.locator('#invite').click();await signalReady(a, 'offer');
  await b.locator('#incoming').fill(await a.locator('#outgoing').inputValue());await b.locator('#accept').click();await b.waitForFunction(()=>document.querySelector('#code').textContent.length===64);
  await b.locator('#peerCode').fill('0'.repeat(64));await b.locator('#confirm').click();await b.locator('#error').waitFor({state:'visible'});assert.match(await b.locator('#error').textContent(),/Otisci/);results.push('wrong independently verified code revokes session');
  await a.setViewportSize({width:390,height:844});assert.equal(await a.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);results.push('390px layout without horizontal overflow');
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({browser:browser.version(),originScope:'loopback',results,tests:results.length,pass:results.length,turn:'not tested',realDevices:'not tested'},null,2));
} catch(e) { for(const page of observed) console.error(JSON.stringify({ status: await page.locator('#status').textContent(), network: await page.locator('#network').textContent(), error: await page.locator('#error').textContent() })); throw e; } finally { await browser?.close();await app.close(); }
