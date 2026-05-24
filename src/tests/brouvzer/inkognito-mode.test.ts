// Inkognito Mode — Unit Test Suite
// Pokretanje: npx tsx src/tests/brouvzer/inkognito-mode.test.ts

import {
  INKOGNITO_LABEL,
  INKOGNITO_OPIS,
  shouldWriteToStorage,
  shouldShowStoredData,
  getInkognitoButtonClass,
} from '../../lib/brouvzer-inkognito';

import { PLATFORM_FLAGS } from '../../lib/feature-flags';
import { brouvzerModuli } from '../../lib/spaja-digitalni-brouvzer';

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
  console.log('\n🕵️ Inkognito Mode — Unit Test Suite\n');

  // ─── shouldWriteToStorage ───────────────────────────────────────
  await test('shouldWriteToStorage: dozvoljen upis kada inkognito=false', () => {
    assertEqual(shouldWriteToStorage(false), true, 'shouldWriteToStorage(false)');
  });

  await test('shouldWriteToStorage: zabranjen upis kada inkognito=true', () => {
    assertEqual(shouldWriteToStorage(true), false, 'shouldWriteToStorage(true)');
  });

  // ─── shouldShowStoredData ───────────────────────────────────────
  await test('shouldShowStoredData: prikaz dozvoljen kada inkognito=false', () => {
    assertEqual(shouldShowStoredData(false), true, 'shouldShowStoredData(false)');
  });

  await test('shouldShowStoredData: prikaz onemogućen kada inkognito=true', () => {
    assertEqual(shouldShowStoredData(true), false, 'shouldShowStoredData(true)');
  });

  // ─── getInkognitoButtonClass ────────────────────────────────────
  await test('getInkognitoButtonClass: vraća string za inkognito=false', () => {
    const cls = getInkognitoButtonClass(false);
    assert(typeof cls === 'string' && cls.length > 0, 'getInkognitoButtonClass(false) mora biti neprazan string');
    assert(cls.includes('text-gray-400'), 'neaktivan state treba da sadrži text-gray-400');
  });

  await test('getInkognitoButtonClass: vraća string za inkognito=true', () => {
    const cls = getInkognitoButtonClass(true);
    assert(typeof cls === 'string' && cls.length > 0, 'getInkognitoButtonClass(true) mora biti neprazan string');
    assert(cls.includes('purple'), 'aktivan inkognito state treba da sadrži purple klasu');
  });

  await test('getInkognitoButtonClass: razlikuje aktivno i neaktivno stanje', () => {
    const clsOff = getInkognitoButtonClass(false);
    const clsOn = getInkognitoButtonClass(true);
    assert(clsOff !== clsOn, 'Aktivno i neaktivno stanje moraju imati različite CSS klase');
  });

  // ─── Konstante ──────────────────────────────────────────────────
  await test('INKOGNITO_LABEL sadrži 🕵️ emoji', () => {
    assert(INKOGNITO_LABEL.includes('🕵️'), 'INKOGNITO_LABEL mora sadržati 🕵️');
  });

  await test('INKOGNITO_OPIS je neprazan string', () => {
    assert(typeof INKOGNITO_OPIS === 'string' && INKOGNITO_OPIS.length > 20, 'INKOGNITO_OPIS mora biti opisni string');
  });

  // ─── Feature flag ───────────────────────────────────────────────
  await test('Feature flag brouvzer-inkognito-mode postoji', () => {
    const flag = PLATFORM_FLAGS.find((f) => f.id === 'brouvzer-inkognito-mode');
    assert(flag !== undefined, 'Feature flag brouvzer-inkognito-mode ne postoji u PLATFORM_FLAGS');
    assert(flag!.strategy === 'enabled', 'brouvzer-inkognito-mode mora biti strategy: enabled');
  });

  // ─── Brouvzer modul ─────────────────────────────────────────────
  await test('Inkognito modul postoji u brouvzerModuli', () => {
    const modul = brouvzerModuli.find((m) => m.id === 'modul-inkognito');
    assert(modul !== undefined, 'modul-inkognito ne postoji u brouvzerModuli');
    assertEqual(modul!.status, 'aktivan', 'modul-inkognito.status mora biti aktivan');
    assert(modul!.mogucnosti.length > 0, 'modul-inkognito mora imati mogucnosti');
  });

  await test('Inkognito modul ima ispravan ikona', () => {
    const modul = brouvzerModuli.find((m) => m.id === 'modul-inkognito');
    assert(modul !== undefined, 'modul-inkognito ne postoji');
    assert(modul!.ikona.includes('🕵️'), 'modul-inkognito ikona mora biti 🕵️');
  });

  // ─── Logička invarijanta ─────────────────────────────────────────
  await test('Invarijanta: shouldWriteToStorage i shouldShowStoredData su inverzni booleans', () => {
    for (const val of [true, false]) {
      assertEqual(
        shouldWriteToStorage(val),
        !val,
        `shouldWriteToStorage(${val}) treba biti ${!val}`,
      );
      assertEqual(
        shouldShowStoredData(val),
        !val,
        `shouldShowStoredData(${val}) treba biti ${!val}`,
      );
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
