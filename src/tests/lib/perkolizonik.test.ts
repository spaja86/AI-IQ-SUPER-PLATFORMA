import { buildPerkolizonik } from '../../lib/perkolizonik';

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
  console.log('\n⚙️ Perkolizonik — Unit Test Suite\n');

  const rezultat = buildPerkolizonik('test-user');

  await test('Rezultat ima aktivan status i userId', () => {
    assertEqual(rezultat.status, 'aktivan', 'status');
    assertEqual(rezultat.userId, 'test-user', 'userId');
    assert(!Number.isNaN(Date.parse(rezultat.timestamp)), 'timestamp mora biti ISO');
  });

  await test('Tokovi postoje i imaju validne KPI vrednosti', () => {
    assert(Array.isArray(rezultat.tokovi), 'tokovi moraju biti niz');
    assert(rezultat.tokovi.length > 0, 'tokovi ne smeju biti prazni');
    for (const tok of rezultat.tokovi) {
      assert(typeof tok.id === 'string' && tok.id.length > 0, 'tok.id');
      assert(typeof tok.naziv === 'string' && tok.naziv.length > 0, 'tok.naziv');
      assert(tok.kapacitetPoSatu > 0, 'tok.kapacitetPoSatu > 0');
      assert(tok.iskoriscenost >= 0 && tok.iskoriscenost <= 1, 'tok.iskoriscenost mora biti 0..1');
      assert(tok.latencijaMs > 0, 'tok.latencijaMs > 0');
      assert(tok.greskePo1000 >= 0, 'tok.greskePo1000 >= 0');
      assert(
        tok.status === 'stabilan' || tok.status === 'optimizacija' || tok.status === 'kritican',
        'tok.status mora biti validan',
      );
    }
  });

  await test('Agregatni KPI su u očekivanim granicama', () => {
    assert(rezultat.operativniIndeks >= 0 && rezultat.operativniIndeks <= 1, 'operativniIndeks 0..1');
    assert(rezultat.stabilnost >= 0 && rezultat.stabilnost <= 1, 'stabilnost 0..1');
    assert(
      rezultat.prosekIskoriscenosti >= 0 && rezultat.prosekIskoriscenosti <= 1,
      'prosekIskoriscenosti 0..1',
    );
    assert(rezultat.prosekLatencijeMs > 0, 'prosekLatencijeMs > 0');
    assert(rezultat.ukupniKapacitetPoSatu > 0, 'ukupniKapacitetPoSatu > 0');
    assert(rezultat.procenjeniOutputPoSatu > 0, 'procenjeniOutputPoSatu > 0');
    assert(
      rezultat.procenjeniOutputPoSatu <= rezultat.ukupniKapacitetPoSatu,
      'output ne sme biti veći od kapaciteta',
    );
  });

  await test('Builder je determinističan po domen modelu (sem timestamp)', () => {
    const a = buildPerkolizonik('user-a');
    const b = buildPerkolizonik('user-a');
    assertEqual(a.tokovi.length, b.tokovi.length, 'broj tokova');
    assertEqual(a.operativniIndeks, b.operativniIndeks, 'operativniIndeks');
    assertEqual(a.stabilnost, b.stabilnost, 'stabilnost');
    assertEqual(a.prosekIskoriscenosti, b.prosekIskoriscenosti, 'prosekIskoriscenosti');
    assertEqual(a.prosekLatencijeMs, b.prosekLatencijeMs, 'prosekLatencijeMs');
    assertEqual(a.ukupniKapacitetPoSatu, b.ukupniKapacitetPoSatu, 'ukupniKapacitetPoSatu');
    assertEqual(a.procenjeniOutputPoSatu, b.procenjeniOutputPoSatu, 'procenjeniOutputPoSatu');
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
