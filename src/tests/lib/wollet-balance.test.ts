import { minorToDisplay, formatIznos, toUsd, agregirajStanje } from '../../lib/wollet/balance';
import type { WolletAccount } from '../../lib/wollet/types';
import { WOLLET_RACUNI } from '../../lib/wollet/accounts';

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
  console.log('\n💳 Wollet Balance Test Suite\n');

  await test('minorToDisplay konvertuje RSD ispravno (100 para = 1 dinar)', () => {
    assert(minorToDisplay(100, 'RSD') === 1, 'Expected 1 din');
    assert(minorToDisplay(10000, 'RSD') === 100, 'Expected 100 din');
    assert(minorToDisplay(0, 'RSD') === 0, 'Expected 0');
  });

  await test('minorToDisplay konvertuje EUR ispravno (100 centi = 1 EUR)', () => {
    assert(minorToDisplay(100, 'EUR') === 1, 'Expected 1 EUR');
    assert(minorToDisplay(500, 'EUR') === 5, 'Expected 5 EUR');
  });

  await test('minorToDisplay konvertuje USD ispravno (100 centi = 1 USD)', () => {
    assert(minorToDisplay(100, 'USD') === 1, 'Expected 1 USD');
    assert(minorToDisplay(88_000_000, 'USD') === 880_000, 'Expected $880,000');
  });

  await test('formatIznos formatira RSD sa sufiksom din', () => {
    const result = formatIznos(10000, 'RSD');
    assert(result.includes('din'), `Expected "din" in "${result}"`);
    assert(result.includes('100'), `Expected "100" in "${result}"`);
  });

  await test('formatIznos formatira EUR sa € prefiksom', () => {
    const result = formatIznos(500, 'EUR');
    assert(result.startsWith('€'), `Expected € prefix, got "${result}"`);
    assert(result.includes('5.00'), `Expected "5.00" in "${result}"`);
  });

  await test('formatIznos formatira USD sa $ prefiksom', () => {
    const result = formatIznos(1000, 'USD');
    assert(result.startsWith('$'), `Expected $ prefix, got "${result}"`);
    assert(result.includes('10.00'), `Expected "10.00" in "${result}"`);
  });

  await test('toUsd konvertuje USD direktno', () => {
    assert(toUsd(100, 'USD') === 1, 'Expected 1 USD');
    assert(toUsd(88_000_000, 'USD') === 880_000, 'Expected $880,000');
  });

  await test('toUsd konvertuje EUR u USD', () => {
    const result = toUsd(100, 'EUR'); // 1 EUR ~ 1.08 USD
    assert(result > 1 && result < 2, `Expected ~1.08, got ${result}`);
  });

  await test('agregirajStanje agregira WOLLET_RACUNI ispravno', () => {
    const bal = agregirajStanje(WOLLET_RACUNI);
    assert(typeof bal.rsd === 'number', 'rsd should be number');
    assert(typeof bal.eur === 'number', 'eur should be number');
    assert(typeof bal.usd === 'number', 'usd should be number');
    assert(typeof bal.ukupnoUsd === 'number', 'ukupnoUsd should be number');
    assert(bal.usd >= 880_000, `Expected usd >= 880,000 (from USD account), got ${bal.usd}`);
  });

  await test('agregirajStanje ignoriše neaktivne račune', () => {
    const neaktivni: WolletAccount[] = [
      { brojRacuna: 'TEST', naziv: 'Test', valuta: 'EUR', stanjeMinor: 50_000, aktivan: false },
    ];
    const bal = agregirajStanje(neaktivni);
    assert(bal.eur === 0, `Expected eur=0 for inactive account, got ${bal.eur}`);
  });

  await test('agregirajStanje sa praznim nizom vraća nule', () => {
    const bal = agregirajStanje([]);
    assert(bal.rsd === 0 && bal.eur === 0 && bal.usd === 0 && bal.ukupnoUsd === 0, 'Expected all zeros');
  });

  const ok = failed === 0;
  console.log(`\n${ok ? '✅' : '❌'} ${passed} passed, ${failed} failed\n`);
  if (!ok) process.exit(1);
}

run().catch((e) => { console.error(e); process.exit(1); });
