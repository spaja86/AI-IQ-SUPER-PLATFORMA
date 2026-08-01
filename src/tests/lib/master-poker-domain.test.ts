import { createStandardDeck, shuffleDeck } from '../../lib/poker/deck';
import { evaluateBestHand, evaluateFiveCardHand } from '../../lib/poker/hand-evaluator';
import { createMasterPokerState } from '../../lib/poker/engine';
import { validatePokerActionIntegrity } from '../../lib/poker/anti-cheat';
import {
  getRealCreateQvadersContract,
  isRealCreateQvadersHand,
  REAL_CREATE_QVADERS_NAME,
} from '../../lib/poker/real-create-qvaders';

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
  console.log('\n🃏 MASTER POKER — Domain test suite\n');

  await test('Standardni špil ima 52 jedinstvene karte', () => {
    const deck = createStandardDeck();
    assertEqual(deck.length, 52, 'broj karata');
    const unique = new Set(deck.map((c) => c.code));
    assertEqual(unique.size, 52, 'jedinstvene karte');
  });

  await test('Deterministički shuffle daje stabilan redosled za isti seed', () => {
    const deck = createStandardDeck();
    const a = shuffleDeck(deck, 123456).deck.map((c) => c.code).join(',');
    const b = shuffleDeck(deck, 123456).deck.map((c) => c.code).join(',');
    assertEqual(a, b, 'shuffle mora biti deterministički');
  });

  await test('Evaluator detektuje straight flush', () => {
    const hand = evaluateBestHand([
      { rank: 'A', suit: '♠', value: 14, code: 'A♠' },
      { rank: 'K', suit: '♠', value: 13, code: 'K♠' },
      { rank: 'Q', suit: '♠', value: 12, code: 'Q♠' },
      { rank: 'J', suit: '♠', value: 11, code: 'J♠' },
      { rank: '10', suit: '♠', value: 10, code: '10♠' },
      { rank: '2', suit: '♦', value: 2, code: '2♦' },
      { rank: '3', suit: '♣', value: 3, code: '3♣' },
    ]);

    assertEqual(hand.rank, 'straight-flush', 'rank');
  });

  await test('Evaluator detektuje REAL CREATE QVADERS alias za four-of-kind', () => {
    const hand = evaluateFiveCardHand([
      { rank: 'A', suit: '♠', value: 14, code: 'A♠' },
      { rank: 'A', suit: '♥', value: 14, code: 'A♥' },
      { rank: 'A', suit: '♦', value: 14, code: 'A♦' },
      { rank: 'A', suit: '♣', value: 14, code: 'A♣' },
      { rank: 'K', suit: '♠', value: 13, code: 'K♠' },
    ]);

    assertEqual(hand.rank, 'four-of-kind', 'rank');
    assert(hand.aliases?.includes('qvaders') === true, 'four-of-kind mora nositi qvaders alias');
    assert(isRealCreateQvadersHand(hand), `${REAL_CREATE_QVADERS_NAME} marker mora biti aktivan`);
  });

  await test('REAL CREATE QVADERS contract ostaje stabilan', () => {
    const contract = getRealCreateQvadersContract();
    assertEqual(contract.name, REAL_CREATE_QVADERS_NAME, 'contract.name');
    assert(contract.aliases.includes('four-of-kind'), 'contract mora sadržati canonical alias');
    assert(contract.successCriteria.length >= 3, 'contract mora imati success criteria');
  });

  await test('Poker anti-cheat odbija duplikat action ID', () => {
    const state = createMasterPokerState({ seed: 7 });
    const playerId = state.currentTurnPlayerId;
    const action = {
      actionId: 'dup-action',
      playerId,
      type: 'call' as const,
      source: 'human' as const,
    };

    state.seenActionIds[action.actionId] = true;
    const result = validatePokerActionIntegrity(state, action);
    assert(!result.allowed, 'duplikat action ID mora biti blokiran');
  });

  await test('Poker anti-cheat odbija potez van reda', () => {
    const state = createMasterPokerState({ seed: 8 });
    const wrongPlayer = state.players.find((p) => p.id !== state.currentTurnPlayerId);
    assert(wrongPlayer, 'mora postojati drugi igrač');

    const result = validatePokerActionIntegrity(state, {
      actionId: 'wrong-order',
      playerId: wrongPlayer.id,
      type: 'check',
      source: 'bot',
    });

    assert(!result.allowed, 'pogrešan redosled mora biti blokiran');
  });

  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failed > 0) process.exit(1);
}

runTests().catch((e) => {
  console.error('Kritična greška u test runneru:', e);
  process.exit(1);
});
