import type { EvaluatedPokerHand } from './types';

export const REAL_CREATE_QVADERS_NAME = 'REAL CREATE QVADERS';

export const REAL_CREATE_QVADERS_ALIASES = ['qvaders', 'quads', 'four-of-kind'] as const;

export const REAL_CREATE_QVADERS_AFFECTED_MODULES = [
  'src/lib/poker/hand-evaluator.ts',
  'src/lib/poker/engine.ts',
  'src/lib/poker/types.ts',
  'src/app/api/master-poker-real-create-qvaders/route.ts',
] as const;

export const REAL_CREATE_QVADERS_SUCCESS_CRITERIA = [
  'Evaluator marks four-of-kind hands as REAL CREATE QVADERS.',
  'Poker showdown audit log keeps canonical four-of-kind label and REAL CREATE QVADERS marker.',
  'API contract exposes aliases, affected modules, and success criteria.',
] as const;

export function isRealCreateQvadersHand(hand: Pick<EvaluatedPokerHand, 'rank'>): boolean {
  return hand.rank === 'four-of-kind';
}

export function getRealCreateQvadersContract() {
  return {
    name: REAL_CREATE_QVADERS_NAME,
    canonicalRank: 'four-of-kind',
    aliases: [...REAL_CREATE_QVADERS_ALIASES],
    affectedModules: [...REAL_CREATE_QVADERS_AFFECTED_MODULES],
    successCriteria: [...REAL_CREATE_QVADERS_SUCCESS_CRITERIA],
  };
}
