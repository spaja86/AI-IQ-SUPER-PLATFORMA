import { buildPadezSekvence } from './padezi-shared';

export const instrumentalSekvence = buildPadezSekvence('instrumental', {
  podnaslov: 'Sredstvo, način vršenja radnje i pratnja',
  opis:
    'Instrumental proširuje PADEŽI paket kroz izražavanje sredstva, društva i načina. Modul ostaje deo istog additive-only edukativnog obrasca.',
  fokus: [
    'odgovor na pitanja čime? kim(e)?',
    'izražavanje sredstva i oruđa radnje',
    'upotreba uz predloge sa, među, nad, pod i slične obrasce',
  ],
  primeri: ['„Pišem olovkom.”', '„Idem sa drugom.”', '„Putujemo vozom.”'],
});
