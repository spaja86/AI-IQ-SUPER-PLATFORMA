/**
 * 🧪 Ekslatacija Engine — Engine Wrapper
 *
 * Wraps: ekslatacija-proizvoda.ts, eksponat-glavnog-jezgra.ts
 */

import { registerEngine } from '../engine-registry';

registerEngine({
  id: 'engine-ekslatacija',
  naziv: 'Ekslatacija Proizvoda & Eksponat Jezgra Engine',
  opis: 'Ekslatacioni engine — ekslatacija proizvoda i eksponat glavnog jezgra za prezentaciju svih platformskih entiteta',
  ikona: '🧪',
  tip: 'core',
  status: 'aktivan',
  verzija: '2.0.0',
  optimizacija: 100,
  izvor: 'Ekslatacija Proizvoda i Eksponat Jezgra moduli',
  izvoriFajlovi: [
    'src/lib/ekslatacija-proizvoda.ts',
    'src/lib/eksponat-glavnog-jezgra.ts',
  ],
  registrovanDatum: '2025-01-15',
  tagovi: ['ekslatacija', 'eksponat', 'jezgro', 'prezentacija'],
});
