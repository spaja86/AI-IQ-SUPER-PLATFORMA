import { igrice } from '../../lib/igrice';
import { MASTER_POKER_GAME_ID } from '../../lib/poker/types';
import {
  getRunnerTip,
  getRunnerTipZaIgricu,
  registrujCustomRunnerZaIgricu,
  registrujRunnerResolver,
  ukloniCustomRunnerZaIgricu,
  ukloniRunnerResolver,
} from '../../lib/gaming-endzin';

let passed = 0;
let failed = 0;

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
  console.log('\n🎮 Gaming Endzin — test suite\n');

  await test('Kategorija mapiranje vraća očekivani runner', () => {
    assertEqual(getRunnerTip('strategija'), 'simulacija', 'strategija->simulacija');
    assertEqual(getRunnerTip('edukativna'), 'edu', 'edukativna->edu');
  });

  await test('MASTER POKER koristi poker runner', () => {
    const poker = igrice.find((g) => g.id === MASTER_POKER_GAME_ID);
    assert(poker, 'MASTER POKER igrica mora postojati');
    assertEqual(getRunnerTipZaIgricu(poker), 'poker', 'master-poker-runner');
  });

  await test('Custom runner override po igrici ima prioritet', () => {
    const game = igrice[0];
    registrujCustomRunnerZaIgricu(game.id, 'kreativna');
    assertEqual(getRunnerTipZaIgricu(game), 'kreativna', 'custom-runner');
    ukloniCustomRunnerZaIgricu(game.id);
  });

  await test('Dinamički resolver se primenjuje i može ukloniti', () => {
    const game = igrice.find((g) => g.id !== MASTER_POKER_GAME_ID);
    assert(game, 'potrebna je igrica za resolver test');

    const resolver = () => 'eglan' as const;
    registrujRunnerResolver(resolver);
    assertEqual(getRunnerTipZaIgricu(game), 'eglan', 'resolver-runner');
    ukloniRunnerResolver(resolver);
  });

  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failed > 0) process.exit(1);
}

runTests().catch((e) => {
  console.error('Kritična greška u test runneru:', e);
  process.exit(1);
});
