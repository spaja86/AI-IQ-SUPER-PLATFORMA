import { buildPadezSekvence } from './padezi-shared';

export const nominativSekvence = buildPadezSekvence('nominativ', {
  podnaslov: 'Polazna tačka za razumevanje padežnog sistema',
  opis:
    'Nominativ je osnovni padež za imenovanje subjekta i početni ulaz u PADEŽI paket. Modul zadržava isti edukativni i navigacioni obrazac kao ostali padeži.',
  fokus: [
    'prepoznavanje subjekta u rečenici',
    'osnovni oblik imenice i slaganje sa glagolom',
    'razlika između imenovanja i objekta radnje',
  ],
  primeri: ['„Učenik čita.”', '„Planina je visoka.”', '„Ana govori.”'],
});
