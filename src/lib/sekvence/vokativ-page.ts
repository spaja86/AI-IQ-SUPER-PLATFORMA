import { buildPadezSekvence } from './padezi-shared';

export const vokativSekvence = buildPadezSekvence('vokativ', {
  podnaslov: 'Obraćanje, dozivanje i tonsko isticanje sagovornika',
  opis:
    'Vokativ dopunjuje padežni niz kroz direktno obraćanje osobi ili pojmu. U okviru PADEŽI paketa ostaje povezan sa istim navigacionim i edukativnim obrascem kao ostali moduli.',
  fokus: [
    'dozivanje i neposredno obraćanje',
    'razlika između nominativa i vokativa u svakodnevnom jeziku',
    'stil i intonacija kada se ime ili uloga izdvajaju u govoru',
  ],
  primeri: ['„Marija, dođi ovamo!”', '„Prijatelju, hvala na pomoći.”', '„Profesore, imam pitanje.”'],
});
