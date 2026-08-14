import { POST } from '../../app/api/deploy-platforma/trigger/route';

let passed = 0;
let failed = 0;

async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`  ❌ ${name}`);
    console.error(`     ${msg}`);
    failed++;
  }
}

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(`Assert failed: ${message}`);
  }
}

function makeRequest(body: unknown): Request {
  return new Request('http://localhost/api/deploy-platforma/trigger', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-omega-user': 'route-test-user',
    },
    body: JSON.stringify(body),
  });
}

async function runTests(): Promise<void> {
  console.log('\n🧪 Deploy Platforma Trigger Route Test Suite\n');

  await test('vraća 400 kada platformId nedostaje', async () => {
    const response = await POST(makeRequest({ environment: 'staging' }) as never);
    assert(response.status === 400, `očekivan status 400, dobijen ${response.status}`);
  });

  await test('vraća 400 kada environment nije validan', async () => {
    const response = await POST(makeRequest({ platformId: 'ai-iq-super-platforma', environment: 'local' }) as never);
    assert(response.status === 400, `očekivan status 400, dobijen ${response.status}`);
  });

  await test('vraća 422 kada production gate token nije ispravan', async () => {
    const response = await POST(
      makeRequest({
        platformId: 'ai-iq-super-platforma',
        environment: 'production',
        confirmToken: 'WRONG_TOKEN',
      }) as never,
    );

    assert(response.status === 422, `očekivan status 422, dobijen ${response.status}`);
    const json = await response.json() as { success?: boolean; result?: { message?: string } };
    assert(json.success === false, 'success mora biti false');
    assert(
      (json.result?.message ?? '').includes('DEPLOY_PRODUCTION'),
      'poruka mora referisati DEPLOY_PRODUCTION gate',
    );
  });

  console.log(`\n✅ Passed: ${passed}  ❌ Failed: ${failed}\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((error) => {
  console.error('Kritična greška test runnera:', error);
  process.exit(1);
});
