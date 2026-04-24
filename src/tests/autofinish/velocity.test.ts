// Autofinish #982 — Unit Testovi getAutofinishIterationsPerDay()
// Kompanija SPAJA — Digitalna Industrija
//
// Testovi pokrivaju:
//   1. getAutofinishIterationsPerDay() — schema, velocity > 0, prognoza string, timestamp
//
// Pokretanje: npx tsx src/tests/autofinish/velocity.test.ts

import { getAutofinishIterationsPerDay } from '../../lib/autofinish-petlja';
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
    throw new Error(`${label ?? 'assertEqual'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

async function runTests(): Promise<void> {
  console.log('\n📋 getAutofinishIterationsPerDay() — Unit Test Suite (#982)\n');

  console.log('📦 Schema i tipovi');

  await test('Vraća objekat', () => {
    const r = getAutofinishIterationsPerDay();
    assert(typeof r === 'object' && r !== null, 'vraća objekat');
  });

  await test('verzija === APP_VERSION', () => {
    const r = getAutofinishIterationsPerDay();
    assertEqual(r.verzija, APP_VERSION, 'verzija');
  });

  await test('autofinishBroj === AUTOFINISH_COUNT', () => {
    const r = getAutofinishIterationsPerDay();
    assertEqual(r.autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj');
  });

  await test('brzinaPoSatima je broj >= 0', () => {
    const r = getAutofinishIterationsPerDay();
    assert(typeof r.brzinaPoSatima === 'number', 'brzinaPoSatima je broj');
    assert(r.brzinaPoSatima >= 0, 'brzinaPoSatima >= 0');
  });

  await test('brzinaPoSatu je broj >= 0', () => {
    const r = getAutofinishIterationsPerDay();
    assert(typeof r.brzinaPoSatu === 'number', 'brzinaPoSatu je broj');
    assert(r.brzinaPoSatu >= 0, 'brzinaPoSatu >= 0');
  });

  await test('brzinaPoSedmici je broj >= 0', () => {
    const r = getAutofinishIterationsPerDay();
    assert(typeof r.brzinaPoSedmici === 'number', 'brzinaPoSedmici je broj');
    assert(r.brzinaPoSedmici >= 0, 'brzinaPoSedmici >= 0');
  });

  await test('ukupnoIteracija === AUTOFINISH_COUNT', () => {
    const r = getAutofinishIterationsPerDay();
    assertEqual(r.ukupnoIteracija, AUTOFINISH_COUNT, 'ukupnoIteracija');
  });

  await test('prognoza je neprazan string', () => {
    const r = getAutofinishIterationsPerDay();
    assert(typeof r.prognoza === 'string', 'prognoza je string');
    assert(r.prognoza.length > 0, 'prognoza nije prazna');
  });

  await test('timestamp je validan ISO string', () => {
    const r = getAutofinishIterationsPerDay();
    assert(typeof r.timestamp === 'string', 'timestamp je string');
    assert(!isNaN(Date.parse(r.timestamp)), 'timestamp je validan ISO');
  });

  await test('brzinaPoSatima >= brzinaPoSatu (dan > sat)', () => {
    const r = getAutofinishIterationsPerDay();
    assert(r.brzinaPoSatima >= r.brzinaPoSatu, `brzinaPoSatima(${r.brzinaPoSatima}) >= brzinaPoSatu(${r.brzinaPoSatu})`);
  });

  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) {
    console.error('\n❌ Neuspješni testovi:');
    failures.forEach((f) => console.error(`  • ${f}`));
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Kritična greška u test runneru:', e);
  process.exit(1);
});
