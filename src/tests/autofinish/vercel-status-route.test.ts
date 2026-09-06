import assert from 'node:assert';
import {
  GET,
  buildVercelPretplataStatus,
  resolveOwnerPhone,
} from '../../app/api/vercel-status/route';
import { OWNER_PHONE_DEFAULT, OWNER_PHONE_NUMBER_ENV_KEY } from '../../lib/constants';

async function testRouteResponse() {
  const response = await GET();
  assert.strictEqual(response.status, 200);
  const json = (await response.json()) as {
    status: string;
    pretplataVercel?: { status: string; blokatori: string[] };
  };
  assert.ok(typeof json.status === 'string' && json.status.length > 0);
  assert.ok(json.pretplataVercel, 'pretplataVercel mora biti prisutan');
  assert.ok(['service-active', 'blocked-until-validated'].includes(json.pretplataVercel?.status ?? ''));
  assert.ok(Array.isArray(json.pretplataVercel?.blokatori), 'blokatori mora biti niz');
}

function testMissingTeamBlocker() {
  const status = buildVercelPretplataStatus(
    {
      VERCEL_TEAM_ID: '',
      VERCEL_ORG_ID: '',
      SPAJA_VERCEL_ENTERPRISE_REQUEST_READY: 'true',
      SPAJA_VERCEL_ENTERPRISE_REQUESTED: 'true',
      SPAJA_VERCEL_ENTERPRISE_REQUEST_SUBMITTED: 'true',
    },
    { tokenKonfigurisan: true, projectIdKonfigurisan: true, phoneVerified: true },
  );
  assert.strictEqual(status.status, 'blocked-until-validated');
  assert.ok(status.blokatori.includes('Nedostaje VERCEL_TEAM_ID ili VERCEL_ORG_ID.'));
}

function testRequestedWithoutSubmittedState() {
  const status = buildVercelPretplataStatus(
    {
      VERCEL_TEAM_ID: 'team-ok',
      SPAJA_VERCEL_ENTERPRISE_REQUEST_READY: 'true',
      SPAJA_VERCEL_ENTERPRISE_REQUESTED: 'true',
      SPAJA_VERCEL_ENTERPRISE_REQUEST_SUBMITTED: 'false',
    },
    { tokenKonfigurisan: true, projectIdKonfigurisan: true, phoneVerified: true },
  );
  assert.strictEqual(status.ownership.enterpriseRequestReady, true);
  assert.strictEqual(status.ownership.enterpriseRequestRequested, true);
  assert.strictEqual(status.ownership.enterpriseRequestSubmitted, false);
  assert.ok(!status.blokatori.includes('Enterprise zahtev nije pokrenut (REQUESTED/SUBMITTED).'));
  assert.ok(status.blokatori.includes('Enterprise zahtev nije označen kao poslat (set-submitted).'));
}

function testOrgFallbackWhenTeamEmpty() {
  const status = buildVercelPretplataStatus(
    {
      VERCEL_TEAM_ID: '',
      VERCEL_ORG_ID: 'org-ok',
      SPAJA_VERCEL_ENTERPRISE_REQUEST_READY: 'true',
      SPAJA_VERCEL_ENTERPRISE_REQUESTED: 'true',
      SPAJA_VERCEL_ENTERPRISE_REQUEST_SUBMITTED: 'true',
    },
    { tokenKonfigurisan: true, projectIdKonfigurisan: true, phoneVerified: true },
  );
  assert.ok(!status.blokatori.includes('Nedostaje VERCEL_TEAM_ID ili VERCEL_ORG_ID.'));
}

function testOwnerPhoneFallbackWhenEnvEmpty() {
  assert.strictEqual(resolveOwnerPhone({ [OWNER_PHONE_NUMBER_ENV_KEY]: '   ' }), OWNER_PHONE_DEFAULT);
}

function testPhoneNotVerifiedBlocker() {
  const status = buildVercelPretplataStatus(
    {
      VERCEL_TEAM_ID: 'team-ok',
      SPAJA_VERCEL_ENTERPRISE_REQUEST_READY: 'true',
      SPAJA_VERCEL_ENTERPRISE_REQUESTED: 'true',
      SPAJA_VERCEL_ENTERPRISE_REQUEST_SUBMITTED: 'true',
    },
    { tokenKonfigurisan: true, projectIdKonfigurisan: true, phoneVerified: false },
  );
  assert.strictEqual(status.ownership.phoneVerified, false);
  assert.ok(status.blokatori.includes('Telefon vlasnika nije verifikovan (OTP).'));
}

async function run() {
  console.log('\n🌐 Vercel status route tests\n');
  await testRouteResponse();
  console.log('✓ route response includes pretplata blokatori');
  testMissingTeamBlocker();
  console.log('✓ missing team/org blocker');
  testRequestedWithoutSubmittedState();
  console.log('✓ requested vs submitted blocker logic');
  testOrgFallbackWhenTeamEmpty();
  console.log('✓ org fallback when team is empty');
  testOwnerPhoneFallbackWhenEnvEmpty();
  console.log('✓ owner phone env empty fallback');
  testPhoneNotVerifiedBlocker();
  console.log('✓ phone verification blocker');
  console.log('\n✅ Vercel status route tests passed\n');
}

run().catch((error) => {
  console.error('❌ Vercel status route tests failed');
  console.error(error);
  process.exit(1);
});
