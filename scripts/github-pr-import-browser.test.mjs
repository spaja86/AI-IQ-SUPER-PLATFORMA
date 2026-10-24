import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';

const { chromium } = await import(process.env.PR_IMPORT_PLAYWRIGHT_MODULE || 'playwright');
const base = new URL(process.env.PR_IMPORT_TEST_URL || 'http://127.0.0.1:3218');
assert.ok(['localhost', '127.0.0.1', '[::1]'].includes(base.hostname), 'Acceptance tests must run locally');
let browser, server;
before(async () => {
  if (process.env.PR_IMPORT_START_SERVER === '1') {
    server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', base.hostname, '--port', base.port || '3218'], { stdio: 'ignore' });
    let ready = false;
    for (let attempt = 0; attempt < 100; attempt++) {
      try { if ((await fetch(new URL('/github-pr-import', base))).ok) { ready = true; break; } } catch {}
      if (server.exitCode !== null) break;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    assert.ok(ready, 'Local production server must start');
  }
  browser = await chromium.launch({ executablePath: process.env.PR_IMPORT_CHROME_PATH, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
});
after(async () => { await browser?.close(); server?.kill('SIGTERM'); });
async function pageFor(t, width = 1280) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, acceptDownloads: true });
  const external = [], errors = [];
  await context.route('**/*', route => {
    if (new URL(route.request().url()).origin === base.origin) return route.continue();
    external.push(route.request().url()); return route.abort();
  });
  const page = await context.newPage(); page.setDefaultTimeout(10000);
  page.on('pageerror', error => errors.push(error.message));
  t.after(async () => { await context.close(); assert.deepEqual(external, []); assert.deepEqual(errors, []); });
  await page.goto(new URL('/github-pr-import', base).href);
  await page.getByRole('heading', { name: 'GitHub PR uvoz', exact: true }).waitFor();
  return page;
}
const time = '2026-10-22T07:20:48.756Z';
function fixture(number = 1, overrides = {}) {
  return { repository: 'spaja86/example', repository_visibility: 'public', number, id: number, title: `PR ${number}`, body: 'Opis', status: 'open', state: 'open', draft: number % 2 === 0, author: 'spaja86', created_at: time, updated_at: time, retrieved_at: time, merged_at: null, closed_at: null, head: { branch: 'feature', sha: 'a'.repeat(40) }, base: { branch: 'main', sha: 'b'.repeat(40) }, labels: [], url: `https://github.com/spaja86/example/pull/${number}`, ...overrides };
}
function payload(rows) { return { name: 'test.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ schema_version: '1.0', owner: 'spaja86', total: rows.length, pull_requests: rows })) }; }
async function importRows(page, rows) {
  await page.getByLabel('JSON paket naloga spaja86').setInputFiles(payload(rows));
  await page.locator('#import-status').filter({ hasText: `Uvezeno: ${rows.length} PR-a` }).waitFor();
}
test('pagination, combined filters, failed import recovery and clear', async t => {
  const page = await pageFor(t); await importRows(page, Array.from({ length: 41 }, (_, index) => fixture(index + 1)));
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Desktop page fits viewport');
  assert.equal(await page.getByRole('list', { name: 'PR rezultati' }).locator(':scope > li').count(), 20);
  await page.getByRole('button', { name: 'Sledeća', exact: true }).click();
  await page.getByText('Stranica 2 od 3', { exact: true }).waitFor();
  await page.getByLabel('Pretraga', { exact: true }).fill('#1 ');
  await page.getByRole('status', { name: 'Broj rezultata' }).filter({ hasText: 'Prikazano 11 od 41' }).waitFor();
  await page.getByRole('button', { name: 'Resetuj filtere' }).click();
  await page.getByLabel('Samo otvoreni draft PR-ovi').check(); await page.getByLabel('Status', { exact: true }).selectOption('merged');
  await page.getByText('Nema PR-ova za izabrane filtere.').waitFor();
  assert.ok(await page.getByRole('button', { name: 'Izvezi prikazane PR-ove' }).isDisabled());
  await page.getByLabel('JSON paket naloga spaja86').setInputFiles({ name: 'bad.json', mimeType: 'application/json', buffer: Buffer.from('{}') });
  await page.getByRole('alert').filter({ hasText: 'Prethodni uspešan uvoz je sačuvan' }).waitFor();
  await page.getByRole('button', { name: 'Ukloni podatke iz kartice' }).click();
  await page.getByText('Još nema uvezenih podataka.').waitFor();
});
test('private export, keyboard details, hostile text and worker activation preserve state', async t => {
  const page = await pageFor(t, 390);
  const body = '<img src="https://evil.test/pixel"><script>window.PR_IMPORT_XSS=true</script>\n![track](https://evil.test/track)';
  await importRows(page, [fixture(1, { body, repository_visibility: 'private' }), fixture(2)]);
  await page.evaluate(() => navigator.serviceWorker.dispatchEvent(new Event('controllerchange')));
  await page.getByLabel('Vidljivost', { exact: true }).selectOption('private');
  const details = page.getByRole('button', { name: 'Detalji #1', exact: true }); await details.focus(); await page.keyboard.press('Enter');
  assert.equal(await page.getByRole('region', { name: 'Detalji PR 1' }).locator('pre').textContent(), body);
  assert.equal(await page.evaluate(() => window.PR_IMPORT_XSS), undefined);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Mobile page fits viewport');
  const downloading = page.waitForEvent('download'); await page.getByRole('button', { name: 'Izvezi prikazane PR-ove' }).click();
  const downloaded = JSON.parse(await readFile(await (await downloading).path(), 'utf8'));
  assert.equal(downloaded.total, 1); assert.equal(downloaded.pull_requests[0].body, body);
  await page.reload(); await page.getByText('Još nema uvezenih podataka.').waitFor();
});
test('actual archive imports all 1254 records and filters states/visibility', { skip: !process.env.PR_IMPORT_SNAPSHOT }, async t => {
  const page = await pageFor(t);
  await page.getByLabel('JSON paket naloga spaja86').setInputFiles(process.env.PR_IMPORT_SNAPSHOT);
  await page.locator('#import-status').filter({ hasText: 'Uvezeno: 1254 PR-a' }).waitFor();
  await page.getByLabel('Status', { exact: true }).selectOption('open');
  await page.getByRole('status', { name: 'Broj rezultata' }).filter({ hasText: 'Prikazano 72 od 1254' }).waitFor();
  await page.getByRole('button', { name: 'Resetuj filtere' }).click(); await page.getByLabel('Vidljivost', { exact: true }).selectOption('private');
  await page.getByRole('status', { name: 'Broj rezultata' }).filter({ hasText: 'Prikazano 28 od 1254' }).waitFor();
});
test('workspace navigation reaches importer', async t => {
  const page = await pageFor(t, 390);
  await page.getByRole('link', { name: '← OMEGATROJEKTORIJUM' }).click();
  await page.getByRole('link', { name: /GitHub PR uvoz Uvezi SPAJA PR paket/ }).click();
  await page.getByRole('heading', { name: 'GitHub PR uvoz', exact: true }).waitFor();
});
