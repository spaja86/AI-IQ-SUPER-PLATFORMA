/**
 * 🌐 Sve od Svega Engine — Engine Wrapper
 *
 * Wraps: sve-od-svega.ts, sve-od-svega-alert.ts, sve-od-svega-store.ts
 */

import { registerEngine } from '../engine-registry';

registerEngine({
  id: 'engine-sve-od-svega',
  naziv: 'Sve od Svega Engine',
  opis: 'Globalni aggregator engine — sabira podatke sa svih modula platforme, alert sistem i store za sve entitete',
  ikona: '🌐',
  tip: 'core',
  status: 'aktivan',
  verzija: '2.0.0',
  optimizacija: 100,
  izvor: 'Sve od Svega moduli',
  izvoriFajlovi: [
    'src/lib/sve-od-svega.ts',
    'src/lib/sve-od-svega-alert.ts',
    'src/lib/sve-od-svega-store.ts',
  ],
  registrovanDatum: '2025-01-15',
  tagovi: ['aggregator', 'global', 'alert', 'store'],
});
