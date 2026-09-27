import { buildPadezSekvence } from './padezi-shared';

export const genitivSekvence = buildPadezSekvence('genitiv', {
  podnaslov: 'Pripadnost, odsustvo i količinski odnosi',
  opis:
    'Genitiv pokriva odnose pripadnosti, količine i negacije i ostaje povezana etapa u okviru objedinjene PADEŽI navigacije.',
  fokus: [
    'izražavanje pripadnosti i porekla',
    'količina, deo celine i negacija',
    'predloški obrasci bez novog runtime sloja',
  ],
  primeri: ['„Nema vode.”', '„Vrata škole su otvorena.”', '„Čaša soka stoji na stolu.”'],
});
