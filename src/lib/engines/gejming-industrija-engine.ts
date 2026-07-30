/**
 * 🎮 Gejming Industrija Engine — Engine Wrapper
 *
 * Wraps: gejming-industrija.ts, gejming-likovi.ts
 */

import { registerEngine } from '../engine-registry';

registerEngine({
  id: 'engine-gejming-industrija',
  naziv: 'Gejming Industrija Engine',
  opis: 'Gaming industrija engine — životni ciklus igara, gejming likovi, industrija statistike, kategorije i platforme',
  ikona: '🎮',
  tip: 'gaming',
  status: 'aktivan',
  verzija: '2.0.0',
  optimizacija: 100,
  izvor: 'Gejming Industrija i Gejming Likovi moduli',
  izvoriFajlovi: [
    'src/lib/gejming-industrija.ts',
    'src/lib/gejming-likovi.ts',
  ],
  registrovanDatum: '2025-01-15',
  tagovi: ['gaming', 'industrija', 'likovi', 'kategorije'],
});
