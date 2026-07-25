import type { CardRank, CardSuit, PokerCard } from './types';

const SUITS: CardSuit[] = ['♠', '♥', '♦', '♣'];
const RANKS: CardRank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

export function createStandardDeck(): PokerCard[] {
  return SUITS.flatMap((suit) =>
    RANKS.map((rank, idx) => ({
      suit,
      rank,
      value: idx + 2,
      code: `${rank}${suit}`,
    })),
  );
}

function nextSeed(seed: number): number {
  return (seed * 1_664_525 + 1_013_904_223) >>> 0;
}

export function shuffleDeck(deck: PokerCard[], seed: number): { deck: PokerCard[]; seed: number } {
  const out = [...deck];
  let runningSeed = seed >>> 0;

  for (let i = out.length - 1; i > 0; i--) {
    runningSeed = nextSeed(runningSeed);
    const j = runningSeed % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }

  return { deck: out, seed: runningSeed };
}

export function drawCards(deck: PokerCard[], count: number): { drawn: PokerCard[]; deck: PokerCard[] } {
  if (count < 0 || count > deck.length) {
    throw new Error(`Nevalidan broj karata za draw: ${count}`);
  }
  return {
    drawn: deck.slice(0, count),
    deck: deck.slice(count),
  };
}
