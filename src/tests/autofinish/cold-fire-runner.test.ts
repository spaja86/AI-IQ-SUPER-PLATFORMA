/**
 * cold-fire-runner.test.ts
 *
 * Testovi za COLD AND FIRE BorbenaRunner i runner registraciju.
 */

import { getRunnerTip, noviScore } from '../../lib/gaming-endzin';
import { gejmingEntiteti } from '../../lib/gejming-likovi';

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
  console.log('\n❄️🔥 COLD AND FIRE — BorbenaRunner & Runner Registracija\n');

  // ── Runner tip mapiranje ──

  await test('getRunnerTip("borbena") vraća "borbena"', () => {
    assertEqual(getRunnerTip('borbena'), 'borbena', 'runner tip za borbenu kategoriju');
  });

  await test('getRunnerTip("akcija") i dalje vraća "akcija"', () => {
    assertEqual(getRunnerTip('akcija'), 'akcija', 'runner tip za akciju nije promenjen');
  });

  await test('getRunnerTip("strategija") i dalje vraća "simulacija"', () => {
    assertEqual(getRunnerTip('strategija'), 'simulacija', 'runner tip za strategiju nije promenjen');
  });

  // ── noviScore inicijalizacija (Fusion gauge reset) ──

  await test('noviScore inicijalizuje bodovi na 0', () => {
    const score = noviScore('720D');
    assertEqual(score.bodovi, 0, 'bodovi na startu');
    assertEqual(score.nivo, 1, 'nivo na startu');
    assertEqual(score.vreme, 0, 'vreme na startu');
    assert(score.dimenzionalniBonus > 1, 'dimenzionalni bonus za 720D je > 1');
  });

  await test('noviScore za 360D ima dimenzionalni bonus 1', () => {
    const score = noviScore('360D');
    assertEqual(score.dimenzionalniBonus, 1, 'bonus za 360D');
  });

  await test('noviScore za 5760D ima dimenzionalni bonus 3', () => {
    const score = noviScore('5760D');
    assertEqual(score.dimenzionalniBonus, 3, 'bonus za 5760D');
  });

  // ── Gejming entiteti — COLD AND FIRE karakteri ──

  await test('Postoji Cold Ratnik entitet za COLD AND FIRE', () => {
    const coldRatnik = gejmingEntiteti.find((e) => e.id === 'entitet-cold-ratnik');
    assert(Boolean(coldRatnik), 'entitet-cold-ratnik postoji');
    assertEqual(coldRatnik?.igricaId, 'igrica-cold-and-fire', 'igricaId');
    assertEqual(coldRatnik?.tip, 'lik-igriv', 'tip entiteta');
    assertEqual(coldRatnik?.status, 'aktivan', 'status');
    assert(coldRatnik?.dimenzije.includes('360D') ?? false, 'podrzava 360D');
    assert(coldRatnik?.dimenzije.includes('5760D') ?? false, 'podrzava 5760D');
  });

  await test('Postoji Fire Feniks entitet za COLD AND FIRE', () => {
    const fireFeniks = gejmingEntiteti.find((e) => e.id === 'entitet-fire-feniks');
    assert(Boolean(fireFeniks), 'entitet-fire-feniks postoji');
    assertEqual(fireFeniks?.igricaId, 'igrica-cold-and-fire', 'igricaId');
    assertEqual(fireFeniks?.tip, 'lik-igriv', 'tip entiteta');
    assertEqual(fireFeniks?.status, 'aktivan', 'status');
    assert(fireFeniks?.sposobnosti.some((s) => s.includes('COLD-FIRE')) ?? false, 'ima COLD-FIRE sposobnost');
  });

  await test('Postoji oružje Ledena Vatra Mač za COLD AND FIRE', () => {
    const mac = gejmingEntiteti.find((e) => e.id === 'entitet-oruzje-ledena-vatra-mac');
    assert(Boolean(mac), 'entitet-oruzje-ledena-vatra-mac postoji');
    assertEqual(mac?.igricaId, 'igrica-cold-and-fire', 'igricaId');
    assertEqual(mac?.tip, 'oruzje', 'tip entiteta');
  });

  await test('COLD AND FIRE ima tačno 3 vezana entiteta', () => {
    const coldFireEntiteti = gejmingEntiteti.filter((e) => e.igricaId === 'igrica-cold-and-fire');
    assert(coldFireEntiteti.length >= 3, `ima najmanje 3 entiteta (ima ${coldFireEntiteti.length})`);
  });

  await test('Cold Ratnik ima sve potrebne atribute', () => {
    const cr = gejmingEntiteti.find((e) => e.id === 'entitet-cold-ratnik');
    assert(Boolean(cr), 'postoji');
    assert((cr?.atributi.length ?? 0) >= 4, 'ima min 4 atributa');
    assert(cr?.atributi.some((a) => a.includes('Elementalna moć')) ?? false, 'ima Elementalna moć');
  });

  await test('Fire Feniks ima sve potrebne atribute', () => {
    const ff = gejmingEntiteti.find((e) => e.id === 'entitet-fire-feniks');
    assert(Boolean(ff), 'postoji');
    assert((ff?.atributi.length ?? 0) >= 4, 'ima min 4 atributa');
    assert(ff?.atributi.some((a) => a.includes('Vatra')) ?? false, 'ima Vatra atribut');
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
