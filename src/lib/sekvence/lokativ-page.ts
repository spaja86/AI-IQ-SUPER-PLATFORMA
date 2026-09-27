import { buildPadezSekvence } from './padezi-shared';

export const lokativSekvence = buildPadezSekvence('lokativ', {
  podnaslov: 'Mesto, tema i predloški odnosi',
  opis:
    'Lokativ zatvara kanonski niz PADEŽI modula i služi za izražavanje mesta, teme i zavisnosti od predloga bez promene postojećeg routing obrasca.',
  fokus: [
    'odgovor na pitanja o kome? o čemu? gde?',
    'upotreba sa predlozima u, na, o, po i pri',
    'razlika između lokativa i akuzativa kod kretanja i mirovanja',
  ],
  primeri: ['„Pričamo o projektu.”', '„Knjiga je na stolu.”', '„Nalazimo se u gradu.”'],
});
