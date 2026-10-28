import test from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { GET } from '../../app/api/deploy-platforma/network/route';
import { getDevelopmentNetworkMapping } from '../../lib/deploy/spaja-network-development';
import { buildVercelDeployGovernanceSummary } from '../../lib/vercel-deploy-governance';
import SpajaNetworkSummary from '../../components/deploy/SpajaNetworkSummary';

test('Deploy API uses shared mapping and never exposes private routing or accepts TLS status', async () => {
  const response = await GET(new Request('https://example.invalid/api/deploy-platforma/network?tls=active&domain=evil.example'));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  const mapping = await response.json();
  assert.deepEqual(mapping, getDevelopmentNetworkMapping());
  assert.equal(mapping.publicDomain.candidate, null);
  assert.equal(mapping.publicActivationAllowed, false);
  assert.doesNotMatch(JSON.stringify(mapping), /127\.0\.0\.1|localhost|listenPort|evidenceRef/);
  assert.ok(mapping.applications.every((app: { tls: { status: string } }) => app.tls.status === 'unconfigured'));
});

test('API resolves exact IDs, rejects unknown applications and does not redirect externally', async () => {
  for (const id of ['spaja.nivo*spaja', 'spaja.nivo*spaja/deploy', 'spaja.nivo*spaja/super']) {
    const response = await GET(new Request('https://example.invalid/api/deploy-platforma/network?id=' + encodeURIComponent(id)));
    assert.equal(response.status, 200);
    assert.equal((await response.json()).application.spajaId, id);
    assert.equal(response.headers.get('location'), null);
  }
  for (const id of ['', 'https://evil.example', 'spaja.nivo-spaja', 'spaja.nivo*spaja/other']) {
    assert.equal((await GET(new Request('https://example.invalid/api/deploy-platforma/network?id=' + encodeURIComponent(id)))).status, 404);
  }
});

test('Vercel governance is provider-specific and has no invented canonical domains', () => {
  const report = buildVercelDeployGovernanceSummary({
    sourceOfTruthPath: '/api/vercel-status', blockers: [], tokenConfigured: true,
    projectIdConfigured: true, teamOrOrgConfigured: true, deployHookConfigured: false,
  });
  assert.equal(report.scope, 'vercel-integration-only');
  assert.equal(report.canonicalDomainStrategy.apexDomain, null);
  assert.equal(report.canonicalDomainStrategy.wildcardDomain, null);
  assert.equal(report.canonicalDomainStrategy.networkId, 'spaja.nivo*spaja');
  assert.equal(report.spajaNetwork.provider, 'self-hosted-caddy');
  assert.equal(report.spajaNetwork.publicActivationAllowed, false);
});

test('Deploy page distinguishes logical IDs, public domains, proxy paths and TLS', () => {
  const html = renderToStaticMarkup(createElement(SpajaNetworkSummary));
  for (const text of ['spaja.nivo*spaja', 'Javni domen', 'Poddomen', 'Javni host', 'Proksi ruta', 'TLS sertifikat', 'Nije podešen', 'Nisu potvrđeni', 'blokirana']) assert.ok(html.includes(text), text);
  assert.doesNotMatch(html, /https:\/\/spaja\.nivo|127\.0\.0\.1/);
});
