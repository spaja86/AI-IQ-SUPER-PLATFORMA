/**
 * 🧾 Generator Računa Engine — Engine Wrapper
 *
 * Wraps: generator-za-poslovne-racune.ts, validator-poslovnih-racuna.ts
 */

import { registerEngine } from '../engine-registry';

registerEngine({
  id: 'engine-generator-racuna',
  naziv: 'Generator & Validator Poslovnih Računa Engine',
  opis: 'Engine za generisanje i validaciju poslovnih računa — PDF generisanje, fakture, validacija poreskih podataka, PIB/MB verifikacija',
  ikona: '🧾',
  tip: 'finansije',
  status: 'aktivan',
  verzija: '2.0.0',
  optimizacija: 100,
  izvor: 'Generator i Validator poslovnih računa moduli',
  izvoriFajlovi: [
    'src/lib/generator-za-poslovne-racune.ts',
    'src/lib/validator-poslovnih-racuna.ts',
  ],
  registrovanDatum: '2025-01-15',
  tagovi: ['racun', 'faktura', 'generator', 'validator', 'pdf'],
});
