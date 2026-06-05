// Autofinish #1360 — Protokoli Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/protokoli-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/protokoli/route';
import { TOTAL_PROTOKOLA, PROTOKOLI_VERZIJA } from '../../lib/constants';

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
    throw new Error(`${label ?? 'assertEqual'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

async function runTests(): Promise<void> {
  console.log('\n🏁 Protokoli Route Coverage Test Suite (#1360)\n');

  const routePath = path.resolve(process.cwd(), 'src/app/api/protokoli/route.ts');
  const routeSource = fs.readFileSync(routePath, 'utf8');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(routePath), `${routePath} ne postoji`);
  });

  await test('API ruta koristi očekivane gradivne blokove', () => {
    assert(routeSource.includes('checkRateLimitGlobal'), 'Nedostaje checkRateLimitGlobal');
    assert(routeSource.includes('logApiCall'), 'Nedostaje logApiCall');
    assert(routeSource.includes('apiSuccess'), 'Nedostaje apiSuccess');
    assert(routeSource.includes('protokolManager'), 'Nedostaje protokolManager');
  });

  await test('GET vraća 200 i standardni payload', async () => {
    const request = new Request('http://localhost/api/protokoli?limit=50', {
      headers: { 'x-forwarded-for': '127.0.0.1' },
    });
    const response = await GET(request as NextRequest);
    assertEqual(response.status, 200, 'status');

    const body = (await response.json()) as {
      data: {
        total: number;
        results: Array<Record<string, unknown>>;
        meta: { ukupnoProtokola: number; verzija: string };
      };
      timestamp: string;
      verzija: string;
    };

    assert(typeof body.timestamp === 'string', 'timestamp mora biti string');
    assert(typeof body.verzija === 'string', 'verzija mora biti string');
    assert(Array.isArray(body.data.results), 'results mora biti niz');
    assertEqual(body.data.meta.ukupnoProtokola, TOTAL_PROTOKOLA, 'meta.ukupnoProtokola');
    assertEqual(body.data.meta.verzija, PROTOKOLI_VERZIJA, 'meta.verzija');
    assert(body.data.total >= TOTAL_PROTOKOLA, 'total mora biti >= TOTAL_PROTOKOLA');
  });

  await test('GET vraća 400 za nepoznatu kategoriju', async () => {
    const request = new Request('http://localhost/api/protokoli?kategorija=nepostojeca', {
      headers: { 'x-forwarded-for': '127.0.0.1' },
    });
    const response = await GET(request as NextRequest);
    assertEqual(response.status, 400, 'status');
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
