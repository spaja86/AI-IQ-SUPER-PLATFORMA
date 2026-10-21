import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createRequire } from 'node:module';

// Optional test tooling, not a production dependency. Run against a local Next server.
const { chromium } = createRequire(import.meta.url)(process.env.SUPEROMEGA_PLAYWRIGHT_MODULE || 'playwright');
const origin = process.env.SUPEROMEGA_BASE_URL || 'http://127.0.0.1:3210';
if (!['127.0.0.1', 'localhost', '[::1]'].includes(new URL(origin).hostname)) throw new Error('Use a loopback test server');
let browser;
before(async () => { browser = await chromium.launch({ headless: true,
  ...(process.env.SUPEROMEGA_CHROMIUM_EXECUTABLE ? { executablePath: process.env.SUPEROMEGA_CHROMIUM_EXECUTABLE } : {}),
  args: JSON.parse(process.env.SUPEROMEGA_CHROMIUM_ARGS || '[]'),
}); });
after(async () => { await browser?.close(); });

async function fixture(t, width = 1280) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, serviceWorkers: 'block' });
  await context.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  t.after(async () => { await context.close(); assert.deepEqual(errors, []); });
  await page.goto(origin + '/superomegatrajektorijum');
  await page.getByRole('heading', { level: 1, name: 'SUPEROMEGATRAJEKTORIJUM', exact: true }).waitFor();
  const section = page.locator('section[aria-labelledby="registry-title"]');
  return { page, section };
}

test('browse, combine filters, empty state, reset and pagination without activation', async t => {
  const { page, section } = await fixture(t);
  const requests = [];
  page.on('request', request => requests.push({ method: request.method(), url: request.url() }));
  assert.equal(await section.locator('[data-registry-id]').count(), 20);
  await section.getByRole('button', { name: 'Sledeća', exact: true }).click();
  assert.match(await section.getByRole('status').innerText(), /strana 2/);
  await section.getByLabel('Tip servisa', { exact: true }).selectOption('concept');
  assert.match(await section.getByRole('status').innerText(), /1325 rezultata · strana 1/);
  await section.getByLabel('Pretraga registra').fill('OMEGA-0001');
  assert.equal(await section.locator('[data-registry-id]').count(), 1);
  await section.getByLabel('Stanje implementacije').selectOption('local');
  assert.match(await section.innerText(), /Nema rezultata/);
  await section.getByRole('button', { name: 'Poništi filtere' }).click();
  await section.getByLabel('Provera dostupnosti', { exact: true }).selectOption('available');
  assert.match(await section.getByRole('status').innerText(), /0 rezultata/);
  await section.getByRole('button', { name: 'Poništi filtere' }).click();
  assert.equal(await section.locator('[data-registry-id]').count(), 20);
  assert(!requests.some(r => r.method !== 'GET' || /\/api\/deploy|\/api\/runs|vercel|chatgpt\.site/.test(r.url)), JSON.stringify(requests));
});

test('deployment details distinguish configured active and historical evidence', async t => {
  const { section } = await fixture(t);
  await section.getByLabel('Tip servisa', { exact: true }).selectOption('deployment');
  const card = section.locator('[data-registry-id="deploy:ai-iq-super-platforma"]');
  await card.locator('summary').click();
  const text = await card.innerText();
  assert.match(text, /Konfiguracioni status\s+aktivan/);
  assert.match(text, /Dostupnost nije proverena/);
  assert.match(text, /Istorijski nepotvrđen/);
  assert(!text.includes('Dostupno — provereno'));
});

test('shared idea expansion remains available and keyboard details work', async t => {
  const { page, section } = await fixture(t);
  await section.getByLabel('Pretraga registra').fill('concept:OMEGA-0001');
  const summary = section.locator('[data-registry-id] > details > summary');
  await summary.focus(); await page.keyboard.press('Enter');
  const idea = section.locator('[data-registry-id] details details');
  await idea.locator('summary').click();
  assert.equal(await idea.locator('ol > li').count(), 80);
  assert.match(await idea.innerText(), /OMEGA-0001-K01/);
});

test('Sites and local Omega keep their boundaries and correct destinations', async t => {
  const { section } = await fixture(t);
  await section.getByLabel('Pretraga registra').fill('app:omega-pilot');
  const pilot = section.locator('[data-registry-id]');
  assert.match(await pilot.getByRole('link', { name: 'Uputstvo za lokalni pilot' }).getAttribute('href'), /VRH-OMEGA-SKELETON.md$/);
  await pilot.locator('summary').click();
  assert.match(await pilot.innerText(), /\/omega nije ruta glavne Next.js/);
  await section.getByLabel('Pretraga registra').fill('app:spaja-sites');
  const sites = section.locator('[data-registry-id]');
  assert.equal(await sites.getByRole('link', { name: 'Otvori adresu' }).getAttribute('href'), 'https://spaja-deploy.able-mesa-4439.chatgpt.site/');
  await sites.locator('summary').click();
  assert.match(await sites.innerText(), /nisu nezavisno potvrđene/);
});

test('registry fits mobile and tablet widths, including long addresses', async t => {
  const { page, section } = await fixture(t, 390);
  await section.getByLabel('Tip servisa', { exact: true }).selectOption('deployment');
  await section.locator('summary').nth(2).click();
  for (const width of [390, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    const dimensions = await section.evaluate(el => ({ width: el.clientWidth, content: el.scrollWidth }));
    assert(dimensions.content <= dimensions.width + 1, `${width}: ${JSON.stringify(dimensions)}`);
    const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    assert(documentWidth <= width + 1, `Navigation/page overflow at ${width}: ${documentWidth}`);
  }
});
