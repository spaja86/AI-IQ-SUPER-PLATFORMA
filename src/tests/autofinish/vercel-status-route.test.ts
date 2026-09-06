import assert from 'node:assert';
import { GET } from '../../app/api/vercel-status/route';
import { OWNER_PHONE_DEFAULT, OWNER_PHONE_NUMBER_ENV_KEY } from '../../lib/constants';
import {
  getOwnerPhoneVerifikacijaStatus,
  requestOwnerOtp,
  verifyOwnerOtp,
} from '../../lib/owner-phone-auth';

const VERCEL_ENV_KEYS = [
  'VERCEL_TOKEN',
  'VERCEL_PROJECT_ID',
  'VERCEL_TEAM_ID',
  'VERCEL_ORG_ID',
  'SPAJA_VERCEL_ENTERPRISE_REQUEST_READY',
  'SPAJA_VERCEL_ENTERPRISE_REQUESTED',
  'SPAJA_VERCEL_ENTERPRISE_REQUEST_SUBMITTED',
  OWNER_PHONE_NUMBER_ENV_KEY,
] as const;

function withEnv(overrides: Partial<Record<(typeof VERCEL_ENV_KEYS)[number], string>>, fn: () => Promise<void>) {
  const prev = new Map<string, string | undefined>();
  for (const key of VERCEL_ENV_KEYS) {
    prev.set(key, process.env[key]);
  }
  for (const key of VERCEL_ENV_KEYS) {
    if (Object.prototype.hasOwnProperty.call(overrides, key)) {
      const value = overrides[key];
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  }
  return fn().finally(() => {
    for (const [key, value] of prev.entries()) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  });
}

function ensureOwnerPhoneVerified() {
  if (getOwnerPhoneVerifikacijaStatus(OWNER_PHONE_DEFAULT) === 'verifikovan') return;
  const otpRequest = requestOwnerOtp(OWNER_PHONE_DEFAULT);
  assert.strictEqual(otpRequest.uspesno, true);
  assert.ok(otpRequest.devOtp, 'devOtp mora postojati u test okruženju');
  const verify = verifyOwnerOtp(OWNER_PHONE_DEFAULT, otpRequest.devOtp ?? '');
  assert.strictEqual(verify.uspesno, true);
}

async function getPayload() {
  const response = await GET();
  assert.strictEqual(response.status, 200);
  return await response.json() as {
    status: string;
    pretplataVercel?: {
      status: string;
      blokatori: string[];
      ownership: {
        phoneVerified: boolean;
        enterpriseRequestReady: boolean;
        enterpriseRequestRequested: boolean;
        enterpriseRequestSubmitted: boolean;
      };
      sledeciKoraci: string[];
    };
  };
}

async function testRouteResponse() {
  const json = await getPayload();

  assert.ok(typeof json.status === 'string' && json.status.length > 0);
  assert.ok(json.pretplataVercel, 'pretplataVercel mora biti prisutan');
  assert.ok(['service-active', 'blocked-until-validated'].includes(json.pretplataVercel?.status ?? ''));
  assert.ok(Array.isArray(json.pretplataVercel?.blokatori), 'blokatori mora biti niz');
  assert.ok(Array.isArray(json.pretplataVercel?.sledeciKoraci), 'sledeciKoraci mora biti niz');
  assert.strictEqual(typeof json.pretplataVercel?.ownership.phoneVerified, 'boolean');
  assert.strictEqual(typeof json.pretplataVercel?.ownership.enterpriseRequestReady, 'boolean');
  assert.strictEqual(typeof json.pretplataVercel?.ownership.enterpriseRequestRequested, 'boolean');
  assert.strictEqual(typeof json.pretplataVercel?.ownership.enterpriseRequestSubmitted, 'boolean');
  if ((json.pretplataVercel?.blokatori.length ?? 0) === 0) {
    assert.strictEqual(json.pretplataVercel?.status, 'service-active');
  } else {
    assert.strictEqual(json.pretplataVercel?.status, 'blocked-until-validated');
  }
}

async function testMissingTeamBlocker() {
  ensureOwnerPhoneVerified();
  await withEnv({
    VERCEL_TOKEN: 'token-ok',
    VERCEL_PROJECT_ID: 'project-ok',
    VERCEL_TEAM_ID: undefined,
    VERCEL_ORG_ID: undefined,
    SPAJA_VERCEL_ENTERPRISE_REQUEST_READY: 'true',
    SPAJA_VERCEL_ENTERPRISE_REQUESTED: 'true',
    SPAJA_VERCEL_ENTERPRISE_REQUEST_SUBMITTED: 'true',
    [OWNER_PHONE_NUMBER_ENV_KEY]: OWNER_PHONE_DEFAULT,
  }, async () => {
    const json = await getPayload();
    assert.strictEqual(json.pretplataVercel?.ownership.phoneVerified, true);
    assert.strictEqual(json.pretplataVercel?.status, 'blocked-until-validated');
    assert.ok(
      json.pretplataVercel?.blokatori.includes('Nedostaje VERCEL_TEAM_ID ili VERCEL_ORG_ID.'),
      'mora prijaviti missing team/org',
    );
  });
}

async function testRequestedWithoutSubmittedState() {
  ensureOwnerPhoneVerified();
  await withEnv({
    VERCEL_TOKEN: 'token-ok',
    VERCEL_PROJECT_ID: 'project-ok',
    VERCEL_TEAM_ID: 'team-ok',
    VERCEL_ORG_ID: undefined,
    SPAJA_VERCEL_ENTERPRISE_REQUEST_READY: 'true',
    SPAJA_VERCEL_ENTERPRISE_REQUESTED: 'true',
    SPAJA_VERCEL_ENTERPRISE_REQUEST_SUBMITTED: 'false',
    [OWNER_PHONE_NUMBER_ENV_KEY]: OWNER_PHONE_DEFAULT,
  }, async () => {
    const json = await getPayload();
    assert.strictEqual(json.pretplataVercel?.ownership.enterpriseRequestReady, true);
    assert.strictEqual(json.pretplataVercel?.ownership.enterpriseRequestRequested, true);
    assert.strictEqual(json.pretplataVercel?.ownership.enterpriseRequestSubmitted, false);
    assert.ok(
      !json.pretplataVercel?.blokatori.includes('Enterprise zahtev nije pokrenut (REQUESTED/SUBMITTED).'),
      'REQUESTED=true ne sme označiti zahtev kao nepokrenut',
    );
    assert.ok(
      json.pretplataVercel?.blokatori.includes('Enterprise zahtev nije označen kao poslat (set-submitted).'),
      'mora tražiti submitted korak',
    );
  });
}

async function testOrgFallbackWhenTeamEmpty() {
  ensureOwnerPhoneVerified();
  await withEnv({
    VERCEL_TOKEN: 'token-ok',
    VERCEL_PROJECT_ID: 'project-ok',
    VERCEL_TEAM_ID: '',
    VERCEL_ORG_ID: 'org-ok',
    SPAJA_VERCEL_ENTERPRISE_REQUEST_READY: 'true',
    SPAJA_VERCEL_ENTERPRISE_REQUESTED: 'true',
    SPAJA_VERCEL_ENTERPRISE_REQUEST_SUBMITTED: 'true',
    [OWNER_PHONE_NUMBER_ENV_KEY]: OWNER_PHONE_DEFAULT,
  }, async () => {
    const json = await getPayload();
    assert.ok(
      !json.pretplataVercel?.blokatori.includes('Nedostaje VERCEL_TEAM_ID ili VERCEL_ORG_ID.'),
      'mora prihvatiti VERCEL_ORG_ID kada je VERCEL_TEAM_ID prazan',
    );
  });
}

async function testPhoneNotVerifiedBlocker() {
  await withEnv({
    VERCEL_TOKEN: 'token-ok',
    VERCEL_PROJECT_ID: 'project-ok',
    VERCEL_TEAM_ID: 'team-ok',
    SPAJA_VERCEL_ENTERPRISE_REQUEST_READY: 'true',
    SPAJA_VERCEL_ENTERPRISE_REQUESTED: 'true',
    SPAJA_VERCEL_ENTERPRISE_REQUEST_SUBMITTED: 'true',
    [OWNER_PHONE_NUMBER_ENV_KEY]: '+381600000999',
  }, async () => {
    const json = await getPayload();
    assert.strictEqual(json.pretplataVercel?.ownership.phoneVerified, false);
    assert.ok(
      json.pretplataVercel?.blokatori.includes('Telefon vlasnika nije verifikovan (OTP).'),
      'mora prijaviti phone verification blokator',
    );
  });
}

async function run() {
  console.log('\n🌐 Vercel status route tests\n');
  await testRouteResponse();
  console.log('✓ route response includes pretplata blokatori');
  await testMissingTeamBlocker();
  console.log('✓ missing team/org blocker');
  await testRequestedWithoutSubmittedState();
  console.log('✓ requested vs submitted blocker logic');
  await testOrgFallbackWhenTeamEmpty();
  console.log('✓ org fallback when team is empty');
  await testPhoneNotVerifiedBlocker();
  console.log('✓ phone verification blocker');
  console.log('\n✅ Vercel status route tests passed\n');
}

run().catch((error) => {
  console.error('❌ Vercel status route tests failed');
  console.error(error);
  process.exit(1);
});
