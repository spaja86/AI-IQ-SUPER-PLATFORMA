/**
 * 🃏 Poker Engine — Engine Wrapper
 *
 * Wraps: src/lib/poker/ folder (engine.ts, hand-evaluator.ts, deck.ts, anti-cheat.ts, types.ts)
 */

import { registerEngine } from '../engine-registry';

registerEngine({
  id: 'engine-poker',
  naziv: 'Poker Master Engine',
  opis: 'Kompletni poker engine — deck management, hand evaluator, anti-cheat sistem, poker session management za Master Poker Game',
  ikona: '🃏',
  tip: 'gaming',
  status: 'aktivan',
  verzija: '2.0.0',
  optimizacija: 100,
  izvor: 'Poker modul (src/lib/poker/)',
  izvoriFajlovi: [
    'src/lib/poker/engine.ts',
    'src/lib/poker/hand-evaluator.ts',
    'src/lib/poker/deck.ts',
    'src/lib/poker/anti-cheat.ts',
    'src/lib/poker/types.ts',
  ],
  registrovanDatum: '2025-01-15',
  tagovi: ['poker', 'gaming', 'kartice', 'hand-evaluator', 'anti-cheat'],
});
