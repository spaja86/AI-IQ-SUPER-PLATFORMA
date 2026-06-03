// Autofinish #1424 — Spaja Pro Personalizacija Explain Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/spaja-pro-personalizacija-explain-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/spaja-pro/personalizacija-explain/route';
import { APP_VERSION, AUTOFINISH_COUNT, TOTAL_API_ROUTES, TOTAL_ROUTES } from '../../lib/constants';

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

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

async function runTests(): Promise<void> {
  console.log('\n🏁 Spaja Pro Personalizacija Explain — Route Coverage Test Suite (#1424)\n');

  const routePath = path.resolve(process.cwd(), 'src/app/api/spaja-pro/personalizacija-explain/route.ts');
  const routeSource = fs.readFileSync(routePath, 'utf8');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(routePath), `${routePath} ne postoji`);
  });

  await test('Ruta koristi očekivane auth i v3 explainability gradivne blokove', () => {
    assert(routeSource.includes('verifyUserFromToken'), 'Nedostaje verifyUserFromToken');
    assert(routeSource.includes('getSupabaseServerClient'), 'Nedostaje getSupabaseServerClient');
    assert(routeSource.includes('buildExplainabilityPayloadV3'), 'Nedostaje buildExplainabilityPayloadV3');
    assert(routeSource.includes('isPersonalizationV3Enabled'), 'Nedostaje isPersonalizationV3Enabled');
    assert(routeSource.includes('buildExplainabilityPayload('), 'Nedostaje v2 fallback');
    assert(routeSource.includes("profileVersion === 'v3'"), "Nedostaje profileVersion === 'v3' grananje");
    assert(routeSource.includes('adaptive_preferences'), 'Nedostaje adaptive_preferences select');
    assert(routeSource.includes('personalization_feedback'), 'Nedostaje personalization_feedback select');
    assert(routeSource.includes('personalization_v3_score'), 'Nedostaje personalization_v3_score select');
    assert(routeSource.includes("export const runtime = 'nodejs'"), 'Nedostaje nodejs runtime');
    assert(routeSource.includes('NextResponse.json'), 'Nedostaje NextResponse.json');
  });

  await test('GET bez auth vraća 401 i error poruku', async () => {
    const request = new Request('http://localhost/api/spaja-pro/personalizacija-explain', {
      headers: { 'x-forwarded-for': '127.0.1.10' },
    });

    const response = await GET(request as NextRequest);
    assertEqual(response.status, 401, 'status');

    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['error'] as string, 'Niste prijavljeni.', 'error');
  });

  await test('GET sa nevažećim bearer tokenom ostaje 401', async () => {
    const request = new Request('http://localhost/api/spaja-pro/personalizacija-explain', {
      headers: {
        'x-forwarded-for': '127.0.1.11',
        authorization: '******',
      },
    });

    const response = await GET(request as NextRequest);
    assertEqual(response.status, 401, 'status');
  });

  await test('Error fallback payload je definisan u route fajlu', () => {
    assert(routeSource.includes("Personalizacija explain GET error"), 'Nedostaje error log marker');
    assert(routeSource.includes("{ error: 'Greška servera.' }"), 'Nedostaje 500 fallback payload');
  });

  await test('Konstante su dostupne i ažurirane', () => {
    assert(/^\d+\.\d+\.\d+$/.test(APP_VERSION), 'APP_VERSION semver format');
    assert(AUTOFINISH_COUNT >= 1423, 'AUTOFINISH_COUNT baseline');
    assert(TOTAL_API_ROUTES >= 1239, 'TOTAL_API_ROUTES baseline');
    assert(TOTAL_ROUTES >= 1369, 'TOTAL_ROUTES baseline');
  });

  await test('GET response je JSON payload kada je dostupan', async () => {
    const request = new Request('http://localhost/api/spaja-pro/personalizacija-explain', {
      headers: { 'x-forwarded-for': '127.0.1.12' },
    });
    const response = await GET(request as NextRequest);
    const body = (await response.clone().json().catch(() => null)) as unknown;
    if (isObject(body)) {
      assert(typeof body['error'] === 'string' || typeof body['status'] === 'string', 'JSON payload shape');
    } else {
      throw new Error('Response nije JSON payload');
    }
  });

  console.log(`
🏁 Rezultat: ${passed} prošlo, ${failed} palo`);
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
