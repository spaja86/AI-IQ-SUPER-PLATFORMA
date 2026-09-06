import assert from 'node:assert';
import {
  getVendorFormalPackages,
  VENDOR_SUBSCRIPTION_ACTIVATION_RULES,
  VENDOR_SUBSCRIPTION_FINOPS_FRAMEWORK,
  VENDOR_SUBSCRIPTION_FORMAL_PACKAGES,
  VENDOR_SUBSCRIPTION_GO_LIVE_SEQUENCE,
  VENDOR_SUBSCRIPTION_INTAKE_FIELDS,
  VENDOR_SUBSCRIPTION_STATUS_MODEL,
} from '../../lib/billing/vendor-subscriptions';
import { pricingLoginSekvence } from '../../lib/sekvence/pricing-login-page';

function testFormalPackages() {
  assert.strictEqual(VENDOR_SUBSCRIPTION_FORMAL_PACKAGES.length, 4);
  assert.strictEqual(getVendorFormalPackages('GitHub').length, 2);
  assert.strictEqual(getVendorFormalPackages('Vercel').length, 2);
  assert.ok(
    VENDOR_SUBSCRIPTION_FORMAL_PACKAGES.some((pkg) => pkg.id === 'github-gradjanstvo'),
    'GitHub Građanstvo package must exist',
  );
  assert.ok(
    VENDOR_SUBSCRIPTION_FORMAL_PACKAGES.some((pkg) => pkg.id === 'vercel-privreda'),
    'Vercel Privreda package must exist',
  );
}

function testSharedGovernanceModel() {
  assert.strictEqual(VENDOR_SUBSCRIPTION_STATUS_MODEL.length, 11);
  assert.ok(
    VENDOR_SUBSCRIPTION_STATUS_MODEL.some((status) => status.status === 'payment-confirmed'),
    'payment-confirmed status must exist',
  );
  assert.ok(
    VENDOR_SUBSCRIPTION_ACTIVATION_RULES.some((rule) => rule.includes('payment-confirmed')),
    'activation rules must require payment confirmation',
  );
  assert.deepStrictEqual(VENDOR_SUBSCRIPTION_FINOPS_FRAMEWORK.alertThresholdsPercent, [50, 75, 90, 100]);
  assert.strictEqual(VENDOR_SUBSCRIPTION_GO_LIVE_SEQUENCE[0]?.phase, 'pilot-gradjanstvo');
}

function testBillingStatusScenarioMatrix() {
  const statuses = VENDOR_SUBSCRIPTION_STATUS_MODEL.map((status) => status.status);
  const requiredFlow = [
    'blocked-until-validated',
    'approved-for-invoice',
    'payment-pending',
    'payment-confirmed',
    'service-active',
    'closed',
  ] as const;

  for (const status of requiredFlow) {
    assert.ok(statuses.includes(status), `${status} must exist in billing status model`);
  }

  const approvedIndex = statuses.indexOf('approved-for-invoice');
  const pendingIndex = statuses.indexOf('payment-pending');
  const confirmedIndex = statuses.indexOf('payment-confirmed');
  const activeIndex = statuses.indexOf('service-active');
  const closedIndex = statuses.indexOf('closed');

  assert.ok(approvedIndex < pendingIndex, 'approved-for-invoice must precede payment-pending');
  assert.ok(pendingIndex < confirmedIndex, 'payment-pending must precede payment-confirmed');
  assert.ok(confirmedIndex < activeIndex, 'payment-confirmed must precede service-active');
  assert.ok(activeIndex < closedIndex, 'service-active must precede closed');

  assert.ok(
    VENDOR_SUBSCRIPTION_ACTIVATION_RULES.some((rule) => rule.includes('blocked-until-validated')),
    'activation rules must preserve blocked-until-validated guardrails',
  );
}

function testIntakeCoverage() {
  assert.ok(
    VENDOR_SUBSCRIPTION_INTAKE_FIELDS.some((field) => field.key === 'segment' && field.required),
    'segment intake field must be required',
  );
  assert.ok(
    VENDOR_SUBSCRIPTION_INTAKE_FIELDS.some(
      (field) => field.key === 'pibMb' && field.appliesTo.includes('privreda') && field.required,
    ),
    'pibMb intake field must be required for privreda',
  );
}

function testPricingSekvenceAlignment() {
  const packageSection = pricingLoginSekvence.find((section) => section.id === 'pricing-login-formalni-paketi');
  assert.ok(packageSection, 'pricing-login-formalni-paketi section must exist');
  const cards = (packageSection?.podaci.kartice ?? []) as Array<{ naslov: string }>;
  assert.strictEqual(cards.length, VENDOR_SUBSCRIPTION_FORMAL_PACKAGES.length);

  const statusSection = pricingLoginSekvence.find((section) => section.id === 'pricing-login-status-model');
  assert.ok(statusSection, 'pricing-login-status-model section must exist');
  const items = (statusSection?.podaci.stavke ?? []) as Array<{ naslov: string }>;
  assert.strictEqual(items.length, VENDOR_SUBSCRIPTION_STATUS_MODEL.length);
}

function run() {
  console.log('\n📦 Vendor subscription segmentation tests\n');
  testFormalPackages();
  console.log('✓ formal packages');
  testSharedGovernanceModel();
  console.log('✓ shared governance model');
  testBillingStatusScenarioMatrix();
  console.log('✓ billing status scenario matrix');
  testIntakeCoverage();
  console.log('✓ intake coverage');
  testPricingSekvenceAlignment();
  console.log('✓ pricing sekvence alignment');
  console.log('\n✅ Vendor subscription segmentation tests passed\n');
}

run();
