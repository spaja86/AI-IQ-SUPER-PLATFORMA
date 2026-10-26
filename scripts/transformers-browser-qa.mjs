// Compatible entry point: current duel coverage plus existing catalog launch scenarios.
// Run against an already running loopback server, or use run-transformers-browser.mjs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { browser, base } from '../src/tests/transformers/browser.test.mjs';

for (const route of ['/industrija', '/spaja-digitalni-brouvzer']) {
  test(`catalog click through ${route} reaches dedicated runner`, {
    skip: route === '/industrija' && !process.env.TRANSFORMERS_AUTH_STATE
      ? '/industrija uses AuthGuard; requires a legitimate local Playwright storageState file' : false,
  }, async t => {
    const context = await browser.newContext(process.env.TRANSFORMERS_AUTH_STATE
      ? { storageState: process.env.TRANSFORMERS_AUTH_STATE } : {});
    t.after(() => context.close());
    await context.route('**/*', route => new URL(route.request().url()).origin === base.origin ? route.continue() : route.abort());
    const page = await context.newPage();
    await page.goto(new URL(route, base).href, { waitUntil: 'load' });
    const link = page.locator('a[href="/spaja-digitalni-brouvzer?igricaId=igrica-transformers-1350"]');
    await link.waitFor({ state: 'visible', timeout: 30000 });
    assert.equal(await link.count(), 1, 'Unique native launch link');
    await link.click();
    await page.waitForURL(url => url.searchParams.get('igricaId') === 'igrica-transformers-1350');
    assert.equal(new URL(page.url()).searchParams.get('igricaId'), 'igrica-transformers-1350');
    await page.getByRole('button', { name: /^360D/ }).click();
    await page.getByRole('button', { name: 'Pokreni duel', exact: true }).waitFor({ timeout: 30000 });
    assert.equal(await page.getByRole('heading', { name: 'Nedozvoljen URL', exact: true }).count(), 0);
    await page.getByRole('button', { name: 'Pokreni duel', exact: true }).click();
    assert.equal(await page.getByRole('button', { name: 'Pauza', exact: true }).isEnabled(), true);
  });
}
