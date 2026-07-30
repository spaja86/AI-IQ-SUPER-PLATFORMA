/**
 * 🏦 AI IQ World Bank Engine — Engine Wrapper
 *
 * Wraps: ai-iq-world-bank.ts, ai-iq-world-bank-procesiranje.ts,
 *        aiiq-world-bank-licencni-registar.ts
 */

import { registerEngine } from '../engine-registry';

registerEngine({
  id: 'engine-ai-iq-world-bank',
  naziv: 'AI IQ World Bank Engine',
  opis: 'Globalna AI bankarska platforma — obrada transakcija, licencni registar, procesiranje plaćanja i World Bank integrations',
  ikona: '🏦',
  tip: 'finansije',
  status: 'aktivan',
  verzija: '3.0.0',
  optimizacija: 100,
  izvor: 'AI IQ World Bank modul',
  izvoriFajlovi: [
    'src/lib/ai-iq-world-bank.ts',
    'src/lib/ai-iq-world-bank-procesiranje.ts',
    'src/lib/aiiq-world-bank-licencni-registar.ts',
  ],
  registrovanDatum: '2025-01-15',
  tagovi: ['world-bank', 'finansije', 'licencni', 'procesiranje'],
});
