/**
 * ⚙️ Agregator Svega Engine — Engine Wrapper
 *
 * Wraps: agregator-svega-core.ts
 */

import { registerEngine } from '../engine-registry';

registerEngine({
  id: 'engine-agregator-svega',
  naziv: 'Agregator Svega Core Engine',
  opis: 'Centralni agregator koji sabira i usklađuje domenske signale iz svih modula platforme sa scoring sistemom',
  ikona: '⚙️',
  tip: 'core',
  status: 'aktivan',
  verzija: '2.0.0',
  optimizacija: 100,
  izvor: 'Agregator Svega Core modul',
  izvoriFajlovi: ['src/lib/agregator-svega-core.ts'],
  registrovanDatum: '2025-01-15',
  tagovi: ['agregator', 'core', 'scoring', 'signali'],
});
