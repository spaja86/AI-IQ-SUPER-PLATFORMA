import {
  isValidEmail,
  generisiInstalacioniBroj,
  dodeliPaketUsluga,
  posaljiEmailSaInstalacionimBrojem,
} from '../../lib/call-centar';

let passed = 0;
let failed = 0;
const failures: string[] = [];

async function test(name: string, testFn: () => void): Promise<void> {
  try {
    testFn();
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

async function runTests(): Promise<void> {
  console.log('\n📞 Call Centar Licenca — Unit Test Suite\n');

  await test('isValidEmail prihvata validan email', () => {
    assert(isValidEmail('korisnik@example.com'), 'email treba da bude validan');
  });

  await test('isValidEmail odbija nevalidan email', () => {
    assert(!isValidEmail('korisnik.example.com'), 'email treba da bude nevalidan');
  });

  await test('generisiInstalacioniBroj kreira Starter prefiks', () => {
    const broj = generisiInstalacioniBroj('Starter');
    assert(/^MS-STARTER-\d{4}$/.test(broj), `neočekivan format: ${broj}`);
  });

  await test('dodeliPaketUsluga vraća aktivnu licencu', () => {
    const lic = dodeliPaketUsluga('proba@example.com', 'Pro');
    assert(lic.tip === 'Pro', 'tip mora biti Pro');
    assert(lic.status === 'aktivna', 'status mora biti aktivna');
    assert(lic.instalacioniBroj.startsWith('MS-PRO-'), 'instalacioni broj mora imati PRO prefiks');
  });

  await test('dodeliPaketUsluga baca grešku za nevalidan email', () => {
    let thrown = false;
    try {
      dodeliPaketUsluga('los-email', 'Starter');
    } catch {
      thrown = true;
    }
    assert(thrown, 'mora baciti grešku');
  });

  await test('posaljiEmailSaInstalacionimBrojem vraća status poslato', () => {
    const r = posaljiEmailSaInstalacionimBrojem('korisnik@example.com', 'MS-PRO-2345', 'Moblini SPAJA Pro');
    assert(r.status === 'poslato', 'status mora biti poslato');
    assert(r.predmet.includes('Moblini SPAJA'), 'predmet mora sadržati naziv');
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
