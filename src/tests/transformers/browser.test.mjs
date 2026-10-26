import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = process.env.TRANSFORMERS_PLAYWRIGHT_MODULE
  ? require(process.env.TRANSFORMERS_PLAYWRIGHT_MODULE) : require('playwright');
const base = new URL(process.env.TRANSFORMERS_DEV_URL || 'http://127.0.0.1:3000');
assert.ok(['localhost', '127.0.0.1', '[::1]'].includes(base.hostname));
const name = 'TRANSFORMERS lokalni prototip';
let browser;
before(async () => {
  browser = await chromium.launch({
    ...(process.env.TRANSFORMERS_CHROME_PATH ? { executablePath: process.env.TRANSFORMERS_CHROME_PATH } : {}),
    args: ['--disable-dev-shm-usage'],
  });
  console.log(`Browser: Chromium ${browser.version()}`);
});
after(async () => { await browser?.close(); });
const region = p => p.getByRole('region', { name });
const button = (p, label) => region(p).getByRole('button', { name: label, exact: true });
const status = p => region(p).getByRole('status');
const arena = p => region(p).getByRole('img');
const label = (p, who = 'TI') => region(p).locator('svg text').filter({ hasText: new RegExp(`^${who} ·`) });
const point = (p, who) => label(p, who).evaluate(e => [Number(e.getAttribute('x')), Number(e.getAttribute('y'))]);
const snapshot = p => region(p).evaluate(e => ({ text: e.innerText, svg: e.querySelector('svg').outerHTML }));
async function open(t, options = {}, useClock = true) {
  const context = await browser.newContext({ serviceWorkers: 'block', ...options });
  t.after(() => context.close());
  const page = await context.newPage();
  page.setDefaultTimeout(30000);
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', e => { if (e.type() === 'error') console.log('CONSOLE', e.text().slice(0,500), e.location().url); });
  // Prevent any external requests from the application shell during local QA.
  await context.route('**/*', route => new URL(route.request().url()).origin === base.origin
    ? route.continue() : route.abort());
  t.after(() => assert.deepEqual(errors, [], 'Unhandled browser errors'));
  // Install before application code creates timers. Replacing existing timers after
  // start breaks interval/performance.now consistency and creates false failures.
  if (useClock) await page.clock.install({ time: new Date('2026-10-26T00:00:00Z') });
  // Next prefetch/background requests can outlive a ready UI. Require loaded
  // assets and the hydrated state transition below, not global network silence.
  await page.goto(new URL('/transformers', base).href, { waitUntil: 'load' });
  assert.equal(await status(page).innerText(), 'SPREMAN ZA DUEL?');
  if (useClock) await page.clock.pauseAt(new Date('2026-10-26T01:00:00Z'));
  await button(page, 'Pokreni duel').click();
  // Server HTML is insufficient: require an actual hydrated React state transition.
  await status(page).waitFor({ state: 'hidden' });
  if (useClock) await page.clock.runFor(50);
  return page;
}
async function hold(p, key, ms) {
  await region(p).focus(); await p.keyboard.down(key); await p.clock.runFor(ms); await p.keyboard.up(key);
}

test('start hydrates, both transformations complete, vehicle cannot fire', async t => {
  const p = await open(t);
  assert.equal(await button(p, 'Pauza').isEnabled(), true);
  await p.keyboard.press('t'); await p.clock.runFor(700);
  assert.match(await region(p).innerText(), /VOZILO/);
  assert.equal(await button(p, 'Napad · Space').isDisabled(), true);
  await p.keyboard.press('t'); await p.clock.runFor(700);
  assert.match(await region(p).innerText(), /ROBOT/);
  assert.equal(await button(p, 'Napad · Space').isEnabled(), true);
});

test('movement stops on key release; pause freezes everything and resume clears held input', async t => {
  const p = await open(t); const initial = await point(p);
  await hold(p, 'a', 500); const moved = await point(p); assert.notDeepEqual(moved, initial);
  await p.clock.runFor(500); assert.deepEqual(await point(p), moved);
  await region(p).focus(); await p.keyboard.down('d'); await p.keyboard.press('p');
  const paused = await snapshot(p); await p.clock.runFor(5000); assert.deepEqual(await snapshot(p), paused);
  await button(p, 'Nastavi duel').click(); const resumed = await point(p);
  await p.clock.runFor(500); assert.deepEqual(await point(p), resumed); await p.keyboard.up('d');
});

