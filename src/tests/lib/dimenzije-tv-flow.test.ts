// Dimenzije TV Flow — Lib Test
// Pokretanje: npx tsx src/tests/lib/dimenzije-tv-flow.test.ts

import { getTVKanaliKrozDimenzije, getTVKrozDimenzijePregled } from '../../lib/dimenzije';
import { spajaDigitalniTelevizor } from '../../lib/spaja-digitalni-televizor';

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
  console.log('\n🏁 Dimenzije TV Flow — Lib Test Suite\n');

  await test('TV kanali su mapirani kroz dimenzije 1:1', () => {
    const mapped = getTVKanaliKrozDimenzije();
    assertEqual(mapped.length, spajaDigitalniTelevizor.kanali.length, 'mapped.length');
  });

  await test('Svaki mapirani kanal ima validnu dimenziju', () => {
    const mapped = getTVKanaliKrozDimenzije();
    const allowed = new Set(['360D', '720D', '1440D', '2880D', '5760D']);
    assert(mapped.every((item) => allowed.has(item.dimenzija)), 'dimenzija mora biti validna');
  });

  await test('Pregled dimenzionalnog toka je konzistentan', () => {
    const pregled = getTVKrozDimenzijePregled();
    assertEqual(pregled.ukupnoTVKanala, spajaDigitalniTelevizor.kanali.length, 'ukupnoTVKanala');
    assert(pregled.poNivou.length === 5, 'poNivou mora imati 5 dimenzija');
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
