import { drawCards, createStandardDeck, shuffleDeck } from './deck';
import { evaluateBestHand, compareHands } from './hand-evaluator';
import { validatePokerActionIntegrity } from './anti-cheat';
import type {
  PokerAction,
  PokerApplyResult,
  PokerAuditEntry,
  PokerPlayerState,
  PokerState,
  PokerStreet,
} from './types';

const DEFAULT_POKER_PLAYERS = [
  { id: 'p1-human', ime: 'Ti', isBot: false },
  { id: 'p2-bot', ime: 'Omega Bot', isBot: true },
  { id: 'p3-bot', ime: 'Spaja Bot', isBot: true },
];

export interface CreatePokerStateOptions {
  seed?: number;
  initialChips?: number;
  smallBlind?: number;
  bigBlind?: number;
}

function cloneState(state: PokerState): PokerState {
  return {
    ...state,
    players: state.players.map((p) => ({ ...p, holeCards: [...p.holeCards] })),
    communityCards: [...state.communityCards],
    deck: [...state.deck],
    seenActionIds: { ...state.seenActionIds },
    winnerIds: [...state.winnerIds],
    auditLog: [...state.auditLog],
  };
}

function createAuditEntry(state: PokerState, entry: Omit<PokerAuditEntry, 'id' | 'timestamp'>): PokerAuditEntry {
  return {
    ...entry,
    id: `audit-${state.handNumber}-${state.actionCount}-${state.auditLog.length + 1}`,
    timestamp: new Date().toISOString(),
  };
}

function activePlayers(state: PokerState): PokerPlayerState[] {
  return state.players.filter((p) => !p.folded);
}

function bettingPlayers(state: PokerState): PokerPlayerState[] {
  return state.players.filter((p) => !p.folded && !p.allIn);
}

function findNextActivePlayer(players: PokerPlayerState[], startIndex: number): PokerPlayerState | null {
  for (let offset = 1; offset <= players.length; offset++) {
    const idx = (startIndex + offset) % players.length;
    if (!players[idx].folded && !players[idx].allIn) return players[idx];
  }
  return players.find((p) => !p.folded) ?? null;
}

function postBlind(state: PokerState, playerIndex: number, amount: number): void {
  const player = state.players[playerIndex];
  const paid = Math.min(amount, player.chips);
  player.chips -= paid;
  player.contribution += paid;
  player.totalContribution += paid;
  player.allIn = player.chips === 0;
  state.pot += paid;
}

function prepareStreet(state: PokerState, street: PokerStreet): void {
  state.street = street;
  state.currentBet = 0;
  for (const p of state.players) {
    p.contribution = 0;
    p.actedThisStreet = false;
  }
  const dealer = state.players[state.dealerIndex];
  const currentIdx = state.players.findIndex((p) => p.id === dealer.id);
  const nextTurn = findNextActivePlayer(state.players, currentIdx);
  state.currentTurnPlayerId = nextTurn?.id ?? state.players[currentIdx]?.id ?? state.players[0]?.id ?? '';
}

function finalizeHand(state: PokerState): void {
  state.street = 'hand-over';
  for (const p of state.players) {
    p.contribution = 0;
    p.actedThisStreet = false;
  }
}

function resolveFoldWin(state: PokerState): void {
  const winner = activePlayers(state)[0];
  if (!winner) return;

  winner.chips += state.pot;
  winner.handsWon += 1;
  state.winnerIds = [winner.id];
  state.winningHandLabel = 'Fold Win';

  state.auditLog.push(
    createAuditEntry(state, {
      hand: state.handNumber,
      street: state.street,
      action: 'system',
      details: `${winner.ime} osvaja pot bez showdown-a`,
      pot: state.pot,
    }),
  );

  state.pot = 0;
  finalizeHand(state);
}

