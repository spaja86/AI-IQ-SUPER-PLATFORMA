// SpajaUltraOmegaCore -∞Ω+∞ — Unit Testovi za Digitalnu Observatoriju
// Pokretanje: npx tsx src/tests/lib/digitalna-observatorija.test.ts

import {
  digitalnaObservatorija,
  observatorijaInstrumenti,
  observatorijaMete,
  observatorijaSesije,
  observatorijaAlarmi,
  getAktivniInstrumenti,
  getMetePoPrioritetu,
  getSesijePoStatusu,
  getOtvoreneAlarme,
  getObservatorijaStatistika,
  getObservatorijaPregled,
} from '../../lib/digitalna-observatorija';

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
  console.log('\n🔭 Digitalna Observatorija Test Suite\n');

  await test('Glavni objekat ima osnovna polja', () => {
    assert(digitalnaObservatorija.naziv.length > 0, 'naziv');
    assert(digitalnaObservatorija.verzija.length > 0, 'verzija');
    assert(digitalnaObservatorija.status === 'aktivan', 'status mora biti aktivan');
  });

  await test('Nizovi podataka nisu prazni', () => {
    assert(observatorijaInstrumenti.length > 0, 'instrumenti');
    assert(observatorijaMete.length > 0, 'mete');
    assert(observatorijaSesije.length > 0, 'sesije');
    assert(observatorijaAlarmi.length > 0, 'alarmi');
  });

  await test('getAktivniInstrumenti vraća samo aktivne instrumente', () => {
    const aktivni = getAktivniInstrumenti();
    assert(aktivni.length > 0, 'mora imati aktivne instrumente');
    assert(aktivni.every((i) => i.status === 'aktivan'), 'svi instrumenti moraju biti aktivni');
  });

  await test('getMetePoPrioritetu filtrira kritične mete', () => {
    const kriticne = getMetePoPrioritetu('kritican');
    assert(kriticne.length > 0, 'mora imati kritične mete');
    assert(kriticne.every((m) => m.prioritet === 'kritican'), 'sve mete moraju biti kritične');
  });

  await test('getSesijePoStatusu filtrira sesije u toku', () => {
    const sesije = getSesijePoStatusu('u_toku');
    assert(sesije.length > 0, 'mora imati sesije u toku');
    assert(sesije.every((s) => s.status === 'u_toku'), 'sve sesije moraju biti u_toku');
  });

  await test('getOtvoreneAlarme isključuje zatvorene alarme', () => {
    const alarmi = getOtvoreneAlarme();
    assert(alarmi.length > 0, 'mora imati otvorene alarme');
    assert(alarmi.every((a) => a.status !== 'zatvoren'), 'zatvoreni alarmi ne smeju biti uključeni');
  });

  await test('getObservatorijaStatistika je konzistentna', () => {
    const statistika = getObservatorijaStatistika();
    assertEqual(statistika.ukupnoInstrumenata, observatorijaInstrumenti.length, 'ukupnoInstrumenata');
    assertEqual(statistika.ukupnoMeta, observatorijaMete.length, 'ukupnoMeta');
    assertEqual(statistika.ukupnoSesija, observatorijaSesije.length, 'ukupnoSesija');
    assertEqual(statistika.otvorenihAlarma, getOtvoreneAlarme().length, 'otvorenihAlarma');
  });

  await test('getObservatorijaPregled vraća očekivani sažetak', () => {
    const pregled = getObservatorijaPregled();
    assertEqual(pregled.naziv, digitalnaObservatorija.naziv, 'naziv');
    assertEqual(pregled.ukupnoInstrumenata, observatorijaInstrumenti.length, 'ukupnoInstrumenata');
    assert(pregled.ukupnoMogucnosti > 0, 'ukupnoMogucnosti');
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
