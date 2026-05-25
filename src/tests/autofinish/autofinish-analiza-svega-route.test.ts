// Autofinish #1390 — Autofinish Analiza Svega Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/autofinish-analiza-svega-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import { GET } from '../../app/api/autofinish-analiza-svega/route';

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
  console.log('\n🏁 Autofinish Analiza Svega Route Coverage Test Suite (#1390)\n');

  const routePath = path.resolve(process.cwd(), 'src/app/api/autofinish-analiza-svega/route.ts');
  const routeSource = fs.readFileSync(routePath, 'utf8');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(routePath), `${routePath} ne postoji`);
  });

  await test('API ruta koristi buildAnalizaSvega i token zaštitu', () => {
    assert(routeSource.includes('buildAnalizaSvega'), 'Nedostaje buildAnalizaSvega');
    assert(routeSource.includes('AUTOFINISH_TRIGGER_TOKEN'), 'Nedostaje AUTOFINISH_TRIGGER_TOKEN');
  });

  await test('GET vraća 405', async () => {
    const response = await GET();
    assertEqual(response.status, 405, 'status');
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
