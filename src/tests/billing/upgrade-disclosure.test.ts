import assert from 'assert';
import {
  BILLING_UPGRADE_DISCLOSURE,
  UPGRADE_ACCEPTANCE_TEXT,
  validateUpgradeDisclosureConsistency,
  validateUpgradeCompanyRequestPayload,
  buildUpgradeCompanyRequestRecord,
} from '../../lib/billing/upgrade-disclosure';

function testDisclosureConsistency() {
  const result = validateUpgradeDisclosureConsistency(BILLING_UPGRADE_DISCLOSURE);
  assert.strictEqual(result.valid, true, `Disclosure model mora biti validan: ${result.errors.join(', ')}`);
  assert.strictEqual(BILLING_UPGRADE_DISCLOSURE.totalUsd, 120, 'Total mora biti $120');
}

function testPayloadValidation() {
  const payload = {
    expectedTotalUsd: 120,
    version: BILLING_UPGRADE_DISCLOSURE.version,
    acceptanceText: UPGRADE_ACCEPTANCE_TEXT,
    autoSendToCompanyBilling: true,
    sendMode: 'dispatch_internal' as const,
  };

  const valid = validateUpgradeCompanyRequestPayload(payload);
  assert.strictEqual(valid.valid, true, `Payload mora biti validan: ${valid.errors.join(', ')}`);

  const invalid = validateUpgradeCompanyRequestPayload({ ...payload, expectedTotalUsd: 119 });
  assert.strictEqual(invalid.valid, false, 'Payload sa pogrešnim totalom mora pasti validaciju');
}

function testRequestRecord() {
  const record = buildUpgradeCompanyRequestRecord({
    expectedTotalUsd: 120,
    version: BILLING_UPGRADE_DISCLOSURE.version,
    acceptanceText: UPGRADE_ACCEPTANCE_TEXT,
    autoSendToCompanyBilling: true,
    sendMode: 'dispatch_internal',
  });

  assert.ok(record.requestId.startsWith('UPG-'), 'requestId treba da ima UPG prefiks');
  assert.strictEqual(record.status, 'queued_for_billing_dispatch');
  assert.ok(record.requestedPlans.includes('Best available subscription package'));

}

function run() {
  console.log('\n🧾 Billing upgrade disclosure tests\n');
  testDisclosureConsistency();
  console.log('✓ disclosure consistency');
  testPayloadValidation();
  console.log('✓ payload validation');
  testRequestRecord();
  console.log('✓ request record');
  console.log('\n✅ All billing upgrade disclosure tests passed\n');
}

run();