test('all four cameras select and cycle; planned 5–23 stay disabled; orbit changes projection', async t => {
  const p = await open(t); const select = region(p).getByLabel('Pogled kamere');
  assert.equal(await select.locator('option').count(), 23);
  assert.equal(await select.locator('option:disabled').count(), 19);
  const hp = await label(p).textContent();
  for (const id of ['2','3','4','1']) {
    await select.selectOption(id); assert.match(await arena(p).getAttribute('aria-label'), new RegExp(`kamera ${id},`));
    assert.equal(await label(p).textContent(), hp);
  }
  await arena(p).click({ position: { x: 20, y: 20 } });
  for (const id of ['2','3','4','1']) { await p.keyboard.press('c'); assert.equal(await select.inputValue(), id); }
  await select.selectOption('3'); const original = await point(p);
  await button(p, 'Rotiraj kameru udesno').click(); assert.notDeepEqual(await point(p), original);
  await select.selectOption('4');
  for (const who of ['TI','BOT']) { const [x,y] = await point(p, who); assert.ok(x>=0 && x<=800 && y>=0 && y<=520); }
});

test('bot reaches player behind obstacle without entering either expanded obstacle', async t => {
  const p = await open(t);
  await hold(p, 'w', 1000); await hold(p, 'd', 1000);
  let closest = Infinity;
  for (let i=0;i<100;i++) {
    await p.clock.runFor(50);
    const toWorld = ([x,y]) => [(x-400)/4.3+50, (y+43-260)/4.3+50];
    const [x,z] = toWorld(await point(p,'BOT')); const [px,pz] = toWorld(await point(p));
    assert.ok(x>=2 && x<=98 && z>=2 && z<=98);
    for (const [left,top,right,bottom] of [[38,33,54,47],[56,60,74,72]])
      assert.ok(!(x>left && x<right && z>top && z<bottom), `Bot entered obstacle at ${x},${z}`);
    closest = Math.min(closest, Math.hypot(x-px,z-pz));
  }
  assert.ok(closest<=19.1, `Bot remained ${closest} units away`);
});

test('continuous fire wins, finished result is stable, five resets restore the duel', async t => {
  const p = await open(t);
  await hold(p, ' ', 20000); assert.equal(await status(p).innerText(), 'POBEDA');
  const finished = await snapshot(p); await p.clock.runFor(2000); assert.deepEqual(await snapshot(p), finished);
  for (let i=0;i<5;i++) {
    await button(p, 'Novi duel').click(); assert.equal(await status(p).innerText(), 'SPREMAN ZA DUEL?');
    assert.equal((await label(p).textContent()).trim(), 'TI · 100 HP'); assert.equal((await label(p,'BOT').textContent()).trim(), 'BOT · 100 HP');
    assert.match(await region(p).innerText(), /90 s/);
    await button(p, 'Pokreni duel').click(); await p.clock.fastForward(90000);
    assert.equal(await status(p).innerText(), 'NEREŠENO');
  }
});

test('idle duel ends in defeat', async t => {
  const p=await open(t); await p.clock.runFor(25000); assert.equal(await status(p).innerText(),'PORAZ');
});

test('delayed callback expires at 90 seconds with bounded movement', async t => {
  const p=await open(t); await region(p).focus(); await p.keyboard.down('a');
  await p.clock.fastForward(90000); await p.keyboard.up('a');
  assert.equal(await status(p).innerText(),'NEREŠENO'); assert.match(await region(p).innerText(), /0 s/);
});

test('synthetic visibility change excludes hidden time and clears a held key', async t => {
  const p=await open(t); await region(p).focus(); await p.keyboard.down('a');
  await p.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});
  const hidden=await snapshot(p); await p.clock.runFor(20000); assert.deepEqual(await snapshot(p),hidden);
  await p.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>false});document.dispatchEvent(new Event('visibilitychange'));});
  const initial=await point(p); await p.clock.runFor(500); assert.deepEqual(await point(p),initial); await p.keyboard.up('a');
});

for (const width of [360,390,768]) test(`mobile ${width}px: no horizontal overflow and usable controls`, async t => {
  const p=await open(t,{ viewport:{width,height:844},isMobile:true,hasTouch:true });
  const dimensions=await p.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
  if (dimensions.scroll > width) console.log('OVERFLOW', JSON.stringify(await p.evaluate(() => Array.from(document.querySelectorAll('body *')).map(e => ({ tag:e.tagName, cls:e.className, width:e.getBoundingClientRect().width, right:e.getBoundingClientRect().right })).filter(e=>e.right>800).sort((a,b)=>b.width-a.width).slice(0,8))));
  if (process.env.TRANSFORMERS_SCREENSHOT_DIR) await p.screenshot({ path: `${process.env.TRANSFORMERS_SCREENSHOT_DIR}/mobile-${width}.png`, fullPage: false });
  assert.ok(dimensions.scroll<=width, JSON.stringify(dimensions));
  for (const text of ['Kretanje ←','Kretanje ↑','Kretanje ↓','Kretanje →','T · Transformiši']) {
    const rect=await button(p,text).boundingBox(); assert.ok(rect && rect.height>=44 && rect.x>=0 && rect.x+rect.width<=width);
  }
  await button(p,'T · Transformiši').tap(); await p.clock.runFor(700); assert.match(await region(p).innerText(),/VOZILO/);
  await button(p,'T · Transformiši').tap(); await p.clock.runFor(700); assert.equal(await button(p,'Napad · Space').isEnabled(),true);
  await button(p,'Pauza').tap(); const paused=await snapshot(p); await p.clock.runFor(1000); assert.deepEqual(await snapshot(p),paused);
  await button(p,'Nastavi duel').tap();
  for (const id of ['2','3','4','1']) await region(p).getByLabel('Pogled kamere').selectOption(id);
});

