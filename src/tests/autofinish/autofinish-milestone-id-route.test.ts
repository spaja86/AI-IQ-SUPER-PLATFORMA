// Autofinish #1391 — Autofinish Milestone ID Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/autofinish-milestone-id-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/autofinish-milestone/[id]/route';
import { APP_VERSION, AUTOFINISH_COUNT } from '../../lib/constants';

let passed = 0;
let failed = 0;
const failures: string[] = [];

async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`  ❌ ${name}`);
    console.error(`     ${msg}`);
    failed++;
    failures.push(`${name}: ${msg}`);
  }
}

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(`Assert failed: ${message}`);
}

function assertEqual<T>(actual: T, expected: T, label?: string): void {
  if (actual !== expected) {
    throw new Error(
      `${label ?? 'assertEqual'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
    );
  }
}

function makeRequest(id: string): NextRequest {
  return new Request(`http://localhost/api/autofinish-milestone/${id}`, {
    method: 'GET',
    headers: { 'x-forwarded-for': '127.0.0.1' },
  }) as NextRequest;
}

async function runTests(): Promise<void> {
  console.log('\n🏁 Autofinish Milestone ID — Route Coverage Test Suite (#1391)\n');

  const routePath = path.resolve(
    process.cwd(),
    'src/app/api/autofinish-milestone/[id]/route.ts',
  );
  const routeSource = fs.readFileSync(routePath, 'utf8');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(routePath), `${routePath} ne postoji`);
  });

  await test('Ruta koristi getAutofinishMilestoneDetail', () => {
    assert(
      routeSource.includes('getAutofinishMilestoneDetail'),
      'Nedostaje getAutofinishMilestoneDetail',
    );
  });

  await test('Ruta koristi APP_VERSION i AUTOFINISH_COUNT', () => {
    assert(routeSource.includes('APP_VERSION'), 'Nedostaje APP_VERSION');
    assert(routeSource.includes('AUTOFINISH_COUNT'), 'Nedostaje AUTOFINISH_COUNT');
  });

  await test('Ruta primenjuje rate limiting', () => {
    assert(routeSource.includes('checkRateLimitGlobal'), 'Nedostaje checkRateLimitGlobal');
    assert(routeSource.includes('rateLimitKey'), 'Nedostaje rateLimitKey');
  });

  await test('Ruta koristi Cache-Control header', () => {
    assert(routeSource.includes('Cache-Control'), 'Nedostaje Cache-Control header');
    assert(routeSource.includes('s-maxage'), 'Nedostaje s-maxage direktiva');
  });

  await test('Konstante su ažurirane', () => {
    assertEqual(APP_VERSION, '59.55.0', 'APP_VERSION');
    assertEqual(AUTOFINISH_COUNT, 1392, 'AUTOFINISH_COUNT');
  });

  await test('GET s nepostojećim ID-om vraća 404', async () => {
    const req = makeRequest('nepostojeci-milestone-xyz-999');
    const response = await GET(req, { params: Promise.resolve({ id: 'nepostojeci-milestone-xyz-999' }) });
    assertEqual(response.status, 404, 'status');

    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['error'] as string, 'NOT_FOUND', 'error kod');
    assert(typeof body['id'] === 'string', 'id string');
    assert(typeof body['timestamp'] === 'string', 'timestamp string');
  });

  await test('GET s nepostojećim ID-om uključuje verziju u odgovoru', async () => {
    const req = makeRequest('nepostojeci-abc');
    const response = await GET(req, { params: Promise.resolve({ id: 'nepostojeci-abc' }) });
    const body = (await response.json()) as Record<string, unknown>;

    assert(typeof body['verzija'] === 'string', 'verzija string');
    assert(typeof body['autofinishIteracija'] === 'number', 'autofinishIteracija broj');
  });

  await test('GET s validnim ID-om ili 200 ili 404 — nikad 500', async () => {
    const req = makeRequest('milestone-1000');
    const response = await GET(req, { params: Promise.resolve({ id: 'milestone-1000' }) });
    assert([200, 404].includes(response.status), `Neočekivan status: ${response.status}`);
  });

  await test('GET 200 odgovor sadrži X-App-Version header', async () => {
    // Probaj nekoliko poznatih slug formata koji mogu postojati
    const knownSlugs = ['autofinish-petlja', 'ekosistem', 'infrastruktura'];
    let checkedAny = false;
    for (const slug of knownSlugs) {
      const req = makeRequest(slug);
      const response = await GET(req, { params: Promise.resolve({ id: slug }) });
      if (response.status === 200) {
        const xVersion = response.headers.get('X-App-Version');
        assert(xVersion !== null, 'X-App-Version header nedostaje');
        assertEqual(xVersion, APP_VERSION, 'X-App-Version vrednost');
        checkedAny = true;
        break;
      }
    }
    // Ako nijedan slug nije pronađen, proveravamo header na 404 odgovoru
    if (!checkedAny) {
      const req = makeRequest('test-slug');
      const response = await GET(req, { params: Promise.resolve({ id: 'test-slug' }) });
      const xVersion = response.headers.get('X-App-Version');
      assert(xVersion !== null, 'X-App-Version header nedostaje na 404');
    }
  });

  console.log(`\n🏁 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) {
    console.error('\n❌ Neuspešni testovi:');
    failures.forEach((f) => console.error(`  • ${f}`));
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Kritična greška u test runneru:', e);
  process.exit(1);
});