function resolveShowdown(state: PokerState): void {
  const contenders = activePlayers(state);
  if (contenders.length === 0) {
    state.winnerIds = [];
    state.winningHandLabel = 'N/A';
    finalizeHand(state);
    return;
  }

  const scored = contenders.map((player) => ({
    player,
    hand: evaluateBestHand([...player.holeCards, ...state.communityCards]),
  }));

  scored.sort((a, b) => compareHands(b.hand, a.hand));
  const best = scored[0];
  const winners = scored.filter((s) => compareHands(s.hand, best.hand) === 0).map((s) => s.player);

  const split = Math.floor(state.pot / winners.length);
  let remainder = state.pot - split * winners.length;

  for (const winner of winners) {
    winner.chips += split + (remainder > 0 ? 1 : 0);
    if (remainder > 0) remainder -= 1;
    winner.handsWon += 1;
  }

  state.winnerIds = winners.map((w) => w.id);
  state.winningHandLabel = best.hand.label;
  state.auditLog.push(
    createAuditEntry(state, {
      hand: state.handNumber,
      street: 'showdown',
      action: 'system',
      details: `Showdown: ${winners.map((w) => w.ime).join(', ')} (${best.hand.label})`,
      pot: state.pot,
    }),
  );

  state.pot = 0;
  finalizeHand(state);
}

function isStreetComplete(state: PokerState): boolean {
  const players = bettingPlayers(state);
  if (players.length <= 1) return true;
  return players.every((p) => p.actedThisStreet && p.contribution === state.currentBet);
}

function dealCommunity(state: PokerState, count: number): void {
  const burn = drawCards(state.deck, 1);
  state.deck = burn.deck;
  const draw = drawCards(state.deck, count);
  state.communityCards.push(...draw.drawn);
  state.deck = draw.deck;
}

function advanceStreet(state: PokerState): void {
  if (state.street === 'preflop') {
    dealCommunity(state, 3);
    prepareStreet(state, 'flop');
    return;
  }
  if (state.street === 'flop') {
    dealCommunity(state, 1);
    prepareStreet(state, 'turn');
    return;
  }
  if (state.street === 'turn') {
    dealCommunity(state, 1);
    prepareStreet(state, 'river');
    return;
  }
  if (state.street === 'river') {
    state.street = 'showdown';
    resolveShowdown(state);
  }
}

function setupNewHand(state: PokerState): PokerState {
  const next = cloneState(state);
  const readyPlayers = next.players.filter((p) => p.chips > 0);
  if (readyPlayers.length <= 1) {
    const maxChips = Math.max(...next.players.map((p) => p.chips), 0);
    for (const player of next.players) {
      player.chips = maxChips > 0 ? maxChips : 1_000;
      player.handsWon = 0;
    }
  }

  next.handNumber += 1;
  next.actionCount = 0;
  next.winnerIds = [];
  next.winningHandLabel = '';
  next.communityCards = [];
  next.pot = 0;
  next.currentBet = next.bigBlind;
  next.seenActionIds = {};

  for (const p of next.players) {
    p.folded = p.chips <= 0;
    p.allIn = false;
    p.holeCards = [];
    p.contribution = 0;
    p.totalContribution = 0;
    p.actedThisStreet = false;
  }

  // Seed ulaz = (tekući seed + hand broj), a izlaz seed iz shuffle-a čuvamo nazad.
  // Time svaka ruka ostaje deterministička, ali i jedinstvena kroz session tok.
  const shuffled = shuffleDeck(createStandardDeck(), next.seed + next.handNumber);
  next.deck = shuffled.deck;
  next.seed = shuffled.seed;

  for (const player of next.players) {
    if (player.folded) continue;
    const draw = drawCards(next.deck, 2);
    player.holeCards = draw.drawn;
    next.deck = draw.deck;
  }

  next.dealerIndex = (next.dealerIndex + 1) % next.players.length;
  const sbIndex = (next.dealerIndex + 1) % next.players.length;
  const bbIndex = (next.dealerIndex + 2) % next.players.length;

  postBlind(next, sbIndex, next.smallBlind);
  postBlind(next, bbIndex, next.bigBlind);

  next.currentTurnPlayerId = findNextActivePlayer(next.players, bbIndex)?.id ?? next.players[bbIndex]?.id ?? '';
  next.street = 'preflop';

  next.auditLog.push(
    createAuditEntry(next, {
      hand: next.handNumber,
      street: 'preflop',
      action: 'system',
      details: `Nova ruka pokrenuta (dealer: ${next.players[next.dealerIndex].ime})`,
      pot: next.pot,
    }),
  );

  return next;
}

