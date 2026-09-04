/**
 * ⚠️ Digitalna Industrija Rizici Engine — Engine Wrapper
 *
 * Wraps: sve digitalna-industrija-*-rizik.ts fajlove (15+ rizik modula)
 */

import { registerEngine } from '../engine-registry';

registerEngine({
  id: 'engine-digitalna-industrija-rizici',
  naziv: 'Digitalna Industrija — Finansijski Rizici Engine',
  opis: 'Sveobuhvatan engine za sve finansijske rizike digitalne industrije: valutni, kreditni, kamatni, likvidnosni, operativni, sajber, ESG, strateški, pravni, reputacioni, poreski, kapitalni, regulatorni, hedzing i diskriminacija',
  ikona: '⚠️',
  tip: 'finansije',
  status: 'aktivan',
  verzija: '3.0.0',
  optimizacija: 100,
  izvor: 'Digitalna Industrija Rizici moduli',
  izvoriFajlovi: [
    'src/lib/digitalna-industrija-valutni-rizik.ts',
    'src/lib/digitalna-industrija-kreditni-rizik.ts',
    'src/lib/digitalna-industrija-kamatni-rizik.ts',
    'src/lib/digitalna-industrija-likvidnosni-rizik.ts',
    'src/lib/digitalna-industrija-operativni-rizik.ts',
    'src/lib/digitalna-industrija-sajber-rizik.ts',
    'src/lib/digitalna-industrija-esg-rizik.ts',
    'src/lib/digitalna-industrija-strateski-rizik.ts',
    'src/lib/digitalna-industrija-pravni-rizik.ts',
    'src/lib/digitalna-industrija-reputacioni-rizik.ts',
    'src/lib/digitalna-industrija-poreski-rizik.ts',
    'src/lib/digitalna-industrija-kapitalni-rizik.ts',
    'src/lib/digitalna-industrija-regulatorni-rokovi.ts',
    'src/lib/digitalna-industrija-hedzing.ts',
    'src/lib/digitalna-industrija-diskriminacija.ts',
    'src/lib/digitalna-industrija-compliance-rizik.ts',
  ],
  registrovanDatum: '2025-01-15',
  tagovi: ['rizici', 'finansije', 'compliance', 'sajber', 'ESG'],
});
