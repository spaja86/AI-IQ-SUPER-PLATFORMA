import assert from 'assert';
import {
  BILLING_UPGRADE_DISCLOSURE,
  UPGRADE_ACCEPTANCE_TEXT,
  validateUpgradeDisclosureConsistency,
  validateUpgradeCompanyRequestPayload,
  buildUpgradeCompanyRequestRecord,
} from '../../lib/billing/upgrade-disclosure';
import { getEnterpriseZahtevi } from '../../lib/kompanija-spaja-operativa';

function testDisclosureConsistency() {
  const result = validateUpgradeDisclosureConsistency(BILLING_UPGRADE_DISCLOSURE);
  assert.strictEqual(result.valid, true, `Disclosure model mora biti validan: ${result.errors.join(', ')}`);
  assert.strictEqual(BILLING_UPGRADE_DISCLOSURE.totalUsd, 120, 'Total mora biti $120');
}

function testPayloadValidation() {
  const payload = {
    expectedTotalUsd: 120,
    version: BILLING_UPGRADE_DISCLOSURE.version,
    accountEmail: 'spajicn@yahoo.com',
    ownerName: 'Nikola Spajić',
    acceptanceText: UPGRADE_ACCEPTANCE_TEXT,
    autoSendToCompanyBilling: true,
    sendMode: 'dispatch_internal' as const,
  };

  const valid = validateUpgradeCompanyRequestPayload(payload);
  assert.strictEqual(valid.valid, true, `Payload mora biti validan: ${valid.errors.join(', ')}`);

  const invalid = validateUpgradeCompanyRequestPayload({ ...payload, expectedTotalUsd: 119 });
  assert.strictEqual(invalid.valid, false, 'Payload sa pogrešnim totalom mora pasti validaciju');
}

function testRequestRecordAndEnterpriseContext() {
  const record = buildUpgradeCompanyRequestRecord({
    expectedTotalUsd: 120,
    version: BILLING_UPGRADE_DISCLOSURE.version,
    accountEmail: 'spajicn@yahoo.com',
    ownerName: 'Nikola Spajić',
    acceptanceText: UPGRADE_ACCEPTANCE_TEXT,
    autoSendToCompanyBilling: true,
    sendMode: 'dispatch_internal',
  });

  assert.ok(record.requestId.startsWith('UPG-'), 'requestId treba da ima UPG prefiks');
  assert.strictEqual(record.status, 'queued_for_billing_dispatch');
  assert.ok(record.requestedPlans.includes('Best available subscription package'));

  const github = getEnterpriseZahtevi().find((item) => item.id === 'github');
  assert.ok(github, 'GitHub enterprise zahtev mora postojati');
  assert.strictEqual(github?.eksplicitniKontekst?.accountEmail, 'spajicn@yahoo.com');
  assert.strictEqual(github?.eksplicitniKontekst?.ownerName, 'Nikola Spajić');
  assert.strictEqual(github?.eksplicitniKontekst?.najboljePretplate, true);
}

function run() {
  console.log('\n🧾 Billing upgrade disclosure tests\n');
  testDisclosureConsistency();
  console.log('✓ disclosure consistency');
  testPayloadValidation();
  console.log('✓ payload validation');
  testRequestRecordAndEnterpriseContext();
  console.log('✓ request record + enterprise context');
  console.log('\n✅ All billing upgrade disclosure tests passed\n');
}

run();
