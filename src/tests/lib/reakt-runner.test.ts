/**
 * Tests for REAKT runner logic
 *
 * Tests: scoring formula, streak multiplikator, distraktor detekcija,
 *        igrica registration, runner tip mapping
 */

import { izracunajBodove, izracunajStreakMultiplikator, jeDistraktor } from '../../components/gaming/runners/ReaktRunner';
import { igrice } from '../../lib/igrice';
import { getRunnerTip, getRunnerTipZaIgricu } from '../../lib/gaming-endzin';

let passed = 0;
let failed = 0;

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

function assertClose(actual: number, expected: number, delta: number, label?: string): void {
  if (Math.abs(actual - expected) > delta) {
    throw new Error(`${label ?? 'assertClose'}: expected ~${expected} (±${delta}), got ${actual}`);
  }
}

async function runTests(): Promise<void> {
  console.log('\n⚡ REAKT Runner — test suite\n');

  // ─── Scoring formula ─────────────────────────────────────────────

  await test('izracunajBodove — 200ms reakcija, D-bonus 1.0, streak 1×', () => {
    const bodovi = izracunajBodove(200, 1.0, 1.0);
    // 1000/200 * 1.0 * 1.0 = 5.0 → Math.round = 5
    assertEqual(bodovi, 5, 'bodovi-200ms');
  });

  await test('izracunajBodove — 100ms reakcija daje dvostruko više bodova od 200ms', () => {
    const b100 = izracunajBodove(100, 1.0, 1.0);
    const b200 = izracunajBodove(200, 1.0, 1.0);
    assert(b100 > b200, 'brža reakcija daje više bodova');
  });

  await test('izracunajBodove — dimenzionalni bonus multiplikuje rezultat', () => {
    const bezBonusa = izracunajBodove(200, 1.0, 1.0);
    const saBonus = izracunajBodove(200, 2.0, 1.0);
    assertEqual(saBonus, bezBonusa * 2, 'dupli dimenzionalni bonus');
  });

  await test('izracunajBodove — streak multiplikator povećava bodove', () => {
    const bezStreaka = izracunajBodove(200, 1.0, 1.0);
    const saStreakom = izracunajBodove(200, 1.0, 3.0);
    assertEqual(saStreakom, bezStreaka * 3, 'triplo streak multiplikator');
  });

  await test('izracunajBodove — nulto reakciono vreme vraća 0', () => {
    assertEqual(izracunajBodove(0, 1.0, 1.0), 0, 'nulto-vreme');
  });

  await test('izracunajBodove — negativno reakciono vreme vraća 0', () => {
    assertEqual(izracunajBodove(-50, 1.0, 1.0), 0, 'negativno-vreme');
  });

  // ─── Streak multiplikator ─────────────────────────────────────────

  await test('izracunajStreakMultiplikator — streak 0 daje 1.0', () => {
    assertEqual(izracunajStreakMultiplikator(0), 1.0, 'streak-0');
  });

  await test('izracunajStreakMultiplikator — streak 4 daje 2.0', () => {
    assertEqual(izracunajStreakMultiplikator(4), 2.0, 'streak-4');
  });

  await test('izracunajStreakMultiplikator — streak ne prelazi 8×', () => {
    const high = izracunajStreakMultiplikator(100);
    assertEqual(high, 8, 'streak-max-8');
  });

  await test('izracunajStreakMultiplikator — raste linearno do limita', () => {
    const s1 = izracunajStreakMultiplikator(1);
    const s2 = izracunajStreakMultiplikator(2);
    assert(s2 > s1, 'streak raste');
    assertClose(s1, 1.25, 0.001, 'streak-1');
    assertClose(s2, 1.5, 0.001, 'streak-2');
  });

  // ─── Distraktor detekcija ─────────────────────────────────────────

  await test('jeDistraktor — tip distraktor vraća true', () => {
    assert(jeDistraktor('distraktor'), 'distraktor-true');
  });

  await test('jeDistraktor — tip cilj vraća false', () => {
    assert(!jeDistraktor('cilj'), 'cilj-false');
  });

  // ─── Igrica registracija ──────────────────────────────────────────

  await test('REAKT igrica registrovana u igrice listi', () => {
    const reakt = igrice.find((g) => g.id === 'igrica-reakt');
    assert(reakt !== undefined, 'igrica-reakt mora biti registrovana');
    assertEqual(reakt!.kategorija, 'reakt', 'kategorija mora biti reakt');
    assertEqual(reakt!.ikona, '⚡', 'ikona mora biti ⚡');
    assertEqual(reakt!.status, 'beta', 'status mora biti beta');
  });

  await test('REAKT igrica podržava sve dimenzije (360D–5760D)', () => {
    const reakt = igrice.find((g) => g.id === 'igrica-reakt');
    assert(reakt !== undefined, 'igrica-reakt mora biti registrovana');
    const dimenzije = ['360D', '720D', '1440D', '2880D', '5760D'];
    for (const d of dimenzije) {
      assert(
        reakt!.podrzaneDimenzije.includes(d as never),
        `REAKT mora podržavati dimenziju ${d}`,
      );
    }
  });

  await test('REAKT ima dimenzionalne režime za sve dimenzije', () => {
    const reakt = igrice.find((g) => g.id === 'igrica-reakt');
    assert(reakt !== undefined, 'igrica-reakt mora biti registrovana');
    assertEqual(reakt!.dimenzionalniRezimi.length, 5, 'tačno 5 dimenzionalnih režima');
  });

  // ─── Runner tip mapiranje ─────────────────────────────────────────

  await test('Kategorija reakt mapira na reakt runner', () => {
    assertEqual(getRunnerTip('reakt'), 'reakt', 'reakt->reakt');
  });

  await test('REAKT igrica koristi reakt runner', () => {
    const reakt = igrice.find((g) => g.id === 'igrica-reakt');
    assert(reakt !== undefined, 'igrica-reakt mora biti registrovana');
    assertEqual(getRunnerTipZaIgricu(reakt!), 'reakt', 'reakt-runner-tip');
  });

  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failed > 0) process.exit(1);
}

runTests().catch((e) => {
  console.error('Kritična greška u test runneru:', e);
  process.exit(1);
});
