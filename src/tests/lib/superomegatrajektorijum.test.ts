import assert from 'node:assert/strict';
import { test } from 'node:test';
import { existsSync, readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { buildSuperOmegaRegistry, portfolioContext, REGISTRY_PATH } from '../../lib/superomegatrajektorijum/registry';
import { availabilityOf, AVAILABILITY_MAX_AGE_MS, filterRegistry, isRegistryAddress, validateRegistry, type RegistryEntry } from '../../lib/superomegatrajektorijum/model';
import { omegaItems } from '../../lib/omegatrojektorijum';
import { omegaProjects } from '../../lib/omegatrojektorijum-projects';
import { deployRegistry } from '../../lib/deploy/deploy-registry';
import { platforme } from '../../lib/platforme';
import { OMEGA_SKELETON } from '../../lib/suoc-pilot/omega';
import { navigation } from '../../lib/navigation';
import SuperOmegaPage from '../../app/superomegatrajektorijum/page';
import { GET as portfolioGET } from '../../app/api/deploy-portfolio/route';

const now = Date.parse('2026-10-21T12:00:00Z');
const entries = buildSuperOmegaRegistry();
const byId = (id: string) => entries.find(entry => entry.id === id)!;
function checkedEntry(): RegistryEntry {
  const entry = structuredClone(byId('app:spaja-sites'));
  entry.availability = { address: entry.address, checkedAt: new Date(now).toISOString(), method: 'http-smoke', result: 'passed', scope: 'HTML response + expected application marker', evidenceUrl: 'https://example.org/evidence/smoke-1' };
  return entry;
}

test('all source records are represented once with stable namespaced identities', () => {
  assert.doesNotThrow(() => validateRegistry(entries));
  for (const [kind, source, id] of [
    ['concept', omegaItems, 'concept:'], ['platform', platforme, 'platform:'],
    ['deployment', deployRegistry, 'deploy:'], ['module', OMEGA_SKELETON.modules, 'omega:'],
  ] as const) {
    assert.deepEqual(entries.filter(e => e.kind === kind).map(e => e.id), source.map(item => `${id}${item.id}`));
  }
  assert.equal(entries.filter(e => e.kind === 'repository').length, omegaProjects.length);
  assert.deepEqual(entries.map(e => e.id), buildSuperOmegaRegistry().map(e => e.id));
  assert.equal(new Set(entries.map(e => e.id)).size, entries.length);
});

test('source configuration never promotes an entry to live availability', () => {
  const original = deployRegistry[0].status;
  try {
    for (const status of ['aktivan', 'u_pripremi', 'neaktivan', 'greska'] as const) {
      deployRegistry[0].status = status;
      const projected = buildSuperOmegaRegistry().find(e => e.id === `deploy:${deployRegistry[0].id}`)!;
      assert.equal(projected.status, 'documented');
      assert.equal(availabilityOf(projected, now), 'unknown');
      assert.equal(projected.metadata!['Konfiguracioni status'], status);
    }
  } finally { deployRegistry[0].status = original; }
  assert(entries.every(entry => availabilityOf(entry, now) === 'unknown'));
});

test('concepts, local implementations, Sites and planned integration stay distinct', () => {
  assert(entries.filter(e => e.kind === 'concept').every(e => e.status === 'concept'));
  assert.equal(byId('app:studio').status, 'local');
  assert.equal(byId('app:spaja-sites').status, 'documented');
  assert.equal(byId('integration:sites-registry').status, 'planned');
  assert.match(byId('app:spaja-local-adapter').evidence.scope, /Nema build workera/);
  assert.equal(byId('app:spaja-local-adapter').metadata!['Podrazumevano izvršavanje'], 'disabled');
});

test('Omega uses the imported main catalog and a pilot documentation link', () => {
  const pilot = byId('app:omega-pilot');
  assert.equal(pilot.addressScope, 'local-pilot');
  assert.match(pilot.address, /docs\/VRH-OMEGA-SKELETON.md$/);
  assert.equal(pilot.metadata!['Opisane veze u ovoj reviziji'], String(OMEGA_SKELETON.links.length));
  assert.equal(pilot.metadata!['Razvojni cilj, ne aktivne integracije'], '270');
  assert.match(pilot.metadata!['Zaseban predlog razvoja'], /pull\/1365$/);
  assert(!entries.some(e => e.address === '/omega'));
});

test('all local application paths and pinned local source files exist', () => {
  for (const entry of entries) {
    if (entry.addressScope === 'application') assert(existsSync(`src/app${entry.address}/page.tsx`), entry.id);
    for (const url of [entry.source.url, entry.evidence.url]) {
      const path = url.split('/blob/f6c2be5b25d5849193c9067b1f3f5aa67480d4ef/')[1];
      if (path) assert(existsSync(path), path);
    }
  }
});

test('no deploy secrets, env names, provider IDs or unverified progress are projected', () => {
  const json = JSON.stringify(entries);
  for (const forbidden of ['deployHookEnvVar', 'VERCEL_DEPLOY_HOOK', 'vercelProjectId', 'progress', 'progres']) assert(!json.includes(forbidden), forbidden);
  assert.match(byId('repo:spaja86/kompanija-spaja').metadata!['Pristup'], /Privatan/);
});

test('portfolio targets are shared and historical success is not a health record', async () => {
  const response = await portfolioGET();
  const body = await response.json();
  assert.deepEqual(body.kpi_snapshot, portfolioContext.kpiTargets);
  assert.equal(body.deployment_evidence.historical_record.status, 'success');
  assert(entries.filter(e => e.kind === 'deployment').every(e => e.availability === null));
});

test('registry construction and rendering invoke no fetch, provider or mutation', () => {
  const original = globalThis.fetch;
  globalThis.fetch = () => { throw new Error('No network in registry'); };
  try {
    assert.equal(buildSuperOmegaRegistry().length, entries.length);
    const html = renderToStaticMarkup(createElement(SuperOmegaPage));
    assert.match(html, /SUPEROMEGATRAJEKTORIJUM/);
    assert.match(html, /0 sa važećom potvrdom dostupnosti/);
    assert.match(html, /KPI ciljevi/);
    assert(!html.includes('href="/omega"'));
  } finally { globalThis.fetch = original; }
});

test('filtering combines search, type, implementation and availability', () => {
  const selected = filterRegistry(entries, { search: 'MENJACNICA', kind: 'repository', status: 'documented', availability: 'unknown' }, now);
  assert.equal(selected.length, 1);
  assert.equal(selected[0].id, 'repo:spaja86/ai-iq-menja-nica');
  assert.equal(filterRegistry(entries, { search: 'concept:OMEGA-0001' }, now)[0].id, 'concept:OMEGA-0001');
  assert.equal(filterRegistry(entries, { search: '  SPAJA   Sites  ', kind: 'application' }, now)[0].id, 'app:spaja-sites');
  assert.equal(filterRegistry(entries, { availability: 'available' }, now).length, 0);
  assert.equal(filterRegistry(entries, { kind: 'concept', status: 'local' }, now).length, 0);
  assert.equal(filterRegistry(entries, { search: 'no-such-item-xyz' }, now).length, 0);
});

test('fresh matching smoke evidence is required for available/unavailable', () => {
  const entry = checkedEntry();
  assert.equal(availabilityOf(entry, now), 'available');
  entry.availability!.result = 'failed';
  assert.equal(availabilityOf(entry, now), 'unavailable');
  entry.availability!.address += 'other';
  assert.equal(availabilityOf(entry, now), 'unknown');
});

test('stale, future, invalid or incomplete evidence cannot report available', () => {
  assert.equal(availabilityOf(checkedEntry(), now + AVAILABILITY_MAX_AGE_MS + 1), 'stale');
  assert.equal(availabilityOf(checkedEntry(), now - 1), 'unknown');
  for (const patch of [
    { checkedAt: 'invalid' }, { checkedAt: '2026-10-21' }, { evidenceUrl: '' },
    { evidenceUrl: 'javascript:alert(1)' }, { method: 'configuration' }, { scope: '' }, { result: 'success' },
  ]) {
    const entry = checkedEntry(); Object.assign(entry.availability!, patch);
    assert.equal(availabilityOf(entry, now), 'unknown');
  }
});

test('unsafe addresses and duplicate or unsupported records fail validation', () => {
  for (const address of ['javascript:alert(1)', '//evil.test', '/\\evil.test', 'data:text/html,x', 'https://user:pass@example.org', '/x\n']) {
    assert.equal(isRegistryAddress(address), false);
    assert.throws(() => validateRegistry([{ ...entries[0], address }]));
  }
  assert.throws(() => validateRegistry([entries[0], entries[0]]), /Duplicate/);
  assert.throws(() => validateRegistry([{ ...entries[0], status: 'aktivan' } as unknown as RegistryEntry]));
});

test('global navigation and original catalog link to the common registry', () => {
  assert.equal(navigation.filter(n => n.href === REGISTRY_PATH).length, 1);
  assert(readFileSync('src/app/omegatrojektorijum/page.tsx', 'utf8').includes(`href="${REGISTRY_PATH}"`));
  assert(readFileSync('src/app/omegatrojektorijum/catalog.tsx', 'utf8').includes("import IdeaCard from './idea-card'"));
});
