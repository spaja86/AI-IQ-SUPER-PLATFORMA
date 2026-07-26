import { applyPokerAction, createMasterPokerState, createActionId, getLegalActions } from '../../lib/poker/engine';

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

function applyFirstLegalAction(state: ReturnType<typeof createMasterPokerState>, playerId: string) {
  const legal = getLegalActions(state, playerId);
  if (legal.includes('check')) {
    return applyPokerAction(state, {
      actionId: createActionId('t', state.handNumber, state.actionCount + 1),
      playerId,
      type: 'check',
      source: 'bot',
    }).state;
  }
  if (legal.includes('call')) {
    return applyPokerAction(state, {
      actionId: createActionId('t', state.handNumber, state.actionCount + 1),
      playerId,
      type: 'call',
      source: 'bot',
    }).state;
  }
  return applyPokerAction(state, {
    actionId: createActionId('t', state.handNumber, state.actionCount + 1),
    playerId,
    type: 'fold',
    source: 'bot',
  }).state;
}

async function runTests(): Promise<void> {
  console.log('\n🃏 MASTER POKER — Runner state integration suite\n');

  await test('Initial state ima preflop, blind i aktivnog igrača', () => {
    const state = createMasterPokerState({ seed: 20260725 });
    assertEqual(state.street, 'preflop', 'street');
    assert(state.pot > 0, 'pot mora imati blindove');
    assert(state.currentTurnPlayerId.length > 0, 'mora postojati aktivan potez');
  });

  await test('Illegal check kada postoji call vraća grešku', () => {
    const state = createMasterPokerState({ seed: 11 });
    const result = applyPokerAction(state, {
      actionId: 'illegal-check',
      playerId: state.currentTurnPlayerId,
      type: 'check',
      source: 'human',
    });

    assert(result.error !== undefined, 'očekivana greška za check sa aktivnim bet-om');
  });

  await test('Pravna sekvenca vodi u flop i povećava community karte', () => {
    let state = createMasterPokerState({ seed: 42 });

    let safety = 0;
    while (state.street === 'preflop' && safety < 20) {
      const current = state.currentTurnPlayerId;
      state = applyFirstLegalAction(state, current);
      safety += 1;
    }

    assertEqual(state.street, 'flop', 'mora preći u flop');
    assertEqual(state.communityCards.length, 3, 'flop ima 3 karte');
  });

  await test('Fold collapse završava ruku i postavlja winner-a', () => {
    let state = createMasterPokerState({ seed: 99 });

    for (let i = 0; i < 2; i++) {
      const result = applyPokerAction(state, {
        actionId: `fold-${i}`,
        playerId: state.currentTurnPlayerId,
        type: 'fold',
        source: 'human',
      });
      state = result.state;
      if (state.street === 'hand-over') break;
    }

    assertEqual(state.street, 'hand-over', 'ruka mora biti završena');
    assert(state.winnerIds.length >= 1, 'mora postojati winner');
  });

  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failed > 0) process.exit(1);
}

runTests().catch((e) => {
  console.error('Kritična greška u test runneru:', e);
  process.exit(1);
});
