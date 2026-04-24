// Autofinish #994 — Unit Testovi getAutofinishPodsistemiDependencies()
// Kompanija SPAJA — Digitalna Industrija
//
// Testovi pokrivaju:
//   1. getAutofinishPodsistemiDependencies() — schema, nema cirkularnih, svih 9 podsistema
//
// Pokretanje: npx tsx src/tests/autofinish/podsistemi-dependencies.test.ts

import { getAutofinishPodsistemiDependencies } from '../../lib/autofinish-petlja';
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
  console.log('\n📋 getAutofinishPodsistemiDependencies() — Unit Test Suite (#994)\n');

  console.log('📦 Schema i tipovi');

  await test('Vraća objekat', () => {
    const r = getAutofinishPodsistemiDependencies();
    assert(typeof r === 'object' && r !== null, 'vraća objekat');
  });

  await test('verzija === APP_VERSION', () => {
    const r = getAutofinishPodsistemiDependencies();
    assertEqual(r.verzija, APP_VERSION, 'verzija');
  });

  await test('autofinishBroj === AUTOFINISH_COUNT', () => {
    const r = getAutofinishPodsistemiDependencies();
    assertEqual(r.autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj');
  });

  await test('ukupnoPodsistema === 9', () => {
    const r = getAutofinishPodsistemiDependencies();
    assertEqual(r.ukupnoPodsistema, 9, 'ukupnoPodsistema=9');
  });

  await test('podsistemi je niz od 9 elemenata', () => {
    const r = getAutofinishPodsistemiDependencies();
    assert(Array.isArray(r.podsistemi), 'podsistemi je niz');
    assertEqual(r.podsistemi.length, 9, 'podsistemi.length=9');
  });

  await test('Svaki podsistem ima schema polja', () => {
    const r = getAutofinishPodsistemiDependencies();
    for (const p of r.podsistemi) {
      assert(typeof p.id === 'string', `id je string: ${JSON.stringify(p)}`);
      assert(typeof p.naziv === 'string', `naziv je string: ${JSON.stringify(p)}`);
      assert(Array.isArray(p.ovisiO), `ovisiO je niz: ${JSON.stringify(p)}`);
      assert(Array.isArray(p.zavisniOd), `zavisniOd je niz: ${JSON.stringify(p)}`);
    }
  });

  await test('imaKruznih === false', () => {
    const r = getAutofinishPodsistemiDependencies();
    assertEqual(r.imaKruznih, false, 'imaKruznih=false');
  });

  await test('Svi ovisiO IDs postoje u podsistemi', () => {
    const r = getAutofinishPodsistemiDependencies();
    const ids = new Set(r.podsistemi.map((p) => p.id));
    for (const p of r.podsistemi) {
      for (const dep of p.ovisiO) {
        assert(ids.has(dep), `ovisiO dep ${dep} postoji: podsistem ${p.id}`);
      }
    }
  });

  await test('Svi zavisniOd IDs postoje u podsistemi', () => {
    const r = getAutofinishPodsistemiDependencies();
    const ids = new Set(r.podsistemi.map((p) => p.id));
    for (const p of r.podsistemi) {
      for (const dep of p.zavisniOd) {
        assert(ids.has(dep), `zavisniOd dep ${dep} postoji: podsistem ${p.id}`);
      }
    }
  });

  await test('plasiranje nema zavisnosti (root node)', () => {
    const r = getAutofinishPodsistemiDependencies();
    const plasiranje = r.podsistemi.find((p) => p.id === 'plasiranje');
    assert(plasiranje !== undefined, 'plasiranje postoji');
    assertEqual(plasiranje!.ovisiO.length, 0, 'plasiranje ovisiO=[]');
  });

  await test('timestamp je validan ISO string', () => {
    const r = getAutofinishPodsistemiDependencies();
    assert(typeof r.timestamp === 'string', 'timestamp je string');
    assert(!isNaN(Date.parse(r.timestamp)), 'timestamp je validan ISO');
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
