/**
 * 📜 Licencni Engine — Engine Wrapper
 *
 * Wraps: issuer-licensing.ts, licencni-budzet-srbija.ts,
 *        eksterni-partneri-licencni-program.ts, aiiq-world-bank-licencni-registar.ts
 */

import { registerEngine } from '../engine-registry';

registerEngine({
  id: 'engine-licencni',
  naziv: 'Licencni Program Engine',
  opis: 'Sveobuhvatan licencni engine — issuer licenciranje, budžet za Srbiju, eksterni partneri licencni program, AI IQ World Bank licencni registar',
  ikona: '📜',
  tip: 'bezbednost',
  status: 'aktivan',
  verzija: '2.0.0',
  optimizacija: 100,
  izvor: 'Licencni programski moduli',
  izvoriFajlovi: [
    'src/lib/issuer-licensing.ts',
    'src/lib/licencni-budzet-srbija.ts',
    'src/lib/eksterni-partneri-licencni-program.ts',
    'src/lib/aiiq-world-bank-licencni-registar.ts',
  ],
  registrovanDatum: '2025-01-15',
  tagovi: ['licenca', 'issuer', 'budzet', 'srbija', 'partneri'],
});
