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

function testDigitalnaIndustrijaBillingBlockers() {
  const status = buildVercelPretplataStatus(
    {
      VERCEL_TEAM_ID: 'team-ok',
      SPAJA_VERCEL_ENTERPRISE_REQUEST_READY: 'true',
      SPAJA_VERCEL_ENTERPRISE_REQUESTED: 'true',
      SPAJA_VERCEL_ENTERPRISE_REQUEST_SUBMITTED: 'true',
      SPAJA_VERCEL_BILLING_OWNER: 'Pogresan entitet',
      SPAJA_VERCEL_BILLING_OWNER_LOCKED: 'false',
      SPAJA_VERCEL_CURRENT_INVOICE_NUMBER: 'INV-XYZ',
      SPAJA_VERCEL_CURRENT_INVOICE_AMOUNT: '1.00',
      SPAJA_VERCEL_CURRENT_INVOICE_PAID: 'false',
      SPAJA_VERCEL_INVOICE_CORRECTION_REQUESTED: 'false',
    },
    { tokenKonfigurisan: true, projectIdKonfigurisan: true, phoneVerified: true },
  );
  assert.ok(status.blokatori.includes('Billing owner nije zaključan na Digitalna Industrija.'));
  assert.ok(status.blokatori.includes('Billing owner mora biti: Digitalna Industrija — Kompanija SPAJA.'));
  assert.ok(status.blokatori.includes('Trenutni invoice mora biti 5JJYX4KN-0013.'));
  assert.ok(status.blokatori.includes('Trenutni invoice iznos mora biti 870.20.'));
  assert.ok(status.blokatori.includes('Trenutna faktura nije rešena (pay ili support correction/re-issue).'));
}

function testDigitalnaIndustrijaBillingCanBeCleared() {
  const status = buildVercelPretplataStatus(
    {
      VERCEL_TEAM_ID: 'team-ok',
      SPAJA_VERCEL_ENTERPRISE_REQUEST_READY: 'true',
      SPAJA_VERCEL_ENTERPRISE_REQUESTED: 'true',
      SPAJA_VERCEL_ENTERPRISE_REQUEST_SUBMITTED: 'true',
      SPAJA_VERCEL_BILLING_OWNER: 'Digitalna Industrija — Kompanija SPAJA',
      SPAJA_VERCEL_BILLING_OWNER_LOCKED: 'true',
      SPAJA_VERCEL_LEGAL_INTAKE_COMPLETE: 'true',
      SPAJA_VERCEL_ENTERPRISE_GOVERNED_MODEL: 'true',
      SPAJA_VERCEL_CURRENT_INVOICE_NUMBER: '5JJYX4KN-0013',
      SPAJA_VERCEL_CURRENT_INVOICE_AMOUNT: '870.20',
      SPAJA_VERCEL_CURRENT_INVOICE_PAID: 'true',
      SPAJA_VERCEL_CURRENT_INVOICE_EVIDENCE_CAPTURED: 'true',
      SPAJA_VERCEL_AUTOPAY_CORPORATE_ONLY: 'true',
      SPAJA_VERCEL_FINANCE_CHANNEL_CONFIGURED: 'true',
      SPAJA_VERCEL_FINOPS_THRESHOLDS_ENABLED: 'true',
      SPAJA_VERCEL_MONTHLY_RECONCILIATION_ENABLED: 'true',
      SPAJA_VERCEL_QUARTERLY_VENDOR_REVIEW_ENABLED: 'true',
    },
    { tokenKonfigurisan: true, projectIdKonfigurisan: true, phoneVerified: true },
  );
  assert.strictEqual(status.status, 'service-active');
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
  testDigitalnaIndustrijaBillingBlockers();
  console.log('✓ Digitalna Industrija billing blockers');
  testDigitalnaIndustrijaBillingCanBeCleared();
  console.log('✓ Digitalna Industrija billing blockers can be cleared');
  console.log('\n✅ Vercel status route tests passed\n');
}

run().catch((error) => {
  console.error('❌ Vercel status route tests failed');
  console.error(error);
  process.exit(1);
});
