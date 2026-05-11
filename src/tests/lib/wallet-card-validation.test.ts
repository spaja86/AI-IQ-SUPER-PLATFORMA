import {
  detectCardNetwork,
  isLuhnValid,
  normalizeCardNumber,
  validateCardInput,
} from '../../lib/wallet/card-validation';
import { routePayment } from '../../lib/wallet/payment-orchestration';

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
  console.log('\n💼 Wallet Card Validation Test Suite\n');

  await test('normalizeCardNumber uklanja razmake i crtice', () => {
    assert(normalizeCardNumber('4111 1111-1111 1111') === '4111111111111111', 'normalizacija nije ispravna');
  });

  await test('detectCardNetwork prepoznaje Visa', () => {
    assert(detectCardNetwork('4111111111111111') === 'visa', 'Visa nije prepoznata');
  });

  await test('Luhn validacija radi za test karticu', () => {
    assert(isLuhnValid('4111111111111111') === true, 'Luhn treba da bude true');
  });

  await test('validateCardInput vraća valid=true za ispravnu karticu', () => {
    const now = new Date();
    const result = validateCardInput({
      number: '4111 1111 1111 1111',
      expiryMonth: now.getMonth() + 1,
      expiryYear: now.getFullYear() + 1,
    });
    assert(result.valid === true, 'kartica treba da bude validna');
    assert(result.network === 'visa', 'network treba da bude visa');
  });

  await test('validateCardInput vraća valid=false za neispravan broj', () => {
    const now = new Date();
    const result = validateCardInput({
      number: '4111 1111 1111 1112',
      expiryMonth: now.getMonth() + 1,
      expiryYear: now.getFullYear() + 1,
    });
    assert(result.valid === false, 'kartica treba da bude nevalidna');
  });

  await test('routePayment vraća fallback za nepodržanu valutu regiona', () => {
    const decision = routePayment({
      region: 'RS',
      currency: 'JPY',
      cardNetwork: 'visa',
      amountMinor: 1000,
    });
    assert(decision.primaryProcessor === 'paypal', 'očekivan je fallback procesor');
  });

  await test('routePayment dodaje manual-review za visoke iznose', () => {
    const decision = routePayment({
      region: 'EU',
      currency: 'EUR',
      cardNetwork: 'mastercard',
      amountMinor: 2_000_000,
    });
    assert(decision.fallbackProcessors.includes('manual-review'), 'manual-review fallback treba da postoji');
  });

  console.log(`\n✅ Passed: ${passed}  ❌ Failed: ${failed}`);
  if (failed > 0) process.exit(1);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
