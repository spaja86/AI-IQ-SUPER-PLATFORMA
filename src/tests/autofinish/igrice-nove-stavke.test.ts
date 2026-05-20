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
  console.log('\n🎮 Igrice — Nove Stavke (Filmska Industrija + Biskop sa Dimenzijama)\n');

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
