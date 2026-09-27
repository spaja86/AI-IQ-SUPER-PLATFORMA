import { buildPadezSekvence } from './padezi-shared';

export const dativSekvence = buildPadezSekvence('dativ', {
  podnaslov: 'Primaoc radnje i usmerenost',
  opis:
    'Dativ dopunjuje padežni niz kroz usmerenost ka primaocu, nameni ili cilju radnje i koristi isti pregledni obrazac kao ostali moduli.',
  fokus: [
    'odgovor na pitanje kome? čemu?',
    'primaoc radnje, namena i korist',
    'veza sa glagolima davanja, obraćanja i približavanja',
  ],
  primeri: ['„Dajem knjigu sestri.”', '„Pomažem drugu.”', '„Približavam se cilju.”'],
});
