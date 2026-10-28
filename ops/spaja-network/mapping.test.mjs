import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildNetworkMapping, defaultNetworkInput, resolveSpajaId } from '../../src/lib/deploy/spaja-network.ts';
import { createNetworkConfig, main } from './network.mjs';

const now = Date.parse('2026-10-28T18:00:00Z');
const fixture = () => ({ ...defaultNetworkInput(), publicDomain: 'network.example.net' });
const observation = (host = 'network.example.net') => ({
  host, source: 'tls-probe', chainVerified: true, hostnameVerified: true,
  checkedAt: '2026-10-28T17:00:00Z', validFrom: '2026-10-01T00:00:00Z',
  validTo: '2027-01-01T00:00:00Z', fingerprintSha256: 'ab'.repeat(32),
});

test('default mapping has an internal ID, local routes and no invented public domain', () => {
  const result = buildNetworkMapping(defaultNetworkInput());
  assert.equal(result.networkId, 'spaja.nivo*spaja');
  assert.equal(result.publicDomain.candidate, null);
  assert.equal(result.publicDomain.registeredDomain, null);
  assert.equal(result.publicActivationAllowed, false);
  assert.deepEqual(result.applications.map(app => app.proxy.upstream), ['127.0.0.1:3000', '127.0.0.1:3100', '127.0.0.1:3200']);
  assert.ok(result.applications.every(app => app.publicHost === null && app.tls.status === 'unconfigured'));
});

for (const domain of ['spaja.nivo*spaja', 'spaja.nivo-spaja', '*.example.net', 'https://example.net', 'x.net:443', 'x.net/path', 'x.net?x', 'x.net#x', '127.0.0.1', '[::1]', 'localhost', 'a.local', 'a.test', 'a.internal', 'a..net', '-a.net', 'a_.net', 'a.net.', 'A.net', 'a.net\n', 'a'.repeat(64)+'.net']) {
  test(`invalid public domain: ${JSON.stringify(domain)}`, () => assert.throws(() => buildNetworkMapping({ ...fixture(), publicDomain: domain })));
}

test('similar names are distinct candidates, never aliases or ownership evidence', () => {
  const a = buildNetworkMapping({ ...fixture(), publicDomain: 'spaja.nivo-spaja.com' });
  const b = buildNetworkMapping({ ...fixture(), publicDomain: 'spaja-nivo-spaja.com' });
  assert.notEqual(a.publicDomain.candidate, b.publicDomain.candidate);
  for (const mapping of [a,b]) {
    assert.equal(mapping.publicDomain.registration, 'unverified');
    assert.equal(mapping.publicDomain.ownership, 'unverified');
    assert.equal(mapping.publicDomain.registeredDomain, null);
    assert.ok(mapping.applications.every(app => app.tls.status === 'unverified'));
  }
});

test('maps all fixed apps and resolves only exact logical IDs', () => {
  const result = buildNetworkMapping(fixture());
  assert.deepEqual(result.applications.map(app => app.publicHost), ['network.example.net', 'deploy.network.example.net', 'super.network.example.net']);
  assert.equal(resolveSpajaId(result, 'spaja.nivo*spaja/deploy').appId, 'deploy');
  assert.equal(resolveSpajaId(result, 'spaja.nivo*spaja').appId, 'platform');
  for (const id of ['spaja.nivo-spaja', 'https://spaja.nivo*spaja', 'spaja.nivo*spaja/unknown', 'spaja.nivo*spaja/deploy/../super', 'spaja.nivo*spaja/%64eploy']) {
    assert.throws(() => resolveSpajaId(result, id));
  }
});

for (const [name, edit] of [
  ['duplicate app', input => { input.applications[1].appId = 'platform'; }],
  ['duplicate ID', input => { input.applications[1].spajaId = input.networkId; }],
  ['wrong ID binding', input => { input.applications[1].spajaId = input.networkId + '/super'; }],
  ['duplicate host', input => { input.applications[1].subdomain = ''; }],
  ['unknown app', input => { input.applications[1].appId = 'external'; }],
  ['missing app', input => { input.applications.pop(); }],
  ['unsafe subdomain', input => { input.applications[1].subdomain = 'deploy\n{'; }],
  ['remote upstream', input => { input.applications[1].upstream = 'https://evil.example'; }],
  ['spoofed TLS', input => { input.applications[1].tls = { status: 'active' }; }],
  ['spoofed ownership', input => { input.ownershipVerified = true; }],
  ['admin loop', input => { input.applications[1].port = 2019; }],
  ['listener loop', input => { input.applications[1].port = 8080; }],
  ['conflicting app ports', input => { input.applications[1].port = 3000; }],
]) test(`rejects ${name}`, () => { const input = fixture(); edit(input); assert.throws(() => buildNetworkMapping(input)); });

test('HTTPS origin alone and untrusted configuration cannot set active TLS', () => {
  const result = buildNetworkMapping(fixture());
  assert.equal(result.applications[0].publicOrigin, 'https://network.example.net');
  assert.equal(result.applications[0].tls.status, 'unverified');
  assert.throws(() => buildNetworkMapping({ ...fixture(), tls: [observation()] }));
});

