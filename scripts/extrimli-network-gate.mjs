import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { buildNetworkMapping, defaultNetworkInput } from '../src/lib/deploy/spaja-network.ts';

/** Evidence may only come from a trusted operator/server, never dispatch inputs.
 * Readiness is diagnostic. This implementation deliberately cannot authorize hooks.
 */
export function assessNetwork(candidate = '', wildcard = '', evidence = {}, now = Date.now()) {
  const input = defaultNetworkInput();
  input.publicDomain = candidate || null;
  const mapping = buildNetworkMapping(input, evidence, now);
  if (wildcard && (!candidate || wildcard !== `*.${candidate}`)) throw new Error('Wildcard must match explicit candidate');
  const blockers = [];
  if (!mapping.publicDomain.candidate) blockers.push('public-domain-missing');
  if (mapping.publicDomain.registration !== 'verified') blockers.push('registration-unverified');
  if (mapping.publicDomain.ownership !== 'verified') blockers.push('ownership-unverified');
  if (mapping.applications.some(app => app.tls.status !== 'active')) blockers.push('tls-unverified');
  if (wildcard) blockers.push('wildcard-evidence-not-integrated');
  blockers.push('trusted-release-evidence-channel-not-integrated');
  return { networkId: mapping.networkId, publicDomain: mapping.publicDomain,
    confirmedPublicAddress: mapping.publicDomain.ownership === 'verified' && mapping.applications[0].tls.status === 'active'
      ? mapping.applications[0].publicOrigin : null,
    blockers, publicActivationAllowed: false };
}

export function main(env = process.env) {
  // No evidence ingestion from CLI, files, env flags or workflow inputs.
  try {
    const result = assessNetwork(env.EXTRIMLI_DOMAIN_CANDIDATE, env.EXTRIMLI_WILDCARD_CANDIDATE);
    console.log(JSON.stringify(result, null, 2));
  } catch {
    console.error('Invalid network candidate; activation blocked');
  }
  return 1;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) process.exitCode = main();
