/**
 * 🔤 SpajaPro Prompt Engine — Engine Wrapper
 *
 * Wraps: spaja-pro-prompt-engine.ts
 */

import { registerEngine } from '../engine-registry';

registerEngine({
  id: 'engine-spajapro-prompt',
  naziv: 'SpajaPro Prompt Engine',
  opis: 'Centralni prompt processing engine — obrada, formatiranje, pretraga ekosistema, persona i platforma integracije',
  ikona: '🔤',
  tip: 'ai',
  status: 'aktivan',
  verzija: '15.0.0',
  optimizacija: 100,
  izvor: 'SpajaPro Prompt Engine modul',
  izvoriFajlovi: ['src/lib/spaja-pro-prompt-engine.ts'],
  registrovanDatum: '2025-01-15',
  tagovi: ['prompt', 'spajapro', 'ai', 'ekosistem', 'persona'],
});
