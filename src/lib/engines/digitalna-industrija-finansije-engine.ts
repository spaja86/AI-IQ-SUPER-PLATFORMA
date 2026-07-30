/**
 * 💰 Digitalna Industrija Finansije Engine — Engine Wrapper
 *
 * Wraps: devizni moduli, kursne liste, plate, pozicije, beneficije,
 *        načini plaćanja, nagrade, PIB/MB, šifra delatnosti, izvoz faktura,
 *        licencni portfolio
 */

import { registerEngine } from '../engine-registry';

registerEngine({
  id: 'engine-digitalna-industrija-finansije',
  naziv: 'Digitalna Industrija — Finansije Engine',
  opis: 'Kompletan finansijski engine digitalne industrije: devizni saldo, kursna lista, kursne razlike, inflacije, plate, pozicije, beneficije, načini plaćanja, nagrade, PIB/MB, šifra delatnosti, licencni portfolio, izvoz faktura',
  ikona: '💰',
  tip: 'finansije',
  status: 'aktivan',
  verzija: '3.0.0',
  optimizacija: 100,
  izvor: 'Digitalna Industrija Finansije moduli',
  izvoriFajlovi: [
    'src/lib/digitalna-industrija-devizni-saldo.ts',
    'src/lib/digitalna-industrija-devizni-odlivi.ts',
    'src/lib/digitalna-industrija-devizni-prilivi.ts',
    'src/lib/digitalna-industrija-kursna-lista.ts',
    'src/lib/digitalna-industrija-kursne-razlike.ts',
    'src/lib/digitalna-industrija-inflacije.ts',
    'src/lib/digitalna-industrija-plate.ts',
    'src/lib/digitalna-industrija-pozicije.ts',
    'src/lib/digitalna-industrija-beneficije.ts',
    'src/lib/digitalna-industrija-nacini-placanja.ts',
    'src/lib/digitalna-industrija-nagrade.ts',
    'src/lib/digitalna-industrija-pib-mb.ts',
    'src/lib/digitalna-industrija-sifra-delatnosti.ts',
    'src/lib/digitalna-industrija-licencni-portfolio.ts',
    'src/lib/digitalna-industrija-izvoz-faktura.ts',
  ],
  registrovanDatum: '2025-01-15',
  tagovi: ['devizni', 'kursna-lista', 'plate', 'finansije', 'digitalna-industrija'],
});
