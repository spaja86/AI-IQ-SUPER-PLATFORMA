/**
 * 🔬 Analiza Svega Engine — Engine Wrapper
 *
 * Wraps: analiza-svega.ts, analiza-svega-alert.ts,
 *        analiza-svega-export.ts, analiza-svega-store.ts
 */

import { registerEngine } from '../engine-registry';

registerEngine({
  id: 'engine-analiza-svega',
  naziv: 'Analiza Svega Engine',
  opis: 'Kompletni analitički engine — agregira, analizira i eksportuje podatke sa sve platforme sa alert sistemom',
  ikona: '🔬',
  tip: 'ai',
  status: 'aktivan',
  verzija: '2.0.0',
  optimizacija: 100,
  izvor: 'Analiza Svega modul',
  izvoriFajlovi: [
    'src/lib/analiza-svega.ts',
    'src/lib/analiza-svega-alert.ts',
    'src/lib/analiza-svega-export.ts',
    'src/lib/analiza-svega-store.ts',
  ],
  registrovanDatum: '2025-01-15',
  tagovi: ['analitika', 'alert', 'export', 'ai'],
});
