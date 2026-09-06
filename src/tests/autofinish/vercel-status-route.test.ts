import assert from 'node:assert';
import { GET } from '../../app/api/vercel-status/route';

async function testRouteResponse() {
  const response = await GET();
  assert.strictEqual(response.status, 200);

  const json = (await response.json()) as {
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

  assert.ok(typeof json.status === 'string' && json.status.length > 0);
  assert.ok(json.pretplataVercel, 'pretplataVercel mora biti prisutan');
  assert.ok(['service-active', 'blocked-until-validated'].includes(json.pretplataVercel?.status ?? ''));
  assert.ok(Array.isArray(json.pretplataVercel?.blokatori), 'blokatori mora biti niz');
  assert.ok(Array.isArray(json.pretplataVercel?.sledeciKoraci), 'sledeciKoraci mora biti niz');
  assert.strictEqual(typeof json.pretplataVercel?.ownership.phoneVerified, 'boolean');
}

async function run() {
  console.log('\n🌐 Vercel status route tests\n');
  await testRouteResponse();
  console.log('✓ route response includes pretplata blokatori');
  console.log('\n✅ Vercel status route tests passed\n');
}

run().catch((error) => {
  console.error('❌ Vercel status route tests failed');
  console.error(error);
  process.exit(1);
});