for (const ending of ['touchEnd','touchCancel']) test(`touch hold, drag outside, ${ending} releases movement`, async t => {
  const p=await open(t,{viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const left=button(p,'Kretanje ←'); await left.scrollIntoViewIfNeeded(); const rect=await left.boundingBox(); assert.ok(rect);
  const cdp=await p.context().newCDPSession(p); const x=rect.x+rect.width/2,y=rect.y+rect.height/2;
  const initial=await point(p);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]}); await p.clock.runFor(500);
  assert.notDeepEqual(await point(p),initial);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:Math.min(380,x+180),y:y-70}]});
  await cdp.send('Input.dispatchTouchEvent',{type:ending,touchPoints:[]});
  const stopped=await point(p); await p.clock.runFor(500); assert.deepEqual(await point(p),stopped);
});

test('native browser timers complete transformation and decrement the duel clock', async t => {
  const p = await open(t, {}, false);
  await button(p, 'T · Transformiši').click();
  await p.waitForFunction(() => document.querySelector('section[aria-label="TRANSFORMERS lokalni prototip"]').innerText.includes('VOZILO'));
  await button(p, 'T · Transformiši').click();
  await p.waitForFunction(() => !document.querySelector('section[aria-label="TRANSFORMERS lokalni prototip"]').innerText.includes('Transformacija…'));
  assert.equal(await button(p, 'Napad · Space').isEnabled(), true);
  assert.doesNotMatch(await region(p).innerText(), /\b90 s\b/);
});

for (const width of [768,1024,1280]) test(`navigation ${width}px: overflow is contained and last links remain keyboard accessible`, async t => {
  const p = await open(t, { viewport: { width, height: 900 } });
  const links = p.getByRole('region', { name: 'Linkovi glavne navigacije', exact: true });
  const layout = await links.evaluate(e => ({
    viewport: window.innerWidth, document: document.documentElement.scrollWidth,
    client: e.clientWidth, scroll: e.scrollWidth, left: e.getBoundingClientRect().left,
    right: e.getBoundingClientRect().right,
  }));
  assert.equal(layout.viewport, width);
  assert.ok(layout.document <= width, JSON.stringify(layout));
  assert.ok(layout.scroll > layout.client, 'Catalog remains scrollable inside its container');
  assert.ok(layout.left >= 0 && layout.right <= width);
  const first = links.getByRole('link').first();
  const login = links.getByRole('link', { name: '🔐 Prijava', exact: true });
  const last = links.getByRole('link', { name: 'Registracija', exact: true });
  await links.focus(); await p.keyboard.press('Tab');
  assert.equal(await first.evaluate(e => e === document.activeElement), true);
  await login.focus(); await p.keyboard.press('Tab');
  assert.equal(await last.evaluate(e => e === document.activeElement), true);
  const bounds = await last.boundingBox(); assert.ok(bounds && bounds.x >= layout.left && bounds.x + bounds.width <= layout.right + 1);
  assert.ok(await links.evaluate(e => e.scrollLeft > 0), 'Focus scrolls the last link into view');
  await p.keyboard.press('Shift+Tab'); assert.equal(await login.evaluate(e => e === document.activeElement), true);
  await first.focus();
  const firstBounds = await first.boundingBox(); assert.ok(firstBounds && firstBounds.x >= layout.left - 1);
  assert.ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  if (process.env.TRANSFORMERS_SCREENSHOT_DIR) await p.screenshot({ path: `${process.env.TRANSFORMERS_SCREENSHOT_DIR}/navigation-${width}.png` });
});

test('mobile menu at 360px opens, stays within viewport and closes with Escape', async t => {
  const p = await open(t, { viewport: { width: 360, height: 844 }, isMobile: true, hasTouch: true });
  await p.getByRole('button', { name: 'Otvori meni', exact: true }).tap();
  assert.equal(await p.getByRole('button', { name: 'Zatvori meni', exact: true }).getAttribute('aria-expanded'), 'true');
  assert.ok(await p.evaluate(() => document.documentElement.scrollWidth <= 360));
  await p.keyboard.press('Escape');
  assert.equal(await p.getByRole('button', { name: 'Otvori meni', exact: true }).getAttribute('aria-expanded'), 'false');
});

export { browser, base };
