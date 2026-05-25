// Autofinish #1388 — Analiza Svega Refresh Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/analiza-svega-refresh-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import { GET } from '../../app/api/analiza-svega-refresh/route';

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
  console.log('\n🏁 Analiza Svega Refresh Route Coverage Test Suite (#1388)\n');

  const routePath = path.resolve(process.cwd(), 'src/app/api/analiza-svega-refresh/route.ts');
  const routeSource = fs.readFileSync(routePath, 'utf8');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(routePath), `${routePath} ne postoji`);
  });

  await test('API ruta koristi cron auth i buildAnalizaSvega', () => {
    assert(routeSource.includes('validateCronAuth'), 'Nedostaje validateCronAuth');
    assert(routeSource.includes('buildAnalizaSvega'), 'Nedostaje buildAnalizaSvega');
    assert(routeSource.includes('setCachedAnalizaSvega'), 'Nedostaje setCachedAnalizaSvega');
  });

  await test('GET bez cron auth vraća 401', async () => {
    const request = new Request('http://localhost/api/analiza-svega-refresh');
    const response = await GET(request);
    assertEqual(response.status, 401, 'status');
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
