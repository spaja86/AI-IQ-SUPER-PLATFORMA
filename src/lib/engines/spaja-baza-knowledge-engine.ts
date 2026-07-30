/**
 * 📚 Spaja Baza Knowledge Engine — Engine Wrapper
 *
 * Wraps: spaja-baza-knowledge.ts
 */

import { registerEngine } from '../engine-registry';

registerEngine({
  id: 'engine-spaja-baza-knowledge',
  naziv: 'Spaja Baza Knowledge Engine',
  opis: 'Knowledge base engine — beskonačna SPAJA baza znanja sa kategorijama, pretragom i knowledge graph integracijom',
  ikona: '📚',
  tip: 'ai',
  status: 'aktivan',
  verzija: '2.0.0',
  optimizacija: 100,
  izvor: 'Spaja Baza Knowledge modul',
  izvoriFajlovi: ['src/lib/spaja-baza-knowledge.ts'],
  registrovanDatum: '2025-01-15',
  tagovi: ['knowledge', 'baza', 'pretraga', 'beskonacno', 'ai'],
});
