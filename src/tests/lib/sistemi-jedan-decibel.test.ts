import {
  createAuditZapis,
  createSistemiJedanDecibelModel,
  getSegment,
  getSistemByIndex,
  validateKonzistentnost,
} from '../../lib/sistemi-jedan-decibel';

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
  console.log('\n🔊 Sistemi Jedan Decibel — Domain Test Suite\n');

  const model = createSistemiJedanDecibelModel();

  await test('Model koristi dB i korak od tačno 1 dB', () => {
    assertEqual(model.merenjeDb.jedinica, 'dB', 'jedinica');
    assertEqual(model.merenjeDb.korakDb, 1n, 'korakDb');
    assert(model.merenjeDb.tolerancijaDb > 0, 'tolerancija mora biti > 0');
  });

  await test('Virtualni skup je parametarski i ima 789 zilijardi sistema', () => {
    const expected = 789n * 10n ** 21n;
    assertEqual(model.virtualniSkup.tip, 'parametarski', 'tip');
    assertEqual(model.virtualniSkup.ukupnoSistema, expected, 'ukupnoSistema');
    assertEqual(model.definicija.granice.maxIndex, expected - 1n, 'maxIndex');
  });

  await test('Sistem po indeksu se računa formulom referenca + index', () => {
    const custom = createSistemiJedanDecibelModel({ referentniNivoDb: 12n });
    const sistem = getSistemByIndex(custom, 7n);
    assertEqual(sistem.dbNivo, 19n, 'dbNivo');
    assertEqual(sistem.izlaz.oznaka, 'SISTEM-7', 'oznaka');
  });

  await test('Konzistentnost prolazi za susedne sisteme sa razlikom 1 dB', () => {
    const validacija = validateKonzistentnost(model, 40n, 41n);
    assertEqual(validacija.status, 'validno', 'status');
    assert(validacija.praviloJedanDb.validno, 'pravilo 1 dB mora biti validno');
    assertEqual(validacija.praviloJedanDb.stvarnaRazlikaDb, 1n, 'stvarnaRazlikaDb');
  });

  await test('Konzistentnost pada za nesusedne sisteme', () => {
    const validacija = validateKonzistentnost(model, 40n, 45n);
    assertEqual(validacija.status, 'nevalidno', 'status');
    assert(!validacija.praviloJedanDb.validno, 'pravilo 1 dB mora biti nevalidno');
  });

  await test('Segmentacija deli opseg na batch raspone', () => {
    const segment = getSegment(model, 2n, 1000n);
    assertEqual(segment.odIndexa, 2000n, 'odIndexa');
    assertEqual(segment.doIndexa, 2999n, 'doIndexa');
    assertEqual(segment.brojStavki, 1000n, 'brojStavki');
  });

  await test('Audit zapis koristi pravila i sadrži obavezna polja', () => {
    const segment = getSegment(model, 0n, 1000n);
    const audit = createAuditZapis(model, {
      akcija: 'validacija',
      segment,
      status: 'ok',
      poruka: 'Segment validiran bez odstupanja.',
      timestamp: '2026-07-30T00:00:00.000Z',
    });

    assertEqual(audit.akcija, 'validacija', 'akcija');
    assertEqual(audit.segment.indeks, 0n, 'segment.indeks');
    assertEqual(audit.timestamp, '2026-07-30T00:00:00.000Z', 'timestamp');
  });

  await test('Operativni plan održava pravilo 1 dB pri proširenju', () => {
    assertEqual(model.operativniPlan.periodicneProvere, 'dnevno-validacija-segmenata', 'periodicneProvere');
    assertEqual(model.operativniPlan.prosirenjeModela, 'samo-uz-zadrzavanje-koraka-1db', 'prosirenjeModela');
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