test('trusted TLS observations must match the host, chain, hostname, time and certificate', () => {
  const evaluate = tls => buildNetworkMapping(fixture(), { tls }, now).applications[0].tls.status;
  assert.equal(evaluate([observation()]), 'active');
  assert.equal(evaluate([observation('deploy.network.example.net')]), 'unverified');
  for (const patch of [
    { chainVerified: false }, { hostnameVerified: false }, { source: 'configured' },
    { checkedAt: '2026-10-28T19:00:00Z' }, { checkedAt: 'bad' },
    { validFrom: '2026-11-01T00:00:00Z' }, { validTo: 'bad' }, { fingerprintSha256: '' },
  ]) assert.notEqual(evaluate([{ ...observation(), ...patch }]), 'active');
  assert.equal(evaluate([{ ...observation(), validTo: '2026-10-28T17:30:00Z' }]), 'expired');
  assert.equal(evaluate([{ ...observation(), checkedAt: '2026-10-26T17:00:00Z' }]), 'stale');
  assert.throws(() => evaluate([observation(), observation()]));
});

test('TLS evidence never proves registration, ownership, DNS or release permission', () => {
  const result = buildNetworkMapping(fixture(), { tls: [observation()] }, now);
  assert.equal(result.applications[0].tls.status, 'active');
  assert.equal(result.publicDomain.ownership, 'unverified');
  assert.equal(result.publicDnsStatus, 'unverified');
  assert.equal(result.publicActivationAllowed, false);
});

test('domain evidence is exact, fresh and independent of TLS', () => {
  const domain = { name: 'network.example.net', registeredDomain: 'example.net', registered: true, ownershipVerified: true, checkedAt: '2026-10-28T17:00:00Z', evidenceRef: 'operator-review-fixture' };
  const evaluate = value => buildNetworkMapping(fixture(), { domain: value }, now);
  assert.equal(evaluate(domain).publicDomain.registeredDomain, domain.registeredDomain);
  assert.equal(evaluate(domain).applications[0].tls.status, 'unverified');
  assert.equal(evaluate({ ...domain, name: 'other.example.net' }).publicDomain.registeredDomain, null);
  assert.equal(evaluate({ ...domain, checkedAt: '2026-10-26T17:00:00Z' }).publicDomain.ownership, 'unverified');
  assert.equal(evaluate({ ...domain, evidenceRef: '' }).publicDomain.ownership, 'unverified');
  assert.equal(evaluate({ ...domain, registeredDomain: 'ample.net' }).publicDomain.registeredDomain, null);
  assert.equal(evaluate({ ...domain, registeredDomain: 'spaja.nivo-spaja' }).publicDomain.registeredDomain, null);
});

test('Caddy consumes explicit mappings, preserves safe defaults and never publishes verified TLS', () => {
  const input = fixture();
  input.applications[1].subdomain = 'apps'; input.applications[1].port = 4100;
  const result = createNetworkConfig({ mode: 'public', mapping: input });
  assert.equal(result.manifest.services[1].host, 'apps.network.example.net');
  assert.equal(result.manifest.services[1].upstream, '127.0.0.1:4100');
  assert.equal(result.manifest.applicationTraffic, 'maintenance');
  assert.ok(result.manifest.mapping.applications.every(app => app.tls.status === 'unverified'));
  assert.doesNotMatch(result.caddyfile, /reverse_proxy/);
  assert.throws(() => createNetworkConfig({ mode: 'public', mapping: input, domain: 'other.example.net' }));
  const local = createNetworkConfig({ mapping: input });
  assert.match(local.caddyfile, /reverse_proxy 127\.0\.0\.1:4100/);
  assert.match(local.caddyfile, /auto_https off/);
  assert.equal(local.manifest.services[1].host, 'apps.spaja.localhost');
});

test('checked-in development configuration matches safe defaults', async () => {
  const input = JSON.parse(await readFile(new URL('./development.json', import.meta.url)));
  assert.deepEqual(input, defaultNetworkInput());
});

test('rejects a generated hostname that exceeds the DNS length limit', () => {
  const input = fixture();
  input.publicDomain = ['a'.repeat(63), 'b'.repeat(63), 'c'.repeat(63), 'net'].join('.');
  input.applications[1].subdomain = 'd'.repeat(63);
  assert.throws(() => buildNetworkMapping(input), /length/);
});

test('CLI mapping file creates a new bundle and leaves its source and prior output intact', async () => {
  const source = new URL('./development.json', import.meta.url);
  const before = await readFile(source, 'utf8');
  const directory = await mkdtemp(join(tmpdir(), 'spaja-mapping-cli-'));
  const output = join(directory, 'new');
  try {
    await main(['local', '--mapping', source.pathname, '--out', output]);
    const manifest = JSON.parse(await readFile(join(output, 'network.json')));
    assert.equal(manifest.schemaVersion, 2);
    assert.equal(manifest.mapping.publicDomain.candidate, null);
    const caddyfile = await readFile(join(output, 'Caddyfile'), 'utf8');
    await assert.rejects(main(['local', '--mapping', source.pathname, '--out', output]), /EEXIST/);
    assert.equal(await readFile(source, 'utf8'), before);
    assert.equal(await readFile(join(output, 'Caddyfile'), 'utf8'), caddyfile);
    await assert.rejects(main(['public', '--mapping', source.pathname, '--out', join(directory, 'public')]), /explicit domain/);
  } finally { await rm(directory, { recursive: true, force: true }); }
});
