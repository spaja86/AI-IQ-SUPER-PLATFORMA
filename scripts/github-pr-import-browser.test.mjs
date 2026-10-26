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
    if (new URL(route.request().url()).origin === base.origin) {
      // The shared navigation has hundreds of links; prefetch is unrelated to
      // the importer and can overwhelm a local acceptance-test server.
      if (route.request().headers()['next-router-prefetch'] === '1') return route.abort();
      return route.continue();
    }
    external.push(route.request().url()); return route.abort();
  });
  const page = await context.newPage(); page.setDefaultTimeout(10000);
  page.on('pageerror', error => errors.push(error.message));
  t.after(async () => { await context.close(); assert.deepEqual(external, []); assert.deepEqual(errors, []); });
  const response = await page.goto(new URL('/github-pr-import', base).href);
  assert.equal(response.status(), 200, 'Importer route responds successfully');
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
async function watchExportSideEffects(page) {
  await page.evaluate(() => {
    window.PR_EXPORT_EFFECTS = { blobs: 0, urls: 0 };
    const OriginalBlob = window.Blob, createObjectURL = URL.createObjectURL;
    window.Blob = class extends OriginalBlob {
      constructor(...args) { super(...args); window.PR_EXPORT_EFFECTS.blobs++; }
    };
    URL.createObjectURL = function (blob) {
      window.PR_EXPORT_EFFECTS.urls++;
      return createObjectURL.call(URL, blob);
    };
  });
}
async function exportRows(page, accept = true) {
  const prompts = [];
  const onDialog = async dialog => {
    prompts.push({ type: dialog.type(), message: dialog.message() });
    await (accept ? dialog.accept() : dialog.dismiss());
  };
  page.on('dialog', onDialog);
  try {
    const downloading = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Izvezi prikazane PR-ove' }).click();
    const downloaded = JSON.parse(await readFile(await (await downloading).path(), 'utf8'));
    return { prompts, downloaded };
  } finally { page.off('dialog', onDialog); }
}
function assertConfirmation(prompts, nonPublic, total) {
  assert.equal(prompts.length, 1, 'Each non-public export requires fresh confirmation');
  assert.equal(prompts[0].type, 'confirm');
  assert.ok(prompts[0].message.includes(`Broj privatnih, internih ili neklasifikovanih zapisa: ${nonPublic} od ukupno ${total}.`));
  assert.ok(prompts[0].message.includes('Ovi zapisi biće uključeni u preuzetu JSON datoteku.'));
  assert.ok(prompts[0].message.includes('Otkaži'));
}

