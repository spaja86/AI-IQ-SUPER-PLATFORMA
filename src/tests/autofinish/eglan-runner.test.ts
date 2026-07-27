/**
 * eglan-runner.test.ts
 *
 * Testovi za EKSTREMINACIJU EGLANA — EglanRunner i runner registraciju.
 */

import { TOTAL_IGRICA } from '../../lib/constants';
import { igrice, getIgricePoKategoriji } from '../../lib/igrice';
import { getRunnerTip, getRunnerTipZaIgricu, noviScore } from '../../lib/gaming-endzin';
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
  console.log('\n👁️ EKSTREMINACIJA EGLANA — EglanRunner & Runner Registracija\n');

  // ── Runner tip mapiranje ──

  await test('getRunnerTip("borbena") i dalje vraća "borbena"', () => {
    assertEqual(getRunnerTip('borbena'), 'borbena', 'runner tip za borbenu kategoriju nije promenjen');
  });

  await test('getRunnerTipZaIgricu vraća "eglan" za igrica-ekstreminacija-eglana', () => {
    const igrica = igrice.find((i) => i.id === 'igrica-ekstreminacija-eglana');
    assert(Boolean(igrica), 'igrica-ekstreminacija-eglana postoji');
    assertEqual(getRunnerTipZaIgricu(igrica!), 'eglan', 'runner tip za eglan igricu');
  });

  await test('getRunnerTipZaIgricu ne menja druge borbene igrice', () => {
    const coldFire = igrice.find((i) => i.id === 'igrica-cold-and-fire');
    assert(Boolean(coldFire), 'igrica-cold-and-fire postoji');
    assertEqual(getRunnerTipZaIgricu(coldFire!), 'borbena', 'cold-and-fire ostaje borbena runner');
  });

  // ── TOTAL_IGRICA i igrice ──

  await test('TOTAL_IGRICA prati stvarni broj stavki', () => {
    assertEqual(TOTAL_IGRICA, igrice.length, 'TOTAL_IGRICA === igrice.length');
  });

  // ── Igrica registracija ──

  await test('Postoji EKSTREMINACIJA EGLANA i aktivna je', () => {
    const eglan = igrice.find((i) => i.id === 'igrica-ekstreminacija-eglana');
    assert(Boolean(eglan), 'igrica-ekstreminacija-eglana postoji');
    assertEqual(eglan?.naziv, 'EKSTREMINACIJA EGLANA', 'naziv');
    assertEqual(eglan?.kategorija, 'borbena', 'kategorija');
    assertEqual(eglan?.status, 'aktivna', 'status');
    assert(eglan?.podrzaneDimenzije.includes('360D') ?? false, 'podrzava 360D');
    assert(eglan?.podrzaneDimenzije.includes('5760D') ?? false, 'podrzava 5760D');
    assertEqual(eglan?.podrazumevanaDimenzija, '720D', 'podrazumevana dimenzija');
  });

  await test('EKSTREMINACIJA EGLANA ima ikonu 👁️', () => {
    const eglan = igrice.find((i) => i.id === 'igrica-ekstreminacija-eglana');
    assert(Boolean(eglan), 'postoji');
    assertEqual(eglan?.ikona, '👁️', 'ikona je 👁️');
  });

  await test('EKSTREMINACIJA EGLANA ima sve obavezne funkcije', () => {
    const eglan = igrice.find((i) => i.id === 'igrica-ekstreminacija-eglana');
    assert(Boolean(eglan), 'postoji');
    assert((eglan?.funkcije.length ?? 0) >= 4, 'ima min 4 funkcije');
    assert((eglan?.preporuceniProizvodi.length ?? 0) > 0, 'ima preporucene proizvode');
    assert((eglan?.zahtevi.length ?? 0) > 0, 'ima zahteve');
  });

  await test('EKSTREMINACIJA EGLANA ulazi u borbena kategorički pregled', () => {
    const borbene = getIgricePoKategoriji('borbena');
    assert(borbene.some((i) => i.id === 'igrica-ekstreminacija-eglana'), 'eglan je u borbena');
  });

  // ── noviScore inicijalizacija ──

  await test('noviScore za 720D ima dimenzionalni bonus > 1', () => {
    const score = noviScore('720D');
    assertEqual(score.bodovi, 0, 'bodovi na startu');
    assertEqual(score.nivo, 1, 'nivo na startu');
    assert(score.dimenzionalniBonus > 1, 'dimenzionalni bonus za 720D je > 1');
  });

  // ── Gejming entiteti — Eglan ──

  await test('Postoji Ratnik Svetlosti entitet za EGLAN', () => {
    const ratnik = gejmingEntiteti.find((e) => e.id === 'entitet-ratnik-svetlosti');
    assert(Boolean(ratnik), 'entitet-ratnik-svetlosti postoji');
    assertEqual(ratnik?.igricaId, 'igrica-ekstreminacija-eglana', 'igricaId');
    assertEqual(ratnik?.tip, 'lik-igriv', 'tip entiteta');
    assertEqual(ratnik?.status, 'aktivan', 'status');
    assert(ratnik?.dimenzije.includes('360D') ?? false, 'podrzava 360D');
    assert(ratnik?.dimenzije.includes('5760D') ?? false, 'podrzava 5760D');
  });

  await test('Postoji Senka Ubojica entitet za EGLAN', () => {
    const senka = gejmingEntiteti.find((e) => e.id === 'entitet-senka-ubojica');
    assert(Boolean(senka), 'entitet-senka-ubojica postoji');
    assertEqual(senka?.igricaId, 'igrica-ekstreminacija-eglana', 'igricaId');
    assertEqual(senka?.tip, 'lik-igriv', 'tip entiteta');
    assertEqual(senka?.status, 'aktivan', 'status');
    assert(senka?.sposobnosti.some((s) => s.includes('Nevidljivosti')) ?? false, 'ima Nevidljivost sposobnost');
  });

  await test('Ratnik Svetlosti ima sve potrebne atribute', () => {
    const ratnik = gejmingEntiteti.find((e) => e.id === 'entitet-ratnik-svetlosti');
    assert(Boolean(ratnik), 'postoji');
    assert((ratnik?.atributi.length ?? 0) >= 4, 'ima min 4 atributa');
    assert(ratnik?.atributi.some((a) => a.includes('Odbrana')) ?? false, 'ima Odbrana atribut');
  });

  await test('Senka Ubojica ima sve potrebne atribute', () => {
    const senka = gejmingEntiteti.find((e) => e.id === 'entitet-senka-ubojica');
    assert(Boolean(senka), 'postoji');
    assert((senka?.atributi.length ?? 0) >= 4, 'ima min 4 atributa');
    assert(senka?.atributi.some((a) => a.includes('Brzina')) ?? false, 'ima Brzina atribut');
  });

  await test('Postoji EGLAN boss entitet', () => {
    const eglan = gejmingEntiteti.find((e) => e.id === 'entitet-eglan');
    assert(Boolean(eglan), 'entitet-eglan postoji');
    assertEqual(eglan?.igricaId, 'igrica-ekstreminacija-eglana', 'igricaId');
    assertEqual(eglan?.tip, 'lik-npc', 'tip entiteta je lik-npc');
    assertEqual(eglan?.status, 'aktivan', 'status');
    assert(eglan?.dimenzije.includes('5760D') ?? false, 'podrzava 5760D');
  });

  await test('EGLAN boss ima sposobnosti po fazama', () => {
    const eglan = gejmingEntiteti.find((e) => e.id === 'entitet-eglan');
    assert(Boolean(eglan), 'postoji');
    assert((eglan?.sposobnosti.length ?? 0) >= 4, 'ima min 4 sposobnosti');
    assert(eglan?.sposobnosti.some((s) => s.includes('Faza')) ?? false, 'ima Faza sposobnost');
  });

  await test('Postoji Dimenzionalna Bezdan Arena entitet', () => {
    const arena = gejmingEntiteti.find((e) => e.id === 'entitet-dimenzionalna-bezdan-arena');
    assert(Boolean(arena), 'entitet-dimenzionalna-bezdan-arena postoji');
    assertEqual(arena?.igricaId, 'igrica-ekstreminacija-eglana', 'igricaId');
    assertEqual(arena?.tip, 'okruzenje', 'tip entiteta');
    assertEqual(arena?.status, 'aktivan', 'status');
  });

  await test('EGLAN ima najmanje 4 vezana entiteta', () => {
    const eglanEntiteti = gejmingEntiteti.filter((e) => e.igricaId === 'igrica-ekstreminacija-eglana');
    assert(eglanEntiteti.length >= 4, `ima najmanje 4 entiteta (ima ${eglanEntiteti.length})`);
  });

  console.log(`\n🏁 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) {
    console.error('\nNeuspeli testovi:');
    failures.forEach((f) => console.error(`  • ${f}`));
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error(e);
  process.exit(1);
});
