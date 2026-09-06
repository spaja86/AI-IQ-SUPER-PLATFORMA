import {
  ISTORIJSKE_NABAVKE,
  UKUPNO_POTROSENO_MINOR,
  getTransakcijaById,
  validirajTransferRequest,
  serijalizujTransakciju,
} from '../../lib/wollet/transactions';

let passed = 0;
let failed = 0;

async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (e) {
    console.error(`  ❌ ${name}`);
    console.error(`     ${e instanceof Error ? e.message : String(e)}`);
    failed++;
  }
}

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

async function run() {
  console.log('\n📋 Wollet Transactions Test Suite\n');

  await test('ISTORIJSKE_NABAVKE sadrži tačno 50 transakcija', () => {
    assert(ISTORIJSKE_NABAVKE.length === 50, `Expected 50, got ${ISTORIJSKE_NABAVKE.length}`);
  });

  await test('UKUPNO_POTROSENO_MINOR je $1,127,000 USD u centima (zbir svih 50 transakcija)', () => {
    assert(UKUPNO_POTROSENO_MINOR === 112_700_000, `Expected 112,700,000, got ${UKUPNO_POTROSENO_MINOR}`);
  });

  await test('suma svih iznosa odgovara ukupnom trošku', () => {
    const suma = ISTORIJSKE_NABAVKE.reduce((acc, t) => acc + t.iznosMinor, 0);
    assert(suma === UKUPNO_POTROSENO_MINOR, `Expected ${UKUPNO_POTROSENO_MINOR}, got ${suma}`);
  });

  await test('sve transakcije imaju status IZVRSENO', () => {
    const neIzvrsene = ISTORIJSKE_NABAVKE.filter((t) => t.status !== 'IZVRSENO');
    assert(neIzvrsene.length === 0, `Found ${neIzvrsene.length} non-IZVRSENO transactions`);
  });

  await test('sve transakcije imaju USD valutu', () => {
    const nisuUsd = ISTORIJSKE_NABAVKE.filter((t) => t.valuta !== 'USD');
    assert(nisuUsd.length === 0, `Found ${nisuUsd.length} non-USD transactions`);
  });

  await test('svaka istorijska transakcija ima vezan izvor i destinaciju bez self-transfera', () => {
    const bezVeze = ISTORIJSKE_NABAVKE.filter((t) => !t.izvor.trim() || !t.destinacija.trim() || t.izvor === t.destinacija);
    assert(bezVeze.length === 0, `Found ${bezVeze.length} transactions without valid source linkage`);
  });

  await test('ID-ovi su sekvencijalni od 1 do 50', () => {
    for (let i = 0; i < ISTORIJSKE_NABAVKE.length; i++) {
      assert(ISTORIJSKE_NABAVKE[i].id === i + 1, `Expected id ${i + 1}, got ${ISTORIJSKE_NABAVKE[i].id}`);
    }
  });

  await test('getTransakcijaById vraća ispravnu transakciju', () => {
    const tx = getTransakcijaById(1);
    assert(tx !== undefined, 'Transakcija #1 treba da postoji');
    assert(tx?.naziv === 'Biskop Digitalni', `Expected "Biskop Digitalni", got "${tx?.naziv}"`);
  });

  await test('getTransakcijaById vraća undefined za nepostojeći ID', () => {
    const tx = getTransakcijaById(999);
    assert(tx === undefined, 'Transakcija #999 ne treba da postoji');
  });

  await test('validirajTransferRequest vraća greške za prazan zahtev', () => {
    const errors = validirajTransferRequest({ izvor: '', destinacija: '', iznos: 0, valuta: 'RSD', opis: '' });
    assert(errors.length > 0, 'Trebalo bi da ima grešaka');
  });

  await test('validirajTransferRequest vraća grešku za negativan iznos', () => {
    const errors = validirajTransferRequest({ izvor: 'A', destinacija: 'B', iznos: -100, valuta: 'USD', opis: 'test' });
    assert(errors.some((e) => e.includes('Iznos')), 'Trebalo bi da ima grešku za iznos');
  });

  await test('validirajTransferRequest ne vraća greške za validan zahtev', () => {
    const errors = validirajTransferRequest({ izvor: 'DIGI-IND-001', destinacija: 'Eksterni', iznos: 1000, valuta: 'RSD', opis: 'Testna transakcija' });
    assert(errors.length === 0, `Expected no errors, got: ${errors.join(', ')}`);
  });

  await test('serijalizujTransakciju vraća ispravan objekat', () => {
    const tx = ISTORIJSKE_NABAVKE[0];
    const serialized = serijalizujTransakciju(tx);
    assert(serialized.id === 1, 'id treba da bude 1');
    assert(serialized.naziv === 'Biskop Digitalni', 'naziv nije ispravan');
    assert(serialized.valuta === 'USD', 'valuta treba da bude USD');
  });

  await test('serijalizujTransakciju čuva source/destination audit link', () => {
    const tx = ISTORIJSKE_NABAVKE[0];
    const serialized = serijalizujTransakciju(tx);
    assert(serialized.izvor === tx.izvor, 'izvor mora biti sačuvan');
    assert(serialized.destinacija === tx.destinacija, 'destinacija mora biti sačuvana');
  });

  const ok = failed === 0;
  console.log(`\n${ok ? '✅' : '❌'} ${passed} passed, ${failed} failed\n`);
  if (!ok) process.exit(1);
}

run().catch((e) => { console.error(e); process.exit(1); });
