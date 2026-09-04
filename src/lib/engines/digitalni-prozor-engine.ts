/**
 * 🪟 Digitalni Prozor Engine — Engine Wrapper
 *
 * Wraps: digitalni-prozor.ts
 */

import { registerEngine } from '../engine-registry';

registerEngine({
  id: 'engine-digitalni-prozor',
  naziv: 'Digitalni Prozor Engine',
  opis: 'Digitalni prozor engine — widget i dashboard prikazi za sve platforme u jednom prozoru sa real-time ažuriranjem',
  ikona: '🪟',
  tip: 'core',
  status: 'aktivan',
  verzija: '2.0.0',
  optimizacija: 100,
  izvor: 'Digitalni Prozor modul',
  izvoriFajlovi: ['src/lib/digitalni-prozor.ts'],
  registrovanDatum: '2025-01-15',
  tagovi: ['prozor', 'widget', 'dashboard', 'real-time'],
});