export function createMasterPokerState(options: CreatePokerStateOptions = {}): PokerState {
  const initialChips = options.initialChips ?? 1_000;
  const base: PokerState = {
    players: DEFAULT_POKER_PLAYERS.map((cfg) => ({
      ...cfg,
      chips: initialChips,
      holeCards: [],
      folded: false,
      allIn: false,
      contribution: 0,
      totalContribution: 0,
      actedThisStreet: false,
      handsWon: 0,
    })),
    dealerIndex: 0,
    smallBlind: options.smallBlind ?? 10,
    bigBlind: options.bigBlind ?? 20,
    currentTurnPlayerId: 'p1-human',
    currentBet: 0,
    pot: 0,
    street: 'preflop',
    communityCards: [],
    deck: [],
    handNumber: 0,
    actionCount: 0,
    seenActionIds: {},
    winnerIds: [],
    winningHandLabel: '',
    auditLog: [],
    seed: options.seed ?? Date.now(),
  };

  return setupNewHand(base);
}

export function startNextPokerHand(state: PokerState): PokerState {
  return setupNewHand(state);
}

export function getLegalActions(state: PokerState, playerId: string): Array<'fold' | 'check' | 'call' | 'raise'> {
  const player = state.players.find((p) => p.id === playerId);
  if (!player || player.folded || player.allIn) return [];

  const toCall = Math.max(0, state.currentBet - player.contribution);
  const out: Array<'fold' | 'check' | 'call' | 'raise'> = ['fold'];

  if (toCall === 0) out.push('check');
  if (toCall > 0 && player.chips > 0) out.push('call');

  const canRaise = player.chips > toCall + state.bigBlind;
  if (canRaise) out.push('raise');

  return out;
}

export function applyPokerAction(state: PokerState, action: PokerAction): PokerApplyResult {
  const next = cloneState(state);

  const antiCheat = validatePokerActionIntegrity(next, action);
  if (!antiCheat.allowed) {
    return { state: next, error: antiCheat.reason };
  }

  const player = next.players.find((p) => p.id === action.playerId);
  if (!player) {
    return { state: next, error: 'Igrač nije pronađen.' };
  }

  const toCall = Math.max(0, next.currentBet - player.contribution);

  if (action.type === 'fold') {
    player.folded = true;
    player.actedThisStreet = true;
  }

  if (action.type === 'check') {
    if (toCall !== 0) return { state: next, error: 'Check nije dozvoljen.' };
    player.actedThisStreet = true;
  }

  if (action.type === 'call') {
    if (toCall <= 0) return { state: next, error: 'Call nije potreban.' };
    const paid = Math.min(toCall, player.chips);
    player.chips -= paid;
    player.contribution += paid;
    player.totalContribution += paid;
    next.pot += paid;
    player.actedThisStreet = true;
    if (player.chips === 0) player.allIn = true;
  }

  if (action.type === 'raise') {
    const raiseAmount = action.amount ?? next.bigBlind;
    const targetBet = next.currentBet + raiseAmount;
    const required = targetBet - player.contribution;
    if (required > player.chips) {
      return { state: next, error: 'Nedovoljno chip-ova za raise.' };
    }

    player.chips -= required;
    player.contribution += required;
    player.totalContribution += required;
    next.pot += required;
    player.actedThisStreet = true;
    next.currentBet = targetBet;

    for (const p of next.players) {
      if (p.id !== player.id && !p.folded && !p.allIn) {
        p.actedThisStreet = false;
      }
    }

    if (player.chips === 0) player.allIn = true;
  }

  next.seenActionIds[action.actionId] = true;
  next.actionCount += 1;
  next.auditLog.push(
    createAuditEntry(next, {
      hand: next.handNumber,
      street: next.street,
      playerId: player.id,
      action: action.type,
      details: `${player.ime}: ${action.type}${action.type === 'raise' ? ` +${action.amount ?? next.bigBlind}` : ''}`,
      pot: next.pot,
    }),
  );

  if (activePlayers(next).length === 1) {
    resolveFoldWin(next);
    return { state: next };
  }

  if (isStreetComplete(next)) {
    advanceStreet(next);
    return { state: next };
  }

  const currentIdx = next.players.findIndex((p) => p.id === player.id);
  next.currentTurnPlayerId = findNextActivePlayer(next.players, currentIdx)?.id ?? next.players[currentIdx]?.id ?? '';
  return { state: next };
}

export function createActionId(prefix: string, hand: number, actionCount: number): string {
  return `${prefix}-${hand}-${actionCount}`;
}
