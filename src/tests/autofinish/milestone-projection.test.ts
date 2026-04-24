// Autofinish #990 — Unit Testovi getAutofinishMilestoneProjection()
// Kompanija SPAJA — Digitalna Industrija
//
// Testovi pokrivaju:
//   1. getAutofinishMilestoneProjection() — schema, ETA za pending, redosled, milestone konzistentnost
//
// Pokretanje: npx tsx src/tests/autofinish/milestone-projection.test.ts

import { getAutofinishMilestoneProjection, getAutofinishRoadmapInfo } from '../../lib/autofinish-petlja';
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
  console.log('\n📋 getAutofinishMilestoneProjection() — Unit Test Suite (#990)\n');

  console.log('📦 Schema i tipovi');

  await test('Vraća objekat', () => {
    const r = getAutofinishMilestoneProjection();
    assert(typeof r === 'object' && r !== null, 'vraća objekat');
  });

  await test('verzija === APP_VERSION', () => {
    const r = getAutofinishMilestoneProjection();
    assertEqual(r.verzija, APP_VERSION, 'verzija');
  });

  await test('autofinishBroj === AUTOFINISH_COUNT', () => {
    const r = getAutofinishMilestoneProjection();
    assertEqual(r.autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj');
  });

  await test('brzinaPoSatima >= 0', () => {
    const r = getAutofinishMilestoneProjection();
    assert(r.brzinaPoSatima >= 0, `brzinaPoSatima=${r.brzinaPoSatima} >= 0`);
  });

  await test('milestones je niz', () => {
    const r = getAutofinishMilestoneProjection();
    assert(Array.isArray(r.milestones), 'milestones je niz');
  });

  await test('Broj milestona = roadmap milestona', () => {
    const r = getAutofinishMilestoneProjection();
    const roadmap = getAutofinishRoadmapInfo();
    assertEqual(r.milestones.length, roadmap.milestones.length, 'isti broj milestona');
  });

  await test('Svaki milestone ima schema polja', () => {
    const r = getAutofinishMilestoneProjection();
    for (const m of r.milestones) {
      assert(typeof m.naziv === 'string', `naziv je string: ${JSON.stringify(m)}`);
      assert(typeof m.status === 'string', `status je string: ${JSON.stringify(m)}`);
      assert(typeof m.autofinishTarget === 'number', `autofinishTarget je broj: ${JSON.stringify(m)}`);
      assert(typeof m.prognoza === 'string', `prognoza je string: ${JSON.stringify(m)}`);
      assert(typeof m.preostaloIteracija === 'number', `preostaloIteracija je broj: ${JSON.stringify(m)}`);
    }
  });

  await test('Done milestoni imaju etaISO=null', () => {
    const r = getAutofinishMilestoneProjection();
    for (const m of r.milestones.filter((m) => m.status === 'done')) {
      assert(m.etaISO === null, `done milestone ${m.naziv} treba etaISO=null`);
    }
  });

  await test('Done milestoni imaju prognoza="Završeno"', () => {
    const r = getAutofinishMilestoneProjection();
    for (const m of r.milestones.filter((m) => m.status === 'done')) {
      assertEqual(m.prognoza, 'Završeno', `done milestone ${m.naziv}`);
    }
  });

  await test('Done milestoni imaju preostaloIteracija=0', () => {
    const r = getAutofinishMilestoneProjection();
    for (const m of r.milestones.filter((m) => m.status === 'done')) {
      assertEqual(m.preostaloIteracija, 0, `done milestone preostalo=0: ${m.naziv}`);
    }
  });

  await test('Pending/active milestoni imaju etaISO koji je validan ISO', () => {
    const r = getAutofinishMilestoneProjection();
    for (const m of r.milestones.filter((m) => m.status !== 'done')) {
      assert(m.etaISO !== null, `non-done milestone ${m.naziv} treba etaISO`);
      assert(!isNaN(Date.parse(m.etaISO!)), `etaISO je validan ISO: ${m.etaISO}`);
    }
  });

  await test('timestamp je validan ISO string', () => {
    const r = getAutofinishMilestoneProjection();
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
