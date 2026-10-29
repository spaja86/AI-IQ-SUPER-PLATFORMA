import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { assessNetwork } from './extrimli-network-gate.mjs';
const now = Date.parse('2026-10-30T00:00:00Z');
const candidate = 'spaja-owned.com'; // synthetic fixture, no claim of ownership
const evidence = () => ({ domain: { name: candidate, registeredDomain: candidate, registered: true,
  ownershipVerified: true, checkedAt: new Date(now).toISOString(), evidenceRef: 'synthetic-test-only' },
  tls: ['', 'deploy.', 'super.'].map(prefix => ({host: prefix + candidate, source: 'tls-probe', chainVerified: true,
    hostnameVerified: true, checkedAt: new Date(now).toISOString(), validFrom: '2026-10-01T00:00:00Z',
    validTo: '2026-11-01T00:00:00Z', fingerprintSha256: 'a'.repeat(64)})) });
test('logical ID is not a public candidate, no default address', () => {
  const result = assessNetwork();
  assert.equal(result.networkId, 'spaja.nivo*spaja');
  assert.equal(result.publicDomain.candidate, null);
  assert.equal(result.confirmedPublicAddress, null);
  for (const domain of ['spaja.nivo*spaja', 'spaja.nivo-spaja', 'https://spaja-owned.com', '$(touch /tmp/unsafe)'])
    assert.throws(() => assessNetwork(domain));
});
test('candidate syntax cannot establish public ownership or TLS', () => {
  const result = assessNetwork(candidate);
  assert.equal(result.publicDomain.candidate, candidate);
  assert.equal(result.confirmedPublicAddress, null);
  assert.equal(result.publicActivationAllowed, false);
  assert.ok(result.blockers.includes('registration-unverified'));
});
test('confirmed address still cannot authorize a release', () => {
  const result = assessNetwork(candidate, '', evidence(), now);
  assert.equal(result.confirmedPublicAddress, `https://${candidate}`);
  assert.equal(result.publicDomain.ownership, 'verified');
  assert.equal(result.publicActivationAllowed, false);
  assert.deepEqual(result.blockers, ['trusted-release-evidence-channel-not-integrated']);
});
for (const fault of ['missing-registration', 'missing-owner', 'stale-domain', 'wrong-domain', 'missing-tls', 'stale-tls', 'expired', 'wrong-host', 'bad-chain', 'bad-hostname', 'bad-fingerprint']) {
  test(`blocks ${fault}`, () => {
    const e = evidence();
    if (fault === 'missing-registration') e.domain.registered = false;
    if (fault === 'missing-owner') e.domain.ownershipVerified = false;
    if (fault === 'stale-domain') e.domain.checkedAt = '2026-10-28T00:00:00Z';
    if (fault === 'wrong-domain') e.domain.name = 'other.com';
    if (fault === 'missing-tls') e.tls = [];
    if (fault === 'stale-tls') e.tls[0].checkedAt = '2026-10-28T00:00:00Z';
    if (fault === 'expired') e.tls[0].validTo = '2026-10-29T00:00:00Z';
    if (fault === 'wrong-host') e.tls[0].host = 'other.com';
    if (fault === 'bad-chain') e.tls[0].chainVerified = false;
    if (fault === 'bad-hostname') e.tls[0].hostnameVerified = false;
    if (fault === 'bad-fingerprint') e.tls[0].fingerprintSha256 = '';
    const result = assessNetwork(candidate, '', e, now);
    assert.equal(result.confirmedPublicAddress, null);
    assert.equal(result.publicActivationAllowed, false);
    assert.ok(result.blockers.length > 1);
  });
}
test('wildcard requires independent evidence and must match candidate', () => {
  assert.throws(() => assessNetwork(candidate, '*.other.com'));
  assert.throws(() => assessNetwork('', '*.other.com'));
  assert.ok(assessNetwork(candidate, `*.${candidate}`, evidence(), now).blockers.includes('wildcard-evidence-not-integrated'));
});
test('real CLI cannot be unlocked by supplied env claims', () => {
  for (const value of ['', candidate, 'spaja.nivo-spaja']) {
    const child = spawnSync(process.execPath, ['scripts/extrimli-network-gate.mjs'], {encoding:'utf8', env: {
      ...process.env, EXTRIMLI_DOMAIN_CANDIDATE:value, EXTRIMLI_WILDCARD_CANDIDATE:'',
      PUBLIC_ACTIVATION_ALLOWED:'true', TLS_READY:'true', OWNERSHIP_VERIFIED:'true', CONFIRM_PRODUCTION:'DEPLOY_PRODUCTION'
    }});
    assert.equal(child.status, 1, child.stderr);
    assert.doesNotMatch(child.stdout, /"publicActivationAllowed": true/);
  }
});
test('workflow preserves release gates and prevents push or branch hook activation', () => {
  const workflow = readFileSync('.github/workflows/extrimli-spaja-deploy.yml', 'utf8');
  assert.doesNotMatch(workflow, /spaja\.nivo-spaja|EXPECTED_CANONICAL/);
  assert.match(workflow, /run: node scripts\/extrimli-network-gate.mjs/);
  assert.match(workflow, /needs: production_gate\n    if:.*workflow_dispatch.*refs\/heads\/main.*success/);
  for (const gate of ['needs: staging', 'needs: security', 'needs: validate', 'DEPLOY_PRODUCTION', 'downstream_sync_evidence', 'REQUIRED_ISSUE_REGEX', 'npm audit --audit-level=high', 'npm run predeploy:check']) assert.ok(workflow.includes(gate), gate);
  assert.doesNotMatch(workflow.slice(workflow.indexOf('id: domain_strategy'), workflow.indexOf('      - name: 🔒 Validate production')), /run:.*\$\{\{/);
});
