// SpajaUltraOmegaCore -∞Ω+∞ — ZLATNI RAČUNI Route Tests
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { GET as healthGET } from '../../app/api/zlatni-racuni/health/route';
import { GET as racunGET, POST as racunPOST } from '../../app/api/zlatni-racuni/racun/route';
import { GET as tierGET } from '../../app/api/zlatni-racuni/tier/route';
import { POST as pointsPOST } from '../../app/api/zlatni-racuni/points/route';
import { GET as transakcijeGET } from '../../app/api/zlatni-racuni/transakcije/route';
import { GET as perksGET } from '../../app/api/zlatni-racuni/perks/route';
import { _resetRegistry, _resetTransactionLedger, _resetCounter } from '../../lib/zlatni-racuni';

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

function makeGET(url: string): NextRequest {
  return new Request(url) as unknown as NextRequest;
}

function makePOST(url: string, body: unknown): NextRequest {
  return new Request(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

function resetAll(): void {
  _resetRegistry();
  _resetTransactionLedger();
  _resetCounter();
}

async function runTests(): Promise<void> {
  resetAll();

  console.log('\n🔗 [zlatni-racuni] route tests\n');

  // ─── Health ──────────────────────────────────────────────────────────────────

  await test('GET /api/zlatni-racuni/health returns 200 with headers', async () => {
    const res = await healthGET();
    assert(res.status === 200, `expected 200, got ${res.status}`);
    assert(res.headers.get('X-Zlatni-Racuni-Contract-Version') === 'v1', 'missing contract version header');
    assert(res.headers.get('X-Zlatni-Racuni-Module-Version') === '1.0.0', 'missing module version header');
    const body = await res.json() as { data: { personaId: string } };
    assert(body.data.personaId === 'zlatni-racuni-core', `unexpected personaId: ${body.data.personaId}`);
  });

  // ─── Racun — create ──────────────────────────────────────────────────────────

  await test('POST /api/zlatni-racuni/racun creates account', async () => {
    const res = await racunPOST(makePOST('http://localhost/api/zlatni-racuni/racun', {
      userId: 'r-001',
      idempotencyKey: 'ik-r-001',
    }));
    assert(res.status === 200, `expected 200, got ${res.status}`);
    const body = await res.json() as { data: { userId: string; tier: string } };
    assert(body.data.userId === 'r-001', 'userId mismatch');
    assert(body.data.tier === 'BRONZE', 'new account must be BRONZE');
  });

  await test('POST /api/zlatni-racuni/racun returns 400 without userId', async () => {
    const res = await racunPOST(makePOST('http://localhost/api/zlatni-racuni/racun', {
      idempotencyKey: 'ik-nouser',
    }));
    assert(res.status === 400, `expected 400, got ${res.status}`);
  });

  await test('POST /api/zlatni-racuni/racun returns 400 without idempotencyKey', async () => {
    const res = await racunPOST(makePOST('http://localhost/api/zlatni-racuni/racun', {
      userId: 'r-badkey',
    }));
    assert(res.status === 400, `expected 400, got ${res.status}`);
  });

  // ─── Racun — GET ─────────────────────────────────────────────────────────────

  await test('GET /api/zlatni-racuni/racun?userId= returns account', async () => {
    const res = await racunGET(makeGET('http://localhost/api/zlatni-racuni/racun?userId=r-001'));
    assert(res.status === 200, `expected 200, got ${res.status}`);
    const body = await res.json() as { data: { userId: string } };
    assert(body.data.userId === 'r-001', 'userId mismatch');
  });

  await test('GET /api/zlatni-racuni/racun?userId= returns 404 for unknown user', async () => {
    const res = await racunGET(makeGET('http://localhost/api/zlatni-racuni/racun?userId=unknown'));
    assert(res.status === 404, `expected 404, got ${res.status}`);
  });

  await test('GET /api/zlatni-racuni/racun returns 400 without userId', async () => {
    const res = await racunGET(makeGET('http://localhost/api/zlatni-racuni/racun'));
    assert(res.status === 400, `expected 400, got ${res.status}`);
  });

  // ─── Tier ────────────────────────────────────────────────────────────────────

  await test('GET /api/zlatni-racuni/tier?userId= returns tier result', async () => {
    const res = await tierGET(makeGET('http://localhost/api/zlatni-racuni/tier?userId=r-001'));
    assert(res.status === 200, `expected 200, got ${res.status}`);
    const body = await res.json() as { data: { current: { name: string } } };
    assert(body.data.current.name === 'BRONZE', `expected BRONZE, got ${body.data.current.name}`);
  });

  // ─── Points ──────────────────────────────────────────────────────────────────

  await test('POST /api/zlatni-racuni/points credits points', async () => {
    const racunRes = await racunGET(makeGET('http://localhost/api/zlatni-racuni/racun?userId=r-001'));
    const racunBody = await racunRes.json() as { data: { id: string } };
    const racunId = racunBody.data.id;

    const res = await pointsPOST(makePOST('http://localhost/api/zlatni-racuni/points', {
      racunId,
      type: 'credit',
      amount: 200,
      source: 'gigatron',
      idempotencyKey: 'ik-pts-001',
    }));
    assert(res.status === 200, `expected 200, got ${res.status}`);
    const body = await res.json() as { data: { racun: { balance: number } } };
    assert(body.data.racun.balance >= 200, `expected balance ≥ 200, got ${body.data.racun.balance}`);
  });

  await test('POST /api/zlatni-racuni/points returns 400 for invalid type', async () => {
    const racunRes = await racunGET(makeGET('http://localhost/api/zlatni-racuni/racun?userId=r-001'));
    const racunBody = await racunRes.json() as { data: { id: string } };

    const res = await pointsPOST(makePOST('http://localhost/api/zlatni-racuni/points', {
      racunId: racunBody.data.id,
      type: 'invalid',
      amount: 100,
      source: 'gigatron',
      idempotencyKey: 'ik-pts-bad',
    }));
    assert(res.status === 400, `expected 400, got ${res.status}`);
  });

  // ─── Transakcije ─────────────────────────────────────────────────────────────

  await test('GET /api/zlatni-racuni/transakcije?userId= returns list', async () => {
    const res = await transakcijeGET(makeGET('http://localhost/api/zlatni-racuni/transakcije?userId=r-001'));
    assert(res.status === 200, `expected 200, got ${res.status}`);
    const body = await res.json() as { data: { items: unknown[]; total: number } };
    assert(Array.isArray(body.data.items), 'items must be array');
    assert(typeof body.data.total === 'number', 'total must be number');
  });

  // ─── Perks ───────────────────────────────────────────────────────────────────

  await test('GET /api/zlatni-racuni/perks?userId= returns perks for tier', async () => {
    const res = await perksGET(makeGET('http://localhost/api/zlatni-racuni/perks?userId=r-001'));
    assert(res.status === 200, `expected 200, got ${res.status}`);
    const body = await res.json() as { data: { perks: unknown[]; tier: string } };
    assert(Array.isArray(body.data.perks), 'perks must be array');
    assert(typeof body.data.tier === 'string', 'tier must be string');
  });

  // ─── Summary ─────────────────────────────────────────────────────────────────

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);

  if (failures.length > 0) {
    console.error('Failures:');
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
