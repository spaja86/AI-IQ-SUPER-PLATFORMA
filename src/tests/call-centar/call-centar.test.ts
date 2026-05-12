import { buildCallCentarIzvestaj, dodeliPaketUsluga, callCentarPaketi } from '../../lib/call-centar';

let passed = 0;
let failed = 0;
const failures: string[] = [];

async function test(name: string, fn: () => void): Promise<void> {
  try {
    fn();
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

function assert(cond: boolean, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

function assertEqual<T>(actual: T, expected: T, label: string): void {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

async function runTests(): Promise<void> {
  console.log('\n📞 Call Centar Izveštaj — Unit Test Suite\n');

  await test('izveštaj vraća sva 4 paketa', () => {
    const r = buildCallCentarIzvestaj();
    assertEqual(r.paketi.length, callCentarPaketi.length, 'broj paketa');
    assertEqual(r.paketi.length, 4, 'mora biti 4 paketa');
  });

  await test('izveštaj vraća agente call centra', () => {
    const r = buildCallCentarIzvestaj();
    assert(r.agenti.length > 0, 'agenti ne smeju biti prazni');
  });

  await test('izveštaj vraća samo aktivne tikete', () => {
    const r = buildCallCentarIzvestaj();
    assert(r.aktivniTiketi.every((t) => t.status !== 'zatvoren'), 'zatvoreni tiketi ne smeju biti uključeni');
  });

  await test('ukupanBrojLicenci raste nakon dodele licence', () => {
    const pre = buildCallCentarIzvestaj().ukupanBrojLicenci;
    dodeliPaketUsluga('novo@example.com', 'Enterprise');
    const posle = buildCallCentarIzvestaj().ukupanBrojLicenci;
    assertEqual(posle, pre + 1, 'ukupanBrojLicenci');
  });

  console.log('\n📊 Rezultat:');
  console.log(`  ✅ Prošlo: ${passed}`);
  console.log(`  ❌ Palo: ${failed}`);

  if (failed > 0) {
    console.log('\nNeuspešni testovi:');
    for (const failure of failures) {
      console.log(`  - ${failure}`);
    }
    process.exit(1);
  }
}

void runTests();
