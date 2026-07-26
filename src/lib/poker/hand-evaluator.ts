import type { EvaluatedPokerHand, PokerCard } from './types';

function sortValuesDescending(values: number[]): number[] {
  return [...values].sort((a, b) => b - a);
}

function getStraightHigh(values: number[]): number | null {
  const unique = [...new Set(values)].sort((a, b) => b - a);
  const normalized = unique.includes(14) ? [...unique, 1] : unique; // wheel A-2-3-4-5

  let streak = 1;
  for (let i = 0; i < normalized.length - 1; i++) {
    if (normalized[i] - 1 === normalized[i + 1]) {
      streak += 1;
      if (streak >= 5) {
        return normalized[i - 3];
      }
    } else {
      streak = 1;
    }
  }

  return null;
}

function formatLabel(rank: string): string {
  return rank
    .split('-')
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');
}

export function evaluateFiveCardHand(cards: PokerCard[]): EvaluatedPokerHand {
  if (cards.length !== 5) {
    throw new Error(`evaluateFiveCardHand očekuje 5 karata, dobio ${cards.length}`);
  }

  const values = cards.map((c) => c.value);
  const suits = cards.map((c) => c.suit);
  const sortedValues = sortValuesDescending(values);
  const freq = new Map<number, number>();
  for (const v of values) freq.set(v, (freq.get(v) ?? 0) + 1);

  const counts = [...freq.entries()].sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    return b[0] - a[0];
  });

  const isFlush = suits.every((s) => s === suits[0]);
  const straightHigh = getStraightHigh(values);
  const isStraight = straightHigh !== null;

  if (isFlush && isStraight) {
    return {
      rank: 'straight-flush',
      rankValue: 8,
      kickers: [straightHigh],
      label: formatLabel('straight-flush'),
    };
  }

  if (counts[0][1] === 4) {
    const quad = counts[0][0];
    const kicker = counts[1][0];
    return {
      rank: 'four-of-kind',
      rankValue: 7,
      kickers: [quad, kicker],
      label: formatLabel('four-of-kind'),
    };
  }

  if (counts[0][1] === 3 && counts[1][1] === 2) {
    return {
      rank: 'full-house',
      rankValue: 6,
      kickers: [counts[0][0], counts[1][0]],
      label: formatLabel('full-house'),
    };
  }

  if (isFlush) {
    return {
      rank: 'flush',
      rankValue: 5,
      kickers: sortedValues,
      label: formatLabel('flush'),
    };
  }

  if (isStraight) {
    return {
      rank: 'straight',
      rankValue: 4,
      kickers: [straightHigh],
      label: formatLabel('straight'),
    };
  }

  if (counts[0][1] === 3) {
    const trips = counts[0][0];
    const kickers = counts.slice(1).map((c) => c[0]).sort((a, b) => b - a);
    return {
      rank: 'three-of-kind',
      rankValue: 3,
      kickers: [trips, ...kickers],
      label: formatLabel('three-of-kind'),
    };
  }

  if (counts[0][1] === 2 && counts[1][1] === 2) {
    const highPair = Math.max(counts[0][0], counts[1][0]);
    const lowPair = Math.min(counts[0][0], counts[1][0]);
    const kicker = counts[2][0];
    return {
      rank: 'two-pair',
      rankValue: 2,
      kickers: [highPair, lowPair, kicker],
      label: formatLabel('two-pair'),
    };
  }

  if (counts[0][1] === 2) {
    const pair = counts[0][0];
    const kickers = counts.slice(1).map((c) => c[0]).sort((a, b) => b - a);
    return {
      rank: 'pair',
      rankValue: 1,
      kickers: [pair, ...kickers],
      label: formatLabel('pair'),
    };
  }

  return {
    rank: 'high-card',
    rankValue: 0,
    kickers: sortedValues,
    label: formatLabel('high-card'),
  };
}

export function compareHands(a: EvaluatedPokerHand, b: EvaluatedPokerHand): number {
  if (a.rankValue !== b.rankValue) return a.rankValue - b.rankValue;
  const maxLen = Math.max(a.kickers.length, b.kickers.length);
  for (let i = 0; i < maxLen; i++) {
    const av = a.kickers[i] ?? 0;
    const bv = b.kickers[i] ?? 0;
    if (av !== bv) return av - bv;
  }
  return 0;
}

export function evaluateBestHand(cards: PokerCard[]): EvaluatedPokerHand {
  if (cards.length < 5) {
    throw new Error(`evaluateBestHand očekuje min 5 karata, dobio ${cards.length}`);
  }

  let best: EvaluatedPokerHand | null = null;

  // Brute-force 5-of-N je ovde namerno: proverava sve 5-card kombinacije iz ulaza.
  // Za standardni Texas Hold'em ulaz (2 hole + 5 community = 7 karata),
  // to je C(7,5)=21 kombinacija, pa je složenost praktično mala i stabilna.
  for (let a = 0; a < cards.length - 4; a++) {
    for (let b = a + 1; b < cards.length - 3; b++) {
      for (let c = b + 1; c < cards.length - 2; c++) {
        for (let d = c + 1; d < cards.length - 1; d++) {
          for (let e = d + 1; e < cards.length; e++) {
            const evaluated = evaluateFiveCardHand([cards[a], cards[b], cards[c], cards[d], cards[e]]);
            if (!best || compareHands(evaluated, best) > 0) {
              best = evaluated;
            }
          }
        }
      }
    }
  }

  if (!best) {
    throw new Error('Nije moguće evaluirati ruku.');
  }

  return best;
}