test('cancelled private export creates neither a Blob nor a download URL or file', async t => {
  const page = await pageFor(t); await importRows(page, [fixture(1, { repository_visibility: 'private' })]);
  await watchExportSideEffects(page);
  const prompts = [], downloads = [];
  page.on('dialog', async dialog => { prompts.push({ type: dialog.type(), message: dialog.message() }); await dialog.dismiss(); });
  page.on('download', download => downloads.push(download));
  await page.getByRole('button', { name: 'Izvezi prikazane PR-ove' }).click();
  assert.deepEqual(await page.evaluate(() => window.PR_EXPORT_EFFECTS), { blobs: 0, urls: 0 });
  assert.equal(downloads.length, 0);
  assertConfirmation(prompts, 1, 1);
});
test('public-only export downloads immediately without confirmation', async t => {
  const page = await pageFor(t); await importRows(page, [fixture(1), fixture(2)]);
  const { prompts, downloaded } = await exportRows(page);
  assert.deepEqual(prompts, []); assert.equal(downloaded.total, 2);
  assert.ok(downloaded.pull_requests.every(row => row.repository_visibility === 'public'));
});
test('mixed export counts all non-public records across pages and requires confirmation every time', async t => {
  const page = await pageFor(t);
  await importRows(page, [fixture(1, { repository_visibility: 'private' }), fixture(2, { repository_visibility: 'internal' }), fixture(3, { repository_visibility: undefined }), ...Array.from({ length: 22 }, (_, i) => fixture(i + 4))]);
  // All three non-public records are outside the first page.
  for (let attempt = 0; attempt < 2; attempt++) {
    const { prompts, downloaded } = await exportRows(page);
    assertConfirmation(prompts, 3, 25); assert.equal(downloaded.total, 25);
    assert.deepEqual(downloaded.pull_requests.filter(row => row.repository_visibility !== 'public').map(row => row.repository_visibility).sort(), ['internal', 'private', 'unknown']);
  }
});
test('filter changes and reset recalculate consent and export only the current selection', async t => {
  const page = await pageFor(t);
  await importRows(page, [fixture(1, { repository_visibility: 'private' }), fixture(2, { repository_visibility: 'internal' }), fixture(3, { repository_visibility: 'unknown' }), fixture(4)]);
  for (const [visibility, number] of [['private', 1], ['public', 4], ['internal', 2], ['unknown', 3], ['private', 1]]) {
    await page.getByLabel('Vidljivost', { exact: true }).selectOption(visibility);
    const { prompts, downloaded } = await exportRows(page);
    if (visibility === 'public') assert.deepEqual(prompts, []);
    else assertConfirmation(prompts, 1, 1);
    assert.deepEqual(downloaded.pull_requests.map(row => row.number), [number]);
  }
  await page.getByRole('button', { name: 'Resetuj filtere' }).click();
  let result = await exportRows(page); assertConfirmation(result.prompts, 3, 4);
  await page.getByLabel('Pretraga', { exact: true }).fill('#2');
  result = await exportRows(page); assertConfirmation(result.prompts, 1, 1);
  assert.deepEqual(result.downloaded.pull_requests.map(row => row.number), [2]);
  await page.getByLabel('Pretraga', { exact: true }).fill('no-matches');
  assert.ok(await page.getByRole('button', { name: 'Izvezi prikazane PR-ove' }).isDisabled());
});
test('replacement import and clear do not reuse earlier consent', async t => {
  const page = await pageFor(t);
  await importRows(page, [fixture(1, { repository_visibility: 'private' })]);
  assertConfirmation((await exportRows(page)).prompts, 1, 1);
  await importRows(page, [fixture(2, { repository_visibility: 'internal' }), fixture(3, { repository_visibility: 'unknown' })]);
  const result = await exportRows(page); assertConfirmation(result.prompts, 2, 2);
  assert.deepEqual(result.downloaded.pull_requests.map(row => row.number), [3, 2]);
  await page.getByRole('button', { name: 'Ukloni podatke iz kartice' }).click();
  assert.equal(await page.getByRole('button', { name: 'Izvezi prikazane PR-ove' }).count(), 0);
  await importRows(page, [fixture(4, { repository_visibility: 'private' })]);
  assertConfirmation((await exportRows(page)).prompts, 1, 1);
});
test('import, filtering, cancelled and confirmed export make no archive transport calls', async t => {
  const page = await pageFor(t);
  await page.evaluate(() => {
    window.PR_TRANSPORT_CALLS = [];
    const navigationPaths = new Set([...document.querySelectorAll('a[href]')].map(link => new URL(link.href)).filter(url => url.origin === location.origin).map(url => url.pathname));
    for (const name of ['fetch', 'WebSocket', 'EventSource']) {
      const Original = window[name];
      window[name] = new Proxy(Original, {
        apply(target, receiver, args) {
          const input = args[0], options = args[1] ?? {};
          const url = new URL(input instanceof Request ? input.url : String(input), location.href);
          const headers = new Headers(options.headers ?? (input instanceof Request ? input.headers : undefined));
          const method = options.method ?? (input instanceof Request ? input.method : 'GET');
          const body = options.body ?? (input instanceof Request ? input.body : null);
          // Permit only known, body-free framework navigation prefetches. All
          // other transports fail, even to our own origin. Never log payloads.
          const prefetch = name === 'fetch' && url.origin === location.origin && navigationPaths.has(url.pathname)
            && method === 'GET' && !body && headers.get('next-router-prefetch') === '1' && headers.get('rsc') === '1'
            && [...url.searchParams.keys()].every(key => key === '_rsc')
            && !`${url.href}${JSON.stringify([...headers])}`.includes('SYNTHETIC_PRIVATE_ONLY');
          if (!prefetch) window.PR_TRANSPORT_CALLS.push(name);
          return Reflect.apply(target, receiver, args);
        },
        construct(target, args) { window.PR_TRANSPORT_CALLS.push(name); return Reflect.construct(target, args); },
      });
    }
    const send = XMLHttpRequest.prototype.send, beacon = navigator.sendBeacon;
    XMLHttpRequest.prototype.send = function (...args) { window.PR_TRANSPORT_CALLS.push('xhr'); return send.apply(this, args); };
    navigator.sendBeacon = function (...args) { window.PR_TRANSPORT_CALLS.push('beacon'); return beacon.apply(this, args); };
  });
  await importRows(page, [fixture(1, { repository_visibility: 'private', body: 'SYNTHETIC_PRIVATE_ONLY' }), fixture(2)]);
  await page.getByLabel('Vidljivost', { exact: true }).selectOption('private');
  page.once('dialog', dialog => dialog.dismiss());
  await page.getByRole('button', { name: 'Izvezi prikazane PR-ove' }).click();
  assertConfirmation((await exportRows(page)).prompts, 1, 1);
  assert.deepEqual(await page.evaluate(() => window.PR_TRANSPORT_CALLS), []);
});
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
  const { prompts, downloaded } = await exportRows(page); assertConfirmation(prompts, 1, 1);
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
