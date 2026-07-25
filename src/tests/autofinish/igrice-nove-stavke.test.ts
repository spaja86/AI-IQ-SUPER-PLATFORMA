import { TOTAL_IGRICA } from '../../lib/constants';
import { igrice, getIgricePoKategoriji } from '../../lib/igrice';

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
  console.log('\n🎮 Igrice — Nove Stavke (Filmska Industrija + Biskop sa Dimenzijama + COLD AND FIRE)\n');

  await test('TOTAL_IGRICA prati stvarni broj stavki', () => {
    assertEqual(TOTAL_IGRICA, igrice.length, 'TOTAL_IGRICA === igrice.length');
  });

  await test('Postoji Filmska Industrija i aktivna je', () => {
    const filmska = igrice.find((i) => i.id === 'igrica-filmska-industrija');
    assert(Boolean(filmska), 'igrica-filmska-industrija postoji');
    assertEqual(filmska?.naziv, 'Filmska Industrija', 'naziv');
    assertEqual(filmska?.kategorija, 'simulacija', 'kategorija');
    assertEqual(filmska?.status, 'aktivna', 'status');
    assert(filmska?.podrzaneDimenzije.includes('360D') ?? false, 'podrzava 360D');
    assert(filmska?.podrzaneDimenzije.includes('5760D') ?? false, 'podrzava 5760D');
  });

  await test('Postoji Biskop sa Dimenzijama i aktivna je', () => {
    const biskop = igrice.find((i) => i.id === 'igrica-biskop-sa-dimenzijama');
    assert(Boolean(biskop), 'igrica-biskop-sa-dimenzijama postoji');
    assertEqual(biskop?.naziv, 'Biskop sa Dimenzijama', 'naziv');
    assertEqual(biskop?.kategorija, 'strategija', 'kategorija');
    assertEqual(biskop?.status, 'aktivna', 'status');
    assert(biskop?.podrzaneDimenzije.includes('360D') ?? false, 'podrzava 360D');
    assert(biskop?.podrzaneDimenzije.includes('5760D') ?? false, 'podrzava 5760D');
  });

  await test('Postoji COLD AND FIRE i aktivna je', () => {
    const coldFire = igrice.find((i) => i.id === 'igrica-cold-and-fire');
    assert(Boolean(coldFire), 'igrica-cold-and-fire postoji');
    assertEqual(coldFire?.naziv, 'COLD AND FIRE', 'naziv');
    assertEqual(coldFire?.kategorija, 'borbena', 'kategorija');
    assertEqual(coldFire?.status, 'aktivna', 'status');
    assert(coldFire?.podrzaneDimenzije.includes('360D') ?? false, 'podrzava 360D');
    assert(coldFire?.podrzaneDimenzije.includes('5760D') ?? false, 'podrzava 5760D');
    assertEqual(coldFire?.podrazumevanaDimenzija, '720D', 'podrazumevana dimenzija');
  });

  await test('COLD AND FIRE ima sve obavezne funkcije', () => {
    const coldFire = igrice.find((i) => i.id === 'igrica-cold-and-fire');
    assert(Boolean(coldFire), 'igrica-cold-and-fire postoji');
    assert((coldFire?.funkcije.length ?? 0) > 0, 'ima funkcije');
    assert((coldFire?.preporuceniProizvodi.length ?? 0) > 0, 'ima preporucene proizvode');
    assert((coldFire?.zahtevi.length ?? 0) > 0, 'ima zahteve');
  });

  await test('COLD AND FIRE ulazi u kategorički pregled', () => {
    const borbene = getIgricePoKategoriji('borbena');
    assert(borbene.some((i) => i.id === 'igrica-cold-and-fire'), 'cold-and-fire je u borbena');
  });

  await test('Nove stavke ulaze u kategorički pregled', () => {
    const simulacije = getIgricePoKategoriji('simulacija');
    const strategije = getIgricePoKategoriji('strategija');
    assert(simulacije.some((i) => i.id === 'igrica-filmska-industrija'), 'filmska je u simulacija');
    assert(strategije.some((i) => i.id === 'igrica-biskop-sa-dimenzijama'), 'biskop je u strategija');
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
