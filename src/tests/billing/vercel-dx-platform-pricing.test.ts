import assert from 'node:assert';
import { VERCEL_DX_PLATFORM_PRICING } from '../../lib/billing/vercel-dx-platform-pricing';
import { getVendorFormalPackages, VENDOR_SUBSCRIPTION_STATUS_MODEL } from '../../lib/billing/vendor-subscriptions';
import { pricingLoginSekvence } from '../../lib/sekvence/pricing-login-page';

function testSourceOfTruthCompleteness() {
  assert.strictEqual(VERCEL_DX_PLATFORM_PRICING.enterprisePricingNote, 'For Enterprise pricing, contact our sales team.');
  assert.strictEqual(VERCEL_DX_PLATFORM_PRICING.proPlanAddonsSteps.length, 4);
  assert.strictEqual(VERCEL_DX_PLATFORM_PRICING.billableResources.length, 7);
  assert.ok(
    VERCEL_DX_PLATFORM_PRICING.billableResources.some((resource) => resource.resource === 'SAML Single Sign-On'),
    'SAML Single Sign-On resource must exist',
  );
}

function testPricingSekvenceAlignment() {
  const enterpriseCardSection = pricingLoginSekvence.find((section) => section.id === 'pricing-login-kartice');
  assert.ok(enterpriseCardSection, 'pricing-login-kartice section must exist');

  const cards = (enterpriseCardSection?.podaci.kartice ?? []) as Array<{ naslov: string; oznake?: string[] }>;
  const enterpriseCard = cards.find((card) => card.naslov === 'Enterprise');
  assert.ok(enterpriseCard, 'Enterprise card must exist');
  assert.ok(
    enterpriseCard?.oznake?.some((label) => label.toLowerCase().includes('sales tim')),
    'Enterprise card must direct users to contact sales',
  );
  assert.ok(
    !(enterpriseCard?.oznake ?? []).some((label) => label.includes('$99/mesec')),
    'Enterprise card must not expose fixed $99/mesec pricing',
  );

  const proAddonsStepsSection = pricingLoginSekvence.find((section) => section.id === 'pricing-login-vercel-pro-addons-steps');
  assert.ok(proAddonsStepsSection, 'pricing-login-vercel-pro-addons-steps section must exist');
  const listedSteps = (proAddonsStepsSection?.podaci.stavke ?? []) as Array<{ naslov: string }>;
  assert.strictEqual(
    listedSteps.length,
    VERCEL_DX_PLATFORM_PRICING.proPlanAddonsSteps.length,
    'Pro add-ons steps section must match source-of-truth step count',
  );

  const dxTableSection = pricingLoginSekvence.find((section) => section.id === 'pricing-login-vercel-dx-platform-pricing-table');
  assert.ok(dxTableSection, 'pricing-login-vercel-dx-platform-pricing-table section must exist');
  const dxRows = (dxTableSection?.podaci.redovi ?? []) as string[][];
  assert.strictEqual(
    dxRows.length,
    VERCEL_DX_PLATFORM_PRICING.billableResources.length,
    'DX Platform pricing table row count must match source-of-truth resources',
  );

  const formalPackagesSection = pricingLoginSekvence.find((section) => section.id === 'pricing-login-formalni-paketi');
  assert.ok(formalPackagesSection, 'pricing-login-formalni-paketi section must exist');
  const formalCards = (formalPackagesSection?.podaci.kartice ?? []) as Array<{ naslov: string }>;
  assert.strictEqual(formalCards.length, 4, 'formal packages cards count must stay aligned');
  assert.ok(
    formalCards.some((card) => card.naslov === 'Vercel Privreda'),
    'Vercel Privreda card must exist',
  );

  const statusSection = pricingLoginSekvence.find((section) => section.id === 'pricing-login-status-model');
  assert.ok(statusSection, 'pricing-login-status-model section must exist');
  const statusItems = (statusSection?.podaci.stavke ?? []) as Array<{ naslov: string }>;
  assert.strictEqual(
    statusItems.length,
    VENDOR_SUBSCRIPTION_STATUS_MODEL.length,
    'status model section must match source-of-truth statuses',
  );
  assert.strictEqual(getVendorFormalPackages('Vercel').length, 2, 'Vercel formal packages count');
}

function run() {
  console.log('\n📊 Vercel DX Platform pricing tests\n');
  testSourceOfTruthCompleteness();
  console.log('✓ source-of-truth completeness');
  testPricingSekvenceAlignment();
  console.log('✓ pricing sekvence alignment');
  console.log('\n✅ Vercel DX Platform pricing tests passed\n');
}

run();
