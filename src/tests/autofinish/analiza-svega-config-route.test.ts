// Autofinish #1389 — Analiza Svega Config Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/analiza-svega-config-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import { GET, POST } from '../../app/api/analiza-svega-config/route';

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

async function runTests(): Promise<void> {
  console.log('\n🏁 Analiza Svega Config Route Coverage Test Suite (#1389)\n');

  const routePath = path.resolve(process.cwd(), 'src/app/api/analiza-svega-config/route.ts');
  const routeSource = fs.readFileSync(routePath, 'utf8');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(routePath), `${routePath} ne postoji`);
  });

  await test('API ruta koristi override funkcije', () => {
    assert(routeSource.includes('setAnalizaDomainWeightsOverride'), 'Nedostaje setAnalizaDomainWeightsOverride');
    assert(routeSource.includes('clearAnalizaDomainWeightsOverride'), 'Nedostaje clearAnalizaDomainWeightsOverride');
  });

  await test('GET vraća config payload', async () => {
    const response = await GET();
    assertEqual(response.status, 200, 'status');
    const body = (await response.json()) as Record<string, unknown>;
    assert(typeof body['defaultWeights'] === 'object' && body['defaultWeights'] !== null, 'defaultWeights objekat');
    assert(typeof body['activeWeights'] === 'object' && body['activeWeights'] !== null, 'activeWeights objekat');
  });

  await test('POST sa nevalidnim payload-om vraća 400', async () => {
    const request = new Request('http://localhost/api/analiza-svega-config', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ weights: { ekosistem: 1 } }),
    });
    const response = await POST(request);
    assertEqual(response.status, 400, 'status');
  });

  await test('POST reset vraća 200', async () => {
    const request = new Request('http://localhost/api/analiza-svega-config', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ reset: true }),
    });
    const response = await POST(request);
    assertEqual(response.status, 200, 'status');
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
