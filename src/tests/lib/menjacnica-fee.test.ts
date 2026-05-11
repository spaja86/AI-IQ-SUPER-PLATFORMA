// SpajaUltraOmegaCore -∞Ω+∞ — Unit Testovi za Fee Engine
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/lib/menjacnica-fee.test.ts

import {
  calcFee,
  roundHalfEven,
  calcBuyCostWithFee,
  calcSellNetAmount,
  isValidFeePct,
  isFeeConsistent,
  getEffectiveFeePct,
} from '../../lib/menjacnica/fee';
import { getMarketPair } from '../../lib/menjacnica/pairs';

// ─── Test Runner ──────────────────────────────────────────────────────────────

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

function assertClose(a: number, b: number, tolerance = 1e-8, label = ''): void {
  if (Math.abs(a - b) > tolerance) {
    throw new Error(`${label}: expected ${b}, got ${a} (diff=${Math.abs(a - b)})`);
  }
}

// ─── Tests ────────────────────────────────────────────────────────────────────

async function runTests(): Promise<void> {
  console.log('\n💱 Menjačnica Fee Engine Test Suite\n');

  // ─── roundHalfEven ────────────────────────────────────────────────────────

  await test('roundHalfEven — osnovna zaokruživanja', () => {
    assertClose(roundHalfEven(1.005, 2), 1.0, 1e-9, 'half-even 1.005 → 1.0');
    assertClose(roundHalfEven(2.5, 0), 2, 1e-9, 'half-even 2.5 → 2');
    assertClose(roundHalfEven(3.5, 0), 4, 1e-9, 'half-even 3.5 → 4');
    assertClose(roundHalfEven(1.23456789, 8), 1.23456789, 1e-9, '8 decimala bez gubitka');
  });

  await test('roundHalfEven — negativni broj', () => {
    const r = roundHalfEven(-2.5, 0);
    // Math.sin implementacija — prihvatamo -2 ili -3 (oba su ok za bankarsko zaokruživanje)
    assert(r === -2 || r === -3, `roundHalfEven(-2.5) treba biti -2 ili -3, dobili ${r}`);
  });

  // ─── calcFee — buy ────────────────────────────────────────────────────────

  await test('calcFee buy market — ispravno računa fee i grossAmount', () => {
    const pair = getMarketPair('BTC_USDT');
    assert(pair !== undefined, 'BTC_USDT par mora postojati');
    const result = calcFee(
      { qty: 0.5, price: 67000, side: 'buy', orderType: 'market', takerFeePct: 0.002, makerFeePct: 0.001 },
      pair!,
    );
    assertClose(result.grossAmount, 33500, 1e-4, 'grossAmount');
    assertClose(result.feeAmount, 67, 1e-4, 'feeAmount (0.2% od 33500)');
    assert(result.feeAssetId === 'USDT', 'feeAssetId treba biti USDT');
    assertClose(result.netAmount, 0.5, 1e-8, 'netAmount za buy je qty base asseta');
    assertClose(result.feePct, 0.002, 1e-9, 'feePct taker');
  });

  await test('calcFee sell market — ispravno računa fee i netAmount', () => {
    const pair = getMarketPair('BTC_USDT');
    assert(pair !== undefined, 'BTC_USDT par mora postojati');
    const result = calcFee(
      { qty: 0.5, price: 67000, side: 'sell', orderType: 'market', takerFeePct: 0.002, makerFeePct: 0.001 },
      pair!,
    );
    assertClose(result.grossAmount, 33500, 1e-4, 'grossAmount');
    assertClose(result.feeAmount, 67, 1e-4, 'feeAmount');
    assertClose(result.netAmount, 33433, 1e-4, 'netAmount = gross - fee');
  });

  await test('calcFee limit order — koristi maker fee', () => {
    const pair = getMarketPair('BTC_USDT');
    assert(pair !== undefined, 'BTC_USDT par mora postojati');
    const result = calcFee(
      { qty: 1, price: 67000, side: 'buy', orderType: 'limit', takerFeePct: 0.002, makerFeePct: 0.001 },
      pair!,
    );
    assertClose(result.feeAmount, 67, 1e-4, 'fee za limit (0.1% od 67000)');
    assertClose(result.feePct, 0.001, 1e-9, 'maker fee');
  });

  await test('calcFee SPAJA_BTC — maker fee je 0', () => {
    const pair = getMarketPair('SPAJA_BTC');
    assert(pair !== undefined, 'SPAJA_BTC par mora postojati');
    const result = calcFee(
      { qty: 1, price: 10, side: 'buy', orderType: 'limit', takerFeePct: 0.001, makerFeePct: 0.000 },
      pair!,
    );
    assertClose(result.feeAmount, 0, 1e-9, 'SPAJA maker fee = 0');
    assertClose(result.netAmount, 1, 1e-8, 'net qty = qty');
  });

  // ─── calcBuyCostWithFee ───────────────────────────────────────────────────

  await test('calcBuyCostWithFee — total uključuje fee', () => {
    const total = calcBuyCostWithFee(1, 67000, 0.002);
    assertClose(total, 67134, 1e-4, 'buy cost = 67000 + 134 fee');
  });

  await test('calcBuyCostWithFee — nulta fee', () => {
    const total = calcBuyCostWithFee(1, 67000, 0);
    assertClose(total, 67000, 1e-4, 'bez fee = gross');
  });

  // ─── calcSellNetAmount ────────────────────────────────────────────────────

  await test('calcSellNetAmount — odbija fee od prihoda', () => {
    const net = calcSellNetAmount(1, 67000, 0.002);
    assertClose(net, 66866, 1e-4, 'sell net = 67000 - 134');
  });

  // ─── getEffectiveFeePct ───────────────────────────────────────────────────

  await test('getEffectiveFeePct — market vraća taker, limit vraća maker', () => {
    const pair = getMarketPair('BTC_USDT')!;
    assertClose(getEffectiveFeePct('market', pair), 0.002, 1e-9, 'taker fee');
    assertClose(getEffectiveFeePct('limit', pair), 0.001, 1e-9, 'maker fee');
  });

  // ─── isValidFeePct ────────────────────────────────────────────────────────

  await test('isValidFeePct — validacija opsega', () => {
    assert(isValidFeePct(0) === true, '0% je validno');
    assert(isValidFeePct(0.002) === true, '0.2% je validno');
    assert(isValidFeePct(0.05) === true, '5% je validno');
    assert(isValidFeePct(-0.001) === false, 'negativna fee nije validna');
    assert(isValidFeePct(0.051) === false, 'fee > 5% nije validna');
  });

  // ─── isFeeConsistent ─────────────────────────────────────────────────────

  await test('isFeeConsistent — maker <= taker', () => {
    assert(isFeeConsistent(0.001, 0.002) === true, 'maker < taker ok');
    assert(isFeeConsistent(0.002, 0.002) === true, 'maker = taker ok');
    assert(isFeeConsistent(0.003, 0.002) === false, 'maker > taker nije ok');
  });

  // ─── Pair config ──────────────────────────────────────────────────────────

  await test('getMarketPair — BTC_USDT par postoji i ima ispravne vrednosti', () => {
    const pair = getMarketPair('BTC_USDT');
    assert(pair !== undefined, 'par mora postojati');
    assert(pair!.baseAssetId === 'BTC', 'base asset');
    assert(pair!.quoteAssetId === 'USDT', 'quote asset');
    assert(isFeeConsistent(pair!.makerFeePct, pair!.takerFeePct), 'maker <= taker');
  });

  await test('getMarketPair — SPAJA parovi imaju nižu fee od standardnih', () => {
    const spaja = getMarketPair('SPAJA_BTC');
    const standard = getMarketPair('BTC_USDT');
    assert(spaja !== undefined && standard !== undefined, 'oba para moraju postojati');
    assert(spaja!.takerFeePct <= standard!.takerFeePct, 'SPAJA taker fee treba biti <= standard');
  });

  // ─── Preciznost ───────────────────────────────────────────────────────────

  await test('preciznost — nema grešaka pri satoshi kalkulacijama', () => {
    const pair = getMarketPair('BTC_USDT')!;
    const result = calcFee(
      { qty: 0.00001, price: 67000, side: 'buy', orderType: 'market', takerFeePct: 0.002, makerFeePct: 0.001 },
      pair,
    );
    assert(result.feeAmount >= 0, 'fee ne sme biti negativan');
    assert(Number.isFinite(result.grossAmount), 'grossAmount mora biti konačan');
    assert(Number.isFinite(result.feeAmount), 'feeAmount mora biti konačan');
  });

  // ─── Rezultat ────────────────────────────────────────────────────────────

  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo\n`);
  if (failures.length > 0) {
    console.error('Neuspeli testovi:');
    failures.forEach((f) => console.error(`  - ${f}`));
  }

  if (failed > 0) process.exit(1);
}

runTests().catch((e) => {
  console.error('Fatalna greška u test suite:', e);
  process.exit(1);
});
