// Centralized Notifications API — Route Tests
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { GET as getOverview, POST as postOverview } from '../../app/api/notifications/route';
import { GET as getHistory } from '../../app/api/notifications/history/route';
import { GET as getPreferences } from '../../app/api/notifications/preferences/route';
import { GET as getHealth } from '../../app/api/notifications/health/route';
import { GET as getLegacyOverview } from '../../app/api/openai-platforma-notifikacije/route';

let passed = 0;
let failed = 0;
const failures: string[] = [];

async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`  ❌ ${name}`);
    console.error(`     ${message}`);
    failed++;
    failures.push(`${name}: ${message}`);
  }
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function makePostRequest(body: unknown): NextRequest {
  return new Request('http://localhost/api/notifications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

function makeGetRequest(url: string): NextRequest {
  return new Request(url, { method: 'GET' }) as unknown as NextRequest;
}

async function runTests(): Promise<void> {
  console.log('\n🔗 [notifications] route tests\n');

  await test('GET /api/notifications returns centralized source of truth', async () => {
    const response = await getOverview();
    assert(response.status === 200, `expected 200, got ${response.status}`);
    const body = await response.json() as { data: { sourceOfTruth: string } };
    assert(body.data.sourceOfTruth === '/src/lib/notifications', 'unexpected source of truth');
  });

  await test('GET /api/notifications/history returns flow history inventory', async () => {
    const response = await getHistory();
    assert(response.status === 200, `expected 200, got ${response.status}`);
    const body = await response.json() as { data: Array<{ id: string }> };
    assert(body.data.length > 0, 'history should not be empty');
  });

  await test('GET /api/notifications/preferences returns preview preferences', async () => {
    const response = await getPreferences(makeGetRequest('http://localhost/api/notifications/preferences?state=CA&userId=test-user'));
    assert(response.status === 200, `expected 200, got ${response.status}`);
    const body = await response.json() as { data: { stateCode: string } };
    assert(body.data.stateCode === 'CA', `expected CA, got ${body.data.stateCode}`);
  });

  await test('GET /api/notifications/health returns health payload', async () => {
    const response = await getHealth();
    assert(response.status === 200, `expected 200, got ${response.status}`);
    const body = await response.json() as { data: { status: string } };
    assert(body.data.status === 'ok', 'health status should be ok');
  });

  await test('Legacy overview route is backed by centralized inventory', async () => {
    const response = await getLegacyOverview();
    assert(response.status === 200, `expected 200, got ${response.status}`);
    const body = await response.json() as { notifikacije: { sourceOfTruth: string } };
    assert(body.notifikacije.sourceOfTruth === '/src/lib/notifications', 'legacy route should expose shared source of truth');
  });

  await test('POST /api/notifications validates missing userId', async () => {
    const response = await postOverview(makePostRequest({ action: 'subscription.activated' }));
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /api/notifications accepts dry-run payload', async () => {
    const response = await postOverview(makePostRequest({
      userId: 'dry-run-user',
      action: 'subscription.activated',
      templateVars: { planId: 'starter' },
    }));
    assert(response.status === 200, `expected 200, got ${response.status}`);
    const body = await response.json() as { mode: string; data: { succeeded: string[] } };
    assert(body.mode === 'dry-run', `expected dry-run, got ${body.mode}`);
    assert(body.data.succeeded.length === 0, 'dry-run without persistence should not deliver channels');
  });

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);
  if (failed > 0) {
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exit(1);
  }
}

runTests().catch((error) => {
  console.error('Fatal:', error);
  process.exit(1);
});
