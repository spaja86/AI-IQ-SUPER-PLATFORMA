// Autofinish #1303 — AI Asistent Route Coverage Test

import fs from 'node:fs';
import path from 'node:path';
import { GET, POST } from '../../app/api/ai-asistent/route';
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

async function runTests(): Promise<void> {
  console.log('\n🤖 AI Asistent — Route Coverage Test (#1303)\n');

  const apiRoutePath = path.resolve(process.cwd(), 'src/app/api/ai-asistent/route.ts');
  const apiRouteSource = fs.readFileSync(apiRoutePath, 'utf8');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(apiRoutePath), `${apiRoutePath} ne postoji`);
  });

  await test('API ruta ima GET i POST handlere', () => {
    assert(apiRouteSource.includes('export async function GET'), 'API route nema GET handler');
    assert(apiRouteSource.includes('export async function POST'), 'API route nema POST handler');
  });

  await test('API ruta koristi SpajaPro prompt engine', () => {
    assert(apiRouteSource.includes('obradiPrompt'), 'API route ne koristi obradiPrompt');
    assert(apiRouteSource.includes('formatOdgovor'), 'API route ne koristi formatOdgovor');
    assert(apiRouteSource.includes('getVerziju'), 'API route ne koristi getVerziju');
  });

  await test('API ruta validira pitanje — POST bez body vraća grešku', async () => {
    const request = new Request('http://localhost/api/ai-asistent', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ pitanje: '', putanja: '/', kontekst: '', naslovStranice: 'Test', kategorija: 'ai' }),
    });
    const response = await POST(request as never);
    const body = (await response.json()) as Record<string, unknown>;
    assert(typeof body['error'] === 'string' && (body['error'] as string).length > 0, 'Nema error poruke za prazno pitanje');
    assertEqual(response.status, 400, 'status za prazno pitanje');
  });

  await test('GET vraća engine info sa statusom aktivan', async () => {
    const response = await GET();
    assertEqual(response.status, 200, 'GET status');
    const body = (await response.json()) as Record<string, unknown>;
    assert(typeof body['engine'] === 'string', 'Nema engine polja');
    assertEqual(body['status'] as string, 'aktivan', 'status');
    assert(typeof body['verzija'] === 'string', 'Nema verzija polja');
  });

  await test('Konstante su ažurirane', () => {
    assert(/^\d+\.\d+\.\d+$/.test(APP_VERSION), 'APP_VERSION semver format');
    assert(AUTOFINISH_COUNT >= 1308, 'AUTOFINISH_COUNT baseline');
    assert(TOTAL_API_ROUTES >= 1158, 'TOTAL_API_ROUTES baseline');
    assert(TOTAL_ROUTES >= 1258, 'TOTAL_ROUTES baseline');
  });

  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
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
