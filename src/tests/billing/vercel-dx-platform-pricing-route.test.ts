import assert from 'node:assert';
import { GET } from '../../app/api/vercel-dx-platform-pricing/route';
import { VERCEL_DX_PLATFORM_PRICING } from '../../lib/billing/vercel-dx-platform-pricing';

async function testRouteResponse() {
  const response = await GET();
  assert.strictEqual(response.status, 200);

  const json = (await response.json()) as {
    route: string;
    status: string;
    pricing: typeof VERCEL_DX_PLATFORM_PRICING;
  };

  assert.strictEqual(json.status, 'ok');
  assert.strictEqual(json.route, '/api/vercel-dx-platform-pricing');
  assert.strictEqual(json.pricing.version, VERCEL_DX_PLATFORM_PRICING.version);
  assert.strictEqual(
    json.pricing.billableResources.length,
    VERCEL_DX_PLATFORM_PRICING.billableResources.length,
  );
}

async function run() {
  console.log('\n🌐 Vercel DX pricing route tests\n');
  await testRouteResponse();
  console.log('✓ route response');
  console.log('\n✅ Vercel DX pricing route tests passed\n');
}

run().catch((error) => {
  console.error('❌ Vercel DX pricing route tests failed');
  console.error(error);
  process.exit(1);
});
