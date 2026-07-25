export const MASTER_POKER_GAME_ID = 'igrica-spaja-poker';

export type CardSuit = '♠' | '♥' | '♦' | '♣';
export type CardRank =
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | 'J'
  | 'Q'
  | 'K'
  | 'A';

export interface PokerCard {
  suit: CardSuit;
  rank: CardRank;
  value: number;
  code: string;
}

export type PokerStreet = 'preflop' | 'flop' | 'turn' | 'river' | 'showdown' | 'hand-over';

export interface PokerPlayerState {
  id: string;
  ime: string;
  isBot: boolean;
  chips: number;
  holeCards: PokerCard[];
  folded: boolean;
  allIn: boolean;
  contribution: number;
  totalContribution: number;
  actedThisStreet: boolean;
  handsWon: number;
}

export type PokerActionType = 'fold' | 'check' | 'call' | 'raise';

export interface PokerAction {
  actionId: string;
  playerId: string;
  type: PokerActionType;
  amount?: number;
  source: 'human' | 'bot';
}

export interface PokerAntiCheatResult {
  allowed: boolean;
  reason?: string;
}

export interface PokerAuditEntry {
  id: string;
  timestamp: string;
  hand: number;
  street: PokerStreet;
  playerId?: string;
  action?: PokerActionType | 'system';
  details: string;
  pot: number;
}

export type PokerHandRank =
  | 'high-card'
  | 'pair'
  | 'two-pair'
  | 'three-of-kind'
  | 'straight'
  | 'flush'
  | 'full-house'
  | 'four-of-kind'
  | 'straight-flush';

export interface EvaluatedPokerHand {
  rank: PokerHandRank;
  rankValue: number;
  kickers: number[];
  label: string;
}

export interface PokerState {
  players: PokerPlayerState[];
  dealerIndex: number;
  smallBlind: number;
  bigBlind: number;
  currentTurnPlayerId: string;
  currentBet: number;
  pot: number;
  street: PokerStreet;
  communityCards: PokerCard[];
  deck: PokerCard[];
  handNumber: number;
  actionCount: number;
  seenActionIds: Record<string, true>;
  winnerIds: string[];
  winningHandLabel: string;
  auditLog: PokerAuditEntry[];
  seed: number;
}

export interface PokerApplyResult {
  state: PokerState;
  error?: string;
}
